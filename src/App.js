import './App.css';
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography
} from '@material-ui/core';
import { useState, useEffect } from 'react';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';
import { prettyPrintStat } from './util';

function App() {

  const [current, setCurrent] = useState('worldwide');

  const [countries, setCountries] = useState([]);

  const [countryInfo, setCountryInfo] = useState({});

  const [countryVaccines, setCountryVaccines] = useState({});

  const [mapCountries, setMapCountries] = useState([]);

  const [mapData, setMapData] = useState([])

  const [mapCenter, setMapCenter] = useState({
    lat: 30,
    lng: -20
  });

  const [mapZoom, setMapZoom] = useState(2);

  const [casesType, setCasesType] = useState("cases");

  useEffect(async () => {
    let temp;
    await fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => {
        temp = data;
      });

    await fetch("https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=1&fullData=false")
      .then(response => response.json())
      .then(data => {
        for (let date in data) {
          temp['vaccine'] = data[date];
        }
      })
    setCountryInfo(temp);
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const cnt = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));
          setCountries(cnt);
          setMapCountries(data);
        });

      await fetch('https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=2&fullData=true')
        .then(response => response.json())
        .then(data => {
          setCountryVaccines(data[0]);
        })
    };
    getCountriesData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      await fetch("https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=1")
        .then(response => response.json())
        .then(data => {
          let mapData = {};
          data.forEach(e => {
            mapData[e.country] = e.timeline[Object.keys(e.timeline)[0]];
          });
          mapCountries.forEach(e => {
            if (mapData[e.country]) {
              e['vaccine'] = mapData[e.country];
            }
            else {
              e['vaccine'] = 0;
            }
          });
          setMapData(mapCountries);
        });
    }
    getData();
  }, [mapCountries])

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCurrent(countryCode);

    const url = countryCode == 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCurrent(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      })

    countryCode == 'worldwide' ? await fetch('https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=2&fullData=true')
      .then(response => response.json())
      .then(data => {
        setCountryVaccines(data[0]);
      }) :
      await fetch(`https://disease.sh/v3/covid-19/vaccine/coverage/countries/${countryCode}?lastdays=2&fullData=true`)
        .then(response => response.json())
        .then(data => {
          setCountryVaccines(data['timeline'][0]);
        })
  }

  const titleText = {
    cases: 'Cases',
    recovered: 'People Recovered',
    vaccine: 'People Vaccinated',
    deaths: 'Death Cases',
  }

  return (
    <div className="app">

      <div className="app_left">

        <div className="app_header">

          <h1>COVID-19 TRACKER</h1>

          <FormControl className="app_dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={current}>
              <MenuItem value="worldwide">World Wide</MenuItem>;
              {
                countries.map((country) => {
                  return <MenuItem value={country.value}>{country.name}</MenuItem>;
                })
              }
            </Select>
          </FormControl>

        </div>

        <div className="app_stats">
          <InfoBox
            active={casesType === 'cases'}
            title="Current Case"
            color="red"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
            onClick={e => setCasesType('cases')} />

          <InfoBox
            active={casesType === 'recovered'}
            title="Recovered"
            color="green"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
            onClick={e => setCasesType('recovered')} />

          <InfoBox
            active={casesType === 'vaccine'}
            title="Vaccinated"
            color="yellow"
            cases={prettyPrintStat(countryVaccines.daily)}
            total={prettyPrintStat(countryVaccines.total)}
            onClick={e => setCasesType('vaccine')} />

          <InfoBox
            active={casesType === 'deaths'}
            title="Deaths"
            color="grey"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
            onClick={e => setCasesType('deaths')} />
        </div>

        <Map
          countries={mapData}
          center={mapCenter}
          zoom={mapZoom}
          casesType={casesType} />

      </div>

      <Card className="app_right">
        <CardContent>
          <Typography class="padd_bot" color="textPrimary">Total {titleText[casesType]}</Typography>
          <Table countries={mapData} casesType={casesType} />
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>

    </div>
  );
}

export default App;