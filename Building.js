/// <reference path="./Game.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Building = (function (_super) {
    __extends(Building, _super);
    function Building(x, y, game, colony) {
        var _this = this;
        _super.call(this, x, y, game, colony, 30, 30);
        this.counter = 0;
        this.refillTime = 1000;
        this.update = function (delta) {
            //If we have 0 resources, wait some time before refilling.
            if (_this.resources === 0) {
                _this.counter += delta; //Increment
                if (_this.counter >= _this.refillTime) {
                    _this.counter = 0; //Reset
                    _this.resources = 1; //Reset
                }
            }
        };
        this.type = 'building';
        this.name = 'farm';
        this.resources = 1;
    }
    return Building;
})(Unit);
//# sourceMappingURL=Building.js.map