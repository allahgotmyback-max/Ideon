/* =========================================================
   IDEON MARKET LAB
   DEMO / VIRTUAL STOCK MARKET
   ========================================================= */

(() => {

    /* =====================================================
       SETTINGS
       ===================================================== */

    const STARTING_BALANCE = 100000;

    const PORTFOLIO_KEY = "ideonMarketPortfolio";
    const WATCHLIST_KEY = "ideonMarketWatchlist";


    /* =====================================================
       STOCK DATABASE
       Real companies
       Prices are DEMO values
       ===================================================== */

    const stocks = {

        /* ================= INDIA ================= */

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

        ADANIENT: {
            symbol: "ADANIENT",
            name: "Adani Enterprises",
            exchange: "NSE",
            price: 2475.20,
            change: 1.47
        },

        LT: {
            symbol: "LT",
            name: "Larsen & Toubro",
            exchange: "NSE",
            price: 3650.40,
            change: 0.58
        },

        AXISBANK: {
            symbol: "AXISBANK",
            name: "Axis Bank",
            exchange: "NSE",
            price: 1128.30,
            change: -0.41
        },

        KOTAKBANK: {
            symbol: "KOTAKBANK",
            name: "Kotak Mahindra Bank",
            exchange: "NSE",
            price: 1975.80,
            change: 0.36
        },

        SUNPHARMA: {
            symbol: "SUNPHARMA",
            name: "Sun Pharmaceutical",
            exchange: "NSE",
            price: 1718.60,
            change: 1.02
        },


        /* ================= USA ================= */

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
            name: "Amazon.com Inc.",
            exchange: "NASDAQ",
            price: 229.40,
            change: -0.44
        },

        GOOGL: {
            symbol: "GOOGL",
            name: "Alphabet Inc.",
            exchange: "NASDAQ",
            price: 291.20,
            change: 0.84
        },

        META: {
            symbol: "META",
            name: "Meta Platforms Inc.",
            exchange: "NASDAQ",
            price: 742.30,
            change: -0.31
        },

        NFLX: {
            symbol: "NFLX",
            name: "Netflix Inc.",
            exchange: "NASDAQ",
            price: 1185.60,
            change: 1.08
        },

        NVDA: {
            symbol: "NVDA",
            name: "NVIDIA Corporation",
            exchange: "NASDAQ",
            price: 176.40,
            change: 2.14
        },

        KO: {
            symbol: "KO",
            name: "Coca-Cola Company",
            exchange: "NYSE",
            price: 69.80,
            change: 0.42
        },

        JPM: {
            symbol: "JPM",
            name: "JPMorgan Chase & Co.",
            exchange: "NYSE",
            price: 294.10,
            change: -0.27
        },

        DIS: {
            symbol: "DIS",
            name: "Walt Disney Company",
            exchange: "NYSE",
            price: 113.20,
            change: 0.63
        },

        MCD: {
            symbol: "MCD",
            name: "McDonald's Corporation",
            exchange: "NYSE",
            price: 312.50,
            change: -0.22
        },

        NIKE: {
            symbol: "NKE",
            name: "Nike Inc.",
            exchange: "NYSE",
            price: 68.40,
            change: 1.17
        }

    };


    /* =====================================================
       DEFAULT WATCHLIST
       ===================================================== */

    const DEFAULT_WATCHLIST = [
        "RELIANCE",
        "TCS",
        "INFY",
        "HDFCBANK",
        "ICICIBANK",
        "ITC"
    ];


    /* =====================================================
       STATE
       ===================================================== */

    let selectedStock = stocks.RELIANCE;

    let selectedRange = "1D";

    let chartCandles = [];

    let chartZoom = 1;

    let chartOffset = 0;

    let tradeSide = "BUY";

    let orderType = "MARKET";


    /* =====================================================
       MONEY FORMAT
       ===================================================== */

    function money(value) {

        const number = Number(value) || 0;

        return "₹" + number.toLocaleString("en-IN", {

            minimumFractionDigits: 2,

            maximumFractionDigits: 2

        });

    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        return String(value)

            .replaceAll("&", "&amp;")

            .replaceAll("<", "&lt;")

            .replaceAll(">", "&gt;")

            .replaceAll('"', "&quot;")

            .replaceAll("'", "&#039;");
    }


    /* =====================================================
       SEARCH MESSAGE
       ===================================================== */

    function showSearchMessage(message, type = "info") {

        const box =
            document.getElementById(
                "marketSearchMessage"
            );

        if (!box) return;

        box.textContent = message;

        box.className =
            `market-search-message ${type}`;
    }


    /* =====================================================
       TRADE MESSAGE
       ===================================================== */

    function showTradeMessage(message, type = "info") {

        let box =
            document.getElementById(
                "tradeMessage"
            );

        const terminal =
            document.querySelector(
                ".order-terminal"
            );

        if (!terminal) return;

        if (!box) {

            box =
                document.createElement(
                    "div"
                );

            box.id = "tradeMessage";

            terminal.appendChild(box);
        }

        box.textContent = message;

        box.className =
            `trade-message ${type}`;
    }


    /* =====================================================
       PORTFOLIO
       ===================================================== */

    function getPortfolio() {

        try {

            const saved =
                localStorage.getItem(
                    PORTFOLIO_KEY
                );

            if (!saved) {

                return {

                    cash: STARTING_BALANCE,

                    holdings: {}

                };
            }

            const parsed =
                JSON.parse(saved);

            if (
                typeof parsed !== "object" ||
                !parsed
            ) {

                throw new Error(
                    "Invalid portfolio"
                );
            }

            return {

                cash:
                    Number.isFinite(
                        Number(parsed.cash)
                    )
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


    /* =====================================================
       WATCHLIST
       ===================================================== */

    function getWatchlist() {

        try {

            const saved =
                localStorage.getItem(
                    WATCHLIST_KEY
                );

            if (!saved) {

                return [
                    ...DEFAULT_WATCHLIST
                ];
            }

            const parsed =
                JSON.parse(saved);

            if (!Array.isArray(parsed)) {

                return [
                    ...DEFAULT_WATCHLIST
                ];
            }

            return parsed.filter(
                symbol => stocks[symbol]
            );

        } catch {

            return [
                ...DEFAULT_WATCHLIST
            ];
        }
    }


    function saveWatchlist(list) {

        localStorage.setItem(

            WATCHLIST_KEY,

            JSON.stringify(list)

        );
    }


    function addToWatchlist(symbol) {

        const list =
            getWatchlist();

        if (!list.includes(symbol)) {

            list.push(symbol);

            saveWatchlist(list);
        }

        renderWatchlist();
    }


    /* =====================================================
       SEARCH STOCKS
       ===================================================== */

    function searchStocks(query) {

        query =
            String(query || "")
                .trim()
                .toLowerCase();

        removeSearchResults();

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
                            .includes(query)

                        ||

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

            return;
        }


        renderSearchResults(
            results
        );


        showSearchMessage(

            `${results.length} matching stock${

                results.length === 1
                    ? ""
                    : "s"

            } found.`,

            "success"

        );
    }


    /* =====================================================
       SEARCH RESULTS
       ===================================================== */

    function renderSearchResults(results) {

        removeSearchResults();

        const input =
            document.getElementById(
                "stockSearch"
            );

        if (!input) return;

        const container =
            input.parentElement?.parentElement;

        if (!container) return;


        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.id =
            "marketSearchResults";

        wrapper.className =
            "market-search-results";


        results
            .slice(0, 10)
            .forEach(stock => {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type = "button";

                button.className =
                    "market-search-result";


                button.innerHTML = `

                    <span>

                        <strong>
                            ${escapeHTML(
                                stock.symbol
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                stock.name
                            )}
                        </small>

                    </span>

                    <span>
                        ${money(
                            stock.price
                        )}
                    </span>

                `;


                button.addEventListener(
                    "click",
                    () => {

                        selectStock(
                            stock
                        );

                        addToWatchlist(
                            stock.symbol
                        );

                        removeSearchResults();


                        showSearchMessage(

                            `${stock.symbol} selected · DEMO DATA`,

                            "success"

                        );

                    }
                );


                wrapper.appendChild(
                    button
                );

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


    /* =====================================================
       SELECT STOCK
       ===================================================== */

    function selectStock(stock) {

        selectedStock = stock;

        chartZoom = 1;

        chartOffset = 0;

        renderSelectedStock();

        generateSampleCandles();

        drawCandlestickChart();

    }


    /* =====================================================
       RENDER SELECTED STOCK
       ===================================================== */

    function renderSelectedStock() {

        if (!selectedStock) return;


        const symbol =
            document.querySelector(
                ".stock-symbol"
            );

        const name =
            document.querySelector(
                ".stock-name"
            );

        const price =
            document.querySelector(
                ".stock-price"
            );

        const change =
            document.querySelector(
                ".stock-change"
            );

        const exchange =
            document.querySelector(
                ".market-badge"
            );


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

            const strong =
                price.querySelector(
                    "strong"
                );

            if (strong) {

                strong.textContent =
                    money(
                        selectedStock.price
                    );

            } else {

                price.textContent =
                    money(
                        selectedStock.price
                    );
            }
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


        updateTradePanel();

        renderPortfolio();

        renderWatchlist();

    }


    /* =====================================================
       SAMPLE CANDLE GENERATOR
       ===================================================== */

    function generateSampleCandles() {

        const settings = {

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


        const config =
            settings[selectedRange]
            || settings["1D"];


        const candles = [];


        let price =

            selectedStock.price *

            (
                1 -
                selectedStock.change / 100
            );


        for (
            let i = 0;
            i < config.count;
            i++
        ) {

            const trend =

                selectedStock.change >= 0

                    ? 0.0007

                    : -0.0004;


            const randomMove =

                (
                    Math.random() - 0.5
                )

                *

                config.volatility;


            const movement =

                trend +
                randomMove;


            const open =
                price;


            const close =

                Math.max(

                    0.01,

                    open *

                    (
                        1 +
                        movement
                    )

                );


            const high =

                Math.max(
                    open,
                    close
                )

                *

                (
                    1 +

                    Math.random()
                    *
                    config.volatility
                    *
                    0.55
                );


            const low =

                Math.min(
                    open,
                    close
                )

                *

                (
                    1 -

                    Math.random()
                    *
                    config.volatility
                    *
                    0.55
                );


            candles.push({

                open,

                high,

                low,

                close

            });


            price = close;
        }


        /* Make final candle end at demo price */

        if (candles.length) {

            const last =
                candles[
                    candles.length - 1
                ];


            last.close =
                selectedStock.price;


            last.high =
                Math.max(

                    last.high,

                    last.open,

                    last.close

                );


            last.low =
                Math.min(

                    last.low,

                    last.open,

                    last.close

                );
        }


        chartCandles =
            candles;
    }


    /* =====================================================
       DRAW CANDLESTICK CHART
       ===================================================== */

    function drawCandlestickChart() {

        const svg =
            document.getElementById(
                "stockChart"
            );


        if (!svg) return;


        const grid =
            document.getElementById(
                "chartGrid"
            );


        const layer =
            document.getElementById(
                "ideonCandleLayer"
            );


        if (!grid || !layer) return;


        const width =
            svg.clientWidth || 800;


        const height =
            svg.clientHeight || 300;


        svg.setAttribute(

            "viewBox",

            `0 0 ${width} ${height}`

        );


        /*
         IMPORTANT:

         Do NOT use:

         svg.innerHTML = "";

         because that deletes
         chartGrid and candleLayer.

         Only clear their contents.
        */

        grid.innerHTML = "";

        layer.innerHTML = "";


        if (!chartCandles.length) return;


        const total =
            chartCandles.length;


        const visibleCount =

            Math.max(

                12,

                Math.min(

                    total,

                    Math.floor(
                        total / chartZoom
                    )

                )

            );


        const maxOffset =

            Math.max(

                0,

                total -
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


        const start =

            Math.max(

                0,

                total -
                visibleCount -
                chartOffset

            );


        const visibleCandles =

            chartCandles.slice(

                start,

                start +
                visibleCount

            );


        const minPrice =

            Math.min(

                ...visibleCandles.map(
                    candle => candle.low
                )

            );


        const maxPrice =

            Math.max(

                ...visibleCandles.map(
                    candle => candle.high
                )

            );


        const padding =

            (
                maxPrice -
                minPrice
            ) *

            0.10;


        const low =
            minPrice - padding;


        const high =
            maxPrice + padding;


        function y(price) {

            return (

                height -

                (

                    (
                        price -
                        low
                    )

                    /

                    (
                        high -
                        low
                    )

                )

                *

                height

            );

        }


        /* =================================================
           GRID
           ================================================= */

        for (
            let i = 1;
            i < 5;
            i++
        ) {

            const yy =
                (
                    height / 5
                ) *
                i;


            const line =
                document.createElementNS(

                    "http://www.w3.org/2000/svg",

                    "line"

                );


            line.setAttribute(
                "x1",
                "0"
            );

            line.setAttribute(
                "x2",
                String(width)
            );

            line.setAttribute(
                "y1",
                String(yy)
            );

            line.setAttribute(
                "y2",
                String(yy)
            );

            line.setAttribute(
                "class",
                "chart-grid-line"
            );


            grid.appendChild(
                line
            );
        }


        for (
            let i = 1;
            i < 6;
            i++
        ) {

            const xx =
                (
                    width / 6
                ) *
                i;


            const line =
                document.createElementNS(

                    "http://www.w3.org/2000/svg",

                    "line"

                );


            line.setAttribute(
                "x1",
                String(xx)
            );

            line.setAttribute(
                "x2",
                String(xx)
            );

            line.setAttribute(
                "y1",
                "0"
            );

            line.setAttribute(
                "y2",
                String(height)
            );

            line.setAttribute(
                "class",
                "chart-grid-line"
            );


            grid.appendChild(
                line
            );
        }


        /* =================================================
           CANDLESTICKS
           ================================================= */

        const step =
            width /
            visibleCandles.length;


        const bodyWidth =
            Math.max(
                3,
                step * 0.58
            );


        visibleCandles.forEach(
            (candle, index) => {

                const x =

                    index *
                    step

                    +

                    step / 2;


                const isUp =

                    candle.close >=
                    candle.open;


                const candleColor =

                    isUp

                        ? "#35d07f"

                        : "#ff5f6d";


                /* WICK */

                const wick =

                    document.createElementNS(

                        "http://www.w3.org/2000/svg",

                        "line"

                    );


                wick.setAttribute(
                    "x1",
                    String(x)
                );

                wick.setAttribute(
                    "x2",
                    String(x)
                );

                wick.setAttribute(
                    "y1",
                    String(
                        y(candle.high)
                    )
                );

                wick.setAttribute(
                    "y2",
                    String(
                        y(candle.low)
                    )
                );

                wick.setAttribute(
                    "stroke",
                    candleColor
                );

                wick.setAttribute(
                    "stroke-width",
                    "1.5"
                );

                wick.setAttribute(
                    "class",
                    isUp
                        ? "candle-up"
                        : "candle-down"
                );


                layer.appendChild(
                    wick
                );


                /* BODY */

                const rect =

                    document.createElementNS(

                        "http://www.w3.org/2000/svg",

                        "rect"

                    );


                const openY =
                    y(candle.open);


                const closeY =
                    y(candle.close);


                const top =
                    Math.min(
                        openY,
                        closeY
                    );


                const bottom =
                    Math.max(
                        openY,
                        closeY
                    );


                rect.setAttribute(
                    "x",
                    String(
                        x -
                        bodyWidth / 2
                    )
                );


                rect.setAttribute(
                    "y",
                    String(top)
                );


                rect.setAttribute(
                    "width",
                    String(bodyWidth)
                );


                rect.setAttribute(

                    "height",

                    String(

                        Math.max(

                            3,

                            bottom -
                            top

                        )

                    )

                );


                rect.setAttribute(
                    "rx",
                    "1"
                );


                rect.setAttribute(
                    "fill",
                    candleColor
                );


                rect.setAttribute(
                    "class",
                    isUp
                        ? "candle-up"
                        : "candle-down"
                );


                layer.appendChild(
                    rect
                );

            }

        );

    }


    /* =====================================================
       WATCHLIST
       ===================================================== */

    function renderWatchlist() {

        const container =
            document.getElementById(
                "watchlistItems"
            );


        if (!container) return;


        const list =
            getWatchlist();


        container.innerHTML = "";


        const count =
            document.getElementById(
                "watchlistCount"
            );


        if (count) {

            count.textContent =
                list.length;
        }


        list.forEach(
            symbol => {

                const stock =
                    stocks[symbol];


                if (!stock) return;


                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =

                    "ideon-watch-item";


                if (
                    selectedStock.symbol ===
                    symbol
                ) {

                    button.classList.add(
                        "active"
                    );
                }


                button.innerHTML = `

                    <div>

                        <strong>
                            ${escapeHTML(
                                stock.symbol
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                stock.name
                            )}
                        </small>

                    </div>

                    <div class="ideon-watch-price">

                        <strong>
                            ${money(
                                stock.price
                            )}
                        </strong>

                        <small class="${
                            stock.change >= 0
                                ? "positive"
                                : "negative"
                        }">

                            ${
                                stock.change >= 0
                                    ? "+"
                                    : ""
                            }

                            ${stock.change.toFixed(2)}%

                        </small>

                    </div>

                `;


                button.addEventListener(
                    "click",
                    () => {

                        selectStock(
                            stock
                        );

                    }
                );


                container.appendChild(
                    button
                );

            }
        );

    }


    /* =====================================================
       PORTFOLIO RENDER
       ===================================================== */

    function renderPortfolio() {

        const portfolio =
            getPortfolio();


        let invested = 0;

        let marketValue = 0;


        Object.entries(
            portfolio.holdings
        ).forEach(
            ([symbol, holding]) => {

                const stock =
                    stocks[symbol];


                if (!stock) return;


                const quantity =
                    Number(
                        holding.quantity
                    ) || 0;


                const averagePrice =
                    Number(
                        holding.avgPrice
                    ) || stock.price;


                invested +=

                    quantity *
                    averagePrice;


                marketValue +=

                    quantity *
                    stock.price;

            }
        );


        const totalValue =

            portfolio.cash +
            marketValue;


        const totalReturn =

            totalValue -
            STARTING_BALANCE;


        const returnPercent =

            (
                totalReturn /
                STARTING_BALANCE
            ) *

            100;


        /* TOTAL VALUE */

        const totalElement =
            document.querySelector(
                ".portfolio-total-value"
            );


        if (totalElement) {

            totalElement.textContent =
                money(totalValue);
        }


        /* RETURN */

        const returnElement =
            document.querySelector(
                ".portfolio-return"
            );


        if (returnElement) {

            returnElement.textContent =

                `${totalReturn >= 0 ? "+" : ""}${money(
                    totalReturn
                )}`;
        }


        /* STATS */

        const stats =
            document.querySelectorAll(
                ".portfolio-stat strong"
            );


        if (stats[0]) {

            stats[0].textContent =
                money(
                    portfolio.cash
                );
        }


        if (stats[1]) {

            stats[1].textContent =
                money(
                    invested
                );
        }


        if (stats[2]) {

            stats[2].textContent =

                `${returnPercent >= 0 ? "+" : ""}${returnPercent.toFixed(2)}%`;
        }


        /* HERO BALANCE */

        const hero =
            document.getElementById(
                "heroPortfolioValue"
            );


        if (hero) {

            hero.textContent =
                money(totalValue);
        }


        /* HOLDINGS */

        const holdingsSection =
            document.querySelector(
                ".portfolio-holdings"
            );


        if (!holdingsSection) return;


        let holdingsContainer =
            holdingsSection.querySelector(
                ".ideon-holdings"
            );


        if (!holdingsContainer) {

            holdingsContainer =
                document.createElement(
                    "div"
                );

            holdingsContainer.className =
                "ideon-holdings";

            holdingsSection.appendChild(
                holdingsContainer
            );
        }


        holdingsContainer.innerHTML = "";


        let hasHoldings = false;


        Object.entries(
            portfolio.holdings
        ).forEach(
            ([symbol, holding]) => {

                const stock =
                    stocks[symbol];


                if (!stock) return;


                const quantity =
                    Number(
                        holding.quantity
                    ) || 0;


                if (quantity <= 0) return;


                hasHoldings = true;


                const averagePrice =
                    Number(
                        holding.avgPrice
                    ) || stock.price;


                const currentValue =
                    quantity *
                    stock.price;


                const pnl =

                    (
                        stock.price -
                        averagePrice
                    )

                    *

                    quantity;


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "ideon-holding";


                row.innerHTML = `

                    <div>

                        <strong>
                            ${escapeHTML(
                                symbol
                            )}
                        </strong>

                        <small>
                            ${quantity} shares
                            · Avg ${money(
                                averagePrice
                            )}
                        </small>

                    </div>

                    <div>

                        <strong>
                            ${money(
                                currentValue
                            )}
                        </strong>

                        <small class="${
                            pnl >= 0
                                ? "positive"
                                : "negative"
                        }">

                            ${
                                pnl >= 0
                                    ? "+"
                                    : "-"
                            }

                            ${money(
                                Math.abs(pnl)
                            )}

                        </small>

                    </div>

                `;


                holdingsContainer.appendChild(
                    row
                );

            }
        );


        const empty =
            holdingsSection.querySelector(
                ".portfolio-empty"
            );


        if (empty) {

            empty.style.display =
                hasHoldings
                    ? "none"
                    : "block";
        }

    }


    /* =====================================================
       TRADE PANEL
       ===================================================== */

    function updateTradePanel() {

        const stock =
            selectedStock;


        const info =
            document.querySelector(
                ".trade-info"
            );


        if (!info) return;


        const name =
            info.querySelector(
                "strong"
            );


        const code =
            info.querySelector(
                "small"
            );


        const price =
            document.querySelector(
                ".trade-current-price"
            );


        const change =
            document.querySelector(
                ".trade-current-change"
            );


        if (name) {

            name.textContent =
                stock.name;
        }


        if (code) {

            code.textContent =

                `${stock.symbol}.${stock.exchange} · Virtual trading only`;
        }


        if (price) {

            price.textContent =
                money(stock.price);
        }


        if (change) {

            change.textContent =

                `${stock.change >= 0 ? "+" : ""}${stock.change.toFixed(2)}%`;


            change.classList.toggle(
                "positive",
                stock.change >= 0
            );


            change.classList.toggle(
                "negative",
                stock.change < 0
            );
        }


        const limitPrice =
            document.getElementById(
                "limitPrice"
            );


        if (
            limitPrice &&
            document.activeElement !==
            limitPrice
        ) {

            limitPrice.value =
                stock.price.toFixed(2);
        }


        updateOrderPreview();

    }


    /* =====================================================
       ORDER PREVIEW
       ===================================================== */

    function updateOrderPreview() {

        const quantity =
            Math.max(

                0,

                Number(

                    document.getElementById(
                        "tradeQuantity"
                    )?.value

                ) || 0

            );


        const limit =
            Number(

                document.getElementById(
                    "limitPrice"
                )?.value

            ) || selectedStock.price;


        const unitPrice =

            orderType === "LIMIT"

                ? limit

                : selectedStock.price;


        const orderValue =

            quantity *
            unitPrice;


        const portfolio =
            getPortfolio();


        const estimated =
            document.getElementById(
                "estimatedOrderValue"
            );


        const cash =
            document.getElementById(
                "availableOrderCash"
            );


        if (estimated) {

            estimated.textContent =
                money(orderValue);
        }


        if (cash) {

            cash.textContent =
                money(
                    portfolio.cash
                );
        }


        const buyButton =
            document.getElementById(
                "buyStockBtn"
            );


        const sellButton =
            document.getElementById(
                "sellStockBtn"
            );


        if (buyButton) {

            buyButton.textContent =

                `BUY ${selectedStock.symbol} →`;
        }


        if (sellButton) {

            sellButton.textContent =

                `SELL ${selectedStock.symbol} →`;
        }

    }


    /* =====================================================
       EXECUTE VIRTUAL TRADE
       ===================================================== */

    function executeTrade(side) {

        const quantity =

            Math.floor(

                Number(

                    document.getElementById(
                        "tradeQuantity"
                    )?.value

                ) || 0

            );


        if (quantity < 1) {

            showTradeMessage(

                "Enter a valid quantity.",

                "error"

            );

            return;
        }


        const limitPrice =

            Number(

                document.getElementById(
                    "limitPrice"
                )?.value

            ) || selectedStock.price;


        const price =

            orderType === "LIMIT"

                ? limitPrice

                : selectedStock.price;


        const portfolio =
            getPortfolio();


        const symbol =
            selectedStock.symbol;


        const existing =
            portfolio.holdings[
                symbol
            ] || {

                quantity: 0,

                avgPrice: 0

            };


        const oldQuantity =
            Number(
                existing.quantity
            ) || 0;


        const oldAverage =
            Number(
                existing.avgPrice
            ) || 0;


        /* ================= BUY ================= */

        if (side === "BUY") {

            const cost =

                quantity *
                price;


            if (
                cost >
                portfolio.cash
            ) {

                showTradeMessage(

                    "Not enough virtual cash for this order.",

                    "error"

                );

                return;
            }


            const newQuantity =

                oldQuantity +
                quantity;


            const newAverage =

                (

                    (
                        oldQuantity *
                        oldAverage
                    )

                    +

                    cost

                )

                /

                newQuantity;


            portfolio.holdings[
                symbol
            ] = {

                quantity:
                    newQuantity,

                avgPrice:
                    newAverage

            };


            portfolio.cash -=
                cost;


            showTradeMessage(

                `Bought ${quantity} ${symbol} for ${money(cost)}.`,

                "success"

            );

        }


        /* ================= SELL ================= */

        else {

            if (
                oldQuantity <
                quantity
            ) {

                showTradeMessage(

                    `You only hold ${oldQuantity} ${symbol}.`,

                    "error"

                );

                return;
            }


            const saleValue =

                quantity *
                price;


            portfolio.cash +=
                saleValue;


            const remaining =

                oldQuantity -
                quantity;


            if (remaining <= 0) {

                delete portfolio.holdings[
                    symbol
                ];

            } else {

                portfolio.holdings[
                    symbol
                ].quantity =
                    remaining;

            }


            showTradeMessage(

                `Sold ${quantity} ${symbol} for ${money(saleValue)}.`,

                "success"

            );

        }


        savePortfolio(
            portfolio
        );


        renderPortfolio();

        updateOrderPreview();

    }


    /* =====================================================
       RESET PORTFOLIO
       ===================================================== */

    function resetPortfolio() {

        savePortfolio({

            cash:
                STARTING_BALANCE,

            holdings: {}

        });


        renderPortfolio();

        updateOrderPreview();


        showTradeMessage(

            "Virtual portfolio reset to ₹1,00,000.",

            "success"

        );

    }


    /* =====================================================
       RESET WATCHLIST
       ===================================================== */

    function resetWatchlist() {

        saveWatchlist(
            [
                ...DEFAULT_WATCHLIST
            ]
        );


        renderWatchlist();

    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    function init() {

        /* ================= SEARCH ================= */

        const searchInput =
            document.getElementById(
                "stockSearch"
            );


        const searchButton =
            document.getElementById(
                "searchStockBtn"
            );


        if (searchButton) {

            searchButton.addEventListener(

                "click",

                () => {

                    searchStocks(
                        searchInput?.value
                    );

                }

            );

        }


        if (searchInput) {

            searchInput.addEventListener(

                "keydown",

                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        searchStocks(
                            searchInput.value
                        );

                    }

                }

            );

        }


        /* ================= CLOSE SEARCH ================= */

        document.addEventListener(

            "click",

            event => {

                if (

                    !event.target.closest(
                        ".market-search-section"
                    )

                    &&

                    !event.target.closest(
                        "#marketSearchResults"
                    )

                ) {

                    removeSearchResults();

                }

            }

        );


        /* ================= WATCHLIST ================= */

        const watchlistToggle =
            document.getElementById(
                "watchlistToggle"
            );


        if (watchlistToggle) {

            watchlistToggle.addEventListener(

                "click",

                () => {

                    const content =
                        document.getElementById(
                            "watchlistContent"
                        );


                    if (!content) return;


                    const isOpen =

                        content.style.display !==
                        "none";


                    content.style.display =

                        isOpen
                            ? "none"
                            : "block";


                    watchlistToggle.setAttribute(

                        "aria-expanded",

                        String(!isOpen)

                    );

                }

            );

        }


        /* ================= RANGE BUTTONS ================= */

        document
            .querySelectorAll(
                ".chart-range button"
            )
            .forEach(

                button => {

                    button.addEventListener(

                        "click",

                        () => {

                            document
                                .querySelectorAll(
                                    ".chart-range button"
                                )
                                .forEach(
                                    b =>
                                        b.classList.remove(
                                            "active"
                                        )
                                );


                            button.classList.add(
                                "active"
                            );


                            selectedRange =
                                button.textContent.trim();


                            chartZoom = 1;

                            chartOffset = 0;


                            generateSampleCandles();

                            drawCandlestickChart();

                        }

                    );

                }

            );


        /* ================= CHART CONTROLS ================= */

        document
            .querySelectorAll(
                "[data-chart-action]"
            )
            .forEach(

                button => {

                    button.addEventListener(

                        "click",

                        () => {

                            const action =
                                button.dataset.chartAction;


                            if (
                                action ===
                                "in"
                            ) {

                                chartZoom =

                                    Math.min(

                                        4,

                                        chartZoom *
                                        1.35

                                    );

                            }


                            if (
                                action ===
                                "out"
                            ) {

                                chartZoom =

                                    Math.max(

                                        1,

                                        chartZoom /
                                        1.35

                                    );

                            }


                            if (
                                action ===
                                "back"
                            ) {

                                chartOffset +=
                                    8;

                            }


                            if (
                                action ===
                                "forward"
                            ) {

                                chartOffset =

                                    Math.max(

                                        0,

                                        chartOffset -
                                        8

                                    );

                            }


                            if (
                                action ===
                                "reset"
                            ) {

                                chartZoom = 1;

                                chartOffset = 0;

                            }


                            drawCandlestickChart();

                        }

                    );

                }

            );


        /* ================= BUY / SELL ================= */

        const buySideButton =
            document.getElementById(
                "buySideBtn"
            );


        const sellSideButton =
            document.getElementById(
                "sellSideBtn"
            );


        if (buySideButton) {

            buySideButton.addEventListener(

                "click",

                () => {

                    tradeSide = "BUY";

                    buySideButton.classList.add(
                        "active"
                    );

                    sellSideButton?.classList.remove(
                        "active"
                    );

                }

            );

        }


        if (sellSideButton) {

            sellSideButton.addEventListener(

                "click",

                () => {

                    tradeSide = "SELL";

                    sellSideButton.classList.add(
                        "active"
                    );

                    buySideButton?.classList.remove(
                        "active"
                    );

                }

            );

        }


        /* ================= ORDER TYPE ================= */

        const marketButton =
            document.getElementById(
                "marketOrderBtn"
            );


        const limitButton =
            document.getElementById(
                "limitOrderBtn"
            );


        const limitGroup =
            document.getElementById(
                "limitPriceGroup"
            );


        if (marketButton) {

            marketButton.addEventListener(

                "click",

                () => {

                    orderType =
                        "MARKET";


                    marketButton.classList.add(
                        "active"
                    );


                    limitButton?.classList.remove(
                        "active"
                    );


                    if (limitGroup) {

                        limitGroup.style.display =
                            "none";

                    }


                    updateOrderPreview();

                }

            );

        }


        if (limitButton) {

            limitButton.addEventListener(

                "click",

                () => {

                    orderType =
                        "LIMIT";


                    limitButton.classList.add(
                        "active"
                    );


                    marketButton?.classList.remove(
                        "active"
                    );


                    if (limitGroup) {

                        limitGroup.style.display =
                            "block";

                    }


                    updateOrderPreview();

                }

            );

        }


        /* ================= ORDER INPUTS ================= */

        document
            .getElementById(
                "tradeQuantity"
            )
            ?.addEventListener(

                "input",

                updateOrderPreview

            );


        document
            .getElementById(
                "limitPrice"
            )
            ?.addEventListener(

                "input",

                updateOrderPreview

            );


        /* ================= TRADE BUTTONS ================= */

        document
            .getElementById(
                "buyStockBtn"
            )
            ?.addEventListener(

                "click",

                () =>
                    executeTrade(
                        "BUY"
                    )

            );


        document
            .getElementById(
                "sellStockBtn"
            )
            ?.addEventListener(

                "click",

                () =>
                    executeTrade(
                        "SELL"
                    )

            );


        /* ================= RESIZE ================= */

        window.addEventListener(

            "resize",

            () => {

                drawCandlestickChart();

            }

        );


        /* ================= FIRST LOAD ================= */

        renderWatchlist();

        renderSelectedStock();

        generateSampleCandles();

        drawCandlestickChart();


        /* ================= DEBUG / RESET ================= */

        window.IDEONMarket = {

            resetPortfolio,

            resetWatchlist,

            getStocks: () =>
                ({ ...stocks })

        };

    }


    /* =====================================================
       START
       ===================================================== */

    document.addEventListener(

        "DOMContentLoaded",

        init

    );

})();
