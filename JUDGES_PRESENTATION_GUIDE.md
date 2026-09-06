# Urban Flood Nowcasting System - SIH Demo & Execution Guide

Welcome to the **Urban Flood Nowcasting System**! This is a complete, production-ready prototype built for the Smart India Hackathon (SIH). It calculates real-time rainfall-to-runoff transformation, street curb inlet capacity overload, terrain inundation, and dynamic flood-safe routing.

---

## 🚀 Quick Start Instructions (Steps to Run)

### Prerequisites
- **Java JDK 21+**
- **Node.js 18+** & **npm**

---

### Step 1: Run the Spring Boot Backend (Port 8081)

Open a terminal in the root directory (`Urban Flood Nowcasting System`):

```bash
# Run the pre-compiled JAR package with memory allocation optimization:
java -Xms64m -Xmx256m -jar target/flood-nowcast-backend-1.0.0.jar
```

*Note: The backend starts on `http://localhost:8081` with an in-memory H2 database seeded with synthetic telemetry for 40 streets and 15 drainage nodes in Mumbai.*

---

### Step 2: Run the React Vite Frontend (Port 5176)

Open a second terminal in `Urban Flood Nowcasting System/frontend`:

```bash
# Navigate to frontend folder
cd frontend

# Start the dev server
npm run dev
```

*The UI will open at `http://localhost:5176`.*

---

## 🏆 Presentation Script for SIH Judges (5-Minute Demonstration)

Follow these steps when demonstrating the project to judges:

### 1. The Core Problem & Solution Pitch (30 Seconds)
> *"Urban flash floods cause massive disruptions within minutes of intense rainfall because static flood maps don't show real-time drainage blockages or dynamic street-level depth. Our Urban Flood Nowcasting System integrates 15-minute Doppler radar rainfall telemetry with terrain elevation (DEM) and street curb drainage capacity to predict localized flooding 60 minutes in advance and calculate dynamic flood-safe routes for emergency vehicles."*

---

### 2. Live Command Center Walkthrough (1 Minute)
1. Point out the **Command Header** showing **Live Telemetry Status**, **Current Rainfall Intensity (85 mm/h)**, and **Global Risk Level**.
2. Highlight the **KPI Metrics Cards** at the top: Total Rainfall, Overloaded Drains, Inundated Hotspots, and Evacuation Capacity.
3. Show the **Interactive Leaflet Map**:
   - **Street Polylines**: Color-coded by depth (Green = Safe, Yellow = Low, Orange = Moderate, Red = High, Purple = Critical).
   - **Pulsing Inundation Circles**: Show expanding flood water circles over vulnerable low-elevation regions (Slum Area Rd, Canal Bank Rd, Transport Nagar).
   - Click on any flooded street circle to display the detailed telemetry pop-up with **Water Depth (cm)**, **Drain Utilization (%)**, and **Elevation (m)**.

---

### 3. Nowcast Forecast Timeline & 8-Stage Flood Event Simulation (1.5 Minutes)
1. **Forecast Slider**: Drag the slider at the bottom from **+0m** to **+60m**. Watch how the map updates dynamically, demonstrating the 60-minute predictive capability.
2. Click the **`▶ SIMULATE FLOOD EVENT`** button in the bottom right controller panel.
3. Watch the system play through the 8 stages automatically:
   - *Initial Heavy Downpour* → *Drain Inlet Saturated* → *Water Depth Rising* → *Slum Area Flooded* → *Peak Inundation* → *Emergency Routing Active* → *Pumping Stations Deployed* → *Receding Phase*.

---

### 4. Flood-Safe Emergency Routing (1 Minute)
1. Switch to the **Safe Routing** panel on the right sidebar.
2. Select **Origin** (`Slum Area Road`) and **Destination** (`City Hospital Rd`).
3. Select **Vehicle Type**:
   - Choose **Sedan / Civilian Car** (Max clearance: 20 cm) → Click **`FIND SAFE ROUTE`**. The system avoids inundated streets (Canal Bank Rd, Slum Area Rd) and highlights a **Green Safe Polyline** with detailed step-by-step turn directions.
   - Choose **Emergency Heavy Truck** (Max clearance: 60 cm) → Click **`FIND SAFE ROUTE`**. The system safely navigates higher depth thresholds.

---

### 5. What-If Scenario Simulator & Mitigation (30 Seconds)
1. Switch to the **Scenario Simulator** tab.
2. Adjust the **Rainfall Intensity Slider** to `120 mm/h` or toggle **Drain Blockage** to `50%`.
3. Click **`RUN SCENARIO`** to demonstrate instant predictive response under extreme weather conditions.

---

## 🛠️ Key Technical Highlights
- **Layered Architecture**: Spring Boot 3.3 REST API + JPA Hibernate + H2 Database + React 18 TypeScript.
- **Hydrological Engine**: Rational Method ($Q = C \cdot I \cdot A$) + Manning's overland flow accumulation + street curb inlet capacity dynamics ($0.025\text{ m}^3/\text{s}$).
- **Dynamic Routing**: Customized Dijkstra algorithm weighting edge cost by water depth relative to vehicle ground clearance.
- **Visual Design**: Dark theme glassmorphism, bold typography for high readability, responsive map layers, zero external API keys required.
