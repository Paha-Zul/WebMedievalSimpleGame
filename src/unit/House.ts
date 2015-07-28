/**
 * Created by Paha on 7/27/2015.
 */

///<reference path='../Game.ts'/>

class House extends Building{

    constructor(x:number, y:number, game:Phaser.Game, colony:Capitol, width?:number, height?:number) {
        super(x, y, game, colony, width, height);
    }

    start():void {
        super.start();

        this.name = 'barracks';
        this.worker = this.colony.addFreePeasant(this.sprite.x, this.sprite.y, this.game, this.colony);
    }

    update(delta):void {
        super.update(delta);
    }
}