/**
 * Created by Paha on 7/23/2015.
 */

function transfer(unit, disToTarget, disToStop){
    //If target null and flag false, pick a random building from the colony.
    if(unit.target === null && unit.flag === false){
        unit.target = unit.colony.buildingList[~~(Math.random()*unit.colony.buildingList.length)];
    //If the target is null and flag true, pick the colony as the target.
    }else if(unit.target === null && unit.flag === true){
        unit.target = unit.colony;
    }

    if(disToTarget !== undefined) {
        //If we are inside the range to stop, null the target and flip the flag.
        if (disToTarget <= disToStop) {
            if(unit.target.type === 'building') {
                unit.resources = takeResource(unit.target);
            }else if(unit.target.type === 'colony'){
                unit.target.resources += unit.resources;
                unit.resources = 0;
            }

            unit.target = null;
            unit.flag = !unit.flag;
        }
    }
}

function followLeader(unit){
    if(unit.targetPos === null) {
        unit.posCounter = unit.leader.posCounter++;
        unit.targetPos = new Phaser.Point(unit.leader.positions[unit.posCounter].x, unit.leader.positions[unit.posCounter].y);
    }else{
        var pos = unit.leader.positions[unit.posCounter];
        var rot = unit.leader.sprite.angle;
        var x = Math.cos(rot)*pos.x - Math.sin(rot)*pos.y;
        var y = Math.sin(rot)*pos.x + Math.cos(rot)*pos.y;

        //console.log('x: '+x+', y: '+y+', rot: '+rot);

        unit.targetPos.x = x + unit.leader.sprite.x;
        unit.targetPos.y = y + unit.leader.sprite.y;
    }
}