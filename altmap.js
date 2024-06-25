// make a map class here

let regions = {
    "ocean": {
        "altitude_range": [-100.0, 0.0],
        "temperature_range": [0.0, 1],
        "rainfall_range": [0.0, 1],
        "color_function": function(value) {
            // return color(59, 179, 200)
            let multiplier = 20000;
            // return color(0, 105+value*multiplier, 148+value*multiplier)
            // make sure range is 0-255
            return color(
                0,
                max(0, min(255, 105 + value * multiplier)),
                max(0, min(255, 148 + value * multiplier))
            );
        }
    },
    "shallows": {
        "altitude_range": [-0.08, 0.0],
        "temperature_range": [0.0, 1],
        "rainfall_range": [0.0, 1],
        "color_function": function(value) {
            return color(59, 179, 200)
        }
    },
    "beach": {
        "altitude_range": [0.0, 0.1],
        "temperature_range": [0.0, 1],
        "rainfall_range": [0.0, 1],
        "color_function": function(value) {
            return color(194, 178, 128);
        }
    },
    "grassland": {
        "altitude_range": [0.1, 0.25],
        "temperature_range": [0.0, 1],
        "rainfall_range": [0.0, 1],
        "color_function": function(value) {
            return color(100, 120, 60);
        }
    },
    "forest": {
        "altitude_range": [0.25, 0.45],
        "temperature_range": [0.0, 1],
        "rainfall_range": [0.0, 1],
        "color_function": function(value) {
            return color(90, 90, 60);
        }
    },
    "mountain": {
        "altitude_range": [0.45, 0.55],
        "temperature_range": [0.0, 1],
        "rainfall_range": [0.0, 1],
        "color_function": function(value) {
            return color(90, 70, 60);
        }
    },
    "snow": {
        "altitude_range": [0.55, 1.0],
        "temperature_range": [0.0, 1],
        "rainfall_range": [0.0, 1],
        "color_function": function(value) {
            return color(255, 255, 255);
        }
    }
};

class Map {
    // constructor() {
    // allow constructor to take seed
    constructor(seed) {
        // create a new map
        // length in kms
        this.size = 50;
        this.pixels = 400;
        // get pixels from canvas size
        // this.pixels = 800;
        this.noise_scale = 0.03;
        if (seed) {
            noiseSeed(seed);
        }
        // create perlin noise object with seed
        // this.noise = new noise(seed);
        // noiseSeed(seed);
        }
    
    // function to draw map
    draw() {
        let min = 0;
        let max = 0;
        let offset = 0;
        // for each pixel in the map
        for (let x = 0; x < this.pixels; x++) {
            for (let y = 0; y < this.pixels; y++) {
                // get the value of the noise at this point
                // let value = noise(x*this.noise_scale, y*this.noise_scale) + 0.5;
                // let value = noise(x / 50 + offset, y / 50, noise(x) / 100) * 255;
                let value = noise(x * this.noise_scale + offset, y * this.noise_scale) * 255;
                // let value = noise(x * this.noise_scale + offset, y * this.noise_scale) * 255;
                let falloff = (200 * (x - this.pixels / 2) **2) / ((this.pixels ** 2) / 4) + (200 * ((y - this.pixels / 2) ** 2)) / ((this.pixels ** 2) / 4);
                value -= falloff;
                value /= 255;
                // let value = 0;
                // value -= (2.5*(x - this.pixels/2)/400) ** 2 + (2.5*(y - this.pixels/2)/400) ** 2;
                // value /= 2;
                // check if this is the min or max value
                if (value > max) {
                    max = value;
                }
                if (value < min) {
                    min = value;
                }
                // map this value to a color
                // let color = map(value, 0, 1, 0, 255);
                // get color from region
                // value is altitude, check which region it is in
                for (let region in regions) {
                    let altitude_range = regions[region]["altitude_range"];
                    if (value >= altitude_range[0] && value < altitude_range[1]) {
                        let terrain_color = regions[region]["color_function"](value/255);
                        fill(terrain_color);
                        rect(x, y, 1, 1);
                    }
                }
                
                // background(color/3);
            }
        }
        console.log("min: " + min + " max: " + max);
        
    }

    }