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
    this.fireStart2=false;
	this.vjExit = false;
	this.exit=false;
	this.touchedOnce=false;

	// NEW clean per-slot support (2 players max)
	this.players = [
		this.createEmptyPlayerState(),
		this.createEmptyPlayerState()
	];

	this.kbPressed = [
		{"exit":false,"left":false,"right":false,"up":false,"down":false,"fire":false,"fireB":false,"fireX":false,"fireY":false,"fireRB":false,"fireCoin":false,"fireStart":false,"fireStart2":false},
		{"exit":false,"left":false,"right":false,"up":false,"down":false,"fire":false,"fireB":false,"fireX":false,"fireY":false,"fireRB":false,"fireCoin":false,"fireStart":false,"fireStart2":false}
	];

	this.gpPressed = {"exit":false,"left":false,"right":false,"up":false,"down":false,"fire":false,"fireB":false,"fireX":false,"fireY":false,"fireRB":false,"fireCoin":false,"fireStart":false,"fireStart2":false};

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
        console.log("KEYBOARD ",this.keyboard)
		this.loaded=true;
	}else{
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
	this.startGamepadLoop();
}

// =========================================
// PLAYER HELPER
// =========================================

joystick.prototype.createEmptyPlayerState = function(){
	return {
		left:false,
		right:false,
		up:false,
		down:false,
		fire:false,
		fireB:false,
		fireX:false,
		fireY:false,
		fireRB:false,
		fireCoin:false,
		fireStart:false,
		exit:false
	};
}

// =========================================
// UPDATED GAMEPAD READER (FULLY INTEGRATED)
// =========================================

joystick.prototype.readJoystick = function (jSelect) {

    if (jSelect != 0 && (!jSelect || jSelect == ""))
        jSelect = 4;

    this.gpPressed = {
        "exit": false,
        "left": false,
        "right": false,
        "up": false,
        "down": false,
        "fire": false,
        "fireB": false,
        "fireX": false,
        "fireY": false,
        "fireRB": false,
        "fireStart": false,
        "fireStart2":false,
        "fireBack": false
    };

    this.vjPressed = {
        "left": false,
        "right": false,
        "up": false,
        "down": false,
        "fire": false,
        "fireB": false,
        "fireX": false,
        "fireY": false,
        "fireRB": false,
        "fireStart": false,
        "fireCoin": false
    };

    this.jUsed = null;

    if (!this.platform.touchScreen) {
        // RESET PLAYER STATES
        this.players[0] = this.createEmptyPlayerState();
        this.players[1] = this.createEmptyPlayerState(); 
    
        if (this.gamepads.numberGPs > 0) {

            this.gamepads.read();

            for (var slot = 0; slot < 4; slot++) {

                var gpi = this.gamepads.gps[slot];
                if (!gpi) continue;

                var dz = gpi.deadZone;
                var player = this.players[slot];

                // ================= DIRECTIONS =================

                if (gpi.axes.ulHori < -dz || gpi.axes.drHori < -dz || gpi.buttons.dLeft) {
                    player.left = true;
                    console.log("LEFT - Gamepad Slot:", slot);
                }

                if (gpi.axes.ulHori > dz || gpi.axes.drHori > dz || gpi.buttons.dRight) {
                    player.right = true;
                    console.log("RIGHT - Gamepad Slot:", slot);
                }

                if (gpi.axes.ulVert < -dz || gpi.buttons.dUp) {
                    player.up = true;
                    console.log("UP - Gamepad Slot:", slot, "Vert =", gpi.axes.ulVert);
                }

                if (gpi.axes.ulVert > dz || gpi.buttons.dDown) {
                    player.down = true;
                    console.log("DOWN - Gamepad Slot:", slot, "Vert =", gpi.axes.ulVert);
                }

                // ================= BUTTONS =================

                if (gpi.buttons.a) {
                    player.fire = true;
                    console.log("FIRE (A) - Gamepad Slot:", slot);
                }

                if (gpi.buttons.b) {
                    player.fireB = true;
                    console.log("FIREB (B) - Gamepad Slot:", slot);
                }

                if (gpi.buttons.x) {
                    player.fireX = true;
                    console.log("FIREX (X) - Gamepad Slot:", slot);
                }

                if (gpi.buttons.y) {
                    player.fireY = true;
                    console.log("FIREY (Y) - Gamepad Slot:", slot);
                }

                if (gpi.buttons.rb) {
                    player.fireRB = true;
                    console.log("FIRERB - Gamepad Slot:", slot);
                }

                if (gpi.buttons.start) {
                    player.fireStart = true;
                    console.log("START - Gamepad Slot:", slot);
                }

                if (gpi.buttons.back) {
                    player.fireCoin = true;
                    console.log("COIN (BACK) - Gamepad Slot:", slot);
                }

                if (gpi.buttons.rt) {
                    player.exit = true;
                    console.log("EXIT (RT) - Gamepad Slot:", slot);
                }
            }
        }
    }

    /* ================= TOUCH CONTROLS ================= */

    if (this.platform.touchScreen) {

        if (_VBUTTONPRESSED["vFireA"])
            this.vjPressed["fire"] = true;

        if (_VBUTTONPRESSED["vFireB"])
            this.vjPressed["fireB"] = true;

        if (_VBUTTONPRESSED["vFireX"])
            this.vjPressed["fireX"] = true;

        if (_VBUTTONPRESSED["vFireY"])
            this.vjPressed["fireY"] = true;

        if (_VBUTTONPRESSED["vFireCoin"])
            this.vjPressed["fireCoin"] = true;

        if (_VBUTTONPRESSED["vFireStart"])
            this.vjPressed["fireStart"] = true;

        if (_VBUTTONPRESSED["vFireRB"])
            this.vjPressed["fireRB"] = true;

        if (_VBUTTONPRESSED["vFireExit"]) {
            this.vjPressed["exit"] = true;
            this.vjExit = true;
        }
    }


    // ================= MERGE INPUT SOURCES (UPDATED FOR 2 PLAYERS) =================

    // Determine active keyboard player
    var kbIndex = null;

    if (this.kbPressed[0].left || this.kbPressed[0].up || this.kbPressed[0].down ||
        this.kbPressed[0].right || this.kbPressed[0].fire || this.kbPressed[0].fireX ||
        this.kbPressed[0].fireY || this.kbPressed[0].fireB || this.kbPressed[0].fireCoin
        || this.kbPressed[0].fireStart) {

        kbIndex = 0;
    }
    else if (this.kbPressed[1].left || this.kbPressed[1].up || this.kbPressed[1].down ||
            this.kbPressed[1].right || this.kbPressed[1].fire || this.kbPressed[1].fireX ||
            this.kbPressed[1].fireY || this.kbPressed[1].fireB || this.kbPressed[1].fireCoin
            || this.kbPressed[1].fireStart) {

        kbIndex = 1;
    }

    // Merge into players structure cleanly

    for (var p = 0; p < 2; p++) {

        var player = this.players[p];

        // Keyboard
        if (kbIndex === p) {
            player.left  = player.left  || this.kbPressed[p].left;
            player.right = player.right || this.kbPressed[p].right;
            player.up    = player.up    || this.kbPressed[p].up;
            player.down  = player.down  || this.kbPressed[p].down;

            player.fire  = player.fire  || this.kbPressed[p].fire;
            player.fireB = player.fireB || this.kbPressed[p].fireB;
            player.fireX = player.fireX || this.kbPressed[p].fireX;
            player.fireY = player.fireY || this.kbPressed[p].fireY;
            player.fireRB= player.fireRB|| this.kbPressed[p].fireRB;

            player.fireCoin  = player.fireCoin  || this.kbPressed[p].fireCoin;
            player.fireStart = player.fireStart || this.kbPressed[p].fireStart;
        }

        // Touch (always P1)
        if (p === 0) {
            player.left  = player.left  || this.vjPressed.left;
            player.right = player.right || this.vjPressed.right;
            player.up    = player.up    || this.vjPressed.up;
            player.down  = player.down  || this.vjPressed.down;

            player.fire  = player.fire  || this.vjPressed.fire;
            player.fireB = player.fireB || this.vjPressed.fireB;
            player.fireX = player.fireX || this.vjPressed.fireX;
            player.fireY = player.fireY || this.vjPressed.fireY;
            player.fireRB= player.fireRB|| this.vjPressed.fireRB;

            player.fireCoin  = player.fireCoin  || this.vjPressed.fireCoin;
            player.fireStart = player.fireStart || this.vjPressed.fireStart;
        }
    }

    // Exit handling (either player)
    if ((kbIndex !== null && this.kbPressed[kbIndex].exit) ||
        this.players[0].exit || this.players[1].exit ||
        this.vjExit) {

        _EXIT = true;
        this.exit = true;

    } else {
        this.exit = false;
    }

    // touchedOnce logic
    if (this.players[0].left || this.players[0].right ||
        this.players[0].up || this.players[0].down ||
        this.players[0].fire || this.players[0].fireB ||
        this.players[0].fireX || this.players[0].fireY ||
        this.players[1].left || this.players[1].right ||
        this.players[1].up || this.players[1].down ||
        this.players[1].fire || this.players[1].fireB ||
        this.players[1].fireX || this.players[1].fireY) {

        this.touchedOnce = true;
    }

    // ================= UI AGGREGATED FLAGS =================

    this.left  = this.players[0].left  || this.players[1].left;
    this.right = this.players[0].right || this.players[1].right;
    this.up    = this.players[0].up    || this.players[1].up;
    this.down  = this.players[0].down  || this.players[1].down;

    this.fire  = this.players[0].fire  || this.players[1].fire;
    this.fireB = this.players[0].fireB || this.players[1].fireB;
    this.fireX = this.players[0].fireX || this.players[1].fireX;
    this.fireY = this.players[0].fireY || this.players[1].fireY;
    this.fireRB = this.players[0].fireRB || this.players[1].fireRB;

    this.fireCoin  = this.players[0].fireCoin  || this.players[1].fireCoin;
    this.fireStart = this.players[0].fireStart || this.players[1].fireStart;

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

joystick.prototype.startGamepadLoop = function () {
    const loop = () => {
        if (!this.platform.touchScreen) {
            this.readJoystick();
            this.joystickIntegrationMAME.checkPress();
        }
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};