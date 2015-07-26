///<reference path="..\control\ParentTaskController.ts"/>
/**
 * Created by Paha on 7/25/2015.
 */

///<reference path="../../Game.ts"/>

class ParentTask extends Task{
    public control:ParentTaskController;
    protected index:number=0;

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

    protected childFailed(){
    }

    protected childSucceeded(){

    }
}