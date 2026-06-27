---
title: Troubleshooting
---

# Troubleshooting

'This page covers errors casually reported by users and how to resolve them.

# Setup 

### Access proxy running on localhost
When binding the proxy to localhost, windows enforces program restrictions preventing minecraft from accessing the server. 
These restrictions can be lifted by running the following command *in an administrator shell*

```CheckNetIsolation LoopbackExempt -a -n="Microsoft.MinecraftUWP_8wekyb3d8bbwe"```

### Wrong java version
The following error can be observed if you start WaterdogPE with the wrong java version:

```Exception in thread "main" java.lang.UnsupportedClassVersionError: dev/waterdog/WaterdogPE has been compiled by a more recent version of the Java Runtime (class file version 55.0), this version of the Java Runtime only recognizes class file versions up to 52.0```

This happens when you try to run WaterdogPE using Java 8, meanwhile WaterdogPE is built using Java 11. To resolve this, run it using Java 11.

### JSON property "Waterdog_XUID" does not exist
WaterdogPE passes down information like XUID and IP to the downstream server using custom fields in the Login Packet. If you are using any version of Pocketmine (API 3 or API 4), you may encounter the above error.

In order to resolve this issue, you should disable the property "use_login_extras" in your WaterdogPE configuration file `config.yml` to match:

```
use_login_extras: false
```


### java.util.concurrent.TimeoutException
When you get kicked for a screen like this:
![](/img/image-1654783120819.png)

Likelihood is extremely high that this is a configuration error. It means that the proxy is not able to communicate with the game server you're trying to join. This can most commonly be a firewall issue, configuration mistake or something along those lines.
Before you report this as an error or request support, make sure to check the following boxes:
- Are the IP and port in the config.yml correct?
- Is the server running the latest version of the config.yml?
- Can I join the server with the same credentials directly through Minecraft?
- Is there any message on the game server about the player trying to join (turn on debug)
- Can I ping the target machine?

If all of these questions did not help you find the issue, then you can ask for support on our support discord.

### "You need to authenticate to Microsoft services"
This issue usually occurs when a user is either not logged into XBox Live and the proxy has online-mode enabled or the downstream server has online-mode enabled.

To resolve this, make sure you are signed in to Xbox Live in Minecraft and that all your downstream servers have the "xbox-auth" option disabled.

### "XUID does not match"
Because of a security vulnerability which users could use to join with the same XBox username like an already existing one, server softwares like PocketMine-MP compare the XUID to the account name. An account won't be able to join if the XUID mismatches with a  previous XUID.

To resolve this issue, delete the .dat file of that player or set the "player.verify-xuid" option in your pocketmine.yml to false.

That should look like this:
```yaml
player:
  verify-xuid: false
  ```
  
  
### Resource pack manifest.json is invalid or was not found
This error means that your resource pack was not properly formatted.

> It is important that you zip the content of the pack, not the folder.

That means, when you have your resource pack, you select all the files in the folder of the manifest.json and zip those files. You **do not** zip the folder that contains the manifest.json.'
