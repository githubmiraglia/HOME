

function actor(sprite,costume,pos,vel,rotation,flip){
	this.sprite = sprite;
	this.costume = costume;
	this.pos = pos;
	this.vel = vel;
	this.rotation = rotation;
	this.flip = flip;
    this.gameData={}
    this.gameFlags={};
    this.deleteThisActor=false;
};


actor.prototype.change=function(attr,v){
	if(attr=="costume")
		this.costume = v;
	else if (attr == "pos"){
		try{
			this.pos = this.pos.sum(this.pos,v);
		}catch(e){
			console.log("POS Vector",this.pos,e);
		}
	}
	else if (attr == "vel")
		this.vel = this.vel.sum(this.vel,v);
	else if (attr =="rotation")
		this.rotation = this.rotation+v;
	else if (attr == "flip")
		this.flip = v;
};


actor.prototype.set=function(attr,v){
	if (attr == "pos")
		this.pos = v;
	else if (attr == "vel")
		this.vel = v;
    else if (attr == "rotation")
        this.rotation = v;
};


actor.prototype.act = function(level,step){
	return;
};
