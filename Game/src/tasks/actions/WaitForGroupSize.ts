///<reference path="../../Game.ts"/>

import BannerMan = require('../../components/BannerMan');
import Peasant = require('../../unit/Peasant');
import BlackBoard = require('BlackBoard');
import LeafTask = require('LeafTask');

/**
 * Created by Paha on 8/3/2015.
 * Simply waits until the BannerMan's (blackBoard.me) group size is larger than the BannerMan's size to attack.
 */
class WaitForGroupSize extends LeafTask{
    bannerMan:BannerMan = null;

    constructor(bb:BlackBoard) {
        super(bb);
    }

    check():boolean {
        return super.check();
    }

    start():void {
        super.start();
        this.bannerMan = (<Peasant>this.bb.me).getBannerMan();
        this.bannerMan.owner.sprite.angle = 90; //Let's make him face down for the heck of it!
    }

    update(delta):void {
        super.update(delta);

        if(this.bannerMan.group.getNumUnits() >= this.bannerMan.sizeToAttack)
            this.control.finishWithSuccess();
    }

    end():void {
        super.end();
    }
}

export = WaitForGroupSize;