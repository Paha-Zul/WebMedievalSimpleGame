/**
 * Created by Paha on 7/27/2015.
 */

import _Game = require('../Game');
import _Building = require('./Building');

/// <reference path="./../Game.ts"/>

class Barracks extends _Building {
    nextSpawn:number = 0;

    constructor(x:number, y:number, warGame:_Game, playerName:string, sprite:Phaser.Sprite, width:number, height:number) {
        super(x, y, warGame, playerName, sprite, width, height);
    }


    start():void {
        super.start();

        this.refillTime = 2950 + Math.random() * 100;
        this.name = 'barracks';
        this.sprite.loadTexture('barracks');
        this.width = this.sprite.width;
        this.height = this.sprite.height;
    }

    update(delta):void {
        super.update(delta);

        if (this.warGame.game.time.now >= this.nextSpawn && this.capitol.food >= 1) {
            this.nextSpawn = this.warGame.game.time.now + this.refillTime;
            this.capitol.addFreePeasant('soldier', this.sprite.x, this.sprite.y);
            this.capitol.food--;
        }
    }
}

export = Barracks;