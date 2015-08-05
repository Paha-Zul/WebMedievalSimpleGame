///<reference path="../../Game.ts"/>

/**
 * Created by Paha on 8/4/2015.
 */

class GetClosestDropoff extends LeafTask{

    constructor(bb:BlackBoard) {
        super(bb);
    }

    check():boolean {
        return super.check();
    }

    start():void {
        super.start();
    }

    update(delta):void {
        super.update(delta);

        var list:Unit[] = this.bb.me.capitol.dropoffList;
        var l = list.length;
        var closestDrop:Unit=null;
        var closestDis:number=0;
        var _dst;
        for(var i=0;i<l;i++){
            var unit = list[i];
            _dst = this.bb.me.sprite.position.distance(unit.sprite.position);
            if(_dst <= closestDis || closestDrop === null){
                closestDis = _dst;
                closestDrop = unit;
            }
        }

        this.bb.target = closestDrop;
        this.bb.targetPosition = closestDrop.sprite.position;
        if(this.bb.target !== null)
            this.control.finishWithSuccess();
        else
            this.control.finishWithFailure();
    }

    end():void {
        super.end();
    }
}