///<reference path="../../Game.ts"/>

/**
 * Created by Paha on 8/2/2015.
 */

class Parallel extends ParentTask{
    triggerTask:Task = null;

    constructor(bb:BlackBoard) {
        super(bb);
    }


    start():void {
        super.start();
    }

    update(delta):void {
        var atLeastOne:boolean = false;

        this.control.tasks.forEach( task => {
            //If not started, try to start.
            if(!task.getControl().started) {
                if(task.check()) task.getControl().safeStart(); //If check passed, start.
                else task.getControl().finishWithFailure(); //Otherwise, fail the task.
            }

            //If the task is not finished, update it!
            if(!task.getControl().finished) {
                task.update(delta);
                atLeastOne = true;

            //If it matches the trigger task, finish this job.
            }else if(task.getControl().finished && !task.getControl().failed && task === this.triggerTask)
                this.control.finishWithSuccess();
        });

        //When there are no tasks running anymore, end this task.
        if(!atLeastOne)
            this.getControl().finishWithSuccess();
    }

    end():void {
        super.end();
    }

    setTriggerTask(task:Task){
        this.triggerTask = task;
    }

    protected childFailed():void {
        super.childFailed();

        this.control.finishWithFailure();
    }

    protected childSucceeded():void {
        super.childSucceeded();
    }
}