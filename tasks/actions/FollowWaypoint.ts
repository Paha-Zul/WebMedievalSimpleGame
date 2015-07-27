/**
 * Created by Paha on 7/25/2015.
 */

///<reference path="../../Game.ts"/>

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

        if(this.move(this.bb.waypoints[this.counter], this.bb.disToStop)){
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

    move(position:Phaser.Point, disToStop:number){
        //TODO Should move this to the unit call for more reusability.

        var sprite:Phaser.Sprite = this.bb.me.sprite;
        var pos = position;

        var disToTarget = sprite.position.distance(pos);
        var rotToTarget = sprite.position.angle(pos, false);

        //If we are still outside the stop range, move!
        if(disToTarget > disToStop) {
            var x = Math.cos(rotToTarget) * this.bb.moveSpeed;
            var y = Math.sin(rotToTarget) * this.bb.moveSpeed;

            sprite.x += x;
            sprite.y += y;
            sprite.angle = rotToTarget*(180/Math.PI);

            return false;
        }else{
            sprite.x = pos.x;
            sprite.y = pos.y;

            return true;
        }
    }
}