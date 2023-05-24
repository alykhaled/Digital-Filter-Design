// Define constants and variables
const zPlane = d3.select("#z-plane");
let zeros = [
    {x: (0.1 * 200)+200 , y: 200},
    {x: (0.4 * 200)+200 , y: 200},
    {x: (0.6 * 200)+200 , y: 200},
    // {x: (0.6 * 200)+200 , y: 200},
];
let poles = [
    {x: (0.5 * 200)+200 , y: 200},
    // {x: (0.9 * 200)+200 , y: 200},
];
// let zeros = [];
// let poles = [];

// Create the z-plane plot
const svg = zPlane.append("svg")
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

// Convert coordinates to polar coordinates
function toPolar(x, y) {
    let real = x - 200;
    real = real / 200;
    let imag = 200 - y;
    imag = imag / 200;
    let mag = Math.sqrt(real * real + imag * imag);
    let phase = Math.atan2(imag, real);
    return {mag, phase};
}

function transferFunction(zeros,poles)
{
    let num = [1];
    let den = [1];
    for (let i = 0; i < zeros.length; i++)
    {
        let {mag, phase} = toPolar(zeros[i].x, zeros[i].y);
        num = conv(num, [1, -mag]);
    }
    for (let i = 0; i < poles.length; i++)
    {
        let {mag, phase} = toPolar(poles[i].x, poles[i].y);
        den = conv(den, [1, -mag]);
    }
    return [num, den];
}

function conv(a,b)
{
    let c = [];
    for (let i = 0; i < a.length + b.length - 1; i++)
    {
        c[i] = 0;
        for (let j = 0; j < a.length; j++)
        {
            if (i - j >= 0 && i - j < b.length)
            {
                c[i] += a[j] * b[i - j];
            }
        }
    }
    return c;
}

function freqz(num,den,freqLength)
{
    let w = [];
    let h = [];
    for (let i = 0; i < freqLength; i++)
    {
        w[i] = i * Math.PI / freqLength;
        let numSum = math.complex(0, 0);
        let denSum = math.complex(0, 0);
        for (let j = 0; j < num.length; j++)
        {
            numSum = math.add(numSum, math.multiply(num[j], math.complex(Math.cos(w[i] * j), -Math.sin(w[i] * j))));
        }
        for (let j = 0; j < den.length; j++)
        {
            denSum = math.add(denSum, math.multiply(den[j], math.complex(Math.cos(w[i] * j), -Math.sin(w[i] * j))));
        }

        h[i] = math.divide(numSum, denSum);
    }
    return [w, h];
}

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
    console.log("Updating frequency response");
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

    if (event.shiftKey) { // Use event.shiftKey instead of d3.event.shiftKey
        // Add conjugate zeros/poles
        // zeros.push(point, { x: point.x, y: 400 - point.y });
        // poles.push(point, { x: point.x, y: 400 - point.y });
        poles.push(point);

    } else {
        // Add single zero/pole
        zeros.push(point);
        // poles.push(point);
        console.log(zeros);
    }
    console.log(toPolar(point.x, point.y));
    updateZPlane();
    updateFrequencyResponse();
});




// Initialize the z-plane plot and frequency response graphs
drawPlane();
updateZPlane();
updateFrequencyResponse();
