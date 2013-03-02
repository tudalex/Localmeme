var express = require('express');

var	app = express();

var	server = require('http').createServer(app);
var	io = require('socket.io').listen(server);



/*
 * Start server
 */

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){});

server.listen(8080);

/*
 * 
 */
 var MongoClient = require('mongodb').MongoClient;
var collection;

MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  if(err) { return console.dir(err); }
  console.log("Connected to mongo.");
  collection  =db.collection('meme');
});
 

io.sockets.on('connection', function (socket) {
	
	console.log('New Client Connected');

	socket.on('authenticate', function(data) {
		console.log('Authectication key : ' + data);

	});

	socket.on ('meme_posted', function (data) {
		collection.insert(data);
		for (var socketId in io.sockets.sockets) {
			io.sockets.sockets[socketId].get('location'), function (err, location) {
				//TODO(tudalex): put a condition over here
				io.sockets.sockets[socketId].emit(data);
			}
		}
		
	});
	socket.on('login', function(data) {
		console.log(JSON.stringify(data));
		
	});
	
	socket.on('request_tag', function(data) {
		console.log("Requested tag", data);
		var stream = collection.find( { tags: { $in: data }}).stream();
		stream.on('data', function (item) { 
			console.log("Recieved a stream messages.");
			socket.emit('meme', item);
		});
		stream.on('end', function() {
			console.log("Stream has finished.");
		});
	});
	
	socket.on('disconect', function() {
		Chat.connections--;
		if (Chat.connections == 0) {
			Chat.stop();
		}
	});
	
});
