---
title: Introduction
---

# Plugin API Introduction

This section documents the WaterdogPE plugin API — the classes and methods you
use to make your plugin actually *do* things. If you have not created a plugin
project yet, start with the
[Entry Level Plugin API Guide](/entry-level-plugin-api-guide/prerequisites),
which walks you through setting up Maven and writing your first plugin.

All API classes live under the `dev.waterdog.waterdogpe.*` package.

## The `ProxyServer` — your starting point

Almost everything you do goes through `ProxyServer`
(`dev.waterdog.waterdogpe.ProxyServer`). It is a singleton, so there is exactly
one instance for the whole proxy. Inside your plugin you usually get it with
`this.getProxy()`; from anywhere else you can use the static accessor:

```java
ProxyServer proxy = ProxyServer.getInstance();
```

### Common things you can reach from it

```java
ProxyServer proxy = this.getProxy();

// Players
ProxiedPlayer player = proxy.getPlayer("Steve");      // by name (null if offline)
ProxiedPlayer byId  = proxy.getPlayer(uuid);          // by UUID
Map<UUID, ProxiedPlayer> online = proxy.getPlayers(); // everyone online

// Servers (downstream)
ServerInfo lobby = proxy.getServerInfo("lobby1");     // by name (null if unknown)
Collection<ServerInfo> servers = proxy.getServers();  // all configured servers

// Core managers (each documented on its own page)
proxy.getCommandMap();      // register/unregister commands
proxy.getEventManager();    // subscribe to and call events
proxy.getScheduler();       // run delayed / repeating tasks
proxy.getPluginManager();   // look up other plugins
proxy.getConfiguration();   // read config.yml values

// Logging
proxy.getLogger().info("Hello from the proxy!");
```

### Manager cheat sheet

| Manager | Get it with | Use it for | Guide |
| --- | --- | --- | --- |
| Command map | `proxy.getCommandMap()` | Registering `/commands`. | [Commands](./commands-guide) |
| Event manager | `proxy.getEventManager()` | Reacting to joins, chat, transfers, pings, etc. | [Events](./events-guide) |
| Scheduler | `proxy.getScheduler()` | Delayed, repeating and async tasks. | [Scheduling](./scheduling-task) |
| Plugin manager | `proxy.getPluginManager()` | Looking up other loaded plugins. | [First Plugin](/entry-level-plugin-api-guide/first-plugin#depending-on-another-plugin) |
| Configuration | `proxy.getConfiguration()` | Reading the proxy's `config.yml`. | [Proxy Configuration](/waterdogpe-setup/proxy-configuration) |

## A minimal end-to-end example

Here is a plugin that registers a command, listens for an event and logs when a
player joins — touching several parts of the API at once. Each part is explained
in detail on its own page.

```java
package com.example.myplugin;

import dev.waterdog.waterdogpe.event.defaults.PlayerLoginEvent;
import dev.waterdog.waterdogpe.plugin.Plugin;

public class MyPlugin extends Plugin {

    @Override
    public void onEnable() {
        // 1. Register a command (see the Commands guide)
        this.getProxy().getCommandMap().registerCommand(new HubCommand());

        // 2. Subscribe to an event (see the Events guide)
        this.getProxy().getEventManager()
            .subscribe(PlayerLoginEvent.class, this::onPlayerLogin);

        this.getLogger().info("MyPlugin enabled!");
    }

    private void onPlayerLogin(PlayerLoginEvent event) {
        this.getLogger().info(event.getPlayer().getName() + " is logging in");
    }
}
```

## Where to go from here

- **[Working with Players](./players-guide)** — message, transfer, kick and
  manage permissions for `ProxiedPlayer`.
- **[Commands Guide](./commands-guide)** — create your own proxy commands.
- **[Events Guide](./events-guide)** — the full list of events and how to handle
  them.
- **[Fallback & Join Handler](./fallback-join-handler)** — control which server
  players land on and where they fall back to.
- **[Scheduling Tasks](./scheduling-task)** — delayed, repeating and async work.
- **[Proxy Communication](./proxy-communication)** — talk between the proxy and
  downstream servers.

> **Heads up — WaterdogPE 2.x packages.** Current WaterdogPE uses
> `dev.waterdog.waterdogpe.*` for its own classes and `org.cloudburstmc.protocol.*`
> for network/protocol types. Tutorials referencing `pe.waterdog.*`,
> `dev.waterdog.command.*` (without `waterdogpe`) or `com.nukkitx.*` are written
> for old 1.x builds and won't compile against 2.x.
