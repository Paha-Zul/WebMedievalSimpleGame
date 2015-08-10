///<reference path="../LeafTask.ts"/>
///<reference path="../../Game.ts"/>

import LeafTask from '../LeafTask' ;
import BlackBoard from '../BlackBoard';

/**
 * Created by Paha on 7/25/2015.
 */
class FollowPoint extends LeafTask{
    constructor(bb:BlackBoard) {
        super(bb);
    }

    start() {
        super.start();
    }

    update(delta) {
        super.update(delta);

        this.move(this.bb.targetPosition, this.bb.disToStop);
    }

    move(position:Phaser.Point, disToStop:number){
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

export default FollowPoint;