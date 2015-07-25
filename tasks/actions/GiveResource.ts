/**
 * Created by Paha on 7/25/2015.
 */

///<reference path="../../Game.ts"/>

class GiveResource extends LeafTask{

    constructor(bb:BlackBoard) {
        super(bb);
    }


    start() {
        super.start();
    }

    update(delta) {
        super.update(delta);

        this.bb.target.resources += this.bb.me.resources;
        this.bb.me.resources = 0;
        this.getControl().finishWithSuccess();
    }
}