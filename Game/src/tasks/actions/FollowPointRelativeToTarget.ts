///<reference path="../LeafTask.ts"/>
///<reference path="../../Game.ts"/>

import LeafTask from '../LeafTask';
import BlackBoard from '../BlackBoard';

/**
 * Created by Paha on 7/25/2015.
 */
class FollowPointRelativeToTarget extends LeafTask{

    constructor(bb:BlackBoard) {
        super(bb);
    }

    update(delta) {
        super.update(delta);

        var pos = this.bb.targetPosition;
        var target = this.bb.target;
        var rot = this.bb.target.sprite.angle*(Math.PI/180);

        var x = Math.cos(rot)*pos.x - Math.sin(rot)*pos.y;
        var y = Math.sin(rot)*pos.x + Math.cos(rot)*pos.y;

        x += target.sprite.x;
        y += target.sprite.y;

        this.move(new Phaser.Point(x, y), this.bb.disToStop);
    }


    start() {
        super.start();
    }

    end() {
        return super.end();
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
            sprite.angle = this.bb.target.sprite.angle;

            return false;
        }else{
            sprite.x = pos.x;
            sprite.y = pos.y;

            return true;
        }
    }
}

export default FollowPointRelativeToTarget;