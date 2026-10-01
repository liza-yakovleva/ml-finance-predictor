# Diploma Forecasting App Liza

Розподілений вебдодаток для прогнозування цін і напрямку руху фінансових інструментів з порівнянням моделей машинного навчання.

## Можливості

- прогноз ціни (`regression`) і напрямку руху (`classification`);
- підтримка акцій, індексів і криптоактивів;
- моделі `ARIMA`, `Prophet`, `LSTM`, `Transformer`, `Ensemble` і baseline;
- порівняння моделей через walk-forward validation;
- історія прогнозів та експериментів;
- fallback між Binance, Yahoo Finance і локальним кешем;
- завантаження результату у форматах CSV та JSON.

## Архітектура

| Сервіс | Технології | Призначення | Порт |
| --- | --- | --- | ---: |
| Frontend | React, TypeScript, Vite, Tailwind, Recharts | Форми, графіки та експорт результатів | 5173 |
| Backend | FastAPI, SQLAlchemy, SQLite | API, історія прогнозів та експериментів | 8000 |
| ML service | FastAPI, PyTorch, pandas, Prophet | Дані, моделі, прогнозування та валідація | 8001 |

Потік запиту:

```text
Frontend -> Backend API -> ML service -> Backend API -> Frontend
```

Backend зберігає результати у SQLite, а ML service використовує локальний OHLCV-кеш, якщо онлайн-джерело недоступне.

## Структура репозиторію

```text
diploma-forecasting-app/
├── frontend/
│   └── src/
│       ├── components/          # форми, графіки та історія
│       ├── services/api.ts      # HTTP-запити до backend
│       ├── utils/exportForecast.ts
│       └── types.ts
├── backend/
│   └── app/
│       ├── main.py              # FastAPI endpoints
│       ├── database.py          # SQLAlchemy models and SQLite
│       └── services/ml_client.py
├── ml_service/
│   ├── main.py                  # ML API
│   ├── models/                  # ARIMA, LSTM, Transformer та інші моделі
│   ├── services/                # завантаження даних і валідація
│   └── cache/                   # локальний кеш OHLCV
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Запуск через Docker

```bash
docker compose up --build -d
docker compose ps
```

Після запуску:

- frontend: http://localhost:5173
- backend documentation: http://localhost:8000/docs
- ML service documentation: http://localhost:8001/docs

Зупинка сервісів:

```bash
docker compose down
```

## Локальна перевірка frontend

```bash
cd frontend
npm install
npm run test
npm run build
```

## Експорт прогнозів

Формати експорту: CSV та JSON (підтримка завантаження в один клік).

У CSV зберігаються символ, інтервал, тип значення, індекс, timestamp і значення прогнозу. JSON містить повну структуру відповіді `ForecastResponse`.

## API endpoints

- `POST /api/forecast` — один прогноз;
- `POST /api/compare-models` — порівняння моделей;
- `GET /api/forecasts/{symbol}` — історія прогнозів;
- `GET /api/experiments` — історія експериментів;
- `GET /api/health` — перевірка стану backend.

## Git workflow

Для нової функціональності використовується окрема feature-гілка:

```bash
git switch -c feature/my-feature
git add .
git commit -m "feat: describe the change"
git push -u origin feature/my-feature
```

Після self-review зміни інтегруються через Pull Request у `main`.