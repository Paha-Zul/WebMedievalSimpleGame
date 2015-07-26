/// <reference path="./Game.ts"/>
///<reference path="Unit.ts"/>

/**
 * An extension of the super prototype class.
 */
class Building extends Unit {
    counter:number = 0;
    refillTime:number = 1000;
    worker:Unit = null;

    constructor(x, y, game, colony, width?, height?) {
        super(x, y, game, colony, width||30, height||30);

        this.type = 'building';
        this.name = 'farm';
        this.resources = 0;
        this.blackBoard.moveSpeed = 0;
    }


    start():void {
        super.start();


    }

    update(delta){
        super.update(delta);

        if(this.name === 'farm') {
            //If we have 0 resources, wait some time before refilling.
            if (this.resources === 0) {
                this.counter += delta; //Increment
                if (this.counter >= this.refillTime) {
                    this.counter = 0; //Reset
                    this.resources = 1; //Reset

                    //We add a new task to the colony queue.
                    this.colony.addTaskToQueue(this.getResourceTask);
                }
            }
        }if(this.name === 'house' && this.worker === null){
            this.worker = this.colony.addFreePeasant(this.sprite.x, this.sprite.y, this.game, this.colony);
        }

        //this.resText.text = ''+this.resources;
    }

    getResourceTask = (bb:BlackBoard):Task => {
        bb.target = this;
        bb.targetPosition = this.sprite.position;

        var seq:Sequence = new Sequence(bb);
        seq.control.addTask(new MoveTo(bb));
        seq.control.addTask(new TakeResource(bb));
        seq.control.addTask(new GetColony(bb));
        seq.control.addTask(new MoveTo(bb));
        seq.control.addTask(new GiveResource(bb));

        return seq;
    }
}
