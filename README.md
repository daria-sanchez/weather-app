# Weather App

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

A simple JavaScript weather app that fetches data from the Open-Meteo API and displays current weather conditions for any city.

## Features

### 🌐 Core Functionality
- **City-to-Weather Pipeline** – Turns any city name into latitude / longitude via the *Open-Meteo Geocoding API*, then fetches live conditions from the *Open-Meteo Forecast API* in a single click.  
- **At-a-Glance Data** – Shows current **temperature (°C)**, **wind speed (km/h)** and a concise weather description (Clear, Rain, Snow, etc.).

### 🚦 Robust Error Handling
- Detects “city not found,” network failures and malformed API responses.  
- Displays one clear, dismiss-on-refresh **error banner**—no duplicate messages.

### ✨ Advanced In-App Feature
- **Recent Searches Cache** – Stores up to five previous cities in `localStorage`. Each appears as a clickable **chip** for instant re-query.

### 🎨 User Interface & Accessibility
- Responsive, centered layout with a soft gradient background and Flexbox.  
- Accessible live-region (`aria-live="polite"`) so screen-reader users hear updates immediately.  
- Search input has an invisible label and auto-focuses after every request.

### 🛠️ Code Quality & Testing
- Single ES-module (`app.js`) organized into storage, API, UI and controller helpers.  
- Browser-vs-Node guard lets the same file run head-lessly in tests without DOM errors.  
- **Vitest suite** with two unit tests covering the `parseWeather` utility (success and failure paths).

### 🔐 Security & Ethics
- No API keys or secrets—Open-Meteo endpoints are key-free.  
- `npm audit fix` run 2025-06-14: zero high-severity vulnerabilities.  
- AI assistance noted; all code reviewed and released under MIT license.

## Setup
Just open `index.html` in your browser.

## Project Files

- Index.html
- app.js
- style.css
- __tests__

## To Do
- Add geolocation or geocoding support
- Improve error handling
- Add weather icons

## Screenshots
<img src="screenshots/tokyo.png" width="400">

<img src="screenshots/error.png" width="400">

