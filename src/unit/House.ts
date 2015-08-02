/**
 * Created by Paha on 7/27/2015.
 */

///<reference path='../Game.ts'/>

class House extends Building{

    constructor(x:number, y:number, game:Phaser.Game, playerName:string, sprite:Phaser.Sprite, width?:number, height?:number) {
        super(x, y, game, playerName, sprite, width, height);
    }

    start():void {
        super.start();

        this.name = 'barracks';
        this.worker = this.capitol.addFreePeasant('peasant', this.sprite.x, this.sprite.y, this.game);
        this.sprite.loadTexture('house');
        this.width = this.sprite.width;
        this.height = this.sprite.height;
    }

    update(delta):void {
        super.update(delta);
    }
}