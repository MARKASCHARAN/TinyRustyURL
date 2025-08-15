# 🚀 TinyRustyURL
## A blazing fast, modern URL shortener built with **Rust** (backend) and **React + TypeScript** (frontend).

[![Backend – Rust](https://img.shields.io/badge/Backend-Rust-orange?logo=rust)](https://www.rust-lang.org/)  
[![Framework – Actix Web](https://img.shields.io/badge/Framework-Actix%20Web-blue?logo=actix)](https://actix.rs/)  
[![Storage – Redis](https://img.shields.io/badge/Storage-Redis-red?logo=redis)](https://redis.io/)  
[![Frontend – React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://react.dev/)  
[![License – MIT](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

---

## 📖 Project Overview

TinyRustyURL is a **full-stack URL shortener** with a performance-first backend in **Rust (Actix Web + Redis)** and a sleek, responsive **frontend built with React + TypeScript (Vite)**.

- **Backend**: Fast URL shortening, redirection, and click tracking (total & daily stats).  
- **Frontend**: Clean, user-friendly UI for shortening URLs, copying, viewing stats, and generating QR codes.  
- **Dockerized**: Run backend, frontend, and Redis seamlessly using Docker Compose.

---

## 📌 Table of Contents
- [Quick Start](#-quick-start)
- [Backend (Rust)](#-backend-rust)
- [Frontend (React + TypeScript)](#-frontend-react--typescript)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Contribution Guide](#-contribution-guide)
- [License](#-license)

---

## ⚡ Quick Start

### Prerequisites
- Rust (v1.60+)  
- Node.js & npm  
- Redis (local or via Docker)  

### Backend (Local Setup)
```bash
cd backend
cargo run


cd frontend
npm install
npm run dev

🧰 Backend (Rust)

Built with Actix Web for high-performance HTTP handling.

Redis for fast URL storage and click stats.

Tracks:

Total clicks

Daily clicks

Validates URL input and handles errors gracefully.

Provides RESTful API endpoints.

🖥️ Frontend (React + TypeScript)

Built with React 18 + TypeScript and Vite.

Features:

Modern, clean UI

Responsive and mobile-friendly

Copy-to-clipboard for shortened URLs

QR code generation

Click stats display

Real-time form validation

Uses react-hot-toast for notifications.

🌍 API Endpoints
Method	Endpoint	Description
POST	/shorten	Shortens a given long URL
GET	/{short_code}	Redirects to the original URL
GET	/stats/{short_code}	Returns total & daily click counts
📂 Project Structure
TinyRustyURL/
├── backend/               # Rust + Actix Web backend
│   ├── src/
│   │   ├── main.rs        # App entry point
│   │   ├── db.rs          # Redis connection & DB logic
│   │   ├── models.rs      # Data models & structs
│   │   ├── routes.rs      # API endpoints
│   ├── Cargo.toml
│   └── Dockerfile
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── UrlForm/
│   │   │   ├── UrlResult/
│   │   │   ├── StatsDisplay/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md

🤝 Contribution Guide

Fork the repository

Clone your fork:

git clone https://github.com/your-username/TinyRustyURL.git


Create a new branch:

git checkout -b feature/my-feature


Make your changes & commit:

git commit -m "Add my feature"


Push & open a Pull Request

📜 License

MIT License © 2025 MARKA SAI CHARAN


---

