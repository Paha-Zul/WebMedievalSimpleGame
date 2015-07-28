/// <reference path="./../Game.ts"/>
///<reference path="Unit.ts"/>

/**
 * An extension of the super prototype class.
 */
class Building extends Unit {
    counter:number = 0;
    refillTime:number = 1000;
    worker:Unit = null;

    constructor(x:number, y:number, game:Phaser.Game, colony:Colony, width?:number, height?:number) {
        super(x, y, game, colony, width||30, height||30);

        this.type = 'buildingType';
        this.name = 'farm';
        this.food = 0;
        this.iron = 0;
        this.blackBoard.moveSpeed = 0;
    }

    start():void {
        super.start();
    }

    update(delta):void{
        super.update(delta);

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
