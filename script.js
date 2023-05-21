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
        for (let i = 0; i < zeros.length; i++) {
            if (zeros[i].x == firstX && zeros[i].y == firstY) {
                zeros[i].x = lastX;
                zeros[i].y = lastY;
            }
        }
        updateZPlane();
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
        // poles.push(point);
        console.log(zeros);
    }
    updateZPlane();
    updateFrequencyResponse();
});



// Initialize the z-plane plot and frequency response graphs
updateZPlane();
updateFrequencyResponse();
