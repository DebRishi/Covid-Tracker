import numeral from 'numeral'
import React from 'react'
import './Table.css'
import { sortData } from './util';

function Table({ countries, casesType }) {
    countries = sortData(countries, casesType)
    return (
        <div className="table">
            {countries.map((country) => (
                <tr>
                    <td>{country.country}</td>
                    <td>
                        <strong>{numeral(country[casesType]).format("0,0")}</strong>
                    </td>
                </tr>
            ))}
        </div>
    )
}

export default Table
