import React, { useState, useEffect } from 'react';

import CountriesChart from './charts/CountriesChart';
import HistoryChart from './charts/HistoryChart';
import { transformData } from './utils';

import './App.css';

const BASE_URL = 'https://corona.lmao.ninja';

function App() {
  console.log('App rendered');
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);
  const [key, setKey] = useState('cases');

  const [history, setHistory] = useState({
    cases: {},
    deaths: {},
    recovered: {},
  });
  const [lastDays, setLastDays] = useState({
    cases: 30,
    deaths: 30,
    recovered: 30,
  });

  function handleLastDaysChange(e, key) {
    console.log('onLastDaysChange called', e);
    setLastDays((prev) => ({ ...prev, [key]: e.target.value }));
  }

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch(`${BASE_URL}/countries?sort=${key}`);
      const data = await response.json();
      setCountries(data.slice(0, 10));
    };

    fetchCountries();
  }, [key]);

  useEffect(() => {
    const fetchHistory = async (country) => {
      const response = await fetch(`${BASE_URL}/v2/historical/${country}`);
      const data = await response.json();
      setHistory(data.timeline);
    };

    if (country) {
      fetchHistory(country);
    }
  }, [country]);

  return (
    <div className="App">
      <h1>COVID-19</h1>

      <label htmlFor="key-select">Select a key for sorting: </label>
      <select id="key-select" onChange={(e) => setKey(e.target.value)}>
        <option value="cases">Cases</option>
        <option value="todayCases">Today Cases</option>
        <option value="deaths">Death</option>
        <option value="recovered">Recovered</option>
        <option value="active">Active</option>
      </select>

      <CountriesChart
        data={countries}
        dataKey={key}
        onClick={(payload) => setCountry(payload.activeLabel)}
      />

      {country ? (
        <>
          <h2>History for {country}</h2>
          <div className="history-group">
            <HistoryChart
              title="Cases"
              data={transformData(history.cases)}
              lastDays={lastDays.cases}
              onLastDaysChange={(e) => handleLastDaysChange(e, 'cases')}
            />
            <HistoryChart
              title="Deaths"
              data={transformData(history.deaths)}
              lastDays={lastDays.deaths}
              onLastDaysChange={(e) => handleLastDaysChange(e, 'deaths')}
            />
            <HistoryChart
              title="Recovered"
              data={transformData(history.recovered)}
              lastDays={lastDays.recovered}
              onLastDaysChange={(e) => handleLastDaysChange(e, 'recovered')}
            />
          </div>
        </>
      ) : (
        <h2>Click on a country to show its history.</h2>
      )}
    </div>
  );
}

export default App;
