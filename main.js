/*
    CityScreeps 0.6
    
    Every Creep has it's Place and Time.
    Every Spawner has it's Room.
    All Work together for the Greater Good.
    One Life is Meaningless.
    The Collective is Legion.
        
        Original Code by Tinglatio
        
 */

    //Module Imports
var roomSpawn = require('room.spawn');
var roomImprove = require('room.improve');
var creepsRole = require('creeps.role');

module.exports.loop = function () {

    //Log Whitespace ( ＾∇＾)
        console.log(' ');
    
    
    //Clear Defunct Memory Objects
    for(var name in Memory.creeps) {
        if(Game.creeps[name]) {
        }
        else {
            Memory.creeps[name].dedTime = Memory.creeps[name].dedTime + 1;
            if (Memory.creeps[name].dedTime > 5) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    }


    for(var name in Game.spawns) {
        var spawn = Game.spawns[name];
        roomSpawn.spawnCreeps(spawn);
        roomSpawn.planImprovement(spawn);
    }
    
    
    
    for(var structureType in Game.structures) {
        var tower = Game.structures[structureType]
        var rampartMaxHits = 0
        if(tower.room.controller.level % 2 == 0) {
            rampartMaxHits = (30000 * Math.pow(10, (tower.room.controller.level / 2)))
        }
        if(tower.room.controller.level % 2 == 1) {
            rampartMaxHits = (10000 * Math.pow(10, Math.ceil(tower.room.controller.level / 2)))
        }
        if(tower.structureType == 'tower') {
            var closestDamagedStructure = tower.room.find(FIND_STRUCTURES, {
                filter: (object) => (
                    (object.structureType == STRUCTURE_WALL ||
                     object.structureType == STRUCTURE_RAMPART) 
                    && object.hits < (rampartMaxHits)
                )
            });
           
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
            else if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }  
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            creepsRole.runHarvester(creep);
        }
        if(creep.memory.role == 'gatherer') {
            creepsRole.runGatherer(creep);
        }
        if(creep.memory.role == 'distributor') {
            creepsRole.runDistributor(creep);
        }
        if(creep.memory.role == 'upgrader') {
            creepsRole.runUpgrader(creep);
        }
        if(creep.memory.role == 'builder') {
            creepsRole.runBuilder(creep);
        }
        if(creep.memory.role == 'fixer') {
            creepsRole.runFixer(creep);
        }
        if(creep.memory.role == 'grunt') {
            creepsRole.runGrunt(creep);
        }
    }
    
    
    
    
}