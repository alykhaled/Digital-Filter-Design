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
                }
            }
        }
    }
});

let time = [];
let amplitude = [];
let filteredAmplitude = [];

document.getElementById("signalFileInput").addEventListener("change", (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        const data = event.target.result.split("\n");
        data.forEach((row) => {
            const column = row.split(",");
            time.push(parseFloat(column[0]));
            amplitude.push(parseFloat(column[1]));
        });
        const [num, den] = transferFunction(zeros, poles);
        filteredAmplitude = filter(amplitude, num, den);
        console.log(filteredAmplitude);
    }
    reader.readAsText(selectedFile);
});

function filter(amplitude, num, den) {
    const filteredAmplitude = [];
    for (let i = 0; i < amplitude.length; i++) {
        let filteredValue = 0;
        for (let j = 0; j < num.length; j++) {
            if (i - j >= 0) {
                filteredValue += num[j] * amplitude[i - j];
            }
        }
        for (let j = 1; j < den.length; j++) {
            if (i - j >= 0) {
                filteredValue -= den[j] * filteredAmplitude[i - j];
            }
        }
        filteredAmplitude.push(filteredValue);
    }
    return filteredAmplitude;
}



let currentTime = [];
let currentAmplitude = [];
let currentFilteredAmplitude = [];
let currentIndex = 0;
let chunkSize = 1;
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

