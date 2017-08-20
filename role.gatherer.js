/*
    
    Very basic Gatherer Creep
    
 */

var roleGatherer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(!creep.memory.gathering && creep.carry.energy == 0) {
            creep.memory.gathering = true;
        }
        if(creep.memory.gathering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.gathering = false;
        }
        
        var sources = creep.room.find(FIND_SOURCES);
        
        if(creep.memory.gathering) {
              var resources = creep.room.find(FIND_DROPPED_ENERGY, {
                filter: (other) => {
                    return(other.pos.isNearTo(sources[creep.memory.sourceNo]))
                }
            });
            if(resources.length > 0) {
                if(creep.pickup(resources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resources[0], [5,,])
                }
            }
            else if(resources.length == 0) {
                if(creep.harvest(sources[creep.memory.sourceNo]) == ERR_NOT_IN_RANGE) {
                    var canReach = creep.pos.getRangeTo(sources[creep.memory.sourceNo]) + 1
                    if(canReach == 2 || canReach == 3){
                        creep.memory.sourceAvailable = creep.memory.sourceAvailable + 1;
                        if(creep.memory.sourceAvailable > 10){
                            creep.memory.sourceAvailable = 0;
                            creep.memory.sourceNo = creep.memory.sourceNo + 1;
                            if(creep.memory.sourceNo >= sources.length) {
                                creep.memory.sourceNo = 0;
                            } 
                        }
                    }
                    creep.moveTo(sources[creep.memory.sourceNo], [5,,]);
                }
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN)
                                && structure.energy < structure.energyCapacity)
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], [5,,]);
                }
            }
            else if (targets.length == 0 && creep.carry.energy == creep.carryCapacity){
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return((structure.structureType == STRUCTURE_CONTAINER ||
                               structure.structureType == STRUCTURE_STORAGE)
                               && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
                    }
                });
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], [5,,]);
                    }
                }
            }
            else if (targets.length == 0 && creep.carry.energy < creep.carryCapacity){
                creep.memory.gathering = true
            }
            //else {
            //    creep.moveTo(26,31)
            //}
        }
	}
};

module.exports = roleGatherer;