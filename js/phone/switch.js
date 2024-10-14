document.addEventListener('DOMContentLoaded', () => {
    const muteSwitch = document.getElementById('muteSwitch');
    const toggleSwitch = document.getElementById('toggleSwitch');
    const toggleInput = document.querySelector('.toggle-input');

    const soundOn = new Audio('mp3/sound-on.mp3');
    const soundOff = new Audio('mp3/sound-mute.mp3');

    muteSwitch.addEventListener('mouseenter', () => {
        toggleSwitch.classList.add('show');
        toggleSwitch.classList.remove('hide');
    });

    muteSwitch.addEventListener('mouseleave', () => {
        toggleSwitch.classList.remove('show');
        toggleSwitch.classList.add('hide');
        setTimeout(() => {
            toggleSwitch.classList.remove('hide');
        }, 500);
    });

    toggleSwitch.addEventListener('mouseenter', () => {
        toggleSwitch.classList.add('show');
        toggleSwitch.classList.remove('hide');
    });

    toggleSwitch.addEventListener('mouseleave', () => {
        toggleSwitch.classList.remove('show');
        toggleSwitch.classList.add('hide');
        setTimeout(() => {
            toggleSwitch.classList.remove('hide');
        }, 500);
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