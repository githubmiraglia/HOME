// JavaScript Document
function landerLow(sprite,costume,x,y,vx,vy,rotation,flip,show,js,jUsed,ctx){
	actor.call(this,sprite,costume,x,y,vx,vy,rotation,flip,show,js,jUsed);
	this.js=js;
	this.jUsed=jUsed;
	this.ctx=ctx;
	this.tClock;
	this.retCollision="";
}

landerLow.prototype = Object.create(actor.prototype);

landerLow.prototype.act=function(clock,flags,data){
	this.gameFlags=flags;
	this.gameData=data;
	if(this.gameData.lowHigh==1&&!this.gameFlags.backToHigh&&!this.gameFlags.exploding&&!this.gameFlags.landed&&!this.gameFlags.showReady){
		if(!this.once[0]){
			this.once[0]=true;
			this.y=this.gameData.yini[1];
			this.vy=this.gameData.vY[0]*2;
		}
		this.show=true;
		this.js.readJoystick(this.jUsed);
		if(this.js.fire&&this.gameData.fuel>0){
			this.gameData.soundStack.push({command:"PLAYTOEND",music:"rockets"});
			this.vy+=this.gameData.aY[1];
			this.gameData.fuel-=this.gameData.changeFuelLow;
			if(!this.once[1]){
				this.once[1]=true;
				this.tClock=clock;
			}
			let dt=clock-this.tClock;
			if(dt<=4){
				this.costume=3;
				this.vy+=this.gameData.aY[1]/2;
			}else if(dt<=8){
				this.costume=4;
				this.vy+=this.gameData.aY[1]*(2/3);
			}else{
				this.costume=5;
				this.vy+=this.gameData.aY[1];
			}
		}else{
			this.costume=this.gameData.xCostume;
			this.once[1]=false;
		}
		this.vy-=this.gameData.gravity[1];
		this.y+=this.vy;
		if(this.y>this.gameData.hLimit[1]){
			this.gameFlags.backToHigh=true;
			this.once[0]=false;
		}
		if(this.checkCollision()){
			this.checkTypeOfHit();
		}
	}else if(this.gameFlags.exploding){
		this.explode(clock);
	}else if(this.gameFlags.landed){
		this.landed(clock);
	}else{
		this.show=false;
	}
	this.gameData.vY[1]=this.vy;
	return[this.gameFlags,this.gameData];
}

landerLow.prototype.checkCollision=function(){
	let w=4;
	let h=4;
	for(let i=0;i<this.gameData.collisionCoordX.length;i++){
		let x1 = Math.ceil((this.x*_GAMEWIDTH/_K[2]+_GAMEWIDTH/2)+this.gameData.collisionCoordX[i]);
		let y1 = Math.ceil((-this.y*(_GAMEHEIGHT-80)/_K[3]+_GAMEHEIGHT/2)-this.gameData.collisionCoordY[i]-100);
		let p=this.ctx.getImageData(Math.ceil(x1*_SCALE),Math.ceil(y1*_SCALE),w,h).data;
		for(let i=0;i<(p.length/4);i+=4){
			if(p[i]>=100&&p[i+1]>=100&&p[i+2]>=20){
				//this.ctx.fillStyle="red";
				//this.ctx.fillRect(x1, y1, w+2, h);
				return(true);
			}
		}
	}
	return(false);
}

landerLow.prototype.explode=function(clock){
	if(!this.once[2]){
		this.once[2]=true;
		this.tClock=clock;
		this.gameData.soundStack.push({command:"STOP",music:"interior"});
	}
	let dt=clock-this.tClock;
	this.costume=6+Math.floor(dt/5);
	if(Math.floor(dt/5)>4){
	   this.gameFlags.exploding=false;
	   this.show=false;
	   this.once[0]=false;
	   this.once[2]=false;
	   this.gameData.fuel-=500;
	   if(this.gameData.fuel>=0)
		   this.gameFlags.showReady=true;
	   else
		   this.gameFlags.gameOver=true;
	}
}

landerLow.prototype.checkTypeOfHit=function(){
	let v=Math.sqrt(Math.pow(this.vy,2)+Math.pow(this.gameData.vX,2));
	let y1 = Math.ceil(-this.y*(_GAMEHEIGHT-80)/_K[3]+_GAMEHEIGHT/2-60)-100;
	if(v>0.5){
		this.gameFlags.exploding=true;
		this.gameData.soundStack.push({command:"PLAYTOEND",music:"Explosion"});
	}else{
		for(let i=0;i<this.gameData.landingXBeg.length;i++){
			let xB=this.gameData.landingXBeg[i];
			let xE=this.gameData.landingXEnd[i];
			let yM=this.gameData.landingYMore[i];
			let yL=this.gameData.landingYLess[i];
			let x1=mod(this.gameData.X,1888);
			if(x1>942)
				x1-=942;
			else
				x1+=942;
			if((x1-20)>=xB&&(x1+20)<=xE&&y1<yL&&y1>yM){
				console.log(y1);
				this.gameData.soundStack.push({command:"PLAYTOEND",music:"landed",volume:0.5});
				this.gameFlags.landed=true;
				if(this.gameData.landingPoints[i]=="F"){
					if(this.gameData.refuels>0){
						this.gameData.refuels--;
						this.gameData.fuel=5000;
					}
				}else{
					this.gameData.score+=this.gameData.landingPoints[i];
				}
				return;
			}
		}
		console.log(y1);
		this.gameFlags.exploding=true;
		this.gameData.soundStack.push({command:"PLAYTOEND",music:"Explosion"});
	}
}

landerLow.prototype.landed=function(clock){
	if(!this.once[2]){
		this.gameData.soundStack.push({command:"STOP",music:"interior"});
		this.once[2]=true;
		this.tClock=clock;
		this.y-=4;
	}
	let dt=clock-this.tClock;
	if(Math.floor(dt/5)<=5)
	  this.costume=11+Math.floor(dt/5);
	if(Math.floor(dt/5)>7){
	   this.gameFlags.showReady=true;
	   this.gameFlags.landed=false;
	   this.once[0]=false;
	   this.once[2]=false;
	}
}
		