// JavaScript Document

function Vector(x,y){
	this.x = x;
	this.y = y;
};

Vector.prototype.sum=function(v1,v2){
	return new Vector(v1.x+v2.x,v1.y+v2.y);
};

Vector.prototype.scalarMult=function(v,s){
	return new Vector(v.x*s,v.y*s);
};
