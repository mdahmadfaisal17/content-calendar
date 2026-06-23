const platforms = {

dribbble:{
title:"Dribbble",
info:"Posting Days: Monday • Thursday<br>Posting Time: 8:00 PM BST",
notes:"Focus on Brand Identity, Event Branding and high quality presentations.",
events:{
"2026-06-29":{text:"Full Brand Identity",class:"brand"},
"2026-07-02":{text:"Logo Presentation",class:"logo"},
"2026-07-06":{text:"Print Materials",class:"print"},
"2026-07-09":{text:"Digital Assets",class:"digital"},
"2026-07-13":{text:"Full Brand Identity",class:"brand"},
"2026-07-16":{text:"Logo Presentation",class:"logo"},
"2026-07-20":{text:"Print Materials",class:"print"},
"2026-07-23":{text:"Digital Assets",class:"digital"},
"2026-07-27":{text:"Full Brand Identity",class:"brand"},
"2026-07-30":{text:"Logo Presentation",class:"logo"}
}
},

linkedin:{
title:"LinkedIn",
info:"Posting Days: Tuesday • Thursday • Saturday<br>Posting Time: 7:00 PM BST",
notes:"Share branding insights, BTS content and project showcases.",
events:{
"2026-06-27":{text:"Personal Design Journey / Lesson",class:"showcase"},
"2026-06-30":{text:"Branding Insight",class:"insight"},
"2026-07-02":{text:"Behind The Work",class:"bts"},
"2026-07-04":{text:"Project Showcase",class:"showcase"},
"2026-07-07":{text:"Branding Insight",class:"insight"},
"2026-07-09":{text:"Behind The Work",class:"bts"},
"2026-07-11":{text:"Project Showcase",class:"showcase"},
"2026-07-14":{text:"Branding Insight",class:"insight"},
"2026-07-16":{text:"Behind The Work",class:"bts"},
"2026-07-18":{text:"Project Showcase",class:"showcase"},
"2026-07-21":{text:"Branding Insight",class:"insight"},
"2026-07-23":{text:"Behind The Work",class:"bts"},
"2026-07-25":{text:"Project Showcase",class:"showcase"},
"2026-07-28":{text:"Branding Insight",class:"insight"},
"2026-07-30":{text:"Behind The Work",class:"bts"}
}
},

huefb:{
title:"Hue FB",
info:"Posting Days: Tuesday • Friday • Sunday<br>Posting Time: 8:00 PM",
notes:"Engaging visual content and educational resources.",
events:{
"2026-06-26":{text:"Educational Content",class:"bts"},
"2026-06-28":{text:"Portfolio / Case Study",class:"showcase"},
"2026-07-03":{text:"Educational Content",class:"bts"},
"2026-07-05":{text:"Portfolio / Case Study",class:"showcase"},
"2026-07-07":{text:"Branding Insight",class:"insight"},
"2026-07-10":{text:"Educational Content",class:"bts"},
"2026-07-12":{text:"Portfolio / Case Study",class:"showcase"},
"2026-07-14":{text:"Branding Insight",class:"insight"},
"2026-07-17":{text:"Educational Content",class:"bts"},
"2026-07-19":{text:"Portfolio / Case Study",class:"showcase"},
"2026-07-21":{text:"Branding Insight",class:"insight"},
"2026-07-24":{text:"Educational Content",class:"bts"},
"2026-07-26":{text:"Portfolio / Case Study",class:"showcase"},
"2026-07-28":{text:"Branding Insight",class:"insight"},
"2026-07-31":{text:"Educational Content",class:"bts"}
}
},

fafb:{
title:"FA FB",
info:"Posting Days: Monday • Wednesday • Friday • Sunday<br>Posting Time: 8:00 PM",
notes:"Personal brand content and design insights.",
events:{
"2026-06-26":{text:"Personal Story / Lesson",class:"logo"},
"2026-06-28":{text:"Portfolio Showcase",class:"showcase"},
"2026-07-01":{text:"Behind The Work",class:"bts"},
"2026-07-03":{text:"Personal Story / Lesson",class:"logo"},
"2026-07-05":{text:"Portfolio Showcase",class:"showcase"},
"2026-07-06":{text:"Branding Opinion",class:"insight"},
"2026-07-08":{text:"Behind The Work",class:"bts"},
"2026-07-10":{text:"Personal Story / Lesson",class:"logo"},
"2026-07-12":{text:"Portfolio Showcase",class:"showcase"},
"2026-07-13":{text:"Branding Opinion",class:"insight"},
"2026-07-15":{text:"Behind The Work",class:"bts"},
"2026-07-17":{text:"Personal Story / Lesson",class:"logo"},
"2026-07-19":{text:"Portfolio Showcase",class:"showcase"},
"2026-07-20":{text:"Branding Opinion",class:"insight"},
"2026-07-22":{text:"Behind The Work",class:"bts"},
"2026-07-24":{text:"Personal Story / Lesson",class:"logo"},
"2026-07-26":{text:"Portfolio Showcase",class:"showcase"},
"2026-07-27":{text:"Branding Opinion",class:"insight"},
"2026-07-29":{text:"Behind The Work",class:"bts"},
"2026-07-31":{text:"Personal Story / Lesson",class:"logo"}
}
}

};

// Unique color mapping for each topic
const topicColors = {
    "Full Brand Identity": "color-1",
    "Logo Presentation": "color-2",
    "Print Materials": "color-3",
    "Digital Assets": "color-4",
    "Personal Design Journey / Lesson": "color-5",
    "Branding Insight": "color-6",
    "Behind The Work": "color-7",
    "Project Showcase": "color-8",
    "Educational Content": "color-9",
    "Portfolio / Case Study": "color-10",
    "Personal Story / Lesson": "color-11",
    "Portfolio Showcase": "color-12",
    "Branding Opinion": "color-13"
};

let currentPlatform = "";
let currentMonth = "";
let allEvents = {};
let currentModalDate = "";
let currentModalPlatform = "";

// Load status from localStorage
function getStatus(platform, date) {
    const statusKey = `status_${platform}_${date}`;
    return localStorage.getItem(statusKey) || "pending";
}

// Save status to localStorage
function setStatus(platform, date, status) {
    const statusKey = `status_${platform}_${date}`;
    localStorage.setItem(statusKey, status);
}

// Reset all statuses to pending
function resetAllStatuses() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if(key.startsWith('status_')) {
            localStorage.removeItem(key);
        }
    });
}

function saveStatus() {
    const statusDropdown = document.getElementById("statusDropdown");
    const newStatus = statusDropdown.value;
    if (currentModalDate && currentModalPlatform) {
        setStatus(currentModalPlatform, currentModalDate, newStatus);
        // Refresh calendar to show updated status
        loadPlatform(currentPlatform);
    }
    closeModal();
}

function openUpcomingModal(dateKey, platformKey) {
    // Find the platform data
    let platformName = "";
    Object.keys(platforms).forEach(key => {
        if(platforms[key].title === platformKey) {
            platformName = key;
        }
    });
    
    if(!platformName) return;
    
    // Set current platform
    currentPlatform = platformName;
    
    // Parse the date (format: 2026-06-29)
    const dateParts = dateKey.split('-');
    const year = dateParts[0];
    const monthNum = dateParts[1];
    const day = parseInt(dateParts[2]);
    
    // Determine month name
    const month = monthNum === "06" ? "june" : "july";
    
    // Open the modal
    openModal(day, month);
}

function openModal(day, month){
    const modal = document.getElementById("modal");
    const platform = platforms[currentPlatform];
    
    document.getElementById("modalPlatform").innerHTML = platform.title;
    document.getElementById("modalDate").innerHTML = `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}, 2026`;
    
    let topicDisplay = "";
    const events = platform.events;
    const monthNum = month === "june" ? "06" : "07";
    const fullDate = `2026-${monthNum}-${String(day).padStart(2, '0')}`;
    
    currentModalDate = fullDate;
    currentModalPlatform = currentPlatform;
    
    // Display topic or "No posts" message
    if(events[fullDate]){
        topicDisplay = `<div class="modal-post-item">${events[fullDate].text}</div>`;
    } else {
        topicDisplay = `<div class="modal-no-posts">No posts scheduled for this day</div>`;
    }
    
    document.getElementById("topicDisplay").innerHTML = topicDisplay;
    
    // Hide edit and color buttons if no posts scheduled
    if(!events[fullDate]){
        document.getElementById("editTopicBtn").style.display = "none";
        document.getElementById("colorPickerBtn").style.display = "none";
    } else {
        document.getElementById("editTopicBtn").style.display = "block";
        document.getElementById("colorPickerBtn").style.display = "block";
        initializeColorPicker();
    }
    
    // Reset edit mode
    cancelEditTopic();
    
    // Set current status in dropdown
    const currentStatus = getStatus(currentPlatform, fullDate);
    document.getElementById("statusDropdown").value = currentStatus;
    
    modal.classList.add("active");
}

function toggleEditTopic(){
    const topicDisplay = document.getElementById("topicDisplay");
    const editContainer = document.getElementById("editTopicContainer");
    
    if(editContainer.style.display === "none"){
        // Enter edit mode
        const topicText = topicDisplay.querySelector(".modal-post-item").textContent;
        document.getElementById("topicInput").value = topicText;
        topicDisplay.style.display = "none";
        editContainer.style.display = "flex";
        document.getElementById("topicInput").focus();
    }
}

function saveTopicName(){
    const newTopicName = document.getElementById("topicInput").value.trim();
    
    if(!newTopicName){
        alert("Topic name cannot be empty");
        return;
    }
    
    if(currentModalDate && currentModalPlatform){
        // Update the platform events object
        const platform = platforms[currentModalPlatform];
        if(platform && platform.events[currentModalDate]){
            const oldTopic = platform.events[currentModalDate].text;
            platform.events[currentModalDate].text = newTopicName;
            
            // Save to localStorage as backup
            const topicKey = `topic_${currentModalPlatform}_${currentModalDate}`;
            localStorage.setItem(topicKey, newTopicName);
            
            // Update the display
            document.getElementById("topicDisplay").innerHTML = `<div class="modal-post-item">${newTopicName}</div>`;
            cancelEditTopic();
            
            // Refresh the calendar
            loadPlatform(currentPlatform);
        }
    }
}

function cancelEditTopic(){
    document.getElementById("topicDisplay").style.display = "block";
    document.getElementById("editTopicContainer").style.display = "none";
}

// ==================== Color Picker Functions ====================
// Color mapping for each color class to hex values
const colorClassToHex = {
    "color-1": "#f0edff",   // Purple light
    "color-2": "#edf4ff",   // Blue light
    "color-3": "#fff4ea",   // Orange light
    "color-4": "#ebfff1",   // Green light
    "color-5": "#fce7f3",   // Pink light
    "color-6": "#fef08a",   // Yellow light
    "color-7": "#e0e7ff",   // Indigo light
    "color-8": "#f3e8ff",   // Purple light 2
    "color-9": "#dbeafe",   // Sky light
    "color-10": "#fed7aa",  // Orange light 2
    "color-11": "#c7d2fe",  // Indigo light 2
    "color-12": "#bfdbfe",  // Blue light 2
    "color-13": "#86efac"   // Green light 2
};

const hexToColorClass = Object.fromEntries(
    Object.entries(colorClassToHex).map(([k, v]) => [v.toLowerCase(), k])
);

let currentSelectedColor = "#f0edff";

function initializeColorPicker(){
    const colorKey = `topicColor_${currentModalPlatform}_${currentModalDate}`;
    const savedColor = localStorage.getItem(colorKey);
    const customColorKey = `customColor_${currentModalPlatform}_${currentModalDate}`;
    const customHexColor = localStorage.getItem(customColorKey);
    const topicText = platforms[currentModalPlatform]?.events[currentModalDate]?.text;
    const topicColorClass = topicColors[topicText];
    
    let hexColor = "#f0edff"; // default
    
    // Check for custom hex color first
    if(customHexColor){
        hexColor = customHexColor;
    } else if(savedColor && savedColor !== "custom"){
        // If it's a color class
        hexColor = colorClassToHex[savedColor] || hexColor;
    } else if(topicColorClass){
        hexColor = colorClassToHex[topicColorClass] || hexColor;
    }
    
    currentSelectedColor = hexColor;
    document.getElementById("hexInput").value = hexColor;
    
    // Convert hex to HSL to set the correct hue and position the circle
    const hsl = hexToHsl(hexColor);
    document.getElementById("colorHue").value = hsl.h;
    updateColorGradient(hsl.h);
    updateColorSelectorPosition(hsl.s, hsl.l);
}

function openColorPickerModal(){
    initializeColorPicker();
    renderColorPresets();
    document.getElementById("colorPickerOverlay").classList.add("active");
}

function closeColorPickerModal(){
    document.getElementById("colorPickerOverlay").classList.remove("active");
}

function renderColorPresets(){
    const container = document.querySelector(".preset-colors");
    const presetHexColors = Object.values(colorClassToHex);
    
    container.innerHTML = '';
    presetHexColors.forEach(hexColor => {
        const btn = document.createElement("button");
        btn.className = "preset-color-btn";
        btn.style.background = hexColor;
        if(hexColor.toLowerCase() === currentSelectedColor.toLowerCase()){
            btn.classList.add("selected");
        }
        btn.onclick = () => selectPresetColor(hexColor, btn);
        container.appendChild(btn);
    });
}

function selectPresetColor(hexColor, btn){
    currentSelectedColor = hexColor;
    document.getElementById("hexInput").value = hexColor;
    
    document.querySelectorAll(".preset-color-btn").forEach(b => {
        b.classList.remove("selected");
    });
    btn.classList.add("selected");
}

function updateColorGradient(hue){
    const gradient = document.getElementById("colorGradient");
    gradient.style.background = `linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`;
}

function applySelectedColor(){
    const hexColor = document.getElementById("hexInput").value.trim();
    
    if(!hexColor.match(/^#[0-9A-F]{6}$/i)){
        alert("Please enter a valid hex color (e.g., #FF0000)");
        return;
    }
    
    if(currentModalDate && currentModalPlatform){
        const platform = platforms[currentModalPlatform];
        if(platform && platform.events[currentModalDate]){
            // Store the custom hex color directly
            const customColorKey = `customColor_${currentModalPlatform}_${currentModalDate}`;
            localStorage.setItem(customColorKey, hexColor);
            
            // Also store a marker that this event has a custom color
            const colorKey = `topicColor_${currentModalPlatform}_${currentModalDate}`;
            localStorage.setItem(colorKey, "custom");
            
            // Refresh the calendar
            loadPlatform(currentPlatform);
            closeColorPickerModal();
        }
    }
}

function findClosestColorClass(hexColor){
    const colorClasses = Object.keys(colorClassToHex);
    return colorClasses[0]; // Default fallback
}

function hslToHex(h, s, l){
    // Convert HSL to RGB
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    let r, g, b;
    
    if(s === 0){
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    const toHex = (x) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    
    return "#" + toHex(r) + toHex(g) + toHex(b);
}

function hexToHsl(hex){
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex to RGB
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if(max === min){
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch(max){
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function updateColorSelectorPosition(saturation, brightness){
    const circle = document.getElementById("colorSelectorCircle");
    const gradient = document.getElementById("colorGradient");
    
    if(!circle || !gradient) return;
    
    // Position based on saturation (0-100%) left to right
    const x = (saturation / 100) * 100;
    
    // Position based on brightness (100-0%) top to bottom
    const y = ((100 - brightness) / 100) * 100;
    
    circle.style.left = x + "%";
    circle.style.top = y + "%";
}

function hslToHex(h, s, l){
    // Convert HSL to RGB
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    let r, g, b;
    
    if(s === 0){
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    const toHex = (x) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    
    return "#" + toHex(r) + toHex(g) + toHex(b);
}

function handleGradientClick(e){
    const gradient = document.getElementById("colorGradient");
    if(!gradient) return;
    
    const rect = gradient.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate saturation (0-100%) from left to right
    const saturation = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    // Calculate brightness (100-0%) from top to bottom
    const brightness = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
    
    // Get current hue from slider
    const hueSlider = document.getElementById("colorHue");
    const hue = hueSlider ? parseInt(hueSlider.value) : 0;
    
    // Convert HSL to hex
    const hexColor = hslToHex(hue, saturation, brightness);
    
    // Update selected color
    currentSelectedColor = hexColor;
    document.getElementById("hexInput").value = hexColor;
    
    // Update circle position
    updateColorSelectorPosition(saturation, brightness);
    
    // Update preset buttons
    document.querySelectorAll(".preset-color-btn").forEach(btn => {
        btn.classList.remove("selected");
    });
}

function closeModal(){
    document.getElementById("modal").classList.remove("active");
}

function buildCalendar(containerId, monthDays, startOffset, events, month){

    const container = document.getElementById(containerId);
    currentMonth = month;
    allEvents = events;

    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    let html = '';

    days.forEach(day=>{
        html += `<div class="day-name">${day}</div>`;
    });

    for(let i=0;i<startOffset;i++){
        html += `<div class="day empty"></div>`;
    }

    for(let day=1; day<=monthDays; day++){

        let className = "";
        let content = "";

        const monthNum = month === "june" ? "06" : "07";
        const fullDate = `2026-${monthNum}-${String(day).padStart(2, '0')}`;
        
        if(events[fullDate]){
            content = events[fullDate].text;
            // Get color from localStorage first, then fall back to topicColors, then class
            const colorKey = `topicColor_${currentPlatform}_${fullDate}`;
            const savedColor = localStorage.getItem(colorKey);
            className = savedColor || topicColors[content] || events[fullDate].class;
        }

        const status = getStatus(currentPlatform, fullDate);
        const statusColor = status === "done" ? "#22c55e" : status === "working" ? "#4169E1" : "#ef4444";
        const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
        
        // Check for custom hex color
        let inlineStyle = "";
        if(className === "custom"){
            const customColorKey = `customColor_${currentPlatform}_${fullDate}`;
            const customHexColor = localStorage.getItem(customColorKey);
            if(customHexColor){
                inlineStyle = ` style="background-color: ${customHexColor};"`;
                className = ""; // Don't apply class since we have inline style
            }
        }

        html += `
        <div class="day ${className}"${inlineStyle} onclick="openModal(${day},'${month}')">
            <div class="day-header">
                <div class="date">${day}</div>
                <div class="status-badge" style="color: ${statusColor};">${statusLabel}</div>
            </div>
            ${
                content
                ? `<div class="day-content">${content}</div>`
                : ``
            }
        </div>
        `;
    }

    container.innerHTML = html;

}

function getNext7Days(){
    const today = new Date();
    const days = [];
    for(let i = 0; i < 7; i++){
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        days.push(`${year}-${month}-${day}`);
    }
    return days;
}

function collectUpcomingEvents(){
    const next7Days = getNext7Days();
    const eventsByDate = {};
    
    Object.keys(platforms).forEach(platformName => {
        if(platformName === "upcoming") return;
        
        const platformData = platforms[platformName];
        const events = platformData.events;
        
        Object.keys(events).forEach(dateKey => {
            if(next7Days.includes(dateKey)){
                if(!eventsByDate[dateKey]){
                    eventsByDate[dateKey] = [];
                }
                const status = getStatus(platformName, dateKey);
                eventsByDate[dateKey].push({
                    platform: platformData.title,
                    text: events[dateKey].text,
                    class: events[dateKey].class,
                    info: platformData.info,
                    status: status,
                    platformKey: platformName,
                    dateKey: dateKey
                });
            }
        });
    });
    
    return eventsByDate;
}

function renderUpcomingEvents(){
    const eventsByDate = collectUpcomingEvents();
    const sortedDates = Object.keys(eventsByDate).sort();
    const container = document.getElementById("upcomingGrid");
    
    if(sortedDates.length === 0){
        container.innerHTML = '<div class="upcoming-empty">No content scheduled for the next 7 days.</div>';
        return;
    }
    
    let html = '';
    const colorLegend = {};
    
    sortedDates.forEach(dateKey => {
        const date = new Date(dateKey + 'T00:00:00');
        const formattedDate = date.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
        const events = eventsByDate[dateKey];
        
        html += `
        <div class="upcoming-card">
            <div class="upcoming-card-date">${formattedDate}</div>
            <div class="upcoming-card-items">
        `;
        
        events.forEach(event => {
            const statusColor = event.status === "done" ? "#22c55e" : event.status === "working" ? "#4169E1" : "#ef4444";
            const statusLabel = event.status.charAt(0).toUpperCase() + event.status.slice(1);
            const timeMatch = event.info.match(/(\d{1,2}:\d{2}\s(?:AM|PM|BST))/);
            const postingTime = timeMatch ? timeMatch[1] : "N/A";
            
            // Get color from localStorage first, then fall back to topicColors
            const colorKey = `topicColor_${event.platformKey}_${event.dateKey}`;
            const savedColor = localStorage.getItem(colorKey);
            let colorClass = savedColor || topicColors[event.text] || "color-1";
            
            // Check for custom hex color
            let inlineStyle = "";
            if(colorClass === "custom"){
                const customColorKey = `customColor_${event.platformKey}_${event.dateKey}`;
                const customHexColor = localStorage.getItem(customColorKey);
                if(customHexColor){
                    inlineStyle = ` style="background-color: ${customHexColor};"`;
                    colorClass = ""; // Don't apply class since we have inline style
                }
            }
            
            // Collect color legend
            if (!colorLegend[event.platform]) {
                colorLegend[event.platform] = {};
            }
            colorLegend[event.platform][event.text] = colorClass;
            
            html += `
            <div class="upcoming-item ${colorClass}"${inlineStyle} onclick="openUpcomingModal('${event.dateKey}', '${event.platform}')">
                <div class="upcoming-item-header">
                    <div class="upcoming-platform">${event.platform}</div>
                    <div class="upcoming-status" style="color: ${statusColor};">${statusLabel}</div>
                </div>
                <div class="upcoming-item-title">${event.text}</div>
                <div class="upcoming-item-time">${postingTime}</div>
            </div>
            `;
        });
        
        html += `
            </div>
        </div>
        `;
    });
    
    container.innerHTML = html;
    renderColorLegend(colorLegend);
}

function hideCalendars(){
    document.getElementById("juneCalendar").parentElement.style.display = "none";
    document.getElementById("julyCalendar").parentElement.style.display = "none";
    document.getElementById("notes").parentElement.style.display = "none";
}

function showCalendars(){
    document.getElementById("juneCalendar").parentElement.style.display = "block";
    document.getElementById("julyCalendar").parentElement.style.display = "block";
    document.getElementById("notes").parentElement.style.display = "block";
}

function getUniqueContentTypes(events){
    const uniqueTypes = new Set();
    
    Object.keys(events).forEach(dateKey => {
        uniqueTypes.add(events[dateKey].text);
    });
    
    return Array.from(uniqueTypes).sort();
}

function generatePlatformNotes(platformName, events){
    const contentTypes = getUniqueContentTypes(events);
    
    if(contentTypes.length === 0){
        return "No content scheduled yet.";
    }
    
    let html = `<strong>${platformName} Notes</strong><br><br>Content Types:<br>`;
    html += contentTypes.map(type => `• ${type}`).join('<br>');
    
    return html;
}

function generateUpcomingNotes(){
    const platformsWithContent = new Set();
    
    Object.keys(platforms).forEach(platformName => {
        if(platformName === "upcoming") return;
        
        const events = platforms[platformName].events;
        if(Object.keys(events).length > 0){
            platformsWithContent.add(platforms[platformName].title);
        }
    });
    
    let html = `<strong>Upcoming Dashboard</strong><br><br>Content Sources:<br>`;
    html += Array.from(platformsWithContent).sort().map(platform => `• ${platform}`).join('<br>');
    
    return html;
}

function loadPlatform(name){

    if(name === "upcoming"){
        currentPlatform = name;
        document.getElementById("title").innerHTML = "Upcoming Content";
        document.getElementById("info").innerHTML = "";
        document.getElementById("notes").innerHTML = generateUpcomingNotes();
        
        hideCalendars();
        document.getElementById("upcomingSection").classList.add("active");
        
        renderUpcomingEvents();
        return;
    }
    
    document.getElementById("upcomingSection").classList.remove("active");
    showCalendars();
    
    currentPlatform = name;
    const data = platforms[name];

    document.getElementById("title").innerHTML = data.title;
    document.getElementById("info").innerHTML = data.info;
    document.getElementById("notes").innerHTML = generatePlatformNotes(data.title, data.events);

    buildCalendar(
        "juneCalendar",
        30,
        1,
        data.events,
        "june"
    );

    buildCalendar(
        "julyCalendar",
        31,
        3,
        data.events,
        "july"
    );

}

function switchTab(event,name){

    document.querySelectorAll('.pill')
    .forEach(btn=>btn.classList.remove('active'));

    event.target.classList.add('active');

    loadPlatform(name);

}

function renderColorLegend(colorLegend) {
    const legendContainer = document.getElementById("upcomingLegend");
    if (!legendContainer) return;
    
    let html = '<div class="legend-title">Content Categories</div>';
    
    Object.keys(colorLegend).sort().forEach(platform => {
        html += `<div class="legend-section">`;
        html += `<div class="legend-platform">${platform}</div>`;
        
        Object.keys(colorLegend[platform]).forEach(topicName => {
            const colorClass = colorLegend[platform][topicName];
            html += `
            <div class="legend-item">
                <div class="legend-color ${colorClass}"></div>
                <div class="legend-text">${topicName}</div>
            </div>
            `;
        });
        
        html += '</div>';
    });
    
    legendContainer.innerHTML = html;
}

// Reset all statuses to pending on page load
resetAllStatuses();

loadPlatform("upcoming");

// ==================== Color Picker Event Listeners ====================
document.addEventListener("DOMContentLoaded", function(){
    // Color gradient click
    const colorGradient = document.getElementById("colorGradient");
    if(colorGradient){
        colorGradient.addEventListener("click", handleGradientClick);
    }
    
    // Hue slider change
    const hueSlider = document.getElementById("colorHue");
    if(hueSlider){
        hueSlider.addEventListener("input", function(){
            updateColorGradient(this.value);
        });
    }
    
    // Hex input change
    const hexInput = document.getElementById("hexInput");
    if(hexInput){
        hexInput.addEventListener("input", function(){
            let hex = this.value;
            if(!hex.startsWith("#")){
                hex = "#" + hex;
            }
            if(hex.match(/^#[0-9A-F]{6}$/i)){
                currentSelectedColor = hex;
                
                // Convert hex to HSL
                const hsl = hexToHsl(hex);
                
                // Update hue slider
                document.getElementById("colorHue").value = hsl.h;
                
                // Update gradient to reflect new hue
                updateColorGradient(hsl.h);
                
                // Update circle position
                updateColorSelectorPosition(hsl.s, hsl.l);
                
                // Deselect preset buttons
                document.querySelectorAll(".preset-color-btn").forEach(btn => {
                    btn.classList.remove("selected");
                });
            }
        });
    }
});

// Click outside to close color picker
document.addEventListener("click", function(e){
    const overlay = document.getElementById("colorPickerOverlay");
    if(overlay && overlay.classList.contains("active") && e.target === overlay){
        closeColorPickerModal();
    }
});
