let time = [];
let amplitude = [];
let filteredAmplitude = [];
let currentTime = [];
let currentAmplitude = [];
let currentFilteredAmplitude = [];
let currentIndex = 0;
let chunkSize = 1;
let maxOriginalAmplitude = -Infinity;
let maxFilteredAmplitude = -Infinity;
let minOriginalAmplitude = Infinity;
let minFilteredAmplitude = Infinity;

const originalSignalPlot = new Chart(document.getElementById("originalSignalCanvas").getContext("2d"), {
    type: "line",
    data: {
        labels: [], // Placeholder labels
        datasets: [{
            label: "Original Signal",
            data: [], // Placeholder data
            borderColor: "red",
            fill: false,
            pointRadius: 0 // Set pointRadius to 0 to remove circles

        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Time (s)"
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Amplitude"
                },
                ticks: {
                    stepSize: 100
                }
            }
        }
    }
});

const filteredSignalPlot = new Chart(document.getElementById("filteredSignalCanvas").getContext("2d"), {
    type: "line",
    data: {
        labels: [], // Placeholder labels
        datasets: [{
            label: "Filtered Signal",
            data: [], // Placeholder data
            borderColor: "red",
            fill: false,
            pointRadius: 0 // Set pointRadius to 0 to remove circles

        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Time (s)"
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Amplitude"
                },
                ticks: {
                    stepSize: 100
                }
            }
        }
    }
});



document.getElementById("signalFileInput").addEventListener("change", (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        const data = event.target.result.split("\n");
        data.forEach((row) => {
            const column = row.split(",");
            time.push(parseFloat(column[0]));
            amplitude.push(parseFloat(column[1]));
            maxOriginalAmplitude = Math.max(maxOriginalAmplitude, parseFloat(column[1]));
            minOriginalAmplitude = Math.min(minOriginalAmplitude, parseFloat(column[1]));
        });
        const [num, den] = transferFunction(zeros, poles);
        filteredAmplitude = filter(amplitude, num, den);
        console.log(filteredAmplitude);
        originalSignalPlot.options.scales.y.min = minOriginalAmplitude;
        originalSignalPlot.options.scales.y.max = maxOriginalAmplitude;
        originalSignalPlot.update();
    }
    reader.readAsText(selectedFile);
});

function filter(amplitude, num, den) {
    const filteredAmplitude = [];
    for (let i = 0; i < amplitude.length; i++) {
        let filteredValue = 0;
        for (let j = 0; j < num.length; j++) {
            if (i - j >= 0) {
                filteredValue += num[j].real * amplitude[i - j];
            }
        }
        for (let j = 1; j < den.length; j++) {
            if (i - j >= 0) {
                filteredValue -= den[j].real * filteredAmplitude[i - j];
            }
        }
        filteredAmplitude.push(filteredValue);
        maxFilteredAmplitude = Math.max(maxFilteredAmplitude, filteredValue);
        minFilteredAmplitude = Math.min(minFilteredAmplitude, filteredValue);

    }
    filteredSignalPlot.options.scales.y.min = minFilteredAmplitude;
    filteredSignalPlot.options.scales.y.max = maxFilteredAmplitude;
    filteredSignalPlot.update();
    return filteredAmplitude;
}

const intervalId = setInterval(() => {
    if (currentIndex < time.length) {
        for (let i = 0; i < chunkSize; i++) {
            currentTime.push(time[currentIndex]);
            currentAmplitude.push(amplitude[currentIndex]);
            currentFilteredAmplitude.push(filteredAmplitude[currentIndex]);
            currentIndex++;
        }
        originalSignalPlot.data.labels = currentTime;
        originalSignalPlot.data.datasets[0].data = currentAmplitude;
        originalSignalPlot.update();

        filteredSignalPlot.data.labels = currentTime;
        filteredSignalPlot.data.datasets[0].data = currentFilteredAmplitude;
        filteredSignalPlot.update();
    }
}, 1000);

document.getElementById("speedSlider").addEventListener("input", (event) => {
    const speed = event.target.value;
    document.getElementById("speedValue").innerHTML = speed;
    chunkSize = speed;
    clearInterval(intervalId);
    const newintervalId = setInterval(() => {
        if (currentIndex < time.length) {
            for (let i = 0; i < chunkSize; i++) {
                currentTime.push(time[currentIndex]);
                currentAmplitude.push(amplitude[currentIndex]);
                currentFilteredAmplitude.push(filteredAmplitude[currentIndex]);
                currentIndex++;
            }
            originalSignalPlot.data.labels = currentTime;
            originalSignalPlot.data.datasets[0].data = currentAmplitude;
            originalSignalPlot.update();

            filteredSignalPlot.data.labels = currentTime;
            filteredSignalPlot.data.datasets[0].data = currentFilteredAmplitude;
            filteredSignalPlot.update();
        }
    }
    , 1000);
});

