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