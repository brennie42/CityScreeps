/*

    Builder Creep

 */

var creepsCommon = require('creeps.common')

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }
        
        if(creep.room.controller.level % 2 == 0) {
            rampartMaxHits = (30000 * Math.pow(10, Math.ceil(creep.room.controller.level / 2)))
        }
        if(creep.room.controller.level % 2 == 1) {
            rampartMaxHits = (10000 * Math.pow(10, Math.ceil(creep.room.controller.level / 2)))
        }
        
        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
                filter: (object) => (
                    object.structureType != STRUCTURE_WALL &&
                    object.structureType != STRUCTURE_RAMPART
                )
            });
            if(targets.length > 0) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], [5,,]);
                }
            }
            else if(targets.length == 0) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (object) => (
                        (object.structureType == STRUCTURE_WALL ||
                         object.structureType == STRUCTURE_RAMPART) 
                        && object.hits < (30000 * creep.room.controller.level)
                    )
                });
                if(targets.length > 0) {
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], [10,,])
                    }
                }
                else if(targets.length == 0) {
                    targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
                        filter: (object) => (
                            object.structureType == STRUCTURE_WALL ||
                            object.structureType == STRUCTURE_RAMPART
                        )
                    });
                    if(targets.length > 0) {
                        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], [5,,]);
                        }
                    }
                    else if(targets.length == 0) {
                        targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (object) => (
                                (object.structureType == STRUCTURE_WALL ||
                                 object.structureType == STRUCTURE_RAMPART) 
                                && object.hits < (rampartMaxHits)
                            )
                        });
                        if(targets.length > 0) {
                            if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(targets[0], [10,,])
                            }
                        }
                    }
                }
            }
        }
        else {
            creepsCommon.getEnergy(creep);
        }
	}
};

module.exports = roleBuilder;