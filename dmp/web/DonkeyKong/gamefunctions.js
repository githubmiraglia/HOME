// JavaScript Document


	
game.prototype.howHigh=function(stage){
  var i = 0;
  var playOnce=0;
  if(GlobalSounds!="none"){
  	//var duration = GlobalAudioList["howhigh"].audio.duration;
  	this.data.soundTrack=[];
  	this.data.soundTrack.push({command:"PLAY",music:"howhigh"});
  	this.data.soundTrack = this.am.playStack(this.data.soundTrack);
    //var audioReady=false;
	/*if(GlobalTouchScreen){
		var interv = setInterval(function(){
			if(p.audioMachine.audioList["howhigh"].audio.currentTime>0){
				audioReady=true;
				clearInterval(interv);
			}
		},50);
	}else
		audioReady=true;
  }else{*/
  }
	  var audioReady=true;
	  var duration = 2.82 // nice hack... 
  //}
  this.data.bgCostume = 13+stage;
  var g = this;
  var interval = setInterval(function(){
  	g.canvasD.redrawBackground(g.data.bgCostume);
	i++;
	if(i>0)
		g.canvasD.writeNumber(g.data.score,6,new Vector(1,1),"white");
  		g.canvasD.writeNumber(g.data.hiscore,6,new Vector(11,1),"white");
  		g.canvasD.writeNumber(g.data.level,2,new Vector(23,3),"lightskyblue");
  		g.canvasD.drawLives(g.data.lives);
	  	if(g.player==1)
      		g.canvasD.drawTwo();
		clearInterval(interval);
  },40);
  var clockHowHigh = setInterval(function(){
      if (playOnce == 1&&audioReady){
          clearInterval(clockHowHigh);
          g.plyPart=2;
      }
      else
		if(audioReady)
        	playOnce++;
  },duration*0.62*1000);  //0.62
};


game.prototype.spriteIndex=function(spriteName){
	var indexSprite = this.actors.map(function(actor){
		return actor.sprite;
	}).indexOf(spriteName);
};

game.prototype.calcBonus = function(level,difficultyLevel){
    var bonus = 4000 + (level + 2 - difficultyLevel)*1000;
    if (bonus>8000)
        bonus = 8000;
    return bonus;
};


game.prototype.prepareData=function(levelType){
	try{	
		var floorFile = "level"+levelType.toString()+"FloorHeight";
   		var ladderFile = "level"+levelType.toString()+"LadderData";
   		this.data.floorHeight = GlobalTextArrays[floorFile].array.slice(0);
   		this.data.ladderData = GlobalTextArrays[ladderFile].array.slice(0);
	}catch(e){
		console.log("COULDN'T READ FILES CORRECTLY, PLEASE RELOAD PAGE");
		this.readWrong = true;
	}
};


game.prototype.resetFlags = function(){
	this.flags.reachedPrincess=false;
	this.flags.princessKidnapped=false;
	this.flags.princessRescued=false;
    this.flags.rescuedPrincess=false;
	this.flags.princessCarried=false;
	this.flags.playerLosesLife=false;
    this.flags.fallingSequence=false;
	this.flags.lifeLost = false;
	this.flags.gotHammer=false;
	this.flags.hammerStrike=false;
    this.flags.kongDeathHideSprites=false;
	this.flags.processConveyor=false;
	this.once=[false,false,false,false,false,false]
	this.data.FireCount = 0;
	this.data.fireCounter = 0;
	this.data.rivetCount = 0;
    this.data.soundTrack = [];
	this.actors.forEach(function(actor){
		actor=null;
		delete actor;
	});
	this.actors=[];
	this.counterConcrete = 60;
    this.prepareData(this.data.levelType);
}


game.prototype.setHammers=function(){
	this.data.hammerPos=[];
	if(this.data.levelType==1){
        this.data.hammerPos = [new Vector(64,-121), new Vector(-90,-26)];
    }else if(this.data.levelType == 2){
        this.data.hammerPos = [new Vector(-4,-109), new Vector(-98,-72)];
    }else if (this.data.levelType==4){
        this.data.hammerPos = [new Vector(0,-32), new Vector(-98,-70)];
    }
	for(var i=0; i<this.data.hammerPos.length; i++){
       var x = this.data.hammerPos[i].x;
       var y =this.data.hammerPos[i].y;
       this.actors.push(new hammer("spriteHammer",0,new Vector(x,y),new Vector(0,0),0,false));
	}
}

game.prototype.setFire=function(){
	if(!this.once[2]){
		this.once[2]=true;
		if(this.data.levelType!=1){
			if(this.data.levelType==3)
				this.data.firePos = [new Vector(-104,-56), new Vector(104,-20)];
			else
				this.data.firePos = [new Vector(0,0)];
			this.data.fireCounter = 120 + (2-this.data.difficultyLevel)*120 - (this.data.level -1)*20;
		    this.flags.createFire = true; 
		}
	}else{
		if(this.data.levelType==2){		
			if (this.data.FireCount < 5){  
			if (this.data.fireCounter==0){
				this.flags.createFire = true;
				this.data.firePos = [new Vector(0,-52+8)];
				this.data.fireCounter = 120 + (2-this.data.difficultyLevel)*120 - (this.data.level -1)*20;
			}else
				this.data.fireCounter--;
		    } 
		}else if (this.data.levelType == 4){
			if (this.data.FireCount < 5){
				if(this.data.fireCounter==0){
					this.flags.createFire = true;
					this.data.firePos = [new Vector(-89,-148)];
                	this.data.fireCounter = 120 + (2-this.data.difficultyLevel)*120 - (this.data.level -1)*20;
				}else{
                	this.data.fireCounter--;
				}
			}
		}
   }	
};

game.prototype.setRivet = function(){
	if(!this.once[5]){
        this.once[5]=true;
		this.data.rivetCount=0;
		var pos = new Vector(-52,-15)
		for(var j=0;j<2;j++)
			for(var i=0;i<4;i++)
				this.actors.push(new rivet("spriteRivet",0,new Vector(pos.x+j*104,pos.y-i*40),new Vector(0,0),0,false))		
	}
};

game.prototype.setBelongings = function(){
    if(this.data.levelType==2)
        var sprites = [0,-45,-87,1,12,-167,3,92,-81];
    if(this.data.levelType==3)
        var sprites = [0,-37,-127,1,100,-23,3,-100,-49]
    if(this.data.levelType==4)
        var sprites = [0,91,-127,1,20,-167,3,-76,-1];
    for(var i=0;i<sprites.length/3;i++){
        var belong = new belongings("spriteBelongings",sprites[i*3],new Vector(sprites[i*3+1],sprites[i*3+2]),new Vector(0,0),0,false);
        this.actors.push(belong);	
    }
};

game.prototype.setElevator = function(){
    this.data.elevatorCounter = 0;
    var ind = 0, x=0, y=-500, costume=1, rot=0, flip=false;
    this.data.floorHeight[36]=this.data.floorHeight[33];
    this.data.floorHeight[44]=this.data.floorHeight[41];
    this.data.floorHeight[101]=this.data.floorHeight[98];
    this.data.floorHeight[109]=this.data.floorHeight[106];
    for(var id=0;id<10;id++){
        if(id<3){
            x=-72;
            ind = 35-id;
            costume =1;
        }else if(id<6){
            x=-8;
            ind = 95+id;
            costume =1;
        }else{
            costume = 0;
            x = -72+(id%2)*64;
            y = -20 - Math.floor((id-6)/2)*152;
            if(Math.floor((id-6)/2)>0)
                rot=Math.PI;
            else
                rot=0;
        }
        this.actors.push(new elevator("spriteElevator",costume,new Vector(x,y),new Vector(0,0),rot,flip,id,ind));
    }
};


game.prototype.setGirder = function(){
	if(!this.flags.reachedPrincess&&!this.flags.playerLosesLife&&!this.flags.hammerStrike&&!this.flags.fallingSequence&&!this.flags.princessRescued&&(this.data.levelType==3)){
		if(!this.once[6]){
			this.once[6]=true;
			this.clock1.resetClock();
			var posx = -132+Math.floor(-17*Math.random()), posy = 4; 
			this.actors.push(new girder("spriteGirder",0,new Vector(posx,posy), new Vector(2,3),0,false));
		}
		var velx = 2, vely=3;
		var top = 45 + (2-this.data.difficultyLevel)*45-(this.data.level-1)*10;
		if(top<45)
			top=45;
		this.clock1.setClockOnce(this.data.step[0],top);
		if(this.clock1.checkClock(this.data.step[0])){
		   var posx = -132+Math.floor(-17*Math.random()), posy = 4;
		   this.actors.push(new girder("spriteGirder",0,new Vector(posx,posy), new Vector(velx,vely),0,false));
				this.clock1.resetClock();
		}
	}	
};

game.prototype.setConveyor = function(){
	if(!this.flags.reachedPrincess&&!this.flags.playerLosesLife&&!this.flags.hammerStrike&&!this.flags.fallingSequence&&!this.flags.princessRescued&&(this.data.levelType==2)){
		var position=[-105,-16,105,-16,-12,-56,12,-56,-105,-136,105,-136];
		var direction=[1,-1,-1,1,1,-1];
		for(var id=0;id<6;id++){
			if(direction[id]==1)
				var flip=false;
			else
				var flip=true;
			this.actors.push(new conveyor("spriteConveyor",0,new Vector(position[id*2],position[id*2+1]), new Vector(0,0),0,flip,id));
		}
	}
};

game.prototype.setLadder = function(){
	if(!this.flags.reachedPrincess&&!this.flags.playerLosesLife&&!this.flags.hammerStrike&&!this.flags.fallingSequence&&!this.flags.princessRescued&&(this.data.levelType==2)){
		for(var id=0;id<2;id++){
			if(id==0)
				var posx=-92,posy=-28;
			else
				var posx=92, posy=-28;
			this.actors.push(new ladder("spriteLadder",0,new Vector(posx,posy),new Vector(0,0),0,false,id));
		}
	}
	
}

game.prototype.setConcrete = function(){
	if(!this.flags.reachedPrincess&&!this.flags.playerLosesLife&&!this.flags.hammerStrike&&!this.flags.fallingSequence&&!this.flags.princessRescued&&(this.data.levelType==2)){
		this.data.counterConcrete--;
		if(this.data.counterConcrete==0){
			var posC = Math.floor(Math.random()*3)+1;
			if(posC==3){
				var posy=-128;
				if(this.data.conveyorDirection[1]==1)
					var posx=-124;
				else
					var posx=124;
			}else{
				var posy=-48;
				if(posC==1)
					var posx=-124;
				else
					var posx=124;
			}
			this.actors.push(new concrete("spriteConcrete",0,new Vector(posx,posy),new Vector(0,0),0,false));
			this.data.counterConcrete=60;
		}else{
			if(this.playerLosesLife)
				this.deleteThisActor=true;
		}
			
	}
};

game.prototype.drawValues = function(){
	if(this.data.score>this.data.hiscore)
    	this.data.hiscore=this.data.score;
    if(!this.once[1]){
       this.once[1]=true;
       this.time = this.data.step[0];
   }
   if(!this.flags.reachedPrincess&&!this.flags.playerLosesLife&&!this.flags.hammerStrike&&!this.flags.fallingSequence&&!this.flags.princessRescued){
        if(this.data.step[0]-this.time>=29){
            this.time=this.data.step[0];
            this.data.bonus = this.data.bonus-100;
        }
   }else if(this.flags.reachedPrincess||this.flags.playerLosesLife||this.flags.fallingSequence||this.flags.princessRescued){ 
     this.data.soundTrack.push({command:"STOP",music:"out of time"});
   }
   if(this.data.bonus == 1000){
      this.data.soundTrack.push({command:"PLAY LOOPING",music:"out of time"});
   }
   if(this.data.bonus<1000)
    this.canvasD.writeNumber(this.data.bonus,4,new Vector(22,6),"red"); 
   else
       this.canvasD.writeNumber(this.data.bonus,4,new Vector(22,6),"lightskyblue");
   if(this.data.bonus<=0){
     this.flags.playerLosesLife = true;
     this.data.soundTrack.push({command:"STOP",music:"out of time"});
   }
   this.canvasD.writeNumber(this.data.score,6,new Vector(1,1),"white");
   this.canvasD.writeNumber(this.data.hiscore,6,new Vector(11,1),"white");
   this.canvasD.writeNumber(this.data.level,2,new Vector(23,3),"lightskyblue");
   if(this.player==1){
      this.canvasD.drawTwo();
   }
};

/*function trackKeys(codes) {
  var pressed = Object.create(null);
  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      var down = event.type == "keydown";
		//if(down)
		  //this.flags.keyboardPressed = true;
	  //else
		//  this.flags.keyboardPressed = false;
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
    }
  }
  addEventListener("keydown", handler);
  addEventListener("keyup", handler);
  return pressed;
}


game.prototype.trackGamePads = function(gps) { 
		var pressed = {};
		if(gps.numberGPs>0){
			gps.read();
			for(var i=0;i<gps.numberGPs;i++){
				gpi = gps.gps[i];
				if(gpi.axes.ulHori<0||gpi.axes.drHori<0||gpi.buttons.dLeft)
					pressed["left"]=true;
				if(gpi.axes.ulHori>0||gpi.axes.drHori>0||gpi.buttons.dRight)
					pressed["right"]=true;
				if(gpi.axes.ulVert<0||gpi.axes.drVert<0||gpi.buttons.dUp)
					pressed["up"]=true;
				if(gpi.axes.ulVert>0||gpi.axes.drVert>0||gpi.buttons.dDown)
					pressed["down"]=true;
				if(gpi.buttons.a)
					pressed["space"]=true;
			}
		}
		return pressed;
};


game.prototype.trackVirtualJoystick = function(vj,vb) { 
	var pressed = {};
	if(vj.left())
		pressed["left"]=true;
	if(vj.right())
		pressed["right"]=true;
	if(vj.up())
		pressed["up"]=true;
	if(vj.down())
		pressed["down"]=true;
	if(vb.fire())
		pressed["space"]=true;
	return pressed;
};

*/
