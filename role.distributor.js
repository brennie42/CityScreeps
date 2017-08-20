 /*

    Distributor Creep

 */

var roleDistributor = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var sources = creep.room.find(FIND_SOURCES)
        var numOfSources = sources.length
        
        if(!creep.memory.distributing) {
            creep.memory.distributing = 0
        }
        if(!creep.memory.sourceNo && creep.memory.sourceNo != 0) {
            creep.memory.sourceNo = -1
        }
        
        if(creep.memory.sourceNo == -1) {
            var tables = [];
            for(var i = 0; i < numOfSources; i++) {
                tables[i] = {num: 0, spot:0};
            }
            for(var i = 0; i < numOfSources; i++) {
                var otherNumber =creep.room.find(FIND_MY_CREEPS, {
                    filter: (other) => {
                        return((other.memory.role == 'distributor')
                            && (other.memory.sourceNo == i))
                    }
                });
                if(!otherNumber) {
                    tables[i].num = 0;
                }
                else {
                    tables[i].num = otherNumber.length;
                }
                tables[i].spot = i
            }
            tables.sort((a,b) => (a.num - b.num));
            creep.memory.sourceNo = tables[0].spot;
        }
        
        if(creep.memory.distributing == 0) {
            var resources = creep.room.find(FIND_DROPPED_ENERGY, {
                filter: (other) => {
                    return(other.pos.isNearTo(sources[creep.memory.sourceNo]))
                }
            });
            if(resources.length > 0) {
                if(creep.pickup(resources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resources[0], [5,,])
                }
                if(creep.carry[RESOURCE_ENERGY] > 0) {
                    creep.memory.distributing = 2
                }
            }
            if(resources.length == 0) {
                creep.memory.distributing = 1
            }
        }
        
        if(creep.memory.distributing == 1) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_STORAGE);
                }
            });
            if(targets.length > 0) {
                targets.sort((b,a) => {return (a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY])});
                if(targets[0].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], [5,,])
                }
                else if(targets[0].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_ENOUGH_RESOURCES) {
                    creep.memory.distributing = 0
                }
                if(creep.carry[RESOURCE_ENERGY] > (creep.carryCapacity / 2)) {
                    creep.memory.distributing = 3
                }
            }
            if(targets.length == 0) {
                creep.memory.distributing = 0
            }
        }
        
        if(creep.memory.distributing == 2){
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER ||
                                 structure.structureType == STRUCTURE_STORAGE) 
                            && (structure.store[RESOURCE_ENERGY] < structure.storeCapacity));
                    }
            });
            if(targets.length > 0) {
                targets.sort((a,b) => {return (a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))});
                targets.sort((a,b) => {return (a.structureType == STRUCTURE_STORAGE)})
                if(creep.carry[RESOURCE_ENERGY] == 0) {
                    creep.memory.distributing = 0
                    if(Math.random() > (6 / 10)) {
                        creep.memory.distributing = 1
                    }
                }
                else if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], [5,,]);
                }
            }
            else if (targets.length == 0) {
                creep.memory.distributing = 3
            }
        }
        if(creep.memory.distributing == 3) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_EXTENSION) 
                                && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                targets.sort((a,b) => {return(a.energy - b.energy)});
                targets.sort((a,b) => {return(a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))});
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], [5,,]);
                }
            }
            else if(targets.length == 0){
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER)
                            && (structure.energy < structure.energyCapacity);
                    }
                })
                if(targets.length > 0) {
                    targets.sort((a,b) => {return(a.energy - b.energy)});
                    targets.sort((a,b) => {return(a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))});
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], [5,,]);
                    }
                }
                else if(targets.length == 0){
                    creep.memory.distributing = 2
                }
            }
            
            if(creep.carry[RESOURCE_ENERGY] == 0) {
                creep.memory.distributing = 1
            }
        }
    //Display the creeps current Status 
    //creep.say(creep.memory.distributing)
    }
};

module.exports = roleDistributor;