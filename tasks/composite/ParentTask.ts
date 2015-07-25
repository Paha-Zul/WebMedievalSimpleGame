///<reference path="..\control\ParentTaskController.ts"/>
/**
 * Created by Paha on 7/25/2015.
 */

///<reference path="../../Game.ts"/>

class ParentTask extends Task{
    protected control:ParentTaskController;
    index:number=0;

    constructor(bb:BlackBoard) {
        super(bb);

        this.control = new ParentTaskController(this);
    }

    start() {
        super.start();
        this.index = 0;
    }

    update(delta) {
        super.update(delta);
    }

    end() {
        return super.end();
    }

    getControl():TaskController {
        return this.control;
    }

    public addTask(task:Task){
        this.control.tasks.push(task);
    }

    protected childFailed(){
    }

    protected childSucceeded(){

    }
}