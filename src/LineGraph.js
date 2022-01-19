import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import './LineGraph.css'

const options = {
    legend: {
        display: false
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        rgb: "rgb(204, 16, 52)",
        half_op: "rgba(204, 16, 52, 0.5)",
        multiplier: 300,
    },
    recovered: {
        hex: "#7dd71d",
        rgb: "rgb(125, 215, 29)",
        half_op: "rgba(125, 215, 29, 0.5)",
        multiplier: 300,
    },
    vaccine: {
        hex: "#f5c542",
        rgb: "rgb(245, 197, 66)",
        half_op: "rgba(245, 197, 66, 0.5)",
        multiplier: 80,
    },
    deaths: {
        hex: "#505050",
        rgb: "rgb(80,80,80)",
        half_op: "rgba(80,80,80,0.5)",
        multiplier: 1500,
    },
};

const buildChartData = (data, casesType) => {
    let chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
        if (lastDataPoint) {
            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint,
            };
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    }
    chartData.pop();
    return chartData;
};

const buildVaccineChartData = (data) => {
    let chartData = [];
    let lastDataPoint;
    for (let date in data) {
        if (lastDataPoint) {
            let newDataPoint = {
                x: date,
                y: data[date] - lastDataPoint,
            };
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[date];
    }

    return chartData;
}

function LineGraph({ casesType }) {
    const [data, setData] = useState({});

    const [vaccine, setVaccine] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            casesType == 'vaccine' ?
                await fetch("https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=120&fullData=false")
                    .then(response => response.json())
                    .then((data) => {
                        let chartData = buildVaccineChartData(data);
                        setVaccine(chartData);
                    })
                : await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        let chartData = buildChartData(data, casesType);
                        setData(chartData);
                    });
        };
        fetchData();
    }, [casesType]);

    return (
        <div className="main_div">
            {casesType == 'vaccine' ?
                (vaccine?.length > 0 && (
                    <Line
                        data={{
                            datasets: [
                                {
                                    backgroundColor: casesTypeColors[casesType].half_op,
                                    borderColor: casesTypeColors[casesType].hex,
                                    data: vaccine
                                },
                            ],
                        }}
                        options={options}
                    />
                ))
                : (data?.length > 0 && (
                    <Line
                        data={{
                            datasets: [
                                {
                                    backgroundColor: casesTypeColors[casesType].half_op,
                                    borderColor: casesTypeColors[casesType].hex,
                                    data: data
                                },
                            ],
                        }}
                        options={options}
                    />
                ))}
        </div>
    );
}

export default LineGraph;