// JavaScript Document
function concrete(sprite,costume,pos,vel,rotate,flip){
	actor.call(this,sprite,costume,pos,vel,rotate,flip);
	this.hammerDeltaX=0;
	this.hammerDeltaY=0;
	this.hitHammer=false;
	this.rep=0;
	this.clock1=new clockCycle();
	this.clock2=new clockCycle();
	this.clock3=new clockCycle();
	this.clock4=new clockCycle();
	this.clock5=new clockCycle();
};

concrete.prototype = Object.create(actor.prototype);

concrete.prototype.act = function(data,flags){
	this.gameData=data;
	this.gameFlags = flags;
	if(!this.gameFlags.reachedPrincess&&!this.gameFlags.playerLosesLife&&!this.gameFlags.hammerStrike&&!this.gameFlags.fallingSequence&&!this.gameFlags.princessRescued&&(this.gameData.levelType==2)){
		if(this.pos.y==-48){
			if(this.pos.x<0)
				this.change("pos",new Vector(1,0));
			else{
				if(this.pos.x>0)
					this.change("pos",new Vector(-1,0));
				else
					this.deleteThisActor=true;
			}
		}else{
			if(this.pos.y==-128){
				this.change("pos", new Vector(this.gameData.conveyorDirection[1],0));
				if(Math.abs(this.pos.x)==124)
					this.deleteThisActor=true;
			}
		}
		this.hammerCollision();
		this.playerCollision();
		if(this.gameFlags.countObjects)
			this.countJumpedObjects();
	}else{
		if(this.hitHammer)
			this.animationHammerStrike();
	}
	return[this.gameData,this.gameFlags];
};

concrete.prototype.countJumpedObjects = function(){
	var clearanceHeight = Math.abs(this.gameData.marioPos.y-this.pos.y);
    if(clearanceHeight>0&&clearanceHeight<24){
        var clearanceWidth = Math.abs(this.gameData.marioPos.x-this.pos.x);
        if(clearanceWidth<32)
            this.gameData.jumpObjectCount++;
    }
};


concrete.prototype.playerCollision = function(){
	if(Math.abs(this.pos.x-this.gameData.marioPos.x)<8&&Math.abs(this.pos.y-this.gameData.marioPos.y)<8)
		this.gameFlags.playerLosesLife=true;
}

concrete.prototype.hammerCollision = function(){
	if(this.gameFlags.gotHammer&&!this.gameFlags.hammerStrike)
       this.checkHammerStrike();    
};

concrete.prototype.checkHammerStrike = function(){
    this.hammerDeltaX = 16*this.gameData.marioDirection*(this.gameFlags.hammerUp?0:1);
	this.hammerDeltaY = 15*(this.gameFlags.hammerUp?1:0)-2
    if(Math.abs(this.pos.x-(this.gameData.marioPos.x+this.hammerDeltaX))<8 && Math.abs(this.pos.y-(this.gameData.marioPos.y+this.hammerDeltaY))<8){
        this.gameFlags.hammerStrike = true;
		this.hitHammer = true;
        this.gameData.score=this.gameData.score+300;
        this.gameData.soundTrack.push({command:"PLAY",music:"hammer hit"});
		this.gameData.soundTrack.push({command:"STOP",music:"walking"});
	}
};
       
concrete.prototype.animationHammerStrike = function(){
	  this.flip = false;
      if(this.rep<2){
          this.change("costume",1)
          this.clock2.setClockOnce(this.gameData.step[0],4);
          if(this.clock2.checkClock(this.gameData.step[0])){
            if(this.clock2.once)
                this.change("costume",2);
            this.clock3.setClockOnce(this.gameData.step[0],4);
            if(this.clock3.checkClock(this.gameData.step[0])){
                this.clock3.resetClock();
                this.clock2.resetClock();
                this.rep++;
            }
          }
      }else{
          this.clock2.setClockOnce(this.gameData.step[0],0);
          if(this.clock2.checkClock(this.gameData.step[0])){
              if(this.clock2.once)
                this.change("costume",3);
              this.clock3.setClockOnce(this.gameData.step[0],8);
              if(this.clock3.checkClock(this.gameData.step[0])){
                if(this.clock3.once)
                    this.change("costume",4);
                this.clock4.setClockOnce(this.gameData.step[0],8);
                if(this.clock4.checkClock(this.gameData.step[0])){
                    if(this.clock4.once){
                        this.change("costume",5);
                    }
                    this.clock5.setClockOnce(this.gameData.step[0],30);
                    if(this.clock5.checkClock(this.gameData.step[0])){
						this.rep = 0;
						this.hitHammer = false;
						this.gameFlags.hammerStrike = false;
                        this.deleteThisActor=true;
                        this.clock1.resetClock();
                        this.clock2.resetClock();
                        this.clock3.resetClock();
                        this.clock4.resetClock();
                    }
                }
              }
          }
      }
};