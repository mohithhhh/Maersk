# MAERSK COPILOT

 The Maersk AI Data Analyst Copilot is a forward-looking, enterprise-aligned analytics assistant engineered to streamline insight generation from the Olist Brazilian e-commerce dataset. The solution leverages generative AI, dynamic visualizations, and a bilingual UX (English + Portuguese-BR) to deliver actionable intelligence tailored for logistics and trade operations—wrapped in a Maersk-branded front-end experience. It unifies conversational intelligence with real-time analytical querying to reduce analyst friction and accelerate decision cycles. The platform also introduces automated insight storytelling, enabling users to move seamlessly from raw data to executive-ready summaries in seconds.

<img width="1710" height="992" alt="Screenshot 2025-11-13 at 10 47 34 AM" src="https://github.com/user-attachments/assets/6e4801dc-b049-464f-8fa5-860767276527" />


##  Full Feature Set — Maersk AI Data Analyst Copilot

###  Core Intelligence
- Generative AI–powered analytics using **Gemini Pro + Flash fallback**.
- Smart intent routing to distinguish **conversational queries** vs. **analytical data questions**.
- Dual-mode intelligence:
  - Conversational search mode (Google Search grounding).
  - Data-driven insight generation (visualization + KPIs + summaries).

###  Bilingual Experience
- Full **English + Brazilian Portuguese (pt-BR)** support.
- Automatic language detection with context-aware translations.

  **English**
  
  <img width="848" height="251" alt="Screenshot 2025-11-13 at 10 44 18 AM" src="https://github.com/user-attachments/assets/be70628c-beca-41b8-abbc-2731f84cd7d8" />

  **Brazilian Portugese**
  
  <img width="808" height="277" alt="Screenshot 2025-11-13 at 10 44 42 AM" src="https://github.com/user-attachments/assets/cb75e374-635c-4a9c-9546-5b3665be6a8a" />



###  Dynamic Visualization Engine
- **Chart visualizations:** Line & Bar charts with dynamic scaling.
- **KPI cards:** Executive-style metrics with trend indicators.
- **Brazil Geo Map Visualization:**
  - Interactive state-level heatmap.
  - Hover tooltips & clickable states.
  - Smooth color gradients using Maersk brand palette.

**Interactive map**

<img width="1710" height="993" alt="Screenshot 2025-11-13 at 10 48 24 AM" src="https://github.com/user-attachments/assets/a46bfc7b-2c64-4fe3-b68d-5b805651f0af" />


**Trends**
<img width="1709" height="993" alt="Screenshot 2025-11-13 at 10 48 39 AM" src="https://github.com/user-attachments/assets/cfc3e570-2f20-4872-a994-13bb6914074f" />


**About section**
<img width="1709" height="1021" alt="Screenshot 2025-11-13 at 10 48 56 AM" src="https://github.com/user-attachments/assets/59c3d84d-2569-4a63-8a02-5412d50bdb03" />


### Backend & Data Processing
- FastAPI backend serving structured insights from Olist e-commerce dataset.
- Clean business summaries generated per query.
- Unified schema output compatible with frontend visual components.

**Swagger UI**

<img width="1710" height="716" alt="Screenshot 2025-11-13 at 11 15 53 AM" src="https://github.com/user-attachments/assets/27962163-c725-45e3-9196-480b4d41f204" />

**Flash running**
<img width="818" height="140" alt="Screenshot 2025-11-13 at 11 16 15 AM" src="https://github.com/user-attachments/assets/5e91375d-9509-4b47-868c-33709c300a74" />




### Insight Generation
- Executive-grade summaries explaining metrics, trends, and anomalies.
- Insight Drawer panel for deep-dive explanations.
- Automated narrative-building across charts, KPIs, and geo insights.

  

### Conversational Chat Interface
- Persistent chat history stored locally.
- Animated typing indicators and smooth UI transitions.
- Suggestion chips for quick-start queries.

  <img width="1710" height="992" alt="Screenshot 2025-11-13 at 10 47 57 AM" src="https://github.com/user-attachments/assets/c3eb32b4-d5e9-472e-98e4-44cd40f2a061" />


### Search-Enhanced Knowledge Mode
- Factual answers about **Maersk**, logistics, supply chain, trade, etc.
- Uses **Google Search grounding** for trusted external knowledge.
- Displays source links for transparency.

**Google search**

<img width="878" height="672" alt="Screenshot 2025-11-13 at 11 20 21 AM" src="https://github.com/user-attachments/assets/9594feb7-9647-4147-9d93-a853b7bca8f3" />


### Maersk-Branded UI
- Authentic Maersk Blue (#42B0D5) color system.
- Clean enterprise dashboard layout.
- Custom avatars (Maersk AI + User).
  
<img width="1257" height="416" alt="Maersk-Color-Palette-Image" src="https://github.com/user-attachments/assets/b08bb694-e1da-4d88-bf74-16003586c0f5" />


### Export & Reporting
- One-click **PDF export** of chat + insights.
- High-resolution canvas capture using `html2canvas` + `jsPDF`.

<img width="193" height="38" alt="Screenshot 2025-11-13 at 10 38 57 AM" src="https://github.com/user-attachments/assets/51ceb0b3-e9a9-4ab1-8e2a-ca065821d713" />


### Developer-Friendly Architecture
- Modular codebase:
  - `geminiService`
  - `apiService`
  - Visualization components
- Extendable schema for new chart types or map layers.
- Mock mode for offline development and demos.

### Environment & Configuration
- Secure API key management via Vite env variables.
- Robust fallback layers for API downtime.

### Error & Failover Handling
- Automatic fallback chain: **Pro → Flash → Mock**.
- Friendly user-facing messages during outages.
- Safe JSON parsing + schema validation layer.

## Technology Stack

### Frontend
	•	React + Vite + TypeScript
	•	Maersk Design Layer (Tailwind + Maersk-blue theming)
	•	Recharts for chart visualizations
	•	Custom SVG Brazil Map Engine
	•	Gemini Client SDK (@google/genai)

### Backend
	•	FastAPI with modular endpoints
	•	Query engine for Olist dataset
	•	Business logic summarizer
	•	CORS-enabled REST API
	•	Container-ready structure

### AI Layer
	•	Gemini 1.5 Pro + Flash
	•	Google Search grounding
	•	Smart routing (Conversational ↔ Analytical)
	•	JSON-schema-driven visualization generator
	•	Dual-lingual processing + translation layer

## 🏛️ System Architecture Overview

                                 +--------------------------------------+
                                 |        Maersk AI Data Analyst UI     |
                                 |--------------------------------------|
                                 |  • React + Vite + TypeScript         |
                                 |  • Maersk Theme (#42B0D5)            |
                                 |  • English / Portuguese-BR UI        |
                                 |  • Chat Window + Insight Drawer      |
                                 |  • KPI Cards, Charts, Brazil Map     |
                                 +-------------------------+------------+
                                                           |
                                                           | User Query
                                                           v

                          +------------------------------------------------------+
                          |                  Smart Intent Router                 |
                          |------------------------------------------------------|
                          |  Detects:                                            |
                          |   • Data Questions → Visualization Mode               |
                          |   • General Questions → Conversational Mode           |
                          |   • Language Detection (EN / PT-BR)                   |
                          |   • Fallback / Mock Mode                              |
                          +----------------------+-------------------------------+
                                                 |
                        +------------------------+-------------------------+
                        |                                                  |
                        v                                                  v

        +----------------------------------+          +------------------------------------+
        |          Visualization Mode      |          |         Conversational Mode        |
        |----------------------------------|          |------------------------------------|
        | • Strict JSON schema             |          | • Natural language answers         |
        | • KPI / Charts / Map             |          | • Uses Gemini + Google Search      |
        | • Data-driven insights           |          | • English / Portuguese-BR          |
        +----------------+-----------------+          +------------------+-----------------+
                         | Backend data needed                           | General info query
                         v                                               v

    +-------------------------------------------+   +-------------------------------------------+
    |                FastAPI Backend            |   |               Google Search               |
    |-------------------------------------------|   |-------------------------------------------|
    | • Olist DB queries                        |   | • External factual grounding              |
    | • SQL aggregations / metrics              |   | • Used for conversational mode            |
    | • JSON API responses                      |   | • Enhances correctness                    |
    +------------------------------+------------+   +------------------------------+------------+
                                   |                                               |
                                   |                                               |
                                   +-----------------------------+-----------------+
                                                                 |
                                                                 v

                      +-----------------------------------------------------------------------+
                      |                         Gemini AI Layer                               |
                      |-----------------------------------------------------------------------|
                      |  Primary Model: gemini-1.5-pro                                        |
                      |  Fallback Model: gemini-1.5-flash                                     |
                      |                                                                       |
                      |  • JSON schema enforcement                                            |
                      |  • Visualization synthesis                                             |
                      |  • Bilingual comprehension                                             |
                      |  • Error fallback + recovery                                           |
                      |  • Offline Mock Mode                                                   |
                      +-----------------------------------------------+------------------------+
                                                                      |
                                                                      v

                     +--------------------------------------------------------------------------+
                     |                       Visualization Engine                               |
                     |--------------------------------------------------------------------------|
                     |  • Recharts (Line / Bar)                                                 |
                     |  • KPI Renderer                                                          |
                     |  • Brazil SVG Map Heatmap                                                |
                     |  • Dynamic color scaling                                                 |
                     |  • Insight Drawer                                                        |
                     +--------------------------------------+-----------------------------------+
                                                        |
                                                        v

                       +------------------------------------------------------------------+
                       |                     Storage / Export Layer                       |
                       |------------------------------------------------------------------|
                       |  • LocalStorage chat memory                                       |
                       |  • PDF Export (html2canvas + jsPDF)                               |
                       |  • Bilingual output handling                                      |
                       +------------------------------------------------------------------+

The Maersk AI Data Analyst Copilot is built on a modular, high-performance architecture designed for scalability, reliability, and seamless AI-driven analytics. The system consists of four core layers — **Frontend**, **AI Layer**, **Backend**, and **Visualization Engine** — all orchestrated to deliver real-time insights from the Olist Brazilian e-commerce dataset across English and Portuguese-BR.

### **1. Frontend (Vite + React + TypeScript)**
- Maersk-branded UI built with TailwindCSS.
- Interactive chat interface with bilingual UX.
- Real-time visualizations:
  - Line & bar charts (Recharts)
  - KPI metric panels
  - Dynamic Brazil heatmap component
- Local chat history persistence.
- PDF export pipeline using `html2canvas` + `jsPDF`.

### **2. AI Intelligence Layer (Gemini + Google Search Grounding)**
- Gemini Pro (primary) + Flash fallback for high-availability.
- Smart intent routing for:
  - Data analytics → visualization mode
  - General questions → conversational search mode
- Google Search grounding for authoritative external answers.
- Strict JSON schema enforcement for visualization outputs.
- Bilingual NLP understanding for English + Portuguese-BR.

### **3. Backend (FastAPI + SQLite/CSV Dataset)**
- FastAPI serving structured endpoints mapped to Olist dataset tables.
- Query processor generating aggregated values for:
  - Orders by state
  - Revenue trends
  - Category distributions
  - Customer behavior metrics
- Clean business summaries to assist the AI in generating insights.
- CORS-enabled API with environment-based config.

### **4. Visualization Engine**
- Unified schema powering:
  - KPI cards
  - Bar & line charts
  - Brazil geo-map shading
- Intelligent formatting layer to convert raw backend output into AI-ready structures.
- Insight Drawer for deep interpretation of visual results.

### **5. Error Handling & Failover**
- Multi-layer fallback:
  - Model fail → Flash
  - JSON failure → Smart text summary
  - Total failure → Human-readable explanation
- Mock mode for offline/local development.
- Graceful degradation when external services are slow.

### **6. Localization Layer**
- Supports English and Portuguese-BR.
- Auto-detects input language and responds accordingly.
- Translation pipeline ensures UX consistency across components.


## Deliverables Summary

This repository includes a complete implementation of the Maersk AI Data Analyst Copilot, a bilingual (English + Portuguese-BR), AI-powered analytics assistant built for insight generation, visualization, and conversational knowledge retrieval.

⸻

**1. Frontend Application (React + Vite + TypeScript)**
	•	Fully Maersk-branded UI (colors, typography, spacing)
	•	Chat interface with real-time AI messaging
	•	Insight Drawer with contextual analytics
	•	KPI Cards, Charts, and Brazil Map visualization
	•	Bilingual UX layer (EN + PT-BR)
	•	LocalStorage-based chat history persistence
	•	PDF export using html2canvas + jsPDF

⸻

**2. AI Processing Layer (Gemini)**
	•	Smart Intent Router (Conversational ↔ Analytical)
	•	Strict schema-driven visualization mode
	•	Conversational mode with Google Search grounding
	•	Automatic fallback model + robust error handling
	•	Offline Mock Mode for stable development
	•	Bilingual understanding and response generation

⸻

**3. Backend Service (FastAPI + DuckDB / SQL)**
	•	API endpoints for Olist dataset insights
	•	SQL aggregations: revenue, orders, AOV, geography, trends
	•	Fast, structured JSON responses for visualizations
	•	Low-latency analytical API optimized for generative AI

⸻

**4. Data Visualization Engine**
	•	Dynamic time-series & categorical charts (Recharts)
	•	Interactive Brazil Map (SVG + color scale)
	•	KPI renderer with trends & deltas
	•	Schema-adaptive visual generation

⸻

**5. Bilingual Layer (EN / PT-BR)**
	•	Automatic language detection from user input
	•	Dual-language system prompts
	•	Localized summaries, KPIs, charts, and conversational text
	•	Seamless switching inside the chat interface

⸻

**6. System Architecture & Documentation**
	•	ASCII-based system architecture diagram
	•	Full README documentation
	•	Setup & installation guide
	•	Environment variable instructions
	•	Frontend–Backend–Gemini workflow explanation
	•	API documentation

⸻

**7. Deployment & DevOps Assets**
	•	Vite production build configuration
	•	.env.example for environment setup
	•	Optional Docker support (if enabled)
	•	Clear separation of front-end & back-end services

⸻

**8. Testing & Quality Assurance**
	•	Mock AI responses for testing
	•	Strict JSON schema validation for visuals
	•	Fallback verification scenarios
	•	Bilingual test cases
---

This section is ready for your GitHub README.  
Let me know if you want matching architecture diagrams (ASCII, Mermaid, or PNG).

