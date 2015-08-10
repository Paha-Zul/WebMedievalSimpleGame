///<reference path="../control/ParentTaskController.ts"/>
///<reference path="../../Game.ts"/>

import Task from '../Task';
import BlackBoard from '../BlackBoard';
import ParentTaskController from '../control/ParentTaskController';
import TaskController from '../control/TaskController';

/**
 * Created by Paha on 7/25/2015.
 */
class ParentTask extends Task{
    public control:ParentTaskController;
    protected index:number=0;

    constructor(bb:BlackBoard) {
        super(bb);

        this.control = new ParentTaskController(this);
    }

    start():void {
        super.start();
        this.index = 0;
    }

    update(delta):void {
        super.update(delta);
    }

    end():void {
        return super.end();
    }

    getControl():TaskController {
        return this.control;
    }

    protected childFailed():void{
    }

    protected childSucceeded():void{

    }
}

export default ParentTask;