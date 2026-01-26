// JavaScript Document


function CanvasDisplay(parent,w,h,spritesList,touchScreen,id,leftPaddngs){
	//this.canvas = document.createElement("canvas");
	this.canvas = document.getElementById(id);
	this.canvas.width = w;
	this.canvas.height = h;
	this.spritesList = spritesList;
	//parent.appendChild(this.canvas);
	this.cx = this.canvas.getContext("2d");
	this.cx.scale(GlobalScale,GlobalScale);
	this.exitTouch(touchScreen);
	this.crossFaded=false;
	this.canvas.style.position="relative";
	this.canvas.style.paddingLeft=leftPaddngs+"px";
	this.canvas.style.paddingRight=leftPaddngs+"px";
	this.canvas.style.display="block";
};

CanvasDisplay.prototype.removeCanvas = function(id){
	var c=document.getElementById(id);
	c.style.display="none";
};

CanvasDisplay.prototype.redrawBackground = function(costume){
	var background = this.spritesList["spriteBackGround"];
	this.cx.fillStyle = "black";
	this.cx.fillRect(0,0,Math.ceil(this.canvas.width/GlobalScale),Math.ceil(this.canvas.height/GlobalScale));
	var pos = new Vector(Math.floor((this.canvas.width - background.width*GlobalScale)/2), Math.floor((this.canvas.height - background.height*GlobalScale)/2)); 
	this.cx.drawImage(background.sprite,costume*(background.width+1),0,background.width,background.height,pos.x,pos.y,background.width,background.height);
};

CanvasDisplay.prototype.drawActors = function(bgCostume,actors){
	this.redrawBackground(bgCostume);
	var background = this.spritesList["spriteBackGround"];
	
	actors.forEach(function(actor){
		var actorSprite = this.spritesList[actor.sprite];
		var x = Math.ceil(this.canvas.width/2/GlobalScale+actor.pos.x*2-actorSprite.width/2);
		var y = Math.ceil(this.canvas.height/2/GlobalScale-104-actor.pos.y*2-actorSprite.height/2);
        if (actor.flip){
            this.cx.save();
            flipHorizontally(this.cx,x+actorSprite.width/2);
        } 
        if(actor.rotation!=0){
            if (actor.flip)
                this.cx.restore();
            this.cx.save();
            rotate(this.cx,x+actorSprite.width/2,y+actorSprite.height/2,actor.rotation);
        }
        this.cx.drawImage(actorSprite.sprite,actor.costume*actorSprite.width,0,actorSprite.width,actorSprite.height,x,y,actorSprite.width,actorSprite.height);
        if (actor.flip||actor.rotation!=0){
            this.cx.restore();
        }
        
								  },this);
};

CanvasDisplay.prototype.drawLives = function(n){
   var lifeSprite = this.spritesList["spriteLife"];
   for(var i=0;i<n;i++){
    var posX =-96+i*8;
    var posY = 56;
    var x = Math.ceil((this.canvas.width/2/GlobalScale+posX*2-lifeSprite.width/2));
    var y = Math.ceil((this.canvas.height/2/GlobalScale-104-posY*2-lifeSprite.height/2));
       this.cx.drawImage(lifeSprite.sprite,0,0,lifeSprite.width,lifeSprite.height,x,y,lifeSprite.width,lifeSprite.height);
       
    }
}

CanvasDisplay.prototype.drawSingleSprite=function(sprite,opacity){
	if(!opacity&&opacity!=0)
		opacity=1;
	else
		this.cx.globalAlpha=opacity;
	var background = this.spritesList[sprite];
	var costume = 0;
	if(!background.scale){
		this.cx.save();
		this.cx.scale(1/_SCALE,1/_SCALE);
	}
	this.cx.fillStyle = "black";
	this.cx.fillRect(0,0,Math.ceil(this.canvas.width/GlobalScale),Math.ceil(this.canvas.height/GlobalScale));
	var pos = new Vector(Math.floor((this.canvas.width - background.width*GlobalScale)/2), Math.floor((this.canvas.height - background.height*GlobalScale)/2)); this.cx.drawImage(background.sprite,0,0,background.width,background.height,pos.x,pos.y,background.width,background.height);
	if(!background.scale)
		this.cx.restore();
	this.cx.globalAlpha=1.0;
};


CanvasDisplay.prototype.drawSingleActor=function(sprite,costume,x,y){
	var actorSprite = this.spritesList[sprite];
	var x1 = Math.ceil(this.canvas.width/2/GlobalScale+x*2-actorSprite.width/2);
	var y1 = Math.ceil(this.canvas.height/2/GlobalScale-104-y*2-actorSprite.height/2);
    this.cx.drawImage(actorSprite.sprite,costume*actorSprite.width,0,actorSprite.width,actorSprite.height,x1,y1,actorSprite.width,actorSprite.height);
}

CanvasDisplay.prototype.drawTwo = function(){
   var twoSprite = this.spritesList["spriteTwo"];
    var posX =-84;
    var posY = 73;
    var x = Math.ceil((this.canvas.width/2/GlobalScale+posX*2-twoSprite.width/2));
    var y = Math.ceil((this.canvas.height/2/GlobalScale-104-posY*2-twoSprite.height/2));
    this.cx.drawImage(twoSprite.sprite,0,0,twoSprite.width,twoSprite.height,x,y,twoSprite.width,twoSprite.height);
       
};

CanvasDisplay.prototype.drawString=function(str,pos,color,bgColor,size){
	var font = size.toString()+"px ArcadeClassic";
	var len = str.length;
    var x = Math.ceil(this.canvas.width/2/GlobalScale+pos.x*2);
    var y = Math.ceil(this.canvas.height/2/GlobalScale-104-pos.y*2+6);
	if(bgColor){
		this.cx.fillStyle = bgColor;
		this.cx.fillRect(x-3,y-17*size/24,13*len*size/24,20*size/24);
	}
	if(color){
    	this.cx.font = font
    	this.cx.fillStyle = color;
    	this.cx.fillText(str,x,y);
	}
	
};
	

CanvasDisplay.prototype.drawGameOver = function(){
	var overSprite = this.spritesList["gameOverSprite"];
	var posX =0;
	var posY = -80;
	var x = Math.ceil(this.canvas.width/2/GlobalScale+posX*2-overSprite.width/2);
    var y = Math.ceil(this.canvas.height/2/GlobalScale-104-posY*2-overSprite.height/2);
	this.cx.drawImage(overSprite.sprite,0,0,overSprite.width,overSprite.height,x,y,overSprite.width,overSprite.height);
}


CanvasDisplay.prototype.writeNumber = function(number,n,pos,color){
	var text = number.toString();
	var len = text.length;
	var text = "0".repeat(n)+text;
	var text = text.slice(len,len+n);
    pos.x = (-108+pos.x*8);
    pos.y =  72-pos.y*8;
    var x = Math.ceil(this.canvas.width/2/GlobalScale+pos.x*2);
    var y = Math.ceil(this.canvas.height/2/GlobalScale-104-pos.y*2+6);
    this.cx.font = "24px ArcadeClassic";
    this.cx.fillStyle = color;
    this.cx.fillText(text,x,y);
    
}

CanvasDisplay.prototype.spriteIndex=function(spriteName){
	var indexSprite = this.actors.map(function(actor){
		return actor.sprite;
	}).indexOf(spriteName);
};

CanvasDisplay.prototype.singleBGcolor=function(bgColor){
	this.cx.fillStyle = "black";
	this.cx.fillRect(0,0,Math.ceil(this.canvas.width/GlobalScale),Math.ceil(this.canvas.height/GlobalScale));
	this.cx.fillStyle = bgColor;
	this.cx.fillRect(0,0,Math.ceil(this.canvas.width/GlobalScale),Math.ceil(this.canvas.height/GlobalScale));
}

CanvasDisplay.prototype.findWidth = function(str,font){
	var stringWidth = document.getElementById("stringWidth");
	stringWidth.innerText = str;
	stringWidth.style.font = font;
	var height = (stringWidth.clientHeight + 1);
	var width = (stringWidth.clientWidth + 1);
	var arr = [width,height];
	return(arr);
}

CanvasDisplay.prototype.exitTouch=function(touchScreen){
	if(touchScreen){
		this.canvas.addEventListener("touchstart",function(e){
			e.preventDefault();
			this.touchStartY=parseInt(e.changedTouches[0].clientY);
		}.bind(this),false);
		this.canvas.addEventListener("touchmove",function(e){
			e.preventDefault();
			var dist=Math.abs(parseInt(e.changedTouches[0].clientY-this.touchStartY));
			if(dist>150)
				_EXIT=true;
		}.bind(this),false);
	}
}

CanvasDisplay.prototype.crossfade=function(bg1,bg2,wait,t){
	var opacity=1.0
	var opdec=0.025
	var dt=Math.floor(t/(opacity/opdec)*1000);
	var te=0;
	this.drawSingleSprite(bg1,opacity);
	var interval=setInterval(function(){
		if(te>=(wait*1000)){
			this.drawSingleSprite(bg1,opacity); 
			this.drawSingleSprite(bg2,1-opacity);
			opacity-=opdec;
			if(opacity<=0){
				clearInterval(interval);
				this.crossFaded=true;
			}
		}
		te+=dt
	}.bind(this),dt);
}

CanvasDisplay.prototype.resize=function(w,h,leftPaddng){
	this.canvas.width=w;
	this.canvas.height=h;
	this.canvas.style.paddingLeft=leftPaddng+"px";
	this.canvas.style.paddingRight=leftPaddng+"px";
	this.cx.scale(_SCALE,_SCALE);
}
