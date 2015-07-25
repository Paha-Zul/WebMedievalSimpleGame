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

    start(){
        this.started = true;
    }

    finishWithFailure(){
        this.finished = true;
        this.failed = true;
    }

    finishWithSuccess(){
        this.finished = true;
        this.failed = false;
    }

}