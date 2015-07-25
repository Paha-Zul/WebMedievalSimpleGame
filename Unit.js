/// <reference path="./Game.ts"/>
/// <reference path="./tasks/Task.ts"/>
/// <reference path="./tasks/BlackBoard.ts"/>
/**
 * Created by Paha on 7/23/2015.
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
        var style = { font: "18px Arial", fill: "#1765D1", align: "center" };
        this.text = game.add.text(x, y - this.height - 5, '', style);
    }
    Unit.prototype.update = function (delta) {
        this.text.text = '' + this.resources;
        this.text.position.set(this.sprite.x, this.sprite.y - this.height - 20);
        if (this.type !== 'humanoid')
            return;
        //If we have a behaviour, execute it.
        if (this.behaviour !== null) {
            this.behaviour.update(delta);
            if (this.behaviour.finished) {
                if (this.behaviour.nextTask === null)
                    this.behaviour = null;
                else
                    this.behaviour = this.behaviour.nextTask;
            }
        }
        else {
            if (this.colony !== null && this.colony.buildingList.length > 0) {
                //TODO This is really freaking ugly code. Find a better way to do this!
                this.behaviour = new GetRandomBuilding(this.blackBoard);
                this.behaviour.nextTask = new MoveTo(this.blackBoard);
                this.behaviour.nextTask.nextTask = new TakeResource(this.blackBoard);
                this.behaviour.nextTask.nextTask.nextTask = new GetColony(this.blackBoard);
                this.behaviour.nextTask.nextTask.nextTask.nextTask = new MoveTo(this.blackBoard);
                this.behaviour.nextTask.nextTask.nextTask.nextTask.nextTask = new GiveResource(this.blackBoard);
            }
        }
    };
    Unit.prototype.destroy = function () {
        this.sprite.destroy(true);
        this.text.destroy(true);
        this.leader = null;
        this.behaviour = null;
    };
    return Unit;
})();
//# sourceMappingURL=Unit.js.map