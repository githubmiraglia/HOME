// JavaScript Document


function actor(sprite,costume,x,y,vx,vy,rotation,flip,js,show){
	this.sprite = sprite;
	this.costume = costume;
	this.x = x;
	this.y = y;
	this.vx=vx;
	this.vy=vy;
	this.rotation = rotation;
	this.flip = flip;
	this.js=js;
	this.show=show;
    this.gameData={}
    this.gameFlags={};
    this.deleteThisActor=false;
};


actor.prototype.change=function(attr,x,y){
	if (attr == "pos"){
		this.x+=x;
		if(y)
			this.y+=y;
	}
	else if (attr == "vel"){
		this.vx+=x;
		if(y)
			this.vy+=y;
	}
	else if (attr =="rotation")
		this.rotation+=x;
}


actor.prototype.set=function(attr,x,y){
	if (attr=="pos"){
		this.x=x;
		if(y)
			this.y=y;
	}
	else if (attr=="vel"){
		this.vx=x;
		if(y)
			this.vy=y;
	}
    else if (attr=="rotation")
        this.rotation=x;
	else if (atr=="costume")
		this.costume=x;
	else if (attr=="flip")
		this.flip=x;
};

actor.prototype.act=function(){
	return;
}
