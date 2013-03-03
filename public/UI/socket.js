function getUserLocation() { 

//check if the geolocation object is supported, if so get position
if (navigator.geolocation)
	navigator.geolocation.getCurrentPosition(displayLocation, function(){});
}
var tags_loaded = false;
var backgrounds_loaded = false;
function displayLocation(position) { 

//build text string including co-ordinate data passed in paramete
  //display the string for demonstration
  if (!position.hasOwnProperty('coords'))
    return;
  socket.emit('location', position);
  if (!tags_loaded) {
    socket.emit('request_tags_near_location', position.coords);
    tags_loaded = true;
  }
}


var Stats = {
	backgrounds : 0
}

var backgrounds = new Array();
var tags = new Array();
var	socket;
var socket_init = function () {socket = io.connect(); 


socket.on('connect', function() {
  getUserLocation();
  
  socket.emit('request_tag', ["awesome"]);
  
  if (!backgrounds_loaded) {
    socket.emit('request_backgrounds');
    backgrounds_loaded = true;
  }
  socket.on('news', function (data) {
	  console.log(data);
	});
	
	socket.on('meme', function (data) {
		console.log(data);
		Homepage.loadMeme(data);
	});
	
	socket.on('tag', function (data){
		//console.log(data);
	  tags.push(data._id);
	});
	var tags_loaded = 0;
	socket.on('tag_end', function(data) {
	  var t = $("#tags_checkboxes");
	  //console.log(t);
	  t.empty();
	  var legend = document.createElement('legend');
	  legend.innerHTML = "Alegeti streamuri:";
	  t.appendChild(legend);
	  for (var id in tags) {
	    var checkbox = document.createElement('input');
	    checkbox.id = tags[id];
	    checkbox.type = "checkbox";
	    checkbox.setAttribute('name', '');
	    var label = document.createElement('label');
	    label.setAttribute('for', tags[id]); 
	    label.innerHTML=tags[id];
	    checkbox.addEventListener('change', function() {
	      if (checkbox.value == true) 
	        socket.emit('subscribe', {room: tags[id]});
	      else
	        socket.emit('unsubscribe', {room: tags[id]});
	    });
	    t.appendChild(checkbox);
	    t.appendChild(label);
	  }
	  $("#tags").trigger("create");
	
	  //console.log(t);
	
	});
	
	socket.on('background', function (data) {
	  backgrounds.push(data._id);
	  //console.log(data);
	});
	
	socket.on('background_end', function(data) {
		Stats.backgrounds++;
		if (Stats.backgrounds == 2)
			BackgroundPage.loadImages();
	});
});

};
