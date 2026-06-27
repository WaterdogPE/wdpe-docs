---
title: Maven Setup
---

# Maven Setup

Maven builds and compiles your plugin into a runnable `.jar` file. This page
shows a complete starting `pom.xml` and explains the parts you care about. If you
create your project through IntelliJ's "New Project → Maven" wizard, you can
replace the generated `pom.xml` with the one below.

## Base `pom.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xmlns="http://maven.apache.org/POM/4.0.0"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>MyPlugin</artifactId>
    <version>1.0.0</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.release>17</maven.compiler.release>
    </properties>

    <repositories>
        <repository>
            <id>waterdog-repo</id>
            <url>https://repo.waterdog.dev/main</url>
        </repository>
    </repositories>

    <dependencies>
        <dependency>
            <groupId>dev.waterdog.waterdogpe</groupId>
            <artifactId>waterdog</artifactId>
            <version>2.0.4-SNAPSHOT</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <!-- Lets {variables} in plugin.yml be filled in from the pom (optional but handy) -->
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
            </resource>
        </resources>
    </build>
</project>
```

> **Use the latest version.** `2.0.4-SNAPSHOT` is current at the time of writing.
> WaterdogPE 2.x runs on Java 17 and uses the
> [CloudburstMC protocol library](https://github.com/CloudburstMC/Protocol)
> (`org.cloudburstmc.protocol.*`). If you are following an old tutorial that
> uses `com.nukkitx.*` packages, `pe.waterdog.*` packages, or Java 11, it is out
> of date. Check the [repository](https://repo.waterdog.dev/main) or the
> [Discord](https://discord.gg/QcRRzXX) for the newest version number.

### Explanation

- **Project coordinates** — `groupId`, `artifactId` and `version` identify your
  own plugin. Set them to whatever you like (e.g.
  `groupId` = your reversed domain, `artifactId` = the plugin name).
- **Repository** — `https://repo.waterdog.dev/main` is where the WaterdogPE API
  is published. Maven needs this to download the dependency.
- **Dependency** — the WaterdogPE API. The scope is **`provided`** because the
  proxy already contains WaterdogPE at runtime; you only need it to compile
  against, not bundled into your jar.
- **`maven.compiler.release` = 17** — compiles your plugin for Java 17, matching
  the proxy.
- **Resource filtering** — optional. With it enabled you can write things like
  `version: ${project.version}` in `plugin.yml` and Maven will substitute the
  value from the pom at build time.

## Building

From your project folder run:

```bash
mvn clean package
```

The finished plugin appears in the `target/` directory as
`MyPlugin-1.0.0.jar`. Copy that file into your proxy's `plugins/` folder and
restart the proxy. (In IntelliJ you can also run the `package` Maven goal from
the Maven tool window.)

## Shading (bundling extra libraries)

The `provided` WaterdogPE dependency is already on the proxy, so it is **not**
included in your jar. But if your plugin uses *other* third-party libraries
(for example a database driver or an HTTP client), those are **not** on the
proxy and must be bundled into your jar — a process called **shading**.

Add the `maven-shade-plugin` to the `<build><plugins>` section of your `pom.xml`:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-shade-plugin</artifactId>
            <version>3.5.1</version>
            <executions>
                <execution>
                    <phase>package</phase>
                    <goals>
                        <goal>shade</goal>
                    </goals>
                    <configuration>
                        <createDependencyReducedPom>false</createDependencyReducedPom>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

Any dependency whose scope is **not** `provided` will now be packed into the
final jar. Don't be surprised when the file gets larger — that is expected,
because it now contains those libraries.

> **Tip:** Keep WaterdogPE itself on the `provided` scope. Shading the whole
> proxy into your plugin will bloat the jar and can cause class conflicts.

## Next step

You now have a project that builds. Continue to
[Your First Plugin](./first-plugin) to write the actual code.
