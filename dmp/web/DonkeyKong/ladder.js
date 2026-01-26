// JavaScript Document

function ladder(sprite,costume,pos,vel,rotate,flip,id){
	actor.call(this,sprite,costume,pos,vel,rotate,flip);
	this.id = id;
	this.counter=0;
	this.counterDirection=1;
	this.counterSpeed=0;
	this.pause=0;
};

ladder.prototype = Object.create(actor.prototype);

ladder.prototype.act = function(data,flags){
	this.gameData=data;
	this.gameFlags = flags;
	if(!this.gameFlags.reachedPrincess&&!this.gameFlags.playerLosesLife&&!this.gameFlags.hammerStrike&&!this.gameFlags.fallingSequence&&!this.gameFlags.princessRescued&&(this.gameData.levelType==2)){
		this.set("pos", new Vector(this.pos.x,-28-this.counter));
		this.gameData.ladderData[17+184*this.id]=this.pos.y+16+8*((this.counter==0)?1:0);
		this.counterSpeed++;
		if(this.counterSpeed==2){
			this.counterSpeed=0;
			if(this.pause==0){
				this.counter+=this.counterDirection;
				if(this.counter==0||this.counter==16){
					this.counterDirection = -1*this.counterDirection;
					if(this.counter==0)
						this.pause=32;
					else
						this.pause=0;
				}
			}else{
				this.pause--;
			}
		}
	}
	return[this.gameData,this.gameFlags];
};
	