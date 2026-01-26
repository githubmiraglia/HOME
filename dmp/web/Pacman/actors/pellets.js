// JavaScript Document
//sprite,costume,x,y,vx,vy,rotation,flip,show
function pellet(sprite,costume,x,y,vx,vy,rotation,flip,show,isClone){
	actor.call(this,sprite,costume,x*1.25,y*1.25,vx,vy,rotation,flip,show);  
	this.active=true;
	if(Math.abs(x)==100&&(y==-68||y==92))
		this.costume=1;
	this.lastclock=0;
	this.blink=2;
	this.rotation=0;
	this.isClone=isClone;
	this.var1=0;
	this.var2=0;
	this.var3=0;
	this.setback=0;
}

pellet.prototype = Object.create(actor.prototype);

pellet.prototype.act=function(clock,gameFlags,gameData){
	this.gameFlags=gameFlags;
	this.gameData=gameData;
	if(this.isClone){
		let g=this.gameData.game;
		if((clock-this.lastclock)/(1000/_TICK)>0.15){
			this.blink=mod(this.blink,2)+1;
			this.lastclock=clock;
		}
		if(g!="Pause"){
			if((g=="Play"||g=="Death"||g=="Idle"||(this.costume==0&&g=="Over"))&&this.active)
				this.show=true;
			else
				this.show=false;
		}
		if(this.costume>0&&g=="Play")
			this.costume=this.blink;
		if(g=="Play"&&(Math.abs(this.x-this.gameData.pmX*1.25)<4)&&(Math.abs(this.y-1-this.gameData.pmY*1.25)<4)&&this.active){
			this.active=false;
			this.show=false;
			this.gameData.pellet=clock+Math.floor(0.2*(1000/_TICK));
			this.gameData.pellets-=1;
			this.gameData.score+=10;
			if(this.gameData.pellets==0)
				this.gameFlags.next=true;
			if(this.costume>0){
				if(this.gameData.power<=0)
					this.gameFlags.change=true;
				this.gameData.score+=50;
				if(!(this.gameData.level>18||this.gameData.level==17)){
					this.gameData.once[0]=false;
					this.gameData.power=1;
					this.gameFlags.power=true;
					for(let i=0;i<this.gameData.alreadyDied.length;i++)
						this.gameData.alreadyDied[i]=false;
				}
			}
			this.gameFlags.chomp=true;
			this.active=false;
		}
	}else if(this.gameFlags.power)
		this.power(clock);
	return [this.gameFlags,this.gameData];
}


pellet.prototype.power=function(clock){
	if(!this.isClone){
		let g=this.gameData.game;
		if(!this.gameData.once[0]){
			this.gameData.once[0]=true;
			let l=this.gameData.level;
			if(l<6)
				this.gameData.timer=7-l;
			else if(l==6||l==10)
				this.gameData.timer=5
			else if(l==7||l==8||l==11)
				this.gameData.timer=2;
			else if(l==14)
				this.gameData.timer=3
			else
				this.gameData.timer=1;
			this.gameData.count=0;
			this.var1=clock;
			this.setback=0;
		}
		if(this.gameData.power>0){
			this.gameData.power=this.gameData.timer-(clock-this.var1)/(1000/_TICK)+this.setback;			
			if(this.gameData.power<(5/3)&&!this.gameFlags.intermission){
				this.gameData.blink=mod(Math.ceil(this.gameData.power*5),2)*2;
			}else
				this.gameData.blink=0;
			if(g=="Pause"||g=="Death"){
				this.var2=clock/(1000/_TICK);
				this.var3=this.setback;
				this.setback=clock/(1000/_TICK)+this.var3-this.var2;
			}else if(g!="Play"){			
				this.gameData.power=0;
			}
		}else{
			this.gameData.once[0]=false;
			this.once[1]=false;
			this.gameFlags.power=false;
		}
	}
}

