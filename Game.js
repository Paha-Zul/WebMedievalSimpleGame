var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render : render});
var colonyList = [];
var placed = false;

var foodText = null;
var leader = null;
var stage = 0;

function preload () {
    game.load.image('logo', 'phaser.png');
    this.game.stage.backgroundColor = '#DDDDDD'
}

function create () {
    game.physics.startSystem(Phaser.Physics.ARCADE);


    //Adds an event to the mouse.
    game.input.onDown.add(placeBuilding , this);

    var text = "- phaser -\n with a sprinkle of \n pixi dust.";
    var style = { font: "32px Arial", fill: "#ff0044", align: "center" };

    foodText = game.add.text(game.world.centerX-300, 0, text, style);

    leader.control = 'manual';
}

function update() {
    var l = colonyList.length;
    for(var i=0;i<l;i++)
        colonyList[i].update(game.time.physicsElapsedMS);

    foodText.text = ''+colonyList[0].resources+', rate: '+colonyList[0].avgResources;
    test();
}

function render(){

}

function createColonyAndUnits(){
    var colony = newColony(game, game.world.centerX, game.world.centerY);
    colonyList.push(colony);
    for(var i=0;i<20;i++) {
        if(i === 0)
            leader = colony.addFreePeasant(game, colony, game.world.centerX, game.world.centerY);
        else {
            var p = colony.addFreePeasant(game, colony, game.world.centerX, game.world.centerY);
            p.leader = leader;
        }
    }

    var amt = 20;
    var spacing = 20;
    var lines = 2;

    for(i=0;i<amt;i++){
        var index = ~~(i/~~(amt/lines));
        var div = ~~(amt/lines);
        var x = -(index+1)*20;
        var y = i%div*spacing - (amt/lines)/2*spacing;
        leader.positions.push(new Phaser.Point(x, y));
    }
}

function placeBuilding(){
    colonyList[0].buildingList.push(newBuilding(game, game.input.activePointer.x, game.input.activePointer.y));
}

function test(){
    if(stage === 0)
        leader.walkTowardsPosition(new Phaser.Point(700,game.world.centerY), 5);
}