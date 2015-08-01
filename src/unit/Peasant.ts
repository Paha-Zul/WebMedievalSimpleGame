/**
 * Created by Paha on 7/29/2015.
 */

/// <reference path="./../Game.ts"/>

class Peasant extends Unit{
    private soldier:Soldier = null;
    private bannerMan:BannerMan = null;

    constructor(x:number, y:number, game:Phaser.Game, colony:Capitol, sprite:Phaser.Sprite, width?:number, height?:number) {
        super(x, y, game, colony, sprite, width, height);
    }

    start():void {
        super.start();

        this.sprite.loadTexture(makeSquareSprite(10,10));
        game.physics.arcade.enable(this.sprite);

        if(this.name === 'peasant'){

        }else if(this.name === 'soldier'){
            this.soldier = new Soldier(this, this.colony);
            this.soldier.start();
        }else if(this.name === 'leader'){
            this.bannerMan = new BannerMan(this, this.colony);
            this.bannerMan.start();
        }
    }

    public update(delta:number):void {
        super.update(delta);

        if(this.bannerMan !== null){
            this.text.text = ''+this.bannerMan.group.getNumUnits();
            this.bannerMan.update(delta);
        }else if(this.soldier !== null){
            this.soldier.update(delta);
        }
    }

    public getSoldier():Soldier{
        return this.soldier;
    }

    public getBannerMan():BannerMan {
        return this.bannerMan;
    }

    destroy():void {
        super.destroy();
    }
}