///<reference path="../../Game.ts"/>

import LeafTask = require('LeafTask');
import BlackBoard = require('BlackBoard');

/**
 * Created by Paha on 7/25/2015.
 */
class TakeResource extends LeafTask{

    constructor(bb:BlackBoard) {
        super(bb);
    }


    start() {
        super.start();
    }

    update(delta) {
        super.update(delta);

        this.bb.me.food += this.bb.target.food;
        this.bb.me.iron += this.bb.target.iron;
        this.bb.target.food = 0;
        this.bb.target.iron = 0;

        this.getControl().finishWithSuccess();
    }
}

export = TakeResource;