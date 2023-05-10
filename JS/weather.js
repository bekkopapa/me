function getWeather(lat, lon) {
    const API_KEY = "4a950e59c9a7126d30404b715599dba0";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    fetch(url)
        .then((Response) => Response.json())
        .then((data) => {
            const weatherContainer = document.getElementById("weather");
            const name = `<span class="weather-info">${data.name}</span>`;
            const weather = `<span class="weather-info">${data.weather[0].main}</span>`;
            const temp = `<span class="weather-info">${Math.round(data.main.temp)}°C</span>`;
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
            const icon = `<img src="${iconUrl}" alt="Weather Icon" class="weather-icon" />`;
            weatherContainer.innerHTML = `${icon} ${temp}`;
            function weatherInfo(){
                window.open("https://weather.naver.com/");
            }
            weatherContainer.addEventListener('click', weatherInfo);
        });
}

function onGeoSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getWeather(lat, lon);
}

function onGeoError() {
    // 서울의 위도와 경도
    const defaultLat = 37.5665;
    const defaultLon = 126.9780;
    getWeather(defaultLat, defaultLon);
}

navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);

