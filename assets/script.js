// GLOBAL VARIABLES
// divs in HTML that we'll attach data to
let searchBar = document.querySelector("#search-bar");
let searchBtn = document.querySelector("#search-btn");
let searchInput = document.querySelector("#search-input");
let currentCity = document.querySelector("#current-city");
let currentTemp = document.querySelector("#current-temp");
let currentWind = document.querySelector("#current-wind");
let currentHumi = document.querySelector("#current-humi");
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
``;

function search() {
  // assign variable to value of text box on HTML page
  let cityLogged = searchInput.value.trim();
  let currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityLogged}&appid=517f19dc586407c39701b016a6edf914&units=imperial`;
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
      // CHICAGO
      let icon = data.weather[0].icon;
      console.log(icon);
    //   WHY IS THE ICON ON A NEW LINE?
      currentCity.innerHTML = `${data.name} ${today.format("M/DD/YYYY")} <img src="./assets/icons/${icon}.png" class="w-12">`;
      // temp, wind, and humidity
      currentTemp.innerHTML = `Temp: ${data.main.temp}°F`;
      currentWind.innerHTML = `Wind: ${data.wind.speed}MPH`;
      currentHumi.innerHTML = `Humidity: ${data.main.humidity}%`;
      // 5-DAY FORECAST
      fetch;
    });
}

// FUNCTION CALLS
init();

// EVENT LISTENERS
// search button event listener
searchBtn.addEventListener("click", search);
// click on past search results (same as search button)

// api.openweathermap.org/geo/1.0/direct?q=chicago&appid=517f19dc586407c39701b016a6edf914
// api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=517f19dc586407c39701b016a6edf914

// api.openweathermap.org/data/2.5/forecast?q=chicago&appid=517f19dc586407c39701b016a6edf914
