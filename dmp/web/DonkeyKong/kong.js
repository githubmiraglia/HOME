// JavaScript Document
function kong(sprite,costume,pos,vel,rotate,flip){
	actor.call(this,sprite,costume,pos,vel,rotate,flip);
    this.initialTimeset = false;
    this.initialTime=0;
    this.deltaTime=0;
    this.clock1 = new clockCycle();
    this.clock2 = new clockCycle();
    this.clock3 = new clockCycle();
    this.clock4 = new clockCycle();
    this.clock5 = new clockCycle();
	this.clock6 = new clockCycle();
	this.clock7 = new clockCycle();
    this.climbCount = 0;
    this.climbPrincess = false;
    this.fallSequence = false;
	this.finishedFallingSequence = false;
	this.barrelsUntilNextOil = 0;
    this.i = 0;
    this.once = false;
    this.once3 = false;
	this.once2 =false;  
    this.rep = [0,0,0,0];
};

kong.prototype = Object.create(actor.prototype);

kong.prototype.reachPrincess = function(){
    if(this.gameData.levelType != 4){
        this.change("costume",3);
        if(this.gameData.step[0]>1){
        this.clock1.setClockOnce(this.gameData.step[0],13);
        if(this.clock1.checkClock(this.gameData.step[0])){
            this.change("costume",2);
            this.clock2.setClockOnce(this.gameData.step[0],13);
            if(this.clock2.checkClock(this.gameData.step[0])){
                this.climbCount = 2;
                this.clock1.resetClock();
                this.clock2.resetClock();
                this.climbPrincess = true;
            }
        }
        } 
    }else if(this.gameData.levelType == 4){
			this.gameFlags.reachedPrincess = false;
            this.gameFlags.fallingSequence = true;
            this.fallSequence = true;
    }
};


kong.prototype.climbWithPrincess=function(){
    if(this.i<this.climbCount){
        this.clock1.setClockOnce(this.gameData.step[0],0)
        if(this.clock1.checkClock(this.gameData.step[0])){
            if(!this.clock1.once){
                this.change("pos",new Vector(5,4));
                this.change("costume",6);
            }
            this.clock2.setClockOnce(this.gameData.step[0],5);
            if(this.clock2.checkClock(this.gameData.step[0])){
                if(!this.clock2.once){
                    this.change("pos",new Vector(-5,4));
                    this.change("costume",7);
                }
                this.clock3.setClockOnce(this.gameData.step[0],4);
                if(this.clock3.checkClock(this.gameData.step[0])){
                    this.clock1.resetClock();
                    this.clock2.resetClock();
                    this.clock3.resetClock()
                    this.i++;
                }
            }      
        }
     }else if(this.i<this.climbCount+2){
            this.clock1.setClockOnce(this.gameData.step[0],0);
            if(this.clock1.checkClock(this.gameData.step[0])){
                if(!this.clock1.once){
                    this.change("pos", new Vector(5,4));
                    this.change("costume",6); 
                }
                this.clock2.setClockOnce(this.gameData.step[0],5);
                if(this.clock2.checkClock(this.gameData.step[0])){
                    if(!this.clock2.once){
                        this.change("pos",new Vector(3,0));
						this.gameFlags.princessCarried=true;
						this.gameFlags.princessKidnapped = true;
                    }
                    this.clock3.setClockOnce(this.gameData.step[0],4);
                    if(this.clock3.checkClock(this.gameData.step[0])){
                        if(!this.clock3.once){
                            this.change("pos", new Vector(-3,4));
                            this.change("costume",9);                
                        }
                        this.clock4.setClockOnce(this.gameData.step[0],5);
                        if(this.clock4.checkClock(this.gameData.step[0])){
                            if(!this.clock4.once){
                                this.change("pos",new Vector(3,4));
                                this.change("costume",8);
                                this.clock3.resetClock();
                                this.clock4.resetClock();
                                this.i++;
                            }
                        }
                    }
                }
            }
        
     }else{
      //  this.gameFlags.princessCarried = false;
//        this.gameFlags.princessKidnapped =false;
		this.clock3.setClockOnce(this.gameData.step[0],20);
            if(this.clock3.checkClock(this.gameData.step[0])){
				this.gameFlags.levelComplete =true; 
				this.clock3.resetClock();
     		}
	 }
};

kong.prototype.fallingSequence=function(){
	this.clock4.setClockOnce(this.gameData.step[0],0);
	if(this.clock4.checkClock(this.gameData.step[0])){
		if(!this.clock4.once){
			this.change("costume",3);
            this.rep[0]=0;
            this.gameFlags.kongDeathHideSprites=true
			this.gameData.bgCostume = 11;
        }
		this.clock1.setClockOnce(this.gameData.step[0],24)
		if(this.clock1.checkClock(this.gameData.step[0])){
			if(this.rep[0]<8){
				this.change("costume",5);
				this.clock2.setClockOnce(this.gameData.step[0],4);
				if(this.clock2.checkClock(this.gameData.step[0])){
					this.change("costume",4);
					this.clock3.setClockOnce(this.gameData.step[0],3);
					if(this.clock3.checkClock(this.gameData.step[0])){
						this.rep[0]++;
						this.clock2.resetClock();
						this.clock3.resetClock();
					}
				}
			}else{ 
            //this.change("costume",5);
			this.clock2.setClockOnce(this.gameData.step[0],4);
			if(this.clock2.checkClock(this.gameData.step[0])){
                if(!this.clock2.once){
				    this.change("costume",3);
                }
				this.clock3.setClockOnce(this.gameData.step[0],4);
					if(this.clock3.checkClock(this.gameData.step[0])){
						if(!this.clock3.once){
							this.change("pos", new Vector(this.pos.x,-28));
							this.change("costume",10);
							this.rep[1]=0;
						}
						if(this.rep[1]<35){
							this.change("pos", new Vector(this.pos.x,-3));
                            this.rep[1]++
                        }else{
							this.gameData.bgCostume = 12;
							this.gameFlags.princessRescued = true;
                            this.gameFlags.rescuedPrincess=true;
							this.clock5.setClockOnce(this.gameData.step[0],0);
							if(this.clock5.checkClock(this.gameData.step[0])){
								if(!this.clock5.once){
									this.change("costume",16);
                                }
								this.clock6.setClockOnce(this.gameData.step[0],4);
								if(this.clock6.checkClock(this.gameData.step[0])){
								    if(!this.clock6.once)
								        this.rep[2]=0;
								    if(this.rep[2]<31){
                                        this.clock7.setClockOnce(this.gameData.step[0],3);
								        if(this.clock7.checkClock(this.gameData.step[0])){
                                            var newCostume = this.costume-1+5*((this.costume==11)?1:0);
								            this.change("costume",newCostume);
				                            this.clock7.resetClock();
                                            this.rep[2]++;
								        }
								    }else{
										this.clock7.setClockOnce(this.gameData.step[0],125);
										if(this.clock7.checkClock(this.gameData.step[0])){
											this.finishedFallingSequence = true;
                                            this.gameFlags.levelComplete=true;
										}
                                    }
										
								 }
								}
							}
                        }
			
					}
			}
        }
	}
};


kong.prototype.act = function(data,flags){

	if(data.levelType==0){
		if(data.step[0]<32){
			this.change("costume",8+data.step[0]%2);
			if(data.step[0]%2==1)
				this.change("pos",new Vector(1,8))
			else
				this.change("pos",new Vector(-1,0));
		} else if (data.step[0]<34){
				this.set("vel",new Vector(0,14));
		//}else if(this.pos.y!=8 || this.vel.y>0){
		} else if(data.step[0]<42) {
				this.change("pos",this.vel);
				this.change("vel", new Vector(0,-3));
				if(this.pos.y<10 && this.vel.y<0){
					this.set("pos",new Vector(this.pos.x,8));
					this.change("costume",1);
					this.set("vel",new Vector(-3.4,5));
				}
		}else if(data.step[0]>44 && data.step[0]<70) {
			this.change("pos",this.vel);
			this.change("vel",new Vector(0,-2.7));
			if(this.pos.y<10 && this.vel.y<0){
				this.set("pos", new Vector(this.pos.x,8));
				this.set("vel",new Vector(-3.4,5));
				//console.log(this.pos.x);
			//	console.log(step[0]);
		}else if(data.step[0]>69){
			this.set("pos",new Vector(-69,8));
		}
		}
	}else{
          this.gameData = data;
          this.gameFlags = flags;
          if (!this.gameFlags.reachedPrincess&&!this.gameFlags.princessRescued&&!this.gameFlags.playerLosesLife&&!this.gameFlags.hammerStrike&&!this.gameFlags.fallingSequence){
          if(data.levelType==1){
            if(!this.initialTimeset){
                this.initialTime = this.gameData.step[0];
                this.change("costume",3);
                this.initialTimeset = true;
            }
            this.deltaTime = this.gameData.step[0] - this.initialTime;
            //this.set("pos", new Vector(-68,8));
            if(this.deltaTime>=10&&this.deltaTime<20)
                this.change("costume",0);
            else if (this.deltaTime<=30&&this.deltaTime<40){
                if(this.deltaTime==30){
                    this.change("costume",  1);
                    this.gameData.BarrelActionType = "DROP";
                    this.gameData.BarrelType = 1;
                    this.barrelsUntilNextOil = 7 + Math.floor(Math.random()*7);
                    this.gameFlags.newBarrel = true;
                }
            }else if(this.deltaTime>=40){
                this.change("costume",3);
                this.waitTime = 2.6+2-this.gameData.difficultyLevel-(this.gameData.level-1)*0.4;
                this.waitTime = Math.random()*(this.waitTime + 0.2) + 0.2;
                this.clock1.setClockOnce(this.gameData.step[0],Math.floor(this.waitTime/(40/1000)));
                if(this.clock1.checkClock(this.gameData.step[0])){
                    if(!this.gameFlags.hammerStrike){
                        this.change("costume",0);
                        this.clock2.setClockOnce(this.gameData.step[0],10);
                        if(this.clock2.checkClock(this.gameData.step[0])){
                            if(!this.gameFlags.hammerStrike){
                            this.change("costume",1);
                            if(!this.clock2.once){
                                this.barrelsUntilNextOil--;
                                if(this.barrelsUntilNextOil==0){
                                    this.gameData.BarrelType=((this.gameData.FireCount<5)?1:0);
                                    this.barrelsUntilNextOil = 7 + Math.floor(Math.random()*7);
                                }else
                                    this.gameData.BarrelType=0;
                                var randomMax = 3+16*(this.gameData.BarrelType==0?1:0)
                                if (Math.floor(Math.random()*randomMax)+1 == 1){
                                    this.gameData.BarrelActionType="DROP";
                                    //this.gameData.BarrelType = 1;
                                }else{
                                    this.gameData.BarrelActionType="ROLL";
                                    //this.gameData.BarrelType = 0;
                                }
                                this.gameFlags.newBarrel = true;
                                }
                                this.clock3.setClockOnce(this.gameData.step[0],10);
                                if(this.clock3.checkClock(this.gameData.step[0])){
                                    if(!this.gameFlags.hammerStrike){
                                        if(this.gameData.BarrelActionType=="ROLL")
                                            this.change("costume",2);
                                            this.clock4.setClockOnce(this.gameData.step[0],10);
                                            if(this.clock4.checkClock(this.gameData.step[0])){
                                                if(!this.gameFlags.hammerStrike){
                                                    this.clock1.resetClock();
                                                    this.clock2.resetClock();
                                                    this.clock3.resetClock();
                                                    this.clock4.resetClock();
                                                }
                                            }
                                    }
                                }

                                
                            }
                            
                        }
                    }
                        
                }
            
            }
           // }
          }else if(this.gameData.levelType==2||this.gameData.levelType==4){
              if(this.gameFlags.processConveyor){
				  this.processConv();
			  }
              this.change("costume",3);
          }else if(this.gameData.levelType==4){ 
            //  this.se`t("pos", new Vector(-68,4));
              this.change("costume",3);
          }
        
    }else{
        if(this.gameFlags.reachedPrincess&&!this.climbPrincess){
			if(!this.once2){
				this.clock1.resetClock();
				this.clock2.resetClock();
				this.clock3.resetClock();
            	this.clock4.resetClock();
				this.clock5.resetClock();
				this.clock6.resetClock();
				this.clock7.resetClock();
				this.once2 = true;
			}
			this.reachPrincess();
		}
        else if(this.climbPrincess){
            if(!this.once){
                this.set("pos",new Vector(-39,this.pos.y))
                this.once = true;
            }
            this.climbWithPrincess();
        }   
        else if(this.fallSequence&&!this.finishedFallingSequence){
            this.fallingSequence();
        }
    }
}
this.gameData.kongPos = this.pos;
return ([this.gameData,this.gameFlags]);
};

kong.prototype.processConv = function(){
	this.change("pos",new Vector(this.gameData.conveyorDirection[0],0));
	if(this.pos.x<=-68)
		this.set("pos",new Vector(-68,this.pos.y));
	if(this.pos.x<=-68||this.pos.x>68){
		this.gameData.conveyorDirection[0]=-1*this.gameData.conveyorDirection[0];
		if(this.pos.x<=-68)
			this.gameData.conveyorDirection[1]=-1*this.gameData.conveyorDirection[1];
	}
};
