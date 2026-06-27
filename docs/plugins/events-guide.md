---
title: Events Guide
---

# Events Guide

Events let your plugin react when something happens on the proxy — a player
logs in, sends a chat message, gets transferred, or pings the server. WaterdogPE
calls every interested handler when an event fires, and some events let you
**cancel** or **modify** what happens next.

All event classes live in `dev.waterdog.waterdogpe.event` (the framework) and
`dev.waterdog.waterdogpe.event.defaults` (the built-in events).

## Subscribing to an event

You subscribe through the `EventManager`, which you reach with
`proxy.getEventManager()`. Do this in your plugin's `onEnable()`:

```java
import dev.waterdog.waterdogpe.event.defaults.PlayerChatEvent;
import dev.waterdog.waterdogpe.player.ProxiedPlayer;

@Override
public void onEnable() {
    this.getProxy().getEventManager()
        .subscribe(PlayerChatEvent.class, this::onChat);
}

private void onChat(PlayerChatEvent event) {
    ProxiedPlayer player = event.getPlayer();

    if (event.getMessage().contains("badword")) {
        event.setCancelled(true);              // block the message
        player.sendMessage("§cWatch your language!");
    }
}
```

The two arguments are the event **class** and a **handler** — any method that
takes the event as its single parameter (`this::onChat` is a method reference; a
lambda works too).

### Event priority

When several handlers listen to the same event, you can control their order with
an `EventPriority`. Lower priorities run **first**, so higher-priority handlers
see (and can override) the result:

```java
import dev.waterdog.waterdogpe.event.EventPriority;

this.getProxy().getEventManager()
    .subscribe(PlayerChatEvent.class, this::onChat, EventPriority.HIGHEST);
```

Priorities, from first to last: `LOWEST`, `LOW`, `NORMAL` (the default), `HIGH`,
`HIGHEST`.

## Cancelling events

Events that implement `CancellableEvent` can be cancelled to stop the action
they represent:

```java
event.setCancelled(true);     // or simply event.setCancelled();
boolean cancelled = event.isCancelled();
```

Calling `setCancelled` on an event that is **not** cancellable throws an
exception, so only cancel the events marked cancellable in the
[reference table](#event-reference) below.

## Async events

Some events are annotated `@AsyncEvent`. Their handlers run on a background
thread pool instead of the main thread, which is ideal for work that doesn't
need to block the connection (and for handlers that don't change anything).

For async (and other "completable") events, `callEvent` returns a
`CompletableFuture` you can chain on:

```java
this.getProxy().getEventManager().callEvent(event)
    .whenComplete((completedEvent, error) -> {
        // runs once every handler has finished
    });
```

For ordinary (synchronous) events, `callEvent` returns `null`.

## Calling your own events

You can define and fire your own events, too. Create a class extending
`dev.waterdog.waterdogpe.event.Event` (implement `CancellableEvent` if it should
be cancellable, add `@AsyncEvent` if handlers should run off-thread), then:

```java
MyCustomEvent event = new MyCustomEvent(...);
this.getProxy().getEventManager().callEvent(event);
if (event.isCancelled()) {
    // a handler cancelled it
}
```

## Event reference

Every event below is in `dev.waterdog.waterdogpe.event.defaults`. Player events
extend `PlayerEvent`, so they all expose `getPlayer()`.

### Connection & lifecycle

| Event | Cancellable | Async | Fires when… | Key methods |
| --- | :---: | :---: | --- | --- |
| `ProxyStartEvent` | – | ✓ | The proxy has started and bound its listener. | `getProxy()` |
| `PreClientDataSetEvent` | – | – | A player's login data is decoded, before the player object exists. | `getClientData()`, `getXuid()`, `getUuid()`, `getDisplayName()` |
| `PlayerAuthenticatedEvent` | ✓ | – | The `ProxiedPlayer` is created from the login packet. | `getLoginData()`, `getAddress()`, `setCancelReason()` |
| `PlayerLoginEvent` | ✓ | ✓ | Right before the player connects to their initial server. Cancel to deny login. | `getPlayer()`, `setCancelReason(String)` |
| `InitialServerDeterminedEvent` | – | ✓ | The player's first server has been decided. | `getInitialServer()` |
| `InitialServerConnectedEvent` | – | ✓ | The player has logged into their first server. | `getConnection()`, `getServerInfo()` |
| `PlayerDisconnectedEvent` | – | ✓ | A player disconnects or is kicked. | `getReason()` |

### Servers & transfers

| Event | Cancellable | Async | Fires when… | Key methods |
| --- | :---: | :---: | --- | --- |
| `ServerTransferRequestEvent` | ✓ | – | A transfer to another server is requested (e.g. via `player.connect`). Cancel to block, or change the target. | `getTargetServer()`, `setTargetServer(ServerInfo)` |
| `ServerConnectedEvent` | ✓ | – | A player has connected to a (non-initial) server. | `getConnection()`, `getTargetServer()` |
| `ServerTransferEvent` | – | – | The transfer is starting. | `getSourceServer()`, `getTargetServer()`, `setTransferScreenAllowed(boolean)` |
| `TransferCompleteEvent` | – | ✓ | The player is now on the new server and the old connection is dropped. | `getSourceServer()`, `getTargetServer()`, `getConnection()` |
| `PostTransferCompleteEvent` | – | ✓ | The player has fully spawned on the new server. | `getConnection()` |
| `FastTransferRequestEvent` | ✓ | – | A "fast transfer" is requested by a downstream server. | `getServerInfo()`, `getAddress()`, `getPort()` |

### Chat, commands & permissions

| Event | Cancellable | Async | Fires when… | Key methods |
| --- | :---: | :---: | --- | --- |
| `PlayerChatEvent` | ✓ | – | A player sends a chat message. Cancel to block, or edit it. | `getMessage()`, `setMessage(String)` |
| `DispatchCommandEvent` | ✓ | – | A player runs a proxy command. Cancel to block it. | `getSender()`, `getCommand()`, `getArgs()` |
| `PlayerPermissionCheckEvent` | – | – | `player.hasPermission(...)` is called. Override the result here. | `getPermission()`, `hasPermission()`, `setHasPermission(boolean)` |

### Pings, queries & resource packs

| Event | Cancellable | Async | Fires when… | Key methods |
| --- | :---: | :---: | --- | --- |
| `ProxyPingEvent` | – | – | A client pings the proxy (server-list). Customise the MOTD and counts. | `getMotd()`/`setMotd()`, `getPlayerCount()`/`setPlayerCount()`, `getMaximumPlayerCount()`, `setVersion()` |
| `ProxyQueryEvent` | – | – | A query request is received (extends `ProxyPingEvent`). | `getMap()`, `setHasWhitelist(boolean)` |
| `PlayerResourcePackInfoSendEvent` | ✓ | – | Before the resource-pack info packet is sent to a player. | `getPacket()`, `setPacket(...)` |
| `PlayerResourcePackApplyEvent` | – | – | The resource pack stack is applied. | `getStackPacket()`, `setStackPacket(...)` |
| `ResourcePacksRebuildEvent` | – | ✓ | Resource packs are rebuilt. | `getPacksInfoPacket()`, `getStackPacket()` |
| `IncompatibleProtocolEvent` | – | – | A client with an unsupported protocol version connects. | `getProtocolVersion()`, `setDisconnectMessage(...)` |

## Common recipes

**Welcome a player when they join their first server:**

```java
events.subscribe(InitialServerConnectedEvent.class, event ->
    event.getPlayer().sendMessage("§aWelcome to the network!"));
```

**Customise the server-list MOTD and player count:**

```java
events.subscribe(ProxyPingEvent.class, event -> {
    event.setMotd("§bMy Network");
    event.setPlayerCount(event.getPlayers().size());
    event.setMaximumPlayerCount(1000);
});
```

**Deny login for banned players:**

```java
events.subscribe(PlayerLoginEvent.class, event -> {
    if (isBanned(event.getPlayer().getXuid())) {
        event.setCancelReason("§cYou are banned.");
        event.setCancelled(true);
    }
});
```

> Keep handlers fast, especially for synchronous events on the connection path
> (login, transfers, pings). Don't run slow database or network calls directly
> inside them — do that work in the background (see
> [Scheduling Tasks](./scheduling-task)) and cache the results, or use an
> `@AsyncEvent` handler where appropriate.
