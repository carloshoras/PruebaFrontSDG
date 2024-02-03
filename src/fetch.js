let continentsInfo = {
    "Europe": {
        "list_countries": [],
        "total_population": 0
    },
    "Africa": {
        "list_countries": [],
        "total_population": 0
    },
    "North America": {
        "list_countries": [],
        "total_population": 0
    },
    "South America": {
        "list_countries": [],
        "total_population": 0
    },
    "Asia": {
        "list_countries": [],
        "total_population": 0
    },
    "Oceania": {
        "list_countries": [],
        "total_population": 0
    },
    "Antarctica": {
        "list_countries": [],
        "total_population": 0
    }
  }

  async function fetchDataCountries() {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all")
        const countries = await response.json()
        for (let country of countries) {
            const {name:{common}, population, continents} = country
            for (let continent of continents) {
                continentsInfo[continent].list_countries.push({country: common, population: population})
                continentsInfo[continent].total_population += population
            }
        }
        console.log(continentsInfo)
    } catch(err) {
        console.log(err)
    }
  }
  
  fetchDataCountries()

  // function Main() {
  //   return(
  //     <main>
        <div class="filter">
          <label for="filter">Filter by continents with a population bigger than: </label>
          <input id="filter" type="number"></input>
          <p>(units in <span>millions</span>)</p>
          <button>Apply</button>
        </div>
  //       <h1>Continents' Population</h1>
  //       <div class="countries">
  //         <ul>
  
  //         </ul>
  //       </div>
  //     </main>
  //   )
  // }