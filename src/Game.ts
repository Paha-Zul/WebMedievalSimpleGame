/// <reference path="./../build/phaser.d.ts"/>
/// <reference path="./unit/Unit.ts"/>
/// <reference path="./unit/Colony.ts"/>
/// <reference path="./unit/Building.ts"/>
/// <reference path="./unit/House.ts"/>
/// <reference path="./unit/Farm.ts"/>
/// <reference path="./unit/Barracks.ts"/>
/// <reference path="./unit/Mine.ts"/>

/// <reference path="./util/Helper.ts"/>
/// <reference path="./util/Behaviours.ts"/>
/// <reference path="./util/CircularQueue.ts"/>

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
/// <reference path="tasks/composite/ParentTask.ts"/>
/// <reference path="tasks/composite/Sequence.ts"/>
/// <reference path="tasks/control/TaskController.ts"/>
/// <reference path="tasks/control/ParentTaskController.ts"/>

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render : render});
var colonyList:Colony[] = [];

var foodText, colonyText, buildingText;
var leader:Unit = null;
var stage = 0;
var unitGroup = null;

var leaderButton:Phaser.Button;
var regularButton:Phaser.Button;
var houseButton:Phaser.Button;
var farmButton:Phaser.Button;
var barracksButton:Phaser.Button;
var mineButton:Phaser.Button;

var houseKey:Phaser.Key, farmKey:Phaser.Key;

var buildingType:string = 'farm';

var spawnTimer:Phaser.TimerEvent;

function preload () {
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

    this.game.stage.backgroundColor = '#DDDDDD'
}

function create () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    unitGroup = game.add.group();
    startExample();

    //Adds an event to the mouse.
    game.input.onDown.add(()=> {if(!game.input.disabled) placeBuilding();} , this);

    //Some text stuff...
    var text = "- phaser -\n with a sprinkle of \n pixi dust.";
    var style = { font: "20px Arial", fill: "#ff0044", align: "center" };

    foodText = game.add.text(0, 0, text, style);
    colonyText = game.add.text(0, 20, text, style);
    buildingText = game.add.text(0, 40, buildingType, style);

    //Adding some buttons...
    leaderButton = game.add.button(game.world.centerX - 125, 0, 'war', pressLeader, this, 2, 1, 0);
    regularButton = game.add.button(game.world.centerX + 25, 0, 'normal', pressRegular, this, 2, 1, 0);

    houseButton = game.add.button(0, game.world.height - 50, 'buildHouse', ()=>buildingText.text = buildingType='house', this, 2, 1, 0);
    farmButton = game.add.button(60, game.world.height - 50, 'buildFarm', ()=>buildingText.text = buildingType='farm', this, 2, 1, 0);
    barracksButton = game.add.button(120, game.world.height - 50, 'buildBarracks', ()=>buildingText.text = buildingType='barracks', this, 2, 1, 0);
    mineButton = game.add.button(180, game.world.height - 50, 'buildMine', ()=>buildingText.text = buildingType='mine', this, 2, 1, 0);

    houseButton.onInputOver.add(()=>game.input.disabled = true, this);
    houseButton.onInputOut.add(()=>game.input.disabled = false, this);
    farmButton.onInputOver.add(()=>game.input.disabled = true, this);
    farmButton.onInputOut.add(()=>game.input.disabled = false, this);
    barracksButton.onInputOver.add(()=>game.input.disabled = true, this);
    barracksButton.onInputOut.add(()=>game.input.disabled = false, this);
    mineButton.onInputOver.add(()=>game.input.disabled = true, this);
    mineButton.onInputOut.add(()=>game.input.disabled = false, this);
}

function update() {
    var l = colonyList.length;
    for(var i=0;i<l;i++)
        colonyList[i].update(game.time.physicsElapsedMS);

    foodText.text = 'food: '+colonyList[0].food+', rate: '+colonyList[0].avgResources;
    colonyText.text = 'peasants: '+colonyList[0].freePeasantList.length;
}

function render(){

}

function createColonyAndUnitsLeader(){
    var numUnits = 30;

    //Create a colony.
    var colony = new Colony(game.world.centerX, game.world.centerY, game, 100, 100);
    colonyList[0] = colony;

    //Create a leader
    leader = colony.addFreePeasant(game.world.centerX, game.world.centerY, game, colony);
    leader.blackBoard.moveSpeed = 1.5;
    leader.name = 'leader';

    for(var i=0;i<numUnits;i++) {
        var p = colony.addFreePeasant(game.world.centerX, game.world.centerY, game, colony);
        p.name = 'soldier';
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

    var seq:Sequence = new Sequence(leader.blackBoard);
    seq.control.addTask(new FollowWaypoint(leader.blackBoard));
    seq.control.addTask(new Idle(leader.blackBoard));
    leader.blackBoard.idleTime = 10000000000;

    leader.behaviour = seq;
    //spawnTimer = game.time.events.loop(1000, () => colony.addFreePeasant(game.world.centerX, game.world.centerY, game, colony).leader = leader, this);
}

function createColonyAndUnitsNormal(){
    var colony = new Colony(game.world.centerX, game.world.centerY, game, 100, 100);
    colonyList[0] = colony;

}

function startExample(){
    /*
     * Incredibly ugly prototype code here. Quick and dirty...
     */

    var colony = new Colony(game.world.centerX, game.world.centerY, game, 100, 100);
    colonyList[0] = colony;

    var x=50, y=100;
    var width = 40, height = 40;

    //Make some houses
    for(var i=0;i<10;i++)
        colony.addBuilding('house', x, i*40 + y, game, colony, width, height);

    x=90;

    //Make some more houses
    for(var i=0;i<10;i++)
        colony.addBuilding('house', x, i*40 + y, game, colony, width, height);

    x=750;
    y=100;
    width = 100;
    height = 100;

    //Make some farms
    for(var i=0;i<8;i++){
        colony.addBuilding('farm', x, y, game, colony, width, height);
        if(i<4){
            y+=height;
        }else{
            x-=width;
        }
    }

    x = 200;
    y = 75;

    //Make some mines
    for(var i=0;i<5;i++){
        colony.addBuilding('mine', x, y, game, colony, 75, 75);
        x+=90;
    }
}

function placeBuilding(){
    colonyList[0].addBuilding(buildingType, game.input.activePointer.x, game.input.activePointer.y, game, colonyList[0], 100, 100);
}

function pressLeader(){
    colonyList[0].destroy();
    createColonyAndUnitsLeader();
}

function pressRegular(){
    colonyList[0].destroy();
    createColonyAndUnitsNormal();
}