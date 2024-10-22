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
