package models

import java.sql.Timestamp

import driver.PostgresDriver.simple._

case class CrawlerResult(id: Option[Long] = None, startTime: Timestamp, url: String, searchDepth: Int, error: Option[String] = None, pages: List[Long])

class CrawlerResults(tag: Tag) extends Table[CrawlerResult](tag, "crawler_result") {
  def id = column[Long]("id", O.AutoInc, O.PrimaryKey)
  def startTime = column[Timestamp]("start_time")
  def url = column[String]("url", O.DBType("varchar(1023)"))
  def searchDepth = column[Int]("search_depth")
  def error = column[Option[String]]("error")
  def pages = column[List[Long]]("page_ids")
  
  def * = (id.?, startTime, url, searchDepth, error, pages) <> (CrawlerResult.tupled, CrawlerResult.unapply)
}

object CrawlerResults {
  val crawlerResults = TableQuery[CrawlerResults]

  def list(implicit s: Session) = {
    crawlerResults.list map { result =>
      val pages = PageScanResults.find(result.pages)
      (result, pages)
    }
  }

  def save(result: CrawlerResult)(implicit s: Session): Long = {
    (crawlerResults returning crawlerResults.map(_.id)) += result
  }
}