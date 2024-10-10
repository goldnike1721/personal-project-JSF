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