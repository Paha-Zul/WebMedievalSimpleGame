/**
 * Created by Paha on 7/25/2015.
 */

///<reference path="../Task.ts"/>

class MoveTo extends LeafTask{
    constructor(bb:BlackBoard){
        super(bb);
    }

    start(){
        super.start();
    }

    update(delta){
        super.update(delta);

        //TODO Let's move this function back to the unit and call it from there so we can reuse code.

        var sprite:Phaser.Sprite = this.bb.me.sprite;
        var pos = this.bb.targetPosition;

        var disToTarget = sprite.position.distance(pos);
        var rotToTarget = sprite.position.angle(pos, false);

        //If we are still outside the stop range, move!
        if(disToTarget > this.bb.disToStop) {
            var x = Math.cos(rotToTarget) * this.bb.moveSpeed;
            var y = Math.sin(rotToTarget) * this.bb.moveSpeed;

            sprite.x += x;
            sprite.y += y;
            sprite.angle = rotToTarget*(180/Math.PI);
        }else{
            sprite.x = pos.x;
            sprite.y = pos.y;

            this.getControl().finishWithSuccess()
        }
    }
}