// JavaScript Document
/*allien.protoype.initializeAllien=function(id,pathName,delay,formationX,formationY,type,direction){
	this.gameData.allienFormationX[id]=formationX;
	this.gameData.allienFormationY[id]=formationY;
	this.gameData.allienType[id]=type;
	this.setPathTypeFor(id,pathName,delay,direction);
}

allien.prototype.setPathTypeFor=function(id,pathName,delay,direction){
	this.gameData.allienPathDelay[id]=delay;
	this.gameData.allienControlPath[id]=pathName;
	this.gameData.allienDirection[id]=direction;	
}
*/

allien.prototype.createWavePrepare=function(){
	this.extrasFromAbove = Math.floor(this.gameData.stage/4);
	this.extrasFromSide =  Math.floor((this.gameData.stage-2)/4);
	if(this.extrasFromSide<0)
		this.extrasFromSide=0;
	if(this.extrasFromAbove>8)
		this.extrasFromAbove=8;
	if(this.extrasFromSide>8)
		this.extrasFromSide=8;
	this.waveSection = 1;
	for (var i=0;i<this.gameData.maxAlliens;i++){
		this.gameData.allienControlPath[i]="WAITING";
		this.gameData.allienOrders[i]="";
	}	
}

allien.prototype.createWaveType1=function(waveSection){
	var time=1;
	var ind=0;
	if(waveSection==1){
		this.initializeAllien(0,"NEW WAVE FROM TOP",time+0,-0.5,2,3,1);
		this.initializeAllien(1,"NEW WAVE FROM TOP",time+0,-0.5,4,4,-1);
		this.initializeAllien(2,"NEW WAVE FROM TOP",time+8,0.5,2,3,1);
		this.initializeAllien(3,"NEW WAVE FROM TOP",time+8,0.5,4,4,-1);
		this.initializeAllien(4,"NEW WAVE FROM TOP",time+16,-0.5,3,3,1);
		this.initializeAllien(5,"NEW WAVE FROM TOP",time+16,-0.5,5,4,-1);
		this.initializeAllien(6,"NEW WAVE FROM TOP",time+24,0.5,3,3,1);
		this.initializeAllien(7,"NEW WAVE FROM TOP",time+24,0.5,5,4,-1);
		for(var i=0; i<Math.floor(this.extrasFromAbove/2);i++){
			this.initializeAllien(41+ind*2,"NEW AGRESSIVE WAVE FROM TOP",time+32+ind*8,0,0,3,1);
			this.initializeAllien(42+ind*2,"NEW AGRESSIVE WAVE FROM TOP",time+32+ind*8,0,0,4,-1);
			ind++;
		}
	}else if(waveSection==2){
			this.initializeAllien(8,"NEW WAVE FROM SIDE",time+0,-1.5,1,1,1);
			this.initializeAllien(9,"NEW WAVE FROM SIDE",time+8,-1.5,2,3,1);
			this.initializeAllien(10,"NEW WAVE FROM SIDE",time+16,-0.5,1,1,1);
			this.initializeAllien(11,"NEW WAVE FROM SIDE",time+24,1.5,2,3,1);
			this.initializeAllien(12,"NEW WAVE FROM SIDE",time+32,0.5,1,1,1);
			this.initializeAllien(13,"NEW WAVE FROM SIDE",time+40,-1.5,3,3,1);
			this.initializeAllien(14,"NEW WAVE FROM SIDE",time+48,1.5,1,1,1);	
			this.initializeAllien(15,"NEW WAVE FROM SIDE",time+56,1.5,3,3,1);
			for(var i=0; i<this.extrasFromSide;i++){
				this.initializeAllien(41+ind,"NEW AGRESSIVE WAVE FROM SIDE",time+64+ind*8,0,0,1+(ind%2)*2,1);
				ind++;
			}
	}else if(waveSection==3){
			this.initializeAllien(16,"NEW WAVE FROM SIDE",time+0,3.5,2,3,-1);
			this.initializeAllien(17,"NEW WAVE FROM SIDE",time+8,2.5,2,3,-1);
			this.initializeAllien(18,"NEW WAVE FROM SIDE",time+16,3.5,3,3,-1);
			this.initializeAllien(19,"NEW WAVE FROM SIDE",time+24,2.5,3,3,-1);
			this.initializeAllien(20,"NEW WAVE FROM SIDE",time+32,-3.5,2,3,-1);
			this.initializeAllien(21,"NEW WAVE FROM SIDE",time+40,-2.5,2,3,-1);
			this.initializeAllien(22,"NEW WAVE FROM SIDE",time+48,-3.5,3,3,-1);
			this.initializeAllien(23,"NEW WAVE FROM SIDE",time+56,-2.5,3,3,-1);
			for(var i=0; i<this.extrasFromSide;i++){
				this.initializeAllien(41+ind,"NEW AGRESSIVE WAVE FROM SIDE",time+64+ind*8,0,0,3,-1);
				ind++;
			}
	}else if(waveSection==4){
			this.initializeAllien(24,"NEW WAVE FROM TOP",time+0,2.5,4,4,-1);
			this.initializeAllien(25,"NEW WAVE FROM TOP",time+8,1.5,4,4,-1);
			this.initializeAllien(26,"NEW WAVE FROM TOP",time+16,2.5,5,4,-1);
			this.initializeAllien(27,"NEW WAVE FROM TOP",time+24,1.5,5,4,-1);
			this.initializeAllien(28,"NEW WAVE FROM TOP",time+32,-1.5,4,4,-1);
			this.initializeAllien(29,"NEW WAVE FROM TOP",time+40,-2.5,4,4,-1);
			this.initializeAllien(30,"NEW WAVE FROM TOP",time+48,-1.5,5,4,-1);
			this.initializeAllien(31,"NEW WAVE FROM TOP",time+56,-2.5,5,4,-1);
			for(var i=0; i<this.extrasFromAbove;i++){
				this.initializeAllien(41+ind,"NEW AGRESSIVE WAVE FROM TOP",time+64+ind*8,0,0,4,-1);
				ind++;
			}
	}else{
		this.initializeAllien(32,"NEW WAVE FROM TOP",time+0,-4.5,4,4,1);
		this.initializeAllien(33,"NEW WAVE FROM TOP",time+8,-3.5,4,4,1);
		this.initializeAllien(34,"NEW WAVE FROM TOP",time+16,-4.5,5,4,1);
		this.initializeAllien(35,"NEW WAVE FROM TOP",time+24,-3.5,5,4,1);
		this.initializeAllien(36,"NEW WAVE FROM TOP",time+32,3.5,4,4,1);
		this.initializeAllien(37,"NEW WAVE FROM TOP",time+40,4.5,4,4,1);
		this.initializeAllien(38,"NEW WAVE FROM TOP",time+48,3.5,5,4,1);
		this.initializeAllien(39,"NEW WAVE FROM TOP",time+56,4.5,5,4,1);
		if(!this.gameData.playerInStorage)
			this.initializeAllien(40,"WAIT FOR CAPTURE",0,0,0,5,1);
		else{
			this.gameData.playerInStorage=false;
			this.initializeAllien(40,"NEW WAVE FROM TOP",time+64,this.gameData.allienFormationX[this.gameData.captorId],0,5,this.gameData.allienDirection[this.gameData.captorId]);
		}
		for(var i=0; i<this.extrasFromAbove;i++){
				this.initializeAllien(41+ind,"NEW AGRESSIVE WAVE FROM TOP",time+64+ind*8,0,0,4,1);
				ind++;
		}
	}
}


allien.prototype.createWaveType2=function(waveSection){
	var time=1;
	var ind=0;
	if(this.waveSection==1){
		this.initializeAllien(0,"NEW WAVE FROM TOP",time+0,-0.5,2,3,1);
		this.initializeAllien(1,"NEW WAVE FROM TOP",time+0,-0.5,4,4,-1);
		this.initializeAllien(2,"NEW WAVE FROM TOP",time+8,0.5,2,3,1);
		this.initializeAllien(3,"NEW WAVE FROM TOP",time+8,0.5,4,4,-1);
		this.initializeAllien(4,"NEW WAVE FROM TOP",time+16,-0.5,3,3,1);
		this.initializeAllien(5,"NEW WAVE FROM TOP",time+16,-0.5,5,4,-1);
		this.initializeAllien(6,"NEW WAVE FROM TOP",time+24,0.5,3,3,1);
		this.initializeAllien(7,"NEW WAVE FROM TOP",time+24,0.5,5,4,-1);
		for(var i=0; i<Math.floor(this.extrasFromAbove/2);i++){
			this.initializeAllien(41+ind*2,"NEW AGRESSIVE WAVE FROM TOP",time+32+ind*8,0,0,3,1);
			this.initializeAllien(42+ind*2,"NEW AGRESSIVE WAVE FROM TOP",time+32+ind*8,0,0,4,-1);
			ind++;
		}
	}else if(this.waveSection==2){
			this.initializeAllien(8,"NEW WAVE FROM SIDE",time+0,-1.5,1,1,1);
			this.initializeAllien(9,"NEW WAVE FROM SIDE SLIGHTLY HIGHER",time+0,-1.5,2,3,1);
			this.initializeAllien(10,"NEW WAVE FROM SIDE",time+8,-0.5,1,1,1);
			this.initializeAllien(11,"NEW WAVE FROM SIDE SLIGHTLY HIGHER",time+8,1.5,2,3,1);
			this.initializeAllien(12,"NEW WAVE FROM SIDE",time+16,0.5,1,1,1);
			this.initializeAllien(13,"NEW WAVE FROM SIDE SLIGHTLY HIGHER",time+16,-1.5,3,3,1);
			this.initializeAllien(14,"NEW WAVE FROM SIDE",time+24,1.5,1,1,1);
			this.initializeAllien(15,"NEW WAVE FROM SIDE SLIGHTLY HIGHER",time+24,1.5,3,3,1);
			for(var i=0; i<Math.floor(this.extrasFromSide/2);i++){
				this.initializeAllien(41+ind*2,"NEW AGRESSIVE WAVE FROM SIDE",time+32+ind*8,0,0,1,1);
				this.initializeAllien(42+ind*2,"NEW AGRESSIVE WAVE FROM HIGHER SIDE",time+32+ind*8,0,0,3,1);
				ind++;
			}
	}else if(this.waveSection==3){
			this.initializeAllien(16,"NEW WAVE FROM SIDE",time+0,3.5,2,3,-1);
			this.initializeAllien(17,"NEW WAVE FROM SIDE SLIGHTLY HIGHER",time+0,2.5,2,3,-1);
			this.initializeAllien(18,"NEW WAVE FROM SIDE",time+8,3.5,3,3,-1);
			this.initializeAllien(19,"NEW WAVE FROM SIDE SLIGHTLY HIGHER",time+8,2.5,3,3,-1);
			this.initializeAllien(20,"NEW WAVE FROM SIDE",time+16,-3.5,2,3,-1);
			this.initializeAllien(21,"NEW WAVE FROM SIDE SLIGHTLY HIGHER",time+16,-2.5,2,3,-1);
			this.initializeAllien(22,"NEW WAVE FROM SIDE",time+24,-3.5,3,3,-1);
			this.initializeAllien(23,"NEW WAVE FROM SIDE SLIGHTLY HIGHER",time+24,-2.5,3,3,-1);
			for(var i=0; i<Math.floor(this.extrasFromSide/2);i++){
				this.initializeAllien(41+ind*2,"NEW AGRESSIVE WAVE FROM SIDE",time+32+ind*8,0,0,3,-1);
				this.initializeAllien(42+ind*2,"NEW AGRESSIVE WAVE FROM HIGHER SIDE",time+32+ind*8,0,0,3,-1);
				ind++;
			}
	}else if(this.waveSection==4){
			this.initializeAllien(24,"NEW WAVE FROM TOP",time+0,2.5,4,4,-1);
			this.initializeAllien(25,"NEW WAVE FROM TOP SLIGHTLY OUTWARD",time+0,1.5,4,4,-1);
			this.initializeAllien(26,"NEW WAVE FROM TOP",time+8,2.5,5,4,-1);
			this.initializeAllien(27,"NEW WAVE FROM TOP SLIGHTLY OUTWARD",time+8,1.5,5,4,-1);
			this.initializeAllien(28,"NEW WAVE FROM TOP",time+16,-1.5,4,4,-1);
			this.initializeAllien(29,"NEW WAVE FROM TOP SLIGHTLY OUTWARD",time+16,-2.5,4,4,-1);
			this.initializeAllien(30,"NEW WAVE FROM TOP",time+24,-1.5,5,4,-1);
			this.initializeAllien(31,"NEW WAVE FROM TOP SLIGHTLY OUTWARD",time+24,-2.5,5,4,-1);
			for(var i=0; i<Math.floor(this.extrasFromAbove/2);i++){
				this.initializeAllien(41+ind*2,"NEW AGRESSIVE WAVE FROM TOP",time+32+ind*8,0,0,4,-1);
				this.initializeAllien(42+ind*2,"NEW AGRESSIVE WAVE FROM OUTER TOP",time+32+ind*8,0,0,4,-1);
				ind++;
			}
	}else{
		this.initializeAllien(32,"NEW WAVE FROM TOP",time+0,-4.5,4,4,1);
		this.initializeAllien(33,"NEW WAVE FROM TOP SLIGHTLY OUTWARD",time+0,-3.5,4,4,1);
		this.initializeAllien(34,"NEW WAVE FROM TOP",time+8,-4.5,5,4,1);
		this.initializeAllien(35,"NEW WAVE FROM TOP SLIGHTLY OUTWARD",time+8,-3.5,5,4,1);
		this.initializeAllien(36,"NEW WAVE FROM TOP",time+16,3.5,4,4,1);
		this.initializeAllien(37,"NEW WAVE FROM TOP SLIGHTLY OUTWARD",time+16,4.5,4,4,1);
		this.initializeAllien(38,"NEW WAVE FROM TOP",time+24,3.5,5,4,1);
		this.initializeAllien(39,"NEW WAVE FROM TOP SLIGHTLY OUTWARD",time+24,4.5,5,4,1);
		if(!this.gameData.playerInStorage)
			this.initializeAllien(40,"WAIT FOR CAPTURE",0,0,0,5,1);
		else{
			this.gameData.playerInStorage=false;
			this.initializeAllien(40,"NEW WAVE FROM TOP",time+32,this.gameData.allienFormationX[this.gameData.captorId],0,5,this.gameData.allienDirection[this.gameData.captorId]);
		}
		for(var i=0; i<Math.floor(this.extrasFromAbove/2);i++){
				this.initializeAllien(41+ind*2,"NEW AGRESSIVE WAVE FROM TOP",time+32+ind*8,0,0,4,1);
				this.initializeAllien(42+ind*2,"NEW AGRESSIVE WAVE FROM OUTER TOP",time+32+ind*8,0,0,4,1);
				ind++;
		}
	}
}

allien.prototype.createWaveType3=function(waveSection){
	var time=1;
	var ind=0;
	if(waveSection==1){
		this.initializeAllien(0,"NEW WAVE FROM TOP",time+0,-0.5,2,3,1);
		this.initializeAllien(1,"NEW WAVE FROM TOP",time+0,-0.5,4,4,-1);
		this.initializeAllien(2,"NEW WAVE FROM TOP",time+8,0.5,2,3,1);
		this.initializeAllien(3,"NEW WAVE FROM TOP",time+8,0.5,4,4,-1);
		this.initializeAllien(4,"NEW WAVE FROM TOP",time+16,-0.5,3,3,1);
		this.initializeAllien(5,"NEW WAVE FROM TOP",time+16,-0.5,5,4,-1);
		this.initializeAllien(6,"NEW WAVE FROM TOP",time+24,0.5,3,3,1);
		this.initializeAllien(7,"NEW WAVE FROM TOP",time+24,0.5,5,4,-1);
		for(var i=0; i<Math.floor(this.extrasFromAbove/2);i++){
			this.initializeAllien(41+ind*2,"NEW AGRESSIVE WAVE FROM TOP",time+32+ind*8,0,0,3,1);
			this.initializeAllien(42+ind*2,"NEW AGRESSIVE WAVE FROM TOP",time+32+ind*8,0,0,4,-1);
			ind++;
		}
	}else if(waveSection==2){
			this.initializeAllien(8,"NEW WAVE FROM SIDE",time+0,-1.5,1,1,1);
			this.initializeAllien(10,"NEW WAVE FROM SIDE",time+8,-0.5,1,1,1);
			this.initializeAllien(12,"NEW WAVE FROM SIDE",time+16,0.5,1,1,1);
			this.initializeAllien(14,"NEW WAVE FROM SIDE",time+24,1.5,1,1,1);
			this.initializeAllien(16,"NEW WAVE FROM SIDE",time+0,3.5,2,3,-1);
			this.initializeAllien(18,"NEW WAVE FROM SIDE",time+8,3.5,3,3,-1);
			this.initializeAllien(20,"NEW WAVE FROM SIDE",time+16,-3.5,2,3,-1);	
			this.initializeAllien(22,"NEW WAVE FROM SIDE",time+24,-3.5,3,3,-1);
			for(var i=0; i<Math.floor(this.extrasFromSide/2);i++){
				this.initializeAllien(41+ind*2,"NEW AGRESSIVE WAVE FROM SIDE",time+32+ind*8,0,0,1,1);
				this.initializeAllien(42+ind*2,"NEW AGRESSIVE WAVE FROM SIDE",time+32+ind*8,0,0,3,-1);
				ind++;
			}
	}else if(waveSection==3){
			this.initializeAllien(9,"NEW WAVE FROM SIDE",time+0,-1.5,2,3,1);
			this.initializeAllien(11,"NEW WAVE FROM SIDE",time+8,1.5,2,3,1);
			this.initializeAllien(13,"NEW WAVE FROM SIDE",time+16,-1.5,3,3,1);
			this.initializeAllien(15,"NEW WAVE FROM SIDE",time+24,1.5,3,3,1);
			this.initializeAllien(17,"NEW WAVE FROM SIDE",time+0,2.5,2,3,-1);
			this.initializeAllien(19,"NEW WAVE FROM SIDE",time+8,2.5,3,3,-1);
			this.initializeAllien(21,"NEW WAVE FROM SIDE",time+16,-2.5,2,3,-1);
			this.initializeAllien(23,"NEW WAVE FROM SIDE",time+24,-2.5,3,3,-1);
			for(var i=0; i<Math.floor(this.extrasFromSide/2);i++){
				this.initializeAllien(41+ind*2,"NEW AGRESSIVE WAVE FROM SIDE",time+32+ind*8,0,0,3,1);
				this.initializeAllien(42+ind*2,"NEW AGRESSIVE WAVE FROM SIDE",time+32+ind*8,0,0,3,-1);
				ind++;
			}
	}else if(waveSection==4){
			this.initializeAllien(24,"NEW WAVE FROM TOP",time+0,2.5,4,4,-1);
			this.initializeAllien(25,"NEW WAVE FROM TOP SLIGHTLY OUTWARD",time+0,1.5,4,4,-1);
			this.initializeAllien(26,"NEW WAVE FROM TOP",time+8,2.5,5,4,-1);
			this.initializeAllien(27,"NEW WAVE FROM TOP SLIGHTLY OUTWARD",time+8,1.5,5,4,-1);
			this.initializeAllien(28,"NEW WAVE FROM TOP",time+16,-1.5,4,4,-1);
			this.initializeAllien(29,"NEW WAVE FROM TOP SLIGHTLY OUTWARD",time+16,-2.5,4,4,-1);
			this.initializeAllien(30,"NEW WAVE FROM TOP",time+24,-1.5,5,4,-1);
			this.initializeAllien(31,"NEW WAVE FROM TOP SLIGHTLY OUTWARD",time+24,-2.5,5,4,-1);
			for(var i=0; i<Math.floor(this.extrasFromAbove/2);i++){
				this.initializeAllien(41+ind*2,"NEW AGRESSIVE WAVE FROM TOP",time+32+ind*8,0,0,4,-1);
				this.initializeAllien(42+ind*2,"NEW AGRESSIVE WAVE FROM OUTER TOP",time+32+ind*8,0,0,4,-1);
				ind++;
			}
	}else{
		this.initializeAllien(32,"NEW WAVE FROM TOP",time+0,-4.5,4,4,1);
		this.initializeAllien(33,"NEW WAVE FROM TOP SLIGHTLY OUTWARD",time+0,-3.5,4,4,1);
		this.initializeAllien(34,"NEW WAVE FROM TOP",time+8,-4.5,5,4,1);
		this.initializeAllien(35,"NEW WAVE FROM TOP SLIGHTLY OUTWARD",time+8,-3.5,5,4,1);
		this.initializeAllien(36,"NEW WAVE FROM TOP",time+16,3.5,4,4,1);
		this.initializeAllien(37,"NEW WAVE FROM TOP SLIGHTLY OUTWARD",time+16,4.5,4,4,1);
		this.initializeAllien(38,"NEW WAVE FROM TOP",time+24,3.5,5,4,1);
		this.initializeAllien(39,"NEW WAVE FROM TOP SLIGHTLY OUTWARD",time+24,4.5,5,4,1);
		if(!this.gameData.playerInStorage)
			this.initializeAllien(40,"WAIT FOR CAPTURE",0,0,0,5,1);
		else{
			this.gameData.playerInStorage=false;
			this.initializeAllien(40,"NEW WAVE FROM TOP",time+32,this.gameData.allienFormationX[this.gameData.captorId],0,5,this.gameData.allienDirection[this.gameData.captorId]);
		}
		for(var i=0; i<Math.floor(this.extrasFromAbove/2);i++){
				this.initializeAllien(41+ind*2,"NEW AGRESSIVE WAVE FROM TOP",time+32+ind*8,0,0,4,1);
				this.initializeAllien(42+ind*2,"NEW AGRESSIVE WAVE FROM OUTER TOP",time+32+ind*8,0,0,4,1);
				ind++;
		}
	}
}



allien.prototype.createWaveChallenge1=function(waveSection){
	var time=0;
	if(waveSection==1){
		this.initializeAllien(0,"CHALLENGE 1 A",time+0,0,0,4,1);
		this.initializeAllien(1,"CHALLENGE 1 A",time+1,0,0,4,-1);
		this.initializeAllien(2,"CHALLENGE 1 A",time+8,0,0,4,1);
		this.initializeAllien(3,"CHALLENGE 1 A",time+8,0,0,4,-1);
		this.initializeAllien(4,"CHALLENGE 1 A",time+16,0,0,4,1);
		this.initializeAllien(5,"CHALLENGE 1 A",time+16,0,0,4,-1);
		this.initializeAllien(6,"CHALLENGE 1 A",time+24,0,0,4,1);
		this.initializeAllien(7,"CHALLENGE 1 A",time+24,0,0,4,-1);
	}else if(waveSection==2){
			this.initializeAllien(8,"CHALLENGE 1 B",time+0,0,0,1,1);
			this.initializeAllien(9,"CHALLENGE 1 B",time+8,0,0,4,1);
			this.initializeAllien(10,"CHALLENGE 1 B",time+16,0,0,1,1);
			this.initializeAllien(11,"CHALLENGE 1 B",time+24,0,0,4,1);
			this.initializeAllien(12,"CHALLENGE 1 B",time+32,0,0,1,1);
			this.initializeAllien(13,"CHALLENGE 1 B",time+40,0,0,4,1);
			this.initializeAllien(14,"CHALLENGE 1 B",time+48,0,0,1,1);
			this.initializeAllien(15,"CHALLENGE 1 B",time+56,0,0,4,1);
	}else if(waveSection==3){
			this.initializeAllien(16,"CHALLENGE 1 B",time+0,0,0,4,-1);
			this.initializeAllien(17,"CHALLENGE 1 B",time+8,0,0,4,-1);
			this.initializeAllien(18,"CHALLENGE 1 B",time+16,0,0,4,-1);
			this.initializeAllien(19,"CHALLENGE 1 B",time+24,0,0,4,-1);
			this.initializeAllien(20,"CHALLENGE 1 B",time+32,0,0,4,-1);
			this.initializeAllien(21,"CHALLENGE 1 B",time+40,0,0,4,-1);
			this.initializeAllien(22,"CHALLENGE 1 B",time+48,0,0,4,-1);
			this.initializeAllien(23,"CHALLENGE 1 B",time+56,0,0,4,-1);
	}else if(waveSection==4){
			this.initializeAllien(24,"CHALLENGE 1 A",time+0,0,0,4,-1);
			this.initializeAllien(25,"CHALLENGE 1 A",time+8,0,0,4,-1);
			this.initializeAllien(26,"CHALLENGE 1 A",time+16,0,0,4,-1);
			this.initializeAllien(27,"CHALLENGE 1 A",time+24,0,0,4,-1);
			this.initializeAllien(28,"CHALLENGE 1 A",time+32,0,0,4,-1);
			this.initializeAllien(29,"CHALLENGE 1 A",time+40,0,0,4,-1);
			this.initializeAllien(30,"CHALLENGE 1 A",time+48,0,0,4,-1);
			this.initializeAllien(31,"CHALLENGE 1 A",time+56,0,0,4,-1);
	}else{
		this.initializeAllien(32,"CHALLENGE 1 A",time+0,0,0,4,1);
		this.initializeAllien(33,"CHALLENGE 1 A",time+8,0,0,4,1);
		this.initializeAllien(34,"CHALLENGE 1 A",time+16,0,0,4,1);
		this.initializeAllien(35,"CHALLENGE 1 A",time+24,0,0,4,1);
		this.initializeAllien(36,"CHALLENGE 1 A",time+32,0,0,4,1);
		this.initializeAllien(37,"CHALLENGE 1 A",time+40,0,0,4,1);
		this.initializeAllien(38,"CHALLENGE 1 A",time+48,0,0,4,1);
		this.initializeAllien(39,"CHALLENGE 1 A",time+56,0,0,4,1);
	}
}

allien.prototype.createWaveChallenge2=function(waveSection){
	var time=0;
	if(waveSection==1){
		this.initializeAllien(0,"CHALLENGE 2 A",time+0,0,0,3,1);
		this.initializeAllien(1,"CHALLENGE 2 A",time+0,0,0,3,-1);
		this.initializeAllien(2,"CHALLENGE 2 A",time+8,0,0,3,1);
		this.initializeAllien(3,"CHALLENGE 2 A",time+8,0,0,3,-1);
		this.initializeAllien(4,"CHALLENGE 2 A",time+16,0,0,3,1);
		this.initializeAllien(5,"CHALLENGE 2 A",time+16,0,0,3,-1);
		this.initializeAllien(6,"CHALLENGE 2 A",time+24,0,0,3,1);
		this.initializeAllien(7,"CHALLENGE 2 A",time+24,0,0,3,-1);
	}else if(waveSection==2){
			this.initializeAllien(8,"CHALLENGE 2 B",time+0,0,0,1,1);
			this.initializeAllien(9,"CHALLENGE 2 B",time+8,0,0,3,-1);
			this.initializeAllien(10,"CHALLENGE 2 B",time+16,0,0,1,1);
			this.initializeAllien(11,"CHALLENGE 2 B",time+24,0,0,3,-1);
			this.initializeAllien(12,"CHALLENGE 2 B",time+32,0,0,1,1);
			this.initializeAllien(13,"CHALLENGE 2 B",time+40,0,0,3,-1);
			this.initializeAllien(14,"CHALLENGE 2 B",time+48,0,0,1,1);
			this.initializeAllien(15,"CHALLENGE 2 B",time+56,0,0,3,-1);
	}else if(waveSection==3){
			this.initializeAllien(16,"CHALLENGE 2 B",time+0,0,0,3,1);
			this.initializeAllien(17,"CHALLENGE 2 B",time+0,0,0,3,-1);
			this.initializeAllien(18,"CHALLENGE 2 B",time+8,0,0,3,1);
			this.initializeAllien(19,"CHALLENGE 2 B",time+8,0,0,3,-1);
			this.initializeAllien(20,"CHALLENGE 2 B",time+16,0,0,3,1);
			this.initializeAllien(21,"CHALLENGE 2 B",time+16,0,0,3,-1);
			this.initializeAllien(22,"CHALLENGE 2 B",time+24,0,0,3,1);
			this.initializeAllien(23,"CHALLENGE 2 B",time+24,0,0,3,-1);
	}else if(waveSection==4){
			this.initializeAllien(24,"CHALLENGE 2 A",time+0,0,0,3,-1);
			this.initializeAllien(25,"CHALLENGE 2 A",time+8,0,0,3,-1);
			this.initializeAllien(26,"CHALLENGE 2 A",time+16,0,0,3,-1);
			this.initializeAllien(27,"CHALLENGE 2 A",time+24,0,0,3,-1);
			this.initializeAllien(28,"CHALLENGE 2 A",time+32,0,0,3,-1);
			this.initializeAllien(29,"CHALLENGE 2 A",time+40,0,0,3,-1);
			this.initializeAllien(30,"CHALLENGE 2 A",time+48,0,0,3,-1);
			this.initializeAllien(31,"CHALLENGE 2 A",time+56,0,0,3,-1);
	}else{
		this.initializeAllien(32,"CHALLENGE 2 A",time+0,0,0,3,1);
		this.initializeAllien(33,"CHALLENGE 2 A",time+8,0,0,3,1);
		this.initializeAllien(34,"CHALLENGE 2 A",time+16,0,0,3,1);
		this.initializeAllien(35,"CHALLENGE 2 A",time+24,0,0,3,1);
		this.initializeAllien(36,"CHALLENGE 2 A",time+32,0,0,3,1);
		this.initializeAllien(37,"CHALLENGE 2 A",time+40,0,0,3,1);
		this.initializeAllien(38,"CHALLENGE 2 A",time+48,0,0,3,1);
		this.initializeAllien(39,"CHALLENGE 2 A",time+56,0,0,3,1);
	}
}

allien.prototype.createWaveChallenge3=function(waveSection){
	var time=0;
	if(waveSection==1){
		this.initializeAllien(0,"CHALLENGE 3 A",time+0,0,0,7,1);
		this.initializeAllien(1,"CHALLENGE 3 B",time+8,0,0,7,1);
		this.initializeAllien(2,"CHALLENGE 3 A",time+16,0,0,7,1);
		this.initializeAllien(3,"CHALLENGE 3 B",time+24,0,0,7,1);
		this.initializeAllien(4,"CHALLENGE 3 A",time+32,0,0,7,1);
		this.initializeAllien(5,"CHALLENGE 3 B",time+40,0,0,7,1);
		this.initializeAllien(6,"CHALLENGE 3 A",time+48,0,0,7,1);
		this.initializeAllien(7,"CHALLENGE 3 B",time+56,0,0,7,1);
	}else if(waveSection==2){
			this.initializeAllien(8,"CHALLENGE 3 C",time+0,0,0,1,1);
			this.initializeAllien(9,"CHALLENGE 3 C",time+0,0,0,7,-1);
			this.initializeAllien(10,"CHALLENGE 3 C",time+8,0,0,1,1);
			this.initializeAllien(11,"CHALLENGE 3 C",time+8,0,0,7,-1);
			this.initializeAllien(12,"CHALLENGE 3 C",time+16,0,0,1,1);
			this.initializeAllien(13,"CHALLENGE 3 C",time+16,0,0,7,-1);
			this.initializeAllien(14,"CHALLENGE 3 C",time+24,0,0,1,1);
			this.initializeAllien(15,"CHALLENGE 3 C",time+24,0,0,7,-1);
	}else if(waveSection==3){
			this.initializeAllien(16,"CHALLENGE 3 C",time+0,0,0,7,1);
			this.initializeAllien(17,"CHALLENGE 3 C",time+0,0,0,7,-1);
			this.initializeAllien(18,"CHALLENGE 3 C",time+8,0,0,7,1);
			this.initializeAllien(19,"CHALLENGE 3 C",time+8,0,0,7,-1);
			this.initializeAllien(20,"CHALLENGE 3 C",time+16,0,0,7,1);
			this.initializeAllien(21,"CHALLENGE 3 C",time+16,0,0,7,-1);
			this.initializeAllien(22,"CHALLENGE 3 C",time+24,0,0,7,1);
			this.initializeAllien(23,"CHALLENGE 3 C",time+24,0,0,7,-1);
	}else if(waveSection==4){
			this.initializeAllien(24,"CHALLENGE 3 A",time+0,0,0,7,1);
			this.initializeAllien(25,"CHALLENGE 3 B",time+8,0,0,7,1);
			this.initializeAllien(26,"CHALLENGE 3 A",time+16,0,0,7,1);
			this.initializeAllien(27,"CHALLENGE 3 B",time+24,0,0,7,1);
			this.initializeAllien(28,"CHALLENGE 3 A",time+32,0,0,7,1);
			this.initializeAllien(29,"CHALLENGE 3 B",time+40,0,0,7,1);
			this.initializeAllien(30,"CHALLENGE 3 A",time+48,0,0,7,1);
			this.initializeAllien(31,"CHALLENGE 3 B",time+56,0,0,7,1);
	}else{
		this.initializeAllien(32,"CHALLENGE 3 A",time+0,0,0,7,-1);
		this.initializeAllien(33,"CHALLENGE 3 B",time+8,0,0,7,-1);
		this.initializeAllien(34,"CHALLENGE 3 A",time+16,0,0,7,-1);
		this.initializeAllien(35,"CHALLENGE 3 B",time+24,0,0,7,-1);
		this.initializeAllien(36,"CHALLENGE 3 A",time+32,0,0,7,-1);
		this.initializeAllien(37,"CHALLENGE 3 B",time+40,0,0,7,-1);
		this.initializeAllien(38,"CHALLENGE 3 A",time+48,0,0,7,-1);
		this.initializeAllien(39,"CHALLENGE 3 B",time+56,0,0,7,-1);
	}
}

allien.prototype.createWaveChallenge4=function(waveSection){
	var time=0;
	if(waveSection==1){
		this.initializeAllien(0,"CHALLENGE 4 A",time+0,0,0,8,1);
		this.initializeAllien(1,"CHALLENGE 4 B",time+0,0,0,8,1);
		this.initializeAllien(2,"CHALLENGE 4 A",time+8,0,0,8,1);
		this.initializeAllien(3,"CHALLENGE 4 B",time+8,0,0,8,1);
		this.initializeAllien(4,"CHALLENGE 4 A",time+16,0,0,8,1);
		this.initializeAllien(5,"CHALLENGE 4 B",time+16,0,0,8,1);
		this.initializeAllien(6,"CHALLENGE 4 A",time+24,0,0,8,1);
		this.initializeAllien(7,"CHALLENGE 4 B",time+24,0,0,8,1);
	}else if(waveSection==2){
			this.initializeAllien(8,"CHALLENGE 4 C",time+0,0,0,1,1);
			this.initializeAllien(9,"CHALLENGE 4 C",time+8,0,0,8,1);
			this.initializeAllien(10,"CHALLENGE 4 C",time+16,0,0,1,1);
			this.initializeAllien(11,"CHALLENGE 4 C",time+24,0,0,8,1);
			this.initializeAllien(12,"CHALLENGE 4 C",time+32,0,0,1,1);
			this.initializeAllien(13,"CHALLENGE 4 C",time+40,0,0,8,1);
			this.initializeAllien(14,"CHALLENGE 4 C",time+48,0,0,1,1);
			this.initializeAllien(15,"CHALLENGE 4 C",time+56,0,0,8,1);
	}else if(waveSection==3){
			this.initializeAllien(16,"CHALLENGE 4 C",time+0,0,0,8,-1);
			this.initializeAllien(17,"CHALLENGE 4 C",time+0,0,0,8,-1);
			this.initializeAllien(18,"CHALLENGE 4 C",time+8,0,0,8,-1);
			this.initializeAllien(19,"CHALLENGE 4 C",time+8,0,0,8,-1);
			this.initializeAllien(20,"CHALLENGE 4 C",time+16,0,0,8,-1);
			this.initializeAllien(21,"CHALLENGE 4 C",time+16,0,0,8,-1);
			this.initializeAllien(22,"CHALLENGE 4 C",time+24,0,0,8,-1);
			this.initializeAllien(23,"CHALLENGE 4 C",time+24,0,0,8,-1);
	}else if(waveSection==4){
			this.initializeAllien(24,"CHALLENGE 4 A",time+0,0,0,8,1);
			this.initializeAllien(25,"CHALLENGE 4 B",time+0,0,0,8,1);
			this.initializeAllien(26,"CHALLENGE 4 A",time+8,0,0,8,1);
			this.initializeAllien(27,"CHALLENGE 4 B",time+8,0,0,8,1);
			this.initializeAllien(28,"CHALLENGE 4 A",time+16,0,0,8,1);
			this.initializeAllien(29,"CHALLENGE 4 B",time+16,0,0,8,1);
			this.initializeAllien(30,"CHALLENGE 4 A",time+24,0,0,8,1);
			this.initializeAllien(31,"CHALLENGE 4 B",time+24,0,0,8,1);
	}else{
		this.initializeAllien(32,"CHALLENGE 4 A",time+0,0,0,8,-1);
		this.initializeAllien(33,"CHALLENGE 4 B",time+0,0,0,8,-1);
		this.initializeAllien(34,"CHALLENGE 4 A",time+8,0,0,8,-1);
		this.initializeAllien(35,"CHALLENGE 4 B",time+8,0,0,8,-1);
		this.initializeAllien(36,"CHALLENGE 4 A",time+16,0,0,8,-1);
		this.initializeAllien(37,"CHALLENGE 4 B",time+16,0,0,8,-1);
		this.initializeAllien(38,"CHALLENGE 4 A",time+24,0,0,8,-1);
		this.initializeAllien(39,"CHALLENGE 4 B",time+24,0,0,8,-1);
	}
}


