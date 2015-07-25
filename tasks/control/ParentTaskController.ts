///<reference path="TaskController.ts"/>

/**
 * Created by Paha on 7/25/2015.
 */
class ParentTaskController extends TaskController{
    tasks:Task[];
    currTask:Task;
    index:number;

    constructor(task:Task) {
        super(task);

        this.tasks = [];
        this.currTask = null;
        this.index = 0;
    }
}