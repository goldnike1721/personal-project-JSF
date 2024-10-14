document.getElementById('teslaContentButton1').addEventListener('click', function () {
    showTeslaContent('teslaContent1');
});

document.getElementById('teslaContentButton2').addEventListener('click', function () {
    showTeslaContent('teslaContent2');
});

document.getElementById('teslaContentButton3').addEventListener('click', function () {
    showTeslaContent('teslaContent3');
});

document.getElementById('teslaContentButton4').addEventListener('click', function () {
    showTeslaContent('teslaContent4');
});

document.getElementById('teslaContentButton5').addEventListener('click', function () {
    showTeslaContent('teslaContent5');
});

function showTeslaContent(contentId) {
    const contents = document.querySelectorAll('.hidden-content');
    contents.forEach(content => {
        content.style.display = 'none';
    });

    const selectedContent = document.getElementById(contentId);
    selectedContent.style.display = 'block';
}

showTeslaContent('teslaContent1');

const buttons = document.querySelectorAll('.tesla-new-button');

buttons.forEach(button => {
    button.addEventListener('click', function () {
        buttons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});
document.getElementById('teslaContentButton1').classList.add('active');