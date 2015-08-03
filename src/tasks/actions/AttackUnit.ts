///<reference path="../../Game.ts"/>

class AttackUnit extends LeafTask{

    constructor(bb:BlackBoard) {
        super(bb);
    }


    check():boolean {
        //Make sure our target is not null or destroyed already.
        return super.check() && this.bb.target != null && !this.bb.target.toBeDestroyed;
    }

    start():void {
        super.start();
    }

    update(delta):void {
        super.update(delta);

        var myGroup:Group = (<Peasant>this.bb.me).getBannerMan().group;

        if(this.bb.target.type === 'building'){
            this.bb.target.destroy();
            myGroup.killAmount(5);
        }else if(this.bb.target.type === 'peasant'){
            var enemyGroup:Group = null;
            if(this.bb.target.name === 'soldier'){
                enemyGroup = (<Peasant>this.bb.target).getSoldier().group;
            }else if(this.bb.target.name === 'leader'){
                enemyGroup = (<Peasant>this.bb.target).getBannerMan().group;
            }else if(this.bb.target.name === 'peasant'){
                myGroup.killAmount(1);
                this.bb.target.destroy();
            }

            //If the group we were trying to get is not null...
            if(enemyGroup !== null && !enemyGroup.destroyed){
                var enemyStrength = enemyGroup.getNumUnits();
                var myStrength = myGroup.getNumUnits();

                //If my group's target is the other group's leader and their target is not my leader (I am targeting them but them not me?), bonus damage for me!
                if(myGroup.getLeader().blackBoard.target === enemyGroup.getLeader() && myGroup.getLeader() !== enemyGroup.getLeader().blackBoard.target){
                    myStrength*=1.5;
                    enemyStrength*=0.75;
                    console.log('my bonus!');
                }

                enemyGroup.killAmount(myStrength);
                myGroup.killAmount(enemyStrength);
            }
        }

        this.bb.target = null;
        this.control.finishWithSuccess();
    }

    end():void {
        super.end();
    }
}