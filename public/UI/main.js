
window.onload = function() {
	Device.getInfo();
	memeInterface.init();
	Homepage.init();

	Stats.backgrounds++;
	if (Stats.backgrounds == 2)
		BackgroundPage.loadImages();

	document.addEventListener("click", BackgroundPage.pickImage);

}


Device = {
	width: 960,
	height: null, 
	
	getInfo: function() {
		this.width = getWidth();
	}
}

function getWidth() {
	
	xWidth = null;
	if(window.screen != null)
		xWidth = window.screen.availWidth;

	if(window.innerHeight != null)
		xWidth =   window.innerWidth;

	if(document.body != null)
		xWidth = document.body.clientWidth;

	return xWidth;
}

function getHeight() {
	xHeight = null;
	if(window.screen != null)
		xHeight = window.screen.availHeight;

	if(window.innerHeight != null)
		xHeight =   window.innerHeight;

	if(document.body != null)
		xHeight = document.body.clientHeight;

	return xHeight;
}

var BackgroundPage = {
	
	page : null,
	
	createNewImg : function(url) {
		var node = document.createElement("img");
		node.className = "thumbnail";
		node.src="../Backgrounds/" + url; 
		return node;
	},
	
	loadImages : function () {
		this.page = document.getElementById("imgcontent");
		for (var i in backgrounds) {
			this.page.appendChild(this.createNewImg(backgrounds[i]));
		}
	},
	
	pickImage: function (e) {
		if (e.target.className == 'thumbnail') {
			memeInterface.initBg(e.target.src);
			window.location.hash = "#addpage";
		}
	}
}

var Homepage = {
	
	content : null,
	canvas : null,
	
	init : function () {
		this.content = document.getElementById("memelist");
		this.canvas = document.createElement("canvas");
		this.canvas.width = Device.width;
	},
	
	loadMeme: function(info) {
		console.log(Homepage);
		var X = new Meme(info);
		Homepage.content.appendChild(X.buildNode());
		X.render(Homepage.canvas);
	}
}



