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

        if(this.bb.me.walkTowardsPosition(this.bb.targetPosition, this.bb.disToStop, this.bb.moveSpeed*50))
            this.control.finishWithSuccess();

    }
}