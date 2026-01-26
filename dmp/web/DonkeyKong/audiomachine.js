// JavaScript Document

function genericAudio(id,context,src){
	this.id = id;
	this.src=src;
	this.context=context
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
	var onEnd = function(sorce){
		sorce.onended=function(){
			this.playing=false;
			this.source=this.context.createBufferSource();
			this.source.buffer=this.buffer;
			onEnd(this.source);
		}.bind(this);
	}.bind(this);
	onEnd(this.source);
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
	getText("audioListTxt","audio/audiolist.txt");
	this.check = ["audioListTxt"];
	var interval = setInterval(function(){
		if(checkLoaded(this.check)){
			this.audioListTxt = _RETURNTEXT["audioListTxt"];
			clearInterval(interval)
			this.check=[];
			for(var i=0;i<this.audioListTxt.length;i++){
				var name = this.removeCarriage(this.audioListTxt[i]);
				this.audioList[name]=new genericAudio("sound"+i,this.context,"audio/"+name+".mp3");
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
	var interval=setInterval(function(){
		if(this.js.loaded){
			clearInterval(interval);
			if(this.platform.touchScreen)
				document.getElementById("thumbnailJ").dispatchEvent(new Event("touchedScreen"));
			this.loaded=true;
		}
	}.bind(this),57);	
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
		var music = sound.music;//+"\r";
		var hh = "hammer hit";//+"\r";
		var m = sound.music;
		var command = sound.command;
		if(command){
			if(command=="STOP"){
				music = music.trim();
				m = music;
				if(this.audioList[music].playing){
			  		this.audioList[music].playing=false;
			  		this.audioList[music].source.loop=false;
			  		this.audioList[music].source.stop(0);
			  		this.audioList[music].source=this.context.createBufferSource();
			  		this.audioList[music].source.buffer=this.audioList[music].buffer;
			  		this.soundStack.filter(function(sound){
				 		sound.music!=music; 
			  		});
				}
			}else if(command=="PLAY"){
				//console.log(typeof(music), this.audioList[0])
				//console.log(music, this.audioList, this.audioList["coin_credit"], this.audioList.coin_credit);
				if(m!='walking'){//&&m!='death'){
					if(this.audioList[music].playing){
						this.audioList[music].source.stop(0);
						this.audioList[music].source.loop=false;
						this.audioList[music].source=this.context.createBufferSource();
						this.audioList[music].source.buffer=this.audioList[music].buffer;
					}
					this.audioList[music].playing=true;
					this.audioList[music].source.connect(this.context.destination);
					this.audioList[music].source.start(0);
				}else if(!this.audioList[music].playing&&!this.audioList[hh].playing){
						this.audioList[music].playing=true;
						this.audioList[music].source.connect(this.context.destination);
						this.audioList[music].source.start(0);
				}
			}else if(command=="PLAY LOOPING"){
				music = music.trim();
				m = music;
				if(!this.audioList[music].playing){
					//this.audioList[music].source.stop(0);
					//this.audioList[music].source=this.context.createBufferSource();
					//this.audioList[music].source.buffer=this.audioList[music].buffer;
				//}
					this.audioList[music].playing=true;
					this.audioList[music].source.connect(this.context.destination);
					this.audioList[music].source.loop=true;
					this.audioList[music].source.start(0);
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
				