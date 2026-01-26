// JavaScript Document
function conveyor(sprite,costume,pos,vel,rotate,flip,id){
	actor.call(this,sprite,costume,pos,vel,rotate,flip);
	this.id = id;
	this.counter = 0;
	this.conveyorDirection = [];
	this.direction = [1,-1,-1,1,1,-1];
};

conveyor.prototype = Object.create(actor.prototype);

conveyor.prototype.act = function(data,flags){
	this.gameData=data;
	this.gameFlags = flags;
	this.conveyorDirection = this.gameData.conveyorDirection;

	if(!this.gameFlags.reachedPrincess&&!this.gameFlags.playerLosesLife&&!this.gameFlags.hammerStrike&&!this.gameFlags.fallingSequence&&!this.gameFlags.princessRescued&&(this.gameData.levelType==2)){
		switch(this.id){
			case 0:
				this.counter+=this.conveyorDirection[0];
				break;
			case 1:
				this.counter+=this.conveyorDirection[0];
				break;
			case 2:
				this.counter++;
				break;
			case 3:
				this.counter--;
				break;
			case 4:
				this.counter+=this.conveyorDirection[1];
				break;
			case 5:
				this.counter+=this.conveyorDirection[1];
				break;
		}
		var costume = (Math.abs(mod(Math.floor(this.counter*this.direction[this.id]/8),3)));
		this.change("costume",costume);
		this.gameFlags.processConveyor=true;
		this.gameData.conveyorDirection = this.conveyorDirection
	}
	return[this.gameData,this.gameFlags];
}
