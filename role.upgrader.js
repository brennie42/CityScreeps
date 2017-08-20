/*
    
    Upgrader Creep
    
 */

var creepsCommon = require('creeps.common')

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	    }

	    if(creep.memory.upgrading) {
            if(creep.pos.inRangeTo(creep.room.controller,2)) {
                creep.upgradeController(creep.room.controller)
	        }
	        else {
                creep.moveTo(creep.room.controller, [5,,]);
            }
        }
        else {
            creepsCommon.getEnergy(creep);
        }
	}
};

module.exports = roleUpgrader;