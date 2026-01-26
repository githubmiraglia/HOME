// JavaScript Document
function bomb(sprite,costume,x,y,vx,vy,rotation,flip,js,show,isClone,cloneId){
	actor.call(this,sprite,costume,x,y,vx,vy,rotation,flip,js,show);  
	this.isClone = isClone;
	if(this.isClone)
		this.cloneId = cloneId;
	else
		this.cloneId="NaN";
	this.once=[false,false,false,false];
};

bomb.prototype = Object.create(actor.prototype);

bomb.prototype.act = function(clock,gameFlags,gameData){
	this.gameFlags = gameFlags;
	this.gameData = gameData;
	
	if(!this.isClone){
		if(!this.once[0]){
			this.once[0]=true;
			this.gameData.bombCount=0;
			this.gameData.bombX=[];
			this.gameData.bombY=[];
		}
		this.createBombs();
	}else{
		if(!this.once[1]){
			this.once[1]=true;
			this.gameData.bombCount++;
		}
		if(!this.touchingEdge()){
			this.move(4);
			if(Math.abs(this.y-this.gameData.mainShipY)<8){
				var t1 = 16*(this.gameData.shipActive[0]?0:1);
				var t2 = 16*(this.gameData.shipActive[1]?0:1);
				if((this.x>(this.gameData.mainShipX-14+t1))&&(this.x<(this.gameData.mainShipX+14-t2))&&(!this.gameFlags.shipDies)){
					if(this.x<this.gameData.mainShipX){
						this.gameData.shipHit[0]=true;
						this.deleteThisActor=true;
						this.gameData.bombCount--;
					}
					else{
						this.gameData.shipHit[1]=true;
						this.deleteThisActor=true;
						this.gameData.bombCount--;
					}
				}
			}
		}else{
			this.gameData.bombCount--;
			this.deleteThisActor=true;
		}
	}
	return([this.gameFlags,this.gameData]);
}

bomb.prototype.createBombs=function(){
	var len=this.gameData.bombX.length;
	if(len>0){
		this.turnTorwardsDelta(this.gameData.mainShipX+((this.gameData.shipActive[0]?-1:0)+(this.gameData.shipActive[1]?1:0))*8-this.gameData.bombX[len-1],this.gameData.mainShipY-this.gameData.bombY[len-1],10);
		this.gameData.newBombX=this.gameData.bombX[len-1];
		this.gameData.newBombY=this.gameData.bombY[len-1];
		this.gameData.newBombR=this.rotation;
		this.gameFlags.createNewBomb=true;
		this.gameData.bombX.pop();
		this.gameData.bombY.pop();
	}
}


bomb.prototype.touchingEdge=function(){
	if(Math.abs(this.x)>233||Math.abs(this.y)>175)
		return true;
	else
		return false;
}

bomb.prototype.turnTorwardsDelta=function(deltaX,deltaY,maxTurn){
	this.rotation=Math.atan(deltaX/deltaY)*180/Math.PI+180*((deltaY<0)?1:0);
	this.rotation=this.rotation%360;
	if(Math.abs(this.rotation-180)>maxTurn)
		this.rotation=180+((this.rotation-180)/(Math.abs(this.rotation-180)))*maxTurn;
	this.rotation+=270; //hack for alliens sprites
}

bomb.prototype.move=function(steps){
	this.x+=steps*Math.sin(Math.PI/180*(this.rotation-270));
	this.y+=steps*Math.cos(Math.PI/180*(this.rotation-270));
}
