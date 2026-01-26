// JavaScript Document

function players(leftPaddngs){
	this.platform={};
	this.platform["touchScreen"] = GlobalTouchScreen;
	this.players=1;
	this.games = [];
	this.playersJS=[4,4];
	this.canvasD = new CanvasDisplay(document.body,GlobalWidth,GlobalHeight,GlobalSpritesList,GlobalTouchScreen,"maincanvas",leftPaddngs);
	this.cl=new chaselight(this.canvasD,0,0,_WIDTH,_HEIGHT,_SCALE);
	this.js=new joystick();
	this.am = new audiomachine(this.platform,this.js);
	this.dh = new domHelpers(this.js);
	this.soundStack=[];
	this.actors=[];
	this.once = false;
	this.once1 = false;
	this.once2 = false;
	this.once3 = false;
	this.once4 = false;
	this.once5 = false;
	this.once6 = false;
	this.once7=false;
	this.data={
		step:[0,0,0,0],
		levelType:0
	};
	this.flags={};
	this.firstTime = true;
	this.readyToPlay = false;
	this.once = false;
	this.typeSound="";
	this.resize();
	this.choiceExit=0;
	this.playing=false;
	this.intro=true;
	this.clock=0;
}

players.prototype.testReload = function(){
	//this.canvasD.drawSingleSprite("donkeyKongFront");
	try{
		var testFloor = [-45,-52,-172,-92];
		for (var i=0;i<4;i++){
			var l = i+1;
			var floorFile = "level"+l.toString()+"FloorHeight";
   			var ladderFile = "level"+l.toString()+"LadderData";
   			var floorHeight = GlobalTextArrays[floorFile].array.slice(0);
   			var ladderData = GlobalTextArrays[ladderFile].array.slice(0);
			if(floorHeight[25]!=testFloor[i]){
				console.log("FLOOR DATA IS WRONG");
				throw("Reading Error");
			}
		}
		jogadores.chooseNumber();
	}catch(e){
		console.log("CAME AT READING ERROR",this.once);
		var str = "SORRY...RELOADING..."
		this.canvasD.drawString(str,new Vector(-90,-60),"orange","black",40);
		var wait2 = setInterval(function(){
			if(!this.once){
				this.once=true;
				}
			else{
				clearInterval(wait2);
				window.location.reload();
			}
		},1000);
	}
	if(GlobalSounds!="all")
		if(GlobalSounds=="none")
			this.typeSound = "NO SOUNDS   ";
		else if (GlobalSounds=="introduction")
			this.typeSound = "INTRO SOUNDS";
};

players.prototype.chooseNumber=function(){
	document.getElementById("wait").style.display="none";
	var p = this;
	p.dh.hold=false;
	var fadeScreen="donkeyKongFront";
	var initialScreen = "donkeykongTopScores";
	var clock=0;
	var interval = setInterval(function(){
		if(!p.canvasD.crossFaded){
			if(!p.once2){
				p.canvasD.crossfade(fadeScreen,initialScreen,1.5,1.2);
				p.once2=true;
			}
		}else{	
			p.canvasD.drawSingleSprite(initialScreen);
			p.cl.runChaseLight(clock);
			p.writeTopScores();
			if(!p.once6){	
				if(p.platform.touchScreen){
					p.dh.chose({wrapper:document.getElementById("wrapperCanvas"),scale:_SCALE,choices:["START"]});
				}else{
					p.dh.chose({wrapper:document.getElementById("wrapperCanvas"),scale:_SCALE});
				}
				p.once6=true;
			}
			p.dh.jsHandler();
			if(!p.dh.chosing){ 
				if(!p.am.loaded){
						p.dh.hold=true;
						p.canvasD.drawString("...LOADING SOUNDS...",new Vector(-55,-89),"red","black",24);
				}else{
						clearInterval(interval)
						p.players=p.dh.choice+1;
						if(p.players==2){
							p.dh.hold=false;
							p.choseJS();
							p.dh.removeChose();
						}else{
							p.dh.hold=false;
							p.start();
						}
					}
			}
		}
		clock++;
	},35);
};

players.prototype.start=function(){
	document.body.style.cursor="none";
	let elapsed=0;
	this.soundStack.push({command:"PLAY",music:"coin_credit"});
	this.soundStack = this.am.playStack(this.soundStack);
	var interval = setInterval(function(){
		if(this.am.checkEnded("coin_credit")){
			clearInterval(interval);
			this.cl.ind=0;
			//if(this.players==1)
			this.dh.removeChose();
			if(this.players==2)
				this.canvasD.removeCanvas("maincanvas");
			this.playing=true;
			if(this.players==1)
				GlobalStillPlaying[1]=false;
			for (var i=0;i<this.players;i++){
				var leftPaddngs=setWindow(this.platform,this.players,i);
				this.games.push(new game(this.players,i,this.canvasD,this.js,this.am,this.dh,this.playersJS[i],leftPaddngs));
				this.games[i].setLives();				
			}
			var clock=0;
			var interval2=setInterval(function(){
				for(var i=0;i<this.players;i++){
					this.games[i].introduction(clock);
				}
				clock++;
				if(!this.games[0].intro){
					if(this.players==1||(this.players==2&&!this.games[1].intro)){
						clearInterval(interval2);
						this.initialize();
					}
				}
			}.bind(this),130);
		}else{
			elapsed++;
			if(elapsed>10){
				this.canvasD.drawString("...BROWSER  NOT  ALLOWING  SOUNDS...",new Vector(-90,-89),"red","black",24);
			}
			if(elapsed>35){
				_SOUNDS=false;
			}
		}
	}.bind(this),100);
}



players.prototype.initialize=function(){
	var p = this;
	var interval = setInterval(function(){
		if(p.players==1){
			if(!p.games[0].finished){
				if(!_EXIT){
					p.games[0].playManager(p.clock);	
					p.clock++;
				}else
					p.confirmExit("RESUME","none");
			}else{
				clearInterval(interval);	
				p.finishAsk();
			}
		}else{
			if(p.games[0].finished&&p.games[1].finished){
				clearInterval(interval);
				this.finishAsk();
			}else if(_EXIT){
				if(p.games[0].flags.lost||p.games[1].flags.lost){
					var pos=(p.games[0].flags.lost)?"right":"left";
					p.confirmExit("RESUME",pos);
				}else
					_EXIT=false;
			}else if(!_EXIT){
				p.clock++;
				for(var i=0;i<2;i++){
					if(!p.games[i].flags.lost){
						p.games[i].playManager(this.clock);
					}
				}
			}
		}
		p.resizing=false;
	}.bind(this),35)
};


players.prototype.drawPlayer=function(player){
	this.canvasD.singleBGcolor("black");
	var str = "READY  PLAYER  "+player.toString();
	this.canvasD.drawString(str,new Vector(-70,-60),"red","black",40);
	var wait2 = setInterval(function(){
		if(!this.once)
			this.once=true;
		else{
			clearInterval(wait2);
			this.readyToPlay=true;
		}
	},1000);
};

//number,n,y,position,color,bgColor,delta)
//str,size,y,position,color,bgColor,strAdjust,direction,delta

players.prototype.writeTopScores=function(){
	for(var i=0;i<_TOPSCORES.length;i++){
		var player=_TOPSCORES[i];
		this.canvasD.drawNumber(player.score,6,1-i*16.2,"left","#0c70b0","black",88);
		this.canvasD.drawString(player.name,24,1-i*16.2,"left","#0c70b0","black",null,0,200);
	}
}


players.prototype.confirmExit=function(str2,pos){
	document.body.style.cursor="default";
	if(!pos||pos==""||pos==0||GlobalTouchScreen)
		pos="none";
	if(!this.once4){
		var leftPaddng=setWindow(this.platform,this.players);
		this.dh.chose({wrapper:document.getElementById("container"),scale:_SCALE,choices:["E X I T",str2],boxshadow:"0px 0px 1px 4px black",halfscreen:pos});
		this.once4=true;
		this.playing=false;
	}
	this.dh.jsHandler();
	if(!this.dh.chosing){
		this.dh.removeChose();
		if(this.dh.choice==0){
			this.js.gamepads=null;
			this.js.keyboard=null;
			this.js=null;
			this.am=null;
			window.location.pathname="/DMP/site/dmp.html";
		}
		else{
			this.playing=true;
			_EXIT=false;
			this.once4=false;
			document.body.style.cursor="none";
		}
	}
}

//name,costume,dY,opacity
players.prototype.finishAsk=function(){
	_COUNT++
	_EXIT=true;
	var clock=0;
	this.once5=false;
	_FREEZEIMAGELOADED=false;
	if(this.players==1){
		if(_COUNT>1)
			this.canvasD.spritesList["stage"].img.removeEventListener("load",_F)
		var currentImg=this.canvasD.canvas.toDataURL("image/png");
		this.canvasD.spritesList["stage"].sprite.src=currentImg;
		this.canvasD.spritesList["stage"].scale=false;
		this.canvasD.crossFaded=false;
		this.canvasD.spritesList["stage"].sprite.addEventListener("load",function(){
			_FREEZEIMAGELOADED=true;
		});
	}else{
		_FREEZEIMAGELOADED=true;
		this.canvasD.crossFaded=true;
		this.games[0].canvasD.removeCanvas("player1canvas");
		this.games[1].canvasD.removeCanvas("player2canvas");
		this.players=1;
		
		var leftPaddng=setWindow(this.platform,this.players);
		this.canvasD.resize(_WIDTH,_HEIGHT,leftPaddng);
		this.js.resize(_WIDTH,_HEIGHT);	
		
		this.canvasD.singleBGcolor("black");
		this.canvasD.canvas.style.display="block";
		this.playing=false;
	}
	var interval=setInterval(function(){
		if(!this.canvasD.crossFaded&&_FREEZEIMAGELOADED){
			if(!this.once5){
				this.canvasD.crossfade("stage","donkeykongTopScores",0.8,0.8)
				this.once5=true;
			}
		}else{
			this.canvasD.drawSingleSprite("donkeykongTopScores",1);
			this.writeTopScores();
			this.cl.runChaseLight(clock);
			this.confirmExit("PLAY AGAIN");
			if(!_EXIT){
				clearInterval(interval);
				if(this.platform.touchScreen){
					var container = document.getElementById("container")
					var wrapper = document.getElementById("wrapper");
					while (wrapper.firstChild) 
						wrapper.removeChild(wrapper.firstChild);
					container.removeChild(wrapper);
				}
				_REPLAY=true;
				jogadores=null;
				resetGlobalVariables();
				jogadores=new players();
				readTopScores();
				getSessionUser();
			}
		}
		clock++;
	}.bind(this),35);
}



players.prototype.resize=function(){
	window.addEventListener("resize",function(){
		if(!this.once3){
			this.once3=true;
			var once=false;
			var interval=setInterval(function(){
				if(!once){
					once=true;
				}else{
					_WIDTH=_GAMEWIDTH;
					_HEIGHT=_GAMEHEIGHT;
					var leftPaddng=setWindow(this.platform,this.players);
					this.canvasD.resize(_WIDTH,_HEIGHT,leftPaddng);
					this.js.resize(_WIDTH,_HEIGHT,leftPaddng);
					if(!this.playing){
						this.once[5]=false;
						this.cl.resize(_WIDTH,_HEIGHT,_SCALE);
						if(this.dh.chosing)
							this.dh.removeChose();
						if(GlobalTouchScreen)
							this.dh.chose({wrapper:document.getElementById("wrapperCanvas"),scale:_SCALE,choices:["START"],halfscreen:"none"});
						else if(!_CHOSEJS)
							this.dh.chose({wrapper:document.getElementById("container"),scale:_SCALE});
					}
					this.once3=false;
					clearInterval(interval)
				}
			}.bind(this),200);
		}
	}.bind(this));
}

//number,n,pos,color
//str,pos,color,bgColor,size
players.prototype.writeTopScores=function(){
	for(var i=0;i<_TOPSCORES.length;i++){
		var player=_TOPSCORES[i];
		this.canvasD.writeNumber(player.score,6,new Vector(5,10.5+2.04*i),"#0c70b0");
		this.canvasD.drawString(player.name,new Vector(-12,-12-i*16.3),"#0c70b0","black",24);
	}
}


players.prototype.choseJS=function(){
	_CHOSEJS=true;
	let player1js=-1;
	let player2js=-1;
	let center={0:true,1:true,2:true,3:true};
	let done=false;
	
	var handler=function(){
		this.js.readJoystick();	
		if(this.js.jUsed!=null){		
			if(this.js.left){
				if(this.js.jUsed==player2js){
					center[this.js.jUsed]=true;
					player2js=-1;
				}else{
					if(center[this.js.jUsed]&&(player1js==-1)){
						player1js=this.js.jUsed;
						center[this.js.jUsed]=false;
					}
				}
			}
			if(this.js.right){
				if(this.js.jUsed==player1js){
					center[this.js.jUsed]=true;
					player1js=-1;
				}else{
					if(center[this.js.jUsed]&&(player2js==-1)){
						player2js=this.js.jUsed;
						center[this.js.jUsed]=false;
					}
				}
			}
		}
		if(player1js!=-1&&player2js!=-1){
			if(!this.once7){
				this.once7=true;
				_CHOSE=false;
			}
			this.playersJS=[player1js,player2js];
			if(!this.dh.chosing&&!done)
				this.dh.chose({wrapper:document.getElementById("container"),scale:_SCALE,choices:["START"],top:0.515,boxshadow:"0px 0px 1px 2px black"});
			else if(this.js.fire){
				//this.dh.removeChose();
				done=true;
				_CHOSEJS=false;
				this.start();
			}
			if(this.dh.chosing)
				this.dh.jsHandler();
			if(_CHOSE){
				done=true;
				_CHOSEJS=false;
				this.start();
			}
			
		}else if(this.dh.chosing)
			this.dh.removeChose();
		let _this=this;
		drawDevices(_this,player1js,player2js);
		if(!done)
			setTimeout(handler.bind(this),177);
	}
	
	//canvasdisplay.prototype.drawSingleActor = function(name,costume,x,y){
	drawDevices=function(_this,player1js,player2js){
		_this.canvasD.drawSingleSprite("spriteKbs",1);
		if(player1js!=-1)
			_this.canvasD.drawSingleActor("spriteDevices",player1js,-78,30);
		if(player2js!=-1)
			_this.canvasD.drawSingleActor("spriteDevices",player2js,80,30);
		for(let key in center){
			if(center.hasOwnProperty(key))
				if(center[key])
					_this.canvasD.drawSingleActor("spriteDevices",key,0,30-key*60);
		}
	}
	
	
	setTimeout(handler.bind(this),97);
			
}
