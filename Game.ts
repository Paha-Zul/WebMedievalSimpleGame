/// <reference path="./build/phaser.d.ts"/>
/// <reference path="./Unit.ts"/>
/// <reference path="./Colony.ts"/>
/// <reference path="./Building.ts"/>
/// <reference path="./Helper.ts"/>
/// <reference path="./Behaviours.ts"/>
/// <reference path="./tasks/BlackBoard.ts"/>

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render : render});
var colonyList:Colony[] = [];

var foodText;
var colonyText;
var leader:Unit = null;
var stage = 0;
var unitGroup = null;

var leaderButton;
var regularButton;

function preload () {
    game.load.image('logo', 'phaser.png');
    game.load.image('normal', 'img/normal_button.png');
    game.load.image('war', 'img/war_button.png');


    this.game.stage.backgroundColor = '#DDDDDD'
}

function create () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    unitGroup = game.add.group();
    createColonyAndUnitsLeader();

    //Adds an event to the mouse.
    game.input.onDown.add(placeBuilding , this);

    var text = "- phaser -\n with a sprinkle of \n pixi dust.";
    var style = { font: "20px Arial", fill: "#ff0044", align: "center" };

    foodText = game.add.text(0, 0, text, style);
    colonyText = game.add.text(0, 20, text, style);

    leaderButton = game.add.button(game.world.centerX - 125, 0, 'war', pressLeader, this, 2, 1, 0);
    regularButton = game.add.button(game.world.centerX + 25, 0, 'normal', pressRegular, this, 2, 1, 0);
}

function update() {
    var l = colonyList.length;
    for(var i=0;i<l;i++)
        colonyList[i].update(game.time.physicsElapsedMS);

    foodText.text = 'resources: '+colonyList[0].resources+', rate: '+colonyList[0].avgResources;
    colonyText.text = 'peasants: '+colonyList[0].freePeasantList.length;

    if(leader !== null) test();
}

function render(){

}

function createColonyAndUnitsLeader(){
    var numUnits = 30;

    var colony = new Colony(game.world.centerX, game.world.centerY, game);
    colonyList[0] = colony;
    for(var i=0;i<numUnits;i++) {
        if(i === 0)
            leader = colony.addFreePeasant(game.world.centerX, game.world.centerY, game, colony);
        else {
            var p = colony.addFreePeasant(game.world.centerX, game.world.centerY, game, colony);
            p.leader = leader;
        }
    }

    var amt = numUnits; //Amt of spaces
    var spacing = 15; //Spacing between spaces
    var lines = 3; //# of lines deep.

    for(i=0;i<amt;i++){
        var index = ~~(i/~~(amt/lines));
        var div = ~~(amt/lines);
        var x = -(index+1)*spacing;
        var y = i%div*spacing - div/2*spacing;
        leader.positions.push(new Phaser.Point(x, y));
    }

    leader.control = 'manual';
}

function createColonyAndUnitsNormal(){
    var colony = new Colony(game.world.centerX, game.world.centerY, game);
    colonyList[0] = colony;
    for(var i=0;i<20;i++)
        colony.addFreePeasant(game.world.centerX, game.world.centerY, game, colony);
}

function placeBuilding(){
    colonyList[0].buildingList.push(new Building(game.input.activePointer.x, game.input.activePointer.y, game, colonyList[0]));
}

function test(){
    if(stage === 0)
        leader.walkTowardsPosition(new Phaser.Point(700,game.world.centerY), 5);
}

function pressLeader(){
    colonyList[0].destroy();
    createColonyAndUnitsLeader();
}

function pressRegular(){
    colonyList[0].destroy();
    createColonyAndUnitsNormal();
}