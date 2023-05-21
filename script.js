// Define constants and variables
const zPlane = d3.select("#z-plane");
let zeros = [];
let poles = [];

// Create the z-plane plot
const svg = zPlane.append("svg")
    .attr("width", 500)
    .attr("height", 500)
    

function drawPlane() {
    // Draw the unit circle
    svg.append("circle")
        .attr("cx", 250)
        .attr("cy", 250)
        .attr("r", 200)
        .attr("class", "unit-circle")
        .attr("fill", "white")
        .attr("stroke", "black");
    
    // Draw x-axis
    svg.append("line")
        .attr("x1", 0)
        .attr("y1", 250)
        .attr("x2", 500)
        .attr("y2", 250)
        .attr("class", "axis");
    
    // Draw y-axis
    svg.append("line")
        .attr("x1", 250)
        .attr("y1", 0)
        .attr("x2", 250)
        .attr("y2", 500)
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
            enter => enter.append("circle")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("data-x", d => d.x)
                .attr("data-y", d => d.y)
                .attr("r", 5)
                .attr("class", "pole")
                .call(dragBehavior),
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
            .attr("cy", d.y);
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
    });

const magnitudeDOM = document.getElementById("magnitude-response");

// Create the magnitude response chart
const magnitudeChart = new Chart(magnitudeDOM.getContext("2d"), {
    type: "line",
    data: {
        labels: [], // Placeholder labels
        datasets: [{
            label: "Magnitude Response",
            data: [], // Placeholder data
            borderColor: "blue",
            fill: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: "logarithmic",
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
            fill: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: "logarithmic",
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
                suggestedMin: -180,
                suggestedMax: 180,
                stepSize: 45
            }
        }
    }
});

// Function to calculate frequency response
function calculateFrequencyResponse() {
    const sampleRate = 44100; // Sample rate in Hz
    const frequencyBins = 100; // Number of frequency bins

    const nyquistFrequency = sampleRate / 2;
    const frequencyStep = Math.pow(nyquistFrequency, 1 / frequencyBins);

    const frequencies = [];
    const magnitudes = [];
    const phases = [];

    for (let i = 0; i < frequencyBins; i++) {
        const frequency = Math.pow(frequencyStep, i);
        const omega = 2 * Math.PI * frequency / sampleRate;

        let magnitude = 0;
        let phase = 0;

        for (const zero of zeros) {
            const distance = Math.sqrt(Math.pow(zero.x - 250, 2) + Math.pow(zero.y - 250, 2));
            const poleAngle = Math.atan2(250 - zero.y, zero.x - 250);
            const zeroAngle = Math.atan2(250 - zero.y, zero.x - 250) + omega;

            magnitude += Math.pow(distance, 2) / (Math.pow(distance, 2) - 2 * distance * Math.cos(zeroAngle - poleAngle) + 1);
            phase += Math.atan2(Math.sin(zeroAngle - poleAngle), Math.cos(zeroAngle - poleAngle));
        }

        for (const pole of poles) {
            const distance = Math.sqrt(Math.pow(pole.x - 250, 2) + Math.pow(pole.y - 250, 2));
            const poleAngle = Math.atan2(250 - pole.y, pole.x - 250);
            const zeroAngle = Math.atan2(250 - pole.y, pole.x - 250) + omega;

            magnitude /= Math.pow(distance, 2) / (Math.pow(distance, 2) - 2 * distance * Math.cos(zeroAngle - poleAngle) + 1);
            phase -= Math.atan2(Math.sin(zeroAngle - poleAngle), Math.cos(zeroAngle - poleAngle));
        }

        magnitude = 10 * Math.log10(magnitude); // Convert magnitude to dB
        phase *= (180 / Math.PI); // Convert phase to degrees

        frequencies.push(frequency);
        magnitudes.push(magnitude);
        phases.push(phase);
    }

    return { frequencies, magnitudes, phases };
}

// Function to update the frequency response plots
function updateFrequencyResponse() {
    const { frequencies, magnitudes, phases } = calculateFrequencyResponse();

    magnitudeChart.data.labels = frequencies;
    magnitudeChart.data.datasets[0].data = magnitudes;
    magnitudeChart.update();

    phaseChart.data.labels = frequencies;
    phaseChart.data.datasets[0].data = phases;
    phaseChart.update();
}
// Add event listeners for placing zeros and poles
svg.on("click", function () {
    const coordinates = d3.pointer(event); // Pass the event object explicitly
    console.log(coordinates);
    const point = {
        x: coordinates[0],
        y: coordinates[1]
    };
    const clickedElement = d3.select(event.target);
    console.log(clickedElement);
    // Check if the clicked element is a zero or pole
    if (clickedElement.classed("zero")) {
        // Delete the clicked zero
        zeros = zeros.filter(z => !(z.x === point.x && z.y === point.y));
        updateZPlane();
        updateFrequencyResponse();
        return;
    } else if (clickedElement.classed("pole")) {
        // Delete the clicked pole
        poles = poles.filter(p => !(p.x === point.x && p.y === point.y));
        updateZPlane();
        updateFrequencyResponse();
        return;
    }
    if (event.shiftKey) { // Use event.shiftKey instead of d3.event.shiftKey
        // Add conjugate zeros/poles
        zeros.push(point, { x: point.x, y: 500 - point.y });
        poles.push(point, { x: point.x, y: 500 - point.y });
    } else {
        // Add single zero/pole
        zeros.push(point);
        poles.push(point);
        console.log(zeros);
    }
    updateZPlane();
    updateFrequencyResponse();
});




// Initialize the z-plane plot and frequency response graphs
drawPlane();
updateZPlane();
updateFrequencyResponse();
