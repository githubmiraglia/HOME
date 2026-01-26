// JavaScript Document
function keyboard(pressed){ // eloquent javascript book
	this.keyCodes1 = {27:"exit",32:"fire",37:"left",39:"right",38:"up",40:"down"}
	this.keyCodes2 = {27:"exit",70:"fire",65:"left",68:"right",87:"up",83:"down"}
	this.activateKeyboard(pressed);
}

keyboard.prototype.activateKeyboard=function(pressed){
  function handler(event) {
    if (this.keyCodes1.hasOwnProperty(event.keyCode)) {
      var down = event.type == "keydown";
      pressed[0][this.keyCodes1[event.keyCode]] = down;
    }
	if (this.keyCodes2.hasOwnProperty(event.keyCode)) {
      down = event.type == "keydown";
      pressed[1][this.keyCodes2[event.keyCode]] = down;
    }
	event.preventDefault();
  }
  document.body.addEventListener("keydown", handler.bind(this));
  document.body.addEventListener("keyup", handler.bind(this));
  return pressed;
}

