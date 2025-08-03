# 📊 PortfolioPilot

PortfolioPilot is a modern, AI-powered financial dashboard that helps users track market trends, monitor investments, and gain real-time insights into their portfolio — all from a single, interactive interface. Built using Firebase Studio and powered by the Finnhub API, the app combines real-time stock data with intelligent insights.

---

## 🚀 Features

### 🧠 AI-Powered Portfolio Q&A
- Ask questions about your portfolio in natural language.
- Get concise, data-driven answers powered by AI.

### 💼 Portfolio Insights
- View your current holdings with gain/loss analysis.
- Track performance over time using intuitive charts and breakdowns.

### 💹 The Magnificent 7 Tracker
- Monitor real-time prices of AAPL, MSFT, GOOGL, AMZN, META, TSLA, NVDA.
- Display OHLC, daily change %, and trend visualization.

### 📰 Stocks in News
- Stay updated with the latest news impacting your holdings.
- AI-analyzed sentiment from top headlines and company news.

---

## 🧰 Tech Stack

| Layer        | Technologies Used                                    |
|--------------|-------------------------------------------------------|
| Frontend     | Firebase Studio, HTML/CSS, JavaScript                 |
| Backend/API  | Finnhub API                                           |
| Deployment   | Firebase Hosting (requires billing enabled)          |
| AI/NLP       | (Optional integration with GPT-based Q&A APIs)       |

---

## 🔌 Finnhub API Usage

This app uses [Finnhub](https://finnhub.io/) for:
- Real-time stock prices
- Company fundamentals
- Market news & sentiment
- Earnings and financial metrics

> ⚠️ Note: You must add your own Finnhub API key to use live data.

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Ritvik718/PortfolioPilot.git
cd PortfolioPilot

2. Add your API key

In your Firebase Studio configuration or environment setup, add your Finnhub API key as:

const FINNHUB_API_KEY = 'your_finnhub_api_key';

3. Deploy with Firebase

firebase login
firebase init
firebase deploy
