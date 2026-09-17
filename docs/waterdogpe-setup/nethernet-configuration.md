---
title: NetherNet Configuration
---

# NetherNet Configuration

NetherNet is the modern network transport for Minecraft: Bedrock Edition, replacing the legacy RakNet transport. RakNet was removed in 1.26.60 across both the client and Bedrock Dedicated Server (BDS).

Built on top of standard WebRTC technologies (ICE, DTLS data channels, and SCTP multiplexing), NetherNet provides improved connection reliability, faster handshakes, and modern cryptographic security.

WaterdogPE includes native, dual-stack NetherNet support alongside RakNet, allowing clients to connect using either transport simultaneously without requiring separate proxy instances.

## How NetherNet Operates

NetherNet separates connection negotiation (**Signaling**) from packet transport (**Media**):

1. **Signaling (TCP / HTTP or HTTPS):**
   - The Bedrock client negotiates connections using two HTTP endpoints on the signaling port:
     - `GET /v1/join`: The status and probe endpoint (capability check and MOTD advertisement). The client queries this first, and only proceeds to join if it receives a `200` response.
     - `POST /v1/join/{networkId}`: The actual join endpoint where the client submits its WebRTC SDP offer and receives the proxy's SDP answer.
   - By default, signaling binds to the same port as `listener.host`. Because RakNet binds **UDP** and HTTP signaling binds **TCP**, both run concurrently on the exact same port without conflict.
2. **Media (UDP / WebRTC):**
   - Gameplay packets travel over WebRTC data channels inside DTLS.
   - Because RakNet already holds the listener port on UDP with `SO_REUSEPORT`, NetherNet media requires its own UDP socket. This is configured via `udp_port`.

### Dual-Stack Architecture

With NetherNet enabled:
- Older clients connect over **RakNet** (`19132 UDP`).
- Newer NetherNet-enabled clients perform signaling over **HTTP/HTTPS** (`19132 TCP`) and stream media over **WebRTC** (`19133 UDP` or ephemeral).
- Both player types can play together on the same proxy and transfer between backend servers seamlessly.

## Port & Network Configuration

| Protocol | Port | Configuration Key | Purpose |
| :--- | :--- | :--- | :--- |
| **UDP** | `19132` (or listener port) | `listener.host` | RakNet client connections |
| **TCP** | `19132` (mirrors listener port by default) | `nethernet.signaling_port` | NetherNet HTTP / HTTPS signaling |
| **UDP** | Configured port (e.g. `19133`) or ephemeral | `nethernet.udp_port` | NetherNet WebRTC media |

### Media Port (`udp_port`)

- **`udp_port: 0` (Default):** Allocates an ephemeral UDP port per peer. No fixed secondary UDP port needs to be opened, but each client receives a different port.
- **`udp_port: <port>` (e.g. `19133`):** Binds a single dedicated UDP port that multiplexes all NetherNet peers over one socket using ICE UDP muxing. This port **must not** be the listener port (which RakNet already holds). A fixed `udp_port` is required when using the `nxs` or `hybrid` signaling modes.

## Configuration Reference (`config.yml`)

The NetherNet settings are located under the `nethernet:` section in `config.yml`.

```yaml
nethernet:
  # Accept NetherNet connections alongside RakNet
  enabled: false

  # How the proxy obtains SDP offers from clients:
  # - builtin: the proxy serves the HTTP signaling endpoint on the listener port
  # - nxs: the proxy registers with the provider configured below and it hands over players
  # - hybrid: both, so players can arrive either way
  # - plugin: nothing is bound, a plugin feeds offers through the signaling API
  signaling_mode: builtin

  # TCP port for the signaling endpoint. 0 mirrors the listener port, which is what clients expect
  signaling_port: 0

  # Dedicated UDP port for NetherNet media, one socket for every peer.
  # It must not be the listener port, which RakNet already holds.
  # 0 picks an ephemeral port per peer, which needs no fixed port open but publishes a different one to every client.
  udp_port: 0

  # Addresses put in the ICE candidates clients connect to. Empty derives them from the
  # listener bind address. Set it when clients reach a different address or the listener
  # binds a wildcard. An address this machine does not hold is announced as the public side
  # of a NAT forwarding udp_port here, same port. Media bypasses a signaling reverse proxy,
  # so its address only belongs here if it forwards the media port too.
  advertise_addresses: []

  # STUN and TURN servers ICE may use, such as stun:stun.l.google.com:19302.
  # A proxy behind NAT needs STUN to learn its public address, TURN relays when no direct
  # path exists. TURN credentials go in the URL, as turn:user:password@host:3478.
  # NOTE: Adding STUN/TURN servers introduces candidate gathering rounds that can slow down
  # connection times. Do not configure them if the proxy is publicly accessible (not behind NAT).
  ice_servers: []

  # Addresses allowed to set X-Forwarded-For on signaling requests, as hosts or CIDR ranges
  # such as 10.0.0.0/8. An http or https entry is fetched and read as one address per line.
  # Needed when a reverse proxy fronts the signaling port, so the real client address survives.
  trusted_proxies: []

  # Read a HAProxy PROXY header, v1 or v2, on signaling connections from a trusted_proxies
  # address. Connections without one are still served and fall back to X-Forwarded-For.
  proxy_protocol: false

  # Serves signaling over HTTPS as well as HTTP, on the same port
  https:
    # Either a PEM chain, with its key in private_key, or a PKCS12 file, leaving that empty.
    # Clients that reach signaling over TLS never see the first use trust prompt.
    # Empty serves plaintext only.
    certificate: ""

    # PEM private key for the certificate. Leave empty when that is a PKCS12 file
    private_key: ""

    # Password for the PKCS12, or for the PEM key if it is encrypted.
    # file:/path/to/password reads it from a file, which is the better place for it.
    password: ""

  # Unencrypted PEM private key holding the P-384 key identifying this operator to
  # clients, generated on first start. Share it across a fleet to be trusted as one
  # operator; replacing it re-prompts every returning player.
  identity_file: keys/identity.pem

  # Operator name shown in the first use trust prompt. Empty falls back to listener.name.
  # Clients pin the key, not the name, so changing it prompts nobody again.
  identity_domain: ""

  # Seconds a connection has to finish ICE and DTLS before it is dropped
  handshake_timeout: 30

  # Seconds a server_type: bedrock downstream remembers which transport worked, so not every
  # join probes. A failure on the remembered transport switches at once. 0 probes every join.
  transport_memory: 300

  # Maximum concurrent NetherNet connections. 0 follows the global player limit
  max_connections: 0

  # Settings for the NXS signaling provider. Only used in the nxs and hybrid modes
  nxs:
    # Provider origin used for discovery and registration
    endpoint: https://agent.warden.cloud

    # Bearer token, or file:/path/to/token. Empty registers anonymously
    token: ""

    # Reachable UDP endpoints, as 198.51.100.1:19133 or [2001:db8::1]:19133.
    # Empty derives them from the addresses this host holds, which is wrong behind a NAT
    # or a forwarder. Name the endpoint players actually reach in that case.
    advertise_addresses: []

    # Instance metadata. The region and pool keys place this instance,
    # anything else is a registration tag.
    data: {}
```

## Detailed Option Descriptions

### Signaling & Endpoints

- **`enabled`**: Toggles NetherNet support. When disabled (`false`), only RakNet connections are accepted.
- **`signaling_mode`**:
  - `builtin`: Serves the HTTP signaling endpoint directly on the listener port.
  - `nxs`: Registers with the configured NXS provider (`nethernet.nxs`), which admits players and hands them over to the proxy.
  - `hybrid`: Enables both `builtin` signaling and `nxs` registration simultaneously.
  - `plugin`: Does not bind any signaling endpoint; a plugin feeds connection offers through the NetherNet signaling API.
- **`signaling_port`**: The TCP port for the signaling endpoint. When set to `0`, it uses the port defined in `listener.host`.
- **`max_connections`**: Maximum concurrent NetherNet connections allowed. When set to `0`, the limit follows `listener.max_players`.

### NAT & ICE Configuration

- **`advertise_addresses`**: Addresses placed into ICE candidates sent to connecting clients. If left empty, addresses are derived from the listener bind address. If clients reach the proxy via a public IP or if the listener binds a wildcard (`0.0.0.0`), specify the reachable public address here.
- **`ice_servers`**: A list of STUN and TURN server URLs. STUN allows proxies behind NAT to discover their public-facing address. TURN relays traffic when direct peer-to-peer connectivity cannot be established. Credentials must be embedded in the TURN URL (e.g. `turn:user:password@host:3478`).

> [!WARNING]
> Adding extra STUN or TURN servers causes the ICE agent to perform additional gathering and connectivity checks, which can noticeably slow down connection and handshake times. **Do not configure STUN or TURN servers if the proxy is directly publicly accessible (e.g. has a public IP and is not behind NAT).**

### HTTPS / TLS Signaling

- **`https`**: Serves HTTPS on the same port as HTTP.
  - **`certificate`**: Path to a PEM certificate chain or a PKCS12 file.
  - **`private_key`**: Path to the PEM private key (leave empty if using PKCS12).
  - **`password`**: Password for PKCS12 or encrypted PEM key. Supports `file:/path/to/password` syntax to read the password from a file.
- **Trust Prompt Bypass**: When a player connects to an HTTP NetherNet endpoint for the first time, Minecraft Bedrock displays a **"First-use trust prompt"** asking the player to verify the operator identity. Clients that connect to the signaling endpoint over **TLS/HTTPS** do not see this prompt.

### Operator Identity

- **`identity_file`**: Path to an unencrypted PEM file containing the P-384 ECDSA key that identifies the proxy operator to clients. Generated automatically on first launch if it does not exist.
  - In a multi-proxy cluster or fleet behind a load balancer, distribute the same `identity_file` to all proxies. If instances use different keys, returning players routed to a different instance will see a trust prompt indicating the operator key changed.
- **`identity_domain`**: The operator name displayed in the first-use trust prompt. If left empty, it falls back to `listener.name` (or `name`). Clients pin the key rather than the domain name.

### Reverse Proxies & Forwarding

If you route signaling traffic through an upstream reverse proxy (such as HAProxy, Nginx, or Cloudflare):

> [!IMPORTANT]
> **Reverse Proxy Routing Requirements:**
> Connecting clients require access to two distinct endpoints on the signaling port:
> 1. `GET /v1/join` — The capability and status probe. The client checks this first, and only proceeds if it receives a `200` OK response.
> 2. `POST /v1/join/{networkId}` — The actual join endpoint where the client submits its SDP offer.
>
> Your reverse proxy **must forward both `/v1/join` and `/v1/join/*`** to WaterdogPE. If `/v1/join` is blocked or fails to return `200`, clients will abort the connection immediately.

- **`trusted_proxies`**: Addresses (hostnames or CIDR blocks like `10.0.0.0/8`) authorized to pass the real client address via `X-Forwarded-For`. URL entries (`http://` or `https://`) are fetched and read as one address per line (useful for Cloudflare IP lists).
- **`proxy_protocol`**: Enables parsing HAProxy PROXY protocol headers (v1 or v2) on TCP signaling connections coming from `trusted_proxies`. Connections without a PROXY header fall back to `X-Forwarded-For`.

## Downstream Server Configuration

In `config.yml`, downstream servers configured under `servers:` use the `server_type` setting to determine the transport:

```yaml
servers:
  lobby:
    address: 127.0.0.1:19133
    server_type: bedrock      # Discovered transport (Default)
  nethernet_node:
    address: 10.0.0.2:19134
    server_type: nethernet    # Pinned to NetherNet
  raknet_node:
    address: 10.0.0.3:19135
    server_type: raknet       # Pinned to RakNet
```

### Server Types

1. **`server_type: bedrock` (Default):**
   - Automatically discovers whether the downstream server runs NetherNet or RakNet.
   - On connect, the proxy probes the server's HTTP signaling endpoint (`HttpClientSignaling.probe`). If NetherNet is supported, it connects via NetherNet; otherwise, it falls back to RakNet.
   - The working transport is remembered for `nethernet.transport_memory` seconds (default: `300`).
   - If a connection attempt on the remembered transport fails, the proxy immediately attempts the other transport and switches to it without waiting for `transport_memory` to expire.
2. **`server_type: nethernet`:**
   - Pins the downstream connection exclusively to NetherNet (`NetherNetServerInfo`).
3. **`server_type: raknet`:**
   - Pins the downstream connection exclusively to RakNet (`BedrockServerInfo`).

## Commands & Diagnostics

### `/wdnethernet`

- **Permission:** `waterdog.command.nethernet`
- **Environment:** Proxy console only.

Commands:
- **`wdnethernet`** (no arguments): Shows an overview of the transport status:
  - Running state (`yes` / `no`)
  - Configured signaling mode (`builtin`, `nxs`, `hybrid`, `plugin`)
  - Bound ICE port (`udp/<port>` or `ephemeral`)
  - Active signaling bindings, bind addresses, and count of pending joins
  - Provider registration state (when in `nxs` or `hybrid` mode)
  - Connection acceptance status and connection limit
  - Number of players currently connected over NetherNet
  - Operator identity domain and public key SHA-256 fingerprint
- **`wdnethernet status`**:
  - `wdnethernet status`: Displays the JSON representation of `ServerStatus` reported to the provider.
  - `wdnethernet status automatic`: Restores automatic provider status reporting.
  - `wdnethernet status set <base64url JSON snapshot>`: Overrides the provider status using a base64url-encoded JSON snapshot.
- **`wdnethernet diagnostics`**: Outputs JSON diagnostics containing signaling binding details (bind address, active state, pending joins, network ID), provider channel metrics (native creation attempts, live native peers, dropped events, admission/native stats), and provider readiness.

### `/wdme [player]`

- **Permission:** `waterdog.command.me` (included in `permissions_default`)
- **Permission for other players:** `waterdog.command.me.other`

Reports real-time connection telemetry:
- **Client to proxy (Upstream):**
  - Client version and protocol number
  - Device platform and model
  - Xbox authentication status
  - Hostname used to join
  - Transport (`RakNet` or `NetherNet`)
  - Signaling method (`provider admission`, `builtin http`, `outbound`, or `external`)
  - ICE path and candidate types (`host`, `srflx`, or `relay`)
  - Encryption type (`AES-CTR`, `AES-CFB8`, or `none (DTLS protects the transport instead)`)
  - Compression algorithm and level
- **Proxy to server (Downstream):**
  - Connected server name and `server_type`
  - Transport in use
- **Ping:**
  - Player to proxy latency
  - Proxy to server latency
  - End-to-end latency sum through the proxy

## Troubleshooting & Diagnostics

### Diagnostic Flags

The following Java system properties can be passed to WaterdogPE at startup:

- **`-Dwaterdog.nethernetLog=WARN`**: Sets the log level for the native ICE and DTLS library (`libdatachannel`). Accepts standard logging thresholds (e.g. `DEBUG`, `INFO`, `WARN`, `ERROR`).
- **`-Dwaterdog.packetTrace=true`**: Logs every packet crossing the proxy with direction and socket address.

### Common Issues

- **Connection Timeouts / Pending Joins Accumulate:**
  If the `pending joins` counter in `/wdnethernet` rises while players cannot connect, TCP signaling succeeded but the WebRTC media traffic on `nethernet.udp_port` is not reaching the proxy. Check that your media UDP port is open in firewalls and forwarded to the proxy.
- **Reverse Proxy Misconfiguration:**
  If players cannot join through a reverse proxy, ensure that both `GET /v1/join` and `POST /v1/join/{networkId}` are forwarded, and that the proxy's IP is listed under `trusted_proxies`.
- **Native Library Failure:**
  WaterdogPE bundles `libdatachannel` for standard 64-bit architectures. If the native library fails to load on your platform, an error will be logged on startup and WaterdogPE will degrade to RakNet-only mode.
