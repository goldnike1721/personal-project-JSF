// Indicators на сторінці основній
function showContent(pageNumber) {
    document.querySelectorAll('.main-content').forEach((content) => {
        content.classList.add('hidden');
    });

    document.getElementById(`content${pageNumber}`).classList.remove('hidden');

    document.querySelectorAll('.indicator').forEach((indicator) => {
        indicator.classList.remove('active');
    });

    document.querySelector(`.indicator:nth-child(${pageNumber})`).classList.add('active');
}

let currentContentIndex = 1; // Змінна для відстеження активного контенту

function showContent(pageNumber) {
    const currentContent = document.getElementById(`content${currentContentIndex}`);
    const newContent = document.getElementById(`content${pageNumber}`);

    if (currentContentIndex === pageNumber) return; // Якщо контент вже активний, нічого не робимо

    // Показуємо новий контент і запускаємо анімації одночасно
    newContent.classList.remove('hidden');

    // Анімація для обох елементів
    if (pageNumber > currentContentIndex) {
        currentContent.classList.add('slide-out-left');
        newContent.classList.add('slide-in-right');
    } else {
        currentContent.classList.add('slide-out-right');
        newContent.classList.add('slide-in-left');
    }

    // Очистка класів після завершення анімації для поточного і нового контенту
    currentContent.addEventListener('animationend', () => {
        currentContent.classList.add('hidden');
        currentContent.classList.remove('slide-out-left', 'slide-out-right');
    }, { once: true });

    newContent.addEventListener('animationend', () => {
        newContent.classList.remove('slide-in-right', 'slide-in-left');
        currentContentIndex = pageNumber;
    }, { once: true });

    // Оновлюємо активний індикатор
    document.querySelectorAll('.indicator').forEach((indicator) => {
        indicator.classList.remove('active');
    });
    document.querySelector(`.indicator:nth-child(${pageNumber})`).classList.add('active');
}