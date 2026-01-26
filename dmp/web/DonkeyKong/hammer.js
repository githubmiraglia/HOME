

function hammer(sprite,costume,pos,vel,rotate,flip){
    actor.call(this,sprite,costume,pos,vel,rotate,flip);
    this.once = [false,false,false,false];
    this.state = "";
    this.nextCostume = 0;
    this.originalPos = new Vector(0,0);
    this.clock1 = new clockCycle();
    this.hammerDeltaX = 0;
	this.hammerDeltaY = 0;
	this.hasHammer = false;
	this.landed = false
};

hammer.prototype = Object.create(actor.prototype);
    
hammer.prototype.act = function(data,flags){
	 this.gameData = data;
     this.gameFlags = flags;
     if (!this.gameFlags.reachedPrincess&&!this.gameFlags.princessRescued&&!this.gameFlags.playerLosesLife&&!this.gameFlags.hammerStrike){
        if(!this.once[0]){
            this.initialize();
            this.once[0]=true;
        }
		if(!this.hasHammer){
        	this.checkHasHammer();
		}
		else{
            this.clock1.setClockOnce(this.gameData.step[0],10);
            if(this.clock1.checkClock(this.gameData.step[0])){
                if(!this.clock1.once){
					this.gotHammer();
                    this.gameData.soundTrack.push({command:"PLAY",music:"jumpbar"});
                }
            
            if(this.timer>0){
				this.once[1]=false;
				this.change("costume",this.nextCostume);
                this.hammerDeltaX = 16*this.gameData.marioDirection*(this.gameFlags.hammerUp?1:0)+1*this.gameData.marioDirection*(this.gameFlags.hammerUp?0:1);
				this.hammerDeltaY = 15*(this.gameFlags.hammerUp?0:1)-2;
                this.set("pos",new Vector(this.gameData.marioPos.x+this.hammerDeltaX,this.gameData.marioPos.y+this.hammerDeltaY));
                if(this.gameData.marioDirection==1)
                    this.flip=true;
                else
                    this.flip=false;
                this.timer--;
				this.nextCostume = Math.floor((this.timer)/4)%2+Math.floor((this.timer+2)/4)%2*2*(this.timer<120?1:0);
				this.gameFlags.hammerUp = (this.nextCostume==1||this.nextCostume==3);
            }else{
                this.gameFlags.gotHammer = false;
				this.hasHammer = false;
				this.gameData.soundTrack.push({command:"STOP",music:"hammer"});
                this.gameData.soundTrack.push({command:"PLAY LOOPING",music:"bacmusic"});
                this.change("costume",0);
                this.deleteThisActor=true;//set("pos", new Vector(this.originalPos.x,this.originalPos.y));
            }
			}else{
				this.set("pos",new Vector(this.gameData.marioPos.x+16*this.gameData.marioDirection,this.gameData.marioPos.y-2))
				this.change("costume",1)
				if(this.gameData.marioDirection==1)
                    this.flip=true;
                else
                    this.flip=false;
			}
        }
     }else if(this.gameFlags.playerLosesLife){
		 this.deleteThisActor=true;
	 }
	return[this.gameData,this.gameFlags];
};


hammer.prototype.initialize = function(){
    this.gameFlags.hammerStrike = false;
    this.state = "waiting";
    this.change("costume",0);
};


hammer.prototype.checkHasHammer = function (){
    if(Math.abs(this.pos.x-this.gameData.marioPos.x)<8 && Math.abs(this.pos.y-this.gameData.marioPos.y)<8)
		this.hasHammer=true;
	    this.originalPos = this.pos;
}

hammer.prototype.gotHammer = function(){
	//if(this.hasHammer&&this.gameFlags.justLanded){
        this.gameFlags.gotHammer = true;
		this.timer = 330;
        this.gameData.soundTrack.push({command:"STOP",music:"bacmusic"});
        this.gameData.soundTrack.push({command:"PLAY LOOPING",music:"hammer"});
        this.gameData.soundTrack.push({command:"PLAY",music:"jumpbar"});
        this.nextCostume = Math.floor(this.timer/4)%2+(this.timer<120)?1:0*Math.floor((this.timer+2)/4)%2*2;
        this.gameFlags.hammerUp =(this.nextCostume==1)?1:0;
	//}		
};

