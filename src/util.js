import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';
import './util.css'

export const sortData = (data, casesType) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
        if (a[casesType] > b[casesType]) {
            return -1;
        }
        else {
            return 1;
        }
    })
    return sortedData;
}

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

export const showDataOnMap = (data, caseType = 'cases') => (
    data.map(country => (
        <Circle center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[caseType].hex}
            fillColor={casesTypeColors[caseType].hex}
            radius={
                Math.sqrt(country[caseType]) * casesTypeColors[caseType].multiplier
            }>
            <Popup>
                <div className="info_container">
                    <div className="info_image" style={{ backgroundImage: `url(${country.countryInfo.flag})` }} />
                    <div className="info_name">{country.country}</div>
                    <div className="info_cases">Cases : {numeral(country.cases).format("0,0")}</div>
                    <div className="info_recovered">Recovered : {numeral(country.recovered).format("0,0")}</div>
                    <div className="info_recovered">Vaccinated : {numeral(country.vaccine).format("0,0")}</div>
                    <div className="info_deaths">Deaths : {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ))
);

export const prettyPrintStat = (stat) => {
    return stat ? `+${numeral(stat).format("0.0a")}` : '+0';
}