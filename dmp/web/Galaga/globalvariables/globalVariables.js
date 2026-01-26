// JavaScript Document

var _GAMEWIDTH=448;
var _GAMEHEIGHT=576;
var _WIDTH = _GAMEWIDTH;
var _HEIGHT = _GAMEHEIGHT;
var _R = 70;  // radius for virtual joystick
var _TICK = 35;
var _LOADEDELEMENTS = [];
var _ROOT = "/DMP/Galaga";
var _EXIT = false;
var _PLATFORM = {};
var _RETURNTEXT = {};
var _P = {};
var _TOPSCORES=[];
var _USER={name:"",score:0};
var _OFFLINE={};
var _REPLAY=false;
var _LEFTPADDNGS=[0,0];
var _K=[104,2,8,3,108,104,8]; //adjustments for compatibility with Scratch coding positioning [0] y position, [1] x and y multiplier, [2] sprite multiplier, [3] canvas border, [4] number printing x adjustment, [5] number printing y adjustment, [6] further number printing y adjustmen
var _TEST=0;
var _CHOSE=false;
var _MOBTXT = document.getElementById("mobtext");
var _FREEZEIMAGELOADED=false;
var _COUNT=0;
var _CHOSEJS=false;
var _WAIT=true;
var _SOUNDS=true;
let _F=function(){
			_FREEZEIMAGELOADED=true;
		};

_MOBTXT.style.margin="0px";
_MOBTXT.style.padding="0px";

runCreateScripts();

function runCreateScripts(){
	s1 = new createScripts("gs1",_ROOT+"/globalvariables/appleDeviceDetection.js");
    s2 = new createScripts("gs2",_ROOT+"/globalvariables/helperfunctions.js");
	s9 = new createScripts("gs9",_ROOT+"/actors/actor.js");
	var interval = setInterval(function(){
		var check=["gs1","gs2","gs9"];
		if (checkLoaded(check)){
			clearInterval(interval);
			_PLATFORM = setPlatform();
			_LEFTPADDNGS=setWindow(_PLATFORM,1,1);
			s3 = new createScripts("gs3",_ROOT+"/players/players.js");
			s4 = new createScripts("gs4",_ROOT+"/joystick/joystick.js");
			s5 = new createScripts("gs5",_ROOT+"/audiomachine/audiomachine.js");
			s6 = new createScripts("gs6",_ROOT+"/canvas/canvas.js");
			s7 = new createScripts("gs7",_ROOT+"/game/game.js");
			s8 = new createScripts("gs8",_ROOT+"/animations/levelFlags.js");
			s10 = new createScripts("gs10",_ROOT+"/actors/ship.js");
			s11 = new createScripts("gs11",_ROOT+"/actors/bullet.js");
			s12 = new createScripts("gs12",_ROOT+"/actors/alliens.js");
			s13 = new createScripts("gs13",_ROOT+"/actors/beam.js");
			s14 = new createScripts("gs13",_ROOT+"/actors/bomb.js");
			s15 = new createScripts("gs15",_ROOT+"/chaselight/chaselight.js");
			s16 = new createScripts("gs16",_ROOT+"/canvas/dom.js");
			s17 = new createScripts("gs17",_ROOT+"/server/server.js");
			s18 = new createScripts("gs18",_ROOT+"/session/session.js")
			var interval_2 = setInterval(function(){
				var check=["gs3","gs4","gs5","gs6","gs7","gs8","gs10","gs11","gs12","gs13","gs14","gs15","gs16","gs17","gs18"];
				if(checkLoaded(check)){
					clearInterval(interval_2);
					runPlayers();
				}
			},37);
		}
	},37);
}

function runPlayers(){
	_P=new players(_PLATFORM,_LEFTPADDNGS);
	//_P.checkReady();
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
