# TabPuppet

TabPuppet is a firefox add-on for synchronizing click events across browser instances. 
It works by establishing a peer-to-peer connection (via a WebRTC Data Channel) and sending 
the XPATH of any elements clicked at the "host" machine to any number of connected "client" machines (star topology).

## Progress

- [x] establish a peer-to-peer connection using a signalling server
- [x] mirror clicks from one tab to another via the peer-to-peer connection
- [x] allow multiple clients to connect to join a room (create a star topology)
- [x] automatically re-inject the content scripts (for monitoring and mirroring clicks) on page reload/redirect
    - note: does not work with host and client running in the same browser
- [x] deploy signaling server to google cloud
- [ ] allow for bi-directional synchronization as an option 
- [ ] mirror other actions such as searches in the address bar
- [ ] handle errors regarding host and clients becoming out of sync
- [ ] add configuration of the start URL to the popup instead of using the current active tab's URL
- [ ] allow multiple active sessions to be hosted from a single browser

## Installing

The add-on is currently only available by loading it as a temporary add-on in firefox.

First clone the repo.

```sh
git clone https://github.com/BlakeASmith/tabpuppet.git
```

Open **firefox** and type `about:debugging` into the address bar

![](docs/images/about_debugging.jpg)

