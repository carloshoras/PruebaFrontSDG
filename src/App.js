import './App.css';
//arrejuntar imports
//modular el proyecto
import { Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {Routes, Route} from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const continentsListURL = ["general", "africa", "antarctica", "asia", "europe", "northamerica", "oceania", "southamerica"]
const continentsList = ["General", "Africa", "Antarctica", "Asia", "Europe", "North America","Oceania", "South America"]

function filterDataCharts ({dataX, dataY}, inputValue) {
  let filteredDataX = []
  let filteredDataY = dataY.filter((population, index) => {
    if(population/1e6 >= inputValue) {
      filteredDataX.push(dataX[index])
      return true
    } else {
      return false
    }
  })
  return {dataX: filteredDataX, dataY: filteredDataY}
}

function dataCharts (dataCountries) {
  let dataX = []
  let dataY = []
  for (let country of dataCountries) {
    dataX.push(country.name)
    dataY.push(country.population)
  }
  return {dataX, dataY}
}

function sortDataByAlphabet (data) {
  return data.sort((a,b) => a.name.localeCompare(b.name))
}

async function fetchDataCountries(continentName) {
  console.log("Estoy en inicio de fetchDataCountries")
  try {
    const response = await fetch("https://restcountries.com/v3.1/all")
    const countries = await response.json()
    if (continentName==="General") {
      let generalContinents = {}
      continentsList.slice(1).map(continent => generalContinents[continent] = 0)
      countries.forEach(country => {
        country.continents.forEach(continent => {
          generalContinents[continent] += country.population
        })
      })
      let sendingDataContinents = []
      for (let generalContinent in generalContinents) {
        sendingDataContinents.push({name: generalContinent, population: generalContinents[generalContinent]})
      }
      return sortDataByAlphabet(sendingDataContinents)
    }
    let countriesContinent = countries.
    filter((country) => {
      return (country.continents.includes(continentName))
    })
    .map(country => { return {name: country.name.common, population: country.population}})
    console.log("Estoy al final de fetchDataCountries")
    return sortDataByAlphabet(countriesContinent)
  } catch(err) {
    console.log(err)
  }
}

export default function App() {
  console.log("Estoy en App")
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

function Header({onClick}) {
  console.log("ando en header")
  return (
          //quitar esto de /general, debería ir solo a la barra
          //probar meterlo con un map 
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
    console.log(inputValue)
  }
  
  useEffect(function prueba() {
    async function loadData() {
      setInputValue(0)
      //comprobar inputvalue sea numero positivo
      const dataCountries = await fetchDataCountries(continentName)
      console.log(dataCountries)
      setUnfilteredChartData(dataCharts(dataCountries, inputValue))
    }
    loadData()
  },[continent])
  
  useEffect(function prueba() {
      console.log(unfilteredChartData)
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
        <input id="filter" type="number" value = {inputValue} onChange={(e) => {handleChangeInput(e.target.value)}}/>
        <p>(millions)</p>
        <button onClick={handleButtonClick}>Apply</button>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </main>
  )
}



