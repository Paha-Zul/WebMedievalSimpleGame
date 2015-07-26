/// <reference path="./build/phaser.d.ts"/>
/// <reference path="./Unit.ts"/>
/// <reference path="./Colony.ts"/>
/// <reference path="./Building.ts"/>
/// <reference path="./Helper.ts"/>
/// <reference path="./Behaviours.ts"/>
/// <reference path="./CircularQueue.ts"/>
/// <reference path="./tasks/BlackBoard.ts"/>
/// <reference path="./tasks/actions/MoveTo.ts"/>
/// <reference path="./tasks/actions/FollowWaypoint.ts"/>
/// <reference path="./tasks/actions/FollowPointRelativeToTarget.ts"/>
/// <reference path="./tasks/actions/GetRandomBuilding.ts"/>
/// <reference path="./tasks/actions/GetColony.ts"/>
/// <reference path="./tasks/actions/TakeResource.ts"/>
/// <reference path="./tasks/actions/GiveResource.ts"/>
/// <reference path="./tasks/actions/RandomLocation.ts"/>
/// <reference path="./tasks/actions/Idle.ts"/>
/// <reference path="./tasks/composite/ParentTask.ts"/>
/// <reference path="./tasks/composite/Sequence.ts"/>
/// <reference path="./tasks/control/TaskController.ts"/>
/// <reference path="./tasks/control/ParentTaskController.ts"/>
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
var colonyList = [];
var foodText, colonyText, buildingText;
var leader = null;
var stage = 0;
var unitGroup = null;
var leaderButton;
var regularButton;
var houseKey, farmKey;
var building = 'farm';
function preload() {
    game.load.image('logo', 'phaser.png');
    game.load.image('normal', 'img/normal_button.png');
    game.load.image('war', 'img/war_button.png');
    game.load.image('house', 'img/house.png');
    game.load.image('farm', 'img/farm.png');
    game.load.image('capitol', 'img/capitol.png');
    this.game.stage.backgroundColor = '#DDDDDD';
}
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    unitGroup = game.add.group();
    startExample();
    //Adds an event to the mouse.
    game.input.onDown.add(placeBuilding, this);
    //Some text stuff...
    var text = "- phaser -\n with a sprinkle of \n pixi dust.";
    var style = { font: "20px Arial", fill: "#ff0044", align: "center" };
    foodText = game.add.text(0, 0, text, style);
    colonyText = game.add.text(0, 20, text, style);
    buildingText = game.add.text(0, 40, building, style);
    //Adding some buttons...
    leaderButton = game.add.button(game.world.centerX - 125, 0, 'war', pressLeader, this, 2, 1, 0);
    regularButton = game.add.button(game.world.centerX + 25, 0, 'normal', pressRegular, this, 2, 1, 0);
    houseKey = game.input.keyboard.addKey(Phaser.Keyboard.H);
    farmKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
    houseKey.onDown.add(function () { return buildingText.text = building = 'house'; }, this);
    farmKey.onDown.add(function () { return buildingText.text = building = 'farm'; }, this);
}
function update() {
    var l = colonyList.length;
    for (var i = 0; i < l; i++)
        colonyList[i].update(game.time.physicsElapsedMS);
    foodText.text = 'resources: ' + colonyList[0].resources + ', rate: ' + colonyList[0].avgResources;
    colonyText.text = 'peasants: ' + colonyList[0].freePeasantList.length;
    if (leader !== null)
        test();
}
function render() {
}
function createColonyAndUnitsLeader() {
    var numUnits = 30;
    //Create a colony.
    var colony = new Colony(game.world.centerX, game.world.centerY, game, 100, 100);
    colonyList[0] = colony;
    //Create a leader
    leader = colony.addFreePeasant(game.world.centerX, game.world.centerY, game, colony);
    leader.blackBoard.moveSpeed = 1.5;
    /*
     * This area will create points for units to follow
     */
    var amt = numUnits; //Amt of spaces
    var spacing = 15; //Spacing between spaces
    var lines = 3; //# of lines deep.
    for (i = 0; i < amt; i++) {
        var index = ~~(i / ~~(amt / lines));
        var div = ~~(amt / lines);
        var x = -(index + 1) * spacing;
        var y = i % div * spacing - div / 2 * spacing;
        leader.positions.push(new Phaser.Point(x, y));
    }
    for (var i = 0; i < numUnits; i++) {
        var p = colony.addFreePeasant(game.world.centerX, game.world.centerY, game, colony);
        p.leader = leader;
        p.blackBoard.target = leader;
        p.blackBoard.targetPosition = leader.positions[leader.posCounter++];
        p.behaviour = new FollowPointRelativeToTarget(p.blackBoard);
    }
    leader.control = 'manual';
    leader.blackBoard.disToStop = 1;
    leader.blackBoard.waypoints.push(new Phaser.Point(400, 400));
    leader.blackBoard.waypoints.push(new Phaser.Point(500, 500));
    leader.blackBoard.waypoints.push(new Phaser.Point(600, 500));
    leader.blackBoard.waypoints.push(new Phaser.Point(700, 300));
    leader.blackBoard.waypoints.push(new Phaser.Point(700, 200));
    leader.blackBoard.waypoints.push(new Phaser.Point(650, 100));
    leader.blackBoard.waypoints.push(new Phaser.Point(600, 100));
    leader.blackBoard.waypoints.push(new Phaser.Point(300, 100));
    leader.blackBoard.waypoints.push(new Phaser.Point(200, 300));
    leader.blackBoard.waypoints.push(new Phaser.Point(200, 500));
    leader.blackBoard.waypoints.push(new Phaser.Point(300, 500));
    leader.blackBoard.waypoints.push(new Phaser.Point(400, 400));
    leader.behaviour = new FollowWaypoint(leader.blackBoard);
}
function createColonyAndUnitsNormal() {
    var colony = new Colony(game.world.centerX, game.world.centerY, game, 100, 100);
    colonyList[0] = colony;
}
function startExample() {
    var colony = new Colony(game.world.centerX, game.world.centerY, game, 100, 100);
    colonyList[0] = colony;
    var x = 50, y = 100;
    var width = 40, height = 40;
    for (var i = 0; i < 10; i++)
        colony.addBuilding(x, i * 40 + y, game, colony, width, height).name = 'house';
    x = 90;
    for (var i = 0; i < 10; i++)
        colony.addBuilding(x, i * 40 + y, game, colony, width, height).name = 'house';
    x = 750;
    y = 100;
    width = 100;
    height = 100;
    for (var i = 0; i < 8; i++) {
        if (i < 4) {
            colony.addBuilding(x, y, game, colony, width, height).name = 'farm';
            y += height;
        }
        else {
            colony.addBuilding(x, y, game, colony, width, height).name = 'farm';
            x -= width;
        }
    }
}
function placeBuilding() {
    if (building === 'farm')
        colonyList[0].buildingList.push(new Building(game.input.activePointer.x, game.input.activePointer.y, game, colonyList[0], 100, 100));
    else if (building === 'house') {
        var house = new Building(game.input.activePointer.x, game.input.activePointer.y, game, colonyList[0], 40, 40);
        colonyList[0].buildingList.push(house);
        house.name = 'house';
    }
}
function test() {
    //if(stage === 0)
    //    leader.walkTowardsPosition(new Phaser.Point(700,game.world.centerY), 5);
}
function pressLeader() {
    colonyList[0].destroy();
    createColonyAndUnitsLeader();
}
function pressRegular() {
    colonyList[0].destroy();
    createColonyAndUnitsNormal();
}
//# sourceMappingURL=Game.js.map