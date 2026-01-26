// JavaScript Document
function allien(sprite,costume,x,y,vx,vy,rotation,flip,js,show,isClone,cloneId){
	actor.call(this,sprite,costume,x,y,vx,vy,rotation,flip,js,show); 
	this.isAllien=true;
	this.cloneId=cloneId;
	this.isClone=isClone;
	this.currentAction="";
	this.allienType=0;
	this.explosion=false;
	this.explosionCount=2;
	this.removed=false;
	this.scoreCostume=-1;
	this.targetX=0;
	this.targetY=0;
	this.deltaX=0;
	this.deltaY=0;
	this.direction=0;
	this.doubleUpCounter=0;
	this.fetchNewAction=false;
	this.pauseCounter=0;
	this.deltaTurn=0;
	this.deltaMove=0;
	this.emptyAttackFormationIndex=0;
	this.simultaneousAttackCount=0;
	this.continuousDiverCount=0;
	this.hitCount=0;
	this.once=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
	this.once1=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
	var i1=0, i2=0, i3=0, i4=0, i5=0;
	this.wait1=new wait(), this.wait2=new wait(), this.wait3=new wait();
	this.wait4=new wait(), this.wait5=new wait(); this.wait6=new wait();
	this.wait7=new wait(), this.wait8=new wait(); this.wait9=new wait();
	this.wait10=new wait(), this.wait11=new wait(); this.wait12=new wait();
	this.posArrivalPause=0;
	//this.stageClear=false;
	this.targetHeight=0;
	this.formationXOffset=0;
	this.formationYOffset=0;
	this.delay=0;
	this.bombcount=0;
	this.pathIndex=0;
	this.bossIndex=0;
	this.batch=0;
	this.steps=0;
	this.hitBoss=false;
	this.hitMainShip=false;
	this.extrasFromAbove=0;
	this.extrasFromSide=0;
	this.inTopScore=false;
	
}


allien.prototype = Object.create(actor.prototype);

allien.prototype.act = function(clock,gameFlags,gameData){
	this.gameFlags = gameFlags;
	this.gameData = gameData;
	
	if(this.explosion)
		this.explosionFunc(clock);
	 else{
		 if(this.gameFlags.allienActivateClones&&this.isClone&&this.gameData.allienControlPath[this.cloneId]!="INACTIVE"){
			this.activateClones(clock);
		 }
		
	if(!this.isClone){
		if(!this.once1[0]){
			this.show=false;
			this.once1[0]=true;
			this.resetData();
		}
		
		if(this.gameFlags.createWavePrepare){
			this.createWavePrepare();
			this.gameFlags.createWavePrepare=false;
		}
		
		this.runMain1(clock);
		
		if(this.gameFlags.wave=="createWaveType1"){
			this.createWaveType1(this.waveSection);
			this.waveSection++;
			this.gameFlags.wave="";
		}
		if(this.gameFlags.wave=="createWaveType2"){
			this.createWaveType2(this.waveSection);
			this.waveSection++;
			this.gameFlags.wave="";
		}
		if(this.gameFlags.wave=="createWaveType3"){
			this.createWaveType3(this.waveSection);
			this.waveSection++;
			this.gameFlags.wave="";
		}
		if(this.gameFlags.wave=="createWaveChallenge1"){
			this.createWaveChallenge1(this.waveSection);
			this.waveSection++;
			this.gameFlags.wave="";
		}
		if(this.gameFlags.wave=="createWaveChallenge2"){
			this.createWaveChallenge2(this.waveSection);
			this.waveSection++;
			this.gameFlags.wave="";
		}
		if(this.gameFlags.wave=="createWaveChallenge3"){
			this.createWaveChallenge3(this.waveSection);
			this.waveSection++;
			this.gameFlags.wave="";
		}
		if(this.gameFlags.wave=="createWaveChallenge4"){
			this.createWaveChallenge4(this.waveSection);
			this.waveSection++;
			this.gameFlags.wave="";
		}
		if(this.gameFlags.wave=="createWaveChallenge5"){this.gameFlags.wave="";}
		if(this.gameFlags.wave=="createWaveChallenge6"){this.gameFlags.wave="";}
		if(this.gameFlags.wave=="createWaveChallenge7"){this.gameFlags.wave="";}
		if(this.gameFlags.wave=="createWaveChallenge8"){this.gameFlags.wave="";}
	 }
	 }
	if(this.rotation==0)
		this.rotation=0.01;
	return([this.gameFlags,this.gameData]);
}

allien.prototype.activateClones=function(clock){
	if((this.isClone)&&!this.gameData.stopThisScript[this.cloneId]){
		if(this.gameData.allienControlPath[this.cloneId]!="WAITING"){
				this.updatePosition(clock);
				this.updatePosition(clock);
				if(this.isCurrentCloneVisible()){
					this.checkAgainstBullets(clock);
					this.checkAgainstCollisions(clock);
				}
				this.gameData.allienPositionX[this.cloneId]=this.x;
				this.gameData.allienPositionY[this.cloneId]=this.y;
				this.gameData.allienOrders[this.cloneId]=this.currentAction;
				this.gameData.allienType[this.cloneId]=this.allienType;
				if(this.currentAction=="REMOVE"&&!this.gameData.resetAlliens){
					this.show=false;
					if(this.cloneId>41){
					}else
						this.gameData.stopThisScript[this.cloneId]=true;		
				}
				if(!this.isCurrentCloneAlive()){
					if(this.allienType==5){
						this.currentAction="WAIT FOR CAPTURE";
						this.gameData.allienOrders[this.cloneId]=this.currentAction;
						this.setPathTypeFor(this.cloneId,"WAIT FOR CAPTURE",0,1);
						this.removeFromAttackingGroup(this.cloneId);
					}
					if(!this.once[13]){
					    this.once[13]=true;
						this.explosionCount=2;
						if(this.hitMainShip){
							this.hitMainShip=false;
							this.show=false;
						}else{	
							this.explosion=true;
						}
						if(this.cloneId>41){
							this.currentAction="REMOVE";
							this.gameData.allienOrders[this.cloneId]=this.currentAction;
						}else
							if(this.allienType!=5)
								this.gameData.stopThisScript[this.cloneId]=true;
					}
				}
		}
	}
}

allien.prototype.move=function(steps){
	this.x+=steps*Math.sin(Math.PI/180*this.rotation);
	this.y+=steps*Math.cos(Math.PI/180*this.rotation);
}

allien.prototype.explosionFunc=function(clock){
	this.rotation=0;
	if(this.explosionCount<12)
		this.costume=15+Math.floor(this.explosionCount/2)
	if(this.scoreCostume>-1){
			if(this.explosionCount>=12&&this.explosionCount<22)
				this.costume=21+this.scoreCostume;
	}
	if((this.scoreCostume==-1&&this.explosionCount>11)||(this.explosionCount>21)){
			this.show=false;
			this.explosion=false;
			this.explosionCount=1;
			this.scoreCostume=-1;
	}
	this.explosionCount++;	
}

allien.prototype.checkAgainstBullets=function(clock){
	for(var i=0;i<this.gameData.bulletActive.length;i++){
		if(this.gameData.bulletActive[i]){
			if(this.canShootCurrentClone()){
				if(Math.abs(this.x-this.gameData.bulletX[i])<7&&Math.abs(this.y-this.gameData.bulletY[i])<10){
					this.gameData.bulletActive[i]=false;
					this.gameData.bulletToRemove[i]=true;
					if(i<2)
						this.gameData.bulletToRemove[i+2]=true;
					else
						this.gameData.bulletToRemove[i-2]=true;
					this.gameData.hitCount++;
					this.hitAllien(clock);
					break;
				}
			}
		}
	}
}

allien.prototype.doHoldFormation=function(clock){
	this.getFormationPosition();
	this.x=this.targetX;
	this.y=this.targetY;
	this.gameData.allienContinualPath[this.cloneId]="";
	this.setCostumeWithTime(clock); 
}

allien.prototype.doDoubleUpPlayer=function(){
	if(this.doubleUpCounter>0||!this.gameData.alliensInFormation||this.rotation<0||this.rotation>=18.1){
		this.rotation=(this.rotation+18)%360;
		if(this.rotation>180)
			this.rotation=180-this.rotation;
		if(this.doubleUpCounter>0){
			this.doubleUpCounter--;
		}
	}else{
		if(this.doubleUpCounter==0){
			this.doubleUpCounter--;
			this.gameFlags.shipDoubleUp=true;
		}
		if(this.rotation>=0&&this.rotation<18.1){
			this.rotation=0;
			if(this.x<8)
				this.x++;
			else if(this.x>8)
				this.x--;
			else if(this.y>-156)
				this.y--;
			else{
				this.gameData.hasCaptive=false;
				this.setPathTypeFor(this.cloneId,"WAIT FOR CAPTURE",0,0);
				this.gameFlags.shipDoubledUp=true;
				this.gameData.alliensCanAttack=true;
			}
		}else
			this.rotation+=18;
	}
}

allien.prototype.bossFormationSwoop=function(){
	this.bossIndex=-1;
	for(var i=0; i<this.gameData.maxAlliens; i++){
		if(this.gameData.allienType[i]==1||this.gameData.allienType[i]==2)
			if(this.gameData.allienOrders[i]=="HOLD FORMATION")
				if(this.bossIndex==-1||(Math.round(Math.random())==0))
				   this.bossIndex=i;
	}
	if(this.bossIndex>-1){
		var emptyAttackFormationIndex = this.getEmptyAttackFormationIndex();
		this.gameData.soundStack.push({command:"PLAY",music:"galagaattack"});
		this.setPathTypeFor(this.bossIndex,"UP AND DIVE WITH BOSS",0,(this.gameData.allienFormationX[this.bossIndex]>0)?1:-1);
		this.addToAttackingGroup(this.bossIndex,emptyAttackFormationIndex);
		if(this.gameData.hasCaptive&&this.gameData.captorId==this.bossIndex&&this.gameData.allienOrders[this.gameData.captiveId]=="HOLD FORMATION"){
			this.setPathTypeFor(this.gameData.captiveId,"UP AND DIVE WITH BOSS",0,(this.gameData.allienFormationX[this.bossIndex]>0)?1:-1);
			this.addToAttackingGroup(this.gameData.captiveId,emptyAttackFormationIndex);
		}
		var bossCompany=-1;
		var i=0;
		while(i<=this.gameData.allienType.length&&bossCompany==-1){
			if(this.gameData.allienType[i]==3)
				if(this.gameData.allienOrders[i]=="HOLD FORMATION")
					if(bossCompany==-1&&(this.gameData.allienFormationX[i]==this.gameData.allienFormationX[this.bossIndex])&&(this.gameData.allienFormationY[i]==(this.gameData.allienFormationY[this.bossIndex]+1)))
						bossCompany=i;
			i++;
		}
		if(bossCompany>-1){
			this.setPathTypeFor(bossCompany,"UP AND DIVE WITH BOSS",0,(this.gameData.allienFormationX[this.bossIndex]>0)?1:-1);
			this.addToAttackingGroup(bossCompany,emptyAttackFormationIndex);
			bossCompany=-1;
			for(var i=0; i<this.bossIndex; i++){
				if(this.gameData.allienType[i]==3)
					if(this.gameData.allienOrders[i]=="HOLD FORMATION")
						if((Math.abs(this.gameData.allienFormationX[i]-this.gameData.allienFormationX[this.bossIndex])==1)&&(this.gameData.allienFormationY[i]==(this.gameData.allienFormationY[this.bossIndex]+1))&&(bossCompany==-1||Math.round(Math.random())==0))
						   bossCompany=i;
			}
			if(bossCompany>-1){
				this.setPathTypeFor(bossCompany,"UP AND DIVE WITH BOSS",0,(this.gameData.allienFormationX[this.bossIndex]>0)?1:-1);
				this.addToAttackingGroup(bossCompany,emptyAttackFormationIndex);
			}
		}else{
			for(var i=0; i<this.bossIndex;i++){
				if(this.gameData.allienType[i]==3)
					if(this.gameData.allienOrders[i]=="HOLD FORMATION")
						if((Math.abs(this.gameData.allienFormationX[i]-this.gameData.allienFormationX[this.bossIndex])==1)&&(this.gameData.allienFormationY[i]==(this.gameData.allienFormationY[this.bossIndex]+1))){
							this.setPathTypeFor(i,"UP AND DIVE WITH BOSS",0,(this.gameData.allienFormationX[this.bossIndex]>0)?1:-1);
							this.addToAttackingGroup(i,emptyAttackFormationIndex);
						}
			}
		}
	}
}

allien.prototype.butterflyDiveOffScreen=function(){
	var maxX =-1
	var t=0;
	for(var i=0; i<this.gameData.maxAlliens;i++){
		if(this.gameData.allienType[i]==3)
			if(this.gameData.allienOrders[i]=="HOLD FORMATION")
				if(((Math.abs(this.gameData.allienFormationX[i])>=maxX)&&(maxX==-1||Math.round(Math.random())==0))){
					t=i; 
					maxX=Math.abs(this.gameData.allienFormationX[i]);
				}
	}
	if(maxX>-1){
		this.gameData.soundStack.push({command:"PLAY",music:"galagaattack"});
		this.setPathTypeFor(t,"BUTTERFLY PATH",0,(this.gameData.allienFormationX[t]>0)?1:-1);
		var emptyAttackFormationIndex = this.getEmptyAttackFormationIndex();
		this.addToAttackingGroup(t,emptyAttackFormationIndex);
		
	}
}

allien.prototype.isCloneAlive=function(id){
	return(!(this.gameData.allienOrders[id]=="DEAD"||this.gameData.allienControlPath[id]=="INACTIVE"));
}

allien.prototype.doMoveAboveFormation=function(){
	this.getFormationPosition();
	this.rotation=180;
	this.x=this.targetX;
	this.y=96;
	this.fetchNewAction=true;
}

allien.prototype.isCurrentCloneAlive=function(){
	return(!(this.currentAction=="DEAD"));
}

allien.prototype.doDiveToBeam=function(clock){
	if(this.y>=-70){
		this.move(2);
		this.setCostumeWithTime(clock); //check if clock needed
		//this.gameData.onePriorToBeamPosition=true;
	}else{
		this.gameData.beamActive=true;
		this.y=-70;
		this.pauseCounter=0;
		this.currentAction="FIRE BEAM";
		this.gameData.bossX=this.x;
		this.gameData.captorId=this.cloneId;
		this.rotation=180;
		this.setCostumeWithOffset(0);
		this.gameFlags.createCloneOfBeam=true;
	}
}

allien.prototype.canShootCurrentClone=function(){
	return(!(this.allienType==6||(this.captorId==this.cloneId&&this.gameData.hasCaptive&&this.gameData.beamActive)));
}

allien.prototype.isCloneVisible=function(id){
	return(!(this.gameData.allienOrders[id]=="WAIT FOR CAPTURE"||this.gameData.allienOrders[id]=="DEAD"||this.gameData.allienControlPath[id]=="INACTIVE"||this.gameData.allienControlPath[id]=="WAITING"||this.gameData.allienOrders[id]=="INACTIVE"||this.gameData.allienOrders[id]=="PLAYER IN STORAGE"||this.gameData.allienOrders[id]=="REMOVE"));
}

allien.prototype.hitAllien=function(clock){
	this.scoreCostume=-1;
if(!this.hitMainShip){
	if(this.allienType==1){
		this.gameData.soundStack.push({command:"PLAY",music:"bossgalagahit"});
		this.allienType=2;
		this.setCostumeWithOffset(Math.floor((clock%128)/64));
		this.hitBoss=true;
		this.gameData.hitCount--;
	}else if(this.allienType==2){
		this.gameData.soundStack.push({command:"PLAY",music:"bossgalagadefeat"});
		if(this.currentAction=="HOLD FORMATION"){}
		else{
			this.scoreCostume=0;
			if(this.gameData.allienAttackingGroup[this.cloneId]==-1){
				this.scoreCostume++;
			}else{
				for(var j=0; j<this.gameData.maxAlliens; j++)
					if(this.gameData.allienAttackingGroup[j]==this.gameData.allienAttackingGroup[this.cloneId]){
						this.scoreCostume++;
					}
			}
			this.modifyScore(this.gameData.bossScores[this.scoreCostume]);
		}
		if((this.gameData.hasCaptive&&this.gameData.captorId==this.cloneId)&&!(this.currentAction=="HOLD FORMATION"||this.gameData.allienControlPath[this.gameData.captiveId]=="WAITING")){
				this.gameData.waitingToDouble=true;
				this.setPathTypeFor(this.gameData.captiveId,"RESCUED PLAYER",0,0);
		}
		if(this.gameData.beamActive){//||this.gameData.onePriorToBeamPosition){ //&&this.gameData.captorId==this.gameData.cloneId){
			this.gameFlags.beamCollapse=true;
			//this.gameData.onePriorToBeamPosition=false;
		}
	}else if(this.allienType==3){
		this.gameData.soundStack.push({command:"PLAY",music:"galagadefeat2"});
		if(this.currentAction=="HOLD FORMATION")
			this.modifyScore(80);
		else
			this.modifyScore(160);
	}else if(this.allienType==4){
		this.gameData.soundStack.push({command:"PLAY",music:"galagadefeat1"});
		if(this.currentAction=="HOLD FORMATION")
			this.modifyScore(50);
		else
			this.modifyScore(100);
	}else if(this.allienType==5){
		this.gameData.soundStack.push({command:"PLAY",music:"captured fighter destroyed"});
		this.gameData.hasCaptive=false;
		this.modifyScore(1000);
	}else{
		this.gameData.soundStack.push({command:"PLAY",music:"galagadefeat2"});
		this.modifyScore(200);
	}
	if(this.gameData.challengingStage)
		this.checkForBatchOfEightHits();
	if(!this.hitBoss){
		this.currentAction="DEAD";
		this.once=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
		this.removeFromAttackingGroup(this.cloneId);
	}else{
		this.hitBoss=false;
	}
	//if(this.allienType!=1)
		//this.gameData.hitCount++;
}else{
	this.show=false;
	this.currentAction="DEAD";
	this.once=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
	this.hitBoss=false;
	this.removeFromAttackingGroup(this.cloneId);
}
	
}

allien.prototype.isStageClear=function(){
	for (var i=0; i<this.gameData.maxAlliens; i++){
		var temp=this.isCloneVisible(i)
		if(temp)
			return false;
	}
	return true;
}

allien.prototype.doContinueFlight=function(clock){
	this.dropBombs();
	this.move(this.deltaMove);
	this.rotation+=this.deltaTurn;
	this.setCostumeWithTime(clock);
	if(this.touchingEdge()||Math.abs(this.x)>116||this.y>108)
		this.fetchNewAction=true;
}

allien.prototype.beeLoopBackUpDive=function(){
	var maxX = -1;
	for(var i=0; i<this.gameData.maxAlliens; i++){
		if(this.gameData.allienType[i]==4){
			if(this.gameData.allienOrders[i]=="HOLD FORMATION")
				if((Math.abs(this.gameData.allienFormationX[i])>=maxX)&&(maxX==-1||Math.round(Math.random())==0)){
					var t=i;
					maxX=Math.abs(this.gameData.allienFormationX[i]);
				}
		}
	}
	if(maxX>-1){
		this.gameData.soundStack.push({command:"PLAY",music:"galagaattack"});
		this.setPathTypeFor(t,"BEE PATH",0,(this.gameData.allienFormationX[t]>0)?1:-1);
		this.emptyAttackFormationIndex = this.getEmptyAttackFormationIndex();
		this.addToAttackingGroup(t,this.emptyAttackFormationIndex);
	}
}

allien.prototype.doFireBeam=function(){
	if(!this.gameData.beamActive){
		if(this.gameData.capturing){
			if(this.pauseCounter==0){
				this.gameData.soundStack.push({command:"PLAY",music:"fighter captured"});
				this.gameFlags.showFighterCaptured=true;
				this.gameData.alliensCanAttack=false;
			}else if(this.pauseCounter==120){
				this.gameFlags.showFighterCaptured=false;
				this.setPathTypeFor(this.cloneId,"RETURN WITH CAPTURED",0,this.direction);
			}
			this.pauseCounter++;
		}else{
			this.rotation=180;
			this.fetchNewAction=true;
		}
	}
}

allien.prototype.resetData=function(){
	this.once=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
	for(var i=1;i<15;i++){
		this.once1[i]=false;
	}
	for(var i=0;i<this.gameData.maxAlliens;i++){
		this.gameData.stopThisScript[i]=false;
	}
	this.wait1.reset();
	this.wait2.reset();
	this.wait3.reset();
	this.wait4.reset();
	this.wait5.reset();
	this.wait6.reset();
	this.wait7.reset();
	this.wait8.reset();
	this.wait9.reset();
	this.wait10.reset();
	this.wait11.reset();
	this.wait12.reset();
	this.gameData.stageQuadrant=Math.floor(this.gameData.stage/4);
	this.simultaneousAttackCount=Math.floor(2+this.gameData.stageQuadrant/2);
	this.continuousDiverCount=Math.ceil(39-this.gameData.stageQuadrant/1);
	this.gameData.bombAvailability=Math.floor(2+this.gameData.stageQuadrant/2);
	if(this.simultaneousAttackCount>8)
		this.simultaneousAttackCount=8;
	if(this.continuousDiverCount<30)
		this.continuousDiverCount=30;
	if(this.gameData.bombAvailability>6)
		this.gameData.bombAvailability=6;
	this.gameData.continuousAttack=false;
	this.gameData.challengingStage=((this.gameData.stage-3)%4==0);
	this.gameData.alliensInFormation=true;
	this.gameData.hitCount=0;
	this.hitBoss=false;
	this.i3=0;
	this.gameData.stageClear=false;
	this.gameData.resetAlliens=true;
	this.gameData.beamActive=false;
	this.prepareClonesForNewWave();  
}

allien.prototype.runMain1=function(clock){
	if(this.once[3])
		this.runMain2(clock);
	else{
		this.wait1.waitUntil(this.gameData.alliensCanAttack,function(){
			if(!this.once[0]){	
				this.gameData.alliensAttackingPauseCounter--;
				if(this.gameData.alliensAttackingPauseCounter==0){
					this.once[0]=true;
					this.gameFlags.enableFiring=true;
					this.i1=0;
				}
			}else{
				if(!this.once1[1]){
					this.gameFlags.allienActivateClones=true;
					this.once1[1]=true;
				}
				if(this.i1<5){
					if(!this.once1[2]){
						this.i2=15;
						this.gameData.alliensArrived=false;
						this.gameData.alliensInFormation=true;
						this.once1[2]=true;
					}
					if(!this.once[1]){
						if(this.gameData.alliensCanAttack)
							this.once[1]=true;
						else
							this.moveFormation();
					}else{
						if(!this.once[2]){
							if(this.gameData.alliensAttackingPauseCounter!=0){
								this.moveFormation();
								this.gameData.alliensAttackingPauseCounter--;
								if(this.gameData.alliensAttackingPauseCounter==0)
									this.gameFlags.enableFiring=true;
							}else
								this.once[2]=true;
						}else{
							if(!this.once1[3]){
								this.setClonesForWaves();
								this.once1[3]=true;
							}
							if(this.i2>0){
								this.moveFormation();
								this.gameData.alliensInFormation=this.inFormation2();
								this.gameData.alliensArrived = this.allArrived();
								if(this.gameData.alliensArrived){
									this.i2--;	
								}
							
							}
						}
					}
					if(this.i2==0){
						this.once1[1]=false;
						this.once1[2]=false;
						this.once1[3]=false;
						this.i1++;
					}
				}else{
					this.once[3]=true;
					if(!this.gameData.challengingStage)
						this.gameData.soundStack.push({command:"PLAY LOOPING",music:"ambience"})	
				}
			}
		}.bind(this));
	}
}

allien.prototype.runMain2=function(clock){
	if(!this.once[4]){
		if(this.gameData.formationCentreX!=0){
			if(this.gameData.alliensAttackingPauseCounter>0){
				this.gameData.alliensAttackingPauseCounter--;
				if(this.gameData.alliensAttackingPauseCounter==0){
					this.gameFlags.enableFiring=true;
				}
			}
			this.moveFormation();
			this.gameData.alliensInFormation=this.inFormation2();
			this.gameData.alliensArrived = this.allArrived();
		}else
			this.once[4]=true;
	}else if(!this.gameData.challengingStage){
		if(!this.once1[4]){
			if(!this.gameFlags.endGame)
				this.gameData.alliensCanAttack=true;
			this.gameData.formationDirection=0.096;
			this.gameData.stageClear=false;
			this.once1[4]=true;
		}
		if(!this.once[5]){
			if(!this.gameData.stageClear){
				this.gameData.continuousAttack=((this.gameData.hitCount>=this.continuousDiverCount)&&(this.gameData.alliensCanAttack)&&(this.gameData.alliensAttackingPauseCounter==0));
				this.gameData.formationSpread+=this.gameData.formationDirection;
				if((this.gameData.formationSpread<=16)||(this.gameData.formationSpread>=22))
					this.gameData.formationDirection=-this.gameData.formationDirection;
				this.gameData.alliensInFormation=this.inFormation2();
				if(this.gameData.alliensCanAttack){
					if(this.gameData.alliensAttackingPauseCounter>0){
						this.gameData.alliensAttackingPauseCounter--;
						if(this.gameData.alliensAttackingPauseCounter==0)
							this.gameFlags.enableFiring=true;
					}else{
						if((this.countActiveFormations()<this.simultaneousAttackCount)){
							var t=Math.round(Math.random()*4)+1;
							if(t==1){
								this.bossFormationSwoop();
							}
							if(t==2)
								this.beeLoopBackUpDive();
							if(t==3)
								this.butterflyDiveOffScreen();
							if(t==4)
								this.captiveSwoop();
							if(t==5&&(!this.gameData.continuousAttack)&&(this.gameData.lives>0)){
								this.bossCaptureDive();
							}
						}					
					}
				}else{}
				this.gameData.stageClear = this.isStageClear();
			}else
				this.once[5]=true;
		}else{
			if(!this.once1[5]){
				//
				this.once1[5]=true;
			}
			this.wait2.set(clock,1);
			this.wait2.Wait(clock,function(){
				if(!this.once[6]){
					this.runMain4(clock);
				}
			}.bind(this));
		}
	}else{
		if(!this.once[7]){
			this.runMain3(clock);
		}
	}
}

allien.prototype.runMain3=function(clock){
	this.wait2.set(clock,1);
	this.wait2.Wait(clock,function(){
		this.gameData.resetAlliens=true; //hack so that lonely allien glitch does not appear
		if(!this.wait2.Once()){
			if(this.gameData.hitCount==40)
				this.gameData.soundStack.push({command:"PLAY",music:"challenging stage over"});
			else
				this.gameData.soundStack.push({command:"PLAY",music:"challenging stage perfect"});
		}
		this.wait3.set(clock,1);
		this.wait3.Wait(clock,function(){
			if(!this.wait3.Once()){
				this.gameFlags.showNumberOfHits=true;
			}
			this.wait4.set(clock,1);
			this.wait4.Wait(clock,function(){
				if(!this.wait4.Once()){
				   this.gameFlags.showHitCount=true;
				}
				this.wait5.set(clock,1);
				this.wait5.Wait(clock,function(){
					if(this.gameData.hitCount==40){
						if(this.i3<3){
							this.gameFlags.showPerfect=true;
							this.wait6.set(clock,0.2);
							this.wait6.Wait(clock,function(){
								this.gameFlags.showPerfect=false;
								this.wait7.set(clock,0.2);
								this.wait7.Wait(clock,function(){
									this.i3++;
									this.wait6.reset();
									this.wait7.reset();
								}.bind(this));
							}.bind(this));
						}else{
							if(!this.once[8]){
								this.gameFlags.showPerfect=true;
								this.gameFlags.showSpecialBonus=true;
								this.modifyScore(10000);
								this.once[8]=true;
							}
							this.wait10.set(clock,2);
							this.wait10.Wait(clock,function(){
								if(!this.wait10.Once()){
									this.gameData.stageClear=true;
									this.gameFlags.showNumberOfHits=false;
									this.gameFlags.showHitCount=false;
									this.gameFlags.showPerfect=false;
									this.gameFlags.showSpecialBonus=false;
								}
								this.runMain4(clock);
							}.bind(this))
						}
					}else{
						if(!this.wait5.Once()){
							this.gameFlags.showBonus=true;
						}
						this.wait8.set(clock,1.2);
						this.wait8.Wait(clock,function(){
							if(!this.wait8.Once()){
								this.gameFlags.showBonusWithPoints=true;
								this.modifyScore(this.gameData.hitCount*100);
							}
							this.wait9.set(clock,2);
							this.wait9.Wait(clock,function(){
								if(!this.wait9.Once()){
									this.gameFlags.showNumberOfHits=false;
									this.gameFlags.showHitCount=false;
									this.gameFlags.showBonus=false;
									this.gameFlags.showBonusWithPoints=false;
								}
								this.wait10.set(clock,0.5);
								this.wait10.Wait(clock,function(){
									if(!this.wait10.Once()){
										this.gameData.stageClear=true;
										this.gameData.soundStack.push({command:"PLAY LOOPING",music:"ambience"});
									}
									this.runMain4(clock);
								}.bind(this))
							}.bind(this));
						}.bind(this));
					}
				}.bind(this));
			}.bind(this));
		}.bind(this));		
	}.bind(this));
}

allien.prototype.runMain4=function(clock){
	this.wait11.waitUntil((this.gameData.shipActive[0]||this.gameData.shipActive[1]),function(){
		if(this.gameData.alliensAttackingPauseCounter>0)
			this.gameData.alliensAttackingPauseCounter--;
		else{
			if(!this.once[9]){
				this.once[9]=true;
				this.gameFlags.enableFiring=true;
				this.gameFlags.hideTexts=true;
				this.gameData.stage++;
				if((this.gameData.stage-3)%4==0){
					this.gameFlags.showChallengingStage=true;
					if(this.gameData.players==1){
						this.gameData.soundStack.push({command:"STOP",music:"ambience"});
						this.gameData.soundStack.push({command:"PLAY",music:"challenging stage"});
					}
				}else
					this.gameFlags.showStage=true;
			}else{
				this.wait12.set(clock,2);
				this.wait12.Wait(clock,function(){
					this.gameFlags.levelFlags="process";
					this.gameData.alliensAttackingPauseCounter=1;
					this.gameFlags.showStage=false;
					this.gameData.callNewPlayer=false;
					this.gameFlags.showChallengingStage=false;
					this.resetData();
				}.bind(this));
			}
		}
	}.bind(this));
}

allien.prototype.isCurrentCloneVisible = function(){
	return(!(this.currentAction=="WAIT FOR CAPTURE"||this.currentAction=="DEAD"||this.currentAction=="INACTIVE"||this.currentAction=="PLAYER IN STORAGE"||this.currentAction=="REMOVE"));
}

allien.prototype.doTakeHostagePosition=function(){
	this.getFormationPosition();
	this.deltaX=this.targetX - this.x;
	this.deltaY=this.targetY - this.y;
	if((this.deltaX*this.deltaX+this.deltaY*this.deltaY)>1){
		this.turnTorwardsDelta(this.deltaX,this.deltaY,18);
		this.move(2);
	}else{
		this.x+=this.deltaX;
		this.y+=this.deltaY;
		if(Math.abs((this.rotation+180)%360-180)<18){
			this.rotation=0;
			this.gameFlags.playerNewLife=true;
			//if(!this.gameFlags.endGame&&!this.gameFlags.challengingStage)
				//this.gameFlags.showReady=true;
			this.currentAction="HOLD FORMATION";
			if(!this.gameFlags.endGame)
				this.gameData.alliensCanAttack=true;
			this.gameData.alliensAttackingPauseCounter=60;
			this.gameData.capturing=false;
		}else
			this.rotation+=((this.rotation<0)?1:0)*36-18
	}
}

allien.prototype.inFormation=function(id){
	return(!this.isCloneVisible(id)||this.gameData.allienOrders[id]=="HOLD FORMATION"||this.gameData.allienOrders[id]=="DOUBLE UP PLAYER");
}

allien.prototype.allArrived=function(){
	for(var i=0;i<this.gameData.maxAlliens; i++){
		var temp = ((!this.isCloneVisible(i)&&this.gameData.allienOrders[i]!="INACTIVE")||this.gameData.allienOrders[i]=="HOLD FORMATION");
		if(!temp)
			return false;
	}
	return true;
}

allien.prototype.captiveSwoop=function(){
	if(this.gameData.hasCaptive)
		if(this.gameData.allienOrders[this.gameData.captorId]=="DEAD")
			if(this.gameData.allienOrders[this.gameData.captiveId]=="HOLD FORMATION"){
				this.setPathTypeFor(this.gameData.captiveId,"PLAYER SWOOP",0,(this.gameData.allienFormationX>0?1:0)*2-1);
				this.getEmptyAttackFormationIndex();
				this.addToAttackingGroup(this.gameData.captiveId,this.gameData.emptyAttackFormationIndex);
			}
}

allien.prototype.doToHeight=function(clock){
	this.dropBombs();
	this.setCostumeWithTime(clock); //check if clock needed
	var t=this.y;
	this.move(this.deltaMove);
	if((t-this.targetHeight)*(this.y-this.targetHeight)<0)
		this.fetchNewAction=true;
}

allien.prototype.updatePosition=function(clock){
	if(this.gameData.allienControlPath[this.cloneId]!=""){
		this.pathIndex=0;
		while((this.gameData.allienControlPath[this.cloneId]!=this.gameData.pathNames[this.pathIndex])&&this.pathIndex<2000)
			this.pathIndex++; //check if this does not sum 1 in excess
		this.pathIndex=this.gameData.pathIndex[this.pathIndex];
		this.direction=this.gameData.allienDirection[this.cloneId];
		this.allienType=this.gameData.allienType[this.cloneId];
		this.formationXOffset=this.gameData.allienFormationX[this.cloneId];
		this.formationYOffset=this.gameData.allienFormationY[this.cloneId];
		this.delay=this.gameData.allienPathDelay[this.cloneId];
		this.gameData.allienControlPath[this.cloneId]="";
		this.currentAction="INACTIVE";
		this.fetchNewAction=true;
	}
	if(this.delay>0){
		this.delay--;
		if(this.delay==0){
			this.bombcount=((this.gameData.bombAvailability>0&&(Math.round(Math.random(2)+1)==1))?1:0)
		}
		this.show=false; // understand this thing
	}else{
		if(!this.fetchNewAction){
			if(this.currentAction=="MOVEMENT")
				this.doMovement(clock);
			if(this.currentAction=="JOIN FORMATION")
				this.doJoinFormation(clock);
			if(this.currentAction=="HOLD FORMATION")
				this.doHoldFormation(clock);
			if(this.currentAction=="CONTINUE FLIGHT")
				this.doContinueFlight(clock);
			if(this.currentAction=="MOVE ABOVE FORMATION")
				this.doMoveAboveFormation();
			if(this.currentAction=="TO HEIGHT")
				this.doToHeight(clock);
			if(this.currentAction=="DIVE TO BEAM")
					this.doDiveToBeam(clock);
			if(this.currentAction=="FIRE BEAM")
					this.doFireBeam(clock);
			if(this.currentAction=="WAIT FOR CAPTURE"){
				this.doWaitForCapture();
			}
			if(this.currentAction=="TAKE HOSTAGE POSITION")
				this.doTakeHostagePosition();
			if(this.currentAction=="DOUBLE UP PLAYER")
				this.doDoubleUpPlayer();
			if(this.currentAction=="DIVE AT PLAYER")
				this.doDiveAtPlayer();
		}else{		
			this.currentAction=this.gameData.pathData[this.pathIndex];
			this.pathIndex++;
			this.fetchNewAction=false;
			this.setNewCommand();
		}
	}
}

allien.prototype.doWaitForCapture=function(){
	if(!this.gameData.hasCaptive&&this.gameData.capturing){
		this.gameData.hasCaptive=true;
		this.gameData.captiveId=this.cloneId;
		this.x=this.gameData.mainShipX;
		this.y=this.gameData.mainShipY;
		this.x+=-8+16*(this.gameData.shipActive[1]?1:0);
		this.rotation=0;
		this.allienType=6;
		this.setCostumeWithOffset(0);
		this.show=true;
	}else{
		if(this.gameData.hasCaptive){
			if(this.gameData.beamActive){
				this.deltaX=this.gameData.bossX-this.x;
				this.deltaY=-86-this.y;
				var temp=this.rotation;
				if((this.deltaX*this.deltaX+this.deltaY*this.deltaY)>2){
					this.pointAtDelta(this.deltaX,this.deltaY)
					this.move(1);
					this.rotation=(temp+4);
				}else{
					this.allienType=5;
					this.setCostumeWithOffset(0);
					this.x+=this.deltaX;
					this.y+=this.deltaY;
					if(Math.abs(this.rotation%360)>=0.05)
						this.rotation=temp+4;
				}
			}else{
				if(this.gameData.allienOrders[this.gameData.captorId]!="HOLD FORMATION"){
					this.x=this.gameData.allienPositionX[this.gameData.captorId];
					this.y=this.gameData.allienPositionY[this.gameData.captorId]-16;
				}else{
					this.initializeAllien(this.cloneId,"TAKE HOSTAGE POSITION",0,this.gameData.allienFormationX[this.gameData.captorId],0,5,0);
				}
			}
		}
	}
}

allien.prototype.canDoContinuousAttack=function(){
	return(this.gameData.allienContinualPath[this.cloneId]=="UP AND DIVE WITH BOSS"||this.gameData.allienContinualPath[this.cloneId]=="BUTERFLY PATH"||this.gameData.allienContinualPath[this.cloneId]=="BEE PATH");
}

allien.prototype.doJoinFormation=function(clock){
	this.dropBombs();
	this.getFormationPosition();
	this.setCostumeWithTime(clock);
	this.deltaX=this.targetX-this.x;
	this.deltaY=this.targetY-this.y;
	if((this.deltaX*this.deltaX+this.deltaY*this.deltaY)>9){
		this.turnTorwardsDelta(this.deltaX,this.deltaY,18);
		this.move(this.deltaMove);
	}else{
		this.x+=this.deltaX;
		this.y+=this.deltaY;
		if(!this.gameData.continuousAttack){
			if(Math.abs(this.rotation)<6){
				this.bombcount=this.gameData.bombAvailability;
				this.rotation=0;
				this.currentAction="HOLD FORMATION";
				this.removeFromAttackingGroup(this.cloneId);
			}else{
				this.rotation+=((this.rotation<0)?1:0)*12-6;
			}
		}else{
			if(this.canDoContinuousAttack()){
				this.bombcount=this.gameData.bombAvailability;
				this.rotation=180;
				this.setPathTypeFor(this.cloneId,this.gameData.allienContinualPath[this.cloneId],0,this.direction);
				this.gameData.soundStack.push({command:"PLAY",music:"galagaattack"});
			}else{
				if(Math.abs(this.rotation)<6){
					this.bombcount=this.gameData.bombAvailability;
					this.rotation=0;
					this.currentAction="HOLD FORMATION";
					this.removeFromAttackingGroup(this.cloneId);
				}else{
					this.rotation+=((this.rotation<0)?1:0)*12-6;
				}
			}
		}
		
	}	
}

allien.prototype.getEmptyAttackFormationIndex=function(){
	this.gameData.emptyAttackFormationIndex=0;
	while(this.gameData.numberInAttackingFormation[this.gameData.emptyAttackFormationIndex]!=0&&this.gameData.emptyAttackFormationIndex<this.gameData.maximumAttackingFormations){
		this.gameData.emptyAttackFormationIndex++;
	}
	return(this.gameData.emptyAttackFormationIndex);
}

allien.prototype.moveFormation=function(){
	this.gameData.formationCentreX+=this.gameData.formationDirection;
	if(Math.abs(this.gameData.formationCentreX)>30){
		this.gameData.formationDirection=-this.gameData.formationDirection;
	}
}

allien.prototype.bossCaptureDive=function(){
	var contnue=true
	if((!this.gameData.hasCaptive)&&(!this.gameData.doubleShip)){
		this.bossIndex=-1
		for(var i=0;i<this.gameData.maxAlliens;i++){
			if(this.gameData.allienType[i]==1||this.gameData.allienType[i]==2){
				if(this.gameData.allienContinualPath[i]=="UP AND DIVE TO CAPTURE"&&this.gameData.allienOrders[i]!="DEAD"){
					contnue=false;
					break;
				}
				if(this.gameData.allienOrders[i]=="HOLD FORMATION")
					if(this.bossIndex==-1||(Math.round(Math.random())==0))
						this.bossIndex=i;   
			}
		}
		if(contnue&&this.bossIndex>-1){
			this.gameData.soundStack.push({command:"PLAY",music:"galagaattack"});
			this.getEmptyAttackFormationIndex();
			this.setPathTypeFor(this.bossIndex,"UP AND DIVE TO CAPTURE",0,((this.gameData.allienFormationX[this.bossIndex]>0)?1:0)*2-1);
			this.addToAttackingGroup(this.bossIndex,this.gameData.emptyAttackFormationIndex);
		}
	}
}

allien.prototype.addToAttackingGroup=function(id,groupIndex){
	this.gameData.allienAttackingGroup[id]=groupIndex;
	this.gameData.numberInAttackingFormation[groupIndex]=this.gameData.numberInAttackingFormation[groupIndex]+1;
}

allien.prototype.checkForBatchOfEightHits=function(){
	var contnue=true;
	if(this.cloneId<=40){
		this.batch=this.cloneId-((this.cloneId-1)%8)
		for(var i=0; i<8; i++){
			if(!((this.batch==this.cloneId)||(this.gameData.allienOrders[this.batch])=="DEAD")){
				contnue=false;
				break;
			}
			this.batch++;
		}
		if(contnue){
			this.scoreCostume=4;
			this.modifyScore(1000);
		}
	}
}

allien.prototype.removeFromAttackingGroup=function(id){
	if(this.gameData.allienAttackingGroup[id]>-1){
		this.gameData.numberInAttackingFormation[this.gameData.allienAttackingGroup[id]]=this.gameData.numberInAttackingFormation[this.gameData.allienAttackingGroup[id]]-1;
		this.gameData.allienAttackingGroup[id]=-1;
	}
}

allien.prototype.countActiveFormations=function(){
	var temp=0;
	for(var i=0;i<this.gameData.numberInAttackingFormation.length;i++){
		if(this.gameData.numberInAttackingFormation[i]>0)
			temp++;
	}
	return(temp);
}

allien.prototype.modifyScore=function(delta){
	if((this.gameData.score<this.gameData.extraLifeAt)&&((this.gameData.score+delta)>=this.gameData.extraLifeAt)){
		this.gameData.soundStack.push({command:"PLAY",music:"1-up"});
		this.gameData.lives++;
		this.gameFlags.lives="process";
		if(this.gameData.extraLifeAt==20000)
			this.gameData.extraLifeAt+=50000;
		else
			this.gameData.extraLifeAt+=70000;
	}
	this.gameData.score+=delta;
	if(_USER.name&&_USER.name!=""&&this.gameData.score>_USER.score)
		_USER.score=this.gameData.score;
	this.gameFlags.showScore=true;
	if(this.gameData.score>this.gameData.hiScore){
		this.gameData.hiScore=this.gameData.score;
		this.gameFlags.showHiScore=true;
	}
}

allien.prototype.doMovement=function(clock){
	this.dropBombs();
	this.setCostumeWithTime(clock);
	this.show=true;
	this.move(this.deltaMove);
	this.rotation+=this.deltaTurn;
	this.steps--;
	if(this.steps==0)
		this.fetchNewAction=true;
}

allien.prototype.dropBombs=function(){
	if(!this.gameData.challengingStage&&(this.gameData.stage>1||this.gameData.alliensArrived)&&(this.gameData.alliensCanAttack&&this.gameData.alliensAttackingPauseCounter==0)){
		if(this.bombcount>0&&((Math.round(Math.random()*13))==0)&&this.y>-20){
			this.gameData.bombX.push(this.x);
			this.gameData.bombY.push(this.y);
			this.bombcount--;
		}
	}
}

allien.prototype.getFormationPosition=function(){
	this.targetX = this.gameData.formationCentreX+this.formationXOffset*this.gameData.formationSpread;
	this.targetY = this.gameData.formationCentreY-this.formationYOffset*this.gameData.formationSpread;
}

allien.prototype.setCostumeWithTime=function(clock){
	this.setCostumeWithOffset(Math.floor((clock%32)/16));
}

allien.prototype.doDiveAtPlayer=function(){
	this.turnTorwardsDelta(this.targetX-this.x,this.targetY-this.y,8);
	this.move(this.deltaMove);
	if(this.touchingEdge())
		this.fetchNewAction=true;
}

allien.prototype.touchingEdge=function(){
	if(Math.abs(this.x)>233||Math.abs(this.y)>175)
		return true;
	else
		return false;
}

allien.prototype.turnTorwardsDelta=function(deltaX,deltaY,maxTurn){
	var t=this.rotation;
	this.pointAtDelta(deltaX,deltaY);
	var delta=((this.rotation-t)+180)%360-180;
	if(delta<-180)
		delta+=360;
	if(Math.abs(delta)>maxTurn)
		this.rotation=(t+(delta/Math.abs(delta))*maxTurn);
}

allien.prototype.pointAtDelta=function(deltaX,deltaY){
	this.rotation=Math.atan(deltaX/deltaY)*180/Math.PI+((deltaY<0)?1:0)*180;
}



allien.prototype.setNewCommand=function(){
	if(this.currentAction=="SET POSITION"){
		this.x=(this.gameData.pathData[this.pathIndex]-112)*this.direction;
		this.y=108-this.gameData.pathData[this.pathIndex+1];
		this.rotation=180+(180-this.gameData.pathData[this.pathIndex+2])*this.direction;
		this.costume=this.setCostumeWithOffset(0);
		this.show=true;
		this.pathIndex+=3;
		this.fetchNewAction=true;
	}else{
		if(this.currentAction=="MOVEMENT"){
			this.steps=this.gameData.pathData[this.pathIndex];
			this.deltaMove=this.gameData.pathData[this.pathIndex+1];
			this.deltaTurn=this.gameData.pathData[this.pathIndex+2]*this.direction;
			this.pathIndex+=3;
		}
		if(this.currentAction=="CONTINUE FLIGHT"){
			this.deltaMove=this.gameData.pathData[this.pathIndex];
			this.deltaTurn=this.gameData.pathData[this.pathIndex+1]*this.direction;
			this.pathIndex+=2;
		}
		if(this.currentAction=="TO HEIGHT"){
			this.targetHeight=108-this.gameData.pathData[this.pathIndex];
			this.pathIndex++;
		}
		if(this.currentAction=="WAIT FOR CAPTURE"){
			this.show=false;
		}	
		if(this.currentAction=="PAUSE ATTACK"){
			this.gameData.alliensAttackingPauseCounter=this.gameData.pathData[this.pathIndex];
			this.pathIndex++;
			this.fetchNewAction=true;
		}
		if(this.currentAction=="DOUBLE UP PLAYER"){
			this.gameData.watingToDouble=true;
			this.gameData.alliensCanAttack=false;
			this.doubleUpCounter=40;
			this.allienType=6;
			this.setCostumeWithOffset(0);
			this.x=Math.round(this.x);
			this.y=Math.round(this.y);
			this.gameData.soundStack.push({command:"PLAY",music:"fighter rescued"});
		}
		if(this.currentAction=="PLAYER IN STORAGE"){
			this.show=false;
			this.gameData.playerInStorage=true;
		}
		if(this.currentAction=="LEAVE FORMATION"){
			if(!this.gameData.continuousAttack||(this.rotation>=0&&this.rotation<=0.01)){
				this.steps=30;
				this.deltaMove=2;
				this.deltaTurn=6*this.direction;
				this.currentAction="MOVEMENT";
			}else{
				this.fetchNewAction=true;
				if(this.gameData.continuousAttack)
					if(Math.abs(this.rotation)<20)
						this.gameData.allienCount=this.direction;
						this.gameFlags.stopAll=true;
			
			}
		}
		if(this.currentAction=="BEE RETURN"){
			if(!this.gameData.continuousAttack)
				this.currentAction="JOIN FORMATION";
			else
				this.fetchNewAction=true;
		}
		if(this.currentAction=="SPEED"){
			this.deltaMove=this.gameData.pathData[this.pathIndex];
			this.pathIndex++;
			this.fetchNewAction=true;
		}
		if(this.currentAction=="DIVE AT PLAYER"){
			this.targetX=(this.gameData.mainShipX+((this.gameData.shipActive[0]?-1:0)+(this.gameData.shipActive[1]?1:0))*8);
			this.targetY=this.gameData.mainShipY;
			this.targetX+=(this.targetX-this.x);
			this.targetY+=(this.targetY-this.y);
		}
			
	}
}

allien.prototype.setPathTypeFor=function(id,pathName,delay,direction){
	this.gameData.allienPathDelay[id]=delay;
	this.gameData.allienControlPath[id]=pathName;
	this.gameData.allienDirection[id]=direction;
	this.gameData.allienContinualPath[id]=pathName;
}

allien.prototype.setCostumeWithOffset=function(offset){
	this.costume=this.allienType*2-2+offset;  //check start with zero
}

allien.prototype.checkAgainstCollisions=function(clock){
	if(this.allienType!=6){
		if(Math.abs(this.y-this.gameData.mainShipY)<14){
			if((Math.abs(this.x-(this.gameData.mainShipX-8))<14)&&(this.gameData.shipActive[0])&&(!this.gameData.shipHit[0])){
				this.gameData.shipHit[0]=true;
				this.hitMainShip=true;
				this.hitAllien(clock);
			}else{
				if((Math.abs(this.x-(this.gameData.mainShipX+8))<14)&&(this.gameData.shipActive[1])&&(!this.gameData.shipHit[1])){
					this.gameData.shipHit[1]=true;
					this.hitMainShip=true;
					this.hitAllien(clock);	
				}
			}
		}
	}
}

allien.prototype.initializeAllien=function(id,pathName,delay,formationX,formationY,type,direction){
	this.gameData.allienFormationX[id]=formationX;
	this.gameData.allienFormationY[id]=formationY;
	this.gameData.allienType[id]=type;
	this.setPathTypeFor(id,pathName,delay,direction);
}

allien.prototype.inFormation2=function(){ //need to check this one
	for(var i=0;i<this.gameData.maxAlliens;i++){
		if(!this.inFormation(i)){
			return(false);
			//break;
		}	
	}
	return(true);
}

allien.prototype.prepareClonesForNewWave=function(){
	for(var i=0;i<this.gameData.maxAlliens; i++){
		this.gameData.allienAttackingGroup[i]=-1;
	}
	this.gameData.formationCentreX=0;
	this.gameData.formationCentreY=82;
	this.gameData.formationSpread=16;
	this.gameData.formationDirection=1;
	this.gameData.numberInAttackingFormation=[];
	for(var i=0;i<this.gameData.maximumAttackingFormations;i++)
		this.gameData.numberInAttackingFormation.push(0);
	this.gameFlags.createWavePrepare=true;
}

allien.prototype.setClonesForWaves=function(){
	if(this.gameData.stage<3){
		this.gameFlags.wave="createWaveType"+this.gameData.stage;
	}else{
		if((this.gameData.stage-3)%4==0){
			this.gameFlags.wave="createWaveChallenge"+(((this.gameData.stage-3)/4)%4+1);
		}else{
			this.gameFlags.wave="createWaveType"+(4-(this.gameData.stage-3)%4);
		}
	}
}


s14 = new createScripts("gs14",_ROOT+"/actors/initializeAlliens.js");

