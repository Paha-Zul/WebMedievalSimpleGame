/// <reference path="./../Game.ts"/>

/**
 * Created by Paha on 8/4/2015.
 */

class MainMenuScreen implements IScreen{
    singleplayerButton:Phaser.Button;
    multiplayerButton:Phaser.Button;

    constructor(private game:Phaser.Game){

    }

    start():void {
        var x = this.game.camera.width/2 - 50;
        var y = 100;

        this.singleplayerButton = this.game.add.button(x, y, 'mainMenuButtons', ()=>changeScreen(new GameScreen(this.game)), this, 2, 1, 0);
        this.multiplayerButton = this.game.add.button(x, y + 100, 'mainMenuButtons', ()=>changeScreen(new GameScreen(this.game)), this, 5, 4, 3);

    }

    update(delta):void {

    }

    destroy():void {
        this.singleplayerButton.destroy(true);
        this.multiplayerButton.destroy(true);
    }
}