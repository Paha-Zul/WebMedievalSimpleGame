///<reference path="../Game.ts"/>


/**
 * Created by Paha on 7/25/2015.
 */

class BlackBoard{
    target:Unit;
    targetPosition:Phaser.Point;
    waypoints:Phaser.Point[] = [];
    disToStop:number=2;
    moveSpeed:number=2;
    idleTime:number=500;

    me:Unit;
    game:Phaser.Game;

    constructor(){}
}