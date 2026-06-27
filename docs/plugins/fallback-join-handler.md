---
title: Fallback & Join Handler
---

# Fallback & Join Handler

Two interfaces let your plugin control the most important routing decisions a
proxy makes:

- **`IJoinHandler`** — decides which server a player connects to **when they
  first join the proxy**.
- **`IReconnectHandler`** — decides where a player goes **when they get kicked
  from a downstream server** (a fallback).

Both live in `dev.waterdog.waterdogpe.network.connection.handler`. The proxy
holds one of each, and you can replace them from a plugin.

## Setting the handlers

```java
ProxyServer proxy = ProxyServer.getInstance();
proxy.setJoinHandler(new MyJoinHandler());
proxy.setReconnectHandler(new MyReconnectHandler());
```

> **Never set a handler to `null`.** Doing so breaks routing. If you want to
> disable behaviour, implement a no-op handler instead. WaterdogPE also ships
> default implementations (`DefaultJoinHandler`, `DefaultReconnectHandler`,
> `RoundRobinReconnectHandler`) and reads the configured ones from `config.yml`.

## `IJoinHandler`

```java
public interface IJoinHandler {
    ServerInfo determineServer(ProxiedPlayer player);
}
```

`determineServer` is called whenever a player connects **to the proxy**. Return
the `ServerInfo` they should land on, or `null` to disconnect them (no server
available).

### Example

This handler sends every player to the first server in the configured priority
list — the default behaviour:

```java
public class VanillaJoinHandler implements IJoinHandler {

    private final ProxyServer server;

    public VanillaJoinHandler(ProxyServer server) {
        this.server = server;
    }

    @Override
    public ServerInfo determineServer(ProxiedPlayer player) {
        String firstPriority = this.server.getConfiguration().getPriorities().get(0);
        return this.server.getServerInfo(firstPriority);
    }
}
```

**Use case:** if you run several lobby instances, you can distribute players
across them — for example with a
[round-robin](https://en.wikipedia.org/wiki/Round-robin_scheduling) strategy, or
based on where the player was last, or any rule you like.

## `IReconnectHandler`

```java
public interface IReconnectHandler {
    ServerInfo getFallbackServer(ProxiedPlayer player,
                                 ServerInfo oldServer,
                                 ReconnectReason reason,
                                 String kickMessage);
}
```

`getFallbackServer` is called whenever a player is disconnected from a downstream
server — by a kick, a server shutdown, or a proxy↔downstream timeout. Return a
`ServerInfo` to move the player there (keeping them on the proxy), or `null` to
disconnect them from the proxy entirely.

The parameters:

- **`player`** — the affected player.
- **`oldServer`** — the server they were disconnected from.
- **`reason`** — a `ReconnectReason` describing *why*: `UNKNOWN`, `TIMEOUT`,
  `EXCEPTION`, `SERVER_KICK` or `TRANSFER_FAILED`.
- **`kickMessage`** — the kick message from the downstream server, if any.

> **Migrating from WaterdogPE 1.x:** the method used to be
> `getFallbackServer(ProxiedPlayer, ServerInfo, String)`. It now takes a
> `ReconnectReason` as well. The old 3-argument method still exists but is
> deprecated — override the 4-argument version.

### Example

This handler keeps players on the network by sending them to any other server
than the one they were kicked from:

```java
public class FallbackHandler implements IReconnectHandler {

    @Override
    public ServerInfo getFallbackServer(ProxiedPlayer player, ServerInfo oldServer,
                                        ReconnectReason reason, String kickMessage) {
        for (ServerInfo server : player.getProxy().getServers()) {
            if (!server.getServerName().equals(oldServer.getServerName())) {
                return server;
            }
        }
        return null; // nothing else available – player will be disconnected
    }
}
```

**Use case:** on a minigames network, servers crash or shut down between rounds.
Instead of kicking the player off the network, send them back to a lobby.

You can be selective using `reason` and `kickMessage` — for example, catch
players kicked for "Server closed" but let players banned with "You are banned"
disconnect normally:

```java
if ("You are banned".equals(kickMessage)) {
    return null; // let the ban through
}
return player.getProxy().getServerInfo("lobby1");
```

When you return a fallback server you can also send the player a title or message
to explain what happened.

## Performance note

Both handlers run on the connection path, so they must be **fast**. Do not run
slow work (SQL queries, HTTP calls) directly inside them — that stalls the player
while the code runs. Instead, refresh that data periodically in the background
(see [Scheduling Tasks](./scheduling-task)), keep the results in memory, and read
the cached values here.

## Full examples

Working example plugins, including a random-server join handler, are available in
the [Example-Plugins repository](https://github.com/WaterdogPE/Example-Plugins).
