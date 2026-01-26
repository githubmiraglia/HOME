
	
game.prototype.howHigh=function(stage){
  var game = this;
  var i = 0;
  var playOnce=0;
  var duration = GlobalAudioList["howhigh"].audio.duration;
  game.data.soundTrack.push("PLAY");
  game.data.soundTrack.push("howhigh");
  game.data.soundTrack = game.audioMachine.playStack(game.data.soundTrack);
  game.data.bgCostume = 13+stage;
  var interval = setInterval(function(){
  	game.canvasD.redrawBackground(game.data.bgCostume);
	i++;
	if(i>0)
		game.canvasD.writeNumber(game.data.score,6,new Vector(1,1),"white");
  		game.canvasD.writeNumber(game.data.hiscore,6,new Vector(11,1),"white");
  		game.canvasD.writeNumber(game.data.level,2,new Vector(23,3),"lightskyblue");
  		game.canvasD.drawLives(game.data.lives);
		clearInterval(interval);
  },40);
  var clockHowHigh = setInterval(function(){
      if (playOnce == 1){
          clearInterval(clockHowHigh);
          game.playPart2();
      }
      else
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
	GlobalRivetCount = 0;
    this.data.soundTrack = [];
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
		if(game.data.levelType!=1){
			if(game.data.levelType==3)
				this.data.firePos = [new Vector(-104,-56), new Vector(104,-20)];
			else
				this.data.firePos = [new Vector(0,0)];
			game.data.fireCounter = 120 + (2-game.data.difficultyLevel)*120 - (game.data.level -1)*20;
		    this.flags.createFire = true; 
		}
	}else{
		if(game.data.levelType==2){		
			if (game.data.FireCount < 5){  
			if (game.data.fireCounter==0){
				game.flags.createFire = true;
				game.data.firePos = [new Vector(0,-52+8)];
				game.data.fireCounter = 120 + (2-game.data.difficultyLevel)*120 - (game.data.level -1)*20;
			}else
				game.data.fireCounter--;
		    } 
		}else if (game.data.levelType == 4){
			if (game.data.FireCount < 5){
				if(game.data.fireCounter==0){
					game.flags.createFire = true;
					game.data.firePos = [new Vector(-89,-148)];
                	game.data.fireCounter = 120 + (2-game.data.difficultyLevel)*120 - (game.data.level -1)*20;
				}else{
                	game.data.fireCounter--;
				}
			}
		}
   }	
};

game.prototype.setRivet = function(){
	if(!this.once[5]){
        this.once[5]=true;
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
	if(!game.flags.reachedPrincess&&!game.flags.playerLosesLife&&!game.flags.hammerStrike&&!game.flags.fallingSequence&&!game.flags.princessRescued&&(game.data.levelType==3)){
		if(!game.once[6]){
			game.once[6]=true;
			this.clock1.resetClock();
			var posx = -132+Math.floor(-17*Math.random()), posy = 4; 
			game.actors.push(new girder("spriteGirder",0,new Vector(posx,posy), new Vector(2,3),0,false));
		}
		var velx = 2, vely=3;
		var top = 45 + (2-this.data.difficultyLevel)*45-(this.data.level-1)*10;
		if(top<45)
			top=45;
		game.clock1.setClockOnce(game.data.step[0],top);
		if(game.clock1.checkClock(game.data.step[0])){
		   var posx = -132+Math.floor(-17*Math.random()), posy = 4;
		   game.actors.push(new girder("spriteGirder",0,new Vector(posx,posy), new Vector(velx,vely),0,false));
				game.clock1.resetClock();
		}
	}	
};

game.prototype.setConveyor = function(){
	if(!game.flags.reachedPrincess&&!game.flags.playerLosesLife&&!game.flags.hammerStrike&&!game.flags.fallingSequence&&!game.flags.princessRescued&&(game.data.levelType==2)){
		var position=[-105,-16,105,-16,-12,-56,12,-56,-105,-136,105,-136];
		var direction=[1,-1,-1,1,1,-1];
		for(var id=0;id<6;id++){
			if(direction[id]==1)
				var flip=false;
			else
				var flip=true;
			game.actors.push(new conveyor("spriteConveyor",0,new Vector(position[id*2],position[id*2+1]), new Vector(0,0),0,flip,id));
		}
	}
};

game.prototype.setLadder = function(){
	if(!game.flags.reachedPrincess&&!game.flags.playerLosesLife&&!game.flags.hammerStrike&&!game.flags.fallingSequence&&!game.flags.princessRescued&&(game.data.levelType==2)){
		for(var id=0;id<2;id++){
			if(id==0)
				var posx=-92,posy=-28;
			else
				var posx=92, posy=-28;
			game.actors.push(new ladder("spriteLadder",0,new Vector(posx,posy),new Vector(0,0),0,false,id));
		}
	}
	
}

game.prototype.setConcrete = function(){
	if(!game.flags.reachedPrincess&&!game.flags.playerLosesLife&&!game.flags.hammerStrike&&!game.flags.fallingSequence&&!game.flags.princessRescued&&(game.data.levelType==2)){
		game.data.counterConcrete--;
		if(game.data.counterConcrete==0){
			var posC = Math.floor(Math.random()*3)+1;
			if(posC==3){
				var posy=-128;
				if(game.data.conveyorDirection[1]==1)
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
			game.actors.push(new concrete("spriteConcrete",0,new Vector(posx,posy),new Vector(0,0),0,false));
			game.data.counterConcrete=60;
		}else{
			if(this.playerLosesLife)
				this.deleteThisActor=true;
		}
			
	}
};

game.prototype.drawValues = function(){
	if(game.data.score>game.data.hiscore)
    	game.data.hiscore=game.data.score;
    if(!game.once[1]){
       game.once[1]=true;
       game.time = game.data.step[0];
   }
   if(!game.flags.reachedPrincess&&!game.flags.playerLosesLife&&!game.flags.hammerStrike&&!game.flags.fallingSequence&&!game.flags.princessRescued){
        if(game.data.step[0]-game.time>=29){
            game.time=game.data.step[0];
            game.data.bonus = game.data.bonus-100;
        }
   }else{ 
     game.data.soundTrack.push("STOP");
     game.data.soundTrack.push("out of time");  
   }
   if(game.data.bonus == 1000){
      game.data.soundTrack.push("PLAY LOOPING");
      game.data.soundTrack.push("out of time");
   }
   if(game.data.bonus<1000)
    game.canvasD.writeNumber(game.data.bonus,4,new Vector(22,6),"red"); 
   else
       game.canvasD.writeNumber(game.data.bonus,4,new Vector(22,6),"lightskyblue");
   if(game.data.bonus<=0){
     game.flags.playerLosesLife = true;
     game.data.soundTrack.push("STOP");
     game.data.soundTrack.push("out of time");
   }
   game.canvasD.writeNumber(game.data.score,6,new Vector(1,1),"white");
   game.canvasD.writeNumber(game.data.hiscore,6,new Vector(11,1),"white");
   game.canvasD.writeNumber(game.data.level,2,new Vector(23,3),"lightskyblue");
};

function trackKeys(codes) {
  var pressed = Object.create(null);
  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      var down = event.type == "keydown";
		//if(down)
		  //game.flags.keyboardPressed = true;
	  //else
		//  game.flags.keyboardPressed = false;
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



// JavaScript Document