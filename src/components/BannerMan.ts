

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
    }

    update(delta:number):void {

    }
}