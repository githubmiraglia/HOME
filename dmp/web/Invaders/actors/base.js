// JavaScript Document
function base(sprite,costume,x,y,vx,vy,rotation,flip,show,js,jselect){
	actor.call(this,sprite,costume,x,y,vx,vy,rotation,flip,show);  
	this.js=js;
	this.jselect=jselect;
	this.exploding=false;
	this.explosionCount=80;
	this.preventMultipleFiring=false;
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
		if(this.js.fire&&!this.preventMultipleFiring){
			this.gameFlags.firebullet=true;
			this.preventMultipleFiring=true;
		}
		if(!this.js.fire)
			this.preventMultipleFiring=false;
	}
	this.render(clock);
	if(this.gameFlags.landed)
		this.gameFlags.destroybase=true;
	this.gameData.bX=this.x;
	this.gameData.bY=this.y;
	return([this.gameFlags,this.gameData]);
}
	
base.prototype.resetBase=function(){
	this.exploding=false;
	this.explosionCount=80;
	this.costume=0;
	this.gameFlags.firebullet=false;
}

base.prototype.render=function(clock){
	if(!this.gameFlags.destroybase){
		this.show=true;
	}else{
		this.gameFlags.pausedForPlayerExplosion=true;
		if(!this.once[0]){
			this.once[0]=true;
			this.gameData.soundStack.push({command:"PLAY",music:"explosion"});
			this.exploding=true;
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
				this.gameFlags.destroybase=false;
				this.once[0]=false;
				this.gameFlags.pausedForPlayerExplosion=false;
				this.resetBase();
			}
		}
	}
}



