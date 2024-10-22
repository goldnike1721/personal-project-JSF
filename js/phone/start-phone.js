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

const darkStart = document.querySelector('.phone-frame__dark-start');
const darkContent = document.querySelector('.phone-frame__dark');

darkStart.addEventListener('mouseenter', () => {
    darkStart.style.backgroundImage = "url('../img/wallpaper.jpg')";
    darkContent.style.display = 'block';
});

darkStart.addEventListener('mouseleave', () => {
    darkStart.style.backgroundImage = 'none';
    darkContent.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function () {
    const generalProject = document.querySelector('.general-project');
    const togglePhoneBtn = document.getElementById('togglePhoneBtn');
    const arrowImage = document.getElementById('arrowImage');

    togglePhoneBtn.addEventListener('click', function () {
        if (generalProject.classList.contains('active')) {
            generalProject.classList.remove('active');
            setTimeout(function () {
                generalProject.classList.add('hidden');
                arrowImage.src = './img/right-arrow.png';
            }, 500);
        } else {
            generalProject.classList.remove('hidden');
            setTimeout(function () {
                generalProject.classList.add('active');
                arrowImage.src = './img/left-arrow.png';
            }, 10);
        }
    });
});