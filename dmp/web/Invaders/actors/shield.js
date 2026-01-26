// JSON Document
function shield(sprite,costume,x,y,vx,vy,rotation,flip,show){
	actor.call(this,sprite,costume,x,y,vx,vy,rotation,flip,show);
	this.exploding=false;
	this.explosionCount=80;
}

shield.prototype = Object.create(actor.prototype);

shield.prototype.act=function(clock,gameFlags,gameData){
	this.gameFlags=gameFlags;
	this.gameData=gameData;
	return([this.gameFlags,this.gameData]);
}