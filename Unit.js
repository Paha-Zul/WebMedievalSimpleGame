/**
 * Created by Paha on 7/23/2015.
 */

function newUnit(game, colony, x, y){
    var unit = {
        game: game,
        colony: colony,
        name: 'peasant',
        type: 'unit',
        control: 'auto',
        active: true,
        behaviour: null,
        sprite: makeSquareSprite(10, 10),
        idleCounter: 0,
        walkCounter: 0,
        resources: 0,
        positions: [],
        posCounter: 0,
        flag: false,
        target: null,
        targetPos: null,
        leader: null,
        randIdle: Math.random() * 2000,
        randWalk: Math.random() * 2000,
        randRotation: Math.random() * 360,
        moveSpeed: 2,

        update: function(delta){
            this.wander(delta);
        },

        wander: function(delta) {
            if(this.control === 'manual')
                return;

            if(this.leader !== null)
                this.behaviour = followLeader;
            else if (this.colony.buildingList.length != 0 && this.behaviour === null)
                this.behaviour = transfer;

            //Calculate the distance to the target if we have one.
            var disToTarget;
            if(this.target !== null)
                disToTarget = this.sprite.position.distance(this.target.sprite.position);

            if(this.leader === null) {
                //Execute the non US behaviour if it's not null.
                if (this.behaviour !== null)
                    this.behaviour(this, disToTarget, 5);
            }else if(this.leader !== null){
                if (this.behaviour !== null) {
                    this.behaviour(this);
                }
            }

            //If the target is null, just move around aimlessly
            if(this.target === null && this.leader === null) {


                //If we are done idling
                if (this.idleCounter >= this.randIdle) {
                    //If we are done walking
                    if (this.walkCounter >= this.randWalk) {
                        //Reset values
                        this.walkCounter -= this.randWalk;
                        this.idleCounter -= this.randIdle;
                        this.randRotation = Math.random() * 360;
                        this.randIdle = Math.random() * 800;
                        this.randWalk = Math.random() * 300;
                        //We are still walking
                    } else {
                        this.walkCounter += delta;
                        this.walkTowardsRotation(this.randRotation);
                    }
                    //Not done idling, increment counter
                } else {
                    this.idleCounter += delta;
                }
            //If we have a target, move towards it.
            }else if(this.target !== null){
                var rotation = this.sprite.position.angle(this.target.sprite.position, true);
                this.walkTowardsPosition(this.target.sprite.position, 1, disToTarget);

            //If we have a target position, move towards it!
            }else if(this.targetPos !== null){
                this.walkTowardsPosition(this.targetPos, 1, disToTarget);
            }
        },

        //Walks in a direction.
        walkTowardsRotation: function(rotation, disToStop){
            //Get X and Y moving values.
            var x = Math.cos(rotation) * this.moveSpeed;
            var y = Math.sin(rotation) * this.moveSpeed;

            this.sprite.x += x;
            this.sprite.y += y;

            this.sprite.angle = rotation;
        },

        //Walks towards a position stopping when it gets within the disToStop range.
        walkTowardsPosition: function(position, disToStop, disToTarget, rotToTarget){
            if(disToTarget === undefined) //Set the disToTarget if it wasn't passed
                disToTarget = this.sprite.position.distance(position);
            if(rotToTarget === undefined) //Set the rotToTarget if it wasn't passed.
                rotToTarget = this.sprite.position.angle(position, false);

            //If we are still outside the stop range, move!
            if(disToTarget > disToStop) {
                var x = Math.cos(rotToTarget) * this.moveSpeed;
                var y = Math.sin(rotToTarget) * this.moveSpeed;

                this.sprite.x += x;
                this.sprite.y += y;
                this.sprite.angle = rotToTarget*(180/Math.PI);
                //console.log('angle/rot: '+this.sprite.angle);
            }else{
                this.sprite.x = position.x;
                this.sprite.y = position.y;
            }
        }
    };

    unit.sprite.x = x;
    unit.sprite.y = y;

    return unit;
}

