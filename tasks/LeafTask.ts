///<reference path="Task.ts"/>
/**
 * Created by Paha on 7/25/2015.
 */

class LeafTask extends Task{
    protected control:TaskController;

    constructor(bb:BlackBoard) {
        super(bb);

        this.control = new TaskController(this);
    }

    start() {
        super.start();
    }

    update(delta) {
        super.update(delta);
    }

    end() {
        super.end();
    }


    getControl():TaskController {
        return this.control;
    }
}