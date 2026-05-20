PRODUCT SPECIFICATION (PRD) — Formula Track
1. Project Overview

Formula Track is a data-driven web application designed for Formula 1 fans, analysts, and enthusiasts. The platform serves as a centralized dashboard where users can follow race weekends, including schedules, qualifying results, starting grids, sprint sessions, race results, and season standings in one structured interface.

The system aggregates Formula 1 data from external APIs and normalizes it into a consistent format for fast and reliable consumption across the frontend.

2. Core Problem & Solution
Problem

Formula 1 data is fragmented across multiple platforms and official sources. Users must switch between different websites to track:

race calendars and schedules
qualifying results
starting grid formation
sprint race outcomes
final race results
driver and constructor standings

Additionally, most official sources are not optimized for fast comparison or weekend-based navigation, making it difficult to follow an entire race weekend in a structured way.

Solution

Formula Track centralizes all Formula 1 weekend data into a single structured dashboard.

The application:

aggregates race data from external APIs (Jolpica / OpenF1)
normalizes session data into a unified format (Race Weekend model)
provides a fast navigation system between race weekends
displays structured race progression (Practice → Qualifying → Sprint → Race)

The goal is to allow users to understand a full race weekend in one place without switching sources.

3. Target Audience & Roles
Guest (Unauthenticated User)

Basic user who can explore F1 data without personalization features.

Capabilities:

View full F1 season calendar
Browse race weekends (past and upcoming)
View race schedules (practice, qualifying, sprint, race)
View qualifying results and starting grid
View sprint and race results
View driver standings
View constructor standings
Registered User (Future Feature)

A personalized user account with saved preferences.

Capabilities:

Save favorite drivers and teams
Bookmark specific race weekends
Receive optional notifications for race start times
Customize dashboard layout (future enhancement)
Admin (Future Feature)

System-level role for maintenance and configuration.

Capabilities:

Manage API integrations and keys
Monitor backend logs and system health
Configure caching strategy and data refresh intervals
Manage database seeding and cleanup (if needed)
4. Key Features (MVP)
4.1 Race Weekend Explorer

Core feature of the application.

Display full Formula 1 season calendar
Navigate between race weekends
Each weekend contains structured sessions:
Practice sessions (FP1, FP2, FP3)
Qualifying
Sprint (if applicable)
Race
Show session date, time, and circuit information
4.2 Session Results Viewer

Detailed results per session:

Qualifying results (positions, lap times)
Starting grid (official race start order)
Sprint results (if applicable)
Race results (final classification)
4.3 Standings Dashboard
Driver Championship standings
Constructor Championship standings
Points, positions, wins, podiums
4.4 Navigation & UX
Fast switching between race weekends
Responsive layout (desktop + mobile)
Loading states for API calls
Error fallback screens (API unavailable, missing data)
4.5 Backend Data Normalization Layer

Backend transforms raw API data into a unified structure:

RaceWeekend
Session (Practice / Qualifying / Race / Sprint)
Result entities
Standings entities

This ensures frontend is independent from external API structure changes.

5. Technical Stack
Frontend
React
TypeScript
Tailwind CSS
React Router
Axios
Context API (MVP state management)
Backend
Python
FastAPI
Pydantic (data validation)
SQLAlchemy (ORM)

Backend responsibilities:

Fetch F1 data from external API
Normalize and structure race weekend data
Provide REST API endpoints to frontend
Cache frequently requested data (calendar, standings)
External API

Primary:

Jolpica F1 API (Ergast successor)

Alternative fallback:

OpenF1 API
Database
PostgreSQL

Used for:

caching race weekend data
storing normalized session results
optional user data (future)
6. Data Model Concept (High-Level)

Core entities:

RaceWeekend
Circuit
Session (Practice / Qualifying / Sprint / Race)
Driver
Constructor
Result
StandingEntry
7. System Architecture Notes
Frontend Architecture
Feature-based structure (pages, components, services)
API service layer (isolated Axios calls)
Separation between UI and data logic
Reusable components for tables, cards, and session views
Backend Architecture
Service-based structure (no heavy frameworks needed)
Separation of layers:
routes/ → HTTP endpoints
services/ → business logic
models/ → DB entities
schemas/ → API DTOs
External API integration isolated in service layer
Response normalization before sending to frontend
8. Data Strategy
External API is primary data source
Backend acts as a caching + normalization layer
Frequently accessed data:
season calendar
standings
Cached to reduce API calls and improve performance
9. MVP Scope Limitation

Not included in MVP:

Live telemetry (real-time tracking)
Tire strategy analysis
GPS car tracking
User authentication system
Social features (comments, sharing)
Push notifications

These features are considered Phase 2+ enhancements.










"" 10. AI Development Guidelines

When generating code for this project, follow:

Keep backend logic in FastAPI service layer (no logic in routes)
Always return structured JSON responses
Frontend must never depend on raw external API format
Use strict TypeScript types for all API responses
Avoid hardcoded session logic in frontend
Prefer reusable components over page-specific UI
Keep API layer isolated (services/api.ts pattern)  ""