const searchButton = document.querySelector('#search-button');
const cityInputEl = document.querySelector('#city-input');
const historyEl = document.querySelector('#search-history');
const currentWeatherEl = document.querySelector('#current-weather');
const forecastEl = document.querySelector('#forecast');
// this pulls in the info from localstorage to appear when page opns
let searchHistory = JSON.parse(localStorage.getItem('search')) || [];

//this is the function that pulls in the weather info from the api

function getWeather(cityName) {
    let apiKey = "fda3f9e2bf40177708340d59d656c2e1";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

    //this is the fetch call that creates a card for the info once pulled

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let weatherIcon = getWeatherIcon(data.weather[0].main);
            currentWeatherEl.innerHTML = `
                <h5 class="card-title">${data.name} (${new Date().toLocaleDateString()}) <i class="${weatherIcon}"></i></h5>
                <p class="card-text">Temperature: ${data.main.temp} °F</p>
                <p class="card-text">Humidity: ${data.main.humidity} %</p>
                <p class="card-text">Wind Speed: ${data.wind.speed} MPH</p>
            `;

            return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}&units=imperial`);
        })

        //this is the function that creates a card for the info once pulled
        .then(response => response.json())
        .then(data => {
            forecastEl.innerHTML = '<h5 class="col-12 text-center card-title">5-Day Forecast:</h5>';
            data.list.forEach((reading, index) => {
                if (index % 8 === 0) {
                    let weatherIcon = getWeatherIcon(reading.weather[0].main);
                    forecastEl.innerHTML += `
                        <div class="col-2 card m-1">
                            <div class="card-body">
                                <h5 class="card-title">${new Date(reading.dt * 1000).toLocaleDateString()}</h5>
                                <p class="card-text"><i class="${weatherIcon}"></i></p>
                                <p class="card-text">Temp: ${reading.main.temp} °F</p>
                                <p class="card-text">Humidity: ${reading.main.humidity} %</p>
                                <p class="card-text">Wind Speed: ${reading.wind.speed} MPH</p>
                            </div>
                        </div>
                    `;
                }
            });
        });
}

//did a switch statement to pull in the weather icons

  function getWeatherIcon(weather) {
    switch (weather) {
        case "Clouds":
            return "wi wi-day-cloudy";
        case "Rain":
        case "Drizzle":
        case "Mist":
            return "wi wi-day-rain";
        case "Thunderstorm":
            return "wi wi-day-thunderstorm";
        case "Snow":
            return "wi wi-day-snow";
        default:
            return "wi wi-day-sunny";
    }
}

//main search button that intializes the search and also sends it to local storage

  searchButton.addEventListener('click', function () {
    let searchTerm = cityInputEl.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem('search', JSON.stringify(searchHistory));
    showSearchHistory();
});

//this is the function that shows the search history 
function showSearchHistory() {
    historyEl.innerHTML = '';
    searchHistory.forEach(city => {
        let historyItem = document.createElement('button');
        historyItem.classList.add('btn', 'btn-secondary', 'd-block', 'mt-1');
        historyItem.textContent = city;
        historyItem.addEventListener('click', function () {
            getWeather(city);
        });
        historyEl.append(historyItem);
    });
}

showSearchHistory();
if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
}
