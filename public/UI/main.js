
window.onload = function() {
	Device.getInfo();
	memeInterface.init();

	Stats.backgrounds++;
	if (Stats.backgrounds == 2)
		BackgroundPage.loadImages();

};


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
		var node = document.createElement("div");
		node.className = "thumbnail";
		node.style.backgroundImage="url('" + url + "')"; 
		return node;
	},
	
	loadImages : function () {
		this.page = document.getElementById("imgcontent");
		for (var i in backgrounds)
			this.page.appendChild(this.createNewImg(backgrounds[i]._id))
		
	}
	
}



