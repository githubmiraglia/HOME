function rivet(sprite,costume,pos,vel,rotate,flip){
	actor.call(this,sprite,costume,pos,vel,rotate,flip);
	this.clock1 = new clockCycle();
	this.clock2 = new clockCycle();
    this.floorIndex = 0;
    this.removeRivet = false;
    this.once =false;
};

rivet.prototype = Object.create(actor.prototype);

rivet.prototype.act = function(data,flags){
    this.gameData = data;
    this.gameFlags = flags;
    if(!this.gameFlags.playerLosesLife&&!this.gameFlags.reachedPrincess&&!this.removeRivet){
    	if(this.gameFlags.checkRivet){
			if(Math.abs(this.gameData.marioPos.x-this.pos.x)<2 && Math.abs(this.gameData.marioPos.y-(this.pos.y+16))<8){
				var arr = getHeightRivet(this.gameData.marioPos,this.gameData.floorHeight);
				this.floorIndex = arr[0];
				this.floorY=arr[1];
        		if(this.floorIndex>0){	
					this.gameData.rivetCount++;
            		this.removeRivet = true;
            		this.change("pos",new Vector(0,-8));
            		this.change("costume",2);
            		this.gameData.score+=100;
            		this.gameData.soundTrack.push({command:"PLAY",music:"rivet"});
				}
			}
		}
	}
    this.checkDeleteRivet();
    if(this.gameData.rivetCount==8){
        if(!this.once){
            this.once=true;
            this.gameFlags.reachedPrincess=true;
			this.gameData.soundTrack.push({command:"PLAY",music:"win1"});
        }
    }
   	return[this.gameData,this.gameFlags];
};

rivet.prototype.checkDeleteRivet = function(){
    if(this.removeRivet){
		this.clock2.setClockOnce(this.gameData.step[0],3)
		if(this.clock2.checkClock(this.gameData.step[0])){
			if(!this.clock2.once){
				while(!((this.floorIndex+1)%8==0)){
					this.gameData.floorHeight[this.floorIndex]=this.gameData.floorHeight[this.floorIndex+1];
                    this.floorIndex++;
					this.gameData.floorHeight[this.floorIndex]=-180;
                }
			}
		}
        this.clock1.setClockOnce(this.gameData.step[0],30);
        if(this.clock1.checkClock(this.gameData.step[0])){
            if(!this.clock1.once){      
                
                this.deleteThisActor = true;
                //this.clock1.resetClock();
            }
        }
    }
};