var Meme = function(info) {
	if(!info.text)
		info.text = info.test;
		
	console.log(info);	
		
	this.info = info;
	this.info.title = info.text.join(' ');
	this.isFromServer = false;
	this.fontSize = 60;
	this.lineHeight = 40;
	return this;
};

Meme.prototype.render = function(canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext("2d");
	this.initBg();
};


Meme.prototype.buildNode = function() {
	this.container = $(document.createElement('li'));
	this.head = $(document.createElement('h1'));
	this.head.text(this.info.title);
	this.container.append(this.head);
	return this.container[0];
};

Meme.prototype.drawText = function() {
	var x = this.canvas.width/2;
	var y = [this.lineHeight, this.canvas.height / 2, this.canvas.height - this.lineHeight];
	
	this.context.font = '20px sans-serif';
	this.context.fillStyle = 'white';
	this.context.textAlign = 'center';
	this.context.textBaseline = 'middle';

	for (var i = 0; i < this.info.text.length; ++i)
		wrapText(this.context, this.info.text[i], x, y[i], this.canvas.width * 0.8, this.lineHeight);
		
	this.saveAsImg();
};


Meme.prototype.drawBgCb = function(e) {
	var width = this.canvas.width;
	var height = width * this.image.height / this.image.width;
	
	this.canvas.height = height;
	
	console.log(width);
	console.log(this.canvas);
	this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, width, height);
	
	if (this.isFromServer)
		this.saveToLocalStorage();
		
	this.drawText();
};

Meme.prototype.loadFromLocalStorage = function() {
	var data = window.localStorage.getItem(this.info.background);
	if (!data)
		return false;
	
	this.image.src = data;
	return true;
};

Meme.prototype.loadFromServer = function() {
	this.isFromServer = true;
	this.image.src = "../Backgrounds/" + this.info.background;
};


Meme.prototype.saveToLocalStorage = function() {
	try {
		window.localStorage.setItem(this.info.background, this.canvas.toDataURL("image/jpg"));
	}
	catch (e) {
		console.log("Failed to save bg image to localStorage");
		console.log(e);
	}
};

Meme.prototype.initBg = function() {
	this.image = new Image();
	$(this.image).bind('load', this.drawBgCb.bind(this));
	if (!this.loadFromLocalStorage())
		this.loadFromServer();
};


Meme.prototype.saveAsImg = function() {
	var data = this.canvas.toDataURL("image/jpg");
	$(this.image).unbind('load');
	this.image.src = data;
	this.container.append(this.image);
};

