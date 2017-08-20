/*
    
    Fixer Creep
    
 */

var creepsCommon = require('creeps.common')

var roleFixer = {

    /** @param {Creep} creep **/
    run: function(creep) {
     
        if(creep.memory.fixing && creep.carry.energy == 0) {
            creep.memory.fixing = false;
        }
        if(!creep.memory.fixing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.fixing = true;
        }
        
        if(creep.memory.fixing) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => (object.hits < object.hitsMax &&
                    object.structureType != STRUCTURE_WALL &&
                    object.structureType != STRUCTURE_RAMPART)
            });
            if(targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);    
                }
            }
        }
        
        else {
        creepsCommon.getEnergy(creep);
        }
	}
};

module.exports = roleFixer;