/// <reference path="./../Game.ts"/>
var Helper = require('../util/Helper');
/**
 * Created by Paha on 7/23/2015.
 */
function transfer(unit, disToTarget, disToStop) {
    //If target null and flag false, pick a random buildingType from the colony.
    if (unit.target === null && unit.flag === false) {
        unit.target = unit.playerName.buildingList[~~(Math.random() * unit.playerName.buildingList.length)];
    }
    else if (unit.target === null && unit.flag === true) {
        unit.target = unit.playerName;
    }
    if (disToTarget !== undefined) {
        //If we are inside the range to stop, null the target and flip the flag.
        if (disToTarget <= disToStop) {
            if (unit.target.type === 'buildingType') {
                //TODO Wrong don't use this function!!
                unit.resources = Helper.takeResource(unit.target);
            }
            else if (unit.target.type === 'colony') {
                unit.target.food += unit.resources;
                unit.resources = 0;
            }
            unit.target = null;
            unit.flag = !unit.flag;
        }
    }
}
//# sourceMappingURL=Behaviours.js.map