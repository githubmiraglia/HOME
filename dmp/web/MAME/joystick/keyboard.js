// JavaScript Document
function keyboard(pressed,integrationMAME ,js){ // eloquent javascript book
  this.keyCodes1 = {27:"exit",32:"fire",37:"left",39:"right",38:"up",40:"down", 90:"fireX", 88:"fireY", 67:"fireB", 86:"fireRB", 53:"fireCoin", 49:"fireStart"};
  this.keyCodes2 = {27:"exit",70:"fire",65:"left",68:"right",87:"up",83:"down", 90:"fireX", 88:"fireY", 67:"fireB", 86:"fireRB", 53:"fireCoin", 49:"fireStart"};
  this.integrationMAME = integrationMAME
  this.activateKeyboard(pressed);
  this.js = js
}

keyboard.prototype.activateKeyboard=function(pressed){
function handler(event) {
  if (this.keyCodes1.hasOwnProperty(event.keyCode)) {
    //console.log("KEYCODE",event.keyCode);
    var down = event.type == "keydown";
    pressed[0][this.keyCodes1[event.keyCode]] = down;
  }
  if (this.keyCodes2.hasOwnProperty(event.keyCode)) {
    down = event.type == "keydown";
    pressed[1][this.keyCodes2[event.keyCode]] = down;
  }
  // new code for integration wit MAME
  //left
  if(pressed[0].left){
    this.js["left"] = true;
    //this.integrationMAME.checkPress(js)
  }else{
    this.js["left"] = false;
    //this.integrationMAME.checkPress(js)
  }
  //right
  if(pressed[0].right){
    this.js["right"] = true;
    //this.integrationMAME.checkPress(js)
  }else{
    this.js["right"] = false;
    //this.integrationMAME.checkPress(js)
  }
  //up
  if(pressed[0].up){
    this.js["up"] = true;
    //this.integrationMAME.checkPress(js)
  }else{
    this.js["up"] = false;
    //this.integrationMAME.checkPress(js)
  }
  //down
  if(pressed[0].down){
    this.js["down"] = true;
    //this.integrationMAME.checkPress(js)
  }else{
    this.js["down"] = false;
    //this.integrationMAME.checkPress(js)
  }
  // fire
  if(pressed[0].fire){
    this.js["fire"] = true;
    //this.integrationMAME.checkPress(js)
  }else{
    this.js["fire"] = false;
    //this.integrationMAME.checkPress(js)
  }
  // fireX
  if(pressed[0].fireX){
    this.js["fireX"] = true;
    //this.integrationMAME.checkPress(js)
  }else{
    this.js["fireX"] = false;
    //this.integrationMAME.checkPress(js)
  }
  //fireY
  if(pressed[0].fireY){
    this.js["fireY"] = true;
    //this.integrationMAME.checkPress(js)
  }else{
    this.js["fireY"] = false;
    //this.integrationMAME.checkPress(js)
  }
  //fireB
  if(pressed[0].fireB){
    this.js["fireB"] = true;
    //this.integrationMAME.checkPress(js)
  }else{
    this.js["fireB"] = false;
    //this.integrationMAME.checkPress(js)
  }
  //fireRB
  if(pressed[0].fireRB){
    this.js["fireRB"] = true;
    //this.integrationMAME.checkPress(js)
  }else{
    this.js["fireRB"] = false;
    //this.integrationMAME.checkPress(js)
  }
  //fireCoin
  if(pressed[0].fireCoin){
    this.js["fireCoin"] = true;
    //this.integrationMAME.checkPress(js)
  }else{
    this.js["fireCoin"] = false;
    //this.integrationMAME.checkPress(js)
  }
  //fireStart
  if(pressed[0].fireStart){
    this.js["fireStart"] = true;
    //this.integrationMAME.checkPress(js)
  }else{
    this.js["fireStart"] = false;
    //this.integrationMAME.checkPress(js)
  }
  //exit
  if(pressed[0].exit){
    console.log("PRESSED EXIT")
    this.js["exit"] = true;
    //this.integrationMAME.checkPress(js)
  }else{
    this.js["exit"] = false;
    //this.integrationMAME.checkPress(js)
  }
  this.integrationMAME.checkPress()
  event.preventDefault();
}
document.body.addEventListener("keydown", handler.bind(this));
document.body.addEventListener("keyup", handler.bind(this));
}
