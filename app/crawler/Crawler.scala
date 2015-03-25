package crawler

import scala.concurrent.Future
import scala.xml.parsing.NoBindingFactoryAdapter
import scala.xml.Node
import models._
import driver.PostgresDriver.simple._
import play.api.db.slick.DB
import play.api.Play.current
import play.api.http._
import play.api.http.Status._
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.ws._
import play.api.libs.iteratee._
import org.ccil.cowan.tagsoup.jaxp.SAXFactoryImpl
import org.xml.sax.InputSource
import java.io._
import java.sql.Timestamp
import java.util.Date
import java.net._
// I really shouldn't import it here
import controllers.{CrawlerScanResult, Page}

object HTML {

  lazy val adapter = new NoBindingFactoryAdapter()
  lazy val parser = (new SAXFactoryImpl).newSAXParser

  def parse(data: Array[Byte]): Node = {
	  val stream = new ByteArrayInputStream(data)
	  val source = new InputSource(stream)
	  return adapter.loadXML(source, parser) 
  }
}

object Crawler {

  def get(url: String): Future[Option[Enumerator[Array[Byte]]]] = {
    WS.url(url).getStream().map {
      case (response, body) =>
        response.status match {
          case OK => for {
            contentType <- response.headers.get(HeaderNames.CONTENT_TYPE).map(_.head)
            mediaType <- MediaType.parse.apply(contentType)
            if (mediaType.mediaType == "text" && mediaType.mediaSubType == "html")
          } yield body
          case _ => None
        }
    } recover {
      case _ => None
    }
  }

  def parse(content: Enumerator[Array[Byte]]): Future[Node] = {
    val out = new ByteArrayOutputStream

    val iteratee = Iteratee.foreach[Array[Byte]] { bytes =>
      out.write(bytes)
    }

    (content |>> iteratee) andThen {
      case result =>
        out.close()
        // Get the result or rethrow the error
        result.get
    } map { _ => HTML.parse(out.toByteArray) }
  }

  def extractLinks(html: Node): Seq[String] = {
    val links = for {
      a <- html \\ "a"
    } yield a.attribute("href")

    links.map { link =>
      link.map(_.head.text).getOrElse("")
    }.filter(!_.isEmpty)
  }

  def saveResult(startTime: Timestamp, url: String, depth: Int, pageScanResults: List[PageScanResult]): CrawlerScanResult = {
    DB.withSession { implicit session =>
      val ids = PageScanResults.save(pageScanResults)
 
      val crawlerResult = CrawlerResult(startTime = startTime, url = url, searchDepth = depth, pages = ids.toList)

      CrawlerResults.save(crawlerResult)

      CrawlerScanResult(startTime, url, depth, None, pageScanResults.map(page => Page(page.url, page.links)))
    }
  }

  def scan(links: List[(Int, URL)], result: List[PageScanResult]): Future[List[PageScanResult]] = {
    if (links.isEmpty)
      return Future.successful(result)

    val (depth, seed) = links.head
 
    get(seed.toString) flatMap { content => 
      content map { data =>
        parse(data) map extractLinks map { links =>
          links map { link =>
            try {
              Some(new URL(seed, link))
            } catch {
              case _: MalformedURLException => None
            }
          } filter (!_.isEmpty) map (_.get) filter { link =>
            link.getProtocol == "http" || link.getProtocol == "https"
          } map((depth - 1, _))
        } recover {
          case _ => Nil
        }
      } getOrElse {
        Future.successful(Nil)
      }
    } flatMap { urls =>
      val newResult = result :+ PageScanResult(url = seed, links = urls.map(_._2).toList)
      val newLinks = if (depth > 0) links.tail ++ urls else links.tail

      scan(newLinks, newResult)
    }
  }

  def now = new Timestamp((new Date).getTime)
 
  def scan(url: String, depth: Int): Future[CrawlerScanResult] = {
    val startTime = now
    val initialSeed = (depth, new URL(url)) :: Nil
    scan(initialSeed, Nil) map { pages => 
      if (pages.isEmpty)
        CrawlerScanResult(startTime, url, depth, Some("No HTML was found at url"), Nil)
      else
        saveResult(startTime, url, depth, pages)
    }
  }

}