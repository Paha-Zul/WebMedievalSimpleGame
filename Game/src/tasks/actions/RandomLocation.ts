///<reference path="../../Game.ts"/>

import LeafTask from '../LeafTask';
import BlackBoard from '../BlackBoard';

/**
 * Created by Paha on 7/25/2015.
 */
class RandomLocation extends LeafTask{

    constructor(bb:BlackBoard) {
        super(bb);
    }


    start() {
        super.start();
    }

    update(delta) {
        super.update(delta);

        var x = Math.random()*100 - 50;
        var y = Math.random()*100 - 50;

        this.bb.targetPosition = new Phaser.Point(this.bb.me.sprite.x + x, this.bb.me.sprite.y + y);
        this.control.finishWithSuccess();
    }

    end() {
        super.end();
    }
}

export default RandomLocation;