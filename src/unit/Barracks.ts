/**
 * Created by Paha on 7/27/2015.
 */

/// <reference path="./../Game.ts"/>

class Barracks extends Building{

    constructor(x:number, y:number, game:Phaser.Game, playerName:string, sprite:Phaser.Sprite, width:number, height:number) {
        super(x, y, game, playerName, sprite, width, height);
    }


    start():void {
        super.start();

        this.refillTime = 1000;
        this.name = 'barracks';
        this.sprite.loadTexture('barracks');
        this.width = this.sprite.width;
        this.height = this.sprite.height;
    }

    update(delta):void {
        super.update(delta);

        this.counter += delta;
        if(this.counter >= this.refillTime && this.capitol.food >= 1){
            this.counter = 0;
            var p = this.capitol.addFreePeasant('soldier', this.sprite.x, this.sprite.y, this.game);
            p.name = 'soldier';
            this.capitol.food--;
        }
    }
}