const zPlanePhase = d3.select("#z-plane-phase");

// Create the z-plane plot
const svgPhase = zPlanePhase.append("svg")
    .attr("width", 400)
    .attr("height", 400)

function drawPlanePhase() {
    // Draw the unit circle
    // add drag cursor
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

let correctedZeroes = [];
let correctedPoles = [];

function updateCorrectedZPlane() {
    // Remove all existing zeros and poles
    svgPhase.selectAll(".zero").remove();
    svgPhase.selectAll(".pole").remove();

    // Draw zeros
    svgPhase.selectAll(".zero")
    .data(correctedZeroes)
    .join(
        enter => enter.append("circle")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("data-x", d => d.x)
            .attr("data-y", d => d.y)
            .attr("r", 5)
            .attr("class", "zero")
            .attr("fill", "white")
            .attr("stroke", "black"),
            
            update => update.attr("cx", d => d.x).attr("cy", d => d.y)
            );
            
            // Update poles
            svgPhase.selectAll(".pole")
            .data(correctedPoles)
            .join(
                enter => enter.append("circle")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("data-x", d => d.x)
                .attr("data-y", d => d.y)
                .attr("r", 5)
                .attr("class", "pole"),
            update => update.attr("cx", d => d.x).attr("cy", d => d.y)
        );
}

function addCorrectedZeroPoles(a)
{
    let {real, imaginary} = toRealAndImaginary(a);
    let zero = {x: (real * 200)+200 , y: 200-(imaginary * 200)};
    let pole = {x: (real * 200)+201 , y: 201-(-imaginary * 200)};
    correctedZeroes.push(zero);
    correctedPoles.push(pole);
    updateCorrectedZPlane();
    calculatePhaseResponse();
    updatePhasePlotAfterFilter();
}

function toRealAndImaginary(a)
{
    let real = a.split("+")[0];
    let imaginary = a.split("+")[1].split("j")[0];
    real = parseFloat(real);
    imaginary = parseFloat(imaginary);
    return {real, imaginary};
}

function deleteCorrectedZeroPoles(a)
{
    let {real, imaginary} = toRealAndImaginary(a);
    let zero = {x: (real * 200)+200 , y: 200-(imaginary * 200)};
    let pole = {x: (-real * 200)+200 , y: 201-(-imaginary * 200)};
    // let pole = zero;
    // pole.x = zero.x;
    // pole.y = zero.y * -1;
    correctedZeroes = correctedZeroes.filter((item) => item.x !== zero.x && item.y !== zero.y);
    correctedPoles = correctedPoles.filter((item) => item.x !== pole.x && item.y !== pole.y);
    updateCorrectedZPlane();
    calculatePhaseResponse();
    updatePhasePlotAfterFilter();

}

function calculateFilterAfterCorrection()
{
    let finalZeroes = zeros;
    let finalPoles = poles;
    finalZeroes = finalZeroes.concat(correctedZeroes);
    finalPoles = finalPoles.concat(correctedPoles);
    console.log(finalZeroes, finalPoles);
    const [num, den] = transferFunction(finalZeroes, finalPoles);
    const [frequencies, h] = freqz(num, den, 1000);
    phases = h.map(x => math.atan2(math.im(x), math.re(x)) * 180 / Math.PI);
    return {frequencies, phases};
}

function updatePhasePlotAfterFilter() {
    const { frequencies,phases } = calculateFilterAfterCorrection();
    // console.log(phases);
    phaseAfterFilterPlot.data.labels = frequencies;
    phaseAfterFilterPlot.data.datasets[0].data = phases;
    phaseAfterFilterPlot.update();
}

function calculateCorrectedFilter()
{
    console.log(correctedZeroes, correctedPoles);
    const [num, den] = transferFunction(correctedZeroes, correctedPoles);
    console.log(num, den);

    // TODO: Compute the frequency response given the numerator and denominator
    const [frequencies, h] = freqz(num, den, 1000);
    let magnitudes = [];
    let phases = [];
    magnitudes = h.map(x => 20 * Math.log10(math.abs(x)));
    // phases = phases.map(x => x * 180 / Math.PI);
    phases = h.map(x => math.atan2(math.im(x), math.re(x)) * 180 / Math.PI);
    return { frequencies, magnitudes, phases };
}

function calculatePhaseResponse()
{
    const { frequencies, magnitudes, phases } = calculateCorrectedFilter();
    phasePlot.data.labels = frequencies;
    phasePlot.data.datasets[0].data = phases;
    phasePlot.update();

}

document.getElementById("addCorrectedFilter").addEventListener("click", () => {
    let a = document.getElementById("correctedZeroPole").value;
    console.log(a);
    addCorrectedZeroPoles(a);
    const filtersList = document.getElementById("filtersList");
    const newFilter = document.createElement("div");
    newFilter.innerHTML = `
    <div class="filterItem flex flex row w-full items-center bg-gray-100 rounded mb-2">
        <p class="w-full text-black ml-2 ">
            ${a}
        </p>
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" class="deleteFilter" onclick="handleDelete(this)">delete</button>
    </div>`;
    filtersList.appendChild(newFilter);
});

function handleDelete(e){
    // console.log(e.parentNode.firstChild.nextSibling);
    let a = e.parentNode.firstChild.nextSibling.innerHTML;
    deleteCorrectedZeroPoles(a);
    e.parentNode.remove();
    
};

document.getElementById("customFilterButton").addEventListener("click", () => {
    let customFilter = document.getElementById("customFilterInput").value;
    document.getElementById("customFilterInput").value = "";    
    const filtersDropdown = document.getElementById("correctedZeroPole");
    const newFilter = document.createElement("option");
    newFilter.innerHTML = customFilter;
    filtersDropdown.appendChild(newFilter);
});


drawPlanePhase();