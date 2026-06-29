# Formula Track

Formula Track is a full-stack web application for exploring Formula 1 race weekends, session results, and season statistics.

The project aggregates data from public Formula 1 APIs, normalizes it on the backend, and presents it through a clean dashboard. It was developed as part of a university technical practice to gain hands-on experience with modern web development and REST API integration.

---

## Features

### Race Weekend Dashboard

* View the upcoming Formula 1 race weekend
* Display Grand Prix, circuit, country, and race schedule
* Browse all race sessions (Practice, Qualifying, Sprint, Race)

### Race Results

* Qualifying results
* Starting grid
* Race classification
* Driver standings
* Constructor standings

### Driver Analytics

* Driver profile modal
* Performance statistics
* Average grid position
* Average finishing position
* Points per race
* Consistency metric
* Recent race form
* Driver comparison

### Team Information

* Team profile modal
* Constructor standings
* Driver lineup

---

## Technologies

### Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy

### Frontend

* React
* TypeScript
* Tailwind CSS
* Axios

### External APIs

* OpenF1 API
* Jolpica F1 API

---

## Project Structure

```
FormulaTrack/
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── schemas/
│   └── models/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── types/
│
└── README.md
```

---

## Architecture

The application follows a simple client-server architecture.

```
OpenF1 API
        │
        ▼
FastAPI Backend
(Data fetching & normalization)
        │
        ▼
REST API
        │
        ▼
React Frontend
```

The frontend never consumes raw external API responses directly. All external data is normalized by the backend before being returned to the client.

---

## API Endpoints

| Method | Endpoint            | Description                  |
| ------ | ------------------- | ---------------------------- |
| GET    | `/weekend`          | Upcoming race weekend        |
| GET    | `/qualifying`       | Qualifying results           |
| GET    | `/grid`             | Starting grid                |
| GET    | `/results`          | Race results                 |
| GET    | `/driver/{id}`      | Driver profile and analytics |
| GET    | `/constructor/{id}` | Constructor information      |

---

## Running the Project

### Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend will be available at:

```
http://localhost:8000
```

Swagger documentation:

```
http://localhost:8000/docs
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend will be available at:

```
http://localhost:5173
```

---

## Learning Outcomes

During the development of this project I gained practical experience with:

* building REST APIs using FastAPI
* integrating third-party APIs
* data transformation and normalization
* React component-based development
* asynchronous HTTP communication
* responsive UI development
* Git version control
* full-stack application architecture

---

## Future Improvements

* Live race timing
* Historical season statistics
* Driver career statistics
* Circuit Explorer
* Race weekend timeline
* User authentication
* Favorite drivers and teams
* Notification system

---

## License

This project was created for educational purposes as part of a university technical practice.
