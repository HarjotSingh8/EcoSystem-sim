let species_ref = {
        // "canis lupus": {"common_name": "wolf", "diet": "carnivore", "pantheria_data": { "adult_body_mass_g": 31, "adult_body_length_cm": 105, "activity_cycle": 2, "age_at_first_birth_days": 547, "gestation_length_days": 63, "litter_size": 4.98, "litters_per_year": 2, "max_longevity_months": 354, "weaning_age_days": 44.82, "home_range_km2": 159.86,}},
        // 'alces': {'common_name': 'moose', 'diet': 'herbivore', 'pantheria_data': {'adult_body_mass_g': 461.90076, 'adult_body_length_cm': 293.04699999999997, 'activity_cycle': '2.00', 'age_at_first_birth_days': '1216.66', 'gestation_length_days': '235.00', 'litter_size': '1.25', 'litters_per_year': '1.70', 'max_longevity_months': '324.00', 'weaning_age_days': '98.85', 'home_range_km2': '71.75'}},
        // 'canadensis': {'common_name': 'beaver', 'diet': 'herbivore', 'pantheria_data': {'adult_body_mass_g': 18.12441, 'adult_body_length_cm': 75.474, 'activity_cycle': '2.00', 'age_at_first_birth_days': '220', 'gestation_length_days': '111.59', 'litter_size': '2.10', 'litters_per_year': '1.00', 'max_longevity_months': '180.00', 'weaning_age_days': '46.50', 'home_range_km2': '5.5'}}
        "canis lupus": {"common_name": "wolf", "diet": "carnivore", "pantheria_data": { "adult_body_mass_g": 31, "adult_body_length_cm": 105, "activity_cycle": 2, "age_at_first_birth_days": 547, "gestation_length_days": 63, "litter_size": 4.98, "litters_per_year": 2, "max_longevity_months": 354, "weaning_age_days": 44.82, "home_range_km2": 2500,}},
        'alces': {'common_name': 'moose', 'diet': 'herbivore', 'pantheria_data': {'adult_body_mass_g': 461.90076, 'adult_body_length_cm': 293.04699999999997, 'activity_cycle': '2.00', 'age_at_first_birth_days': '1216.66', 'gestation_length_days': '235.00', 'litter_size': '1.25', 'litters_per_year': '1.70', 'max_longevity_months': '324.00', 'weaning_age_days': '98.85', 'home_range_km2': '900'}},
        'canadensis': {'common_name': 'beaver', 'diet': 'herbivore', 'pantheria_data': {'adult_body_mass_g': 18.12441, 'adult_body_length_cm': 75.474, 'activity_cycle': '2.00', 'age_at_first_birth_days': '220', 'gestation_length_days': '111.59', 'litter_size': '2.10', 'litters_per_year': '1.00', 'max_longevity_months': '180.00', 'weaning_age_days': '46.50', 'home_range_km2': '400'}}
    }

class Agent {
    constructor(species_ref) {
        this.alive = true;
        this.safe_to_delete = false;
        this.species = species_ref;
        this.age = Math.random() * this.species.pantheria_data.max_longevity_months*30;
        this.max_age = this.species.pantheria_data.max_longevity_months*30*Math.random();
        this.starvation_days = 0;
        this.location = simmap.spawn_location();
        this.sex = "male";
        if (Math.random() > 0.5) {
            this.sex = "female";
        }
        this.move_distance = Math.sqrt(this.species.pantheria_data.home_range_km2) * global_time_step;
        this.move_distance_in_pixels = this.move_distance * simmap.scale/16;
        this.house_move_distance = Math.sqrt(this.species.pantheria_data.home_range_km2) / 100;
        this.house_move_distance_in_pixels = this.house_move_distance * simmap.scale;
        this.last_reproduce = 100000;
        this.meat_calories = this.species.pantheria_data.adult_body_mass_g * 1500;
    }
    // draw
    draw() {
        // draw a dot
        // fill(0);
        if (!this.alive) {
            fill(0, 0, 0);
            ellipse(this.location[0], this.location[1], 4, 4);
            return;
        }
        if (this.species.diet === "herbivore") {
            fill(0, 255, 0);
        }
        if (this.species.diet === "carnivore") {
            fill(255, 0, 0);
        }
        ellipse(this.location[0], this.location[1], 4, 4);
    }
    // update
    update(time_step) {
        /**
         * update age
         * check if the agent should be dead (age)
         * check if the agent can feed
         * feed if possible
         * if not fed, increase starvation days
         * check if agent should reproduce
         * check if agent can reproduce
         * reproduce if possible
         * move
         */
        // update age
        if (!this.alive) {
            // decay meat by 10 percent per day
            this.meat_calories -= this.species.pantheria_data.adult_body_mass_g * 1500 * 0.1 * global_time_step;
            this.safe_to_delete = this.meat_calories <= 0;
            return;
        }
        this.age += time_step;
        this.last_reproduce += time_step;
        // check if the agent should be dead (age)
        // if (this.age > this.species.pantheria_data.max_longevity_months*30 || this.starvation_days > 30) {
            if (this.age > this.max_age || this.starvation_days > 30) {
            this.alive = false;
        }
        // check if the agent can feed
        // check agent's diet type (herbivore, carnivore) [TODO] add omnivore
        if (this.species.diet === "herbivore") {
            // check if the agent can feed
            
            let can_feed = simmap.check_plant_food(this.location[0], this.location[1], this.species.pantheria_data.adult_body_mass_g * 30 * global_time_step, this.move_distance_in_pixels);
            // feed if possible
            if (can_feed) {
                simmap.feed_plant(this.location[0], this.location[1], this.species.pantheria_data.adult_body_mass_g * 30 * global_time_step, this.move_distance_in_pixels);
                // reduce starvation by 10 percent
                this.starvation_days *= 0.9;
            } else {
                this.starvation_days += time_step;
            }
        }
        if (this.species.diet === "carnivore") {
            // check if the agent can feed
            // pass x, y, calories, house_move_distance
            // console.log(this.species.pantheria_data.adult_body_mass_g * 30)
            let can_feed = simmap.check_meat_food(this.location[0], this.location[1], this.species.pantheria_data.adult_body_mass_g * 30 * global_time_step, this.move_distance_in_pixels);
            // feed if possible
            if (can_feed) {
                simmap.feed_meat(this.location[0], this.location[1], this.species.pantheria_data.adult_body_mass_g * 30 * global_time_step, this.move_distance_in_pixels);
                // reduce starvation by 10 percent
                this.starvation_days *= 0.9;
            } else {
                this.starvation_days += time_step;
            }
        }
        // check if agent should reproduce
        // if (this.age > this.species.pantheria_data.age_at_first_birth_days && this.last_reproduce > 365/this.species.pantheria_data.litters_per_year) {
            if (this.age > this.species.pantheria_data.age_at_first_birth_days) {
            // check if agent can reproduce
            if (this.starvation_days < 10 && Math.random() < global_time_step * this.species.pantheria_data.litters_per_year * this.species.pantheria_data.litter_size / (365)) {
                // reproduce if possible
                this.reproduce();
            }
        }
        // move
        this.move();
    }


    move() {
        // move the agent, agent can only move sqrt(home_range_km2)/10 km in one time step
        // get random direction
        let angle = Math.random() * 360;
        // get new location
        let new_x = this.location[0] + Math.cos(angle) * this.house_move_distance_in_pixels * global_time_step;
        let new_y = this.location[1] + Math.sin(angle) * this.house_move_distance_in_pixels * global_time_step;
        // convert to integer
        new_x = Math.round(new_x);
        new_y = Math.round(new_y);
        // check if new location is within bounds and not water
        if (new_x < 0 || new_x >= simmap.pixels || new_y < 0 || new_y >= simmap.pixels) {
            return;
        }
        if (simmap.get_pixel(new_x, new_y)["region"] == "ocean" || simmap.get_pixel(new_x, new_y)["region"] == "shallows") {
            return;
        }
        // update location
        this.location = [new_x, new_y];
    }

    reproduce() {
        // if not female, return
        if (this.sex!="female") {
            return;
        }
        // check if the agent can reproduce
        let can_reproduce = simmap.check_reproduce(this.location, this.species, this.move_distance_in_pixels);
        // reproduce if possible
        if (can_reproduce) {
            let new_agent = new Agent(this.species);
            new_agent.location = this.location;
            simmap.agents.push(new_agent);
            this.last_reproduce = 0;
        }
    }

}