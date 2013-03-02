var memeInterface = {
	hash: 'vader',
	width: 800,
	height: 600,
	
	isFromServer: false,
	bgCanvas: null,
	bgImage: null,
	
	textCanvas: null,
	
	textInput: null,
	
	drawTextCb: function(e) {
		var context = this.textCanvas.getContext("2d");
		context.clearRect(0, 0, this.width, this.height);
		context.fillText(this.textInput[0].value, 10, 10);
		context.fillText(this.textInput[1].value, 10, 50);
		context.fillText(this.textInput[2].value, 10, 90);
	},
	
	initText: function() {
		this.textCanvas = $("#text-canvas")[0];
		this.textCanvas.getContext("2d").font = "20px sans-serif";
		this.textInput = $(':input.memeTextInput');
		this.textInput.bind('input', this.drawTextCb.bind(this));
	},
	
	
	drawBgCb: function(e) {
       		var context = this.bgCanvas.getContext("2d");
       		context.drawImage(this.bgImage, 0, 0, this.width, this.height);
       		
       		if (this.isFromServer)
       			this.saveToLocalStorage();
	},
	
	loadFromLocalStorage: function() {
		var data = window.localStorage.getItem(this.hash);
		if (!data)
			return false;
		
		this.bgImage.src = data;
		return true;
	},
	
	loadFromServer: function() {
		this.isFromServer = true;
		this.bgImage.src = 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';
	},
	
	
	saveToLocalStorage: function() {
		try {
			window.localStorage.setItem(this.hash, this.bgCanvas.toDataURL("image/jpg"));
		}
		catch (e) {
			console.log("Failed to save bg image to localStorage");
			console.log(e);
		}
	},
	
	initBg: function() {
		this.bgCanvas = $('#bg-canvas')[0];
		this.bgImage = new Image();
		$(this.bgImage).bind('load', this.drawBgCb.bind(this));
		if (!this.loadFromLocalStorage())
			this.loadFromServer();
	},
	
	init: function() {
		//console.log(this);
		//this.image = $('#meme');
		//this.image.css("background-image","url('http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg')");
		this.initText();
		this.initBg();
	}
};

////	imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';
//});

$(function() {
	memeInterface.init();
});
