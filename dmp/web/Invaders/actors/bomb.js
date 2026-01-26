// JavaScript Document
function bomb(sprite,costume,x,y,vx,vy,rotation,flip,show,ctx){
	actor.call(this,sprite,costume,x,y,vx,vy,rotation,flip,show);  
	this.ctx=ctx;
	this.hitShield="na";
}

bomb.prototype = Object.create(actor.prototype);

bomb.prototype.act=function(clock,gameFlags,gameData){
	this.gameFlags=gameFlags;
	this.gameData=gameData;
	this.y-=4;
	if(this.y<-176)
		this.deleteThisActor=true;
	this.costume=1-this.costume;
	this.checkHitShield();
	this.checkCollisions();
	return([this.gameFlags,this.gameData]);
}

bomb.prototype.checkCollisions=function(){
	if(checkCollision(this.x,this.y,this.gameData.bulletX,this.gameData.bulletY,8)){
		this.deleteThisActor=true;
		this.gameFlags.removebullet=true;
	}
	if(checkCollision(this.x,this.y,this.gameData.bX,this.gameData.bY,12)){
		this.deleteThisActor=true;
		this.gameFlags.destroybase=true;
	}
}

bomb.prototype.checkHitShield=function(clock){
	for(let i=0;i<1;i++){
		this.hitShield=checkColor(this.ctx,this.x-3*_SCALE,this.y+7*_SCALE,6*_SCALE,14*_SCALE,this.hitShield)
		if(this.hitShield=="shieldhit"){
			this.gameData.bombSplatX.push(this.x);
			this.gameData.bombSplatY.push(this.y);
			this.gameFlags.bombSplat=true;
			this.deleteThisActor=true;
			break;
		}
	}
}
