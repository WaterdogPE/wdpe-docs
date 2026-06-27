---
title: Starting Waterdog
---

# Starting Waterdog

This page walks you through getting a WaterdogPE proxy up and running for the
first time. If you have never used a Bedrock proxy before, just follow the steps
in order.

## What is WaterdogPE?

WaterdogPE (often shortened to **WDPE**) is a proxy for Minecraft: Bedrock
Edition. It sits between your players and your actual game servers
("downstream" servers such as PocketMine‑MP or Nukkit) and lets a player move
between those servers without ever leaving the connection. This is how networks
build features like a lobby, minigames and survival worlds that all feel like
"one server".

## Requirements

- **Java 17 or newer.** This is the most common setup mistake — make sure you
  install a Java **17+** runtime (JDK or JRE). You can check your version with
  `java -version`. Older WaterdogPE 1.x builds used Java 11, but current
  releases require Java 17.
- A machine to run it on (your own PC for testing, or a server/VPS for
  production).
- At least one downstream server to connect to (see
  [Software Compatibility](./software-compatibility)).

## Downloading WaterdogPE

1. Download the latest `Waterdog.jar` from the
   [GitHub releases page](https://github.com/WaterdogPE/WaterdogPE/releases) or
   from [waterdog.dev](https://waterdog.dev). If you want a build for an older
   Java version you will need to [compile it yourself](https://github.com/WaterdogPE/WaterdogPE/blob/master/COMPILING.md).
2. Place the file inside a new, empty folder dedicated to the proxy.
3. Create a startup script (see below) so you can launch it easily.

On the **first launch** WaterdogPE generates its configuration files
(`config.yml`, `lang.ini`) and then starts. Stop the proxy, edit `config.yml` to
point at your downstream servers, and start it again. See
[Proxy Configuration](./proxy-configuration) for the full list of options.

## Preparing your downstream servers

A proxy authenticates players with Xbox Live itself, so your downstream servers
must run in **offline mode**. If you skip this step players will fail to connect.

1. On each downstream server, disable Xbox authentication. On PocketMine‑MP and
   Nukkit this means setting `xbox-auth=false` in `server.properties`.
2. **PocketMine‑MP only:** also disable the XUID check. Because the downstream
   server sees the player as unauthenticated, PMMP's "verify XUID" security
   check will not match and the player will be disconnected. Set
   `player.verify-xuid` to `false` in `pocketmine.yml`:

   ```yaml
   player:
     verify-xuid: false
   ```

> WaterdogPE still authenticates players against Xbox Live at the proxy (when
> `online_mode` is enabled), so your network as a whole stays secure even though
> the individual downstream servers run offline.

## Startup script

The recommended JVM flags below enable some Netty features WaterdogPE relies on:

```
-Dio.netty.tryReflectionSetAccessible=true
--add-opens java.base/jdk.internal.misc=ALL-UNNAMED
```

You also control how much memory the proxy may use:

- `-Xms<size>` — initial memory pool (e.g. `-Xms512M`)
- `-Xmx<size>` — maximum memory pool (e.g. `-Xmx4G`)

Adjust these to match your hardware and player count.

### Windows

Create a `start.bat` file next to `Waterdog.jar`:

```bat
@echo off
java -Xms512M -Xmx4G -Dio.netty.tryReflectionSetAccessible=true --add-opens java.base/jdk.internal.misc=ALL-UNNAMED -jar Waterdog.jar
pause
```

Double-click `start.bat` to launch the proxy.

### Linux

Create a `start.sh` file next to `Waterdog.jar`:

```bash
#!/bin/bash
java -Xms512M -Xmx4G -Dio.netty.tryReflectionSetAccessible=true --add-opens java.base/jdk.internal.misc=ALL-UNNAMED -jar Waterdog.jar
```

Make it executable and run it:

```bash
chmod +x start.sh
./start.sh
```

> **Tip:** On a production server, run the proxy inside a terminal multiplexer
> such as `screen` or `tmux` (or as a `systemd` service) so it keeps running
> after you log out.

## Connecting

Once the proxy is running, add a server in Minecraft pointing at the proxy's
host and port (default `19132`). If something goes wrong, check the
[Troubleshooting](./troubleshooting) page — most first-time problems are a Java
version mismatch or a downstream server that still has Xbox auth enabled.
