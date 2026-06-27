---
title: StarGate Modules
---

# StarGate Modules

::: warning Maintenance status
StarGate is **not actively maintained** at the moment, but it is **still
functional** and can be used in production. Expect few or no new releases, and
check the [StarGate repository](https://github.com/Alemiz112/StarGate) for the
current state before adopting it in a new project.
:::

[StarGate](https://github.com/Alemiz112/StarGate) is a lightweight socket
communication service that lets the servers connected to your proxy talk to each
other and to the proxy. It is developed by one of the WaterdogPE developers and
is a good choice when you need real inter-server messaging rather than polling a
database. See [Proxy Communication](/plugins/proxy-communication) for background
on why this approach is recommended.

The project is built with Maven, compiled with **Java 8**, and runs fine on
newer Java versions too. It is split into several modules by purpose:

- **`common`** — the protocol: default packet implementations and packet
  handlers. Add this to your dependencies whenever you work with StarGate.
- **`server`** — the default server implementation built on the StarGate
  protocol. Include it when writing server-side (proxy-side) code.
- **`waterdogpe`** — the ready-to-use StarGate server plugin for the WaterdogPE
  proxy, built on the `server` module. Include it as a dependency in your
  WaterdogPE plugin.
- **`bungeecord`** — a legacy server plugin for BungeeCord/Waterdog (Bungee).
  This module is no longer part of the active build and is unmaintained; new
  setups should use the `waterdogpe` module.

> **Versions.** At the time of writing the `common`, `server` and `waterdogpe`
> modules are at `2.3-SNAPSHOT`. The legacy `bungeecord` module is at
> `2.2-SNAPSHOT`. Always check the
> [repository](https://repo.waterdog.dev/main) or the
> [StarGate repo](https://github.com/Alemiz112/StarGate) for the latest version.

### Repository

StarGate is published to the Waterdog repository. Add it to your `repositories`
list:

```xml
<repository>
  <id>waterdog-repo</id>
  <url>https://repo.waterdog.dev/main</url>
</repository>
```

### Dependencies

Add the module(s) you need to your Maven project. Use the `provided` scope when
the StarGate plugin is already installed on the proxy at runtime.

#### Common

```xml
<dependency>
  <groupId>alemiz.stargate</groupId>
  <artifactId>common</artifactId>
  <version>2.3-SNAPSHOT</version>
  <scope>provided</scope>
</dependency>
```

#### Server

```xml
<dependency>
  <groupId>alemiz.stargate</groupId>
  <artifactId>server</artifactId>
  <version>2.3-SNAPSHOT</version>
  <scope>provided</scope>
</dependency>
```

#### WaterdogPE plugin

```xml
<dependency>
  <groupId>alemiz.stargate</groupId>
  <artifactId>stargate-waterdogpe</artifactId>
  <version>2.3-SNAPSHOT</version>
  <scope>provided</scope>
</dependency>
```

#### BungeeCord plugin (legacy)

```xml
<dependency>
  <groupId>alemiz.stargate</groupId>
  <artifactId>stargate-bungeecord</artifactId>
  <version>2.2-SNAPSHOT</version>
  <scope>provided</scope>
</dependency>
```
