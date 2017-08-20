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
        else {
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
        
        creepsCommon.renewTTL(creep);
    
    //Display the creeps current Status (DISABLED)
    //creep.say(creep.memory.distributing)
    },




    runFixer: function(creep) {
        
        creepsCommon.initCreep(creep);
        
        if(!creep.memory.fixMode) {
            creep.memory.fixMode = 1
            var otherFixers = creep.room.find(FIND_MY_CREEPS, {
                filter: (other) => (other.memory.role == 'fixer' &&
                                    other.name !== creep.name)
            });
            if(otherFixers.length > 0) {
                otherFixers.sort((b,a) => {return (b.memory.fixMode - a.memory.fixMode)});
                for(var i = 0; i < otherFixers.length; i++) {
                    if(otherFixers[i].memory.fixMode == creep.memory.fixMode){
                        creep.memory.fixMode = otherFixers[i].memory.fixMode + 1;
                    }
                }
            }
        }
        
        if(creep.memory.fixing && creep.carry.energy == 0) {
            creep.memory.fixing = false;
        }
        if(!creep.memory.fixing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.fixing = true;
        }
        
        if(creep.memory.fixing) {
            if(creep.memory.fixMode == 1) {
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
            if(creep.memory.fixMode >= 2) {
                var fixNum = creep.memory.fixMode * 2
                if(!creep.memory.fixTargetID) {
                    creep.memory.fixTargetID = 0
                }
                if(creep.memory.fixTargetID == 0) {
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: object => (object.hits < object.hitsMax &&
                            object.structureType != STRUCTURE_WALL &&
                            object.structureType != STRUCTURE_RAMPART)
                    });
                    if(targets.length > fixNum) {
                        creep.memory.fixTargetID = targets[fixNum].id
                    }
                    if(targets.length < fixNum && targets.length > 0) {
                        creep.memory.fixTargetID = targets[0].id
                    }
                }
                if(Game.getObjectById(creep.memory.fixTargetID)) {
                    target = Game.getObjectById(creep.memory.fixTargetID)
                    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    if(target.hits == target.hitsMax) {
                        creep.memory.fixTargetID = 0
                    }
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
                resources.sort((a,b) => a.amount - b.amount)
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
                filter: (other) => (other.memory.role == 'harvester' &&
                                    other.name !== creep.name)
            });
            if(otherHarvesters.length > 0) {
                otherHarvesters.sort((b,a) => {return (b.memory.sourceNo - a.memory.sourceNo)});
                for(var i = 0; i < otherHarvesters.length; i++) {
                    if(otherHarvesters[i].memory.sourceNo == creep.memory.sourceNo){
                        creep.memory.sourceNo = otherHarvesters[i].memory.sourceNo + 1;
                        if(creep.memory.sourceNo >= sources.length) {
                            if(!otherHarvesters[0].memory.sourceNo == 0) {
                                creep.memory.sourceNo = 0;
                                creep.memory.harvesting = true;
                            }
                        }
                    }
                }
                creep.memory.harvesting = true;
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
        
        creepsCommon.renewTTL(creep);
        
    },




    
    runPolice: function(creep) {
        
        creepsCommon.initCreep(creep);
        
        if(!creep.memory.job) {
            var keeperLairs = creep.room.find(FIND_STRUCTURES, {
                filter: (other) => other.structureType == STRUCTURE_KEEPER_LAIR
            });
            if(keeperLairs) {
                creep.memory.lairNo = 0
                var otherPolice = creep.room.find(FIND_MY_CREEPS, {
                    filter: (other) => (other.memory.role == 'police' &&
                                        other.name !== creep.name)
                });
                if(otherPolice) {
                    otherPolice.sort((b,a) => {return (b.memory.lairNo - a.memory.lairNo)});
                    for(var i = 0; i < otherPolice.length; i++) {
                        if(otherPolice[i].memory.lairNo == creep.memory.lairNo){
                            creep.memory.lairNo = otherPolice[i].memory.lairNo + 1;
                            if(creep.memory.lairNo >= keeperLairs.length) {
                                creep.memory.job = 1;
                                i = otherpolice.length;
                            }
                        }
                        else {
                            creep.memory.job = 2;
                            i = otherpolice.length;
                            creep.memory.lairID = keeperLairs[creep.memory.lairNo].id;
                        }
                    }
                }
            }
        }
    
        if(creep.memory.job == 1) {
            var nearestEnemy = creep.room.find(FIND_HOSTILE_CREEPS);
            if(nearestEnemy) {
                if (nearestEnemy.length > 0) {
                    nearestEnemy.sort((a,b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep));
                    creep.memory.idle = false;
                    if (creep.rangedAttack(nearestEnemy[0]) == ERR_NOT_IN_RANGE) {
                        var onRampart = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (other) => other.structureType == STRUCTURE_RAMPART
                        });
                        if(onRampart) {
                            if (creep.pos !== onRampart[0].pos) {
                                creep.moveTo(nearestEnemy[0]);
                            }
                        }
                        else {
                            creep.moveTo(nearestEnemy[0]);
                        }
                    }
                }
            }
        }
        
        if(creep.memory.job == 2) { 
            if(!creep.pos.isNearTo(Game.getObjectById(creep.memory.lairID))) { 
                creep.moveTo(Game.getObjectById(creep.memory.lairID));
            }
            var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
            if(hostiles.length > 0) {
                hostiles.sort((a,b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))
                if(creep.pos.getRangeTo(hostiles[0]) < 4) {
                    creep.rangedAttack(hostiles[0]);
                }
            }
            if(creep.hits < creep.hitsMax) {
                if(!creep.room.find(FIND_CREEPS, {filter: (other) => other.my == false})) {
                    if(!Game.getObjectById(creep.memory.homeSpawnID).recycleCreep(creep)) {
                        creep.moveTo(Game.getObjectById(creep.memory.homeSpawnID))
                    }
                }
            }
        }
        
        creepsCommon.renewTTL(creep);
        
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
        
        creepsCommon.renewTTL(creep);
        
	}
};





module.exports = creepsRole;




