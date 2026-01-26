

function elevator(sprite,costume,pos,vel,rotate,flip,id,ind){
	actor.call(this,sprite,costume,pos,vel,rotate,flip);
	this.id =id;
    this.ind = ind;
    this.counter=0;
};

elevator.prototype = Object.create(actor.prototype);

elevator.prototype.act = function(data,flags){
	this.gameData=data;
	this.gameFlags = flags;
   if(!this.gameFlags.reachedPrincess&&!this.gameFlags.princessRescued&&!this.gameFlags.playerLosesLife&&!this.gameFlags.hammerStrike&&!this.gameFlags.fallingSequence){
    if(this.id<6){
        if(this.id<3)
            var y = -172+this.id*50+this.counter%50;
        else
            var y = -20-(this.id-3)*50-this.counter%50;
        this.set("pos",new Vector(this.pos.x,y));
        this.gameData.floorHeight[this.ind]=y+4;
        this.gameData.floorHeight[this.ind+8]=y+4;
        this.counter++;
    }
   }
   return[this.gameData,this.gameFlags];
};
	
