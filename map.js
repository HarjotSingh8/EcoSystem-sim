// make a map class here

let regions = {
    "ocean": {
        "altitude_range": [-100.0, 0.0],
        "temperature_range": [0.0, 1],
        "rainfall_range": [0.0, 1],
        "plant_based_resource_regrowth": 0.0,
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
        "plant_based_resource_regrowth": 0.0,
        "color_function": function(value) {
            return color(59, 179, 200)
            return color(0, 105, 148)

            // let terrain_color = - value * 255;
            // terrain_color = -100 + terrain_color - terrain_color % 60;
            // // clip terrain_color to 0-255
            // if (terrain_color < 0) {
            //     terrain_color = 0;
            // }
            // if (terrain_color > 255) {
            //     terrain_color = 255;
            // }
            // return color(30, 60, 255-terrain_color);
        }
    },
    // "shallows": {
    //     "altitude_range": [0.0, 0.1],
    //     "temperature_range": [0.0, 1],
    //     "rainfall_range": [0.0, 1],
    //     "color_function": function(value) {
    //         return color(60, 180, 200);
    //     }
    // },
    "beach": {
        "altitude_range": [0.0, 0.1],
        "temperature_range": [0.0, 1],
        "rainfall_range": [0.0, 1],
        "plant_based_resource_regrowth": 0.3,
        "color_function": function(value) {
            return color(194, 178, 128);
        }
    },
    "grassland": {
        "altitude_range": [0.1, 0.25],
        "temperature_range": [0.0, 1],
        "rainfall_range": [0.0, 1],
        "plant_based_resource_regrowth": 0.7,
        "color_function": function(value) {
            return color(100, 120, 60);
        }
    },
    "forest": {
        "altitude_range": [0.25, 0.45],
        "temperature_range": [0.0, 1],
        "rainfall_range": [0.0, 1],
        "plant_based_resource_regrowth": 1.0,
        "color_function": function(value) {
            return color(90, 90, 60);
        }
    },
    "mountain": {
        "altitude_range": [0.45, 0.55],
        "temperature_range": [0.0, 1],
        "rainfall_range": [0.0, 1],
        "plant_based_resource_regrowth": 0.5,
        "color_function": function(value) {
            return color(90, 70, 60);
        }
    },
    "snow": {
        "altitude_range": [0.55, 1.0],
        "temperature_range": [0.0, 1],
        "rainfall_range": [0.0, 1],
        "plant_based_resource_regrowth": 0.2,
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
        this.size = 100;
        this.pixels = 400;
        this.scale = this.pixels / this.size;
        // get pixels from canvas size
        // this.pixels = 800;
        this.noise_scale = 0.03;
        this.regen_multiplier = 5000;
        this.agents = []
        if (seed) {
            noiseSeed(seed);
        }
        // create perlin noise object with seed
        // this.noise = new noise(seed);
        // noiseSeed(seed);
        // spawn agents
        // this.init_agents();
        this.init_resource_generation();
        }
    
    // function to draw map
    draw_resources() {
        // draw resources on the map
        for (let x = 0; x < this.pixels; x++) {
            for (let y = 0; y < this.pixels; y++) {
                let resource_block = this.resource_blocks[x][y];
                if (resource_block.resources > 0) {
                    console.log(Math.round(max(0, min(255, 0 + resource_block.resources * 255))))
                    fill(
                        Math.round(max(0, min(255, 0 + resource_block.resources * 255)))
                    );
                    rect(x, y, 1, 1);
                }
                else {
                    fill(0);
                    rect(x, y, 1, 1);
                }
            }
        }
    }
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
        // console.log("min: " + min + " max: " + max);
    }
    draw_agents() {
        for (let agent of this.agents) {
            agent.draw();
        }
    }
    simulate_agents() {
        for (let agent of this.agents) {
            agent.update(global_time_step);
            // remove agent if dead
            if (!agent.alive && agent.safe_to_delete) {
                let index = this.agents.indexOf(agent);
                this.agents.splice(index, 1);
            }
        }
        // increment resource blocks
        for (let x = 0; x < this.pixels; x++) {
            for (let y = 0; y < this.pixels; y++) {
                let resource_block = this.resource_blocks[x][y];
                resource_block.increment(global_time_step);
            }
        }
    }
    init_agents() {
        let min_agents = 20;
        for (let species in species_ref) {
            let number = Math.floor(Math.random() * min_agents) + min_agents;
            if(species_ref[species]["diet"] == "herbivore") {
                number *= 20;
            }
            this.spawn_agents(species, number);
        }
    }
    spawn_agents(species, number) {
        for (let i = 0; i < number; i++) {
            let agent = new Agent(species_ref[species]);
            let location = this.spawn_location();
            this.agents.push(agent);
       }
    }

    draw_resources() {
        // draw resources on the map
        for (let x = 0; x < this.pixels; x++) {
            for (let y = 0; y < this.pixels; y++) {
                let resource_block = this.resource_blocks[x][y];
                if (resource_block.resources > 0) {
                    fill(0, 255, 0);
                    rect(x, y, 1, 1);
                }
            }
        }
    }

    // function to return details about a given pixel
    get_pixel(x, y) {
        let value = noise(x * this.noise_scale, y * this.noise_scale) * 255;
        let falloff = (200 * (x - this.pixels / 2) **2) / ((this.pixels ** 2) / 4) + (200 * ((y - this.pixels / 2) ** 2)) / ((this.pixels ** 2) / 4);
        value -= falloff;
        value /= 255;
        let terrain_region = null;
        let terrain_color = null;
        for (let region in regions) {
            let altitude_range = regions[region]["altitude_range"];
            // console.log(altitude_range)
            if (value >= altitude_range[0] && value < altitude_range[1]) {
                terrain_region = region;
                terrain_color = regions[region]["color_function"](value/255);
            }
        }
        return {
            "value": value,
            "region": terrain_region,
            "terrain_color": terrain_color
        }
    }
    
    spawn_location() {
        // spawn agents in a random location, must be on land
        while (true) {
            let x = Math.floor(Math.random() * this.pixels);
            let y = Math.floor(Math.random() * this.pixels);
            let pixel = this.get_pixel(x, y);
            if (pixel["region"] !== "ocean" && pixel["region"] !== "shallows") {
                return [x, y];
            }
        }
    }

    // init plant based food resources
    // plant based resource generation is measured in blocks on the map
    init_resource_generation() {
        // create a 2d array of resource blocks
        // resource blocks are 1km x 1km
        this.resource_blocks = [];
        for (let x = 0; x < this.pixels; x++) {
            this.resource_blocks.push([]);
            for (let y = 0; y < this.pixels; y++) {
                this.resource_blocks[x].push(new ResourceBlock(x, y, regions[this.get_pixel(x, y)["region"]]["plant_based_resource_regrowth"]*this.regen_multiplier));
            }
        }
    }

    check_plant_food(x, y, calories, distance) {
        // // console.log(x, y)
        // let resource_block = this.resource_blocks[x][y];
        // if (resource_block.resources >= calories) {
        //     return true;
        // }
        // return false;
        distance = Math.floor(distance/2);
        let total_calories = 0;
        // check if there are any plant based resources within distance of x, y
        for (let i = x - distance; i < x + distance; i++) {
            for (let j = y - distance; j < y + distance; j++) {
                // check if i, j is within bounds
                if (i < 0 || i >= this.pixels || j < 0 || j >= this.pixels) {
                    continue;
                }
                // if it is a water pixel, continue
                if (this.get_pixel(i, j)["region"] == "ocean" || this.get_pixel(i, j)["region"] == "shallows") {
                    continue;
                }
                let resource_block = this.resource_blocks[i][j];
                total_calories += resource_block.resources;
            }
        }
        if (total_calories >= calories) {
            return true;
        }
        return false;
    }

    feed_plant(x, y, calories, distance) {
        distance = Math.floor(distance/2);
        // for all resource blocks within distance of x, y, reduce resources by calories/number of blocks
        let total_blocks = distance ** 2;
        let calories_per_block = calories / total_blocks;
        for (let i = x - distance; i < x + distance; i++) {
            for (let j = y - distance; j < y + distance; j++) {
                // check if i, j is within bounds
                if (i < 0 || i >= this.pixels || j < 0 || j >= this.pixels) {
                    continue;
                }
                // if it is a water pixel, continue
                if (this.get_pixel(i, j)["region"] == "ocean" || this.get_pixel(i, j)["region"] == "shallows") {
                    continue;
                }
                this.resource_blocks[i][j].resources -= calories_per_block;
            }
        }

        // let resource_block = this.resource_blocks[x][y];
        // resource_block.resources -= calories;
    }

    check_meat_food(x, y, calories, distance) {
        // console.log(distance)
        // check if there are any herbivorous agents near this location
        // if there are, return true
        let nearby_agents = this.find_agents(x, y, distance, "herbivore");
        // calculate calories of all nearby agents
        let total_calories = 0;
        // assume 1 kg of meat is 1500 calories
        for (let agent of nearby_agents) {
            total_calories += agent.meat_calories;
        }
        if (total_calories >= calories) {
            return true;
        }
    }

    find_agents(x, y, distance, diet) {
        // find all agents within a certain distance of a location
        // return a list of agents
        let nearby_agents = [];
        for (let agent of this.agents) {
            // check if agent is alive
            // if (!agent.alive) {
            //     continue;
            // }
            let agent_x = agent.location[0];
            let agent_y = agent.location[1];
            let distance_to_agent = Math.sqrt((agent_x - x) ** 2 + (agent_y - y) ** 2);
            if (distance_to_agent < distance && agent.species.diet === diet) {
                nearby_agents.push(agent);
            }
        }
        return nearby_agents;
    }


    feed_meat(x, y, calories, distance) {
        // find the nearest herbivorous agent, kill it and feed the agent
        let nearby_agents = this.find_agents(x, y, distance, "herbivore");
        // calculate calories of all nearby agents
        let total_calories = 0;
        // eat dead agents first
        for (let agent of nearby_agents) {
            if (agent.alive && agent.safe_to_delete!=true) {
                continue;
            }
            if (total_calories < calories) {
                // eat the agent
                if (agent.meat_calories > calories - total_calories) {
                    agent.meat_calories -= calories - total_calories;
                    total_calories = calories;
                }
                else {
                    total_calories += agent.meat_calories;
                    agent.meat_calories = 0;
                    agent.safe_to_delete = true;
                }
            }
            else {
                break;
            }
        }
        // then kill alive agents
        for (let agent of nearby_agents) {
            if (agent.alive != true) {
                continue;
            }
            if (total_calories < calories) {
                // eat the agent
                if (agent.meat_calories > calories - total_calories) {
                    agent.meat_calories -= calories - total_calories;
                    total_calories = calories;
                    agent.alive = false;
                }
                else {
                    total_calories += agent.meat_calories;
                    agent.meat_calories = 0;
                    agent.alive = false;
                }
            }
            else {
                break;
            }
        }
    }

    // reproduce
    check_reproduce(location, species, distance) {
        let nearby_agents = this.find_agents_reproduce(location, species, distance);
        if (nearby_agents.length > 0) {
            return true;
        }
        return false;
    }
    find_agents_reproduce(location, species, distance) {
        let nearby_agents = [];
        for (let agent of this.agents) {
            // check if agent is alive
            if (!agent.alive) {
                continue;
            }
            // check if agent is male
            if (agent.sex != "male") {
                continue;
            }
            if (agent.age < agent.species.pantheria_data.age_at_first_birth_days) {
                continue;
            }
            let agent_x = agent.location[0];
            let agent_y = agent.location[1];
            let distance_to_agent = Math.sqrt((agent_x - location[0]) ** 2 + (agent_y - location[1]) ** 2);
            if (distance_to_agent < distance && agent.species.common_name === species.common_name) {
                nearby_agents.push(agent);
            }
        }
        return nearby_agents;
    }
    // calculate_regen_rate(x, y, x2, y2) {
    //     // regen rate in an area is the average of regen rates of all pixels in the area
    //     let total_regen_rate = 0;
    //     for (let i = x; i < x2; i++) {
    //         for (let j = y; j < y2; j++) {
    //             // use get_pixel to get the regen rate of the pixel
    //             total_regen_rate += this.get_pixel(i, j)["regen_rate"];
    //         }
    //     }
    //     return total_regen_rate / ((x2 - x) * (y2 - y));
    // }
}

// class to represent a resource block
class ResourceBlock {
    constructor(x, y, regen_rate) {
        this.x = x;
        this.y = y;
        this.cap = 10000;
        this.resources = this.cap;
        this.regen_rate = regen_rate;
        
    }
    increment(time_step) {
        this.resources += this.regen_rate * time_step;
        if (this.resources > this.cap) {
            this.resources = this.cap;
        }
    }
    decrement(time_step) {
        this.resources -= 1 * time_step;
    }
}