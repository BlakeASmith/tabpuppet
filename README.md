# TabPuppet

TabPuppet is a firefox add-on for synchronizing click events across browser instances. 
It works by establishing a peer-to-peer connection (via a WebRTC Data Channel) and sending 
the XPATH of any elements clicked at the "host" machine to any number of connected "client" machines. 
