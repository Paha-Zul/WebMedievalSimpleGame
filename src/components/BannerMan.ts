

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
    sizeToAttack = 10;
    keep:Keep = null;

    constructor(public owner:Peasant){
        this.capitol = owner.capitol;
    }

    start():void{
        this.capitol.addGroup(this.owner);

        this.owner.blackBoard.moveSpeed = 1;
    }

    update(delta:number):void {
        if(this.keep === null) return;

        //If we have too little numbers and we are still attacking, null the behaviour so we can retreat.
        if(this.group.getNumUnits() < this.sizeToAttack && this.owner.behaviour !== null && this.owner.behaviour.name === 'attack')
            this.owner.behaviour = null;

        //Wait for troops
        if(this.owner.behaviour === null) {
            this.owner.behaviour = this.waitForTroops();
        }

        //If we have enough people to attack and we're patrolling, issue an attack order!
        if(this.group.getNumUnits() >= this.sizeToAttack && this.owner.behaviour.name === 'wait'){
            this.owner.behaviour.getControl().safeEnd();
            this.attackTarget();
        }

        //Scale the speed based on the size of the group!
        var speed = 20/this.group.getNumUnits();
        speed = speed <= 1 ? speed : 1;
        this.owner.blackBoard.moveSpeed = 1.5*speed;

        //Add a bonus to the idle time (which is used for repicking targets) for larger groups.
        this.owner.blackBoard.idleTime = 3000 + this.group.getNumUnits()*75;
    }

    waitForTroops():Task{
        this.owner.blackBoard.targetPosition = new Phaser.Point(this.keep.sprite.x, this.keep.sprite.y + 100);

        var seq:Sequence = new Sequence(this.owner.blackBoard);
        seq.control.addTask(new MoveTo(this.owner.blackBoard));
        seq.control.addTask(new WaitForGroupSize(this.owner.blackBoard));

        seq.name = 'wait';
        return seq;
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
        //  Sequence
        //      Parallel
        //          Repeat
        //              Sequence
        //                  find target
        //                  idle
        //          move to target
        //      AttackTarget

        this.owner.blackBoard.idleTime = 3000;

        var seq:Sequence = new Sequence(this.owner.blackBoard);

        //Parallel find target and move to it.
        var parallel:Parallel = new Parallel(this.owner.blackBoard);
        var repeat:Repeat = new Repeat(this.owner.blackBoard);
        var getTargetSeq:Sequence = new Sequence(this.owner.blackBoard);
        var findTarget:FindNearestEnemyUnit = new FindNearestEnemyUnit(this.owner.blackBoard);
        var idle:Idle = new Idle(this.owner.blackBoard);
        var moveTo:MoveTo = new MoveTo(this.owner.blackBoard);

        var attackTarget:AttackUnit = new AttackUnit(this.owner.blackBoard);

        seq.control.addTask(parallel);
        parallel.control.addTask(repeat);
        parallel.setTriggerTask(moveTo);
        repeat.setTask(getTargetSeq);
        getTargetSeq.control.addTask(findTarget);
        getTargetSeq.control.addTask(idle);
        parallel.control.addTask(moveTo);
        seq.control.addTask(attackTarget);

        seq.name = 'attack';
        this.owner.behaviour = seq;
    }
}