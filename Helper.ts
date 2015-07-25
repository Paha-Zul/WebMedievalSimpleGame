/// <reference path="./Game.ts"/>

function makeSquareSprite(width, height) : Phaser.Sprite{
    var bmd = game.add.bitmapData(width, height);

    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = '#000000';
    bmd.ctx.fill();
    var sprite = game.add.sprite(game.world.centerX, game.world.centerY, bmd);
    sprite.anchor.setTo(0.5, 0.5);

    return sprite;
}

function takeResource(entity){
    var resources = 0;
    if(entity.resources > 0) {
        resources = 1;
        entity.resources -= 1;
    }

    return resources;
}