/*

    General functions that Most Creeps use

 */

// For general use functions 

var getEnergy = {

    getEnergy: function(creep) {
        
        var sources = creep.room.find(FIND_STRUCTURES, {
            filter: (object) => (
                (object.structureType == STRUCTURE_CONTAINER ||
                 object.structureType == STRUCTURE_STORAGE)
                && object.store[RESOURCE_ENERGY] > 0
            )
        });
        if(sources.length > 0) {
            sources.sort((a,b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))
            if(sources[0].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], [5,,])
            }
        }
        else {
            var resources = creep.room.find(FIND_DROPPED_ENERGY);
            if(resources.length > 0) {
                if(creep.pickup(resources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resources[0], [5,,])
                }
            }
        }
    }
};









module.exports = getEnergy;
