import {runRobot, graph} from "./main.js";
import { VillageState } from "./village.js";


function testRobots(type1, type2, packagesSent){
    console.log(`---Starting comparing ${type1} and ${type2} robots...`);
    console.log(`---Sending ${packagesSent} packages to be processed`);
    let winner, difference, robot1Res, robot2Res;
    let state = VillageState.filledStart(graph, packagesSent)
    robot1Res = runRobot(graph, state, type1)
    robot2Res = runRobot(graph, state, type2)
    winner = robot1Res - robot2Res < 0 ? type1 : type2
    difference = winner == type1 ? robot2Res - robot1Res : robot1Res - robot2Res
    console.log(`---${winner} robot won with the difference of ${difference} moves`)
    console.log(`---Finished comparing.`);
}

testRobots("const", "pathfinding", 20)