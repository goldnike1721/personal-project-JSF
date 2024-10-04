// Switch
document.addEventListener('DOMContentLoaded', () => {
    const muteSwitch = document.getElementById('muteSwitch');
    const toggleSwitch = document.getElementById('toggleSwitch');
    const toggleInput = document.querySelector('.toggle-input');

    const soundOn = new Audio('mp3/sound-on.mp3');
    const soundOff = new Audio('mp3/sound-mute.mp3');

    muteSwitch.addEventListener('mouseenter', () => {
        toggleSwitch.classList.add('show');
        toggleSwitch.classList.remove('hide'); // Показуємо перемикач
    });

    muteSwitch.addEventListener('mouseleave', () => {
        toggleSwitch.classList.remove('show'); // Спочатку прибираємо show
        toggleSwitch.classList.add('hide'); // Додаємо клас hide
        setTimeout(() => {
            toggleSwitch.classList.remove('hide'); // Після анімації видаляємо hide
        }, 500); // Затримка повинна відповідати тривалості анімації slideOut
    });

    toggleSwitch.addEventListener('mouseenter', () => {
        toggleSwitch.classList.add('show');
        toggleSwitch.classList.remove('hide'); // Показуємо перемикач
    });

    toggleSwitch.addEventListener('mouseleave', () => {
        toggleSwitch.classList.remove('show'); // Спочатку прибираємо show
        toggleSwitch.classList.add('hide'); // Додаємо клас hide
        setTimeout(() => {
            toggleSwitch.classList.remove('hide'); // Після анімації видаляємо hide
        }, 500); // Затримка повинна відповідати тривалості анімації slideOut
    });

    toggleInput.addEventListener('change', () => {
        if (!toggleInput.checked) {
            muteSwitch.style.backgroundColor = '#c83d37';
            muteSwitch.style.boxShadow = '0 -2.5px 5px 0 #c83d37';

            soundOff.playbackRate = 3.0;

            let playCount = 0;

            function playSoundSequentially() {
                if (playCount < 3) {
                    soundOff.currentTime = 0;
                    soundOff.play();
                    playCount++;
                }
            }

            soundOff.addEventListener('ended', playSoundSequentially);
            playSoundSequentially();
        } else {
            muteSwitch.style.backgroundColor = '#C6DFDF';
            muteSwitch.style.boxShadow = 'none';
            soundOn.play();
        }
    });
});