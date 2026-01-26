function barrel(sprite,costume,pos,vel,rotate,flip,barrelType,actionType){
	actor.call(this,sprite,costume,pos,vel,rotate,flip);
    this.direction=1;
    this.falling = false;
    this.dropDownLadder =false;
    this.barrelType =0;
    this.once = false;
    this.once2 = false;
    this.once3 = false;
    this.onceArray = [false,false,false,false];
    this.clock1 = new clockCycle;
    this.changeCostume = 21811;
    this.floorY = 0;
    this.checkLadder = false;
    this.bottomOfLadder = 0;
    this.ladderIndex = 0;
    this.barrelType = barrelType;
    this.actionType = actionType;
    this.hitHammer = false;
    this.rep = 0;
	this.hammerDeltaX = 0;
	this.clock1 = new clockCycle();
	this.clock2 = new clockCycle();
	this.clock3 = new clockCycle();
	this.clock4 = new clockCycle();
	this.clock5 = new clockCycle();
	
}

barrel.prototype = Object.create(actor.prototype);

barrel.prototype.act = function(data,flags){
    if(!this.once){
        this.gameData = data;
        this.gameFlags = flags;
        this.change("costume",4+this.barrelType*6); 
        this.once = true;
    }
    this.clock1.setClockOnce(this.gameData.step[0],10)
    if(this.clock1.checkClock(this.gameData.step[0])){                                  if(!this.gameFlags.hammerStrike&&!this.gameFlags.reachedPrincess&&!this.gameFlags.princessRescued&&!this.gameFlags.playerLosesLife){
            if(this.actionType=="ROLL"){
                if(!this.once3){
                    this.set("pos",new Vector(-40,-3));
                    this.once3 = true;
                }
                this.processRoll();
            }else{
                this.processDrop();
            }
        }else{
            if(this.hitHammer)
                this.animationHammerStrike();
        }
    }
    return([this.gameData,this.gameFlags]);
};

barrel.prototype.processRoll = function(){
    if(!this.gameData.hammerStrike){
        this.changeCostume = this.changeCostume - this.direction;
        if(!this.dropDownLadder){
            this.change("costume",Math.floor(this.changeCostume/2)%2+this.barrelType*6);
            if(this.falling) 
                this.change("pos",new Vector(this.direction*1,0));
            else{
                this.change("pos",new Vector(this.direction*2,0));
            }
            if(this.barrelType==1&&this.pos.x<-88){
                this.gameFlags.createFire = true;
                this.gameData.firePos = [new Vector(-89,-148)];
                this.deleteThisActor = true;
            }else if(this.pos.x<-112){
                this.deleteThisActor = true;
            }
            this.change("pos", this.vel);
            this.change("vel", new Vector(0,-0.3));
			var arr = getHeightBarrel(this.pos,this.gameData.floorHeight); 
            this.floorIndex = arr[0];
			this.floorY = arr[1];
			this.falling = arr[2]; 
            if(this.pos.y<(this.floorY - 3)){
                this.set("pos", new Vector(this.pos.x,this.floorY-4));
                if(this.vel.y<-3)
                    this.direction = -1*this.direction;
                this.set("vel", new Vector(0,Math.abs(this.vel.y)/2.5));
                if(this.vel.y<0.4)
                    this.set("vel", new Vector(0,0));   
            }
			var arr = checkForLadderBarrel(this.pos,this.floorIndex,this.gameData.floorHeight,this.gameData.ladderData);
			this.bottomOfLadder = arr[0];
			this.ladderIndex = arr[1];
			this.checkLadder = arr[2];
            if(this.checkLadder){
                var pickRandom = 16 + 2 - this.gameData.difficultyLevel*4 - (this.gameData.level-1)*2
                if(Math.floor(Math.random()*(pickRandom-1))+1 == 1){
                    this.dropDownLadder = true;
                    this.set("pos", new Vector(Math.floor((this.pos.x+112)/8)*8-108,this.pos.y));
                    this.change("costume",4+this.barrelType*6+Math.floor(this.changeCostume/4)%2);
                }
            }
        }else{
            this.change("pos",new Vector(0,-2));
            this.change("costume",4+this.barrelType*6+Math.floor(this.changeCostume/4)%2);
            if(this.pos.y<(this.bottomOfLadder-2)){
                this.set("pos",new Vector(this.pos.x,this.bottomOfLadder-3));
                this.dropDownLadder=false;
                this.direction = -1*this.direction;
            }
        }
		this.hammerCollision();
        this.playerCollision();
        if(this.gameFlags.countObjects){
            this.countJumpedObjects();
        }
    }
};
             
barrel.prototype.processDrop=function(){        
    if(!this.once2){
        this.direction = -1;
        this.falling = true;
        this.once2 = true;
    }
    if(!this.gameFlags.hammerStrike){
        this.changeCostume = this.changeCostume - this.direction;
        this.change("costume",4+this.barrelType*6+Math.floor(this.changeCostume/4)%2);
        if(!this.falling){
            if(this.pos.y>-160){
                this.change("pos",this.vel);
                this.change("vel", new Vector(0,-0.3));
				var arr = getHeightBarrel(this.pos,this.gameData.floorHeight);
				this.floorIndex = arr[0];
				this.floorY = arr[1];
				this.falling = arr[2];
            }else{
                this.change("costume",Math.floor(this.changeCostume/2)%4+this.barrelType*6);
                this.change("pos",new Vector(this.direction*2,0));
                if(this.barrelType == 1 && this.pos.x<-88){
                    this.gameFlags.createFire=true;
					this.gameData.firePos = [new Vector(-89,-105)];
                    this.deleteThisActor =true;
                }else if(this.pos.x<-112){
                    this.deleteThisActor = true;
                }
            }
        }else{
            this.change("pos",this.vel);
            this.change("vel", new Vector(0,-0.3));
			var arr = getHeightBarrel(this.pos,this.gameData.floorHeight);
            this.ladderIndex = arr[0];
			this.floorY = arr[1];
			this.falling = arr[2];
            if(this.pos.y<this.floorY-2){
                this.set("pos", new Vector(this.pos.x,this.floorY-3));
                this.set("vel",new Vector(0,0));
            }
        }
    }
	this.hammerCollision();
	this.playerCollision();
    if(this.gameFlags.countObjecs){
        this.countJumpedObjects();
    }
        
};
    
barrel.prototype.countJumpedObjects = function(){
	if(this.direction==-1*this.gameData.marioDirection){
    var clearanceHeight = Math.abs(this.gameData.marioPos.y-this.pos.y);
    if(clearanceHeight>0&&clearanceHeight<24){
        var clearanceWidth = Math.abs(this.gameData.marioPos.x-this.pos.x);
        if(clearanceWidth<20){
            this.gameData.jumpObjectCount++;
        }
    }
	}
};

barrel.prototype.playerCollision = function(){
    if(Math.abs(this.pos.x-this.gameData.marioPos.x)<8 && Math.abs(this.pos.y-this.gameData.marioPos.y)<8&&!this.deleteThisActor){
        this.gameFlags.playerLosesLife = true;
        this.deleteThisActor=true;
    }
};


barrel.prototype.hammerCollision = function(){
	if(this.gameFlags.gotHammer&&!this.gameFlags.hammerStrike)
       this.checkHammerStrike();    
};

barrel.prototype.checkHammerStrike = function(){
    this.hammerDeltaX = 16*this.gameData.marioDirection*(this.gameFlags.hammerUp?0:1);
	this.hammerDeltaY = 15*(this.gameFlags.hammerUp?1:0)-2
    if(Math.abs(this.pos.x-(this.gameData.marioPos.x+this.hammerDeltaX))<8 && Math.abs(this.pos.y-(this.gameData.marioPos.y+this.hammerDeltaY))<8){
        this.gameFlags.hammerStrike = true;
		this.hitHammer = true;
        this.gameData.score=this.gameData.score+300;
		this.gameData.soundTrack.push({command:"STOP",music:"walking"});
        this.gameData.soundTrack.push({command:"PLAY",music:"hammer hit"});
	}
};
       
barrel.prototype.animationHammerStrike = function(){
      if(this.rep<2){
          this.change("costume",12)
          this.clock2.setClockOnce(this.gameData.step[0],4);
          if(this.clock2.checkClock(this.gameData.step[0])){
            if(this.clock2.once)
                this.change("costume",13);
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
                this.change("costume",14);
              this.clock3.setClockOnce(this.gameData.step[0],8);
              if(this.clock3.checkClock(this.gameData.step[0])){
                if(this.clock3.once)
                    this.change("costume",15);
                this.clock4.setClockOnce(this.gameData.step[0],8);
                if(this.clock4.checkClock(this.gameData.step[0])){
                    if(this.clock4.once){
                        this.change("costume",16);
                    }
                    this.clock5.setClockOnce(this.gameData.step[0],30);
                    if(this.clock5.checkClock(this.gameData.step[0])){
						this.rep = 0;
						this.gameFlags.hammerStrike = false;
                        this.deleteThisActor = true;
						this.hitHammer = false;
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
    



