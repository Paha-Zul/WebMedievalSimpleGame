
///<reference path='../Game.ts'/>
import _Game = require('../Game');
import _Building = require('./Building');

/**
 * Created by Paha on 7/27/2015.
 */
class House extends _Building{

    constructor(x:number, y:number, warGame:_Game, playerName:string, sprite:Phaser.Sprite, width?:number, height?:number) {
        super(x, y, warGame, playerName, sprite, width, height);
    }

    start():void {
        super.start();

        this.name = 'barracks';
        this.worker = this.capitol.addFreePeasant('peasant', this.sprite.x, this.sprite.y);
        this.sprite.loadTexture('house');
        this.width = this.sprite.width;
        this.height = this.sprite.height;
    }

    update(delta):void {
        super.update(delta);
    }


    destroy():void {
        super.destroy();
        this.worker.destroy();
    }
}

export = House;