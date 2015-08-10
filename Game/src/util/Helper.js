/// <reference path="./../Game.ts"/>
class Helper {
    static makeSquareSprite(game, width, height) {
        var bmd = game.add.bitmapData(width, height);
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, width, height);
        bmd.ctx.fillStyle = '#000000';
        bmd.ctx.fill();
        return bmd;
    }
    static takeResource(entity) {
        var resources = 0;
        if (entity.resources > 0) {
            resources = 1;
            entity.resources -= 1;
        }
        return resources;
    }
    static RGBtoHEX(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
}
export default Helper;
//# sourceMappingURL=Helper.js.map