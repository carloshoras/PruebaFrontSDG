import './App.css';
import {filterDataCharts, dataCharts, fetchDataCountries, continentsList, continentsListURL} from './fetch.js'
import { Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {Routes, Route} from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function App() {
  return (
    <div>
      <Header />
      <Routes>
      <Route path="/:continent" element={<Main />} />
      <Route path="/" element={<Main />} />
      </Routes>
    </div>
  );
}

function Header() {
  return (
    <header>
      <nav>
          <Link id="main" to="/" ><p>General View</p></Link>
          <Link to="/africa" ><p>Africa</p></Link>
          <Link to="/antarctica" ><p>Antarctica</p></Link>
          <Link to="/asia" ><p>Asia</p></Link>
          <Link to="/europe" ><p>Europe</p></Link>
          <Link to="/northamerica" ><p>North America</p></Link>
          <Link to="/oceania" ><p>Oceania</p></Link>
          <Link to="/southamerica" ><p>South America</p></Link>
      </nav>
    </header>
  )
}

function Main() {
  const continent = useParams().continent || "general"
  const continentName = continentsList[continentsListURL.indexOf(continent)]

  const [buttonClick, setButtonClick] = useState(false)
  const [inputValue, setInputValue] = useState(0)
  const [chartData, setChartData] = useState({dataX: [], dataY:[]})
  const [unfilteredChartData, setUnfilteredChartData] = useState({dataX: [], dataY:[]})

  function handleChangeInput (newInput) {
    setInputValue(newInput)
  }

  function handleButtonClick () {
    setButtonClick(!buttonClick)
  }
  
  useEffect(function prueba() {
    async function loadData() {
      setInputValue(0)
      const dataCountries = await fetchDataCountries(continentName)
      setUnfilteredChartData(dataCharts(dataCountries, inputValue))
    }
    loadData()
  },[continent])
  
  useEffect(function prueba() {
      setChartData(filterDataCharts(unfilteredChartData, inputValue))
  },[buttonClick,unfilteredChartData])

  const options = {
    chart: {
      type: 'column'
    },
    title: {
      text: `${continentName.toUpperCase()}`
    },
    xAxis: {
      categories: chartData.dataX,
      labels : {
        step: 1,
        rotation: -60
      }
    },
    yAxis: {
      type: 'logarithmic',
      title: {
        text: 'Population'
      }
    },
    series: [{
      showInLegend: false,
      name: 'Population',
      data: chartData.dataY
    }],
    credits: {
      enabled: false,
    },
  };
  return(
    <main>
      <div id="title">
        <h1>World Population Data</h1>
      </div>
      <div id="filter">
        <label htmlFor="filter"><span>➔</span> Filter by continents with a population bigger than: </label>
        <input id="filter" type="number" value = {inputValue} onChange={(event) => {handleChangeInput(event.target.value)}}/>
        <p>(millions)</p>
        <button onClick={handleButtonClick}>Apply</button>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </main>
  )
}



