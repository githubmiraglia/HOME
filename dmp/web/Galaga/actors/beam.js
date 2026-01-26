// JavaScript Document
function beam(sprite,costume,x,y,vx,vy,rotation,flip,js,show,cloneId){
	actor.call(this,sprite,costume,x,y,vx,vy,rotation,flip,js,show);
	this.cloneId=cloneId;
	this.once=[false,false,false,false,false];
	this.rep1=0, this.rep2=0, this.rep3=0
	this.counter=1;
	this.baseCostume=0;
}

beam.prototype = Object.create(actor.prototype);

beam.prototype.act = function(clock,gameFlags,gameData){
	this.gameFlags = gameFlags;
	this.gameData = gameData;
	
	if(this.gameFlags.beamCollapse){
		if(this.cloneId==this.gameData.lastBeam){
			this.gameData.beamActive=false;
			this.gameData.capturing=false;
			this.gameFlags.beamCollapse=false;
			this.gameData.soundStack.push({command:"STOP",music:"bossgalagatractorbeam"});
			this.gameData.beamId=1;
			this.gameData.lastBeam=0;
		}
		this.deleteThisActor=true;
	}else{
		
	if(!this.once[0]){
		this.once[0]=true;
		this.prepareBeam();
		if(this.cloneId==1)
			this.gameData.soundStack.push({command:"PLAY",music:"bossgalagatractorbeam"});
	}
	
	if(this.rep1<5){
		this.costume=this.baseCostume+Math.floor(this.counter/2);
		this.counter++;
		this.rep1++;
	}else{
		if(this.cloneId<9){
			this.gameFlags.createCloneOfBeam=true;
		}
		if(this.rep2<(4+(9-this.cloneId)*2)){
			if(!this.once[1]){
				this.once[1]=true;
				this.counter=1;
			}
		   	if(this.rep3<6){
				this.costume=this.baseCostume+Math.floor(this.counter/2);
				this.counter++;
				if((this.cloneId==9)&&(!this.gameData.capturing)&&(Math.abs(this.gameData.mainShipX-8+16*(this.gameData.shipActive[1]?1:0)-this.x)<24)&&(this.gameData.shipActive[0]||this.gameData.shipActive[1])){
					this.gameData.soundStack.push({command:"STOP",music:"bossgalagatractorbeam"});
					this.gameData.soundStack.push({command:"PLAY",music:"tractoorbeamcaught"});
					this.gameData.capturing=true;
				}
				this.rep3++;
			}else{
				this.once[1]=false;
				this.rep3=0;
				this.rep2++;
			}
		}else{
			if(this.cloneId==1){
				this.gameData.beamActive=false;
				this.gameData.beamId=1;
				this.gameFlags.createCloneOfBeam=false;
			}
			this.gameData.lastBeam--;
			this.deleteThisActor=true;
		}	   
	}
	}
	return([this.gameFlags,this.gameData]);
}

beam.prototype.prepareBeam=function(){
	this.gameData.lastBeam=this.cloneId;
	this.gameFlags.createCloneOfBeam=false;
	this.gameData.capturing=false;
	this.counter=0;
	this.baseCostume=this.cloneId*3-2;
	this.y-=(this.cloneId-1)*8;
}

