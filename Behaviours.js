/// <reference path="./Game.ts"/>
/**
 * Created by Paha on 7/23/2015.
 */
function transfer(unit, disToTarget, disToStop) {
    //If target null and flag false, pick a random building from the colony.
    if (unit.target === null && unit.flag === false) {
        unit.target = unit.colony.buildingList[~~(Math.random() * unit.colony.buildingList.length)];
    }
    else if (unit.target === null && unit.flag === true) {
        unit.target = unit.colony;
    }
    if (disToTarget !== undefined) {
        //If we are inside the range to stop, null the target and flip the flag.
        if (disToTarget <= disToStop) {
            if (unit.target.type === 'building') {
                unit.resources = takeResource(unit.target);
            }
            else if (unit.target.type === 'colony') {
                unit.target.resources += unit.resources;
                unit.resources = 0;
            }
            unit.target = null;
            unit.flag = !unit.flag;
        }
    }
}
//# sourceMappingURL=Behaviours.js.map