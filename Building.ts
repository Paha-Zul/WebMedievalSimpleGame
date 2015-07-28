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

        this.type = 'buildingType';
        this.name = 'farm';
        this.food = 0;
        this.blackBoard.moveSpeed = 0;
    }

    start():void {
        super.start();

        if(this.name === 'mine')
            this.refillTime = 2000;
    }

    update(delta){
        super.update(delta);

        //For a farm....
        if(this.name === 'farm') {
            //If we have 0 food, wait some time before refilling.
            if (this.food === 0) {
                this.counter += delta; //Increment
                if (this.counter >= this.refillTime) {
                    this.counter = 0; //Reset
                    this.food = 1; //Reset

                    //We add a new task to the colony queue.
                    this.colony.addTaskToQueue(this.getResourceTask);
                }
            }

        //For a mine...
        }else if(this.name === 'mine'){
            //If we have 0 iron, wait some time before refilling.
            if (this.iron === 0) {
                this.counter += delta; //Increment
                if (this.counter >= this.refillTime) {
                    this.counter = 0; //Reset
                    this.iron = 1; //Reset

                    //We add a new task to the colony queue.
                    this.colony.addTaskToQueue(this.getResourceTask);
                }
            }

        //For a house...
        }else if(this.name === 'house' && this.worker === null){
            this.worker = this.colony.addFreePeasant(this.sprite.x, this.sprite.y, this.game, this.colony);

        //For a barracks...
        }else if(this.name === 'barracks'){
            this.counter += delta;
            if(this.counter >= this.refillTime && this.colony.food >= 1){
                this.counter = 0;
                var p = this.colony.addFreePeasant(this.sprite.x, this.sprite.y, this.game, this.colony);
                p.name = 'soldier';
                this.colony.food--;
            }
        }

        //this.resText.text = ''+this.food;
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
