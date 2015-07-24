
function newBuilding(game, x, y){
    var building = {
        game: game,
        name: "farm",
        type: 'building',
        resources: 1,
        refillTime: 1000,
        counter: 0,
        sprite: makeSquareSprite(30, 30),

        update: function(delta){
            //If we have 0 resources, wait some time before refilling.
            if(this.resources === 0){
                this.counter += delta; //Increment
                if(this.counter >= this.refillTime){
                    this.counter = 0; //Reset
                    this.resources = 1; //Reset
                }
            }
        }
    };

    building.sprite.x = x;
    building.sprite.y = y;

    return building;
}