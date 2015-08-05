/// <reference path="./../Game.ts"/>
///<reference path="Unit.ts"/>

/**
 * An extension of the super prototype class.
 */
class Building extends Unit {
    nextRetIncrease:number = 0;
    refillTime:number = 1000;
    worker:Unit = null;
    maxRetaliationStrength:number = 5;
    currRetaliationStrength:number = 5;
    retaliationStrengthRate:number = 1;
    retaliationStrengthTime:number = 1000;

    constructor(x:number, y:number, warGame:Game, playerName:string, sprite:Phaser.Sprite, width:number, height:number) {
        super(x, y, warGame, playerName, sprite, width || 30, height || 30);

        this.type = 'building';
        this.name = 'farm';
        this.food = 0;
        this.iron = 0;
        this.blackBoard.moveSpeed = 0;
        this.sprite.angle = 0;
    }

    start():void {
        super.start();
    }

    update(delta):void{
        super.update(delta);

        if(this.currRetaliationStrength < this.maxRetaliationStrength && this.warGame.game.time.now >= this.nextRetIncrease){
            this.currRetaliationStrength += this.retaliationStrengthRate;
            if(this.currRetaliationStrength >= this.maxRetaliationStrength)
                this.currRetaliationStrength = this.maxRetaliationStrength;

            this.nextRetIncrease = this.warGame.game.time.now + this.retaliationStrengthTime;
        }
    }

    deliverToColony = (bb:BlackBoard):Task => {
        bb.target = this;
        bb.targetPosition = this.sprite.position;

        var seq:Sequence = new Sequence(bb);
        var takeResource = new TakeResource(bb);

        seq.control.addTask(new MoveTo(bb));
        seq.control.addTask(takeResource);
        seq.control.addTask(new GetColony(bb));
        seq.control.addTask(new MoveTo(bb));
        seq.control.addTask(new GiveResource(bb));

        takeResource.getControl().finishCallback = () => this.requestedPickup = false;

        return seq;
    };

    deliverToDropoff = (bb:BlackBoard):Task => {
        bb.target = this;
        bb.targetPosition = this.sprite.position;

        var seq:Sequence = new Sequence(bb);
        var takeResource = new TakeResource(bb);

        seq.control.addTask(new MoveTo(bb));
        seq.control.addTask(takeResource);
        seq.control.addTask(new GetClosestDropoff(bb));
        seq.control.addTask(new MoveTo(bb));
        seq.control.addTask(new GiveResource(bb));

        takeResource.getControl().finishCallback = () => this.requestedPickup = false;

        return seq;
    };
}
