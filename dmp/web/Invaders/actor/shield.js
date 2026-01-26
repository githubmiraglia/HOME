// JSON Document
function shield(sprite,costume,x,y,vx,vy,rotation,flip,show){
	actor.call(this,sprite,costume,x,y,vx,vy,rotation,flip,show);  
	this.exploding=false;
	this.explosionCount=80;
}

base.prototype = Object.create(actor.prototype);

base.prototype.act=function(clock,gameFlags,gameData){
	this.gameFlags=gameFlags;
	this.gameData=gameData;
	return([this.gameFlags,this.gameData]);
}