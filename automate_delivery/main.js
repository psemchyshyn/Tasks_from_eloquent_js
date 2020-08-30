import { robotMove } from "./robots.js"
import { buildGraph } from "./graph.js"
import { VillageState } from "./village.js";


// All roads to be put in the graph
const roads = [
    "Alice's House-Bob's House",   "Alice's House-Cabin",
    "Alice's House-Post Office",   "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop",          "Marketplace-Farm",
    "Marketplace-Post Office",     "Marketplace-Shop",
    "Marketplace-Town Hall",       "Shop-Town Hall"
  ];

export const graph = buildGraph(roads)

// Simulation running
export function runRobot(graph, state, type="random") {
    let memory = []
    let moveNums = 0
    console.log("Robot started working!")
    while (state.parcels.length != 0) {
        let action = robotMove(graph, state, memory, type)
        state = state.move(action.destination)
        memory = action.memory
        moveNums++
    }
    console.log("Delivered all packages in " + moveNums + " moves.")
    return moveNums
}

let state = VillageState.filledStart(graph, 1)
console.log(state.parcels)
runRobot(graph, state, "pathfinding")
