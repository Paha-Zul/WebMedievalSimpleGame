/**
 * Created by Paha on 8/6/2015.
 */

import Game = require('../Game');
import Unit = require('../unit/Unit');
import GameScreen = require('../screens/GameScreen');
import PlayerManager = require('../util/PlayerManager');

class NetworkManager{
    static game:Game;
    static gameScreen:GameScreen;

    constructor(game:Game, gameScreen:GameScreen){
        NetworkManager.game = game;
        NetworkManager.gameScreen = gameScreen;

        game.socket.on('connected', data => NetworkManager.newPlayer(data));
    }

    static createUnit = (unit:Unit.Unit) => {
      var data = {
          player:unit.playerName,
          playerID: unit.player.id,
          x: unit.sprite.x,
          y: unit.sprite.y,
          unitType: unit.type,
          unitName: unit.name,
          unitID: unit.id
      }
    };

    private static newPlayer(data:any){
        NetworkManager.gameScreen.localPlayer = PlayerManager.PlayerManager.addPlayer(data.playerName, 'human', null, data.ID);
        NetworkManager.gameScreen.startExample(new Phaser.Point(800,800), data.playerName, 1);
    }
}

export = NetworkManager;