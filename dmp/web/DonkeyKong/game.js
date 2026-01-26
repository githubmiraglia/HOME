// JavaScript Document
function game(players,player,canvas,joystick,audioMachine,dh,jUsed,leftPaddngs){
	this.players=players;
	let auxplayer=player+1;
	this.jUsed=jUsed;
	if(players==2)
		this.canvasD=new CanvasDisplay(document.body,GlobalWidth,GlobalHeight,GlobalSpritesList,GlobalTouchScreen,"player"+auxplayer+"canvas",leftPaddngs);
	else
		this.canvasD = canvas; //new CanvasDisplay(document.body,449,514,GlobalSpritesList);
	this.js=joystick;
	this.am=audioMachine;
	this.dh=dh;
    this.flags = {
        levelComplete:false,
        lifeLost:false,
        hammerStrike:false,
        displayJumpBonus:false,
        checkRivet:false,
		checkRivet:false,
        kongDeathHideSprites:false,
        gotHammer:false,
        hammerUp:false,
        hammerStrike:false,
        countObjects:false,
        reachedPrincess:false,
        princessRescued:false,
        rescuedPrincess:false,
        resetActorsflags:false,
        newBarrel:false,
        fallingSequence:false,
        princessCarried:false,
        princessKidnapped:true,
        createFire:false,
        playerLosesLife:false,
        oilCreatingFlame:false,
		help:false,
		runBonusPoints:false,
		processConveyor:false,
		keyboardPressed:false,
		gamepadsConnected:false,
		justLanded:false
    };
    this.data = {
        level:0,
        stage:1,
        lives:0,
        score:0,
		fireCounter:0,
        hiscore:(_TOPSCORES[0]==undefined)?0:_TOPSCORES[0].score,
        levelTypeIndex:1,
        levelType:0,
        difficultyLevel:1,
        bonus:4000,
        step:[0,0,0,0],
        bgCostume:0,
        floorHeight:[],
        ladderData:[],
        soundTrack:[],
        collision:[],
        jumpObjectCount:0,
        BarrelActionType:"",
        BarrelType:1,
        FireCount:0,
        marioPos: new Vector(0,0),
        marioDirection:0,
		princessDirection:0,
		princessPos:0,
        elevatorCounter:0,
        kongPos: new Vector(0,0),
		firePos:[new Vector(0,0)],
        hammerPos:[new Vector(0,0)],
		conveyorDirection:[1,1],
		counterConcrete:60,
		player:player,
		rivetCount:0
    };
	this.intro=true;
	this.readWrong = false;
	this.clock1 = new clockCycle();
    this.time = 0;
    this.actors=[];
	this.once = [false,false,false,false,false,false,false,false,false,false,false,false,false];
	this.player = player; 
	this.finished=false;
	this.choiceExit=0;
	this.resumePlayLooping=false;
	this.isPlaying=false;
	this.audioReady=false;
	this.plyPart=1;
	this.bgCostume=0;
	this.startclock=0;
};



//calls of functions in JS are asynchronous. Need to break game loop into functions with to make it synchronous. There may be a more intelligent way, but fed-up trying...
game.prototype.setLives =function(){
    	this.data.level = 1;
    	this.data.lives = 3 + 2 - this.data.difficultyLevel;
};

game.prototype.playPart1 = function(){
    this.flags.levelComplete = false;
    this.flags.lost = false;
    this.data.bonus = this.calcBonus(this.data.level,this.data.difficultyLevel);	
	this.howHigh(this.data.stage);
	//this.playPart2();
};

game.prototype.playPart2 = function(clock){
    this.data.lives--;
    this.data.levelType = GlobalTextArrays["levelType"].array[this.data.levelTypeIndex-1];
    this.resetFlags();
	if(!this.readWrong){
    	this.data.bgCostume = GlobalTextArrays["backdropName"].array[this.data.levelType-1];
		this.plyPart=3;
	}else{
		this.canvasD.drawSingleSprite("spriteStage");
		this.canvasD.drawGameOver();
		GlobalStillPlaying[0]=false;
		GlobalStillPlaying[1]=false;
		window.location.reload();
	}
};

game.prototype.playPart3 = function(){
		if(this.data.lives==0&&this.flags.lifeLost){
			this.flags.lost = true;
		}
        if (!this.flags.lost){
            if(!this.flags.lifeLost){
                this.data.lives++;
                this.data.levelTypeIndex++;
                if(this.data.liveTypeIndex>GlobalTextArrays["levelType"].array.length-1)
                    this.data.liveTypeIndex -=6;
                this.data.stage++;
                if ((this.data.level>4 && this.data.stage>6) || (this.data.level<5 && this.data.stage>this.data.level+1)){
                    this.data.level++;
                    this.data.stage = 1;
                }
				GlobalFinishedLevel[this.player]=true;
				this.plyPart=1;
				this.isPlaying=false;
            }else{
				GlobalFinishedLevel[this.player]=true;
				GlobalLostLive = true;
				this.plyPart=1;
				this.isPlaying=false;
        	}
		}else{
            this.canvasD.drawGameOver();
			var g = this;
			if(g.player==0){
				this.checkTopScores();
			}
			var finter = setInterval(function(){
				if(!g.finished){
					g.finished=true;
				}
				else{
					clearInterval(finter);
				    GlobalFinishedLevel[g.player]=true;
					GlobalStillPlaying[g.player]=false;
					g.isPlaying=false;
					
				}
			},1000);
		}
};   
    
game.prototype.playManager=function(clock){
	if(this.plyPart==1&&!this.once[12]){
		this.once[12]=true;
		this.playPart1();
	}else if(this.plyPart==2){
		this.playPart2();
		this.once[12]=false;
	}else if(this.plyPart==3)
		this.runLevels(clock);
	else if(this.plyPart==4)
		this.playPart3();
}


game.prototype.runLevels=function(clock){	
	
	var game=this;
	
	if(!this.isPlaying){
		
	if(this.data.levelType==1)
    	this.actors.push(new barrelStack("spriteBarrelStack",0, new Vector(-102,9),new Vector(0,0),0,false));
	if(this.data.levelType==2){
		this.setConveyor();
		this.setLadder();
	}
	if(this.data.levelType==1)
    	this.actors.push(new kong("spriteKong",3,new Vector(-68,8), new Vector(0,0),0,false));
	else if(this.data.levelType==2||this.data.levelType==3)
		this.actors.push(new kong("spriteKong",3,new Vector(-68,4), new Vector(0,0),0,false));
	else
		this.actors.push(new kong("spriteKong",3,new Vector(0,4), new Vector(0,0),0,false));
	this.setFire();
		if(this.data.levelType==4)
        this.actors.push(new princess("spritePrincess",0,new Vector(0,39),new Vector(0,0),0,false));
	else 
		this.actors.push(new princess("spritePrincess",0,new Vector(-14,31),new Vector(0,0),0,false));
    if(this.data.levelType==3)
		this.actors.push(new mario("spriteMario",0,new Vector(-104,-148),new Vector(0,0), 0,true,this.js));
	else 
    	this.actors.push(new mario("spriteMario",0,new Vector(-64,-164),new Vector(0,0), 0,true,this.js));
	this.setHammers();
	if(this.data.levelType==1)
	   this.actors.push(new oil("spriteOil",0,new Vector(-89,-156),new Vector(0,0),0,false));
	else if(this.data.levelType==2)
		this.actors.push(new oil("spriteOil",0,new Vector(0,-52),new Vector(0,0),0,false));
	this.actors.push(new help("spriteHelp",4,new Vector(8,40),new Vector(0,0),0,false));
	this.actors.push(new heart("spriteHeart",2,new Vector(8,40),new Vector(0,0),0,false));
	
	if(this.data.levelType==4)
		this.setRivet();
	if(this.data.levelType==3)
		this.setElevator();
    if(this.data.levelType==2||this.data.levelType==4)
        this.setBelongings(); 
		
    game.canvasD.drawActors(game.data.bgCostume,game.actors);
	if(game.player==1)
      		game.canvasD.drawTwo();
	game.data.soundTrack.push({command:"PLAY LOOPING",music:"bacmusic"});
	if(GlobalSounds=="all")
		game.data.soundTrack = game.am.playStack(game.data.soundTrack);
	
	game.startclock=clock;		
	game.isPlaying=true;
		
	}
   // var clockLevel1 =setInterval(function(){
		//if(!_EXIT){
		
		if(game.flags.levelComplete || game.flags.lifeLost || game.flags.lost)
           game.plyPart=4;
        else{
		
		 game.data.step[0]=clock-game.startclock;	
		
		 game.js.readJoystick(game.jUsed);
		 if(game.player==1)
      		game.canvasD.drawTwo();
			 
        game.actors.forEach(function(actor){
			var arr = actor.act(game.data,game.flags);
            game.data = arr[0];
			game.flags = arr[1]; 
        });
		
         if(game.flags.newBarrel){
            game.actors.push(new barrel("spriteBarrel",0,new Vector(-68,1),new Vector(0,0), 0, false,game.data.BarrelType,game.data.BarrelActionType));
            game.flags.newBarrel=false;
        }
		
		game.setFire();
		game.setGirder();
		game.setConcrete();
        if(game.flags.createFire&&!game.flags.reachedPrincess&!game.flags.princessRescued&&!game.flags.playerLosesLife&&!game.flags.fallingSeuqence){
            for(var i=0; i<game.data.firePos.length; i++){
                var x = game.data.firePos[i].x;
                var y = game.data.firePos[i].y;
				if(game.data.levelType!=4){
                	game.actors.push(new fire("spriteFire",0,new Vector(x,y),new Vector(0,0),0,false,false));
				}
				else
					game.actors.push(new fire("spriteFire",0,new Vector(-500,0),new Vector(0,0),0,false,false));
			}
			game.flags.createFire=false;
			if((game.data.levelType==1)||(game.data.levelType==2))
              game.flags.oilCreatingFlame=true;
        }
		
		if(game.flags.displayJumpBonus){
			game.actors.push(new bonusPoints("spriteBonus",0,new Vector(game.data.marioPos.x,game.data.marioPos-12),new Vector(0,0),0,false));
			game.flags.displayJumpBonus=false;
			game.flags.runBonusPoints = true;
		}
     
		
		/*if(!GlobalTouchScreen)
			game.data.gpressed = game.trackGamePads(game.gamePads);
		game.data.vpressed = game.trackVirtualJoystick(game.vJoystick,game.vFire);*/
		
        game.actors.forEach(function(actor){
			if(actor.deleteThisActor){
				actor=null;
				delete actor;
			}
		});
		
		game.actors = game.actors.filter(function(actor){
           return !actor.deleteThisActor; 
        });
		
		if(game.resumePlayLooping){
			game.data.soundTrack.push({command:"PLAY LOOPING",music:"bacmusic"});
			game.resumePlayLooping=false;
		}
			
			
		if(GlobalSounds=="all")
		  game.data.soundTrack = game.am.playStack(game.data.soundTrack);
		
		
        if(!(game.flags.levelComplete || game.flags.lost || game.flags.lifeLost)){
            game.canvasD.drawActors(game.data.bgCostume,game.actors);
			game.canvasD.drawLives(game.data.lives);
        	game.drawValues();
        }
     
		}
			
		//}else{
		//	game.data.soundTrack.push({command:"STOP",music:"bacmusic"});
		//	game.data.soundTrack = game.am.playStack(game.data.soundTrack);
		//	game.resumePlayLooping=true;
		//	game.confirmExit("RESUME");
		//}
		
		if(_USER.name&&_USER.name!=""&&game.data.score>_USER.score)
			_USER.score=game.data.score;
		
  //  },(GlobalTouchScreen)?35:35);
      
};

game.prototype.confirmExit=function(str2){
	if(!this.once[8]){		
		this.dh.chose({wrapper:document.getElementById("wrapperCanvas"),scale:_SCALE,choices:["E X I T",str2]});
		this.once[8]=true;
	}
	this.dh.jsHandler();
	if(!this.dh.chosing){
		this.dh.removeChose();
		if(this.dh.choice==0){
			this.js.gamepads=null;
			this.js.keyboard=null;
			this.js=null;
			this.am=null;
			window.location.pathname="/DMP/SITE/dmp.html";
		}
		else{
			_EXIT=false;
			this.once[8]=false;
		}
	}
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
		updateTopScores();
}


game.prototype.introduction = function(clock){
	
	let p = this;
	
	if(!this.once[11]){
		this.once[11]=true;
	var posLadder1 = new Vector(4,-164), posLadder2 = new Vector(20,-164);
	var l1x = posLadder1.x, l1y = posLadder1.y, l2x = posLadder2.x, l2y = l1y;
	for (var i=0; i<19; i++){
		var ladderCostume = (i==0)?1:0;
		this.actors.push(new actor("spriteIntroLadder",ladderCostume,new Vector(l1x,l1y),new Vector(0,0),0,false));
		this.actors.push(new actor("spriteIntroLadder",ladderCostume,new Vector(l2x,l2y),new Vector(0,0),0,false));
		l1y +=8;
		l2y +=8;
	}
	this.actors.push(new kong("spriteKong",9,new Vector(16,-151),new Vector(0,0), 0, false));
	this.actors.push(new princess("spritePrincess",3,new Vector(28,-151),new Vector(0,0), 0, false));	
	
	this.canvasD.drawActors(0,this.actors);
	
	var bgCostume = 0;
		
	if(GlobalSounds!="none"){
		p.data.soundTrack.push({command:"PLAY",music:"intro1_long"});
		p.data.soundTrack=p.am.playStack(p.data.soundTrack);
		p.audioReady=true;
	}else
		p.audioReady=true;
	}
	//var clockIntro = setInterval(function(){
		if(p.audioReady){

			var len = p.actors.length;
       
			p.actors.forEach(function(actor){
				actor.act(p.data,p.flags);
			});
			if (p.data.step[0]%2 == 1 && p.data.step[0]>4 && p.data.step[0]<30)
				p.actors = p.actors.slice(2,len);
			if (p.data.step[0] > 91){
				p.once[10]=false;
				//clearInterval(clockIntro);
				//p.initialize();
				p.intro=false;
            }

			if (p.data.step[0] == 42){
			 	p.bgCostume = 1;
				var princ = p.actors[len-1];
				var kon = p.actors[len-2];
				p.actors[len-1]=kon;
				p.actors[len-2]=princ;
				
			}
			else if(p.data.step[0]>42 && p.data.step[0]<71){
				p.bgCostume = Math.floor(Math.max(p.data.step[0]-44,0)/5)+1;
			}
            
            if (p.data.step[0]<92){
			 p.data.step[0]++;
			 p.data.step[1]=p.data.step[1]+p.data.step[0]%2;
			 p.data.step[2]+=(p.data.step[0]%3==0)?1:0;
			 p.canvasD.drawActors(p.bgCostume,p.actors);
            }
		}
	//},(GlobalTouchScreen)?126:126);
     
};






