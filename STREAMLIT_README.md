# ClutchQ Streamlit Web App

A modern Streamlit web application for managing stadium lines and game flow monitoring.

## Features

- **Game Flow Tab**: Real-time game status monitoring with color-coded alerts
  - 🟢 GO NOW - Optimal time to leave your seat
  - 🟡 PREPARE - Action is slowing down
  - 🔴 STAY SEATED - Scoring play happening
  
- **Map & Lines Tab**: Live wait time tracking for stadium amenities
  - Restrooms
  - Food stations
  - Beverage stands
  - Color-coded availability indicators

- **Multi-Sport Support**: NFL, NBA, MLB with sport-specific insights

## Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Setup

1. Navigate to the project directory:
```bash
cd "New folder/ClutchQ"
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the App

```bash
streamlit run clutchq_app.py
```

The app will open in your default browser at `http://localhost:8501`

## Usage

### Game Flow Tab
1. Select your sport (NFL, NBA, or MLB)
2. Click "Scan Game Status" to analyze current game tempo
3. View the traffic light indicators and recommendations

### Map & Lines Tab
1. Click "Refresh Line Data" to fetch current wait times
2. View color-coded facility status:
   - 🟢 Green = Short wait times (<2 min)
   - 🔴 Red = Long wait times (>10 min)
3. Follow ClutchQ's recommendation for the best route

## Features

- Real-time status updates
- Sport-specific game insights
- Interactive facility selection
- Wait time recommendations
- Responsive design

## Technical Stack

- **Frontend**: Streamlit
- **Backend**: Python
- **Styling**: Custom CSS via Streamlit markdown

---
ClutchQ v3.0 - Stadium Line Management System
