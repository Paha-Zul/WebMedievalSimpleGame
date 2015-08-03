 /// <reference path="./../Game.ts"/>

/**
 * Created by Paha on 7/23/2015.
 *
 * Super prototyping extension of the prototype class.
 */
class Capitol extends Unit{
    static playerCounter : number;
    freePeasantList : Unit[] = [];
    workerList : Unit[] = [];
    armyList : Unit[] = [];
    buildingList : Unit[] = [];
    groupList : Group[] = [];
    lastResources : number = 0;
    avgResources : number = 0;
    timer : Phaser.TimerEvent;
    taskQueue:CircularQueue<any>;

    constructor(x:number, y:number, game:Phaser.Game, playerName:string, sprite:Phaser.Sprite, width?:number, height?:number){
        super(x, y, game, playerName, sprite, width, height);

        this.timer = this.game.time.events.loop(Phaser.Timer.SECOND*1, this.calcRate, this);
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
    }

    update(delta){
        super.update(delta);
        var unit:Unit = null;

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

    addFreePeasant(type:string, x:number, y:number):Unit{
        var unit = new Peasant(x, y, this.game, this.playerName, peasantGroup.create(0, 0, ''));
        unit.name = type;
        unit.type = 'humanoid';
        this.freePeasantList.push(unit);
        return unit;
    }

    addBuilding = (type:string, x, y, game, colony, width?, height?) : Building =>{
        var unit:Building = null;
        if(type === 'house') unit = new House(x, y, game, this.playerName, buildingGroup.create(0,0,type), width, height);
        if(type === 'farm') unit = new Farm(x, y, game, this.playerName, buildingGroup.create(0,0,type), width, height);
        if(type === 'barracks') unit = new Barracks(x, y, game, this.playerName, buildingGroup.create(0,0,type), width, height);
        if(type === 'mine') unit = new Mine(x, y, game, this.playerName, buildingGroup.create(0,0,type), width, height);
        if(type === 'keep') unit = new Keep(x, y, game, this.playerName, buildingGroup.create(0,0,''), width, height);

        unit.name = type;
        unit.type = 'building';

        this.buildingList.push(unit);
        return unit;
    };

    addGroup(leader:Peasant){
        var group:Group = new Group(leader);
        leader.getBannerMan().group = group;
        this.groupList.push(group);
        return group;
    }

    removeGroup(group:Group){
        for(var i=0;i<=this.groupList.length;i++)
            if(this.groupList[i] === group){
                this.groupList.splice(i, 1);
                break;
            }
    }

    getGroupList():Group[]{
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

        this.game.time.events.remove(this.timer);
        this.game.time.events.remove(this.spawnTimer);
    }
}