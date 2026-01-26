var _PLATFORM = {};
var _LOADEDELEMENTS = [];
var _thisIntegrationMAMEjs = null;

function createScripts(id,src){

	this.id = id;
	this.script = document.createElement("script");
	this.script.src = src;
	this.elementToBeAppended = document.getElementById("script-container");
	this.elementToBeAppended.appendChild(this.script);
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

//the variable mamejs is the loaded script of the same name

//####################################################### NEW CODE FOR MAME #######################
function IntegrationMAMEjs(){
    document.body.style.margin="0px";
    document.body.style.padding="0px";
    document.body.style.overflow="hidden";
    this.GAMEHEIGHTMAME = window.innerWidth * 1.25 * 0.75;
    this.GAMEWIDTHMAME = window.innerWidth * 1.25;
    this.caminho = "/DMP/MAME";
    this.once = null;
    this.DOMELEMENTS = [];
    this.loadedMame = null;
    this.gamesList=[];
    this.config = null;
    this.waitRoms = document.getElementById("waitForRoms");
    this.mameWrapper = document.getElementById("mameWrapper");
    this.logoContainer = document.getElementById("logo-container");
    this.mameContainer =  document.getElementById("mame-container");
    this.gamepadContainer = document.getElementById("gamePadContainer");
	this.exitContainer =  document.getElementById("exit-container");
    this.multiplier = window.innerWidth<390?1.15:1;
    this.s2 = null;
    this.js = null;
    this.dh = null;;
	this.mame = false; // flag to set mame is active
    this.ROMSLOADED = false;//this.getQueryParam("ROMSLOADED") || false;
    this.runCreateMame()
}

// Function to get query parameters
IntegrationMAMEjs.prototype.getQueryParam = function(name){
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
}

IntegrationMAMEjs.prototype.setPlatform = function(){
	var platform={};
	platform.navigator = navigator;
	platform.touchScreen =  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent); 
	return(platform);
}

IntegrationMAMEjs.prototype.runCreateMame = function(){
    //s1 = new createScripts("gs1",_ROOT+"/globalvariables/helperfunctions.js");
	_thisIntegrationMAME=this;
	this.s2 = new createScripts("gs2",this.caminho+"/mamejs/mamejs.js");
	var interval = setInterval(function(){
		var check=["gs2"]//,"gs1", "gs3"];
		if (checkLoaded(check)){
			clearInterval(interval);
			s4 = new createScripts("gs4",_thisIntegrationMAME.caminho+"/joystick/joystick.js");
			s5 = new createScripts("gs5",_thisIntegrationMAME.caminho+"/joystick/gamepads.js");
			s6 = new createScripts("gs6",_thisIntegrationMAME.caminho+"/joystick/keyboard.js");
			s7 = new createScripts("gs7",_thisIntegrationMAME.caminho+"/joystick/virtualJoystick.js");
			s8 = new createScripts("gs8",_thisIntegrationMAME.caminho+"/joystick/joystickIntegrationMAME.js");
			s9 = new createScripts("gs9",_thisIntegrationMAME.caminho+"/globalvariables/dom.js");
			var interval_2 = setInterval(function(){
				var check=["gs4","gs5","gs6","gs7","gs8","gs9"];
				if(checkLoaded(check)){
					clearInterval(interval_2);
					_PLATFORM = _thisIntegrationMAME.setPlatform();
					_thisIntegrationMAME.createConfigMame("/DMP/site/img/tnailsmame/thumbnailsmame.txt")
					clearInterval(interval);
				}
			},37);
		}
	},37);
}

// old tentative not used
IntegrationMAMEjs.prototype.getConfigForGame = function(originalConfig, gameName) {
    if (!originalConfig.games.driver[gameName] || !originalConfig.games.files[gameName]) {
        return null; // Return null if the game is not found
    }

    return {
        emulator: originalConfig.emulator,
        games: {
            driver: { [gameName]: originalConfig.games.driver[gameName] },
            files: { [gameName]: originalConfig.games.files[gameName] }
        },
        resolution: originalConfig.resolution
    };
}

IntegrationMAMEjs.prototype.preloadMAME=function(){
	return mamejs.load(this.config.emulator, this.mameContainer).then((mame) => {
		this.loadedMame = mame; // Store instance
		console.log("MAMEJS loaded successfully", this.loadedMame);
		this.setCSSmame();
		return this.loadedMame.loadRoms(this.config.games.files) // Load all ROMs
			.then(() => {
				console.log("All Roms preloaded");
				this.ROMSLOADED = true;				
				this.waitRoms.style.display = "none";
				if (!this.loadedMame) {
					console.error("MAMEJS is not loaded yet!");
					return;
				}

	    });	
	});
}

IntegrationMAMEjs.prototype.setCSSmame = function () {
    var iframe = document.getElementById("emloader-iframe");
    if (!iframe) return;

    // Detect desktop properly
    const isDesktop = !_PLATFORM.touchScreen;

    if (isDesktop) {
        // ✅ DESKTOP: force classic arcade resolution
		console.log("MAME DIMENSIONS");
		console.log(this.GAMEWIDTHMAME, this.GAMEHEIGHTMAME);
		iframe.style.paddingTop = "6vh";
        iframe.style.width = this.GAMEWIDTHMAME*0.5+"px";
        iframe.style.height = this.GAMEHEIGHTMAME*0.5+"px";
		console.log("SETTING HEIGHT FOR DESKTOP", iframe.style.width, iframe.style.height);
        iframe.style.display = "block";
        iframe.style.margin = "0 auto";   // center horizontally
        iframe.style.paddingLeft = "0";
    } else {
        // 📱 MOBILE (unchanged behavior)
        iframe.style.width = "100%";
        iframe.style.height = "auto";
        iframe.style.paddingLeft = "-20%";
    }

    // Mobile-only container scaling (keep as-is)
    if (_PLATFORM.touchScreen) {
        this.mameContainer.style.position = "absolute";
        this.mameContainer.style.left = "-10%";
        this.mameContainer.style.width = this.GAMEWIDTHMAME + "px";
        this.mameContainer.style.height = this.GAMEHEIGHTMAME + "px";
        this.mameWrapper.style.width = this.GAMEWIDTHMAME + "px";
        this.mameWrapper.style.height = this.GAMEHEIGHTMAME + "px";
    }
};

IntegrationMAMEjs.prototype.setConfigMame=function(){
	var path = '/DMP/MAME/roms/'
	var files = {};
	var driver = {};
	this.gamesList.forEach((game)=>{
		if (!(game.includes("dmp"))){
			files[game] = path + game;
			driver[game] = game;
		}
	});
	var games = {files,driver}	
	this.config = {
		emulator: '/DMP/MAME/mamejs/mame.js', // Path to MAMEJS compiled file
		games: games,
		resolution: {
			width: this.GAMEWIDTHMAME,
			height: this.GAMEHEIGHTMAME
		}
	};
	if (typeof mamejs === "undefined") {
		console.error("mamejs is not loaded. Make sure the script path is correct.");
		return;
	}
}


IntegrationMAMEjs.prototype.createConfigMame = function(fileList){
	this.gamesList=[];
	getText("text",fileList);
	let check = ["text"];
	var interval = setInterval(function(){
		if(checkLoaded(check)){
			var spriteListTxt = _RETURNTEXT["text"];
			clearInterval(interval)
			check=[];
			for(var i=0;i<spriteListTxt.length;i++){
				var file = spriteListTxt[i];
				var url=file.slice(file.indexOf(",")+11,file.length);
				if(!url.includes("dmp")&&url!="")
				   this.gamesList.push(url)
			}
			var interval_2 = setInterval(function(){
				if(checkLoaded(check)){
					clearInterval(interval_2);
					clearInterval(interval);
					this.setConfigMame();
					var dummy1 = this.preloadMAME(this.config, this.mameContainer);
				}		
			}.bind(this),47);				
		}
	}.bind(this),47)
}

IntegrationMAMEjs.prototype.addBackAllELements=function(){
	this.stopSelectedROM()
	//console.log("ADDING ALL ELS BACK, MAMEJS = ", loadedMame);
	// code is done so that order of elements is kept as the original
    if(this.gamepadContainer)
	    this.gamepadContainer.remove()
	let containerChildren = document.body.children;
	let docBody = document.body;
	var l = containerChildren.length;
	// finishes storing and deleting
	let count = 0; 
	for (var i = 0; i < l ; i++) {
		//console.log("ADDING A ", containerChildren[count].tagName)
		if(containerChildren[count].tagName!='SCRIPT'){
			this.DOMELEMENTS.push(containerChildren[count]);
			containerChildren[count].remove()
		}else{
			count ++;
		}

	}
	//inverts order
	let _AUXELEMENTS = [];
	l = this.DOMELEMENTS.length
	for (var i = 0; i < l; i++) {
		var el = this.DOMELEMENTS.pop()
		_AUXELEMENTS.push(el);	
	}
	// adds back to body
	l = _AUXELEMENTS.length
	for (var i = 1; i < l; i++) {
		var el = _AUXELEMENTS.pop()
		//console.log("ADDING ", el.tagName);
		docBody.appendChild(el);	
	}
	// add the mame-wrapper back
	this.mameWrapper = document.getElementById("mameWrapper");
	if (!this.mameWrapper) {
		mameWrapper = document.createElement("div");
		this.mameWrapper.id = "mameWrapper";
		document.body.appendChild(this.mameWrapper);
	}
	this.logoContainer = document.getElementById("logo-container");
	if (!this.logoContainer) {
		this.logoContainer = document.createElement("div");
		this.logoContainer.id = "logo-container";
		mameWrapper.appendChild(this.logoContainer);
	}
	this.mameContainer = document.getElementById("mame-container");
	if (!this.mameContainer) {
		this.mameContainer = document.createElement("div");
		this.mameContainer.id = "mame-container";
		this.mameWrapper.appendChild(this.mameContainer);
	}
	this.gamepadContainer = document.getElementById("gamepad-container");
	if (!this.gamepadContainer) {
		this.gamepadContainer = document.createElement("div");
		this.gamepadContainer.id = "gamepad-container";
		document.body.appendChild(this.gamepadContainer);
	}
	this.exitContainer = document.getElementById("exit-container");
	if (!this.exitContainer) {
		this.exitContainer = document.createElement("div");
		this.exitContainer.id = "exit-container";
		document.body.appendChild(this.exitContainer);
	}
	// hides the logo
	this.logoContainer = document.getElementById("logo-container");
	this.logoContainer.visibility = "hidden";
	docBody.style.backgroundColor = "#EEEEEE"
	this.createConfigMame("/DMP/site/img/tnailsmame/thumbnailsmame.txt");
	return;
}

IntegrationMAMEjs.prototype.removeAllElementsButMameDiv=function(){
	let containerChildren = document.body.children;
	let l = containerChildren.length
	let count = 0;
	for (var i = 0; i < l; i++) {
			//console.log(containerChildren[count].tagName)
			if(containerChildren[count].tagName!='SCRIPT'&&containerChildren[count].id!='mameWrapper'&&containerChildren[count].id!='script-container'&&containerChildren[count].id!='exit-container'){
				this.DOMELEMENTS.push(containerChildren[count]);
    			containerChildren[count].remove()
			}else{
				count ++;
			}
	}
	if(!_PLATFORM.touchScreen){
		this.logoContainer.style.visibility = "visible";
	}
}

IntegrationMAMEjs.prototype.reloadMameScript = function() {
	this.ROMSLOADED = false;
    if (this.s2) {
        this.s2.script.remove();  // Remove the script from the DOM
        this.s2 = null;  // Clear the global variable
    }
    this.s2 = new createScripts("gs2", this.caminho + "/mamejs/mamejs.js");
    // Wait for the script to load before proceeding
    let checkInterval = setInterval(() => {
        if (checkLoaded(["gs2"])) {
            clearInterval(checkInterval);
            console.log("MAMEJS script reloaded successfully.");
			this.addBackAllELements();
        }
    }, 50);
}

// Run the selected ROM
IntegrationMAMEjs.prototype.runSelectedROM = function(rom){
	document.body.style.backgroundColor="#1e1e2f";	
	var selectedROM = rom;
	if (!this.loadedMame) {
		console.error("MAMEJS is not loaded yet!");
		return;
	}
	// Remove all elements from page
	this.removeAllElementsButMameDiv();
	// Run the selected game
	this.loadedMame.runGame(selectedROM)
		.then(() => {
			console.log("Now playing:", selectedROM);
			this.initializeJoystick(mamejs); // Ensure joystick integration after game loads
		})
	    .catch((err) => console.error("Error starting game:", err)
    );
	
}

//Stop playing game
IntegrationMAMEjs.prototype.stopSelectedROM=function(){
	try {
	  this.loadedMame.loader.module.ccall('exit', 'void', ['number'], [0]);
	  console.log("QUIT MAME");
	} catch (err) {
		console.log("MAME exited, ignoring error:", err.message);
	}
}

// Initialize joystick integration
IntegrationMAMEjs.prototype.initializeJoystick = function() {
	this.js = new joystick(_PLATFORM,mamejs,this);
	this.dh = new domHelpers(this.js);
}

IntegrationMAMEjs.prototype.callBackChoice = (choice) => {
	var choice = choice;

	if(choice==0){
		var exitContainer = document.getElementById("exit-container");
		let child = exitContainer.lastElementChild;
		while (child) {
			exitContainer.removeChild(child);
			child = exitContainer.lastElementChild;
		}
		_thisIntegrationMAMEjs.once = false;
		_thisIntegrationMAMEjs.waitRoms.style.display="block";
		_thisIntegrationMAMEjs.reloadMameScript();
	}else{
		var exitContainer = document.getElementById("exit-container");
		let child = exitContainer.lastElementChild;
		count = 0;
		while (child && count < 2) {
			if(child.tagName=='P'){
				count ++;
				exitContainer.removeChild(child);
				child = exitContainer.lastElementChild;
			}
		}
		_thisIntegrationMAMEjs.js.exit = true;
		_thisIntegrationMAMEjs.once = true;
		_thisIntegrationMAMEjs.js.joystickIntegrationMAME.checkPress();
		setTimeout(()=>{
			_thisIntegrationMAMEjs.js.exit = false;
			_thisIntegrationMAMEjs.once = false;
		},750);
	}
}


// ask if finish game
IntegrationMAMEjs.prototype.confirmExit=function(str2,js){
	_thisIntegrationMAMEjs = this;
	//console.log("CAME TO CONFIRM EXIT")
	_CHOSE = false;
	this.dh.chose({wrapper:document.getElementById("exit-container"),scale:_SCALE,choices:[" E X I T",str2],boxshadow:"0px 0px 1px 4px black",halfscreen:"none",callback:_thisIntegrationMAMEjs.callBackChoice,joystick:js});
	this.dh.jsHandler();
	this.once = true;
}

//####################################################### END OF NEW CODE FOR MAME #######################
