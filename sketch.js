// map variable
let simmap;
function setup() {
    createCanvas(400, 400);
    // create a new map
    // check if noiseSeed is given in url parameters
    let url = new URL(window.location.href);
    let seed = url.searchParams.get("seed");
    if (seed) {
        console.log("Seed: " + seed);
        NoiseSeed = seed;
    }
    simmap = new Map(seed);
    noStroke();
    simmap.draw();
}

function draw() {
    // selector decides what to draw here
    // background(200);
    // draw the map
    
}

