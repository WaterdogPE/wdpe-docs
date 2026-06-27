---
title: Starting Waterdog
---

# Starting Waterdog

'To start pre-compiled WaterdogPE (WDPE) you will need Java 11 installed. If you want to start proxy with older version of Java, you must compile WDPE yourself.  
1. Download the latest built `Waterdog.jar` from our jenkins server.
2. Place the file inside a new directory dedicated to Waterdog.
3. Create a new startup script to launch the the JAR.
4. Once you have successfully installed WDPE, it is time to get it working properly. One of the most essential steps is to configure your downstream server instances (Nukkit, PMMP) to run in offline-mode, which can be achieved by modifying `server.properties`. You would need to set xbox-auth to false.
5. PocketMine-MP has added another option which must be disabled when using proxy. Since server thinks player is unathenticated, his XUID will be unset. PMMP implements new security check where it verifies if players last XUID match the current one. In proxy case it will *not* match and player will be disconnected. To solve this issue, please disable `player.verify-xuid` in `pocketmine.yml` file.

## Startup script
When using Java 11 we recommend adding this parameters, which will add support for some netty features.
```
-Dio.netty.tryReflectionSetAccessible=true
--add-opens java.base/jdk.internal.misc=ALL-UNNAMED
```
Minimum allocated memory can be set using `-Xms<size>`, maximum `-Xmx<size>`.
#### Windows
In dedicated directory create `start.bat` file with following code:
```
@echo off
java -Xms512M -Xmx4G -jar Waterdog.jar
pause
```
#### Linux
For Linux it is recommended to start proxy in bash environment. Create `start.sh` file with following code:
```
#!/bin/bash
java -Xms512M -Xmx4G -jar Waterdog.jar
```

While using above code in your startup scripts is a template, you can also replace **512M** with the amount of **initial memory pool** that you'd like to allocate and **4G** with the amount of **maximum memory pool** that you'd like to allocate to the proxy. This is completely dependent on the underlying hardware you use and on your needs. You don't have to do this if you don't want to.

To give your script executable permissions `chmod a+x start.sh` To start proxy you can execute from terminal `bash start.sh`.'
