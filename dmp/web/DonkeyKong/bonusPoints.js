// JavaScript Document

function bonusPoints(sprite,costume,pos,vel,rotate,flip){
	actor.call(this,sprite,costume,pos,vel,rotate,flip);
	this.once=[false,false,false,false];
	this.clock1 = new clockCycle();
	this.bonus = 0;
};

bonusPoints.prototype = Object.create(actor.prototype);

bonusPoints.prototype.act = function(data,flags){
	this.gameData=data;
	this.gameFlags = flags;
	if(this.gameFlags.runBonusPoints){
		if(!this.once[0]){
			this.once[0]=true;
			switch(this.gameData.jumpObjectCount){
				case 1:
					this.gameData.score+=100;
					this.change("costume",0);
					break;
				case 2:
					this.gameData.score+=300;
					this.change("costume",1);
					break;
				case 3:
					this.gameData.score+=500;
					this.change("costume",3);
			}
			this.gameData.soundTrack.push({command:"PLAY",music:"jumpbar"});
			this.set("pos",new Vector(this.gameData.marioPos.x,this.gameData.marioPos.y-12));
			this.gameData.jumpObjectCount = 0;
		}
		this.clock1.setClockOnce(this.gameData.step[0],20);
		if(this.clock1.checkClock(this.gameData.step[0])){
		   this.gameFlags.runBonusPoints = false;
		   this.deleteThisActor = true;
	  	}
	}
	return[this.gameData,this.gameFlags];
};
	