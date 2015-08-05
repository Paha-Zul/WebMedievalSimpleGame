///<reference path="../../Game.ts"/>

/**
 * Created by Paha on 8/2/2015.
 */

class AlwaysTrue extends TaskDecorator{

    constructor(bb:BlackBoard) {
        super(bb);
    }

    check():boolean {
        return super.check();
    }

    start():void {
        super.start();
    }

    update(delta):void {
        super.update(delta);

        this.task.update(delta);
        if(this.task.getControl().finished)
            this.control.finishWithSuccess(); //Always finish with success.
    }

    end():void {
        super.end();
    }
}