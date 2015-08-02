/**
 * Created by Paha on 7/29/2015.
 */

///<reference path="../Game.ts"/>

class Soldier implements IUpdateable{
    group:Group = null;
    leader:BannerMan = null;
    capitol:Capitol = null;

    constructor(public owner:Peasant){
        this.capitol = owner.capitol;
    }

    start():void{
        this.leader = this.getClosestLeader();
        if(this.leader !== null) this.group = this.leader.group.addUnit(this.owner);
    }

    update(delta:number):void {
        if(this.leader === null){
            this.leader = this.getClosestLeader();
            if(this.leader !== null) this.group = this.leader.group.addUnit(this.owner);
        }
    }

    getClosestLeader():BannerMan{
        var list = this.capitol.getGroupList();
        if(list.length > 0) {
            var l = list.length;
            var closestDist = 99999999999999999;
            var closestLeader:BannerMan = null;
            for(var i=0;i<l;i++){
                //If the group is null or the leader is null or the leader is destroyed... continue.
                if(list[i] == null || list[i].getLeader() === null || list[i].getLeader().toBeDestroyed) continue;

                var _dis = list[i].getLeader().sprite.position.distance(this.owner.sprite.position);
                if(_dis <= closestDist){
                    closestLeader = list[i].getLeader().getBannerMan();
                    closestDist = _dis;
                }
            }
            //Return the closest.
            return closestLeader;
        }

        //list was empty, null.
        return null;
    }
}