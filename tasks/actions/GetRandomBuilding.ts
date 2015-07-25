/**
 * Created by Paha on 7/25/2015.
 */

/// <reference path="../../Game.ts"/>

class GetRandomBuilding extends LeafTask{

    constructor(bb:BlackBoard) {
        super(bb);
    }

    start() {
        super.start();
    }

    update(delta) {
        super.update(delta);

        this.bb.target = this.bb.me.colony.buildingList[~~(Math.random()*this.bb.me.colony.buildingList.length)]
        this.bb.targetPosition = this.bb.target.sprite.position;
        this.getControl().finishWithSuccess()
    }

}