// JavaScript Document
var _TYPE="";
var _DH={};
var _NODE={};
var _SCALE = window.innerWidth / 480;
var _R = 70 * _SCALE;


function sitecontrol(){
	this.user="";
	this.currentUser="";
	this.mail="";
	this.cookieObj={"user":"","mail":"","currentUser":""};
	this.password="";
	this.password1="";
	this.formValidations={"form1":{"user":false,"password":false},
						  "form2":{"user":false,"mail":false,"password":false}
						 };
	this.profileFormsState="none";
	this.dh=new domHelpers();
	this.sv=new server();
	this.mamejs = new IntegrationMAMEjs();
	this.mamejs.mame = false;
	this.cr=new carousel(this.dh,this.sv,this.mamejs);
	this.su=new sessionForUser();
	this.captcha=document.getElementById("captcha");
	this.arcadeActive=false;
	this.fnOfClickables=[];
	this.gameTopscores=[]
}

sitecontrol.prototype.setEventListeners=function(){
	this.resize([380,1980],this.dh);
	this.mover(this.dh);
	this.setFnsOfClickables(this.dh);
	this.clickables(this.dh);
	this.exit(this.dh);
	this.formValidation(this.dh);
	this.capsWarning(this.dh);
	this.userOkedCookie(this.dh);
	this.checkCookie(this.dh);
	window.dispatchEvent(new Event("resize"));
}

sitecontrol.prototype.resize=function(rangeWidth,dh){
	dh.events(window,
		{"resize":function(){
					let	currWidth=document.documentElement.clientWidth;
					let percWidth=0;
					let nodes=document.getElementsByClassName("resize");
					for(let node of nodes){
						let minw=parseInt(node.getAttribute("data-minw"),10);
						let maxw=parseInt(node.getAttribute("data-maxw"),10);
						switch(node.nodeName){
							case("IMG"):
								percWidth=maxw-(maxw-minw)*(currWidth-rangeWidth[0])/(rangeWidth[1]-rangeWidth[0]);
								percWidth=Math.floor(Math.min(Math.max(percWidth,minw),maxw))+"%";
								dh.styles(node,{maxWidth:percWidth});
								break;
							case("A"):
								percWidth=Math.round(minw+(maxw-minw)*(currWidth-rangeWidth[0])/(rangeWidth[1]-rangeWidth[0]));
								percWidth=Math.floor(Math.min(Math.max(percWidth,minw),maxw))+"px";
								dh.styles(node,{fontSize:percWidth});
								break;
							case("P"): //have to repeat, case does not work with OR
								percWidth=Math.round(minw+(maxw-minw)*(currWidth-rangeWidth[0])/(rangeWidth[1]-rangeWidth[0]));
								percWidth=Math.floor(Math.min(Math.max(percWidth,minw),maxw))+"px";
								dh.styles(node,{fontSize:percWidth});
								break;
							case("FIXED"):
								percWidth=maxw-(maxw-minw)*(currWidth-rangeWidth[0])/(rangeWidth[1]-rangeWidth[0]);
								percWidth-=50*(100-percWidth)/100;
								percWidth=Math.floor(Math.min(Math.max(percWidth,minw),maxw));
								let percleft=Math.floor((100-percWidth)/2)+"%";
								let mintop=parseInt(node.getAttribute("data-mintop"),10);
								let maxtop=parseInt(node.getAttribute("data-maxtop"),10);
								let perctop=Math.floor(mintop+(maxtop-mintop)*(currWidth-rangeWidth[0])/(rangeWidth[1]-rangeWidth[0]));
								perctop=Math.floor(Math.min(Math.max(perctop,mintop),maxtop));
								let percheight=(currWidth<400)?"100%":"85%";
								percWidth+="%";								
								dh.styles(node,{width:percWidth,left:percleft,top:perctop,height:percheight});
						}
					}
				}
		});
}	  
	
sitecontrol.prototype.mover=function(dh){
	let imover=document.getElementsByClassName("imover");
	dh.events(imover,
		{"mouseover":function(e){let src=e.target.getAttribute("data-moverin");
								dh.attributes(e.target,{"src":src})},
		 "mouseout":function(e){let src=e.target.getAttribute("data-moverout");
								dh.attributes(e.target,{"src":src})}  
	});
}

sitecontrol.prototype.exit=function(dh){
	let nodes=document.getElementsByClassName("exitjs")
	for(let node of nodes){
		let parentEl=document.getElementById(node.getAttribute("data-exit"));
		dh.events(node,
			{"mousedown":function(){parentEl.dispatchEvent(new MouseEvent("mousedown"))}
		});
	}
}

sitecontrol.prototype.setFnsOfClickables=function(dh){
	//fns for forms
	this.fnOfClickables.push(function(e){
		switch(this.profileFormsState){
			case("none"):
				this.profileFormsState="signingIn";
				this.resetInputs("form1",this.profileFormsState);
				this.showForm("form1",dh);
				break;
			case("signedIn"):
				this.profileFormsState="signingOut";
				this.showForm("form3",dh);
				break;
			default:
				if(e.target.nodeName=="BUTTON")
					this.checkButtons(dh,e.target);
				else{
					this.clearForms(dh);
					switch(this.profileFormsState){
						case("signingIn"):
							this.profileFormsState="none";
							break;
						case("signingOut"):
							this.profileFormsState="signedIn";
							break;
						case("creatingAccount"):
							this.profileFormsState="none";
							break;
						case("updatingAccount"):
							this.profileFormsState="signedIn";
							break;
					}
				}
				break;
		}
	}.bind(this));	
	//fns for arcade
	this.fnOfClickables.push(function(){
		if(!this.arcadeActive){
			//dh.styles(document.getElementById("header1"),{visibility:"visible"});
			this.cr.create(
  				document.getElementById("carouselArcade"),
  				"/DMP/site/img/tnails/thumbnails.txt",
  				"/DMP/site/img/tnails/",
  				{ elm:"a", txt:"PLAY", fs:"18px", cl:"red" }
			);
			this.mamejs.mame = false;
		}else{
			this.cr.destroy(document.getElementById("carouselArcade"));
			dh.styles(document.getElementById("header1"),{visibility:"hidden"});
			this.mamejs.mame = false;
		}
		this.arcadeActive=!this.arcadeActive;
	}.bind(this));
	//fns for MAME ARCADE
	this.fnOfClickables.push(function(){
		if(!this.arcadeActive&&this.mamejs.ROMSLOADED){
			this.mamejs.mame = true;
			this.cr.create(document.getElementById("carouselArcade"),"img/tnailsmame/thumbnailsmame.txt","img/tnailsmame/",{elm:"p",txt:"PLAY",fs:"18px",cl:"red"});
		}else{
			this.cr.destroy(document.getElementById("carouselArcade"));
			dh.styles(document.getElementById("header1"),{visibility:"hidden"});
			this.mamejs.mame = false;
		}
		this.arcadeActive=!this.arcadeActive;
	}.bind(this));
}

sitecontrol.prototype.clickables=function(dh){
	let nodes=document.getElementsByClassName("clickable");
	let fn=0;
	for(let node of nodes){
		fn=parseInt(node.getAttribute("data-func"),10);		
		dh.events(node,{"mousedown":this.fnOfClickables[fn]});
	}
}

sitecontrol.prototype.checkButtons=function(dh,node){
	let type=node.getAttribute("data-button");
	_TYPE=node.getAttribute("data-button");
	_DH=dh;
	_NODE=node;
	let form=node.getAttribute("data-form");
	let nextform=(type=="next")?node.getAttribute("data-nextform"):"";
	this.profileFormsState=(type=="next")?node.getAttribute("data-state"):this.profileFormsState;
	switch(type){
		case("next"):
			this.resetInputs(form,this.profileFormsState);
			this.clearForms(dh);
			this.showForm(nextform,dh);
			break;
		case("signin"):
			if(this.alltrue(form)){
				grecaptcha.execute();
			}
			break;
		case("signout"):
			this.profileFormsState="none";
			this.setfalse();
			this.resetInputs(form,this.profileFormSate);
			this.clearForms(dh);
			this.currentUser="";
			document.getElementById("user").innerHTML="";
			this.toggleInnerHTML(document.getElementById("form2Title"),dh);
			dh.attributes(document.getElementById("newOrUpdate"),{"data-button":"newaccount"});
			this.deleteCookie();
			break;
		case("newaccount"):
			if(this.alltrue(form)){
				grecaptcha.execute();
			}
			break;
		case("updateaccount"):
			if(this.alltrue(form)){
				let q={query:"UPDATE",userName:this.user,email:this.mail,password:this.password,currentUser:this.currentUser};
				this.sv.promiseToGet("POST",q).then(function(result){
					if(result instanceof Error)
						alert("Error, could not update account");
					else{
						this.clearForms(dh);
						alert("Account Updated");
						document.getElementById("user").innerHTML="Hello,<br>"+this.user;
						this.currentUser=this.user;
						this.profileFormsState="signedIn";
						if(document.getElementById("check2").checked)
							this.updateCookie(this.user,1);
						this.setSession();
					}
				}.bind(this));
			}
			break;
		default:
			this.resetInputs(form,this.profileFormsState);
			this.clearForms(dh);
			break;
	}
}

sitecontrol.prototype.resetInputs=function(form,state){
	let nodes=document.getElementsByTagName("input");
	for(let node of nodes){
		if(node.type=="text"||node.type=="password")
			node.value="";
	}
	if(form=="form3"&&state=="updatingAccount"){
		document.getElementById("newUser").value=this.user;
		this.formValidations.form2.user=true;
		document.getElementById("newEmail").value=this.mail;
		this.formValidations.form2.mail=true;
	}
}

sitecontrol.prototype.setfalse=function(){
	let obj=this.formValidations;
	for (let form in obj){
		for(let key in obj[form]){
			obj[form][key]=false;
		}
	}
}

sitecontrol.prototype.alltrue=function(form){
	let obj=this.formValidations[form];
	for(let key in obj){
		if(!obj[key])
			return false;
	}
	return true;
}

sitecontrol.prototype.showForm=function(form,dh){
	dh.styles(document.getElementById("wrapform"),{display:"block"});
	dh.styles(document.getElementById(form),{display:"block"});
}

sitecontrol.prototype.clearForms=function(dh){
	dh.styles(document.getElementsByClassName("forms"),{display:"none"});
	dh.styles(document.getElementById("wrapform"),{display:"none"});
}

sitecontrol.prototype.formValidation=function(dh){
	let nodes=document.getElementsByClassName("_focusout");
	dh.events(nodes,{"focusout":function(e){
		let node=e.target;
		let query=e.target.getAttribute("data-query");
		let val=e.target.value;
		switch(query){
			case("nameormail"):
				let field=(val.includes("@"))?"email":"userName";
				let q={query:"exist",table:"users",field:field,data:val,password:""};
				this.sv.promiseToGet("GET",q).then(function(result){
					if(result==""){
						dh.styles(node,{borderColor:"red"});
						this.setValidation(node,false);
					}else{
						dh.styles(e.target,{borderColor:"#A3ABAC"});
						this.user=result.split("&")[0];
						this.password=result.split("&")[1];
						this.mail=result.split("&")[2];
						this.setValidation(node,true);
					}
				}.bind(this));
				break;
			case("notempty"):
				if(node.getAttribute("data-validate")=="user"){
					let userformat=/^[a-z0-9" *"]+$/i;
					this.standardValidation(node,val!=""&&val.match(userformat),dh);	
				}else
					this.standardValidation(node,val!="",dh);
				break;
			case("mail"):
				let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
				this.standardValidation(node,val.match(mailformat),dh);
				break;
			case("password1"):
				this.password1=val;
				this.standardValidation(node,val!="",dh);
				break;
		}
		if(this.profileFormsState=="creatingAccount"){
			let fld=node.getAttribute("data-nexist");
			let val=node.value;
			if(fld){
				let q={query:"exist",table:"users",field:fld,data:val,password:""};
				this.sv.promiseToGet("GET",q).then(function(result){
					if(result!=""){
						this.standardValidation(node,false,dh);
					}
				}.bind(this));
			}
		}
	}.bind(this)});
	
	nodes=document.getElementsByClassName("_input");
	dh.events(nodes,{"input":function(e){
		let node=e.target;
		let query=e.target.getAttribute("data-query");
		let val=e.target.value;
		switch(query){
			case("password"):
				this.standardValidation(node,this.formValidations.form1.user&&this.password===val,dh);
				break;
			case("password2"):
				this.standardValidation(node,this.password1===val&&val!="",dh);
				break;
		}		
	}.bind(this)});
	
}
				   
sitecontrol.prototype.setValidation=function(node,bol){
	this.formValidations[node.getAttribute("data-form")][node.getAttribute("data-validate")]=bol
}

sitecontrol.prototype.standardValidation=function(node,cond,dh){
	if(cond){
		dh.styles(node,{borderColor:"#A3ABAC"});
		this.setValidation(node,true);
		if(node.name&&node.name!="")
			this[node.name]=node.value;
	}else{
		dh.styles(node,{borderColor:"red"});
		this.setValidation(node,false);
	}
}

sitecontrol.prototype.capsWarning=function(dh){
	let nodes=document.getElementsByTagName("input");
	for (let node of nodes){
		if(node.type=="password"){
			dh.events(node,{"keyup":function(e){
				if(e.getModifierState("CapsLock"))
					dh.styles(document.getElementById("caps"),{display:"block"});
				else
					dh.styles(document.getElementById("caps"),{display:"none"})
			}});
		}
	}
}

sitecontrol.prototype.toggleInnerHTML=function(node,dh){
	let temp=node.innerHTML;
	let alt=node.getAttribute("data-alt");
	dh.attributes(node,{"data-alt":temp});
	node.innerHTML=alt;
}


sitecontrol.prototype.updateCookie=function(userName,years){
	var expiration_date = new Date();
	expiration_date.setFullYear(expiration_date.getFullYear() + years);
	var cookie_string = "userName="+userName+"; expires="+expiration_date.toUTCString()+"; path=/";
	document.cookie = cookie_string;
}	

sitecontrol.prototype.setSession=function(){
	this.su.setORget("set",this.user).then(function(result){
		//console.log("updating cookie",result);
	});
}

sitecontrol.prototype.checkCookie=function(dh){
	let stringCookie=document.cookie;
	let p=stringCookie.indexOf("userName");
	let un="";
	if(p>-1){
		if(p==0){
			if(stringCookie.indexOf(";")==-1)
				un=stringCookie.substr(stringCookie.indexOf("=")+1,stringCookie.length-stringCookie.indexOf("=")-1);
			else
				un=stringCookie.substr(stringCookie.indexOf("=")+1,stringCookie.indexOf(";")-stringCookie.indexOf("=")-1);
		}else
			un=stringCookie.split("userName=")[1];
		dh.styles(document.getElementById("cookiewrapper"),{display:"none"});
		let q={query:"exist",table:"users",field:"userName",data:un,password:""};
		this.sv.promiseToGet("GET",q).then(function(result){
			if(result==""){
				this.user=""; this.mail=""; this.currentUser="";
			}else{	
				this.user=result.split("&")[0];
				this.mail=result.split("&")[2];
				this.currentUser=result.split("&")[0];	
				this.profileFormsState="signedIn";
				dh.attributes(document.getElementById("newOrUpdate"),{"data-button":"updateaccount"});
				this.toggleInnerHTML(document.getElementById("form2Title"),dh);
				document.getElementById("user").innerHTML="Hello,<br>"+this.user;
				this.setSession();
			}
		}.bind(this));
	}else{
		this.user=""; this.mail=""; this.currentUser="";
		dh.styles(document.getElementById("cookiewrapper"),{display:"flex"});
		this.updateCookie(this.user,1);
	}
}

sitecontrol.prototype.deleteCookie=function(){
	this.updateCookie("",-1);
}

sitecontrol.prototype.userOkedCookie=function(dh){
	document.getElementById("cookieOk").addEventListener("mousedown",function(e){
		document.getElementById("cookiewrapper").style.display="none";
	});
}

let sc=new sitecontrol();
sc.setEventListeners();


function captchaButtons(){
	let q={};
	switch(_TYPE){
		case("signin"):		
			sc.profileFormsState="signedIn";
			sc.clearForms(_DH);
			document.getElementById("user").innerHTML="Hello,<br>"+sc.user;
			sc.currentUser=sc.user;
			_DH.attributes(document.getElementById("newOrUpdate"),{"data-button":"updateaccount"});
			sc.toggleInnerHTML(document.getElementById("form2Title"),_DH);
			if(document.getElementById("check1").checked)
				sc.updateCookie(sc.user,1);
			sc.setSession();
			break;
		case("newaccount"):
			 q={query:"INSERT",userName:sc.user,email:sc.mail,password:sc.password}
			sc.sv.promiseToGet("POST",q).then(function(result){
				if(result instanceof Error){
					alert("Error, could not create account");
				}else{
					sc.clearForms(_DH);
					sc.profileFormsState="signedIn";
					document.getElementById("user").innerHTML="Hello,<br>"+sc.user;
					sc.currentUser=sc.user;
					alert("New Account Created");
					_DH.attributes(_NODE,{"data-button":"updateaccount"})
					if(document.getElementById("check2").checked)
						sc.updateCookie(sc.user,1);
					sc.setSession();
				}
			});
			break;

	}
}
