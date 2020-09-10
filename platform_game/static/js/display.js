import Level from "./level.js"

// To extend grid
const scale = 20

// Tracking pressed keys
function trackKeys(keys) {
    let down = Object.create(null);
    function track(event) {
      if (keys.includes(event.key)) {
        down[event.key] = event.type == "keydown";
        event.preventDefault();
      }
    }
    window.addEventListener("keydown", track);
    window.addEventListener("keyup", track);
    return down;
}
const arrowKeys = trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);



export default class State {
    constructor(level, actors, status) {
      this.level = level;
      this.actors = actors;
      this.status = status;
    }
  
    static start(level) {
      return new State(level, level.actors, "playing");
    }
  
    get player() {
      return this.actors.find(a => a.type == "player");
    }
  }


  State.prototype.update = function(time, keys) {
    let actors = this.actors
      .map(actor => actor.update(time, this, keys));
    let newState = new State(this.level, actors, this.status);
  
    if (newState.status != "playing") return newState;
  
    let player = newState.player;
    if (this.level.touches(player.pos, player.size, "lava")) {
      return new State(this.level, actors, "lost");
    }
  
    for (let actor of actors) {
      if (actor != player && overlap(actor, player)) {
        newState = actor.collide(newState);
      }
    }
    return newState;
};
// Checks for overlaping
function overlap(actor1, actor2) {
    return actor1.pos.x + actor1.size.x > actor2.pos.x &&
           actor1.pos.x < actor2.pos.x + actor2.size.x &&
           actor1.pos.y + actor1.size.y > actor2.pos.y &&
           actor1.pos.y < actor2.pos.y + actor2.size.y;
}


// Drawing functions
function elt(name, styles, ...children){
    let dom = document.createElement(name)
    for (let key of Object.keys(styles)) {
        dom.setAttribute(key, styles[key])
    }
    for (let child of children){
        dom.appendChild(child)
    }
    return dom
}


function drawGrid(level) {
    return elt("table", {
        class: "background",
        style: `width: ${level.width * scale}px`
    }, 
    ...level.rows.map(row => {
        return elt("tr", {style: `height: ${scale}px`}, 
        ...row.map(el => {
            return elt("td", {class: el})
        }))
    }))
}


function drawActors(actors) {
    return elt("div", {}, ...actors.map(actor => {
      let rect = elt("div", {class: `actor ${actor.type}`});
      rect.style.width = `${actor.size.x * scale}px`;
      rect.style.height = `${actor.size.y * scale}px`;
      rect.style.left = `${actor.pos.x * scale}px`;
      rect.style.top = `${actor.pos.y * scale}px`;
      return rect;
    }));
}

class DOMDisplay {
    constructor (parent, level) {
        this.dom = elt("div", {class: "game"}, drawGrid(level))
        this.actorsLayer = null
        parent.appendChild(this.dom)
    }
    clear() { this.dom.remove(); }

}

DOMDisplay.prototype.syncState = function (state) {
    if (this.actorsLayer) this.actorsLayer.remove()
    this.actorsLayer = drawActors(state.actors)

    this.dom.appendChild(this.actorsLayer);
    this.dom.className = `game ${state.status}`
    this.scrollPlayerIntoView(state)
}

DOMDisplay.prototype.scrollPlayerIntoView = function(state) {
    let width = this.dom.clientWidth;
    let height = this.dom.clientHeight;
    let margin = width / 3

    let right, left, top, bottom;
    left = this.dom.scrollLeft
    right = left + width
    top = this.dom.scrollTop
    bottom = top + height 


    let center = state.player.pos.plus(state.player.size.times(0.5)).times(scale)

    if (center.x < left + margin) {
        this.dom.scrollLeft = center.x - margin
    } else if (center.x > right - margin) {
        this.dom.scrollLeft = center.x - width + margin
    }

    if (center.y < top + margin) {
        this.dom.scrollTop = center.y - margin;
      } else if (center.y > bottom - margin) {
        this.dom.scrollTop = center.y + margin - height;
      }
}


function runAnimation(frameFunc) {
    let lastTime = null;
    function frame(time) {
      if (lastTime != null) {
        let timeStep = Math.min(time - lastTime, 100) / 1000;
        if (frameFunc(timeStep) === false) return;
      }
      lastTime = time;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function runLevel(level, Display) {
    let display = new Display(document.body, level);
    let state = State.start(level);
    let ending = 1;
    return (function () {
      runAnimation(time => {
        state = state.update(time, arrowKeys);
        display.syncState(state);
        if (state.status == "playing") {
          return true;
        } else if (ending > 0) {
          ending -= time;
          return true;
        } else {
          display.clear();
          return false;
        }
      });
    })();
  }

let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;

runLevel(new Level(simpleLevelPlan), DOMDisplay)