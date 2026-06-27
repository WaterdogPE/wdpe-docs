---
title: Your First Plugin
---

# Your First Plugin

With the [Maven project set up](./maven-setup), you can now write a real plugin.
This page builds the smallest plugin that does something, and explains every
piece so you understand *why* it works.

## The main class

Every plugin has one **main class** that extends
`dev.waterdog.waterdogpe.plugin.Plugin`. The proxy creates one instance of it
and calls its lifecycle methods.

Create `src/main/java/com/example/myplugin/MyPlugin.java`:

```java
package com.example.myplugin;

import dev.waterdog.waterdogpe.plugin.Plugin;

public class MyPlugin extends Plugin {

    @Override
    public void onEnable() {
        // Called when the proxy enables your plugin. Put your setup here:
        // register commands, subscribe to events, start tasks, etc.
        this.getLogger().info("MyPlugin has been enabled!");
    }

    @Override
    public void onDisable() {
        // Called on proxy shutdown or when the plugin is disabled.
        // Clean up here: close connections, save data, cancel tasks.
        this.getLogger().info("MyPlugin has been disabled!");
    }
}
```

### The plugin lifecycle

The `Plugin` class gives you three methods you can override. Only `onEnable()`
is required.

| Method | When it runs | Typical use |
| --- | --- | --- |
| `onStartup()` | After the plugin is loaded, **before** it is enabled (and before the proxy has finished starting). | Load critical data or open connections that must exist before other plugins enable. Most plugins don't need this. |
| `onEnable()` *(required)* | Once the proxy startup is complete and plugins are being enabled. | Register commands and events, schedule tasks, read config — your main setup. |
| `onDisable()` | On proxy shutdown, or when the plugin is disabled. | Clean up: save data, close connections, cancel tasks. |

> **Why `onEnable()` and not the constructor?** When your constructor runs, the
> plugin is not fully initialised yet — helpers like `getProxy()` and
> `getLogger()` are not available. Always do your setup in `onEnable()`.

### Useful methods you inherit

Because you extend `Plugin`, these are available via `this.`:

| Method | Returns | Description |
| --- | --- | --- |
| `getProxy()` | `ProxyServer` | The proxy instance — your gateway to almost everything (players, servers, scheduler, events, commands). See the [Plugin API introduction](/plugins/introduction). |
| `getLogger()` | `Logger` | A logger that prefixes messages with your plugin name. Use `info()`, `warn()`, `error()`. |
| `getDataFolder()` | `File` | Your plugin's own folder (`plugins/<name>/`), created automatically. Store your files here. |
| `getConfig()` | `Configuration` | Loads `config.yml` from your data folder (copying it from your jar on first run). |
| `saveResource(String)` | `boolean` | Copies a file bundled in your jar into the data folder. |
| `getResourceFile(String)` | `InputStream` | Reads a file bundled inside your jar. |
| `getName()` | `String` | Your plugin's name from `plugin.yml`. |

## The `plugin.yml`

The proxy needs a descriptor to know how to load your plugin. Create
`src/main/resources/plugin.yml`:

```yaml
name: MyPlugin
version: 1.0.0
author: YourName
main: com.example.myplugin.MyPlugin
```

The fields are:

| Field | Required | Description |
| --- | --- | --- |
| `name` | **yes** | The plugin's name. Also used for the data folder and logger prefix. |
| `main` | **yes** | The fully-qualified name of your main class (package + class name). This **must** match your class exactly. |
| `version` | recommended | Your plugin's version string. |
| `author` | optional | Your name. |
| `depends` | optional | A list of other plugin names that must load before yours. See below. |

> WaterdogPE also accepts the file named `waterdog.yml`. `plugin.yml` is the
> conventional choice and is what most examples use.

### Depending on another plugin

If your plugin needs another plugin to be loaded first, list it under `depends`:

```yaml
name: MyPlugin
version: 1.0.0
main: com.example.myplugin.MyPlugin
depends:
  - SomeOtherPlugin
```

WaterdogPE loads dependencies before your plugin and detects circular
dependencies. To grab another loaded plugin instance from code:

```java
Plugin other = this.getProxy().getPluginManager().getPluginByName("SomeOtherPlugin");
if (other != null && other.isEnabled()) {
    // safe to use it
}
```

## Build and run

1. Build the jar: `mvn clean package`.
2. Copy `target/MyPlugin-1.0.0.jar` into your proxy's `plugins/` folder.
3. Start the proxy. You should see your `onEnable()` log line:
   `[MyPlugin] MyPlugin has been enabled!`

If the plugin doesn't load, double-check that the `main` field in `plugin.yml`
exactly matches your class's package and name.

## Where to go next

Your plugin works — now make it *do* something:

- [Plugin API Introduction](/plugins/introduction) — the `ProxyServer` object and
  how the pieces fit together.
- [Working with Players](/plugins/players-guide) — message, transfer and manage
  players.
- [Commands Guide](/plugins/commands-guide) — add your own `/commands`.
- [Events Guide](/plugins/events-guide) — react to joins, chat, transfers and more.
- [Scheduling Tasks](/plugins/scheduling-task) — run delayed and repeating tasks.

You can also browse complete, working examples in the
[Example-Plugins repository](https://github.com/WaterdogPE/Example-Plugins).
