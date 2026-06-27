---
title: Suggested Plugins & Extensions
---

# Suggested Plugins & Extensions

WaterdogPE is intentionally a lean proxy — it handles routing players between
servers and gives plugins a powerful API, but it leaves higher-level features to
plugins and external projects. This section collects extensions we recommend for
common needs, with setup guides for each.

These are **optional add-ons**. You do not need any of them to run a proxy — pick
the ones that solve a problem you actually have.

## Available guides

### StarGate

[StarGate](/stargate-commons/stargate-modules) is a lightweight socket
communication service that lets the servers behind your proxy talk to each other
and to the proxy in real time — far better than polling a database for things
like player counts, cross-server messaging, or triggering transfers. Start with
[StarGate Modules](/stargate-commons/stargate-modules), then follow the
[Server Setup](/stargate-plugins/server-setup) and
[Client Setup](/stargate-plugins/client-setup) guides.

> StarGate is **not actively maintained** at the moment but is **still
> functional**. See its [repository](https://github.com/Alemiz112/StarGate) for
> the current state.

## Finding more plugins

- **[Public Plugins Page](https://plugins.waterdog.dev/)** — community plugins
  for WaterdogPE.
- **[Example-Plugins](https://github.com/WaterdogPE/Example-Plugins)** — small,
  complete plugins that demonstrate the API.
- **[Discord](https://discord.gg/QcRRzXX)** — ask for recommendations and get
  support.

Want to build your own instead? Head to the
[Entry Level Plugin API Guide](/entry-level-plugin-api-guide/prerequisites) and
the [Plugin API](/plugins/introduction) section.
