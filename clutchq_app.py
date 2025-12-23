import streamlit as st
import random
from datetime import datetime, timedelta
import pandas as pd

# Page Configuration
st.set_page_config(
    page_title="ClutchQ v3.0 - Stadium Map",
    page_icon="⚽",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS
st.markdown("""
<style>
    [data-testid="stMainBlockContainer"] {
        padding-top: 2rem;
    }   
    
    .header-title {
        text-align: center;
        font-size: 2.5rem;
        font-weight: 900;
        margin-bottom: 1rem;
        background: linear-gradient(90deg, #ffffff 70%, #30d158 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .status-container {
        background-color: #1c1c1e;
        padding: 2rem;
        border-radius: 20px;
        border: 1px solid #333333;
        margin: 1rem 0;
    }
    
    .status-text-main {
        font-size: 2.5rem;
        font-weight: 800;
        text-align: center;
        margin: 1rem 0;
    }
    
    .status-text-sub {
        font-size: 1rem;
        text-align: center;
        color: #8e8e93;
        margin: 0.5rem 0 1.5rem 0;
    }
    
    .recommendation-box {
        background-color: #2c2c2e;
        border-left: 4px solid #30d158;
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 10px;
    }
    
    .facility-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin: 1.5rem 0;
    }
    
    .facility-item {
        padding: 1rem;
        border-radius: 10px;
        text-align: center;
        font-weight: 600;
        border: 2px solid;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'game_status' not in st.session_state:
    st.session_state.game_status = None
if 'line_data' not in st.session_state:
    st.session_state.line_data = None

# Header
st.markdown('<div class="header-title">Clutch<span style="color: #30d158;">Q</span></div>', unsafe_allow_html=True)

# Navigation Tabs
col1, col2 = st.columns(2)
with col1:
    tab_game = st.button("🎮 Game Flow", use_container_width=True, key="tab_game")
with col2:
    tab_map = st.button("📍 Map & Lines", use_container_width=True, key="tab_map")

# Initialize tabs
if 'active_tab' not in st.session_state:
    st.session_state.active_tab = 'game'

if tab_game:
    st.session_state.active_tab = 'game'
if tab_map:
    st.session_state.active_tab = 'map'

# ============ TAB 1: GAME STATUS ============
if st.session_state.active_tab == 'game':
    st.markdown("---")
    
    col_sport = st.columns([1])[0]
    sport = st.selectbox(
        "Select Sport",
        ["🏈 NFL (Football)", "🏀 NBA (Basketball)", "⚾ MLB (Baseball)"],
        key="sport_selector"
    )
    
    st.markdown('<div class="status-container">', unsafe_allow_html=True)
    
    # Traffic Light Display
    col_lights = st.columns(3)
    with col_lights[0]:
        st.markdown('<div style="text-align: center; font-size: 3rem;">🔴</div>', unsafe_allow_html=True)
    with col_lights[1]:
        st.markdown('<div style="text-align: center; font-size: 3rem;">🟡</div>', unsafe_allow_html=True)
    with col_lights[2]:
        st.markdown('<div style="text-align: center; font-size: 3rem;">🟢</div>', unsafe_allow_html=True)
    
    # Button to scan game status
    if st.button("📊 Scan Game Status", use_container_width=True, key="scan_btn"):
        with st.spinner("Analyzing..."):
            import time
            time.sleep(1)
            
            # Generate random game status
            roll = random.random()
            
            if roll < 0.4:
                # GREEN - Go Now
                status_color = "🟢"
                main_text = "GO NOW!"
                
                sport_type = sport.split("(")[0].strip()
                if "NFL" in sport:
                    sub_text = "Orange Sleeve Guy on field (TV Timeout)."
                elif "NBA" in sport:
                    sub_text = "Official Review initiated (Est 3 mins)."
                else:
                    sub_text = "Pitching Change detected."
                
                status_type = "good"
                
            elif roll < 0.7:
                # RED - Stay Seated
                status_color = "🔴"
                main_text = "STAY SEATED"
                
                if "NFL" in sport:
                    sub_text = "Team in Red Zone. Scoring likely."
                elif "NBA" in sport:
                    sub_text = "Close game, under 2 minutes."
                else:
                    sub_text = "Bases loaded, full count."
                
                status_type = "warning"
                
            else:
                # YELLOW - Prepare
                status_color = "🟡"
                main_text = "PREPARE"
                sub_text = "Action is slowing. Get your shoes on."
                status_type = "info"
            
            st.session_state.game_status = {
                "color": status_color,
                "main": main_text,
                "sub": sub_text,
                "type": status_type
            }
    
    # Display stored game status
    if st.session_state.game_status:
        status = st.session_state.game_status
        
        col_center = st.columns([1])[0]
        with col_center:
            st.markdown(f'<div style="text-align: center; font-size: 4rem;">{status["color"]}</div>', unsafe_allow_html=True)
            st.markdown(f'<div class="status-text-main">{status["main"]}</div>', unsafe_allow_html=True)
            st.markdown(f'<div class="status-text-sub">{status["sub"]}</div>', unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)


# ============ TAB 2: MAP & LINES ============
elif st.session_state.active_tab == 'map':
    st.markdown("---")
    
    st.markdown('<div style="text-align: center; color: #8e8e93; font-size: 0.9rem; margin-bottom: 1rem;">📊 Live Wait Times • Section 100 Level</div>', unsafe_allow_html=True)
    
    # Facilities data
    facilities = {
        "spot1": {"name": "Section 101 Restroom", "emoji": "🚻", "type": "restroom"},
        "spot2": {"name": "Section 102 Restroom", "emoji": "🚻", "type": "restroom"},
        "spot3": {"name": "Section 103 Hot Dogs", "emoji": "🌭", "type": "food"},
        "spot4": {"name": "Section 104 Hot Dogs", "emoji": "🌭", "type": "food"},
        "spot5": {"name": "Section 105 Beer", "emoji": "🍺", "type": "beer"},
        "spot6": {"name": "Section 106 Beer", "emoji": "🍺", "type": "beer"},
    }
    
    # Refresh button
    if st.button("🔄 Refresh Line Data", use_container_width=True, key="refresh_btn"):
        st.session_state.line_data = {}
        
        best_spot = None
        for spot_id, facility in facilities.items():
            # Random 50/50 chance of being busy
            is_busy = random.random() > 0.5
            st.session_state.line_data[spot_id] = {
                "busy": is_busy,
                "wait_time": random.randint(10, 30) if is_busy else random.randint(1, 5)
            }
            
            if not is_busy and best_spot is None:
                best_spot = (spot_id, facility)
        
        st.session_state.best_spot = best_spot
    
    # Display facilities as cards
    if st.session_state.line_data:
        col_rows = st.columns(2)
        
        for idx, (spot_id, facility) in enumerate(facilities.items()):
            with col_rows[idx % 2]:
                data = st.session_state.line_data.get(spot_id, {})
                is_busy = data.get("busy", False)
                wait_time = data.get("wait_time", 0)
                
                if is_busy:
                    status_emoji = "🔴"
                    status_text = f"FULL ({wait_time}+ min)"
                    bg_color = "rgba(255, 69, 58, 0.1)"
                    border_color = "#ff453a"
                else:
                    status_emoji = "🟢"
                    status_text = f"EMPTY (<{wait_time} min)"
                    bg_color = "rgba(48, 209, 88, 0.1)"
                    border_color = "#30d158"
                
                st.markdown(f"""
                <div style="
                    background-color: {bg_color};
                    border: 2px solid {border_color};
                    border-radius: 12px;
                    padding: 1rem;
                    text-align: center;
                    margin-bottom: 0.5rem;
                ">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">{facility['emoji']}</div>
                    <div style="font-weight: 600; margin-bottom: 0.5rem;">{facility['name']}</div>
                    <div style="font-size: 1.1rem; font-weight: 600;">{status_emoji} {status_text}</div>
                </div>
                """, unsafe_allow_html=True)
        
        # Recommendation
        st.markdown("---")
        
        if st.session_state.best_spot:
            spot_id, facility = st.session_state.best_spot
            st.markdown(f"""
            <div class="recommendation-box">
                <div style="font-size: 0.85rem; color: #8e8e93; margin-bottom: 0.5rem;">✅ CLUTCHQ RECOMMENDATION</div>
                <div style="font-size: 1.1rem; font-weight: bold;">
                    <strong>{facility['name']}</strong> is empty right now.<br>
                    Walk time: 2 mins.
                </div>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown("""
            <div class="recommendation-box">
                <div style="font-size: 0.85rem; color: #8e8e93; margin-bottom: 0.5rem;">⚠️ CLUTCHQ RECOMMENDATION</div>
                <div style="font-size: 1.1rem; font-weight: bold;">
                    <strong>Everything is busy.</strong><br>
                    Wait 5 minutes for lines to clear.
                </div>
            </div>
            """, unsafe_allow_html=True)
        
        # Legend
        col_legend = st.columns(2)
        with col_legend[0]:
            st.markdown('<div style="text-align: center; color: #8e8e93; font-size: 0.9rem;">🟢 Empty (<2m)</div>', unsafe_allow_html=True)
        with col_legend[1]:
            st.markdown('<div style="text-align: center; color: #8e8e93; font-size: 0.9rem;">🔴 Full (>10m)</div>', unsafe_allow_html=True)
    else:
        st.info("📊 Click 'Refresh Line Data' to see live wait times")

# Footer
st.markdown("---")
st.markdown('<div style="text-align: center; color: #8e8e93; font-size: 0.85rem;">ClutchQ v3.0 • Stadium Line Management</div>', unsafe_allow_html=True)
