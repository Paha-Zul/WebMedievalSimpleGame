/// <reference path="./../Game.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by Paha on 7/23/2015.
 *
 * Super prototyping extension of the prototype class.
 */
var Colony = (function (_super) {
    __extends(Colony, _super);
    function Colony(x, y, game, width, height) {
        var _this = this;
        _super.call(this, x, y, game, null, width, height);
        this.game = game;
        this.freePeasantList = [];
        this.workerList = [];
        this.armyList = [];
        this.buildingList = [];
        this.groupList = [];
        this.lastResources = 0;
        this.avgResources = 0;
        this.addFreePeasant = function (x, y, game, colony) {
            var unit = new Unit(x, y, game, colony);
            _this.freePeasantList.push(unit);
            return unit;
        };
        this.addBuilding = function (type, x, y, game, colony, width, height) {
            var unit = null;
            if (type === 'house')
                unit = new House(x, y, game, colony, width, height);
            if (type === 'farm')
                unit = new Farm(x, y, game, colony, width, height);
            if (type === 'barracks')
                unit = new Barracks(x, y, game, colony, width, height);
            if (type === 'mine')
                unit = new Mine(x, y, game, colony, width, height);
            unit.name = type;
            _this.buildingList.push(unit);
            return unit;
        };
        this.calcRate = function () {
            _this.avgResources = _this.food - _this.lastResources;
            _this.lastResources = _this.food;
        };
        this.timer = this.game.time.events.loop(Phaser.Timer.SECOND * 1, this.calcRate, this);
        this.type = 'colony';
        this.name = 'colony';
        this.taskQueue = new CircularQueue(100);
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
    Colony.prototype.addGroup = function (leader) {
        var group = new Group(leader);
        leader.group = group;
        this.groupList.push(group);
        return group;
    };
    Colony.prototype.getGroupList = function () {
        return this.groupList;
    };
    Colony.prototype.addTaskToQueue = function (func) {
        this.taskQueue.add(func);
    };
    Colony.prototype.getTaskFromQueue = function () {
        return this.taskQueue.popFirst();
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