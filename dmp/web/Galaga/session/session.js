// JavaScript Document
function sessionForUser(){
	this.xml=new XMLHttpRequest();
}

sessionForUser.prototype.setORget=function(type,user){
	let q="";
	if(type=="set")
		q="session/session.php?query=newsession&user="+user;
	else if(type=="get")
		q="session/session.php?query=getuser";
	this.xml.open("GET",q,true);
	this.xml.send();
	_this=this;
	return new Promise(function(resolve,reject){
		_this.xml.onloadend=function(){
			if(q!=""){
				if(_this.xml.response.includes("error")||_this.xml.response.includes("Undefined"))
					resolve("");
				else
					resolve(_this.xml.response);
			}else
				resolve("no query");
		}
	});	
}



