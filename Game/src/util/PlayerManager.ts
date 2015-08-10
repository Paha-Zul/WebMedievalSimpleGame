///<reference path="../Game.ts"/>

import Capitol from '../unit/Capitol';
import Helper from '../util/Helper';


class PlayerManager{
    public static players:Player[] = [];
    private static playerID:number = 1;

    static addPlayer(name:string, controller:string, capitol:Capitol):void{
        PlayerManager.players[name] = new Player(name, controller, capitol, PlayerManager.playerID++);
    }

    static getPlayer(name:string):Player{
        return PlayerManager.players[name];
    }

}

class Player{
    public color;

    constructor(public name:String, public controller:String, public capitol:Capitol, public id:number){
        this.color = Helper.RGBtoHEX(~~(Math.random()*255), ~~(Math.random()*255), ~~(Math.random()*255));
    }
}

export {PlayerManager as PlayerManager, Player as Player};
