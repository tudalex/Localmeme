function getUserLocation() { 

//check if the geolocation object is supported, if so get position
if (navigator.geolocation)
	navigator.geolocation.getCurrentPosition(displayLocation, function(){});
}

function displayLocation(position) { 

//build text string including co-ordinate data passed in paramete
  //display the string for demonstration
  if (!position)
    return;
  socket.emit('location', position);
  socket.emit('request_tags_near_location', position.coords);
}
var backgrounds = new Array();
var tags = new Array();
var socket;
window.onload = function () { 
  socket = io.connect();
}

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

socket.on('tag_end', function(data) {
  var t = document.getElementById("tags");
  var checkbox = document.createElement('checkbox');
  checkbox.id = data._id;
  checkbox.type = "checkbox";
  var label = document.createElement('label');
  label.for = data._id; 
  checkbox.addEventListener('change', function() {
    if (checkbox.value == true) 
      socket.emit('subscribe', {room: data._id});
    else
      socket.emit('unsubscribe', {room: data._id});
  });
  t.appendChild(checkbox);
  t.appendChild(label);

});

socket.on('background', function (data) {
  backgrounds.push(data._id);
  console.log(data);
});
socket.on('background_end', function(data) {
  //TODO(gabi): Write page generating code over here.
});
