/// <reference path="./../Game.ts"/>
///<reference path="Unit.ts"/>
import { Unit } from './Unit';
import TakeResource from '../tasks/actions/TakeResource';
import MoveTo from '../tasks/actions/MoveTo';
import GetColony from '../tasks/actions/GetColony';
import GetClosestDropoff from '../tasks/actions/GetClosestDropoff';
import GiveResource from '../tasks/actions/GiveResource';
import Sequence from '../tasks/composite/Sequence';
/**
 * An extension of the super prototype class.
 */
class Building extends Unit {
    constructor(x, y, warGame, playerName, sprite, width, height) {
        super(x, y, warGame, playerName, sprite, width || 30, height || 30);
        this.nextRetIncrease = 0;
        this.refillTime = 1000;
        this.worker = null;
        this.maxRetaliationStrength = 5;
        this.currRetaliationStrength = 5;
        this.retaliationStrengthRate = 1;
        this.retaliationStrengthTime = 1000;
        this.deliverToColony = (bb) => {
            bb.target = this;
            bb.targetPosition = this.sprite.position;
            var seq = new Sequence(bb);
            var takeResource = new TakeResource(bb);
            seq.control.addTask(new MoveTo(bb));
            seq.control.addTask(takeResource);
            seq.control.addTask(new GetColony(bb));
            seq.control.addTask(new MoveTo(bb));
            seq.control.addTask(new GiveResource(bb));
            takeResource.getControl().finishCallback = () => this.requestedPickup = false;
            return seq;
        };
        this.deliverToDropoff = (bb) => {
            bb.target = this;
            bb.targetPosition = this.sprite.position;
            var seq = new Sequence(bb);
            var takeResource = new TakeResource(bb);
            seq.control.addTask(new MoveTo(bb));
            seq.control.addTask(takeResource);
            seq.control.addTask(new GetClosestDropoff(bb));
            seq.control.addTask(new MoveTo(bb));
            seq.control.addTask(new GiveResource(bb));
            takeResource.getControl().finishCallback = () => this.requestedPickup = false;
            return seq;
        };
        this.type = 'building';
        this.name = 'farm';
        this.food = 0;
        this.iron = 0;
        this.blackBoard.moveSpeed = 0;
        this.sprite.angle = 0;
    }
    start() {
        super.start();
    }
    update(delta) {
        super.update(delta);
        if (this.currRetaliationStrength < this.maxRetaliationStrength && this.warGame.game.time.now >= this.nextRetIncrease) {
            this.currRetaliationStrength += this.retaliationStrengthRate;
            if (this.currRetaliationStrength >= this.maxRetaliationStrength)
                this.currRetaliationStrength = this.maxRetaliationStrength;
            this.nextRetIncrease = this.warGame.game.time.now + this.retaliationStrengthTime;
        }
    }
}
export default Building;
//# sourceMappingURL=Building.js.map