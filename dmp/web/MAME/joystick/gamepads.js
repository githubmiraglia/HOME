function xBoxGamepad(index){
	this.index=index;
	this.deadZone = 0.3;
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
	this.once=[false,false,false,false,false];
	this.numberGPs=0;
	this.gps = [];
	this.change=false;
	this.activateGamePads();
};


gamePads.prototype.activateGamePads = function(){
	if(!this.once[0]){
		this.once[0]=true;
		var foundIt=false
		var tentatives = 0;
		var interval = setInterval(function(){
			gp=navigator.getGamepads();
			if(gp){
				for (var i=0;i<gp.length;i++){
					if(gp[i]!=null){
						this.gps.push(new xBoxGamepad(gp[i].index));
						this.numberGPs++;
						foundIt=true
						console.log("FOUND GAME PAD");
					}
				}
				if(foundIt){
					//console.log("FOUND GAME PAD BUT FOR SOME REASON DID NOT CONSOLE LOG");
					clearInterval(interval);
				}
			}
			tentatives++;
			if(tentatives>500){
				clearInterval(interval);
				console.log("could not find gamepads");
			}
		}.bind(this),217);
	}
};
	
gamePads.prototype.read = function(){
    this.change = false;

    const pads = navigator.getGamepads();
    if (!pads) return;

    for (var i = 0; i < this.numberGPs; i++) {

        var gpi = this.gps[i];
        var gpCheck = pads[gpi.index];

        if (!gpCheck) continue;

        /* ================= BUTTONS ================= */

        for (var j = 0; j < gpCheck.buttons.length; j++) {

            var mapping = gpi.buttonsMapping[j];
			if (!mapping || !(mapping in gpi.buttons)) continue;

            

            var btn = gpCheck.buttons[j];

            var pressed = (typeof btn === "object") ? btn.pressed : btn === 1;
            var value   = (typeof btn === "object") ? btn.value   : btn;


            if (pressed) {

                if (mapping === "lt" || mapping === "rt") {
                    if (Math.abs(value) > gpi.deadZone) {
                        gpi.buttons[mapping] = value;
                        this.change = true;
                    }
                } else {
                    gpi.buttons[mapping] = true;
                    this.change = true;
                }

            } else {

                if (mapping === "lt" || mapping === "rt") {
                    gpi.buttons[mapping] = 0;
                } else {
                    gpi.buttons[mapping] = false;
                }

            }
        }

		for (var j = 0; j < gpCheck.buttons.length; j++) {
			var btn = gpCheck.buttons[j];
		    var pressed = (typeof btn === "object") ? btn.pressed : btn === 1;
			if (pressed) {
    			console.log("Button index pressed:", j);
			}	
		}

        /* ================= AXES ================= */

        for (var k = 0; k < gpCheck.axes.length; k++) {

            var axisMapping = gpi.axesMapping[k];
            if (!axisMapping) continue;

            var axisValue = gpCheck.axes[k];

            if (Math.abs(axisValue) > gpi.deadZone) {
                gpi.axes[axisMapping] = axisValue;
                this.change = true;
            } else {
                gpi.axes[axisMapping] = 0;
            }
        }
    }
};