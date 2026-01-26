// JavaScript Document
var _VBUTTONPRESSED = {"vFireA":false,"vFireB":false,"vFireX":false,"vFireY":false,"vFireCoin":false,"vFireStart":false,"vFireExit":false}

function joystick(PLATFORM,mamejs,mameIntegration){
	this.mameIntegration = mameIntegration;
	this.platform=PLATFORM;
	this.mamejs = mamejs
	this.platform["touchScreen"] = this.platform.touchScreen;
	this.jUsed=null;
	this.up=false;
	this.down=false;
	this.left=false;
	this.right=false;
	this.fire=false;
	this.fireX=false;
	this.fireB=false;
	this.fireY=false;
	this.fireRB=false;
	this.fireCoin=false;
	this.fireStart=false;
	this.vjExit = false;
	this.exit=false;
	this.touchedOnce=false;
	this.kbPressed = [{"exit":false,"left":false,"right":false,"up":false,"down":false,"fire":false,"fireB":false,"fireX":false,"fireY":false,"fireRB":false,"fireCoin":false,"fireStart":false},{"exit":false,"left":false,"right":false,"up":false,"down":false,"fire":false,"fireB":false,"fireX":false,"fireY":false,"fireRB":false,"fireCoin":false,"fireStart":false}];
	this.gpPressed = {"exit":false,"left":false,"right":false,"up":false,"down":false,"fire":false,"fireB":false,"fireX":false,"fireY":false,"fireRB":false,"fireCoin":false,"fireStart":false};
	this.vjPressed = {"left":false,"right":false,"up":false,"down":false,"fire":false,"fireB":false,"fireX":false,"fireY":false,"fireCoin":false,"fireStart":false,"fireRB":false};
	this.vJoystick = null
	this.vFire = null;
	this.scale = _SCALE;
	this.buttonRadius = 50;
	this.deltaSpaceV = 0.20;
	this.deltaSpaceH = 0.20;
	this.joystickIntegrationMAME = new joystickIntegrationMAME(this.mamejs,this.platform, this, this.mameIntegration)
	if(!this.platform.touchScreen){
	   	this.gamepads = new gamePads(this.joystickIntegrationMAME);
	   	this.keyboard = new keyboard(this.kbPressed,this.joystickIntegrationMAME, this);	
		this.loaded=true;
	}else{
	   //document.addEventListener("touchstart",(e)=>{e.preventDefault()});
	   this.createVJoystick(this.joystickIntegrationMAME);
	   var interval_2=setInterval(function(){
	   		if(vJoystick){
	   			this.createThumbnails();
				clearInterval(interval_2);
				this.loaded=true;
			}				
		}.bind(this),67);
	}
	this.vjExit = null;
	this.el = document.getElementById("vFireWrapper");
	this.exitTouch(this.platform.touchScreen,this.el)
}
	

joystick.prototype.readJoystick=function(jSelect){
		
	if(jSelect!=0&&(!jSelect||jSelect==""))
		jSelect=4;

	this.gpPressed = {"exit":false,"left":false,"right":false,"up":false,"down":false,"fire":false,"fireB":false,"fireX":false,"fireY":false,"fireRB":false,"fireStart":false,"fireBack":false};
	this.vjPressed = {"left":false,"right":false,"up":false,"down":false,"fire":false,"fireB":false,"fireX":false,"fireY":false,"fireRB":false,"fireStart":false,"fireCoin":false};
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
					if(gpi.buttons.a){
						this.gpPressed["fire"]=true;
						this.jUsed=i;
					}
					if(gpi.buttons.b){
						this.gpPressed["fireB"]=true;
						this.jUsed=i;
					}
					if(gpi.buttons.x){
						this.gpPressed["fireX"]=true;
						this.jUsed=i;
					}
					if(gpi.buttons.y){
						this.gpPressed["fireY"]=true;
						this.jUsed=i;
					}
					if(gpi.buttons.start){
						this.gpPressed["fireStart"]=true;
						this.jUsed=i;
					}
					if(gpi.buttons.back){
						this.gpPressed["fireBack"]=true;
						this.jUsed=i;
					}
					if(gpi.buttons.rb){
						this.gpPressed["fireRB"]=true;
						this.jUsed=i;
					}
				}
			}
		}
	}

	if(this.platform.touchScreen){
		/*if(this.vJoystick.left())
			this.vjPressed["left"]=true;
		if(this.vJoystick.right())
			this.vjPressed["right"]=true;
		if(this.vJoystick.up())
			this.vjPressed["up"]=true;
		if(this.vJoystick.down())
			this.vjPressed["down"]=true;*/
		if(_VBUTTONPRESSED["vFireA"])
			this.vjPressed["fire"]=true;
		if(_VBUTTONPRESSED["vFireB"])
			this.vjPressed["fireB"]=true;
		if(_VBUTTONPRESSED["vFireX"])
			this.vjPressed["fireX"]=true;
		if(_VBUTTONPRESSED["vFireY"])
			this.vjPressed["fireY"]=true;
		if(_VBUTTONPRESSED["vFireCoin"])
			this.vjPressed["fireCoin"]=true;
		if(_VBUTTONPRESSED["vFireStart"])
			this.vjPressed["fireStart"]=true;
		if(_VBUTTONPRESSED["vFireRB"])
			this.vjPressed["fireRB"]=true;
		if(_VBUTTONPRESSED["vFireExit"]){
			//console.log("PASSEI POR AQUI");
			this.vjPressed["exit"]=true;
			this.vjExit=true;
		}
	}

	//console.log("KEYBOARD", this.kbPressed[0].fire,this.kbPressed[0].fireX,this.kbPressed[0].fireY,this.kbPressed[0].fireB)

	if(this.kbPressed[0].left||this.kbPressed[0].up||this.kbPressed[0].down||this.kbPressed[0].right||this.kbPressed[0].fire||this.kbPressed[0].fireX||this.kbPressed[0].fireY||this.kbPressed[0].fireB)
		this.jUsed=2;
	else if(this.kbPressed[1].left||this.kbPressed[1].up||this.kbPressed[1].down||this.kbPressed[1].right||this.kbPressed[1].fire||this.kbPressed[1].fireX||this.kbPressed[1].fireY||this.kbPressed[1].fireB)
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
	if((!isNaN(i)&&this.kbPressed[i].fireX)||this.gpPressed.fireX||this.vjPressed.fireX)
		this.fireX=true;
	else
		this.fireX=false;
	if((!isNaN(i)&&this.kbPressed[i].fireY)||this.gpPressed.fireY||this.vjPressed.fireY)
		this.fireY=true;
	else
		this.fireY=false;
	if((!isNaN(i)&&this.kbPressed[i].fireB)||this.gpPressed.fireB||this.vjPressed.fireB)
		this.fireB=true;
	else
		this.fireB=false;
	if((!isNaN(i)&&this.kbPressed[i].fireCoin)||this.vjPressed.fireCoin||this.gpPressed.back)
		this.fireCoin=true;
	else
		this.fireCoin=false;
	if((!isNaN(i)&&this.kbPressed[i].fireStart)||this.vjPressed.fireStart||this.gpPressed.start)
		this.fireStart=true;
	else
		this.fireStart=false;
	if((!isNaN(i)&&this.kbPressed[i].fireRB)||this.vjPressed.fireRB||this.gpPressed.fireRB)
		this.fireRB=true;
	else
		this.fireRB=false;
	if((!isNaN(i)&&this.kbPressed[i].exit)||this.gpPressed.exit||this.vjExit){
		_EXIT=true;
		this.exit=true;
	}else
		this.exit=false;
	if(this.up||this.down||this.left||this.right||this.fire||this.fireX||this.fireY||this.fireB||this.fireCoin||this.fireStart)
		this.touchedOnce=true;
}

joystick.prototype.createVJoystick = function () {
	// fix _width and _height
	if(this.mameIntegration.mame){
		var _WIDTH = this.mameIntegration.GAMEWIDTHMAME;
		var _HEIGHT = this.mameIntegration.GAMEHEIGHTMAME;
	}
	var container = document.getElementById("gamepad-container");
	if (!container) {
		container = document.createElement("div");
		container.id = "gamepad-container";
		document.body.appendChild(container);
	}
    //var container = document.getelementbyid("container");
    var wrapper = document.createElement("div");
    wrapper.setAttribute("id", "wrapper");
    container.appendChild(wrapper);
    var vJoystick = document.createElement("div");
    vJoystick.setAttribute("id", "vJoystick");
    wrapper.appendChild(vJoystick);
    var vFireWrapper = document.createElement("div");
    vFireWrapper.setAttribute("id", "vFireWrapper");
    wrapper.appendChild(vFireWrapper);

	container.style.width = _WIDTH + "px";
	container.style.height = (window.innerHeight - _HEIGHT) + "px";
	wrapper.style.width = _WIDTH + "px";
	wrapper.style.height = (window.innerHeight - _HEIGHT) + "px";	

	vJoystick.style.touchAction = "manipulation";
    vJoystick.style.width = "35%";
    vJoystick.style.height = (window.innerHeight - _HEIGHT) + "px";
    vJoystick.style.float = "left";
    vJoystick.style.margin = "0px";
    vJoystick.style.padding = "0px";

	vFireWrapper.style.touchAction = "manipulation";
    vFireWrapper.style.width = "65%";
    vFireWrapper.style.height = (window.innerHeight - _HEIGHT) + "px";
    vFireWrapper.style.float = "left";
    vFireWrapper.style.margin = "0px";
    vFireWrapper.style.padding = "0px";
    vFireWrapper.style.position = "relative";

    var vJopts = { container: vJoystick, mouseSupport: true, strokeStyle: "red", stickRadius: _R, fillStyle: "white", isFireButton: false, joystick:this, joystickIntegrationMAME:this.joystickIntegrationMAME };
    this.vJoystick = new VirtualJoystick(vJopts);

    this.buttonRadius = this.buttonRadius * _SCALE;
    this.deltaSpaceH = this.deltaSpaceH * _SCALE * 0.8;
    this.deltaSpaceV = this.deltaSpaceV * _SCALE * 0.85 * 446 / _HEIGHT;
    let l = (this.buttonRadius * 2)+"px";

    var fireButtons = [
        { id: "vFireY", color: "#FFDDC1", posX: ((0.4 - 0.5*this.deltaSpaceH)*100).toString()+"%", posY: (15 + 0.1*this.deltaSpaceV*100).toString()+"%", "pressed":false,"widht":l, "height":l},
        { id: "vFireA", color: "#C1E1C1",  posX: ((0.4 - 0.5*this.deltaSpaceH)*100).toString()+"%", posY: (15 + 3.6*this.deltaSpaceV*100).toString()+"%", "pressed":false ,"width":l, "height":l},
        { id: "vFireX", color: "#ADD8E6", posX: ((0.4 - 2.25*this.deltaSpaceH)*100).toString()+"%", posY: (15 + 1.8*this.deltaSpaceV*100).toString()+"%", "pressed":false, "width":l, "height":l},
        { id: "vFireB", color: "#FFB6C1",  posX: ((0.4 + 1.25*this.deltaSpaceH)*100).toString()+"%", posY: (15 + 1.8*this.deltaSpaceV*100).toString()+"%", "pressed":false, "width":l, "height":l},
        // New vertically stacked "Add Coin" and "Start" buttons
        { id: "vFireCoin", color: "#0AE3f2", posX: "14%", posY: "0%", radius: 12*_SCALE, "pressed": false }, 
        { id: "vFireStart", color: "lightgreen", posX: "14%", posY: 11*this.mameIntegration.multiplier+"%", radius: 12*_SCALE, "pressed": false },
		{ id: "vFireExit", color: "#E75480", posX: "14%", posY: 22*this.mameIntegration.multiplier+"%", radius: 12*_SCALE, "pressed": false },
		// New bottom button fireRB, equidistant from vFireY
		{ id: "vFireRB", color: "#FFD700", posX: ((0.4 - 0.5*this.deltaSpaceH) * 100).toString() + "%", posY: (15 + 1.8 * this.deltaSpaceV * 100).toString() + "%", "pressed": false, "width":l, "height":l }
    ];

    this.fireButtons = {};

    /*fireButtons.forEach((btn) => {
        var button = document.createElement("div");
        button.setAttribute("id", btn.id);
        var outerRadius = btn.radius || this.buttonRadius; 
        var innerRadius = outerRadius / 2; // Inner circle is 50% of outer circle

        button.style.width = outerRadius + "px"; 
        button.style.height = outerRadius + "px"; 
        button.style.position = "absolute";
        button.style.left = btn.posX;
        button.style.top = btn.posY;
        button.style.transform = "translate(-50%, -50%)";
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center";
        button.style.backgroundColor = "transparent";
        button.style.borderRadius = "50%";
        button.style.boxShadow = `0 0 0 6px ${btn.color}, 0 0 0 ${8 * _SCALE}px transparent, 0 0 0 ${14*_SCALE}px ${btn.color}`;

        var innerCircle = document.createElement("div");
        innerCircle.style.width = innerRadius.toString()+"px";
        innerCircle.style.height = innerRadius.toString()+"px";
        innerCircle.style.borderRadius = "50%";
        innerCircle.style.backgroundColor = btn.color;

	button.appendChild(innerCircle);
	vFireWrapper.appendChild(button);

	button.addEventListener("touchstart", () => {
            innerCircle.style.backgroundColor = "white";
            _VBUTTONPRESSED[btn.id] = true;
			this.readJoystick();
			this.joystickIntegrationMAME.checkPress();
        });
		/*button.addEventListener("mousedown",  () => {
		    innerCircle.style.backgroundColor = "white";
            _VBUTTONPRESSED[btn.id] = true;
			this.readJoystick();
			this.joystickIntegrationMAME.checkPress();
        });
        button.addEventListener("touchend", () => {
            innerCircle.style.backgroundColor = btn.color;
            _VBUTTONPRESSED[btn.id] = false;
			this.readJoystick();
			this.joystickIntegrationMAME.checkPress();
        });
		/*button.addEventListener(("mouseup"),  () => {
            innerCircle.style.backgroundColor = btn.color;
            _VBUTTONPRESSED[btn.id] = false;
			this.readJoystick();
			this.joystickIntegrationMAME.checkPress();
        });
        vFireWrapper.appendChild(button);
		button.appendChild(innerCircle);
        this.fireButtons[btn.id] = button;
    });*/
	fireButtons.forEach((btn) => {
		var buttonWrapper = document.createElement("div"); // New wrapper
		buttonWrapper.setAttribute("id", btn.id + "_wrapper");
		
		var outerRadius = btn.radius || this.buttonRadius; 
		var wrapperRadius = outerRadius * 1.6; // Makes the clickable area larger
	
		buttonWrapper.style.width = wrapperRadius + "px"; 
		buttonWrapper.style.height = wrapperRadius + "px"; 
		buttonWrapper.style.position = "absolute";
		buttonWrapper.style.left = btn.posX;
		buttonWrapper.style.top = btn.posY;
		buttonWrapper.style.transform = "translate(-50%, -50%)";
		buttonWrapper.style.display = "flex";
		buttonWrapper.style.alignItems = "center";
		buttonWrapper.style.justifyContent = "center";
		buttonWrapper.style.borderRadius = "50%";
		buttonWrapper.style.backgroundColor = "transparent"; // Keep it invisible
		buttonWrapper.style.touchAction = "manipulation"; // Prevents unwanted gestures
	
		var button = document.createElement("div");
		button.setAttribute("id", btn.id);
	
		var innerRadius = outerRadius / 2;
		button.style.width = outerRadius + "px"; 
		button.style.height = outerRadius + "px"; 
		button.style.backgroundColor = "transparent";
		button.style.borderRadius = "50%";
		button.style.boxShadow = `0 0 0 6px ${btn.color}, 0 0 0 ${8 * _SCALE}px transparent, 0 0 0 ${14*_SCALE}px ${btn.color}`;
		button.style.position = "relative"; // Ensures child elements (inner circle) align properly
	
		var innerCircle = document.createElement("div");
		innerCircle.style.width = innerRadius.toString() + "px";
		innerCircle.style.height = innerRadius.toString() + "px";
		innerCircle.style.borderRadius = "50%";
		innerCircle.style.backgroundColor = btn.color;
		innerCircle.style.position = "absolute"; // Center within the button
		innerCircle.style.left = "50%";
		innerCircle.style.top = "50%";
		innerCircle.style.transform = "translate(-50%, -50%)"; // Perfect centering
	
		button.appendChild(innerCircle);
		buttonWrapper.appendChild(button);
		vFireWrapper.appendChild(buttonWrapper);
	
		// Apply event listeners to buttonWrapper instead of button
		buttonWrapper.addEventListener("touchstart", () => {
			innerCircle.style.backgroundColor = "white";
			_VBUTTONPRESSED[btn.id] = true;
			this.readJoystick();
			this.joystickIntegrationMAME.checkPress();
		});
	
		buttonWrapper.addEventListener("touchend", () => {
			innerCircle.style.backgroundColor = btn.color;
			_VBUTTONPRESSED[btn.id] = false;
			this.readJoystick();
			this.joystickIntegrationMAME.checkPress();
		});
	
		this.fireButtons[btn.id] = buttonWrapper; // Store the wrapper reference
	});
	
	
};


joystick.prototype.createThumbnails=function(){

	/*** 
	//var img = GlobalSpritesList["spriteVj"].sprite;
	var vJ = document.getElementById("vJoystick");
	//var vF = document.getElementById("vFire");
	var w = vJ.offsetWidth;
	var h= vJ.offsetHeight;
	var scale=(h/126>0.7)?0.7:h/126;
	var x = w/2/scale-126/2;
	var y = 20;
	//var scale=h/126
	//var x = Math.floor(w/2);
	//var y = Math.floor(5*scale);//Math.floor((h-126*scale)/2);
	
	var canvasJ = document.createElement("canvas");
	canvasJ.setAttribute("id","thumbnailJ");
	canvasJ.width=w-1; 
	canvasJ.height=h-1; 
	var ctxJ=canvasJ.getContext("2d");
	ctxJ.scale(scale,scale);
	//ctxJ.drawImage(img,0,0,125,125,x,y,126,126);
	vJ.appendChild(canvasJ);
	
	/***var canvasF = document.createElement("canvas");
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
		//ctxF.fillStyle="#1e1e2f"
		//ctxF.fillRect(0,0,Math.floor(w/scale),Math.floor(h/scale));
	},false);
	***/
	return;
}

joystick.prototype.resize=function(w,h,leftPaddngs){	
	
	if(this.platform.touchScreen){
	
	var vJoystick=document.getElementById("vJoystick");
	vJoystick.style.width = Math.floor(_WIDTH/2-5)+"px";
	vJoystick.style.height =(window.innerHeight-_HEIGHT)+"px";
	//vJoystick.style.height = Math.floor(126*_R/100+10*_SCALE)+"px";
	vJoystick.style.float = "left";
	vJoystick.style.margin = "-1px";
	vJoystick.style.padding = "0px";
	vJoystick.style.marginLeft=leftPaddng+"px"; 

	var vFire=document.getElementById("vFire");
	vFire.style.width = Math.floor(_WIDTH/2-5)+"px";
	vFire.style.height =(window.innerHeight-_HEIGHT)+"px";
	//vFire.style.height = Math.floor(126*_R/100+10*_SCALE)+"px";
	vFire.style.float = "left";
	vFire.style.margin = "0px";
	vFire.style.padding = "0px";
	
	this.vJoystick.destroy();
	this.vFire.destroy();
	document.getElementById("thumbnailJ").dispatchEvent(new Event("touchedScreen"));
	
	var vJopts = {container:vJoystick,mouseSupport:true,strokeStyle:"red",stickRadius:_R,fillStyle:"white",isFireButton:false};
	var vFopts = {container:vFire,mouseSupport:true,strokeStyle:"red",stickRadius:_R,fillStyle:"white",isFireButton:true};
	
	this.vJoystick = new VirtualJoystick(vJopts);
	this.vFire = new VirtualJoystick(vFopts);
		
	}
}

joystick.prototype.exitTouch=function(touchScreen,el){
	if(touchScreen){
		el.addEventListener("touchstart",function(e){
			e.preventDefault();
			this.touchStartY=parseInt(e.changedTouches[0].clientY);
		}.bind(this),false);
		el.addEventListener("touchmove",function(e){
			e.preventDefault();
			var dist=Math.abs(parseInt(e.changedTouches[0].clientY-this.touchStartY));
			if(dist>150){
				this.vjExit=true;
				this.touchStartY=parseInt(e.changedTouches[0].clientY);
			}else
				this.vjExit=false;
		}.bind(this),false);
	}
}
