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
          <Link key="general" id="main" to="/" ><p>General View</p></Link>
          {continentsListURL.slice(1).map((continenLowerCase, index) => <Link key={continenLowerCase} to={`/${continenLowerCase}`} ><p>{continentsList[index+1]}</p></Link>)}
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
      <div id="filterDiv">
        <label htmlFor="filter"><span>➔</span> Filter by continents/countries with a population bigger than: </label>
        <input id="filter" name="filter" className="filter" type="number" value = {inputValue} onChange={(event) => {handleChangeInput(event.target.value)}}/>
        <p>(millions)</p>
        <button onClick={handleButtonClick}>Apply</button>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </main>
  )
}



