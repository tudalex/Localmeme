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

var Chat = {
	connections: 0,
	question : -1,
	time: 0,
	
	stop: function () {
			
	},

	next: function () {
		Chat.question++;
		if (Chat.question == 4)
			Chat.question = 1;
		RedisQuestions.sendNextQuestion();
		time = setTimeout(Chat.next, 10000);		
	},
	
	start: function () {
		this.question = 1;
		time = setTimeout(Chat.next, 10000);
	},
};



io.sockets.on('connection', function (socket) {
	
	console.log('New Client Connected');

	Chat.connections++;
	
	if (Chat.connections == 1)
		Chat.start();

	socket.on('authenticate', function(data) {
		console.log('Authectication key : ' + data);
		
		
	});

	socket.on('login', function(data) {
		console.log(JSON.stringify(data));
		
	});
	
	socket.on('chat', function (data) {
			

	});
	
	socket.on('disconect', function() {
		Chat.connections--;
		if (Chat.connections == 0) {
			Chat.stop();
		}
	});
	
});


function genQuestion(question, anwsers, right) {
	this.id = 0;
	this.question = question;
	this.answers = anwsers;
	this.right = right;
}

function emitToAll(msg) {
	io.sockets.emit('chat', msg);
}








