///<reference path="../../Game.ts"/>

import BlackBoard = require('../BlackBoard');
import LeafTask = require('../LeafTask');

import BannerMan = require('../../components/BannerMan');
import Soldier = require('../../components/Soldier');

import Unit = require('../../unit/Unit');
import Peasant = require('../../unit/Peasant');

/**
 * Created by Paha on 8/3/2015.
 */
class JoinGroup extends LeafTask{

    constructor(bb:BlackBoard) {
        super(bb);
    }

    check():boolean {
        //Neither the group nor the leader can be null or destroyed.
        return super.check() && this.bb.targetGroup !== null && !this.bb.targetGroup.destroyed
            && this.bb.targetGroup.getLeader() !== null && !this.bb.targetGroup.getLeader().toBeDestroyed
            && !this.bb.targetGroup.isFull();
    }

    start():void {
        super.start();
    }

    update(delta):void {
        super.update(delta);

        if(!this.check())
            this.control.finishWithFailure();

        else {

            var soldier:Soldier = (<Peasant>this.bb.me).getSoldier();
            soldier.group = this.bb.targetGroup.addUnit(soldier.owner);
            this.control.finishWithSuccess();
        }
    }

    end():void {
        super.end();
    }
}

export = JoinGroup;