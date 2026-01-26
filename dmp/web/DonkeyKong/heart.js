// JavaScript Document

function heart(sprite,costume,pos,vel,rotate,flip){
	actor.call(this,sprite,costume,pos,vel,rotate,flip);
	this.clock1 = new clockCycle();
};

heart.prototype = Object.create(actor.prototype);

heart.prototype.act = function(data,flags){
	this.gameData=data;
	this.gameFlags = flags;
	
	if(this.gameFlags.reachedPrincess&&!this.gameFlags.princessRescued&&!this.gameFlags.princessKidnapped&&!(this.gameData.levelType==4)){
		this.set("pos",new Vector(4,44));
		this.change("costume",0);
	}
	if(this.gameFlags.princessRescued){
		this.clock1.setClockOnce(this.gameData.step[0],23);
		if(this.clock1.checkClock(this.gameData.step[0]))
			if(this.clock1.once){
				this.set("pos",new Vector(16,12));
				this.change("costume",0);
			}
	}
	if(this.gameFlags.princessKidnapped&&!(this.gameData.levelType==4)){
		this.change("costume",1);
	}
	
	if(!this.gameFlags.reachedPrincess&&!this.gameFlags.princessRescued&&!this.gameFlags.princessKidnapped){
		this.change("costume",2);
	}
	
	return[this.gameData,this.gameFlags];
};