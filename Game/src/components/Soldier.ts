///<reference path="../Game.ts"/>

import {Unit, Group} from "../unit/Unit";
import Keep from "../unit/Keep";
import Capitol from "../unit/Capitol";
import Peasant from "../unit/Peasant";
import BannerMan from "./BannerMan";

import Task from "../tasks/Task";
import Sequence from "../tasks/composite/Sequence";
import MoveTo from "../tasks/actions/MoveTo";
import FindNearestGroup from "../tasks/actions/FindNearestGroup";
import JoinGroup from "../tasks/actions/JoinGroup";

/**
 * Created by Paha on 7/29/2015.
 */
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
        var move:MoveTo = new MoveTo(this.owner.blackBoard);

        //Fail the move task if the group is full or destroyed.
        move.getControl().failCheck = () => {return this.owner.blackBoard.targetGroup.isFull() || this.owner.blackBoard.targetGroup.destroyed};

        seq.control.addTask(new FindNearestGroup(this.owner.blackBoard));
        seq.control.addTask(move);
        seq.control.addTask(new JoinGroup(this.owner.blackBoard));

        return seq;
    }

    destroy(){

    }
}

export default Soldier;