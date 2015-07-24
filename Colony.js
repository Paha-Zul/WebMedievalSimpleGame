/**
 * Created by Paha on 7/23/2015.
 */
var playerCounter = 0;

function newColony(game, x, y){
    var colony = {
        game: game,
        name: 'colony',
        type: 'colony',
        player: playerCounter++,
        sprite: makeSquareSprite(50, 50),
        freePeasantList: [],
        workerList: [],
        buildingList: [],
        armyList: [],
        resources: 0,
        lastResources: 0,
        avgResources: 0,
        timer: null,

        update: function(delta){
            if(this.timer === null)
                this.timer = this.game.time.events.loop(Phaser.Timer.SECOND*1, this.calcRate, this)

            var i=0;
            for(i=0;i<this.freePeasantList.length;i++)
                this.freePeasantList[i].update(delta);
            for(i=0;i<this.workerList.length;i++)
                this.workerList[i].update(delta);
            for(i=0;i<this.armyList.length;i++)
                this.armyList[i].update(delta);
            for(i=0;i<this.buildingList.length;i++)
                this.buildingList[i].update(delta);

        },

        addFreePeasant: function(game, colony, x, y){
            var unit = newUnit(game, colony, x, y);
            this.freePeasantList.push(unit);
            return unit;
        },

        calcRate: function(){
            this.avgResources = this.resources - this.lastResources;
            this.lastResources = this.resources;
        }
    };

    colony.sprite.x = x;
    colony.sprite.y = y;

    return colony;
}