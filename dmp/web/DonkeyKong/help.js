// JavaScript Document
function help(sprite,costume,pos,vel,rotate,flip){
	actor.call(this,sprite,costume,pos,vel,rotate,flip);
};

help.prototype = Object.create(actor.prototype);

help.prototype.act = function(data,flags){
	this.gameData = data;
	this.gameFlags = flags;
	if (!this.gameFlags.reachedPrincess&&!this.gameFlags.princessRescued&&!this.gameFlags.playerLosesLife&&!this.gameFlags.hammerStrike&&!this.gameFlags.fallingSequence){	
		if(this.gameFlags.help){
			if(this.gameData.princessDirection==1){
				this.set("pos",new Vector(this.gameData.princessPos.x+22,this.gameData.princessPos.y+9));
				this.change("costume",0);
			}else{
				this.set("pos",new Vector(this.gameData.princessPos.x-22,this.gameData.princessPos.y+9));
				this.change("costume",1);
			}
		}else
			this.change("costume",4);	
	}else
		this.change("costume",4);
	return[data,flags];
};