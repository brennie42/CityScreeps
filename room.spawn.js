 /*
    
    Spawn and Creep Population Control Center
    Room Scale Projects are managed from the Spawn
    
    ADD RENEWAL FUNCTIONALITY AT/AFTER CREEP LEVEL 3
    
 */

var roomSpawn = {
    
    run: function(spawn) {
        
    //Define room constants
        if(!spawn.room.memory.numOfSources) {
            spawn.room.memory.numOfSources = spawn.room.find(FIND_SOURCES).length
        }
        
    //Check Number of Various types of creeps
        
    //Harvester 
        var harvesterNum = spawn.room.memory.numOfSources;
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
         console.log('Harvesters: ' + harvesters.length + '/' + harvesterNum);
        
    //Distributor
        var distributorNum = ((harvesterNum * 2) + 1);
        var distributors = _.filter(Game.creeps, (creep) => creep.memory.role == 'distributor');
         console.log('Distributors: ' + distributors.length + '/' + distributorNum);
        
    //Gatherer
        var gathererNum = 4 - (harvesters.length + distributors.length);
        var gatherers = _.filter(Game.creeps, (creep) => creep.memory.role == 'gatherer');
         console.log('Gatherers: ' + gatherers.length + '/' + gathererNum);
        
    //Builder
        var rampartMaxHits = 0
        if(spawn.room.controller.level % 2 == 0) {
            rampartMaxHits = (30000 * Math.pow(10, Math.ceil(spawn.room.controller.level / 2)))
        }
        if(spawn.room.controller.level % 2 == 1) {
            rampartMaxHits = (10000 * Math.pow(10, Math.ceil(spawn.room.controller.level / 2)))
        }
        var builderNum = 0
        var findWalls = spawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return(
                    (structure.structureType == STRUCTURE_WALL || 
                    structure.structureType == STRUCTURE_RAMPART) 
                    && structure.hits < rampartMaxHits
                )
            }
        });
        if(spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
            var builderNum = 2;
        }
        if(findWalls.length > 0) {
            var builderNum = 2;
        }
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
         console.log('Builders: ' + builders.length + '/' + builderNum);
        
    //Fixer
        var numOfStructures = spawn.room.find(FIND_STRUCTURES, {
            filter: (object) => (
                object.structureType != STRUCTURE_WALL &&
                object.structureType != STRUCTURE_RAMPART &&
                object.structureType != STRUCTURE_EXTENSION &&
                object.structureType != STRUCTURE_SPAWN
            )
        });
        var fixerNum = (Math.ceil(numOfStructures.length / 40));
        var fixers = _.filter(Game.creeps, (creep) => creep.memory.role == 'fixer');
         console.log('Fixers at ' + spawn.room.name + ': ' + fixers.length + '/' + fixerNum);
        
    //Upgrader
        if(spawn.room.controller.level < 8) {
            var upgraderNum = 4;
        }
        else {
            var upgraderNum = 1
        }
        var upgraderNum = Math.ceil((9 - spawn.room.controller.level) / 2)
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
         console.log('Upgraders: ' + upgraders.length + '/' + upgraderNum);
        
    //Grunt
        var gruntNum = 0
        var grunts = _.filter(Game.creeps, (creep) => creep.memory.role == 'grunt');
         console.log('Grunts: ' + grunts.length + '/' + gruntNum);  
        
        
     //Define various creep types body structures -- energy blocks of 250
        var numOfBlocks = Math.floor(spawn.room.energyCapacityAvailable / 250)
        
        //Gatherer
        var gathererBody = []
        for(i = 0; i < 1; i++) {
            gathererBody.push(WORK,CARRY,MOVE,MOVE)
        }
        
        //Harvester
        var harvesterBody = []
        for(i = 0; i < numOfBlocks && i < 3; i++) {
            harvesterBody.push(WORK,WORK,MOVE)
        }
        
        //Distributor
        var distributorBody = []
        for(i = 0; i < numOfBlocks && i < 3; i++) {
            if(i % 3 == 0) {
                distributorBody.push(CARRY,CARRY,CARRY,MOVE,MOVE)
            }
            else if(i % 3 == 1) {
                distributorBody.push(CARRY,CARRY,CARRY,MOVE,MOVE)
            }
            else if(i % 3 == 2) {
                distributorBody.push(CARRY,CARRY,CARRY,CARRY,MOVE)
            }
        }
        
        //Fixer
        var fixerBody = []
        for(i = 0; i < numOfBlocks; i++) {
            fixerBody.push(WORK,CARRY,MOVE,MOVE)
        }
        
        //Builder
        var builderBody = []
        for(i = 0; i < numOfBlocks; i++) {
            builderBody.push(WORK,CARRY,MOVE,MOVE)
        }
        
        //Upgrader
        var upgraderBody = []
        for(i = 0; i < numOfBlocks; i++) {
            upgraderBody.push(WORK,CARRY,CARRY,MOVE)
        }
        
        //Grunt
        var gruntBody = []
        for(i = 0; i < numOfBlocks; i++) {
            gruntBody.push(ATTACK,TOUGH,TOUGH,MOVE,MOVE,MOVE)
        }
        
        /* Keep numbers constant for various creep types */
        if(gatherers.length < gathererNum) {
            var newMoniker = 'Gatherer' + Math.floor((Math.random() * 8999) + 1000)
            var newName = spawn.createCreep(
                gathererBody,
                newMoniker,
                {dedTime: 0, sourceNo: 0, sourceAvailable: 0, role: 'gatherer'}
            );
            console.log('Spawning new gatherer: ' + newName);
        }
        else if(harvesters.length < harvesterNum) {
            var newMoniker = 'Harvester' + Math.floor((Math.random() * 8999) + 1000)
            var newName = spawn.createCreep(
                harvesterBody,
                newMoniker,
                {dedTime: 0, role: 'harvester'}
            );
            console.log('Spawning new harvester: ' + newName);
        }
        else if(distributors.length < distributorNum) {
            var newMoniker = 'Distributor' + Math.floor((Math.random() * 8999) + 1000)
            var newName = spawn.createCreep(
                distributorBody,
                newMoniker,
                {dedTime: 0, role: 'distributor'}
            );
            console.log('Spawning new distributor: ' + newName);
        }
        else if(fixers.length < fixerNum) {
            var newMoniker = 'Fixer' + Math.floor((Math.random() * 8999) + 1000)
            var newName = spawn.createCreep(
                fixerBody,
                newMoniker,
                {dedTime: 0, role: 'fixer'}
            );
            console.log('Spawning new fixer: ' + newName);
        }
        else if(builders.length < builderNum) {
            var newMoniker = 'Builder' + Math.floor((Math.random() * 8999) + 1000)
            var newName = spawn.createCreep(
                builderBody,
                newMoniker,
                {dedTime: 0, sourceNo: 0, sourceAvailable: 0, role: 'builder'}
            );
            console.log('Spawning new builder: ' + newName);
        }
        else if(upgraders.length < upgraderNum) {
            var newMoniker = 'Upgrader' + Math.floor((Math.random() * 8999) + 1000)
            var newName = spawn.createCreep(
                upgraderBody,
                newMoniker,
                {dedTime: 0, role: 'upgrader'}
            );
            console.log('Spawning new upgrader: ' + newName);
        }
        else if(grunts.length < gruntNum) {
            var newMoniker = 'Grunt' + Math.floor((Math.random() * 8999) + 1000)
            var newName = spawn.createCreep(
                gruntBody,
                newMoniker,
                {dedTime: 0, role: 'grunt'}
            );
            console.log('Spawning new grunt: ' + newName);
        }
    }
};


module.exports = roomSpawn