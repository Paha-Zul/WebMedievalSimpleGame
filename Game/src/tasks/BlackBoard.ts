///<reference path="../Game.ts"/>

import Game from'../Game';
import {Unit, Group} from'../unit/Unit';
import {PlayerManager, Player} from'../util/PlayerManager';

/**
 * Created by Paha on 7/25/2015.
 */

class BlackBoard{
    target:Unit;
    targetPosition:Phaser.Point;
    targetGroup:Group;
    waypoints:Phaser.Point[] = [];
    disToStop:number=2;
    moveSpeed:number=2;
    idleTime:number=500;

    myPlayer:Player;
    me:Unit;
    game:Game;

    constructor(){}
}

export default BlackBoard;