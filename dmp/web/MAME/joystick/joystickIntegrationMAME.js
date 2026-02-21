var joystickPollingInterval = null; // Global variable to control the interval

function joystickIntegrationMAME(mamejs, platform, js, integrationMAMEjs) {
    this.mamejs = mamejs;
    this.integrationMAMEjs = integrationMAMEjs;
    this.keyHandler = this.mamejs.controllers.getKeyHandler();
    this.js = js;
}

// ========================================
// MAIN CHECK LOOP
// ========================================

joystickIntegrationMAME.prototype.checkPress = function () {

    var p1 = this.js.players[0];
    var p2 = this.js.players[1];

    // ====================================
    // PLAYER 1
    // ====================================

    if (p1.left)  this.keyHandler.pressKey(mamejs.MameKey.P1_JOYSTICK_LEFT);
    else          this.keyHandler.releaseKey(mamejs.MameKey.P1_JOYSTICK_LEFT);

    if (p1.right) this.keyHandler.pressKey(mamejs.MameKey.P1_JOYSTICK_RIGHT);
    else          this.keyHandler.releaseKey(mamejs.MameKey.P1_JOYSTICK_RIGHT);

    if (p1.up)    this.keyHandler.pressKey(mamejs.MameKey.P1_JOYSTICK_UP);
    else          this.keyHandler.releaseKey(mamejs.MameKey.P1_JOYSTICK_UP);

    if (p1.down)  this.keyHandler.pressKey(mamejs.MameKey.P1_JOYSTICK_DOWN);
    else          this.keyHandler.releaseKey(mamejs.MameKey.P1_JOYSTICK_DOWN);

    if (p1.fire)   this.keyHandler.pressKey(mamejs.MameKey.P1_BUTTON1);
    else            this.keyHandler.releaseKey(mamejs.MameKey.P1_BUTTON1);

    if (p1.fireB)  this.keyHandler.pressKey(mamejs.MameKey.P1_BUTTON2);
    else            this.keyHandler.releaseKey(mamejs.MameKey.P1_BUTTON2);

    if (p1.fireX)  this.keyHandler.pressKey(mamejs.MameKey.P1_BUTTON3);
    else            this.keyHandler.releaseKey(mamejs.MameKey.P1_BUTTON3);

    if (p1.fireY)  this.keyHandler.pressKey(mamejs.MameKey.P1_BUTTON4);
    else            this.keyHandler.releaseKey(mamejs.MameKey.P1_BUTTON4);

    if (p1.fireRB) this.keyHandler.pressKey(mamejs.MameKey.P1_BUTTON5);
    else            this.keyHandler.releaseKey(mamejs.MameKey.P1_BUTTON5);

    if (p1.fireCoin) this.keyHandler.pressKey(mamejs.MameKey.COIN1);
    else              this.keyHandler.releaseKey(mamejs.MameKey.COIN1);

    if (p1.fireStart) this.keyHandler.pressKey(mamejs.MameKey.START1);
    else               this.keyHandler.releaseKey(mamejs.MameKey.START1);


    // ====================================
    // PLAYER 2
    // ====================================

    if (p2.left)  this.keyHandler.pressKey(mamejs.MameKey.P2_JOYSTICK_LEFT);
    else          this.keyHandler.releaseKey(mamejs.MameKey.P2_JOYSTICK_LEFT);

    if (p2.right) this.keyHandler.pressKey(mamejs.MameKey.P2_JOYSTICK_RIGHT);
    else          this.keyHandler.releaseKey(mamejs.MameKey.P2_JOYSTICK_RIGHT);

    if (p2.up)    this.keyHandler.pressKey(mamejs.MameKey.P2_JOYSTICK_UP);
    else          this.keyHandler.releaseKey(mamejs.MameKey.P2_JOYSTICK_UP);

    if (p2.down)  this.keyHandler.pressKey(mamejs.MameKey.P2_JOYSTICK_DOWN);
    else          this.keyHandler.releaseKey(mamejs.MameKey.P2_JOYSTICK_DOWN);

    if (p2.fire)   this.keyHandler.pressKey(mamejs.MameKey.P2_BUTTON1);
    else            this.keyHandler.releaseKey(mamejs.MameKey.P2_BUTTON1);

    if (p2.fireB)  this.keyHandler.pressKey(mamejs.MameKey.P2_BUTTON2);
    else            this.keyHandler.releaseKey(mamejs.MameKey.P2_BUTTON2);

    if (p2.fireX)  this.keyHandler.pressKey(mamejs.MameKey.P2_BUTTON3);
    else            this.keyHandler.releaseKey(mamejs.MameKey.P2_BUTTON3);

    if (p2.fireY)  this.keyHandler.pressKey(mamejs.MameKey.P2_BUTTON4);
    else            this.keyHandler.releaseKey(mamejs.MameKey.P2_BUTTON4);

    if (p2.fireRB) this.keyHandler.pressKey(mamejs.MameKey.P2_BUTTON5);
    else            this.keyHandler.releaseKey(mamejs.MameKey.P2_BUTTON5);

    if (p2.fireCoin) this.keyHandler.pressKey(mamejs.MameKey.COIN2);
    else              this.keyHandler.releaseKey(mamejs.MameKey.COIN2);

    if (p2.fireStart) this.keyHandler.pressKey(mamejs.MameKey.START2);
    else               this.keyHandler.releaseKey(mamejs.MameKey.START2);


    // ====================================
    // EXIT / PAUSE LOGIC (UNCHANGED)
    // ====================================

    if (p1.exit || p2.exit || this.js.exit) {

        this.js.players[0].exit = false;
        this.js.players[1].exit = false;
        this.js.vjExit = false;

        this.keyHandler.releaseKey(mamejs.MameKey.UI_PAUSE);

        setTimeout(() => {

            this.keyHandler.pressKey(mamejs.MameKey.UI_PAUSE);

            if (!this.integrationMAMEjs.once) {
                var dummy1 = this.integrationMAMEjs.confirmExit("RESUME", this.js);
            }

        }, 500);
    }
};