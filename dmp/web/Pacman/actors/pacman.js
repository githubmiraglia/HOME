// JavaScript Document

function pacman(sprite,costume,x,y,vx,vy,rotation,flip,show,js,jselect,am){
	actor.call(this,sprite,costume,x*1.25,y*1.25,vx,vy,rotation,flip,show);  
	this.active=true;
	this.stuck=false;
	this.direction=1;
	this.newdirection=1;
	this.js=js;
	this.jselect=jselect;
	this.xlistPos=0;
	this.ylistPos=0;
	this.var2=false;
	this.speed=1.58;
	this.turning=false;
	this.tIntermission=0;
	this.tIntcount=0;
	this.addCostume=0;
	this.am=am;
}

pacman.prototype = Object.create(actor.prototype);

pacman.prototype.act=function(clock,gameFlags,gameData){
	this.gameFlags=gameFlags;
	this.gameData=gameData;
	let g=this.gameData.game;
	if(!this.gameFlags.die)
		this.pmManage(g);
	if(!this.gameFlags.intermission&&!this.gameFlags.die&&!this.gameData.turn)
		this.changedir(g);
	if(this.gameData.turn&&!this.gameFlags.intermission&&!this.gameFlags.die){
		this.processTurn(g,clock)
	}else if(this.gameFlags.intermission){
		this.intermission(clock);
	}else if(this.gameFlags.die){
		this.show=true;
	}else{
		if(g=="Play"){
			if((!this.stuck&&(mod(this.gameData.pmX-4,8)==0||mod(this.gameData.pmY-4,8)==0))&&!this.gameFlags.intermission){
				this.move(clock);
			}
			this.xlistPos=mod(this.gameData.pmX-4,8);
			this.ylistPos=mod(this.gameData.pmY-4,8);
			if(!(this.newdirection==this.direction||Math.abs(this.gameData.pmX)>100)){
				this.checkTurn();
			}
			if(mod(this.gameData.pmX+4,8)==0&&mod(this.gameData.pmY-4,8)==0&&(Math.abs(this.gameData.pmX)<=100)){
					this.checkTurn();
			}else
				this.stuck=false;
		}
	}
	this.gameData.pmDirection=this.direction;
	return [this.gameFlags,this.gameData];
}

pacman.prototype.processTurn=function(g,clock){
	if(this.ylistPos==0&&this.xlistPos==0){
		this.gameData.turn=false;
	}
	if(this.direction==1||this.direction==3){
		if(this.ylistPos!=0){
			if(g=="Play"){
				this.move(clock);
				if(this.ylistPos<this.speed){
					this.gameData.pmY+=this.ylistPos*-1;
				}else{
					if(this.ylistPos>(8-this.speed)){
						this.gameData.pmY+=8-this.ylistPos;
					}else{
						if(this.ylistPos>4){
							this.gameData.pmY+=this.speed;
						}else{
							this.gameData.pmY+=this.speed*-1;
						}
					}
				}
				this.ylistPos=mod(this.gameData.pmY-4,8);
			}
		}
	}else{
		if(this.xlistPos!=0){
			if(g=="Play"){
				this.move(clock);
				if(this.xlistPos<this.speed){
					this.gameData.pmX+=this.xlistPos*-1;
				}
				else{
					if(this.xlistPos>(8-this.speed)){
						this.gameData.pmX+=8-this.xlistPos;
					}else{
						if(this.xlistPos>4){
							this.gameData.pmX+=this.speed;
						}else{
							this.gameData.pmX+=this.speed*-1;
						}
					}
				}
				this.xlistPos=mod(this.gameData.pmX+4,8);
			}
		}
	}
}

pacman.prototype.pmManage=function(g){
	if(g=="Play"||g=="Idle"){
		this.show=true;
		this.active=true;
		if(g!="Idle"){
			if(!this.stuck)
				this.gameData.open+=this.gameData.openchange;
			if(this.gameData.open==0)
				this.gameData.openchange=1;
			if(this.gameData.open>1)
				this.gameData.openchange=-1;
		//	this.gameData.pmX=100;
		//	this.gameData.pmY=-44;
		//	this.direction=2;			
			this.x=this.gameData.pmX*1.25;
			this.y=this.gameData.pmY*1.25;
			let n1 = Math.ceil((this.gameData.pmX+112)/8)+Math.floor((112-this.gameData.pmY)/8)*28;
			if(!this.stuck){
				this.costume=this.gameData.open+this.addCostume;
			}
			else
				this.costume=1+this.addCostume;
			if(!this.gameData.turn)
				this.rotation=(this.direction-3)*90;
		}
	}else if(g=="Death"	){
		var a=1;
		//this.show=true;
		//this.active=true;
	}else{
		this.show=false;
		this.active=false;
	}
}

pacman.prototype.changedir=function(g){
	this.js.readJoystick(this.jselect);
	if(this.js.left)
		this.newdirection=1;
	else if(this.js.right)
		this.newdirection=3;
	else if(this.js.up)
		this.newdirection=2;
	else if(this.js.down)
		this.newdirection=4;
	if(g=="Play"&&Math.abs(this.newdirection-this.direction)==2){
		this.direction=this.newdirection;
	}
}

pacman.prototype.checkTurn=function(){
	this.checkTurnBlock(Math.ceil((this.gameData.pmX+112)/8)+Math.floor((112-this.gameData.pmY)/8)*28,this.newdirection);
	if(this.var2){
		this.gameData.turn=true;
		this.direction=this.newdirection;
	}
	this.checkTurnBlock(Math.ceil((this.gameData.pmX+112)/8)+Math.floor((112-this.gameData.pmY)/8)*28,this.direction);
	if(this.var2)
		this.stuck=false;
	else{
		this.stuck=true;
		this.adjustPM();
	}
}

pacman.prototype.adjustPM=function(){
	if(mod(this.pmX-4,8)==0||mod(this.pmY-4,8)==0)
		return;
	if(mod(this.pmX-4,8)==0)
		this.gameData.pmY=this.calcAdjustedPos(this.gameData.pmY);
	else 
		this.gameData.pmX=this.calcAdjustedPos(this.gameData.pmX);
}

pacman.prototype.calcAdjustedPos=function(p){
	while(mod(p-4,8)!=0){
		p=Math.round(p*100)/100+0.01
	}
	return(p);
}

pacman.prototype.checkTurnBlock=function(n1,n2){
	this.var2=false;
	for(let i=0;i<4;i++){
		if(this.gameData.grid[n1+111].charAt(i)==n2)
			this.var2=true;
	}
}

pacman.prototype.move=function(clock){
	this.move1(clock);
	this.speed=this.speed*this.gameData.multiplier*1.1;
	this.move2();
	this.move3();
}

pacman.prototype.move1=function(clock){
	if(this.gameData.level==1){
		if(this.gameData.power>0){
			if(clock>this.gameData.pellet||clock==0)
				this.speed=1.8;
			else
				this.speed=1.58;
		}else{
			if(clock>this.gameData.pellet||clock==0)
				this.speed=1.6;
			else{
				this.speed=1.42;
			}
		}
	}else{
		if(this.gameData.level<5||this.gameData.level>20){
			if(this.gameData.power>0){
				if(clock>this.gameData.pellet||clock==0)
					this.speed=1.9;
				else
					this.speed=1.66;
			}else{
				if(clock>this.gameData.pellet||clock==0)
					this.speed=1.8;
				else
					this.speed=1.58;
				
			}
		}else{
			if(clock>this.gameData.pellet||clock==0)
				this.speed=2;
			else
				this.speed=1.74;
		}
	}
}

pacman.prototype.move2=function(){
	if(this.direction==1){
		this.gameData.pmX+=this.speed*-1;
		if(this.gameData.pmX<-115)
			this.gameData.pmX=116;
	}
	if(this.direction==2){
		this.gameData.pmY+=this.speed;
	}
	if(this.direction==3){
		this.gameData.pmX+=this.speed;
		if(this.gameData.pmX>115)
			this.gameData.pmX=-116;
	}
	if(this.direction==4){
		this.gameData.pmY+=this.speed*-1;
	}
}

pacman.prototype.move3=function(){
	
	if(!(this.gameData.pmY==4&&Math.abs(this.gameData.pmX)>80)&&(mod(this.gameData.pmY-4,8)==0)&&((mod(this.gameData.pmX+4,8)<=(this.speed+0.0000001))||(mod(this.gameData.pmX+4,8)>=(8-this.speed-0.0000001)))){
		this.checkTurnBlock(Math.ceil((Math.round((this.gameData.pmX+4)/8)*8+108)/8)+Math.floor((112-this.gameData.pmY)/8)*28,this.direction);
		if(!this.var2){
			this.gameData.pmX=Math.round((this.gameData.pmX+4)/8)*8-4;
		}
	}
	if(!(this.gameData.pmY==4&&Math.abs(this.gameData.pmX)>80)&&(mod(this.gameData.pmX+4,8)==0)&&((mod(this.gameData.pmY-4,8)<=(this.speed+0.0000001))||(mod(this.gameData.pmY-4,8)>=(8-this.speed-0.0000001)))){
		this.checkTurnBlock(Math.ceil((this.gameData.pmX+112)/8)+Math.floor((108-Math.round((this.gameData.pmY-4)/8)*8)/8)*28,this.direction);
		if(!this.var2){
			this.gameData.pmY=Math.round((this.gameData.pmY-4)/8)*8+4;
		}
	}
}

pacman.prototype.intermission=function(clock){
	if(!this.once[0]){
		this.once[0]=true;
		this.gameData.pmX=122;
		this.gameData.pmY=0;
		this.direction=1;
		this.newdirection=1;
		this.stuck=false;
		this.tIntcounter=0;
		this.addCostume=0;
		this.gameData.soundStack.push({command:"PLAY",music:"intermission",volume:0.3});
		this.gameData.soundStack.push({command:"STOPALL",music:""});
		this.gameData.soundStack = this.am.playStack(this.gameData.soundStack);
	}	
	if(this.tIntcounter<=149){
		this.gameData.pmX-=2.4;
		this.tIntermission=clock;
		this.tIntcounter++;
	}else{
		if(((clock-this.tIntermission)/(1000/_TICK))>0.2){
			if(!this.once[1]){
				this.once[1]=true;
				this.gameData.pmY=6;
				this.direction=3;
				this.newdirection=3;
				this.addCostume=3;
				this.gameData.soundStack.push({command:"PLAY",music:"intermission",volume:0.3});
				this.gameData.soundStack.push({command:"STOPALL",music:""});
				this.gameData.soundStack = this.am.playStack(this.gameData.soundStack);
			}
			if(this.tIntcounter<=309){
				this.gameData.pmX+=2.36;
				this.tIntcounter++;
			}else{
				this.gameFlags.intermissionEnded=true;
				this.once[0]=false;
				this.once[1]=false;
				this.addCostume=0;
			}
		}
	}
}

