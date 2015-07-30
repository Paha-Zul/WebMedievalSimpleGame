/// <reference path="./../build/phaser.d.ts"/>
/// <reference path="./unit/Unit.ts"/>
/// <reference path="./unit/Colony.ts"/>
/// <reference path="./unit/Building.ts"/>
/// <reference path="./unit/House.ts"/>
/// <reference path="./unit/Farm.ts"/>
/// <reference path="./unit/Barracks.ts"/>
/// <reference path="./unit/Mine.ts"/>
/// <reference path="./unit/Peasant.ts"/>
/// <reference path="./components/Soldier.ts"/>
/// <reference path="./components/BannerMan.ts"/>

/// <reference path="./IUpdateable.ts"/>

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
var colonyList:Capitol[] = [];

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
var cancelButton:Phaser.Button;

var up:Phaser.Key, down:Phaser.Key, left:Phaser.Key, right:Phaser.Key;

var houseKey:Phaser.Key, farmKey:Phaser.Key;

var buildingType:string = 'farm';

var spawnTimer:Phaser.TimerEvent;

var cursors:Phaser.CursorKeys;

var preview:Phaser.Sprite = null;

var buildingGroup:Phaser.Group, peasantGroup:Phaser.Group;

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
    game.load.image('buildCancel', 'img/button_cancel.png');

    this.game.stage.backgroundColor = '#DDDDDD'
}

function create () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0,0,2000,2000);
    game.camera.setPosition(600,700);

    unitGroup = game.add.group();
    startExample();

    //Adds an event to the mouse.
    game.input.onDown.add(()=> {if(!game.input.disabled) placeBuilding();} , this);

    buildingGroup = game.add.group();
    peasantGroup = game.add.group();

    //Some text stuff...
    var text = "- phaser -\n with a sprinkle of \n pixi dust.";
    var style = { font: "20px Arial", fill: "#ff0044", align: "center" };

    foodText = game.add.text(0, 0, text, style);
    colonyText = game.add.text(0, 20, text, style);
    buildingText = game.add.text(0, 40, buildingType, style);

    //Adding some buttons...
    leaderButton = game.add.button(game.world.centerX - 125, 0, 'war', pressLeader, this, 2, 1, 0);
    regularButton = game.add.button(game.world.centerX + 25, 0, 'normal', pressRegular, this, 2, 1, 0);

    houseButton = game.add.button(0, game.world.height - 50, 'buildHouse', ()=>setBuildingType('house'), this, 2, 1, 0);
    farmButton = game.add.button(60, game.world.height - 50, 'buildFarm', ()=>setBuildingType('farm'), this, 2, 1, 0);
    barracksButton = game.add.button(120, game.world.height - 50, 'buildBarracks', ()=>setBuildingType('barracks'), this, 2, 1, 0);
    mineButton = game.add.button(180, game.world.height - 50, 'buildMine', ()=>setBuildingType('mine'), this, 2, 1, 0);
    cancelButton = game.add.button(180, game.world.height - 50, 'buildCancel', ()=>setBuildingType(''), this, 2, 1, 0);

    houseButton.onInputOver.add(()=>game.input.disabled = true, this);
    houseButton.onInputOut.add(()=>game.input.disabled = false, this);
    farmButton.onInputOver.add(()=>game.input.disabled = true, this);
    farmButton.onInputOut.add(()=>game.input.disabled = false, this);
    barracksButton.onInputOver.add(()=>game.input.disabled = true, this);
    barracksButton.onInputOut.add(()=>game.input.disabled = false, this);
    mineButton.onInputOver.add(()=>game.input.disabled = true, this);
    mineButton.onInputOut.add(()=>game.input.disabled = false, this);
    cancelButton.onInputOut.add(()=>game.input.disabled = false, this);
    cancelButton.onInputOver.add(()=>game.input.disabled = true, this);

    up = game.input.keyboard.addKey(Phaser.Keyboard.W);
    down = game.input.keyboard.addKey(Phaser.Keyboard.S);
    left = game.input.keyboard.addKey(Phaser.Keyboard.A);
    right = game.input.keyboard.addKey(Phaser.Keyboard.D);

    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    var l = colonyList.length;
    for(var i=0;i<l;i++)
        colonyList[i].update(game.time.physicsElapsedMS);

    foodText.text = 'food: '+colonyList[0].food+', rate: '+colonyList[0].avgResources;
    colonyText.text = 'peasants: '+colonyList[0].freePeasantList.length;

    if (up.isDown)
        game.camera.y -= 4;
    else if (down.isDown)
        game.camera.y += 4;
    if (left.isDown)
        game.camera.x -= 4;
    else if (right.isDown)
        game.camera.x += 4;

    if(game.input.mouse.wheelDelta !== 0) {
        var mult = 0.1;
        var val = game.input.mouse.wheelDelta * mult;
        game.world.scale.x += val;
        game.world.scale.y += val;
        game.input.mouse.wheelDelta = 0;
        game.camera.setPosition(game.camera.x + game.camera.x*val, game.camera.y + game.camera.y*val);
        console.log('scale: '+game.world.scale);
    }

    var posX = game.camera.x*(1/game.world.scale.x);
    var posY = (game.camera.y + game.camera.height)*(1/game.world.scale.y) - 50;

    houseButton.position.set(posX, posY);
    farmButton.position.set(posX + 50, posY);
    barracksButton.position.set(posX + 100, posY);
    mineButton.position.set(posX + 150, posY);
    cancelButton.position.set(posX + 200, posY);

    posX = (game.camera.x + game.camera.width/2)*(1/game.world.scale.x);
    posY = (game.camera.y)*(1/game.world.scale.x);

    leaderButton.position.set(posX - 125, posY);
    regularButton.position.set(posX + 25, posY);



    if(preview !== null)
        preview.position.set(game.input.worldX*(1/game.world.scale.x), game.input.worldY*(1/game.world.scale.y));
}

function render(){

}

function createColonyAndUnitsLeader(){
    var numUnits = 30;

    //Create a colony.
    var colony = new Capitol(game.world.centerX, game.world.centerY, game, 100, 100);
    colonyList[0] = colony;

    //Create a leader
    leader = colony.addFreePeasant('leader', game.world.centerX, game.world.centerY, game, colony);
    leader.blackBoard.moveSpeed = 1.5;

    for(var i=0;i<numUnits;i++)
        var p = colony.addFreePeasant('soldier', game.world.centerX, game.world.centerY, game, colony);

    leader.control = 'manual';
    leader.blackBoard.disToStop = 1;
    var dis = 300;
    var rot = 0;
    var points = 20;

    //Make points in a circle
    for(var i=0;i<points;i++){
        var x = Math.cos(rot*(Math.PI/180))*dis + colony.sprite.x;
        var y = Math.sin(rot*(Math.PI/180))*dis + colony.sprite.y;
        leader.blackBoard.waypoints.push(new Phaser.Point(x, y));
        rot += 360/points;
    }

    var seq:Sequence = new Sequence(leader.blackBoard);
    seq.control.addTask(new FollowWaypoint(leader.blackBoard));
    seq.control.addTask(new Idle(leader.blackBoard));
    leader.blackBoard.idleTime = 10000000000;

    leader.behaviour = seq;

    leader.colony.food = 100000;
    leader.colony.iron = 100000;
}

function createColonyAndUnitsNormal(){
    var colony = new Capitol(game.world.centerX, game.world.centerY, game, 100, 100);
    colonyList[0] = colony;

}

function startExample(){
    /*
     * Incredibly ugly prototype code here. Quick and dirty...
     */

    var colony = new Capitol(game.world.centerX, game.world.centerY, game, 100, 100);
    colonyList[0] = colony;

    var x=game.world.centerX - 300, y=game.world.centerY - 100;
    var width = 40, height = 40;

    //Make some houses
    for(var i=0;i<10;i++)
        colony.addBuilding('house', x, i*40 + y, game, colony, width, height);

    x = game.world.centerX - 350;

    //Make some more houses
    for(var i=0;i<10;i++)
        colony.addBuilding('house', x, i*40 + y, game, colony, width, height);

    x= game.world.centerX + 300;
    y= game.world.centerY - 200;
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

    x = game.world.centerX - 200;
    y = game.world.centerY - 200;

    //Make some mines
    for(var i=0;i<5;i++){
        colony.addBuilding('mine', x, y, game, colony, 75, 75);
        x+=90;
    }
}

function placeBuilding(){
    if(buildingType !== '') {
        var x = (game.input.worldX) * (1 / game.world.scale.x);
        var y = (game.input.worldY) * (1 / game.world.scale.y);
        console.log('x/y: ' + x + '/' + y + ', camera x/y: ' + game.camera.x + '/' + game.camera.y + ' input x/y: ' + game.input.mousePointer.x + '/' + game.input.mousePointer.y);
        colonyList[0].addBuilding(buildingType, x, y, game, colonyList[0], 100, 100);
    }
}

function pressLeader(){
    colonyList[0].destroy();
    createColonyAndUnitsLeader();
}

function pressRegular(){
    colonyList[0].destroy();
    createColonyAndUnitsNormal();
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