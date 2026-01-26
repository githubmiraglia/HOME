// JavaScript Document
var _LOADEDELEMENTS=[];
var _RETURNTEXT = [];
var _thisCarousel=null;

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

function genericSprite(id,src,w,h,url){
	this.id = id;
	this.img = document.createElement("img");
	this.img.src = src;
	this.w = w;	
	this.h = h;
	this.url=url;
	this.img.addEventListener("load",function(){
			_LOADEDELEMENTS.push(id);
		});
}

function carousel(dh,sv, mamejs){
	this.dh=dh;
	this.tnail={};
	this.img={};
	this.href="";
	this.elm={};
	this.txtNode={};
	this.text={};
	this.el={};
	this.spritelist=[];
	this.sv=sv;
	this.mamejs = mamejs;
	this.mamerom = null;
	_thisCarousel = this;
}

//########################################## NEW CODE FOR HANDLING MAME ##################################
carousel.prototype.carouselHandlerMame= () => {
	let h=(window.innerWidth>600)?275:220;
	let w=Math.floor((h-26)/(576/448));
	let m=(h==275)?15:10;
	_thisCarousel.spritelist.forEach(function(sprite){
		_thisCarousel.tnail=_thisCarousel.dh.createHTML("div","",{display:"inline-block",height:h+"px",width:w+"px",margin:"0px "+m+"px "+"0px "+m+"px",border:"solid 1px #1e1e2f",borderRadius:"5px",backgroundColor:"#1e1e2f"});
		_thisCarousel.img=sprite.img;
		_thisCarousel.dh.styles(_thisCarousel.img,{borderRadius:"5px",maxWidth:"100%",height:"auto"});
		_thisCarousel.mamerom = _thisCarousel.text.elm=="p"?sprite.url:"";
		// use event handler for play button instead of hyperlink
		// because MAME uses the same page the site is in
		// because it is initialized alongside with the site so it can read all roms at once
		_thisCarousel.href="/DMP/site/index.html?rom="+this.mamerom;
		_thisCarousel.elm=_thisCarousel.dh.createHTML(_thisCarousel.text.elm,{href:_thisCarousel.href},{textDecoration:"none",fontSize:_thisCarousel.text.fs,color:_thisCarousel.text.cl,marginTop:"2px",textAlign:"center",width:"100%",height:"auto",float:"left",fontFamily:"ArcadeClassic"});
		// add event listener to call global function runSelectedRom
		var f = _thisCarousel.createFunctionForRom(_thisCarousel.mamerom);
		_thisCarousel.dh.events(_thisCarousel.elm,{"mousedown":f})
		//
		_thisCarousel.txtNode=document.createTextNode(_thisCarousel.text.txt);
		_thisCarousel.elm.appendChild(_thisCarousel.txtNode);
		_thisCarousel.tnail.appendChild(_thisCarousel.img);
		_thisCarousel.tnail.appendChild(_thisCarousel.elm);
		_thisCarousel.el.appendChild(_thisCarousel.tnail);
	});
	_thisCarousel.dh.styles(_thisCarousel.el,{top:"5px",float:"left",width:"100%",whiteSpace:"nowrap",overflow:"auto",height:h+20+"px",marginBottom:"10px"});
	_thisCarousel.dh.styles(document.getElementById("clearCarousel"),{height:"24px"});
}

carousel.prototype.createFunctionForRom = function(rom){
	var f = eval("f = function(){if(_thisCarousel.mamejs.ROMSLOADED){_thisCarousel.mamejs.runSelectedROM(rom)}}");
	return(f);
}

//########################################## END CODE FOR HANDLING MAME ##################################

carousel.prototype.createSpritesList = function(el,list,root){
	this.spritelist=[];
	getText("text",list);
	let check = ["text"];
	var interval = setInterval(function(){
		if(checkLoaded(check)){
			var spriteListTxt = _RETURNTEXT["text"];
			clearInterval(interval)
			check=[];
			for(var i=0;i<spriteListTxt.length;i++){
				var file = spriteListTxt[i];
				if(file!=''){
				var name = file.slice(0,spriteListTxt[i].indexOf(","));
				var file = spriteListTxt[i];
				var w = parseInt(file.slice(file.indexOf(",")+1,file.indexOf(",")+5),10);
				var file = spriteListTxt[i];
				var h = parseInt(file.slice(file.indexOf(",")+6,file.indexOf(",")+11),10);
				var file = spriteListTxt[i];
				var url=file.slice(file.indexOf(",")+11,file.length);
				this.spritelist.push(new genericSprite("sprite"+i,root+name+".png",w,h,url));
				check.push("sprite"+i);
			}}
			var interval_2 = setInterval(function(){
				if(checkLoaded(check)){
					clearInterval(interval_2);
					_thisCarousel=this; //ugly hacking, but couldn't find other solution
					el.dispatchEvent(new Event("loaded"));
				}		
			}.bind(this),47);
									
		}
	}.bind(this),47)
}

carousel.prototype.carouselHandler=function(){
	if(_thisCarousel.mamejs.mame){
		_thisCarousel.carouselHandlerMame()
	}else{
		let h=(window.innerWidth>600)?275:220;
		let w=Math.floor((h-26)/(576/448));
		let m=(h==275)?15:10;
		_thisCarousel.spritelist.forEach(function(sprite){
			_thisCarousel.tnail=_thisCarousel.dh.createHTML("div","",{display:"inline-block",height:h+"px",width:w+"px",margin:"0px "+m+"px "+"0px "+m+"px",border:"solid 1px #1e1e2f",borderRadius:"5px",backgroundColor:"#1e1e2f"});
			_thisCarousel.img=sprite.img;
			_thisCarousel.dh.styles(_thisCarousel.img,{borderRadius:"5px",maxWidth:"100%",height:"auto"});
			_thisCarousel.href=_thisCarousel.text.elm=="a"?sprite.url:"";
			_thisCarousel.elm=_thisCarousel.dh.createHTML(_thisCarousel.text.elm,{href:_thisCarousel.href},{textDecoration:"none",fontSize:_thisCarousel.text.fs,color:_thisCarousel.text.cl,marginTop:"2px",textAlign:"center",width:"100%",height:"auto",float:"left",fontFamily:"ArcadeClassic"});
			_thisCarousel.txtNode=document.createTextNode(_thisCarousel.text.txt);
			_thisCarousel.elm.appendChild(_thisCarousel.txtNode);
			_thisCarousel.tnail.appendChild(_thisCarousel.img);
			_thisCarousel.tnail.appendChild(_thisCarousel.elm);
			_thisCarousel.el.appendChild(_thisCarousel.tnail);
		});
		_thisCarousel.dh.styles(_thisCarousel.el,{top:"5px",float:"left",width:"100%",whiteSpace:"nowrap",overflow:"auto",height:h+20+"px",marginBottom:"10px"});
		_thisCarousel.dh.styles(document.getElementById("clearCarousel"),{height:"24px"});
	}
}

carousel.prototype.create=function(el,list,root,text){
	this.el=el;
	this.text=text;
	this.el.addEventListener("loaded",this.carouselHandler,true);
	this.createSpritesList(this.el,list,root);
}

carousel.prototype.destroy=function(el){
	el.removeEventListener("loaded",this.carouselHandler,true);
	this.dh.styles(el,{top:"0px",height:"0px",marginBottom:"0px"});
	this.dh.styles(document.getElementById("clearCarousel"),{height:"0px"});
	setTimeout(function(){
		while (el.firstChild)
    		el.removeChild(el.firstChild);
	},300);
}




