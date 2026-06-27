---
title: Server Setup
---

# Server Setup

'Configuring and starting default StarGate server shouldn't be problem. StarGate server comes as plugin for Bungeecord (and its forks) and for WaterdogPE. Both plugins use similar or same API methods and use same config file.

## Server Plugin
StarGate server is used to handle new pending connections, route/handle incoming packets from the clients. Service uses `tcp` sockets, by default port `47007` is used.  
You should include `StarGate` plugin into dependencies of your plugin inside of `plugin.yml` file. Your plugin will be than enabled after server plugin.
### Config
- StarGate uses simple authentication based on string password. You can adjust security level by implementing the extra layer of authentication using custom packets.
- When option `blockSameNames` is enabled and client with same name name included in `HandshakeData`, it will be disconnected.
- If `debug` is enabled `StarGateLogger#debug()` messages will be shown in console.

This is how default config should look like.
```yaml
# On this port StarGate server will listen for new connections.
serverPort: 47007
# To make connection secure enough set strong password that will be used to authenticate clients.
password: "123456789"
# Clients should not have same name and should be same as name of downstream server.
# Disabling this option will allow to join more clients using same client name.
# If enabled, some packets that use client name to identify client, might not work.
blockSameNames: true
# Enable debug logger
debug: true
```
### Server Events
Plugins can use events to handle new connected, authenticated or disconnected session. Here is simple overview of currently available events.
- `ClientConnectedEvent`: Called once new session is created. At this point session is NOT authenticated and will not accept other than `HandshakePacket`.
- `ClientAuthenticatedEvent`: Called once session is successfully authenticated using simple password. You can set custom packet handler to session when this event is called. *WaterdogPE plugin marks this event as `@AsyncEvent`.*
- `ClientDisconnectedEvent`: Called once session has been disconnected or closed. *WaterdogPE plugin marks this event as `@AsyncEvent`.*
### Registering packets
Assuming your plugin is enabled after StarGate server plugin, you can register custom packets inside of `onEnable()` method.
```java
ProtocolCodec codec = StarGate.getInstance().getServer().getProtocolCodec();
codec.registerPacket(StarGatePackets.SERVER_INFO_REQUEST_PACKET, ServerInfoRequestPacket.class);
```

## Implementing Own Server
To create new server instance you should create new class which will implement `ServerLoader`. Currently, it is used only to provide own `StarGateLogger` implementation. Using public `StarGateServer(bindAddress : InetSocketAddress, password : String, loader : ServerLoader)` constructor we create new server instance. To start server we use `StarGateServer#start()`.  
Simple example:
```java
MyServerLoader loader = new MyServerLoader();
InetSocketAddress address = new InetSocketAddress("0.0.0.0", 47007);
StarGateServer server = new StarGateServer(address, "12345", loader);
// You can register custom packets here
server.start();
```'
