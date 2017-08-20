/*
    Creep Role Module
              (model... GET IT?? ROLE MODEL????!!!?!?! *laughs histerically*)

    Roles:
        1. Builder
        2. Distributor
        3. Fixer
        4. Gatherer
        5. Grunt
        6. Harvester
        7. Police
        8. Upgrader


*/

var creepsCommon = require('creeps.common')

var creepsRole = {

    runBuilder: function(creep) {
        
        creepsCommon.initCreep(creep);
        
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }
        
        if(creep.room.controller.level % 2 == 0) {
            var rampartMaxHits = (30000 * Math.pow(10, Math.ceil(creep.room.controller.level / 2)))
        }
        if(creep.room.controller.level % 2 == 1) {
            var rampartMaxHits = (10000 * Math.pow(10, Math.ceil(creep.room.controller.level / 2)))
        }
        
        if(creep.memory.building) {
            var targets = Game.getObjectById(creep.memory.constructionID);
            if(targets) {
                if(targets.structureType != STRUCTURE_WALL && targets.structureType != STRUCTURE_RAMPART) {
                    if(creep.build(targets) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets, [5,,]);
                    }
                }
                else {
                    if(targets.progress) {
                        if(creep.build(targets) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets, [10,,]);
                        }
                    }
                    else {
                        if(targets.hits < (30000 * creep.room.controller.level) || (targets.hits < rampartMaxHits && creep.memory.reinforce)) {
                            if(creep.repair(targets) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(targets, [10,,])
                            }
                        }
                        else {
                            targets = 0
                        }
                    }
                }
            }
            if(!targets) {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
                    filter: (object) => (
                        object.structureType != STRUCTURE_WALL &&
                        object.structureType != STRUCTURE_RAMPART
                    )
                });
                if(targets.length > 0) {
                    creep.memory.constructionID = targets[0].id
                    creep.memory.reinforce = false
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
                        creep.memory.constructionID = targets[0].id
                        creep.memory.reinforce = false
                    }
                    else if(targets.length == 0) {
                        targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
                            filter: (object) => (
                                object.structureType == STRUCTURE_WALL ||
                                object.structureType == STRUCTURE_RAMPART
                            )
                        });
                        if(targets.length > 0) {
                            creep.memory.constructionID = targets[0].id
                            creep.memory.reinforce = false
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
                                creep.memory.constructionID = targets[0].id
                                creep.memory.reinforce = true
                            }
                        }
                    }
                }
            }
        }
        else if(!creep.memory.building) {
            
            creepsCommon.getEnergy(creep);
        }
        
        creepsCommon.renewTTL(creep);
	},






    runDistributor: function(creep) {
        
        creepsCommon.initCreep(creep);
        
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
        
    //Collecting from Harvester
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
        
    //Collecting from Container or Storage
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
        
    //Dropping off at Container or Storage
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
        
    //Dropping off at Useful Locations
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
    //Display the creeps current Status (DISABLED)
    //creep.say(creep.memory.distributing)
    },





    runFixer: function(creep) {
        
        creepsCommon.initCreep(creep);
     
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
        
        creepsCommon.renewTTL(creep);
	},





    runGatherer: function(creep) {
        
        creepsCommon.initCreep(creep);
        
        if(!creep.memory.gathering && creep.carry.energy == 0) {
            creep.memory.gathering = true;
        }
        if(creep.memory.gathering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.gathering = false;
        }
        
        if(!creep.memory.sourceNo) {
            creep.memory.sourceNo = 0
        }
        if(!creep.memory.sourceAvailable) {
            creep.memory.sourceAvailable = 0
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
            //Move Inactive creeps to an Out-Of-The-Way Rally Point (DISABLED)
            //else {
            //    creep.moveTo(26,31)
            //}
        }
	},




    
    runGrunt: function(creep) {
        
        creepsCommon.initCreep(creep);
        
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
    },







    runHarvester: function(creep) {
        
        creepsCommon.initCreep(creep);
        
        var sources = creep.room.find(FIND_SOURCES);
        
        if(!creep.memory.harvesting) {
            creep.memory.harvesting = false
        }
        if(!creep.memory.sourceNo) {
            creep.memory.sourceNo = 0
        }
        if(!creep.memory.harvesting) {
            var otherHarvesters = creep.room.find(FIND_MY_CREEPS, {
                filter: (other) => other.memory.role == 'harvester'
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
    },




    
    runPolice: function(creep) {
        
    },





    runUpgrader: function(creep) {
        
        creepsCommon.initCreep(creep);
        
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





module.exports = creepsRole;



