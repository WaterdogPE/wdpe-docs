---
title: Commands Guide
---

# Commands Guide

WaterdogPE commands are **proxy** commands: they run on the proxy, not on the
downstream server. That makes them perfect for things like `/server`, `/hub` or
`/staffchat` that need to work regardless of which server the player is on.

A command is a class that extends `dev.waterdog.waterdogpe.command.Command`. You
create it, then register it with the proxy's command map.

## A minimal command

```java
package com.example.myplugin;

import dev.waterdog.waterdogpe.command.Command;
import dev.waterdog.waterdogpe.command.CommandSender;
import dev.waterdog.waterdogpe.command.CommandSettings;
import dev.waterdog.waterdogpe.player.ProxiedPlayer;

public class HubCommand extends Command {

    public HubCommand() {
        super("hub", CommandSettings.builder()
                .setDescription("Teleport to the hub")
                .setPermission("myplugin.command.hub")
                .setAliases("lobby", "leave")
                .build());
    }

    @Override
    public boolean onExecute(CommandSender sender, String alias, String[] args) {
        if (!sender.isPlayer()) {
            sender.sendMessage("§cOnly players can use this command.");
            return true;
        }

        ProxiedPlayer player = (ProxiedPlayer) sender;
        var hub = player.getProxy().getServerInfo("lobby1");
        if (hub == null) {
            player.sendMessage("§cThe hub is not available right now.");
            return true;
        }

        player.connect(hub);
        return true;
    }
}
```

Register it in your plugin's `onEnable()`:

```java
@Override
public void onEnable() {
    this.getProxy().getCommandMap().registerCommand(new HubCommand());
}
```

That's a complete, working command. The rest of this page explains each part.

## The constructor and `CommandSettings`

The `Command` constructor takes a name and (optionally) a `CommandSettings`
object:

```java
public Command(String name)
public Command(String name, CommandSettings settings)
```

`CommandSettings` carries the description, usage message, required permission and
aliases. Build it with the fluent builder:

```java
CommandSettings.builder()
    .setDescription("Teleport to the hub")        // shown in /help
    .setUsageMessage("/hub")                       // shown when onExecute returns false
    .setPermission("myplugin.command.hub")         // required permission
    .setPermissionMessage("§cNo permission.")      // shown if the sender lacks it
    .setAliases("lobby", "leave")                  // alternative names
    .build()
```

| Builder method | Purpose |
| --- | --- |
| `setDescription(String)` | Human-readable description (used in `/help`). |
| `setUsageMessage(String)` | Usage hint shown when `onExecute` returns `false`. |
| `setPermission(String)` | Permission the sender must have. |
| `setPermissionMessage(String)` | Message shown when the permission check fails. |
| `setAliases(String...)` | Alternative command names. |

> The default proxy commands pass translation keys (like
> `"waterdog.command.server.description"`) to these methods so they can be
> localised via `lang.ini`. For your own plugin you can pass plain strings.

## `onExecute` — handling the command

```java
public abstract boolean onExecute(CommandSender sender, String alias, String[] args)
```

- **`sender`** — who ran the command (see [Command senders](#command-senders)).
- **`alias`** — the alias used, if the player triggered the command through one
  of its aliases (otherwise the base name).
- **`args`** — everything after the command name, split on spaces. For
  `/warp spawn 1` the array is `{"spawn", "1"}` (the command name itself is
  **not** included).

The **return value** controls the usage message:

- Return `true` if you handled the command (even if you showed your own error).
- Return `false` to tell the proxy to show the command's usage message.

> Arguments arrive as raw **strings**. You are responsible for validating them
> and converting types (e.g. `Integer.parseInt(args[0])`), and for handling bad
> input gracefully.

## Command senders

The `sender` is a `CommandSender`
(`dev.waterdog.waterdogpe.command.CommandSender`), which can be a player **or**
the console. Its key methods:

```java
String getName();
boolean isPlayer();
boolean hasPermission(String permission);
void sendMessage(String message);
void sendMessage(TextContainer message);
ProxyServer getProxy();
```

There are two built-in senders:

- **`ProxiedPlayer`** — a player in-game. `sendMessage` shows in their chat,
  `hasPermission` checks their permissions, `getName` is their username.
- **`ConsoleCommandSender`** — the proxy console. It has **all** permissions
  (`hasPermission` always returns `true`), `getName()` returns `"CONSOLE"`, and
  `sendMessage` logs at INFO level.

**Always check `isPlayer()` before casting to `ProxiedPlayer`.** If you cast a
console sender to a player your command will throw when run from the console:

```java
if (!sender.isPlayer()) {
    sender.sendMessage("§cThis command can only be used by players.");
    return true;
}
ProxiedPlayer player = (ProxiedPlayer) sender;
```

## Registering and unregistering

The command map (`dev.waterdog.waterdogpe.command.CommandMap`) is the registry
for all proxy commands. Reach it with `proxy.getCommandMap()`:

```java
CommandMap commands = this.getProxy().getCommandMap();

commands.registerCommand(new HubCommand());      // register
commands.registerAlias("h", new HubCommand());   // extra alias
commands.unregisterCommand("hub");               // remove (e.g. in onDisable)
boolean exists = commands.isRegistered("hub");
Command cmd = commands.getCommand("hub");
```

By default WaterdogPE uses a `SimpleCommandMap` with the `/` prefix and handles
permission and success checking for you. `DefaultCommandMap` extends it and
registers the proxy's built-in commands (`/server`, `/transfer`, etc.).

## Client-side autocompletion (advanced)

Bedrock clients can show command argument hints and tab-completion. By default
every command is given a single optional text argument. To customise the
arguments shown to the client, override `buildCommandOverloads()`.

> **Requirement:** client-side command injection must be enabled in the proxy
> `config.yml` with `inject_proxy_commands: true`, otherwise these hints are
> never sent.

The protocol types come from the CloudburstMC protocol library
(`org.cloudburstmc.protocol.bedrock.data.command.*`). Here is the real `/server`
command's definition, which shows a required `server` text argument and an
optional `player` target argument:

```java
import org.cloudburstmc.protocol.bedrock.data.command.CommandOverloadData;
import org.cloudburstmc.protocol.bedrock.data.command.CommandParam;
import org.cloudburstmc.protocol.bedrock.data.command.CommandParamData;

@Override
protected CommandOverloadData[] buildCommandOverloads() {
    CommandParamData server = new CommandParamData();
    server.setName("server");
    server.setOptional(false);
    server.setType(CommandParam.TEXT);

    CommandParamData player = new CommandParamData();
    player.setName("player");
    player.setOptional(true);
    player.setType(CommandParam.TARGET);

    return new CommandOverloadData[]{
        new CommandOverloadData(false, new CommandParamData[]{server, player})
    };
}
```

- Each `CommandOverloadData` is one **overload** (one valid way to call the
  command). Returning several lets the client suggest different argument shapes.
- `CommandParam` provides the data types the client understands —
  `TEXT`, `INT`, `TARGET` (a player), `FLOAT`, and so on.
- This only changes what the client *displays and suggests*. You still parse and
  validate `args` yourself in `onExecute`.

> **Migrating from WaterdogPE 1.x:** the old `craftNetwork()` method returning a
> `CommandData` (with `com.nukkitx.*` imports) has been replaced by
> `buildCommandOverloads()` returning `CommandOverloadData[]` (with
> `org.cloudburstmc.*` imports).

## Reacting to commands from elsewhere

If you want to *observe or block* commands rather than define them, subscribe to
`DispatchCommandEvent`, which is fired (and is cancellable) right before a player
dispatches a proxy command. See the [Events Guide](./events-guide).
