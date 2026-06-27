---
title: StarGate Modules
---

# StarGate Modules

'StarGate project is based and uses Maven for building and compiling. Everything is compiled using Java 8 and is compatible with newer Java versions.  
Project is split to several modules by its usage:
- `common` module contains default packet implementation, packet handlers. You should add this module to your dependencies.
- `server` module is default implementation of server based on StarGate protocol. This module should be included in your dependencies when working with server side implementations.
- `waterdogpe` module is server implementation based on `server` module for WaterdogPE proxy. You should include it as dependency in your plugin.
- `bungeecord` module is server implementation based on `server` module for Bungeecord/Waterdog proxy. You should include it as dependency in your plugin.

### Repository Server
StarGate is published on Waterdog repository server. You can add it to your `repositories` list like this:
```xml
<repository>
  <id>waterdog-repo</id>
  <url>https://repo.waterdog.dev/artifactory/main</url>
</repository>
```
### Dependencies
Include StarGate dependency to your maven project like this:
#### Common:
```xml
<dependency>
  <groupId>alemiz.stargate</groupId>
  <artifactId>common</artifactId>
  <version>2.1-SNAPSHOT</version>
  <scope>provided</scope>
</dependency>
```
#### Server:
```xml
<dependency>
  <groupId>alemiz.stargate</groupId>
  <artifactId>server</artifactId>
  <version>2.1-SNAPSHOT</version>
  <scope>provided</scope>
</dependency>
```
#### WaterdogPE plugin:
```xml
<dependency>
  <groupId>alemiz.stargate</groupId>
  <artifactId>stargate-waterdogpe</artifactId>
  <version>2.1-SNAPSHOT</version>
  <scope>provided</scope>
</dependency>
```
#### Bungeecord (Waterdog) plugin:
```xml
<dependency>
  <groupId>alemiz.stargate</groupId>
  <artifactId>stargate-bungeecord</artifactId>
  <version>2.1-SNAPSHOT</version>
  <scope>provided</scope>
</dependency>
```'
