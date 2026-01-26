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
		this.gameData.soundStack.push({command:"PLAYTOEND",music:"shoot",volume:0.30});
	}
	if(this.firing=="t"){
		this.updateBullet(clock);
		this.checkHitShield(clock);
	}
	if(this.gameFlags.removebullet)
		this.removeBullet(clock);
	this.render(clock);
	this.gameData.bulletX=this.x;
	this.gameData.bulletY=this.y;
	return([this.gameFlags,this.gameData]);
}

bullet.prototype.updateBullet=function(clock){
	if(this.firing=="t"){
		this.y+=8;
		if(this.y>96){
			this.firing="f";
			this.show=false;
			this.removeBullet(clock);
		}
	}
}

bullet.prototype.removeBullet=function(clock){
	this.gameFlags.firebullet=false;
	this.gameFlags.removebullet=false;
	this.firing="f";
	this.show=false;
	this.x=-140;
	this.y=-170;
}

bullet.prototype.render=function(clock){
	if(this.firing=="t"){
		this.show=true;
	}else{
		if(this.firing=="shieldhit"){
			this.gameFlags.bulletSplat=true;
			this.gameFlags.removebullet=true;
		}else{
			this.show=false;
		}
	}
}

bullet.prototype.checkHitShield=function(clock){
	for(let i=0;i<1;i++){
		this.firing=checkColor(this.ctx,this.x-2*_SCALE,this.y+4*_SCALE,4*_SCALE,8*_SCALE,this.firing);
		if(this.firing=="shieldhit"){
			this.gameData.bulletSplatX=this.x;
			this.gameData.bulletSplatY=this.y;
			break;
		}
	}
}
