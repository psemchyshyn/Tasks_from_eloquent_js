


// Build graph objects of the roads
export function buildGraph(roads){
    let graph = {}
    function addEdge(to, from){
        if (to in graph){
            graph[to].push(from)
        }
        else {
            graph[to] = [from]
        }
    };
    roads.forEach(road => {
        let [to, from] = road.split("-")
        addEdge(to, from)
        addEdge(from, to)
    });
    return graph;
}