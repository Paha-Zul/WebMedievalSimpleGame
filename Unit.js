/// <reference path="./Game.ts"/>
/**
 * Created by Paha on 7/23/2015.
 */
var Unit = (function () {
    function Unit(x, y, game, colony, width, height) {
        var _this = this;
        this.game = game;
        this.colony = colony;
        this.name = 'peasant';
        this.type = 'unit';
        this.control = 'auto';
        this.active = true;
        this.behaviour = null;
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
        this.update = function (delta) {
            _this.wander(delta);
        };
        //Wanders or something
        this.wander = function (delta) {
            if (_this.control === 'manual')
                return;
            if (_this.leader !== null)
                _this.behaviour = followLeader;
            else if (_this.colony.buildingList.length != 0 && _this.behaviour === null)
                _this.behaviour = transfer;
            //Calculate the distance to the target if we have one.
            var disToTarget;
            if (_this.target !== null)
                disToTarget = _this.sprite.position.distance(_this.target.sprite.position);
            if (_this.leader === null) {
                //Execute the non US behaviour if it's not null.
                if (_this.behaviour !== null)
                    _this.behaviour(_this, disToTarget, 5);
            }
            else if (_this.leader !== null) {
                if (_this.behaviour !== null) {
                    _this.behaviour(_this);
                }
            }
            //If the target is null, just move around aimlessly
            if (_this.target === null && _this.leader === null) {
                //If we are done idling
                if (_this.idleCounter >= _this.randIdle) {
                    //If we are done walking
                    if (_this.walkCounter >= _this.randWalk) {
                        //Reset values
                        _this.walkCounter -= _this.randWalk;
                        _this.idleCounter -= _this.randIdle;
                        _this.randRotation = Math.random() * 360;
                        _this.randIdle = Math.random() * 800;
                        _this.randWalk = Math.random() * 300;
                    }
                    else {
                        _this.walkCounter += delta;
                        _this.walkTowardsRotation(_this.randRotation);
                    }
                }
                else {
                    _this.idleCounter += delta;
                }
            }
            else if (_this.target !== null) {
                var rotation = _this.sprite.position.angle(_this.target.sprite.position, true);
                _this.walkTowardsPosition(_this.target.sprite.position, 1, disToTarget);
            }
            else if (_this.targetPos !== null) {
                _this.walkTowardsPosition(_this.targetPos, 1, disToTarget);
            }
        };
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
        this.sprite = makeSquareSprite(width || 10, height || 10);
        this.sprite.x = x;
        this.sprite.y = y;
    }
    return Unit;
})();
//# sourceMappingURL=Unit.js.map