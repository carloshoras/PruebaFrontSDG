const continentsListURL = ["general", "africa", "antarctica", "asia", "europe", "northamerica", "oceania", "southamerica"]
const continentsList = ["General", "Africa", "Antarctica", "Asia", "Europe", "North America","Oceania", "South America"]


//Returns filtered Data
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

//Returns initial Data (when no filter is applied)
function dataCharts (dataCountries) {
    let dataX = []
    let dataY = []
    for (let country of dataCountries) {
        dataX.push(country.name)
        dataY.push(country.population)
    }
    return {dataX, dataY}
}

//Returns data sorted by alphabetic order
function sortDataByAlphabet (data) {
    return data.sort((a,b) => a.name.localeCompare(b.name))
}

//Fetches the data and returns it in an array of objects {name: country, population: population}
async function fetchDataCountries(continentName) {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all")
        const countries = await response.json()
        //Executes if the General View (main page) is selected
        if (continentName==="General") {
            let generalContinents = {}
            //Initialize every continent
            continentsList.slice(1).map(continent => generalContinents[continent] = 0)
            //Keep adding population for every country found 
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
        return sortDataByAlphabet(countriesContinent)
    } catch(err) {
        console.log(err)
    }
}

export {filterDataCharts, dataCharts, fetchDataCountries, continentsList, continentsListURL}