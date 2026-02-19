// JavaScript Document
function xBoxGamepad(index){
	this.index=index;
	this.deadZone = 0.1;
	this.buttonsMapping={
		0:"a",
		1:"b",
		2:"x",
		3:"y",
		4:"lb",
		5:"rb",
		6:"lt",
		7:"rt",
		8:"back",
		9:"start",
		12:"dUp",
		13:"dDown",
		14:"dLeft",
		15:"dRight"		
	};
	this.axesMapping={
		0:"ulHori",
		1:"ulVert",
		2:"drHori",
		3:"drVert"
	};
	this.buttons={
		a:false,
		b:false,
		x:false,
		y:false,
		lb:false,
		rb:false,
		lt:0,
		rt:0,
		back:false,
		start:false,
		dUp:false,
		dDown:false,
		dLeft:false,
		dRight:false,
	};
	this.axes={
		ulHori:0,
		ulVert:0,
		drHori:0,
		drVert:0
		
	};
}

function gamePads(){
	this.once=[false,false,false,false];
	this.numberGPs=0;
	this.gps = [];
	this.pressed = false;
	this.change=false;
};


gamePads.prototype.checkGamePad = function(){
	if(!this.once[0]){
		this.once[0]=true;
		var gaPads = this;
		var count=0;
		var foundIt=false;
		var interval = setInterval(function(){
			gp=navigator.getGamepads();
			if(gp){
				for (var i=0;i<gp.length;i++){
					if(gp[i]!=null){
						gaPads.gps[i] = new xBoxGamepad(gp[i].index);
						gaPads.numberGPs++;
						foundIt=true;
					}
				}
				if(foundIt){
					clearInterval(interval);
					GlobalGamepadsConnected = true;
				}
			}
		},47);
	}
};
	
gamePads.prototype.read = function(){
	this.change=false;
	for(var i=0;i<this.numberGPs;i++){
		var gpi = this.gps[i];
		var gpCheck =  navigator.getGamepads()[gpi.index];
		for(var j=0;j<16;j++){
			if(gpCheck.buttons[j].pressed){
				if(gpi.buttonsMapping[j]=="lt"||gpi.buttonsMapping[j]=="rt"){
					if(Math.abs(gpCheck.buttons[j].value)>gpi.deadZone){
						gpi.buttons[gpi.buttonsMapping[j]]=gpCheck.buttons[j].value;
					}
				}
				else{
					gpi.buttons[gpi.buttonsMapping[j]]=true;
				}
				this.change=true;
			}else{
				if(gpi.buttonsMapping[j]=="lt"||gpi.buttonsMapping[j]=="rt")
					gpi.buttons[gpi.buttonsMapping[j]]=0;
				else
					gpi.buttons[gpi.buttonsMapping[j]]=false;
			}	
		}
		for(var j=0;j<4;j++){
			if(Math.abs(gpCheck.axes[j])>gpi.deadZone){
				gpi.axes[gpi.axesMapping[j]]=gpCheck.axes[j];
				this.change=true;
			}
			else
				gpi.axes[gpi.axesMapping[j]]=0;
		}
	}
};
					   
