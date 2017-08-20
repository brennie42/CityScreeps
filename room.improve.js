/*
    
    Room Improvement and Construction Control Center
    Room scale projects are managed from the Spawn
    
    The Core complex has this shape:
    
        RERERER
        ERERERE
        RERCRER
        ERCSCRE
        RERCRER
        ERERERE
        RERERER
    Key:
        E: Extension
        R: Road
        C: Container
        S: Spawn
    Core Coordinates based off of Spawn
    
    The Auxillary Complex has this shape
    
        ERERERERE
        RERERERER
        ERERERERE
        RERERERER
        ERERSRERE
        RERERERER
        ERERERERE
        RERERERER
        ERERERERE
    Key:
        E: Extension
        R: Road
        S: Storage
 */

var roomImprove = {
    
    run: function(spawn) {
        
        if(!spawn.room.memory.levelPlanned) {
            spawn.room.memory.levelPlanned = 0;
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
        
        var x = 0
        var y = 0
        
        if(spawn.room.controller.level == 2 && spawn.room.memory.levelPlanned == 1) {
            //Create Sites for the first layer of Core Extensions
            spawn.room.createConstructionSite((spawn.pos.x + 0), (spawn.pos.y - 3), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x + 1), (spawn.pos.y - 2), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x + 2), (spawn.pos.y - 3), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x + 3), (spawn.pos.y + 2), STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite((spawn.pos.x + 2), (spawn.pos.y + 1), STRUCTURE_EXTENSION);
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
        
        if(spawn.room.controller.level == 4 && spawn.room.memory.levelPlanned == 2) {
            
        }
    }
};


module.exports = roomImprove;