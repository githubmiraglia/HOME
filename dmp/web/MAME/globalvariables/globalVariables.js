// JavaScript Document

var _GAMEWIDTH=448;
var _GAMEHEIGHT=576;
var _WIDTH = _GAMEWIDTH;
var _HEIGHT = _GAMEHEIGHT;
var _R = 70;  // radius for virtual joystick
var _TICK = 35;
var _LOADEDELEMENTS = [];
var _ROOT = "/DMP/MAME";
var _EXIT = false;
var _PLATFORM = {};
var _WAIT = true;
var s2 = null // make the mamejs instance global

//var _RETURNTEXT = {};
//var _P = {};
//var _TOPSCORES=[];
//var _USER={name:"",score:0};
//var _OFFLINE={};
//var _REPLAY=false;
var _LEFTPADDNGS=[0,0];
//var _K=[104,2,8,3,108,104,8]; //adjustments for compatibility with Scratch coding positioning [0] y position, [1] x and y multiplier, [2] sprite multiplier, [3] canvas border, [4] number printing x adjustment, [5] number printing y adjustment, [6] further number printing y adjustmen
//var _TEST=0;
//var _CHOSE=false;
//var _MOBTXT = document.getElementById("mobtext");
//var _FREEZEIMAGELOADED=false;
//var _COUNT=0;
//var _CHOSEJS=false;
//var _WAIT=true;
//var _SOUNDS=true;
//let _F=function(){
//			_FREEZEIMAGELOADED=true;
//		};
//_MOBTXT.style.margin="0px";
//_MOBTXT.style.padding="0px";
// Get the query parameters from the URL


runCreateScripts();

function runCreateScripts(){
	document.body.style.backgroundColor="#1e1e2f";	
    s1 = new createScripts("gs1",_ROOT+"/globalvariables/helperfunctions.js");
	s2 = new createScripts("gs2",_ROOT+"/mamejs/mamejs.js");
	//s3 = new createScripts("gs3",_ROOT+"/mamejs/mamejs.js");
	var interval = setInterval(function(){
		var check=["gs1","gs2"]//,"gs3"];
		if (checkLoaded(check)){
			clearInterval(interval);
			_PLATFORM = setPlatform();
			_LEFTPADDNGS=setWindow(_PLATFORM,1,1);
			s4 = new createScripts("gs4",_ROOT+"/joystick/joystickintegrationMAME.js");
			s5 = new createScripts("gs5",_ROOT+"/joystick/joystick.js");		
			s6 = new createScripts("gs6",_ROOT+"/joystick/gamepads.js");
			s7 = new createScripts("gs7",_ROOT+"/joystick/keyboard.js");
			s8 = new createScripts("gs8",_ROOT+"/joystick/virtualJoystick.js");
			s9 = new createScripts("gs9",_ROOT+"/joystick/dom.js");
			var interval_2 = setInterval(function(){
				var check=["gs4","gs5","gs6","gs7","gs8","gs9"];
				if(checkLoaded(check)){
					clearInterval(interval_2);
					var params = new URLSearchParams(window.location.search);
					var rom = params.get('rom');
					loadPlatform(rom)
				}
			},37);
		}
	},37);
}

function createScripts(id,src){
	this.id = id;
	this.script = document.createElement("script");
	this.script.src = src;
	document.body.appendChild(this.script);
	this.script.addEventListener("load",function(){
		_LOADEDELEMENTS.push(this.id);
	}.bind(this));
}

function checkLoaded(arrIDs){
	for(var i=0;i<arrIDs.length;i++){
		if(_LOADEDELEMENTS.indexOf(arrIDs[i])==-1){
			return false;
		}
	}
	return true;
}

function loadPlatform(rom){
	var game = {
		files : {
		  rom : '../MAME/roms/'+rom,
		},
		driver: rom.replace('.zip',''),
	  	}
		var config = {
			emulator: '/DMP/MAME/mamejs/mame.js',
			game: game,
			resolution: {
			width: _WIDTH,
			height: _HEIGHT
			}
	  	}
	console.log('LAUNCHING MAME', config, container)
	mamejs.load(config.emulator, container).then(function(mame_js) {
	console.log('MAMEJS LOADED', mame_js)
	return mame_js.loadRoms(config.game.files).then(function(){
		console.log('ROM LOADED', config.game.files)
		//return mame_js.runGame(config.game.driver, config.resolution).then(function() {
		_MAMEJS= mame_js
		return mame_js
	})
	}).then(function(mame_js) {
		runMAME()
		console.log('ALL GOOD LOADING MAME');
	}).catch(function(error) {
	console.error('ERROR LOADING MAME', error)
	})
}

function runMAME(){
	document.getElementById("wait").remove();

	/* 🔧 MINIMAL FIX: force iframe height on desktop */
	const isDesktop = !/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

	if (isDesktop) {
		const interval = setInterval(() => {
			const iframe = document.getElementById("emloader-iframe");
			console.log("IFRAME LOADED", iframe, "SETTING HEIGHT", _GAMEHEIGHT);
			if (iframe) {
				iframe.style.height = _GAMEHEIGHT + "px";
				iframe.style.width  = _GAMEWIDTH  + "px";
				iframe.style.margin = "0 auto";
				clearInterval(interval);
			}
		}, 30);
	}

	console.log("_PLATFORM", _PLATFORM);
}
