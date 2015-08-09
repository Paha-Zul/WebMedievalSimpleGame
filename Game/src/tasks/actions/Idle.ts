///<reference path="../../Game.ts"/>

import BlackBoard = require('../BlackBoard');
import LeafTask = require('../LeafTask');

/**
 * Created by Paha on 7/25/2015.
 */
class Idle extends LeafTask{
    timer:Phaser.TimerEvent;

    constructor(bb:BlackBoard) {
        super(bb);
    }

    start() {
        super.start();

        this.timer = this.bb.game.game.time.events.add(this.bb.idleTime, this.finish, this);
    }

    update(delta) {
        super.update(delta);
    }

    end():void {
        super.end();
    }

    finish(){
        this.control.finishWithSuccess();
    }
}

export = Idle;