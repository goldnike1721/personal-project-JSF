const apiKey1 = 'VWRQ7BCUHKB8CC5H';
const symbols = ['AAPL', 'TSLA', 'META']; // Символи акцій

async function fetchStockData() {
    try {
        // Виконуємо запити для всіх акцій паралельно
        const fetchPromises = symbols.map(symbol => {
            const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey1}`;
            return fetch(url).then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching stock data for ${symbol}: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        });

        // Чекаємо на всі обіцянки
        const results = await Promise.all(fetchPromises);

        // Відображаємо дані для кожної акції
        results.forEach((data, index) => {
            if (!data['Time Series (Daily)']) {
                console.error(`No stock data found for ${symbols[index]}. Check the symbol or API key.`);
                return;
            }
            displayStockData(data, symbols[index]);
        });

    } catch (error) {
        console.error('Error:', error.message);
        const container = document.getElementById('stockContainer');
        container.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

function displayStockData(data, symbol) {
    const container = document.getElementById('stockContainer');
    const latestDate = Object.keys(data['Time Series (Daily)'])[0];
    const latestData = data['Time Series (Daily)'][latestDate];

    // Додаємо дані акцій у контейнер
    container.innerHTML += `
        <div class="stock-data">
            <h3>${symbol} Stock Data</h3>
            <p>Date: ${latestDate}</p>
            <p>Open: ${latestData['1. open']}</p>
            <p>High: ${latestData['2. high']}</p>
            <p>Low: ${latestData['3. low']}</p>
            <p>Close: ${latestData['4. close']}</p>
            <p>Volume: ${latestData['5. volume']}</p>
        </div>
    `;
}

// Викликаємо функцію для отримання даних
fetchStockData();
