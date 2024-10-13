function hideScreen() {
    const currentScreen = document.querySelector('.new-screen:not(.hidden)');

    if (currentScreen && ['doorScreen', 'windowScreen', 'wrapersScreen'].includes(currentScreen.id)) {
        showScreen('teslaScreen');
    } else {
        showScreen('startScreen');
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.new-screen').forEach(screen => {
        screen.classList.add('hidden');
    });

    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.remove('hidden');
    }
}



//Brightness Tesla
const brightnessRange = document.getElementById("brightnessRange");
const brightnessValue = document.getElementById("brightnessValue");
const teslaScreen = document.getElementById("teslaScreen");
const autoButton = document.getElementById("autoButton");

function updateBrightness(sliderValue) {
    if (sliderValue == 0) {
        brightnessValue.textContent = "0";
        teslaScreen.style.filter = `brightness(20%)`;
    } else {
        let brightness = 20 + ((sliderValue / 100) * 80);
        brightnessValue.textContent = sliderValue;
        teslaScreen.style.filter = `brightness(${brightness}%)`;
    }
}

brightnessRange.addEventListener("input", function () {
    let sliderValue = brightnessRange.value;
    updateBrightness(sliderValue);
});

function smoothBrightnessChange(targetBrightness) {
    let currentBrightness = parseFloat(teslaScreen.style.filter.replace(/[^\d.]/g, '')) || 100;
    const step = (targetBrightness - currentBrightness) / 50;
    let counter = 0;

    const interval = setInterval(() => {
        currentBrightness += step;
        teslaScreen.style.filter = `brightness(${currentBrightness}%)`;

        let sliderValue = Math.round(((currentBrightness - 20) / 80) * 100);
        brightnessRange.value = sliderValue;
        brightnessValue.textContent = sliderValue;

        counter++;
        if (counter >= 50) {
            clearInterval(interval);
        }
    }, 10);
}

autoButton.addEventListener("click", function () {
    let randomBrightness = Math.floor(Math.random() * 51) + 50;
    smoothBrightnessChange(randomBrightness);
});

document.addEventListener("DOMContentLoaded", function () {
    brightnessRange.value = 100;
    updateBrightness(100);
});






//Page Tesla 
document.getElementById('teslaContentButton1').addEventListener('click', function () {
    showTeslaContent('teslaContent1');
});

document.getElementById('teslaContentButton2').addEventListener('click', function () {
    showTeslaContent('teslaContent2');
});

document.getElementById('teslaContentButton3').addEventListener('click', function () {
    showTeslaContent('teslaContent3');
});

document.getElementById('teslaContentButton4').addEventListener('click', function () {
    showTeslaContent('teslaContent4');
});

document.getElementById('teslaContentButton5').addEventListener('click', function () {
    showTeslaContent('teslaContent5');
});

function showTeslaContent(contentId) {
    const contents = document.querySelectorAll('.hidden-content');
    contents.forEach(content => {
        content.style.display = 'none';
    });

    const selectedContent = document.getElementById(contentId);
    selectedContent.style.display = 'block';
}

showTeslaContent('teslaContent1');

const buttons = document.querySelectorAll('.tesla-new-button');

buttons.forEach(button => {
    button.addEventListener('click', function () {
        buttons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});
document.getElementById('teslaContentButton1').classList.add('active');




//Clearance text
const rangeInput = document.getElementById('clearanceRange');
const stopLines = document.querySelectorAll('.stop-lines');

// Створюємо масив міток у зворотному порядку
const reversedStopLines = Array.from(stopLines).reverse();

function updateLabels() {
    // Очищуємо всі мітки
    reversedStopLines.forEach((stopLine) => {
        const bottomText = stopLine.querySelector('.label-text__bottom');
        const newText = stopLine.querySelector('.label-text__bottom-new');
        bottomText.style.display = 'inline';
        newText.style.display = 'none';
    });

    // Отримуємо поточне значення повзунка
    const currentValue = rangeInput.value;

    // Відображаємо новий текст для відповідної мітки
    const currentStopLine = reversedStopLines[currentValue - 1]; // Мінус 1, бо індексація починається з 0
    const bottomText = currentStopLine.querySelector('.label-text__bottom');
    const newText = currentStopLine.querySelector('.label-text__bottom-new');
    bottomText.style.display = 'none';
    newText.style.display = 'inline';
}

// Запускаємо функцію при зміні повзунка
rangeInput.addEventListener('input', updateLabels);

// Викликаємо функцію при завантаженні сторінки, виставляючи повзунок на 2 мітку
window.addEventListener('DOMContentLoaded', () => {
    rangeInput.value = 2; // Виставляємо значення повзунка на 2
    updateLabels(); // Оновлюємо текст
});


//Tesla window
// Завантаження даних з JSON через fetch
fetch('./api/window-tesla.json')
    .then(response => response.json())
    .then(data => {
        let windowsHTML = '';

        data.windows.forEach((window) => {
            // Визначаємо позицію для унікального класу
            let positionClass = '';
            let positionId = '';
            let titleClass = '';
            let circleClass = '';

            // Визначаємо унікальний клас для заголовка
            switch (window.position) {
                case 'Front left':
                    positionClass = 'front-left';
                    positionId = 'toggleDoorButtonWindowFL';
                    titleClass = 'title-front-left';
                    circleClass = 'circle-front-left'
                    break;
                case 'Front right':
                    positionClass = 'front-right';
                    positionId = 'toggleDoorButtonWindowFR';
                    titleClass = 'title-front-right';
                    circleClass = 'circle-front-right'
                    break;
                case 'Rear left':
                    positionClass = 'rear-left';
                    positionId = 'toggleDoorButtonWindowRL';
                    titleClass = 'title-rear-left';
                    circleClass = 'circle-rear-left'
                    break;
                case 'Rear right':
                    positionClass = 'rear-right';
                    positionId = 'toggleDoorButtonWindowRR';
                    titleClass = 'title-rear-right';
                    circleClass = 'circle-rear-right'
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
                        <button class="tesla-window__calibrate-button">${window.calibrate ? 'Calibrated' : 'Calibrate'}</button>
                    </div>
                </div>
            `;

            windowsHTML += windowStatus;
        });

        // Вставка згенерованого HTML у контейнер
        document.querySelector('.tesla-window__container').innerHTML = windowsHTML;

        // Додаємо обробники подій для кожної кнопки відкриття-закриття вікна
        data.windows.forEach((window) => {
            let buttonId = '';

            switch (window.position) {
                case 'Front left':
                    buttonId = 'toggleDoorButtonWindowFL';
                    break;
                case 'Front right':
                    buttonId = 'toggleDoorButtonWindowFR';
                    break;
                case 'Rear left':
                    buttonId = 'toggleDoorButtonWindowRL';
                    break;
                case 'Rear right':
                    buttonId = 'toggleDoorButtonWindowRR';
                    break;
            }

            const toggleButton = document.getElementById(buttonId);
            toggleButton.addEventListener('click', () => {
                // Перемикаємо текст кнопки
                if (toggleButton.textContent === 'Open') {
                    toggleButton.textContent = 'Close';
                } else {
                    toggleButton.textContent = 'Open';
                }
            });
        });
    })
    .catch(error => console.error('Error fetching JSON:', error));
