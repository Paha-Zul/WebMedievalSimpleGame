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
    flag:Phaser.Sprite;
    nextRemoveTime:number = -1;
    isRetreating:boolean = false;

    constructor(public owner:Peasant){
        this.capitol = owner.capitol;
    }

    start():void{
        this.capitol.addGroup(this.owner);
        this.sizeToAttack = this.group.maxGroupSize/4;

        this.owner.blackBoard.moveSpeed = 1;
        this.flag = this.owner.warGame.flagGroup.getFirstDead();
        if(this.flag === undefined || this.flag === null)
            this.flag = this.owner.warGame.flagGroup.create(this.owner.x, this.owner.y, 'flag');
        else
            this.flag.reset(0,0);

        //Let's tint the color to our team shall we?
        var color:string = this.owner.player.color;
        color = '0x'+color.substring(1) ; //We gotta convert from string to number. So chop off the '#' and add '0x'
        this.flag.tint = parseInt(color); //Parse the number!
        this.owner.text.tint = 0x000000; //Set the tint of the text to black!
    }

    update(delta:number):void {
        if(this.keep === null) return;

        //If we have too little numbers and we are still attacking, null the behaviour so we can retreat.
        if(this.group.getNumUnits() < this.sizeToAttack && this.owner.behaviour !== null && this.owner.behaviour.name === 'attack')
            this.owner.behaviour.getControl().finishWithFailure();

        //Wait for troops
        if(this.owner.behaviour === null && this.group.getNumUnits() < this.sizeToAttack) {
            this.owner.behaviour = this.retreat();
        }

        //If we have enough people to attack and we're patrolling, issue an attack order!
        if(this.group.getNumUnits() >= this.sizeToAttack && this.owner.behaviour === null){
            this.attackTarget();
        }

        //Scale the speed based on the size of the group!
        var speed = 20/this.group.getNumUnits();
        speed = speed <= 1 ? speed : 1;
        this.owner.blackBoard.moveSpeed = 1.5*speed;

        //Add a bonus to the idle time (which is used for repicking targets) for larger groups.
        this.owner.blackBoard.idleTime = 3000 + this.group.getNumUnits()*75;

        //Set the position for the flag!
        var x = this.owner.sprite.x - this.flag.width, y = this.owner.sprite.y - this.flag.height;
        this.flag.position.set(x, y);

        //Set the text value.
        this.owner.text.text = ''+this.group.getNumUnits()+'/'+this.group.maxGroupSize;
        this.owner.text.position.setTo(x + this.flag.width/2 - this.owner.text.width/2, y + this.flag.height/2 - this.owner.text.height/1.5);

        this.removeExtraUnits();
    }

    removeExtraUnits(){
        //If we are over the limit and we haven't started the time limit, start it!
        if(this.group.getNumUnits() > this.group.maxGroupSize && this.nextRemoveTime === -1){
            this.nextRemoveTime = this.owner.warGame.game.time.now + 5000; //Remove in 5 seconds!.

        //Otherwise if we are counting...
        }else if(this.nextRemoveTime !== -1){
            //If at some point the group size goes under the max (lots of units die...), cancel it.
            if(this.group.maxGroupSize <= this.group.maxGroupSize) {
                this.nextRemoveTime = -1;

            //If the time limit is met and it is still valid, remove the max size - the group size.
            }if(this.owner.warGame.game.time.now >= this.nextRemoveTime){
                this.group.removeAmount(-(this.group.maxGroupSize - this.group.getNumUnits()));
                this.nextRemoveTime = -1;
            }
        }
    }

    /**
     * Retreats back to the keep that this bannerman is assigned to.
     * @returns {Sequence} The retreating sequence.
     */
    retreat():Task{
        this.isRetreating = true;
        this.owner.blackBoard.targetPosition = new Phaser.Point(this.keep.sprite.x, this.keep.sprite.y + 100);

        var seq:Sequence = new Sequence(this.owner.blackBoard);
        var moveTo:MoveTo = new MoveTo(this.owner.blackBoard);

        seq.control.addTask(moveTo);
        seq.control.addTask(new WaitForGroupSize(this.owner.blackBoard));

        //When the moveTo completes, we are no longer retreating.
        moveTo.getControl().finishCallback = () => this.isRetreating = false;

        seq.name = 'retreat';
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

    destroy(){
        this.flag.destroy(true);
    }
}