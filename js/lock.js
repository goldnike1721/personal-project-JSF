// Lock!!!!!!!!!!!!!
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.querySelector('.button__start-page-general');
    const closedLock = document.querySelector('.iphone-lock');
    const openLock = document.querySelector('.iphone-lock__open');

    closedLock.classList.add('show');

    startButton.addEventListener('mouseenter', () => {
        closedLock.classList.remove('show');
        openLock.classList.add('show');
    });

    startButton.addEventListener('mouseleave', () => {
        openLock.classList.remove('show');
        closedLock.classList.add('show');
    });
});