let zeros = [];
let poles = [];

// Create the z-plane plot
const svg = d3.select("#z-plane").append("svg")
    .attr("width", 400)
    .attr("height", 400)
    
function drawPlane() {
    // Draw the unit circle
    svg.append("circle")
        .attr("cx", 200)
        .attr("cy", 200)
        .attr("r", 200)
        .attr("class", "unit-circle")
        .attr("fill", "white")
        .attr("stroke", "black");
    
    // Draw x-axis
    svg.append("line")
        .attr("x1", 0)
        .attr("y1", 200)
        .attr("x2", 400)
        .attr("y2", 200)
        .attr("class", "axis");
    
    // Draw y-axis
    svg.append("line")
        .attr("x1", 200)
        .attr("y1", 0)
        .attr("x2", 200)
        .attr("y2", 400)
        .attr("class", "axis");
}   

// Function to update the z-plane plot
function updateZPlane() {
    // Remove all existing zeros and poles
    svg.selectAll(".zero").remove();
    svg.selectAll(".pole").remove();

    // Draw zeros
    svg.selectAll(".zero")
    .data(zeros)
    .join(
        enter => enter.append("circle")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("data-x", d => d.x)
            .attr("data-y", d => d.y)
            .attr("r", 5)
            .attr("class", "zero")
            .attr("fill", "white")
            .attr("stroke", "black")
            .call(dragBehavior),
            
        update => update.attr("cx", d => d.x).attr("cy", d => d.y)
    );
            
    // Update poles
    svg.selectAll(".pole")
    .data(poles)
    .join(
        enter => enter.append("g")
            .attr("transform", d => `translate(${d.x}, ${d.y})`)
            .attr("data-x", d => d.x)
            .attr("data-y", d => d.y)
            .attr("class", "pole")
            .call(dragBehavior)
            .each(function () {
                d3.select(this).append("circle")
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    .attr("data-x", d => d.x)
                    .attr("data-y", d => d.y)
                    .attr("r", 2)
                    .attr("class", "pole")
                    .attr("fill", "white")

                d3.select(this).append("line")
                    .attr("x1", -5)
                    .attr("y1", -5)
                    .attr("x2", 5)
                    .attr("y2", 5)
                    .attr("stroke", "black")
                    .attr("stroke-width", 3);
                    
                d3.select(this).append("line")
                    .attr("x1", -5)
                    .attr("y1", 5)
                    .attr("x2", 5)
                    .attr("y2", -5)
                    .attr("stroke", "black")
                    .attr("stroke-width", 3);
            }),
        update => update.attr("cx", d => d.x).attr("cy", d => d.y)
    );
}

// Define drag behavior for zeros and poles
const dragBehavior = d3.drag()
    .on("start", function () {
        d3.select(this).raise().classed("active", true);
    })
    .on("drag", function (d) {
        const coordinates = d3.pointer(event);
        d.x = coordinates[0];
        d.y = coordinates[1];
        d3.select(this)
            .attr("cx", d.x)
            .attr("cy", d.y)
            .style("cursor", "grabbing");
        updateFrequencyResponse();
    })
    .on("end", function () {
        d3.select(this).classed("active", false);
        const firstX = d3.select(this).attr("data-x");
        const firstY = d3.select(this).attr("data-y");
        const lastX = d3.select(this).attr("cx");
        const lastY = d3.select(this).attr("cy");

        const isZero = d3.select(this).classed("zero");
        if (firstX == lastX && firstY == lastY) {
            if (isZero) {
                for (let i = 0; i < zeros.length; i++) {
                    if (zeros[i].x == firstX && zeros[i].y == firstY) {
                        zeros.splice(i, 1);
                    }
                }
            }
            else {
                for (let i = 0; i < poles.length; i++) {
                    if (poles[i].x == firstX && poles[i].y == firstY) {
                        poles.splice(i, 1);
                    }
                }
            }
        }
        else{
            if (isZero) {
                for (let i = 0; i < zeros.length; i++) {
                    if (zeros[i].x == firstX && zeros[i].y == firstY) {
                        zeros[i].x = lastX;
                        zeros[i].y = lastY;
                    }
                }
            }
            else {
                for (let i = 0; i < poles.length; i++) {
                    if (poles[i].x == firstX && poles[i].y == firstY) {
                        poles[i].x = lastX;
                        poles[i].y = lastY;
                    }
                }
            }
            
        }
        updateZPlane();
        updateFrequencyResponse();

    });

// Create the magnitude response chart
const magnitudeChart = new Chart(document.getElementById("magnitude-response").getContext("2d"), {
    type: "line",
    data: {
        labels: [], // Placeholder labels
        datasets: [{
            label: "Magnitude Response",
            data: [], // Placeholder data
            borderColor: "blue",
            fill: false,
            pointRadius: 0 // Set pointRadius to 0 to remove circles

        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Frequency (Hz)"
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Magnitude (dB)"
                }
            }
        }
    }
});

// Create the phase response chart
const phaseChart = new Chart(document.getElementById("phase-response").getContext("2d"), {
    type: "line",
    data: {
        labels: [], // Placeholder labels
        datasets: [{
            label: "Phase Response",
            data: [], // Placeholder data
            borderColor: "red",
            fill: false,
            pointRadius: 0 // Set pointRadius to 0 to remove circles

        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Frequency (Hz)"
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Phase (degrees)"
                },
            }
        }
    }
});

// Function to calculate frequency response
function calculateFrequencyResponse() {
    // TODO: Calculate the numerator and denominator of polynomial transfer function representation from zeros and poles
    const [num, den] = transferFunction(zeros, poles);
    // TODO: Compute the frequency response given the numerator and denominator
    const [frequencies, h] = freqz(num, den, 1000);
    let magnitudes = [];
    let phases = [];
    magnitudes = h.map(x => 20 * Math.log10(math.abs(x)));
    // phases = phases.map(x => x * 180 / Math.PI);
    phases = h.map(x => math.atan2(math.im(x), math.re(x)) * 180 / Math.PI);
    return { frequencies, magnitudes, phases };
}

// Function to update the frequency response plots
function updateFrequencyResponse() {
    const { frequencies, magnitudes, phases } = calculateFrequencyResponse();

    const tempFrequencies = frequencies.map(x => x.toFixed(2));
    magnitudeChart.data.labels = tempFrequencies;
    magnitudeChart.data.datasets[0].data = magnitudes;
    magnitudeChart.update();

    phaseChart.data.labels = tempFrequencies;
    phaseChart.data.datasets[0].data = phases;
    phaseChart.update();

    updatePhasePlotAfterFilter(frequencies,phases);
}

// Add event listeners for placing zeros and poles
svg.on("click", function () {
    const coordinates = d3.pointer(event); // Pass the event object explicitly
    const point = {
        x: coordinates[0],
        y: coordinates[1]
    };
    const conjugateToggle = document.getElementById("conjugateToggle").checked;

    if (event.shiftKey) { // Use event.shiftKey instead of d3.event.shiftKey
        // zeros.push(point, { x: point.x, y: 400 - point.y });
        // poles.push(point, { x: point.x, y: 400 - point.y });
        poles.push(point);
        if (conjugateToggle) {
            poles.push({ x: point.x, y: 400 - point.y });
        }

    } else {
        zeros.push(point);
        if (conjugateToggle) {
            zeros.push({ x: point.x, y: 400 - point.y });
        }
    }

    updateZPlane();
    updateFrequencyResponse();
});

document.getElementById("clearZeros").addEventListener("click", function () {
    zeros = [];
    updateZPlane();
    updateFrequencyResponse();
});

document.getElementById("clearPoles").addEventListener("click", function () {
    poles = [];
    updateZPlane();
    updateFrequencyResponse();
});
document.getElementById("clearAll").addEventListener("click", function () {
    zeros = [];
    poles = [];
    updateZPlane();
    updateFrequencyResponse();
});


// Initialize the z-plane plot and frequency response graphs
drawPlane();
updateZPlane();
updateFrequencyResponse();
