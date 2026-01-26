// JavaScript Document

function players(platform,leftPaddngs){
	this.players=1;
	this.platform = platform;
	this.leftPaddngs=leftPaddngs;
	this.cd=new canvasdisplay(platform,leftPaddngs,"maincanvas",null,true);
	this.am={};
	this.js={};
	this.dh={};
	this.topScores=[];
	this.sv=new server();
	this.se=new sessionForUser();
	this.cl=new chaselight(this.cd,0,0,_WIDTH,_HEIGHT,_SCALE);
	this.once = [false,false,false,false,false,false,false,false,false,false,false,false,false,false];
	this.soundStack = [];
	this.loaded = false;
	this.playing=0;
	this.playersJS=[4,4]; //joystick associated to players (0=gamePad1, 1=gamePad2, 2=arrows, 3=WASD, 4=any)
	this.games=[];
	this.clock=0;
	this.readyMessageDone=false;
	this.userTouched=false;
	this.choiceExit=0;
	this.checkReady();
	this.resize();
	this.isPlaying=false;
}


players.prototype.checkReady=function(){
	var interval = setInterval(function(){
		if(this.cd.loaded){
			clearInterval(interval);
			this.js = new joystick(this.platform,this.cd.spriteList["VJ"],this.leftPaddngs);
			var interval_2=setInterval(function(){
			   if(this.js.loaded){
				   clearInterval(interval_2);
				   document.getElementById("wait").style.display="none";
				   this.loaded=true;
				   this.am = new audiomachine(this.platform,this.js);
				   this.dh = new domHelpers(this.js);
				   this.readTopScores();
				   this.getSessionUser();
				}
			}.bind(this),87);
		}
	}.bind(this),57);
}


players.prototype.choseNumberPlayers=function(){
	let fadeScreen="landerFront";
	let initialScreen = "landerTopScores";
	let costume = 0;
	this.dh.hold=false;
	var interval = setInterval(function(){
		if(!this.cd.crossFaded){
			if(!this.once[9]){
				this.cd.crossfade(fadeScreen,initialScreen,1.5,0.8);
				this.once[9]=true;
			}
		}else{	
			if(!this.once[10]){
				if(this.platform.touchScreen){
					this.dh.chose({wrapper:document.getElementById("container"),scale:_SCALE,choices:["START"]});
				}else{
					this.dh.chose({wrapper:document.getElementById("container"),scale:_SCALE});
				}
				this.once[10]=true;
			}
			this.cd.drawBackground(initialScreen,costume);
			this.cl.runChaseLight(this.clock);
			this.writeTopScores();
			this.dh.jsHandler();
			if(!this.dh.chosing||this.once[5]){
				this.once[5]=true;
				this.players=this.dh.choice+1;
				if(this.am.loaded){
					clearInterval(interval);
					if(this.players==2){
						this.dh.hold=false;
						this.choseJS();
						this.dh.removeChose();
					}
					else{
						this.dh.hold=false;
						this.start();
					}
				}else{
					this.dh.hold=true;
					this.cd.drawString("...LOADING SOUNDS...",24,-60,"center","red","black");
				}
			}
		}
		this.clock++;
	}.bind(this),47);	
}

players.prototype.start=function(){
	let elapsed=0;
	document.body.style.cursor="none";
	this.soundStack.push({command:"PLAY",music:"rockets_v1"});
	this.soundStack = this.am.playStack(this.soundStack);
	var interval = setInterval(function(){
		if(this.am.checkEnded("rockets_v1")){
			clearInterval(interval);
			this.cl.ind=0;
			this.dh.removeChose();
			if(this.players==2)
				this.cd.removeCanvas("maincanvas");
			this.isPlaying=true;
			this.setPlay();
		}
		elapsed++;
		if(elapsed>10){
			this.cd.drawString("...BROWSER  NOT  ALLOWING  SOUNDS...",24,-60,"center","red","black");
		}
		if(elapsed>35){
			_SOUNDS=false;
		}
	}.bind(this),100);
}


players.prototype.setPlay = function(){
	this.clock=0;
	
	console.log(this.players);
	
	for (var i=0;i<this.players;i++){
		var player = i+1;
		var leftPaddngs=setWindow(this.platform,this.players,player);
		this.games.push(new game(this.platform,this.players,player,this.js,this.am,this.cd,this.sv,this.playersJS[i],leftPaddngs,this.cd.spriteList,false));
	}
	var interval = setInterval(function(){
		if(this.players==1){
			if(!this.games[0].lost){
				if(!_EXIT){
					this.games[0].play(this.clock);	
					this.clock++;
				}else
					this.confirmExit("RESUME","none");
			}else{
				clearInterval(interval);	
				this.finishAsk();
			}
		}else{
			if(this.games[0].lost&&this.games[1].lost){
				clearInterval(interval);
				this.finishAsk();
			}else if(_EXIT){
				if(this.games[0].lost||this.games[1].lost){
					var pos=(this.games[0].lost)?"right":"left";
					this.confirmExit("RESUME",pos);
				}else
					_EXIT=false;
			}else if(!_EXIT){
				this.clock++
				for(var i=0;i<2;i++){
					if(!this.games[i].lost)
						this.games[i].play(this.clock);
				}
			}
		}
		this.resizing=false;
	}.bind(this),_TICK)
}

players.prototype.test = function(){
	var interv = setInterval(function(){
		this.countTest++;
	/*	if(this.countTest<30)
			this.soundStack.push({"command":"PLAY","music":"bacmusic"});
		//if(this.countTest>15&&this.countTest<25)
		//	this.soundStack.push({"command":"PLAY","music":"coin_credit"});
		if(this.countTest==30){
			this.soundStack.push({"command":"PLAY FADE TO STOP","music":"intro1_long"});
		}
		this.soundStack = this.am.playStack(this.soundStack);*/
		if(this.js.loaded){
			this.js.readJoystick();
		}
	}.bind(this),35)
}

players.prototype.resize=function(){
	window.addEventListener("resize",function(){
		if(!this.once[6]){
			this.once[6]=true;
			var once=false;
			var interval=setInterval(function(){
				if(!once){
					once=true;
				}else{
					var leftPaddng=setWindow(_PLATFORM,this.players,this.player);
					this.cd.resize(_WIDTH,_HEIGHT,leftPaddng);
					this.js.resize(_WIDTH,_HEIGHT,leftPaddng);			
					if(!this.isPlaying){
						this.once[5]=false;
						this.cl.resize(_WIDTH,_HEIGHT,_SCALE);
						if(this.dh.chosing)
							this.dh.removeChose();
						if(this.platform.touchScreen)
							this.dh.chose({wrapper:document.getElementById("container"),scale:_SCALE,choices:["START"],halfscreen:"none"});
						else if(!_CHOSEJS)
							this.dh.chose({wrapper:document.getElementById("container"),scale:_SCALE});
					}
					this.once[6]=false;
					clearInterval(interval)
				}
			}.bind(this),200);
		}
	}.bind(this));
}


players.prototype.confirmExit=function(str2,pos){
	document.body.style.cursor="default";
	if(!pos||pos==""||pos==0||this.platform.touchScreen)
		pos="none";
	if(!this.once[11]){	
		var leftPaddng=setWindow(_PLATFORM,this.players,this.player);
		this.dh.chose({wrapper:document.getElementById("container"),scale:_SCALE,choices:[" E X I T",str2],boxshadow:"0px 0px 1px 4px black",halfscreen:pos});
		this.once[11]=true;
		this.isPlaying=false;
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
			_EXIT=false;
			this.isPlaying=true;
			this.once[11]=false;
			document.body.style.cursor="none";
		}
	}
}


//number,n,y,position,color,bgColor,delta)
//str,size,y,position,color,bgColor,strAdjust,direction,delta

players.prototype.writeTopScores=function(){
	for(var i=0;i<_TOPSCORES.length;i++){
		var player=_TOPSCORES[i];
		this.cd.drawNumber(player.score,6,68-i*25.5,"left","#0c70b0","black",95);
		this.cd.drawString(player.name,24,68-i*25.5,"left","#0c70b0","black",null,0,215);
	}
}

//name,costume,dY,opacity
players.prototype.finishAsk=function(){
	_COUNT++
	this.soundStack.push({command:"STOPALL",music:""});
	this.soundStack=this.am.playStack(this.soundStack);
	_EXIT=true;
	this.clock=0;
	this.once[9]=false;
	_FREEZEIMAGELOADED=false;
	if(this.players==1){
		if(_COUNT>1)
			this.cd.spriteList["stage"].img.removeEventListener("load",_F)
		var currentImg=this.cd.canvas.toDataURL("image/png");
		this.cd.spriteList["stage"].img.src=currentImg;
		this.cd.spriteList["stage"].scale=false;
		this.cd.crossFaded=false;
		this.cd.spriteList["stage"].img.addEventListener("load",function(){
			_FREEZEIMAGELOADED=true;
		});
	}else{
		_FREEZEIMAGELOADED=true;
		this.cd.crossFaded=true;
		this.games[0].cd.removeCanvas("player1canvas");
		this.games[1].cd.removeCanvas("player2canvas");
		this.players=1;
		
		var leftPaddng=setWindow(_PLATFORM,this.players,this.player);
		this.cd.resize(_WIDTH,_HEIGHT,leftPaddng);
		this.js.resize(_WIDTH,_HEIGHT);	
		
		this.cd.singleBGcolor("black");
		this.cd.canvas.style.display="block";
		this.isPlaying=false;
	}
	var interval=setInterval(function(){
		if(!this.cd.crossFaded&&_FREEZEIMAGELOADED){
			if(!this.once[9]){
				//_MOBTXT.innerHTML="GOT HERE 2";
				this.cd.crossfade("stage","landerTopScores",0.8,0.8);
				this.once[9]=true;
			}
		}else if(this.cd.crossFaded){
			this.cd.drawBackground("landerTopScores",0);
			this.writeTopScores();
			this.cl.runChaseLight(this.clock);
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
				_P=null;
				_P=new players(_PLATFORM,_LEFTPADDNGS);			
			}
		}
		this.clock++;
	}.bind(this),35);
}


//canvasdisplay.prototype.drawSingleBG = function(name,costume,dY,opacity){

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
			if(!this.once[12]){
				this.once[12]=true;
				_CHOSE=false;
			}
			this.playersJS=[player1js,player2js];
			if(!this.dh.chosing&&!done){
				this.dh.chose({wrapper:document.getElementById("container"),scale:_SCALE,choices:["START"],top:0.475,boxshadow:"0px 0px 1px 2px black"});
			}
			else if(this.js.fire){
				//this.dh.removeChose();
				done=true;
				_CHOSEJS=false;
				this.start();
			}
			if(this.dh.chosing){
				this.dh.jsHandler();
			}
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
		_this.cd.drawSingleBG("Kbs",0,0,1);
		if(player1js!=-1)
			_this.cd.drawSingleActor("devices",player1js,-150,60);
		if(player2js!=-1)
			_this.cd.drawSingleActor("devices",player2js,150,60);
		for(let key in center){
			if(center.hasOwnProperty(key))
				if(center[key])
					_this.cd.drawSingleActor("devices",key,0,38-key*82);
		}
	}
	
	setTimeout(handler.bind(this),97);	
}

players.prototype.readTopScores=function(){
	_TOPSCORES=[];
	if(navigator.onLine){
		new Promise(function(resolve,reject){
			this.sv.readJSON("topscores","gameId",5).then(function(result){
				if(result instanceof Error || result==""){
					if(_OFFLINE["topscores"]!=undefined)
						_TOPSCORES=_OFFLINE["topscores"];
					else
						console.log("could not read topscores");
					this.choseNumberPlayers();
				}else{
					let tops=JSON.parse(result);
					tops.forEach(function(t){
						_TOPSCORES.push({name:t.name,score:t.score});
					});
					_OFFLINE["topscores"]=_TOPSCORES
					this.choseNumberPlayers();
				}
			}.bind(this));
		}.bind(this));
	}else{ 
		if(_OFFLINE["topscores"]!=undefined)
			_TOPSCORES=_OFFLINE["topscores"];
		this.choseNumberPlayers(); 
	}
}

players.prototype.getSessionUser=function(){
	if(navigator.onLine){
		this.se.setORget("get").then(function(result){
			_USER.name=result;
		});
	}else{
		_USER.name="";
	}
}
