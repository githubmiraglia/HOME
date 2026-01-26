
function flipHorizontally(cx,around){
    cx.translate(around,0);
    cx.scale(-1,1);
    cx.translate(-around,0);
}

function rotate(cx,aroundX,aroundY,angle){
    cx.translate(aroundX,aroundY);
    cx.rotate(angle);
    cx.translate(-aroundX,-aroundY);
}

function mod(n,d){
	if(n%d<0)
		return(n%d+d);
	else
		return(n%d);
}


function checkForLadder(pos,ladderData,UpOrDown){
    var i = Math.floor((pos.x+112)/8)*8;
    while(ladderData[i+(UpOrDown=="Up"?0:1)]>pos.y)
        i=i+2;
    if (pos.y == ladderData[i+(UpOrDown=="Up"?0:1)]){
        return([true,i,new Vector(Math.floor((pos.x+112)/8)*8-108,pos.y),false]);
    }
    return ([false,0,0]);
}


function getHeight(pos,floorHeight,falling){
  var i = Math.floor((pos.x+112)/8)*8;
  var floorIndex = Math.floor((pos.x+112)/8)*8;
  while(!(floorHeight[i]<(pos.y-4)))
      i++;
  var temp = floorHeight[i]+8;
  if(pos.y-4-floorHeight[i]<8){
      var floorIndex = i;
      return [floorIndex,temp,falling]; 
  }
  i = Math.floor((pos.x+110)/8)*8;
  while(!(floorHeight[i]<(pos.y-4)))
      i++;
  if(pos.y-4-floorHeight[i]<8)
      return [floorIndex,floorHeight[i]+8,falling];
  i = Math.floor((pos.x+114)/8)*8;
  while(!(floorHeight[i]<(pos.y-4)))
      i++;
  if(pos.y-4-floorHeight[i]<8)
      return [floorIndex,floorHeight[i]+8,falling];
  return[floorIndex,temp,true]; 
};

function clockCycle(){
  this.initialCycle = 0;
  this.waitCycles = 0; 
  this.crossed = 0;
  this.once = false;
};


clockCycle.prototype.setClockOnce = function(initialCycle,waitCycles){
    if(this.initialCycle==0){
        this.initialCycle = initialCycle;
        this.waitCycles = waitCycles;
    }
};

clockCycle.prototype.checkClock = function(currentCycle){
    if((currentCycle-this.initialCycle)>=this.waitCycles){
        this.crossed++;
        if(this.crossed>1)
            this.once = true;
        return true;
    }else
        return false;
};

clockCycle.prototype.resetClock = function(){
    this.initialCycle = 0;
    this.waitCycles = 0;
    this.crossed = 0;
    this.once = false;
};

function checkForLadderBarrel(pos,floorIndex,floorHeight,ladderData){
    var i = Math.floor((pos.x+112)/8)*8;
    var bottomOfLadder = floorHeight[floorIndex+1]+8;
    while(ladderData[i]>bottomOfLadder)
        i=i+2;
    if(bottomOfLadder == ladderData[i]){
        return [bottomOfLadder,i,true];
    }
    return [0,0,false];   
}

function getHeightBarrel(pos,floorHeight){
    var i = Math.floor((pos.x+112)/8);
    if(i<0)
      i=0;
    else if (i>27)
        i = 27;
    i = i*8;
    while(!(floorHeight[i]<pos.y))
        i++;
    var temp = floorHeight[i]+8;
    if((pos.y - 5 - floorHeight[i])<1){ 
        return[i,temp,false];
    }
    return[i,temp,true];
}

function getHeightFire(pos,floorHeight,initialLaunch,levelType){
    var i = Math.floor((pos.x+112)/8)*8;
    while(!(floorHeight[i]<pos.y-0))
        i++;
	if(pos.y-5-floorHeight[i]<16)
		return[i,floorHeight[i]+8];
	if(initialLaunch){
		if(levelType==1){
			return[i,-162];
		}else
			return[i,-44];
    }else
		return[i,0];
}
		

function checkForLadderFire(pos,ladderData,floorHeight,floorIndex,marioPos,topOfLadder){
	if(mod(pos.x,8)==4){
		if (marioPos.y<pos.y-16){
			var i = Math.floor((pos.x+112)/8)*8;
			var bottomOfLadder = floorHeight[floorIndex+1]+8;
			while(ladderData[i]>bottomOfLadder){
				i=i+2;
			}
			if(bottomOfLadder == ladderData[i])
				return[i,true,false,bottomOfLadder,topOfLadder];
		}
		if(pos.y<-24){
			var i = Math.floor((pos.x+112)/8)*8;
			var bottomOfLadder = floorHeight[floorIndex]+8;
			while(ladderData[i]>bottomOfLadder){
				i=i+2;
			}
			if(bottomOfLadder == ladderData[i])
				return[i,true,true,bottomOfLadder,floorHeight[floorIndex-1]+12];
		}
	}
	return[0,false,false,0,0];
}

function getHeightRivet(pos,floorHeight){
    var i = Math.floor((pos.x+112)/8)*8;
    while(floorHeight[i]>=(pos.y-4))
        i++;
    if((pos.y-4 - floorHeight[i])<30)
        return[i,floorHeight[i]+8];
    else
        return[0,0];
}
