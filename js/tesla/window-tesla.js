fetch('./api/window-tesla.json')
    .then(response => response.json())
    .then(data => {
        let windowsHTML = '';

        data.windows.forEach((window) => {
            let positionClass = '';
            let positionId = '';
            let titleClass = '';
            let circleClass = '';
            let calibrateClass = '';
            let calibrateId = '';
            let arcClass = '';
            let startX = window.arc.startX;
            let startY = window.arc.startY;
            let radiusX = window.arc.radiusX;
            let radiusY = window.arc.radiusY;
            let endX = window.arc.endX;
            let endY = window.arc.endY;
            let arcPath = `M ${startX} ${startY} A ${radiusX} ${radiusY} 0 0 1 ${endX} ${endY}`;

            switch (window.position) {
                case 'Front left':
                    positionClass = 'front-left';
                    positionId = 'toggleDoorButtonWindowFL';
                    titleClass = 'title-front-left';
                    circleClass = 'circle-front-left';
                    calibrateClass = 'calibrate-front-left';
                    calibrateId = 'toggleDoorButtonWindowFLCalibrate';
                    arcClass = 'arc-front-left';
                    break;
                case 'Front right':
                    positionClass = 'front-right';
                    positionId = 'toggleDoorButtonWindowFR';
                    titleClass = 'title-front-right';
                    circleClass = 'circle-front-right';
                    calibrateClass = 'calibrate-front-right';
                    calibrateId = 'toggleDoorButtonWindowFRCalibrate';
                    arcClass = 'arc-front-right';
                    break;
                case 'Rear left':
                    positionClass = 'rear-left';
                    positionId = 'toggleDoorButtonWindowRL';
                    titleClass = 'title-rear-left';
                    circleClass = 'circle-rear-left';
                    calibrateClass = 'calibrate-rear-left';
                    calibrateId = 'toggleDoorButtonWindowRLCalibrate';
                    arcClass = 'arc-rear-left';
                    break;
                case 'Rear right':
                    positionClass = 'rear-right';
                    positionId = 'toggleDoorButtonWindowRR';
                    titleClass = 'title-rear-right';
                    circleClass = 'circle-rear-right';
                    calibrateClass = 'calibrate-rear-right';
                    calibrateId = 'toggleDoorButtonWindowRRCalibrate';
                    arcClass = 'arc-rear-right';
                    break;
            }

            let windowStatus = `
                <div class="tesla-window__door ${positionClass}">
                    <div class="tesla-window__door-title">
                        <h3 class="tesla-window__door-title-text ${titleClass}">${window.position}</h3>
                    </div>
                    <div class="tesla-window__door-paragraph">
                        <div class="outer-circle ${circleClass}">
                            <div class="inner-circle"></div>
                        </div>
                        <p class="tesla-window__paragraph-text">${window.state}</p>
                    </div>
                    <div class="tesla-window__door-open">
                        <button id="${positionId}" class="tesla-window__open-button">${window.open ? 'Close' : 'Open'}</button>
                    </div>
                    <div class="tesla-window__door-calibrate">
                        <button id="${calibrateId}" class="tesla-window__calibrate-button ${calibrateClass}">${window.calibrate ? 'Calibrated' : 'Calibrate'}</button>
                    </div>
                    <svg class="arc-tesla ${arcClass}">
                      <path d="${arcPath}" stroke="#33333370" stroke-width="2" fill="transparent" stroke-dasharray="5, 5" />
                    </svg>
                </div>
            `;

            windowsHTML += windowStatus;
        });

        document.querySelector('.tesla-window__container').innerHTML = windowsHTML;

        function changeButtonColor(button, duration) {
            button.style.backgroundColor = 'rgb(149 200 127)';
            button.style.color = 'rgb(0, 0, 0)';
            button.style.fontWeight = '800';
            setTimeout(() => {
                button.style.backgroundColor = '';
                button.style.color = '';
                button.style.fontWeight = '';
            }, duration);
        }

        function showCircles(circleClass, duration) {
            const outerCircle = document.querySelector(`.${circleClass}`);
            const innerCircle = outerCircle.querySelector('.inner-circle');

            if (outerCircle) {
                outerCircle.classList.add('show');
                innerCircle.classList.add('show');

                setTimeout(() => {
                    outerCircle.classList.remove('show');
                    innerCircle.classList.remove('show');
                }, duration);
            }
        }

        data.windows.forEach((window) => {
            let buttonId = '';
            let circleClass = '';
            let calibrateClass = '';
            let calibrateId = '';

            switch (window.position) {
                case 'Front left':
                case 'Front right':
                    buttonId = window.position === 'Front left' ? 'toggleDoorButtonWindowFL' : 'toggleDoorButtonWindowFR';
                    circleClass = window.position === 'Front left' ? 'circle-front-left' : 'circle-front-right';
                    calibrateClass = window.position === 'Front left' ? 'calibrate-front-left' : 'calibrate-front-right';
                    calibrateId = window.position === 'Front left' ? 'toggleDoorButtonWindowFLCalibrate' : 'toggleDoorButtonWindowFRCalibrate';
                    break;
                case 'Rear left':
                case 'Rear right':
                    buttonId = window.position === 'Rear left' ? 'toggleDoorButtonWindowRL' : 'toggleDoorButtonWindowRR';
                    circleClass = window.position === 'Rear left' ? 'circle-rear-left' : 'circle-rear-right';
                    calibrateClass = window.position === 'Rear left' ? 'calibrate-rear-left' : 'calibrate-rear-right';
                    calibrateId = window.position === 'Rear left' ? 'toggleDoorButtonWindowRLCalibrate' : 'toggleDoorButtonWindowRRCalibrate';
                    break;
            }

            const toggleButton = document.getElementById(buttonId);
            const calibrateButton = document.getElementById(calibrateId);

            function disableButtons(except) {
                const buttons = [toggleButton, calibrateButton];
                buttons.forEach(button => {
                    if (button !== except) {
                        button.disabled = true;
                    }
                });
            }

            function enableButtons() {
                toggleButton.disabled = false;
                calibrateButton.disabled = false;
            }

            toggleButton.addEventListener('click', () => {
                const isFront = window.position.includes('Front');
                const durationOpen = isFront ? 4300 : 4150;

                if (toggleButton.textContent === 'Open') {
                    toggleButton.textContent = 'Close';
                    showCircles(circleClass, durationOpen);

                    disableButtons(toggleButton);
                    toggleButton.style.backgroundColor = 'red';
                    setTimeout(() => {
                        toggleButton.style.backgroundColor = '';
                        enableButtons();
                    }, durationOpen);
                } else {
                    const durationClose = isFront ? 4600 : 3600;
                    toggleButton.textContent = 'Open';
                    showCircles(circleClass, durationClose);

                    disableButtons(toggleButton);
                    toggleButton.style.backgroundColor = 'red';
                    setTimeout(() => {
                        toggleButton.style.backgroundColor = '';
                        enableButtons();
                    }, durationClose);
                }
            });

            calibrateButton.addEventListener('click', () => {
                const isFront = window.position.includes('Front');
                changeButtonColor(calibrateButton, isFront ? 13600 : 13000);
                showCircles(circleClass, isFront ? 13600 : 13000);

                disableButtons(calibrateButton);
                setTimeout(enableButtons, isFront ? 13600 : 13000);
            });
        });
    })
    .catch(error => console.error('Error fetching JSON:', error));