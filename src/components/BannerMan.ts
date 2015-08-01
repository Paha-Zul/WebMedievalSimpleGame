

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

    constructor(public owner:Peasant, public capitol:Capitol){

    }

    start():void{
        this.capitol.addGroup(this.owner);

        this.assignBehaviour();
    }

    update(delta:number):void {
        if(this.owner.behaviour === null)
            this.assignBehaviour();
    }

    assignBehaviour(){
        this.owner.control = 'manual';
        this.owner.blackBoard.disToStop = 1;
        var dis = 300;
        var rot = 0;
        var points = 20;

        //Make points in a circle
        for(var i=0;i<=points;i++){
            var x = Math.cos(rot*(Math.PI/180))*dis + this.owner.colony.sprite.x;
            var y = Math.sin(rot*(Math.PI/180))*dis + this.owner.colony.sprite.y;
            this.owner.blackBoard.waypoints.push(new Phaser.Point(x, y));
            rot += 360/points;
        }

        var seq:Sequence = new Sequence( this.owner.blackBoard);
        seq.control.addTask(new FollowWaypoint( this.owner.blackBoard));
        //seq.control.addTask(new Idle(this.owner.blackBoard));
        this.owner.blackBoard.idleTime = 10000000000;

        this.owner.behaviour = seq;
    }
}