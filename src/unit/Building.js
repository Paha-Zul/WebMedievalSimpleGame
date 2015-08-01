/// <reference path="./../Game.ts"/>
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
    function Building(x, y, game, colony, sprite, width, height) {
        var _this = this;
        _super.call(this, x, y, game, colony, sprite, width || 30, height || 30);
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
        this.iron = 0;
        this.blackBoard.moveSpeed = 0;
    }
    Building.prototype.start = function () {
        _super.prototype.start.call(this);
    };
    Building.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
    };
    return Building;
})(Unit);
//# sourceMappingURL=Building.js.map