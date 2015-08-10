/// <reference path="./../Game.ts"/>

/**
 * Created by Paha on 8/4/2015.
 */

import Game from '../Game';
import GameScreen from './GameScreen';

class MainMenuScreen implements IScreen{
    singleplayerButton:Phaser.Button;
    multiplayerButton:Phaser.Button;

    constructor(private warGame:Game){

    }

    start():void {
        var x = this.warGame.game.camera.width/2 - 50;
        var y = 100;

        this.singleplayerButton = this.warGame.game.add.button(x, y, 'mainMenuButtons', ()=>this.warGame.changeScreen(new GameScreen(this.warGame)), this, 2, 1, 0);
        this.multiplayerButton = this.warGame.game.add.button(x, y + 100, 'mainMenuButtons', ()=>this.warGame.changeScreen(new GameScreen(this.warGame)), this, 5, 4, 3);

    }

    update(delta):void {

    }

    destroy():void {
        this.singleplayerButton.destroy(true);
        this.multiplayerButton.destroy(true);
    }
}

export default MainMenuScreen;