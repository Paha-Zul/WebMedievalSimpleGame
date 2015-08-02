

/// <reference path="./../Game.ts"/>

/**
 * Created by Paha on 7/29/2015.
 *
 * A Component type class that attaches to a Peasant. The 'BannerMan' class is the leader of
 * soldiers and forms a group for soldiers to follow. The BannerMan is responsible for handing out tasks
 * to the soldiers.
 */
class BannerMan implements IUpdateable{
    group:Group = null;
    capitol:Capitol = null;

    constructor(public owner:Peasant){
        this.capitol = owner.capitol;
    }

    start():void{
        this.capitol.addGroup(this.owner);

        this.moveInCircle();
    }

    update(delta:number):void {
        if(this.owner.behaviour === null) {
            this.moveInCircle();
        }

        if(this.group.getNumUnits() >= 20 && this.owner.behaviour.name === 'patrol'){
            this.owner.behaviour.getControl().safeEnd();
            this.attackTarget();
        }
    }

    moveInCircle(){
        this.owner.control = 'manual';
        this.owner.blackBoard.disToStop = 2;
        var dis = 300;
        var rot = 0;
        var points = 20;

        //Make points in a circle
        for(var i=0;i<=points;i++){
            var x = Math.cos(rot*(Math.PI/180))*dis + this.owner.capitol.sprite.x;
            var y = Math.sin(rot*(Math.PI/180))*dis + this.owner.capitol.sprite.y;
            this.owner.blackBoard.waypoints.push(new Phaser.Point(x, y));
            rot += 360/points;
        }

        var seq:Sequence = new Sequence( this.owner.blackBoard);
        seq.control.addTask(new FollowWaypoint( this.owner.blackBoard));
        //seq.control.addTask(new Idle(this.owner.blackBoard));
        this.owner.blackBoard.idleTime = 10000000000;

        seq.name = 'patrol';
        this.owner.behaviour = seq;
    }

    attackTarget(){
        var seq:Sequence = new Sequence(this.owner.blackBoard);

        seq.control.addTask(new FindNearestEnemyUnit(this.owner.blackBoard));
        seq.control.addTask(new MoveTo(this.owner.blackBoard));
        seq.control.addTask(new AttackUnit(this.owner.blackBoard));

        this.owner.behaviour = seq;
    }
}