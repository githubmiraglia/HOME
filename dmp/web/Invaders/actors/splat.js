// JavaScript Document
function splat(sprite,costume,x,y,vx,vy,rotation,flip,show){
	actor.call(this,sprite,costume,x,y,vx,vy,rotation,flip,show);  
	//this.show=true;
}

splat.prototype = Object.create(actor.prototype);

splat.prototype.act=function(clock,gameFlags,gameData){
	this.gameFlags=gameFlags;
	this.gameData=gameData;
	return([this.gameFlags,this.gameData]);
}