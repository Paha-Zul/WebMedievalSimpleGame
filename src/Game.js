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
/// <reference path="./IUpdateable.ts"/>
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
/// <reference path="tasks/composite/ParentTask.ts"/>
/// <reference path="tasks/composite/Sequence.ts"/>
/// <reference path="tasks/composite/Parallel.ts"/>
/// <reference path="tasks/decorators/TaskDecorator.ts"/>
/// <reference path="tasks/decorators/AlwaysTrue.ts"/>
/// <reference path="tasks/decorators/Repeat.ts"/>
/// <reference path="tasks/control/TaskController.ts"/>
/// <reference path="tasks/control/ParentTaskController.ts"/>
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
var foodText, colonyText, buildingText;
var leader = null;
var stage = 0;
var unitGroup = null;
var houseButton;
var farmButton;
var barracksButton;
var mineButton;
var keepButton;
var cancelButton;
var up, down, left, right;
var houseKey, farmKey;
var buildingType = '';
var spawnTimer;
var cursors;
var preview = null;
var buildingGroup, peasantGroup, buttonGroup;
function preload() {
    game.load.image('normal', 'img/normal_button.png');
    game.load.image('war', 'img/war_button.png');
    game.load.image('house', 'img/house.png');
    game.load.image('farm', 'img/farm.png');
    game.load.image('capitol', 'img/capitol.png');
    game.load.image('barracks', 'img/barracks.png');
    game.load.image('mine', 'img/mine.png');
    game.load.image('buildBarracks', 'img/button_barracks.png');
    game.load.image('buildHouse', 'img/button_house.png');
    game.load.image('buildFarm', 'img/button_farm.png');
    game.load.image('buildMine', 'img/button_mine.png');
    game.load.image('buildCancel', 'img/button_cancel.png');
    this.game.stage.backgroundColor = '#DDDDDD';
    game.stage.disableVisibilityChange = true; //Apparently turns off pausing while in the background...
}
function create() {
    Phaser.CANVAS;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 2000, 2000);
    PlayerManager.addPlayer("player1", "human", null);
    PlayerManager.addPlayer("player2", "ai", null);
    PlayerManager.addPlayer("player3", "ai", null);
    buildingGroup = game.add.group();
    peasantGroup = game.add.group();
    buttonGroup = game.add.group();
    unitGroup = game.add.group();
    startExample(new Phaser.Point(500, 500), 'player1', 3);
    startExample(new Phaser.Point(1100, 1700), 'player2', 3);
    startExample(new Phaser.Point(1900, 500), 'player3', 3);
    game.camera.x = PlayerManager.getPlayer('player1').capitol.x - game.camera.width / 2;
    game.camera.y = PlayerManager.getPlayer('player1').capitol.y - game.camera.height / 2;
    //Adds an event to the mouse.
    game.input.onDown.add(function () {
        if (!game.input.disabled)
            placeBuilding();
    }, this);
    //Some text stuff...
    var text = "- phaser -\n with a sprinkle of \n pixi dust.";
    var style = { font: "20px Arial", fill: "#ff0044", align: "center" };
    foodText = game.add.text(0, 0, text, style);
    colonyText = game.add.text(0, 20, text, style);
    buildingText = game.add.text(0, 40, buildingType, style);
    houseButton = game.add.button(0, game.world.height - 50, 'buildHouse', function () { return setBuildingType('house'); }, this, 2, 1, 0);
    farmButton = game.add.button(60, game.world.height - 50, 'buildFarm', function () { return setBuildingType('farm'); }, this, 2, 1, 0);
    barracksButton = game.add.button(120, game.world.height - 50, 'buildBarracks', function () { return setBuildingType('barracks'); }, this, 2, 1, 0);
    mineButton = game.add.button(180, game.world.height - 50, 'buildMine', function () { return setBuildingType('mine'); }, this, 2, 1, 0);
    //TODO The keep button image is a palceholder...
    keepButton = game.add.button(180, game.world.height - 50, 'buildHouse', function () { return setBuildingType('keep'); }, this, 2, 1, 0);
    cancelButton = game.add.button(180, game.world.height - 50, 'buildCancel', function () { return setBuildingType(''); }, this, 2, 1, 0);
    buttonGroup.add(houseButton);
    buttonGroup.add(farmButton);
    buttonGroup.add(barracksButton);
    buttonGroup.add(mineButton);
    buttonGroup.add(cancelButton);
    houseButton.onInputOver.add(function () { return game.input.disabled = true; }, this);
    houseButton.onInputOut.add(function () { return game.input.disabled = false; }, this);
    farmButton.onInputOver.add(function () { return game.input.disabled = true; }, this);
    farmButton.onInputOut.add(function () { return game.input.disabled = false; }, this);
    barracksButton.onInputOver.add(function () { return game.input.disabled = true; }, this);
    barracksButton.onInputOut.add(function () { return game.input.disabled = false; }, this);
    mineButton.onInputOver.add(function () { return game.input.disabled = true; }, this);
    mineButton.onInputOut.add(function () { return game.input.disabled = false; }, this);
    keepButton.onInputOver.add(function () { return game.input.disabled = true; }, this);
    keepButton.onInputOut.add(function () { return game.input.disabled = false; }, this);
    cancelButton.onInputOver.add(function () { return game.input.disabled = true; }, this);
    cancelButton.onInputOut.add(function () { return game.input.disabled = false; }, this);
    up = game.input.keyboard.addKey(Phaser.Keyboard.W);
    down = game.input.keyboard.addKey(Phaser.Keyboard.S);
    left = game.input.keyboard.addKey(Phaser.Keyboard.A);
    right = game.input.keyboard.addKey(Phaser.Keyboard.D);
    cursors = game.input.keyboard.createCursorKeys();
    //game.add.plugin(Phaser.Plugin.Debug);
}
function update() {
    var player = PlayerManager.getPlayer("player1");
    for (var p in PlayerManager.players)
        PlayerManager.getPlayer(p).capitol.update(game.time.physicsElapsedMS);
    if (up.isDown)
        game.camera.y -= 4;
    else if (down.isDown)
        game.camera.y += 4;
    if (left.isDown)
        game.camera.x -= 4;
    else if (right.isDown)
        game.camera.x += 4;
    if (game.input.mouse.wheelDelta !== 0) {
        var mult = 0.1;
        var val = game.input.mouse.wheelDelta * mult;
        var cx = game.camera.x + game.camera.width / 2;
        var cy = game.camera.y + game.camera.height / 2;
        game.world.scale.x += val;
        game.world.scale.y += val;
        game.input.mouse.wheelDelta = 0;
        game.camera.setPosition(game.camera.x + game.camera.x * val * 2, game.camera.y + game.camera.y * val * 2);
    }
    var posX = game.camera.x * (1 / game.world.scale.x);
    var posY = (game.camera.y + game.camera.height) * (1 / game.world.scale.y) - 50;
    houseButton.position.set(posX, posY);
    farmButton.position.set(posX + 50, posY);
    barracksButton.position.set(posX + 100, posY);
    mineButton.position.set(posX + 150, posY);
    keepButton.position.set(posX + 200, posY);
    cancelButton.position.set(posX + 250, posY);
    posX = (game.camera.x) * (1 / game.world.scale.x);
    posY = (game.camera.y) * (1 / game.world.scale.x);
    foodText.text = 'food: ' + player.capitol.food + ', rate: ' + player.capitol.avgResources;
    foodText.position.set(posX, posY);
    colonyText.text = 'peasants: ' + player.capitol.freePeasantList.length;
    colonyText.position.set(posX, posY + 25);
    if (preview !== null)
        preview.position.set(game.input.worldX * (1 / game.world.scale.x), game.input.worldY * (1 / game.world.scale.y));
}
function render() {
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
function createColonyAndUnitsLeader(playerName) {
    var numUnits = 30;
    var player = PlayerManager.getPlayer(playerName);
    //Create a colony.
    var capitol = new Capitol(game.world.centerX, game.world.centerY, game, playerName, buildingGroup.create(0, 0, 'capitol'), 100, 100);
    PlayerManager.getPlayer("player1").capitol = capitol;
    //Create a leader
    leader = capitol.addFreePeasant('leader', game.world.centerX, game.world.centerY);
    leader.blackBoard.moveSpeed = 1.5;
    for (var i = 0; i < numUnits; i++)
        capitol.addFreePeasant('soldier', game.world.centerX, game.world.centerY);
    leader.capitol.food = 100000;
    leader.capitol.iron = 100000;
}
function startExample(start, playerName, multiplier) {
    /*
     * Incredibly ugly prototype code here. Quick and dirty...
     */
    multiplier = multiplier || 1;
    var numPeasants = 0;
    var numFarms = 8;
    var numMines = 5;
    var numHouses = 10;
    var numBarracks = 2;
    var capitol = new Capitol(start.x, start.y, game, playerName, buildingGroup.create(0, 0, 'capitol'), 100, 100);
    var player = PlayerManager.getPlayer(playerName);
    player.capitol = capitol;
    var x = capitol.sprite.x, y = capitol.sprite.y;
    var width = 40, height = 40;
    capitol.addBuilding('keep', x + 100, y);
    capitol.addBuilding('keep', x - 100, y);
    capitol.addBuilding('keep', x, y + 100);
    for (var k = 0; k < multiplier; k++) {
        x = capitol.sprite.x - 300;
        y = capitol.sprite.y - 100;
        width = 40;
        height = 40;
        for (var i = 0; i < numHouses; i++)
            capitol.addBuilding('house', x, i * 40 + y, width, height);
        x = capitol.sprite.x - 350;
        for (var i = 0; i < numHouses; i++)
            capitol.addBuilding('house', x, i * 40 + y, width, height);
        x = capitol.sprite.x - 200;
        y = capitol.sprite.y - 100;
        for (var i = 0; i < numBarracks; i++)
            capitol.addBuilding('barracks', x, i * 65 + y);
        x = capitol.sprite.x + 300;
        y = capitol.sprite.y - 200;
        width = 100;
        height = 100;
        for (var i = 0; i < numFarms; i++) {
            capitol.addBuilding('farm', x, y, width, height);
            if (i < numFarms / 2) {
                y += height;
            }
            else {
                x -= width;
            }
        }
        x = capitol.sprite.x - 200;
        y = capitol.sprite.y - 200;
        for (var i = 0; i < numMines; i++) {
            capitol.addBuilding('mine', x, y, 75, 75);
            x += 90;
        }
    }
}
function placeBuilding() {
    if (buildingType !== '') {
        var x = (game.input.worldX) * (1 / game.world.scale.x);
        var y = (game.input.worldY) * (1 / game.world.scale.y);
        console.log('x/y: ' + x + '/' + y + ', camera x/y: ' + game.camera.x + '/' + game.camera.y + ' input x/y: ' + game.input.mousePointer.x + '/' + game.input.mousePointer.y);
        PlayerManager.getPlayer("player1").capitol.addBuilding(buildingType, x, y, 100, 100);
    }
}
function setBuildingType(type) {
    buildingType = type;
    buildingText.text = type;
    if (preview !== null)
        preview.destroy(true);
    if (type !== '')
        preview = game.add.sprite(100, 100, type);
    else
        preview = null;
    if (preview !== null) {
        preview.anchor.set(0.5, 0.5);
        preview.alpha = 0.5;
    }
}
//# sourceMappingURL=Game.js.map