// JavaScript Document
function saucer(sprite,costume,x,y,vx,vy,rotation,flip,show){
	actor.call(this,sprite,costume,x,y,vx,vy,rotation,flip,show);  
	this.resetSaucer(0);
	this.score=0;
}

saucer.prototype = Object.create(actor.prototype);

saucer.prototype.resetSaucer=function(clock){
	this.nextTimeMove=clock+(Math.random()*10+10)*1000/_TICK;
	this.exploding=false;
	this.active=false;
	this.show=false;
	this.explosionCount=40;
	this.direction=(Math.floor(Math.random()*2)==0)?4:-4;
	if(this.direction>0)
		this.x=-210;
	else
		this.x=210;	
}

saucer.prototype.act=function(clock,gameFlags,gameData){
	this.gameFlags=gameFlags;
	this.gameData=gameData;
	if(clock>this.nextTimeMove){
		this.gameData.soundStack.push({command:"PLAYTOEND",music:"ufo_highpitch_looped",volume:0.30});
		this.active=true;
		this.nextTimeMove=999999999999999999999999;
	}
	if(!this.gameFlags.pausedForPlayerExplosion){
		if(!this.exploding){
			if(this.active){
				this.x+=this.direction;
				if(Math.abs(this.x)>210){
					this.resetSaucer(clock);
					this.gameData.soundStack.push({command:"STOP",music:"ufo_highpitch_looped"});
				}
			}
		}
	}
	if(checkCollision(this.x,this.y,this.gameData.bulletX,this.gameData.bulletY,16)){
		this.score=Math.floor(Math.random()*3)+1;
		this.gameData.score+=this.score*100;
		this.exploding=true;
		this.gameData.soundStack.push({command:"PLAYTOEND",music:"ufo_lowpitch",volume:0.30});
		this.gameData.soundStack.push({command:"STOP",music:"ufo_highpitch_looped"});
		this.gameFlags.removebullet=true;
	}
	if(this.active&&!this.exploding){
		this.costume=0;
		this.show=true;
	}else if(this.exploding){
		this.costume=this.score;
		this.explosionCount--;
		if(this.explosionCount<=0){
			this.resetSaucer(clock);
		}
	}
	return([this.gameFlags,this.gameData]);
}
