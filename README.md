# Market Pulse 📈

**Cryptocurrency Market Dashboard with Machine Learning Price Forecasting**

Market Pulse is a full-stack cryptocurrency market analytics project that combines an interactive React dashboard with a Python-based machine learning backend.

The project integrates historical cryptocurrency market data from CoinGecko and uses **Auto-ARIMA time-series forecasting** to generate price predictions for configurable future periods.

## ✨ Key Features

- **Cryptocurrency Market Dashboard** — Explore cryptocurrency market information through an interactive dashboard.
- **Machine Learning Price Forecasting** — Predict future cryptocurrency prices using Auto-ARIMA.
- **CoinGecko API Integration** — Retrieve historical cryptocurrency price data.
- **Configurable Forecasting Horizon** — Generate predictions for different future time periods.
- **Automated ARIMA Parameter Selection** — Use `pmdarima.auto_arima` to identify suitable model parameters.
- **Fallback Data Simulation** — Use simulated historical data when the API does not return price data.
- **REST API Backend** — Expose forecasting functionality through a Flask API.

## 🧠 Machine Learning Approach

Market Pulse uses **Auto-ARIMA**, a time-series forecasting approach designed to model sequential numerical data.

Instead of manually selecting all ARIMA parameters, the backend uses `pmdarima.auto_arima` to search for suitable model configurations based on historical cryptocurrency prices.

### Forecasting Workflow

1. Receive a cryptocurrency identifier and prediction horizon.
2. Retrieve historical price data from CoinGecko.
3. Prepare historical prices as a time-series dataset.
4. Automatically select ARIMA parameters.
5. Generate future price predictions.
6. Return the forecast results as JSON.

### Historical Data Configuration

| Forecast Horizon | Historical Data Used |
|---|---:|
| 7 days or less | 60 days |
| 8–30 days | 180 days |
| More than 30 days | 730 days |

**Note:** Cryptocurrency prices are highly volatile. Forecasts are experimental estimates, not financial advice or guaranteed future prices.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React, JavaScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Data Visualization | Recharts |
| HTTP Client | Axios |
| Backend | Python, Flask |
| Machine Learning | Auto-ARIMA, pmdarima |
| Data Processing | NumPy, Pandas |
| Market Data | CoinGecko API |
| Version Control | Git, GitHub |

## 📁 Project Structure

```text
market-pulse-portofolio/
├── ml-backend/
│   └── app.py             # Flask API and forecasting logic
├── src/                   # React frontend
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Python 3
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/haykalqadhf/market-pulse-portofolio.git
cd market-pulse-portofolio
```

### 2. Set Up the Frontend

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite, usually:

```text
http://localhost:5173
```

### 3. Set Up the Python Backend

Navigate to the backend directory:

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

On macOS or Linux:

```bash
source venv/bin/activate
```

Install the required Python packages:

```bash
pip install Flask Flask-Cors requests numpy pandas pmdarima
```

Start the Flask server:

```bash
python app.py
```

The backend will run at:

```text
http://localhost:5000
```

## 🔌 API Reference

### Cryptocurrency Price Prediction

**Endpoint**

```http
GET /api/predict/<coin_id>
```

**Query Parameters**

| Parameter | Description | Example |
|---|---|---|
| `coin_id` | Cryptocurrency identifier used by CoinGecko | `bitcoin` |
| `days` | Number of days to forecast | `7` |

**Example Request**

```http
GET http://localhost:5000/api/predict/bitcoin?days=7
```

**Example Response**

```json
{
  "status": "success",
  "coin": "bitcoin",
  "predict_days": 7,
  "forecast": [
    {
      "date": "Oct 10",
      "predicted_price": 65000.0
    }
  ],
  "is_simulated": false
}
```

*The response values above are illustrative and do not represent actual market predictions.*

## 📌 Project Purpose

This project was developed as part of my portfolio to demonstrate practical experience in:

- Full-stack web application development
- REST API integration
- Time-series forecasting
- Machine learning implementation
- Data processing and visualization
- Frontend and backend integration

## 👨‍💻 Author

**Haykal Qadhf**

- GitHub: [@haykalqadhf](https://github.com/haykalqadhf)
- Repository: [Market Pulse](https://github.com/haykalqadhf/market-pulse-portofolio)

---

*Developed as a portfolio project exploring cryptocurrency analytics and machine learning.*
