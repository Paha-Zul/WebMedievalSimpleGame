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
    spawnTimer:Phaser.TimerEvent;

    constructor(x, y, game, sprite:Phaser.Sprite, width?, height?){
        super(x, y, game, null, sprite, width, height);

        this.timer = this.game.time.events.loop(Phaser.Timer.SECOND*1, this.calcRate, this);
        this.spawnTimer = this.game.time.events.loop(10000, ()=>this.addFreePeasant('leader', this.sprite.x, this.sprite.y, this.game, this), this);
        this.type = 'building';
        this.name = 'capitol';
        this.taskQueue = new CircularQueue<any>(100);
    }

    start():void {
        super.start();

        this.sprite.loadTexture('capitol');
        this.width = this.sprite.width;
        this.height = this.sprite.height;
    }

    update(delta){
        super.update(delta);

        var i;
        for(i=0;i<this.freePeasantList.length;i++)
            this.freePeasantList[i].update(delta);
        for(i=0;i<this.workerList.length;i++)
            this.workerList[i].update(delta);
        for(i=0;i<this.armyList.length;i++)
            this.armyList[i].update(delta);
        for(i=0;i<this.buildingList.length;i++)
            this.buildingList[i].update(delta);
    }

    addFreePeasant = (type:string, x:number, y:number, game:Phaser.Game, colony:Capitol) : Unit =>{
        var unit = new Peasant(x, y, game, colony, peasantGroup.create(0, 0, 'capitol'));
        unit.name = type;
        unit.type = 'humanoid';
        this.freePeasantList.push(unit);
        return unit;
    };

    addBuilding = (type:string, x, y, game, colony, width?, height?) : Building =>{
        var unit:Building = null;
        if(type === 'house') unit = new House(x, y, game, colony, buildingGroup.create(0,0,type), width, height);
        if(type === 'farm') unit = new Farm(x, y, game, colony, buildingGroup.create(0,0,type), width, height);
        if(type === 'barracks') unit = new Barracks(x, y, game, colony, buildingGroup.create(0,0,type), width, height);
        if(type === 'mine') unit = new Mine(x, y, game, colony, buildingGroup.create(0,0,type), width, height);

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