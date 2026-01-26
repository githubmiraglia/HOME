// JavaScript Document
function base(sprite,costume,x,y,vx,vy,rotation,flip,show,js,jselect){
	actor.call(this,sprite,costume,x,y,vx,vy,rotation,flip,show);  
	this.js=js;
	this.jselect=jselect;
	this.exploding=false;
	this.explosionCount=80;
}

base.prototype = Object.create(actor.prototype);

base.prototype.act=function(clock,gameFlags,gameData){
	this.gameFlags=gameFlags;
	this.gameData=gameData;
	if(!this.exploding){
		this.js.readJoystick(this.jselect);
		if(this.js.left&&this.x>-180)
			this.x-=4;
		else if(this.js.right&&this.x<180)
			this.x+=4;
		if(this.js.fire)
			this.gameFlags.firebullet=true;
	}
	this.render(clock);
	this.gameData.bX=this.x;
	this.gameData.bY=this.y;
	return([this.gameFlags,this.gameData]);
}
	
base.prototype.resetBase=function(){
	this.exploding=false;
	this.explosionCount=80;
	this.x=-140;
	this.costume=0;
}

base.prototype.render=function(clock){
	if(!this.gameFlags.destroybase){
		this.show=true;
	}else{
		if(!this.once[0]){
			this.once[0]=true;
			this.gameData.soundStack.push({command:"PLAYTOEND",music:"explosion"});
		}
		this.costume=1+mod(Math.round(this.explosionCount/4),2);
		this.explosionCount--;
		if(this.explosionCount==0){
			if(!this.gameFlags.landed){
				this.gameData.lives--;
			}
			if(this.gameFlags.landed||this.gameData.lives==0){
				this.gameFlags.destroybase=false;
				this.gameFlags.gameover=true;
			}else{
				this.resetBase();
				this.gameFlags.resumeafterbaseexplosion=true;
			}
		}
	}
}



