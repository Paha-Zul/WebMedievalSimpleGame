/**
 * Created by Paha on 7/24/2015.
 */

///<reference path="BlackBoard.ts"/>


class Task{
    started:boolean = false;
    finished:boolean = false;
    failed:boolean = false;
    nextTask:Task = null;

    constructor(public bb:BlackBoard){

    }

    start(){
        this.started = true;
    }

    update(delta){

    }

    finish(failed:boolean){
        this.failed = failed;
        this.finished = true;
    }


}