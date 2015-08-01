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
var Capitol = (function (_super) {
    __extends(Capitol, _super);
    function Capitol(x, y, game, sprite, width, height) {
        var _this = this;
        _super.call(this, x, y, game, null, sprite, width, height);
        this.freePeasantList = [];
        this.workerList = [];
        this.armyList = [];
        this.buildingList = [];
        this.groupList = [];
        this.lastResources = 0;
        this.avgResources = 0;
        this.addFreePeasant = function (type, x, y, game, colony) {
            var unit = new Peasant(x, y, game, colony, peasantGroup.create(0, 0, 'capitol'));
            unit.name = type;
            unit.type = 'humanoid';
            _this.freePeasantList.push(unit);
            return unit;
        };
        this.addBuilding = function (type, x, y, game, colony, width, height) {
            var unit = null;
            if (type === 'house')
                unit = new House(x, y, game, colony, buildingGroup.create(0, 0, type), width, height);
            if (type === 'farm')
                unit = new Farm(x, y, game, colony, buildingGroup.create(0, 0, type), width, height);
            if (type === 'barracks')
                unit = new Barracks(x, y, game, colony, buildingGroup.create(0, 0, type), width, height);
            if (type === 'mine')
                unit = new Mine(x, y, game, colony, buildingGroup.create(0, 0, type), width, height);
            unit.name = type;
            unit.type = 'building';
            _this.buildingList.push(unit);
            return unit;
        };
        this.calcRate = function () {
            _this.avgResources = _this.food - _this.lastResources;
            _this.lastResources = _this.food;
        };
        this.timer = this.game.time.events.loop(Phaser.Timer.SECOND * 1, this.calcRate, this);
        this.spawnTimer = this.game.time.events.loop(10000, function () { return _this.addFreePeasant('leader', _this.sprite.x, _this.sprite.y, _this.game, _this); }, this);
        this.type = 'building';
        this.name = 'capitol';
        this.taskQueue = new CircularQueue(100);
    }
    Capitol.prototype.start = function () {
        _super.prototype.start.call(this);
        this.sprite.loadTexture('capitol');
        this.width = this.sprite.width;
        this.height = this.sprite.height;
    };
    Capitol.prototype.update = function (delta) {
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
    Capitol.prototype.addGroup = function (leader) {
        var group = new Group(leader);
        leader.getBannerMan().group = group;
        this.groupList.push(group);
        return group;
    };
    Capitol.prototype.getGroupList = function () {
        return this.groupList;
    };
    Capitol.prototype.addTaskToQueue = function (func) {
        this.taskQueue.add(func);
    };
    Capitol.prototype.getTaskFromQueue = function () {
        return this.taskQueue.popFirst();
    };
    Capitol.prototype.destroy = function () {
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
        this.game.time.events.remove(this.timer);
        this.game.time.events.remove(this.spawnTimer);
    };
    return Capitol;
})(Unit);
//# sourceMappingURL=Capitol.js.map