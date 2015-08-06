///<reference path="../Game.ts"/>

import Capitol = require('../unit/Capitol');

export class PlayerManager{
    public static players:Player[] = [];
    private static playerID:number = 0;

    static addPlayer(name:string, controller:string, capitol:Capitol):void{
        PlayerManager.players[name] = new Player(name, controller, capitol, PlayerManager.playerID++);
    }

    static getPlayer(name:string):Player{
        return PlayerManager.players[name];
    }

}

export class Player{
    public color;

    constructor(public name:String, public controller:String, public capitol:Capitol, public id:number){
        this.color = RGBtoHEX(~~(Math.random()*255), ~~(Math.random()*255), ~~(Math.random()*255));
    }
}