/// <reference path="../../Game.ts"/>

import LeafTask = require('LeafTask');
import BlackBoard = require('BlackBoard');

/**
 * Created by Paha on 7/25/2015.
 */
class GetRandomBuilding extends LeafTask{

    constructor(bb:BlackBoard) {
        super(bb);
    }

    start() {
        super.start();
    }

    update(delta) {
        super.update(delta);

        this.bb.target = this.bb.me.capitol.buildingList[~~(Math.random()*this.bb.me.capitol.buildingList.length)]
        this.bb.targetPosition = this.bb.target.sprite.position;
        this.getControl().finishWithSuccess()
    }

}

export = GetRandomBuilding;