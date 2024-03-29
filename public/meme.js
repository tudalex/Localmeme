function wrapText(context, text, x, y, maxWidth, lineHeight) {
	var words = text.split(' ');
	var line = '';

	for(var n = 0; n < words.length; n++) {
		var testLine = line + words[n] + ' ';
		var metrics = context.measureText(testLine);
		var testWidth = metrics.width;
		if (testWidth > maxWidth) {
			context.fillText(line, x, y);
			line = words[n] + ' ';
			y += lineHeight;
		}
		else {
			line = testLine;
		}
	}
	context.fillText(line, x, y);
}


var memeInterface = {
	hash: 'vader',
	width: 800,
	height: 600,
	fontSize: 60,
	lineHeight: 65,
	maxLineLength: 570,
	
	isFromServer: false,
	bgCanvas: null,
	bgContext: null,
	bgImage: null,
	
	textCanvas: null,
	textContext: null,
	
	textInput: null,
	
	drawTextCb: function(e) {
		this.textContext.clearRect(0, 0, this.width, this.height);
		var x = this.width/2;
		
		var y = [40, 250, 540];
		for (var i = 0; i < 3; ++i)
			wrapText(this.textContext, this.textInput[i].value, x, y[i], this.maxLineLength, this.lineHeight);
	},
	
	initText: function() {
		this.textCanvas = $("#text-canvas")[0];
		this.textContext = this.textCanvas.getContext("2d");
		
		this.textContext.font = '60px sans-serif';
		this.textContext.fillStyle = 'white';
       		this.textContext.textAlign = 'center';
       		this.textContext.textBaseline = 'middle';
       		
		this.textInput = $(':input.memeTextInput');
		this.textInput.bind('input', this.drawTextCb.bind(this));
	},
	
	
	drawBgCb: function(e) {
       		this.bgContext.drawImage(this.bgImage, 0, 0, this.width, this.height);
       		
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
		this.bgImage.src = 'darth-vader.jpg';
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
		this.bgContext = this.bgCanvas.getContext("2d");
		this.bgImage = new Image();
		$(this.bgImage).bind('load', this.drawBgCb.bind(this));
		if (!this.loadFromLocalStorage())
			this.loadFromServer();
	},
	
	init: function() {
		this.initText();
		this.initBg();
	}
};

$(function() {
	memeInterface.init();
});
