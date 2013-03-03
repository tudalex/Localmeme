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
var backgrounds = new Array();
var tags = new Array();
var socket = io.connect();

socket.on('connect', function() {
  getUserLocation();
  socket.emit('request_tag', ["awesome"]);
  socket.emit('request_backgrounds');
});

socket.on('news', function (data) {
  console.log(data);
});

socket.on('meme', function (data) {
	console.log(data);
});

socket.on('tag', function (data){
	console.log(data);
  tags.push(data._id);
});

socket.on('background', function (data) {
  backgrounds.push(data._id);
  console.log(data);
});
