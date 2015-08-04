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

        if(this.bb.targetPosition === undefined || this.bb.targetPosition === null)
            return;

        if(this.bb.me.walkTowardsPosition(this.bb.targetPosition, this.bb.disToStop, this.bb.moveSpeed))
            this.control.finishWithSuccess();

    }
}