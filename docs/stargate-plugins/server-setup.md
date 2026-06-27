---
title: Server Setup
---

# Server Setup

The StarGate **server** accepts incoming connections from clients (your
downstream game servers), authenticates them, and routes packets between them.
It ships as a plugin for WaterdogPE and for BungeeCord (and its forks); both
plugins share a very similar API and the same config file. The WaterdogPE plugin
is the recommended one for new setups.

## The server plugin

The server handles pending connections and routes/handles packets from the
clients. It uses **TCP** sockets and listens on port **47007** by default.

If your own plugin uses the StarGate API, add `StarGate` to the `depends` list
in your `plugin.yml` so your plugin is enabled *after* the StarGate plugin.

### Config

```yaml
# Port StarGate server will listen on for new connections.
serverPort: 47007
# Set a strong password to authenticate clients securely.
password: "123456789"
# Clients should not share a name, and the name should match the downstream server.
# Disabling this allows multiple clients to connect with the same client name,
# but some packets that identify a client by name may then not work correctly.
blockSameNames: true
# Enable the debug logger
debug: true
```

- StarGate uses simple **password** authentication. You can add an extra layer
  of security by implementing your own authentication with custom packets.
- When `blockSameNames` is enabled and a client connects with a name that is
  already in use (as included in its `HandshakeData`), it is disconnected.
- When `debug` is enabled, `StarGateLogger#debug()` messages are shown in the
  console.

### Server events

Plugins can listen for session lifecycle events. The WaterdogPE plugin fires
these as standard [WaterdogPE events](/plugins/events-guide):

- **`ClientConnectedEvent`** — a new session is created. At this point the
  session is **not** authenticated and only accepts a `HandshakePacket`.
- **`ClientAuthenticatedEvent`** — a session has authenticated with the
  password. This is where you typically attach a custom packet handler to the
  session. *Annotated `@AsyncEvent` in the WaterdogPE plugin.*
- **`ClientDisconnectedEvent`** — a session has disconnected or been closed.
  *Annotated `@AsyncEvent` in the WaterdogPE plugin.*

### Registering packets

If your plugin is enabled after the StarGate server plugin, register your custom
packets in `onEnable()`:

```java
ProtocolCodec codec = StarGate.getInstance().getServer().getProtocolCodec();
codec.registerPacket(StarGatePackets.SERVER_INFO_REQUEST_PACKET, ServerInfoRequestPacket.class);
```

## Running your own server instance

If you are building a standalone application (not a proxy plugin), you can create
and run a `StarGateServer` directly. Implement the `ServerLoader` interface —
currently used to supply your own `StarGateLogger` implementation — and pass it
to the constructor:

```java
public StarGateServer(InetSocketAddress bindAddress, String password, ServerLoader loader)
```

`StarGateServer` extends `Thread`, so you start it with `start()`:

```java
MyServerLoader loader = new MyServerLoader();
InetSocketAddress address = new InetSocketAddress("0.0.0.0", 47007);
StarGateServer server = new StarGateServer(address, "12345", loader);
// Register custom packets on server.getProtocolCodec() here, before starting
server.start();
```
