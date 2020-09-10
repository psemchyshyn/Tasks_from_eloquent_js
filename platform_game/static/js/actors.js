import Vector from "./vector.js"
import State from "./display.js"


class Player {
    constructor(pos, speed) {
        this.pos = pos
        this.speed = speed
    }

    get type () {return "player";}

    static create (pos) {
        return new Player(pos.plus(new Vector(0, -0.5)), new Vector(0, 0))
    }
}

Player.prototype.size = new Vector(0.8, 1.5)
Player.prototype.update = function(time, state, keys) {
    const playerXSpeed = 7;
    const gravity = 30;
    const jumpSpeed = 17;
    let xSpeed = 0;
    if (keys.ArrowLeft) xSpeed -= playerXSpeed;
    if (keys.ArrowRight) xSpeed += playerXSpeed;
    let pos = this.pos;
    let movedX = pos.plus(new Vector(xSpeed * time, 0));
    if (!state.level.touches(movedX, this.size, "wall")) {
        pos = movedX;
    }
    let ySpeed = this.speed.y + time * gravity;
    let movedY = pos.plus(new Vector(0, ySpeed * time));
    if (!state.level.touches(movedY, this.size, "wall")) {
        pos = movedY;
    } else if (keys.ArrowUp && ySpeed > 0) {
        ySpeed = -jumpSpeed;
    } else {
        ySpeed = 0;
    }
    return new Player(pos, new Vector(xSpeed, ySpeed));
};

class Coin {
    constructor(pos, basePos, wobble) {
      this.pos = pos;
      this.basePos = basePos;
      this.wobble = wobble;
    }
  
    get type() { return "coin"; }
  
    static create(pos) {
      let basePos = pos.plus(new Vector(0.2, 0.1));
      return new Coin(basePos, basePos,
                      Math.random() * Math.PI * 2);
    }
  }
  
Coin.prototype.size = new Vector(0.6, 0.6);
Coin.prototype.collide = function(state) {
    let filtered = state.actors.filter(a => a != this);
    let status = state.status;
    if (!filtered.some(a => a.type == "coin")) status = "won";
    return new State(state.level, filtered, status);
  };

Coin.prototype.update = function(time, state) {
    const wobbleSpeed = 8, wobbleDist = 0.07;
    let wobble = this.wobble + time*wobbleSpeed
    let y_offset = Math.sin(wobble)*wobbleDist
    let x_offset = Math.cos(wobble)*wobbleDist
    let total_offset = new Vector(x_offset, y_offset)
    return new Coin(this.basePos.plus(total_offset), this.basePos, wobble)
}


class Lava {
    constructor (pos, speed, reset) {
        this.speed = speed
        this.reset = reset
        this.pos = pos // Vector type
    }

    get type () {return "lava";}

    static create(pos, chr) {
        if (chr == "=") {
            return new Lava(pos, new Vector(2, 0))
        } else if (chr == "|") {
            return new Lava(pos, new Vector(0, 2))
        } else if (chr == "v") {
            return new Lava(pos, new Vector(0, 3), pos)
        }
    }
}

Lava.prototype.size = new Vector(1, 1)
Lava.prototype.collide = function(state) {
    return new State(state.level, state.actors, "lost")
}
Lava.prototype.update = function(time, state) {
    let newPos = this.pos.plus(this.speed.times(time));
    if (!state.level.touches(newPos, this.size, "wall")) {
      return new Lava(newPos, this.speed, this.reset);
    } else if (this.reset) {
      return new Lava(this.reset, this.speed, this.reset);
    } else {
      return new Lava(this.pos, this.speed.times(-1));
    }
  };


export {Lava, Coin, Player};