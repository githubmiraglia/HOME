// JavaScript Document
var _CHOSE = false;

function domHelpers(js){
	this._js=js; // FIXING FOR MAME CONTROL
	this.choice=0;
	this.opsChoices=[];
	this.chosing=true;
	this.hold=false;
}

domHelpers.prototype.createHTML=function(nodeType,attr){
	let el=document.createElement(nodeType);
	for(let key in attr){
		if(attr.hasOwnProperty(key))
			el.setAttribute(key,attr[key]);
	}
	return(el);
}

domHelpers.prototype.styles=function(nodes,styles){
	let els=[];
	if(nodes instanceof Array)
		els=nodes;
	else
		els.push(nodes);
	els.forEach(function(node){
		for(let key in styles){
			if(styles.hasOwnProperty(key))
				node.style[key]=styles[key];
		}
	});
	return(els);
}

domHelpers.prototype.attributes=function(nodes,attr){
	let els=[];
	if(nodes instanceof Array)
		els=nodes;
	else
		els.push(nodes);
	els.forEach(function(node){
		for(let key in attr){
			if(attr.hasOwnProperty(key))
				node[key]=attr[key];
		}
	});
	return(els);
}

domHelpers.removeStyles=function(nodes,styles){
	let els=[];
	if(nodes instanceof Array)
		els=nodes;
	else
		els.push(nodes);
	els.forEach(function(node){
		for(let key in styles){
			if(styles.hasOwnProperty(key))
				node.style[key]="";
		}
	});
}

domHelpers.prototype.events=function(nodes,events){	
	let els=[];
	if(nodes instanceof Array)
		els=nodes;
	else
		els.push(nodes);
	els.forEach(function(node){
		for (let key in events){
			if(events.hasOwnProperty(key))
				node.addEventListener(key,events[key]);
		}
	});
}

domHelpers.prototype.removeEvents=function(wrapper,nodeType,exclude,events){	
	let els=[];
	if(nodes instanceof Array)
		els=nodes;
	else
		els.push(nodes);
	els.forEach(function(node){
		for (let key in events){
			if(events.hasOwnProperty(key))
				node.removeEventListener(key);
		}
	});
}

domHelpers.prototype.find=function(wrapper,nodeType,exclude){
	let found=[];
	let elm=Object.keys(wrapper.childNodes).map(function(key){return wrapper.childNodes[key];})
	for(let key in elm){
		if(elm[key].nodeName==nodeType&&elm[key].type!=exclude){
			found.push(elm[key]);
		}
		if(elm[key].hasChildNodes())
			this.find(elm[key],nodeType,exclude);
	}
	return(found)
}

domHelpers.prototype.findWidth=function(wrapper,str,font){
	let stringWidth=this.createHTML("div",{});
	this.styles(stringWidth,{visibility:"hidden",font:font,position:"absolute",height:"auto",width:"auto",whiteSpace:"nowrap"});
	this.attributes(stringWidth,{innerHTML:""});
	this.attributes(stringWidth,{innerHTML:str});
	wrapper.appendChild(stringWidth);
	let h = (stringWidth.offsetHeight+1);
	let w = (stringWidth.offsetWidth+1);
	let arr = [w,h];
	wrapper.removeChild(stringWidth);
	return(arr);
}

domHelpers.prototype.chose= function(opts) {
if(!_CHOSE){	
	this.js = opts.joystick;
	this.chosing=true;
	opts=opts||{};
	let scale=opts.scale||1;
	let font=opts.font||Math.floor(24*scale)+"px ArcadeClassic";
	let wrapper=opts.wrapper||document.body;
	let backColor=opts.backColor||["orange","black"];
	let color=opts.color||["white","white"];
	let backChoseColor=opts.backChoseColor||"red";
	let shdow=opts.boxshadow||"";
	let left=opts.left||0.5;
	let top=opts.top||0.62;
	let choices=opts.choices||["1 PLAYER(S)","2 PLAYER(S)"];
	let paddingL=opts.padding||"2px";
	let currentChoice=0;
	let nextChoice=1;
	let callbackChoice = opts.callback;
	let d=[];
	let halfscreen=opts.halfscreen||"none"
	d.push(this.findWidth(wrapper,choices[0],font));
	if(choices.length>1)
		d.push(this.findWidth(wrapper,choices[1],font));
	else
		nextChoice=0;
	let ops=[];	

	var leftadjust=(!halfscreen||halfscreen=="none"||halfscreen==""||halfscreen==0)?0:((halfscreen=="left")?-Math.floor(wrapper.offsetWidth/4):Math.floor(wrapper.offsetWidth/4));
	for (var i=0;i<choices.length;i++){
		ops.push(this.createHTML("p",{}));
		let l=Math.floor(wrapper.offsetLeft+(wrapper.offsetWidth-d[i][0])*left)+leftadjust+"px";
		let t=Math.floor(-200 * _SCALE + wrapper.offsetTop+(wrapper.offsetHeight-d[i][1])*top+i*1.2*(Math.max(Math.floor(5*scale),3)+d[i][1]))+"px";
		this.styles(ops[i],{left:l,top:t,position:"fixed",font:font,color:color[i],backgroundColor:backColor[i],boxShadow:shdow,paddingLeft:paddingL});
		this.attributes(ops[i],{innerHTML:choices[i]});
		this.opsChoices.push(ops[i]);
		wrapper.appendChild(ops[i]);
	}

	this.events(ops,
				{"mouseover":function(e){	
					if(e.target!=ops[currentChoice]&&!this.hold){	
						let t=currentChoice;
						currentChoice=nextChoice;
						nextChoice=t;
						this.styles(ops[currentChoice],{color:color[1],backgroundColor:backColor[0],cursor:"pointer"});
						this.styles(ops[nextChoice],{color:color[0],backgroundColor:backColor[1],cursor:"pointer"});	
					}else{
						this.styles(ops[currentChoice],{cursor:"pointer"});
					}
				}.bind(this),
				"mousedown":function(){
				 	this.styles(ops[currentChoice],{backgroundColor:backChoseColor});
					this.choice=currentChoice;
					this.js.touchedOnce=true;
					this.chosing=false;
					_CHOSE=true;	
					console.log("CHOICE: ", this.choice);
					let dummy1 = callbackChoice(this.choice);
				}.bind(this)}
	);	
	setTimeout(this.jsHandler(this.opsChoices),500);
}else{
	_CHOSE=false;
}
}


domHelpers.prototype.jsHandler=function(){
	//this.js.readJoystick();
	if(this.js.down&&this.opsChoices.length>1){
		this.choice=1;
		this.opsChoices[1].dispatchEvent(new MouseEvent('mouseover'));
	}else if(this.js.up){
		this.choice=0;
		this.opsChoices[0].dispatchEvent(new MouseEvent('mouseover'));
	}else if(this.js.fire){
		if(this.opsChoices.length>1)
			this.opsChoices[this.choice].dispatchEvent(new MouseEvent('mousedown'));
		else
			this.opsChoices[0].dispatchEvent(new MouseEvent('mousedown'));
	}
}

domHelpers.prototype.removeChose=function(el){
	var containerChildren = document.getElementById(el).children;
	var l = containerChildren.length
	for (var i = 0; i < l-1; i++) {
    		containerChildren[0].remove()
	}
	//this.opsChoices[0].remove();
	//this.opsChoices[1].remove;
	//this.opsChoices[0].parentNode.removeChild(this.opsChoices[0]);
	//if(this.opsChoices.length>1)
	//	this.opsChoices[1].parentNode.removeChild(this.opsChoices[1]);
	this.opsChoices=[];
	this.chosing=false;
}





