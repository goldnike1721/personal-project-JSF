const apiKeyGeneral = 'cdea0842f636a55c8dddd61b0a75ee1c';
const weatherContainerGeneral = document.getElementById('weatherContainerPage');
const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const cities = ['Lviv', 'Kyiv', 'London', 'New York', 'Bangkok', 'Paris', 'Dubai', 'Singapore', 'Seoul', 'Kuala Lumpur', 'Tokyo', 'Istanbul'];

async function fetchWeatherGeneral(city) {
    try {
        const responseGeneral = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyGeneral}&units=metric`);
        if (!responseGeneral.ok) {
            throw new Error('Error getting data from server');
        }
        const dataGeneral = await responseGeneral.json();
        const latGeneral = dataGeneral.coord.lat;
        const lonGeneral = dataGeneral.coord.lon;
        const hourlyResponseGeneral = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latGeneral}&lon=${lonGeneral}&appid=${apiKeyGeneral}&units=metric`);
        if (!hourlyResponseGeneral.ok) {
            throw new Error('Error getting hourly forecast');
        }
        const hourlyDataGeneral = await hourlyResponseGeneral.json();
        const sunrise = new Date(dataGeneral.sys.sunrise * 1000);
        const sunset = new Date(dataGeneral.sys.sunset * 1000);
        const nowGeneral = new Date();
        const currentDateGeneral = nowGeneral.toDateString();
        const todayIndex = (nowGeneral.getDay() + 6) % 7;

        function getTempsTodayGeneral(hourlyDataGeneral) {
            let maxTempDayGeneral = -Infinity;
            let minTempNightGeneral = Infinity;

            const todayGeneral = nowGeneral.toISOString().slice(0, 10);

            hourlyDataGeneral.list.forEach((hour) => {
                const dateGeneral = new Date(hour.dt * 1000);
                const hourTimeGeneral = dateGeneral.getHours();
                const forecastDateGeneral = dateGeneral.toISOString().slice(0, 10);

                if (forecastDateGeneral === todayGeneral) {
                    if (hourTimeGeneral >= 9 && hourTimeGeneral < 21) {
                        maxTempDayGeneral = Math.max(maxTempDayGeneral, hour.main.temp);
                    }
                    if (hourTimeGeneral >= 21 || hourTimeGeneral < 9) {
                        minTempNightGeneral = Math.min(minTempNightGeneral, hour.main.temp);
                    }
                }
            });

            return {
                maxTempDay: maxTempDayGeneral === -Infinity ? '-' : Math.round(maxTempDayGeneral),
                minTempNight: minTempNightGeneral === Infinity ? '-' : Math.round(minTempNightGeneral),
            };
        }

        const { maxTempDay, minTempNight } = getTempsTodayGeneral(hourlyDataGeneral);
        const currentTempGeneral = Math.round(dataGeneral.main.temp);
        const currentWeatherDescriptionGeneral = dataGeneral.weather[0].description;
        const overallCloudiness = hourlyDataGeneral.list[0].clouds.all;
        const overallWindSpeed = hourlyDataGeneral.list[0].wind.speed;
        let currentWeatherDisplayGeneral = `
            <div class="weather-container">
                <div class="weather-header">
                    <h2 class="weather-city__page">${dataGeneral.name}</h2>
                </div>
                <div class="current-weather__page">
                    <div class="current-temp">
                        <p>${currentTempGeneral}°</p>
                    </div>
                    <div class="current-description">
                        <div class="current-description-text">
                            <p>${currentWeatherDescriptionGeneral.charAt(0).toUpperCase() + currentWeatherDescriptionGeneral.slice(1)}</p>
                        </div>
                        <div class="current-temp-range">
                            <p class="current-temp-max">D:${maxTempDay}°</p>
                            <p class="current-temp-min">N:${minTempNight}°</p>
                        </div>
                    </div>
                </div>
                <div class="overall-info">
                    <p class="overall-cloudiness">
                        <span class="overall-cloudiness__text">Cloudiness: </span>${overallCloudiness}%
                    </p> 
                    <p class="overall-wind-speed">
                        <span class="overall-wind-speed__text">Gusts of wind: </span>${overallWindSpeed} m/s
                    </p> 
                </div>
            </div>
        `;

        let hourlyForecastGeneral = `<ul class="hourly-forecast-list">`;
        let iconCount = 0;

        hourlyDataGeneral.list.forEach((hour) => {
            if (iconCount >= 19) return;
            const hourDateGeneral = new Date(hour.dt * 1000);
            const hourTimeGeneral = hourDateGeneral.getHours();
            const hourTempGeneral = Math.round(hour.main.temp);
            const hourWeatherIconGeneral = hour.weather[0].icon;

            hourlyForecastGeneral += `
        <li class="hourly-forecast-item">
            <p class="hour-item__page">${hourTimeGeneral.toString().padStart(2, '0')}</p>
            <img class="hour-item-icon" src="http://openweathermap.org/img/wn/${hourWeatherIconGeneral}@2x.png" alt="${hour.weather[0].description}">
            <p class="hour-item-temp">${hourTempGeneral}°</p>
        </li>
    `;
            iconCount++;

            if (hourTimeGeneral >= sunrise.getHours() && hourTimeGeneral < sunrise.getHours() + 1 && iconCount < 16) {
                hourlyForecastGeneral += `
            <li class="hourly-forecast-item">
                <p class="hour-item__page sun-temp">${sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <img class="hour-item-icon sun" src="./img/weather/sunrise.png" alt="Sunrise icon">
                <p class="hour-item-temp sun-name">Sunrise</p>
            </li>
        `;
                iconCount++;
            }

            if (hourTimeGeneral >= sunset.getHours() && hourTimeGeneral < sunset.getHours() + 1 && iconCount < 16) {
                hourlyForecastGeneral += `
            <li class="hourly-forecast-item">
                <p class="hour-item__page sun-temp">${sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <img class="hour-item-icon sun" src="./img/weather/sunset.png" alt="Sunset icon">
                <p class="hour-item-temp sun-name">Sunset</p>
            </li>
        `;
                iconCount++;
            }
        });

        hourlyForecastGeneral += `</ul>`;

        let daysOfWeekList = `<ul class="days-of-week">
            <div class="day-weather">
                <img class="day-weather__image" src="./img/weather/calendar.png" alt="Calendar icon">
                <p class="day-weather__title">7-DAY FORECAST</p>
            </div>
            <hr class="day-weather__line"/>
            `;

        const dayWeatherData = {};

        hourlyDataGeneral.list.forEach((hour) => {
            const hourDate = new Date(hour.dt * 1000);
            const forecastDate = hourDate.toISOString().slice(0, 10);

            if (!dayWeatherData[forecastDate]) {
                dayWeatherData[forecastDate] = {
                    icon: hour.weather[0].icon,
                    maxTemp: hour.main.temp,
                    minTemp: hour.main.temp,
                };
            } else {
                dayWeatherData[forecastDate].maxTemp = Math.max(dayWeatherData[forecastDate].maxTemp, hour.main.temp);
                dayWeatherData[forecastDate].minTemp = Math.min(dayWeatherData[forecastDate].minTemp, hour.main.temp);
            }
        });

        for (let i = 0; i < 7; i++) {
            const dayIndex = (todayIndex + i) % 7;
            const forecastDate = new Date(nowGeneral.getTime() + i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
            const weatherData = dayWeatherData[forecastDate] || { icon: '01d', maxTemp: '-', minTemp: '-' };
            const dayDisplay = i === 0 ? 'Today' : daysOfWeek[dayIndex];
            const maxTempDisplay = weatherData.maxTemp === '-' ? '-' : `${Math.round(weatherData.maxTemp)}°`;
            const minTempDisplay = weatherData.minTemp === '-' ? '-' : `${Math.round(weatherData.minTemp)}°`;

            daysOfWeekList += `
        <li class="day-item">
            <div class="day-item__block">
                <p class="day-name__week">${dayDisplay}</p>
                <div class="day-item__block-image">
                    <img class="day-weather-icon" src="http://openweathermap.org/img/wn/${weatherData.icon}@2x.png" alt="${dayDisplay} weather">
                </div>
                <p class="day-temp__min">${minTempDisplay}</p>
                <p class="day-temp__max">${maxTempDisplay}</p>
            </div>
            ${i < 6 ? '<hr class="day-weather__line"/>' : ''}
        </li>
    `;
        }

        const feelsLike = Math.round(dataGeneral.main.feels_like);
        const rainLastHour = dataGeneral.rain ? dataGeneral.rain['1h'] : '-';
        const rainLast3Hours = dataGeneral.rain && dataGeneral.rain['3h'] ? dataGeneral.rain['3h'] : '-';
        const currentHumidity = dataGeneral.main.humidity;
        const visibility = dataGeneral.visibility / 1000;
        const dewPoint = dataGeneral.main.temp - ((100 - currentHumidity) / 5);
        const windSpeed = dataGeneral.wind.speed;

        let visibilityDescription = '';
        if (visibility >= 10) {
            visibilityDescription = 'Excellent visibility';
        } else if (visibility >= 5) {
            visibilityDescription = 'Good visibility';
        } else if (visibility >= 1) {
            visibilityDescription = 'Moderate visibility';
        } else {
            visibilityDescription = 'Low visibility';
        }

        let weatherFeelsRainHumidityVisibility = `
    <div class="weather-info-container">
        <div class="weather-description__container">
            <div class="weather-description__container-top">
                <img class="weather-description__top-image" src="./img/weather/feel-like.png" alt="Feels like icon">
                <h3 class="weather-description__title">FEELS LIKE</h3>
            </div>
            <div class="feels-like-container__bottom">
                <p class="weather-description__current">${feelsLike}°</p>
                <p class="weather-description__current-speed"><span class="weather-description__current-speed-api">Wind</span> ${windSpeed} m/s</p>
            </div>
        </div>

        <div class="weather-description__container">
            <div class="weather-description__container-top">
                <img class="weather-description__top-image" src="./img/weather/rain.png" alt="Rain icon">
                <h3 class="weather-description__title">RAIN</h3>
            </div>
            <div class="rain-container__bottom">
                <p class="current-rain__hour">${rainLastHour} mm<span class="current-rain__hour-span">for the last hour</span></p>
                <p class="current-rain__three-hour">${rainLast3Hours} mm<span class="current-rain__hour-span">for the past 3 hours</span></p>
            </div>
        </div>

        <div class="weather-description__container">
            <div class="weather-description__container-top">
                <img class="weather-description__top-image" src="./img/weather/humidity.png" alt="Humidity icon">
                <h3 class="weather-description__title">HUMIDITY</h3>
            </div>
            <div class="humidity-container__bottom">    
                <p class="weather-description__current">${currentHumidity}%</p>
                <p class="weather-description__current-point"><span class="weather-description__current-speed-api">Dew point</span>${dewPoint.toFixed(1)}°</p>
            </div>
        </div>

        <div class="weather-description__container">
            <div class="weather-description__container-top">   
                <img class="weather-description__top-image" src="./img/weather/visibility.png" alt="Visibility icon">
                <h3 class="weather-description__title">VISIBILITY</h3>
            </div>
            <div class="visibility-container__bottom">    
                <p class="weather-description__current">${visibility.toFixed(2)} km</p>
                <p class="weather-description__current-des-api">${visibilityDescription}</p>
            </div>
        </div>
    </div>
`;

        weatherContainerGeneral.innerHTML = currentWeatherDisplayGeneral + hourlyForecastGeneral + daysOfWeekList;
        weatherContainerGeneral.innerHTML += weatherFeelsRainHumidityVisibility;

        const windMapUrl = `https://embed.windy.com/embed2.html?lat=${latGeneral}&lon=${lonGeneral}&detailLat=${latGeneral}&detailLon=${lonGeneral}&width=650&height=450&zoom=5&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=&pressure=&type=map&location=coordinates&detail=&metricWind=m%2Fs&metricTemp=%C2%B0C&radarRange=-1`;
        const windMapIframe = `
    <div class="wind-map__city">
        <div class="wind-map__city__header">
            <img class="wind-map__city__image" src="./img/weather/wind.png" alt="Wind map icon">
            <p class="wind-map__city-title">WIND MAP</p>
        </div>
        <iframe src="${windMapUrl}" frameborder="0"></iframe>
    </div>`;

        weatherContainerGeneral.innerHTML += windMapIframe;

    } catch (error) {
        console.error(error);
        weatherContainerGeneral.innerHTML = '<p>An error occurred while retrieving the weather</p>';
    }
}

const cityButtons = document.querySelectorAll('.city-button__weather');
let currentCityIndex = 0;
let isAnimating = false;

cityButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        if (isAnimating) return;

        const selectedCity = button.getAttribute('data-city');

        if (currentCityIndex === index) return;

        const isGoingRight = index > currentCityIndex;

        weatherContainerGeneral.classList.add(isGoingRight ? 'slide-out-left__weather' : 'slide-out-right__weather');

        isAnimating = true;

        cityButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        weatherContainerGeneral.addEventListener('animationend', () => {
            fetchWeatherGeneral(selectedCity);

            weatherContainerGeneral.classList.add(isGoingRight ? 'slide-in-right__weather' : 'slide-in-left__weather');
            weatherContainerGeneral.addEventListener('animationend', () => {
                weatherContainerGeneral.classList.remove('slide-out-left__weather', 'slide-out-right__weather', 'slide-in-left__weather', 'slide-in-right__weather');

                isAnimating = false;
            }, { once: true });
        }, { once: true });

        currentCityIndex = index;
    });
});

fetchWeatherGeneral(cities[0]);
document.querySelector('.city-button__weather[data-city="Lviv"]').classList.add('active');