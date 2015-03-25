name := """domainly"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.1"

libraryDependencies ++= Seq(
  jdbc,
  cache,
  ws,
  "com.typesafe.slick" %% "slick" % "2.1.0",
  "com.typesafe.play" %% "play-slick" % "0.8.1",
  "org.postgresql" % "postgresql" % "9.4-1201-jdbc41",
  "com.github.tminglei" %% "slick-pg" % "0.8.2",
  "org.ccil.cowan.tagsoup" % "tagsoup" % "1.2.1",
  // web jars
  "org.webjars" % "requirejs" % "2.1.16",
  "org.webjars" % "jquery" % "2.1.3",
  "org.webjars" % "es5-shim" % "4.0.6",
  "org.webjars" % "html5shiv" % "3.7.2",
  "org.webjars" % "react" % "0.13.0",
  "org.webjars" % "flux" % "2.0.2",
  "org.webjars" % "EventEmitter" % "4.2.7-1",
  "org.webjars" % "immutable" % "3.4.0",
  "org.webjars" % "d3js" % "3.5.3"
)

RjsKeys.webJarCdns := Map.empty

// Apply RequireJS optimization, digest calculation and gzip compression to assets
pipelineStages := Seq(rjs, digest, gzip)

herokuAppName in Compile := "afternoon-bayou-3709"
