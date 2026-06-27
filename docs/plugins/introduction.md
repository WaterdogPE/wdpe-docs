---
title: Introduction
---

# Introduction

'### Maven Project Setup

Create a new maven project in IDE of your choice. We recommend you to use Jetbrains IDE for Java i.e. Intellij IDEA. It comes in two versions that are free and paid.

Open your `pom.xml` file and add the repository in the pom.xml so it can fetch the WaterdogPE Plugin API dependencies
```
<repository>
	<id>waterdog-repo</id>
    	<url>https://repo.waterdog.dev/artifactory/main</url>
</repository>
```

Add the dependency for WaterdogPE plugin API
```
<dependency>
 	<groupId>dev.waterdog.waterdogpe</groupId>
 	<artifactId>waterdog</artifactId>
 	<version>1.2.3-SNAPSHOT</version>
 	<scope>provided</scope>
 </dependency>
```

Add the following build code to allow the plugin.yml and other config files being included in the jar:
```
<build>
	<resources>
		<resource>
			<directory>src/main/resources</directory>
			<filtering>true</filtering>
		</resource>
	</resources>
</build>
```'
