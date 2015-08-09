/// <reference path="./../Game.ts"/>
var Helper = (function () {
    function Helper() {
    }
    Helper.makeSquareSprite = function (game, width, height) {
        var bmd = game.add.bitmapData(width, height);
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, width, height);
        bmd.ctx.fillStyle = '#000000';
        bmd.ctx.fill();
        return bmd;
    };
    Helper.takeResource = function (entity) {
        var resources = 0;
        if (entity.resources > 0) {
            resources = 1;
            entity.resources -= 1;
        }
        return resources;
    };
    Helper.RGBtoHEX = function (r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };
    return Helper;
})();
module.exports = Helper;
//# sourceMappingURL=Helper.js.map