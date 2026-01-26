// JavaScript Document

function girder(sprite,costume,pos,vel,rotate,flip){
	actor.call(this,sprite,costume,pos,vel,rotate,flip);
};

girder.prototype = Object.create(actor.prototype);

girder.prototype.act = function(data,flags){
	this.gameData = data;
	this.gameFlags = flags;
	if(!this.gameFlags.reachedPrincess&&!this.gameFlags.playerLosesLife&&!this.gameFlags.hammerStrike&&!this.gameFlags.fallingSequence&&!this.gameFlags.princessRescued){
		if(this.pos.y>=-176){
			this.change("pos", new Vector(this.vel.x,this.vel.y));
			this.change("costume", ((this.pos.x<46)?1:0)*((this.pos.y<12)?1:0) );
			if(this.pos.y>-4)
				this.vel.y-=0.4;
			else{
			 	if(this.pos.x<64){
				 	this.vel.y=-1*this.vel.y;
				 	this.set("pos", new Vector(this.pos.x,-4));
			 	}else
					this.vel.x=0;
			}
			this.playerCollision();
		}else
			this.deleteThisActor = true;
	}else
		this.deleteThisActor = true;
	return[this.gameData,this.gameFlags];
};

girder.prototype.playerCollision = function(){
	if(Math.abs(this.pos.x-this.gameData.marioPos.x)<10 && Math.abs(this.pos.y-this.gameData.marioPos.y)<10)
		this.gameFlags.playerLosesLife = true;
};