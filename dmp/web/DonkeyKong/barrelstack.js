function barrelStack(sprite,costume,pos,vel,rotate,flip){
    actor.call(this,sprite,costume,pos,vel,rotate,flip);
};

barrelStack.prototype = Object.create(actor.prototype);

barrelStack.prototype.act = function(data,flags){
  return[data,flags];  
};
