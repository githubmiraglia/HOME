// JavaScript Document
function joystick(platform,jSprite,leftPaddng){
	
	if(!_REPLAY){
		if(!platform.touchScreen)
			s1 = new createScripts("js1",_ROOT+"/joystick/gamepads.js");
		s2 = new createScripts("js2",_ROOT+"/joystick/keyboard.js");
		s3 = new createScripts("js3",_ROOT+"/joystick/virtualJoystick.js");
	}
	this.loaded=false;
	
	var interval = setInterval(function(){
		if(!platform.touchScreen)
			var check = ["js1","js2","js3"];
		else
			var check = ["js2","js3"];
		if (checkLoaded(check)||_REPLAY){
			clearInterval(interval)
			this.platform = platform;
			this.jUsed=null;
			this.up=false;
			this.down=false;
			this.left=false;
			this.right=false;
			this.fire=false;
			this.touchedOnce=false;
			this.kbPressed = [{"exit":false,"left":false,"right":false,"up":false,"down":false,"fire":false},{"exit":false,"left":false,"right":false,"up":false,"down":false,"fire":false}]
			this.gpPressed = {"exit":false,"left":false,"right":false,"up":false,"down":false,"fire":false};
			this.vjPressed = {"left":false,"right":false,"up":false,"down":false,"fire":false};
			this.vJoystick = null;
			this.vFire = null;
			this.gamepads=null;
			this.keyboard=null;
			if(!platform.touchScreen){
	   			this.gamepads = new gamePads();
	   			this.keyboard = new keyboard(this.kbPressed);
				this.loaded=true;
			}else{
	   			this.createVJoystick(leftPaddng);
				var interval_2=setInterval(function(){
					if(vJoystick&&vFire){
						this.createThumbnails(jSprite.img);
						clearInterval(interval_2);
						this.loaded=true;
					}
						
				}.bind(this),67);
			}
		}
	}.bind(this),53)
}


joystick.prototype.readJoystick=function(jSelect){
		
	if(jSelect!=0&&(!jSelect||jSelect==""))
		jSelect=4;

	this.gpPressed = {"exit":false,"left":false,"right":false,"up":false,"down":false,"fire":false};
	this.vjPressed = {"left":false,"right":false,"up":false,"down":false,"fire":false};
	this.jUsed=null;
	
	if(!this.platform.touchScreen){
		if(this.gamepads.numberGPs>0){
			this.gamepads.read();
			for(var i=0;i<this.gamepads.numberGPs;i++){
				if(i==jSelect||jSelect==4){
					gpi = this.gamepads.gps[i];
					if(gpi.axes.ulHori<0||gpi.axes.drHori<0||gpi.buttons.dLeft){
						this.gpPressed["left"]=true; 
						this.jUsed=i;
					}
					if(gpi.axes.ulHori>0||gpi.axes.drHori>0||gpi.buttons.dRight){
						this.gpPressed["right"]=true;
						this.jUsed=i;
					}
					if(gpi.axes.ulVert<0||gpi.axes.drVert<0||gpi.buttons.dUp){
						this.gpPressed["up"]=true;
						this.jUsed=i;
					}
					if(gpi.axes.ulVert>0||gpi.axes.drVert>0||gpi.buttons.dDown){
						this.gpPressed["down"]=true;
						this.jUsed=i;
					}
					if(gpi.buttons.a||gpi.buttons.x||gpi.buttons.y||gpi.buttons.rb){
						this.gpPressed["fire"]=true;
						this.jUsed=i;
					}
					if(gpi.buttons.b){
						this.gpPressed["exit"]=true;
						this.jUsed=i;
					}
				}
			}
		}
	}
	if(this.platform.touchScreen){
		if(this.vJoystick.left())
			this.vjPressed["left"]=true;
		if(this.vJoystick.right())
			this.vjPressed["right"]=true;
		if(this.vJoystick.up())
			this.vjPressed["up"]=true;
		if(this.vJoystick.down())
			this.vjPressed["down"]=true;
		if(this.vFire.fire())
			this.vjPressed["fire"]=true;
	}
	
	if(this.kbPressed[0].left||this.kbPressed[0].up||this.kbPressed[0].down||this.kbPressed[0].right||this.kbPressed[0].fire)
		this.jUsed=2;
	else if(this.kbPressed[1].left||this.kbPressed[1].up||this.kbPressed[1].down||this.kbPressed[1].right||this.kbPressed[0].fire)
		this.jUsed=3;
	
	i=(jSelect>1&&jSelect<4)?jSelect-2:((jSelect==4)?((this.jUsed>1)?this.jUsed-2:0):NaN);
	if((!isNaN(i)&&this.kbPressed[i].left)||this.gpPressed.left||this.vjPressed.left)
		this.left=true;
	else
		this.left=false;
	if((!isNaN(i)&&this.kbPressed[i].right)||this.gpPressed.right||this.vjPressed.right)
		this.right=true;
	else
		this.right=false;
	if((!isNaN(i)&&this.kbPressed[i].up)||this.gpPressed.up||this.vjPressed.up)
		this.up=true;
	else
		this.up=false;
	if((!isNaN(i)&&this.kbPressed[i].down)||this.gpPressed.down||this.vjPressed.down)
		this.down=true;
	else
		this.down=false;
	if((!isNaN(i)&&this.kbPressed[i].fire)||this.gpPressed.fire||this.vjPressed.fire)
		this.fire=true;
	else
		this.fire=false;
	if((!isNaN(i)&&this.kbPressed[i].exit)||this.gpPressed.exit)
		_EXIT=true;
	if(this.up||this.down||this.left||this.right||this.fire)
		this.touchedOnce=true;
}

		

joystick.prototype.createVJoystick=function(leftPaddng){
	
	var container = document.getElementById("container")
	var wrapper = document.createElement("div");
	wrapper.setAttribute("id","wrapper");
	container.appendChild(wrapper);
	
	var vJoystick = document.createElement("div");
	vJoystick.setAttribute("id","vJoystick");	
	wrapper.appendChild(vJoystick);
	
	var vFire = document.createElement("div");
	vFire.setAttribute("id","vFire");
	wrapper.appendChild(vFire);
	
	vJoystick.style.width = Math.floor(_WIDTH/2-7)+"px";
	vJoystick.style.height =(window.innerHeight-_HEIGHT)+"px";
	//vJoystick.style.height = Math.floor(126*_R/100+10*_SCALE)+"px";
	vJoystick.style.float = "left";
	vJoystick.style.margin = "0px";
	vJoystick.style.padding = "0px";
	vJoystick.style.marginLeft=leftPaddng+"px";
	
	vFire.style.width = Math.floor(_WIDTH/2-7)+"px";
	vJoystick.style.height =(window.innerHeight-_HEIGHT)+"px";
	//vFire.style.height = Math.floor(126*_R/100+10*_SCALE)+"px";
	vFire.style.float = "left";
	vFire.style.margin = "0px";
	vFire.style.padding = "0px";

	var vJopts = {container:vJoystick,mouseSupport:true,strokeStyle:"red",stickRadius:_R,fillStyle:"green",isFireButton:false};
	var vFopts = {container:vFire,mouseSupport:true,strokeStyle:"red",stickRadius:_R,fillStyle:"white",isFireButton:true};
	
	this.vJoystick = new VirtualJoystick(vJopts);
	this.vFire = new VirtualJoystick(vFopts);
}

joystick.prototype.resize=function(w,h,leftPaddng){	
	
	if(this.platform.touchScreen){
	
	var vJoystick=document.getElementById("vJoystick");
	vJoystick.style.width = Math.floor(_WIDTH/2-7)+"px";
	vJoystick.style.height =(window.innerHeight-_HEIGHT)+"px";
	//vJoystick.style.height = Math.floor(126*_R/100+10*_SCALE)+"px";
	vJoystick.style.float = "left";
	vJoystick.style.margin = "0px";
	vJoystick.style.padding = "0px";
	vJoystick.style.marginLeft=leftPaddng+"px";  

	var vFire=document.getElementById("vFire");
	vFire.style.width = Math.floor(_WIDTH/2-7)+"px";
	vFire.style.height =(window.innerHeight-_HEIGHT)+"px";
	//vFire.style.height = Math.floor(126*_R/100+10*_SCALE)+"px";
	vFire.style.float = "left";
	vFire.style.margin = "0px";
	vFire.style.padding = "0px";
	
	this.vJoystick.destroy();
	this.vFire.destroy();
	document.getElementById("thumbnailJ").dispatchEvent(new Event("touchedScreen"));
	
	var vJopts = {container:vJoystick,mouseSupport:true,strokeStyle:"red",stickRadius:_R,fillStyle:"green",isFireButton:false};
	var vFopts = {container:vFire,mouseSupport:true,strokeStyle:"red",stickRadius:_R,fillStyle:"white",isFireButton:true};
	
	this.vJoystick = new VirtualJoystick(vJopts);
	this.vFire = new VirtualJoystick(vFopts);
		
	}
}

joystick.prototype.createThumbnails=function(img){
	var vJ = document.getElementById("vJoystick");
	var vF = document.getElementById("vFire");
	var w = vJ.offsetWidth;
	var h= vJ.offsetHeight;
	var scale=(h/126>0.7)?0.7:h/126;
	var x = w/2/scale-126/2;
	var y = 20;
	//var x = Math.floor(w/2);
	//var y = Math.floor(5*scale);//Math.floor((h-126*scale)/2);
	
	var canvasJ = document.createElement("canvas");
	canvasJ.setAttribute("id","thumbnailJ");
	canvasJ.width=w-1; 
	canvasJ.height=h-1; 
	var ctxJ=canvasJ.getContext("2d");
	ctxJ.scale(scale,scale);
	ctxJ.drawImage(img,0,0,125,125,x,y,126,126);
	vJ.appendChild(canvasJ);
	
	var canvasF = document.createElement("canvas");
	canvasF.setAttribute("id","thumbnailJ");
	canvasF.width=w-1;
	canvasF.height=h-1;
	var ctxF=canvasF.getContext("2d");
	ctxF.scale(scale,scale);
	ctxF.drawImage(img,126,0,125,125,x,y,126,126);
	vF.appendChild(canvasF);
	
	canvasF.addEventListener("touchedScreen",function(e){
		e.preventDefault();
	},false);
	canvasJ.addEventListener("touchedScreen",function(e){
		e.preventDefault();
		ctxJ.fillStyle="#1e1e2f"
		ctxJ.fillRect(0,0,Math.floor(w/scale),Math.floor(h/scale));
		ctxF.fillStyle="#1e1e2f"
		ctxF.fillRect(0,0,Math.floor(w/scale),Math.floor(h/scale));
	},false);
	
}
