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

        game.socket.on('connected', data => NetworkManager.newPlayer(data, true));
        game.socket.on('playerConnected', data => NetworkManager.newPlayer(data, false));

        game.socket.on('created', data => NetworkManager.gotCreateUnit(data))
    }

    static createUnit = (unit:Unit.Unit) => {
      var data:CreatedData = {
          playerName:unit.playerName,
          playerID: unit.player.id,
          x: unit.sprite.x,
          y: unit.sprite.y,
          unitType: unit.type,
          unitName: unit.name,
          unitID: unit.id
      };

        NetworkManager.game.socket.emit('created', data);
    };

    private static gotCreateUnit(data:CreatedData){
        var player:PlayerManager.Player = PlayerManager.PlayerManager.getPlayer(data.playerName);
        if(player === null || player === undefined){
            console.log("Player "+data.playerName+" tried to create a unit, but the PLAYER doesn't exist!");
            return;
        }

        if(player.capitol === null){
            console.log("Player "+data.playerName+" tried to create a unit, but the player CAPITOL doesn't exist!");
            return;
        }

        if(data.unitType === 'peasant'){
            player.capitol.addFreePeasant(data.unitName, data.x, data.y, data.unitID);
        }else if(data.unitType === 'building'){
            player.capitol.addBuilding(data.unitName, data.x, data.y)
        }
    }

    private static newPlayer(data:any, myPlayer:boolean){
        if(myPlayer) //Set as local
            NetworkManager.gameScreen.localPlayer = PlayerManager.PlayerManager.addPlayer(data.playerName, 'human', null, data.ID);
        else //Don't set as local
            PlayerManager.PlayerManager.addPlayer(data.playerName, 'human', null, data.ID);

        NetworkManager.gameScreen.startExample(new Phaser.Point(800,800), data.playerName, 1);
    }
}

interface CreatedData{
    playerName:string;
    playerID:number;
    x: number;
    y: number;
    unitType: string;
    unitName: string;
    unitID: number;
}

export = NetworkManager;