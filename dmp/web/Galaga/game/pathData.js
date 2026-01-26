// JavaScript Document
//TESTED ALL GOOD

game.prototype.setPath=function(){
	this.addEntrancePaths();
	this.addAttackPaths();
	this.addAggressiveEntrancePaths();
	this.addTypeTwoEntrancePaths();
	this.addChallenge1Paths();
	this.addChallenge2Paths();
	this.addChallenge3Paths();
	this.addChallenge4Paths();
	this.addChallenge5Paths();
	this.addChallenge6Paths();
	this.addChallenge7Paths();
	this.addChallenge8Paths();
	this.adjustChallengePathSpeeds(2.5/3);
	
}

game.prototype.addEntrancePaths = function(){
	this.data.pathNames.push("NEW WAVE FROM TOP");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(94,12,180);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(18,3,-3);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(30,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(30,3,6);
	this.data.pathData.push("JOIN FORMATION");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("NEW WAVE FROM SIDE");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(0,250,270);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(48,3,-2);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(48,3,-6);
	this.data.pathData.push("JOIN FORMATION");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("UP AND DIVE WITH BOSS");
	this.data.pathData.push("LEAVE FORMATION");
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(3,2,6);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(48,2,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(63,2,6);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(36,2,0);
	this.data.pathData.push("CONTINUE FLIGHT");
	this.data.pathData.push(2,-1);
	this.data.pathData.push("MOVE ABOVE FORMATION");
	this.data.pathData.push("JOIN FORMATION");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("BUTTERFLY PATH");
	this.data.pathData.push("LEAVE FORMATION");
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(12,2,6);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(40,2,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(46,2,-2);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(30,2,2);
	this.data.pathData.push("CONTINUE FLIGHT");
	this.data.pathData.push(2,-2);
	this.data.pathData.push("MOVE ABOVE FORMATION");
	this.data.pathData.push("JOIN FORMATION");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("BEE PATH");
	this.data.pathData.push("LEAVE FORMATION");
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(10,2,6);
	this.data.pathData.push("TO HEIGHT");
	this.data.pathData.push(188);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(108,2,-2);
	this.data.pathData.push("BEE RETURN");
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(98,2,-2);
	this.data.pathData.push("CONTINUE FLIGHT");
	this.data.pathData.push(2,0);
	this.data.pathData.push("MOVE ABOVE FORMATION");
	this.data.pathData.push("JOIN FORMATION");
	this.data.pathIndex.push(this.data.pathData.length);
}


game.prototype.addTypeTwoEntrancePaths=function(){
	this.data.pathNames.push("NEW WAVE FROM TOP SLIGHTLY OUTWARD");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(110,12,180);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(18,2.1623,-3);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(30,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(30,4.6747,6);
	this.data.pathData.push("SPEED");
	this.data.pathData.push(3);
	this.data.pathData.push("JOIN FORMATION");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("NEW WAVE FROM SIDE SLIGHTLY HIGHER");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(0,234,270);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(48,2.5585,-2);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(48,1.3252,-6);
	this.data.pathData.push("SPEED");
	this.data.pathData.push(3);
	this.data.pathData.push("JOIN FORMATION");
	this.data.pathIndex.push(this.data.pathData.length);
}

game.prototype.addAggressiveEntrancePaths=function(){
	this.data.pathNames.push("NEW AGRESSIVE WAVE FROM TOP");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(94,12,180);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(18,3,-3);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(30,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(30,3,6);
	this.data.pathData.push("DIVE AT PLAYER");
	this.data.pathData.push("REMOVE");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("NEW AGRESSIVE WAVE FROM OUTER TOP");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(110,12,180);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(18,2.1623,-3);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(30,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(30,4.6747,6);
	this.data.pathData.push("SPEED");
	this.data.pathData.push(3);
	this.data.pathData.push("DIVE AT PLAYER");
	this.data.pathData.push("REMOVE");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("NEW AGRESSIVE WAVE FROM SIDE");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(0,250,270);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(48,3,-2);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(48,3,-6);
	this.data.pathData.push("DIVE AT PLAYER");
	this.data.pathData.push("REMOVE");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("NEW AGRESSIVE WAVE FROM HIGHER SIDE");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(0,234,270);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(48,2.5585,-2);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(48,1.3252,-6);
	this.data.pathData.push("SPEED");
	this.data.pathData.push(3);
	this.data.pathData.push("DIVE AT PLAYER");
	this.data.pathData.push("REMOVE");
	this.data.pathIndex.push(this.data.pathData.length);
	
}
	
game.prototype.addAttackPaths=function(){
	this.data.pathNames.push("UP AND DIVE TO CAPTURE");
	this.data.pathData.push("LEAVE FORMATION");
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(3,2,6);
	this.data.pathData.push("DIVE TO BEAM");
	this.data.pathData.push("CONTINUE FLIGHT");
	this.data.pathData.push(3,0);
	this.data.pathData.push("MOVE ABOVE FORMATION");
	this.data.pathData.push("JOIN FORMATION");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("RETURN WITH CAPTURED");
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(30,2,6);
	this.data.pathData.push("JOIN FORMATION");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("WAIT FOR CAPTURE");
	this.data.pathData.push("WAIT FOR CAPTURE");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("TAKE HOSTAGE POSITION");
	this.data.pathData.push("TAKE HOSTAGE POSITION");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("RESCUED PLAYER");
	this.data.pathData.push("DOUBLE UP PLAYER");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("PLAYER SWOOP");
	this.data.pathData.push("LEAVE FORMATION");
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(3,2,6);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(48,2,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(63,2,6);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(36,2,0);
	this.data.pathData.push("CONTINUE FLIGHT");
	this.data.pathData.push(2,-1);
	this.data.pathData.push("PLAYER IN STORAGE");
	this.data.pathIndex.push(this.data.pathData.length);	
}

game.prototype.addChallenge1Paths=function(){
	this.data.pathNames.push("CHALLENGE 1 A");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(94,12,180);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(24,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(3,3,-8);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(48,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(38,3,-6);
	this.data.pathData.push("CONTINUE FLIGHT");
	this.data.pathData.push(3,0);
	this.data.pathData.push("REMOVE");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("CHALLENGE 1 B");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(0,250,270);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(54,3,-1);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(4,3,-9);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(20,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(20,3,-9);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(20,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(16,3,-9);
	this.data.pathData.push("CONTINUE FLIGHT");
	this.data.pathData.push(3,0);
	this.data.pathData.push("REMOVE");
	this.data.pathIndex.push(this.data.pathData.length);
}

game.prototype.addChallenge2Paths=function(){
	this.data.pathNames.push("CHALLENGE 2 A");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(94,12,180);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(24,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(3,3,-8);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(20,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(30,0,-6);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(20,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(3,3,8);
	this.data.pathData.push("CONTINUE FLIGHT");
	this.data.pathData.push(3,0);
	this.data.pathData.push("REMOVE");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("CHALLENGE 2 B");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(0,248,270);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(36,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(180,3,-2);
	this.data.pathData.push("CONTINUE FLIGHT");
	this.data.pathData.push(3,0);
	this.data.pathData.push("REMOVE");
	this.data.pathIndex.push(this.data.pathData.length);
}

game.prototype.addChallenge3Paths=function(){
	this.data.pathNames.push("CHALLENGE 3 A");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(94,12,180);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(34,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(6,3,-8);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(36,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(30,0,-6);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(37,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(6,3,8);
	this.data.pathData.push("CONTINUE FLIGHT");
	this.data.pathData.push(3,0);
	this.data.pathData.push("REMOVE");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("CHALLENGE 3 B");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(94,12,180);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(34,3,0);
	this.data.pathData.push(6,3,8);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(36,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(30,0,-6);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(37,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(6,3,-8);
	this.data.pathData.push("CONTINUE FLIGHT");
	this.data.pathData.push(3,0);
	this.data.pathData.push("REMOVE");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("CHALLENGE 3 C");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(0,250,270);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(25,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(18,0,10);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(30,3,3);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(30,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(30,3,3);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(12,3,7.5);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(30,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(15,0,-6);
	this.data.pathData.push("CONTINUE FLIGHT");
	this.data.pathData.push(3,0);
	this.data.pathData.push("REMOVE");
	this.data.pathIndex.push(this.data.pathData.length);
}

game.prototype.addChallenge4Paths=function(){
	this.data.pathNames.push("CHALLENGE 4 A");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(94,12,180);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(6,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(10,0,9);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(36,3,-5);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(36,3,5);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(72,3,-5);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(36,3,5);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(36,3,-5);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(10,0,9);
	this.data.pathData.push("CONTINUE FLIGHT");
	this.data.pathData.push(3,0);
	this.data.pathData.push("REMOVE");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("CHALLENGE 4 B");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(94,12,180);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(6,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(10,0,-9);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(36,3,5);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(36,3,-5);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(72,3,5);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(36,3,-5);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(36,3,5);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(10,0,-9);
	this.data.pathData.push("CONTINUE FLIGHT");
	this.data.pathData.push(3,0);
	this.data.pathData.push("REMOVE");
	this.data.pathIndex.push(this.data.pathData.length);
	this.data.pathNames.push("CHALLENGE 4 C");
	this.data.pathData.push("SET POSITION");
	this.data.pathData.push(0,250,270);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(8,3,-8);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(36,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(4,3,16);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(72,3,5);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(12,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(72,3,5);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(12,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(72,3,5);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(12,3,0);
	this.data.pathData.push("MOVEMENT");
	this.data.pathData.push(8,3,8);
	this.data.pathData.push("CONTINUE FLIGHT");
	this.data.pathData.push(3,0);
	this.data.pathData.push("REMOVE");
	this.data.pathIndex.push(this.data.pathData.length);
}


game.prototype.addChallenge5Paths=function(){}

game.prototype.addChallenge6Paths=function(){}

game.prototype.addChallenge7Paths=function(){}

game.prototype.addChallenge8Paths=function(){}



game.prototype.adjustChallengePathSpeeds=function(adjustmentFactor){
	for (var ind=0; ind<this.data.pathNames.length; ind++){
		if(this.data.pathNames[ind].includes("CHALLENGE")){
			var i = this.data.pathIndex[ind];
			while(i!=this.data.pathIndex[ind+1]){
				if(this.data.pathData[i]=="SET POSITION"){
					i+=4;
				}else{
					if(this.data.pathData[i]=="MOVEMENT"){
						this.data.pathData[i+1]=Math.round(this.data.pathData[i+1]/adjustmentFactor);
						this.data.pathData[i+2]=this.data.pathData[i+2]*adjustmentFactor;
						this.data.pathData[i+3]=this.data.pathData[i+3]*adjustmentFactor;
						i+=4;
					}else{
						if(this.data.pathData[i]=="CONTINUE FLIGHT"){
						this.data.pathData[i+1]=this.data.pathData[i+1]*adjustmentFactor;
						this.data.pathData[i+2]=this.data.pathData[i+2]*adjustmentFactor;
						i+=3;			
						}else
							if(this.data.pathData[i]=="REMOVE"){
								i+=1;
							}else
								break;
					}
				}
			}
		}
		i+=1;
	}
}



















