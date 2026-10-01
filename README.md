# Main branch project structure
│
├── frontend/                # React + Vite + Tailwind + Recharts
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChartView.jsx
│   │   │   ├── ModelSelector.jsx
│   │   │   ├── StockInput.jsx
│   │   │   └── ResultsTable.jsx
│   │   ├── pages/
│   │   │   └── HomePage.jsx
│   │   ├── api/
│   │   │   └── api.js           # axios запити до бекенду
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # FastAPI API сервер
│   ├── app/
│   │   ├── main.py           # Точка входу (FastAPI + Uvicorn)
│   │   ├── routers/
│   │   │   ├── stocks.py     # Маршрути для запитів акцій
│   │   │   └── models.py     # Маршрути для вибору методів прогнозування
│   │   ├── services/
│   │   │   ├── data_loader.py    # завантаження даних через yfinance
│   │   │   ├── forecast_client.py # запити до ML сервісу
│   │   │   └── db_service.py      # робота з базою
│   │   ├── db/
│   │   │   └── database.py    # SQLAlchemy конфігурація
│   │   └── schemas/
│   │       └── models.py      # Pydantic схеми
│   ├── requirements.txt
│   └── Dockerfile
│
├── ml_service/              # окремий модуль для прогнозів
│   ├── models/
│   │   ├── arima_model.py
│   │   ├── random_forest.py
│   │   ├── lstm_model.py     # (опціонально)
│   │   └── metrics.py        # RMSE, MAE тощо
│   ├── main.py               # FastAPI endpoint для виклику моделей
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml        # об’єднує frontend, backend, ml_service, PostgreSQL
│
├── .env                      # секрети, ключі, налаштування БД
│
└── README.md                 # опис проєкту для дипломної частини


Приклад взаємодії компонентів

Frontend (React)
→ Надсилає запит до /api/forecast?symbol=AAPL&model=ARIMA

Backend (FastAPI)
→ Отримує запит, через yfinance завантажує історичні дані,
→ Відправляє їх у ml_service (через HTTP-запит).

ML Service (FastAPI)
→ Виконує прогноз за вказаною моделлю (ARIMA / Random Forest),
→ Повертає прогнозовані дані та метрики.

Backend
→ Зберігає результат у PostgreSQL,
→ Відправляє результат назад на фронтенд.

Frontend
→ Візуалізує графіки та таблиці порівнянь у Recharts.