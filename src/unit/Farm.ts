/**
 * Created by Paha on 7/27/2015.
 */

///<reference path='../Game.ts'/>

class Farm extends Building{
    constructor(x:number, y:number, game:Phaser.Game, colony:Capitol, sprite:Phaser.Sprite, width:number, height:number) {
        super(x, y, game, colony, sprite, width, height);
    }

    start():void {
        super.start();

        this.refillTime = 1000;
        this.name = 'farm';
        this.sprite.loadTexture('farm');
        this.width = this.sprite.width;
        this.height = this.sprite.height;
    }

    update(delta):void {
        super.update(delta);

        //If we have 0 iron, wait some time before refilling.
        if (this.food === 0) {
            this.counter += delta; //Increment
            if (this.counter >= this.refillTime) {
                this.counter = 0; //Reset
                this.food = 1; //Reset

                //We add a new task to the colony queue.
                this.colony.addTaskToQueue(this.getResourceTask);
            }
        }
    }
}