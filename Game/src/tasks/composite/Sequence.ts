/**
 * Created by Paha on 7/25/2015.
 */

    ///<reference path="../../Game.ts"/>

class Sequence extends ParentTask{

    constructor(bb:BlackBoard) {
        super(bb);
    }

    start() {
        super.start();
        this.control.currTask = this.control.tasks[0];
    }

    update(delta) {
        super.update(delta);

        //If the currTask is null, something went wrong. Return with failure.
        if(this.control.currTask === null){
            this.control.finishWithFailure();
        //Otherwise, update it!
        }else {
            if(!this.control.currTask.getControl().started) this.control.currTask.getControl().safeStart(); //If not started, start.
            if(this.control.currTask.getControl().finished){
                if(this.control.currTask.getControl().failed) this.childFailed();
                else this.childSucceeded();
            }else
                this.control.currTask.update(delta);//Otherwise update.
        }
    }

    protected childFailed(){
        this.control.finishWithFailure();
    }

    protected childSucceeded(){
        this.index++; //Increment index
        //Get a new task if our index is still valid.
        if(this.index < this.control.tasks.length)
            this.control.currTask = this.control.tasks[this.index];
        //Otherwise, finish this task with success.
        else
            this.getControl().finishWithSuccess();

        //If the check didn't pass, finish with failure.
        if(!this.control.currTask.check())
            this.getControl().finishWithFailure();
    }
}