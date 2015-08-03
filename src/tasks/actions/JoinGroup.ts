///<reference path="../../Game.ts"/>

/**
 * Created by Paha on 8/3/2015.
 */

class JoinGroup extends LeafTask{

    constructor(bb:BlackBoard) {
        super(bb);
    }

    check():boolean {
        //Neither the group nor the leader can be null or destroyed.
        return super.check() && this.bb.targetGroup !== null && !this.bb.targetGroup.destroyed
            && this.bb.targetGroup.getLeader() !== null && !this.bb.targetGroup.getLeader().toBeDestroyed;
    }

    start():void {
        super.start();
    }

    update(delta):void {
        super.update(delta);

        var soldier:Soldier = (<Peasant>this.bb.me).getSoldier();
        soldier.group = this.bb.targetGroup.addUnit(soldier.owner);
        this.control.finishWithSuccess();
    }

    end():void {
        super.end();
    }
}