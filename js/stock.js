const apiKeyStock = 'crvvuo1r01qrbtrl5ia0crvvuo1r01qrbtrl5iag';
const symbols = ['AAPL', 'TSLA', 'META'];
const stockIcons = {
    AAPL: './img/stock/apple-icon.png',
    TSLA: './img/stock/tesla-icon.png',
    META: './img/stock/meta-icon.png',
};

async function fetchStockData() {
    try {
        const fetchPromises = symbols.map(symbol => {
            const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKeyStock}`;
            return fetch(url).then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching stock data for ${symbol}: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        });

        const profilePromises = symbols.map(symbol => {
            const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKeyStock}`;
            return fetch(url).then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching stock profile for ${symbol}: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        });

        const results = await Promise.all(fetchPromises);
        const profiles = await Promise.all(profilePromises);

        const container = document.getElementById('stockContainer');
        container.innerHTML = '';

        results.forEach((data, index) => {
            if (!data) {
                console.error(`No stock data found for ${symbols[index]}. Check the symbol or API key.`);
                return;
            }
            displayStockData(data, profiles[index], symbols[index]);
        });

    } catch (error) {
        console.error('Error:', error.message);
        const container = document.getElementById('stockContainer');
        container.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

function formatMarketCap(marketCap) {
    if (marketCap >= 1e6) {
        return (marketCap / 1e6).toFixed(3) + 'T';
    } else if (marketCap >= 1e6) {
        return (marketCap / 1e6).toFixed(1) + 'B';
    } else if (marketCap >= 1e3) {
        return (marketCap / 1e3).toFixed(1) + 'M';
    }
    return marketCap;
}

function displayStockData(data, profile, symbol) {
    const container = document.getElementById('stockContainer');
    const iconPath = stockIcons[symbol] || '';
    const iconClass = symbol === 'AAPL' ? 'apple-icon' : '';

    const dayChange = data.d ? data.d.toFixed(2) : 'N/A';
    const percentageChange = data.dp ? data.dp.toFixed(2) : 'N/A';
    const changeColor = data.d < 0 ? 'red' : data.d > 0 ? 'green' : 'white';
    const percentageColor = data.dp < 0 ? 'red' : data.dp > 0 ? 'green' : 'white';
    const currentPrice = data.c.toFixed(2);

    container.innerHTML += `
<div class="stock-data">
    <div class="stock-data__container">
        <div class="stock-data__title">
            <div class="stock-data__name">
                <img src="${iconPath}" class="stock-icon ${iconClass}" alt="${symbol} icon">
                <h3 class="stock-data__symbol">${symbol}</h3>
            </div>
            <div class="stock-data__name-full">
                <p class="stock-data__company-name">${symbol === 'TSLA' ? 'Tesla Inc.' : symbol === 'META' ? 'Meta Platforms Inc.' : symbol === 'AAPL' ? 'Apple Inc.' : ''}</p>
            </div>
        </div>
        <div class="stock-data__price">
            <p class="stock-data__day-change" style="color: ${changeColor};">${dayChange}$</p>
            <p class="stock-data__market-cap">${profile.marketCapitalization ? formatMarketCap(profile.marketCapitalization) : '-'}</p>
        </div>
        <div class="stock-data__price-full">
            <p class="stock-data__current-price">${currentPrice}$</p>
            <p class="stock-data__percentage-change" style="color: ${percentageColor};">${percentageChange}%</p>
        </div>
    </div>
    ${symbols.indexOf(symbol) < (symbols.length - 1) ? '<hr class="stock-data__line" />' : ''}
</div>
    `;
}

fetchStockData();
setInterval(fetchStockData, 600000);