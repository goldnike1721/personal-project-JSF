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
    darkStart.classList.add('show-image'); // Додаємо клас для зміни фону
    darkContent.style.display = 'block'; // Показуємо контент
});

darkStart.addEventListener('mouseleave', () => {
    darkStart.classList.remove('show-image'); // Видаляємо клас для повернення до чорного фону
    setTimeout(() => {
        darkContent.style.display = 'none'; // Приховуємо контент з затримкою
    }, 300); // Затримка для плавності (можете змінити на бажану тривалість)
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