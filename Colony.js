/// <reference path="./Game.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by Paha on 7/23/2015.
 */
var Colony = (function (_super) {
    __extends(Colony, _super);
    function Colony(x, y, game) {
        var _this = this;
        _super.call(this, x, y, game, null, 50, 50);
        this.game = game;
        this.freePeasantList = [];
        this.workerList = [];
        this.armyList = [];
        this.buildingList = [];
        this.lastResources = 0;
        this.avgResources = 0;
        this.update = function (delta) {
            //super.update(delta);
            var i;
            for (i = 0; i < _this.freePeasantList.length; i++)
                _this.freePeasantList[i].update(delta);
            for (i = 0; i < _this.workerList.length; i++)
                _this.workerList[i].update(delta);
            for (i = 0; i < _this.armyList.length; i++)
                _this.armyList[i].update(delta);
            for (i = 0; i < _this.buildingList.length; i++)
                _this.buildingList[i].update(delta);
        };
        this.addFreePeasant = function (x, y, game, colony) {
            var unit = new Unit(x, y, game, colony);
            _this.freePeasantList.push(unit);
            return unit;
        };
        this.calcRate = function () {
            _this.avgResources = _this.resources - _this.lastResources;
            _this.lastResources = _this.resources;
        };
        this.timer = this.game.time.events.loop(Phaser.Timer.SECOND * 1, this.calcRate, this);
    }
    return Colony;
})(Unit);
//# sourceMappingURL=Colony.js.map