# clicksync 

A firefox extension for synchronizing clicks between computers.

Users identify a tab which they'd like to sync with their friends. They are
assigned a session token which they can send out to anyone who would like to join.
They are now the "master" of the session and any clicks that they make will be mirrored
by any clients of the session. 

Those who wish to join a session can provide that sessions token in the popup. Once they do so, 
they will become a client to that session and all clicks from that session will be mirrored in the 
current tab. 

## TODO

- [x] assign sessions on user request, providing a unique session token
- [x] assign unique id's to all clients contacting the server
- [x] generate XPATH from user clicks
- [ ] when a new session is created, collect XPATH and post it to the server
- [ ] when a session is joined, periodically check the server for new XPATH


## Server

The heart of the extension is a python flask server which handles session management. All communication
between clients is routed through the server.

## Session Owner / Master

When a user creates a new session they make a GET request to the server at `/token` and receive a unique **token**.
Others can then use the token to join that session. Once a new session is started, each element clicked will have it's 
XPATH sent to the server where it will be forwarded to any clients of the session. 

## Session Clients

When a user becomes a client to a session, a background script will collect the XPATH (from the server) of all
elements clicked by the Session Owner. The script will mirror those clicks in the client tab. 


