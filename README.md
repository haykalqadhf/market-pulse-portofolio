# Market Pulse 📈
### Cryptocurrency Market Analytics & Price Forecasting Dashboard

**Market Pulse** is a full-stack web application designed to explore cryptocurrency market data and experiment with time-series-based price forecasting.

The project combines a React frontend with a Python Flask backend, integrating historical cryptocurrency market data from the CoinGecko API and an Auto-ARIMA forecasting model.

> **Project Status: In Development**
>
> Market Pulse is an ongoing personal portfolio project. Its features, forecasting methodology, and overall implementation are still being developed and refined.

---

## Overview

Cryptocurrency markets are highly dynamic and influenced by numerous factors, including market sentiment, trading activity, macroeconomic conditions, regulations, and unexpected events.

Market Pulse explores how historical price data can be processed and used to generate experimental forecasts through statistical time-series modeling.

Rather than presenting predictions as guaranteed future prices, this project aims to demonstrate the practical implementation of data retrieval, backend processing, and forecasting techniques in a financial application.

## Key Features

- **Market Data Integration** — Retrieves historical cryptocurrency price data using the CoinGecko API.
- **Time-Series Forecasting** — Generates experimental price forecasts using an Auto-ARIMA model.
- **Flexible Forecasting Horizons** — Supports configurable prediction periods through API parameters.
- **Automated Model Selection** — Uses `pmdarima.auto_arima` to search for suitable ARIMA parameters.
- **Fallback Data Mechanism** — Generates simulated historical data when the external market data API does not return the expected price data.
- **Frontend–Backend Integration** — Connects the React application with a Python Flask REST API.

## Technology Stack

| Category | Technology |
|---|---|
| Frontend | React, JavaScript |
| Development & Build Tool | Vite |
| Backend | Python, Flask |
| Machine Learning / Forecasting | ARIMA, Auto-ARIMA |
| Data Processing | NumPy, Pandas |
| Forecasting Library | pmdarima |
| Market Data Source | CoinGecko API |
| HTTP Requests | Requests |
| Cross-Origin Communication | Flask-CORS |
| Version Control | Git & GitHub |

## Forecasting Methodology

### Why ARIMA?

Selecting a forecasting model for cryptocurrency prices requires careful consideration.

Cryptocurrency markets are highly volatile and influenced by real-time information. Historical price patterns alone cannot fully represent market behavior, making consistently accurate price forecasting a challenging problem.

For this project, I selected **Autoregressive Integrated Moving Average (ARIMA)** as an initial time-series forecasting approach.

The decision was based on several considerations:

1. **Historical Pattern Analysis**

   ARIMA is designed for sequential time-series data. It analyzes relationships between previous observations and uses historical patterns to estimate future values.

2. **A Practical Baseline Model**

   ARIMA provides a relatively straightforward baseline before experimenting with more complex approaches such as LSTM or other machine learning models. It helps establish whether historical price information contains useful temporal patterns.

3. **Computational Efficiency**

   Compared with many deep learning approaches, ARIMA is relatively lightweight and does not require extensive neural network training infrastructure.

4. **Interpretability**

   Its three main components provide a structured statistical foundation:
   - **AR (Autoregressive):** Uses previous observations.
   - **I (Integrated):** Applies differencing to address non-stationary time-series data.
   - **MA (Moving Average):** Uses previous forecast errors to model the series.

5. **Automated Parameter Selection**

   The project uses `pmdarima.auto_arima` to search for suitable model parameters, reducing the need to manually specify the ARIMA configuration.

### Current Implementation

The forecasting pipeline currently follows these steps:

1. Receive a cryptocurrency identifier and requested forecasting horizon.
2. Retrieve historical price data from CoinGecko.
3. Prepare the historical prices as a sequential time series.
4. Train an Auto-ARIMA model using the historical price observations.
5. Generate future price estimates for the requested number of days.
6. Return the forecast results through a Flask REST API.

The current implementation uses non-seasonal ARIMA and a stepwise parameter search.

### Forecasting Limitations

ARIMA is not intended to predict every factor affecting cryptocurrency markets.

The current implementation has several limitations:

- It primarily relies on historical price observations.
- It does not incorporate news sentiment, trading volume, market liquidity, technical indicators, or macroeconomic variables.
- Sudden market events and structural changes can significantly reduce forecasting reliability.
- A model selected using historical data does not guarantee accurate future predictions.
- Forecasting performance has not yet been established through a comprehensive out-of-sample evaluation.

For these reasons, Market Pulse treats its forecasts as **experimental estimates rather than financial advice or guaranteed investment signals**.

## API Reference

The Flask backend currently exposes the following endpoint:

### Price Forecasting

```http
GET /api/predict/<coin_id>?days=<number>
```

**Parameters**

| Parameter | Description | Example |
|---|---|---|
| `coin_id` | Cryptocurrency identifier used by CoinGecko | `bitcoin` |
| `days` | Number of days to forecast | `7`, `30`, `60` |

**Example Request**

```http
GET /api/predict/bitcoin?days=7
```

**Example Response**

```json
{
  "status": "success",
  "coin": "bitcoin",
  "predict_days": 7,
  "forecast": [
    {
      "date": "Nov 08",
      "predicted_price": 68000.0
    }
  ],
  "is_simulated": false
}
```

*The response above is illustrative. Actual forecast values depend on the retrieved data and model output.*

**Historical Data Configuration**

The backend currently selects its historical data window based on the requested forecast horizon:

| Forecast Horizon | Historical Data |
|---|---|
| Up to 7 days | 60 days |
| 8–30 days | 180 days |
| More than 30 days | 730 days |

If the expected price data is unavailable from CoinGecko, the backend generates simulated data as a fallback. The `is_simulated` response field indicates whether this mechanism was used.

## Project Structure

```text
market-pulse-portofolio/
│
├── ml-backend/
│   └── app.py
│
├── src/
│   └── ...                 # React application source
│
├── public/
│   └── ...                 # Public frontend assets
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```

*The structure above provides a high-level overview. Additional components and files may be added as development progresses.*

## Getting Started

### Prerequisites

Make sure the following tools are installed:

- [Node.js](https://nodejs.org/)
- npm
- [Python 3](https://www.python.org/)

### 1. Clone the Repository

```bash
git clone https://github.com/haykalqadhf/market-pulse-portofolio.git
cd market-pulse-portofolio
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start the Frontend

```bash
npm run dev
```

Open the local development URL provided by Vite, typically:

```text
http://localhost:5173
```

### 4. Set Up the Python Backend

Open another terminal:

```bash
cd ml-backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Activate it on macOS/Linux:

```bash
source venv/bin/activate
```

Install the backend dependencies:

```bash
pip install Flask flask-cors requests numpy pandas pmdarima
```

Start the Flask server:

```bash
python app.py
```

The backend will run on:

```text
http://localhost:5000
```

The forecasting endpoint can then be accessed at:

```text
http://localhost:5000/api/predict/bitcoin?days=7
```

---

## Development Roadmap

Market Pulse is still evolving. The following improvements are planned as part of its ongoing development:

- [ ] Improve forecasting evaluation using MAE, RMSE, and MAPE.
- [ ] Introduce chronological train-test splitting and out-of-sample validation.
- [ ] Compare ARIMA performance against baseline forecasting methods.
- [ ] Explore additional forecasting approaches such as LSTM and XGBoost.
- [ ] Investigate the integration of trading volume and technical indicators.
- [ ] Explore sentiment analysis and other external market information.
- [ ] Improve error handling and API reliability.
- [ ] Refine the user interface and overall dashboard experience.

## Disclaimer

Market Pulse is an experimental portfolio and learning project.

Cryptocurrency price forecasts are inherently uncertain. The displayed estimates are generated from historical data and should not be interpreted as financial advice, investment recommendations, or guarantees of future market performance.

Simulated data may be used when external market data is unavailable.

## Author

**Haykal Qadhf**

- GitHub: [@haykalqadhf](https://github.com/haykalqadhf)
- Repository: [Market Pulse](https://github.com/haykalqadhf/market-pulse-portofolio)

---

*Developed as an ongoing exploration of full-stack development, financial data processing, and time-series forecasting.*
