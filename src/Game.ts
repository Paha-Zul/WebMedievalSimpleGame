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

var game:Phaser.Game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render : render});

var foodText:Phaser.Text, colonyText:Phaser.Text, buildingText:Phaser.Text;
var leader:Unit = null;
var stage = 0;

var houseButton:Phaser.Button;
var farmButton:Phaser.Button;
var barracksButton:Phaser.Button;
var mineButton:Phaser.Button;
var keepButton:Phaser.Button;
var cancelButton:Phaser.Button;

var up:Phaser.Key, down:Phaser.Key, left:Phaser.Key, right:Phaser.Key;

var houseKey:Phaser.Key, farmKey:Phaser.Key;

var buildingType:string = '';

var spawnTimer:Phaser.TimerEvent;

var cursors:Phaser.CursorKeys;

var preview:Phaser.Sprite = null;

var buildingGroup:Phaser.Group, peasantGroup:Phaser.Group, buttonGroup:Phaser.Group, flagGroup:Phaser.Group;

var currScreen:IScreen = null;

function preload () {
    game.load.image('normal', 'img/normal_button.png');
    game.load.image('war', 'img/war_button.png');
    game.load.image('house', 'img/house.png');
    game.load.image('farm', 'img/farm.png');
    game.load.image('capitol', 'img/capitol.png');
    game.load.image('barracks', 'img/barracks.png');
    game.load.image('mine', 'img/mine.png');
    game.load.image('keep', 'img/capitol.png');

    game.load.image('flag', 'img/flag.png');

    game.load.image('buildBarracks', 'img/button_barracks.png');
    game.load.image('buildHouse', 'img/button_house.png');
    game.load.image('buildFarm', 'img/button_farm.png');
    game.load.image('buildMine', 'img/button_mine.png');
    game.load.image('buildCancel', 'img/button_cancel.png');
    game.load.image('buildKeep', 'img/button_keep.png');

    game.load.spritesheet('mainMenuButtons', 'img/MainMenuButtons.png', 100, 50);

    this.game.stage.backgroundColor = '#DDDDDD';
    game.stage.disableVisibilityChange = true; //Apparently turns off pausing while in the background...
}

function create () {
    changeScreen(new MainMenuScreen(game));
}

function update() {
    if(currScreen !== null) currScreen.update(game.time.physicsElapsedMS)
}

function render(){
    //for(var i=0;i<colonyList[0].freePeasantList.length;i++){
    //    game.debug.body(colonyList[0].freePeasantList[i].sprite);
    //}

    //for(var p in PlayerManager.players) {
    //    var player:Player = PlayerManager.getPlayer(p);
    //    var l = player.capitol.freePeasantList.length;
    //    for (var i = 0; i < l; i++){
    //        game.debug.body(player.capitol.freePeasantList[i].sprite);
    //    }
    //}
}

function changeScreen(screen:IScreen){
    if(currScreen !== null) currScreen.destroy();
    currScreen = screen;
    currScreen.start();
}

function startExample(start:Phaser.Point, playerName:string, multiplier?:number){
    /*
     * Incredibly ugly prototype code here. Quick and dirty...
     */

    multiplier = multiplier || 1;

    var numPeasants = 0;
    var numFarms = 8;
    var numMines = 5;
    var numHouses = 10;
    var numBarracks = 2;

    var capitol = new Capitol(start.x, start.y, game, playerName, buildingGroup.create(0,0,'capitol'), 100, 100);
    var player:Player = PlayerManager.getPlayer(playerName);
    player.capitol = capitol;

    var x = capitol.sprite.x, y = capitol.sprite.y;
    var width = 40, height = 40;

    capitol.addBuilding('keep', x + 100, y);
    capitol.addBuilding('keep', x - 100, y);
    capitol.addBuilding('keep', x, y + 100);

    for(var k=0;k<multiplier;k++) {

        x = capitol.sprite.x - 300;
        y = capitol.sprite.y - 100;
        width = 40;
        height = 40;

        //Make some houses
        for (var i = 0; i < numHouses; i++)
            capitol.addBuilding('house', x, i * 40 + y, width, height);

        x = capitol.sprite.x - 350;

        //Make some more houses
        for (var i = 0; i < numHouses; i++)
            capitol.addBuilding('house', x, i * 40 + y, width, height);

        x = capitol.sprite.x - 200;
        y = capitol.sprite.y - 100;

        //Make some barracks
        for (var i = 0; i < numBarracks; i++)
            capitol.addBuilding('barracks', x, i * 65 + y)

        x = capitol.sprite.x + 300;
        y = capitol.sprite.y - 200;
        width = 100;
        height = 100;

        //Make some farms
        for (var i = 0; i < numFarms; i++) {
            capitol.addBuilding('farm', x, y, width, height);
            if (i < numFarms / 2) {
                y += height;
            } else {
                x -= width;
            }
        }

        x = capitol.sprite.x - 200;
        y = capitol.sprite.y - 200;

        //Make some mines
        for (var i = 0; i < numMines; i++) {
            capitol.addBuilding('mine', x, y, 75, 75);
            x += 90;
        }
    }
}

function placeBuilding(){
    if(buildingType !== '') {
        var x = (game.input.worldX) * (1 / game.world.scale.x);
        var y = (game.input.worldY) * (1 / game.world.scale.y);
        PlayerManager.getPlayer("player1").capitol.addBuilding(buildingType, x, y, 100, 100);
    }
}

function setBuildingType(type:string){
    buildingType = type;
    buildingText.text = type;
    if(preview !== null) preview.destroy(true);

    if(type !== '') preview = game.add.sprite(100, 100, type);
    else preview = null;

    if(preview !== null) {
        preview.anchor.set(0.5, 0.5);
        preview.alpha = 0.5;
    }
}