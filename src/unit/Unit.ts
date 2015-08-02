/// <reference path="./../Game.ts"/>

/**
 * Created by Paha on 7/23/2015.
 *
 * A prototyping class. Needs to be cleaned up later but such you know?
 */
class Unit{
    name : string = 'peasant';
    type : string = 'humanoid';
    control : string = 'auto';
    active : boolean = true;
    started : boolean = false;
    behaviour : Task = null;
    idleCounter : number = 0;
    walkCounter : number = 0;
    food : number = 0;
    iron : number = 0;
    posCounter : number = 0;
    flag : boolean = false;
    text:Phaser.Text;
    blackBoard:BlackBoard;
    capitol:Capitol;
    toBeDestroyed:boolean = false;

    constructor(public x:number, public y:number, public game:Phaser.Game, public playerName:string, public sprite:Phaser.Sprite, public width?:number, public height?:number){
        this.width = width || 10;
        this.height = height || 10;
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.anchor.setTo(0.5, 0.5);
        this.blackBoard = new BlackBoard();
        this.blackBoard.me = this;
        this.blackBoard.myPlayer = PlayerManager.getPlayer(this.playerName);
        this.blackBoard.game = game;
        this.capitol = this.blackBoard.myPlayer.capitol;
    }

    start():void{
        this.started = true;

        if(this.name !== 'house' && this.name !== 'soldier' && this.name !== 'barracks'){
            var style = { font: "18px Arial", fill: "#1765D1", align: "center" };
            this.text = game.add.text(this.sprite.x, this.sprite.y - this.height/2 - 20, 'fixme', style);
        }
    }

    public update(delta : number):void {
        if(!this.started) this.start();

        if(this.text !== undefined && this.text !== null) {
            if(this.name === 'capitol') {
                this.text.text = 'F: ' + this.food+" I: "+this.iron;
            }else if(this.name === 'mine') {
                this.text.text = 'I: ' + this.iron;
            }else if(this.name === 'peasant'){
                this.text.text = ''+(this.iron+this.food);
            }else{
                this.text.text = 'F: ' + this.food;
            }

            this.text.position.set(this.sprite.x - this.text.width/2, this.sprite.y - this.height / 2 - 20);
        }

        this.updateBehaviours(delta);
    }

    updateBehaviours(delta){
        //If we have a behaviour, execute it.
        if(this.behaviour !== null){
            if(!this.behaviour.getControl().started) this.behaviour.getControl().safeStart(); //Start the behaviour
            this.behaviour.update(delta); //Update it.
            if(this.behaviour.getControl().finished){ //If finished, null it out.
                this.behaviour = null;
            }
        }else{
            if(this.name === 'peasant') {
                var beh:any = this.capitol.getTaskFromQueue();

                //If we actually got one, execute the function which will return a behaviour.
                if (beh !== null)
                    this.behaviour = beh(this.blackBoard);
                else {
                    this.behaviour = this.wander(this.blackBoard);
                }
            }
        }
    }

    //Walks in a direction.
    public walkTowardsRotation = (rotation:number, moveSpeed:number, disToStop?) =>{
        //Get X and Y moving values.
        var x = Math.cos(rotation) * moveSpeed;
        var y = Math.sin(rotation) * moveSpeed;

        this.sprite.x += x;
        this.sprite.y += y;

        this.sprite.angle = rotation;
    };

    //Walks towards a position stopping when it gets within the disToStop range.
    public walkTowardsPosition(position:Phaser.Point, disToStop:number, moveSpeed:number, disToTarget?, rotToTarget?):boolean{
        if(disToTarget === undefined) //Set the disToTarget if it wasn't passed
            disToTarget = this.sprite.position.distance(position);
        if(rotToTarget === undefined) //Set the rotToTarget if it wasn't passed.
            rotToTarget = this.sprite.position.angle(position, false);

        //If we are still outside the stop range, move!
        if(disToTarget >= disToStop) {
            var x = Math.cos(rotToTarget) * moveSpeed;
            var y = Math.sin(rotToTarget) * moveSpeed;

            this.sprite.body.velocity.set(x, y);
            //this.sprite.x += x;
            //this.sprite.y += y;
            this.sprite.angle = rotToTarget*(180/Math.PI);
        }else{
            this.sprite.position.set(position.x, position.y);
            this.sprite.body.velocity.set(0, 0);
            return true;
        }

        return false;
    }

    destroy():void{
        this.toBeDestroyed = true;
    }

    public finalDestroy(){
        this.sprite.destroy(true);
        if(this.text !== undefined && this.text !== null) this.text.destroy(true);
        this.behaviour = null;
    }

    wander(bb:BlackBoard):Task{
        var seq:Sequence = new Sequence(bb);
        seq.control.addTask(new RandomLocation(bb));
        seq.control.addTask(new MoveTo(bb));
        seq.control.addTask(new Idle(bb));

        return seq;
    }

}

class Group{
    private leader:Peasant = null;
    private unitList:Peasant[];
    private positions:Phaser.Point[];
    private posCounter:number = 0;
    private spacing:number = 15;
    private lines:number = 3;
    private unitsPerLine:number = 8;


    constructor(leader:Peasant){
        this.leader = leader;
        this.positions = [];
        this.unitList = [];
    }

    addUnit(unit:Peasant):Group{
        this.unitList.push(unit);
        this.reformGroup();
        return this;
    }

    removeUnit(unit:Peasant):Group{
        //Remove the unit from the list by searching/splicing.
        for(var i=0;i<this.unitList.length;i++){
            if(this.unitList[i] === unit) {
                this.unitList.splice(i, 1);
                break;
            }
        }
        this.reformGroup();
        return this;
    }

    /**
     * Kills an amount of this group. Will remove and destroy the units
     * @param amount
     */
    killAmount(amount:number){
        if(amount >= this.unitList.length)
            this.killGroup();
        else{
            //Loop until we remove the right amount.
            var counter = 0;
            for(var i=this.unitList.length-1;counter<=amount;i--) {
                this.unitList[i].destroy(); //Destroy the unit.
                this.unitList.splice(i,1); //Splice it out!
                counter++; //Increment counter.
            }
        }
    }

    private killGroup(){
        for(var i=0;i<this.unitList.length;i++)
            this.unitList[i].destroy();
        this.unitList = [];
        if(this.leader !== null) this.leader.destroy();
        this.leader = null;
    }

    getLeader():Peasant{
        return this.leader;
    }

    getNumUnits():number{
        return this.unitList.length;
    }

    destroy(){
        this.killGroup();
    }

    private reformGroup(){
        //TODO Kinda performance heavy to do for every addition/subtraction. Maybe have a timer to wait
        //TODO since an add/remove?
        //TODO Maybe not... got up to 700 units before getting under 50 frames and that's probably due to rendering.
        this.posCounter = 0;
        this.lines = ~~(this.unitList.length/this.unitsPerLine) + 1;
        this.positions = [];

        var num = this.unitList.length;
        var spacing = 15; //Spacing between spaces

        //calculate all the new positions...
        for(var i=0;i<num;i++){
            var index = ~~(i/~~(num/this.lines));
            var div = ~~(num/this.lines);
            var x = -(index+1)*spacing;
            var y = i%div*spacing - div/2*spacing;
            var point = new Phaser.Point(x, y);
            this.positions.push(point);
            this.unitList[i].getSoldier().leader = this.leader.getBannerMan();
            this.unitList[i].blackBoard.target = this.leader;
            this.unitList[i].blackBoard.targetPosition = point;
            this.unitList[i].behaviour = new FollowPointRelativeToTarget(this.unitList[i].blackBoard);
        }
    }
}


