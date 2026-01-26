// JavaScript Document
function alien(sprite,costume,x,y,vx,vy,rotation,flip,show,isClone,cloneId){
	actor.call(this,sprite,costume,x,y,vx,vy,rotation,flip,show);  
	this.isClone=isClone;
	this.cloneId=cloneId;
	this.costumeOffset=0;
	this.exploding=false;
	this.explodingCount=4;
	this.active=true;
	this.sound=1;
	this.turn=false;
	this.auxCostume=this.costume;
}

alien.prototype = Object.create(actor.prototype);

alien.prototype.act=function(clock,gameFlags,gameData){
	this.gameFlags=gameFlags;
	this.gameData=gameData;
	if(!this.isClone&&this.gameFlags.initializeWave){
		this.gameFlags.initializeWave=false;
		this.gameFlags.initialized=false;
		this.initializeWave();
	}
	if(!this.isClone&&this.gameFlags.initialized){
		if(!this.gameData.landed){
			if(!this.gameFlags.pausedForPlayerExplosion&&!this.gameFlags.updateEveryAlien){
				if(clock>this.gameData.nextMoveTime){
					this.gameData.soundStack.push({command:"PLAYTOEND",music:"fastinvader"+this.sound,volume:1.0});
					this.sound=(mod(this.sound,4)+1);
					let aux=this.gameData.invaderCount-1-this.gameData.level*2;
					if(aux<=10)
						aux=Math.min(this.gameData.invaderCount-1,10);
					this.gameData.nextMoveTime=clock+Math.ceil(aux*0.016*1000/_TICK);
					this.gameData.newTurn=false;
					this.gameFlags.updateEveryAlien=true;
				}
			}
		}else{
			this.gameFlags.destroybase=true;
			this.gameFlags.pausedForPlayerExplosion=true;
		}
	}
	if(this.cloneId==1){
		this.gameData.alienSplatX=[];
		this.gameData.alienSplatY=[];
	}
	if(this.gameFlags.updateEveryAlien&&this.gameFlags.initialized&&!this.gameFlags.pausedforplayerexplosion){
		this.updateEveryAlien(clock);
	}

	this.checkCollisions();
//	if(!this.isClone&&this.gameFlags.destroybase){
//		this.gameFlags.pausedforplayerexplosion=true;
//	}
	if(!this.gameFlags.pausedforplayerexplosion)
		this.render();
	return[this.gameFlags,this.gameData];
}

alien.prototype.finishNotAClone=function(){
	this.gameData.turn=this.gameData.newTurn;
	if(this.gameData.turn){
		this.gameData.direction=-1*this.gameData.direction;
	}
}

alien.prototype.updateEveryAlien=function(clock){
	if(this.isClone){
		if(!this.exploding&&this.active){
			this.costumeOffset=1-this.costumeOffset;
			if(this.gameData.turn){
				this.y-=12;
			}else{
				this.x+=this.gameData.direction;
				if(Math.abs(this.x)>180){
					this.gameData.newTurn=true;
				}
			}
			if(Math.floor(Math.random()*80)==1){
				this.gameFlags.newbomb=true;
				this.gameData.newBombX.push(this.x);
				this.gameData.newBombY.push(this.y);
			}
		}
		if(this.cloneId==55){
			this.gameFlags.updateEveryAlien=false;
			
			this.finishNotAClone();
		}
	}
}

alien.prototype.initializeWave=function(){
	if(!this.isClone){
		this.sound=1;
		this.turn=false;
		this.pausedForPlayerExplosion=false;
		this.gameData.landed=false;
		this.gameData.dropsToLand--;
		if(this.gameData.completewave==1){
			if(this.gameData.dropsToLand<5){
				this.gameData.dropsToLand=10;
				this.gameData.completewave++;
			}
		}else{
			if(this.gameData.completewave==2){
				if(this.gameData.dropsToLand<4){
					this.dropsToLand=10;
					this.gameData.completewave++;
				}else{
					if(this.gameData.dropsToLand<3){
						this.gameData.dropsToLand=10;
						this.gameData.completewave++;
					}
				}
			}
		}
		if(this.gameData.dropsToLand<3)
			this.gameData.dropsToLand=10;
		this.gameFlags.initialized=true;
	}
}

alien.prototype.checkCollisions=function(){
	if(this.isClone&&this.active){
		if(!this.exploding){
			if(checkCollision(this.x,this.y,this.gameData.bulletX,this.gameData.bulletY,12)){
				this.gameData.score+=Math.floor((76-this.cloneId)/22)*10;
				this.gameData.invaderCount--;
				this.exploding=true;
				this.gameData.soundStack.push({command:"PLAY",music:"invaderkilled"});
				this.gameFlags.removebullet=true;
			}
		}
	}
}

alien.prototype.render=function(){
	if(this.isClone&&this.active){
		if(!this.exploding){
			this.costume=this.auxCostume+this.costumeOffset;
			if(this.y<=(this.gameData.bY+8)){
				this.gameFlags.landed=true;
			}
			if(this.y<=-131){
				this.gameFlags.alienSplat=true;
				this.gameData.alienSplatX.push(this.x);
				this.gameData.alienSplatY.push(this.y);
			}
		}else{
			this.costume=6;
			this.explodingCount--;
			if(this.explodingCount==0){
				this.show=false;
				this.active=false;
			}
		}
	}
}