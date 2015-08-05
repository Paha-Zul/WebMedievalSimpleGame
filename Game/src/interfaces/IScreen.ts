/// <reference path="./../Game.ts"/>

/**
 * Created by Paha on 8/4/2015.
 */

interface IScreen{
    start():void;
    update(delta):void;
    destroy():void;
}