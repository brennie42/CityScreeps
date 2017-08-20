/*
    CityScreeps
    
    Every Creep has it's Place and Time.
    Every Spawner has it's Room.
    All Work together for the Greater Good.
    One Life is Meaningless.
    The Collective is Legion.
        
        Original Code by Tinglatio
        
    Things to do:
        Add creep renewal functionality when they get big
        Work on autobuild and Site Search functionality
        Better Combat??
 */

    //Module Imports
var roomSpawn = require('room.spawn');
var roomImprove = require('room.improve');
var roleHarvester = require('role.harvester');
var roleDistributor = require('role.distributor');
var roleGatherer = require('role.gatherer');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleGrunt = require('role.grunt');
var roleFixer = require('role.fixer');

module.exports.loop = function () {

    //Log Whitespace ( ＾∇＾)
        console.log(' ');

    for(var name in Game.spawns) {
        var spawn = Game.spawns[name];
        roomSpawn.run(spawn);
        roomImprove.run(spawn);
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
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'gatherer') {
            roleGatherer.run(creep);
        }
        if(creep.memory.role == 'distributor') {
            roleDistributor.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'fixer') {
            roleFixer.run(creep);
        }
        if(creep.memory.role == 'grunt') {
            roleGrunt.run(creep);
        }
    }
    
    
}