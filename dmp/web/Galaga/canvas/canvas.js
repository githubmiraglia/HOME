// JavaScript Document
//the variable _K is set in globalvariables.js. These are adjustments for compatibility with Scratch coding positioning [0] x position, [1] x and y multiplier, [2] sprite multiplier, [3] canvas border, [4] number printing x adjustment, [5] number printing y adjustment, [6] further number printing y adjustment

function genericSprite(id,src,w,h){
	this.id = id;
	this.img = document.createElement("img");
	this.img.src = src;
	this.w = w;	
	this.h = h;
	this.scale=true;
	this.img.addEventListener("load",function(){
			_LOADEDELEMENTS.push(id);
		});
};


//platform,this.leftPaddngs[0],"maincanvas",null,true

function canvasdisplay(platform,leftPaddng,id,spriteList,createStringWidth){
	this.check=[];
	this.spriteListTxt = [];
	this.spriteList = [];
	this.loaded = false;
	this.canvas = document.getElementById(id);
	this.canvas.width = _WIDTH;
	this.canvas.height = _HEIGHT;
	this.canvas.style.position="relative";
	this.canvas.style.paddingLeft=leftPaddng+"px";
	this.canvas.style.paddingRight=leftPaddng+"px";
	this.canvas.style.display="block";
	this.touchStartY=0;
	this.cx = this.canvas.getContext("2d");
	this.cx.scale(_SCALE,_SCALE);
	if(spriteList!=null)
		this.spriteList=spriteList;
	else
		this.createSpritesList();
	if(this.createStringWidth)
		this.createStringWidth();
	this.exitTouch(platform.touchScreen);
	this.crossFaded=false;
}

canvasdisplay.prototype.removeCanvas=function(id){
	var c=document.getElementById(id);
	c.style.display="none";
}

canvasdisplay.prototype.resize=function(w,h,leftPaddng){
	this.canvas.width=w;
	this.canvas.height=h;
	this.canvas.style.paddingLeft=leftPaddng+"px";
	this.canvas.style.paddingRight=leftPaddng+"px";
	this.cx.scale(_SCALE,_SCALE);
}

canvasdisplay.prototype.createStringWidth=function(){
	var container = document.getElementById("container")
	var stringWidth = document.createElement("div");
	stringWidth.setAttribute("id","stringWidth");
	stringWidth.style.visibility = "hidden";
	stringWidth.style.position="absolute";
	stringWidth.style.height = "auto";
	stringWidth.style.width = "auto";
	stringWidth.style.whiteSpace = "nowrap";
	container.appendChild(stringWidth);
}

canvasdisplay.prototype.createSpritesList = function(){
if(!_REPLAY){
	getText("spriteListTxt",_ROOT+"/canvas/sprites/spritelist.txt");
	this.check = ["spriteListTxt"];
	var interval = setInterval(function(){
		if(checkLoaded(this.check)){
			this.spriteListTxt = _RETURNTEXT["spriteListTxt"];
			clearInterval(interval)
			this.check=[];
			for(var i=0;i<this.spriteListTxt.length;i++){
				
				var file = this.spriteListTxt[i];
				var name = file.slice(0,this.spriteListTxt[i].indexOf(","));
				file = this.spriteListTxt[i];
				var w = parseInt(file.slice(file.indexOf(",")+1,file.indexOf(",")+5),10);
				var file = this.spriteListTxt[i];
				var h = parseInt(file.slice(file.indexOf(",")+6,file.indexOf(",")+11),10);
				
				this.spriteList[name]=new genericSprite("sprite"+i,_ROOT+"/canvas/sprites/"+name+".png",w,h);
				this.check.push("sprite"+i);
			}
			var interval_2 = setInterval(function(){
				if(checkLoaded(this.check)){
					clearInterval(interval_2);
					_OFFLINE["cd"]=this.spriteList;
					this.loaded = true;
				}		
			}.bind(this),47);
									
		}
	}.bind(this),47)
}else{
	this.spriteList=_OFFLINE["cd"];
	this.loaded=true;
}
}


canvasdisplay.prototype.drawBackground = function(name,costume,dY){
	if(!dY)
		dY = 0;
	var background = this.spriteList[name];
	if(!background.scale){
		this.cx.save();
		this.cx.scale(1,1);
	}
	this.cx.fillStyle = "black";
	this.cx.fillRect(0,0,this.canvas.width+1,this.canvas.height+1);
	var x = Math.ceil((this.canvas.width - background.w*_SCALE)/2)
	var y = Math.ceil((this.canvas.height - background.h*_SCALE)/2)+dY; 
	this.cx.drawImage(background.img,costume*(background.w+1),0,background.w,background.h,x,y,background.w,background.h);
	if(!background.scale)
		this.cx.restore();
};

canvasdisplay.prototype.drawActors = function(actors){
	//this.drawBackground(bgName,costume);
	actors.forEach(function(actor){
		if (actor.show){
			var actorSprite = this.spriteList[actor.sprite];
			var x = Math.ceil(this.canvas.width/2/_SCALE+actor.x*_K[1]-actorSprite.w/2);
			var y = Math.ceil(this.canvas.height/2/_SCALE-_K[0]-actor.y*_K[1]+actorSprite.h/2);
        	if (actor.flip){
            	this.cx.save();
            	this.flipHorizontally(this.cx,x+actorSprite.w/2);
        	} 
        	if(actor.rotation!=0){
            	if (actor.flip)
                	this.cx.restore();
            	this.cx.save();
            	this.rotate(this.cx,x+actorSprite.w/2,y+actorSprite.h/2,(actor.rotation-90)*Math.PI/180);
        	}
        	this.cx.drawImage(actorSprite.img,actor.costume*actorSprite.w+((actor.costume==0)?0:1),0,actorSprite.w,actorSprite.h,x,y,actorSprite.w,actorSprite.h);
        	if (actor.flip||actor.rotation!=0){
            	this.cx.restore();
        	}
		}
	},this);
};



canvasdisplay.prototype.drawLives = function(lifeName,n,x,y){
   var lifeSprite = this.spriteList[lifeName];
   for(var i=0;i<n;i++){
    var posX =-x+i*_K[2];
    var posY = y;
    var x2 = Math.ceil((this.canvas.width/2/_SCALE+posX*_K[1]-lifeSprite.w/2));
    var y2 = Math.ceil((this.canvas.height/2/_SCALE-_K[0]-posY*_K[1]-lifeSprite.h/2));
    this.cx.drawImage(lifeSprite.img,0,0,lifeSprite.w,lifeSprite.h,x,y,lifeSprite.w,lifeSprite.h);
       
    }
};

canvasdisplay.prototype.drawString=function(str,size,y,position,color,bgColor,strAdjust,direction,delta){
	var font = size+"px ArcadeClassic";
	var arr = this.findWidth(str,font);
	lenW = arr[0];
	lenH = arr[1];
	if(strAdjust){
		arr = this.findWidth(strAdjust,font);
		var lenAdjustW = Math.floor(arr[0]/2);
	}else{
		var lenAdjustW = 0;
	}
	if(!delta)
		var delta=0;
	if(!direction)
		direction=1;
    var y = Math.ceil(this.canvas.height/2/_SCALE-_K[0]-y*_K[1]);
	if(position=="left")
		var x = _K[3]+lenAdjustW*direction+delta;
	else if(position=="center")
		var x = _K[3]+Math.floor(this.canvas.width/2/_SCALE-lenW/2)+lenAdjustW*direction+delta;
	else if(position=="right")
		var x = this.canvas.width/_SCALE-_K[3]-lenW+lenAdjustW*direction+delta;
	if(bgColor){
		this.cx.fillStyle = bgColor;
		this.cx.fillRect(x,y+Math.floor(size/4),lenW,-lenH)+delta;
	}
	if(color){
    	this.cx.font = font
    	this.cx.fillStyle = color;
    	this.cx.fillText(str,x,y);
	}
};

canvasdisplay.prototype.findWidth = function(str,font){
	var stringWidth = document.getElementById("stringWidth");
	stringWidth.innerText = str;
	stringWidth.style.font = font;
	var height = (stringWidth.clientHeight + 1);
	var width = (stringWidth.clientWidth + 1);
	var arr = [width,height];
	return(arr);
}

/*
CanvasDisplay.prototype.drawGameOver = function(){
	var overSprite = this.spritesList["gameOverSprite"];
	var posX =0;
	var posY = -80;
	var x = Math.ceil(this.canvas.width/2/GlobalScale+posX*2-overSprite.width/2);
    var y = Math.ceil(this.canvas.height/2/GlobalScale-104-posY*2-overSprite.height/2);
	this.cx.drawImage(overSprite.sprite,0,0,overSprite.width,overSprite.height,x,y,overSprite.width,overSprite.height);
}

*/

canvasdisplay.prototype.drawNumber = function(number,n,y,position,color,bgColor,delta){
	var text = number.toString();
	var len = text.length;
	var text = "0".repeat(n)+text;
	var text = text.slice(len,len+n);
	this.drawString(text,24,y,position,color,bgColor,NaN,NaN,delta);	
    //var posx = (-_K[4]+x*_K[2]);
    //var posy =  _K[5]-y*_K[2];
    //var x = Math.ceil(this.canvas.width/2/_SCALE+posx*_K[1]);
    //var y = Math.ceil(this.canvas.height/2/_SCALE-_K[0]-posy*_K[1]+_K[6]);
    //this.cx.font = "24px ArcadeClassic";
    //this.cx.fillStyle = color;
    //this.cx.fillText(text,x,y);
}

canvasdisplay.prototype.singleBGcolor=function(bgColor){
	this.cx.fillStyle = bgColor;
	this.cx.fillRect(0,0,this.canvas.width/_SCALE,this.canvas.height/_SCALE);
}

canvasdisplay.prototype.drawSingleBG = function(name,costume,dY,opacity){
	if(!dY)
		var dY = 0;
	if(!opacity&&opacity!=0)
		var opacity=1;
	var background = this.spriteList[name];
	if(!background.scale){
		this.cx.save();
		this.cx.scale(1/_SCALE,1/_SCALE);
	}
	var x = Math.ceil((this.canvas.width - background.w*_SCALE)/2)
	var y = Math.ceil((this.canvas.height - background.h*_SCALE)/2)+dY; 
	this.cx.globalAlpha=opacity;
	this.cx.drawImage(background.img,costume*(background.w+1),0,background.w,background.h,x,y,background.w,background.h);
	this.cx.globalAlpha=1;
	if(!background.scale)
		this.cx.restore();
};

canvasdisplay.prototype.fillRectangle = function(x,y,dx,dy,color){
	this.cx.fillStyle = color;
	var x1 = Math.ceil(this.canvas.width/2/_SCALE+x*_K[1]);
	var y1 = Math.ceil(this.canvas.height/2/_SCALE-_K[0]-y*_K[1]);
	console.log(x1,y1,color,dx,dy);
	this.cx.fillRect(x1,y1,dx*_K[1],dy*_K[1]);
}


canvasdisplay.prototype.drawSingleActor = function(name,costume,x,y){
	var actor = this.spriteList[name];
	var x1 = Math.ceil(this.canvas.width/2/_SCALE+x*_K[1]-actor.w/2);
	var y1 = Math.ceil(this.canvas.height/2/_SCALE-_K[0]-y*_K[1]-actor.h/2);
	this.cx.drawImage(actor.img,costume*actor.w,0,actor.w,actor.h,x1,y1,actor.w,actor.h);
}

canvasdisplay.prototype.flipHorizontally=function(cx,around){
    cx.translate(around,0);
    cx.scale(-1,1);
    cx.translate(-around,0);
}

canvasdisplay.prototype.rotate=function(cx,aroundX,aroundY,angle){
    cx.translate(aroundX,aroundY);
    cx.rotate(angle);
    cx.translate(-aroundX,-aroundY);
}

canvasdisplay.prototype.exitTouch=function(touchScreen){
	if(touchScreen){
		this.canvas.addEventListener("touchstart",function(e){
			e.preventDefault();
			this.touchStartY=parseInt(e.changedTouches[0].clientY);
		}.bind(this),false);
		this.canvas.addEventListener("touchmove",function(e){
			//this.cx.globalAlpha=0.6;
			e.preventDefault();
			var dist=Math.abs(parseInt(e.changedTouches[0].clientY-this.touchStartY));
			if(dist>150)
				_EXIT=true;
		}.bind(this),false);
	}
}

canvasdisplay.prototype.crossfade=function(bg1,bg2,wait,t){
	var opacity=1.0
	var opdec=0.025
	var dt=Math.floor(t/(opacity/opdec)*1000);
	var te=0;
	this.drawSingleBG(bg1,0,0,opacity);
	var interval=setInterval(function(){
		if(te>=(wait*1000)){
			this.drawSingleBG(bg1,0,0,opacity);  //name,costume,dY,opacity
			this.drawSingleBG(bg2,0,0,1-opacity);
			opacity-=opdec;
			if(opacity<=0){
				clearInterval(interval);
				this.crossFaded=true;
			}
		}
		te+=dt
	}.bind(this),dt);
}



