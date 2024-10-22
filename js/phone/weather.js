const apiKey = '751954008f04c5a356ca73f6d2c3f101';
const city = 'Lviv';
const weatherContainer = document.getElementById('weatherContainer');
const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

async function fetchWeather() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('Error getting data from server');
        }
        const data = await response.json();
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        const hourlyResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        if (!hourlyResponse.ok) {
            throw new Error('Error getting hourly forecast');
        }
        const hourlyData = await hourlyResponse.json();
        const now = new Date();
        const currentDate = now.toDateString();
        const tomorrowDate = new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

        function getTempsToday(hourlyData) {
            let maxTempDay = -Infinity;
            let minTempNight = Infinity;

            const today = now.toISOString().slice(0, 10);

            hourlyData.list.forEach((hour) => {
                const date = new Date(hour.dt * 1000);
                const hourTime = date.getHours();
                const forecastDate = date.toISOString().slice(0, 10);

                if (forecastDate === today) {
                    if (hourTime >= 9 && hourTime < 21) {
                        maxTempDay = Math.max(maxTempDay, hour.main.temp);
                    }

                    if (hourTime >= 21 || hourTime < 9) {
                        minTempNight = Math.min(minTempNight, hour.main.temp);
                    }
                }
            });

            return {
                maxTempDay: maxTempDay === -Infinity ? '-' : Math.round(maxTempDay),
                minTempNight: minTempNight === Infinity ? '-' : Math.round(minTempNight),
            };
        }

        const { maxTempDay, minTempNight } = getTempsToday(hourlyData);
        const currentTemp = Math.round(data.main.temp);
        const currentWeatherIcon = data.weather[0].icon;
        const currentWeatherDescription = data.weather[0].description;

        let dayIndex = (now.getDay() + 6) % 7;

        let currentWeatherDisplay = `
            <div class="weather">
                <div class="weather-top__container">
                    <div class="weather-top__container-left">
                        <h2 class="weather-city">${data.name}</h2>
                        <p class="weather-day">${weekDays[dayIndex]}</p>
                    </div>
                    <div class="weather-top__container-right">
                        <img class="weather-icon" src="https://openweathermap.org/img/wn/${currentWeatherIcon}@2x.png" alt="${currentWeatherDescription}">    
                    </div>
                </div>
                <div class="current-weather">
                    <div class="current-weather__temp">
                        <p>${currentTemp}°</p>
                    </div>
                    <div class="current-weather__description">
                        <div class="current-weather__description-current">
                            <p>${currentWeatherDescription.charAt(0).toUpperCase() + currentWeatherDescription.slice(1)}</p>
                        </div>
                        <div class="current-weather__description-tempDay">
                            <p class="current-weather__description-tempMax">D:${maxTempDay}°</p>
                            <p class="current-weather__description-tempMin">N:${minTempNight}°</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        let hourlyForecast = '<ul class="hourly-forecast">';
        let count = 0;
        hourlyData.list.forEach((hour) => {
            const hourDate = new Date(hour.dt * 1000);
            const hourTime = hourDate.getHours();
            const hourTemp = Math.round(hour.main.temp);
            const hourWeatherIcon = hour.weather[0].icon;
            const forecastDate = hourDate.toDateString();

            if ((forecastDate === currentDate || forecastDate === tomorrowDate) && count < 6) {
                hourlyForecast += `
                    <li class="hour-item">
                        <p class="weather-hour__item">${hourTime.toString().padStart(2, '0')}</p>
                        <img class="weather-hour__item-icon" src="https://openweathermap.org/img/wn/${hourWeatherIcon}@2x.png" alt="${hour.weather[0].description}">
                        <p class="weather-hour__item-temp">${hourTemp}°</p>
                    </li>
                `;
                count++;
            }
        });
        hourlyForecast += '</ul>';

        weatherContainer.innerHTML = currentWeatherDisplay + hourlyForecast;
    } catch (error) {
        weatherContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

fetchWeather();