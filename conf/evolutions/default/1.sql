# --- Created by Slick DDL
# To stop Slick DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table "crawler_result" ("id" BIGSERIAL NOT NULL PRIMARY KEY,"start_time" TIMESTAMP NOT NULL,"url" varchar(1023) NOT NULL,"search_depth" INTEGER NOT NULL,"error" VARCHAR(254),"page_ids" int8 ARRAY NOT NULL);
create table "page_scan_result" ("id" BIGSERIAL NOT NULL PRIMARY KEY,"url" VARCHAR(254) NOT NULL,"links" text ARRAY NOT NULL);

# --- !Downs

drop table "page_scan_result";
drop table "crawler_result";

