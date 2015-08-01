/**
 * Created by Paha on 7/27/2015.
 */

///<reference path='../Game.ts'/>

class Mine extends Building{

    constructor(x:number, y:number, game:Phaser.Game, colony:Capitol, sprite:Phaser.Sprite, width:number, height:number) {
        super(x, y, game, colony, sprite, width, height);
    }


    start():void {
        super.start();

        this.refillTime = 2000;
        this.name = 'mine';
        this.sprite.loadTexture('mine');
        this.width = this.sprite.width;
        this.height = this.sprite.height;
    }

    update(delta):void {
        super.update(delta);

        //If we have 0 iron, wait some time before refilling.
        if (this.iron === 0) {
            this.counter += delta; //Increment
            if (this.counter >= this.refillTime) {
                this.counter = 0; //Reset
                this.iron = 1; //Reset

                //We add a new task to the colony queue.
                this.colony.addTaskToQueue(this.getResourceTask);
            }
        }
    }
}