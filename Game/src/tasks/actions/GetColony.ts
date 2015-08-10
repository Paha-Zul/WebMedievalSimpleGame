///<reference path="../../Game.ts"/>

import LeafTask from '../LeafTask';
import BlackBoard from '../BlackBoard';

/**
 * Created by Paha on 7/25/2015.
 */
class GetColony extends LeafTask{

    constructor(bb:BlackBoard) {
        super(bb);
    }

    start() {
        super.start();
    }

    update(delta) {
        super.update(delta);

        this.bb.target = this.bb.me.capitol;
        this.bb.targetPosition = this.bb.target.sprite.position;
        this.getControl().finishWithSuccess();
    }
}

export default GetColony;