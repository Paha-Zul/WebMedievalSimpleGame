/// <reference path="./Game.ts"/>

class Building extends Unit {
    counter:number = 0;
    refillTime:number = 1000;

    constructor(x, y, game, colony) {
        super(x, y, game, colony, 30, 30);

        this.type = 'building';
        this.name = 'farm';
        this.resources = 1;
    }

    update = (delta) => {
        //If we have 0 resources, wait some time before refilling.
        if (this.resources === 0) {
            this.counter += delta; //Increment
            if (this.counter >= this.refillTime) {
                this.counter = 0; //Reset
                this.resources = 1; //Reset
            }
        }
    };
}
