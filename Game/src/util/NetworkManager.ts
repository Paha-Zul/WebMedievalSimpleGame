///reference path="../Game.ts"/>

import Game from '../Game';

/**
 * Created by Paha on 8/6/2015.
 */
class NetworkManager{
    constructor(){}

    static event(event:string, data:any){
        Game.socket.emit(event, data);
    }
}

export default NetworkManager;