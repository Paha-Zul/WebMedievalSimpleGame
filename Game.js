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
/// <reference path="./tasks/composite/ParentTask.ts"/>
/// <reference path="./tasks/composite/Sequence.ts"/>
/// <reference path="./tasks/control/TaskController.ts"/>
/// <reference path="./tasks/control/ParentTaskController.ts"/>
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
var colonyList = [];
var foodText;
var colonyText;
var leader = null;
var stage = 0;
var unitGroup = null;
var leaderButton;
var regularButton;
function preload() {
    game.load.image('logo', 'phaser.png');
    game.load.image('normal', 'img/normal_button.png');
    game.load.image('war', 'img/war_button.png');
    this.game.stage.backgroundColor = '#DDDDDD';
}
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    unitGroup = game.add.group();
    createColonyAndUnitsNormal();
    //Adds an event to the mouse.
    game.input.onDown.add(placeBuilding, this);
    //Some text stuff...
    var text = "- phaser -\n with a sprinkle of \n pixi dust.";
    var style = { font: "20px Arial", fill: "#ff0044", align: "center" };
    foodText = game.add.text(0, 0, text, style);
    colonyText = game.add.text(0, 20, text, style);
    //Adding some buttons...
    leaderButton = game.add.button(game.world.centerX - 125, 0, 'war', pressLeader, this, 2, 1, 0);
    regularButton = game.add.button(game.world.centerX + 25, 0, 'normal', pressRegular, this, 2, 1, 0);
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
    var colony = new Colony(game.world.centerX, game.world.centerY, game);
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
    var colony = new Colony(game.world.centerX, game.world.centerY, game);
    colonyList[0] = colony;
    for (var i = 0; i < 30; i++) {
        var p = colony.addFreePeasant(game.world.centerX, game.world.centerY, game, colony);
        p.blackBoard.moveSpeed = 1.5 + Math.random() * 0.5;
    }
}
function placeBuilding() {
    colonyList[0].buildingList.push(new Building(game.input.activePointer.x, game.input.activePointer.y, game, colonyList[0]));
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