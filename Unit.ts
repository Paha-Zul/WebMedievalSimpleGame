/// <reference path="./Game.ts"/>
/// <reference path="./tasks/Task.ts"/>
/// <reference path="./tasks/BlackBoard.ts"/>

/**
 * Created by Paha on 7/23/2015.
 */
class Unit{
    name : string = 'peasant';
    type : string = 'humanoid';
    control : string = 'auto';
    active : boolean = true;
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

        var style = { font: "18px Arial", fill: "#1765D1", align: "center" };
        this.text = game.add.text(x, y-this.height-5, '', style);
    }

    public update(delta : number) {
        this.text.text = ''+this.resources;
        this.text.position.set(this.sprite.x, this.sprite.y-this.height-20);

        if(this.type !== 'humanoid')
            return;

        //If we have a behaviour, execute it.
        if(this.behaviour !== null){
            this.behaviour.update(delta);
            if(this.behaviour.finished){
                if(this.behaviour.nextTask === null)
                    this.behaviour = null;
                else this.behaviour = this.behaviour.nextTask;
            }
        }else{
            if(this.colony !== null && this.colony.buildingList.length > 0){

                //TODO This is really freaking ugly code. Find a better way to do this!
                this.behaviour = new GetRandomBuilding(this.blackBoard);
                this.behaviour.nextTask = new MoveTo(this.blackBoard);
                this.behaviour.nextTask.nextTask = new TakeResource(this.blackBoard);
                this.behaviour.nextTask.nextTask.nextTask = new GetColony(this.blackBoard);
                this.behaviour.nextTask.nextTask.nextTask.nextTask = new MoveTo(this.blackBoard);
                this.behaviour.nextTask.nextTask.nextTask.nextTask.nextTask = new GiveResource(this.blackBoard);
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
        this.text.destroy(true);
        this.leader = null;
        this.behaviour = null;
    }
}

