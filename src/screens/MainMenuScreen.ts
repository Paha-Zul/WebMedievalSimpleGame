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
        this.singleplayerButton = this.game.add.button(200, 200, '', ()=>changeScreen(new GameScreen(this.game)), this, 2, 1, 0);
        this.multiplayerButton = this.game.add.button(200, 400, '', ()=>changeScreen(new GameScreen(this.game)), this, 2, 1, 0);

    }

    update(delta):void {

    }

    destroy():void {
        this.singleplayerButton.destroy(true);
        this.multiplayerButton.destroy(true);
    }
}