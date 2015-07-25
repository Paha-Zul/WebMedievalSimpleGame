/// <reference path="./Game.ts"/>
///<reference path="Unit.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Building = (function (_super) {
    __extends(Building, _super);
    function Building(x, y, game, colony) {
        _super.call(this, x, y, game, colony, 30, 30);
        this.counter = 0;
        this.refillTime = 1000;
        this.worker = null;
        this.type = 'building';
        this.name = 'farm';
        this.resources = 1;
    }
    Building.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        //If we have 0 resources, wait some time before refilling.
        if (this.resources === 0) {
            this.counter += delta; //Increment
            if (this.counter >= this.refillTime) {
                this.counter = 0; //Reset
                this.resources = 1; //Reset
            }
        }
        //this.resText.text = ''+this.resources;
    };
    return Building;
})(Unit);
//# sourceMappingURL=Building.js.map