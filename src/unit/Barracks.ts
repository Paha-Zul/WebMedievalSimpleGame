/**
 * Created by Paha on 7/27/2015.
 */

/// <reference path="./../Game.ts"/>

class Barracks extends Building{
    nextSpawn:number = 0;

    constructor(x:number, y:number, game:Phaser.Game, playerName:string, sprite:Phaser.Sprite, width:number, height:number) {
        super(x, y, game, playerName, sprite, width, height);
    }


    start():void {
        super.start();

        this.refillTime = 2950 + Math.random()*100;
        this.name = 'barracks';
        this.sprite.loadTexture('barracks');
        this.width = this.sprite.width;
        this.height = this.sprite.height;
    }

    update(delta):void {
        super.update(delta);

        if(this.game.time.now >= this.nextSpawn && this.capitol.food >= 1){
            this.nextSpawn = this.game.time.now + this.refillTime;
            this.capitol.addFreePeasant('soldier', this.sprite.x, this.sprite.y);
            this.capitol.food--;
        }
    }
}