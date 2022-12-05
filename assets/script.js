// GLOBAL VARIABLES
let searchForm = document.querySelector("#search-form");
let prevSearch = document.querySelector("#prev-search");
let searchInput = document.querySelector("#search-input");
let currentCity = document.querySelector("#current-city");
let currentTemp = document.querySelector("#current-temp");
let currentWind = document.querySelector("#current-wind");
let currentHumi = document.querySelector("#current-humi");
let forecastCards = document.querySelector("#forecast-cards");
// API empty arrays
let currentUrl = [];
let fiveDayUrl = [];
// DayJs
let today = dayjs();
let searchedCities = JSON.parse(localStorage.getItem("cities")) || [];

// FUNCTIONS
function init() {
  generateRecentSearches();
  // loop through the cities saved in local storage and create buttons for them in the searchbar
  // searchedCities.forEach((city) => {
  //   let cityBtn = document.createElement("button");
  //   cityBtn.innerHTML += `${city}`;
  //   cityBtn.setAttribute("data-city", city);
  //   cityBtn.classList.add("bg-sky-400", "hover:bg-sky-500", "text-white", "mt-1");
  //   // create a function to search for the city within the button clicked
  //   prevSearch.append(cityBtn);
  // });
}

function generateRecentSearches() {
  // Reset buttons so that you don't add a second set of buttons when you search without reloading
  prevSearch.innerHTML = "";
  // ensure only the last ten stored searches are made into buttons
  searchedCities.slice(-10).forEach((city) => {
    let cityBtn = document.createElement("button");
    cityBtn.innerHTML += `${city}`;
    cityBtn.setAttribute("data-city", city);
    cityBtn.classList.add("bg-sky-400", "hover:bg-sky-500", "text-white", "mt-1");
    // create a function to search for the city within the button clicked
    prevSearch.append(cityBtn);
  });
}

function search(event) {
  event.preventDefault();
  // assign variable to value of text box on HTML page
  let cityLogged = searchInput.value.trim() || event.target.getAttribute("data-city");
  let currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityLogged}&appid=0d0089143b24c1bb1408e815d3e61ea9&units=imperial`;
  if (cityLogged === "") {
    return;
  }
  // Clear input after submitting
  searchInput.value = "";
  // Clear forecastCards HTML so that you're 5-Day resets when searching again rather than stacking.
  forecastCards.innerHTML = "";
  // Begin to retrieve from API
  fetch(currentUrl)
    .then(function (response) {
      // If entry not found in API, do not proceed. Otherwise, log search to local storage and proceed.
      if (response.status === 404) {
        // Display an error message
        currentCity.innerHTML = "Error: No results found.";
        currentTemp.innerHTML = "";
        currentWind.innerHTML = "";
        currentHumi.innerHTML = "";
      } else {
        // Prevent doubles in recent searches:
        // checks to see if the searched cities array already includes the search input; if not, push the search into the array.
        let containsCity = searchedCities.includes(cityLogged);
        if (containsCity) {
        } else {
          searchedCities.push(cityLogged);
        }
        localStorage.setItem("cities", JSON.stringify(searchedCities.slice(-10)));
        console.log(searchedCities);
        console.log(cityLogged);
        return response.json();
      }
    })
    .then(function (data) {
      console.log(data);
      // build the card
      // search for icon and coordinates in API
      let icon = data.weather[0].icon;
      let lon = data.coord.lon;
      let lat = data.coord.lat;
      // Apply coordinates to the search for five day forecast (since One Call doesn't have a by city search smh)
      let fiveDayUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=0d0089143b24c1bb1408e815d3e61ea9&units=imperial`;
      console.log(icon);
      // Place information from API into divs in the html for current weather
      //   WHY IS THE ICON ON A NEW LINE?
      currentCity.innerHTML = `${data.name} ${today.format("M/DD/YYYY")} <img src="./assets/icons/${icon}.png" class="w-12">`;
      currentTemp.innerHTML = `Temperature: ${data.main.temp}°F`;
      currentWind.innerHTML = `Wind: ${data.wind.speed}MPH`;
      currentHumi.innerHTML = `Humidity: ${data.main.humidity}%`;
      // 5-DAY FORECAST

      // SCOTT'S WAY OF FINDING THE DAY FROM ORIGINAL API
      // data.list.forEach(day => {
      //   let midnight = day.dtext.split(" ")[1];`
      //   if (midnight === "00:00:00") {
      //     console.log(day)
      //   }
      // });

      // Retrieve data from a second URL for the five day forecast
      fetch(fiveDayUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          let daily = data.daily;
          // loop through the next five days, creating, styling, and filling elements on the HTML
          for (let i = 1; i < 6; i++) {
            let iconTwo = data.daily[i].weather[0].icon;
            let divEl = document.createElement("div");
            let dateEl = document.createElement("h3");
            let tempEl = document.createElement("p");
            let windEl = document.createElement("p");
            let humiEl = document.createElement("p");
            divEl.classList.add("border-2", "rounded", "border-black", "p-2", "text-white", "bg-sky-900");
            dateEl.classList.add("text-lg", "font-bold", "pb-3");
            tempEl.classList.add("pb-3");
            windEl.classList.add("pb-3");
            humiEl.classList.add("pb-3");
            dateEl.innerHTML = `${today.add([i], "day").format("M/DD/YYYY")} <img src="./assets/icons/${iconTwo}.png" class="w-12">`;
            tempEl.innerHTML = `Temp: ${daily[i].temp.day}°F`;
            windEl.innerHTML = `Wind: ${daily[i].wind_speed}MPH`;
            humiEl.innerHTML = `Humidity: ${daily[i].humidity}%`;
            divEl.append(dateEl, tempEl, windEl, humiEl);
            forecastCards.append(divEl);
          }
        });
      // Regenerate the recent searches to accound for what was just entered.
      generateRecentSearches();
    });
}

// FUNCTION CALLS
init();

// EVENT LISTENERS
// search button event listener
searchForm.addEventListener("submit", search);
// click on past search results (same as search button)
prevSearch.addEventListener("click", search);
