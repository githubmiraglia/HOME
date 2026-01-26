// JavaScript Document

function game(platform,players,player,js,am,cd,sv,jUsed,leftPaddngs,spriteList,createStringWidth){
	this.players=players;
	this.player = player;
	this.platform=platform
	this.js = js;
	this.am = am;
	this.sv = sv;
	if(this.players==2)
		this.cd = new canvasdisplay(this.platform,leftPaddngs,"player"+this.player+"canvas",spriteList,createStringWidth);
	else
		this.cd=cd;
	this.actors=[];
	this.flags ={
		stars:"static",
		lives:"ended",
		endGame:false,
		showReady:false,
		shipDies:false,
		showStage:false,
		showChallengingStage:false,
		showFighterCaptured:false,
		enableFiring:false,
		allienActivateClones:false,
		showNumberOfHits:false,
		showHitCount:false,
		showPerfect:false,
		showSpecialBonus:false,
		showBonus:false,
		showBonusWithPoints:false,
		hideTexts:false,
		showChallenge:false,
		showStage:false,
		levelFlags:"NA",
		playerNewLife:false,
		lives:"NA",
		activatePLayer:"NA",
		createCloneShip:false,
		showReady:false,
		fireBullet:false,
		shipDoubleUp:false,
		shipDoubledUp:false,
		createCloneOfBeam:false,
		beamCollapse:false,
		wave:"",
		createNewBomb:false,
		newBombX:0,
		newBombY:0,
		newBombR:0,
	};
	this.data={
		jUsed:jUsed,
		soundStack:[],
		lives:3,
		stage:1,
		player:this.player,
		//ship global variables for mainShip
		shipActive:[false,false],
		shipHit:[false,false],
		doubleShip:false,
		waitingToDouble:false,
		capturing:false,
		spacePressed:false,
		mainShipX:0,
		mainShipY:0,
		//bullet global variables
		bulletX:[0,0,0,0],
		bulletY:[0,0,0,0],
		bulletActive:[false,false,false,false],
		bulletToRemove:[false,false,false,false],
		bulletMissCount:0,
		bulletCount:0,
		bulletWait:[false,false],
		//alien paths variables
		pathNames:[],
		pathIndex:[0],
		pathData:[],
		//alien initialization
		allienAttackingGroup:[],
		allienContinualPath:[],
		allienControlPath:[],
		allienDirection:[],
		allienFormationX:[],
		allienFormationY:[],
		allienOrders:[],
		allienPathDelay:[],
		allienType:[],
		allienPositionX:[],
		allienPositionY:[],
		bombX:[],
		bombY:[],
		bombScores:[],
		bombCount:0,
		maximumAttackingFormations:16,
		numberInAttackingFormation:[],
		maxAlliens:49,
		alliensInFormation:false,
		beamActive:false,
		lastBeam:0,
		bossX:0,
		bossY:0,
		captorId:0,
		captiveId:0,
		hasCaptive:false,
		challengingStage:false,
		hitCount:0,
		alliensCanAttack:false,
		stageQuadrant:0,
		bombAvailability:0,
		continuousAttack:false,
		alliensAttackingPauseCounter:0,
		alliensArrived:false,
		formationCentreX:0,
		formationCentreY:0,
		formationDirection:0,
		formationSpread:0,
		emptyAttackFormationIndex:0,
		beamId:1,
		stageClear:false,
		bossScores:[150,400,800,1500],
		score:0,
		hiScore:(_TOPSCORES[0]==undefined)?0:_TOPSCORES[0].score,
		extraLifeAt:20000,
		callNewPlayer:false,
		stopThisScript:[],
		resetAlliens:false,
		onePriorToBeamPosition:false,
		players:this.players
	};
	this.lost=false;
	this.finishedLevel=false;
	this.ret =[];
	this.bgDy = 0;
	this.introEnded = false;
	this.numChallengePaths=4
	this.wait1 = new wait();
	this.wait2 = new wait();
	this.wait3 = new wait();
	this.wait4 = new wait();
	this.wait5 = new wait();
	this.wait6 = new wait();
	this.wait7= new wait();
	this.wait8 = new wait();
	this.lFlags = new levelFlags(this.cd);
	this.once=[false,false,false,false,false];
	this.setPath();
	this.createActors();
}

game.prototype.intro = function(clock){
		this.wait2.set(clock,0.1)
		this.wait2.Wait(clock,function(){
			if(!this.wait2.Once()){
				this.data.soundStack.push({command:"PLAY",music:"stage intro"});
			}
			this.cd.drawString("Player "+this.player,24,_K[5]-19.5*_K[6],"center","lightblue","black");
			this.wait3.set(clock,4) 
			this.wait3.Wait(clock,function(){
				if(!this.wait3.Once()){
					this.flags["levelFlags"]="process";
					this.flags["lives"]="process";
				}
				this.cd.drawString("Stage "+this.data.stage,24,_K[5]-21.5*_K[6],"center","lightblue","black");
				this.wait4.set(clock,1.6) 
				this.wait4.Wait(clock,function(){
					if(!this.wait4.Once()){
						this.flags["activatePlayer"]=true;
						this.flags.playerNewLife=true;
						this.flags["stars"]="scroll";
					}
					this.wait5.set(clock,1) 
					this.wait5.Wait(clock,function(){
						this.introEnded = true;
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
}

game.prototype.background = function(clock){
	if(this.flags.stars=="scroll"){
		this.bgDy = (this.bgDy+4)%Math.floor(_HEIGHT/_SCALE);
	}
	else
		this.bgDy = 0;
	var costume = 1+Math.floor(clock/4)%4;
	this.cd.singleBGcolor("black");
	this.cd.drawSingleBG("stars",costume,this.bgDy);
	this.cd.drawSingleBG("stars",costume,this.bgDy-Math.floor(_HEIGHT/_SCALE)+30);
	this.cd.drawSingleBG("stars",0,0);
}

game.prototype.play = function(clock){
	this.background(clock);
	this.overlays(clock);
	this.processLevelFlags(clock);
	this.processLives();
	if(!this.introEnded)
		this.intro(clock);
	
	this.actors.forEach(function(actor){
		this.ret = actor.act(clock,this.flags,this.data);
        this.flags = this.ret[0];
		this.data = this.ret[1];
		if(actor.deleteThisActor){
			actor=null;
			delete actor;
		}
    },this);

	//if(this.players==2&&(this.flags.showStage||this.flags.showChallengingStage)&&!this.data.callNewPlayer&&!this.flags.shipDies){
		//this.data.callNewPlayer=true;
		//this.finishedLevel=true;
		//this.data.soundStack.push({command:"STOP",music:"ambience"});
		//this.data.soundStack = this.am.playStack(this.data.soundStack);
	//}else{
		this.actors = this.actors.filter(function(actor){
			return !actor.deleteThisActor; 
		});	
	
		this.cd.drawActors(this.actors);
		this.manageActors();
		//this.overlays(clock);
		this.data.soundStack = this.am.playStack(this.data.soundStack);

   //}
}


game.prototype.processLevelFlags = function(clock){
	if(this.data.stageClear)
		this.once[0]=false;
	if(this.flags.levelFlags=="process"){
		if(!this.once[0]){
			this.once[0]=true;
			this.lFlags.reset(this.data.stage,this.flags,this.data)
		}
		this.ret = this.lFlags.animate(clock);
		this.flags = this.ret[0];
		this.data = this.ret[1];
	}
	this.lFlags.print();
}

game.prototype.processLives = function(){
	if(this.flags.lives=="process"){
		var livesX=-105;
		for(var i=0; i<this.data.lives; i++){
			this.cd.drawSingleActor("lives",0,livesX,-190);
				livesX+=14;
		}
	}
}

game.prototype.createActors=function(){
	this.actors.push(new ship("player",4,0,-156,0,0,0,false,this.js,false,false)); //sprite,costume,x,y,vx,vy,rotate,flip,js,show,isClone
	this.actors.push(new bullet("bullet",0,0,0,0,0,0,false,this.js,false,false,0)); //(sprite,costume,x,y,vx,vy,rotation,flip,js,show,isClone,cloneId)
	//this.actors.push(new bullet("bullet",0,0,0,0,0,0,false,this.js,false,false,NaN)); 
	for(var i=0; i<4; i++)
		this.actors.push(new bullet("bullet",0,0,0,0,0,0,false,this.js,false,true,i)); //(sprite,costume,x,y,vx,vy,rotation,flip,js,show,isClone,cloneId)
	this.actors.push(new allien("aliens",0,0,0,0,0,0,false,this.js,false,false,NaN)); 
	for (var i=0; i<this.data.maxAlliens; i++){
		this.actors.push(new allien("aliens",0,0,0,0,0,0,false,this.js,false,true,i)); //sprite,costume,x,y,vx,vy,rotation,flip,js,show,isClone,cloneId
		this.data.allienControlPath.push("INACTIVE");
		this.data.allienDirection.push(0);
		this.data.allienFormationX.push(0);
		this.data.allienFormationY.push(0);
		this.data.allienOrders.push("");
		this.data.allienPathDelay.push(0);
		this.data.allienType.push(0);
		this.data.allienPositionX.push(0);
		this.data.allienPositionY.push(0);
		this.data.allienContinualPath.push(0);
		this.data.allienAttackingGroup.push(NaN);
		this.data.stopThisScript.push(false);
	this.actors.push(new bomb("bomb",0,0,0,0,0,0,false,this.js,false,false,NaN));          //sprite,costume,x,y,vx,vy,rotation,flip,js,show,isClone,cloneId
	}
}
					 
game.prototype.manageActors = function(){
	if(this.flags.createCloneShip){
		this.actors.push(new ship("player",4,0,-156,0,0,0,false,this.js,true,true)); //sprite,costume,x,y,vx,vy,rotate,flip,js,show,isClone
	}
	if(this.flags.createCloneOfBeam){
		if(this.data.beamId<=9){
			this.actors.push(new beam("beam",0,this.data.bossX+1,-88,0,0,0,false,this.js,true,this.data.beamId)); //sprite,costume,x,y,vx,vy,rotation,flip,js,show,cloneId
			this.data.beamId++;
		}
		this.flags.createCloneOfBeam=false;
	}
	
	if(this.flags.createNewBomb){
		this.actors.push(new bomb("bomb",0,this.data.newBombX,this.data.newBombY,0,0,this.data.newBombR,false,this.js,true,true,NaN));       //sprite,costume,x,y,vx,vy,rotation,flip,js,show,isClone,cloneId
		this.flags.createNewBomb=false;
	}
	
	if(this.data.resetAlliens){
		this.actors.forEach(function(actor){
			if(actor.isAllien){
				actor.show=false;
				actor.x=-500;
				actor.allienType=0;
				_TEST++;
			}
		},this);
		_TEST=0;
		for(var i=0;i<this.data.maxAlliens;i++){
			this.data.allienOrders[i]="";
			this.data.allienPathDelay[i]=0;
			this.data.allienControlPath[i]="WAITING";
			this.data.allienDirection[i]=0;
			this.data.allienContinualPath[i]="";
			this.data.allienPositionX[i]=-500;
		}
		this.data.resetAlliens=false;
	}
}

game.prototype.overlays=function(clock){
	
	if(this.players==2&&this.flags.showChallengingStage&&!this.once[4]){
		this.once[4]=true;
		this.data.soundStack.push({command:"PLAY",music:"challenging stage"});
		this.data.soundStack=this.am.playStack(this.data.soundStack);
	}else if(!this.flags.showChallengingStage)
		this.once[4]=false;
	
	this.cd.drawNumber(this.data.score,6,74,"left","white","black",10);
	this.cd.drawNumber(this.data.hiScore,6,74,"center","white","black",10);
	if(this.player==2)
		this.cd.drawSingleActor("two",0,-92,89); 
	if(this.flags.showReady)
		this.cd.drawString("READY",24,_K[5]-20.5*_K[6],"center","lightblue","black");
	if(this.flags.showStage)
		this.cd.drawString("STAGE  "+this.data.stage,24,_K[5]-20.5*_K[6],"center","lightblue","black");
	if(this.flags.showChallengingStage)
		this.cd.drawString("CHALLENGING  STAGE",24,_K[5]-20.5*_K[6],"center","lightblue","black");
	if(this.flags.showFighterCaptured)
		this.cd.drawString("FIGHTER CAPTURED",24,_K[5]-20.5*_K[6],"center","red","black");
	if(this.flags.showNumberOfHits)
		this.cd.drawString("NUMBER OF HITS",24,_K[5]-20.5*_K[6],"center","lightblue","black","  "+this.data.hitCount,-1);
	if(this.flags.showHitCount)
		this.cd.drawString("  "+this.data.hitCount,24,_K[5]-20.5*_K[6],"center","lightblue","black","NUMBER OF HITS",1);
	if(this.flags.showPerfect)
		this.cd.drawString("PERFECT",24,_K[5]-22.5*_K[6],"center","red","black");
	if(this.flags.showSpecialBonus)
		this.cd.drawString("SPECIAL BONUS 10000 PTS",24,_K[5]-24.5*_K[6],"center","yellow","black");
	if(this.flags.showBonus)
		this.cd.drawString("BONUS",24,_K[5]-22.5*_K[6],"center","lightblue","black","  "+this.data.hitCount*100,-1);
	if(this.flags.showBonusWithPoints)
		this.cd.drawString("  "+this.data.hitCount*100,24,_K[5]-22.5*_K[6],"center","lightblue","black","BONUS",1);
	
	if(this.flags.endGame){
		var bulletHit = this.data.bulletCount-this.data.bulletMissCount;
		var hitMissRatio = Math.round(bulletHit/this.data.bulletCount*100)
		this.wait8.set(clock,1.5)
		this.wait8.Wait(clock,function(){
			this.cd.drawString("GAME  OVER"+((this.players==2)?"  PLAYER  "+this.player:""),24,_K[5]-19.5*_K[6],"center","lightblue","black");
			this.wait6.set(clock,2)
			this.wait6.Wait(clock,function(){
				this.cd.drawString("--RESULTS--",24,_K[5]-22.5*_K[6],"center","RED","black");
				this.cd.drawString("SHOTS  FIRED  "+this.data.bulletCount,24,_K[5]-25.5*_K[6],"center","yellow","black");
				this.cd.drawString("NUMBER  OF  HITS  "+bulletHit,24,_K[5]-28.5*_K[6],"center","yellow","black");
				this.cd.drawString("HIT  MISS  RATIO  "+hitMissRatio+" %",24,_K[5]-31.5*_K[6],"center","grey","black");
				this.wait7.set(clock,5)
				this.wait7.Wait(clock,function(){
					//this.data.soundStack.push({command:"STOP",music:"ambience"});
					//this.data.soundStack = this.am.playStack(this.data.soundStack);
					//if(this.player==1)
					this.checkTopScores();
					this.lost=true;
					this.freezeScreen();
				}.bind(this));
			}.bind(this));
		}.bind(this));
	}	
}

//function(name,costume,dY,opacity)
game.prototype.freezeScreen=function(){
	var currentImg=this.cd.canvas.toDataURL("image/png");
	this.cd.spriteList["stage"].img.src=currentImg;
	this.cd.spriteList["stage"].scale=false;
	this.cd.drawSingleBG("stage",0,0,1);
}

game.prototype.checkTopScores=function(){
	let changed=false;
	if(_USER.name&&_USER.name!=""&&_TOPSCORES[0]!=undefined){
		var ind1=-1;
		var topScoreUser=0;
		for(var i=0;i<5;i++){
			if(_USER.name==_TOPSCORES[i].name){
				ind1=i;
				topScoreUser=_TOPSCORES[i].score;
			}
		}
		if(_USER.score>topScoreUser){
			changed=true;
			for(var i=0;i<5;i++){
				if(_USER.score>_TOPSCORES[i].score){
					ind2=i;
					if(ind1==-1){
						for(var j=4;j>i;j--){
							_TOPSCORES[j].name=_TOPSCORES[j-1].name;
							_TOPSCORES[j].score=_TOPSCORES[j-1].score;
						}
						_TOPSCORES[i].name=_USER.name;
						_TOPSCORES[i].score=_USER.score;
						break;
					}else{
						for(var j=ind1;j>ind2;j--){
							_TOPSCORES[j].name=_TOPSCORES[j-1].name;
							_TOPSCORES[j].score=_TOPSCORES[j-1].score;
						}
						_TOPSCORES[ind2].name=_USER.name;
						_TOPSCORES[ind2].score=_USER.score;
						break;
					}
				}
			}		
		}
	}
	if(changed)
		this.updateTopScores();
}

game.prototype.updateTopScores=function(){
if(navigator.onLine){
	let cont=0;
	_TOPSCORES.forEach(function(ts){
		cont++;
		let s="'"+cont.toString()+"'";
		let q={query:"UPDATE",table:"topscores",name:ts.name,score:ts.score,where:"gameId='2' AND scoreRanking="+s};
		this.sv.promiseToGet("POST",q).then(function(result){
			if(result instanceof Error)
				alert("Error, could not update top scores");
		});
	}.bind(this));
}
}



if(!_REPLAY)
	s13 = new createScripts("gs13",_ROOT+"/game/pathData.js");