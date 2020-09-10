import {Player, Coin, Lava} from "./actors.js"
import Vector from "./vector.js"


const levelChars = {
    ".": "empty", "#": "wall", "+": "lava",
    "@": Player, "o": Coin,
    "=": Lava, "|": Lava, "v": Lava
  };


export default class Level {
    constructor(schema) {
        let rows = schema.trim().split("\n").map(row => [...row])
        this.width = rows[0].length
        this.height = rows.length
        this.actors = []
        this.rows = rows.map((row, y) => {
            return row.map((chr, x) => {
                let type = levelChars[chr]
                if (typeof type == "string") return type
                this.actors.push(type.create(new Vector(x, y), chr))
                return "empty"
            })
        })
    }
}

// Checks if elements in pos and size touches element type
Level.prototype.touches = function(pos, size, type) {
    let startX = Math.floor(pos.x)
    let endX = Math.ceil(pos.x + size.x)
    let startY = Math.floor(pos.y)
    let endY = Math.ceil(pos.y + size.y)
    for (let y = startY; y < endY; y++){
        for (let x = startX; x < endX; x++){
            let beyondField = x < 0 || x > this.width || y < 0 || y > this.height
            let inplace = beyondField ? "wall": this.rows[y][x];
            if (inplace == type) return true
        }
    }
    return false    
}


