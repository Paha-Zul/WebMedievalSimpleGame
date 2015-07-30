/**
 * Created by Paha on 7/29/2015.
 */

///<reference path="../Game.ts"/>

class Soldier implements IUpdateable{
    group:Group = null;
    leader:BannerMan = null;

    constructor(public owner:Peasant, public capitol:Capitol){

    }

    start():void{
        var list = this.capitol.getGroupList();
        if(list.length > 0) {
            this.group = list[0].addUnit(this.owner);
            this.leader = this.group.getLeader().getBannerMan();
        }
    }

    update(delta:number):void {
        if(this.group === null){
            var list = this.capitol.getGroupList();
            if(list.length > 0) {
                this.group = list[0].addUnit(this.owner);
                this.leader = this.group.getLeader().getBannerMan();
            }
        }
    }
}