///<reference path="../../Game.ts"/>

/**
 * Created by Paha on 8/2/2015.
 */
class Repeat extends TaskDecorator{

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

        //If the task finished and didn't fail, reset it.
        if(this.task.getControl().finished && !this.task.getControl().failed){
            this.task.getControl().reset();
            if(this.task.check()) this.task.start(); //If check was true, start the task.
            else this.getControl().finishWithFailure(); //Otherwise, fail it!

        //If the task finished but failed, fail this task.
        }else if(this.task.getControl().finished  && this.task.getControl().failed)
            this.getControl().finishWithFailure();

        //Otherwise it isn't finished, update!
        else
            this.task.update(delta);
    }

    end():void {
        super.end();
    }
}
