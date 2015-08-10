/// <reference path="./../Game.ts"/>
import { Unit, Group } from './Unit';
import Peasant from './Peasant';
import House from './House';
import Farm from './Farm';
import Mine from './Mine';
import Keep from './Keep';
import Barracks from './Barracks';
import CircularQueue from '../util/CircularQueue';
import { PlayerManager } from '../util/PlayerManager';
/**
 * Created by Paha on 7/23/2015.
 *
 * Super prototyping extension of the prototype class.
 */
class Capitol extends Unit {
    constructor(x, y, warGame, playerName, sprite, width, height) {
        super(x, y, warGame, playerName, sprite, width, height);
        this.freePeasantList = [];
        this.workerList = [];
        this.armyList = [];
        this.buildingList = [];
        this.groupList = [];
        this.dropoffList = [];
        this.lastResources = 0;
        this.avgResources = 0;
        this.calcRate = () => {
            this.avgResources = this.food - this.lastResources;
            this.lastResources = this.food;
        };
        this.timer = this.warGame.game.time.events.loop(Phaser.Timer.SECOND * 1, this.calcRate, this);
        this.type = 'building';
        this.name = 'capitol';
        this.taskQueue = new CircularQueue(100);
        PlayerManager.getPlayer(playerName).capitol = this;
    }
    start() {
        super.start();
        this.sprite.loadTexture('capitol');
        this.width = this.sprite.width;
        this.height = this.sprite.height;
        this.addToDropoffList(this);
    }
    update(delta) {
        super.update(delta);
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
    }
    addFreePeasant(type, x, y) {
        var sprite = this.warGame.peasantGroup.getFirstDead();
        if (sprite === undefined || sprite === null)
            sprite = this.warGame.peasantGroup.create(0, 0, '');
        else
            sprite.reset(0, 0);
        var unit = new Peasant(x, y, this.warGame, this.playerName, sprite);
        unit.name = type;
        unit.type = 'humanoid';
        unit.sprite.autoCull = true;
        this.freePeasantList.push(unit);
        return unit;
    }
    addBuilding(type, x, y, width, height) {
        var unit = null;
        var sprite = this.warGame.buildingGroup.getFirstDead();
        if (sprite === undefined || sprite === null)
            sprite = this.warGame.buildingGroup.create(0, 0, '');
        else
            sprite.reset(0, 0);
        if (type === 'house')
            unit = new House(x, y, this.warGame, this.playerName, sprite, width, height);
        if (type === 'farm')
            unit = new Farm(x, y, this.warGame, this.playerName, sprite, width, height);
        if (type === 'barracks')
            unit = new Barracks(x, y, this.warGame, this.playerName, sprite, width, height);
        if (type === 'mine')
            unit = new Mine(x, y, this.warGame, this.playerName, sprite, width, height);
        if (type === 'keep')
            unit = new Keep(x, y, this.warGame, this.playerName, sprite, width, height);
        unit.name = type;
        unit.type = 'building';
        unit.sprite.autoCull = true;
        this.buildingList.push(unit);
        return unit;
    }
    addGroup(leader) {
        var group = new Group(leader);
        leader.getBannerMan().group = group;
        this.groupList.push(group);
        return group;
    }
    addToDropoffList(unit) {
        this.dropoffList.push(unit);
    }
    removeFromDropoffList(unit) {
        for (var i = 0; i < this.dropoffList.length; i++) {
            if (this.dropoffList[i] === unit) {
                this.dropoffList.splice(i, 1);
                break;
            }
        }
    }
    removeGroup(group) {
        for (var i = 0; i <= this.groupList.length; i++)
            if (this.groupList[i] === group) {
                this.groupList.splice(i, 1);
                break;
            }
    }
    getGroupList() {
        return this.groupList;
    }
    addTaskToQueue(func) {
        this.taskQueue.add(func);
    }
    getTaskFromQueue() {
        return this.taskQueue.popFirst();
    }
    destroy() {
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
        this.warGame.game.time.events.remove(this.timer);
    }
}
export default Capitol;
//# sourceMappingURL=Capitol.js.map