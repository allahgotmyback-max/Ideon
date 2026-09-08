/* =========================================================
   IDEON MARKET LAB
   DEMO / VIRTUAL STOCK MARKET
   ========================================================= */

const STARTING_BALANCE = 100000;

const PORTFOLIO_KEY = "ideonMarketPortfolio";
const WATCHLIST_KEY = "ideonMarketWatchlist";


/* =========================================================
   STOCK DATABASE
   ========================================================= */

const stocks = {

    RELIANCE: {
        symbol: "RELIANCE",
        name: "Reliance Industries",
        exchange: "NSE",
        price: 1428.50,
        change: 1.84
    },

    TCS: {
        symbol: "TCS",
        name: "Tata Consultancy Services",
        exchange: "NSE",
        price: 3215.40,
        change: -0.62
    },

    INFY: {
        symbol: "INFY",
        name: "Infosys",
        exchange: "NSE",
        price: 1482.20,
        change: 0.91
    },

    HDFCBANK: {
        symbol: "HDFCBANK",
        name: "HDFC Bank",
        exchange: "NSE",
        price: 1745.80,
        change: -0.34
    },

    ICICIBANK: {
        symbol: "ICICIBANK",
        name: "ICICI Bank",
        exchange: "NSE",
        price: 1328.60,
        change: 1.12
    },

    ITC: {
        symbol: "ITC",
        name: "ITC Limited",
        exchange: "NSE",
        price: 418.75,
        change: 0.48
    },

    SBIN: {
        symbol: "SBIN",
        name: "State Bank of India",
        exchange: "NSE",
        price: 812.30,
        change: 0.76
    },

    BHARTIARTL: {
        symbol: "BHARTIARTL",
        name: "Bharti Airtel",
        exchange: "NSE",
        price: 1912.40,
        change: 1.28
    },

    HINDUNILVR: {
        symbol: "HINDUNILVR",
        name: "Hindustan Unilever",
        exchange: "NSE",
        price: 2475.60,
        change: -0.28
    },

    MARUTI: {
        symbol: "MARUTI",
        name: "Maruti Suzuki",
        exchange: "NSE",
        price: 14820.00,
        change: 0.63
    },

    AAPL: {
        symbol: "AAPL",
        name: "Apple Inc.",
        exchange: "NASDAQ",
        price: 319.97,
        change: -2.51
    },

    MSFT: {
        symbol: "MSFT",
        name: "Microsoft Corporation",
        exchange: "NASDAQ",
        price: 507.00,
        change: 0.72
    },

    TSLA: {
        symbol: "TSLA",
        name: "Tesla Inc.",
        exchange: "NASDAQ",
        price: 338.50,
        change: 1.36
    },

    AMZN: {
        symbol: "AMZN",
        name: "Amazon",
        exchange: "NASDAQ",
        price: 229.40,
        change: -0.44
    }
};


/* =========================================================
   STATE
   ========================================================= */

let selectedStock = stocks.RELIANCE;

let selectedRange = "1D";

let liveChartCandles = [];

let chartZoom = 1;
let chartOffset = 0;

let isDraggingChart = false;
let dragStartX = 0;
let dragStartOffset = 0;

let tradeSide = "BUY";
let orderType = "MARKET";


/* =========================================================
   HELPERS
   ========================================================= */

function money(value) {

    const number = Number(value) || 0;

    return "₹" + number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function showSearchMessage(message, type = "info") {

    const box =
        document.getElementById("marketSearchMessage");

    if (!box) return;

    box.textContent = message;

    box.className =
        `market-search-message ${type}`;
}


function showTradeMessage(message, type = "info") {

    let box =
        document.getElementById("tradeMessage");

    if (!box) {

        const terminal =
            document.querySelector(".order-terminal") ||
            document.querySelector(".trade-terminal");

        if (!terminal) return;

        box =
            document.createElement("div");

        box.id = "tradeMessage";

        box.className = "trade-message";

        terminal.appendChild(box);
    }

    box.textContent = message;

    box.className =
        `trade-message ${type}`;
}


/* =========================================================
   PORTFOLIO
   ========================================================= */

function getPortfolio() {

    try {

        const saved =
            localStorage.getItem(PORTFOLIO_KEY);

        if (!saved) {

            return {
                cash: STARTING_BALANCE,
                holdings: {}
            };
        }

        const parsed =
            JSON.parse(saved);

        return {

            cash:
                Number.isFinite(Number(parsed.cash))
                    ? Number(parsed.cash)
                    : STARTING_BALANCE,

            holdings:
                parsed.holdings &&
                typeof parsed.holdings === "object"
                    ? parsed.holdings
                    : {}
        };

    } catch {

        return {
            cash: STARTING_BALANCE,
            holdings: {}
        };
    }
}


function savePortfolio(portfolio) {

    localStorage.setItem(
        PORTFOLIO_KEY,
        JSON.stringify(portfolio)
    );
}


/* =========================================================
   WATCHLIST
   ========================================================= */

function getWatchlist() {

    try {

        const saved =
            localStorage.getItem(WATCHLIST_KEY);

        if (!saved) {

            return [
                "RELIANCE",
                "TCS",
                "INFY",
                "HDFCBANK",
                "ICICIBANK",
                "ITC"
            ];
        }

        const parsed =
            JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch {

        return [];
    }
}


function saveWatchlist(list) {

    localStorage.setItem(
        WATCHLIST_KEY,
        JSON.stringify(list)
    );
}


/* =========================================================
   FIND STOCK
   ========================================================= */

function findStock(symbol) {

    return stocks[
        String(symbol)
            .trim()
            .toUpperCase()
    ] || null;
}


/* =========================================================
   SEARCH
   ========================================================= */

function searchStocks(query) {

    query =
        String(query || "")
            .trim()
            .toLowerCase();

    if (!query) {

        showSearchMessage(
            "Enter a stock name or symbol.",
            "error"
        );

        return;
    }


    const results =
        Object.values(stocks)
            .filter(stock => {

                return (
                    stock.symbol
                        .toLowerCase()
                        .includes(query) ||

                    stock.name
                        .toLowerCase()
                        .includes(query)
                );
            });


    if (!results.length) {

        showSearchMessage(
            "No matching stocks found.",
            "error"
        );

        removeSearchResults();

        return;
    }


    renderSearchResults(results);


    showSearchMessage(
        `${results.length} matching stock${results.length === 1 ? "" : "s"} found.`,
        "success"
    );
}


function renderSearchResults(results) {

    removeSearchResults();


    const input =
        document.getElementById("stockSearch");

    if (!input) return;


    const container =
        input.parentElement?.parentElement;

    if (!container) return;


    const wrapper =
        document.createElement("div");

    wrapper.id =
        "marketSearchResults";

    wrapper.className =
        "market-search-results";


    results.slice(0, 8).forEach(stock => {

        const button =
            document.createElement("button");

        button.className =
            "market-search-result";


        button.innerHTML = `
            <span>
                <strong>
                    ${escapeHTML(stock.symbol)}
                </strong>

                <small>
                    ${escapeHTML(stock.name)}
                </small>
            </span>

            <span>
                ${money(stock.price)}
            </span>
        `;


        button.addEventListener(
            "click",
            () => {

                selectStock(stock);

                addToWatchlist(stock.symbol);

                removeSearchResults();

                showSearchMessage(
                    `${stock.symbol} selected.`,
                    "success"
                );
            }
        );


        wrapper.appendChild(button);
    });


    container.insertAdjacentElement(
        "afterend",
        wrapper
    );
}


function removeSearchResults() {

    const results =
        document.getElementById(
            "marketSearchResults"
        );

    if (results) {
        results.remove();
    }
}


/* =========================================================
   SELECT STOCK
   ========================================================= */

function selectStock(stock) {

    selectedStock = stock;

    chartZoom = 1;
    chartOffset = 0;

    renderSelectedStock();

    generateSampleCandles();

    drawCandlestickChart();
}


/* =========================================================
   SELECTED STOCK
   ========================================================= */

function renderSelectedStock() {

    if (!selectedStock) return;


    const symbol =
        document.querySelector(".stock-symbol");

    const name =
        document.querySelector(".stock-name");

    const price =
        document.querySelector(".stock-price");

    const change =
        document.querySelector(".stock-change");

    const exchange =
        document.querySelector(".market-badge");


    if (symbol) {

        symbol.textContent =
            selectedStock.symbol;
    }


    if (name) {

        name.textContent =
            selectedStock.name;
    }


    if (exchange) {

        exchange.textContent =
            selectedStock.exchange;
    }


    if (price) {

        price.textContent =
            money(selectedStock.price);
    }


    if (change) {

        const percent =
            Number(selectedStock.change) || 0;


        change.textContent =
            `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`;


        change.classList.toggle(
            "positive",
            percent >= 0
        );


        change.classList.toggle(
            "negative",
            percent < 0
        );
    }


    updateTradePanel();

    renderPortfolio();
}


/* =========================================================
   SAMPLE CANDLE GENERATOR
   ========================================================= */

function generateSampleCandles() {

    const stock =
        selectedStock;


    const rangeSettings = {

        "1D": {
            count: 72,
            volatility: 0.004
        },

        "1W": {
            count: 70,
            volatility: 0.012
        },

        "1M": {
            count: 80,
            volatility: 0.018
        },

        "1Y": {
            count: 100,
            volatility: 0.035
        }
    };


    const settings =
        rangeSettings[selectedRange] ||
        rangeSettings["1D"];


    const candles = [];


    let price =
        stock.price *
        (
            1 -
            stock.change / 100
        );


    const now =
        Date.now();


    for (
        let i = 0;
        i < settings.count;
        i++
    ) {

        const trend =
            stock.change >= 0
                ? 0.0007
                : -0.0004;


        const randomMove =
            (
                Math.random() - 0.5
            ) *
            settings.volatility;


        const movement =
            trend +
            randomMove;


        const open =
            price;


        const close =
            Math.max(
                0.01,
                open *
                (1 + movement)
            );


        const high =
            Math.max(
                open,
                close
            ) *
            (
                1 +
                Math.random() *
                settings.volatility *
                0.55
            );


        const low =
            Math.min(
                open,
                close
            ) *
            (
                1 -
                Math.random() *
                settings.volatility *
                0.55
            );


        candles.push({

            time:
                now -
                (
                    settings.count -
                    i
                ) *
                600000,

            open,
            high,
            low,
            close
        });


        price =
            close;
    }


    /* Make final candle match stock price */

    if (candles.length) {

        const last =
            candles[
                candles.length - 1
            ];

        last.close =
            stock.price;

        last.high =
            Math.max(
                last.high,
                last.open,
                stock.price
            );

        last.low =
            Math.min(
                last.low,
                last.open,
                stock.price
            );
    }


    liveChartCandles =
        candles;
}


/* =========================================================
   DRAW CHART
   ========================================================= */

function drawCandlestickChart() {

    const svg =
        document.getElementById("stockChart");

    if (!svg) return;


    const width =
        svg.clientWidth ||
        svg.parentElement?.clientWidth ||
        800;


    const height =
        svg.clientHeight ||
        420;


    svg.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
    );


    svg.innerHTML = "";


    const candles =
        liveChartCandles;


    if (!candles.length) return;


    const total =
        candles.length;


    const visibleCount =
        Math.max(
            8,
            Math.floor(
                total / chartZoom
            )
        );


    const maxOffset =
        Math.max(
            0,
            total - visibleCount
        );


    chartOffset =
        Math.max(
            0,
            Math.min(
                chartOffset,
                maxOffset
            )
        );


    const start =
        Math.max(
            0,
            total -
            visibleCount -
            chartOffset
        );


    const end =
        Math.min(
            total,
            start + visibleCount
        );


    const visible =
        candles.slice(
            start,
            end
        );


    if (!visible.length) return;


    /* PRICE RANGE */

    let minPrice =
        Math.min(
            ...visible.map(
                candle =>
                    candle.low
            )
        );


    let maxPrice =
        Math.max(
            ...visible.map(
                candle =>
                    candle.high
            )
        );


    const priceRange =
        maxPrice -
        minPrice;


    const padding =
        priceRange > 0
            ? priceRange * 0.12
            : maxPrice * 0.02;


    minPrice -= padding;
    maxPrice += padding;


    /* CHART AREA */

    const left = 50;
    const right = 15;
    const top = 20;
    const bottom = 30;


    const chartWidth =
        width -
        left -
        right;


    const chartHeight =
        height -
        top -
        bottom;


    function priceToY(price) {

        return (
            top +
            (
                (maxPrice - price) /
                (maxPrice - minPrice)
            ) *
            chartHeight
        );
    }


    /* GRID */

    const grid =
        document.getElementById(
            "chartGrid"
        );


    if (grid) {

        grid.innerHTML = "";


        for (
            let i = 0;
            i <= 5;
            i++
        ) {

            const y =
                top +
                (
                    chartHeight /
                    5
                ) *
                i;


            const line =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "line"
                );


            line.setAttribute(
                "x1",
                left
            );

            line.setAttribute(
                "x2",
                width - right
            );

            line.setAttribute(
                "y1",
                y
            );

            line.setAttribute(
                "y2",
                y
            );

            line.setAttribute(
                "stroke",
                "currentColor"
            );

            line.setAttribute(
                "opacity",
                "0.08"
            );


            grid.appendChild(line);


            const label =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "text"
                );


            const value =
                maxPrice -
                (
                    (maxPrice - minPrice) /
                    5
                ) *
                i;


            label.setAttribute(
                "x",
                4
            );

            label.setAttribute(
                "y",
                y + 4
            );

            label.setAttribute(
                "fill",
                "currentColor"
            );

            label.setAttribute(
                "opacity",
                "0.55"
            );

            label.setAttribute(
                "font-size",
                "10"
            );


            label.textContent =
                formatCompactPrice(value);


            grid.appendChild(label);
        }
    }


    /* CANDLES */

    const layer =
        document.getElementById(
            "ideonCandleLayer"
        );


    if (!layer) return;


    layer.innerHTML = "";


    const step =
        chartWidth /
        visible.length;


    const candleWidth =
        Math.max(
            2,
            step * 0.58
        );


    visible.forEach(
        (candle, index) => {

            const x =
                left +
                step * index +
                step / 2;


            const yOpen =
                priceToY(
                    candle.open
                );


            const yClose =
                priceToY(
                    candle.close
                );


            const yHigh =
                priceToY(
                    candle.high
                );


            const yLow =
                priceToY(
                    candle.low
                );


            const bullish =
                candle.close >=
                candle.open;


            /* WICK */

            const wick =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "line"
                );


            wick.setAttribute(
                "x1",
                x
            );

            wick.setAttribute(
                "x2",
                x
            );

            wick.setAttribute(
                "y1",
                yHigh
            );

            wick.setAttribute(
                "y2",
                yLow
            );

            wick.setAttribute(
                "stroke",
                bullish
                    ? "#35d07f"
                    : "#ff5f6d"
            );

            wick.setAttribute(
                "stroke-width",
                "1"
            );


            layer.appendChild(wick);


            /* BODY */

            const body =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "rect"
                );


            body.setAttribute(
                "x",
                x -
                candleWidth / 2
            );


            body.setAttribute(
                "y",
                Math.min(
                    yOpen,
                    yClose
                )
            );


            body.setAttribute(
                "width",
                candleWidth
            );


            body.setAttribute(
                "height",
                Math.max(
                    1,
                    Math.abs(
                        yClose -
                        yOpen
                    )
                )
            );


            body.setAttribute(
                "fill",
                bullish
                    ? "#35d07f"
                    : "#ff5f6d"
            );


            body.setAttribute(
                "rx",
                "1"
            );


            layer.appendChild(body);
        }
    );


    createDemoBadge();

    ensureChartControls();

    bindChartPan();
}


/* =========================================================
   PRICE LABEL
   ========================================================= */

function formatCompactPrice(value) {

    const number =
        Number(value) || 0;


    if (number >= 100000) {

        return "₹" +
            (
                number / 100000
            ).toFixed(1) +
            "L";
    }


    if (number >= 1000) {

        return "₹" +
            (
                number / 1000
            ).toFixed(1) +
            "K";
    }


    return "₹" +
        number.toFixed(0);
}


/* =========================================================
   DEMO BADGE
   ========================================================= */

function createDemoBadge() {

    const chart =
        document.querySelector(
            ".stock-chart"
        );

    if (!chart) return;


    let badge =
        chart.querySelector(
            ".ideon-live-badge"
        );


    if (!badge) {

        badge =
            document.createElement("div");

        badge.className =
            "ideon-live-badge";

        chart.appendChild(badge);
    }


    badge.innerHTML = `
        <span></span>
        DEMO DATA
    `;
}


/* =========================================================
   CHART CONTROLS
   ========================================================= */

function ensureChartControls() {

    const chart =
        document.querySelector(
            ".stock-chart"
        );

    if (!chart) return;


    let controls =
        chart.querySelector(
            ".ideon-chart-zoom"
        );


    if (!controls) {

        controls =
            document.createElement("div");

        controls.className =
            "ideon-chart-zoom";


        controls.innerHTML = `
            <button data-chart-action="left">←</button>
            <button data-chart-action="zoomOut">−</button>
            <button data-chart-action="reset">⟳</button>
            <button data-chart-action="zoomIn">+</button>
            <button data-chart-action="right">→</button>
        `;


        chart.appendChild(controls);
    }


    if (
        controls.dataset.bound === "true"
    ) {
        return;
    }


    controls.dataset.bound =
        "true";


    controls
        .querySelectorAll(
            "[data-chart-action]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.chartAction;


                    if (
                        action === "zoomIn"
                    ) {

                        chartZoom =
                            Math.min(
                                8,
                                chartZoom * 1.35
                            );
                    }


                    if (
                        action === "zoomOut"
                    ) {

                        chartZoom =
                            Math.max(
                                1,
                                chartZoom / 1.35
                            );
                    }


                    if (
                        action === "reset"
                    ) {

                        chartZoom = 1;

                        chartOffset = 0;
                    }


                    const movement =
                        Math.max(
                            2,
                            Math.floor(
                                liveChartCandles.length /
                                12
                            )
                        );


                    if (
                        action === "left"
                    ) {

                        chartOffset +=
                            movement;
                    }


                    if (
                        action === "right"
                    ) {

                        chartOffset =
                            Math.max(
                                0,
                                chartOffset -
                                movement
                            );
                    }


                    drawCandlestickChart();
                }
            );
        });
}


/* =========================================================
   DRAG / PAN
   ========================================================= */

function bindChartPan() {

    const chart =
        document.querySelector(
            ".stock-chart"
        );

    if (!chart) return;


    if (
        chart.dataset.panBound === "true"
    ) {
        return;
    }


    chart.dataset.panBound =
        "true";


    chart.addEventListener(
        "pointerdown",
        event => {

            if (
                event.target.closest(
                    ".ideon-chart-zoom"
                )
            ) {
                return;
            }


            isDraggingChart = true;

            dragStartX =
                event.clientX;

            dragStartOffset =
                chartOffset;


            chart.setPointerCapture?.(
                event.pointerId
            );


            chart.classList.add(
                "dragging"
            );
        }
    );


    chart.addEventListener(
        "pointermove",
        event => {

            if (!isDraggingChart) {
                return;
            }


            const distance =
                event.clientX -
                dragStartX;


            const width =
                chart.clientWidth ||
                800;


            const visibleCount =
                Math.max(
                    8,
                    Math.floor(
                        liveChartCandles.length /
                        chartZoom
                    )
                );


            const candlesPerPixel =
                visibleCount /
                width;


            chartOffset =
                Math.round(
                    dragStartOffset -
                    distance *
                    candlesPerPixel
                );


            const maxOffset =
                Math.max(
                    0,
                    liveChartCandles.length -
                    visibleCount
                );


            chartOffset =
                Math.max(
                    0,
                    Math.min(
                        chartOffset,
                        maxOffset
                    )
                );


            drawCandlestickChart();
        }
    );


    function stopDragging() {

        isDraggingChart = false;

        chart.classList.remove(
            "dragging"
        );
    }


    chart.addEventListener(
        "pointerup",
        stopDragging
    );


    chart.addEventListener(
        "pointercancel",
        stopDragging
    );


    chart.addEventListener(
        "pointerleave",
        stopDragging
    );
}


/* =========================================================
   RANGE BUTTONS
   ========================================================= */

function setupRangeButtons() {

    document
        .querySelectorAll(
            ".chart-range button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectedRange =
                        button.dataset.range ||
                        button.textContent.trim();


                    document
                        .querySelectorAll(
                            ".chart-range button"
                        )
                        .forEach(btn => {

                            btn.classList.toggle(
                                "active",
                                btn === button
                            );
                        });


                    chartZoom = 1;

                    chartOffset = 0;


                    generateSampleCandles();

                    drawCandlestickChart();
                }
            );
        });
}


/* =========================================================
   WATCHLIST
   ========================================================= */

function renderWatchlist() {

    const container =
        document.querySelector(
            ".ideon-watchlist"
        );

    if (!container) return;


    let toggle =
        document.getElementById(
            "watchlistToggle"
        );


    let content =
        document.getElementById(
            "watchlistContent"
        );


    let items =
        document.getElementById(
            "watchlistItems"
        );


    if (!toggle) {

        toggle =
            document.createElement("button");

        toggle.id =
            "watchlistToggle";

        toggle.className =
            "ideon-watchlist-toggle";

        container.prepend(toggle);
    }


    if (!content) {

        content =
            document.createElement("div");

        content.id =
            "watchlistContent";

        content.className =
            "ideon-watchlist-content";

        container.appendChild(content);
    }


    if (!items) {

        items =
            document.createElement("div");

        items.id =
            "watchlistItems";

        items.className =
            "ideon-watchlist-items";

        content.appendChild(items);
    }


    const list =
        getWatchlist();


    toggle.innerHTML = `
        <span>
            Watchlist
            <small>${list.length}</small>
        </span>

        <span class="watchlist-arrow">
            ${
                container.dataset.expanded === "true"
                    ? "▲"
                    : "▼"
            }
        </span>
    `;


    if (
        toggle.dataset.bound !== "true"
    ) {

        toggle.dataset.bound =
            "true";


        toggle.addEventListener(
            "click",
            () => {

                const expanded =
                    container.dataset.expanded === "true";


                container.dataset.expanded =
                    expanded
                        ? "false"
                        : "true";


                renderWatchlist();
            }
        );
    }


    content.style.display =
        container.dataset.expanded === "true"
            ? "block"
            : "none";


    items.innerHTML = "";


    if (!list.length) {

        items.innerHTML = `
            <div class="watchlist-empty">
                No stocks in watchlist.
            </div>
        `;

        return;
    }


    list.forEach(symbol => {

        const stock =
            findStock(symbol);

        if (!stock) return;


        const button =
            document.createElement("button");

        button.className =
            "ideon-watch-item";


        button.innerHTML = `
            <span>
                <strong>
                    ${escapeHTML(stock.symbol)}
                </strong>

                <small>
                    ${escapeHTML(stock.name)}
                </small>
            </span>

            <span>
                ${money(stock.price)}
            </span>
        `;


        button.addEventListener(
            "click",
            () => {

                selectStock(stock);
            }
        );


        items.appendChild(button);
    });
}


/* =========================================================
   ADD WATCHLIST
   ========================================================= */

function addToWatchlist(symbol) {

    const stock =
        findStock(symbol);

    if (!stock) return;


    const list =
        getWatchlist();


    if (
        list.includes(
            stock.symbol
        )
    ) {
        return;
    }


    list.push(
        stock.symbol
    );


    saveWatchlist(list);

    renderWatchlist();
}


/* =========================================================
   REMOVE WATCHLIST
   ========================================================= */

function removeFromWatchlist(symbol) {

    const list =
        getWatchlist().filter(
            item =>
                item !==
                String(symbol)
                    .toUpperCase()
        );


    saveWatchlist(list);

    renderWatchlist();
}


/* =========================================================
   PORTFOLIO VALUE
   ========================================================= */

function calculatePortfolioValue() {

    const portfolio =
        getPortfolio();


    let total =
        Number(portfolio.cash) || 0;


    Object.entries(
        portfolio.holdings
    ).forEach(
        ([symbol, holding]) => {

            const stock =
                findStock(symbol);

            if (!stock) return;


            total +=
                Number(holding.quantity || 0) *
                Number(stock.price || 0);
        }
    );


    return total;
}


/* =========================================================
   INVESTED VALUE
   ========================================================= */

function calculatePortfolioInvested() {

    const portfolio =
        getPortfolio();


    let invested = 0;


    Object.values(
        portfolio.holdings
    ).forEach(holding => {

        invested +=
            Number(
                holding.quantity || 0
            ) *
            Number(
                holding.averagePrice || 0
            );
    });


    return invested;
}


/* =========================================================
   RENDER PORTFOLIO
   ========================================================= */

function renderPortfolio() {

    const portfolio =
        getPortfolio();


    const total =
        calculatePortfolioValue();


    const invested =
        calculatePortfolioInvested();


    const pnl =
        total -
        STARTING_BALANCE;


    const pnlPercent =
        (
            pnl /
            STARTING_BALANCE
        ) *
        100;


    /* HERO */

    const hero =
        document.getElementById(
            "heroPortfolioValue"
        );


    if (hero) {

        hero.textContent =
            money(total);
    }


    /* TOTAL */

    const totalElement =
        document.querySelector(
            ".portfolio-total-value"
        );


    if (totalElement) {

        totalElement.textContent =
            money(total);
    }


    /* CASH */

    const cashElement =
        document.querySelector(
            ".portfolio-cash"
        );


    if (cashElement) {

        cashElement.textContent =
            money(portfolio.cash);
    }


    /* INVESTED */

    const investedElement =
        document.querySelector(
            ".portfolio-invested"
        );


    if (investedElement) {

        investedElement.textContent =
            money(invested);
    }


    /* P&L */

    const pnlElement =
        document.querySelector(
            ".portfolio-pnl"
        );


    if (pnlElement) {

        pnlElement.textContent =
            `${pnl >= 0 ? "+" : ""}${money(pnl)}`;


        pnlElement.classList.toggle(
            "positive",
            pnl >= 0
        );


        pnlElement.classList.toggle(
            "negative",
            pnl < 0
        );
    }


    /* RETURN */

    const returnElement =
        document.querySelector(
            ".portfolio-return"
        );


    if (returnElement) {

        returnElement.textContent =
            `${pnlPercent >= 0 ? "+" : ""}${pnlPercent.toFixed(2)}%`;


        returnElement.classList.toggle(
            "positive",
            pnlPercent >= 0
        );


        returnElement.classList.toggle(
            "negative",
            pnlPercent < 0
        );
    }


    renderHoldings();
}


/* =========================================================
   HOLDINGS
   ========================================================= */

function renderHoldings() {

    const container =
        document.querySelector(
            ".portfolio-holdings"
        );


    if (!container) return;


    let list =
        container.querySelector(
            ".ideon-holdings"
        );


    if (!list) {

        list =
            document.createElement("div");

        list.className =
            "ideon-holdings";

        container.appendChild(list);
    }


    const portfolio =
        getPortfolio();


    const holdings =
        Object.entries(
            portfolio.holdings
        ).filter(
            ([, holding]) =>
                Number(
                    holding.quantity
                ) > 0
        );


    if (!holdings.length) {

        list.innerHTML = `
            <div class="portfolio-empty">
                You don't own any stocks yet.
            </div>
        `;

        return;
    }


    list.innerHTML = "";


    holdings.forEach(
        ([symbol, holding]) => {

            const stock =
                findStock(symbol);

            if (!stock) return;


            const quantity =
                Number(
                    holding.quantity
                ) || 0;


            const averagePrice =
                Number(
                    holding.averagePrice
                ) || 0;


            const currentPrice =
                Number(
                    stock.price
                ) || 0;


            const value =
                quantity *
                currentPrice;


            const pnl =
                quantity *
                (
                    currentPrice -
                    averagePrice
                );


            const item =
                document.createElement("div");

            item.className =
                "ideon-holding";


            item.innerHTML = `
                <div>
                    <strong>
                        ${escapeHTML(stock.symbol)}
                    </strong>

                    <small>
                        ${quantity} shares
                    </small>
                </div>

                <div>
                    <strong>
                        ${money(value)}
                    </strong>

                    <small class="${
                        pnl >= 0
                            ? "positive"
                            : "negative"
                    }">
                        ${pnl >= 0 ? "+" : ""}
                        ${money(pnl)}
                    </small>
                </div>
            `;


            item.addEventListener(
                "click",
                () => {

                    selectStock(stock);
                }
            );


            list.appendChild(item);
        }
    );
}


/* =========================================================
   TRADE PANEL
   ========================================================= */

function updateTradePanel() {

    if (!selectedStock) return;


    const price =
        document.querySelector(
            ".trade-current-price"
        );


    const change =
        document.querySelector(
            ".trade-current-change"
        );


    if (price) {

        price.textContent =
            money(selectedStock.price);
    }


    if (change) {

        const percent =
            Number(
                selectedStock.change
            ) || 0;


        change.textContent =
            `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`;


        change.classList.toggle(
            "positive",
            percent >= 0
        );


        change.classList.toggle(
            "negative",
            percent < 0
        );
    }


    updateOrderEstimate();
}


/* =========================================================
   TRADE CONTROLS
   ========================================================= */

function setupTradeControls() {

    const buySide =
        document.getElementById(
            "buySideBtn"
        );


    const sellSide =
        document.getElementById(
            "sellSideBtn"
        );


    const marketOrder =
        document.getElementById(
            "marketOrderBtn"
        );


    const limitOrder =
        document.getElementById(
            "limitOrderBtn"
        );


    buySide?.addEventListener(
        "click",
        () => {

            tradeSide = "BUY";

            buySide.classList.add(
                "active"
            );

            sellSide?.classList.remove(
                "active"
            );

            updateOrderEstimate();
        }
    );


    sellSide?.addEventListener(
        "click",
        () => {

            tradeSide = "SELL";

            sellSide.classList.add(
                "active"
            );

            buySide?.classList.remove(
                "active"
            );

            updateOrderEstimate();
        }
    );


    marketOrder?.addEventListener(
        "click",
        () => {

            orderType = "MARKET";

            marketOrder.classList.add(
                "active"
            );

            limitOrder?.classList.remove(
                "active"
            );

            toggleLimitPrice();

            updateOrderEstimate();
        }
    );


    limitOrder?.addEventListener(
        "click",
        () => {

            orderType = "LIMIT";

            limitOrder.classList.add(
                "active"
            );

            marketOrder?.classList.remove(
                "active"
            );

            toggleLimitPrice();

            updateOrderEstimate();
        }
    );


    document
        .getElementById("tradeQuantity")
        ?.addEventListener(
            "input",
            updateOrderEstimate
        );


    document
        .getElementById("limitPrice")
        ?.addEventListener(
            "input",
            updateOrderEstimate
        );


    document
        .getElementById("buyStockBtn")
        ?.addEventListener(
            "click",
            () => executeTrade("BUY")
        );


    document
        .getElementById("sellStockBtn")
        ?.addEventListener(
            "click",
            () => executeTrade("SELL")
        );


    toggleLimitPrice();

    updateOrderEstimate();
}


/* =========================================================
   LIMIT PRICE
   ========================================================= */

function toggleLimitPrice() {

    const group =
        document.getElementById(
            "limitPriceGroup"
        );


    if (!group) return;


    group.style.display =
        orderType === "LIMIT"
            ? ""
            : "none";
}


/* =========================================================
   ORDER ESTIMATE
   ========================================================= */

function updateOrderEstimate() {

    if (!selectedStock) return;


    const quantity =
        Number(
            document.getElementById(
                "tradeQuantity"
            )?.value || 0
        );


    let price =
        Number(
            selectedStock.price
        );


    if (
        orderType === "LIMIT"
    ) {

        const limit =
            Number(
                document.getElementById(
                    "limitPrice"
                )?.value
            );


        if (
            Number.isFinite(limit) &&
            limit > 0
        ) {

            price =
                limit;
        }
    }


    const total =
        Math.max(
            0,
            quantity
        ) *
        price;


    const estimate =
        document.getElementById(
            "estimatedOrderValue"
        );


    if (estimate) {

        estimate.textContent =
            money(total);
    }


    const cash =
        document.getElementById(
            "availableOrderCash"
        );


    if (cash) {

        cash.textContent =
            money(
                getPortfolio().cash
            );
    }
}


/* =========================================================
   EXECUTE TRADE
   ========================================================= */

function executeTrade(side) {

    if (!selectedStock) {

        showTradeMessage(
            "Select a stock first.",
            "error"
        );

        return;
    }


    const quantity =
        Number(
            document.getElementById(
                "tradeQuantity"
            )?.value || 0
        );


    if (
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {

        showTradeMessage(
            "Enter a valid quantity.",
            "error"
        );

        return;
    }


    let price =
        Number(
            selectedStock.price
        );


    if (
        orderType === "LIMIT"
    ) {

        const limitPrice =
            Number(
                document.getElementById(
                    "limitPrice"
                )?.value
            );


        if (
            !Number.isFinite(limitPrice) ||
            limitPrice <= 0
        ) {

            showTradeMessage(
                "Enter a valid limit price.",
                "error"
            );

            return;
        }


        price =
            limitPrice;
    }


    const total =
        quantity *
        price;


    const portfolio =
        getPortfolio();


    const symbol =
        selectedStock.symbol;


    /* BUY */

    if (side === "BUY") {

        if (
            total >
            portfolio.cash
        ) {

            showTradeMessage(
                "Not enough virtual cash for this order.",
                "error"
            );

            return;
        }


        const existing =
            portfolio.holdings[symbol] || {
                quantity: 0,
                averagePrice: 0
            };


        const oldQuantity =
            Number(
                existing.quantity
            ) || 0;


        const oldAverage =
            Number(
                existing.averagePrice
            ) || 0;


        const newQuantity =
            oldQuantity +
            quantity;


        const newAverage =
            (
                oldQuantity *
                oldAverage +
                quantity *
                price
            ) /
            newQuantity;


        portfolio.holdings[symbol] = {

            quantity:
                newQuantity,

            averagePrice:
                newAverage
        };


        portfolio.cash -=
            total;


        savePortfolio(
            portfolio
        );


        showTradeMessage(
            `Bought ${quantity} ${symbol} shares for ${money(total)}.`,
            "success"
        );
    }


    /* SELL */

    else {

        const holding =
            portfolio.holdings[symbol];


        if (
            !holding ||
            Number(
                holding.quantity
            ) < quantity
        ) {

            showTradeMessage(
                `You don't own enough ${symbol} shares.`,
                "error"
            );

            return;
        }


        holding.quantity =
            Number(
                holding.quantity
            ) -
            quantity;


        portfolio.cash +=
            total;


        if (
            holding.quantity <= 0
        ) {

            delete portfolio
                .holdings[symbol];
        }


        savePortfolio(
            portfolio
        );


        showTradeMessage(
            `Sold ${quantity} ${symbol} shares for ${money(total)}.`,
            "success"
        );
    }


    renderPortfolio();

    updateTradePanel();

    updateOrderEstimate();
}


/* =========================================================
   SEARCH SETUP
   ========================================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "stockSearch"
        );


    const button =
        document.getElementById(
            "searchStockBtn"
        );


    button?.addEventListener(
        "click",
        () => {

            searchStocks(
                input?.value
            );
        }
    );


    input?.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                searchStocks(
                    input.value
                );
            }
        }
    );


    input?.addEventListener(
        "input",
        removeSearchResults
    );
}


/* =========================================================
   GENERAL UI
   ========================================================= */

function setupGeneralUI() {

    document.addEventListener(
        "click",
        event => {

            const results =
                document.getElementById(
                    "marketSearchResults"
                );


            const input =
                document.getElementById(
                    "stockSearch"
                );


            if (
                results &&
                input &&
                !event.target.closest(
                    "#marketSearchResults"
                ) &&
                !event.target.closest(
                    "#stockSearch"
                )
            ) {

                results.remove();
            }
        }
    );
}


/* =========================================================
   RESIZE
   ========================================================= */

function setupResize() {

    let timer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(timer);


            timer =
                setTimeout(
                    () => {

                        if (
                            liveChartCandles.length
                        ) {

                            drawCandlestickChart();
                        }

                    },
                    150
                );
        }
    );
}


/* =========================================================
   RESET FUNCTIONS
   ========================================================= */

window.IDEONMarket = {

    resetPortfolio() {

        localStorage.removeItem(
            PORTFOLIO_KEY
        );


        renderPortfolio();

        updateTradePanel();

        updateOrderEstimate();


        showTradeMessage(
            "Virtual portfolio reset to ₹1,00,000.",
            "success"
        );
    },


    resetWatchlist() {

        localStorage.removeItem(
            WATCHLIST_KEY
        );


        renderWatchlist();


        showSearchMessage(
            "Watchlist reset.",
            "success"
        );
    },


    getPortfolio,

    getWatchlist,

    addToWatchlist,

    removeFromWatchlist,

    selectStock
};


/* =========================================================
   INITIALIZE
   ========================================================= */

function initMarketLab() {

    console.log(
        "IDEON Market Lab started."
    );


    setupSearch();

    setupRangeButtons();

    setupTradeControls();

    setupGeneralUI();

    setupResize();


    /* Default range */

    document
        .querySelectorAll(
            ".chart-range button"
        )
        .forEach(button => {

            const range =
                button.dataset.range ||
                button.textContent.trim();


            button.classList.toggle(
                "active",
                range === selectedRange
            );
        });


    /* Initial UI */

    renderWatchlist();

    renderPortfolio();

    renderSelectedStock();


    /* Generate sample chart */

    generateSampleCandles();

    drawCandlestickChart();


    console.log(
        "IDEON Market Lab ready."
    );
}


/* =========================================================
   START
   ========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initMarketLab
    );

} else {

    initMarketLab();
}