// this file manages the seed data for the noise simulations
// sedd function takes input string
// get default seed value
let original_seed = seed
function seed_value(seed_type) {
    /**
     * seed function takes input string
     * Input string defines what seed are we looking for
     * Types of seeds;
     * - general
     * - map
     * - agents
     * 
     * General seed is when the user has provided a seed in the url parameter "seed"
     * Map seed is when the user has provided a seed in the url parameter "map_seed"
     * Agents seed is when the user has provided a seed in the url parameter "agents_seed"
     * 
     * If user hasn't provided map_seed or agents_seed, the general seed is used instead
     * If the user hasn't provided a general seed, the seed is generated randomly
     */
    // check seed request type
    let url = new URL(window.location.href);
    if (seed_type === "general") {
        // check if seed is given in url parameters
        let seed = url.searchParams.get("seed");
        if (seed) {
            console.log("Seed: " + seed);
            return seed;
        }
        return Math.floor(Math.random() * 1000000);
    } else if (seed_type === "map") {
        // check if seed is given in url parameters
        let seed = url.searchParams.get("map_seed");
        if (seed) {
            console.log("Map Seed: " + seed);
            return seed;
        }
        return seed("general");
    } else if (seed_type === "agents") {
        // check if seed is given in url parameters
        let seed = url.searchParams.get("agents_seed");
        if (seed) {
            console.log("Agents Seed: " + seed);
            return seed;
        }
        return null;
    }
}

function set_seed() {}