// Define constants and variables
const zPlane = d3.select("#z-plane");
let zeros = [];
let poles = [];

// Create the z-plane plot
const svg = zPlane.append("svg")
    .attr("width", 500)
    .attr("height", 500)
    
// Draw the unit circle
svg.append("circle")
    .attr("cx", 250)
    .attr("cy", 250)
    .attr("r", 200)
    .attr("class", "unit-circle")
    .attr("fill", "white")
    .attr("stroke", "black");

// Draw the x-axis
svg.append("line")
    .attr("x1", 0)
    .attr("y1", 250)
    .attr("x2", 500)
    .attr("y2", 250)
    .attr("class", "axis");

// Draw the y-axis
svg.append("line")
    .attr("x1", 250)
    .attr("y1", 0)
    .attr("x2", 250)
    .attr("y2", 500)
    .attr("class", "axis");
    

// Function to update the z-plane plot
function updateZPlane() {
    // Remove all existing zeros and poles
    svg.selectAll(".zero").remove();
    svg.selectAll(".pole").remove();

    // Draw zeros
    svg.selectAll(".zero")
        .data(zeros)
        .enter().append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 5)
        .attr("class", "zero")
        .call(dragBehavior);

    // Draw poles
    svg.selectAll(".pole")
        .data(poles)
        .enter().append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 5)
        .attr("class", "pole")
        .call(dragBehavior);
}

// Define drag behavior for zeros and poles
const dragBehavior = d3.drag()
    .on("drag", function (d) {
        d.x = d3.event.x;
        d.y = d3.event.y;
        updateZPlane();
        updateFrequencyResponse();
    });

// Function to update the frequency response graphs
function updateFrequencyResponse() {
    // Calculate frequency response based on zeros and poles
    // ...
    // Update magnitude response graph
    // ...
    // Update phase response graph
    // ...
}

// Add event listeners for placing zeros and poles
// Add event listeners for placing zeros and poles
// Add event listeners for placing zeros and poles
svg.on("click", function () {
    const coordinates = d3.pointer(event); // Pass the event object explicitly
    console.log(coordinates);
    const point = {
        x: coordinates[0],
        y: coordinates[1]
    };
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
updateZPlane();
updateFrequencyResponse();
