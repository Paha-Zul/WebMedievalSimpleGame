/**
 * Created by Paha on 7/27/2015.
 */

///<reference path='../Game.ts'/>

class Farm extends Building{
    counter:number=0;
    requestedPickup:boolean = false;

    constructor(x:number, y:number, warGame:Game, playerName:string, sprite:Phaser.Sprite, width:number, height:number) {
        super(x, y, warGame, playerName, sprite, width, height);
    }

    start():void {
        super.start();

        this.refillTime = 2500;
        this.name = 'farm';
        this.sprite.loadTexture('farm');
        this.width = this.sprite.width;
        this.height = this.sprite.height;
    }

    update(delta):void {
        super.update(delta);

        //If we have 0 iron, wait some time before refilling.
        this.counter += delta; //Increment
        if (this.counter >= this.refillTime) {
            this.counter = 0; //Reset
            this.food += 1; //Reset

            //We add a new task to the colony queue.
            if(!this.requestedPickup) {
                this.requestedPickup = true;
                this.capitol.addTaskToQueue(this.deliverToDropoff);
            }
        }
    }
}