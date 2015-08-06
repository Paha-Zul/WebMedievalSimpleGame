/**
 * Created by Paha on 7/25/2015.
 */

import Task = require('Task');

///<reference path="../../Game.ts"/>

class TaskController{
    started:boolean = false;
    finished:boolean = false;
    failed:boolean = false;

    failCheck:any = null;
    finishCallback:any = null;

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

    safeEnd():void{
        if(this.finishCallback !== null) this.finishCallback();
    }

    reset():void{
        this.started = false;
        this.finished = false;
        this.failed = false;
    }

}

export = TaskController;