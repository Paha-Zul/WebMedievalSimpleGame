/**
 * Created by Paha on 7/29/2015.
 */

///<reference path="../Game.ts"/>

class Soldier implements IUpdateable{
    group:Group = null;
    leader:BannerMan = null;
    capitol:Capitol = null;
    positionIndex:number = 0;

    constructor(public owner:Peasant){
        this.capitol = owner.capitol;
    }

    start():void{
        this.owner.name = 'soldier';
    }

    update(delta:number):void {
        if(this.group !== null && this.owner.behaviour === null) {
            //this.owner.blackBoard.target = this.leader.owner;
            //this.owner.blackBoard.targetPosition = this.group.positions[this.positionIndex];
            //this.owner.blackBoard.disToStop = 2;
            //this.owner.behaviour = new FollowPointRelativeToTarget(this.owner.blackBoard);
        }if(this.owner.behaviour === null){
            this.owner.behaviour = this.getInGroup();
        }
    }

    getInGroup():Task{
        this.owner.blackBoard.disToStop = 200;

        var seq:Sequence = new Sequence(this.owner.blackBoard);
        seq.control.addTask(new FindNearestGroup(this.owner.blackBoard));
        seq.control.addTask(new MoveTo(this.owner.blackBoard));
        seq.control.addTask(new JoinGroup(this.owner.blackBoard));

        return seq;
    }
}