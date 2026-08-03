const STATUS_STEPS = ["Research", "Observation", "1st Msg", "2nd Msg", "3rd Msg", "Replied", "Got Project"];

const FILTER_OPTIONS = [
    { key: "7", label: "Last 7 Days", days: 7 },
    { key: "all", label: "All", days: null },
    { key: "15", label: "Last 15 Days", days: 15 },
    { key: "30", label: "1 Month", days: 30 },
    { key: "60", label: "2 Months", days: 60 },
    { key: "90", label: "3 Months", days: 90 },
    { key: "180", label: "6 Months", days: 180 },
    { key: "365", label: "1 Year", days: 365 }
];

const CHANNEL_META = {
    linkedin: { title: "LinkedIn", icon: "icon/Linkedin.png" },
    email: { title: "Email", icon: "icon/email.png" },
    whatsapp: { title: "WhatsApp", icon: "icon/whatsapp.png" },
    facebook: { title: "Facebook", icon: "icon/facebook.png" },
    instagram: { title: "Instagram", icon: "icon/instagram.png" },
    dribbble: { title: "Dribbble", icon: "icon/dribbble.png" },
    threads: { title: "Threads", icon: "icon/threads.webp" },
    no_reply_yet: { title: "No reply yet", icon: "icon/forbidden.png" }
};

const SOCIAL_TEMPLATES = [
    { key: "linkedin", name: "LinkedIn", text: "in" },
    { key: "facebook", name: "Facebook", text: "FB" },
    { key: "instagram", name: "Instagram", text: "IG" },
    { key: "email", name: "Email", text: "@" }
];

const SOCIAL_PLATFORM_OPTIONS = ["linkedin", "facebook", "instagram", "email", "whatsapp", "dribbble", "threads"];
const DETAIL_SOCIAL_STATUS_OPTIONS = [...SOCIAL_PLATFORM_OPTIONS, "no_reply_yet"];
const CLIENTS_STORAGE_KEY = "content_calendar_clients_v1";

let clients = [
    {
        id: "live_seed_1",
        businessName: "Arc'teryx UK",
        businessType: "Apparel",
        serviceProducts: "Technical Outdoor Apparel Waterproof Jackets Hiking Clothing Climbing Gear Trail Running Apparel Footwear Backpacks Outdoor Accessories",
        clientName: "Arc'teryx UK",
        clientDesignation: "Company",
        leadNo: "02",
        lastMsgFromMySide: "3 August, LinkedIn",
        clientDescription: "Outdoor apparel brand outreach lead.",
        updatedAt: "2026-08-03",
        statusLabel: "1st Msg",
        statuses: {
            "Research": [],
            "Observation": [],
            "1st Msg": ["linkedin"],
            "2nd Msg": [],
            "3rd Msg": [],
            "Replied": [],
            "Got Project": []
        },
        socialProfiles: [
            { key: "instagram", name: "Instagram", text: "IG", link: "", level: 1 }
        ]
    },
    {
        id: "live_seed_2",
        businessName: "ULTIMATE - Malta",
        businessType: "Ecommerce",
        serviceProducts: "ecommerce Product",
        clientName: "ULTIMATE - Malta",
        clientDesignation: "Company",
        leadNo: "03",
        lastMsgFromMySide: "3 August, LinkedIn",
        clientDescription: "Ecommerce outreach and response tracking.",
        updatedAt: "2026-08-03",
        statusLabel: "1st Msg",
        statuses: {
            "Research": [],
            "Observation": [],
            "1st Msg": ["linkedin"],
            "2nd Msg": ["email"],
            "3rd Msg": [],
            "Replied": [],
            "Got Project": []
        },
        socialProfiles: [
            { key: "linkedin", name: "LinkedIn", text: "in", link: "", level: 1 },
            { key: "facebook", name: "Facebook", text: "FB", link: "", level: 1 },
            { key: "whatsapp", name: "WhatsApp", text: "WA", link: "", level: 1 },
            { key: "instagram", name: "Instagram", text: "IG", link: "", level: 1 },
            { key: "email", name: "Email", text: "@", link: "", level: 3 }
        ]
    },
    {
        id: "live_seed_3",
        businessName: "Softvanta",
        businessType: "Software Agency",
        serviceProducts: "Digital Services",
        clientName: "Tuhin",
        clientDesignation: "Founder",
        leadNo: "01",
        lastMsgFromMySide: "3 August, FB",
        clientDescription: "Softvanta is a digital agency where they provide IT related Services",
        updatedAt: "2026-08-03",
        statusLabel: "Got Project",
        statuses: {
            "Research": [],
            "Observation": [],
            "1st Msg": [],
            "2nd Msg": [],
            "3rd Msg": [],
            "Replied": [],
            "Got Project": ["linkedin"]
        },
        socialProfiles: [
            { key: "facebook", name: "Facebook", text: "FB", link: "", level: 1 }
        ]
    }
];

let activeFilterKey = "7";
let activeClientId = "";
let formMode = "add";
let editingClientId = "";
let socialEditingState = { clientId: "", socialIndex: -1 };
let socialModalState = {
    mode: "edit",
    clientId: "",
    socialIndex: -1,
    selectedKey: "linkedin",
    selectedLevel: 1
};
let panelDraftClient = null;
let panelMode = "edit";
const NEW_CLIENT_DRAFT_ID = "__new_client_draft__";
const FALLBACK_CLIENTS = JSON.parse(JSON.stringify(clients));

function byId(id) {
    return document.getElementById(id);
}

function normalizeSocialLevel(level, fallback = 1) {
    const parsed = Number(level);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }
    return Math.min(Math.max(parsed, 0), 3);
}

function ensureClientShape(client, index) {
    const normalizedStatuses = client && client.statuses ? client.statuses : createDefaultStatuses();
    const normalizedProfiles = Array.isArray(client && client.socialProfiles)
        ? client.socialProfiles.map((social, socialIndex) => {
            const key = social && social.key ? social.key : "email";
            const meta = getSocialMeta(key);
            return {
                key,
                name: social && social.name ? social.name : meta.title,
                text: social && social.text ? social.text : (meta.text || "@"),
                link: social && social.link ? social.link : "",
                level: normalizeSocialLevel(social && social.level, (socialIndex % 3) + 1)
            };
        })
        : createDefaultSocialProfiles();

    return {
        id: client && client.id ? client.id : `c_fallback_${index}`,
        businessName: (client && client.businessName) || "",
        businessType: (client && client.businessType) || "",
        serviceProducts: (client && client.serviceProducts) || "",
        clientName: (client && client.clientName) || "",
        clientDesignation: (client && client.clientDesignation) || "",
        leadNo: (client && client.leadNo) || "",
        lastMsgFromMySide: (client && client.lastMsgFromMySide) || "",
        clientDescription: (client && client.clientDescription) || "",
        statusLabel: (client && STATUS_STEPS.includes(client.statusLabel)) ? client.statusLabel : STATUS_STEPS[0],
        updatedAt: (client && client.updatedAt) || new Date().toISOString().slice(0, 10),
        statuses: normalizedStatuses,
        socialProfiles: normalizedProfiles
    };
}

function persistClients() {
    if (typeof localStorage === "undefined") {
        return;
    }

    try {
        localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
    } catch (error) {
        console.error("Failed to persist clients", error);
    }
}

function hydrateClientsFromStorage() {
    if (typeof localStorage === "undefined") {
        return;
    }

    try {
        const raw = localStorage.getItem(CLIENTS_STORAGE_KEY);
        if (!raw) {
            clients = FALLBACK_CLIENTS.map((client, index) => ensureClientShape(client, index));
            return;
        }

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            clients = FALLBACK_CLIENTS.map((client, index) => ensureClientShape(client, index));
            return;
        }

        const hasLegacyDummyClients = parsed.some((client) => {
            const name = String((client && client.businessName) || "").toLowerCase();
            return name === "nova interiors" || name === "atlas legal" || name === "bloom dental";
        });

        if (hasLegacyDummyClients) {
            clients = FALLBACK_CLIENTS.map((client, index) => ensureClientShape(client, index));
            persistClients();
            return;
        }

        clients = parsed.map((client, index) => ensureClientShape(client, index));
    } catch (error) {
        console.error("Failed to hydrate clients", error);
        clients = FALLBACK_CLIENTS.map((client, index) => ensureClientShape(client, index));
    }
}

function getDaysAgoDate(days) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - days);
    return date;
}

function getFilteredClients() {
    const option = FILTER_OPTIONS.find((item) => item.key === activeFilterKey);
    if (!option || option.days === null) {
        return clients;
    }

    const cutoff = getDaysAgoDate(option.days);
    return clients.filter((client) => {
        const updated = new Date(`${client.updatedAt}T00:00:00`);
        return updated >= cutoff;
    });
}

function closeAllCardMenus() {
    document.querySelectorAll(".client-menu-dropdown").forEach((menu) => {
        menu.classList.remove("active");
    });
}

function renderFilters() {
    const wrapper = byId("clientFilterSelect");
    if (!wrapper) {
        return;
    }

    wrapper.innerHTML = FILTER_OPTIONS.map((option) => {
        const selected = option.key === activeFilterKey ? "selected" : "";
        return `<option value="${option.key}" ${selected}>${option.label}</option>`;
    }).join("");

    wrapper.addEventListener("change", handleFilterChange, { once: true });
}

function handleFilterChange(event) {
    activeFilterKey = event.target.value || "7";
    renderFilters();
    renderClientCards();
}

function formatChannels(channels) {
    if (!channels || channels.length === 0) {
        return "";
    }

    const channelKey = channels[0];
    const meta = CHANNEL_META[channelKey] || { text: "?", title: channelKey };

    if (meta.icon) {
        return `
            <div class="client-channel-wrap">
                <img class="client-channel-icon-image" src="${meta.icon}" alt="${meta.title}" title="${meta.title}">
            </div>
        `;
    }

    return `<div class="client-channel-wrap"><span class="client-channel-icon" title="${meta.title}">${meta.text}</span></div>`;
}

function getPrimaryStatusEntry(client) {
    for (const statusName of STATUS_STEPS) {
        const channels = client.statuses[statusName] || [];
        if (channels.length > 0) {
            return { statusName, channels };
        }
    }

    return { statusName: STATUS_STEPS[0], channels: [] };
}

function getStatusMarkup(client) {
    const statusName = client.statusLabel && STATUS_STEPS.includes(client.statusLabel)
        ? client.statusLabel
        : getPrimaryStatusEntry(client).statusName;
    return `
        <div class="client-status-label client-status-label-${statusName.toLowerCase().replace(/\s+/g, '-')}">
            ${statusName}
        </div>
    `;
}

function getCardSocialKeyForStatus(client) {
    const statusName = client.statusLabel && STATUS_STEPS.includes(client.statusLabel)
        ? client.statusLabel
        : STATUS_STEPS[0];
    const statusChannels = Array.isArray(client.statuses && client.statuses[statusName])
        ? client.statuses[statusName]
        : [];

    if (statusChannels.length > 0) {
        return statusChannels[0];
    }

    return "linkedin";
}

function getCardSocialChipContent(key) {
    const meta = getSocialMeta(key);
    const iconMarkup = meta.icon
        ? `<span class="client-card-social-chip-icon-wrap"><img class="client-card-social-chip-icon-image" src="${meta.icon}" alt="${meta.title}"></span>`
        : `<span class="client-card-social-chip-icon-text">${meta.text || "@"}</span>`;

    return `
        ${iconMarkup}
        <span class="client-card-social-chip-name">${meta.title}</span>
    `;
}

function getCardSocialStatusMarkup(client) {
    const selectedKey = getCardSocialKeyForStatus(client);

    return `
        <div class="client-card-social-status">
            <span class="client-card-social-trigger-main">${getCardSocialChipContent(selectedKey)}</span>
        </div>
    `;
}

function getStatusChipClassName(status) {
    return `status-chip-${String(status || "").toLowerCase().replace(/\s+/g, '-')}`;
}

function updateStatusChipUI(statusValue) {
    const input = byId("detailClientStatus");
    const trigger = byId("detailClientStatusTrigger");
    const text = byId("detailClientStatusText");
    const menu = byId("detailClientStatusMenu");
    if (!input || !trigger || !text || !menu) {
        return;
    }

    const nextStatus = STATUS_STEPS.includes(statusValue) ? statusValue : (STATUS_STEPS.includes(input.value) ? input.value : STATUS_STEPS[0]);
    input.value = nextStatus;
    text.textContent = nextStatus;

    STATUS_STEPS.forEach((status) => {
        trigger.classList.remove(getStatusChipClassName(status));
    });

    trigger.classList.add(getStatusChipClassName(nextStatus));

    menu.querySelectorAll("[data-status-value]").forEach((option) => {
        option.classList.toggle("active", option.dataset.statusValue === nextStatus);
    });

    renderDetailSocialDropdown();
}

function toggleStatusDropdown(forceOpen) {
    const menu = byId("detailClientStatusMenu");
    const trigger = byId("detailClientStatusTrigger");
    if (!menu || !trigger) {
        return;
    }

    const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !menu.classList.contains("open");
    menu.classList.toggle("open", shouldOpen);
    trigger.setAttribute("aria-expanded", String(shouldOpen));
}

function getDetailSocialKeysForClient(client) {
    const allKeys = Array.isArray(DETAIL_SOCIAL_STATUS_OPTIONS) && DETAIL_SOCIAL_STATUS_OPTIONS.length > 0
        ? [...DETAIL_SOCIAL_STATUS_OPTIONS]
        : ["linkedin"];

    return allKeys;
}

function getDetailSelectedSocialKey(client) {
    const statusValue = byId("detailClientStatus")?.value;
    const statusName = STATUS_STEPS.includes(statusValue) ? statusValue : STATUS_STEPS[0];
    const channels = Array.isArray(client && client.statuses && client.statuses[statusName])
        ? client.statuses[statusName]
        : [];

    if (channels.length > 0) {
        return channels[0];
    }

    const keys = getDetailSocialKeysForClient(client);
    return keys[0] || "linkedin";
}

function getDetailSocialChipMarkup(key) {
    const meta = getSocialMeta(key || "linkedin");
    const iconMarkup = meta.icon
        ? `<span class="detail-social-chip-icon-wrap"><img class="detail-social-chip-icon-image" src="${meta.icon}" alt="${meta.title}"></span>`
        : `<span class="detail-social-chip-icon-text">${meta.text || "@"}</span>`;

    return `
        ${iconMarkup}
        <span class="detail-social-chip-name">${meta.title}</span>
    `;
}

function renderDetailSocialDropdown() {
    const client = panelDraftClient;
    const triggerMain = byId("detailClientSocialTriggerMain");
    const menu = byId("detailClientSocialMenu");
    if (!client || !triggerMain || !menu) {
        return;
    }

    const selectedKey = getDetailSelectedSocialKey(client);
    const keys = getDetailSocialKeysForClient(client);

    triggerMain.innerHTML = getDetailSocialChipMarkup(selectedKey);
    menu.innerHTML = keys.map((key) => {
        const activeClass = key === selectedKey ? " active" : "";
        return `
            <button class="detail-social-option${activeClass}" type="button" data-social-option-key="${key}">
                ${getDetailSocialChipMarkup(key)}
            </button>
        `;
    }).join("");
}

function toggleDetailSocialDropdown(forceOpen) {
    const menu = byId("detailClientSocialMenu");
    const trigger = byId("detailClientSocialTrigger");
    if (!menu || !trigger) {
        return;
    }

    const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !menu.classList.contains("open");
    menu.classList.toggle("open", shouldOpen);
    trigger.setAttribute("aria-expanded", String(shouldOpen));
}

function setDetailSocialForActiveStatus(socialKey) {
    if (!panelDraftClient || !socialKey) {
        return;
    }

    const statusValue = byId("detailClientStatus")?.value;
    const statusName = STATUS_STEPS.includes(statusValue) ? statusValue : STATUS_STEPS[0];

    if (!panelDraftClient.statuses || typeof panelDraftClient.statuses !== "object") {
        panelDraftClient.statuses = createDefaultStatuses();
    }

    const existingChannels = Array.isArray(panelDraftClient.statuses[statusName])
        ? panelDraftClient.statuses[statusName]
        : [];

    panelDraftClient.statuses[statusName] = [socialKey, ...existingChannels.filter((key) => key !== socialKey)];

    renderDetailSocialDropdown();
}

function getClientInfoMarkup(client) {
    return `
        <div class="client-card-info">
            <div class="client-card-info-row">
                <span class="client-card-info-label">Business Name</span>
                <span class="client-card-info-value">${client.businessName}</span>
            </div>
            <div class="client-card-info-row">
                <span class="client-card-info-label">Service</span>
                <span class="client-card-info-value">${client.serviceProducts}</span>
            </div>
        </div>
    `;
}

function getSocialIconMarkup(social, index) {
    const meta = CHANNEL_META[social.key] || { text: social.text || "?", title: social.name || social.key };
    const badgeValue = normalizeSocialLevel(social.level, Math.min(index + 1, 3));

    if (meta.icon) {
        return `
            <span class="client-card-social-icon" title="${meta.title}">
                <img class="client-card-social-image" src="${meta.icon}" alt="${meta.title}">
                <span class="client-card-social-badge">${badgeValue}</span>
            </span>
        `;
    }

    return `
        <span class="client-card-social-icon client-card-social-text" title="${meta.title}">
            ${meta.text}
            <span class="client-card-social-badge">${badgeValue}</span>
        </span>
    `;
}

function getClientSocialIconsMarkup(client) {
    if (!client.socialProfiles || client.socialProfiles.length === 0) {
        return "";
    }

    return `
        <div class="client-card-social-row">
            ${client.socialProfiles.map((social, index) => getSocialIconMarkup(social, index)).join("")}
        </div>
    `;
}

function renderClientCards() {
    const grid = byId("clientGrid");
    if (!grid) {
        return;
    }

    const filteredClients = getFilteredClients();

    if (filteredClients.length === 0) {
        grid.innerHTML = `<div class="client-empty">No clients found for this filter.</div>`;
        return;
    }

    grid.innerHTML = filteredClients.map((client) => {
        const statusMarkup = getStatusMarkup(client);
        const socialStatusMarkup = getCardSocialStatusMarkup(client);
        const displayClientName = client.clientName || client.businessName;
        const designationMarkup = client.clientDesignation
            ? `<p class="client-card-designation">${client.clientDesignation}</p>`
            : "";
        const extraCardValues = [
            { label: "Last Msg From My Side", value: client.lastMsgFromMySide },
            { label: "Lead No", value: client.leadNo }
        ].map((item) => ({
            label: item.label,
            value: String(item.value || "").trim()
        })).filter((item) => item.value.length > 0);
        const extraCardValuesMarkup = extraCardValues.length > 0
            ? `
                <div class="client-card-extra-section">
                    <div class="client-card-extra-values">
                        ${extraCardValues.map((item) => `
                            <div class="client-card-extra-value-item">
                                <span class="client-card-extra-value-label">${item.label}:</span>
                                <span class="client-card-extra-value-text">${item.value}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `
            : "";
        return `
            <article class="client-card" data-client-id="${client.id}">
                <div class="client-card-head">
                    <div class="client-card-head-left">
                        ${statusMarkup}
                        ${socialStatusMarkup}
                    </div>
                    <div class="client-card-menu">
                        <button class="client-menu-btn" type="button" data-action="menu" data-client-id="${client.id}" aria-label="Client actions">⋯</button>
                        <div class="client-menu-dropdown" id="menu_${client.id}">
                            <button class="client-menu-item" type="button" data-action="edit" data-client-id="${client.id}">Edit</button>
                            <button class="client-menu-item delete" type="button" data-action="delete" data-client-id="${client.id}">Delete</button>
                        </div>
                    </div>
                </div>
                <div class="client-card-main">
                    <div class="client-card-top-section">
                        <div class="client-card-identity">
                        <h3 class="client-business-name">${displayClientName}</h3>
                        ${designationMarkup}
                        </div>
                        ${extraCardValuesMarkup}
                    </div>
                    ${getClientInfoMarkup(client)}
                    ${getClientSocialIconsMarkup(client)}
                </div>
            </article>
        `;
    }).join("");
}

function createDefaultStatuses() {
    return {
        "Research": [],
        "Observation": [],
        "1st Msg": [],
        "2nd Msg": [],
        "3rd Msg": [],
        "Replied": [],
        "Got Project": []
    };
}

function createDefaultSocialProfiles() {
    return SOCIAL_TEMPLATES.map((item, index) => {
        return {
            key: item.key,
            name: item.name,
            text: item.text,
            link: "",
            level: Math.min(index + 1, 3)
        };
    });
}

function getClientById(clientId) {
    return clients.find((client) => client.id === clientId);
}

function getPanelClientForEditing(clientId) {
    if (panelDraftClient && panelDraftClient.id === clientId) {
        return panelDraftClient;
    }
    return getClientById(clientId);
}

function getSocialMeta(key) {
    return CHANNEL_META[key] || { title: key, text: key.slice(0, 2).toUpperCase() };
}

function createEmptyClientDraft() {
    return {
        id: NEW_CLIENT_DRAFT_ID,
        businessName: "",
        businessType: "",
        serviceProducts: "",
        clientName: "",
        clientDesignation: "",
        leadNo: "",
        lastMsgFromMySide: "",
        clientDescription: "",
        statusLabel: STATUS_STEPS[0],
        updatedAt: new Date().toISOString().slice(0, 10),
        statuses: createDefaultStatuses(),
        socialProfiles: []
    };
}

function getSocialPlatformMarkup(key) {
    const meta = getSocialMeta(key);
    if (meta.icon) {
        return `
            <span class="social-platform-icon-wrap">
                <img class="social-platform-icon-image" src="${meta.icon}" alt="${meta.title}">
            </span>
        `;
    }

    return `<span class="social-platform-icon-text">${meta.text}</span>`;
}

function renderSocialPlatformTrigger(key) {
    const meta = getSocialMeta(key);
    const triggerMain = byId("socialPlatformTriggerMain");
    if (!triggerMain) {
        return;
    }

    triggerMain.innerHTML = `
        <span class="social-platform-trigger-icon">${getSocialPlatformMarkup(key)}</span>
        <span class="social-platform-trigger-name">${meta.title}</span>
    `;
}

function renderSocialPlatformDropdown() {
    const dropdown = byId("socialPlatformDropdown");
    if (!dropdown) {
        return;
    }

    dropdown.innerHTML = SOCIAL_PLATFORM_OPTIONS.map((key) => {
        const meta = getSocialMeta(key);
        const activeClass = socialModalState.selectedKey === key ? " active" : "";
        return `
            <button class="social-platform-option${activeClass}" type="button" data-platform-key="${key}">
                <span class="social-platform-option-icon">${getSocialPlatformMarkup(key)}</span>
                <span class="social-platform-option-name">${meta.title}</span>
            </button>
        `;
    }).join("");
}

function setSocialPlatform(key) {
    socialModalState.selectedKey = key;
    renderSocialPlatformTrigger(key);
    renderSocialPlatformDropdown();
}

function setSocialLevel(level) {
    socialModalState.selectedLevel = level;
    byId("socialLevelGroup")?.querySelectorAll(".social-level-btn").forEach((button) => {
        button.classList.toggle("active", Number(button.dataset.level || 0) === level);
    });
}

function toggleSocialPlatformDropdown(forceOpen) {
    const dropdown = byId("socialPlatformDropdown");
    const trigger = byId("socialPlatformTrigger");
    const arrow = byId("socialPlatformTriggerArrow");
    if (!dropdown || !trigger || !arrow) {
        return;
    }

    const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !dropdown.classList.contains("open");
    dropdown.classList.toggle("open", shouldOpen);
    dropdown.setAttribute("aria-hidden", String(!shouldOpen));
    trigger.setAttribute("aria-expanded", String(shouldOpen));
    arrow.textContent = shouldOpen ? "▴" : "▾";
}

function openSocialLinkModal(clientId, socialIndex) {
    const client = getPanelClientForEditing(clientId);
    if (!client) {
        return;
    }

    const social = client.socialProfiles[socialIndex];
    if (!social) {
        return;
    }

    socialEditingState = { clientId, socialIndex };
    socialModalState = {
        mode: "edit",
        clientId,
        socialIndex,
        selectedKey: social.key || "linkedin",
        selectedLevel: normalizeSocialLevel(social.level, 1)
    };

    byId("socialLinkTitle").textContent = `${social.name} Link`;
    byId("socialLinkInput").value = social.link || "";
    byId("socialLinkSaveBtn").textContent = social.link ? "Update" : "Add";
    renderSocialPlatformTrigger(socialModalState.selectedKey);
    renderSocialPlatformDropdown();
    setSocialLevel(socialModalState.selectedLevel);

    const modal = byId("socialLinkOverlay");
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    toggleSocialPlatformDropdown(false);
}

function openAddSocialLinkModal(clientId) {
    const client = getPanelClientForEditing(clientId);
    if (!client) {
        return;
    }

    socialEditingState = { clientId, socialIndex: -1 };
    socialModalState = {
        mode: "add",
        clientId,
        socialIndex: -1,
        selectedKey: "linkedin",
        selectedLevel: 1
    };

    byId("socialLinkTitle").textContent = "Add Social Link";
    byId("socialLinkInput").value = "";
    byId("socialLinkSaveBtn").textContent = "Add";
    renderSocialPlatformTrigger(socialModalState.selectedKey);
    renderSocialPlatformDropdown();
    setSocialLevel(1);

    const modal = byId("socialLinkOverlay");
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    toggleSocialPlatformDropdown(false);
}

function renderClientSocialList(client) {
    const socialList = byId("clientSocialList");
    if (!socialList) {
        return;
    }

    socialList.innerHTML = client.socialProfiles.map((social, index) => {
        const meta = getSocialMeta(social.key || "email");
        const socialName = social.name || meta.title;
        const linkMarkup = social.link
            ? `<span class="client-social-link">${social.link}</span>`
            : `<span class="client-social-link empty">No link added</span>`;

        const iconMarkup = meta.icon
            ? `<img class="client-social-icon-image" src="${meta.icon}" alt="${meta.title}">`
            : (social.text || meta.text || "@");

        return `
            <div class="client-social-item${social.link ? " has-link" : ""}" ${social.link ? `data-social-link="${social.link}"` : ""}>
                <div class="client-social-icon">
                    ${iconMarkup}
                    <span class="client-social-level">${normalizeSocialLevel(social.level, 1)}</span>
                </div>
                <div class="client-social-meta">
                    <div class="client-social-name">${socialName}</div>
                    ${linkMarkup}
                </div>
                <div class="client-social-actions">
                    <button class="client-social-action" type="button" data-action="social-link" data-client-id="${client.id}" data-social-index="${index}" title="Add or update link">Edit</button>
                    <button class="client-social-delete" type="button" data-action="social-delete" data-client-id="${client.id}" data-social-index="${index}" title="Delete social link" aria-label="Delete social link">Delete</button>
                </div>
            </div>
        `;
    }).join("");
}

function deleteSocialProfile(clientId, socialIndex) {
    const client = getPanelClientForEditing(clientId);
    if (!client || !Array.isArray(client.socialProfiles)) {
        return;
    }

    if (socialIndex < 0 || socialIndex >= client.socialProfiles.length) {
        return;
    }

    client.socialProfiles.splice(socialIndex, 1);
    renderClientSocialList(client);
}

function openClientPanel(clientId) {
    const sourceClient = getClientById(clientId);
    if (!sourceClient) {
        return;
    }

    panelMode = "edit";
    panelDraftClient = JSON.parse(JSON.stringify(sourceClient));
    const client = panelDraftClient;

    activeClientId = clientId;
    byId("clientPanelSaveBtn").textContent = "Save Changes";
    byId("detailClientStatus").value = client.statusLabel || STATUS_STEPS[0];
    updateStatusChipUI();
    byId("detailBusinessName").value = client.businessName;
    byId("detailBusinessType").value = client.businessType;
    byId("detailServiceProducts").value = client.serviceProducts;
    byId("detailClientName").value = client.clientName || "";
    byId("detailClientDesignation").value = client.clientDesignation || "";
    byId("detailLeadNo").value = client.leadNo || "";
    byId("detailLastMsgFromMySide").value = client.lastMsgFromMySide || "";
    byId("detailClientDescription").value = client.clientDescription || "";
    renderClientSocialList(client);
    renderDetailSocialDropdown();

    const panel = byId("clientPanelOverlay");
    panel.classList.add("active");
    panel.setAttribute("aria-hidden", "false");
}

function openClientCreatePanel() {
    panelMode = "add";
    panelDraftClient = createEmptyClientDraft();
    activeClientId = panelDraftClient.id;

    byId("clientPanelSaveBtn").textContent = "Upload";
    byId("detailClientStatus").value = panelDraftClient.statusLabel;
    updateStatusChipUI();
    byId("detailBusinessName").value = "";
    byId("detailBusinessType").value = "";
    byId("detailServiceProducts").value = "";
    byId("detailClientName").value = "";
    byId("detailClientDesignation").value = "";
    byId("detailLeadNo").value = "";
    byId("detailLastMsgFromMySide").value = "";
    byId("detailClientDescription").value = "";
    renderClientSocialList(panelDraftClient);
    renderDetailSocialDropdown();

    const panel = byId("clientPanelOverlay");
    panel.classList.add("active");
    panel.setAttribute("aria-hidden", "false");
}

function closeClientPanel() {
    const panel = byId("clientPanelOverlay");
    if (!panel) {
        return;
    }
    panel.classList.remove("active");
    panel.setAttribute("aria-hidden", "true");
    toggleStatusDropdown(false);
    toggleDetailSocialDropdown(false);
    panelDraftClient = null;
    panelMode = "edit";
    byId("clientPanelSaveBtn").textContent = "Save Changes";
    activeClientId = "";
}

function saveClientDetails() {
    if (!panelDraftClient) {
        return;
    }

    const businessName = byId("detailBusinessName").value.trim();
    const businessType = byId("detailBusinessType").value.trim();
    const serviceProducts = byId("detailServiceProducts").value.trim();
    const statusLabel = byId("detailClientStatus").value;
    const clientName = byId("detailClientName").value.trim();
    const clientDesignation = byId("detailClientDesignation").value.trim();
    const leadNo = byId("detailLeadNo").value.trim();
    const lastMsgFromMySide = byId("detailLastMsgFromMySide").value.trim();
    const clientDescription = byId("detailClientDescription").value.trim();

    if (!businessName || !businessType || !serviceProducts || !clientName || !clientDesignation || !clientDescription) {
        alert("Please fill all client details.");
        return;
    }

    panelDraftClient.businessName = businessName;
    panelDraftClient.businessType = businessType;
    panelDraftClient.serviceProducts = serviceProducts;
    panelDraftClient.statusLabel = STATUS_STEPS.includes(statusLabel) ? statusLabel : STATUS_STEPS[0];
    panelDraftClient.clientName = clientName;
    panelDraftClient.clientDesignation = clientDesignation;
    panelDraftClient.leadNo = leadNo;
    panelDraftClient.lastMsgFromMySide = lastMsgFromMySide;
    panelDraftClient.clientDescription = clientDescription;

    if (panelMode === "add") {
        const newClient = ensureClientShape({
            id: `c${Date.now()}`,
            businessName: panelDraftClient.businessName,
            businessType: panelDraftClient.businessType,
            serviceProducts: panelDraftClient.serviceProducts,
            statusLabel: panelDraftClient.statusLabel,
            clientName: panelDraftClient.clientName,
            clientDesignation: panelDraftClient.clientDesignation,
            leadNo: panelDraftClient.leadNo,
            lastMsgFromMySide: panelDraftClient.lastMsgFromMySide,
            clientDescription: panelDraftClient.clientDescription,
            updatedAt: new Date().toISOString().slice(0, 10),
            statuses: JSON.parse(JSON.stringify(panelDraftClient.statuses || createDefaultStatuses())),
            socialProfiles: JSON.parse(JSON.stringify(panelDraftClient.socialProfiles || []))
        }, clients.length);

        clients.unshift(newClient);
        persistClients();
        renderClientCards();
        closeClientPanel();
        return;
    }

    const client = getClientById(activeClientId);
    if (!client || panelDraftClient.id !== client.id) {
        return;
    }

    client.businessName = panelDraftClient.businessName;
    client.businessType = panelDraftClient.businessType;
    client.serviceProducts = panelDraftClient.serviceProducts;
    client.statusLabel = panelDraftClient.statusLabel;
    client.clientName = panelDraftClient.clientName;
    client.clientDesignation = panelDraftClient.clientDesignation;
    client.leadNo = panelDraftClient.leadNo;
    client.lastMsgFromMySide = panelDraftClient.lastMsgFromMySide;
    client.clientDescription = panelDraftClient.clientDescription;
    client.socialProfiles = JSON.parse(JSON.stringify(panelDraftClient.socialProfiles || []));
    client.statuses = JSON.parse(JSON.stringify(panelDraftClient.statuses || createDefaultStatuses()));
    client.updatedAt = new Date().toISOString().slice(0, 10);
    persistClients();

    renderClientCards();
    closeClientPanel();
}

function closeSocialLinkModal() {
    const modal = byId("socialLinkOverlay");
    if (!modal) {
        return;
    }

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    toggleSocialPlatformDropdown(false);
    socialEditingState = { clientId: "", socialIndex: -1 };
    socialModalState = {
        mode: "edit",
        clientId: "",
        socialIndex: -1,
        selectedKey: "linkedin",
        selectedLevel: 1
    };
}

function normalizeUrl(url) {
    const trimmed = url.trim();
    if (!trimmed) {
        return "";
    }
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
    }
    return `https://${trimmed}`;
}

function saveSocialLink() {
    const client = getPanelClientForEditing(socialModalState.clientId || socialEditingState.clientId);
    if (!client) {
        return;
    }

    const input = byId("socialLinkInput");
    const normalizedLink = normalizeUrl(input.value);

    const selectedKey = socialModalState.selectedKey || "linkedin";
    const meta = getSocialMeta(selectedKey);
    const selectedLevel = normalizeSocialLevel(socialModalState.selectedLevel, 1);

    if (socialModalState.mode === "add") {
        client.socialProfiles = client.socialProfiles || [];
        client.socialProfiles.push({
            key: selectedKey,
            name: meta.title,
            text: meta.text,
            link: normalizedLink,
            level: selectedLevel
        });
    } else {
        const { socialIndex } = socialEditingState;
        const social = client.socialProfiles[socialIndex];
        if (!social) {
            return;
        }

        social.key = selectedKey;
        social.name = meta.title;
        social.text = meta.text || selectedKey.slice(0, 2).toUpperCase();
        social.link = normalizedLink;
        social.level = selectedLevel;
    }

    renderClientSocialList(client);
    closeSocialLinkModal();
}

function openClientForm(mode, clientId = "") {
    formMode = mode;
    editingClientId = clientId;

    const title = byId("clientFormTitle");
    const saveButton = byId("clientFormSaveBtn");

    if (mode === "edit") {
        const client = getClientById(clientId);
        if (!client) {
            return;
        }

        title.textContent = "Update Client";
        saveButton.textContent = "Update";

        byId("formBusinessName").value = client.businessName;
        byId("formBusinessType").value = client.businessType;
        byId("formServiceProducts").value = client.serviceProducts;
    } else {
        title.textContent = "Add Client";
        saveButton.textContent = "Add";

        byId("formBusinessName").value = "";
        byId("formBusinessType").value = "";
        byId("formServiceProducts").value = "";
    }

    const modal = byId("clientFormOverlay");
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
}

function closeClientForm() {
    const modal = byId("clientFormOverlay");
    if (!modal) {
        return;
    }

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    editingClientId = "";
}

function saveClientForm() {
    const businessName = byId("formBusinessName").value.trim();
    const businessType = byId("formBusinessType").value.trim();
    const serviceProducts = byId("formServiceProducts").value.trim();

    if (!businessName || !businessType || !serviceProducts) {
        alert("Please fill all client fields.");
        return;
    }

    const today = new Date().toISOString().slice(0, 10);

    if (formMode === "edit") {
        const client = getClientById(editingClientId);
        if (!client) {
            return;
        }

        client.businessName = businessName;
        client.businessType = businessType;
        client.serviceProducts = serviceProducts;
        client.updatedAt = today;
        persistClients();

        if (activeClientId === client.id) {
            openClientPanel(client.id);
        }
    } else {
        clients.unshift({
            id: `c${Date.now()}`,
            businessName,
            businessType,
            serviceProducts,
            statusLabel: STATUS_STEPS[0],
            clientName: "",
            clientDesignation: "",
            leadNo: "",
            lastMsgFromMySide: "",
            clientDescription: "",
            updatedAt: today,
            statuses: createDefaultStatuses(),
            socialProfiles: createDefaultSocialProfiles()
        });
        persistClients();
    }

    renderClientCards();
    closeClientForm();
}

function deleteClient(clientId) {
    const client = getClientById(clientId);
    if (!client) {
        return;
    }

    const shouldDelete = confirm(`Delete ${client.businessName}?`);
    if (!shouldDelete) {
        return;
    }

    clients = clients.filter((item) => item.id !== clientId);

    if (activeClientId === clientId) {
        closeClientPanel();
    }

    persistClients();

    renderClientCards();
}

function handleGridActions(event) {
    const menuButton = event.target.closest("[data-action='menu']");
    if (menuButton) {
        event.stopPropagation();
        const clientId = menuButton.dataset.clientId;
        closeAllCardMenus();
        const menu = byId(`menu_${clientId}`);
        if (menu) {
            menu.classList.toggle("active");
        }
        return;
    }

    const editButton = event.target.closest("[data-action='edit']");
    if (editButton) {
        event.stopPropagation();
        closeAllCardMenus();
        openClientForm("edit", editButton.dataset.clientId || "");
        return;
    }

    const deleteButton = event.target.closest("[data-action='delete']");
    if (deleteButton) {
        event.stopPropagation();
        closeAllCardMenus();
        deleteClient(deleteButton.dataset.clientId || "");
        return;
    }

    const socialButton = event.target.closest("[data-action='social-link']");
    if (socialButton) {
        event.stopPropagation();
        const clientId = socialButton.dataset.clientId || "";
        const socialIndex = Number(socialButton.dataset.socialIndex || -1);
        openSocialLinkModal(clientId, socialIndex);
        return;
    }

    const socialDeleteButton = event.target.closest("[data-action='social-delete']");
    if (socialDeleteButton) {
        event.stopPropagation();
        const clientId = socialDeleteButton.dataset.clientId || "";
        const socialIndex = Number(socialDeleteButton.dataset.socialIndex || -1);
        deleteSocialProfile(clientId, socialIndex);
        return;
    }

    const addSocialButton = event.target.closest("#addSocialLinkBtn");
    if (addSocialButton) {
        event.stopPropagation();
        if (activeClientId) {
            openAddSocialLinkModal(activeClientId);
        }
        return;
    }

    const socialLinkRow = event.target.closest(".client-social-item[data-social-link]");
    if (socialLinkRow) {
        const url = socialLinkRow.dataset.socialLink || "";
        if (url) {
            window.open(url, "_blank", "noopener,noreferrer");
        }
        return;
    }

    const card = event.target.closest(".client-card");
    if (card) {
        const clientId = card.dataset.clientId || "";
        if (clientId) {
            openClientPanel(clientId);
        }
    }
}

function initClientDashboard() {
    if (!byId("clientGrid")) {
        return;
    }

    hydrateClientsFromStorage();
    renderFilters();
    renderClientCards();

    byId("clientAddBtn")?.addEventListener("click", () => {
        openClientCreatePanel();
    });

    byId("clientGrid")?.addEventListener("click", handleGridActions);
    byId("clientSocialList")?.addEventListener("click", handleGridActions);

    byId("clientPanelClose")?.addEventListener("click", closeClientPanel);
    byId("clientPanelCancelBtn")?.addEventListener("click", closeClientPanel);
    byId("clientPanelSaveBtn")?.addEventListener("click", saveClientDetails);
    byId("detailClientStatusTrigger")?.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleStatusDropdown();
    });
    byId("detailClientStatusMenu")?.addEventListener("click", (event) => {
        const option = event.target.closest("[data-status-value]");
        if (!option) {
            return;
        }
        updateStatusChipUI(option.dataset.statusValue || STATUS_STEPS[0]);
        toggleStatusDropdown(false);
    });
    byId("detailClientSocialTrigger")?.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleDetailSocialDropdown();
    });
    byId("detailClientSocialMenu")?.addEventListener("click", (event) => {
        const option = event.target.closest("[data-social-option-key]");
        if (!option) {
            return;
        }
        event.stopPropagation();
        setDetailSocialForActiveStatus(option.dataset.socialOptionKey || "linkedin");
        toggleDetailSocialDropdown(false);
    });
    byId("addSocialLinkBtn")?.addEventListener("click", () => {
        if (activeClientId) {
            openAddSocialLinkModal(activeClientId);
        }
    });
    byId("clientPanelOverlay")?.addEventListener("click", (event) => {
        if (event.target.id === "clientPanelOverlay") {
            closeClientPanel();
        }
    });

    byId("socialLinkSaveBtn")?.addEventListener("click", saveSocialLink);
    byId("socialLinkCancelBtn")?.addEventListener("click", closeSocialLinkModal);
    byId("socialPlatformTrigger")?.addEventListener("click", () => {
        toggleSocialPlatformDropdown();
    });
    byId("socialPlatformDropdown")?.addEventListener("click", (event) => {
        const option = event.target.closest("[data-platform-key]");
        if (!option) {
            return;
        }
        setSocialPlatform(option.dataset.platformKey || "linkedin");
        toggleSocialPlatformDropdown(false);
    });
    byId("socialLevelGroup")?.addEventListener("click", (event) => {
        const levelButton = event.target.closest("[data-level]");
        if (!levelButton) {
            return;
        }
        setSocialLevel(normalizeSocialLevel(levelButton.dataset.level, 1));
    });
    byId("socialLinkOverlay")?.addEventListener("click", (event) => {
        if (event.target.id === "socialLinkOverlay") {
            closeSocialLinkModal();
        }
    });

    byId("clientFormSaveBtn")?.addEventListener("click", saveClientForm);
    byId("clientFormCancelBtn")?.addEventListener("click", closeClientForm);
    byId("clientFormOverlay")?.addEventListener("click", (event) => {
        if (event.target.id === "clientFormOverlay") {
            closeClientForm();
        }
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".client-card-menu")) {
            closeAllCardMenus();
        }
        if (!event.target.closest("#detailClientStatusDropdown")) {
            toggleStatusDropdown(false);
        }
        if (!event.target.closest("#detailClientSocialDropdown")) {
            toggleDetailSocialDropdown(false);
        }
    });
}

document.addEventListener("DOMContentLoaded", initClientDashboard);
