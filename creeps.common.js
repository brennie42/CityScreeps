/*

    General functions that Most Creeps use

 */

var creepsCommon = {
    
    initCreep: function(creep) {
        
        if(!creep.memory.initSuccess) {
            var homeSpawn = creep.room.find(FIND_MY_SPAWNS);
            creep.memory.homeSpawnID = homeSpawn[0].id
            
            creep.memory.initSuccess = true
        }
    },



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
            var sources = creep.room.find(FIND_DROPPED_ENERGY);
            if(sources.length > 0) {
                sources.sort((b,a) => a.amount - b.amount)
                if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], [5,,])
                }
            }
        }
    },



    
    renewTTL: function(creep) {
        
        var homeSpawn = Game.getObjectById(creep.memory.homeSpawnID)
        
        if(creep.hits > 1499) {
            if(creep.ticksToLive < 100 || creep.memory.renewing) {
                console.log(creep.cancelOrder('move'))
                creep.memory.renewing = true
                if(homeSpawn.renewCreep(creep) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(homeSpawn)
                }
            }
        }
        
        if(creep.ticksToLive > 1400) {
            creep.memory.renewing = false
        }
    }
};







module.exports = creepsCommon;
