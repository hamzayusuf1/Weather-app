const searchButton = document.querySelector(".btn");

// const apiKey = e8f6a67301c717c985ba495ce7bc1b79

const inputValue = document.querySelector("#searchCity");
const button = document.querySelector("#submitBtn");
const form = document.querySelector("#inputForm");
var clearButton = document.getElementById("clearButton");
var searchHistoryList = document.getElementById("search-history");

function getWeatherData(location) {
  var URL =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    location +
    "&limit=5&appid=e8f6a67301c717c985ba495ce7bc1b79";

  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      // We make another fetch request with our Lat and Lon figures to retrieve the weather data
      console.log(data);
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${data[0].lat}&lon=${data[0].lon}&exclude=minutely,hourly&appid=e8f6a67301c717c985ba495ce7bc1b79
        `
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          updateWeather(location, data);
          fiveDayForecast(data);
          createHistory(location);
          searchButtons(location);
        });
    })
    .catch("Couldnt connect to Openweather");
}

//this function will store the search location in the localstorage
function createHistory(location) {
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  if (!searchHistory) {
    searchHistory = [];
    return searchHistory;
  }
  searchHistory.push(location);
  console.log(searchHistory);

  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

function searchButtons(location) {
  var locationButton = document.createElement("button");
  locationButton.classList.add("history-button");
  locationButton.innerHTML = location;
  searchHistoryList.appendChild(locationButton);
}

function invokeSearchHistory(event) {
  var buttonEl = event.target;
  var location = buttonEl.textContent.trim();
  if (buttonEl.matches(".history-button")) {
    getWeatherData(location);
  }
}

function updateWeather(location, data) {
  const locationName = document.querySelector("#currentLocation");
  const formatToday = moment().format("Do MMMM YYYY");
  const dateEl = document.querySelector("#currentDate");
  const tempEl = document.querySelector("#currentTemp");
  const windEl = document.querySelector("#currentWinds");
  const humidityEl = document.querySelector("#currentHumidity");
  const iconEl = document.querySelector("#currentImage");
  const uv = document.querySelector("#currentUV");

  var str = location;
  const strCapitalised = str[0].toUpperCase() + str.slice(1);
  locationName.textContent = `${strCapitalised}, `;

  dateEl.textContent = formatToday;
  tempEl.textContent = `${data.current.temp} °F`;
  windEl.textContent = `${data.current.wind_speed} MPH`;
  humidityEl.textContent = `${data.current.humidity} %`;

  var iconCode = data.current.weather[0].icon;
  iconEl.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  );

  var indexValue = data.current.uvi;
  uv.textContent = indexValue;

  uvIndex(indexValue);
}

function uvIndex(value) {
  var uv = document.getElementById("currentUV");
  console.log(uv);
  if (value < 3) {
    uv.classList.add("bg-green-600");
  } else if (value < 6) {
    uv.classList.add("bg-yellow-300");
  } else {
    uv.classList.add("bg-red-600");
  }
}

function fiveDayForecast(data) {
  var futureForecastEl = document.getElementById("futureForecast");

  var outerContainer = document.getElementById("container");

  futureForecastEl.textContent = "";
  outerContainer.textContent = "";
  var forecastTitle = document.createElement("h1");

  forecastTitle.classList.add("subheader");
  forecastTitle.textContent = "5-Day Forecast";

  for (var i = 0; i < 5; i++) {
    var timeCode = data.daily[i].dt;
    var time = new Date(timeCode * 1000).toLocaleDateString("en-US");
    console.log(time);
    var weatherCard = document.createElement("div");
    weatherCard.classList.add("card");
    weatherCard.classList.add("bg-sky-400");
    var date = document.createElement("h3");
    date.textContent = time;

    var weatherIconCode = data.daily[i].weather[0].icon;
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`
    );

    var humidityData = data.daily[i].humidity;
    var humidityText = document.createElement("p");
    humidityText.classList.add("text");
    humidityText.textContent = `Humidity:  ${humidityData} %`;

    var tempData = data.daily[i].temp.day;
    var tempText = document.createElement("p");
    tempText.classList.add("text");
    tempText.textContent = `Temp: ${tempData} °F`;

    var windData = data.daily[i].wind_speed;
    var windText = document.createElement("p");
    windText.classList.add("text");
    windText.textContent = `Wind: ${windData} MPH`;

    futureForecastEl.appendChild(weatherCard);
    weatherCard.appendChild(date);
    weatherCard.appendChild(weatherIcon);
    weatherCard.appendChild(tempText);
    weatherCard.appendChild(humidityText);
    weatherCard.appendChild(windText);
  }
  outerContainer.appendChild(forecastTitle);
}

form.addEventListener("submit", function (event) {
  console.log("hello");
  event.preventDefault();
  if (inputValue.value === "") {
    alert("Please enter a City Name");
  } else {
    getWeatherData(inputValue.value);
  }
});

document.addEventListener("click", invokeSearchHistory);
