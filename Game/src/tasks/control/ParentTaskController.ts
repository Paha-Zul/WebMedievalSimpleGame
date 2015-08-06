///<reference path="../../Game.ts"/>

import TaskController = require('TaskController');
import Task = require('Task');

/**
 * Created by Paha on 7/25/2015.
 */
class ParentTaskController extends TaskController{
    public tasks:Task[];
    public currTask:Task;
    public index:number;

    constructor(task:Task) {
        super(task);

        this.tasks = [];
        this.currTask = null;
        this.index = 0;
    }

    addTask(task:Task){
        this.tasks.push(task);
    }


    reset():void {
        super.reset();
        this.tasks.forEach(task => task.getControl().reset());
    }
}

export = ParentTaskController;