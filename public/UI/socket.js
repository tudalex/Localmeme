function getUserLocation() { 

//check if the geolocation object is supported, if so get position
if (navigator.geolocation)
	navigator.geolocation.getCurrentPosition(displayLocation, function(){});
}

function displayLocation(position) { 

//build text string including co-ordinate data passed in paramete
  //display the string for demonstration
  socket.emit('location', position);
  socket.emit('request_tags_near_location', position.coords);
}

var socket = io.connect();
socket.on('connect', function() {
  getUserLocation();
  socket.emit('request_tag', ["awesome"]);
});
socket.on('news', function (data) {
  console.log(data);
});
socket.on('meme', function (data) {
	console.log(data);
});
socket.on('tag', function (data){
	console.log(data);
});
