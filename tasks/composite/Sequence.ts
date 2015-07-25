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

        if(this.control.currTask === null){
            this.control.finishWithFailure();
        }else {
            if(!this.control.currTask.getControl().started) this.control.currTask.start(); //If not started, start.
            if(this.control.currTask.getControl().finished && this.control.currTask.getControl().failed)
                this.childFailed();         //If failed, fail.
            else if(this.control.currTask.getControl().finished)
                this.childSucceeded();      //If succeeded, succeed.
            else
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
    }
}