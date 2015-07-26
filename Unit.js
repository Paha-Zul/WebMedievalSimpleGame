/// <reference path="./Game.ts"/>
/// <reference path="./tasks/Task.ts"/>
/// <reference path="./tasks/BlackBoard.ts"/>
/**
 * Created by Paha on 7/23/2015.
 *
 * A prototyping class. Needs to be cleaned up later but such you know?
 */
var Unit = (function () {
    function Unit(x, y, game, colony, width, height) {
        var _this = this;
        this.game = game;
        this.colony = colony;
        this.width = width;
        this.height = height;
        this.name = 'peasant';
        this.type = 'humanoid';
        this.control = 'auto';
        this.active = true;
        this.started = false;
        this.behaviour = null;
        this.idleCounter = 0;
        this.walkCounter = 0;
        this.resources = 0;
        this.posCounter = 0;
        this.positions = [];
        this.flag = false;
        this.target = null;
        this.targetPos = null;
        this.leader = null;
        this.randIdle = Math.random() * 2000;
        this.randWalk = Math.random() * 2000;
        this.randRotation = Math.random() * 360;
        this.moveSpeed = 2;
        //Walks in a direction.
        this.walkTowardsRotation = function (rotation, disToStop) {
            //Get X and Y moving values.
            var x = Math.cos(rotation) * _this.moveSpeed;
            var y = Math.sin(rotation) * _this.moveSpeed;
            _this.sprite.x += x;
            _this.sprite.y += y;
            _this.sprite.angle = rotation;
        };
        //Walks towards a position stopping when it gets within the disToStop range.
        this.walkTowardsPosition = function (position, disToStop, disToTarget, rotToTarget) {
            if (disToTarget === undefined)
                disToTarget = _this.sprite.position.distance(position);
            if (rotToTarget === undefined)
                rotToTarget = _this.sprite.position.angle(position, false);
            //If we are still outside the stop range, move!
            if (disToTarget > disToStop) {
                var x = Math.cos(rotToTarget) * _this.moveSpeed;
                var y = Math.sin(rotToTarget) * _this.moveSpeed;
                _this.sprite.x += x;
                _this.sprite.y += y;
                _this.sprite.angle = rotToTarget * (180 / Math.PI);
            }
            else {
                _this.sprite.x = position.x;
                _this.sprite.y = position.y;
            }
        };
        this.width = width || 10;
        this.height = height || 10;
        this.sprite = makeSquareSprite(this.width, this.height);
        this.sprite.x = x;
        this.sprite.y = y;
        this.blackBoard = new BlackBoard();
        this.blackBoard.me = this;
        this.blackBoard.game = game;
    }
    Unit.prototype.update = function (delta) {
        if (!this.started)
            this.start();
        if (this.text !== undefined && this.text !== null) {
            this.text.text = '' + this.resources;
            this.text.position.set(this.sprite.x, this.sprite.y - this.height / 2 - 20);
        }
        //For prototyping, only let humanoids do this section.
        if (this.type === 'humanoid') {
            //this.behaviourStuff(delta);
            this.otherBehaviourStuff(delta);
        }
    };
    Unit.prototype.start = function () {
        this.started = true;
        if (this.name === 'house')
            this.sprite.loadTexture('house');
        else if (this.name === 'farm')
            this.sprite.loadTexture('farm');
        else if (this.name === 'colony')
            this.sprite.loadTexture('capitol');
        if (this.name !== 'house') {
            var style = { font: "18px Arial", fill: "#1765D1", align: "center" };
            this.text = game.add.text(this.sprite.x, this.sprite.y - this.height / 2 - 20, '', style);
        }
    };
    Unit.prototype.behaviourStuff = function (delta) {
        //If we have a behaviour, execute it.
        if (this.behaviour !== null) {
            this.behaviour.update(delta);
            if (this.behaviour.getControl().finished) {
                this.behaviour = null;
            }
        }
        else {
            if (this.colony !== null && this.colony.buildingList.length > 0) {
                var seq = new Sequence(this.blackBoard);
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
    };
    Unit.prototype.otherBehaviourStuff = function (delta) {
        //If we have a behaviour, execute it.
        if (this.behaviour !== null) {
            if (!this.behaviour.getControl().started)
                this.behaviour.getControl().safeStart();
            this.behaviour.update(delta);
            if (this.behaviour.getControl().finished) {
                this.behaviour = null;
            }
        }
        else {
            //Try and get a beh from the colony. This will be a function.
            var beh = this.colony.getTaskFromQueue();
            //If we actually got one, execute the function which will return a behaviour.
            if (beh !== null)
                this.behaviour = beh(this.blackBoard);
            else {
                this.behaviour = this.wander(this.blackBoard);
            }
        }
    };
    Unit.prototype.destroy = function () {
        this.sprite.destroy(true);
        if (this.text !== undefined && this.text !== null)
            this.text.destroy(true);
        this.leader = null;
        this.behaviour = null;
    };
    Unit.prototype.wander = function (bb) {
        var seq = new Sequence(bb);
        seq.control.addTask(new RandomLocation(bb));
        seq.control.addTask(new MoveTo(bb));
        seq.control.addTask(new Idle(bb));
        return seq;
    };
    return Unit;
})();
//# sourceMappingURL=Unit.js.map