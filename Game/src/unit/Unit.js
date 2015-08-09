/// <reference path="./../Game.ts"/>
var Game = require('../Game');
var BlackBoard = require('../tasks/BlackBoard');
var Sequence = require('../tasks/composite/Sequence');
var Idle = require('../tasks/actions/Idle');
var MoveTo = require('../tasks/actions/MoveTo');
var RandomLocation = require('../tasks/actions/RandomLocation');
var FollowPointRelativeToTarget = require('../tasks/actions/FollowPointRelativeToTarget');
var PM = require('../util/PlayerManager');
var PlayerManager = PM.PlayerManager;
/**
 * Created by Paha on 7/23/2015.
 * A prototyping class. Needs to be cleaned up later but such you know?
 * We export the class because we have 2 classes in this file.
 */
var Unit = (function () {
    function Unit(x, y, warGame, playerName, sprite, width, height) {
        var _this = this;
        this.x = x;
        this.y = y;
        this.warGame = warGame;
        this.playerName = playerName;
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
        this.toBeDestroyed = false;
        this.player = null;
        this.id = 0;
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
        this.blackBoard.myPlayer = this.player = PlayerManager.getPlayer(this.playerName);
        this.blackBoard.game = warGame;
        this.capitol = this.blackBoard.myPlayer.capitol;
        //Create ID and add it to the map (maps can only use strings?)
        this.id = ~~(Math.random() * Number.MAX_VALUE);
        Game.giantMap['' + this.id] = this;
    }
    Unit.prototype.start = function () {
        this.started = true;
        if (this.name !== 'house' && this.name !== 'soldier' && this.name !== 'barracks' && this.name !== 'keep') {
            var style = { font: "18px Arial", fill: '' + this.player.color, align: "center" };
            this.text = this.warGame.game.add.text(this.sprite.x, this.sprite.y - this.height / 2 - 20, 'fixme', style);
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
            if (this.name !== 'leader')
                this.text.position.set(this.sprite.x - this.text.width / 2, this.sprite.y - this.height / 2 - 20);
        }
        this.updateBehaviours(delta);
    };
    Unit.prototype.updateBehaviours = function (delta) {
        //If we have a behaviour, execute it.
        if (this.behaviour !== null) {
            if (!this.behaviour.getControl().started)
                this.behaviour.getControl().safeStart(); //Start the behaviour
            this.behaviour.update(delta); //Update it.
            if (this.behaviour.getControl().finished) {
                this.behaviour = null;
            }
        }
        else {
            if (this.name === 'peasant') {
                //Try to get a task from the capitol...
                var task = this.capitol.getTaskFromQueue();
                //If we actually got one, execute the function which will return a behaviour.
                if (task !== null)
                    this.behaviour = task(this.blackBoard);
                else {
                    this.behaviour = this.wander(this.blackBoard);
                }
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
        if (disToTarget >= disToStop) {
            var x = Math.cos(rotToTarget) * moveSpeed;
            var y = Math.sin(rotToTarget) * moveSpeed;
            this.sprite.x += x;
            this.sprite.y += y;
            this.sprite.angle = rotToTarget * (180 / Math.PI);
        }
        else {
            //this.sprite.position.set(position.x, position.y);
            //this.sprite.body.velocity.set(0, 0);
            return true;
        }
        return false;
    };
    Unit.prototype.destroy = function () {
        this.toBeDestroyed = true;
    };
    Unit.prototype.finalDestroy = function () {
        this.sprite.kill();
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
exports.Unit = Unit;
var Group = (function () {
    function Group(leader) {
        this.leader = null;
        this.posCounter = 0;
        this.spacing = 15;
        this.lines = 3;
        this.unitsPerLine = 8;
        this.maxGroupSize = 0;
        this.destroyed = false;
        this.leader = leader;
        this.positions = [];
        this.unitList = [];
        this.maxGroupSize = ~~(Math.random() * 75 + 25); //25 - 100
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
        //this.reformGroup();
        return this;
    };
    /**
     * Removes an amount from this group without killing them, essentially freeing them.
     * @param amount The amount to free.
     */
    Group.prototype.removeAmount = function (amount) {
        //Loop until we remove the right amount.
        var counter = 0;
        for (var i = this.unitList.length - 1; counter <= amount; i--) {
            this.unitList[i].getSoldier().group = null; //Destroy the unit.
            this.unitList[i].getSoldier().leader = null; //Destroy the unit.
            this.unitList[i].behaviour.getControl().finishWithFailure(); //They need to stop following us.
            this.unitList.splice(i, 1); //Splice it out!
            counter++; //Increment counter.
        }
    };
    /**
     * Kills an amount of this group. Will remove and destroy the units
     * @param amount
     */
    Group.prototype.killAmount = function (amount) {
        if (amount >= this.unitList.length)
            this.destroy();
        else {
            //Loop until we remove the right amount.
            var counter = 0;
            for (var i = this.unitList.length - 1; counter <= amount; i--) {
                this.unitList[i].destroy(); //Destroy the unit.
                this.unitList.splice(i, 1); //Splice it out!
                counter++; //Increment counter.
            }
        }
    };
    Group.prototype.killGroup = function () {
        for (var i = 0; i < this.unitList.length; i++)
            this.unitList[i].destroy();
        this.unitList = [];
        this.positions = [];
        if (this.leader !== null)
            this.leader.destroy();
        this.leader = null;
    };
    Group.prototype.getLeader = function () {
        return this.leader;
    };
    Group.prototype.getNumUnits = function () {
        return this.unitList.length;
    };
    Group.prototype.isFull = function () {
        return this.getNumUnits() >= this.maxGroupSize || this.leader === null || this.leader.toBeDestroyed || this.leader.getBannerMan().isRetreating;
    };
    Group.prototype.destroy = function () {
        this.leader.capitol.removeGroup(this); //Remove the group from the capitol.
        this.killGroup();
        this.destroyed = true;
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
            //Set the soldiers leader and the soldier's leader as the target, and give them a task!
            this.unitList[i].getSoldier().leader = this.leader.getBannerMan();
            this.unitList[i].blackBoard.target = this.leader;
            this.unitList[i].blackBoard.targetPosition = point;
            this.unitList[i].blackBoard.disToStop = 2;
            this.unitList[i].behaviour = new FollowPointRelativeToTarget(this.unitList[i].blackBoard);
        }
    };
    return Group;
})();
exports.Group = Group;
//# sourceMappingURL=Unit.js.map