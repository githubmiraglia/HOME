// JavaScript Document

function keyboard(pressed, integrationMAME, js) {

    // ===== PLAYER 1 (ARROWS + Z X C V etc) =====
    this.keyCodes1 = {
        27: "exit",
        32: "fire",
        37: "left",
        39: "right",
        38: "up",
        40: "down",
        90: "fireX",     // Z
        88: "fireY",     // X
        67: "fireB",     // C
        86: "fireRB",    // V
        53: "fireCoin",  // 5
        49: "fireStart"  // 1
    };

    // ===== PLAYER 2 (WASD + F etc) =====
    this.keyCodes2 = {
        27: "exit",
        70: "fire",       // F
        65: "left",       // A
        68: "right",      // D
        87: "up",         // W
        83: "down",       // S
        82: "fireX",      // R
        84: "fireY",      // T
        71: "fireB",      // G
        72: "fireRB",     // H
        54: "fireCoin",   // 6
        50: "fireStart"  // 2
    };

    this.integrationMAME = integrationMAME;
    this.js = js;

    this.activateKeyboard(pressed);
}

keyboard.prototype.activateKeyboard = function (pressed) {

    function handler(event) {

        var down = event.type === "keydown";

        /* ================= PLAYER 1 ================= */

        if (this.keyCodes1.hasOwnProperty(event.keyCode)) {
            console.log("Keyboard pressed 1, ", pressed[0][this.keyCodes1[event.keyCode]])
            pressed[0][this.keyCodes1[event.keyCode]] = down;
        }

        /* ================= PLAYER 2 ================= */

        if (this.keyCodes2.hasOwnProperty(event.keyCode)) {
            console.log("Keyboard pressed 2, ", pressed[1][this.keyCodes1[event.keyCode]])
            pressed[1][this.keyCodes2[event.keyCode]] = down;
        }

        /* =====================================================
           MERGE KEYBOARD INTO GLOBAL JS OBJECT (LIKE GAMEPAD)
           ===================================================== */

        // Directional (P1 only for UI navigation)
        this.js.left  = pressed[0].left  || false;
        this.js.right = pressed[0].right || false;
        this.js.up    = pressed[0].up    || false;
        this.js.down  = pressed[0].down  || false;

        // Buttons (either player can trigger)
        this.js.fire      = pressed[0].fire      || pressed[1].fire      || false;
        this.js.fireX     = pressed[0].fireX     || pressed[1].fireX     || false;
        this.js.fireY     = pressed[0].fireY     || pressed[1].fireY     || false;
        this.js.fireB     = pressed[0].fireB     || pressed[1].fireB     || false;
        this.js.fireRB    = pressed[0].fireRB    || pressed[1].fireRB    || false;
        this.js.fireCoin  = pressed[0].fireCoin  || pressed[1].fireCoin  || false;
        this.js.fireStart = pressed[0].fireStart || false;
        this.js.fireStart2= pressed[1].fireStart2|| false;

        if(this.js.fireCoin)
          console.log("FIRED COIN");

        // Exit (either player)
        this.js.exit = pressed[0].exit || pressed[1].exit || false;

        this.integrationMAME.checkPress();

        event.preventDefault();
    }

    document.body.addEventListener("keydown", handler.bind(this));
    document.body.addEventListener("keyup", handler.bind(this));
};