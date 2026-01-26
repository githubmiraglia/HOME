// JavaScript Document
function bullet(sprite,costume,x,y,vx,vy,rotation,flip,js,show,isClone,cloneId){
	actor.call(this,sprite,costume,x,y,vx,vy,rotation,flip,js,show);  
	this.isClone = isClone;
	if(this.isClone)
		this.cloneId = cloneId;
	else
		this.cloneId="NaNa";
	this.clockZero=0;
	//this.bulletWait=false;
	this.once=[false,false,false,false];
	this.wait1 = new wait();
};

bullet.prototype = Object.create(actor.prototype);

bullet.prototype.act = function(clock,gameFlags,gameData){
	this.gameFlags = gameFlags;
	this.gameData = gameData;
	
	if(this.gameFlags.fireBullet&&!this.isClone){
		this.processMain();
		this.gameFlags.fireBullet=false;
	}
	
	if(this.isClone){
		if(this.gameData.bulletWait[this.cloneId]){
			this.wait1.set(clock,0.1)
			this.wait1.Wait(clock,function(){
				this.gameData.bulletWait[this.cloneId]=false;
				this.wait1.reset();
			}.bind(this));
		}else{
			if(this.gameData.bulletActive[this.cloneId]){
				if(!this.once[0]){
					this.once[0]=true;	
					this.gameData.bulletToRemove[this.cloneId]=false;
					this.x=this.gameData.mainShipX;
					this.y=-164;
					if(this.cloneId<2)
						this.x-=8;
					else
						this.x+=8;
					this.gameData.bulletX[this.cloneId]=this.x
					this.show=true;
				}
				if(this.y<=116||(!this.gameData.bulletToRemove[this.cloneId])){
					this.y+=12;
					this.gameData.bulletY[this.cloneId]=this.y;
				}
			}
			if(this.gameData.bulletToRemove[this.cloneId]){
				this.show=false;
				this.gameData.bulletActive[this.cloneId]=false;
				this.gameData.bulletToRemove[this.cloneId]=false;
				this.once[0]=false;
				this.gameData.bulletWait[this.cloneId]=true;
			}else{
				if(this.y>116){
					this.show=false;
					this.once[0]=false;
					if(this.cloneId<2&&this.gameData.bulletActive[this.cloneId]){
						this.gameData.bulletMissCount++;
					}
					this.gameData.bulletActive[this.cloneId]=false;
				}
			}
		}
	}
	return([this.gameFlags,this.gameData]);
}

bullet.prototype.processMain=function(){
	for(var i=0;i<2;i++){
		if(!this.gameData.bulletActive[i]&&!this.gameData.bulletActive[i+2]&&!this.gameData.bulletWait[i]){
			this.gameData.soundStack.push({command:"PLAY",music:"fightershoot"});
			if(this.gameData.shipActive[0]){
				this.gameData.bulletActive[i]=true;
				this.gameData.bulletCount++;
			}
			if(this.gameData.shipActive[1]){
				this.gameData.bulletActive[i+2]=true;
			}
			break;
		}
	}
}
	
