/// <reference path="./../Game.ts"/>

/**
 * Created by Paha on 8/4/2015.
 */

class GameScreen implements IScreen{

    constructor(private game:Phaser.Game) {
    }

    start():void {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0,0,2000,2000);

        PlayerManager.addPlayer("player1", "human", null);
        PlayerManager.addPlayer("player2", "ai", null);
        PlayerManager.addPlayer("player3", "ai", null);

        buildingGroup = game.add.group();
        peasantGroup = game.add.group();
        flagGroup = game.add.group();
        buttonGroup = game.add.group();

        startExample(new Phaser.Point(500,500), 'player1', 1);
        startExample(new Phaser.Point(1100,1700), 'player2', 1);
        startExample(new Phaser.Point(1900,500), 'player3', 1);
        game.camera.x = PlayerManager.getPlayer('player1').capitol.x - game.camera.width/2;
        game.camera.y = PlayerManager.getPlayer('player1').capitol.y - game.camera.height/2;

        //Adds an event to the mouse.
        game.input.onDown.add(()=> {if(!game.input.disabled) placeBuilding();} , this);

        //Some text stuff...
        var text = "- phaser -\n with a sprinkle of \n pixi dust.";
        var style = { font: "20px Arial", fill: "#ff0044", align: "center" };

        foodText = game.add.text(0, 0, text, style);
        colonyText = game.add.text(0, 20, text, style);
        buildingText = game.add.text(0, 40, buildingType, style);

        houseButton = game.add.button(0, game.world.height - 50, 'buildHouse', ()=>setBuildingType('house'), this, 2, 1, 0);
        farmButton = game.add.button(60, game.world.height - 50, 'buildFarm', ()=>setBuildingType('farm'), this, 2, 1, 0);
        barracksButton = game.add.button(120, game.world.height - 50, 'buildBarracks', ()=>setBuildingType('barracks'), this, 2, 1, 0);
        mineButton = game.add.button(180, game.world.height - 50, 'buildMine', ()=>setBuildingType('mine'), this, 2, 1, 0);
        keepButton = game.add.button(180, game.world.height - 50, 'buildKeep', ()=>setBuildingType('keep'), this, 2, 1, 0);
        cancelButton = game.add.button(180, game.world.height - 50, 'buildCancel', ()=>setBuildingType(''), this, 2, 1, 0);

        buttonGroup.add(houseButton);
        buttonGroup.add(farmButton);
        buttonGroup.add(barracksButton);
        buttonGroup.add(mineButton);
        buttonGroup.add(cancelButton);

        houseButton.onInputOver.add(()=>game.input.disabled = true, this);
        houseButton.onInputOut.add(()=>game.input.disabled = false, this);
        farmButton.onInputOver.add(()=>game.input.disabled = true, this);
        farmButton.onInputOut.add(()=>game.input.disabled = false, this);
        barracksButton.onInputOver.add(()=>game.input.disabled = true, this);
        barracksButton.onInputOut.add(()=>game.input.disabled = false, this);
        mineButton.onInputOver.add(()=>game.input.disabled = true, this);
        mineButton.onInputOut.add(()=>game.input.disabled = false, this);
        keepButton.onInputOver.add(()=>game.input.disabled = true, this);
        keepButton.onInputOut.add(()=>game.input.disabled = false, this);
        cancelButton.onInputOver.add(()=>game.input.disabled = true, this);
        cancelButton.onInputOut.add(()=>game.input.disabled = false, this);

        up = game.input.keyboard.addKey(Phaser.Keyboard.W);
        down = game.input.keyboard.addKey(Phaser.Keyboard.S);
        left = game.input.keyboard.addKey(Phaser.Keyboard.A);
        right = game.input.keyboard.addKey(Phaser.Keyboard.D);

        cursors = game.input.keyboard.createCursorKeys();

        //game.add.plugin(Phaser.Plugin.Debug);
    }

    update(delta):void {
        var player:Player = PlayerManager.getPlayer("player1");

        for(var p in PlayerManager.players)
            PlayerManager.getPlayer(p).capitol.update(delta)

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
            game.camera.setPosition(game.camera.x + game.camera.x*val*2, game.camera.y + game.camera.y*val*2);
        }

        var posX = game.camera.x*(1/game.world.scale.x);
        var posY = (game.camera.y + game.camera.height)*(1/game.world.scale.y) - 50;

        houseButton.position.set(posX, posY);
        farmButton.position.set(posX + 50, posY);
        barracksButton.position.set(posX + 100, posY);
        mineButton.position.set(posX + 150, posY);
        keepButton.position.set(posX + 200, posY);
        cancelButton.position.set(posX + 250, posY);

        posX = (game.camera.x)*(1/game.world.scale.x);
        posY = (game.camera.y)*(1/game.world.scale.x);

        foodText.text = 'food: '+player.capitol.food+', rate: '+player.capitol.avgResources;
        foodText.position.set(posX, posY);
        colonyText.text = 'peasants: '+player.capitol.freePeasantList.length;
        colonyText.position.set(posX, posY+25);

        if(preview !== null)
            preview.position.set(game.input.worldX*(1/game.world.scale.x), game.input.worldY*(1/game.world.scale.y));
    }

    destroy():void {

    }
}