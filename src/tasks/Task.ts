///<reference path="control/TaskController.ts"/>
/**
 * Created by Paha on 7/24/2015.
 */

///<reference path="BlackBoard.ts"/>
///<reference path="../Game.ts"/>


class Task{
    public name:string = '';

    constructor(public bb:BlackBoard){

    }

    check():boolean{
        return true;
    }

    start():void{

    }

    update(delta):void{

    }

    end():void{

    }

    getControl():TaskController{
        return null;
    }
}