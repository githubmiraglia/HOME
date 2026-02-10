// JavaScript Document

// 🔑 Canonical base path
var BASE_PATH = "/dmp";

var _GAMEWIDTH = 448;
var _GAMEHEIGHT = 576;
var _WIDTH = _GAMEWIDTH;
var _HEIGHT = _GAMEHEIGHT;
var _R = 70;
var _TICK = 35;
var _LOADEDELEMENTS = [];

// ✅ FIX: use BASE_PATH, never hardcode DMP
var _ROOT = BASE_PATH + "/MAME";

var _EXIT = false;
var _PLATFORM = {};
var _WAIT = true;
var s2 = null;
var _LEFTPADDNGS = [0, 0];

runCreateScripts();

function runCreateScripts(){
	document.body.style.backgroundColor = "#1e1e2f";

	s1 = new createScripts("gs1", _ROOT + "/globalvariables/helperfunctions.js");
	s2 = new createScripts("gs2", _ROOT + "/mamejs/mamejs.js");

	var interval = setInterval(function(){
		var check = ["gs1", "gs2"];
		if (checkLoaded(check)){
			clearInterval(interval);

			_PLATFORM = setPlatform();
			_LEFTPADDNGS = setWindow(_PLATFORM, 1, 1);

			s4 = new createScripts("gs4", _ROOT + "/joystick/joystickintegrationMAME.js");
			s5 = new createScripts("gs5", _ROOT + "/joystick/joystick.js");
			s6 = new createScripts("gs6", _ROOT + "/joystick/gamepads.js");
			s7 = new createScripts("gs7", _ROOT + "/joystick/keyboard.js");
			s8 = new createScripts("gs8", _ROOT + "/joystick/virtualJoystick.js");
			s9 = new createScripts("gs9", _ROOT + "/joystick/dom.js");

			var interval_2 = setInterval(function(){
				var check = ["gs4","gs5","gs6","gs7","gs8","gs9"];
				if (checkLoaded(check)){
					clearInterval(interval_2);

					var params = new URLSearchParams(window.location.search);
					var rom = params.get('rom');
					loadPlatform(rom);
				}
			}, 37);
		}
	}, 37);
}

function createScripts(id, src){
	this.id = id;
	this.script = document.createElement("script");
	this.script.src = src;
	document.body.appendChild(this.script);
	this.script.addEventListener("load", function(){
		_LOADEDELEMENTS.push(this.id);
	}.bind(this));
}

function checkLoaded(arrIDs){
	for (var i = 0; i < arrIDs.length; i++){
		if (_LOADEDELEMENTS.indexOf(arrIDs[i]) === -1){
			return false;
		}
	}
	return true;
}

function loadPlatform(rom){
	if (!rom) {
		console.error("No ROM specified");
		return;
	}

	var driver = rom.replace(".zip", "");

	var game = {
		files: {
			[rom]: BASE_PATH + "/MAME/roms/" + rom
		},
		driver: driver
	};

	var config = {
		emulator: BASE_PATH + "/MAME/mamejs/mame.js",
		game: game,
		resolution: {
			width: _WIDTH,
			height: _HEIGHT
		}
	};

	console.log("LAUNCHING MAME", config);

	mamejs.load(config.emulator, container)
		.then(function(mame_js){
			console.log("MAMEJS LOADED", mame_js);
			return mame_js.loadRoms(game.files).then(function(){
				console.log("ROM LOADED", game.files);
				_MAMEJS = mame_js;
				return mame_js;
			});
		})
		.then(function(){
			runMAME();
			console.log("ALL GOOD LOADING MAME");
		})
		.catch(function(error){
			console.error("ERROR LOADING MAME", error);
		});
}

function runMAME(){
	document.getElementById("wait")?.remove();

	const isDesktop = !/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

	if (isDesktop){
		const interval = setInterval(() => {
			const iframe = document.getElementById("emloader-iframe");
			if (iframe){
				iframe.style.height = _GAMEHEIGHT + "px";
				iframe.style.width  = _GAMEWIDTH + "px";
				iframe.style.margin = "0 auto";
				clearInterval(interval);
			}
		}, 30);
	}

	console.log("_PLATFORM", _PLATFORM);
}
