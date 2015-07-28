/// <reference path="./Game.ts"/>
///<reference path="Unit.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * An extension of the super prototype class.
 */
var Building = (function (_super) {
    __extends(Building, _super);
    function Building(x, y, game, colony, width, height) {
        var _this = this;
        _super.call(this, x, y, game, colony, width || 30, height || 30);
        this.counter = 0;
        this.refillTime = 1000;
        this.worker = null;
        this.getResourceTask = function (bb) {
            bb.target = _this;
            bb.targetPosition = _this.sprite.position;
            var seq = new Sequence(bb);
            seq.control.addTask(new MoveTo(bb));
            seq.control.addTask(new TakeResource(bb));
            seq.control.addTask(new GetColony(bb));
            seq.control.addTask(new MoveTo(bb));
            seq.control.addTask(new GiveResource(bb));
            return seq;
        };
        this.type = 'buildingType';
        this.name = 'farm';
        this.food = 0;
        this.blackBoard.moveSpeed = 0;
    }
    Building.prototype.start = function () {
        _super.prototype.start.call(this);
        if (this.name === 'mine')
            this.refillTime = 2000;
    };
    Building.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        //For a farm....
        if (this.name === 'farm') {
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
        }
        else if (this.name === 'mine') {
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
        }
        else if (this.name === 'house' && this.worker === null) {
            this.worker = this.colony.addFreePeasant(this.sprite.x, this.sprite.y, this.game, this.colony);
        }
        else if (this.name === 'barracks') {
            this.counter += delta;
            if (this.counter >= this.refillTime && this.colony.food >= 1) {
                this.counter = 0;
                var p = this.colony.addFreePeasant(this.sprite.x, this.sprite.y, this.game, this.colony);
                p.name = 'soldier';
                this.colony.food--;
            }
        }
        //this.resText.text = ''+this.food;
    };
    return Building;
})(Unit);
//# sourceMappingURL=Building.js.map