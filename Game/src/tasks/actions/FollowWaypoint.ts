///<reference path="../../Game.ts"/>

import LeafTask = require('../LeafTask');
import BlackBoard = require('../BlackBoard');

/**
 * Created by Paha on 7/25/2015.
 */
class FollowWaypoint extends LeafTask{
    counter:number = 0;
    timeCounter:number = 0;

    constructor(bb:BlackBoard){
        super(bb);
    }

    start() {
        super.start();
    }

    update(delta) {
        super.update(delta);
        //TODO Probably don't want to keep the timeCounter delay... just for testing.

        if(this.bb.me.walkTowardsPosition(this.bb.waypoints[this.counter], this.bb.disToStop, this.bb.moveSpeed*50)){
            this.timeCounter+=delta;
            if(this.timeCounter >= 1000) {
                this.timeCounter = 0;
                this.counter++;
                if (this.bb.waypoints.length <= this.counter) {
                    this.bb.waypoints = [];
                    this.getControl().finishWithSuccess();
                }
            }
        }
    }

    end() {
        return super.end();
    }
}

export = FollowWaypoint;