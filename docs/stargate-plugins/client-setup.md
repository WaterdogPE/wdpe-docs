---
title: Client Setup
---

# Client Setup

A StarGate **client** connects to the StarGate server and communicates with it.
In a Minecraft network the clients are the plugins running on your downstream
game servers. StarGate ships with two official client implementations:

- **[StarGate-Universe](https://github.com/Alemiz112/StarGate-Universe)** — Java
  clients (currently for Nukkit).
- **[StarGate-Atlantis](https://github.com/Alemiz112/StarGate-Atlantis)** — a PHP
  client for PocketMine-MP (version 3).

## Plugin configuration

Both clients use the same configuration file. One plugin can create several
clients and connect to several different servers.

```yaml
# Supports multiple connections
connections:
  lobby1:
    address: 192.168.0.50
    port: 47007
    password: 123456789

# Enable the debug logger
debug: true
# Minimum packet log level to print when debugging
logLevel: 0
# Client used when no clientName is given to an API method
defaultClient: "lobby1"
# Start clients automatically once the plugin is enabled
autoStart: true
# Interval (in ticks) at which buffered data is processed and packets decoded.
# Smaller = packets handled faster. Used only by StarGate-Atlantis.
tickInterval: 2
```

- The `connections` map defines each client connection.
- When `debug` is enabled, `debug` messages are shown in the console.
- Each packet can have its own log level; packets whose level is equal to or
  higher than `logLevel` are logged.
- When `autoStart` is enabled, all clients start and connect as soon as the
  plugin is enabled.
- `tickInterval` is the interval, in ticks, between buffer-processing ticks. A
  smaller value handles packets faster. **This option is only used by
  StarGate-Atlantis.**

## Session events

- **`ClientCreationEvent`** — a new StarGate client is created (usually when the
  StarGate-Universe plugin enables). Use it to adjust the `ProtocolCodec`. *If
  your plugin loads after StarGate-Universe, you will miss this event.*
- **`ClientConnectedEvent`** — a new session is created (not yet authenticated).
- **`ClientAuthenticatedEvent`** — a session has authenticated (a
  `ServerHandshakePacket` was received). Attach a custom packet handler here.
- **`ClientDisconnectedEvent`** — a session has disconnected or been closed.

## Common plugin methods

All client plugins expose these methods:

- `getClient(String) : StarGateClient` — the client matched by name.
- `getDefaultClient() : StarGateClient` — the default client from the config.
- `getClientsCopy() : StarGateClient[]` — a copy of the current clients;
  modifying it does not affect the original list. *(Called `getClients()` in
  StarGate-Atlantis.)*
- `setLogLevel(int)` — change the log level of all clients.
- `getLogLevel() : int` — the current log level.
- `transferPlayer(Player, targetServer, clientName)` — send a `TransferPacket`
  to the StarGate server to transfer a player to another downstream server. If
  `clientName` is `null`, the default client is used. If it matches no client
  session, the packet is not sent.
- `serverInfo(serverName, selfMode, clientName) : CompletableFuture` — request
  information about another downstream server. If `selfMode` is `true`, data for
  the whole proxy is returned. If `clientName` matches no client session, the
  packet is not sent and `null` is returned. The returned future completes when
  the response is received. *(StarGate-Atlantis returns a `PacketResponse`. Some
  StarGate server implementations may not support this method.)*

## StarGate-Universe (Nukkit, Java)

Add the Maven dependency (you will usually want the StarGate `common` dependency
too — see [StarGate Modules](/stargate-commons/stargate-modules)):

```xml
<dependency>
  <groupId>alemiz.sgu.nukkit</groupId>
  <artifactId>sgu-nukkit</artifactId>
  <version>2.1-SNAPSHOT</version>
  <scope>provided</scope>
</dependency>
```

> Check the [StarGate-Universe repository](https://github.com/Alemiz112/StarGate-Universe)
> for the current version number, as it is released separately from the main
> StarGate project. Builds are published to the
> [Waterdog repository](https://repo.waterdog.dev/main).

Also add `StarGate-Universe` to your `plugin.yml` `depends` list.

Access the plugin instance with `StarGate.getInstance()`. If you disabled
`autoStart`, start the clients yourself:

```java
StarGateUniverse plugin = StarGate.getInstance();
for (StarGateClient client : plugin.getClientsCopy()) {
    // You can adjust the ProtocolCodec here
    client.start();
}
```

## StarGate-Atlantis (PocketMine-MP 3, PHP)

StarGate-Atlantis is the PHP client for PocketMine-MP (version 3 only). To let
your IDE index its classes, use the `phar` from
[Poggit](https://poggit.pmmp.io/ci/Alemiz112/StarGate-Atlantis/StarGate-Atlantis)
and include it as a dependency.

Access the plugin instance with `StarGateAtlantis::getInstance()`. If you
disabled `autoStart`, start the clients yourself:

```php
$plugin = StarGateAtlantis::getInstance();
foreach ($plugin->getClients() as $client) {
    // You can adjust the ProtocolCodec here
    $client->connect();
}
```
