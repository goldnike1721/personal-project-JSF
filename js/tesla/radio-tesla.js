document.addEventListener('DOMContentLoaded', () => {
    const targetContainer = document.getElementById('targetContainer');

    fetch('./api/radio-tesla.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(stations => {
            const htmlContent = `
                <div class="radio-container">
                    <div class="station-image-wrapper">
                        <img id="stationImage" src="${stations[0].image}" alt="${stations[0].name}" class="station-image">
                        <button id="playButton" class="play-button"></button>
                    </div>
                    <audio id="radioPlayer">
                        <source id="radioSource" src="${stations[0].url}" type="audio/mpeg">
                    </audio>
                    <div class="tesla-radio__buttons">
                        <span class="tesla-radio__name" id="stationName">${stations[0].name}</span>
                    </div>
                    <div class="radio-button__container">
                        <button id="prevStation">←</button>
                        <button id="nextStation">→</button>
                    </div>
                </div>
            `;

            targetContainer.innerHTML = htmlContent;

            let currentStationIndex = 0;
            const radioPlayer = document.getElementById('radioPlayer');
            const playButton = document.getElementById('playButton');

            playButton.addEventListener('click', () => {
                if (radioPlayer.paused) {
                    radioPlayer.play();
                    playButton.style.backgroundImage = "url('../img/radio/pause-icon.png')";
                } else {
                    radioPlayer.pause();
                    playButton.style.backgroundImage = "url('../img/radio/play-icon.png')";
                }
            });

            function updateStation() {
                const stationUrl = stations[currentStationIndex].url;
                const stationName = stations[currentStationIndex].name;
                const stationImage = stations[currentStationIndex].image;

                document.getElementById('stationName').textContent = stationName;
                document.getElementById('stationImage').src = stationImage;
                document.getElementById('radioSource').src = stationUrl;

                if (!radioPlayer.paused) {
                    radioPlayer.load();
                    radioPlayer.play();
                } else {
                    radioPlayer.load();
                }
            }

            document.getElementById('prevStation').addEventListener('click', () => {
                currentStationIndex = (currentStationIndex - 1 + stations.length) % stations.length;
                updateStation();
            });

            document.getElementById('nextStation').addEventListener('click', () => {
                currentStationIndex = (currentStationIndex + 1) % stations.length;
                updateStation();
            });
        })
        .catch(error => {
            console.error('Не вдалося завантажити дані:', error);
        });
});
