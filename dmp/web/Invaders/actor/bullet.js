// JavaScript Document
function bullet(sprite,costume,x,y,vx,vy,rotation,flip,show,ctx){
	actor.call(this,sprite,costume,x,y,vx,vy,rotation,flip,show);  
	this.firing="f";
	this.ctx=ctx;
}

bullet.prototype = Object.create(actor.prototype);

bullet.prototype.act=function(clock,gameFlags,gameData){
	this.gameFlags=gameFlags;
	this.gameData=gameData;
	if(this.gameFlags.firebullet&&this.firing!="t"){
		this.gameFlags.firebullet=false;
		this.firing="t";
		this.x=this.gameData.bX;
		this.y=this.gameData.bY;
		this.gameData.soundStack.push({command:"PLAYTOEND",music:"shoot"});
	}
	this.checkHitShield(clock);
	this.updateBullet(clock);
	if(this.gameFlags.removeBullet)
		this.removeBullet(clock);
	this.render(clock);
	return([this.gameFlags,this.gameData]);
}

bullet.prototype.updateBullet(clock){
	if(this.firing=="t"){
		this.y+=12;
		if(this.y>180){
			this.firing="f";
			this.show=false;
		}
	}
}

bullet.prototype.removeBullet(clock){
	this.gameFlags.removeBullet=false;
	this.firing="f";
	this.show=false;
}

bullet.prototype.render=function(clock){
	if(this.firing=="t"){
		this.show=true;
	}else{
		if(this.firing=="shieldhit"){
			this.gameFlags.bulletSplat=true;
			this.gameData.bulletSplatX=this.x;
			this.gameData.bulletSplatY=this.y;
			this.gameFlags.removeBullet=true;
		}else{
			this.show=false;
		}
	}
}

bullet.checkHitShield=function(clock){
	this.firing=checkColor(this.ctx,this.x-2,this.y-4,4,-2,this.firing);
}
