/// <reference path="./../build/node.d.ts"/>
/// <reference path="./../build/socket.io.d.ts"/>
/// <reference path="./../build/phaser.d.ts"/>

/// <reference path="./unit/Unit.ts"/>
/// <reference path="./unit/Capitol.ts"/>
/// <reference path="./unit/Building.ts"/>
/// <reference path="./unit/House.ts"/>
/// <reference path="./unit/Farm.ts"/>
/// <reference path="./unit/Barracks.ts"/>
/// <reference path="./unit/Mine.ts"/>
/// <reference path="./unit/Peasant.ts"/>
/// <reference path="./unit/Keep.ts"/>

/// <reference path="./components/Soldier.ts"/>
/// <reference path="./components/BannerMan.ts"/>

/// <reference path="./interfaces/IUpdateable.ts"/>
/// <reference path="./interfaces/IPickupable.ts"/>
/// <reference path="./interfaces/IScreen.ts"/>

/// <reference path="./screens/MainMenuScreen.ts"/>
/// <reference path="./screens/GameScreen.ts"/>

/// <reference path="./util/Helper.ts"/>
/// <reference path="./util/Behaviours.ts"/>
/// <reference path="./util/CircularQueue.ts"/>
/// <reference path="./util/PlayerManager.ts"/>

/// <reference path="tasks/BlackBoard.ts"/>
/// <reference path="tasks/actions/MoveTo.ts"/>
/// <reference path="tasks/actions/FollowWaypoint.ts"/>
/// <reference path="tasks/actions/FollowPointRelativeToTarget.ts"/>
/// <reference path="tasks/actions/GetRandomBuilding.ts"/>
/// <reference path="tasks/actions/GetColony.ts"/>
/// <reference path="tasks/actions/TakeResource.ts"/>
/// <reference path="tasks/actions/GiveResource.ts"/>
/// <reference path="tasks/actions/RandomLocation.ts"/>
/// <reference path="tasks/actions/Idle.ts"/>
/// <reference path="tasks/actions/FindNearestEnemyUnit.ts"/>
/// <reference path="tasks/actions/AttackUnit.ts"/>
/// <reference path="tasks/actions/FindNearestGroup.ts"/>
/// <reference path="tasks/actions/JoinGroup.ts"/>
/// <reference path="tasks/actions/WaitForGroupSize.ts"/>
/// <reference path="tasks/actions/GetClosestDropoff.ts"/>

/// <reference path="tasks/composite/ParentTask.ts"/>
/// <reference path="tasks/composite/Sequence.ts"/>
/// <reference path="tasks/composite/Parallel.ts"/>

/// <reference path="tasks/decorators/TaskDecorator.ts"/>
/// <reference path="tasks/decorators/AlwaysTrue.ts"/>
/// <reference path="tasks/decorators/Repeat.ts"/>

/// <reference path="tasks/control/TaskController.ts"/>
/// <reference path="tasks/control/ParentTaskController.ts"/>

import io = require('socket.io');
var socket = io('http://localhost');
socket.on('such', function(data:any){
    console.log('Okay');
});

//Screens
import GameScreen = require('./screens/GameScreen');
import MainMenuScreen = require('./screens/MainMenuScreen');

//Units
import Unit = require('./unit/Unit');
import Building = require('./unit/Building');
import Barracks = require('./unit/Barracks');
import Capitol = require('./unit/Capitol');
import Farm = require('./unit/Farm');
import House = require('./unit/House');
import Mine = require('./unit/Mine');
import Keep = require('./unit/Keep');

//Task stuff
import BlackBoard = require('./tasks/BlackBoard');

'use strict';
class Game {

    game:Phaser.Game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: this.preload,
        create: this.create,
        update: this.update,
        render: this.render
    });

    up:Phaser.Key;
    down:Phaser.Key;
    left:Phaser.Key;
    right:Phaser.Key;

    buildingGroup:Phaser.Group;
    peasantGroup:Phaser.Group;
    buttonGroup:Phaser.Group;
    flagGroup:Phaser.Group;

    currScreen:IScreen = null;
    cursors:Phaser.CursorKeys;

    constructor(){}

    preload() {
        this.game.load.image('normal', 'Game/img/normal_button.png');
        this.game.load.image('war', 'Game/img/war_button.png');
        this.game.load.image('house', 'Game/img/house.png');
        this.game.load.image('farm', 'Game/img/farm.png');
        this.game.load.image('capitol', 'Game/img/capitol.png');
        this.game.load.image('barracks', 'Game/img/barracks.png');
        this.game.load.image('mine', 'Game/img/mine.png');
        this.game.load.image('keep', 'Game/img/capitol.png');

        this.game.load.image('flag', 'Game/img/flag.png');

        this.game.load.image('buildBarracks', 'Game/img/button_barracks.png');
        this.game.load.image('buildHouse', 'Game/img/button_house.png');
        this.game.load.image('buildFarm', 'Game/img/button_farm.png');
        this.game.load.image('buildMine', 'Game/img/button_mine.png');
        this.game.load.image('buildCancel', 'Game/img/button_cancel.png');
        this.game.load.image('buildKeep', 'Game/img/button_keep.png');

        this.game.load.spritesheet('mainMenuButtons', 'Game/img/MainMenuButtons.png', 100, 50);

        this.game.stage.backgroundColor = '#DDDDDD';
        this.game.stage.disableVisibilityChange = true; //Apparently turns off pausing while in the background...
    }

    create() {
        this.changeScreen(new MainMenuScreen(this));
    }

    update() {
        if (this.currScreen !== null) this.currScreen.update(this.game.time.physicsElapsedMS)
    }

    render(){
        //for(var i=0;i<colonyList[0].freePeasantList.length;i++){
        //    warGame.debug.body(colonyList[0].freePeasantList[i].sprite);
        //}

        //for(var p in PlayerManager.players) {
        //    var player:Player = PlayerManager.getPlayer(p);
        //    var l = player.capitol.freePeasantList.length;
        //    for (var i = 0; i < l; i++){
        //        warGame.debug.body(player.capitol.freePeasantList[i].sprite);
        //    }
        //}
    }

    changeScreen(screen:IScreen) {
        if (this.currScreen !== null) this.currScreen.destroy();
        this.currScreen = screen;
        this.currScreen.start();
    }

}

new Game();
export = Game;