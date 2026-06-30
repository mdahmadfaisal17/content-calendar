const platforms = {

dribbble:{
title:"Dribbble",
icon:"icon/dribbble.png",
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
icon:"icon/Linkedin.png",
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
title:"HueSixteen",
icon:"icon/HueSixteen.png",
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
title:"Faysal",
icon:"icon/Faysal.png",
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

// Global state
let currentPlatform = "";
let currentMonth = "";
let allEvents = {};
let currentModalDate = "";
let currentModalPlatform = "";
let activeTabBeforeModal = ""; // Track which tab was active before opening modal
let postStatuses = {}; // Store status from MongoDB: { "platform_date": {_id, status} }

// ==================== API Calls ====================

async function fetchPostStatuses() {
    try {
        const response = await fetch('/api/posts');
        const result = await response.json();
        
        if (result.success && result.data) {
            // Build a lookup object: key = "platform_date", value = { _id, status, topic, color }
            postStatuses = {};
            result.data.forEach(post => {
                if (post.platform && post.date) {
                    const key = `${post.platform}_${post.date}`;
                    postStatuses[key] = {
                        _id: post._id,
                        status: post.status || 'pending',
                        topic: post.topic || null,
                        color: post.color || null,
                        note: post.note || null
                    };
                }
            });
            console.log('✓ Loaded post statuses from MongoDB');
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

async function savePostStatus(platform, date, topic, status, color = null, note = null) {
    try {
        const key = `${platform}_${date}`;
        
        // Check if post exists
        if (postStatuses[key]) {
            // Update existing post
            const response = await fetch(`/api/posts/${postStatuses[key]._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status, topic, color, note })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    postStatuses[key].status = status;
                    postStatuses[key].topic = topic;
                    postStatuses[key].color = color;
                    postStatuses[key].note = note;
                    console.log(`✓ Updated ${key}: status=${status}, topic=${topic}, color=${color}`);
                } else {
                    console.error(`✗ Backend error: ${result.error}`);
                }
            } else {
                console.error(`✗ HTTP ${response.status} updating ${key}`);
            }
        } else {
            // Create new post
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    platform,
                    date,
                    topic,
                    status,
                    color,
                    note
                })
            });
            
            const result = await response.json();
            if (result.success) {
                postStatuses[key] = {
                    _id: result.data._id,
                    status: status,
                    topic: topic,
                    color: color,
                    note: note
                };
                console.log(`✓ Created new post for ${key}`);
            } else {
                console.error(`✗ Error creating post: ${result.error}`);
            }
        }
        
    } catch (error) {
        console.error('Error saving post status:', error);
    }
}

async function refreshCurrentView() {
    await fetchPostStatuses();

    if (activeTabBeforeModal === "upcoming") {
        loadPlatform("upcoming");
        activeTabBeforeModal = "";
        return;
    }

    loadPlatform(currentPlatform);
}

// ==================== Status Management ====================

function getStatus(platform, date) {
    const key = `${platform}_${date}`;
    return postStatuses[key]?.status || 'pending';
}

function getTopic(platform, date) {
    const key = `${platform}_${date}`;
    return postStatuses[key]?.topic || null;
}

function getColor(platform, date) {
    const key = `${platform}_${date}`;
    return postStatuses[key]?.color || null;
}

function getNote(platform, date) {
    const key = `${platform}_${date}`;
    return postStatuses[key]?.note || '';
}

async function saveStatus() {
    const statusDropdown = document.getElementById("statusDropdown");
    const newStatus = statusDropdown.value;
    const noteInput = document.getElementById("noteInput");
    const note = noteInput ? noteInput.value.trim() : '';
    
    if (currentModalDate && currentModalPlatform) {
        // Get the topic from database first, then fall back to platform events
        const dbTopic = getTopic(currentModalPlatform, currentModalDate);
        const platform = platforms[currentModalPlatform];
        const topic = dbTopic || platform?.events[currentModalDate]?.text || 'Unknown Topic';
        
        // Get color to preserve it
        const currentColor = getColor(currentModalPlatform, currentModalDate);
        
        await savePostStatus(currentModalPlatform, currentModalDate, topic, newStatus, currentColor, note);
        await refreshCurrentView();
    }
    closeModal();
}

// ==================== Modal Management ====================

function openUpcomingModal(dateKey, platformKey) {
    // Find the platform data
    let platformName = "";
    Object.keys(platforms).forEach(key => {
        if(platforms[key].title === platformKey) {
            platformName = key;
        }
    });
    
    if(!platformName) return;
    
    // Save the active tab before changing platform
    activeTabBeforeModal = currentPlatform;
    
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
        // Get topic from database first, then fall back to original topic
        const dbTopic = getTopic(currentPlatform, fullDate);
        const displayTopic = dbTopic || events[fullDate].text;
        topicDisplay = `<div class="modal-post-item">${displayTopic}</div>`;
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

    const noteInput = document.getElementById("noteInput");
    if(noteInput){
        noteInput.value = getNote(currentPlatform, fullDate);
    }
    
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

async function saveTopicName(){
    const newTopicName = document.getElementById("topicInput").value.trim();
    
    if(!newTopicName){
        alert("Topic name cannot be empty");
        return;
    }
    
    if(currentModalDate && currentModalPlatform){
        // Update the platform events object for local UI display
        const platform = platforms[currentModalPlatform];
        if(platform && platform.events[currentModalDate]){
            const oldTopic = platform.events[currentModalDate].text;
            
            // Get the current color to preserve it
            const currentColor = getColor(currentModalPlatform, currentModalDate);
            const currentNote = getNote(currentModalPlatform, currentModalDate);
            
            // Save to database via API
            await savePostStatus(currentModalPlatform, currentModalDate, newTopicName, getStatus(currentModalPlatform, currentModalDate), currentColor, currentNote);
            await refreshCurrentView();
            
            // Close the modal to refresh with updated data
            closeModal();
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
    const dbColor = getColor(currentModalPlatform, currentModalDate);
    const topicText = getTopic(currentModalPlatform, currentModalDate) || platforms[currentModalPlatform]?.events[currentModalDate]?.text;
    const topicColorClass = topicColors[topicText];
    
    let hexColor = "#f0edff"; // default
    
    // Check for custom hex color from database first
    if(dbColor){
        hexColor = dbColor;
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

async function applySelectedColor(){
    const hexColor = document.getElementById("hexInput").value.trim();
    
    if(!hexColor.match(/^#[0-9A-F]{6}$/i)){
        alert("Please enter a valid hex color (e.g., #FF0000)");
        return;
    }
    
    if(currentModalDate && currentModalPlatform){
        const platform = platforms[currentModalPlatform];
        if(platform && platform.events[currentModalDate]){
            // Get the current topic from database
            const currentTopic = getTopic(currentModalPlatform, currentModalDate) || platform.events[currentModalDate].text;
            const currentStatus = getStatus(currentModalPlatform, currentModalDate);
            const currentNote = getNote(currentModalPlatform, currentModalDate);
            
            // Save color through API
            await savePostStatus(currentModalPlatform, currentModalDate, currentTopic, currentStatus, hexColor, currentNote);
            await refreshCurrentView();
            
            // Close both modals to refresh with updated data
            closeColorPickerModal();
            closeModal();
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

// ==================== Calendar Rendering ====================

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
            // Get topic from database first, then fall back to original event topic
            const dbTopic = getTopic(currentPlatform, fullDate);
            content = dbTopic || events[fullDate].text;
            
            // Get color from database, then fall back to topicColors mapping
            const dbColor = getColor(currentPlatform, fullDate);
            className = dbColor ? "custom" : (topicColors[content] || events[fullDate].class);
        }

        const status = getStatus(currentPlatform, fullDate);
        const statusColor = status === "done" ? "#22c55e" : status === "working" ? "#4169E1" : "#ef4444";
        const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
        
        // Check for custom hex color from database
        let inlineStyle = "";
        const dbColor = getColor(currentPlatform, fullDate);
        if(dbColor){
            inlineStyle = ` style="background-color: ${dbColor};"`;
            className = ""; // Don't apply class since we have inline style
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
            const status = getStatus(platformName, dateKey);
            // Show if: within next 7 days OR status is "working"
            if(next7Days.includes(dateKey) || status === "working"){
                if(!eventsByDate[dateKey]){
                    eventsByDate[dateKey] = [];
                }
                // Get topic from database first, then from events
                const dbTopic = getTopic(platformName, dateKey);
                const displayText = dbTopic || events[dateKey].text;
                
                eventsByDate[dateKey].push({
                    platform: platformData.title,
                    icon: platformData.icon,
                    text: displayText,
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
            
            // Get color from database first, then fall back to topicColors
            const dbColor = getColor(event.platformKey, event.dateKey);
            let colorClass = topicColors[event.text] || "color-1";
            
            // Check for custom hex color from database
            let inlineStyle = "";
            if(dbColor){
                inlineStyle = ` style="background-color: ${dbColor};"`;
                colorClass = ""; // Don't apply class since we have inline style
            }
            
            // Collect color legend
            if (!colorLegend[event.platform]) {
                colorLegend[event.platform] = {};
            }
            colorLegend[event.platform][event.text] = colorClass;
            
            html += `
            <div class="upcoming-item ${colorClass}"${inlineStyle} onclick="openUpcomingModal('${event.dateKey}', '${event.platform}')">
                <div class="upcoming-item-header">
                    <div class="upcoming-platform-wrap">
                        <img class="upcoming-platform-icon" src="${event.icon}" alt="" aria-hidden="true">
                        <div class="upcoming-platform">${event.platform}</div>
                    </div>
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

function loadPlatform(name){

    const platformCard = document.getElementById("platformCard");

    if(name === "upcoming"){
        currentPlatform = name;
        if(platformCard){
            platformCard.style.display = "none";
        }
        document.getElementById("info").innerHTML = "";
        document.getElementById("notes").innerHTML = generateUpcomingNotes();
        
        hideCalendars();
        document.getElementById("upcomingSection").classList.add("active");
        
        renderUpcomingEvents();
        return;
    }
    
    document.getElementById("upcomingSection").classList.remove("active");
    showCalendars();
    if(platformCard){
        platformCard.style.display = "block";
    }
    
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

// ==================== Color Picker Event Listeners ====================
document.addEventListener("DOMContentLoaded", function() {
    // Color gradient click
    const colorGradient = document.getElementById("colorGradient");
    if(colorGradient){
        colorGradient.addEventListener("click", handleGradientClick);
    }
    
    const hueSlider = document.getElementById("colorHue");
    const hexInput = document.getElementById("hexInput");
    
    if(hueSlider){
        hueSlider.addEventListener("input", function() {
            updateColorGradient(this.value);
        });
    }
    
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
    
    const colorPickerOverlay = document.getElementById("colorPickerOverlay");
    if(colorPickerOverlay){
        colorPickerOverlay.addEventListener("click", function(e) {
            if(e.target === this){
                closeColorPickerModal();
            }
        });
    }
});

function switchTab(event,name){

    document.querySelectorAll('.pill')
    .forEach(btn=>btn.classList.remove('active'));

    event.currentTarget.classList.add('active');

    loadPlatform(name);

}

// ==================== Authentication ====================

async function checkAuthentication() {
    try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        
        if (!data.authenticated) {
            // Redirect to login if not authenticated
            window.location.href = '/login';
            return false;
        }
        return true;
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/login';
        return false;
    }
}

async function logout() {
    if (!confirm('Are you sure you want to logout?')) {
        return;
    }
    
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Redirect to login
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed');
    }
}

// ==================== Initialization ====================

async function initializeApp() {
    // Check authentication first
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) return;
    
    console.log('Initializing Content Calendar...');
    await fetchPostStatuses();
    loadPlatform("upcoming");
    console.log('✓ App initialized');
}

// Start the app
initializeApp();
