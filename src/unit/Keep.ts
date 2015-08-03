///<reference path="../Game.ts"/>

/**
 * Created by Paha on 8/3/2015.
 */

class Keep extends Building{
    bannerMan:BannerMan = null;

    constructor(x:number, y:number, game:Phaser.Game, playerName:string, sprite:Phaser.Sprite, width?:number, height?:number) {
        super(x, y, game, playerName, sprite, width, height);
    }


    start():void {
        super.start();
        this.sprite.loadTexture('capitol');
    }

    update(delta):void {
        super.update(delta);

        //TODO This needs to be fixed. The worker needs to be casted to a bannerman and immediately assigned the keep.
        //TODO The problem is that the bannerman isn't immediately available...

        if((this.worker === null || this.worker.toBeDestroyed) && this.capitol.food >= 1) {
            this.worker = this.capitol.addFreePeasant('leader', this.sprite.x, this.sprite.y);
            this.capitol.food--;
        }else if(this.worker !== null && !this.worker.toBeDestroyed && this.bannerMan == null){
            this.bannerMan = (<Peasant>this.worker).getBannerMan();
            this.bannerMan.keep = this;
        }
    }

    finalDestroy():void {
        super.destroy();
    }
}