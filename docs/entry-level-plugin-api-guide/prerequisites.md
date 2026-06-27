---
title: Prerequisites
---

# Prerequisites

This guide assumes you have written a little Java before, but not necessarily
that you have made a Minecraft plugin. By the end of the Entry Level guide you
will have a working WaterdogPE plugin that you can drop into the proxy's
`plugins/` folder.

## What you will need

- **A Java 17 (or newer) JDK.** WaterdogPE itself runs on Java 17, and your
  plugin must target the same version. Make sure you install a *JDK* (which can
  compile code), not just a *JRE*.
- **An IDE that supports Maven.** We recommend
  [IntelliJ IDEA](https://www.jetbrains.com/idea/) (the free Community Edition
  is enough) or Eclipse. IntelliJ has excellent Maven integration and is what
  most WaterdogPE developers use.
- **An internet connection**, so Maven can download the WaterdogPE API and its
  dependencies the first time you build.

## How a plugin is structured

A WaterdogPE plugin is just a `.jar` file with two required pieces:

1. **A main class** that extends `dev.waterdog.waterdogpe.plugin.Plugin` and
   overrides at least the `onEnable()` method. This is the entry point the proxy
   calls when it loads your plugin.
2. **A `plugin.yml` file** (placed in `src/main/resources/`) that tells the
   proxy your plugin's name, version and which class is the main class.

A typical project looks like this:

```
my-plugin/
├── pom.xml                         ← Maven build file
└── src/
    └── main/
        ├── java/
        │   └── com/example/myplugin/
        │       └── MyPlugin.java   ← your main class
        └── resources/
            ├── plugin.yml          ← plugin descriptor
            └── config.yml          ← (optional) default config
```

- **`pom.xml`** is the Maven build file. It declares the WaterdogPE dependency
  and tells Maven how to compile your plugin into a runnable `.jar`.
- **`MyPlugin.java`** is your main class. It is usually named after the plugin.
- **`plugin.yml`** holds the basic information the proxy needs to load the
  plugin.
- **`config.yml`** is optional — a configuration file your users can edit to
  change how the plugin behaves.

## Next steps

1. [Maven Setup](./maven-setup) — set up the `pom.xml` so Maven can build your
   plugin.
2. [Your First Plugin](./first-plugin) — write the main class and `plugin.yml`,
   then build and load it.

After that, the [Plugin API](/plugins/introduction) section covers the things
plugins actually do: commands, events, working with players, scheduling tasks
and more.
