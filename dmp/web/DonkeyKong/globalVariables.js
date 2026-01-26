var GlobalLoadedAssets=0;
var GlobalReadyToPlay = false;
var GlobalTexts = [];
var GlobalSounds="none";
checkDevice();
//var GlobalRivetCount = 0;
var GlobalCurrentPlayer = 1;
var GlobalStillPlaying=[true,true];
var GlobalFinishedLevel = [false,false];
var GlobalLostLive = false;
var GlobalFirstGameOver = [false,false];
var GlobalPlatform = navigator.platform;
var GlobalTouchScreen = touchScreenAvailable(); //(GlobalPlatform=="iPad"||GlobalPlatform=="iPhone");
var _GAMEWIDTH=449;
var _GAMEHEIGHT=514;
var GlobalWidth=449;
var GlobalHeight=514;
var GlobalScale = 1;
var _WIDTH=GlobalWidth;
var _HEIGHT=GlobalHeight;
var _SCALE=GlobalScale;
var _WALKING=[false,false];
var TEST = false;
var _LOADEDELEMENTS=[];
var _RETURNTEXT=[];
var _EXIT=false;
var _TOPSCORES=[];
var _OFFLINE={};
var _REPLAY=false;
var _SV=new server();
var _SE=new sessionForUser();
var _TOPSCORES=[];
var _WAIT=true;
//var _LEFTPADDNGS=[0,0];
var _LEFTPADDNGS=setWindow();
var _USER={name:"",score:0};
var _CHOSE=false;
var _FREEZEIMAGELOADED=false;
var _COUNT=0;
var _CHOSEJS=false;
var _SOUNDS=true;
let _F=function(){
			_FREEZEIMAGELOADED=true;
		};
var _MOBTXT=document.getElementById("MOBTXT");


function touchScreenAvailable()
{
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

}

/*var GlobalVJopts = {container:document.getElementById("vJoystick"),mouseSupport:true,strokeStyle:"red",stickRadius:70,mainCanvasWidth:GlobalWidth,fillStyle:"green",isFireButton:false};
var GlobalVBopts = {container:document.getElementById("vButton"),mouseSupport:true,strokeStyle:"red",stickRadius:70,mainCanvasWidth:GlobalWidth,fillStyle:"green",isFireButton:true};
*/

function checkDevice(){
	if(GlobalTouchScreen){
		if(GlobalPlatform=="iPhone"){
			var device = getiPhoneModel()
				if(device.indexOf("1")!=-1||device.indexOf("4")!=-1||device.indexOf("5")!=-1)
					GlobalSounds = "none";
				else if(device.indexOf("6")!=-1||device.indexOf("7")!=-1||device.indexOf("8")!=-1)
					GlobalSounds= "introduction";
				else if (device.indexOf("X")!=-1)
					GlobalSounds = "all";
		}else{
			var device = getiPadModel()
			if(device.indexOf("Pro")!=-1)
				GlobalSounds = "all";
		}
	
	}else
		GlobalSounds="all";
	//var par = document.getElementById("par");
	//par.innerText = par.innerText+" Model "+GlobalPlatform+" "+GlobalSounds;
	GlobalSounds="all";
}


function setWindow(platform,players,player){
	_WIDTH=_GAMEWIDTH;
	_HEIGHT=_GAMEHEIGHT;
	GlobalWidth=_GAMEWIDTH;
	GlobalHeight=_GAMEHEIGHT;
	var w = window.innerWidth;
	var h = window.innerHeight;
	if(players==2&&!_CHOSEJS)
		w=Math.floor(w/2)-10;
	var innerH = h;
	var innerW = w;
	var innerH = h;
	var wScale = w/GlobalWidth;
	var hScale = h/GlobalHeight;
	if (wScale<hScale)
		var scale = wScale;
	else
		var scale = hScale;
	w = Math.floor(GlobalWidth*scale);
	h = Math.floor(GlobalHeight*scale);
	var r = (70*scale>=70)?70:Math.floor(70*scale);
	if((innerH-h)<Math.floor(126*r/100+10*scale)){
		h = innerH - Math.floor(126*r/100+10*scale);
		wScale = w/GlobalWidth;
		hScale = h/GlobalHeight;
		if (wScale<hScale)
			scale = wScale;
		else
			scale = hScale;
		r = (70*scale>=70)?70:Math.floor(70*scale);
	}
	GlobalScale = scale;
	GlobalWidth = Math.floor(GlobalWidth*scale);
	GlobalHeight = Math.floor(GlobalHeight*scale);
	_SCALE = GlobalScale;
	_WIDTH = GlobalWidth;
	_HEIGHT = GlobalHeight;
	_R=r;
	var paddngW = Math.floor((innerW - GlobalWidth)/2);
	var paddngH = Math.floor((innerH-GlobalHeight)*(1/3));
	document.body.style.backgroundColor="#1e1e2f";
	if(_WAIT){
		_WAIT=false;
		document.getElementById("wait").style.display="block";
	}
	document.body.style.margin="0px";
//	document.body.style.paddingLeft=paddngW+"px";
//	document.body.style.paddingRight=paddngW+"px";
	if(!GlobalTouchScreen)
		document.body.style.paddingTop=paddngH+"px";
	else
		document.body.style.paddingTop="2px";
	var container=document.getElementById("container");
	if(GlobalTouchScreen)
		return(paddngW);
	else{
		container.style.overflow="auto";
		return(Math.max(5,paddngW)); 
	}
}


function getText(id,src){
    var req = new XMLHttpRequest();
    req.open("GET",src,true);
    req.send(null);
	var ret = [];
	req.onload=function(){
        _LOADEDELEMENTS.push(id);
        _RETURNTEXT[id] = req.responseText.split("\n")	
	};
}

function checkLoaded(arrIDs){
	for(var i=0;i<arrIDs.length;i++){
		if(_LOADEDELEMENTS.indexOf(arrIDs[i])==-1){
			return false;
		}
	}
	return true;
}
	


function genericSprite(src,w,h){
	this.sprite = document.createElement("img");
	this.sprite.src = src;
	this.width = w;	
	this.height = h;
	this.sprite.addEventListener("load",function(){
			GlobalLoadedAssets++;
		});
	this.scale=true;
};

/*
function genericAudio(src){
	this.audio = new Audio(src);
	this.audio.addEventListener("loadeddata",function(){
			GlobalLoadedAssets++;				  
		});
}
*/

function genericTextData(src){
    this.src = src
    this.array=[];  
};

function getTextVals(name,src){
    var req = new XMLHttpRequest();
    req.open("GET",src,true);
    req.send(null);
	req.onload=function(){
    //req.addEventListener("load",function(){
        GlobalLoadedAssets++;
        GlobalTextArrays[name].array = req.responseText.split("\n").map(function(val){
            return parseInt(val,10);});
     //  });
	}
}

var GlobalSpritesList = {};
GlobalSpritesList["spriteIntroLadder"] = new genericSprite("img/IntroLadder.png",16,16);
GlobalSpritesList["spriteKong"] = new genericSprite("img/Kong.png",100,72);
GlobalSpritesList["spritePrincess"] = new genericSprite("img/Princess.png",32,44);
GlobalSpritesList["spriteMario"] = new genericSprite("img/Mario.png",32,32);
GlobalSpritesList["spriteBarrel"] = new genericSprite("img/Barrel.png",32,20);
GlobalSpritesList["spriteBarrelStack"] = new genericSprite("img/barrel stack.png",40,64);
GlobalSpritesList["spriteOil"] = new genericSprite("img/Oil.png",32,64);
GlobalSpritesList["spriteFire"] = new genericSprite("img/Fire.png",32,32);
GlobalSpritesList["spriteHammer"] = new genericSprite("img/Hammer.png",32,20);
GlobalSpritesList["spriteHelp"] = new genericSprite("img/Help.png",48,16);
GlobalSpritesList["spriteHeart"] = new genericSprite("img/Heart.png",32,32);
GlobalSpritesList["spriteBonus"] = new genericSprite("img/Bonus.png",32,20);
GlobalSpritesList["spriteLife"] = new genericSprite("img/life.png",14,16);
GlobalSpritesList["spriteRivet"] = new genericSprite("img/Rivet.png",32,18);
GlobalSpritesList["spriteBelongings"] = new genericSprite("img/Belongings.png",32,32);
GlobalSpritesList["spriteElevator"] = new genericSprite("img/elevator.png",32,32);
GlobalSpritesList["spriteGirder"] = new genericSprite("img/girder.png",32,32);
GlobalSpritesList["spriteConveyor"] = new genericSprite("img/conveyor.png",22,20);
GlobalSpritesList["spriteLadder"] = new genericSprite("img/ladder.png",20,32);
GlobalSpritesList["spriteConcrete"] = new genericSprite("img/concretepie.png",32,32);
GlobalSpritesList["gameOverSprite"] = new genericSprite("img/gameover.png",208,80);
GlobalSpritesList["donkeyKongFront"] = new genericSprite("img/donkeyKongFront.png",449,514);
GlobalSpritesList["donkeykongTopScores"] = new genericSprite("img/donkeykongTopScores.png",449,514);
GlobalSpritesList["stage"] = new genericSprite("img/stage.png",449,514);
GlobalSpritesList["spriteBackGround"] = new genericSprite("img/Backgrounds.png",447,512);
GlobalSpritesList["spriteTwo"] = new genericSprite("img/two.png",14,14);
GlobalSpritesList["spriteVj"] = new genericSprite("img/VJ.png",14,14);
GlobalSpritesList["spriteDevices"] = new genericSprite("img/devices.png",90,90);
GlobalSpritesList["spriteKbs"] = new genericSprite("img/Kbs.png",448,512);
//GlobalSpritesList["spriteBlack"] = new genericSprite("img/black.png",14,14);


var GlobalTextArrays = {}
GlobalTextArrays["levelType"] = new genericTextData("data/leveltype.txt");
GlobalTextArrays["backdropName"] = new genericTextData("data/backdropname.txt");
GlobalTextArrays["level1FloorHeight"] = new genericTextData("data/Level 1 floor height.txt");
GlobalTextArrays["level1LadderData"] = new genericTextData("data/Level 1 ladder data.txt");
GlobalTextArrays["level2FloorHeight"] = new genericTextData("data/Level 2 floor height.txt");
GlobalTextArrays["level2LadderData"] = new genericTextData("data/Level 2 ladder data.txt");
GlobalTextArrays["level3FloorHeight"] = new genericTextData("data/Level 3 floor height.txt");
GlobalTextArrays["level3LadderData"] = new genericTextData("data/Level 3 ladder data.txt");
GlobalTextArrays["level4FloorHeight"] = new genericTextData("data/Level 4 floor height.txt");
GlobalTextArrays["level4LadderData"] = new genericTextData("data/Level 4 ladder data.txt")


for(var name in GlobalTextArrays){
    getTextVals(name,GlobalTextArrays[name].src); 
}

var runonce = false;
var clockLoadAssets = setInterval(function(){
	if (GlobalLoadedAssets > ((GlobalTouchScreen)?37:37)){
	   if(!runonce)
		   runonce=true;
	   else{
       // var i=0;
       // for (var name in GlobalTextArrays){
       //     GlobalTextArrays[name].array = GlobalTexts[i] ;
       //     i++;
       // }
		clearInterval(clockLoadAssets);
		jogadores = new players(_LEFTPADDNGS);
		readTopScores();
		getSessionUser();
	   }
	}
},500);

/*function setTestTopScores(){
	_TOPSCORES.push({name:"DUSTIERWRITER",score:73400});
	_TOPSCORES.push({name:"HANSSOLO",score:9200});
	_TOPSCORES.push({name:"LUKESKYWALKER",score:7500});
	_TOPSCORES.push({name:"PEREGRINTOOK",score:3500});
	_TOPSCORES.push({name:"ARWENUDOMIEL",score:1400});	
}
*/

function resetGlobalVariables(){
	GlobalRivetCount = 0;
	GlobalCurrentPlayer = 1;
	GlobalStillPlaying=[true,true];
	GlobalFinishedLevel = [false,false];
	GlobalLostLive = false;
	GlobalFirstGameOver = [false,false];
	GlobalPlatform = navigator.platform;
	GlobalTouchScreen = touchScreenAvailable(); //(GlobalPlatform=="iPad"||GlobalPlatform=="iPhone");
	GlobalWidth=449;
	GlobalHeight=514;
	GlobalScale = 1;
	_WIDTH=GlobalWidth;
	_HEIGHT=GlobalHeight;
	_SCALE=GlobalScale;
	TEST = false;
	_LOADEDELEMENTS=[];
	_RETURNTEXT=[];
	_EXIT=false;
	_TOPSCORES=[];
	getSessionUser();
	setWindow();
	readTopScores;
}

function readTopScores(){
	if(navigator.onLine){
	new Promise(function(resolve,reject){
		_SV.readJSON("topscores","gameId",1).then(function(result){
			if(result instanceof Error||result==""){
				if(_OFFLINE["topscores"]!=undefined)
					_TOPSCORES=_OFFLINE["topscores"];
				else
					console.log("could not read topscores");
				jogadores.chooseNumber();
			}else{
				console.log("RESULT READING TABLE = ",result)
				tops = JSON.parse(result);
				tops.forEach(function(t){
					_TOPSCORES.push({name:t.name,score:t.score});
				});
				_OFFLINE["topscores"]=_TOPSCORES;
				jogadores.chooseNumber();	
			}
		});
	});
	}else{ 
		if(_OFFLINE["topscores"]!=undefined)
			_TOPSCORES=_OFFLINE["topscores"];
		jogadores.chooseNumber(); 
	}
}


function updateTopScores(){
if(navigator.onLine){
	let cont=0;
	_TOPSCORES.forEach(function(ts){
		cont++;
		let s="'"+cont.toString()+"'";
		let q={query:"UPDATE",table:"topscores",name:ts.name,score:ts.score,where:"gameId='1' AND scoreRanking="+s};
		//console.log(q);
		_SV.promiseToGet("POST",q).then(function(result){
			if(result instanceof Error)
				alert("Error, could not update top scores");
		});
	});
}
}

function getSessionUser(){
if(navigator.onLine){
	_SE.setORget("get").then(function(result){
		_USER.name=result;
	});
}
}