/// <reference path="./../Game.ts"/>

import _Game = require('../Game');
import Unit = require('./Unit');
import BannerMan = require('../components/BannerMan');
import Soldier = require('../components/Soldier');
import Helper = require('../util/Helper');

/**
 * Created by Paha on 7/29/2015.
 */
class Peasant extends Unit.Unit{
    private soldier:Soldier = null;
    private bannerMan:BannerMan = null;

    constructor(x:number, y:number, warGame:_Game, playerName:string, sprite:Phaser.Sprite, width?:number, height?:number) {
        super(x, y, warGame, playerName, sprite, width, height);

        this.type ='peasant';
    }

    start():void {
        super.start();
        this.type ='peasant';

        this.sprite.loadTexture(Helper.makeSquareSprite(this.warGame.game, 10,10));

        if(this.name === 'peasant'){

        }else if(this.name === 'soldier'){
            this.soldier = new Soldier(this);
            this.soldier.start();
        }else if(this.name === 'leader'){
            this.bannerMan = new BannerMan(this);
            this.bannerMan.start();
        }
    }

    public update(delta:number):void {
        super.update(delta);

        if(this.bannerMan !== null){
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
        if(this.bannerMan !== null) this.bannerMan.destroy();
        if(this.soldier !== null) this.soldier.destroy();
        this.bannerMan = null;
        this.soldier = null;
    }
}

export = Peasant;