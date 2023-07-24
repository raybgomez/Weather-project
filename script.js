const weatherApiURL = "https://api.open-meteo.com/v1/forecast?hourly=temperature_2m&daily=weathercode&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=America%2FNew_York&forecast_days=1&latitude="
const geocodeApiURL = "https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&format=json&name="

const cityInput = document.getElementById('city-input');
const displayCity = document.getElementById('place');
const conditionElement = document.getElementById('Info');
const tempElement = document.getElementById('tempElement');
const showConditionLink = document.getElementById('showCondition');
const showTemperatureLink = document.getElementById('showTemperature');
const tempTextElement = document.querySelector(".temp");
const weatherIcon = document.querySelector(".weatherImage");
const weatherCondition = document.querySelector(".weatherCondition");
const cityInputElement = document.getElementById('city-input');


function showCondition() {
    tempElement.style.visibility = 'hidden';
    conditionElement.style.visibility = 'visible';
    showConditionLink.style.visibility = 'hidden';
    showTemperatureLink.style.visibility = 'visible';
}

function showTemperature() {
    tempElement.style.visibility = 'visible';
    conditionElement.style.visibility = 'hidden';
    showConditionLink.style.visibility = 'visible';
    showTemperatureLink.style.visibility = 'hidden';
}
// Note: For the two weather code functions, the results are not specific and will display a general weather condition
function weatherCodeToIcon(weatherCodeNumber) {
    if (weatherCodeNumber == 0) {
        return "images/sun.svg";
    } else if (weatherCodeNumber <= 2) {
        return "images/partlyCloudy.svg";
    } else if (weatherCodeNumber == 3) {
        return "images/cloudy.svg";
    } else if (weatherCodeNumber <= 67) {
        return "images/rain.svg";
    } else if (weatherCodeNumber <= 77) {
        return "images/snow.svg";
    } else if (weatherCodeNumber <= 99) {
        return "images/thunderstorm.svg";
    } else {
        return "images/happy.svg";
    }
}

function weatherCodeToCondition(weatherCodeNumber) {
    if (weatherCodeNumber == 0) {
        return "Sunny";
    } else if (weatherCodeNumber <= 2) {
        return "Partly Cloudy";
    } else if (weatherCodeNumber == 3) {
        return "Cloudy"
    } else if (weatherCodeNumber <= 67) {
        return "Raining"
    } else if (weatherCodeNumber <= 77) {
        return "Snowing"
    } else if (weatherCodeNumber <= 99) {
        return "Thunderstorm"
    } else {
        return 'Error (Look Outside!)'
    }
}

async function checkWeather(city) {

    const geoResponse = await fetch(geocodeApiURL + city);
    const geoData = await geoResponse.json();
    const geocodeLat = geoData.results[0].latitude;
    const geocodeLong = geoData.results[0].longitude;
    const response = await fetch(weatherApiURL + geocodeLat + '&longitude=' + geocodeLong);
    const data = await response.json();
    const tempArray = data.hourly.temperature_2m;
    const currentHour = new Date().getHours();
    const weatherCodeNumber = data.daily.weathercode;

    const tempValue = Math.round(tempArray.splice(currentHour, 1));
    const tempText = tempValue + "°F";
    tempTextElement.innerHTML = tempText;
    weatherIcon.src = weatherCodeToIcon(weatherCodeNumber);
    weatherCondition.innerHTML = weatherCodeToCondition(weatherCodeNumber);
    showTemperature();
}

cityInput.addEventListener('keypress', function (e) {
    const cityInputValue = e.target.value;
    if (e.key == 'Enter') {
        displayCity.innerHTML = cityInputValue;
        e.preventDefault();
        checkWeather(cityInputValue);
        cityInputElement.value = "";
    }
});
