/*

    Harvester Creep
    
 */

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var sources = creep.room.find(FIND_SOURCES);
        
        if(!creep.memory.harvesting) {
            creep.memory.harvesting = false
        }
        if(!creep.memory.sourceNo) {
            creep.memory.sourceNo = 0
        }
        if(!creep.memory.harvesting) {
            var otherHarvesters = creep.room.find(FIND_CREEPS, {
                filter: function(other) {
                    return (other.memory.role == 'harvester')
                }
            });
            if(otherHarvesters.length > 0) {
                otherHarvesters.sort((a,b) => {return (b.memory.sourceNo - a.memory.sourceNo)});
                creep.memory.sourceNo = (otherHarvesters[0].memory.sourceNo + 1)
                if(creep.memory.sourceNo >= sources.length) {
                    otherHarvesters.sort((a,b) => {return (b.memory.sourceNo - a.memory.sourceNo)});
                    if(!otherHarvesters[0].memory.sourceNo == 0) {
                        creep.memory.sourceNo = 0;
                        creep.memory.harvesting = true;
                    }
                    else {
                        console.log(creep.name +' cant find an unused source!');
                    }
                }
                else {
                    creep.memory.harvesting = true;
                }
            }
            else if(otherHarvesters.length == 0) {
                creep.memory.harvesting = true;
            }
        }
        if(creep.memory.harvesting) {
            if(creep.harvest(sources[creep.memory.sourceNo]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.sourceNo], [5,,])
            }
        }
    }
}

module.exports = roleHarvester;