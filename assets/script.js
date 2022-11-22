// GLOBAL VARIABLES
// divs in HTML that we'll attach data to
let searchBar = document.querySelector("#search-bar");
let searchBtn = document.querySelector("#search-btn");
let searchInput = document.querySelector("#search-input");
let currentCity = document.querySelector("#current-city");
let currentTemp = document.querySelector("#current-temp");
let currentWind = document.querySelector("#current-wind");
let currentHumi = document.querySelector("#current-humi");
let forecastCards = document.querySelector("#forecast-cards");
let currentUrl = [];
let fiveDayUrl = [];
let today = dayjs();
let searchedCities = [];

// FUNCTIONS
function init() {
  // Grab last search result from local storage
  // and put them on left side of the page
  //   ATTEMPT TO RECIEVE LOCAL STORAGE FAILURE SO FAR
  //   let storedCities = localStorage.getItem("cities");
  //   console.log(storedCities);
  //   if (storedCities !== null) {
  //     searchedCities = storedCities;
  //   }
}
function search() {
  // assign variable to value of text box on HTML page
  let cityLogged = searchInput.value.trim();
  let currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityLogged}&appid=0d0089143b24c1bb1408e815d3e61ea9&units=imperial`;
  if (cityLogged === "") {
    return;
  }
  searchInput.value = "";
  //   HOW DO I PUSH TO THE SEARCHEDCITIES ARRAY WITHOUT RESETTING IT IN THIS FUNCTION?
  localStorage.setItem("cities", cityLogged);
  console.log(cityLogged);
  fetch(currentUrl)
    .then(function (response) {
      return response.json();
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
      //   WHY IS THE ICON ON A NEW LINE?
      currentCity.innerHTML = `${data.name} ${today.format("M/DD/YYYY")} <img src="./assets/icons/${icon}.png" class="w-12">`;
      // temp, wind, and humidity
      currentTemp.innerHTML = `Temperature: ${data.main.temp}°F`;
      currentWind.innerHTML = `Wind: ${data.wind.speed}MPH`;
      currentHumi.innerHTML = `Humidity: ${data.main.humidity}%`;
      fetch(fiveDayUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          let daily = data.daily;
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
    });
  // 5-DAY FORECAST
}

// FUNCTION CALLS
init();

// EVENT LISTENERS
// search button event listener
searchBtn.addEventListener("click", search);
// click on past search results (same as search button)
