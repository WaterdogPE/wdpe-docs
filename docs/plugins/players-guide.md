---
title: Working with Players
---

# Working with Players

A connected player is represented by `ProxiedPlayer`
(`dev.waterdog.waterdogpe.player.ProxiedPlayer`). This is one of the classes you
will use most: it lets you read information about a player, send them messages,
move them between servers, manage their permissions and disconnect them.

## Getting a player

```java
ProxyServer proxy = this.getProxy();

ProxiedPlayer byName = proxy.getPlayer("Steve"); // null if not online
ProxiedPlayer byUuid = proxy.getPlayer(uuid);    // null if not online

// All online players
for (ProxiedPlayer player : proxy.getPlayers().values()) {
    player.sendMessage("Server restarting in 5 minutes!");
}
```

You also receive a `ProxiedPlayer` from most [events](./events-guide) (via
`event.getPlayer()`) and from [command](./commands-guide) execution (after
checking the sender is a player).

## Reading player information

```java
String name        = player.getName();        // display name from login
UUID uuid          = player.getUniqueId();     // unique player UUID
String xuid        = player.getXuid();         // Xbox Live ID
long ping          = player.getPing();         // latency in ms
InetSocketAddress ip = player.getAddress();    // player's network address
boolean online     = player.isConnected();

ServerInfo current = player.getServerInfo();   // the downstream server they're on (may be null)
```

## Sending messages

WaterdogPE offers several ways to put text in front of a player:

```java
player.sendMessage("§aHello!");                 // chat box
player.sendTip("§eThis is a tip");              // tip (above hotbar)
player.sendPopup("§bTitle", "§7subtitle");      // popup
player.sendToastMessage("§aSaved", "Your data was saved"); // toast notification
```

Titles (the large centred text) have their own methods:

```java
player.sendTitle("§6Welcome!");
player.sendTitle("§6Welcome!", "§7to the network");
// title, subtitle, fadeIn, stay, fadeOut (in ticks — 20 ticks = 1 second)
player.sendTitle("§6Welcome!", "§7to the network", 10, 70, 20);
player.clearTitle();
```

> **Color codes:** WaterdogPE uses the standard Minecraft `§` color codes (e.g.
> `§a` green, `§c` red, `§l` bold). In Java source the `§` character is often
> written as the unicode escape `§`.

### Translated messages

`sendMessage` also accepts a `TextContainer`. A `TranslationContainer`
(`dev.waterdog.waterdogpe.utils.types.TranslationContainer`) looks up a key in
`lang.ini` and fills in `{%0}`, `{%1}`, … placeholders — handy for
multi-language messages:

```java
import dev.waterdog.waterdogpe.utils.types.TranslationContainer;

player.sendMessage(new TranslationContainer("my.plugin.welcome", player.getName()));
```

See [Language Settings](/waterdogpe-setup/proxy-configuration#language-settings)
for the `lang.ini` format.

## Transferring a player to another server

This is the core feature of a proxy. Use `connect(ServerInfo)` — it moves the
player to another downstream server **without disconnecting them from the
proxy**:

```java
ServerInfo lobby = this.getProxy().getServerInfo("lobby1");
if (lobby != null) {
    player.connect(lobby);
}
```

`connect()` fires a cancellable `ServerTransferRequestEvent` first, so other
plugins (or your own listeners) can allow, deny or redirect the transfer. If the
player is already on the target server, they simply get a message instead.

There is also `redirectServer(ServerInfo)`, which uses Bedrock's
`TransferPacket` to make the client reconnect ("slow" transfer). Prefer
`connect()` for the seamless experience; `redirectServer()` is for special cases.

## Permissions

WaterdogPE has a simple built-in permission system. Default permissions for
players are also configurable in the proxy's `config.yml`.

```java
if (player.hasPermission("myplugin.command.fly")) {
    // allowed
}

player.addPermission("myplugin.command.fly");    // grant
player.removePermission("myplugin.command.fly");  // revoke

player.setAdmin(true);     // admins pass every hasPermission() check
boolean admin = player.isAdmin();
```

Notes:

- Permission names are **case-insensitive**.
- An **admin** player (`setAdmin(true)`) returns `true` for every permission
  check.
- A `PlayerPermissionCheckEvent` is fired on every `hasPermission()` call, so a
  permissions plugin can override the result without touching the permission map.

## Kicking / disconnecting a player

```java
player.disconnect();                          // no reason
player.disconnect("§cYou have been kicked!"); // with a reason message
```

The reason is shown to the player on the disconnect screen.

## Sending the player's chat to their server

`chat(String)` makes the player send a chat message to their current downstream
server, exactly as if they had typed it:

```java
player.chat("hello everyone");
```

## Quick reference

| Method | Purpose |
| --- | --- |
| `getName()` / `getUniqueId()` / `getXuid()` | Identity |
| `getServerInfo()` | Current downstream server |
| `getPing()` / `getAddress()` / `isConnected()` | Connection info |
| `sendMessage(...)` | Chat message (String or `TextContainer`) |
| `sendTip` / `sendPopup` / `sendToastMessage` | Other on-screen text |
| `sendTitle(...)` / `clearTitle()` | Title text |
| `connect(ServerInfo)` | Seamless transfer to another server |
| `redirectServer(ServerInfo)` | Reconnect-based transfer |
| `hasPermission` / `addPermission` / `removePermission` | Permissions |
| `setAdmin` / `isAdmin` | Admin flag (bypasses permission checks) |
| `disconnect(...)` | Kick the player |
| `chat(String)` | Send chat as the player to their server |
