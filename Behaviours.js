/// <reference path="./Game.ts"/>
/**
 * Created by Paha on 7/23/2015.
 */
function transfer(unit, disToTarget, disToStop) {
    //If target null and flag false, pick a random buildingType from the colony.
    if (unit.target === null && unit.flag === false) {
        unit.target = unit.colony.buildingList[~~(Math.random() * unit.colony.buildingList.length)];
    }
    else if (unit.target === null && unit.flag === true) {
        unit.target = unit.colony;
    }
    if (disToTarget !== undefined) {
        //If we are inside the range to stop, null the target and flip the flag.
        if (disToTarget <= disToStop) {
            if (unit.target.type === 'buildingType') {
                unit.resources = takeResource(unit.target);
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