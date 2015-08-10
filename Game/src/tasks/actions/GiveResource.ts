///<reference path="../../Game.ts"/>

import LeafTask from '../LeafTask';
import BlackBoard from '../BlackBoard';

/**
 * Created by Paha on 7/25/2015.
 */
class GiveResource extends LeafTask{

    constructor(bb:BlackBoard) {
        super(bb);
    }


    start() {
        super.start();
    }

    update(delta) {
        super.update(delta);

        this.bb.target.food += this.bb.me.food;
        this.bb.target.iron += this.bb.me.iron;
        this.bb.me.food = 0;
        this.bb.me.iron = 0;
        this.getControl().finishWithSuccess();
    }
}

export default GiveResource;