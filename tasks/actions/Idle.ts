/**
 * Created by Paha on 7/25/2015.
 */

///<reference path="../../Game.ts"/>

class Idle extends LeafTask{
    timer:Phaser.TimerEvent;

    constructor(bb:BlackBoard) {
        super(bb);
    }

    start() {
        super.start();

        this.timer = this.bb.game.time.events.loop(this.bb.idleTime, this.finishTask, this);
    }

    update(delta) {
        super.update(delta);
    }

    finish(failed:boolean) {
        super.finish(failed);
    }

    finishTask(){
        this.finish(false);
    }
}