///<reference path="../Game.ts"/>

/**
 * Created by Paha on 8/3/2015.
 */

class Keep extends Building{

    constructor(x:number, y:number, game:Phaser.Game, playerName:string, sprite:Phaser.Sprite, width?:number, height?:number) {
        super(x, y, game, playerName, sprite, width, height);
    }


    start():void {
        super.start();
    }

    update(delta):void {
        super.update(delta);
    }


    destroy():void {
        super.destroy();
    }
}