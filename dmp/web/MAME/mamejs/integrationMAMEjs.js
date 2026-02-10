var _PLATFORM = {};
var _LOADEDELEMENTS = [];
var _thisIntegrationMAMEjs = null;

// canonical base
var BASE_PATH = "/dmp";

/* ================= SCRIPT LOADER ================= */

function createScripts(id, src) {
    this.id = id;
    this.script = document.createElement("script");
    this.script.src = src;

    const target = document.getElementById("script-container") || document.body;
    target.appendChild(this.script);

    this.script.addEventListener(
        "load",
        function () {
            _LOADEDELEMENTS.push(this.id);
        }.bind(this)
    );
}

function checkLoaded(arr) {
    return arr.every(id => _LOADEDELEMENTS.includes(id));
}

function getText(id, src) {
    const req = new XMLHttpRequest();
    req.open("GET", src, true);
    req.send(null);
    req.onload = function () {
        _LOADEDELEMENTS.push(id);
        _RETURNTEXT[id] = req.responseText.split("\n");
    };
}

/* ================= MAME INTEGRATION ================= */

function IntegrationMAMEjs() {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";

    this.GAMEWIDTHMAME = window.innerWidth * 1.25;
    this.GAMEHEIGHTMAME = this.GAMEWIDTHMAME * 0.75;

    this.caminho = BASE_PATH + "/MAME";

    this.loadedMame = null;
    this.gamesList = [];
    this.config = null;
    this.ROMSLOADED = false;

    this.waitRoms = document.getElementById("waitForRoms");
    this.mameWrapper = document.getElementById("mameWrapper");
    this.mameContainer = document.getElementById("mame-container");
    this.logoContainer = document.getElementById("logo-container");
    this.exitContainer = document.getElementById("exit-container");

    this.js = null;
    this.dh = null;

    this.runCreateMame();
}

/* ================= PLATFORM ================= */

IntegrationMAMEjs.prototype.setPlatform = function () {
    return {
        navigator: navigator,
        touchScreen: /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
    };
};

/* ================= LOAD CORE ================= */

IntegrationMAMEjs.prototype.runCreateMame = function () {
    _thisIntegrationMAMEjs = this;

    this.s2 = new createScripts("gs2", this.caminho + "/mamejs/mamejs.js");

    const interval = setInterval(function () {
        if (checkLoaded(["gs2"])) {
            clearInterval(interval);

            new createScripts("gs4", _thisIntegrationMAMEjs.caminho + "/joystick/joystick.js");
            new createScripts("gs5", _thisIntegrationMAMEjs.caminho + "/joystick/gamepads.js");
            new createScripts("gs6", _thisIntegrationMAMEjs.caminho + "/joystick/keyboard.js");
            new createScripts("gs7", _thisIntegrationMAMEjs.caminho + "/joystick/virtualJoystick.js");
            new createScripts("gs8", _thisIntegrationMAMEjs.caminho + "/joystick/joystickIntegrationMAME.js");
            new createScripts("gs9", _thisIntegrationMAMEjs.caminho + "/globalvariables/dom.js");

            const interval2 = setInterval(function () {
                if (checkLoaded(["gs4", "gs5", "gs6", "gs7", "gs8", "gs9"])) {
                    clearInterval(interval2);
                    _PLATFORM = _thisIntegrationMAMEjs.setPlatform();
                    _thisIntegrationMAMEjs.createConfigMame(
                        BASE_PATH + "/site/img/tnailsmame/thumbnailsmame.txt"
                    );
                }
            }, 30);
        }
    }, 30);
};

/* ================= CONFIG ================= */

IntegrationMAMEjs.prototype.setConfigMame = function () {
    const path = BASE_PATH + "/MAME/roms/";
    const files = {};
    const driver = {};

    this.gamesList.forEach(game => {
        if (!game || game.includes("dmp")) return;
        const clean = game.replace("\r", "");
        files[clean] = path + clean;
        driver[clean] = clean.replace(".zip", "");
    });

    this.config = {
        emulator: BASE_PATH + "/MAME/mamejs/mame.js",
        games: { files, driver },
        resolution: {
            width: this.GAMEWIDTHMAME,
            height: this.GAMEHEIGHTMAME,
        },
    };

    this.preloadMAME();
};

IntegrationMAMEjs.prototype.createConfigMame = function (fileList) {
    this.gamesList = [];
    getText("text", fileList);

    const interval = setInterval(function () {
        if (checkLoaded(["text"])) {
            clearInterval(interval);
            const txt = _RETURNTEXT["text"];
            txt.forEach(line => {
                const idx = line.indexOf(",");
                if (idx !== -1) {
                    const name = line.slice(idx + 11);
                    if (name && !name.includes("dmp")) this.gamesList.push(name);
                }
            });
            this.setConfigMame();
        }
    }.bind(this), 30);
};

/* ================= LOAD ROMS ================= */

IntegrationMAMEjs.prototype.preloadMAME = function () {
    return mamejs
        .load(this.config.emulator, this.mameContainer)
        .then(mame => {
            this.loadedMame = mame;
            return mame.loadRoms(this.config.games.files);
        })
        .then(() => {
            this.ROMSLOADED = true;
            if (this.waitRoms) this.waitRoms.style.display = "none";
        })
        .catch(err => console.error("Preload error:", err));
};

/* ================= CANVAS FIX ================= */

IntegrationMAMEjs.prototype.forceCanvasResolution = function () {
    const iframe = document.getElementById("emloader-iframe");
    if (!iframe) return;

    const canvas = iframe.contentDocument?.querySelector("canvas");
    if (!canvas) return;

    const w = Math.floor(this.GAMEWIDTHMAME * 0.5);
    const h = Math.floor(this.GAMEHEIGHTMAME * 0.5);

    // 🔑 real rendering buffer
    canvas.width = w;
    canvas.height = h;

    // visual size
    iframe.style.width = w + "px";
    iframe.style.height = h + "px";
    iframe.style.margin = "0 auto";
    iframe.style.display = "block";

    console.log("Canvas forced to:", w, h);
};

/* ================= RUN / STOP ================= */

IntegrationMAMEjs.prototype.runSelectedROM = function (rom) {
    if (!this.loadedMame) {
        console.error("MAME not loaded");
        return;
    }

    rom = rom.replace("\r", "");
    const driver = this.config.games.driver[rom];

    if (!driver) {
        console.error("No driver for ROM:", rom);
        return;
    }

    console.log("Running:", rom, "->", driver);

    this.loadedMame
        .runGame(driver, this.config.resolution)
        .then(() => {
            // 🔑 FIX APPLIED HERE
            this.forceCanvasResolution();

            this.removeAllElementsButMameDiv();
            this.initializeJoystick();
        })
        .catch(err => console.error("Run error:", err));
};

IntegrationMAMEjs.prototype.stopSelectedROM = function () {
    try {
        this.loadedMame.loader.module.ccall("exit", "void", ["number"], [0]);
    } catch (e) {}
};

/* ================= JOYSTICK ================= */

IntegrationMAMEjs.prototype.initializeJoystick = function () {
    this.js = new joystick(_PLATFORM, mamejs, this);
    if (document.getElementById("gamepad-container")) {
        this.dh = new domHelpers(this.js);
    }
};

/* ================= CLEANUP ================= */

IntegrationMAMEjs.prototype.removeAllElementsButMameDiv = function () {
    const children = [...document.body.children];
    children.forEach(el => {
        if (
            el.tagName !== "SCRIPT" &&
            el.id !== "mameWrapper" &&
            el.id !== "script-container" &&
            el.id !== "exit-container"
        ) {
            el.remove();
        }
    });

    if (!_PLATFORM.touchScreen && this.logoContainer) {
        this.logoContainer.style.visibility = "visible";
    }
};
