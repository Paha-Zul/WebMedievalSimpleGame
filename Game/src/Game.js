/// <reference path="./../build/node.d.ts"/>
/// <reference path="./../build/socket.io.d.ts"/>
/// <reference path="./../build/phaser.d.ts"/>
define(["require", "exports", 'socket.io', './screens/MainMenuScreen'], function (require, exports, io, MainMenuScreen) {
    var socket = io('http://localhost');
    socket.on('such', function (data) {
        console.log('Okay');
    });
    'use strict';
    var Game = (function () {
        function Game() {
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
                preload: this.preload,
                create: this.create,
                update: this.update,
                render: this.render
            });
            this.currScreen = null;
        }
        Game.prototype.preload = function () {
            this.game.load.image('normal', 'Game/img/normal_button.png');
            this.game.load.image('war', 'Game/img/war_button.png');
            this.game.load.image('house', 'Game/img/house.png');
            this.game.load.image('farm', 'Game/img/farm.png');
            this.game.load.image('capitol', 'Game/img/capitol.png');
            this.game.load.image('barracks', 'Game/img/barracks.png');
            this.game.load.image('mine', 'Game/img/mine.png');
            this.game.load.image('keep', 'Game/img/capitol.png');
            this.game.load.image('flag', 'Game/img/flag.png');
            this.game.load.image('buildBarracks', 'Game/img/button_barracks.png');
            this.game.load.image('buildHouse', 'Game/img/button_house.png');
            this.game.load.image('buildFarm', 'Game/img/button_farm.png');
            this.game.load.image('buildMine', 'Game/img/button_mine.png');
            this.game.load.image('buildCancel', 'Game/img/button_cancel.png');
            this.game.load.image('buildKeep', 'Game/img/button_keep.png');
            this.game.load.spritesheet('mainMenuButtons', 'Game/img/MainMenuButtons.png', 100, 50);
            this.game.stage.backgroundColor = '#DDDDDD';
            this.game.stage.disableVisibilityChange = true; //Apparently turns off pausing while in the background...
        };
        Game.prototype.create = function () {
            this.changeScreen(new MainMenuScreen(this));
        };
        Game.prototype.update = function () {
            if (this.currScreen !== null)
                this.currScreen.update(this.game.time.physicsElapsedMS);
        };
        Game.prototype.render = function () {
            //for(var i=0;i<colonyList[0].freePeasantList.length;i++){
            //    warGame.debug.body(colonyList[0].freePeasantList[i].sprite);
            //}
            //for(var p in PlayerManager.players) {
            //    var player:Player = PlayerManager.getPlayer(p);
            //    var l = player.capitol.freePeasantList.length;
            //    for (var i = 0; i < l; i++){
            //        warGame.debug.body(player.capitol.freePeasantList[i].sprite);
            //    }
            //}
        };
        Game.prototype.changeScreen = function (screen) {
            if (this.currScreen !== null)
                this.currScreen.destroy();
            this.currScreen = screen;
            this.currScreen.start();
        };
        return Game;
    })();
    new Game();
    return Game;
});
//# sourceMappingURL=Game.js.map