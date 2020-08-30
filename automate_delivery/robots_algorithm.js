// Pathfinding algorithm on the basis of BFS
export function findRoute(graph, from, to){
    let queue = [{at: from, routes: []}]
    while (queue.length !== 0){
        let {at, routes} = queue.shift()
        for (let direction of graph[at]){
            if (direction == to) {
                return routes.concat(direction)
            }
            else {
                if (!queue.some(work => work.at == direction)){
                    queue.push({at: direction, routes: routes.concat(direction)})
                }
            }
        }
    }
}

// getting random choice from array
export function getRandomLocation(array) {
    let randChoice = Math.floor(Math.random()*array.length)
    return array[randChoice]
}


// Routes list for complete village detour
export const routes = [
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House",
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"
  ];
