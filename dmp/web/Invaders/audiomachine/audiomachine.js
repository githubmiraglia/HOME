// JavaScript Document

var fonend = function(){};

function genericAudio(id,context,src){
	this.id = id;
	this.src=src;
	this.context=context;
	this.gainNode=this.context.createGain();
	this.gainNode.gain.value=1;
	this.gainNode.connect(this.context.destination);
	this.source = context.createBufferSource();
	var request = new XMLHttpRequest();
	request.open('GET', src, true);
	request.responseType = 'arraybuffer';
  	request.onload = function(){
    	this.context.decodeAudioData(request.response,function(buffer){ 
  			this.buffer = buffer;
			this.source.buffer=this.buffer;
			_LOADEDELEMENTS.push(id);
		}.bind(this), onError);
  	}.bind(this);
	request.send();
	this.playing=false;
	
	var fonend = function(){
		this.playing=false;
		this.source=this.context.createBufferSource();
		this.source.onended=fonend;
		this.source.buffer=this.buffer;
	}.bind(this);

	
	this.source.onended=fonend;
		
		//function(){
		//this.playing=false;
		//this.source=this.context.createBufferSource();
		//this.source.buffer=this.buffer;
	//}.bind(this);
}
	
function onError(){
	console.log("Could not load the source");
}

function audiomachine(platform,js){
	this.platform=platform;
	this.js=js;
	this.soundStack=[];
	this.check=[];
	this.audioListTxt = [];
	this.audioList = {};
	this.context={};
	this.loaded = false;
	this.setAudioContext();
	this.once=[0,0,0,0,0];
	this.stopping=false;
};

audiomachine.prototype.setAudioContext = function(){ 
if(!_REPLAY){
	if(this.platform.touchScreen){
		var AudioContext=window.AudioContext || window.webkitAudioContext;
		this.context=new AudioContext();
		var unlock = function(){
			this.context.resume().then(function(){
				document.body.removeEventListener('touchstart', unlock);
                document.body.removeEventListener('touchend', unlock);
				this.createAudioList();
			}.bind(this))
		}.bind(this);
		document.body.addEventListener('touchstart', unlock, false);
        document.body.addEventListener('touchend', unlock, false);
		_OFFLINE["ac"]=this.context;
	}else{
		var interval=setInterval(function(){
			if(this.js.touchedOnce){
				var AudioContext=window.AudioContext || window.webkitAudioContext;
				this.context=new AudioContext();
				this.context.resume();
				this.createAudioList();
				clearInterval(interval);
				_OFFLINE["ac"]=this.context;
			}	
		}.bind(this),107);
	}
}else{
	this.context=_OFFLINE["ac"];
	this.createAudioList();
}
}

audiomachine.prototype.createAudioList = function(){
if(!_REPLAY){
	getText("audioListTxt",_ROOT+"/audiomachine/audio/audiolist.txt");
	this.check = ["audioListTxt"];
	var interval = setInterval(function(){
		if(checkLoaded(this.check)){
			this.audioListTxt = _RETURNTEXT["audioListTxt"];
			clearInterval(interval)
			this.check=[];
			for(var i=0;i<this.audioListTxt.length;i++){
				var name = this.removeCarriage(this.audioListTxt[i]);
				let p=name.indexOf("\r");
				if(p>-1)
					name=name.substring(0,p);
				this.audioList[name]=new genericAudio("sound"+i,this.context,_ROOT+"/audiomachine/audio/"+name+".mp3");
				this.check.push("sound"+i);
			}
			var interval_2 = setInterval(function(){	
				if(checkLoaded(this.check)){
					clearInterval(interval_2);
					if(this.platform.touchScreen)
						document.getElementById("thumbnailJ").dispatchEvent(new Event("touchedScreen"));
					this.loaded = true;
					_OFFLINE["am"]=this.audioList;
				}		
			}.bind(this),49);									
		}
	}.bind(this),47)
}else{
	this.audioList=_OFFLINE["am"];
	if(this.platform.touchScreen)
		document.getElementById("thumbnailJ").dispatchEvent(new Event("touchedScreen"));
	this.loaded=true;
}
}

audiomachine.prototype.removeCarriage = function (input) {
    if (input.includes("\r")) {
	return input.replace(/\r/g, "").trimEnd()
    }
    return input.trimEnd();
}

audiomachine.prototype.playStack=function(soundStack){
this.soundStack = soundStack;
if(this.soundStack&&_SOUNDS){
	var last = this.soundStack.length-1;
	for(var i=last;i>=0;i--){
		var sound = this.soundStack.pop();
		var music = sound.music;
		var command = sound.command;
		var volume = sound.volume||1;
		if(command){
			if(command=="PLAY"){
				if(this.audioList[music].playing){
					this.audioList[music].source.stop(0);
					this.audioList[music].source.loop=false;
					this.audioList[music].source=this.context.createBufferSource();
					this.audioList[music].source.onended=fonend;
					this.audioList[music].source.buffer=this.audioList[music].buffer;
				}
				this.audioList[music].gainNode.gain.value=volume;
				this.audioList[music].playing=true;
				this.audioList[music].source.connect(this.audioList[music].gainNode);
				this.audioList[music].source.start(0);
			}else if(command=="PLAY LOOPING"){
				if(!this.audioList[music].playing){
					this.audioList[music].gainNode.gain.value=volume;
					this.audioList[music].playing=true;
					this.audioList[music].source.connect(this.audioList[music].gainNode);
					this.audioList[music].source.loop=true;
					this.audioList[music].source.start(0);
				}
			}else if(command=="PLAYTOEND"){
				if(!this.audioList[music].playing){
					this.audioList[music].gainNode.gain.value=volume;
					this.audioList[music].playing=true;
					this.audioList[music].source.connect(this.audioList[music].gainNode);
					this.audioList[music].source.start(0);
				}
			}else if(command=="STOP"){
			  if(this.audioList[music].playing){
			  this.audioList[music].playing=false;
			  this.audioList[music].source.loop=false;
			  this.audioList[music].source.stop(0);
			  this.audioList[music].source=this.context.createBufferSource();
			  this.audioList[music].source.onended=fonend;
			  this.audioList[music].source.buffer=this.audioList[music].buffer;
			  this.soundStack.filter(function(sound){
				 sound.music!=music; 
			  });
			  }
			}else if(command=="STOPALL"){
				for(let key in this.audioList){
					if(this.audioList.hasOwnProperty(key)){
						if(this.audioList[key].playing){
							this.audioList[key].playing=false;
							this.audioList[key].source.loop=false;
							this.audioList[key].source.stop(0);
							this.audioList[key].source=this.context.createBufferSource();
							this.audioList[key].source.onended=fonend;
							this.audioList[key].source.buffer=this.audioList[key].buffer;
			  				this.soundStack.filter(function(sound){
				 				sound.music!=music; 
			  				});
						}
					}
				}
			}
		}
	}
}else{
	this.soundStack=[];
}
return(this.soundStack);
}
			
audiomachine.prototype.checkEnded=function(music){
	if(!this.audioList[music].playing||!_SOUNDS)
	   return true;
	else
	   return false;
}
	  
audiomachine.prototype.checkStarted=function(music){
	if(this.audioList[music].audio.currentTime>0){
	   return true;
	}
	else
	   return false;
}	
				