Event Man
========

A basic messaging server for use with sockets.

Purpose
--------
The intention for this is a basic secure messaging server that can act as a middleman for two way communication between:
- client browser (webpage frontend)
- Backend REST Server

The challenge that this addresses is a situation in which the client server does not support sockets, is cross domain, and does not share server resources (like databases)
this is a problem with heroku, pagodabox, etc. which currently does not have socket support.

This also is better than polling even though it has to do 2 server requests instead of 1

How it works
------------
1. The client connects via socket.io or otherwise to the eventMan node server under any arbitrary event name tied directly to an event that does an ajax poll from the REST server.
2. When the REST server needs to do an update to the clients, it pings the event server with an event name
3. The client does an ajax request triggered by the event from eventMan server. Data is updated the world is a better place.

Note
----
- This method is for sure half duplex unlike sockets, though if the client needs to trigger an update, then just do a normal Ajax request.
- This can get very sexy tying into backbone models etc.