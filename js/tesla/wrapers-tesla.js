const video = document.getElementById('myVideoMovWrapers');
const totalButtons = 4;
const allButtons = document.querySelectorAll('.tesla-wrapers__button-ones, .tesla-wrapers__button-1st, .tesla-wrapers__button-2st, .tesla-wrapers__button-3st');
const buttons = document.querySelectorAll('.tesla-wrapers__button-1st, .tesla-wrapers__button-2st, .tesla-wrapers__button-3st');

function playSection(startPercentage, endPercentage) {
    const videoDuration = video.duration;
    const startTime = videoDuration * startPercentage;
    const endTime = videoDuration * endPercentage;

    video.pause();

    video.currentTime = startTime;

    video.onseeked = function () {
        video.play();
    };

    const stopInterval = setInterval(() => {
        if (video.currentTime >= endTime || video.currentTime < startTime) {
            video.pause();
            clearInterval(stopInterval);
        }
    }, 10);
}

document.getElementById('buttonFirstModeWrapersOne').addEventListener('click', function () {
    playSection(0, 0.25);
});

document.getElementById('buttonFirstModeWrapers').addEventListener('click', function () {
    playSection(0.25, 0.5);
});

document.getElementById('buttonSecondModeWrapers').addEventListener('click', function () {
    playSection(0.5, 0.75);
});

document.getElementById('buttonThirdModeWrapers').addEventListener('click', function () {
    playSection(0.75, 1);
});

function deactivateButtons(exceptButton) {
    allButtons.forEach(button => {
        if (button !== exceptButton) {
            button.classList.remove('active');
        }
    });
}

document.querySelector('.tesla-wrapers__button-ones').addEventListener('click', function () {
    let button = this;
    button.classList.add('active');

    setTimeout(function () {
        button.classList.remove('active');
    }, 2700);

    deactivateButtons(button);
});

buttons.forEach(button => {
    button.addEventListener('click', function () {
        this.classList.add('active');
        deactivateButtons(this);
    });
});

document.querySelector('.tesla-wrapers__signal').addEventListener('click', function () {
    const element = this;
    const sound = document.getElementById('signalSound');

    sound.currentTime = 0;
    sound.play();

    element.classList.add('active');

    setTimeout(function () {
        element.classList.remove('active');
    }, 100);
});