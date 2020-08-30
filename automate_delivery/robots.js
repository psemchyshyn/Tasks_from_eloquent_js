import {findRoute, getRandomLocation, routes} from "./robots_algorithm.js"


const robots = {
    "random": randomRobotMove,
    "const": constRobotMove,
    "pathfinding": pathFindingRobotMove
}


// Random robot moving
function randomRobotMove(graph, state, memory) {
    let currentLocation = state.currentPlace
    let destination = getRandomLocation(graph[currentLocation])
    return {destination, memory}
}


// Implements robot running on constant root every time
function constRobotMove(graph, state, memory) {
    if (memory.length == 0){
        memory = routes
    }
      return {destination: memory[0], memory: memory.slice(1)}
}


// Pathfinding robot move
function pathFindingRobotMove(graph, state, memory) {
    if (memory.length == 0){
        let parcel = state.parcels[0]
        memory = parcel.location == state.currentPlace ? findRoute(graph, state.currentPlace, parcel.address) : findRoute(graph, state.currentPlace, parcel.location)
    }
    return {destination: memory[0], memory: memory.slice(1)}
}


// The up-most abstraction of robot management
export function robotMove(graph, state, memory, type) {
    return robots[type](graph, state, memory)
}