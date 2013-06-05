var io 	= require('socket.io').listen(80);
var u 	= require('underscore');
		  //require('./lib/underscore-proto.js');


var authKey = '9M5I8mKXaCIbecjYF2SQ';

/**
 * Structure for connected users
 * {
 * 		domainName : [
 * 			sessionId,
 * 			sessionId,
 * 			sessionId,
 * 		],
 * 		domainName : [
 * 			sessionId,
 * 			sessionId,
 * 		]
 * } 
 */
var connectedUsers = {};

io.sockets.on('connection', function (socket) {
	
	/****************
	 *PUBLIC 
	 ****************/
	
		socket.on('set domain', function (name) {
		    connectedUsers[name] = [].concat( (connectedUsers[name] ? connectedUsers[name] : []), socket.id);
		    socket.set('domain', name, function () {
		    	socket.emit('ready');
		    });
	 	});
	 	
	 	// Clean up sessions
		socket.on('disconnect', function () {
		    // Remove Session
		    socket.get('domain', function(err, name){
		    	if(name){
		    		// Only remove disconnected users
		    		connectedUsers[name] = u(connectedUsers[name]).reject(function(socketId){
		    			return socketId === socket.id;
		    		});
		    		// Delete the domain from connected users if its empty
		    		if(connectedUsers[name].length == 0){
		    			delete connectedUsers[name];
		    		}
		    	}
		    });
	 	});
 	
	
	/***************************
	 * SECURE
	 ***************************/
		// Refresh clients that have recieved a refresh
		socket.on('refresh', function (data) {
			if(data.authKey === authKey){
				var socketIds = u.keys(io.sockets.sockets);
				var toRefresh = u.intersection(socketIds, connectedUsers[data.domain] ?  connectedUsers[data.domain] : []);
				console.log('******* REFRESH');
				console.log(data.domain + ': refresh ' + data.resource);
				u.each(toRefresh, function(socketId){
					io.sockets.sockets[socketId].emit('refresh ' + data.resource);
				});
			}
		});
});