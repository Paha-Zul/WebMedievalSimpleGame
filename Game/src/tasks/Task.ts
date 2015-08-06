///<reference path="control/TaskController.ts"/>
///<reference path="BlackBoard.ts"/>
///<reference path="../Game.ts"/>

import BlackBoard = require('BlackBoard');
import TaskController = require('control/TaskController');

/**
 * Created by Paha on 7/24/2015.
 */
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

export = Task;