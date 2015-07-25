/**
 * Created by Paha on 7/25/2015.
 */

///<reference path="../../Game.ts"/>

class TakeResource extends LeafTask{

    constructor(bb:BlackBoard) {
        super(bb);
    }


    start() {
        super.start();
    }

    update(delta) {
        super.update(delta);

        if(this.bb.target.resources >= 0){
            this.bb.me.resources += this.bb.target.resources;
            this.bb.target.resources = 0;
        }

        this.getControl().finishWithSuccess();
    }
}