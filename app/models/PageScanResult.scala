package models

import java.net.URL

import driver.PostgresDriver.simple._

case class PageScanResult(id: Option[Long] = None, url: URL, links: List[URL])

class PageScanResults(tag: Tag) extends Table[PageScanResult](tag, "page_scan_result") {
  implicit val urlColumnType = MappedColumnType.base[URL, String](
    url => url.toString,
    url => new URL(url)
  )
  implicit val urlListColumnType = MappedColumnType.base[List[URL], List[String]](
    urls => urls.map(_.toString),
    urls => urls.map(new URL(_))
  )

  def id = column[Long]("id", O.AutoInc, O.PrimaryKey)
  def url = column[URL]("url")
  def links = column[List[URL]]("links")
  
  def * = (id.?, url, links) <> (PageScanResult.tupled, PageScanResult.unapply)
}

object PageScanResults {
  val scanResults = TableQuery[PageScanResults]

  def save(results: Seq[PageScanResult])(implicit s: Session): Seq[Long] = {
    (scanResults returning scanResults.map(_.id)) ++= results
  }

  def find(ids: Seq[Long])(implicit s: Session): List[PageScanResult] = {
    val results = for {
      r <- scanResults
      if r.id inSetBind ids
    } yield r
    results.list
  }
}