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
export {filterDataCharts, dataCharts, fetchDataCountries, continentsList, continentsListURL}