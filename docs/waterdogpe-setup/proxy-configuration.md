---
title: Proxy Configuration
---

# Proxy Configuration

'WaterdogPE uses `config.yml` file to store all general settings which will be loaded on startup. Default messages are stored in `lang.ini` file.
## Configuration
Configuration is already commented inside of the file so lets point out only some details.

### Login Extras
Login extras are used to pass modified, added variables in client data. Some softwares does not like adding custom attributes to client skin or chain data. If `use_login_extras` is disabled proxy won't add any extra attributes.

#### Ip Forward
One of the extra attributes is `Waterdog_IP`. Because connecion with downstream is initialized by proxy, downstream server thinks that address if proxy is the address of client. This attribute is used to send original address of upstream.

### Prefer Fast Transfer
Proxy has the ablility to handle `TransferServer` packet sent by downstream and use its address and port to determine new downstream. If this option is enabled and new downstream was found WDPE will transfer player without disconecting from proxy (using "fast" transfer).

### Fast Codec
Because proxy is bridge between client and downstream every packet has to pass thought it. When lot of clients are connected it may be resources-intensive to decode and than encode every packet. Enabling `use_fast_codec` option will load customized protocol codec which will pass original data of packets that are not handled by proxy.

**This feature may cause problems with some plugins!** If your plugin is using any packet which is not registered in customized codec, it will throw an exception. For those who would like to use fast codec and send other packets we have created event which will be called before codec registration. Please refer to code documentation.

### Compression Settings
Data sent between client, downstream and proxy are compressed to save bandwidth. But choosing wrong, too high compression level may be CPU intensive.  
Higher level = more CPU, less bandwidth usage. Set to 0 to no compression, 9 to highest compression ratio.

#### Downstream Compression
Compression between downstream and proxy could be usually disabled or at least lowered. Proxy should have fast enough connection to downstream server. Use `downstream_compression_level` to set proxy to downstream compression level.

#### Upstream compression
Some clients may have slower connection to your server therefore it is recommended to compress data. Do not set compression level too high or performance may drop. Use `downstream_compression_level` to set proxy to client compression level.

### Education Edition mode
If downstream server has enabled education features, `enable_edu_features` option should be enabled or game may start crashing.  
When this option is enabled, additional education resource pack is applied in order to load required education resources. **Note that this resources can be encorced only when** `enable_packs` **option is enabled.**

### Resource Pack Caching
When client downloads resource pack its data are sent in chunks to prevent sending large payloads. This chunks are created from resource pack file. Every client can request different part of file (different chunk). Therefore chunk is every time loaded from original file. This may cause higher disk IO with lot of joining clients. To improve performance, data of resource pack can be cached. **Caching big resource packs will use more RAM**. Use `pack_cache_size` to limit maximum pack size (in MB) to be cached. If size of pack is bigger, it won't be cached.

### Idle Threads
WaterdogPE uses threaded executors for scheduler and asynchronous event executing. Executor will destroy unused idle threads. You can specify count of idle threads which will not be destroyed using `default_idle_threads`. Set to `-1` to auto-detect idle threads count by CPU cores.

### Example config:
```yaml
# Waterdog Main Configuration file
# Configure your desired network settings here.

# A list of all downstream servers that are available right after starting
# address field is formatted using ip:port
# publicAddress is optional and can be set to the ip players can directly connect through
servers:
  lobby1:
    address: 127.0.0.1:19133
    public_address: play.myserver.com:19133
listener:
  # The Motd which will be displayed in the server tab of a player and returned during ping
  motd: §bWaterdog§3PE
  # The server priority list. If not changed by plugins, the proxy will connect the player to the first of those servers
  priorities:
  - lobby1
  # The address to bind the server to
  host: 0.0.0.0:19132
  # The maximum amount of players that can connect to this proxy instance
  max_players: 20
  # Map the ip a player joined through to a specific server
  # for example skywars.xyz.com => SkyWars-1
  # when a player connects using skywars-xyz.com as the serverIp, he will be connected to SkyWars-1 directly
  forced_hosts: {}
# Case-Sensitive permission list for players (empty using {})
permissions:
  TobiasDev:
  - waterdog.player.transfer
  - waterdog.player.list
  alemiz003:
  - waterdog.player.transfer
  - waterdog.player.list
# List of permissions each player should get by default (empty using [])
permissions_default:
- waterdog.command.help
- waterdog.command.info
# Whether the debug output in the console should be enabled or not
enable_debug: false
# If enabled, encrypted connection between client and proxy will be created
upstream_encryption: true
# If enabled, only players which are authenticated with XBOX Live can join. If disabled, anyone can connect *with any name*
online_mode: true
# If enabled, the proxy will be able to bind to an Ipv6 Address
enable_ipv6: false
# If enabled, the proxy will pass information like XUID or IP to the downstream server using custom fields in the LoginPacket
use_login_extras: true
# Replaces username spaces with underscores if enabled
replace_username_spaces: false
# Whether server query should be enabled
enable_query: true
# If enabled, when receiving a McpeTransferPacket, the proxy will check if the target server is in the downstream list, and if yes, use the fast transfer mechanism
prefer_fast_transfer: true
# Fast-codec only decodes the packets required by the proxy, everything else will be passed rawly. Disabling this can create a performance hit
use_fast_codec: true
# If enabled, the proxy will inject all the proxy commands in the AvailableCommandsPacket, enabling autocompletion
inject_proxy_commands: true
# Upstream server compression ratio(proxy to client), higher = less bandwidth, more cpu, lower vice versa
upstream_compression_level: 6
# Upstream server compression ratio(proxy to downstream server), higher = less bandwidth, more cpu, lower vice versa
downstream_compression_level: 2
# Education features require small adjustments to work correctly. Enable this option if any of downstream servers support education features.
enable_edu_features: false
# Enable/Disable the resource pack system
enable_packs: true
# Whether texture packs should be enforced
force_apply_packs: false
# You can set maximum pack size in MB to be cached.
pack_cache_size: 16
# Creating threads may be in some situations expensive. Specify minimum count of idle threads per internal thread executors. Set to -1 to auto-detect by core count.
default_idle_threads: -1
```

## Language Settings
Default messages can be edited in `lang.ini` file.
### Format
Proxy uses TranslationContainer to translate translation key to real message. It replaces patterns (`{%0}, {%1}, ...`) with pre-assigned values.  
**Example:**
```ini
waterdog.query.start=Started query on address {%0}
```'
