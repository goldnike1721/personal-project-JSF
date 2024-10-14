function updateClock() {
    const now = new Date();

    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('time-general').innerText = time;
    document.getElementById('time-tesla').innerText = time;
    document.getElementById('time-radio').innerText = time;
    document.getElementById('time-weather').innerText = time;
    document.getElementById('time-stock').innerText = time;

    const time1 = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    const day = now.toLocaleDateString('en-US', { day: 'numeric' });
    const month = now.toLocaleDateString('en-US', { month: 'long' });
    const date = `${dayOfWeek}, ${day} ${month}`;

    document.getElementById('time-lockPage').innerText = time1;
    document.getElementById('date').innerText = date;
}

setInterval(updateClock, 1000);
updateClock();