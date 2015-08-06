/// <reference path="./../Game.ts"/>

import _Game = require('../Game');
import _Unit = require('./Unit');
import _Peasant = require('./Peasant');
import _Building = require('./Building');
import _House = require('./House');
import _Farm = require('./Farm');
import _Mine = require('./Mine');
import _Keep = require('./Keep');
import _Barracks = require('./Barracks');
import Task = require('../tasks/Task');
import PM = require('../util/PlayerManager');
import PlayerManager = PM.PlayerManager
import Player = PM.Player;

/**
 * Created by Paha on 7/23/2015.
 *
 * Super prototyping extension of the prototype class.
 */
class Capitol extends _Unit.Unit{
    static playerCounter : number;
    freePeasantList : _Unit.Unit[] = [];
    workerList : _Unit.Unit[] = [];
    armyList : _Unit.Unit[] = [];
    buildingList : _Unit.Unit[] = [];
    groupList : _Unit.Group[] = [];
    dropoffList : _Unit.Unit[] = [];
    lastResources : number = 0;
    avgResources : number = 0;
    timer : Phaser.TimerEvent;
    taskQueue:CircularQueue<any>;

    constructor(x:number, y:number, warGame:_Game, playerName:string, sprite:Phaser.Sprite, width?:number, height?:number){
        super(x, y, warGame, playerName, sprite, width, height);

        this.timer = this.warGame.game.time.events.loop(Phaser.Timer.SECOND*1, this.calcRate, this);
        this.type = 'building';
        this.name = 'capitol';
        this.taskQueue = new CircularQueue<any>(100);
        PlayerManager.getPlayer(playerName).capitol = this;
    }

    start():void {
        super.start();

        this.sprite.loadTexture('capitol');
        this.width = this.sprite.width;
        this.height = this.sprite.height;
        this.addToDropoffList(this);
    }

    update(delta){
        super.update(delta);
        var unit:_Unit.Unit = null;

        var i;
        for(i=0;i<this.freePeasantList.length;i++) {
            unit = this.freePeasantList[i];
            if(unit.toBeDestroyed){
                unit.finalDestroy();
                this.freePeasantList.splice(i, 1);
                i--;
            }else
                this.freePeasantList[i].update(delta);
        }
        for(i=0;i<this.workerList.length;i++) {
            unit = this.workerList[i];
            if(unit.toBeDestroyed){
                unit.finalDestroy();
                this.workerList.splice(i, 1);
                i--;
            }else
                this.workerList[i].update(delta);
        }
        for(i=0;i<this.armyList.length;i++) {
            unit = this.armyList[i];
            if(unit.toBeDestroyed){
                unit.finalDestroy();
                this.armyList.splice(i, 1);
                i--;
            }else
                this.armyList[i].update(delta);
        }
        for(i=0;i<this.buildingList.length;i++) {
            unit = this.buildingList[i];
            if(unit.toBeDestroyed){
                unit.finalDestroy();
                this.buildingList.splice(i, 1);
                i--;
            }else
                this.buildingList[i].update(delta);
        }
    }

    addFreePeasant(type:string, x:number, y:number):_Unit.Unit{
        var sprite:Phaser.Sprite = this.warGame.peasantGroup.getFirstDead();
        if(sprite === undefined || sprite === null) sprite = this.warGame.peasantGroup.create(0,0,'');
        else sprite.reset(0,0);

        var unit = new _Peasant(x, y, this.warGame, this.playerName, sprite);
        unit.name = type;
        unit.type = 'humanoid';
        unit.sprite.autoCull = true;

        this.freePeasantList.push(unit);
        return unit;
    }

    addBuilding(type:string, x:number, y:number, width?:number, height?:number):_Building{
        var unit:_Building = null;
        var sprite:Phaser.Sprite = this.warGame.buildingGroup.getFirstDead();
        if(sprite === undefined || sprite === null)
            sprite = this.warGame.buildingGroup.create(0,0,'');
        else
            sprite.reset(0,0);

        if(type === 'house') unit = new _House(x, y, this.warGame, this.playerName, sprite, width, height);
        if(type === 'farm') unit = new _Farm(x, y, this.warGame, this.playerName, sprite, width, height);
        if(type === 'barracks') unit = new _Barracks(x, y, this.warGame, this.playerName, sprite, width, height);
        if(type === 'mine') unit = new _Mine(x, y, this.warGame, this.playerName, sprite, width, height);
        if(type === 'keep') unit = new _Keep(x, y, this.warGame, this.playerName, sprite, width, height);

        unit.name = type;
        unit.type = 'building';
        unit.sprite.autoCull = true;

        this.buildingList.push(unit);
        return unit;
    }

    addGroup(leader:_Peasant){
        var group:_Unit.Group = new _Unit.Group(leader);
        leader.getBannerMan().group = group;
        this.groupList.push(group);
        return group;
    }

    addToDropoffList(unit:_Unit.Unit):void{
        this.dropoffList.push(unit);
    }

    removeFromDropoffList(unit:_Unit.Unit):void{
        for(var i=0;i<this.dropoffList.length;i++){
            if(this.dropoffList[i] === unit){
                this.dropoffList.splice(i, 1);
                break;
            }
        }
    }

    removeGroup(group:_Unit.Group){
        for(var i=0;i<=this.groupList.length;i++)
            if(this.groupList[i] === group){
                this.groupList.splice(i, 1);
                break;
            }
    }

    getGroupList():_Unit.Group[]{
        return this.groupList;
    }

    addTaskToQueue(func:any){
        this.taskQueue.add(func);
    }

    getTaskFromQueue():Task{
        return this.taskQueue.popFirst();
    }

    calcRate = () =>{
        this.avgResources = this.food - this.lastResources;
        this.lastResources = this.food;
    };

    destroy(){
        var i=0;
        for(i=0;i<this.freePeasantList.length;i++)
            this.freePeasantList[i].destroy();
        for(i=0;i<this.workerList.length;i++)
            this.workerList[i].destroy();
        for(i=0;i<this.armyList.length;i++)
            this.armyList[i].destroy();
        for(i=0;i<this.buildingList.length;i++)
            this.buildingList[i].destroy();

        this.freePeasantList = [];
        this.workerList = [];
        this.armyList = [];
        this.buildingList = [];

        this.text.destroy();

        this.warGame.game.time.events.remove(this.timer);
    }
}

export = Capitol;