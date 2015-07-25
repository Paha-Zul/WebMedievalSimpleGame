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
        this.type = 'colony';
    }
    Colony.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        var i;
        for (i = 0; i < this.freePeasantList.length; i++)
            this.freePeasantList[i].update(delta);
        for (i = 0; i < this.workerList.length; i++)
            this.workerList[i].update(delta);
        for (i = 0; i < this.armyList.length; i++)
            this.armyList[i].update(delta);
        for (i = 0; i < this.buildingList.length; i++)
            this.buildingList[i].update(delta);
    };
    Colony.prototype.destroy = function () {
        var i = 0;
        for (i = 0; i < this.freePeasantList.length; i++)
            this.freePeasantList[i].destroy();
        for (i = 0; i < this.workerList.length; i++)
            this.workerList[i].destroy();
        for (i = 0; i < this.armyList.length; i++)
            this.armyList[i].destroy();
        for (i = 0; i < this.buildingList.length; i++)
            this.buildingList[i].destroy();
        this.freePeasantList = [];
        this.workerList = [];
        this.armyList = [];
        this.buildingList = [];
        this.text.destroy();
    };
    return Colony;
})(Unit);
//# sourceMappingURL=Colony.js.map