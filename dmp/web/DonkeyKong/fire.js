function fire(sprite,costume,pos,vel,rotate,flip){
    actor.call(this,sprite,costume,pos,vel,rotate,flip);
    this.once=[false,false,false,false];
	this.direction =1;
	this.climbingLadder = false;
	//this.counter = 0;
	this.costumeCounter = 0;
	this.type = "FireBall";
	this.initialLaunch = 0;
	this.floorY = 0;
	this.floorIndex = 0;
	this.bottomOfLadder=0;
	this.topOfLadder =0;
	this.clearanceHeight = 0;
	this.clearanceWidth = 0;
    this.hitHammer = false;
    this.hammerDeltaX = 0;
	this.hammerDeltaY=10;
    this.rep = 0;
	this.height = 0;
    this.clock1 = new clockCycle();
    this.clock2 = new clockCycle();
    this.clock3 = new clockCycle();
    this.clock4 = new clockCycle();
    this.clock5 = new clockCycle();
};

fire.prototype = Object.create(actor.prototype);

fire.prototype.act = function(data,flags){
	this.gameData = data;
    this.gameFlags = flags;
    if(!this.once[0]){
        this.once[0]=true;
        this.initialize();
    } 
	if (!this.gameFlags.reachedPrincess&&!this.gameFlags.princessRescued&&!this.gameFlags.playerLosesLife&&!this.gameFlags.hammerStrike&&!this.gameFlags.fallingSequence){
		//this.checkNewFire()
		if(this.type=="FireBall")
			this.fireBall()
		else if(this.type=="FireFox")
			this.fireFox();
		if(this.gameFlags.countObjects)
			this.countJumpedObjects();
	}else{
        if(this.hitHammer)
           this.animationHammerStrike();
    }
    if(this.gameFlags.kongDeathHideSprites){
        this.deleteThisActor = true;
    }
    return[this.gameData,this.gameFlags];
};

fire.prototype.initialize=function(){
    this.set("vel",new Vector(0,1.6));
    this.climbingLadder = false;
    this.initialLaunch = false;
	this.counter = 120 + (2-this.gameData.difficultyLevel)*120 - (this.gameData.level -1)*20;
    this.gameData.FireCount++;
	if(this.gameData.levelType==4){
        this.direction = 1;
		this.set("vel",new Vector(0,1.2));
		this.height = Math.round(Math.random()*3);
		this.set("pos",new Vector( (104-8*this.height)*(1-((this.gameData.marioPos.x>0)?1:0)*2) , -164+40*this.height ));
		this.direction  = -1 + 2*((this.gameData.marioPos.x>0)?1:0);
		this.type = "FireFox";
	}else{
		this.initialLaunch = !(this.gameData.levelType==3);
		if(this.gameData.levelType==2){
			this.direction = -1 + 2*((this.gameData.marioPos.x>0)?1:0);
			this.set("vel",new Vector(0,1.6));
			this.set("pos",new Vector(0,-52+16));
		}else if(this.gameData.levelType==3){
			this.direction = Math.round(Math.random())*2-1
			this.set("vel",new Vector(0,1.2));
		}else{
            if(this.direction<0)
			  this.direction = 1;
            else
                this.direction=-1;
			this.set("vel",new Vector(0,1.2));
			this.set("pos", new Vector(-89,-148));
		}
		this.type = "FireBall"
	}
};

/*fire.prototype.checkNewFire =function(){
	if(this.gameData.levelType==2){
		if (this.gameData.FireCount < this.gameData.level){
			if (this.counter==0){
				this.gameFlags.createFire = true;
				this.gameData.firePos = [new Vector(0,-52+16)];
				this.counter = 120 + (2-this.gameData.difficultyLevel)*120 - (this.gameData.level -1)*20;
			}else
				this.counter--;
		}
	}else if (this.gameData.levelType == 4){
		if (this.gameData.FireCount < 5){
			if(this.counter==0){
				this.gameFlags.createFire = true;
				this.gameData.firePos = [new Vector(-89,-148)];
                this.counter = 120 + (2-this.gameData.difficultyLevel)*120 - (this.gameData.level -1)*20;
			}else{
                this.counter--;
			}
		}
	}
	
};*/

fire.prototype.fireBall = function(){
	this.change("costume",Math.floor(this.costumeCounter/2)%2+((this.gameFlags.gotHammer)?1:0)*2);
	this.costumeCounter++;
	if(!this.climbingLadder){
	 	if(!this.initialLaunch&&Math.floor(Math.random()*119)+1==1){
			this.direction = -1*this.direction;
		}
		this.change("pos",new Vector(this.direction,0));
		var arr = getHeightFire(this.pos,this.gameData.floorHeight,this.initialLaunch,this.gameData.levelType);
		this.floorIndex = arr[0];
		this.floorY = arr[1];
		if(this.floorY==0||Math.abs(this.pos.x)>104){
			this.direction = -1*this.direction;
			this.change("pos",new Vector(this.direction,0));
		}
		if(this.direction==1)
			this.flip=true;
		else
			this.flip=false;
		this.change("pos",new Vector(0,this.vel.y));
		this.change("vel", new Vector(0,-0.3));
		var arr = getHeightFire(this.pos,this.gameData.floorHeight,this.initialLaunch,this.gameData.levelType);
		this.floorIndex = arr[0];
		this.floorY = arr[1];
        if(this.pos.y<this.floorY){
			this.set("pos",new Vector(this.pos.x,this.floorY));
			this.set("vel",new Vector(0,1.2));
			this.initialLaunch = false;
		}
		var arr = checkForLadderFire(this.pos,this.gameData.ladderData,this.gameData.floorHeight,this.floorIndex,this.gameData.marioPos,this.topOfLadder);
		this.ladderIndex = arr[0];
		this.onLadder = arr[1];
		this.goingUp  = arr[2];
		this.bottomOfLadder = arr[3];
		this.topOfLadder = arr[4]
		var rand = Math.floor(Math.random()*(3+(2-this.gameData.difficultyLevel)*8));
		if(this.onLadder&&rand==1){
			this.set("pos", new Vector(Math.floor((this.pos.x+112)/8)*8-108,this.pos.y));
			this.climbingLadder=true;
		}
	}else{
		if(!this.goingUp){
			this.change("pos",new Vector(0,-1));
			if(this.pos.y<this.bottomOfLadder-0){
				this.set("pos",new Vector(this.pos.x,this.bottomOfLadder-1));
				this.climbingLadder=false;
			}
		}else{
			this.change("pos",new Vector(0,1));
			if(this.pos.y>this.topOfLadder-2){
				this.set("pos", new Vector(this.pos.x,this.topOfLadder-3));
				this.climbingLadder=false;
			}			
		}
		if(!this.climbingLadder){
			this.direction = Math.round(Math.random())*2-1;
        }
	}
	this.hammerCollision();
	this.playerCollision();
};

fire.prototype.fireFox = function(){
	this.change("costume",Math.floor(this.costumeCounter/2)%2+4+((this.gameFlags.gotHammer)?1:0)*2);
	this.costumeCounter++;
	if(!this.climbingLadder){
		if(Math.floor(Math.random()*119)+1==1)
			this.direction = -1*this.direction;
		this.change("pos", new Vector(this.direction,0));
		var arr = getHeightFire(this.pos,this.gameData.floorHeight,this.initialLaunch,this.gameData.levelType);
		this.floorIndex = arr[0];
		this.floorY = arr[1];
		if(this.floorY==0||Math.abs(this.pos.x)>104){
			this.direction = -1*this.direction;
			this.change("pos",new Vector(this.direction,0));
		}
		if(this.direction==1)
			this.flip=true;
		else
			this.flip=false;
		this.change("pos",new Vector(0,this.vel.y));
		this.change("vel", new Vector(0,-0.3));
		var arr = getHeightFire(this.pos,this.gameData.floorHeight,this.initialLaunch,this.gameData.levelType);
		this.floorIndex = arr[0];
		this.floorY = arr[1];
		if(this.pos.y<this.floorY){
			this.set("pos",new Vector(this.pos.x,this.floorY));
			this.set("vel", new Vector(0,1.2));
		}
		var arr = checkForLadderFire(this.pos,this.gameData.ladderData,this.gameData.floorHeight,this.floorIndex,this.gameData.marioPos,this.topOfLadder);
		this.ladderIndex = arr[0];
		this.onLadder = arr[1];
		this.goingUp  = arr[2];
		this.bottomOfLadder = arr[3];
		this.topOfLadder = arr[4];
		if (this.onLadder&&Math.floor(Math.random()*3)+1==1){
			this.set("pos",new Vector( Math.floor((this.pos.x+112)/8)*8-108,this.pos.y));
			this.climbingLadder=true;
		}
	}else{
		if (!this.goingUp){
        	this.change("pos", new Vector(0,-1));
			if(this.pos.y<this.bottomOfLadder-2){
				this.pos.y = this.bottomOfLadder -3;
				this.climbingLadder=false;
			}
		}else{
			this.change("pos", new Vector(0,1));
			if(this.pos.y>this.topOfLadder-2){
				this.set("pos",new Vector(this.pos.x,this.topOfLadder-3));
				this.climbingLadder=false;
			}
		}
		if(!this.climbingLadder)
			this.direction = Math.floor(Math.random())*2-1;
	}
	this.hammerCollision();
	this.playerCollision();
	
};

fire.prototype.countJumpedObjects = function(){
	if(this.direction!=this.gameData.marioDirection){
	var clearanceHeight = Math.abs(this.gameData.marioPos.y-this.pos.y);
    if(clearanceHeight>0&&clearanceHeight<24){
        var clearanceWidth = Math.abs(this.gameData.marioPos.x-this.pos.x);
        if(clearanceWidth<32)
            this.gameData.jumpObjectCount++;
    }
	}
};

fire.prototype.playerCollision = function(){
	if(Math.abs(this.pos.x-this.gameData.marioPos.x)<8 && Math.abs(this.pos.y-this.gameData.marioPos.y)<8&&!this.deleteThisActor){
        this.gameFlags.playerLosesLife = true;
        this.deleteThisActor=true;
    }
};

fire.prototype.hammerCollision = function(){
	if(this.gameFlags.gotHammer&&!this.gameFlags.hammerStrike) 
       this.checkHammerStrike();    
};

fire.prototype.checkHammerStrike = function(){
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
       
fire.prototype.animationHammerStrike = function(){
	  this.flip = false;
      if(this.rep<2){
          this.change("costume",8)
          this.clock2.setClockOnce(this.gameData.step[0],4);
          if(this.clock2.checkClock(this.gameData.step[0])){
            if(this.clock2.once)
                this.change("costume",9);
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
                this.change("costume",10);
              this.clock3.setClockOnce(this.gameData.step[0],8);
              if(this.clock3.checkClock(this.gameData.step[0])){
                if(this.clock3.once)
                    this.change("costume",11);
                this.clock4.setClockOnce(this.gameData.step[0],8);
                if(this.clock4.checkClock(this.gameData.step[0])){
                    if(this.clock4.once){
                        this.change("costume",12);
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
    



