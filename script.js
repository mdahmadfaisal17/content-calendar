const platforms = {

dribbble:{
title:"Dribbble",
info:"Posting Days: Tuesday • Thursday • Sunday<br>Posting Time: 8:00 PM BST",
notes:"Focus on Brand Identity, Event Branding and high quality presentations.",
events:{
"2026-06-28":{text:"Full Brand Identity",class:"brand"},
"2026-06-30":{text:"Logo Presentation",class:"logo"},
"2026-07-02":{text:"Print Materials",class:"print"},
"2026-07-05":{text:"Digital Assets",class:"digital"},
"2026-07-07":{text:"Full Brand Identity",class:"brand"},
"2026-07-09":{text:"Logo Presentation",class:"logo"},
"2026-07-12":{text:"Print Materials",class:"print"},
"2026-07-14":{text:"Digital Assets",class:"digital"},
"2026-07-16":{text:"Full Brand Identity",class:"brand"},
"2026-07-19":{text:"Logo Presentation",class:"logo"},
"2026-07-21":{text:"Print Materials",class:"print"},
"2026-07-23":{text:"Digital Assets",class:"digital"},
"2026-07-26":{text:"Full Brand Identity",class:"brand"},
"2026-07-28":{text:"Logo Presentation",class:"logo"},
"2026-07-30":{text:"Print Materials",class:"print"}
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

let currentPlatform = "";
let currentMonth = "";
let allEvents = {};

function openModal(day, month){
    const modal = document.getElementById("modal");
    const platform = platforms[currentPlatform];
    
    document.getElementById("modalPlatform").innerHTML = platform.title;
    document.getElementById("modalDate").innerHTML = `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}, 2026`;
    
    let postsList = "";
    const events = platform.events;
    const monthNum = month === "june" ? "06" : "07";
    const fullDate = `2026-${monthNum}-${String(day).padStart(2, '0')}`;
    
    if(events[fullDate]){
        postsList = `<div class="modal-post-item">${events[fullDate].text}</div>`;
    } else {
        postsList = `<div class="modal-no-posts">No posts scheduled for this day</div>`;
    }
    
    document.getElementById("modalPostsList").innerHTML = postsList;
    modal.classList.add("active");
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
            className = events[fullDate].class;
            content = events[fullDate].text;
        }

        html += `
        <div class="day ${className}" onclick="openModal(${day},'${month}')">
            <div class="date">${day}</div>

            ${
                content
                ? `<div class="content-title">${content}</div>`
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
                eventsByDate[dateKey].push({
                    platform: platformData.title,
                    text: events[dateKey].text,
                    class: events[dateKey].class
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
    
    sortedDates.forEach(dateKey => {
        const date = new Date(dateKey + 'T00:00:00');
        const formattedDate = date.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
        const events = eventsByDate[dateKey];
        
        html += `
        <div class="upcoming-card">
            <div class="upcoming-date">${formattedDate}</div>
            <div class="upcoming-content">
        `;
        
        events.forEach(event => {
            html += `
                <div>
                    <div class="upcoming-platform">${event.platform}</div>
                    <div class="upcoming-title">${event.text}</div>
                </div>
            `;
        });
        
        html += `
            </div>
        </div>
        `;
    });
    
    container.innerHTML = html;
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

loadPlatform("upcoming");
