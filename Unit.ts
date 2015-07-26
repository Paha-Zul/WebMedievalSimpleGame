/// <reference path="./Game.ts"/>
/// <reference path="./tasks/Task.ts"/>
/// <reference path="./tasks/BlackBoard.ts"/>

/**
 * Created by Paha on 7/23/2015.
 *
 * A prototyping class. Needs to be cleaned up later but such you know?
 */
class Unit{
    name : string = 'peasant';
    type : string = 'humanoid';
    control : string = 'auto';
    active : boolean = true;
    started : boolean = false;
    behaviour : Task = null;
    sprite : Phaser.Sprite;
    idleCounter : number = 0;
    walkCounter : number = 0;
    resources : number = 0;
    posCounter : number = 0;
    positions : Phaser.Point[] = [];
    flag : boolean = false;
    target : any = null;
    targetPos : Phaser.Point = null;
    leader : any = null;
    randIdle: number =  Math.random() * 2000;
    randWalk : number = Math.random() * 2000;
    randRotation : number = Math.random() * 360;
    moveSpeed : number = 2;
    text:Phaser.Text;
    blackBoard:BlackBoard;

    constructor(x:number, y:number, public game : Phaser.Game, public colony:Colony, public width?, public height?){
        this.width = width || 10;
        this.height = height || 10;
        this.sprite = makeSquareSprite(this.width, this.height);
        this.sprite.x = x;
        this.sprite.y = y;
        this.blackBoard = new BlackBoard();
        this.blackBoard.me = this;
        this.blackBoard.game = game;
    }

    public update(delta : number) {
        if(!this.started) this.start();

        if(this.text !== undefined && this.text !== null) {
            this.text.text = '' + this.resources;
            this.text.position.set(this.sprite.x, this.sprite.y - this.height/2 - 20);
        }

        //For prototyping, only let humanoids do this section.
        if(this.type === 'humanoid') {
            //this.behaviourStuff(delta);
            this.otherBehaviourStuff(delta);
        }
    }

    start():void{
        this.started = true;

        if(this.name === 'house')
            this.sprite.loadTexture('house');
        else if(this.name === 'farm')
            this.sprite.loadTexture('farm');
        else if(this.name === 'colony')
            this.sprite.loadTexture('capitol');

        if(this.name !== 'house'){
            var style = { font: "18px Arial", fill: "#1765D1", align: "center" };
            this.text = game.add.text(this.sprite.x, this.sprite.y - this.height/2 - 20, '', style);
        }
    }

    behaviourStuff(delta){
        //If we have a behaviour, execute it.
        if(this.behaviour !== null){
            this.behaviour.update(delta);
            if(this.behaviour.getControl().finished){
                this.behaviour = null;
            }
        }else{
            if(this.colony !== null && this.colony.buildingList.length > 0){

                var seq:Sequence = new Sequence(this.blackBoard);
                seq.control.addTask(new GetRandomBuilding(this.blackBoard));
                seq.control.addTask(new MoveTo(this.blackBoard));
                seq.control.addTask(new TakeResource(this.blackBoard));
                seq.control.addTask(new GetColony(this.blackBoard));
                seq.control.addTask(new MoveTo(this.blackBoard));
                seq.control.addTask(new GiveResource(this.blackBoard));

                this.behaviour = seq;
                this.behaviour.start();
            }
        }
    }

    otherBehaviourStuff(delta){
        //If we have a behaviour, execute it.
        if(this.behaviour !== null){
            if(!this.behaviour.getControl().started) this.behaviour.getControl().safeStart();
            this.behaviour.update(delta);
            if(this.behaviour.getControl().finished){
                this.behaviour = null;
            }
        }else{
            //Try and get a beh from the colony. This will be a function.
            var beh:any = this.colony.getTaskFromQueue();
            //If we actually got one, execute the function which will return a behaviour.
            if(beh !== null)
                this.behaviour = beh(this.blackBoard);
            else{
                this.behaviour = this.wander(this.blackBoard);
            }
        }
    }

    //Walks in a direction.
    walkTowardsRotation = (rotation, disToStop?) =>{
        //Get X and Y moving values.
        var x = Math.cos(rotation) * this.moveSpeed;
        var y = Math.sin(rotation) * this.moveSpeed;

        this.sprite.x += x;
        this.sprite.y += y;

        this.sprite.angle = rotation;
    };

    //Walks towards a position stopping when it gets within the disToStop range.
    walkTowardsPosition = (position, disToStop, disToTarget?, rotToTarget?) =>{
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
        }else{
            this.sprite.x = position.x;
            this.sprite.y = position.y;
        }
    };

    destroy(){
        this.sprite.destroy(true);
        if(this.text !== undefined && this.text !== null) this.text.destroy(true);
        this.leader = null;
        this.behaviour = null;
    }

    wander(bb:BlackBoard):Task{
        var seq:Sequence = new Sequence(bb);
        seq.control.addTask(new RandomLocation(bb));
        seq.control.addTask(new MoveTo(bb));
        seq.control.addTask(new Idle(bb));

        return seq;
    }
}

