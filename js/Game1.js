function Game(ctx,bird,pipe,land,mountain,go_img) {
	this.ctx = ctx;
	this.bird = bird;
	this.pipeArr = [pipe];
	this.land = land;
	this.mountain = mountain;
	this.go_img = go_img;

	this.timer = null;
	this.iframe = 0;
	this.score = 0;

	this.init();
}
Game.prototype.init = function() {
	this.start();
	this.bindEvent();
}
Game.prototype.renderMountain = function() {
	var img = this.mountain.img;
	this.mountain.x -= this.mountain.step;
	if(this.mountain.x < -img.width) {
		this.mountain.x = 0;
	}
	this.ctx.drawImage(img,this.mountain.x,this.mountain.y);
	this.ctx.drawImage(img,this.mountain.x + img.width,this.mountain.y);
	this.ctx.drawImage(img,this.mountain.x + img.width * 2,this.mountain.y);
}
Game.prototype.renderLand = function() {
	var img = this.land.img;
	this.land.x -= this.land.step;
	if(this.land.x < -img.width) {
		this.land.x = 0;
	}
	this.ctx.drawImage(img,this.land.x,this.land.y);
	this.ctx.drawImage(img,this.land.x + img.width,this.land.y);
	this.ctx.drawImage(img,this.land.x + img.width * 2,this.land.y);
}
Game.prototype.renderBird = function() {
	var img = this.bird.img;
	// var deg = Math.PI / 180; 
	this.ctx.save();
	this.ctx.translate(this.bird.x, this.bird.y);
	var deg = this.bird.state === "D" ?  Math.PI / 180 * this.bird.speed : - Math.PI / 180 * this.bird.speed;
	this.ctx.rotate(deg);
	this.ctx.drawImage(img,- img.width / 2, -img.height / 2);
	this.ctx.restore();
}
Game.prototype.renderPipe = function() {
	var me = this;
	this.pipeArr.forEach(function(value){
		var img = value.pipe_up;
		var img_x = 0;
		var img_y = img.height - value.up_height;
		var img_w = img.width;
		var img_h = value.up_height;
		var canvas_x = me.ctx.canvas.width - value.step * value.count;
		var canvas_y = 0;
		var canvas_w = img.width;
		var canvas_h = value.up_height;
		me.ctx.drawImage(img,img_x, img_y, img_w, img_h, canvas_x, canvas_y, canvas_w, canvas_h);
		
		var img_down = value.pipe_down;
		var img_down_x = 0;
		var img_down_y = 0;
		var img_down_w = img_down.width;
		var img_down_h = value.down_height;
		var canvas_down_x = me.ctx.canvas.width - value.step * value.count;
		var canvas_down_y = value.up_height + 150;
		var canvas_down_w = img_down.width
		var canvas_down_h = value.down_height;
		me.ctx.drawImage(img_down, img_down_x, img_down_y, img_down_w, img_down_h, canvas_down_x, canvas_down_y, canvas_down_w, canvas_down_h);
	})
}
Game.prototype.start = function() {
	var me = this;
	this.timer = setInterval(function(){
		me.iframe ++;
		me.clear();
		me.renderMountain();
		me.renderLand();
		me.renderBird();
		if(me.iframe % 10 == 0) {
			me.bird.fly();
		}
		me.bird.down();
		me.pipemove();
		me.renderPipe();
		if(me.iframe % 65 == 0) {
			me.createPipe();
		}
		me.removePipe();
		me.renderbirdPoints();
		me.renderpipePoints();
		me.check();
	}, 30)
}
Game.prototype.clear = function() {
	this.ctx.clearRect(0,0,360,512);
}
Game.prototype.bindEvent = function() {
	var me = this;
	// this.ctx.canvas.onclick = function() {
	// 	me.bird.up();
	// }
	document.onkeydown = function(e) {
		var key = e.keyCode;
		if(key == "38") {
			me.bird.up();
		}
	}
}
Game.prototype.pipemove = function() {
	this.pipeArr.forEach(function(value) {
		value.count ++;
	})
}
Game.prototype.createPipe = function() {
	var pipe = this.pipeArr[0].createPipe();
	this.pipeArr.push(pipe);
}
Game.prototype.removePipe = function() {
	for(var i = 0;i < this.pipeArr.length;i ++) {
		var pipe = this.pipeArr[i];
		if(pipe.x - pipe.step * pipe.count < -pipe.pipe_up.width) {
			this.pipeArr.splice(i,1);
			return;
		}
	}
}
Game.prototype.renderbirdPoints = function() {
	var Bird_A = {
		x : - this.bird.img.width / 2 + 5 + this.bird.x,
		y : - this.bird.img.height / 2 + 5 + this.bird.y
	}
	var Bird_B = {
		x : Bird_A.x + this.bird.img.width - 10,
		y : Bird_A.y
	}
	var Bird_C = {
		x: Bird_A.x,
		y: Bird_A.y + this.bird.img.height - 10
	}
	var Bird_D = {
		x: Bird_B.x,
		y: Bird_C.y
	}
	this.ctx.beginPath();
	this.ctx.moveTo(Bird_A.x, Bird_A.y);
	this.ctx.lineTo(Bird_B.x, Bird_B.y);
	this.ctx.lineTo(Bird_D.x, Bird_D.y);
	this.ctx.lineTo(Bird_C.x, Bird_C.y);
	this.ctx.closePath();
	this.ctx.strokeStyle = "yellow";
	this.ctx.stroke();

}
Game.prototype.renderpipePoints = function() {
	for(var i = 0;i < this.pipeArr.length ;i ++) {
		var pipe = this.pipeArr[i];
		var pipe_A = {
			x : pipe.x - pipe.step * pipe.count,
			y : 0
		}
		var pipe_B = {
			x : pipe_A.x + pipe.pipe_up.width,
			y : 0
		}
		var pipe_C = {
			x : pipe_A.x,
			y : pipe.up_height
		}
		var pipe_D = {
			x : pipe_B.x,
			y : pipe_C.y
		}
		this.ctx.beginPath();

		this.ctx.moveTo(pipe_A.x, pipe_A.y);
		this.ctx.lineTo(pipe_B.x, pipe_B.y);
		this.ctx.lineTo(pipe_D.x, pipe_D.y);
		this.ctx.lineTo(pipe_C.x, pipe_C.y);

		this.ctx.closePath();

		this.ctx.strokeStyle = "blue";

		this.ctx.stroke();

		var pipe_down_A = {
			x: pipe.x - pipe.step * pipe.count,
			y: pipe.up_height + 150
		}
		var pipe_down_B = {
			x: pipe_down_A.x + pipe.pipe_up.width,
			y: pipe_down_A.y
		}
		var pipe_down_C = {
			x: pipe_down_A.x,
			y: pipe_down_A.y + pipe.down_height
		}
		var pipe_down_D = {
			x: pipe_down_B.x,
			y: pipe_down_C.y
		}
		this.ctx.beginPath();

		this.ctx.moveTo(pipe_down_A.x, pipe_down_A.y);
		this.ctx.lineTo(pipe_down_B.x, pipe_down_B.y);
		this.ctx.lineTo(pipe_down_D.x, pipe_down_D.y);
		this.ctx.lineTo(pipe_down_C.x, pipe_down_C.y);

		this.ctx.closePath();

		this.ctx.strokeStyle = "blue";
		this.ctx.stroke();
	}
}
Game.prototype.check= function() {
	// 获取各点
	for(var i = 0;i < this.pipeArr.length;i ++) {
		var pipe = this.pipeArr[i];
		var pipe_A = {
			x : pipe.x - pipe.step * pipe.count,
			y : 0
		}
		var pipe_B = {
			x : pipe_A.x + pipe.pipe_up.width,
			y : 0
		}
		var pipe_C = {
			x : pipe_A.x,
			y : pipe.up_height
		}
		var pipe_D = {
			x : pipe_B.x,
			y : pipe_C.y
		}
		var pipe_down_A = {
			x: pipe.x - pipe.step * pipe.count,
			y: pipe.up_height + 150
		}
		var pipe_down_B = {
			x: pipe_down_A.x + pipe.pipe_up.width,
			y: pipe_down_A.y
		}
		var pipe_down_C = {
			x: pipe_down_A.x,
			y: pipe_down_A.y + pipe.down_height
		}
		var pipe_down_D = {
			x: pipe_down_B.x,
			y: pipe_down_C.y
		}
		var Bird_A = {
			x : - this.bird.img.width / 2 + 5 + this.bird.x,
			y : - this.bird.img.height / 2 + 5 + this.bird.y
		}
		var Bird_B = {
			x : Bird_A.x + this.bird.img.width - 10,
			y : Bird_A.y
		}
		var Bird_C = {
			x: Bird_A.x,
			y: Bird_A.y + this.bird.img.height - 10
		}
		var Bird_D = {
			x: Bird_B.x,
			y: Bird_C.y
		}
		if(Math.abs(Bird_A.x - pipe_down_B.x) <= 1 && Bird_A.y > pipe_D.y && Bird_C.y < pipe_down_B.y) {
			this.goal();
		}
		if(Bird_B.x >= pipe_C.x && Bird_B.y <= pipe_C.y && Bird_A.x <= pipe_D.x) {
			this.gameOver();
		}
		if (Bird_D.x >= pipe_down_A.x && Bird_D.y >= pipe_down_A.y && Bird_A.x <= pipe_down_D.x) {
			this.gameOver();
		}
	}
}
Game.prototype.goal = function() {
	this.score ++;
	score.innerHTML = this.score + "分";

}
Game.prototype.gameOver = function() {
	var img = this.go_img;

	clearInterval(this.timer);
	// 变灰色
	var data = this.ctx.getImageData(0, 0, 360, 512);
	// console.log(data);
	for(var i = 0;i < data.data.length ;i += 4) {
		var r = data.data[i];
		var g = data.data[i + 1];
		var b = data.data[i + 2];
		var ave = (r + g + b) / 2.7;
		data.data[i] = ave;
		data.data[i + 1] = ave;
		data.data[i + 2] = ave;
	}
	this.ctx.putImageData(data, 0, 0);

	// GAMEOVER图片
	this.ctx.drawImage(img,80,200); 
}