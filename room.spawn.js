 /*
    
    Spawn and Creep Population Control Center
    Room Scale Projects are managed from the Spawn
    
    roomSpawn
        SpawnCreeps
            roleInfo
                [0] is the Role (string)
                [1] is target number of creeps (Int)
                [2] is the array of current creeps 
                [3] is the Body array
    
 */

var roomSpawn = {
    
    spawnCreeps: function(spawn) {
        
    //Define room constants
        if(!spawn.room.memory.numOfSources) {
            spawn.room.memory.numOfSources = spawn.room.find(FIND_SOURCES).length
        }
        
        if(!spawn.room.memory.numOfLairs) {
            spawn.room.memory.numOfLairs = spawn.room.find(FIND_STRUCTURES, {filter: (other) => other.structureType == STRUCTURE_KEEPER_LAIR}).length
        }
        
//Check Number of Various types of creeps and set Target Population
        
    //Harvester 
        var harvesterInfo = []
        harvesterInfo[0] = 'harvester'
        harvesterInfo[1] = spawn.room.memory.numOfSources;
        harvesterInfo[2] = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
         console.log('Harvesters at ' + spawn.room.name + ': ' + harvesterInfo[2].length + '/' + harvesterInfo[1]);
        
    //Distributor
        var distributorInfo = []
        distributorInfo[0] = 'distributor'
        distributorInfo[1] = ((harvesterInfo[1] * 2) + 1);
        distributorInfo[2] = _.filter(Game.creeps, (creep) => creep.memory.role == 'distributor');
         console.log('Distributors at ' + spawn.room.name + ': ' + distributorInfo[2].length + '/' + distributorInfo[1]);
        
    //Gatherer
        var gathererInfo = []
        gathererInfo[0] = 'gatherer'
        gathererInfo[1] = 4 - (harvesterInfo[2].length + distributorInfo[2].length);
        gathererInfo[2] = _.filter(Game.creeps, (creep) => creep.memory.role == 'gatherer');
         console.log('Gatherers at ' + spawn.room.name + ': ' + gathererInfo[2].length + '/' + gathererInfo[1]);
        
    //Builder
        var builderInfo = []
        builderInfo[0] = 'builder'
        builderInfo[1] = 0
        var rampartMaxHits = 0
        if(spawn.room.controller.level % 2 == 0) {
            rampartMaxHits = (30000 * Math.pow(10, Math.ceil(spawn.room.controller.level / 2)))
        }
        if(spawn.room.controller.level % 2 == 1) {
            rampartMaxHits = (10000 * Math.pow(10, Math.ceil(spawn.room.controller.level / 2)))
        }
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
            builderInfo[1] = 2;
        }
        if(findWalls.length) {
            builderInfo[1] = 2;
        }
        builderInfo[2] = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
         console.log('Builders at ' + spawn.room.name + ': ' + builderInfo[2].length + '/' + builderInfo[1]);
        
    //Fixer
        var numOfStructures = spawn.room.find(FIND_STRUCTURES, {
            filter: (object) => (
                object.structureType != STRUCTURE_WALL &&
                object.structureType != STRUCTURE_RAMPART &&
                object.structureType != STRUCTURE_EXTENSION &&
                object.structureType != STRUCTURE_SPAWN
            )
        });
        var fixerInfo = []
        fixerInfo[0] = 'fixer'
        fixerInfo[1] = (Math.ceil(numOfStructures.length / 40));
        fixerInfo[2] = _.filter(Game.creeps, (creep) => creep.memory.role == 'fixer');
         console.log('Fixers at ' + spawn.room.name + ': ' + fixerInfo[2].length + '/' + fixerInfo[1]);
        
    //Upgrader
        var upgraderInfo = []
        upgraderInfo[0] = 'upgrader'
        upgraderInfo[1] = Math.ceil((9 - spawn.room.controller.level) / 2)
        upgraderInfo[2] = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
         console.log('Upgraders at ' + spawn.room.name + ': ' + upgraderInfo[2].length + '/' + upgraderInfo[1]);
        
    //Grunt
        var gruntInfo = []
        gruntInfo[0] = 'grunt'
        gruntInfo[1] = 0
        gruntInfo[2] = _.filter(Game.creeps, (creep) => creep.memory.role == 'grunt');
         console.log('Grunts at ' + spawn.room.name + ': ' + gruntInfo[2].length + '/' + gruntInfo[1]);  
    
    //Police
        var policeInfo = []
        policeInfo[0] = 'police'
        policeInfo[1] = (1 + spawn.room.memory.numOfLairs)
        policeInfo[2] = _.filter(Game.creeps, (creep) => creep.memory.role == 'police');
         console.log('Police at ' + spawn.room.name + ': ' + policeInfo[2].length + '/' + policeInfo[1]);
        
        
        
        
//Define various creep types body structures -- energy blocks of 250
        var numOfBlocks = Math.floor(spawn.room.energyCapacityAvailable / 250)
        
    //Gatherer
        gathererInfo[3] = []
        for(i = 0; i < 1; i++) {
            gathererInfo[3].push(WORK,CARRY,MOVE,MOVE)
        }
        
    //Harvester
        harvesterInfo[3] = []
        for(i = 0; i < numOfBlocks && i < 3; i++) {
            harvesterInfo[3].push(WORK,WORK,MOVE)
        }
        
    //Distributor
        distributorInfo[3] = []
        for(i = 0; i < numOfBlocks && i < 3; i++) {
            if(i % 3 == 0) {
                distributorInfo[3].push(CARRY,CARRY,CARRY,MOVE,MOVE)
            }
            else if(i % 3 == 1) {
                distributorInfo[3].push(CARRY,CARRY,CARRY,MOVE,MOVE)
            }
            else if(i % 3 == 2) {
                distributorInfo[3].push(CARRY,CARRY,CARRY,CARRY,MOVE)
            }
        }
        
    //Fixer
        fixerInfo[3] = []
        for(i = 0; i < numOfBlocks; i++) {
            fixerInfo[3].push(WORK,CARRY,MOVE,MOVE)
        }
        
    //Builder
        builderInfo[3] = []
        for(i = 0; i < numOfBlocks; i++) {
            builderInfo[3].push(WORK,CARRY,MOVE,MOVE)
        }
        
    //Upgrader
        upgraderInfo[3] = []
        for(i = 0; i < numOfBlocks; i++) {
            upgraderInfo[3].push(WORK,CARRY,CARRY,MOVE)
        }
        
    //Grunt
        gruntInfo[3] = []
        for(i = 0; i < numOfBlocks; i++) {
            gruntInfo[3].push(TOUGH,TOUGH,MOVE,MOVE,MOVE,ATTACK)
        }
        
    //Police
        policeInfo[3] = []
        for(i = 0; i < Math.ceil(numOfBlocks / 2); i++) {
            policeInfo[3].push(TOUGH,TOUGH,MOVE,MOVE,RANGED_ATTACK)
        }
        
// Define active creep types AND THE PRIORITY ORDER OF SPAWN (top is first)
        var roleInfo = [
            gathererInfo,
            harvesterInfo,
            distributorInfo,
            fixerInfo,
            builderInfo,
            upgraderInfo,
            gruntInfo,
            policeInfo
        ]
// Keep numbers constant for various creep types

        for(var i = 0; i < roleInfo.length; i++) {
            var activeInfo = roleInfo[i]
            if(activeInfo[2].length < activeInfo[1]) {
                var newMoniker = activeInfo[0] + Math.floor((Math.random() * 8999) + 1000)
                var newName = spawn.createCreep(
                    activeInfo[3],
                    newMoniker,
                    {dedTime: 0, role: activeInfo[0]}
                );
                if(newName) {
                    i = roleInfo.length
                }
                console.log('Spawning new ' + activeInfo[0] + ': ' + newName);
            }
        }
    },




    planImprovement: function(spawn) {
        
        
        
        /*
            Spawn complex plan:
            
                    RERERER
                    ERERERE
                    RERCRER
                    ERCSCRE
                    RERCRER
                    ERERERE
                    RERERER
                
                KEY:
                    R: Road
                    E: Extension
                    C: Container
                    S: Spawn
                    
                All coordinates based off of SPAWN
            
            Auxillary complex plan:
            
                    ERERERERE
                    RERERERER
                    ERERERERE
                    RERERERER
                    ERERSRERE
                    RERERERER
                    ERERERERE
                    RERERERER
                    ERERERERE
                
                KEY:
                    R: Road
                    E: Extension
                    S: Storage
                
                All coordinates base off of STORAGE
        */
        
        
        
        if(!spawn.room.memory.levelPlanned) {
            spawn.room.memory.levelPlanned = 0;
        }
        if(!spawn.room.memory.auxillaryPlanned) {
            spawn.room.memory.auxillaryPlanned = 0;
        }
        
        
        if(spawn.room.controller.level >= 1 && spawn.room.memory.auxillaryPlanned == 0) {
        //Find location for auxillary complex -- This runs every tick until the entire room has been searched
            if(!spawn.memory.auxSearchIndex) {
                spawn.memory.auxSearchIndex = 0
            }
            
            var auxSearchFlag = Game.flags.auxSearchFlag;
            var auxSearchFlag2 = Game.flags.auxSearchFlag2;
            if(!auxSearchFlag) {
                spawn.room.createFlag(25 , 25 , 'auxSearchFlag' , COLOR_ORANGE , COLOR_YELLOW);
                spawn.room.createFlag(25,25,'auxSearchFlag2',COLOR_RED,COLOR_YELLOW)
            }
            
            if(auxSearchFlag) {
                var elseTest = 0
                if(!auxSearchFlag.memory.legConst) {
                    auxSearchFlag.memory.legConst = 1
                }
                if(!auxSearchFlag.memory.distToGo) {
                    auxSearchFlag.memory.distToGo = 1
                }
                if(!auxSearchFlag.memory.direction) {
                    auxSearchFlag.memory.direction = 3
                }
                if(!auxSearchFlag2.memory.legConst) {
                    auxSearchFlag2.memory.legConst = 1
                }
                if(!auxSearchFlag2.memory.distToGo) {
                    auxSearchFlag2.memory.distToGo = 1
                }
                if(!auxSearchFlag2.memory.direction) {
                    auxSearchFlag2.memory.direction = 3
                }
                if(!auxSearchFlag2.memory.moves) {
                    auxSearchFlag2.memory.moves = 0
                }
                
                if(!auxSearchFlag.memory.searchStarted) {
                    auxSearchFlag.memory.searchStarted = true
                    auxSearchFlag.memory.moveArea = 0
                    
                }
                
                if(auxSearchFlag.memory.moveArea == 1) {
                    if(auxSearchFlag.memory.distToGo > 0) {
                        if(auxSearchFlag.memory.direction == 1) {
                            auxSearchFlag.setPosition(auxSearchFlag.pos.x,auxSearchFlag.pos.y - 1)
                            auxSearchFlag.memory.moveArea = 0
                            auxSearchFlag.memory.distToGo = auxSearchFlag.memory.distToGo - 1
                            auxSearchFlag2.setPosition(auxSearchFlag.pos.x , auxSearchFlag.pos.y - 1)
                        }
                        if(auxSearchFlag.memory.direction == 3) {
                            auxSearchFlag.setPosition(auxSearchFlag.pos.x + 1,auxSearchFlag.pos.y)
                            auxSearchFlag.memory.moveArea = 0
                            auxSearchFlag.memory.distToGo = auxSearchFlag.memory.distToGo - 1
                            auxSearchFlag2.setPosition(auxSearchFlag.pos.x + 1, auxSearchFlag.pos.y)
                        }
                        if(auxSearchFlag.memory.direction == 5) {
                            auxSearchFlag.setPosition(auxSearchFlag.pos.x,auxSearchFlag.pos.y + 1)
                            auxSearchFlag.memory.moveArea = 0
                            auxSearchFlag.memory.distToGo = auxSearchFlag.memory.distToGo - 1
                            auxSearchFlag2.setPosition(auxSearchFlag.pos.x , auxSearchFlag.pos.y + 1)
                        }
                        if(auxSearchFlag.memory.direction == 7) {
                            auxSearchFlag.setPosition(auxSearchFlag.pos.x - 1,auxSearchFlag.pos.y)
                            auxSearchFlag.memory.moveArea = 0
                            auxSearchFlag.memory.distToGo = auxSearchFlag.memory.distToGo - 1
                            auxSearchFlag2.setPosition(auxSearchFlag.pos.x - 1, auxSearchFlag.pos.y)
                        }
                    }
                    if(auxSearchFlag.memory.distToGo == 0) {
                        if(auxSearchFlag.memory.direction == 1) {
                            auxSearchFlag.memory.legConst = auxSearchFlag.memory.legConst + 1
                            auxSearchFlag.memory.distToGo = auxSearchFlag.memory.legConst
                            auxSearchFlag.memory.direction = 3
                        }
                        else if(auxSearchFlag.memory.direction == 3) {
                            auxSearchFlag.memory.distToGo = auxSearchFlag.memory.legConst
                            auxSearchFlag.memory.direction = 5
                        }
                        else if(auxSearchFlag.memory.direction == 5) {
                            auxSearchFlag.memory.legConst = auxSearchFlag.memory.legConst + 1
                            auxSearchFlag.memory.distToGo = auxSearchFlag.memory.legConst
                            auxSearchFlag.memory.direction = 7
                        }
                        else if(auxSearchFlag.memory.direction == 7) {
                            auxSearchFlag.memory.distToGo = auxSearchFlag.memory.legConst
                            auxSearchFlag.memory.direction = 1
                        }
                    }
                    spawn.memory.auxSearchIndex = spawn.memory.auxSearchIndex + 1
                    auxSearchFlag2.memory.moves = 0
                    auxSearchFlag2.memory.distToGo = 1
                    auxSearchFlag2.memory.legConst = 1
                    auxSearchFlag2.memory.direction = 3
                    elseTest = 1
                }
                
                if(auxSearchFlag.memory.moveArea == 0 && elseTest == 0) {
                    var stuffHere = auxSearchFlag2.room.lookAt(auxSearchFlag2.pos)
                    for(var i = 0; i < stuffHere.length; i++) {
                        if(stuffHere[i]['type'] == 'terrain') {
                            if(stuffHere[i]['terrain'] == 'wall') {
                                auxSearchFlag.memory.moveArea = 1
                            }
                        }
                        if(stuffHere[i]['type'] == 'structure') {
                            auxSearchFlag.memory.moveArea = 1
                        }
                        if(stuffHere[i]['type'] == 'constructionSite') {
                            auxSearchFlag.memory.moveArea = 1
                        }
                    }
                    if(auxSearchFlag.memory.moveArea == 0) {
                        auxSearchFlag2.memory.moves = auxSearchFlag2.memory.moves + 1
                        if(auxSearchFlag2.memory.moves > 81) {
                            spawn.room.createFlag(auxSearchFlag.pos.x,auxSearchFlag.pos.y,'AuxillaryComplex',COLOR_YELLOW,COLOR_GREY);
                            Game.flags.auxSearchFlag.remove();
                            Game.flags.auxSearchFlag2.remove();
                            spawn.room.memory.auxillaryPlanned = 1;
                        }
                    }
                    if(auxSearchFlag2.memory.distToGo > 0) {
                        if(auxSearchFlag2.memory.direction == 1) {
                            auxSearchFlag2.setPosition(auxSearchFlag2.pos.x , auxSearchFlag2.pos.y - 1)
                            auxSearchFlag2.memory.distToGo = auxSearchFlag2.memory.distToGo - 1
                        }
                        if(auxSearchFlag2.memory.direction == 3) {
                            auxSearchFlag2.setPosition(auxSearchFlag2.pos.x + 1 , auxSearchFlag2.pos.y)
                            auxSearchFlag2.memory.distToGo = auxSearchFlag2.memory.distToGo - 1
                        }
                        if(auxSearchFlag2.memory.direction == 5) {
                            auxSearchFlag2.setPosition(auxSearchFlag2.pos.x , auxSearchFlag2.pos.y + 1)
                            auxSearchFlag2.memory.distToGo = auxSearchFlag2.memory.distToGo - 1
                        }
                        if(auxSearchFlag2.memory.direction == 7) {
                            auxSearchFlag2.setPosition(auxSearchFlag2.pos.x - 1 , auxSearchFlag2.pos.y)
                            auxSearchFlag2.memory.distToGo = auxSearchFlag2.memory.distToGo - 1
                        }
                    }
                    if(auxSearchFlag2.memory.distToGo == 0) {
                        var turning = 1
                        if(auxSearchFlag2.memory.direction == 1 && turning == 1) {
                            auxSearchFlag2.memory.legConst = auxSearchFlag2.memory.legConst + 1
                            auxSearchFlag2.memory.distToGo = auxSearchFlag2.memory.legConst
                            auxSearchFlag2.memory.direction = 3
                            turning = 0
                        }
                        if(auxSearchFlag2.memory.direction == 3 && turning == 1) {
                            auxSearchFlag2.memory.distToGo = auxSearchFlag2.memory.legConst
                            auxSearchFlag2.memory.direction = 5
                            turning = 0
                        }
                        if(auxSearchFlag2.memory.direction == 5 && turning == 1) {
                            auxSearchFlag2.memory.legConst = auxSearchFlag2.memory.legConst + 1
                            auxSearchFlag2.memory.distToGo = auxSearchFlag2.memory.legConst
                            auxSearchFlag2.memory.direction = 7
                            turning = 0
                        }
                        if(auxSearchFlag2.memory.direction == 7 && turning == 1) {
                            auxSearchFlag2.memory.distToGo = auxSearchFlag2.memory.legConst
                            auxSearchFlag2.memory.direction = 1
                            turning = 0
                        }
                    }
                }
            }
        }
        
        if(spawn.room.controller.level == 1 && spawn.room.memory.levelPlanned == 0) {
            //Create Sites for the Core Containers
            spawn.room.createConstructionSite((spawn.pos.x + 0), (spawn.pos.y + 1), STRUCTURE_CONTAINER);
            spawn.room.createConstructionSite((spawn.pos.x + 1), (spawn.pos.y + 0), STRUCTURE_CONTAINER);
            spawn.room.createConstructionSite((spawn.pos.x + 0), (spawn.pos.y - 1), STRUCTURE_CONTAINER);
            spawn.room.createConstructionSite((spawn.pos.x - 1), (spawn.pos.y + 0), STRUCTURE_CONTAINER);
            //Set memory to Done
            spawn.room.memory.levelPlanned = 1;
        }
        
        
        if(spawn.room.controller.level == 2 && spawn.room.memory.levelPlanned == 1) {
            //Create Sites for the first layer of Core Extensions
            spawn.room.createConstructionSite((spawn.pos.x + 0), (spawn.pos.y - 3), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x + 1), (spawn.pos.y - 2), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x + 2), (spawn.pos.y - 3), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x + 3), (spawn.pos.y - 2), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x + 2), (spawn.pos.y - 1), STRUCTURE_EXTENSION);
            //Create Sites for the Core Roads
            spawn.room.createConstructionSite((spawn.pos.x - 3), (spawn.pos.y - 3), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((spawn.pos.x - 3), (spawn.pos.y - 1), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((spawn.pos.x - 2), (spawn.pos.y - 2), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((spawn.pos.x - 1), (spawn.pos.y - 3), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((spawn.pos.x - 3), (spawn.pos.y + 1), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((spawn.pos.x - 2), (spawn.pos.y - 0), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((spawn.pos.x - 1), (spawn.pos.y - 1), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((spawn.pos.x - 0), (spawn.pos.y - 2), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((spawn.pos.x + 1), (spawn.pos.y - 3), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((spawn.pos.x - 3), (spawn.pos.y + 3), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((spawn.pos.x - 2), (spawn.pos.y + 2), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((spawn.pos.x - 1), (spawn.pos.y + 1), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((spawn.pos.x + 1), (spawn.pos.y - 1), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((spawn.pos.x + 2), (spawn.pos.y - 2), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((spawn.pos.x + 3), (spawn.pos.y - 3), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((spawn.pos.x - 1), (spawn.pos.y + 3), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((spawn.pos.x - 0), (spawn.pos.y + 2), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((spawn.pos.x + 1), (spawn.pos.y + 1), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((spawn.pos.x + 2), (spawn.pos.y + 0), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((spawn.pos.x + 3), (spawn.pos.y - 1), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((spawn.pos.x + 1), (spawn.pos.y + 3), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((spawn.pos.x + 2), (spawn.pos.y + 2), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((spawn.pos.x + 3), (spawn.pos.y + 1), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((spawn.pos.x + 3), (spawn.pos.y + 3), STRUCTURE_ROAD);
            
            
            //Set memory to Done
            spawn.room.memory.levelPlanned = 2;
        }
        
        if(spawn.room.controller.level >= 2 && spawn.room.memory.auxillaryPlanned == 1) {
            //Create Auxillary Complex Roads
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 1), (Game.flags.AuxillaryComplex.pos.y + 0), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 0), (Game.flags.AuxillaryComplex.pos.y + 1), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 1), (Game.flags.AuxillaryComplex.pos.y + 0), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 0), (Game.flags.AuxillaryComplex.pos.y - 1), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 3), (Game.flags.AuxillaryComplex.pos.y + 0), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 2), (Game.flags.AuxillaryComplex.pos.y + 1), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 1), (Game.flags.AuxillaryComplex.pos.y + 2), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 0), (Game.flags.AuxillaryComplex.pos.y + 3), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 1), (Game.flags.AuxillaryComplex.pos.y + 2), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 2), (Game.flags.AuxillaryComplex.pos.y + 1), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 3), (Game.flags.AuxillaryComplex.pos.y - 0), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 2), (Game.flags.AuxillaryComplex.pos.y - 1), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 1), (Game.flags.AuxillaryComplex.pos.y - 2), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 0), (Game.flags.AuxillaryComplex.pos.y - 3), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 1), (Game.flags.AuxillaryComplex.pos.y - 2), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 2), (Game.flags.AuxillaryComplex.pos.y - 1), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 4), (Game.flags.AuxillaryComplex.pos.y + 1), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 3), (Game.flags.AuxillaryComplex.pos.y + 2), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 2), (Game.flags.AuxillaryComplex.pos.y + 3), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 1), (Game.flags.AuxillaryComplex.pos.y + 4), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 1), (Game.flags.AuxillaryComplex.pos.y + 4), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 2), (Game.flags.AuxillaryComplex.pos.y + 3), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 3), (Game.flags.AuxillaryComplex.pos.y + 2), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 4), (Game.flags.AuxillaryComplex.pos.y + 1), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 4), (Game.flags.AuxillaryComplex.pos.y - 1), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 3), (Game.flags.AuxillaryComplex.pos.y - 2), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 2), (Game.flags.AuxillaryComplex.pos.y - 3), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 1), (Game.flags.AuxillaryComplex.pos.y - 4), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 1), (Game.flags.AuxillaryComplex.pos.y - 4), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 2), (Game.flags.AuxillaryComplex.pos.y - 3), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 3), (Game.flags.AuxillaryComplex.pos.y - 2), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 4), (Game.flags.AuxillaryComplex.pos.y - 1), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 4), (Game.flags.AuxillaryComplex.pos.y + 3), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 3), (Game.flags.AuxillaryComplex.pos.y + 4), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 3), (Game.flags.AuxillaryComplex.pos.y + 4), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 4), (Game.flags.AuxillaryComplex.pos.y + 3), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 4), (Game.flags.AuxillaryComplex.pos.y - 3), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x - 3), (Game.flags.AuxillaryComplex.pos.y - 4), STRUCTURE_ROAD);
            
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 3), (Game.flags.AuxillaryComplex.pos.y - 4), STRUCTURE_ROAD);
            spawn.room.createConstructionSite((Game.flags.AuxillaryComplex.pos.x + 4), (Game.flags.AuxillaryComplex.pos.y - 3), STRUCTURE_ROAD);
            
            //Set memory to Done
            spawn.room.memory.auxillaryPlanned = 2
        }
        
        if(spawn.room.controller.level == 3 && spawn.room.memory.levelPlanned == 2) {
            //Create Sites for the Second layer of core Extensions
            spawn.room.createConstructionSite((spawn.pos.x + 3), (spawn.pos.y + 0), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x + 2), (spawn.pos.y + 1), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x + 3), (spawn.pos.y + 2), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x + 2), (spawn.pos.y + 3), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x + 1), (spawn.pos.y + 2), STRUCTURE_EXTENSION);
            
            //Set memory to Done
            spawn.room.memory.levelPlanned = 3;
        }
        
        if(spawn.room.controller.level == 4 && spawn.room.memory.levelPlanned == 3) {
            //Create Sites for the Third layer of core extensions
            spawn.room.createConstructionSite((spawn.pos.x - 0), (spawn.pos.y + 3), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x - 1), (spawn.pos.y + 2), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x - 2), (spawn.pos.y + 3), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x - 3), (spawn.pos.y + 2), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x - 2), (spawn.pos.y + 1), STRUCTURE_EXTENSION);
            
            spawn.room.createConstructionSite((spawn.pos.x - 3), (spawn.pos.y - 0), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x - 2), (spawn.pos.y - 1), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x - 3), (spawn.pos.y - 2), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x - 2), (spawn.pos.y - 3), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x - 1), (spawn.pos.y - 2), STRUCTURE_EXTENSION);
            
            //Set memory to Done
            spawn.room.memory.levelPlanned = 4;
        }
        
        if(spawn.room.controller.level == 4 && spawn.room.memory.auxillaryPlanned == 2) {
            //Create the Storage for the Auxillary Complex
            spawn.room.createConstructionSite(Game.flags.AuxillaryComplex.pos.x,Game.flags.AuxillaryComples.pos.y, STRUCTURE_STORAGE)
            
            //Remove the AuxillaryComplex flag
            Game.flags.AuxillaryComplex.remove()
            
            //Set memory to Done
            spawn.room.memory.auxillaryPlanned = 3
        }
        
        if(spawn.room.controller.level == 5 && spawn.room.memory.levelPlanned == 4) {
            //Create Sites for the First layer of auxillary extensions
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 0), (spawn.room.storage.pos.y - 4), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 0), (spawn.room.storage.pos.y - 2), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 1), (spawn.room.storage.pos.y - 3), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 1), (spawn.room.storage.pos.y - 1), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 2), (spawn.room.storage.pos.y - 2), STRUCTURE_EXTENSION);
            
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 2), (spawn.room.storage.pos.y - 4), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 3), (spawn.room.storage.pos.y - 3), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 4), (spawn.room.storage.pos.y - 4), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 4), (spawn.room.storage.pos.y - 2), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 3), (spawn.room.storage.pos.y - 1), STRUCTURE_EXTENSION);
            
            //Set memory to Done
            spawn.room.memory.levelPlanned = 5;
        }
        
        if(spawn.room.controller.level == 6 && spawn.room.memory.levelPlanned == 5) {
            //Create Sites for the First layer of auxillary extensions
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 4), (spawn.room.storage.pos.y + 0), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 2), (spawn.room.storage.pos.y + 0), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 3), (spawn.room.storage.pos.y + 1), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 1), (spawn.room.storage.pos.y + 1), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 2), (spawn.room.storage.pos.y + 2), STRUCTURE_EXTENSION);
            
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 4), (spawn.room.storage.pos.y + 2), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 3), (spawn.room.storage.pos.y + 3), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 4), (spawn.room.storage.pos.y + 4), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 2), (spawn.room.storage.pos.y + 4), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x + 1), (spawn.room.storage.pos.y + 3), STRUCTURE_EXTENSION);
            
            //Set memory to Done
            spawn.room.memory.levelPlanned = 6;
        }
        
        if(spawn.room.controller.level == 7 && spawn.room.memory.levelPlanned == 6) {
            //Create Sites for the First layer of auxillary extensions
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 0), (spawn.room.storage.pos.y + 4), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 0), (spawn.room.storage.pos.y + 2), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 1), (spawn.room.storage.pos.y + 3), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 1), (spawn.room.storage.pos.y + 1), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 2), (spawn.room.storage.pos.y + 2), STRUCTURE_EXTENSION);
            
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 2), (spawn.room.storage.pos.y + 4), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 3), (spawn.room.storage.pos.y + 3), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 4), (spawn.room.storage.pos.y + 4), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 4), (spawn.room.storage.pos.y + 2), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 3), (spawn.room.storage.pos.y + 1), STRUCTURE_EXTENSION);
            
            //Set memory to Done
            spawn.room.memory.levelPlanned = 7;
        }
        
        if(spawn.room.controller.level == 8 && spawn.room.memory.levelPlanned == 7) {
            //Create Sites for the First layer of auxillary extensions
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 4), (spawn.room.storage.pos.y - 0), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 2), (spawn.room.storage.pos.y - 0), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 3), (spawn.room.storage.pos.y - 1), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 1), (spawn.room.storage.pos.y - 1), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 2), (spawn.room.storage.pos.y - 2), STRUCTURE_EXTENSION);
            
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 4), (spawn.room.storage.pos.y - 2), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 3), (spawn.room.storage.pos.y - 3), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 4), (spawn.room.storage.pos.y - 4), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 2), (spawn.room.storage.pos.y - 4), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.room.storage.pos.x - 1), (spawn.room.storage.pos.y - 3), STRUCTURE_EXTENSION);
            
            //Set memory to Done
            spawn.room.memory.levelPlanned = 8;
        }
    }
};


module.exports = roomSpawn;