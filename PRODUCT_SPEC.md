# PRODUCT SPECIFICATION (PRD) — Formula Track

## 1. Project Overview

Formula Track is a data-driven web application designed for Formula 1 fans and enthusiasts. The platform acts as a centralized dashboard where users can track Formula 1 race weekends, view session schedules, qualifying results, starting grids, race outcomes, and season standings in a structured interface.

The application collects Formula 1 data from external APIs and transforms it into a consistent internal format to provide a clean and reliable experience across the frontend.

---

## 2. Core Problem & Solution

### Problem

Formula 1 information is usually distributed across multiple websites and platforms. Users often need to switch between different sources to find:

- race schedules
- qualifying results
- starting grid positions
- sprint race outcomes
- race results
- championship standings

Most available platforms also prioritize raw data presentation rather than providing a simple weekend-focused experience.

---

### Solution

Formula Track centralizes Formula 1 data into one dashboard where users can easily navigate through race weekends and access all important information.

The system will:

- fetch Formula 1 data from external APIs
- normalize raw API responses into an internal structure
- provide fast navigation between race weekends
- present sessions in chronological order

Race weekend structure:

Practice → Qualifying → Sprint → Race

The goal is to allow users to follow an entire Formula 1 weekend from one place.

---

## 3. Target Audience & Roles

### Guest User

Default user without authentication.

Capabilities:

- View season calendar
- Browse upcoming and previous race weekends
- View session schedules
- View qualifying results
- View starting grid
- View sprint results
- View race results
- View driver standings
- View constructor standings

---

### Registered User (Future Feature)

Personalized user profile.

Capabilities:

- Save favorite drivers
- Save favorite teams
- Bookmark race weekends
- Receive optional race reminders
- Customize dashboard preferences

---

### Admin (Future Feature)

Administrative role for application management.

Capabilities:

- Manage API configuration
- Monitor backend logs
- Configure caching settings
- Manage database data

---

## 4. Key Features (MVP)

### 4.1 Race Weekend Dashboard

Main application feature.

Display:

- Grand Prix name
- Circuit name
- Country
- Session schedule

Sessions include:

- Practice 1
- Practice 2
- Practice 3
- Qualifying
- Sprint (if available)
- Race

For each session display:

- Session type
- Date
- Start time

---

### 4.2 Session Results Viewer

Display detailed information for sessions:

Qualifying:

- Driver position
- Driver name
- Team
- Lap time

Race:

- Final position
- Driver
- Team
- Points

Sprint:

- Sprint result table (if available)

Grid:

- Official starting positions

---

### 4.3 Standings Dashboard

Display:

Driver standings:

- Position
- Driver
- Team
- Points
- Wins

Constructor standings:

- Position
- Team
- Points

---

### 4.4 User Experience Features

- Responsive design for desktop and mobile
- Fast navigation between race weekends
- Loading indicators
- Error handling states
- Empty state handling

---

### 4.5 Backend Data Processing Layer

Backend responsibilities:

- Fetch data from external APIs
- Normalize raw API responses
- Structure data into application models
- Return clean JSON responses

Frontend must never consume raw external API responses directly.

---

## 5. Technical Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios
- React Context API

Frontend responsibilities:

- Display dashboard UI
- Consume backend API endpoints
- Manage application state
- Handle loading and error states

---

### Backend

- Python
- FastAPI
- Pydantic
- SQLAlchemy

Backend responsibilities:

- Fetch Formula 1 data from APIs
- Normalize responses
- Provide REST endpoints
- Cache frequently used data

---

### External API

Primary API:

- Jolpica F1 API

Alternative API:

- OpenF1 API

---

### Database

- PostgreSQL

Database usage:

- Cache race information
- Store normalized data
- Store future user data

---

## 6. High-Level Data Models

Core entities:

### RaceWeekend

Properties:

- id
- grandPrixName
- circuitName
- country
- sessions[]

---

### Session

Properties:

- id
- type
- date
- startTime

---

### Driver

Properties:

- id
- fullName
- team
- nationality

---

### Result

Properties:

- position
- driver
- team
- points
- lapTime

---

### StandingEntry

Properties:

- position
- name
- team
- points
- wins

---

## 7. System Architecture Notes

### Frontend Structure

Feature-based architecture:

```text
src/
├── components/
├── pages/
├── services/
├── context/
├── hooks/
├── types/
├── assets/
└── App.tsx
```

Responsibilities:

- reusable UI components
- isolated API communication layer
- strict TypeScript interfaces

---

### Backend Structure

```text
backend/
├── app/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── schemas/
│   └── main.py
```

Responsibilities:

routes/

- API endpoints

services/

- business logic
- API integration

models/

- database entities

schemas/

- request and response models

---

## 8. Data Strategy

Application data flow:

External API → FastAPI → Data Normalization → PostgreSQL Cache → Frontend

Frequently requested data:

- season calendar
- standings
- upcoming race weekend

should be cached to reduce API requests.

---

## 9. MVP Scope Limitations

The following features are not included in MVP:

- live telemetry
- live timing
- tire strategy analysis
- GPS car tracking
- authentication system
- social features
- notifications
- advanced analytics

These features may be implemented in future versions.

---

## 10. AI Development Guidelines

When generating code for this project, follow these rules:

### Backend Rules

- Keep business logic inside service layer
- Keep routes/controllers minimal
- Do not expose raw external API responses directly
- Always return structured JSON responses
- Normalize external API data before sending to frontend
- Avoid hardcoded session handling logic

Backend responsibilities:

- Fetch Formula 1 data from external APIs
- Normalize raw responses
- Return consistent response structures
- Cache frequently requested data

---

### Internal Application Models

AI should create and use the following internal models:

RaceWeekend:

- id
- grandPrixName
- circuitName
- country
- sessions[]

Session:

- id
- name
- date
- startTime

QualifyingResult:

- position
- driver
- team
- lapTime

RaceResult:

- position
- driver
- team
- points

StandingEntry:

- position
- name
- team
- points
- wins

---

### Frontend Rules

- Use reusable components
- Keep API requests isolated inside services/api.ts
- Use strict TypeScript interfaces
- Do not depend on raw API structure
- Prefer reusable UI over page-specific components

Required UI components:

- RaceWeekendCard
- SessionCard
- QualifyingTable
- RaceResultsTable
- StandingsTable

Frontend must:

- Display session schedule cards
- Display qualifying results
- Display standings tables
- Handle loading states
- Handle error states
- Handle empty states