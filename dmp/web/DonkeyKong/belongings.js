
function belongings(sprite,costume,pos,vel,rotate,flip){
	actor.call(this,sprite,costume,pos,vel,rotate,flip);
    this.once=[false,false,false,false];
	this.clock1 = new clockCycle();
    this.gotIt = false;
    this.deltaY = 0;
};

belongings.prototype = Object.create(actor.prototype);

belongings.prototype.act = function(data,flags){
	this.gameData=data;
	this.gameFlags = flags;
    if(this.costume==3)
        this.deltaY=-6;
    else
        this.deltaY=0;
    if(Math.abs(this.gameData.marioPos.x-this.pos.x)<8&&Math.abs(this.gameData.marioPos.y-(this.pos.y+this.deltaY))<8){
       if(!this.once[0]){
            this.once[0]=true;
            this.gameData.soundTrack.push({command:"PLAY",music:"jumpbar"});
            if(this.gameData.level==1){
                this.change("costume",4)
                this.gameData.score+=300;
            }else if(this.gameData.level==2){
                this.change("costume",5);
                this.gameData.score+=500;
            }else{
                this.change("costume",6);
                this.gameData.score+=800;
            }
            this.gotIt=true;
       }
    }
    if(this.gotIt){
        this.clock1.setClockOnce(this.gameData.step[0],30);
        if(this.clock1.checkClock(this.gameData.step[0])){
           this.deleteThisActor=true;
        }
    }
    return[this.gameData,this.gameFlags];
};
	