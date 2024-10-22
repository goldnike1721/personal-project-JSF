const container = document.querySelector('.suspension-container');

container.innerHTML += `
    <div class="suspension-title">
      <p class="suspension-title__text">Ride Height</p>
    </div>
  `;

container.innerHTML += `
    <video id="myVideoMov">
      <source src="video/suspension.webm" type="video/webm">
    </video>
  `;

container.innerHTML += `
    <div class="clearance-control">
      <div class="vertical-slider-container">
        <div class="clearance-value">
          <span id="clearanceValue"></span>
        </div>
        <div class="clearance-range">
          <input type="range" id="clearanceRange" min="1" max="5" value="2" step="1" orient="vertical">
        </div>
      </div>
    </div>
  `;

const rangeInput = document.getElementById('clearanceRange');
const clearanceValueElement = document.getElementById('clearanceValue');
const clearanceRangeContainer = document.querySelector('.clearance-range');

const stopLines = [];

fetch('./api/suspension-tesla.json')
  .then(response => response.json())
  .then(data => {
    data.clearanceControl.stops.forEach((item, index) => {
      const stopLineDiv = document.createElement('div');
      stopLineDiv.className = `stop-line-${index + 1} stop-lines`;
      stopLineDiv.innerHTML = `
          <span class="label-text">${item.label}</span>
          <span class="label-text__bottom">${item.height}</span>
          <span class="label-text__bottom-new">
            <span class="label-text__bottom-new-span">Keep</span>
            ${item.keep}
          </span>
        `;
      clearanceRangeContainer.appendChild(stopLineDiv);
      stopLines.push(stopLineDiv);
    });

    updateLabels();
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

function updateLabels() {
  const currentValue = rangeInput.value;

  stopLines.forEach((stopLine) => {
    const bottomText = stopLine.querySelector('.label-text__bottom');
    const newText = stopLine.querySelector('.label-text__bottom-new');
    if (bottomText && newText) {
      bottomText.style.display = 'inline';
      newText.style.display = 'none';
    }
  });

  const currentStopLine = stopLines[stopLines.length - currentValue];
  if (currentStopLine) {
    const bottomText = currentStopLine.querySelector('.label-text__bottom');
    const newText = currentStopLine.querySelector('.label-text__bottom-new');
    if (bottomText && newText) {
      bottomText.style.display = 'none';
      newText.style.display = 'inline';
    }
  }
}

rangeInput.addEventListener('input', updateLabels);

window.addEventListener('DOMContentLoaded', () => {
  rangeInput.value = 2;
  updateLabels();

  if (clearanceValueElement) {
    clearanceValueElement.style.display = 'none';
  }
});