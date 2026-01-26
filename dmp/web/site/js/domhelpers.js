// JavaScript Document
function domHelpers(){
}

domHelpers.prototype.createHTML=function(nodeType,attr,styles){
	attr=attr||"";
	styles=styles||"";
	let node=document.createElement(nodeType);
	this.attributes(node,attr);
	this.styles(node,styles);
	return(node);
}

domHelpers.prototype.styles=function(nodes,styles){
	styles=styles||"";
	nodes=(nodes instanceof HTMLCollection)?nodes:[nodes];
	if(styles!=""){
		for(let node of nodes){
			for(let key in styles){
				if(styles.hasOwnProperty(key))
					node.style[key]=styles[key];
			}
		}
		nodes=(nodes instanceof HTMLCollection)?nodes:nodes[0];
		return(nodes);
	}
}

domHelpers.prototype.attributes=function(nodes,attr){
	attr=attr||"";
	nodes=(nodes instanceof HTMLCollection)?nodes:[nodes];
	if(attr!=""){
		for(let node of nodes){
			for(let key in attr){
				if(attr.hasOwnProperty(key))
					node.setAttribute(key,attr[key]);
			}
		}
		nodes=(nodes instanceof HTMLCollection)?nodes:nodes[0];
		return(nodes);
	}
}

domHelpers.removeStyles=function(nodes,styles){
	styles=styles||"";
	nodes=(nodes instanceof HTMLCollection)?nodes:[nodes];
	if(styles!=""){
		for(let node of nodes){
			for(let key in styles){
				if(styles.hasOwnProperty(key))
					node.style[key]="";
			}
		}
		nodes=(nodes instanceof HTMLCollection)?nodes:nodes[0];
		return(nodes);
	}
}

domHelpers.prototype.events=function(nodes,events){
	events=events||"";
	nodes=(nodes instanceof HTMLCollection)?nodes:[nodes];
	if(events!=""){
		for(let node of nodes){
			for (let key in events){
				if(events.hasOwnProperty(key))
					node.addEventListener(key,events[key]);
			}
		}
		nodes=(nodes instanceof HTMLCollection)?nodes:nodes[0];
		return(nodes);
	}
}

domHelpers.prototype.removeEvents=function(nodes,events){
	events=events||"";
	nodes=(nodes instanceof HTMLCollection)?nodes:[nodes];
	if(events!=""){
		for(let node of nodes){
			for (let key in events){
				if(events.hasOwnProperty(key))
					node.removeEventListener(key);
			}
		}
		nodes=(nodes instanceof HTMLCollection)?nodes:nodes[0];
		return(nodes);
	}
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
