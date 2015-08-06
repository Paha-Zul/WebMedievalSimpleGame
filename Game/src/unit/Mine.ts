///<reference path='../Game.ts'/>

import _Game = require('../Game');
import _Building = require('./Building');

/**
 * Created by Paha on 7/27/2015.
 */
class Mine extends _Building{
    counter:number = 0;

    constructor(x:number, y:number, warGame:_Game, playerName:string, sprite:Phaser.Sprite, width:number, height:number) {
        super(x, y, warGame, playerName, sprite, width, height);
    }


    start():void {
        super.start();

        this.refillTime = 2000;
        this.name = 'mine';
        this.sprite.loadTexture('mine');
        this.width = this.sprite.width;
        this.height = this.sprite.height;
    }

    update(delta):void {
        super.update(delta);

        //If we have 0 iron, wait some time before refilling.
        if (this.iron === 0) {
            this.counter += delta; //Increment
            if (this.counter >= this.refillTime) {
                this.counter = 0; //Reset
                this.iron = 1; //Reset

                //We add a new task to the colony queue.
                this.capitol.addTaskToQueue(this.deliverToDropoff);
            }
        }
    }
}

export = Mine;