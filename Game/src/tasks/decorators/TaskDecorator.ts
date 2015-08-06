///<reference path="../../Game.ts"/>

import TaskController = require('../control/TaskController');
import BlackBoard = require('BlackBoard');
import Task = require('Task');

/**
 * Created by Paha on 8/2/2015.
 */

class TaskDecorator extends Task{
    control:TaskController;
    task:Task;

    constructor(bb:BlackBoard) {
        super(bb);

        this.control = new TaskController(this);
    }

    check():boolean {
        return super.check();
    }

    start():void {
        super.start();
        this.task.start();
    }

    update(delta):void {
        super.update(delta);
    }

    end():void {
        super.end();
    }

    setTask(task:Task):void{
        this.task = task;
    }


    getControl():TaskController {
        return this.control;
    }
}

export = TaskDecorator;