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
		next:false,
		play:false,
		minus66:false,
		minus90:false,
		change:false,
		chomp:false,
		die:false,
		highscores:false,
		intermission:false,
		intermissionEnded:false,
		mainmenu:false,
		start:false,
		power:false,
		lost:false,
		intro:true,
		restart:false,
		gameOver:false
	};
	this.data={
		hiScore:(_TOPSCORES[0]==undefined)?0:_TOPSCORES[0].score,
		soundStack:[],
		game:"Play",
		pmX:0,
		pmY:-68,
		blX:0,
		blY:0,
		pmDirection:1,
		pellet:0,
		pellets:244,
		score:0,
		power:0,
		timer:0,
		count:0,
		blink:2,
		open:0,
		openchange:1,
		turn:false,
		multiplier:1.2,
		level:1,
		grid:[],
		ghostvalues:[200,400,800,1600],
		fruitValues:[100,300,500,500,700,700,1000,1000,2000,2000,3000,3000],
		mode:"Scatter",
		volume:1,
		wiggle:0,
		lives:3,
		extralives:0,
		intermission:1,	
		chomp:2,
		leave:0,
		backsetback:0,
		backvar3:0,
		ghostStatus:[0,0,0,0],
		once:[false,false,false,false,false,false,false,false,false],
		alreadyDied:[false,false,false,false]
	};
	this.pm={};
	this.ready=false
	this.lost=false;
	this.ret=[];
	this.createActors();
	this.readGrid();
	this.once=[false,false,false,false,false,false,false,false,false,false,false];
	this.dieOnce=[false,false,false,false,false,false,false,false,false];
	this.tDie=[false,false,false,false,false,false,false,false,false];
	this.dieShow=true;
	this.dieCostume=0;
	this.dieCount=0;
	this.modeblockdone=true;
	this.modeblockcurrent=0;
	this.t=0;
	this.tAlarm=0;
	this.tNext=[0,0,0,0];
	this.tbacksound=0;
	this.tIntro=0;
	this.tGameover=0;
	this.boardCostume=0;
	this.aux=0;
	this.elapsed=0;
}

game.prototype.readGrid=function(){
	getText("grid",_ROOT+"/txtdata/Grid.txt");
	this.check = ["grid"];
	var interval = setInterval(function(){
		if(checkLoaded(this.check)){
			this.data.grid = _RETURNTEXT["grid"];
			this.ready=true;
			clearInterval(interval);
		}
	}.bind(this));
}

game.prototype.setmode=function(clock){
	if(!this.once[0]){
		this.once[0]=true;
		this.data.pellet=0;
		this.data.power=0;
		this.data.blink=2;
		this.data.chomp=2;
		this.data.leave=0;
		this.data.backsetback=0;
		this.backvar3=0;
		this.modeblockdone=true;
		this.modeblockcurrent=0;
		this.mode="Scatter";
	}
	if(this.modeblockdone){
		if(this.modeblockcurrent==0){
			if(this.data.level<5)
				this.modeblock(clock,7,"Follow");
			else 
				this.modeblock(clock,5,"Follow");
		}
		if(this.modeblockcurrent==1)
			this.modeblock(clock,20,"Scatter");
		if(this.modeblockcurrent==2){
			if(this.data.level<5)
				this.modeblock(clock,7,"Follow");
			else
				this.modeblock(clock,5,"Follow");
		}
		if(this.modeblockcurrent==3)
			this.modeblock(clock,20,"Scatter");
		if(this.modeblockcurrent==4)
			this.modeblock(clock,5,"Follow");
		if(this.modeblockcurrent==5){
			if(this.data.level==1){
				this.modeblock(clock,20,"Scatter");
			}else{
				if(this.data.level<5)
					this.modeblock(clock,1033,"Scatter");
				else
					this.modeblock(clock,1037,"Scatter");
			}
		}
		if(this.modeblockcurrent==6){
			if(this.data.level==1)
				this.modeblock(clock,5,"Follow");
			else
				this.modeblock(clock,(1/60),"Follow");
		}
	}
}

game.prototype.modeblock=function(clock,n,s){
	if(this.data.game=="Play"||this.data.game=="Pause"){
		if(this.data.power<=0){
			if(!this.once[1]){
				this.once[1]=true;
				this.t=clock;
				this.data.backsetback=n;
			}
			if((clock-this.t)/(1000/_TICK)>=this.data.backsetback){
				this.once[1]=false
				this.flags.change=true;
				this.data.mode=s;
				this.modeblockcurrent++;
			}	
		}else if(this.once[1])
			this.data.backsetback=n-(clock-this.t)/(1000/_TICK);
	}
}
	
game.prototype.backsound=function(clock){
	if(this.data.game=="Play"&&this.data.power<=0){
		if(!this.once[2]){
			this.once[2]=true;
			this.tbacksound=clock;
			if(this.data.pellets<122&&this.players==1){
				this.data.soundStack.push({command:"PLAY",music:"background2"});
			}else if(this.players==1){
				this.data.soundStack.push({command:"PLAY",music:"background1"});
			}
		}
		if(this.data.pellets<122&&((clock-this.tbacksound)/(1000/_TICK))>=0.25)
		   this.once[2]=false;
		if(this.data.pellets>=122&&((clock-this.tbacksound)/(1000/_TICK))>=0.35)
			this.once[2]=false;
	}
}

game.prototype.chomp=function(){
	if(this.flags.chomp){
		this.data.chomp++;
		if(mod(this.data.chomp,2)==0){
			if(this.am.checkEnded("chomphigh")){
				this.data.soundStack.push({command:"PLAYTOEND",music:"chomplow",volume:0.25});
				this.flags.chomp=false;
			}else
				this.data.chomp++;
		}else{
			if(this.am.checkEnded("chomplow")){
				this.data.soundStack.push({command:"PLAYTOEND",music:"chomphigh",volume:0.25});
				this.flags.chomp=false;
			}else
				this.data.chomp++;
		}
	}
}
		
game.prototype.alarm=function(clock){
	if(this.data.power>0&&this.data.alreadyDied.includes(false)){
		if(this.data.ghostStatus.includes("Dead"))
			this.data.soundStack.push({command:"PLAYTOEND",music:"alarm",volume:1.0});
		else
			this.data.soundStack.push({command:"PLAYTOEND",music:"power",volume:1.0});
	}
}


game.prototype.introduction=function(clock){
	this.cd.drawString("READY !",24,-38,"center","yellow","black");
	if(this.flags.restart){
		if(!this.once[7]){
			this.once[7]=true;
			this.tIntro=clock;
		}
		if((clock-this.tIntro)/(1000/_TICK)>=1.5){
			this.flags.intro=false;
			this.once[7]=false;
			this.resetLevel();
		}
	}else{
		if(!this.once[7]){
			this.once[7]=true;
			this.data.soundStack.push({command:"PLAYTOEND",music:"intro"});
			this.data.soundStack = this.am.playStack(this.data.soundStack);
		}
		if(this.am.checkEnded("intro")){
			this.flags.intro=false;
		}
	}
}

game.prototype.gameOver=function(clock){
	if(this.players==1){
		this.data.soundStack.push({command:"STOPALL",music:""});
		this.data.soundStack = this.am.playStack(this.data.soundStack);
	}
	this.cd.drawString("GAME OVER",24,-38,"center","red","black");
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
	if(this.ready&&!this.lost){
		if(!this.flags.next||this.flags.intermission){
			if(!this.flags.intermission)
				this.cd.drawBackground("board",0);
			else
				this.cd.singleBGcolor("black");
			if(!this.flags.intro&&!this.flags.die&&!this.flags.gameOver){
				this.actors.forEach(function(actor){
					this.ret = actor.act(clock,this.flags,this.data);
					this.flags = this.ret[0];
					this.data = this.ret[1];
					if(actor.deleteThisActor){
						actor=null;
						delete actor;
					}
					if(this.flags.intermission){
						if((actor instanceof blinky)||(actor instanceof pacman)){
							if(!this.once[6]){ //big time hack, fed-up
								this.aux++;
								if(this.aux>1)
									this.once[6]=true;
								actor.x=5000;
							}
							actor.show=true;
						}else
							actor.show=false;
					}	
    			},this);
				this.actors = this.actors.filter(function(actor){
					return !actor.deleteThisActor; 
				});
			}
			this.cd.drawActors(this.actors);
			if(!this.flags.intermission&&!this.flags.intro&&!this.flags.die){
				this.checkExtralife();
				this.setmode(clock);
				this.backsound(clock);
				this.chomp();
				this.alarm();
				this.data.soundStack = this.am.playStack(this.data.soundStack);
			}
			if(this.flags.intermission)
				this.nextLevel(clock);
			if(this.flags.intro)
				this.introduction(clock);
			if(this.flags.die){
				this.dieSequence(clock);
			}
			if(this.flags.gameOver)
				this.gameOver(clock);
		}else{
			//this.actors.forEach(function(actor){
				//if((actor instanceof pacman)||(actor instanceof pellet))
					//actor.show=false;
			//});
			this.nextLevel(clock);
			this.cd.drawActors(this.actors);
		}
		if(!this.flags.intermission&&!this.lost){
			this.overlays(clock);
			this.processLives();
		}
	}
}

game.prototype.checkExtralife=function(){
	if(((this.data.score+1)/10000-1)>this.data.extralives){
		this.data.extralives++;
		this.data.soundStack.push({command:"PLAYTOEND",music:"extralife"});
	}
}


game.prototype.nextLevel=function(clock){
	if(!this.once[3]){
		this.once[3]=true;
		this.once[3]=true;
		this.tNext[0]=clock;
		this.boardCostume=0;
	}
	if(((clock-this.tNext[0])/(1000/_TICK))>=2&&this.boardCostume<8){
		if(!this.once[4]){
			this.once[4]=true;
			this.tNext[1]=clock;
		}
		if(((clock-this.tNext[1])/(1000/_TICK))>=0.17){
			this.once[4]=false;
			this.boardCostume++;
			this.cd.drawBackground("board",mod(this.boardCostume,2));
		}
	}else if(this.boardCostume>=8){
		if(!this.once[5]){
			this.once[5]=true;
			this.data.level++;
		}
		let l=this.data.level;
		if((l==3||l==6||l==10||(l>10&&mod(l,5)==0)&&!this.flags.intermissionEnded)){
			this.flags.intermission=true;
		}
		if(this.flags.intermission&&this.flags.intermissionEnded){
			this.boardCostume=0;
			this.flags.intermission=false;
			this.resetLevel();
		}
		if(!this.flags.intermission){
			this.flags.next=false;
			this.resetLevel();
		}
	}
}

game.prototype.resetLevel=function(){
	this.once=[false,false,false,false,false,false,false,false,false,false];
	this.data.ghostStatus=[0,0,0,0];
	this.data.once=[false,false,false,false,false,false,false];
	this.dieOnce=[false,false,false,false,false,false,false,false,false];
	this.tDie=[false,false,false,false,false,false,false,false,false];
	this.dieShow=true;
	this.data.alreadyDied=[false,false,false,false];
	this.data.pmX=0;
	this.data.pmY=-68;
	this.dieCount=0;
	this.elapsed=0;
	if(!this.flags.restart){
		this.data.pellets=244;
	}
	this.actors.forEach(function(actor){
		actor.once=[false,false,false,false,false,false,false,false,false,false,false];
		if(actor instanceof ghost){
			actor.show=true;
			actor.active=true;
		}
		if(actor instanceof blinky){
			actor.gx=0;
			actor.gy=28;
			actor.x=actor.gx*1.25;
			actor.y=actor.gy*1.25;
			actor.direction=1;
			actor.newdirection=1;
			actor.costume=0;
			actor.status="Alive";
		}else if(actor instanceof pinky){
			actor.gx=0;
			actor.gy=0;
			actor.x=actor.gx*1.25;
			actor.y=actor.gy*1.25;
			actor.direction=2;
			actor.newdirection=2;
			actor.costume=1
			actor.status="Home";
		}else if(actor instanceof inky){
			actor.gx=-16;
			actor.gy=8;
			actor.x=actor.gx*1.25;
			actor.y=actor.gy*1.25;
			actor.direction=3;
			actor.newdirection=3;
			actor.costume=2
			actor.status="Home";
			actor.escaped=false;
		}else if(actor instanceof clyde){
			actor.gx=16;
			actor.gy=8;
			actor.x=actor.gx*1.25;
			actor.y=actor.gy*1.25;
			actor.direction=1;
			actor.newdirection=1;
			actor.costume=0;
			actor.status="Home";
			actor.escaped=false;
		}else if(actor instanceof pacman){
			this.data.pmX=0;
			this.data.pmY=-68;
			actor.x=this.data.pmX*1.25;
			actor.y=this.data.pmY*1.25;
			actor.show=true;
			actor.active=true;
			actor.direction=1;
			actor.newdirection=1;
			actor.addCostume=0;
			actor.costume=0;
			actor.stuck=false;
			actor.ylistPos=0;
			actor.xlistPos=0;
			actor.var2=false;
			actor.speed=1.58;
			actor.turning=false;
		}else if(actor instanceof pellet){
			if(actor.isClone&&!this.flags.restart){
				actor.show=true;
				actor.active=true;
			}
		}else if(actor instanceof fruit){
			if(!actor.isClone){
				actor.active=false;
				actor.show=false;
				actor.once=[false,false,false,false,false,false];
				//actor.bfruitEaten=false;
				//actor.fruitAlreadyEaten=false;
				actor.frtTimer=0;
			}
		}
	},this);
	this.flags.next=false;
	this.intermissionEnded=false;
	this.aux=0;
	if(!this.flags.restart){
		this.flags.intro=true;
	}else
		this.flags.restart=false;
}


game.prototype.processLives = function(){
	for(let i=0;i<(this.data.lives+this.data.extralives-1);i++){
		this.cd.drawSingleActor("Life",0,-88*1.25+22*i,-136*1.25);
	}
}

game.prototype.createActors=function(){
	this.pelletsSpawnClones();
	this.actors.push(new fruit("fruits",0,0,0,0,0,0,false,true,this.am,0,-20,false));
	this.actors.push(new blinky("blinky",0,0,0,0,0,0,false,true,this.am));
	this.actors.push(new pinky("pinky",0,0,0,0,0,0,false,true,this.am));
	this.actors.push(new inky("inky",0,0,0,0,0,0,false,true,this.am));
	this.actors.push(new clyde("clyde",0,0,0,0,0,0,false,true,this.am));
	this.fruitsSpawnClones();
	this.pm=new pacman("pacman",0,0,-68,0,0,0,false,true,this.js,this.jUsed,this.am)
	this.actors.push(this.pm);
}			 


game.prototype.overlays=function(clock){
	this.cd.drawNumber(this.data.score,6,146,"left","white","black",10);
	this.cd.drawNumber(this.data.hiScore,6,146,"center","white","black",10);
	if(this.player==2)
		this.cd.drawSingleActor("two",0,-114,171); 
	if(this.flags.showReady)
		this.cd.drawString("READY",24,_K[5]-20.5*_K[6],"center","lightblue","black");
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

game.prototype.pelletsSpawnClones=function(){
	let x=-100;
	let y=108;
	let costume=0;
	for (let i=0;i<2;i++){
		for(let j=0;j<12;j++){
			this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
			x+=8;
		}
		x+=16;
	}
	x=-100; y=100;
	for(i=0;i<3;i++){
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=40;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=48;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=24;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=48;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=40;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x-=200; y-=8;
	}
	for(i=0;i<26;i++){
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=8;
	}
	x=-100; y=68;
	for(i=0;i<2;i++){
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=40;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=24;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=72;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=24;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=40;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x-=200; y-=8;
	}
	x=-100;
	for(i=0;i<6;i++){
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=8;
	}
	x+=16;
	for (i=0;i<2;i++){
		for(let j=0;j<4;j++){
			this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
			x+=8;
		}
		x+=16;
	}
	for(i=0;i<6;i++){
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=8;
	}
	x=-60; y=44;
	for(i=0;i<11;i++){
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=120;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x-=120;
		y-=8;
	}
	x=-100;
	for (i=0;i<2;i++){
		for(let j=0;j<12;j++){
			this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
			x+=8;
		}
		x+=16;
	}
	x=-100; y=-52
	for(i=0;i<2;i++){
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=40;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=48;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=24;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=48;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=40;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x-=200; y-=8;
	}
	for(i=0;i<3;i++){
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=8;
	}
	x+=16;
	for (i=0;i<2;i++){
		for(let j=0;j<7;j++){
			this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
			x+=8;
		}
		x+=16;
	}
	for(i=0;i<3;i++){
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=8;
	}
	x=-84; y=-76;
	for (i=0;i<2;i++){
		for(j=0;j<3;j++){
			this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
			x+=24;
		}
		x+=48; 
		for(j=0;j<3;j++){
			this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
			x+=24;
		}
		x=-84;y-=8;
	}
	x=-100;
	for(i=0;i<6;i++){
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=8;
	}
	x+=16;
	for (i=0;i<2;i++){
		for(let j=0;j<4;j++){
			this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
			x+=8;
		}
		x+=16;
	}
	for(i=0;i<6;i++){
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=8;
	}
	x=-100; y=-100;
	for(i=0;i<2;i++){
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=88;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=24;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=88;
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x-=200; y-=8;
	}
	x=-100;
	for(i=0;i<26;i++){
		this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,true,true));
		x+=8;
	}
	x=-80; y=0; costume=1;
	this.actors.push(new pellet("pellets",costume,x,y,0,0,0,0,false,false));
}


game.prototype.fruitsSpawnClones=function(){
	for(let i=0;i<7;i++)
		this.actors.push(new fruit("fruits",0,0,0,0,0,0,false,true,this.am,88-15*i,-136,true));
}


game.prototype.dieSequence=function(clock){
	let pm={};
	if(!this.dieOnce[0]){
		this.dieOnce[0]=true;
		this.tDie[0]=clock;
	}
	if((clock-this.tDie[0])/(1000/_TICK)>=1){
		if(!this.dieOnce[1]){
			this.dieOnce[1]=true;
			this.tDie[1]=clock;
			this.dieCount=0;
			this.actors.forEach(function(actor){
				if((actor instanceof fruit)||(actor instanceof ghost)||(actor instanceof pacman)){
					actor.show=false;
				}
			}.bind(this));
			this.data.soundStack.push({command:"PLAY",music:"death"});
			this.data.soundStack.push({command:"STOPALL",music:""});
			this.data.soundStack = this.am.playStack(this.data.soundStack);
			this.dieCostume=0;
		}
		if((clock-this.tDie[1])/(1000/_TICK)>=0.1){
			if(this.dieCount<10){
				if(!this.dieOnce[9]){
					this.dieOnce[9]=true;
					this.tDie[7]=clock;
				}
				if((clock-this.tDie[7])>=0.05){
					this.dieCostume++;
					this.dieCount++;
					this.dieOnce[9]=false;
					this.tDie[7]=0;
				}
			}else{
				if(!this.dieOnce[3]){
					this.dieOnce[3]=true
					this.tDie[2]=clock;
				}	
				if((clock-this.tDie[2])/(1000/_TICK)>=0.1){
					if(!this.dieOnce[4]){
						this.dieOnce[4]=true;
						this.dieShow=false;
						this.tDie[3]=clock;
					}
					if((clock-this.tDie[3])/(1000/_TICK)>=0.1){
						if(!this.dieOnce[5]){
							this.dieOnce[5]=true;
							this.dieShow=true;
							this.tDie[4]=clock;
						}	
						if((clock-this.tDie[4])/(1000/_TICK)>=0.1){
							if(!this.dieOnce[7]){
								this.dieOnce[7]=true;
								this.dieShow=false;
								this.tDie[5]=clock;
							}
							if((clock-this.tDie[5])/(1000/_TICK)>=0.5){
								if(!this.dieOnce[8]){
									this.dieOnce[8]=true;
									this.tDie[6]=clock;
									this.data.lives--;
								}
								if((this.data.lives+this.data.extralives)==0){
									this.flags.die=false;
									this.flags.gameOver=true;	
								}else{
									for(let i=0;i<10;i++){
										this.dieOnce[i]=false;
										this.tDie[i]=0;
									}
									this.flags.die=false;
									this.flags.restart=true;
									this.flags.intro=true;
									this.pm.direction=1;
									this.pm.newdirection=1;
									this.pm.pmX=0;
									this.pm.pmY=-68;
									this.pm.x=0;
									this.pm.y=this.pm.pmY*1.25;
									this.pm.costume=0;
									this.pm.show=true;
									this.pm.stuck=false;
									this.pm.ylistPos=0;
									this.pm.xlistPos=0;
									this.pm.var2=false;
									this.pm.speed=1.58;
									this.pm.turning=false;
									this.once[7]=false;
								}
							}
						}									
					}
				}
			}
		}
		if(this.dieShow)
			this.cd.drawSingleActor("death",this.dieCostume,this.data.pmX*1.25,this.data.pmY*1.25);
	}
}

