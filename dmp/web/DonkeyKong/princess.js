// JavaScript Document

function princess(sprite,costume,pos,vel,rotate,flip){
	actor.call(this,sprite,costume,pos,vel,rotate,flip);
    this.clock1 = new clockCycle;
    this.i = 0;
	this.direction = 1;
}

princess.prototype = Object.create(actor.prototype);

princess.prototype.act = function(data,flags){
    this.gameData = data;
    this.gameFlags = flags;
    if(this.gameFlags.princessRescued)
        this.princessResc();
    else{
    if(this.gameFlags.princessCarried)
        this.princessCarried();
    if(!this.gameFlags.princessCarried){ 
	if(data.levelType == 0){
		if(data.step[0]<32){
			if(data.step[0]%2==1){
				this.change("pos",new Vector(0,8));
				this.change("costume",3+data.step[2]%2);
			} 
		}else if(data.step[0]<34){
				this.change("costume",3+data.step[2]%2);
				this.set("vel",new Vector(0,14));
		}else if(data.step[0]<42){
				this.change("pos",new Vector(0,this.vel.y));
				this.change("vel",new Vector(0,-3));
				this.change("costume",3+data.step[2]%2);
		}else{
		this.set("pos", new Vector(-14,31));
		this.set("vel", new Vector(0,0));
		this.change("costume",0);
		}
	}else if(this.gameData.levelType==4){
        //set initial position to 0,39 in the game object
        this.change("costume",0);
        if(!this.gameFlags.hammerStrike)
            if(this.gameData.marioPos.x<0){
                this.flip = true;
				this.direction = -1;
			}
            else{
                this.flip = false;
				this.direction = 1;
			}
        if(!this.gameFlags.playerLosesLife&&!this.gameFlags.falingSequence&&!this.princessReached)
            this.help();
    }else
        //set initial position to -14,31 in the game object
        if(!this.gameFlags.playerLosesLife)
            this.help();
    }
	this.gameData.princessDirection = this.direction;
	this.gameData.princessPos = this.pos;
    }
    return[this.gameData,this.gameFlags];
};

princess.prototype.help = function(){
     if(!this.gameFlags.playerLosesLife&&!this.gameFlags.falingSequence&&!this.princessReached){
    this.clock1.setClockOnce(this.gameData.step[0],Math.random()*60+40);
        if(this.clock1.checkClock(this.gameData.step[0])){
            if(!this.clock1.once){
                this.gameFlags.help = true;
                this.i = 0;
            }
            if(!this.gameData.hammerStrike){
                if(this.i<40){
                    this.change("costume",Math.floor(this.i/4)%2);
                    this.i++;
                }else{
                    this.clock1.resetClock();
                    this.i=0;
                    this.gameFlags.help=false;
                }
            }else{
                this.gameFlags.help=false;
            }
        }
     }
};

princess.prototype.princessCarried = function(){
    if(this.i%11==0){
        this.change("costume",3+(this.i/11)%2);
    }
    this.set("pos",new Vector(this.gameData.kongPos.x+12,this.gameData.kongPos.y));
    this.i++;
}

princess.prototype.princessResc=function(){
    this.set("pos",new Vector(0,-1));
    this.flip=false;
}
