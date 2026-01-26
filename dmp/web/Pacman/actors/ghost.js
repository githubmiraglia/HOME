// JavaScript Document
function ghost(sprite,costume,x,y,vx,vy,rotation,flip,show,am,gx,gy){
	actor.call(this,sprite,costume,x,y,vx,vy,rotation,flip,show);  
	this.active=true;
	this.turnaround=false;
	this.stop=false;
	this.listvar="";
	this.distances=[];
	this.directions=[];
	this.k=1;
	this.gx=gx;
	this.gy=gy;
	this.x=this.gx*1.25;
	this.y=this.gy*1.25;
	this.am=am;
	this.elapsed=0;
}

ghost.prototype = Object.create(actor.prototype);

ghost.prototype.ghostAct=function(clock,gameFlags,gameData){
	this.gameFlags=gameFlags;
	this.gameData=gameData;
	if(this.gameData.power>0&&this.status!="Home"&&!this.gameData.alreadyDied[this.id])
		this.power();
	if(this.gameData.power<=0){
		this.gameData.alreadyDied[this.id]=false;
	}
	if(this.gameData.power<=0&&this.status=="Scared"&&!this.gameFlags.intermission)
		this.status="Alive";
	if(this.gameFlags.change)
		this.change();
	this.costumes(clock);
}

ghost.prototype.change=function(){
	 this.turnaround=true;
	 this.gameFlags.change=false;
}

ghost.prototype.power=function(){
	if(!(this.status=="Dead"||this.status=="Home"||this.status=="Dying")){
		this.status="Scared";
	}
}


ghost.prototype.setRandDir=function(direction){
	let count=0;
	let choice=Math.floor(Math.random()*this.listvar.length);
	this.newdirection=(parseInt(this.listvar.charAt(choice),10));
	while(Math.abs(this.newdirection-direction)==2&&count<1000){
		choice=Math.floor(Math.random()*this.listvar.length);
		this.newdirection=(parseInt(this.listvar.charAt(choice),10));
		count++;
	}
	if(count>900)
		console.log(this.listvar,direction);
	this.direction=this.newdirection;
}

ghost.prototype.turn=function(x,y){
	this.distances=[];
	this.directions=[];
	let var1=0;
	for(let i=0;i<this.listvar.length;i++){
		this.directions.push(this.listvar.charAt(i));
	}
	let xdist=Math.pow(this.gx-x,2);
	let ydist=Math.pow(this.gy-y,2);
	if(this.directions.includes("1")&&this.direction!=3)
		this.distances.push(Math.sqrt(Math.pow((this.gx-8-x),2)+ydist));
	else
		this.distances.push(1000);
	if(this.directions.includes("2")&&this.direction!=4)
		this.distances.push(Math.sqrt(Math.pow((this.gy+8-y),2)+xdist));
	else
		this.distances.push(1000);
	if(this.directions.includes("3")&&this.direction!=1)
		this.distances.push(Math.sqrt(Math.pow((this.gx+8-x),2)+ydist));
	else
		this.distances.push(1000);
	if(this.directions.includes("4")&&this.direction!=2)
		this.distances.push(Math.sqrt(Math.pow((this.gy-8-y),2)+xdist));
	else
		this.distances.push(1000);
	this.directions=[];
	if(this.distances[2]<this.distances[3]){
		this.distances.splice(3,1);
		this.directions.push(4);
		var1=3;
	}else{
		this.distances.splice(2,1);
		this.directions.push(3);
		var1=4;
	}
	if(this.distances[1]<this.distances[2]){
		this.distances.splice(2,1);
		this.directions.push(var1);
		var1=2;
	}else{
		this.distances.splice(1,1);
		this.directions.push(2);
	}
	if(this.distances[0]<this.distances[1]){
		this.distances.splice(1,1);
		this.directions.push(var1);
		this.directions.push(1);
	}else{
		this.distances.splice(0,1);
		this.directions.push(1);
		this.directions.push(var1);
	}
	this.direction=this.directions[this.directions.length-1];
}			

ghost.prototype.costumes=function(clock){
	let v=this.gameData.volume;
	let g=this.gameData.game;
	this.x=this.gx*1.25;
	this.y=this.gy*1.25;
	this.gameData.wiggle=Math.floor(mod(clock,8)/4);
	if(g=="Idle"){
		this.costume=0;
	}else{
		if(this.status=="Scared"){
			if(!this.stop)
				this.costume=this.gameData.wiggle+this.gameData.blink+8;
		}else{
			if(this.status=="Dead")
				this.costume=this.direction+11;
			else if(this.status!="Dying"){
				this.costume=this.direction+this.gameData.wiggle*4-1;				
			}
		}
	}
	if(g=="Options"||g=="Interchange"||g=="Death"||g=="Over"||g=="Scoreboard"||g=="High Scores"){
		this.show=false;
		this.active=false;
	}else{
		this.show=true;
		this.active=true;
	}
	if(g=="Play"&&g!="Dead"&&g!="Dying"&&(Math.abs(this.gx-this.gameData.pmX)+Math.abs(this.gy-this.gameData.pmY))<6){
		if(this.status=="Scared"){
			this.gameData.count++;
			this.gameData.game="Pause";
			this.status="Dying";
			this.gameData.score+=this.gameData.ghostvalues[this.gameData.count-1];
			this.show=true;
			this.costume=this.gameData.count+15;
			this.gameData.soundStack.push({command:"PLAY",music:"omnom",volume:0.25});
			this.gameData.soundStack.push({command:"STOPALL",music:""});
			this.once[0]=true;
			this.elapsed=0;
		}else if(this.status!="Dying"&&this.status!="Dead"){
			this.gameFlags.die=true;
			//this.show=false;
		}
	}
	if(this.status=="Dying"&&!this.once[0]){ 
		this.elapsed++;
		if(this.am.checkEnded("omnom")||this.elapsed>(Math.floor(0.57/(_TICK/1000)))){
			this.status="Dead";
			this.gameData.game="Play";
		}
	}
	this.once[0]=false;
}



