// JavaScript Document
function ship(sprite,costume,x,y,vx,vy,rotation,flip,show,isClone){
	actor.call(this,sprite,costume,x,y,vx,vy,rotation,flip,show);  
	this.doublingUp = false;
	this.canFire = false;
	this.spacePressed = false;
	this.playerSpawning=false;
	this.isClone = isClone;
	this.cloneId = 0;
	this.clockZero=0;
	this.alreadySet=false;
	this.once=[false,false,false,false];
	if(!this.isCLone)
	   this.wait1 = new wait();
};

ship.prototype = Object.create(actor.prototype);

ship.prototype.act = function(clock,gameFlags,gameData){
	this.gameFlags = gameFlags;
	this.gameData = gameData;
	
	if(this.isClone&&this.gameFlags.createCloneShip&&!this.alreadySet){
		this.setClone();
		this.gameFlags.createCloneShip=false;
	}
	
	if(this.gameFlags.shipDoubleUp)
		this.doubleUp();	
	
	if(this.gameFlags.shipDoubledUp)
		this.doubledUp();
	
	if(!this.gameFlags.shipDies&&!this.isClone){
		
		
		if (this.gameData.shipActive[0]||this.gameData.shipActive[1]){
			if(this.doublingUp){
				if(this.x<0){
					this.x+=2;
					if(this.x>0)
						this.x=0;		
				}else if(this.x>0){
					this.x-=2;
						if(this.x<0)
							this.x=0;
				}	
			}else{
				this.js.readJoystick(this.gameData.jUsed);
				if(this.js.left&&(this.x>(-95-16*(this.gameData.shipActive[0]?0:1)))){
					this.change("pos",-3);
				}
				if(this.js.right&&(this.x<(95+16*(this.gameData.shipActive[1]?0:1))))
					this.change("pos",3);
				if(this.canFire){
					if(this.js.fire){
						if(!this.spacePressed){
							this.spacePressed = true;
							this.gameFlags["fireBullet"]=true;
						}
					}else
						this.spacePressed=false;
				}
			}	
		}
		this.checkEnableFiring();
		this.checkPlayerNewLife();
		this.gameData.mainShipX=this.x;
		this.gameData.mainShipY=this.y;

	}
	if(this.isClone)
		this.processClone();
	if(this.gameFlags.endGame&&this.isClone)
		this.deleteThisActor=true;
	if(this.gameData.shipHit[this.cloneId]){
		this.dieSequence(clock);
	}
	if(this.doublingUp)
		this.doubleUp();
	
	return([this.gameFlags,this.gameData]);
}

ship.prototype.checkEnableFiring=function(){
	if(this.gameFlags.enableFiring&&!this.isClone)
			this.canFire=true;
}

ship.prototype.checkPlayerNewLife=function(){
	if(this.gameFlags.playerNewLife){
		if(!this.isClone){
			if(!this.gameData.waitingToDouble){ 
				if(this.gameData.lives>0){
					this.canFire=false;
					this.gameData.alliensCanAttack=false;
					if(this.gameData.alliensInFormation&&this.gameData.bombCount==0){
						this.gameData.alliensAttackingPauseCounter=60;
						this.gameData.alliensCanAttack=true;
						this.set("pos",9);
						this.gameFlags.createCloneShip=true;
						this.gameFlags.playerNewLife=false;
						this.gameData.lives--;
						this.gameFlags.lives="process";
					}
				}
			}
		}
	}
}

ship.prototype.setClone=function(){
	this.cloneId = (this.gameData.shipActive[0])?1:0;
	this.gameData.shipActive[this.cloneId]=true;
	this.gameData.shipHit[this.cloneId]=false;
	this.show=true;
	this.alreadySet=true;
	this.gameFlags.showReady=false;
}

ship.prototype.processClone=function(){
	this.x = this.gameData.mainShipX-24+16*(this.cloneId+1);
	if(this.gameData.capturing){
		this.gameData.shipActive[this.cloneId]=false;
		this.deleteThisActor=true;
	}
	if(this.gameData.shipHit[this.cloneId]){
		this.gameData.soundStack.push({commad:"PLAY",music:"die"});
		this.gameData.shipActive[this.cloneId]=false;
		if(!((((this.gameData.shipActive[0])||this.gameData.shipActive[1]))&&this.gameData.waitingToDouble))
			if(!this.gameFlags.endGame)
				this.gameData.AlliensCanAttack=true;
		this.gameFlags.shipDies = true;
	}
}
	
ship.prototype.dieSequence=function(clock){
	
	if(!this.once[0]){
		this.once[0]=true;
		this.clockZero=clock;
		this.gameData.soundStack.push({command:"PLAY",music:"die"});
	}
	this.costume=Math.floor((clock-this.clockZero)/8);
	if((clock-this.clockZero)==32){
		if(this.gameData.lives==0&&!this.gameData.doubleShip){
			this.gameFlags.endGame=true;
			this.gameData.alliensCanAttack=false;
		}	
		if((!(this.gameData.shipActive[0]||this.gameData.shipActive[1]))&&!this.gameData.waitingToDouble){
				this.gameFlags.playerNewLife=true;
			}
			//if(!this.gameFlags.endGame&&!this.gameFlags.challengingStage)
				//this.gameFlags.showReady=true;
		this.gameData.doubleShip=false;
		if(this.isClone)
			if(this.gameData.shipHit[this.cloneId]){
				this.gameData.shipHit[this.cloneId]=false;
				this.deleteThisActor=true;
			}
		this.gameFlags.doubleUp=false;
		this.gameFlags.doubledUp=false;
		this.doublingUp=false;
		this.gameFlags.shipDies=false;
		this.once[0]=false;
	}
}

ship.prototype.doubleUp=function(){
	if(!this.isClone){
		this.canFire=false;
		this.doublingUp=true;
		this.gameFlags.shipDoubleUp=false;
	}
}

ship.prototype.doubledUp = function(){
	if(!this.isClone){
		this.gameData.doubleShip=((this.gameData.shipActive[0]||this.gameData.shipActive[1]));
		this.doublingUp=false;
		this.gameData.waitingToDouble=false;
		this.canFire=true;
		if(!this.gameData.doubleShip)
			this.x=16;
		this.gameData.soundStack.push({command:"STOP",music:"fighter rescued"});
		this.gameData.lives++;
		this.gameFlags.shipDoubledUp=false;
		this.gameFlags.playerNewLife=true;
	}
}

