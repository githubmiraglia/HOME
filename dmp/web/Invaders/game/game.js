// JavaScript Document
let abc=false;
let def=false;

function game(platform,players,player,js,am,cd,sv,jUsed,leftPaddngs,spriteList,createStringWidth){
	this.players=players;
	this.player = player;
	this.platform=platform;
	this.js = js;
	this.am = am;
	this.sv = sv;
	this.jUsed=jUsed;
	this.online=true;
	if(this.players==2)
		this.cd = new canvasdisplay(this.platform,leftPaddngs,"player"+this.player+"canvas",spriteList,createStringWidth);
	else
		this.cd=cd;
	this.actors=[];
	this.flags ={
		bulletSplat:false,
		bombSplat:false,
		checkcollisions:false,
		destroybase:false,
		firebullet:false,
		flashscore:false,
		gameover:false,
		initialisegame:false,
		initialiseonce:false,
		initialiseshields:false,
		initializeWave:false,
		landed:false,
		newbomb:false,
		pausedForPlayerExplosion:false,
		removebullet:false,
		render:false,
		renderscore:false,
		resumeafterbaseexplosion:false,
		startsaucerfx:false,
		stopsaucerfx:false,
		showready:true,
		updatebombs:true,
		updatebullet:false,
		updateeveryinvader:false,
		updateplayer:false,
		waittoplay:false,
		nextLevel:false,
		updateEveryAlien:false,
		initialized:false
	};
	this.data={
		hiScore:(_TOPSCORES[0]==undefined)?0:_TOPSCORES[0].score,
		soundStack:[],
		direction:8,
		invaderCount:55,
		landed:false,
		lives:3,
		completewave:1,
		newTurn:false,
		score:0,
		turn:0,
		bX:-140,
		bY:-170,
		bulletX:-140,
		bulletY:-170,
		bulletSplatX:0,
		bulletSplatY:0,
		alienSplatX:[],
		alienSplatY:[],
		bombSplatX:[],
		bombSplatY:[],
		dropsToLand:10,
		nextMoveTime:0,
		newBombX:[],
		newBombY:[],
		level:1
	};
	this.tclock=0;
	this.lost=false;
	this.ret=[];
	this.createActors();
	this.once=[false,false,false,false,false,false,false,false,false,false,false];
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

game.prototype.play = function(clock){
	if(!this.lost&&!this.flags.showready){
		this.cd.drawBackground("board",0);
		this.cd.drawActors(this.actors,shield);
		this.cd.drawActors(this.actors,splat);
		if(!this.flags.nextLevel&&!this.flags.gameover){
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
			this.cd.drawActors(this.actors,"",shield);
			if(this.data.invaderCount<=0)
				this.flags.nextLevel=true;
			this.checkSplat(clock);
			this.checkBomb(clock);
		//	this.checkExtralife();
			this.data.soundStack = this.am.playStack(this.data.soundStack);
			this.overlays(clock);
			if(this.data.score>this.data.hiScore)
				this.data.hiScore=this.data.score
		}else if(this.flags.nextLevel&&!this.flags.gameover){
			this.resetLevel(clock);
		}else if(this.flags.gameover){
			this.gameOver(clock);
		}
	}else if(this.flags.showready){
		if(!this.once[7]){
			this.tclock=clock
			this.once[7]=true;
		}else{
			if((clock-this.tclock)/(1000/_TICK)<=1.5){
				this.overlays(clock);
			}else{
				this.flags.showready=false;
				this.once[7]=false;
			}
		}
	}
}

game.prototype.checkExtralife=function(){

}


game.prototype.resetLevel=function(clock){
	if(!this.once[7]){
		this.once[7]=true;
		this.tclock=clock;
		this.data.level++;
	}else if((clock-this.tclock)/(1000/_TICK)>=1.5){
			this.once=[false,false,false,false,false,false,false,false,false,false];
			this.data.invaderCount=55;
			this.flags.initializeWave=true;
			this.data.landed=false;
			this.data.nextMoveTime=clock;
			this.actors.forEach(function(actor){
			actor.once=[false,false,false,false,false,false,false,false,false,false,false];
			if(actor instanceof base){
				actor.exploding=false;
				actor.explosionCount=80;
				actor.x=-140;
				actor.costume=0;
			}
			if(actor instanceof shield){
				this.spawnShields(false,actor)
			}
			if(actor instanceof bullet){
				actor.firing="f";
				actor.show=false;
				actor.y=-170;
			}
			if(actor instanceof alien){
				if(actor.isClone){
					actor.x=-180+(mod(actor.cloneId-1,11)*30);
					actor.y=this.data.bY+((this.data.dropsToLand-1)*12)+(4*24)-Math.floor((actor.cloneId-1)/11)*24;
					actor.costume=Math.floor((actor.cloneId-1+11)/22)*2
					actor.show=true;
					actor.active=true;
					actor.exploding=false;
					actor.explodingCount=4;
				}
			}
			if(actor instanceof saucer){
				actor.resetSaucer(clock);
			}
		}.bind(this));
		this.actors = this.actors.filter(function(actor){
			return !(actor instanceof splat) 
		});
		this.actors = this.actors.filter(function(actor){
			return !(actor instanceof bomb) 
		});
		this.flags.firebullet=false;
		this.flags.showready=true;
		this.flags.nextLevel=false;
		this.once[7]=false;
	}else{
		this.overlays(clock);
	}	
}

game.prototype.spawnShields=function(newShield,shld){
	if(newShield){
		for(let i=0; i<4; i++){
			this.actors.push(new shield("shield",0,-140+i*93,-146,0,0,0,false,true));
		}
	}else{
		if(this.data.completewave<3){
			if(this.data.completewave<2)
				shld.costume=0;
			else
				shld.costume=1;
		}else{
			shld.costume=2;
		}
	}
}



game.prototype.createActors=function(){
	this.actors.push(new splat("splat",2,-180,-180,0,0,0,false,false));
	this.spawnShields(true);
	this.actors.push(new bullet("bullet",0,-140,-170,0,0,0,false,false,this.cd.cx)); 
	this.actors.push(new alien("aliens",0,0,0,0,0,0,false,false,false,0));
	for(let i=0; i<55;i++){
		let ac=Math.floor((i+11)/22)*2
		let ax=-180+(mod(i,11)*30);
		let ay=-170+((this.data.dropsToLand-1)*12)+(4*24)-Math.floor(i/11)*24;
		this.actors.push(new alien("aliens",ac,ax,ay,0,0,0,false,true,true,i+1));
	}
	this.flags.initializeWave=true;
	this.actors.push(new base("base",0,-140,-170,0,0,0,false,true,this.js,this.jUsed))
	this.actors.push(new saucer("saucer",0,0,45,0,0,0,false,true));
}			 

game.prototype.checkSplat=function(clock){
	if(this.flags.bulletSplat){
		this.flags.bulletSplat=false;
		this.actors.splice(5,0,new splat("splat",0,this.data.bulletSplatX,this.data.bulletSplatY,0,0,0,false,true));
	}
	if(this.flags.alienSplat){
		let blackSplats=this.actors.filter(function(actor){return(actor instanceof splat && actor.costume==2)});
		for(let i=0; i<this.data.alienSplatX.length;i++){
			let newBlackSplat=true;
			let sx=this.data.alienSplatX[i];
			let sy=this.data.alienSplatY[i];
			blackSplats.forEach(function(bsplat){
				let ax=bsplat.x;
				let ay=bsplat.y;
				if(checkCollision(ax,ay,this.data.alienSplatX[i],this.data.alienSplatY[i],6)){
					newBlackSplat=false;
				}
			}.bind(this));
			if(newBlackSplat){
				console.log(this.actors[5]);
				this.actors.splice(5,0,new splat("splat",2,this.data.alienSplatX[i],this.data.alienSplatY[i],0,0,0,false,true));
			}
		}
		this.flags.alienSplat=false;
	}
	if(this.flags.bombSplat){
		for(let i=0;i<this.data.bombSplatX.length;i++){
			let x=this.data.bombSplatX[i];
			let y=this.data.bombSplatY[i];
			this.actors.splice(5,0,new splat("splat",1,x,y,0,0,0,false,true));
		}
		this.data.bombSplatX=[];
		this.data.bombSplatY=[];
	}
}


game.prototype.checkBomb=function(){
	if(this.flags.newbomb){
		this.flags.newbomb=false;
		for(let i=0;i<this.data.newBombX.length;i++){
			let x=this.data.newBombX[i];
			let y=this.data.newBombY[i];
			this.actors.splice(this.actors.length-58,0,new bomb("bomb",0,x,y,0,0,0,false,true,this.cd.cx));
		}
		this.data.newBombX=[];
		this.data.newBombY=[];
	}
}

game.prototype.overlays=function(clock){
	for(let i=0;i<this.data.lives-1;i++){
		this.cd.drawSingleActor("life",0,-180+i*30,-195);
	}
	this.cd.drawNumber(this.data.score,6,183,"left","white","black",30);
	this.cd.drawNumber(this.data.hiScore,6,183,"center","white","black",10);
	if(this.player==2)
		this.cd.drawSingleActor("two",0,-195,132); 
	if(this.flags.showready){
		this.cd.drawSingleBG("board",0,0,1);
		if(this.player==2)
			this.cd.drawSingleActor("two",0,-195,132); 
		for(let i=0;i<this.data.lives-1;i++){
			this.cd.drawSingleActor("life",0,-180+i*30,-195);
		}
		this.cd.drawActors(this.actors);
		this.cd.drawNumber(this.data.score,6,183,"left","white","black",30);
		this.cd.drawNumber(this.data.hiScore,6,183,"center","white","black",10);
		this.cd.drawString("READY",24,-175,"center","red","black");
	}
	if(this.flags.nextLevel){
		this.cd.drawActors(this.actors);
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
	let cont=0;
	if(navigator.onLine){
		_TOPSCORES.forEach(function(ts){
			cont++;
			let s="'"+cont.toString()+"'";
			let q={query:"UPDATE",table:"topscores",name:ts.name,score:ts.score,where:"gameId='4' AND scoreRanking="+s};
			this.sv.promiseToGet("POST",q).then(function(result){
				if(result instanceof Error||result=="")
					alert("Error, could not update top scores");
			});
		}.bind(this));
	}
}


