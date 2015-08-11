///<reference path="../Game.ts"/>

import Capitol = require('../unit/Capitol');
import Helper = require('../util/Helper');


export class PlayerManager{
    public static players:Player[] = [];
    private static playerID:number = 0;

    static addPlayer(name:string, controller:string, capitol?:Capitol, id?:number):Player{
        return PlayerManager.players[name] = new Player(name, controller, capitol, id = PlayerManager.playerID || PlayerManager.playerID++);
    }

    static getPlayer(name:string):Player{
        return PlayerManager.players[name];
    }

}

export class Player{
    public color;

    constructor(public name:String, public controller:String, public capitol:Capitol, public id:number){
        this.color = Helper.RGBtoHEX(~~(Math.random()*255), ~~(Math.random()*255), ~~(Math.random()*255));
    }
}