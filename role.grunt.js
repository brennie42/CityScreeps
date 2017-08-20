/*
    
    Grunt Creep
    Basic Light Melee Offensive Creep
    
 */

var roleGrunt = {
    run: function(creep) {
        if(!creep.memory.idle) {
            creep.memory.idle = false
        }
        if(!creep.memory.attackMode) {
            creep.memory.attackMode = 0
        }
        
        if(creep.memory.attackMode = 0) {
            var nearestEnemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
            if(nearestEnemy) {
                if (nearestEnemy.length > 0) {
                    creep.memory.idle = false
                    if (creep.attack(nearestEnemy[0]) == ERR_NOT_IN_RANGE) {
                        var onRampart = creep.pos.findClosestByRange(FIND_MY_STRUCTURES)
                        if (creep.pos == onRampart[0].pos){
                            creep.moveTo(nearestEnemy[0])
                        }
                    }
                }
                else {
                    var nearestEnemy = creep.pos.findClosestByPath(FIND_HOSTILE_CONSTRUCTION_SITES)
                    if (nearestEnemy) {
                        if (creep.attack(nearestEnemy[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(nearestEnemy[0])
                       }
                    }
                    else {
                        var nearestEnemy = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES)
                        if (nearestEnemy) {
                            if (creep.attack(nearestEnemy[0]) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(nearestEnemy[0])
                            }
                        }
                    }
                }
            }
            if(creep.memory.idle) {
                creep.moveTo(10,25, [5,,])
                if(creep.pos.isNearTo(10,25)) {
                    creep.memory.idle = true
                }
            }
        }
        
        var changeRoom = 1
        creep.memory.attackMode = 1;
        creep.memory.idle = false;
        creep.memory.attackDirection = FIND_EXIT_LEFT;
        creep.memory.thePowerOfGrapes = 1;
        
        if(creep.memory.attackMode = 1) {
            creep.memory.idle = false;
            var nearestEnemy = creep.room.find(FIND_HOSTILE_STRUCTURES)
            if(nearestEnemy !== undefined) {
                nearestEnemy.sort((a,b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))
                if (creep.attack(nearestEnemy[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearestEnemy[0]);
                }
            }
            if(nearestEnemy == undefined) {
                var nearestEnemy = creep.room.find(FIND_HOSTILE_CREEPS, {
                    filter: (other) => {
                        return(other.hits > 0)
                    }
                });
                if(nearestEnemy !== undefined) {
                    nearestEnemy.sort((a,b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))
                    creep.attack(nearestEnemy[0]);
                    creep.moveTo(nearestEnemy[0]);
                }
                if(nearestEnemy == undefined) {
                    creep.say(' ')
                    var nearestEnemy = creep.pos.findClosestByPath(FIND_HOSTILE_CONSTRUCTION_SITES)
                    if(nearestEnemy) {
                        nearestEnemy.sort((a,b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))
                        if (creep.attack(nearestEnemy[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(nearestEnemy[0]);
                       }
                    }
                    if(nearestEnemy == undefined) {
                        changeRoom = 1
                    }
                }
            }
            
            if(changeRoom) {
                var roomExit = creep.pos.findClosestByRange(FIND_EXIT_LEFT);
                if(roomExit) {
                    creep.moveTo(roomExit)
                }
                if(!roomExit) {
                    creep.move(LEFT)
                }
            }
        }
    } 
};

module.exports = roleGrunt;
































