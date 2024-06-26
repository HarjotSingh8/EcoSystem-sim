var data = []
var resource_percentages = []
var species_counts = {
    "wolf": [],
    "moose": []
};
var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [...Array(data.length).keys()],
        datasets: [{
            label: "World Population",
            fill: false,
            tension: 0,
            borderColor: 'rgb(255, 99, 132)',
            // backgroundColor: 'rgb(255, 99, 132)',
            // borderColor: 'rgb(255, 99, 132)',
            data: [],
        },
        {
            label: "Wolves",
            fill: false,
            tension: 0,
            borderColor: 'rgb(0, 255, 0)',
            data: []
        },
        {
            label: "Moose",
            fill: false,
            tension: 0,
            borderColor: 'rgb(0, 0, 255)',
            data: []
        }
    ]
    },

    // Configuration options go here
    options: {}
});

var ctx_resourceChart = document.getElementById('resourceChart').getContext('2d');
    var resourceChart = new Chart(ctx_resourceChart, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [...Array(data.length).keys()],
        datasets: [{
            label: "Plant based Resources",
            fill: false,
            tension: 0,
            borderColor: 'rgb(255, 99, 132)',
            // backgroundColor: 'rgb(255, 99, 132)',
            // borderColor: 'rgb(255, 99, 132)',
            data: [],
        },
    ]
    },
    // Configuration options go here
    options: {}
});

// chart.canvas.parentNode.style.height = '128px';
// chart.canvas.parentNode.style.width = '128px';

function updateChart() {
    chart.data.datasets[0].data = [...data];
    chart.data.datasets[1].data = [...species_counts["wolf"]];
    chart.data.datasets[2].data = [...species_counts["moose"]];
    chart.data.labels = [...Array(data.length).keys()];
    chart.update();
    resourceChart.data.datasets[0].data = [...resource_percentages];
    resourceChart.data.labels = [...Array(data.length).keys()];
    resourceChart.update();
}


// map variable
let simmap;
let url = new URL(window.location.href);
let seed = url.searchParams.get("seed");
let global_time_step = 7;
function setup() {
    createCanvas(400, 400);
    // create a new map
    // check if noiseSeed is given in url parameters
    
    
    if (seed) {
        console.log("Seed: " + seed);
    }
    else {
        // generate a random seed
        seed = Math.floor(Math.random() * 1000000);
        console.log("Seed: " + seed);
    }
    simmap = new Map(seed);
    simmap.init_agents();
    noStroke();
    simmap.draw();
    simmap.draw_agents();
    simmap.simulate_agents();
    // drawChart();
}

function draw() {
    
    // selector decides what to draw here
    // background(200);
    // draw the map

    simmap.draw();
    // simmap.draw_resources();
    simmap.draw_agents();
    simmap.simulate_agents();
    // console.log(simmap.agents.length)
    // print number of each species
    // data.push(simmap.agents.length)
    
    let numagents = 0
    let species_count = {};
    for (let agent of simmap.agents) {
        if (agent.alive == false) {
            continue;
        }
        numagents += 1;
        if (agent.species.common_name in species_count) {
            species_count[agent.species.common_name] += 1;
        } else {
            species_count[agent.species.common_name] = 1;
        }
    }
    data.push(numagents);
    // push to species_counts
    for (let species in species_count) {
        species_counts[species].push(species_count[species]);
    }
    // if (data.length % 10 == 0) {
        updateChart('active');
    // }
    console.log(species_count);
    // log total number of resources on map
    let total_resources = 0;
    for (let row of simmap.resource_blocks) {
        for (let block of row) {
            total_resources += block.resources/block.cap;
        }
    }
    console.log("Total resources: " + total_resources/(simmap.resource_blocks.length*simmap.resource_blocks[0].length));
    resource_percentages.push(total_resources/(simmap.resource_blocks.length*simmap.resource_blocks[0].length));
}
