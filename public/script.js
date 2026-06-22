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

// Global state
let currentPlatform = "";
let currentMonth = "";
let allEvents = {};
let currentModalDate = "";
let currentModalPlatform = "";
let postStatuses = {}; // Store status from MongoDB: { "platform_date": {_id, status} }

// ==================== API Calls ====================

async function fetchPostStatuses() {
    try {
        const response = await fetch('/api/posts');
        const result = await response.json();
        
        if (result.success && result.data) {
            // Build a lookup object: key = "platform_date", value = { _id, status }
            postStatuses = {};
            result.data.forEach(post => {
                if (post.platform && post.date) {
                    const key = `${post.platform}_${post.date}`;
                    postStatuses[key] = {
                        _id: post._id,
                        status: post.status || 'pending'
                    };
                }
            });
            console.log('✓ Loaded post statuses from MongoDB');
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

async function savePostStatus(platform, date, topic, status) {
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
                body: JSON.stringify({ status })
            });
            
            if (response.ok) {
                postStatuses[key].status = status;
                console.log(`✓ Updated status for ${platform} ${date} to ${status}`);
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
                    status
                })
            });
            
            const result = await response.json();
            if (result.success) {
                postStatuses[key] = {
                    _id: result.data._id,
                    status: status
                };
                console.log(`✓ Created new post for ${platform} ${date}`);
            }
        }
        
        // Refresh the calendar to show updated status
        loadPlatform(currentPlatform);
    } catch (error) {
        console.error('Error saving post status:', error);
    }
}

// ==================== Status Management ====================

function getStatus(platform, date) {
    const key = `${platform}_${date}`;
    return postStatuses[key]?.status || 'pending';
}

function saveStatus() {
    const statusDropdown = document.getElementById("statusDropdown");
    const newStatus = statusDropdown.value;
    
    if (currentModalDate && currentModalPlatform) {
        // Get the topic from the platform events
        const platform = platforms[currentModalPlatform];
        const topic = platform?.events[currentModalDate]?.text || 'Unknown Topic';
        
        savePostStatus(currentModalPlatform, currentModalDate, topic, newStatus);
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
    
    let postsList = "";
    const events = platform.events;
    const monthNum = month === "june" ? "06" : "07";
    const fullDate = `2026-${monthNum}-${String(day).padStart(2, '0')}`;
    
    currentModalDate = fullDate;
    currentModalPlatform = currentPlatform;
    
    if(events[fullDate]){
        postsList = `<div class="modal-post-item">${events[fullDate].text}</div>`;
    } else {
        postsList = `<div class="modal-no-posts">No posts scheduled for this day</div>`;
    }
    
    document.getElementById("modalPostsList").innerHTML = postsList;
    
    // Set current status in dropdown
    const currentStatus = getStatus(currentPlatform, fullDate);
    document.getElementById("statusDropdown").value = currentStatus;
    
    modal.classList.add("active");
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
            content = events[fullDate].text;
            // Get unique color based on topic text
            className = topicColors[content] || events[fullDate].class;
        }

        const status = getStatus(currentPlatform, fullDate);
        const statusColor = status === "done" ? "#22c55e" : status === "working" ? "#4169E1" : "#ef4444";
        const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

        html += `
        <div class="day ${className}" onclick="openModal(${day},'${month}')">
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
                eventsByDate[dateKey].push({
                    platform: platformData.title,
                    text: events[dateKey].text,
                    class: events[dateKey].class,
                    info: platformData.info,
                    status: status,
                    platformKey: platformName
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
            const colorClass = topicColors[event.text] || "color-1";
            
            // Collect color legend
            if (!colorLegend[event.platform]) {
                colorLegend[event.platform] = {};
            }
            colorLegend[event.platform][event.text] = colorClass;
            
            html += `
            <div class="upcoming-item ${colorClass}" onclick="openUpcomingModal('${dateKey}', '${event.platform}')">
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
