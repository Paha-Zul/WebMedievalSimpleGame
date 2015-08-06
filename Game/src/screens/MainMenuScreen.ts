/// <reference path="./../Game.ts"/>

/**
 * Created by Paha on 8/4/2015.
 */

import _Game = require('Game');
import _GameScreen = require('GameScreen');

class MainMenuScreen implements IScreen{
    singleplayerButton:Phaser.Button;
    multiplayerButton:Phaser.Button;

    constructor(private warGame:_Game){

    }

    start():void {
        var x = this.warGame.game.camera.width/2 - 50;
        var y = 100;

        this.singleplayerButton = this.warGame.game.add.button(x, y, 'mainMenuButtons', ()=>this.warGame.changeScreen(new _GameScreen(this.warGame)), this, 2, 1, 0);
        this.multiplayerButton = this.warGame.game.add.button(x, y + 100, 'mainMenuButtons', ()=>this.warGame.changeScreen(new _GameScreen(this.warGame)), this, 5, 4, 3);

    }

    update(delta):void {

    }

    destroy():void {
        this.singleplayerButton.destroy(true);
        this.multiplayerButton.destroy(true);
    }
}

export = MainMenuScreen;