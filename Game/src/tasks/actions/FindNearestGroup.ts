///<reference path="../../Game.ts"/>

import BlackBoard = require('../BlackBoard');
import LeafTask = require('../LeafTask');

import BannerMan = require('../../components/BannerMan');
import Unit = require('../../unit/Unit');

/**
 * Created by Paha on 8/3/2015.
 */
class FindNearestGroup extends LeafTask{

    constructor(bb:BlackBoard) {
        super(bb);
    }

    check():boolean {
        return super.check();
    }

    start():void {
        super.start();
    }

    update(delta):void {
        super.update(delta);

        var list = this.bb.me.capitol.getGroupList();
        if(list.length > 0) {
            var l = list.length;
            var closestDist = 99999999999999999;
            var closestLeader:BannerMan = null;
            for(var i=0;i<l;i++){
                var group:Unit.Group = list[i];
                if(group.isFull()) continue;

                //If the group is null or the leader is null or the leader is destroyed... continue.
                if(group == null || group.getLeader() === null || group.getLeader().toBeDestroyed) continue;

                //Compute distance. If it's less than the current closest, pick it!
                var _dis = group.getLeader().sprite.position.distance(this.bb.me.sprite.position);
                if(_dis <= closestDist){
                    closestLeader = group.getLeader().getBannerMan();
                    closestDist = _dis;
                }
            }

            if(closestLeader !== null){
                this.bb.targetGroup = closestLeader.group;
                this.bb.targetPosition = closestLeader.owner.sprite.position;
                this.control.finishWithSuccess();
            }else {
                this.control.finishWithFailure();
            }
        }else {
            this.control.finishWithFailure();
        }
    }

    end():void {
        super.end();
    }

}

export = FindNearestGroup;