// JavaScript Document
function game(platform,players,player,js,am,cd,sv,jUsed,leftPaddngs,spriteList,createStringWidth){
	this.players=players;
	this.player = player;
	this.platform=platform;
	this.js = js;
	this.am = am;
	this.sv = sv;
	this.jUsed=jUsed;
	if(this.players==2)
		this.cd = new canvasdisplay(this.platform,leftPaddngs,"player"+this.player+"canvas",spriteList,createStringWidth);
	else
		this.cd=cd;
	this.actors=[];
	this.flags ={
		goLow:false,
		goHigh:false,
		exploding:false,
		backToHigh:false,
		intoLow:false,
		resetHigh:true,
		resetLanderY:false,
		showReady:false
	};
	this.data={
		X:0,
		vX:0,
		vY:[0,0],
		aX:[0.025,0.05],
		aY:[0.025,0.045],
		yini:[60,80],
		yback:[0,0],
		maxvX:[2.5,5],
		gravity:[0.01,0.02],
		hThreshold:[-13.5,0],
		hLimit:[60,85],
		changedLowHigh:0,
		lowHigh:0,
		xCostume:0,
		score:0,
		hiScore:(_TOPSCORES[0]==undefined)?0:_TOPSCORES[0].score,
		tclock:0,
		fuel:5000,
		changeFuelHigh:2,
		changeFuelLow:2,
		collisionCoordX:[-10,-10,-14,-14,-18,-18,-14,-14,-10,-10,-14,-14,-18,-18,-22,-22,-5,-5,6,6,10,10,14,14,10,10,6,6,10,10,14,14,18,18,2,2,-1,-3],
		collisionCoordY:[36,32,28,24,20,16,12,8,4,1,-4,-8,-12,-16,-20,-24,-12,-16,36,32,28,24,20,16,12,8,4,1,-4,-8,-12,-16,-20,-24,-12,-16,44,44],
		landingXBeg:[ 69,414,440,742,852,961 ,1373,1448,1640,1651,1784],
		landingXEnd:[128,463,501,802,912,1018,1432,1502,1697,1709,1842],
		landingYMore:[85.5,85.5,285.5,108.5,285.5,242.5,220.5,109.5,132.5,287.5,175.5],
		landingYLess:[88.5,88.5,288.5,111.5,288.5,245.5,223.5,112.5,135.5,290.5,178.5],
		landingPoints:[100,200,"F",100,200,300,900,300,100,400,300],
		soundStack:[],
		refuels:3
	};
	this.lastPressed="none";
	this.X=0;
	this.vX=0;
	this.lost=false;
	this.ret=[];
	this.rollingBackground=["lunarHigh","lunarLow"];
	this.createActors();
	this.once=[false,false,false,false,false,false,false,false,false,false,false];
}

game.prototype.play = function(clock){
	if(this.flags.resetHigh){
		this.resetHigh();
	}
	if(!this.lost&&!this.flags.showReady&&!this.flags.gameOver){
		this.cd.drawBackground("board",0);
		this.cd.drawRollingBackground(this.rollingBackground[this.data.lowHigh],this.X,110);
		//if(!this.flags.gameover){
			this.actors.forEach(function(actor){
				this.ret = actor.act(clock,this.flags,this.data);
				this.flags = this.ret[0];
				this.data = this.ret[1];
				if(actor.deleteThisActor){
					actor=null;
					delete actor;
				}
			}.bind(this));
			this.actors = this.actors.filter(function(actor){
				return !actor.deleteThisActor; 
			});
			if(!this.flags.exploding&&!this.flags.landed)
				this.setX(clock);
			this.cd.drawActors(this.actors);
			this.overlays(clock);
		//}else{
		//	this.gameOver(clock);
		//}
	}else if(this.flags.showReady){
		if(!this.once[7]){
			this.tclock=clock
			this.once[7]=true;
		}else{
			if((clock-this.tclock)/(1000/_TICK)<=1.5){
				this.overlays(clock);
			}else{
				this.flags.showReady=false;
				this.once[7]=false;
				this.resetHigh();
			}
		}
	}else if(this.flags.gameOver)
		this.gameOver(clock);
	this.data.soundStack = this.am.playStack(this.data.soundStack);
}


game.prototype.setX=function(clock){
	this.js.readJoystick(this.jUsed);
	if(!this.js.left&&!this.js.right)
		this.data.xCostume=0;
	if(!this.js.fire){
		if(this.js.left&&this.data.fuel>0){
			if(this.data.lowHigh==0)
				this.data.fuel-=this.data.changeFuelHigh;
			else
				this.data.fuel-=this.data.changeFuelLow;
			this.data.soundStack.push({command:"PLAYTOEND",music:"rockets"});
			if(this.lastPressed=="left"){
				if(mod(Math.floor(clock/4),2)==0)
					this.data.xCostume=0;
				else
					this.data.xCostume=2;
			}else{
				this.lastPressed="left";
				this.data.xCostume=2;
			}
			this.vX-=this.data.aX[this.data.lowHigh];
			if(this.vX<-1*this.data.maxvX[this.data.lowHigh])
				this.vX=-1*this.data.maxvX[this.data.lowHigh];
		}else if(this.js.right&&this.data.fuel>0){
			if(this.data.lowHigh==0)
				this.data.fuel-=this.data.changeFuelHigh;
			else
				this.data.fuel-=this.data.changeFuelLow;
			this.data.soundStack.push({command:"PLAYTOEND",music:"rockets"});
			if(this.lastPressed=="right"){
				if(mod(Math.floor(clock/4),2)==0)
					this.data.xCostume=1;
				else
					this.data.xCostume=0;
			}else{
				this.lastPressed="right";
				this.data.xCostume=1; 
			}
			this.vX+=this.data.aX[this.data.lowHigh];
			if(this.vX>this.data.maxvX[this.data.lowHigh])
				this.vX=this.data.maxvX[this.data.lowHigh];
		}
	}else{
		this.lastPressed="none";
	}
	if(!this.flags.showReady){
		this.X+=this.vX;
		this.data.X=this.X;
		this.data.vX=this.vX;
	}
	if(this.flags.backToHigh||this.flags.intoLow){
		this.data.changedLowHigh++
		if(this.data.changedLowHigh>4){
			this.data.changedLowHigh=0;
			if(this.flags.intoLow)
				this.goLow();
			else
				this.goHigh();
		}
	}
}

game.prototype.resetHigh=function(){
	this.X=Math.floor(Math.random()*944)-472;
	this.vX=Math.floor(Math.random()*4)-1.5;
	this.data.lowHigh=0;
	this.flags.resetHigh=false;
	this.flags.resetLanderY=true;
	this.actors[0].show=false;
	this.data.soundStack.push({command:"PLAYLOOP",music:"interior",volume:0.5});
}

game.prototype.goHigh=function(){
	this.X=Math.floor(this.X/2-74);
	this.vX=Math.round(this.vX/2);
	this.flags.backToHigh=false;
	this.data.lowHigh=0;
}

game.prototype.goLow=function(){
	this.X=(this.X+74)*2;
	this.vX=this.vX*2;
	this.flags.intoLow=false;
	this.data.lowHigh=1;
}



game.prototype.createActors=function(){
	this.actors.push(new landerLow("landerLow",0,0,this.data.yini[1],0,0,0,false,false,this.js,this.jUsed,this.cd.cx));
	this.actors.push(new landerHigh("landerHigh",0,0,this.data.yini[0],0,0,0,false,false,this.js,this.jUsed));
}			 


game.prototype.overlays=function(clock){
	for(let i=0;i<this.data.refuels;i++){
		this.cd.drawSingleActor("fuel",0,-225+i*25,-175);
	}
	if(this.data.fuel<0)
		this.data.fuel=0;
	
	this.cd.drawNumber(this.data.score,6,183,"left","white","black",30);
	this.cd.drawNumber(this.data.hiScore,6,183,"center","white","black",10);
	if(this.data.fuel>1000)
		this.cd.drawNumber(this.data.fuel,4,183,"center","white","black",147);
	else if(mod(Math.floor(clock/5),5)!=0){
		this.cd.drawNumber(this.data.fuel,4,183,"center","red","black",147);
		if(!this.flags.landed&&!this.flags.exploding&&!this.flags.showReady&&!this.flags.gameOver&&!this.data.fuel==0)
			this.data.soundStack.push({command:"PLAYTOEND",music:"alarm",volume:0.25})
	}
	if(this.player==2)
		this.cd.drawSingleActor("two",0,-195,132); 
	if(this.flags.showReady){
		this.cd.drawString("READY",24,-175,"center","red","black");
	}
}


game.prototype.gameOver=function(clock){
	if(this.players==1){
		this.data.soundStack.push({command:"STOPALL",music:""});
		this.data.soundStack = this.am.playStack(this.data.soundStack);
	}
	this.overlays(clock);
	this.cd.drawString("GAME OVER",24,-175,"center","red","black");
	if(!this.once[8]){
		this.once[8]=true;
		this.tGameover=clock;
	}
	if((clock-this.tGameover)/(1000/_TICK)>=1.5){
		this.once[8]=false;
		if(this.data.score>_USER.score)
			_USER.score=this.data.score;
		this.flags.gameOver=false;
		this.checkTopScores();
		this.overlays(clock);
		if(this.players==2)
			this.freezeScreen();
		this.lost=true;
	}
}



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



