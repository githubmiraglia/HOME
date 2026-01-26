function mario(sprite,costume,pos,vel,rotate,flip,js){
	actor.call(this,sprite,costume,pos,vel,rotate,flip);
	this.js=js;
    this.jumping=false;
    this.justLanded=false;    
    this.onLadder=false;
    this.falling=false;
    this.dying=false
    this.index=0;
    this.ladderIndex=0;
    this.costumeCounter=0;
    this.floorIndex=0;
    this.direction=0;
    this.newDirection=0;
    this.climbDirection=0;
    this.jumpFromY=0;
    this.bottomFloorY=0;
    this.topFloorY=0;
    this.xCache=0;
    this.initialTime = 0;
    this.deltaTime=0;
    this.wait = false;
    this.newPos = new Vector(0,0);
    this.y = 0;
    this.once=false;
	this.deathOnce=false;
	this.onceHammer = false;
	this.onceDeath =false;
	this.onceReachedPrincess = false;
};

mario.prototype = Object.create(actor.prototype);

mario.prototype.setCostume = function(){
    if(!this.gameFlags.gotHammer)
        this.change("costume",Math.floor((this.costumeCounter%8)/2));
    else
        this.change("costume",Math.floor((this.costumeCounter%8)/2)+4+4*(this.gameFlags.hammerUp?1:0));        
}

mario.prototype.processDirection=function(direction){
    this.newDirection = 0;
    if(this.js.right){
        this.flip = true;
        this.newDirection = 1;
    }else if (this.js.left){
        this.flip =false;
        this.newDirection = -1;
    }
    if(this.newDirection!=0)
        this.direction=this.newDirection;
};
        
mario.prototype.processWalk=function(){
    this.change("pos", new Vector(1.5*this.direction,0));
    if(Math.abs(this.pos.x)>104||(this.gameData.levelType==1 && this.pos.y>-8 && this.pos.x<-20)){
        this.change("pos", new Vector(-1.5*this.direction,0));
		_WALKING[this.gameData.player]=false;
		if(!_WALKING[0]&&!_WALKING[1])
        	this.gameData.soundTrack.push({commnad:"STOP",music:"walking"});
    }else{
		if(!this.gameFlags.hammerStrike){
			_WALKING[this.gameData.player]=true;
        	this.gameData.soundTrack.push({command:"PLAY",music:"walking"});
		}
        this.costumeCounter++;
        this.setCostume();
		var arr = getHeight(this.pos,this.gameData.floorHeight,this.falling); 
        this.floorIndex = arr[0];
		this.y = arr[1];
		this.falling = arr[2];
        if(!this.falling){
            this.set("pos",new Vector(this.pos.x,this.y));
        }else{
            this.set("vel",new Vector(0,0));
        }
    }
};
  
mario.prototype.processClimbDirection=function(){
    this.climbDirection = 0;
    if(this.js.up)
        this.climbDirection = 1;
    if(this.js.down)
        this.climbDirection=-1;
    if(this.climbDirection==1){
        this.wait = true;
		var arr = checkForLadder(this.pos,this.gameData.ladderData,"Up");
		this.onLadder = arr[0];
		this.ladderIndex = arr[1];
		this.newPos = arr[2];
		this.wait = arr[3];
        if(this.onLadder){
            this.set("pos",this.newPos);
            this.change("pos", new Vector(0,1));
            this.change("costume",15);
            if(Math.floor((this.costumeCounter%8)/4)==0)
                this.flip=true;
            else
                this.flip=false;
            this.bottomFloorY = this.gameData.floorHeight[this.floorIndex]+8;
            this.topFloorY = this.gameData.floorHeight[this.floorIndex-1] + 8;
        }
    }else if(this.climbDirection==-1){
        this.wait = true;
		var arr =  checkForLadder(this.pos,this.gameData.ladderData,"Down");
		this.onLadder = arr[0];
		this.ladderIndex = arr[1];
		this.newPos = arr[2];
		this.wait = arr[3];
        if(this.onLadder){
            this.set("pos",this.newPos);
            this.change("pos", new Vector(0,-1));
            this.change("costume",15);
            if(Math.floor((this.costumeCounter%8)/4)==0)
                this.flip=true;
            else
                this.flip=false;
            this.bottomFloorY = this.gameData.floorHeight[this.floorIndex+1]+8;
            this.topFloorY = this.gameData.floorHeight[this.floorIndex] + 8;
        }
    }
    if(!this.onLadder){
		 var arr = getHeight(this.pos,this.gameData.floorHeight,this.falling);
         this.floorIndex = arr[0];
		 this.y = arr[1];
		 this.falling=arr[2]; 
        if(!this.falling)
            this.set("pos",new Vector(this.pos.x,this.y));
        else
            this.set("vel",new Vector(0,0));
    }
};
        
mario.prototype.processStartJump=function(){
    this.jumping = true;
    this.set("vel",new Vector(0,2.6));
    this.jumpObjectCount=0;
    this.change("costume",20);
    this.jumpFromY = this.pos.y;
	_WALKING[this.gameData.player]=false;
	if(!_WALKING[0]&&!_WALKING[1])
    	this.gameData.soundTrack.push({command:"STOP",music:"walking"});
	this.gameData.soundTrack.push({command:"PLAY",music:"jump"});

};

mario.prototype.processFalling=function(){
    this.change("pos",this.vel);
    this.change("vel",new Vector(0,-0.3));
    var arr = getHeight(this.pos,this.gameData.floorHeight,this.falling);
    this.floorIndex = arr[0];
	this.y = arr[1];
	this.falling = arr[2];
    if((this.pos.y<this.y)||(this.gameData.levelType==3&&this.y<=-172)){
        this.set("pos",new Vector(this.pos.x,this.y));
        this.dying = true;
        this.change("costume",16);
        this.initialTime = this.gameData.step[0];
        this.soundsLosesLife();
    }
};
        
mario.prototype.processJump=function(){
  this.gameFlags.countObjects=false;
  this.change("pos",new Vector(1.5*this.newDirection,0));
  if(Math.abs(this.pos.x)>104||(this.gameData.levelType==1 && this.pos.y>-8 && this.pos.x<-20)){
      if (this.jumpFromY-this.pos.y<8){
            this.newDirection = -this.newDirection;
            this.set("vel",new Vector(0,-this.vel.y));
            this.change("pos",new Vector(-1.5*this.direction,0));
            this.direction = this.newDirection
            this.flip?this.flip=false:this.flip=true;
        }else
            this.change("pos",new Vector(-1.5*this.newDirection,0));
    }
    this.change("pos",this.vel);
    this.change("vel",new Vector(0,-0.3));
    if((this.vel.y+0.3>=0)&&(this.vel.y<0)){
        this.gameFlags.countObjects=true;
    }
    if(this.gameData.jumpObjectCount>0&&!this.gameFlags.runBonusPoints){
        this.gameFlags.displayJumpBonus=true;
    }
	var arr = getHeight(this.pos,this.gameData.floorHeight,this.falling);
    this.floorIndex = arr[0];
	this.y = arr[1];
	this.falling = arr[2]; 
    if(this.pos.y<this.y){
        this.set("pos",new Vector(this.pos.x,this.y));
        this.jumping = false;
        this.change("costume",16);
        this.justLanded=true;
		this.gameFlags.justLanded = true;
        this.falling = false;
        if((this.jumpFromY-this.pos.y)>=16){
            this.dying = true;
            this.initialTime = this.gameData.step[0];
            this.soundsLosesLife();
        }
    }
};

mario.prototype.processClimb=function(){
    this.climbDirection = 0;
    if(this.js.up)
        this.climbDirection = 1;
    if(this.js.down)
        this.climbDirection=-1;
    this.change("pos", new Vector(0,this.climbDirection*1));
    if(this.climbDirection != 0){
        if(this.topFloorY - this.pos.y<5)
            this.change("costume",14);
        else if(this.topFloorY - this.pos.y<9)
            this.change("costume",13);
        else
            this.change("costume",12);
    }
    if (this.pos.y<=this.bottomFloorY){
        this.set("pos", new Vector(this.pos.x,this.bottomFloorY));
        this.onLadder = false;
        this.change("costume",15);
        var arr = getHeight(this.pos,this.gameData.floorHeight,this.falling);
        this.floorIndex = arr[0];
		this.y = arr[1];
		this.falling = arr[2]; 
		_WALKING[this.gameData.player]=false;
		if(!_WALKING[0]&&!_WALKING[1])
        	this.gameData.soundTrack.push({command:"STOP",music:"walking"});
    }else{
        if(this.pos.y>=this.gameData.ladderData[this.ladderIndex+1]){
            this.set("pos", new Vector(this.pos.x,this.gameData.ladderData[this.ladderIndex+1]));
            if(this.pos.y>=this.topFloorY){
                this.set("pos", new Vector(this.pos.x,this.topFloorY));
                this.onLadder = false;
                this.change("costume",15);
				var arr = getHeight(this.pos,this.gameData.floorHeight,this.falling);
                this.floorIndex = arr[0];
				this.y = arr[1];
				this.falling = arr[2];
                if( ((this.gameData.levelType==1 || this.gameData.levelType==3)&&this.pos.y>20) || (this.gameData.levelType==2 && this.pos.y>-12) ){
                    this.gameFlags.reachedPrincess = true;
                    return;
                } 
            }
			_WALKING[this.gameData.player]=false;
			if(!_WALKING[0]&&!_WALKING[1])
            	this.gameData.soundTrack.push({command:"STOP",music:"walking"});
        }else{
            if(this.climbDirection!=0){
                this.costumeCounter++;
                /*if(this.costumeCounter<0)
                    this.costumeCounter = 0;*/
                if(Math.floor((this.costumeCounter%8)/4)==0)
                    this.flip=true;
                else
                    this.flip=false;
				if(!this.gameFlags.hammerStrike){
					_WALKING[this.gameData.player]=true;
                	this.gameData.soundTrack.push({command:"PLAY",music:"walking"});
				}
            }else{
				_WALKING[this.gameData.player]=false;
				if(!_WALKING[0]&&!_WALKING[1])
					this.gameData.soundTrack.push({command:"STOP",music:"walking"});
            }
        }
    }   
};
        
mario.prototype.processConveyors=function(){
    
};
        
        
mario.prototype.soundsLosesLife = function(){
	if(!this.deathOnce){
    	this.gameData.soundTrack.push({command:"STOP",music:"hammer"});
		this.gameData.soundTrack.push({command:"STOP",music:"jump"});
		_WALKING[this.gameData.player]=false;
		if(!_WALKING[0]&&!_WALKING[1]){
    		this.gameData.soundTrack.push({command:"STOP",music:"walking"});
			this.gameData.soundTrack.push({command:"STOP",music:"bacmusic"});
		}
		this.gameData.soundTrack.push({command:"PLAY",music:"death"});
		this.deathOnce=true;
	}
};

mario.prototype.animationLosesLife = function(){
	this.soundsLosesLife();
    this.deltaTime = this.gameData.step[0] - this.initialTime;
    if(this.deltaTime>20&&this.deltaTime<=70){			
        this.change("costume",17);
        if(this.deltaTime%4==0)
            if (this.flip)
                this.change("rotation",Math.PI/4);
            else
                this.change("rotation",-Math.PI/4);
    }else if (this.deltaTime>53&&this.deltaTime<100){
        this.change("costume",19);
        this.set("rotation",0);
    }else if(this.deltaTime>130){
        this.dying = false;
		this.once = false;
        this.gameFlags.lifeLost = true;
    }
};

mario.prototype.princessRescued=function(){
    this.set("pos", new Vector(28,-4));
    this.change("costume",0);
    this.flip=false;
    
};
        
mario.prototype.reachedPrincess=function(){
	_WALKING[this.gameData.player]=false;
	if(!_WALKING[0]&&!_WALKING[1]){
    	this.gameData.soundTrack.push({command:"STOP",music:"walking"});
    	this.gameData.soundTrack.push({command:"STOP",music:"bacmusic"});
	}
    this.gameData.soundTrack.push({command:"PLAY",music:"reached princess"});
    this.change("costume",0);
	if(this.gameData.levelType==2||this.gameData.levelType==4){
	 if(this.pos.x<this.gameData.princessPos.x)
		this.flip=true;
	  else
		this.flip=false;
	}else{
		this.flip=false;
	}
};
        
mario.prototype.processControls=function(){
    this.xCache = this.pos.x;
    if(!this.wait){
    if (!this.dying){
        if(!this.onLadder){
            if(!this.jumping){
                if(!this.falling){
                    this.processDirection();
                    if((this.js.fire)&&!this.gameFlags.gotHammer){
                        this.processStartJump();
                    }else{
                        if(this.newDirection!=0){
							this.processWalk();
                        }else{
							_WALKING[this.gameData.player]=false;
						   if(!_WALKING[0]&&!_WALKING[1])
                           	this.gameData.soundTrack.push({command:"STOP",music:"walking"});
                           this.setCostume();
                           if(this.justLanded){
                              this.justLanded = false;
							  this.gameFlags.justLanded = false;
                           }else{
                               if(!this.gameFlags.gotHammer)
                                   this.processClimbDirection();
                               }
                           }
                        }
                }else{
                    this.processFalling();
                }
            }else{ 
                	this.processJump();
            }
        }else{
            this.processClimb();
        }
    }else{
        this.jumping = false;
        this.justLanded = false;
		this.gameFlags.justLanded = false;
        this.onLadder = false;
        this.falling =false;
		this.gameFlags.playerLosesLife = true;
        this.animationLosesLife();
    }
    if (this.gameData.levelType== 4){
        if (this.pos.y>-150){
            if(  (this.xCache+52+this.direction*2)*(this.pos.x+52+this.direction*2) <=0 ){                 
           	    this.gameFlags.checkRivet = true; 
			}
			if(  (this.xCache-52+this.direction*2)*(this.pos.x-52+this.direction*2) <=0 ){                 
           	    this.gameFlags.checkRivet = true;    
			}
		}
    }
    }
};
    
mario.prototype.processConv = function(){
	if(this.pos.y==-4){
		this.change("pos", new Vector(this.gameData.conveyorDirection[0],0));
		if(Math.abs(this.pos.x>104))
		   this.change("pos",new Vector(-1*this.gameData.conveyorDirection[0],0));
	}else{
		if(this.pos.y==-44){
			if(this.pos.x<-10){
				if(this.pos.x<104)
					this.change("pos",new Vector(1,0));
			}else{
				if(this.pos.x>10){
					if(this.pos.x>-104)
						this.change("pos", new Vector(-1,0));
				}
			}
		}else{
			if(this.pos.y==-124){
				this.change("pos", new Vector(this.gameData.conveyorDirection[1],0));
				if(Math.abs(this.pos.x>=104))
					this.change("pos", new Vector(-1*this.gameData.conveyorDirection[1],0));
			}
		}
	}
	
};

mario.prototype.act = function(data,flags){
    this.gameData = data;
    this.gameFlags = flags;
    if(!this.gameFlags.hammerStrike&&!this.gameFlags.reachedPrincess&&!this.gameFlags.rescuedPrincess&&!this.gameFlags.playerLosesLife&&!this.gameFlags.fallingSequence){
        this.processControls();
		if(this.gameData.levelType==2&&this.gameFlags.processConveyor){
			this.processConv();
		}
		if(Math.abs(this.pos.x-this.gameData.kongPos.x)<24 && Math.abs(this.pos.y-this.gameData.kongPos.y)<10){
        	this.initialTime = this.gameData.step[0];
        	this.gameFlags.playerLosesLife = true;
	 	}
	}else{
    if(this.gameFlags.reachedPrincess||this.gameFlags.fallingSequence||this.gameFlags.rescuedPrincess){
        if(!this.onceReachedPrincess){
			this.reachedPrincess();
			this.gameData.score = this.gameData.score + this.gameData.bonus;
            this.onceReachedPrincess=true;
        }
		if(this.gameFlags.rescuedPrincess){
			if(!this.once){
            	this.once=true;
			  	this.princessRescued();
        	}	
		}  
    }else if (this.gameFlags.playerLosesLife){
        if(!this.once){
            this.once=true;
            this.initialTime = this.gameData.step[0];
        }
        this.animationLosesLife();
    }
    }
	if(!this.gameFlags.playerLosesLife)
		this.deathOnce=false;
	
    this.gameData.marioPos = this.pos;
    this.gameData.marioDirection = this.direction;
    return ([this.gameData,this.gameFlags]);
};

