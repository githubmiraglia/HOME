function oil(sprite,costume,pos,vel,rotate,flip){
    actor.call(this,sprite,costume,pos,vel,rotate,flip);
    this.countdown = 0;
    this.state = "";
    this.createCounter=0;
    this.once=[false,false,false,false];
};

oil.prototype = Object.create(actor.prototype);

oil.prototype.act = function(data,flags){
    this.gameData = data;
    this.gameFlags = flags;
    if(!this.once[0]){
        this.once[0]=true;
        this.initialize();
    }
    if(this.gameFlags.oilCreatingFlame)
        this.createFire();
    if (!this.gameFlags.reachedPrincess&&!this.gameFlags.princessRescued&&!this.gameFlags.playerLosesLife&&!this.gameFlags.hammerStrike){
        this.counter++;
        if(this.state=="CREATING FLAME"){
            this.change("costume",1+Math.floor(this.counter/8)%2);
            this.countdown--;
            if(this.countdown==0){
                this.state="BURNING";
                this.createCounter = 120 + (2 - this.gameData.difficultyLevel)*120 -(this.gameData.level-1)*20;
            }
        }else if(this.state=="BURNING"){
            this.change("costume",3+Math.floor(this.counter/8)%2)
            if(this.gameData.level==2)
                this.createCounter--;
                if(this.createCounter==0)
                    if(this.gameData.FireCount<5){
                        this.countdown=32;
                        this.state = "CREATING FLAME";
                    }else
                        this.createCounter = 120 + (2 - this.gameData.difficultyLevel)*120 -(this.gameData.level-1)*20;
        }
    }
    return([this.gameData,this.gameFlags]);
};
                    

oil.prototype.initialize = function(){
    this.change("costume",0);
    this.counter=0;
    if(this.gameData.levelType==1)
        this.state="empty";
    else if (this.gameData.levelType==2){
        this.state="CREATING FLAME";
        this.countdown = 32;
    }
};

oil.prototype.createFire = function(){
    this.countdown = 32;
    this.state = "CREATING FLAME";
    this.gameFlags.oilCreatingFlame = false;
};
