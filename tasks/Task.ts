/**
 * Created by Paha on 7/24/2015.
 */

///<reference path="BlackBoard.ts"/>


class Task{
    started:boolean = false;
    finished:boolean = false;
    failed:boolean = false;

    constructor(public task:Task, public bb:BlackBoard){

    }

    start(){

    }

    update(delta){
        if(this.task) this.task.update(delta);
        else this.finish(true);
    }

    finish(failed:boolean){
        this.failed = failed;
    }


}