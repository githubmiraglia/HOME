// JavaScript Document
function levelFlags(cd){
	this.cd = cd;
	this.gameFlags = {};
	this.gameData = {};
	this.flagAmount=[50,30,20,10,5,1];
	this.flagCostume=[5,4,3,2,1,0];
	this.flagWidth=[10,8,16,16,16];
	this.flagScore = 0;
	this.flagIndex = 0;
	this.flagData = [];
	this.flagWait = [];
	this.clockZero = 0;
	this.flagCount = 0;
	this.wait=0;
	this.once=[false,false,false,false,false];
}

levelFlags.prototype.reset = function(stage,gameFlags,gameData){
	this.flagScore = stage;
	this.flagIndex = 0;
	this.flagCostumes =[];
	this.clockZero = 0;
	this.flagCount = 0;
	this.wait =0;
	this.flagPrints = 0;
	this.once=[false,false,false,false,false];
	this.gameFlags = gameFlags;
	this.gameData = gameData;
}

levelFlags.prototype.animate = function(clock){
	if(!this.once[0]){
		this.once[0]=true;
		this.clockZero = clock;
		this.flagCount = 0;
		while(this.flagScore!=0){
			if(this.flagScore>=this.flagAmount[this.flagIndex]){
				this.flagScore-=this.flagAmount[this.flagIndex];
					this.flagCostumes.unshift(this.flagCostume[this.flagIndex]);
					this.flagCount++;
			}else
				this.flagIndex++;
		}
	}
	if(this.flagCount>0){
		if((clock-this.clockZero)>=(this.wait/(_TICK/1000))){
			this.flagPrints++;
			this.wait+=0.15+(this.flagPrints-1)*0.05;
			this.flagCount--;
			this.gameData.soundStack.push({command:"PLAY",music:"nextlevel"});
		}
	}else
		this.gameFlags.levelFlags="ended";
	
	return [this.gameFlags,this.gameData];
	
}

levelFlags.prototype.print = function(){
	if(this.flagCostumes){
		var flagX=105;
		for(var i=0; i<this.flagPrints; i++){
			this.cd.drawSingleActor("flags",this.flagCostumes[i],flagX,-190);
			flagX-=this.flagWidth[this.flagCostumes[i]];
		}
	}
}

