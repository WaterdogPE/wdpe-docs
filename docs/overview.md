---
title: Overview
---

# What is WaterdogPE?

**WaterdogPE** (often shortened to **WDPE**) is a *proxy* for Minecraft: Bedrock
Edition. A proxy sits between your players and your actual game servers and acts
as a single front door to your whole network.

Without a proxy, every game server is its own island: a player has to disconnect
from one and manually connect to another to switch. With WaterdogPE, players
connect **once** — to the proxy — and can be moved between servers seamlessly,
without ever leaving the game. This is how networks build a lobby, minigames,
survival worlds and more that all feel like "one server".

## How everything connects

```
     ┌──────────┐    ┌──────────┐    ┌──────────┐
     │ Player A │    │ Player B │    │ Player C │     Minecraft: Bedrock clients
     └────┬─────┘    └────┬─────┘    └────┬─────┘
          │               │               │
          │      Bedrock protocol over RakNet (UDP)
          └───────────────┼───────────────┘
                          ▼
              ╔═══════════════════════╗
              ║      WaterdogPE       ║    the proxy — the only address
              ║       (proxy)         ║    players ever connect to
              ╚═══════════╤═══════════╝
                          │
                          │   Bedrock protocol (proxy ⇄ downstream server)
        ┌─────────────────┼──────────────────┐
        ▼                 ▼                   ▼
 ┌────────────┐    ┌────────────┐     ┌────────────┐
 │   Lobby    │    │  SkyWars   │     │  Survival  │    "downstream" servers
 │(PocketMine)│    │  (Nukkit)  │     │(PocketMine)│    (run in offline mode)
 └────────────┘    └────────────┘     └────────────┘
```

- **Players** only ever connect to the **proxy**. They use one address and one
  port, no matter how many servers are behind it.
- The **proxy** keeps a live connection to each **downstream server** (your game
  servers). It forwards packets in both directions, and can read or modify them
  along the way — which is what makes features like commands and transfers
  possible.
- To switch a player's server, the proxy opens a connection to the new
  downstream server and hands the player over. The player stays connected to the
  proxy the whole time, so the switch is seamless.

## Upstream vs downstream

You will see these two words throughout the docs:

| Term | Means | Example |
| --- | --- | --- |
| **Upstream** | The connection between a **player** and the **proxy**. | The player ⇄ WaterdogPE link. |
| **Downstream** | The connection between the **proxy** and a **game server**. | WaterdogPE ⇄ Lobby link. |

So "downstream servers" are simply your actual Minecraft servers (PocketMine-MP,
Nukkit, etc.) that sit behind the proxy.

## Authentication: who logs in where

This trips up most newcomers, so it's worth stating plainly:

- The **proxy** authenticates players with **Xbox Live** (when `online_mode` is
  enabled in `config.yml`). This keeps your network secure.
- Your **downstream servers** must run in **offline mode** (`xbox-auth=false`),
  because they receive players that the proxy has *already* authenticated. If a
  downstream server tries to authenticate again, players can't connect.

The proxy can also pass details like the player's real IP and Xbox ID (XUID) down
to the game servers, so they still know who the player is. See
[Starting Waterdog](/waterdogpe-setup/starting-waterdog) for the exact settings.

## What WaterdogPE does and doesn't do

**It handles:**

- Accepting player connections and routing them to a server.
- Moving players between servers (transfers / fallback when a server dies).
- A plugin API to customise routing, commands, events and more.
- Server-list MOTD/ping, resource packs, compression and encryption.

**It deliberately leaves to plugins/servers:**

- Gameplay, worlds, blocks, entities — those live on the downstream servers.
- Higher-level features like economy, ranks or cross-server chat, which are
  added through [plugins](/plugins/introduction) or
  [extensions](/extensions/introduction).

## Talking between servers

Sometimes servers need to share information (player counts, cross-server
messages, "send this player to SkyWars"). The proxy can do some of this, but for
real server-to-server messaging the recommended approach is a dedicated
communication layer such as [StarGate](/extensions/introduction). See
[Proxy Communication](/plugins/proxy-communication) for the trade-offs.

## Where to go next

- **[Get the proxy running](/waterdogpe-setup/starting-waterdog)** — download,
  configure and start WaterdogPE.
- **[Write your first plugin](/entry-level-plugin-api-guide/prerequisites)** —
  set up a project and build a plugin.
- **[Plugin API](/plugins/introduction)** — commands, events, players,
  scheduling and more.
