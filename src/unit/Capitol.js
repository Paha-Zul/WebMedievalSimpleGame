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
    function Capitol(x, y, game, playerName, sprite, width, height) {
        var _this = this;
        _super.call(this, x, y, game, playerName, sprite, width, height);
        this.freePeasantList = [];
        this.workerList = [];
        this.armyList = [];
        this.buildingList = [];
        this.groupList = [];
        this.dropoffList = [];
        this.lastResources = 0;
        this.avgResources = 0;
        this.calcRate = function () {
            _this.avgResources = _this.food - _this.lastResources;
            _this.lastResources = _this.food;
        };
        this.timer = this.game.time.events.loop(Phaser.Timer.SECOND * 1, this.calcRate, this);
        this.type = 'building';
        this.name = 'capitol';
        this.taskQueue = new CircularQueue(100);
        PlayerManager.getPlayer(playerName).capitol = this;
    }
    Capitol.prototype.start = function () {
        _super.prototype.start.call(this);
        this.sprite.loadTexture('capitol');
        this.width = this.sprite.width;
        this.height = this.sprite.height;
        this.addToDropoffList(this);
    };
    Capitol.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        var unit = null;
        var i;
        for (i = 0; i < this.freePeasantList.length; i++) {
            unit = this.freePeasantList[i];
            if (unit.toBeDestroyed) {
                unit.finalDestroy();
                this.freePeasantList.splice(i, 1);
                i--;
            }
            else
                this.freePeasantList[i].update(delta);
        }
        for (i = 0; i < this.workerList.length; i++) {
            unit = this.workerList[i];
            if (unit.toBeDestroyed) {
                unit.finalDestroy();
                this.workerList.splice(i, 1);
                i--;
            }
            else
                this.workerList[i].update(delta);
        }
        for (i = 0; i < this.armyList.length; i++) {
            unit = this.armyList[i];
            if (unit.toBeDestroyed) {
                unit.finalDestroy();
                this.armyList.splice(i, 1);
                i--;
            }
            else
                this.armyList[i].update(delta);
        }
        for (i = 0; i < this.buildingList.length; i++) {
            unit = this.buildingList[i];
            if (unit.toBeDestroyed) {
                unit.finalDestroy();
                this.buildingList.splice(i, 1);
                i--;
            }
            else
                this.buildingList[i].update(delta);
        }
    };
    Capitol.prototype.addFreePeasant = function (type, x, y) {
        var sprite = peasantGroup.getFirstDead();
        if (sprite === undefined || sprite === null)
            sprite = peasantGroup.create(0, 0, '');
        else
            sprite.reset(0, 0);
        var unit = new Peasant(x, y, this.game, this.playerName, sprite);
        unit.name = type;
        unit.type = 'humanoid';
        unit.sprite.autoCull = true;
        this.freePeasantList.push(unit);
        return unit;
    };
    Capitol.prototype.addBuilding = function (type, x, y, width, height) {
        var unit = null;
        var sprite = buildingGroup.getFirstDead();
        if (sprite === undefined || sprite === null)
            sprite = buildingGroup.create(0, 0, '');
        else
            sprite.reset(0, 0);
        if (type === 'house')
            unit = new House(x, y, this.game, this.playerName, sprite, width, height);
        if (type === 'farm')
            unit = new Farm(x, y, this.game, this.playerName, sprite, width, height);
        if (type === 'barracks')
            unit = new Barracks(x, y, this.game, this.playerName, sprite, width, height);
        if (type === 'mine')
            unit = new Mine(x, y, this.game, this.playerName, sprite, width, height);
        if (type === 'keep')
            unit = new Keep(x, y, this.game, this.playerName, sprite, width, height);
        unit.name = type;
        unit.type = 'building';
        unit.sprite.autoCull = true;
        this.buildingList.push(unit);
        return unit;
    };
    Capitol.prototype.addGroup = function (leader) {
        var group = new Group(leader);
        leader.getBannerMan().group = group;
        this.groupList.push(group);
        return group;
    };
    Capitol.prototype.addToDropoffList = function (unit) {
        this.dropoffList.push(unit);
    };
    Capitol.prototype.removeFromDropoffList = function (unit) {
        for (var i = 0; i < this.dropoffList.length; i++) {
            if (this.dropoffList[i] === unit) {
                this.dropoffList.splice(i, 1);
                break;
            }
        }
    };
    Capitol.prototype.removeGroup = function (group) {
        for (var i = 0; i <= this.groupList.length; i++)
            if (this.groupList[i] === group) {
                this.groupList.splice(i, 1);
                break;
            }
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
    };
    return Capitol;
})(Unit);
//# sourceMappingURL=Capitol.js.map