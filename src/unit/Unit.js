/// <reference path="./../Game.ts"/>
/**
 * Created by Paha on 7/23/2015.
 *
 * A prototyping class. Needs to be cleaned up later but such you know?
 */
var Unit = (function () {
    function Unit(x, y, game, colony, sprite, width, height) {
        var _this = this;
        this.game = game;
        this.colony = colony;
        this.sprite = sprite;
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
        this.food = 0;
        this.iron = 0;
        this.posCounter = 0;
        this.flag = false;
        //Walks in a direction.
        this.walkTowardsRotation = function (rotation, moveSpeed, disToStop) {
            //Get X and Y moving values.
            var x = Math.cos(rotation) * moveSpeed;
            var y = Math.sin(rotation) * moveSpeed;
            _this.sprite.x += x;
            _this.sprite.y += y;
            _this.sprite.angle = rotation;
        };
        this.width = width || 10;
        this.height = height || 10;
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.anchor.setTo(0.5, 0.5);
        this.blackBoard = new BlackBoard();
        this.blackBoard.me = this;
        this.blackBoard.game = game;
    }
    Unit.prototype.start = function () {
        this.started = true;
        if (this.name !== 'house' && this.name !== 'soldier' && this.name !== 'barracks') {
            var style = { font: "18px Arial", fill: "#1765D1", align: "center" };
            this.text = game.add.text(this.sprite.x, this.sprite.y - this.height / 2 - 20, 'fixme', style);
        }
    };
    Unit.prototype.update = function (delta) {
        if (!this.started)
            this.start();
        if (this.text !== undefined && this.text !== null) {
            if (this.name === 'capitol') {
                this.text.text = 'F: ' + this.food + " I: " + this.iron;
            }
            else if (this.name === 'mine') {
                this.text.text = 'I: ' + this.iron;
            }
            else if (this.name === 'peasant') {
                this.text.text = '' + (this.iron + this.food);
            }
            else {
                this.text.text = 'F: ' + this.food;
            }
            this.text.position.set(this.sprite.x - this.text.width / 2, this.sprite.y - this.height / 2 - 20);
        }
        //For prototyping, only let humanoids do this section.
        if (this.type === 'humanoid') {
            //this.behaviourStuff(delta);
            this.otherBehaviourStuff(delta);
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
            var beh = null;
            //Try and get a beh from the colony. This will be a function.
            if (this.name === 'peasant')
                var beh = this.colony.getTaskFromQueue();
            //If we actually got one, execute the function which will return a behaviour.
            if (beh !== null)
                this.behaviour = beh(this.blackBoard);
            else {
                this.behaviour = this.wander(this.blackBoard);
            }
        }
    };
    //Walks towards a position stopping when it gets within the disToStop range.
    Unit.prototype.walkTowardsPosition = function (position, disToStop, moveSpeed, disToTarget, rotToTarget) {
        if (disToTarget === undefined)
            disToTarget = this.sprite.position.distance(position);
        if (rotToTarget === undefined)
            rotToTarget = this.sprite.position.angle(position, false);
        //If we are still outside the stop range, move!
        if (disToTarget > disToStop) {
            var x = Math.cos(rotToTarget) * moveSpeed;
            var y = Math.sin(rotToTarget) * moveSpeed;
            this.sprite.body.velocity.set(x, y);
            //this.sprite.x += x;
            //this.sprite.y += y;
            this.sprite.angle = rotToTarget * (180 / Math.PI);
        }
        else {
            this.sprite.position.set(position.x, position.y);
            this.sprite.body.velocity.set(0, 0);
            return true;
        }
        return false;
    };
    Unit.prototype.destroy = function () {
        this.sprite.destroy(true);
        if (this.text !== undefined && this.text !== null)
            this.text.destroy(true);
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
var Group = (function () {
    function Group(leader) {
        this.leader = null;
        this.posCounter = 0;
        this.spacing = 15;
        this.lines = 3;
        this.unitsPerLine = 15;
        this.leader = leader;
        this.positions = [];
        this.unitList = [];
    }
    Group.prototype.addUnit = function (unit) {
        this.unitList.push(unit);
        this.reformGroup();
        return this;
    };
    Group.prototype.removeUnit = function (unit) {
        for (var i = 0; i < this.unitList.length; i++) {
            if (this.unitList[i] === unit) {
                this.unitList.splice(i, 1);
                break;
            }
        }
        this.reformGroup();
        return this;
    };
    Group.prototype.getLeader = function () {
        return this.leader;
    };
    Group.prototype.getNumUnits = function () {
        return this.unitList.length;
    };
    Group.prototype.reformGroup = function () {
        //TODO Kinda performance heavy to do for every addition/subtraction. Maybe have a timer to wait
        //TODO since an add/remove?
        //TODO Maybe not... got up to 700 units before getting under 50 frames and that's probably due to rendering.
        this.posCounter = 0;
        this.lines = ~~(this.unitList.length / this.unitsPerLine) + 1;
        this.positions = [];
        var num = this.unitList.length;
        var spacing = 15; //Spacing between spaces
        for (var i = 0; i < num; i++) {
            var index = ~~(i / ~~(num / this.lines));
            var div = ~~(num / this.lines);
            var x = -(index + 1) * spacing;
            var y = i % div * spacing - div / 2 * spacing;
            var point = new Phaser.Point(x, y);
            this.positions.push(point);
            this.unitList[i].getSoldier().leader = this.leader.getBannerMan();
            this.unitList[i].blackBoard.target = this.leader;
            this.unitList[i].blackBoard.targetPosition = point;
            this.unitList[i].behaviour = new FollowPointRelativeToTarget(this.unitList[i].blackBoard);
        }
    };
    return Group;
})();
//# sourceMappingURL=Unit.js.map