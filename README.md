# Urban Flood Nowcasting & Early Warning System

An end-to-end operational prototype designed for Smart India Hackathon (SIH), providing real-time rainfall-to-runoff simulation, drainage network bottleneck detection, high-resolution street inundation mapping, and dynamic flood-safe emergency routing.

---

## 📸 Key Features

- **Real-Time Hydrological Simulation**: Converts Doppler radar rainfall nowcasts ($mm/h$) into surface runoff using Rational Method physics and Manning's overland flow equations.
- **Street-Level Inundation Risk**: Predicts exact water depth ($cm$) and risk level (*SAFE, LOW, MODERATE, HIGH, CRITICAL*) across 40 street segments 60 minutes into the future.
- **Drainage Network Diagnostics**: Highlights overloaded and blocked stormwater drains ($m^3/s$ vs capacity).
- **Dynamic Flood-Safe Routing**: Calculates safe turn-by-turn navigation for civilian vehicles and high-clearance emergency trucks using depth-weighted Dijkstra pathfinding.
- **Interactive Command Center**: 
  - Free OpenStreetMap tiles (No API key needed).
  - High-visibility typography for clear legibility on large projection screens.
  - Automated 8-Stage Flood Event Simulator.
  - Interactive "What-If" Scenario Simulator.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Java 21, Spring Boot 3.3.4, Spring Data JPA, H2 In-Memory DB, Lombok, Maven |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Leaflet JS, Recharts, Lucide React |
| **Routing** | Custom Depth-Aware Dijkstra Engine |
| **Hydrology** | Rational Method + Manning's Equation + Curb Inlet Capacity Engine |

---

## 🚀 How to Run

### 1. Start Backend Server
```bash
# From workspace root
java -Xms64m -Xmx256m -jar target/flood-nowcast-backend-1.0.0.jar
```
Backend runs on `http://localhost:8081`.

### 2. Start Frontend UI
```bash
# From workspace root/frontend directory
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5176`.

---

## 📖 Presentation Guide for Judges

For full step-by-step presentation script, check [JUDGES_PRESENTATION_GUIDE.md](file:///c:/Users/prem/Documents/Urban%20Flood%20Nowcasting%20System/JUDGES_PRESENTATION_GUIDE.md).
