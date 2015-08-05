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

        if(this.bb.target.toBeDestroyed){
            this.control.finishWithFailure();
            return;
        }

        var myGroup:Group = (<Peasant>this.bb.me).getBannerMan().group;
        var myStrength = myGroup.getNumUnits();

        if(this.bb.target.type === 'building'){
            var building = (<Building>this.bb.target); //Get the building.
            var retaliation = building.currRetaliationStrength; //Get the retaliation strength
            building.currRetaliationStrength -= myStrength; //Subtract the attack damage of the group from the building's retaliation strength.
            if(building.currRetaliationStrength <= 0) //If it's 0 or less, destroy the building.
                building.destroy();

            myGroup.killAmount(retaliation);    //Hurt the group...
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

                //If my group's target is the other group's leader and their target is not my leader (I am targeting them but them not me?), bonus damage for me!
                if(myGroup.getLeader().blackBoard.target === enemyGroup.getLeader() && myGroup.getLeader() !== enemyGroup.getLeader().blackBoard.target){
                    myStrength*=1.5;
                    enemyStrength*=0.5;
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