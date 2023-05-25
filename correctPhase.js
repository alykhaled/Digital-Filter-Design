const zPlanePhase = d3.select("#z-plane-phase");

// Create the z-plane plot
const svgPhase = zPlanePhase.append("svg")
    .attr("width", 400)
    .attr("height", 400)

function drawPlanePhase() {
    // Draw the unit circle
    svgPhase.append("circle")
        .attr("cx", 200)
        .attr("cy", 200)
        .attr("r", 200)
        .attr("class", "unit-circle")
        .attr("fill", "white")
        .attr("stroke", "black");
    
    // Draw x-axis
    svgPhase.append("line")
        .attr("x1", 0)
        .attr("y1", 200)
        .attr("x2", 400)
        .attr("y2", 200)
        .attr("class", "axis");
    
    // Draw y-axis
    svgPhase.append("line")
        .attr("x1", 200)
        .attr("y1", 0)
        .attr("x2", 200)
        .attr("y2", 400)
        .attr("class", "axis");
}

const phasePlot = new Chart(document.getElementById("filter-phase-plot").getContext("2d"), {
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
        // responsive: true,
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

const phaseAfterFilterPlot = new Chart(document.getElementById("phase-plot-after-filter").getContext("2d"), {
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



function updatePhasePlotAfterFilter(frequencies, phaseResponse) {
    phaseAfterFilterPlot.data.labels = frequencies;
    phaseAfterFilterPlot.data.datasets[0].data = phaseResponse;
    phaseAfterFilterPlot.update();
}

drawPlanePhase();