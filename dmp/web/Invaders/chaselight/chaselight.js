// JavaScript Document
function chaselight(cd,x,y,w,h,s){
	this.cd=cd;
	this.side=Math.floor(8/1);
	this.x=Math.floor(x/s);
	this.y=Math.floor(y/s);
	this.w=Math.floor(w/s-2*this.x);
	this.h=Math.floor(h/s-2*this.y);
	this.nlightsW=Math.floor(this.w/this.side/3)*3;
	this.paddingW=(this.w-this.nlightsW*this.side)/this.nlightsW;
	this.nlightsH=Math.floor(this.h/this.side/3)*3;
	this.paddingH=(this.h-this.nlightsH*this.side)/this.nlightsH;
	this.ind=0;
}

chaselight.prototype.resize=function(w,h,s){
	this.w=Math.floor(w/s-2*this.x);
	this.h=Math.floor(h/s-2*this.y);
	this.nlightsW=Math.floor(this.w/this.side/3)*3;
	this.paddingW=(this.w-this.nlightsW*this.side)/this.nlightsW;
	this.nlightsH=Math.floor(this.h/this.side/3)*3;
	this.paddingH=(this.h-this.nlightsH*this.side)/this.nlightsH;
}

chaselight.prototype.runChaseLight=function(clock){
	var xfinal=(this.nlightsW-1)*(this.side+this.paddingW)+this.x;
	var yfinal=(this.nlightsH-1)*(this.side+this.paddingH)+this.y
		this.cd.cx.fillStyle="red";
		var y=(this.nlightsH-1)*(this.side+this.paddingH)+this.y
		for (var i=0;i<this.nlightsW/3;i++){
			var x=this.x+(i*3+this.ind%3)*(this.side+this.paddingW);
			var xrev=xfinal-x+this.x;
			this.cd.cx.fillRect(x,this.y,this.side,this.side);
			this.cd.cx.fillRect(xrev,y,this.side,this.side);
		}
		for (var i=0;i<this.nlightsH/3;i++){
			var y=this.y+(i*3+(this.ind+1)%3)*(this.side+this.paddingH);
			var yrev=yfinal-y+this.y;
			this.cd.cx.fillRect(xfinal,y,this.side,this.side);
			this.cd.cx.fillRect(this.x,yrev,this.side,this.side);
		}
		if(clock%3==0)
			this.ind++;
}
