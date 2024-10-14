const rangeInput = document.getElementById('clearanceRange');
const stopLines = document.querySelectorAll('.stop-lines');

const reversedStopLines = Array.from(stopLines).reverse();

function updateLabels() {
    reversedStopLines.forEach((stopLine) => {
        const bottomText = stopLine.querySelector('.label-text__bottom');
        const newText = stopLine.querySelector('.label-text__bottom-new');
        bottomText.style.display = 'inline';
        newText.style.display = 'none';
    });

    const currentValue = rangeInput.value;

    const currentStopLine = reversedStopLines[currentValue - 1];
    const bottomText = currentStopLine.querySelector('.label-text__bottom');
    const newText = currentStopLine.querySelector('.label-text__bottom-new');
    bottomText.style.display = 'none';
    newText.style.display = 'inline';
}

rangeInput.addEventListener('input', updateLabels);

window.addEventListener('DOMContentLoaded', () => {
    rangeInput.value = 2;
    updateLabels();
});