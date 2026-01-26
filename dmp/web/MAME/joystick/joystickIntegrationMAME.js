var joystickPollingInterval = null; // Global variable to control the interval

function joystickIntegrationMAME(mamejs,platform, js, integrationMAMEjs){
    this.mamejs = mamejs;
    this.integrationMAMEjs = integrationMAMEjs;
    //console.log(mamejs);
    this.keyHandler = this.mamejs.controllers.getKeyHandler();
    this.js = js
}

joystickIntegrationMAME.prototype.checkPress=function(){

    if (this.js.left) { this.keyHandler.pressKey(mamejs.MameKey.P1_JOYSTICK_LEFT); };
    if (this.js.right) { this.keyHandler.pressKey(mamejs.MameKey.P1_JOYSTICK_RIGHT); };
    if (this.js.up) { this.keyHandler.pressKey(mamejs.MameKey.P1_JOYSTICK_UP); };
    if (this.js.down) { this.keyHandler.pressKey(mamejs.MameKey.P1_JOYSTICK_DOWN); };
    if (this.js.fire) this.keyHandler.pressKey(mamejs.MameKey.P1_BUTTON1);
    if (this.js.fireB) this.keyHandler.pressKey(mamejs.MameKey.P1_BUTTON2);
    if (this.js.fireX) this.keyHandler.pressKey(mamejs.MameKey.P1_BUTTON3);
    if (this.js.fireY) this.keyHandler.pressKey(mamejs.MameKey.P1_BUTTON4);
    if (this.js.fireRB) {this.keyHandler.pressKey(mamejs.MameKey.P1_BUTTON5);}
    if (this.js.fireCoin) this.keyHandler.pressKey(mamejs.MameKey.COIN1);
    if (this.js.fireStart) {this.keyHandler.pressKey(mamejs.MameKey.START1)};
    if (this.js.exit){
        this.js.exit = false;
        this.js.vjExit = false;
        this.keyHandler.releaseKey(mamejs.MameKey.UI_PAUSE);
        //this.keyHandler.pressKey(mamejs.MameKey.UI_PAUSE);
        setTimeout(()=>{this.keyHandler.pressKey(mamejs.MameKey.UI_PAUSE);
                        if(!this.integrationMAMEjs.once) 
                            var dummy1 = this.integrationMAMEjs.confirmExit("RESUME",this.js);
                        },500);
    }
    

    if (!this.js.left) this.keyHandler.releaseKey(mamejs.MameKey.P1_JOYSTICK_LEFT);
    if (!this.js.right) this.keyHandler.releaseKey(mamejs.MameKey.P1_JOYSTICK_RIGHT);
    if (!this.js.up) this.keyHandler.releaseKey(mamejs.MameKey.P1_JOYSTICK_UP);
    if (!this.js.down) this.keyHandler.releaseKey(mamejs.MameKey.P1_JOYSTICK_DOWN);
    if (!this.js.fire) this.keyHandler.releaseKey(mamejs.MameKey.P1_BUTTON1);
    if (!this.js.fireB) this.keyHandler.releaseKey(mamejs.MameKey.P1_BUTTON2);
    if (!this.js.fireX) this.keyHandler.releaseKey(mamejs.MameKey.P1_BUTTON3);
    if (!this.js.fireY) this.keyHandler.releaseKey(mamejs.MameKey.P1_BUTTON4);
    if (!this.js.fireRB)  this.keyHandler.releaseKey(mamejs.MameKey.P1_BUTTON5);
    if (!this.js.fireCoin) this.keyHandler.releaseKey(mamejs.MameKey.COIN1);
    if (!this.js.fireStart) this.keyHandler.releaseKey(mamejs.MameKey.START1);
}


//FUNCTIONS BELOW BECAME STALE TO AVOID CREATING CONSTANT INTERRUPTIONS OUTSIDE OF MAME

/*
joystickIntegrationMAME.prototype.createLoopJoystick=function(){
    if (joystickPollingInterval) clearInterval(joystickPollingInterval); // Ensure no duplicate intervals
        joystickPollingInterval = setInterval(() => {
        this.checkPress();
    }, 16); // Poll joystick state every 16ms (~60 FPS)
}

joystickIntegrationMAME.prototype.killLoopJoystick=function(){
    clearInterval(joystickPollingInterval);
    joystickPollingInterval = null;
}

joystickIntegrationMAME.prototype.killMAME=function(){
    console.log("Killing joystick Loop")
    this.killLoopJoystick()
    if (this.mamejs && this.mamejs.loader && this.mamejs.loader.module) {
        console.log("Attempting to stop MAME...");
        try {
            this.mamejs.loader.module.ccall('exit', 'void', ['number'], [0]);
        } catch (err) {
            console.log("MAME exited, ignoring error:", err.message);
            window.location.pathname="/DMP/site/index.html";	
        }
    } else {
        console.warn("MAMEJS module is not initialized.");
    }
}
*/    
