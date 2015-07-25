/// <reference path="./build/phaser.d.ts"/>
/// <reference path="./Unit.ts"/>
/// <reference path="./Colony.ts"/>
/// <reference path="./Building.ts"/>
/// <reference path="./Helper.ts"/>
/// <reference path="./Behaviours.ts"/>

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render : render});
var colonyList:Colony[] = [];

var foodText;
var leader:Unit = null;
var stage = 0;
var unitGroup = null;

function preload () {
    game.load.image('logo', 'phaser.png');
    this.game.stage.backgroundColor = '#DDDDDD'
}

function create () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    unitGroup = game.add.group();
    createColonyAndUnits();

    //Adds an event to the mouse.
    game.input.onDown.add(placeBuilding , this);

    var text = "- phaser -\n with a sprinkle of \n pixi dust.";
    var style = { font: "32px Arial", fill: "#ff0044", align: "center" };

    foodText = game.add.text(0, 0, text, style);

    leader.control = 'manual';
}

function update() {
    var l = colonyList.length;
    for(var i=0;i<l;i++)
        colonyList[i].update(game.time.physicsElapsedMS);

    foodText.text = 'resources: '+colonyList[0].resources+', rate: '+colonyList[0].avgResources;
    test();
}

function render(){

}

function createColonyAndUnits(){
    var colony = new Colony(game.world.centerX, game.world.centerY, game);
    colonyList.push(colony);
    for(var i=0;i<20;i++) {
        if(i === 0)
            leader = colony.addFreePeasant(game.world.centerX, game.world.centerY, game, colony);
        else {
            var p = colony.addFreePeasant(game.world.centerX, game.world.centerY, game, colony);
            p.leader = leader;
        }
    }

    var amt = 20; //Amt of spaces
    var spacing = 15; //Spacing between spaces
    var lines = 3; //# of lines deep.

    for(i=0;i<amt;i++){
        var index = ~~(i/~~(amt/lines));
        var div = ~~(amt/lines);
        var x = -(index+1)*spacing;
        var y = i%div*spacing - div/2*spacing;
        leader.positions.push(new Phaser.Point(x, y));
    }
}

function placeBuilding(){
    colonyList[0].buildingList.push(new Building(game.input.activePointer.x, game.input.activePointer.y, game, colonyList[0]));
}

function test(){
    if(stage === 0)
        leader.walkTowardsPosition(new Phaser.Point(700,game.world.centerY), 5);
}