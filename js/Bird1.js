function Bird(imgArr,x,y) {
	this.imgArr = imgArr;
	this.index = parseInt(Math.random() * imgArr.length);
	this.img = this.imgArr[this.index];
	this.x = x;
	this.y = y;
	
	this.state = "D";
	this.speed = 0;
}
Bird.prototype.fly = function() {
	this.index ++;
	if(this.index >= this.imgArr.length) {
		this.index = 0;
	}
	this.img = this.imgArr[this.index];
}
Bird.prototype.down = function() {
	if(this.state === "D") {
		this.speed ++;
		this.y += Math.sqrt(this.speed);
	}else {
		this.speed --;
		if(this.speed == 0) {
			this.state = "D";
			return;
		}
		this.y -= Math.sqrt(this.speed);
	}
}
Bird.prototype.up = function() {
	this.state = "U";
	this.speed = 20;
}