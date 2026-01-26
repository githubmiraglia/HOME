// JavaScript Document
function landerHigh(sprite,costume,x,y,vx,vy,rotation,flip,show,js,jUsed){
	actor.call(this,sprite,costume,x,y,vx,vy,rotation,flip,show,js,jUsed);
	this.js=js;
	this.jUsed=jUsed;
}

landerHigh.prototype = Object.create(actor.prototype);

landerHigh.prototype.act=function(clock,flags,data){
	this.gameFlags=flags;
	this.gameData=data;
	if(this.gameData.lowHigh==0){
		if(!this.once[0]&&!this.gameFlags.intoLow){
			if(!this.gameFlags.resetLanderY){
				this.once[0]=true;
				this.vy=Math.floor(this.gameData.vY[1]/2);
				this.y=this.gameData.yback[0];
			}else{
				this.once[0]=true;
				this.y=this.gameData.yini[0];
				this.vy=0;
				this.gameFlags.resetLanderY=false;
			}
		}
		this.show=true;
		this.js.readJoystick(this.jUsed);
		if(this.js.fire&&this.gameData.fuel>0){
			this.gameData.soundStack.push({command:"PLAYTOEND",music:"rockets"});
			this.vy+=this.gameData.aY[0];
			this.costume=3;
			this.gameData.fuel-=this.gameData.changeFuelHigh;
		}else
			this.costume=this.gameData.xCostume;
		this.vy-=this.gameData.gravity[0];
		this.y+=this.vy;
		if(this.y>this.gameData.hLimit[0]&&this.vy>0){
			this.y=this.gameData.hLimit[0];
			this.vy=0;
		}
		if(this.y<this.gameData.hThreshold[0]){
			this.gameFlags.intoLow=true;
			this.once[0]=false;
		}
	}else{
		this.show=false;
	}
	this.gameData.vY[0]=this.vy;
	return[this.gameFlags,this.gameData];
}



