package controllers

import java.sql.Timestamp
import java.net.URL

import scala.concurrent.Future

import crawler.Crawler
import models._
import play.api.db.slick.DBAction
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.api.libs.json.Json._
import play.api.mvc._

//TODO: move to different package
case class CrawlerRequest(url: String, depth: Int)
case class Page(url: URL, links: List[URL])
case class CrawlerScanResult(time: Timestamp, url: String, depth: Int, error: Option[String], pages: List[Page])

object ApiController extends Controller {

  implicit val formatTimestamp = new Format[Timestamp] {
    def writes(ts: Timestamp): JsValue = JsNumber(ts.getTime)
    def reads(ts: JsValue): JsResult[Timestamp] = {
      try {
        JsSuccess(new Timestamp(ts.as[Long]))
      } catch {
        case e: JsResultException => JsError("Unable to parse timestamp")
      }
    }
  }

  implicit val formatUrl = new Format[URL] {
    def writes(url: URL): JsValue = JsString(url.toString)
    def reads(url: JsValue): JsResult[URL] = {
      try {
        JsSuccess(new URL(url.as[String]))
      } catch {
        case e: JsResultException => JsError("Unable to parse url")
      }
    }
  }

  implicit val formatPage = Json.format[Page]
  implicit val formatResult = Json.format[CrawlerScanResult]

  implicit val readRequest: Reads[CrawlerRequest] = (
    (JsPath \ "url").read[String] and
    (JsPath \ "depth").read[Int]
  )(CrawlerRequest.apply _)

  def allSearches = DBAction { implicit rs =>
    implicit val session = rs.dbSession

    Ok(toJson(CrawlerResults.list.map {
      case (result, pages) =>
        val urlPages = pages.map(p => Page(p.url, p.links))
        CrawlerScanResult(result.startTime, result.url, result.searchDepth, result.error, urlPages)
    }))
  }

  def scan = Action.async(parse.json) { implicit rs =>
    rs.body.validate[CrawlerRequest].fold(
      errors => {
        Future.successful {
          BadRequest(Json.obj("error" -> JsError.toFlatJson(errors)))
        }
      },
      request => { 
        for (result <- Crawler.scan(request.url, request.depth))
          yield Ok(toJson(result))  
      }
    )
  }

}