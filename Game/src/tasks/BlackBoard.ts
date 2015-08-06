///<reference path="../Game.ts"/>

import Game = require('../Game');
import Unit = require('../unit/Unit');
import PM = require('../util/PlayerManager');
import PlayerManager = PM.PlayerManager
import Player = PM.Player;

/**
 * Created by Paha on 7/25/2015.
 */

class BlackBoard{
    target:Unit.Unit;
    targetPosition:Phaser.Point;
    targetGroup:Unit.Group;
    waypoints:Phaser.Point[] = [];
    disToStop:number=2;
    moveSpeed:number=2;
    idleTime:number=500;

    myPlayer:Player;
    me:Unit.Unit;
    game:Game;

    constructor(){}
}

export = BlackBoard;