// JavaScript Document

function setWindow(platform,players,player){
	_WIDTH = _GAMEWIDTH;
	_HEIGHT = _GAMEHEIGHT;
	var w = window.innerWidth;
	var h = window.innerHeight;
	if(players==2&&!_CHOSEJS)
		w=Math.floor(w/2)-10;
	var innerH = h;
	var innerW = w;
	var wScale = w/_WIDTH;
	var hScale = h/_HEIGHT;
	if (wScale<hScale)
		var scale = wScale;
	else
		var scale = hScale;
	w = Math.floor(_WIDTH*scale);
	h = Math.floor(_HEIGHT*scale);
	_R = (70*scale>=70)?70:Math.floor(70*scale);
	if((innerH-h)<Math.floor(126*_R/100+10*scale)){
		h = innerH - Math.floor(126*_R/100+15*scale);
		wScale = w/_WIDTH;
		hScale = h/_HEIGHT;
		if (wScale<hScale)
			var scale = wScale;
		else
			var scale = hScale;
		_R = (70*scale>=70)?70:Math.floor(70*scale);
	}
	_SCALE = scale;
	_WIDTH = Math.floor(_WIDTH*_SCALE);
	_HEIGHT = Math.floor(_HEIGHT*_SCALE);
	var paddngW = Math.floor((innerW - _WIDTH)/2);
	var paddngH = Math.floor((innerH-_HEIGHT)*(1/3));
	document.body.style.backgroundColor="#1e1e2f";
	if(_WAIT){
		document.getElementById("wait").style.display="block";
		_WAIT=false;
	}	
	document.body.style.margin="0px";
	document.body.style.padding="0px";
	if(!platform.touchScreen)
		document.body.style.paddingTop=paddngH+"px";
	else
		document.body.style.paddingTop="2px";
	var container=document.getElementById("container");
	if(platform.touchScreen)
		return(paddngW);
	else{
		container.style.overflow="auto";
		return(Math.max(5,paddngW)); 
	}
}

function getText(id,src){
    var req = new XMLHttpRequest();
    req.open("GET",src,true);
    req.send(null);
	var ret = [];
	req.onload=function(){
        _LOADEDELEMENTS.push(id);
        _RETURNTEXT[id] = req.responseText.split("\n");
	};
}


function setPlatform(){
	var platform={};
	platform.navigator = navigator.platform;
	platform.touchScreen =  touchScreenAvailable(); 
	return(platform);
}


function touchScreenAvailable()
{
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

}

function wait(){
	this.clockZero = 0;
	this.wait = 0;
	this.count=0;
	this.once=[false,false,false,false];
}

wait.prototype.set = function(clock,wait){
	if(!this.once[0]){
		this.once[0]=true;
		this.clockZero = clock;
		this.wait = wait;
	}
}

wait.prototype.Wait = function(clock,callback){
	if((clock - this.clockZero)>(this.wait/(_TICK/1000))){
		this.count++
		if(this.count>1)
			this.once[1]=true;
		callback();
	}
}

wait.prototype.Once = function(){
	return this.once[1];
}

wait.prototype.waitUntil=function(cond,callback){
	if(!this.once[2]){
		if(cond){
			this.once[2]=true;
			callback();
		}else
			return;
	}else
		callback();
}

wait.prototype.repeatUntil=function(cond,callback1,callback2){
	if(!this.once[3]){
		if(cond){
			this.once[3]=true;
			return;
		}else
			callback1();
	}else
		callback2();
}

wait.prototype.reset=function(){
	this.clockZero = 0;
	this.wait = 0;
	this.count=0;
	this.once=[false,false,false,false];
}


function mod(n1,n2){
	let r=n1%n2;
	return(n1<0&&r!=0)?n2+r:r;
}

