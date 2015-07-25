/// <reference path="./Game.ts"/>

/**
 * Created by Paha on 7/23/2015.
 */
class Colony extends Unit{
    static playerCounter : number;
    freePeasantList : Unit[] = [];
    workerList : Unit[] = [];
    armyList : Unit[] = [];
    buildingList : Unit[] = [];
    lastResources : number = 0;
    avgResources : number = 0;
    timer : Phaser.TimerEvent;
    taskQueue:CircularQueue<Task>;

    constructor(x, y, public game){
        super(x, y, game, null, 50, 50);
        this.timer = this.game.time.events.loop(Phaser.Timer.SECOND*1, this.calcRate, this);
        this.type = 'colony';
        this.taskQueue = new CircularQueue<Task>(100);
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

    addFreePeasant = (x, y, game, colony) : Unit =>{
        var unit = new Unit(x, y, game, colony);
        this.freePeasantList.push(unit);
        return unit;
    };

    addTaskToQueue(task:Task){
        this.taskQueue.add(task);
    }

    getTaskFromQueue():Task{
        return this.taskQueue.getFirst();
    }

    calcRate = () =>{
        this.avgResources = this.resources - this.lastResources;
        this.lastResources = this.resources;
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
    }
}