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
            var group:Group = null;
            if(this.bb.target.name === 'soldier'){
                group = (<Peasant>this.bb.target).getSoldier().group;
            }else if(this.bb.target.name === 'leader'){
                group = (<Peasant>this.bb.target).getBannerMan().group;
            }else if(this.bb.target.name === 'peasant'){
                myGroup.killAmount(1);
                this.bb.target.destroy();
            }

            //If the group we were trying to get is not null...
            if(group !== null){
                var enemyStrength = group.getNumUnits();
                var myStrength = myGroup.getNumUnits();

                //If the enemy is stronger, hurt them and kill me.
                if(enemyStrength > myStrength) {
                    group.killAmount(myStrength);
                    myGroup.destroy();

                //Otherwise, hurt me and kill them.
                }else{
                    myGroup.killAmount(enemyStrength);
                    group.destroy();
                }
            }
        }

        this.control.finishWithSuccess();
    }

    end():void {
        super.end();
    }
}