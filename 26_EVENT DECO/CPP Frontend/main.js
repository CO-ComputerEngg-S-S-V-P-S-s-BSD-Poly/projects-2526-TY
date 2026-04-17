const API_HOST = window.location.hostname || "localhost";
const API_BASE_URL = `http://${API_HOST}:5000`;
const API_BASE_URL_CANDIDATES = Array.from(new Set([
    API_BASE_URL,
    "http://localhost:5000",
    "http://127.0.0.1:5000"
]));
let cachedCustomerSession = null;
let cachedOwnerSession = undefined;
const reviewExperienceStore = new Map();
let reviewExperienceCounter = 0;

async function apiFetch(path, options = {}) {
    if (path.startsWith("http")) {
        return fetch(path, {
            credentials: "include",
            ...options
        });
    }

    let lastNetworkError = null;

    for (const baseUrl of API_BASE_URL_CANDIDATES) {
        try {
            return await fetch(`${baseUrl}${path}`, {
                credentials: "include",
                ...options
            });
        } catch (error) {
            lastNetworkError = error;
        }
    }

    throw lastNetworkError || new Error("Unable to reach the backend server");
}

async function apiFetchFirstSuccessful(paths, options = {}) {
    let lastResponse = null;
    let lastError = null;

    for (const path of paths) {
        try {
            const response = await apiFetch(path, options);
            if (!response.ok && [404, 405, 501].includes(response.status)) {
                lastResponse = response;
                continue;
            }
            return response;
        } catch (error) {
            lastError = error;
        }
    }

    if (lastResponse) return lastResponse;
    throw lastError || new Error("Unable to reach the review service");
}

async function getCustomerSession() {
    if (cachedCustomerSession) return cachedCustomerSession;
    try {
        const response = await apiFetch("/api/customers/me");
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data || !data.customer) {
            cachedCustomerSession = { customer: null };
            return cachedCustomerSession;
        }
        cachedCustomerSession = data;
        return cachedCustomerSession;
    } catch (error) {
        cachedCustomerSession = { customer: null };
        return cachedCustomerSession;
    }
}

function clearCustomerSessionCache() {
    cachedCustomerSession = null;
}

async function getOwnerSession() {
    if (cachedOwnerSession !== undefined) return cachedOwnerSession;

    for (const baseUrl of API_BASE_URL_CANDIDATES) {
        try {
            const response = await fetch(`${baseUrl}/api/private/owner/auth/me`, {
                credentials: "include"
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) continue;
            cachedOwnerSession = data;
            return cachedOwnerSession;
        } catch (error) {
            // Try the next candidate host.
        }
    }

    cachedOwnerSession = null;
    return cachedOwnerSession;
}

function normalizeReviewMedia(review) {
    const photos = Array.isArray(review?.photos) ? review.photos.filter(Boolean) : [];
    const fallbackPhotos = [review?.decoration_image].filter(Boolean);
    return (photos.length ? photos : fallbackPhotos).map((photo) => resolveImageSource(photo));
}

function resolveReviewRecordId(review) {
    return review?.id || review?.review_id || review?.reviewId || null;
}

function canDeleteReview(review, viewer = {}) {
    if (viewer?.owner) return true;
    if (review?.can_delete === true) return true;
    if (review?.can_delete === false) return false;
    if (!viewer?.customer || !review) return false;

    const customerId = String(viewer.customer.id || viewer.customer.customer_id || "").trim();
    const reviewCustomerId = String(review.customer_id || review.customerId || "").trim();
    if (customerId && reviewCustomerId && customerId === reviewCustomerId) {
        return true;
    }

    const customerEmail = String(viewer.customer.email || "").trim().toLowerCase();
    const reviewEmail = String(review.customer_email || review.reviewer_email || review.email || "").trim().toLowerCase();
    if (customerEmail && reviewEmail && customerEmail === reviewEmail) {
        return true;
    }

    const customerName = String(viewer.customer.name || viewer.customer.full_name || "").trim().toLowerCase();
    const reviewName = String(review.customer_name || review.reviewer_name || review.name || "").trim().toLowerCase();
    if (customerName && reviewName && customerName === reviewName) {
        return true;
    }

    return false;
}

function registerReviewExperience(review) {
    const reviewId = resolveReviewRecordId(review);
    const key = reviewId ? `review-${reviewId}` : `review-temp-${++reviewExperienceCounter}`;
    reviewExperienceStore.set(key, {
        ...review,
        __reviewKey: key,
        photos: normalizeReviewMedia(review)
    });
    return key;
}

function getRegisteredReviewExperience(reviewKey) {
    return reviewExperienceStore.get(reviewKey) || null;
}

async function logoutCustomer(redirectTo = "login.html") {
    const firstConfirmation = window.confirm("Are you sure you want to log out?");
    if (!firstConfirmation) return;

    const secondConfirmation = window.confirm("Please confirm again to log out of your account.");
    if (!secondConfirmation) return;

    try {
        await apiFetch("/api/customers/logout", { method: "POST" });
    } catch (error) {
        // Ignore logout failures to keep UX smooth.
    } finally {
        clearCustomerSessionCache();
    }
    if (redirectTo) {
        window.location.href = redirectTo;
    }
}

function createCustomerMenu(customer) {
    const wrapper = document.createElement("div");
    wrapper.className = "customer-menu";

    const label = String(customer?.name || customer?.email || customer?.phone || "Customer").trim();
    const initial = label ? label.charAt(0).toUpperCase() : "C";
    const secondary = String(customer?.email || customer?.phone || "Signed in").trim();

    wrapper.innerHTML = `
        <button type="button" class="customer-menu-trigger" aria-expanded="false" aria-haspopup="true">
            <span class="customer-menu-avatar">${escapeHtml(initial)}</span>
            <span class="customer-menu-copy">
                <span class="customer-menu-name">${escapeHtml(label)}</span>
                <span class="customer-menu-meta">${escapeHtml(secondary)}</span>
            </span>
            <i class="fas fa-chevron-down" aria-hidden="true"></i>
        </button>
        <div class="customer-menu-panel" hidden>
            <a href="my-bookings.html" class="customer-menu-link">
                <i class="fas fa-calendar-check" aria-hidden="true"></i>
                <span>My Bookings</span>
            </a>
            <a href="notifications.html" class="customer-menu-link">
                <i class="fas fa-bell" aria-hidden="true"></i>
                <span>Notifications</span>
            </a>
            <a href="profile.html" class="customer-menu-link">
                <i class="fas fa-user-circle" aria-hidden="true"></i>
                <span>Profile</span>
            </a>
            <button type="button" class="customer-menu-link customer-menu-logout">
                <i class="fas fa-right-from-bracket" aria-hidden="true"></i>
                <span>Logout</span>
            </button>
        </div>
    `;

    const trigger = wrapper.querySelector(".customer-menu-trigger");
    const panel = wrapper.querySelector(".customer-menu-panel");
    const logoutButton = wrapper.querySelector(".customer-menu-logout");

    const closeMenu = () => {
        trigger.setAttribute("aria-expanded", "false");
        panel.hidden = true;
        wrapper.classList.remove("open");
    };

    const openMenu = () => {
        trigger.setAttribute("aria-expanded", "true");
        panel.hidden = false;
        wrapper.classList.add("open");
    };

    trigger.addEventListener("click", () => {
        const isOpen = wrapper.classList.contains("open");
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    wrapper.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            trigger.focus();
        }
    });

    document.addEventListener("click", (event) => {
        if (!wrapper.contains(event.target)) {
            closeMenu();
        }
    });

    logoutButton.addEventListener("click", () => logoutCustomer());

    return wrapper;
}

function renderCustomerMenu(customer) {
    const navContainer = document.querySelector(".nav-container");
    if (!navContainer || !customer) return;

    const existingMenu = navContainer.querySelector(".customer-menu");
    if (existingMenu) existingMenu.remove();

    const existingAuthButton = navContainer.querySelector(".btn-nav");
    const standaloneLogout = Array.from(navContainer.querySelectorAll("button")).find((element) => {
        return /logout/i.test(element.textContent || "");
    });

    if (standaloneLogout && !standaloneLogout.closest(".customer-menu")) {
        standaloneLogout.remove();
    }

    const menu = createCustomerMenu(customer);
    if (existingAuthButton) {
        existingAuthButton.replaceWith(menu);
    } else {
        navContainer.appendChild(menu);
    }
}

window.logoutCustomer = logoutCustomer;
function toBudgetBand(priceValue) {
    const n = Number(priceValue);
    if (!Number.isFinite(n)) return "medium";
    if (n < 15000) return "low";
    if (n <= 30000) return "medium";
    return "high";
}

function normalizeCategory(raw) {
    const value = String(raw || "").trim().toLowerCase();
    if (value.includes("wedding")) return "wedding";
    if (value.includes("festival")) return "festival";
    if (value.includes("relig")) return "religious";
    if (value.includes("birth") || value.includes("party")) return "party";
    if (value.includes("corporate")) return "corporate";
    if (value.includes("family") || value.includes("social") || value.includes("engagement")) return "family";
    return value || "festival";
}

function normalizeGalleryCategoryParam(raw) {
    const value = String(raw || "").trim().toLowerCase();
    if (!value || value === "all") return "all";
    if (value.includes("wedding")) return "wedding";
    if (value.includes("festival")) return "festival";
    if (value.includes("relig")) return "religious";
    if (value.includes("birth") || value.includes("party")) return "party";
    if (value.includes("corporate")) return "corporate";
    if (value.includes("family") || value.includes("social") || value.includes("engagement")) return "family";
    return "all";
}

function resolveImageSource(rawImagePath) {
    const fallbackImage = `${API_BASE_URL}/assest/images/main%20img.webp`;
    const raw = String(rawImagePath || "").trim();
    if (!raw) return fallbackImage;

    if (raw.startsWith("data:image/")) return raw;
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;

    const normalized = raw.replace(/\\/g, "/");
    if (normalized.toLowerCase().includes("fakepath")) return fallbackImage;

    const absolutePath = normalized.startsWith("/") ? normalized : `/${normalized}`;
    return `${API_BASE_URL}${encodeURI(absolutePath)}`;
}

function normalizeFromApi(item, index) {
    const title = item.title || item.name || `Decoration Theme ${index + 1}`;
    const description = item.description || "Custom decoration setup crafted for your event.";
    const category = normalizeCategory(item.category || item.event || item.event_type);

    const numericPrice = Number(item.price);
    const finalPrice = Number.isFinite(numericPrice) ? numericPrice : 18000;

    const budget = String(item.budget || item.budget_category || "").toLowerCase() || toBudgetBand(finalPrice);

    const imageName = item.image || item.image_url || item.imageUrl || item.image_path || "";
    const imageSrc = resolveImageSource(imageName);

    return {
        id: item.id || item._id || `${category}-${index}`,
        title,
        description,
        price: finalPrice,
        category,
        budget,
        inclusions: item.inclusions || "Stage decor, lighting accents, and themed backdrop",
        idealFor: item.idealFor || "Customized celebrations",
        image: imageSrc
    };
}

function dedupeThemes(themes) {
    const map = new Map();
    themes.forEach((theme, idx) => {
        const key = String(theme.id || `${theme.title}-${idx}`).toLowerCase();
        if (!map.has(key)) map.set(key, theme);
    });
    return Array.from(map.values());
}

function formatPrice(amount) {
    return `Rs. ${Number(amount).toLocaleString("en-IN")}`;
}

function budgetLabel(budget) {
    if (budget === "low") return "Low Budget";
    if (budget === "medium") return "Medium Budget";
    return "High Budget";
}

function categoryLabel(category) {
    if (category === "party") return "Party / Birthday";
    if (category === "family") return "Family / Social";
    return category.charAt(0).toUpperCase() + category.slice(1);
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getStoredCustomerId() {
    const rawValue = localStorage.getItem("customer_id") || localStorage.getItem("customerId");
    const parsed = Number.parseInt(rawValue, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function bookTheme(theme) {
    const decorationId = Number.parseInt(theme.id, 10);
    if (!Number.isInteger(decorationId) || decorationId <= 0) {
        alert("This theme is not available for booking.");
        return;
    }

    const session = await getCustomerSession();
    if (!session.customer) {
        alert("Please log in first to book a decoration.");
        window.location.href = "login.html";
        return;
    }

    window.location.href = `booking.html?theme=${encodeURIComponent(decorationId)}`;
}

function getThemes() {
    return apiFetch("/api/decorations")
        .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch decorations");
            return response.json();
        })
        .then((apiData) => {
            const normalizedApiThemes = Array.isArray(apiData)
                ? apiData.map(normalizeFromApi).filter(Boolean)
                : [];
            return dedupeThemes(normalizedApiThemes);
        })
        .catch(() => []);
}

function initGalleryPage() {
    const galleryGrid = document.getElementById("gallery-grid");
    if (!galleryGrid) return;

    const filterButtons = document.querySelectorAll(".filter-btn");
    const budgetFilter = document.getElementById("budget-filter");
    const emptyState = document.getElementById("gallery-empty-state");
    const themeCount = document.getElementById("theme-count");
    const setActiveCategory = (category) => {
        const normalized = normalizeGalleryCategoryParam(category);
        const targetBtn = Array.from(filterButtons).find((btn) => btn.dataset.category === normalized);
        if (!targetBtn) return;
        filterButtons.forEach((b) => b.classList.remove("active"));
        targetBtn.classList.add("active");
    };

    function render(themes) {
        const activeCategoryBtn = document.querySelector(".filter-btn.active");
        const category = activeCategoryBtn ? activeCategoryBtn.dataset.category : "all";
        const budget = budgetFilter ? budgetFilter.value : "all";

        const filtered = themes.filter((theme) => {
            const categoryMatch = category === "all" || theme.category === category;
            const budgetMatch = budget === "all" || theme.budget === budget;
            return categoryMatch && budgetMatch;
        });

        galleryGrid.innerHTML = filtered.map((theme) => `
            <article class="design-card">
                <div class="design-img-box">
                    <img src="${theme.image}" alt="${theme.title}" onerror="this.onerror=null;this.src='${API_BASE_URL}/assest/images/main%20img.webp'">
                </div>
                <div class="design-info">
                    <span class="category">${categoryLabel(theme.category)}</span>
                    <h3>${theme.title}</h3>
                    <p class="price">${formatPrice(theme.price)}</p>
                    <div class="card-actions">
                        <button class="btn-card js-book-theme" data-theme-id="${escapeHtml(theme.id)}">Book This Theme</button>
                        <a class="btn-card btn-card-alt" href="details.html?theme=${encodeURIComponent(theme.id)}">View Details</a>
                    </div>
                </div>
            </article>
        `).join("");

        if (emptyState) {
            emptyState.hidden = filtered.length > 0;
        }
        if (themeCount) {
            themeCount.textContent = String(themes.length);
        }

        initRevealAnimations();
    }

    function wireFilters(themes) {
        filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                filterButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                const url = new URL(window.location.href);
                if (btn.dataset.category === "all") {
                    url.searchParams.delete("filter");
                } else {
                    url.searchParams.set("filter", btn.dataset.category);
                }
                window.history.replaceState({}, "", url.toString());
                render(themes);
            });
        });

        if (budgetFilter) {
            budgetFilter.addEventListener("change", () => render(themes));
        }
    }

    getThemes().then((themes) => {
        const params = new URLSearchParams(window.location.search);
        const requestedCategory = params.get("filter") || params.get("category") || params.get("event") || "all";
        setActiveCategory(requestedCategory);

        galleryGrid.addEventListener("click", (event) => {
            const button = event.target.closest(".js-book-theme");
            if (!button) return;

            const selectedTheme = themes.find((theme) => String(theme.id) === String(button.dataset.themeId));
            if (!selectedTheme) {
                alert("Theme not found. Please refresh and try again.");
                return;
            }

            bookTheme(selectedTheme);
        });

        wireFilters(themes);
        render(themes);
    });
}

function initDetailsPage() {
    const detailContainer = document.getElementById("theme-details-page");
    if (!detailContainer) return;

    const params = new URLSearchParams(window.location.search);
    const themeId = params.get("theme");

    if (!themeId) {
        detailContainer.innerHTML = `<p class="gallery-empty-state">Theme not found. Please open details from the gallery page.</p>`;
        return;
    }

    getThemes().then((themes) => {
        const theme = themes.find((item) => String(item.id) === String(themeId));

        if (!theme) {
            detailContainer.innerHTML = `<p class="gallery-empty-state">Theme not found. Please open details from the gallery page.</p>`;
            return;
        }

        detailContainer.innerHTML = `
            <div class="detail-layout">
                <div class="detail-image-box">
                    <img src="${theme.image}" alt="${theme.title}" onerror="this.onerror=null;this.src='${API_BASE_URL}/assest/images/main%20img.webp'">
                </div>
                <div class="detail-content">
                    <span class="category">${categoryLabel(theme.category)}</span>
                    <h1>${theme.title}</h1>
                    <p class="detail-price">${formatPrice(theme.price)}</p>
                    <div class="detail-badges">
                        <span class="detail-chip">${budgetLabel(theme.budget)}</span>
                    </div>
                    <p class="detail-description">${theme.description}</p>
                    <p class="theme-meta"><strong>Includes:</strong> ${theme.inclusions}</p>
                    <p class="theme-meta"><strong>Ideal For:</strong> ${theme.idealFor}</p>
                    <div class="card-actions detail-actions">
                        <button class="btn-card" id="book-theme-detail-btn">Book This Theme</button>
                        <a class="btn-card btn-card-alt" href="gallery.html">Back to Gallery</a>
                    </div>
                </div>
            </div>
        `;

        const detailBookButton = document.getElementById("book-theme-detail-btn");
        if (detailBookButton) {
            detailBookButton.addEventListener("click", () => bookTheme(theme));
        }

        initRevealAnimations();
    });
}

let revealObserver = null;

function initRevealAnimations() {
    const revealTargets = Array.from(
        document.querySelectorAll(
            ".section-padding, .design-card, .occasion-card, .stat-card, .contact-details-panel, .contact-form-panel, .auth-card, .booking-card, .detail-layout, .gallery-stat, .filter-controls, .booking-detail-card, .review-form-card, .review-item"
        )
    );

    if (!revealTargets.length) return;

    const staggerGroups = [
        { parent: ".occasion-grid", item: ".occasion-card", step: 110 },
        { parent: ".designs-grid", item: ".design-card", step: 95 },
        { parent: ".stats-grid", item: ".stat-card", step: 100 },
        { parent: ".bookings-list", item: ".booking-card", step: 80 },
        { parent: ".gallery-stats", item: ".gallery-stat", step: 120 }
    ];

    const staggeredElements = new Set();

    staggerGroups.forEach(({ parent, item, step }) => {
        document.querySelectorAll(parent).forEach((group) => {
            Array.from(group.querySelectorAll(item)).forEach((element, index) => {
                element.classList.add("reveal-up");
                element.style.transitionDelay = `${Math.min(index * step, 520)}ms`;
                staggeredElements.add(element);
            });
        });
    });

    revealTargets.forEach((element, index) => {
        if (!element.classList.contains("reveal-up")) {
            element.classList.add("reveal-up");
        }
        if (staggeredElements.has(element)) return;
        if (!element.style.transitionDelay) {
            element.style.transitionDelay = `${Math.min(index * 34, 250)}ms`;
        }
    });

    if (revealObserver) {
        revealObserver.disconnect();
    }

    revealObserver = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach((element) => {
        if (element.classList.contains("is-visible")) return;
        revealObserver.observe(element);
    });
}

function initImagePopup() {
    if (document.querySelector(".image-popup-overlay")) return;

    const clickableSelector = ".hero-image-box img, .design-img-box img, .occasion-card img, .collage-main img, .collage-side img, .detail-image-box img, .booking-img img, .auth-image img, .review-detail-stage-image";

    const overlay = document.createElement("div");
    overlay.className = "image-popup-overlay";
    overlay.innerHTML = `
        <button type="button" class="image-popup-close" aria-label="Close preview">&times;</button>
        <img class="image-popup-preview" alt="Expanded preview">
    `;

    document.body.appendChild(overlay);

    const preview = overlay.querySelector(".image-popup-preview");
    const closeButton = overlay.querySelector(".image-popup-close");

    function closePopup() {
        overlay.classList.remove("is-open");
        document.body.classList.remove("popup-open");
    }

    document.addEventListener("click", (event) => {
        const image = event.target.closest(clickableSelector);
        if (!image) return;

        event.preventDefault();
        event.stopPropagation();
        preview.src = image.currentSrc || image.src;
        preview.alt = image.alt || "Preview image";
        overlay.classList.add("is-open");
        document.body.classList.add("popup-open");
    });

    closeButton.addEventListener("click", closePopup);
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) closePopup();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closePopup();
    });
}

function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const statusEl = document.getElementById("contact-form-status");
    const submitBtn = document.getElementById("contact-submit-btn");

    const setStatus = (message, type = "") => {
        if (!statusEl) return;
        statusEl.textContent = message || "";
        statusEl.classList.remove("is-success", "is-error");
        if (type === "success") statusEl.classList.add("is-success");
        if (type === "error") statusEl.classList.add("is-error");
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        setStatus("");

        const payload = {
            fullName: String(document.getElementById("fullName")?.value || "").trim(),
            phone: String(document.getElementById("phone")?.value || "").trim(),
            email: String(document.getElementById("email")?.value || "").trim(),
            eventType: String(document.getElementById("eventType")?.value || "").trim(),
            eventDate: String(document.getElementById("eventDate")?.value || "").trim(),
            budget: String(document.getElementById("budget")?.value || "").trim(),
            message: String(document.getElementById("message")?.value || "").trim()
        };

        if (!payload.fullName || !payload.phone || !payload.email || !payload.eventType || !payload.eventDate || !payload.budget || !payload.message) {
            setStatus("Please fill all fields before submitting.", "error");
            return;
        }

        const originalBtnText = submitBtn ? submitBtn.textContent : "";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const contentType = String(response.headers.get("content-type") || "");
            const body = contentType.includes("application/json")
                ? await response.json()
                : await response.text();

            if (!response.ok) {
                const message = typeof body === "string"
                    ? body
                    : body.message || "Failed to submit enquiry";
                throw new Error(message);
            }

            form.reset();
            setStatus("Enquiry submitted successfully. Our team will contact you soon.", "success");
        } catch (error) {
            setStatus(error.message || "Unable to submit enquiry right now. Please try again.", "error");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText || "Send Enquiry";
            }
        }
    });
}


function initNavDropdowns() {
    const dropdowns = Array.from(document.querySelectorAll(".nav-dropdown"));
    if (!dropdowns.length) return;

    const supportsHover = window.matchMedia("(hover: hover)").matches;

    const closeDropdown = (dropdown) => {
        const toggle = dropdown.querySelector(".nav-dropdown-toggle");
        const menu = dropdown.querySelector(".nav-dropdown-menu");
        if (!toggle || !menu) return;
        dropdown.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        menu.hidden = true;
    };

    const closeAllDropdowns = (except = null) => {
        dropdowns.forEach((dropdown) => {
            if (dropdown !== except) {
                closeDropdown(dropdown);
            }
        });
    };

    const openDropdown = (dropdown) => {
        const toggle = dropdown.querySelector(".nav-dropdown-toggle");
        const menu = dropdown.querySelector(".nav-dropdown-menu");
        if (!toggle || !menu) return;
        closeAllDropdowns(dropdown);
        dropdown.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
        menu.hidden = false;
    };

    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".nav-dropdown-toggle");
        const menu = dropdown.querySelector(".nav-dropdown-menu");
        if (!toggle || !menu) return;

        toggle.addEventListener("click", (event) => {
            event.preventDefault();
            const isOpen = dropdown.classList.contains("open");
            if (isOpen) {
                closeDropdown(dropdown);
            } else {
                openDropdown(dropdown);
            }
        });

        toggle.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeDropdown(dropdown);
                toggle.focus();
                return;
            }

            if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openDropdown(dropdown);
                const firstLink = menu.querySelector("a");
                if (firstLink) firstLink.focus();
            }
        });

        menu.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeDropdown(dropdown);
                toggle.focus();
            }
        });

        if (supportsHover) {
            dropdown.addEventListener("mouseenter", () => openDropdown(dropdown));
            dropdown.addEventListener("mouseleave", () => closeDropdown(dropdown));
        }
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".nav-dropdown")) {
            closeAllDropdowns();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeAllDropdowns();
        }
    });
}

async function initNavbarAuthState() {
    const navContainer = document.querySelector('.nav-container');
    const authButton = navContainer ? navContainer.querySelector('.btn-nav') : null;
    if (authButton) {
        authButton.style.visibility = 'hidden';
    }
    const session = await getCustomerSession();
    if (session?.customer) {
        renderCustomerMenu(session.customer);
        return;
    }
    if (authButton) {
        authButton.style.visibility = '';
    }
}

function initDarkMode() {
    const isDark = localStorage.getItem("darkMode") === "true";
    if (isDark) {
        document.documentElement.classList.add("dark-mode");
        document.body.classList.add("dark-mode");
    } else {
        document.documentElement.classList.remove("dark-mode");
        document.body.classList.remove("dark-mode");
    }

    const toggle = document.getElementById("dark-mode-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
        const nowDark = document.body.classList.toggle("dark-mode");
        document.documentElement.classList.toggle("dark-mode", nowDark);
        localStorage.setItem("darkMode", nowDark ? "true" : "false");
    });
}

// Apply dark mode immediately to prevent flash of light theme
(function () {
    if (localStorage.getItem("darkMode") === "true") {
        document.documentElement.classList.add("dark-mode");
    }
})();



function bindFloatingMenu({ root, trigger, panel, closeOthers, closeDelay = 160 }) {
    if (!root || !trigger || !panel) {
        return {
            openMenu() {},
            closeMenu() {},
            isOpen() { return false; }
        };
    }

    const hoverEnabled = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let closeTimer = null;

    const cancelScheduledClose = () => {
        if (closeTimer) {
            window.clearTimeout(closeTimer);
            closeTimer = null;
        }
    };

    const isOpen = () => root.classList.contains("open");

    const closeMenu = () => {
        cancelScheduledClose();
        root.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
        panel.hidden = true;
    };

    const openMenu = () => {
        cancelScheduledClose();
        if (typeof closeOthers === "function") {
            closeOthers(root);
        }
        root.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
        panel.hidden = false;
    };

    const scheduleClose = () => {
        cancelScheduledClose();
        closeTimer = window.setTimeout(closeMenu, closeDelay);
    };

    const focusFirstMenuItem = () => {
        const focusable = panel.querySelector("a, button, [tabindex]:not([tabindex='-1'])");
        if (focusable) focusable.focus();
    };

    trigger.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (isOpen()) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    trigger.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            trigger.focus();
            return;
        }

        if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openMenu();
            focusFirstMenuItem();
        }
    });

    root.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            trigger.focus();
        }
    });

    root.addEventListener("focusin", cancelScheduledClose);
    root.addEventListener("focusout", (event) => {
        if (!root.contains(event.relatedTarget)) {
            scheduleClose();
        }
    });

    if (hoverEnabled) {
        root.addEventListener("pointerenter", openMenu);
        root.addEventListener("pointerleave", scheduleClose);
        panel.addEventListener("pointerenter", cancelScheduledClose);
        panel.addEventListener("pointerleave", scheduleClose);
    }

    document.addEventListener("pointerdown", (event) => {
        if (!root.contains(event.target)) {
            closeMenu();
        }
    });

    return { openMenu, closeMenu, isOpen };
}

function createCustomerMenu(customer) {
    const wrapper = document.createElement("div");
    wrapper.className = "customer-menu";

    const currentPage = String(window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const label = String(customer?.name || customer?.email || customer?.phone || "Customer").trim();
    const initial = label ? label.charAt(0).toUpperCase() : "C";
    const secondary = String(customer?.email || customer?.phone || "Signed in").trim();

    const profileCurrent = currentPage === "profile.html";
    const bookingsCurrent = currentPage === "my-bookings.html" || currentPage === "booking-details.html";
    const notificationsCurrent = currentPage === "notifications.html";

    wrapper.innerHTML = `
        <button type="button" class="customer-menu-trigger" aria-expanded="false" aria-haspopup="true">
            <span class="customer-menu-avatar">${escapeHtml(initial)}</span>
            <span class="customer-menu-copy">
                <span class="customer-menu-name">${escapeHtml(label)}</span>
                <span class="customer-menu-meta">${escapeHtml(secondary)}</span>
            </span>
            <i class="fas fa-chevron-down" aria-hidden="true"></i>
        </button>
        <div class="customer-menu-panel" hidden>
            <a href="profile.html" class="customer-menu-link${profileCurrent ? " is-current" : ""}" ${profileCurrent ? 'aria-current="page"' : ""}>
                <i class="fas fa-user-circle" aria-hidden="true"></i>
                <span>Profile</span>
            </a>
            <a href="my-bookings.html" class="customer-menu-link${bookingsCurrent ? " is-current" : ""}" ${bookingsCurrent ? 'aria-current="page"' : ""}>
                <i class="fas fa-calendar-check" aria-hidden="true"></i>
                <span>My Bookings</span>
            </a>
            <a href="notifications.html" class="customer-menu-link${notificationsCurrent ? " is-current" : ""}" ${notificationsCurrent ? 'aria-current="page"' : ""}>
                <i class="fas fa-bell" aria-hidden="true"></i>
                <span>Notifications</span>
            </a>
            <button type="button" class="customer-menu-link customer-menu-logout">
                <i class="fas fa-right-from-bracket" aria-hidden="true"></i>
                <span>Logout</span>
            </button>
        </div>
    `;

    const trigger = wrapper.querySelector(".customer-menu-trigger");
    const panel = wrapper.querySelector(".customer-menu-panel");
    const logoutButton = wrapper.querySelector(".customer-menu-logout");

    bindFloatingMenu({ root: wrapper, trigger, panel });
    logoutButton.addEventListener("click", () => logoutCustomer());

    return wrapper;
}

function statusBadgeClass(status) {
    const value = String(status || "").trim().toLowerCase();
    if (value === "accepted" || value === "completed") return "status-badge status-accepted";
    if (value === "pending") return "status-badge status-pending";
    if (value === "rejected" || value === "cancelled") return "status-badge status-rejected";
    return "status-badge";
}

function formatShortDate(dateValue) {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function formatShortDateRange(startValue, endValue) {
    const startLabel = formatShortDate(startValue);
    const endLabel = formatShortDate(endValue || startValue);
    if (startLabel === "-" || endLabel === "-" || startLabel === endLabel) {
        return { label: "Event date", value: startLabel !== "-" ? startLabel : endLabel };
    }
    return { label: "Event dates", value: `${startLabel} - ${endLabel}` };
}

function formatShortDateTime(dateValue) {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function getNotificationBucket(item) {
    const type = String(item?.type || "").toLowerCase();
    if (type === "booking_reminder" || type === "owner_overdue_reminder" || type === "payment_due_reminder") return "reminders";
    if (type === "owner_message" || type === "payment_notice" || type === "payment_update") return "messages";
    return "alerts";
}

function notificationBucketLabel(bucket) {
    if (bucket === "messages") return "Message";
    if (bucket === "reminders") return "Reminder";
    return "Alert";
}

function getNotificationIcon(type) {
    const normalized = String(type || "").toLowerCase();
    if (normalized === "booking_reminder" || normalized === "owner_overdue_reminder") return "fa-clock";
    if (normalized === "payment_notice" || normalized === "payment_due_reminder" || normalized === "payment_update") return "fa-wallet";
    if (normalized === "owner_message") return "fa-envelope-open-text";
    if (normalized === "booking_status") return "fa-circle-check";
    return "fa-bell";
}

function resolveBookingImageSource(imagePath) {
    const fallback = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=200&auto=format&fit=crop";
    const raw = String(imagePath || "").trim();
    if (!raw) return fallback;
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    if (raw.startsWith("data:image/")) return raw;
    const normalized = raw.replace(/\\/g, "/");
    const absolute = normalized.startsWith("/") ? normalized : `/${normalized}`;
    return `${API_BASE_URL}${encodeURI(absolute)}`;
}

function initNavDropdowns() {
    const dropdowns = Array.from(document.querySelectorAll(".nav-dropdown"));
    if (!dropdowns.length) return;

    const controllers = [];
    const closeOtherDropdowns = (exceptRoot = null) => {
        controllers.forEach((controller) => {
            if (controller.root !== exceptRoot) {
                controller.closeMenu();
            }
        });
    };

    dropdowns.forEach((dropdown) => {
        const trigger = dropdown.querySelector(".nav-dropdown-toggle");
        const panel = dropdown.querySelector(".nav-dropdown-menu");
        if (!trigger || !panel) return;

        const controller = bindFloatingMenu({
            root: dropdown,
            trigger,
            panel,
            closeOthers: closeOtherDropdowns
        });

        controllers.push({
            root: dropdown,
            closeMenu: controller.closeMenu
        });
    });
}

async function initProfilePage() {
    const profileRoot = document.getElementById("profile-page");
    if (!profileRoot) return;

    const headerName = document.getElementById("profile-hero-name");
    const identityCard = document.getElementById("profile-identity-card");
    const statsGrid = document.getElementById("profile-stat-grid");
    const bookingsList = document.getElementById("profile-bookings-list");
    const notificationsList = document.getElementById("profile-notifications-list");
    const statusEl = document.getElementById("profile-page-status");

    const setStatus = (message = "") => {
        if (!statusEl) return;
        statusEl.hidden = !message;
        statusEl.textContent = message;
    };

    const renderIdentity = (customer, bookings, notifications) => {
        if (!identityCard) return;

        const name = String(customer?.name || "Customer").trim();
        const initial = name ? name.charAt(0).toUpperCase() : "C";
        const unreadCount = notifications.filter((item) => !item.is_read).length;

        identityCard.innerHTML = `
            <div class="profile-identity-topbar">
                <span class="profile-kicker">Customer profile</span>
                <span class="profile-presence-badge">
                    <i class="fas fa-circle" aria-hidden="true"></i>
                    Active account
                </span>
            </div>
            <div class="profile-identity-head">
                <div class="profile-avatar-wrap">
                    <div class="profile-avatar-lg">${escapeHtml(initial)}</div>
                </div>
                <div class="profile-identity-copy">
                    <h3>${escapeHtml(name)}</h3>
                    <p>Manage your saved details, track bookings, and stay on top of the latest updates from your decoration journey.</p>
                </div>
            </div>
            <div class="profile-identity-grid profile-identity-grid-single">
                <article class="profile-field">
                    <span class="profile-label">Email Address</span>
                    <strong class="profile-value">${escapeHtml(customer?.email || "Not added yet")}</strong>
                </article>
                <article class="profile-field">
                    <span class="profile-label">Phone Number</span>
                    <strong class="profile-value">${escapeHtml(customer?.phone || "Not added yet")}</strong>
                </article>
                <article class="profile-field">
                    <span class="profile-label">Customer ID</span>
                    <strong class="profile-value">#${escapeHtml(customer?.id || "-")}</strong>
                </article>
                <article class="profile-field">
                    <span class="profile-label">Unread Notifications</span>
                    <strong class="profile-value">${escapeHtml(String(unreadCount))}</strong>
                </article>
            </div>
            <div class="profile-profile-footer">
                <div class="profile-summary-chip">
                    <span class="profile-summary-chip-label">Account summary</span>
                    <strong>${escapeHtml(String(unreadCount))} unread updates</strong>
                </div>
                <button type="button" class="profile-edit-btn">
                    <i class="fas fa-pen-to-square" aria-hidden="true"></i>
                    <span>Edit Profile</span>
                </button>
            </div>
        `;
    };

    const renderStats = (bookings, notifications) => {
        if (!statsGrid) return;

        const pendingBookings = bookings.filter((item) => String(item?.status || "").trim().toLowerCase() === "pending").length;
        const confirmedBookings = bookings.filter((item) => {
            const value = String(item?.status || "").trim().toLowerCase();
            return value === "accepted" || value === "completed";
        }).length;
        const unreadNotifications = notifications.filter((item) => !item.is_read).length;

        const cards = [
            { label: "Total Bookings", value: bookings.length, icon: "fa-calendar-check" },
            { label: "Pending Approval", value: pendingBookings, icon: "fa-clock" },
            { label: "Confirmed Events", value: confirmedBookings, icon: "fa-circle-check" },
            { label: "Unread Notifications", value: unreadNotifications, icon: "fa-bell" }
        ];

        statsGrid.innerHTML = cards.map((card) => `
            <article class="profile-stat-card">
                <div class="profile-stat-card-top">
                    <span class="profile-stat-icon"><i class="fas ${card.icon}" aria-hidden="true"></i></span>
                </div>
                <strong>${escapeHtml(String(card.value))}</strong>
                <p>${escapeHtml(card.label)}</p>
            </article>
        `).join("");
    };

    const renderRecentBookings = (bookings) => {
        if (!bookingsList) return;

        const items = Array.isArray(bookings) ? bookings.slice(0, 4) : [];
        if (!items.length) {
            bookingsList.innerHTML = '<p class="gallery-empty-state">You have no booking activity yet. Once you book a decoration, it will appear here.</p>';
            return;
        }

        bookingsList.innerHTML = items.map((booking) => {
            const dateRange = formatShortDateRange(booking.event_date, booking.event_end_date || booking.event_date);
            return `
            <article class="profile-booking-item">
                <img src="${resolveBookingImageSource(booking.decoration_image)}" alt="${escapeHtml(booking.decoration_title || "Booked theme")}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=200&auto=format&fit=crop'">
                <div class="profile-booking-copy">
                    <div class="profile-item-head">
                        <h4>${escapeHtml(booking.decoration_title || "Decoration Booking")}</h4>
                        <span class="${statusBadgeClass(booking.status)}">${escapeHtml(booking.status || "pending")}</span>
                    </div>
                    <p class="profile-item-text">${dateRange.label}: <strong>${escapeHtml(dateRange.value)}</strong></p>
                    <p class="profile-activity-meta">${escapeHtml(booking.location || "Venue pending")} | ${escapeHtml(booking.event_time || "Time pending")}</p>
                    <div class="profile-inline-actions">
                        <a href="booking-details.html?booking=${encodeURIComponent(booking.id)}" class="btn-text">View details</a>
                    </div>
                </div>
            </article>
        `;
        }).join("");
    };

    const renderRecentNotifications = (notifications) => {
        if (!notificationsList) return;

        const items = Array.isArray(notifications) ? notifications.slice(0, 5) : [];
        if (!items.length) {
            notificationsList.innerHTML = '<p class="gallery-empty-state">No account activity has been sent yet. Your latest reminders and messages will show up here.</p>';
            return;
        }

        notificationsList.innerHTML = items.map((item) => {
            const bucket = getNotificationBucket(item);
            return `
                <article class="profile-notification-item ${item.is_read ? "is-read" : "is-unread"}">
                    <span class="profile-activity-icon"><i class="fas ${getNotificationIcon(item.type)}" aria-hidden="true"></i></span>
                    <div class="profile-notification-copy">
                        <div class="profile-item-head">
                            <h4>${escapeHtml(item.title || "Notification")}</h4>
                            <span class="profile-activity-badge">${escapeHtml(notificationBucketLabel(bucket))}</span>
                        </div>
                        <p class="profile-item-text">${escapeHtml(item.message || "No details available.")}</p>
                        <p class="profile-activity-meta">${escapeHtml(formatShortDateTime(item.sent_at || item.created_at || item.due_at))}</p>
                    </div>
                </article>
            `;
        }).join("");
    };

    if (identityCard) {
        identityCard.innerHTML = '<p class="gallery-empty-state">Loading your profile details...</p>';
    }
    if (statsGrid) {
        statsGrid.innerHTML = "";
    }
    if (bookingsList) {
        bookingsList.innerHTML = '<p class="gallery-empty-state">Loading your booking activity...</p>';
    }
    if (notificationsList) {
        notificationsList.innerHTML = '<p class="gallery-empty-state">Loading your recent notifications...</p>';
    }

    const session = await getCustomerSession();
    if (!session?.customer) {
        window.location.href = "login.html";
        return;
    }

    const customer = session.customer;
    if (headerName) {
        headerName.textContent = customer.name || "Customer";
    }

    let bookings = [];
    let notifications = [];
    const issues = [];

    try {
        const response = await apiFetch("/api/bookings/mine");
        const data = await response.json().catch(() => []);
        if (!response.ok) {
            issues.push(typeof data?.message === "string" ? data.message : "Unable to load bookings right now.");
        } else {
            bookings = Array.isArray(data) ? data : [];
        }
    } catch (error) {
        issues.push("Unable to load bookings right now.");
    }

    if (Number.isInteger(Number(customer.id))) {
        try {
            const response = await apiFetch(`/api/notifications?customer_id=${encodeURIComponent(customer.id)}&limit=8`);
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                issues.push(typeof data?.message === "string" ? data.message : "Unable to load notifications right now.");
            } else {
                notifications = Array.isArray(data.notifications) ? data.notifications : [];
            }
        } catch (error) {
            issues.push("Unable to load notifications right now.");
        }
    }

    renderIdentity(customer, bookings, notifications);
    renderStats(bookings, notifications);
    renderRecentBookings(bookings);
    renderRecentNotifications(notifications);
    setStatus(issues[0] || "");
}




function ensureStoriesNavLink() {
    document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
        const label = dropdown.querySelector(".nav-dropdown-toggle span");
        const menu = dropdown.querySelector(".nav-dropdown-menu");
        if (!label || !menu) return;
        if (String(label.textContent || "").trim().toLowerCase() !== "gallery") return;
        if (menu.querySelector('[href="reviews.html"]')) return;

        const link = document.createElement("a");
        link.href = "reviews.html";
        link.innerHTML = '<i class="fas fa-camera-retro" aria-hidden="true"></i><span>Customer Stories</span>';
        menu.appendChild(link);
    });
}

function storyStarsMarkup(rating) {
    const safeRating = Math.max(0, Math.min(5, Number(rating || 0)));
    return Array.from({ length: 5 }, (_, index) => (
        `<span class="story-star ${index < safeRating ? "active" : ""}">&#9733;</span>`
    )).join("");
}

function renderSharedExperienceCards(reviews, options = {}) {
    const items = Array.isArray(reviews) ? reviews : [];
    const showCustomerName = options.showCustomerName !== false;
    const emptyMessage = options.emptyMessage || "No shared decoration experiences yet.";

    if (!items.length) {
        return `<p class="gallery-empty-state">${escapeHtml(emptyMessage)}</p>`;
    }

    return items.map((review) => {
        const photos = Array.isArray(review.photos) ? review.photos.filter(Boolean) : [];
        const mediaItems = photos.length ? photos : [review.decoration_image].filter(Boolean);
        const primaryImage = resolveImageSource(mediaItems[0] || "");
        const extraImages = mediaItems.slice(1, 4);

        return `
            <article class="story-card">
                <div class="story-media">
                    <img class="story-main-image" src="${primaryImage}" alt="${escapeHtml(review.decoration_title || "Customer decoration experience")}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop'">
                    ${extraImages.length ? `
                        <div class="story-thumb-grid">
                            ${extraImages.map((photo) => `<img src="${resolveImageSource(photo)}" alt="Shared decoration photo" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop'">`).join("")}
                        </div>
                    ` : ""}
                </div>
                <div class="story-content">
                    <div class="story-rating">${storyStarsMarkup(review.rating)}</div>
                    <h3>${escapeHtml(review.decoration_title || "Decoration Experience")}</h3>
                    ${showCustomerName ? `<p class="story-author">Shared by ${escapeHtml(review.customer_name || "Customer")}</p>` : ""}
                    <p class="story-copy">${escapeHtml(review.comment || "Loved the overall decoration and event setup.")}</p>
                    ${review.feedback ? `<p class="story-feedback"><strong>Feedback:</strong> ${escapeHtml(review.feedback)}</p>` : ""}
                    <p class="story-meta">${escapeHtml(formatShortDate(review.created_at))}${review.location ? ` | ${escapeHtml(review.location)}` : ""}</p>
                </div>
            </article>
        `;
    }).join("");
}

async function initPublicReviewsPage() {
    const root = document.getElementById("public-reviews-page");
    if (!root) return;

    const grid = document.getElementById("public-reviews-grid");
    const totalEl = document.getElementById("public-reviews-count");
    const avgEl = document.getElementById("public-reviews-rating");

    if (grid) {
        grid.innerHTML = '<p class="gallery-empty-state">Loading shared decoration experiences...</p>';
    }

    try {
        const response = await apiFetch("/api/reviews/public?limit=24");
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.message || "Failed to load customer stories");
        }

        const reviews = Array.isArray(data.reviews) ? data.reviews : [];
        const average = reviews.length
            ? (reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length).toFixed(1)
            : "0.0";

        if (totalEl) totalEl.textContent = String(reviews.length);
        if (avgEl) avgEl.textContent = String(average);
        if (grid) {
            grid.innerHTML = renderSharedExperienceCards(reviews, {
                showCustomerName: true,
                emptyMessage: "No completed decoration experiences have been shared yet."
            });
        }
    } catch (error) {
        if (grid) {
            grid.innerHTML = `<p class="gallery-empty-state">${escapeHtml(error.message || "Unable to load customer stories right now.")}</p>`;
        }
    }
}

async function initProfilePage() {
    const profileRoot = document.getElementById("profile-page");
    if (!profileRoot) return;

    const headerName = document.getElementById("profile-hero-name");
    const identityCard = document.getElementById("profile-identity-card");
    const statsGrid = document.getElementById("profile-stat-grid");
    const bookingsList = document.getElementById("profile-bookings-list");
    const notificationsList = document.getElementById("profile-notifications-list");
    const sharedReviewsList = document.getElementById("profile-shared-reviews");
    const statusEl = document.getElementById("profile-page-status");

    const setStatus = (message = "") => {
        if (!statusEl) return;
        statusEl.hidden = !message;
        statusEl.textContent = message;
    };

    const renderIdentity = (customer, notifications) => {
        if (!identityCard) return;

        const name = String(customer?.name || "Customer").trim();
        const initial = name ? name.charAt(0).toUpperCase() : "C";
        const unreadCount = notifications.filter((item) => !item.is_read).length;

        identityCard.innerHTML = `
            <div class="profile-identity-topbar">
                <span class="profile-kicker">Customer profile</span>
                <span class="profile-presence-badge">
                    <i class="fas fa-circle" aria-hidden="true"></i>
                    Active account
                </span>
            </div>
            <div class="profile-identity-head">
                <div class="profile-avatar-wrap">
                    <div class="profile-avatar-lg">${escapeHtml(initial)}</div>
                </div>
                <div class="profile-identity-copy">
                    <h3>${escapeHtml(name)}</h3>
                    <p>Manage your saved details, track bookings, and stay on top of the latest updates from your decoration journey.</p>
                </div>
            </div>
            <div class="profile-identity-grid profile-identity-grid-single">
                <article class="profile-field">
                    <span class="profile-label">Email Address</span>
                    <strong class="profile-value">${escapeHtml(customer?.email || "Not added yet")}</strong>
                </article>
                <article class="profile-field">
                    <span class="profile-label">Phone Number</span>
                    <strong class="profile-value">${escapeHtml(customer?.phone || "Not added yet")}</strong>
                </article>
                <article class="profile-field">
                    <span class="profile-label">Customer ID</span>
                    <strong class="profile-value">#${escapeHtml(customer?.id || "-")}</strong>
                </article>
                <article class="profile-field">
                    <span class="profile-label">Unread Notifications</span>
                    <strong class="profile-value">${escapeHtml(String(unreadCount))}</strong>
                </article>
            </div>
            <div class="profile-profile-footer">
                <div class="profile-summary-chip">
                    <span class="profile-summary-chip-label">Account summary</span>
                    <strong>${escapeHtml(String(unreadCount))} unread updates</strong>
                </div>
                <button type="button" class="profile-edit-btn">
                    <i class="fas fa-pen-to-square" aria-hidden="true"></i>
                    <span>Edit Profile</span>
                </button>
            </div>
        `;
    };

    const renderStats = (bookings, notifications, sharedReviews) => {
        if (!statsGrid) return;

        const pendingBookings = bookings.filter((item) => String(item?.status || "").trim().toLowerCase() === "pending").length;
        const confirmedBookings = bookings.filter((item) => {
            const value = String(item?.status || "").trim().toLowerCase();
            return value === "accepted" || value === "completed";
        }).length;
        const unreadNotifications = notifications.filter((item) => !item.is_read).length;

        const cards = [
            { label: "Total Bookings", value: bookings.length, icon: "fa-calendar-check" },
            { label: "Pending Approval", value: pendingBookings, icon: "fa-clock" },
            { label: "Confirmed Events", value: confirmedBookings, icon: "fa-circle-check" },
            { label: "Shared Experiences", value: sharedReviews.length, icon: "fa-camera-retro" },
            { label: "Unread Notifications", value: unreadNotifications, icon: "fa-bell" }
        ];

        statsGrid.innerHTML = cards.map((card) => `
            <article class="profile-stat-card">
                <div class="profile-stat-card-top">
                    <span class="profile-stat-icon"><i class="fas ${card.icon}" aria-hidden="true"></i></span>
                </div>
                <strong>${escapeHtml(String(card.value))}</strong>
                <p>${escapeHtml(card.label)}</p>
            </article>
        `).join("");
    };

    const renderRecentBookings = (bookings) => {
        if (!bookingsList) return;
        const items = Array.isArray(bookings) ? bookings.slice(0, 4) : [];
        if (!items.length) {
            bookingsList.innerHTML = '<p class="gallery-empty-state">You have no booking activity yet. Once you book a decoration, it will appear here.</p>';
            return;
        }

        bookingsList.innerHTML = items.map((booking) => {
            const dateRange = formatShortDateRange(booking.event_date, booking.event_end_date || booking.event_date);
            return `
            <article class="profile-booking-item">
                <img src="${resolveImageSource(booking.decoration_image || "")}" alt="${escapeHtml(booking.decoration_title || "Booked theme")}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=200&auto=format&fit=crop'">
                <div class="profile-booking-copy">
                    <div class="profile-item-head">
                        <h4>${escapeHtml(booking.decoration_title || "Decoration Booking")}</h4>
                        <span class="${statusBadgeClass(booking.status)}">${escapeHtml(booking.status || "pending")}</span>
                    </div>
                    <p class="profile-item-text">${dateRange.label}: <strong>${escapeHtml(dateRange.value)}</strong></p>
                    <p class="profile-activity-meta">${escapeHtml(booking.location || "Venue pending")} | ${escapeHtml(booking.event_time || "Time pending")}</p>
                    <div class="profile-inline-actions">
                        <a href="booking-details.html?booking=${encodeURIComponent(booking.id)}" class="btn-text">View details</a>
                    </div>
                </div>
            </article>
        `;
        }).join("");
    };

    const renderRecentNotifications = (notifications) => {
        if (!notificationsList) return;
        const items = Array.isArray(notifications) ? notifications.slice(0, 5) : [];
        if (!items.length) {
            notificationsList.innerHTML = '<p class="gallery-empty-state">No account activity has been sent yet. Your latest reminders and messages will show up here.</p>';
            return;
        }

        notificationsList.innerHTML = items.map((item) => {
            const bucket = getNotificationBucket(item);
            return `
                <article class="profile-notification-item ${item.is_read ? "is-read" : "is-unread"}">
                    <span class="profile-activity-icon"><i class="fas ${getNotificationIcon(item.type)}" aria-hidden="true"></i></span>
                    <div class="profile-notification-copy">
                        <div class="profile-item-head">
                            <h4>${escapeHtml(item.title || "Notification")}</h4>
                            <span class="profile-activity-badge">${escapeHtml(notificationBucketLabel(bucket))}</span>
                        </div>
                        <p class="profile-item-text">${escapeHtml(item.message || "No details available.")}</p>
                        <p class="profile-activity-meta">${escapeHtml(formatShortDateTime(item.sent_at || item.created_at || item.due_at))}</p>
                    </div>
                </article>
            `;
        }).join("");
    };

    if (identityCard) identityCard.innerHTML = '<p class="gallery-empty-state">Loading your profile details...</p>';
    if (bookingsList) bookingsList.innerHTML = '<p class="gallery-empty-state">Loading your booking activity...</p>';
    if (notificationsList) notificationsList.innerHTML = '<p class="gallery-empty-state">Loading your recent notifications...</p>';
    if (sharedReviewsList) sharedReviewsList.innerHTML = '<p class="gallery-empty-state">Loading your shared decoration experiences...</p>';

    const session = await getCustomerSession();
    if (!session?.customer) {
        window.location.href = "login.html";
        return;
    }

    const customer = session.customer;
    if (headerName) headerName.textContent = customer.name || "Customer";

    let bookings = [];
    let notifications = [];
    let sharedReviews = [];
    const issues = [];

    const requests = [
        apiFetch("/api/bookings/mine").then(async (response) => {
            const data = await response.json().catch(() => []);
            if (!response.ok) throw new Error(data.message || "Unable to load bookings right now.");
            bookings = Array.isArray(data) ? data : [];
        }),
        apiFetch(`/api/notifications?customer_id=${encodeURIComponent(customer.id)}&limit=8`).then(async (response) => {
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.message || "Unable to load notifications right now.");
            notifications = Array.isArray(data.notifications) ? data.notifications : [];
        }),
        apiFetch("/api/reviews/mine").then(async (response) => {
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.message || "Unable to load your shared experiences right now.");
            sharedReviews = Array.isArray(data.reviews) ? data.reviews : [];
        })
    ];

    await Promise.all(requests.map((request) => request.catch((error) => issues.push(error.message || "Something went wrong."))));

    renderIdentity(customer, notifications);
    renderStats(bookings, notifications, sharedReviews);
    renderRecentBookings(bookings);
    renderRecentNotifications(notifications);
    if (sharedReviewsList) {
        sharedReviewsList.innerHTML = renderSharedExperienceCards(sharedReviews, {
            showCustomerName: false,
            emptyMessage: "You have not shared a completed decoration experience yet."
        });
    }
    setStatus(issues[0] || "");
}



function ensureStoriesNavLink() {
    const currentPage = String(window.location.pathname.split("/").pop() || "index.html").trim().toLowerCase();

    document.querySelectorAll(".nav-links").forEach((list) => {
        Array.from(list.children).forEach((item) => {
            const directLink = item.firstElementChild;
            if (!directLink || directLink.tagName !== "A") return;

            const href = String(directLink.getAttribute("href") || "").trim().toLowerCase();
            if (href !== "my-bookings.html" && href !== "reviews.html") return;

            directLink.setAttribute("href", "reviews.html");
            directLink.textContent = "Customer Reviews";
            directLink.classList.toggle("active", currentPage === "reviews.html");
            if (currentPage !== "reviews.html") {
                directLink.removeAttribute("aria-current");
            }
        });
    });

    document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
        const label = dropdown.querySelector(".nav-dropdown-toggle span");
        const menu = dropdown.querySelector(".nav-dropdown-menu");
        if (!label || !menu) return;
        if (String(label.textContent || "").trim().toLowerCase() !== "gallery") return;

        let link = menu.querySelector('[href="reviews.html"]');
        if (!link) {
            link = document.createElement("a");
            link.href = "reviews.html";
            menu.appendChild(link);
        }

        link.innerHTML = '<i class="fas fa-camera-retro" aria-hidden="true"></i><span>Customer Reviews</span>';
    });
}

function storyStarsMarkup(rating) {
    const safeRating = Math.max(0, Math.min(5, Number(rating || 0)));
    return Array.from({ length: 5 }, (_, index) => (
        `<span class="story-star ${index < safeRating ? "active" : ""}">&#9733;</span>`
    )).join("");
}

function renderSharedExperienceCards(reviews, options = {}) {
    const items = Array.isArray(reviews) ? reviews : [];
    const showCustomerName = options.showCustomerName !== false;
    const emptyMessage = options.emptyMessage || "No customer reviews yet.";

    if (!items.length) {
        return `<p class="gallery-empty-state">${escapeHtml(emptyMessage)}</p>`;
    }

    return items.map((review) => {
        const photos = Array.isArray(review.photos) ? review.photos.filter(Boolean) : [];
        const mediaItems = photos.length ? photos : [review.decoration_image].filter(Boolean);
        const primaryImage = resolveImageSource(mediaItems[0] || "");
        const extraImages = mediaItems.slice(1, 4);
        const title = review.decoration_title || (review.source === "public" ? "Customer Review" : "Decoration Experience");
        const author = review.customer_name || (review.source === "public" ? "Visitor" : "Customer");
        const metaParts = [formatShortDate(review.created_at)];
        if (review.location) metaParts.push(review.location);
        if (review.source === "public") metaParts.push("Community Review");

        return `
            <article class="story-card">
                <div class="story-media">
                    <img class="story-main-image" src="${primaryImage}" alt="${escapeHtml(title)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop'">
                    ${extraImages.length ? `
                        <div class="story-thumb-grid">
                            ${extraImages.map((photo) => `<img src="${resolveImageSource(photo)}" alt="Shared decoration photo" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop'">`).join("")}
                        </div>
                    ` : ""}
                </div>
                <div class="story-content">
                    <div class="story-rating">${storyStarsMarkup(review.rating)}</div>
                    <h3>${escapeHtml(title)}</h3>
                    ${showCustomerName ? `<p class="story-author">Shared by ${escapeHtml(author)}</p>` : ""}
                    <p class="story-copy">${escapeHtml(review.comment || "Loved the decoration experience.")}</p>
                    ${review.feedback ? `<p class="story-feedback"><strong>Feedback:</strong> ${escapeHtml(review.feedback)}</p>` : ""}
                    <p class="story-meta">${escapeHtml(metaParts.filter(Boolean).join(" | "))}</p>
                </div>
            </article>
        `;
    }).join("");
}

function renderPublicReviewFormStars(selected = 0) {
    return [1, 2, 3, 4, 5].map((value) => (
        `<button type="button" class="review-star ${value <= selected ? "active" : ""}" data-rating="${value}" aria-label="${value} star">?</button>`
    )).join("");
}

function initPublicReviewSubmission(refreshReviews) {
    const form = document.getElementById("public-review-form");
    if (!form) return;

    const starsHost = document.getElementById("public-review-stars");
    const titleInput = document.getElementById("public-review-title");
    const commentInput = document.getElementById("public-review-comment");
    const photoInput = document.getElementById("public-review-photos");
    const previewGrid = document.getElementById("public-review-photo-preview");
    const submitBtn = document.getElementById("public-review-submit");
    const messageEl = document.getElementById("public-review-message");
    let rating = 0;

    if (starsHost) {
        starsHost.innerHTML = renderPublicReviewFormStars(0);
    }

    const stars = Array.from(form.querySelectorAll(".review-star"));

    function showMessage(message, isError = false) {
        if (!messageEl) return;
        messageEl.textContent = message || "";
        messageEl.classList.toggle("error", isError);
        messageEl.classList.toggle("success", !isError && !!message);
    }

    function renderPreview() {
        if (!previewGrid || !photoInput) return;

        const files = Array.from(photoInput.files || []);
        if (!files.length) {
            previewGrid.innerHTML = "";
            return;
        }

        previewGrid.innerHTML = files.map((file) => {
            const previewUrl = URL.createObjectURL(file);
            return `
                <figure class="review-photo-preview-card">
                    <img src="${previewUrl}" alt="${escapeHtml(file.name || "Customer review photo")}">
                    <figcaption>${escapeHtml(file.name || "Review photo")}</figcaption>
                </figure>
            `;
        }).join("");
    }

    stars.forEach((star) => {
        star.addEventListener("click", () => {
            rating = Number.parseInt(star.dataset.rating, 10) || 0;
            stars.forEach((item) => {
                const value = Number.parseInt(item.dataset.rating, 10) || 0;
                item.classList.toggle("active", value <= rating);
            });
        });
    });

    if (photoInput) {
        photoInput.addEventListener("change", () => {
            const files = Array.from(photoInput.files || []);
            if (files.length > 6) {
                photoInput.value = "";
                renderPreview();
                showMessage("Please upload up to 6 photos only.", true);
                return;
            }
            showMessage("");
            renderPreview();
        });
    }

    if (!submitBtn) return;

    submitBtn.addEventListener("click", async () => {
        const session = await getCustomerSession();
        if (!session?.customer) {
            showMessage("Please log in to post a customer review.", true);
            return;
        }
        const experienceTitle = String(titleInput?.value || "").trim();
        const comment = String(commentInput?.value || "").trim();
        const files = Array.from(photoInput?.files || []);

        if (rating < 1 || rating > 5) {
            showMessage("Please choose a rating from 1 to 5 stars.", true);
            return;
        }
        if (!comment) {
            showMessage("Please write your review before submitting.", true);
            return;
        }
        if (!files.length) {
            showMessage("Please upload at least one photo.", true);
            return;
        }

        try {
            submitBtn.disabled = true;
            showMessage("Sharing your customer review...");

            const formData = new FormData();
            formData.append("experience_title", experienceTitle);
            formData.append("rating", String(rating));
            formData.append("comment", comment);
            files.forEach((file) => formData.append("photos", file));

            const response = await apiFetch("/api/reviews/public", {
                method: "POST",
                body: formData
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data.message || "Failed to share customer review");
            }

            form.reset();
            rating = 0;
            if (starsHost) {
                starsHost.innerHTML = renderPublicReviewFormStars(0);
                Array.from(form.querySelectorAll(".review-star")).forEach((star) => {
                    star.addEventListener("click", () => {
                        rating = Number.parseInt(star.dataset.rating, 10) || 0;
                        Array.from(form.querySelectorAll(".review-star")).forEach((item) => {
                            const value = Number.parseInt(item.dataset.rating, 10) || 0;
                            item.classList.toggle("active", value <= rating);
                        });
                    });
                });
            }
            if (previewGrid) previewGrid.innerHTML = "";
            showMessage(data.message || "Customer review shared successfully.");
            if (typeof refreshReviews === "function") {
                await refreshReviews();
            }
        } catch (error) {
            showMessage(error.message || "Unable to share customer review right now.", true);
        } finally {
            submitBtn.disabled = false;
        }
    });
}

async function initPublicReviewsPage() {
    const root = document.getElementById("public-reviews-page");
    if (!root) return;

    const grid = document.getElementById("public-reviews-grid");
    const totalEl = document.getElementById("public-reviews-count");
    const avgEl = document.getElementById("public-reviews-rating");

    const loadReviews = async () => {
        if (grid) {
            grid.innerHTML = '<p class="gallery-empty-state">Loading customer reviews...</p>';
        }

        const response = await apiFetch("/api/reviews/public?limit=24");
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.message || "Failed to load customer reviews");
        }

        const reviews = Array.isArray(data.reviews) ? data.reviews : [];
        const average = reviews.length
            ? (reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length).toFixed(1)
            : "0.0";

        if (totalEl) totalEl.textContent = String(reviews.length);
        if (avgEl) avgEl.textContent = String(average);
        if (grid) {
            grid.innerHTML = renderSharedExperienceCards(reviews, {
                showCustomerName: true,
                emptyMessage: "No customer reviews have been shared yet."
            });
        }
    };

    initPublicReviewSubmission(async () => {
        try {
            await loadReviews();
        } catch (error) {
            const messageEl = document.getElementById("public-review-message");
            if (messageEl) {
                messageEl.textContent = error.message || "Customer review posted, but the gallery could not refresh immediately.";
                messageEl.classList.add("success");
            }
        }
    });

    try {
        await loadReviews();
    } catch (error) {
        if (grid) {
            grid.innerHTML = `<p class="gallery-empty-state">${escapeHtml(error.message || "Unable to load customer reviews right now.")}</p>`;
        }
    }
}



function renderSharedExperienceCards(reviews, options = {}) {
    const items = Array.isArray(reviews) ? reviews : [];
    const showCustomerName = options.showCustomerName !== false;
    const emptyMessage = options.emptyMessage || "No customer reviews yet.";
    const layout = options.layout === "list" ? "list" : "grid";
    const viewer = options.viewer || {};

    if (!items.length) {
        return `<div class="public-review-empty"><p class="gallery-empty-state">${escapeHtml(emptyMessage)}</p></div>`;
    }

    return items.map((review) => {
        const reviewKey = registerReviewExperience(review);
        const registeredReview = getRegisteredReviewExperience(reviewKey) || review;
        const mediaItems = Array.isArray(registeredReview.photos) && registeredReview.photos.length
            ? registeredReview.photos
            : [resolveImageSource(review.decoration_image || "")].filter(Boolean);
        const primaryImage = mediaItems[0] || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop";
        const extraImages = mediaItems.slice(1, 4);
        const title = review.decoration_title || (review.source === "public" ? "Customer Review" : "Decoration Experience");
        const author = review.customer_name || (review.source === "public" ? "Visitor" : "Customer");
        const metaParts = [formatShortDate(review.created_at)];
        if (review.location) metaParts.push(review.location);
        if (layout === "list" && review.source === "public") metaParts.push("Community Review");
        const canDelete = canDeleteReview(review, viewer) && !!resolveReviewRecordId(review);
        const cardClasses = layout === "list"
            ? `story-card story-card-list${canDelete ? " story-card-list-with-delete" : ""}`
            : "story-card";
        const cardAttrs = layout === "list"
            ? `data-review-key="${escapeHtml(reviewKey)}" tabindex="0" role="button" aria-label="Open review for ${escapeHtml(title)}"`
            : "";
        const summaryText = review.feedback || review.comment || "Click to see the full customer review.";

        if (layout === "list") {
            return `
                <article class="${cardClasses}" ${cardAttrs}>
                    <div class="story-media story-media-compact">
                        <img class="story-main-image" src="${primaryImage}" alt="${escapeHtml(title)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop'">
                    </div>
                    <div class="story-content story-content-compact">
                        <h3>${escapeHtml(title)}</h3>
                        <p class="story-feedback story-feedback-compact">${escapeHtml(summaryText)}</p>
                    </div>
                    ${canDelete ? `
                        <button type="button" class="story-inline-delete" data-review-delete="${escapeHtml(String(resolveReviewRecordId(review)))}" data-review-key="${escapeHtml(reviewKey)}" aria-label="Delete this review">
                            <i class="fas fa-trash" aria-hidden="true"></i>
                        </button>
                    ` : ""}
                </article>
            `;
        }

        return `
            <article class="${cardClasses}" ${cardAttrs}>
                <div class="story-media">
                    <img class="story-main-image" src="${primaryImage}" alt="${escapeHtml(title)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop'">
                    ${extraImages.length ? `
                        <div class="story-thumb-grid">
                            ${extraImages.map((photo) => `<img src="${resolveImageSource(photo)}" alt="Shared decoration photo" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop'">`).join("")}
                        </div>
                    ` : ""}
                </div>
                <div class="story-content">
                    <div class="story-card-topline">
                        <div class="story-rating">${storyStarsMarkup(review.rating)}</div>
                        <span class="story-source-badge">${escapeHtml(review.source === "public" ? "Community Review" : "Completed Event")}</span>
                    </div>
                    <h3>${escapeHtml(title)}</h3>
                    ${showCustomerName ? `<p class="story-author">Shared by ${escapeHtml(author)}</p>` : ""}
                    <p class="story-copy">${escapeHtml(review.comment || "Loved the decoration experience.")}</p>
                    ${review.feedback ? `<p class="story-feedback"><strong>Feedback:</strong> ${escapeHtml(review.feedback)}</p>` : ""}
                    <p class="story-meta">${escapeHtml(metaParts.filter(Boolean).join(" | "))}</p>
                </div>
            </article>
        `;
    }).join("");
}

function renderReviewDetailMarkup(review, viewer = {}) {
    const photos = Array.isArray(review?.photos) && review.photos.length
        ? review.photos
        : ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop"];
    const title = review?.decoration_title || (review?.source === "public" ? "Customer Review" : "Decoration Experience");
    const author = review?.customer_name || (review?.source === "public" ? "Visitor" : "Customer");
    const metaParts = [formatShortDate(review?.created_at)];
    if (review?.location) metaParts.push(review.location);
    if (review?.source === "public") metaParts.push("Community Review");
    const canDelete = canDeleteReview(review, viewer) && !!resolveReviewRecordId(review);

    return `
        <section class="review-detail-shell" data-review-key="${escapeHtml(review?.__reviewKey || "")}">
            <div class="review-detail-head">
                <div class="review-detail-title-wrap">
                    <div class="story-card-topline">
                        <div class="story-rating">${storyStarsMarkup(review?.rating)}</div>
                        <span class="story-source-badge">${escapeHtml(review?.source === "public" ? "Community Review" : "Completed Event")}</span>
                    </div>
                    <h3 id="review-detail-title">${escapeHtml(title)}</h3>
                    <p class="story-author">Shared by ${escapeHtml(author)}</p>
                    <p class="story-meta">${escapeHtml(metaParts.filter(Boolean).join(" | "))}</p>
                </div>
                <div class="review-detail-actions">
                    ${canDelete ? `
                        <button type="button" class="story-action-btn story-delete-btn" data-review-delete="${escapeHtml(String(resolveReviewRecordId(review)))}" data-review-key="${escapeHtml(review?.__reviewKey || "")}">
                            <i class="fas fa-trash" aria-hidden="true"></i>
                            <span>${viewer?.owner ? "Delete Review" : "Delete My Review"}</span>
                        </button>
                    ` : ""}
                </div>
            </div>
            <div class="review-detail-gallery">
                <figure class="review-detail-stage">
                    <img class="review-detail-stage-image" src="${escapeHtml(photos[0])}" alt="${escapeHtml(title)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop'">
                    <figcaption>Click the main photo to view it in full screen.</figcaption>
                </figure>
                <div class="review-detail-thumb-strip">
                    ${photos.map((photo, index) => `
                        <button type="button" class="review-detail-thumb ${index === 0 ? "is-active" : ""}" data-review-photo-index="${index}">
                            <img src="${escapeHtml(photo)}" alt="Review photo ${index + 1}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop'">
                        </button>
                    `).join("")}
                </div>
            </div>
            <div class="review-detail-copy">
                <div class="review-detail-copy-block">
                    <span class="review-detail-label">Review</span>
                    <p>${escapeHtml(review?.comment || "Loved the decoration experience.")}</p>
                </div>
                ${review?.feedback ? `
                    <div class="review-detail-copy-block">
                        <span class="review-detail-label">Feedback</span>
                        <p>${escapeHtml(review.feedback)}</p>
                    </div>
                ` : ""}
            </div>
        </section>
    `;
}

function createPublicReviewStarPicker(host, onChange) {
    if (!host) return () => 0;

    let activeRating = 0;

    const render = (selected = 0) => {
        host.innerHTML = [1, 2, 3, 4, 5].map((value) => (
            `<button type="button" class="review-star ${value <= selected ? "active" : ""}" data-rating="${value}" aria-label="${value} star">
                <i class="fas fa-star" aria-hidden="true"></i>
            </button>`
        )).join("");

        Array.from(host.querySelectorAll(".review-star")).forEach((star) => {
            star.addEventListener("click", () => {
                activeRating = Number.parseInt(star.dataset.rating, 10) || 0;
                render(activeRating);
                if (typeof onChange === "function") onChange(activeRating);
            });
        });
    };

    render(0);
    return {
        getRating: () => activeRating,
        reset: () => {
            activeRating = 0;
            render(0);
            if (typeof onChange === "function") onChange(activeRating);
        }
    };
}

function initPublicReviewSubmission(refreshReviews) {
    const form = document.getElementById("public-review-form");
    if (!form) return;

    const toggleBtn = document.getElementById("toggle-public-review-form");
    const closeBtn = document.getElementById("close-public-review-form");
    const panel = document.getElementById("public-review-compose-panel");
    const starsHost = document.getElementById("public-review-stars");
    const titleInput = document.getElementById("public-review-title");
    const commentInput = document.getElementById("public-review-comment");
    const photoInput = document.getElementById("public-review-photos");
    const photoMeta = document.getElementById("public-review-photo-meta");
    const previewGrid = document.getElementById("public-review-photo-preview");
    const submitBtn = document.getElementById("public-review-submit");
    const messageEl = document.getElementById("public-review-message");
    const starPicker = createPublicReviewStarPicker(starsHost);

    const openComposer = () => {
        if (!panel) return;
        panel.hidden = false;
        panel.classList.add("is-open");
        if (toggleBtn) {
            toggleBtn.setAttribute("aria-expanded", "true");
            toggleBtn.textContent = "Review Form Open";
        }
        setTimeout(() => commentInput?.focus(), 80);
    };

    const closeComposer = () => {
        if (!panel) return;
        panel.hidden = true;
        panel.classList.remove("is-open");
        if (toggleBtn) {
            toggleBtn.setAttribute("aria-expanded", "false");
            toggleBtn.textContent = "Add Your Review";
        }
    };

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            if (panel?.hidden) {
                openComposer();
            } else {
                closeComposer();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeComposer);
    }

    function showMessage(message, isError = false) {
        if (!messageEl) return;
        messageEl.textContent = message || "";
        messageEl.classList.toggle("error", isError);
        messageEl.classList.toggle("success", !isError && !!message);
    }

    function updatePhotoMeta(files) {
        if (!photoMeta) return;
        const count = files.length;
        photoMeta.textContent = count
            ? `${count} photo${count === 1 ? "" : "s"} selected`
            : "Add at least 1 photo and up to 6 photos.";
    }

    function renderPreview() {
        if (!previewGrid || !photoInput) return;

        const files = Array.from(photoInput.files || []);
        updatePhotoMeta(files);

        if (!files.length) {
            previewGrid.innerHTML = "";
            return;
        }

        previewGrid.innerHTML = files.map((file) => {
            const previewUrl = URL.createObjectURL(file);
            return `
                <figure class="review-photo-preview-card">
                    <img src="${previewUrl}" alt="${escapeHtml(file.name || "Customer review photo")}">
                    <figcaption>${escapeHtml(file.name || "Review photo")}</figcaption>
                </figure>
            `;
        }).join("");
    }

    updatePhotoMeta([]);

    if (photoInput) {
        photoInput.addEventListener("change", () => {
            const files = Array.from(photoInput.files || []);
            if (files.length > 6) {
                photoInput.value = "";
                renderPreview();
                showMessage("Please upload up to 6 photos only.", true);
                return;
            }
            showMessage("");
            renderPreview();
        });
    }

    if (!submitBtn) return;

    submitBtn.addEventListener("click", async () => {
        const session = await getCustomerSession();
        if (!session?.customer) {
            showMessage("Please log in to post a customer review.", true);
            openComposer();
            return;
        }
        const experienceTitle = String(titleInput?.value || "").trim();
        const comment = String(commentInput?.value || "").trim();
        const files = Array.from(photoInput?.files || []);
        const rating = starPicker.getRating();

        if (rating < 1 || rating > 5) {
            showMessage("Please choose a rating from 1 to 5 stars.", true);
            openComposer();
            return;
        }
        if (!comment) {
            showMessage("Please write your review before submitting.", true);
            openComposer();
            return;
        }
        if (!files.length) {
            showMessage("Please upload at least one photo.", true);
            openComposer();
            return;
        }

        try {
            submitBtn.disabled = true;
            showMessage("Sharing your customer review...");

            const formData = new FormData();
            formData.append("experience_title", experienceTitle);
            formData.append("rating", String(rating));
            formData.append("comment", comment);
            files.forEach((file) => formData.append("photos", file));

            const response = await apiFetch("/api/reviews/public", {
                method: "POST",
                body: formData
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data.message || "Failed to share customer review");
            }

            form.reset();
            starPicker.reset();
            if (previewGrid) previewGrid.innerHTML = "";
            updatePhotoMeta([]);
            showMessage(data.message || "Customer review shared successfully.");
            if (typeof refreshReviews === "function") {
                await refreshReviews();
            }
            setTimeout(() => {
                closeComposer();
            }, 300);
        } catch (error) {
            showMessage(error.message || "Unable to share customer review right now.", true);
            openComposer();
        } finally {
            submitBtn.disabled = false;
        }
    });
}

async function initPublicReviewsPage() {
    const root = document.getElementById("public-reviews-page");
    if (!root) return;

    const grid = document.getElementById("public-reviews-grid");
    const totalEl = document.getElementById("public-reviews-count");
    const avgEl = document.getElementById("public-reviews-rating");
    const countLabel = document.getElementById("public-reviews-heading-count");
    const statusEl = document.getElementById("public-reviews-page-status");
    const adminActions = document.getElementById("public-review-admin-actions");
    const deleteAllBtn = document.getElementById("public-review-delete-all");
    const detailOverlay = document.getElementById("review-detail-overlay");
    const detailBody = document.getElementById("review-detail-body");
    const detailClose = document.getElementById("review-detail-close");
    const viewer = {
        customer: null,
        owner: null
    };
    let activeReviewKey = "";

    const setStatus = (message = "", isError = false) => {
        if (!statusEl) return;
        statusEl.hidden = !message;
        statusEl.textContent = message;
        statusEl.classList.toggle("error", isError);
        statusEl.classList.toggle("success", !isError && !!message);
    };

    const closeReviewDetail = () => {
        if (!detailOverlay) return;
        detailOverlay.hidden = true;
        detailOverlay.classList.remove("is-open");
        document.body.classList.remove("popup-open");
        activeReviewKey = "";
    };

    const singleDeletePaths = (review) => {
        const reviewId = resolveReviewRecordId(review);
        const source = encodeURIComponent(String(review?.source || "public"));
        return viewer.owner
            ? [
                `/api/private/owner/reviews/${encodeURIComponent(reviewId)}?source=${source}`,
                `/api/private/owner/reviews?id=${encodeURIComponent(reviewId)}&source=${source}`,
                `/api/reviews/${encodeURIComponent(reviewId)}?source=${source}`
            ]
            : [
                `/api/reviews/public/${encodeURIComponent(reviewId)}`,
                `/api/reviews/${encodeURIComponent(reviewId)}?source=${source}`
            ];
    };

    const deleteAllPaths = () => (
        viewer.owner
            ? ["/api/private/owner/reviews/all", "/api/private/owner/reviews", "/api/reviews/all"]
            : ["/api/reviews/public/mine"]
    );

    const openReviewDetail = (reviewKey) => {
        if (!detailOverlay || !detailBody) return;
        const review = getRegisteredReviewExperience(reviewKey);
        if (!review) return;
        activeReviewKey = reviewKey;
        detailBody.innerHTML = renderReviewDetailMarkup(review, viewer);
        detailOverlay.hidden = false;
        detailOverlay.classList.add("is-open");
        document.body.classList.add("popup-open");
    };

    const deleteReview = async (reviewKey, trigger) => {
        const review = getRegisteredReviewExperience(reviewKey);
        const reviewId = resolveReviewRecordId(review);
        if (!review || !reviewId) {
            setStatus("This review cannot be deleted because its record id is missing.", true);
            return;
        }

        const confirmed = window.confirm("Delete this review permanently?");
        if (!confirmed) return;

        try {
            if (trigger) trigger.disabled = true;
            const response = await apiFetchFirstSuccessful(singleDeletePaths(review), {
                method: "DELETE"
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data.message || "Unable to delete this review right now.");
            }

            closeReviewDetail();
            await loadReviews();
            setStatus(data.message || "Review deleted successfully.");
        } catch (error) {
            setStatus(error.message || "Unable to delete this review right now.", true);
        } finally {
            if (trigger) trigger.disabled = false;
        }
    };

    const deleteAllReviews = async () => {
        if (!viewer.owner && !viewer.customer) return;

        const firstConfirm = window.confirm(
            viewer.owner ? "Delete all customer reviews?" : "Delete all of your reviews?"
        );
        if (!firstConfirm) return;

        const secondConfirm = window.confirm(
            viewer.owner
                ? "This will permanently remove every review. Continue?"
                : "This will permanently remove your reviews. Continue?"
        );
        if (!secondConfirm) return;

        try {
            if (deleteAllBtn) deleteAllBtn.disabled = true;
            const response = await apiFetchFirstSuccessful(deleteAllPaths(), {
                method: "DELETE"
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data.message || "Unable to delete all reviews right now.");
            }

            closeReviewDetail();
            await loadReviews();
            setStatus(
                data.message || (viewer.owner ? "All customer reviews were deleted." : "Your reviews were deleted.")
            );
        } catch (error) {
            setStatus(error.message || "Unable to delete all reviews right now.", true);
        } finally {
            if (deleteAllBtn) deleteAllBtn.disabled = false;
        }
    };

    const loadReviews = async () => {
        if (grid) {
            grid.innerHTML = '<div class="public-review-empty"><p class="gallery-empty-state">Loading customer reviews...</p></div>';
        }

        const response = await apiFetch("/api/reviews/public?limit=24");
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch public reviews");
        }

        const reviews = Array.isArray(data.reviews) ? data.reviews : [];
        const average = reviews.length
            ? (reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length).toFixed(1)
            : "0.0";

        if (totalEl) totalEl.textContent = String(reviews.length);
        if (avgEl) avgEl.textContent = String(average);
        if (countLabel) {
            countLabel.textContent = reviews.length ? `${reviews.length} reviews` : "No reviews yet";
        }
        if (grid) {
            grid.innerHTML = renderSharedExperienceCards(reviews, {
                showCustomerName: true,
                layout: "list",
                viewer,
                emptyMessage: "No customer reviews have been shared yet. Be the first to post one."
            });
        }
        setStatus("");
    };

    try {
        const [customerSession, ownerSession] = await Promise.all([
            getCustomerSession(),
            getOwnerSession()
        ]);
        viewer.customer = customerSession?.customer || null;
        viewer.owner = ownerSession?.owner || ownerSession?.user || ownerSession || null;
    } catch (error) {
        viewer.customer = null;
        viewer.owner = null;
    }

    if (adminActions) {
        adminActions.hidden = !viewer.owner && !viewer.customer;
    }

    if (deleteAllBtn) {
        deleteAllBtn.addEventListener("click", deleteAllReviews);
        deleteAllBtn.querySelector("span").textContent = viewer.owner ? "Delete All Reviews" : "Delete My Reviews";
    }

    initPublicReviewSubmission(async () => {
        await loadReviews();
    });

    if (grid) {
        grid.addEventListener("click", (event) => {
            const deleteButton = event.target.closest("[data-review-delete]");
            if (deleteButton) {
                event.preventDefault();
                event.stopPropagation();
                deleteReview(deleteButton.dataset.reviewKey || "", deleteButton);
                return;
            }

            const openButton = event.target.closest("[data-review-open]");
            if (openButton) {
                event.preventDefault();
                event.stopPropagation();
                openReviewDetail(openButton.dataset.reviewOpen || "");
                return;
            }

            const card = event.target.closest(".story-card-list[data-review-key]");
            if (!card) return;
            openReviewDetail(card.dataset.reviewKey || "");
        });

        grid.addEventListener("keydown", (event) => {
            const card = event.target.closest(".story-card-list[data-review-key]");
            if (!card) return;
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            openReviewDetail(card.dataset.reviewKey || "");
        });
    }

    if (detailOverlay && detailBody) {
        detailOverlay.addEventListener("click", (event) => {
            if (event.target === detailOverlay) {
                closeReviewDetail();
                return;
            }

            const deleteButton = event.target.closest("[data-review-delete]");
            if (deleteButton) {
                event.preventDefault();
                deleteReview(deleteButton.dataset.reviewKey || activeReviewKey, deleteButton);
                return;
            }

            const thumb = event.target.closest(".review-detail-thumb");
            if (!thumb) return;

            const review = getRegisteredReviewExperience(activeReviewKey);
            const stageImage = detailBody.querySelector(".review-detail-stage-image");
            if (!review || !stageImage) return;

            const index = Number.parseInt(thumb.dataset.reviewPhotoIndex || "0", 10);
            const nextImage = review.photos?.[index];
            if (!nextImage) return;

            stageImage.src = nextImage;
            Array.from(detailBody.querySelectorAll(".review-detail-thumb")).forEach((button) => {
                button.classList.toggle("is-active", button === thumb);
            });
        });
    }

    if (detailClose) {
        detailClose.addEventListener("click", closeReviewDetail);
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && detailOverlay && !detailOverlay.hidden) {
            closeReviewDetail();
        }
    });

    try {
        await loadReviews();
    } catch (error) {
        if (grid) {
            grid.innerHTML = '<div class="public-review-empty"><p class="gallery-empty-state">Customer reviews could not be loaded right now.</p></div>';
        }
        setStatus(error.message || "Unable to load customer reviews right now.", true);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    initDarkMode();
    initNavDropdowns();
    ensureStoriesNavLink();
    initNavbarAuthState();
    initProfilePage();
    initPublicReviewsPage();
    initGalleryPage();
    initDetailsPage();
    initContactForm();
    initRevealAnimations();
    initImagePopup();
});



