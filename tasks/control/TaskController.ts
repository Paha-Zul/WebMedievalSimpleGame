/**
 * Created by Paha on 7/25/2015.
 */

///<reference path="../../Game.ts"/>

class TaskController{
    started:boolean = false;
    finished:boolean = false;
    failed:boolean = false;

    constructor(private task:Task){

    }

    safeStart(){
        this.started = true;
        this.task.start();
    }

    finishWithFailure(){
        this.finished = true;
        this.failed = true;
        this.safeEnd();
    }

    finishWithSuccess(){
        this.finished = true;
        this.failed = false;
        this.safeEnd();
    }

    safeEnd(){

    }

}