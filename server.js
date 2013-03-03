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
var col_tags;
var col_bg;
MongoClient.connect("mongodb://localhost:27017/content", function(err, db) {
  if(err) { return console.dir(err); }
  console.log("Connected to mongo.");
  collection  =db.collection('meme');
  col_tags = db.collection('tags');
  col_bg = db.collection('bg');
});
 

io.sockets.on('connection', function (socket) {
	
	console.log('New Client Connected');

	socket.on('authenticate', function(data) {
		console.log('Authectication key : ' + data);

	});

	socket.on ('meme_posted', function (data) {
		
		socket.get('location', function (err, pos) {
			data.loc = { x: pos.coords.latitude, y: pos.coords.longitude };
			console.log(data);
			collection.insert(data,{w:1}, function(err, result) {}));
			for (var x in data.tags) {
				socket.in(data.tags[x]).emit('meme', data);
			}
		});
		
	/*	for (var socketId in io.sockets.sockets) {
			io.sockets.sockets[socketId].get('location'), function (err, location) {
				location.cooridonates.
				io.sockets.sockets[socketId].emit(data);
			}
		}*/
		
		
	});
	socket.on('login', function(data) {
		console.log(JSON.stringify(data));
		
	});
	
	socket.on('location', function(data) {
		console.log(JSON.stringify(data));
		socket.set('location', data, function() {
			console.log("Saved user location on socket object.");
		});
	})

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
	
	socket.on('request_tags_near_location', function (data) { 
		console.log(data);
		var stream = col_tags.find( {location: { $within : {$center: [ [data.latitude, data.longitude], 1]}}}).stream();
		console.log("Searching for tags around "+data.latitude+" "+data.longitude);
		stream.on('data', function (item) {
			socket.emit('tag', item);
		});
		stream.on('end', function() {
			socket.emit('tag_end', {});
			console.log("End of tag stream.");
		});
	});

	socket.on('request_backgrounds', function(data){
		var stream = col_bg.find( { }).stream();
		stream.on('data', function(item) {
			socket.emit('background', item);
		});
		stream.on('end', function() {
			socket.emit('background_end', {});
			console.log("End of tag stream.");
		});
	});

	socket.on('subscribe', function (data) {
		socket.join(data.room);
	});
	socket.on('unsubscribe', function (data) {
		socket.leave(data.room);
	});
	socket.on('disconect', function() {
		
	});
	
});
