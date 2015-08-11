/// <reference path="./../Game.ts"/>
/// <reference path="../../build/socket.io-client.d.ts"/>


/**
 * Created by Paha on 8/4/2015.
 */

import Game = require('../Game');
import Capitol = require('../unit/Capitol');
import NetworkManager = require('../util/NetworkManager');
import PM = require('../util/PlayerManager');
import PlayerManager = PM.PlayerManager
import Player = PM.Player;
import sockio = require('socket.io-client');

declare var url;

class GameScreen implements IScreen{
    foodText:Phaser.Text;
    colonyText:Phaser.Text;
    buildingText:Phaser.Text;

    preview:Phaser.Sprite = null;

    houseKey:Phaser.Key;
    farmKey:Phaser.Key;

    houseButton:Phaser.Button;
    farmButton:Phaser.Button;
    barracksButton:Phaser.Button;
    mineButton:Phaser.Button;
    keepButton:Phaser.Button;
    cancelButton:Phaser.Button;

    buildingType:string = '';

    localPlayer:Player = null;

    constructor(private warGame:Game, public multiplayer:boolean) {

    }

    start = ():void => {
        this.warGame.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.warGame.game.world.setBounds(0,0,2000,2000);

        this.warGame.buildingGroup = this.warGame.game.add.group();
        this.warGame.peasantGroup = this.warGame.game.add.group();
        this.warGame.flagGroup = this.warGame.game.add.group();
        this.warGame.buttonGroup = this.warGame.game.add.group();

        //If multiplayer...
        if(this.multiplayer) {
            console.log('url: '+url);
            this.warGame.socket = sockio.connect(url);
            new NetworkManager(this.warGame, this);

        //Otherwise, some singleplayer fun!
        }else{
            PlayerManager.addPlayer("player1", "human", null);
            PlayerManager.addPlayer("player2", "ai", null);
            //PlayerManager.addPlayer("player3", "ai", null);

            this.startExample(new Phaser.Point(500,500), 'player1', 1);
            this.startExample(new Phaser.Point(1100,1700), 'player2', 1);
            //this.startExample(new Phaser.Point(1900,500), 'player3', 1);

            this.warGame.game.camera.x = PlayerManager.getPlayer('player1').capitol.x - this.warGame.game.camera.width/2;
            this.warGame.game.camera.y = PlayerManager.getPlayer('player1').capitol.y - this.warGame.game.camera.height/2;
        }

        //Adds an event to the mouse.
        this.warGame.game.input.onDown.add(()=> {if(!this.warGame.game.input.disabled) this.placeBuilding();} , this);

        //Some text stuff...
        var text = "- phaser -\n with a sprinkle of \n pixi dust.";
        var style = { font: "20px Arial", fill: "#ff0044", align: "center" };

        this.foodText = this.warGame.game.add.text(0, 0, text, style);
        this.colonyText = this.warGame.game.add.text(0, 20, text, style);
        this.buildingText = this.warGame.game.add.text(0, 40, this.buildingType, style);

        this.houseButton = this.warGame.game.add.button(0, this.warGame.game.world.height - 50, 'buildHouse', ()=>this.setBuildingType('house'), this, 2, 1, 0);
        this.farmButton = this.warGame.game.add.button(60, this.warGame.game.world.height - 50, 'buildFarm', ()=>this.setBuildingType('farm'), this, 2, 1, 0);
        this.barracksButton = this.warGame.game.add.button(120, this.warGame.game.world.height - 50, 'buildBarracks', ()=>this.setBuildingType('barracks'), this, 2, 1, 0);
        this.mineButton = this.warGame.game.add.button(180, this.warGame.game.world.height - 50, 'buildMine', ()=>this.setBuildingType('mine'), this, 2, 1, 0);
        this.keepButton = this.warGame.game.add.button(180, this.warGame.game.world.height - 50, 'buildKeep', ()=>this.setBuildingType('keep'), this, 2, 1, 0);
        this.cancelButton = this.warGame.game.add.button(180, this.warGame.game.world.height - 50, 'buildCancel', ()=>this.setBuildingType(''), this, 2, 1, 0);

        this.warGame.buttonGroup.add(this.houseButton);
        this.warGame.buttonGroup.add(this.farmButton);
        this.warGame.buttonGroup.add(this.barracksButton);
        this.warGame.buttonGroup.add(this.mineButton);
        this.warGame.buttonGroup.add(this.cancelButton);

        this.houseButton.onInputOver.add(()=>this.warGame.game.input.disabled = true, this);
        this.houseButton.onInputOut.add(()=>this.warGame.game.input.disabled = false, this);
        this.farmButton.onInputOver.add(()=>this.warGame.game.input.disabled = true, this);
        this.farmButton.onInputOut.add(()=>this.warGame.game.input.disabled = false, this);
        this.barracksButton.onInputOver.add(()=>this.warGame.game.input.disabled = true, this);
        this.barracksButton.onInputOut.add(()=>this.warGame.game.input.disabled = false, this);
        this.mineButton.onInputOver.add(()=>this.warGame.game.input.disabled = true, this);
        this.mineButton.onInputOut.add(()=>this.warGame.game.input.disabled = false, this);
        this.keepButton.onInputOver.add(()=>this.warGame.game.input.disabled = true, this);
        this.keepButton.onInputOut.add(()=>this.warGame.game.input.disabled = false, this);
        this.cancelButton.onInputOver.add(()=>this.warGame.game.input.disabled = true, this);
        this.cancelButton.onInputOut.add(()=>this.warGame.game.input.disabled = false, this);

        this.warGame.up = this.warGame.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.warGame.down = this.warGame.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.warGame.left = this.warGame.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.warGame.right = this.warGame.game.input.keyboard.addKey(Phaser.Keyboard.D);

        this.warGame.cursors = this.warGame.game.input.keyboard.createCursorKeys();


        //warGame.add.plugin(Phaser.Plugin.Debug);
    };

    update = (delta):void => {
        for(var p in PlayerManager.players)
            PlayerManager.getPlayer(p).capitol.update(delta)

        if (this.warGame.up.isDown)
            this.warGame.game.camera.y -= 4;
        else if (this.warGame.down.isDown)
            this.warGame.game.camera.y += 4;
        if (this.warGame.left.isDown)
            this.warGame.game.camera.x -= 4;
        else if (this.warGame.right.isDown)
            this.warGame.game.camera.x += 4;

        if(this.warGame.game.input.mouse.wheelDelta !== 0) {
            var mult = 0.1;
            var val = this.warGame.game.input.mouse.wheelDelta * mult;
            this.warGame.game.world.scale.x += val;
            this.warGame.game.world.scale.y += val;
            this.warGame.game.input.mouse.wheelDelta = 0;
            this.warGame.game.camera.setPosition(this.warGame.game.camera.x + this.warGame.game.camera.x*val*2, this.warGame.game.camera.y + this.warGame.game.camera.y*val*2);
        }

        var posX = this.warGame.game.camera.x*(1/this.warGame.game.world.scale.x);
        var posY = (this.warGame.game.camera.y + this.warGame.game.camera.height)*(1/this.warGame.game.world.scale.y) - 50;

        this.houseButton.position.set(posX, posY);
        this.farmButton.position.set(posX + 50, posY);
        this.barracksButton.position.set(posX + 100, posY);
        this.mineButton.position.set(posX + 150, posY);
        this.keepButton.position.set(posX + 200, posY);
        this.cancelButton.position.set(posX + 250, posY);

        posX = (this.warGame.game.camera.x)*(1/this.warGame.game.world.scale.x);
        posY = (this.warGame.game.camera.y)*(1/this.warGame.game.world.scale.x);

        if(this.localPlayer !== null && this.localPlayer.capitol !== null) {
            this.foodText.text = 'food: ' + this.localPlayer.capitol.food + ', rate: ' + this.localPlayer.capitol.avgResources;
            this.foodText.position.set(posX, posY);
            this.colonyText.text = 'peasants: ' + this.localPlayer.capitol.freePeasantList.length;
            this.colonyText.position.set(posX, posY + 25);
        }

        if(this.preview !== null)
            this.preview.position.set(this.warGame.game.input.worldX*(1/this.warGame.game.world.scale.x), this.warGame.game.input.worldY*(1/this.warGame.game.world.scale.y));
    };

    destroy = ():void => {

    };

    startExample(start:Phaser.Point, playerName:string, multiplier?:number) {
        /*
         * Incredibly ugly prototype code here. Quick and dirty...
         */

        multiplier = multiplier || 1;

        var numPeasants = 0;
        var numFarms = 8;
        var numMines = 5;
        var numHouses = 10;
        var numBarracks = 2;

        var capitol = new Capitol(start.x, start.y, this.warGame, playerName, this.warGame.buildingGroup.create(0, 0, 'capitol'), 100, 100);
        var player:Player = PlayerManager.getPlayer(playerName);
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

            //Make some houses
            for (var i = 0; i < numHouses; i++)
                capitol.addBuilding('house', x, i * 40 + y);

            x = capitol.sprite.x - 350;

            //Make some more houses
            for (var i = 0; i < numHouses; i++)
                capitol.addBuilding('house', x, i * 40 + y);

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
                capitol.addBuilding('farm', x, y);
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
                capitol.addBuilding('mine', x, y);
                x += 90;
            }
        }
    }

    placeBuilding() {
        if (this.buildingType !== '') {
            var x = (this.warGame.game.input.worldX) * (1 / this.warGame.game.world.scale.x);
            var y = (this.warGame.game.input.worldY) * (1 / this.warGame.game.world.scale.y);
            PlayerManager.getPlayer("player1").capitol.addBuilding(this.buildingType, x, y);
        }
    }

    setBuildingType(type:string) {
        this.buildingType = type;
        this.buildingText.text = type;
        if (this.preview !== null) this.preview.destroy(true);

        if (type !== '') this.preview = this.warGame.game.add.sprite(100, 100, type);
        else this.preview = null;

        if (this.preview !== null) {
            this.preview.anchor.set(0.5, 0.5);
            this.preview.alpha = 0.5;
        }
    }
}

export = GameScreen;