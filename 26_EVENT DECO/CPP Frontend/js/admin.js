const ADMIN_API_HOST = window.location.hostname || "localhost";
const PUBLIC_API_BASE = `http://${ADMIN_API_HOST}:5000/api`;
let currentInventoryItems = [];
let currentDecorations = [];
let dashboardBookings = [];
let dashboardInventory = [];
let calendarState = {
    month: null,
    statuses: ["pending", "accepted", "cancelled", "rejected"],
    eventTypes: ["all"],
    selectedDate: null,
    data: null
};
let bookingsCache = [];
let bookingsFilter = "all";
let bookingInventoryModalBound = false;
let bookingInventoryState = {
    bookingId: null,
    decorationId: null,
    bookingLabel: "",
    inventoryCatalog: [],
    selectedItems: []
};
let usageReportMeta = {
    bookings: [],
    inventory: [],
    decorations: []
};
let adminReviewsCache = [];
let adminReviewFilters = {
    term: "",
    source: "all",
    status: "all"
};

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function formatDateLabel(date) {
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
    });
}

function formatDateCell(value) {
    const d = parseDateOnly(value);
    if (!d) return "-";
    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function formatDateRangeCell(startValue, endValue) {
    const startLabel = formatDateCell(startValue);
    const endLabel = formatDateCell(endValue || startValue);
    if (startLabel === "-" || endLabel === "-" || startLabel === endLabel) return startLabel;
    return `${startLabel} - ${endLabel}`;
}

function formatTimeCell(value) {
    const raw = String(value || "").trim();
    if (!raw) return "-";
    const match = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (!match) return raw;
    return `${String(match[1]).padStart(2, "0")}:${match[2]}`;
}

function setOwnerIdentity(emailValue) {
    const email = String(emailValue || "owner").trim();
    setText("owner-email", email);

    const avatar = document.getElementById("owner-avatar");
    if (avatar) {
        const firstLetter = email.charAt(0).toUpperCase() || "O";
        avatar.textContent = firstLetter;
        avatar.setAttribute("title", email);
        avatar.setAttribute("aria-label", `Owner ${email}`);
    }
}

function formatCount(value) {
    const n = Number(value || 0);
    return Number.isFinite(n) ? n.toLocaleString("en-IN") : "0";
}

function toMoney(value) {
    const n = Number(value || 0);
    return Number.isFinite(n) ? n.toFixed(2) : "0.00";
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function getResponseErrorMessage(response, fallbackMessage) {
    const contentType = String(response?.headers?.get("content-type") || "");
    try {
        const body = contentType.includes("application/json")
            ? await response.json()
            : await response.text();

        if (typeof body === "string" && body.trim()) {
            return body;
        }

        if (body && typeof body.message === "string" && body.message.trim()) {
            return body.message;
        }
    } catch (error) {
        // Ignore body parsing issues and use fallback below.
    }

    return fallbackMessage;
}

function parseDateOnly(value) {
    if (!value) return null;
    const str = String(value).slice(0, 10);
    const d = new Date(`${str}T00:00:00`);
    if (Number.isNaN(d.getTime())) return null;
    return d;
}

function resolveBookingDateRange(booking) {
    const start = parseDateOnly(booking?.event_date);
    const end = parseDateOnly(booking?.event_end_date || booking?.event_date);
    return { start, end };
}

function getTodayDateOnly() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function updateBookingStats(items) {
    const today = getTodayDateOnly();
    const past = items.filter((booking) => {
        const { end } = resolveBookingDateRange(booking);
        return end && end.getTime() < today.getTime();
    }).length;
    const current = items.filter((booking) => {
        const { start, end } = resolveBookingDateRange(booking);
        if (!start || !end) return false;
        return today.getTime() >= start.getTime() && today.getTime() <= end.getTime();
    }).length;
    const upcoming = items.filter((booking) => {
        const { start } = resolveBookingDateRange(booking);
        return start && start.getTime() > today.getTime();
    }).length;

    setText("stat-bookings-past", formatCount(past || 0));
    setText("stat-bookings-today", formatCount(current || 0));
    setText("stat-bookings-upcoming", formatCount(upcoming || 0));
}

function isWithinLastDays(dateValue, days) {
    const d = parseDateOnly(dateValue);
    if (!d) return false;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start = new Date(today);
    start.setDate(today.getDate() - (days - 1));

    return d >= start && d <= today;
}

function getWeekWindow(mode = "this-week") {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Monday-based week
    const day = today.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() + mondayOffset);

    const start = new Date(thisWeekStart);
    if (mode === "last-week") {
        start.setDate(start.getDate() - 7);
    }

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return { start, end };
}

function isWithinRange(dateValue, start, end) {
    const d = parseDateOnly(dateValue);
    return Boolean(d && d >= start && d <= end);
}

function getDailyBookingSeries(bookings, startDate) {
    const daily = Array.from({ length: 7 }, () => ({ bookings: 0, accepted: 0 }));

    bookings.forEach((booking) => {
        const d = parseDateOnly(booking.event_date);
        if (!d) return;

        const dayIndex = Math.round((d - startDate) / (1000 * 60 * 60 * 24));
        if (dayIndex < 0 || dayIndex > 6) return;

        daily[dayIndex].bookings += 1;
        if (String(booking.status || "").toLowerCase() === "accepted") {
            daily[dayIndex].accepted += 1;
        }
    });

    return daily;
}

function toSvgPoints(values, width = 620, height = 180, top = 20, bottom = 18, maxValueOverride = null) {
    const maxValue = Number.isFinite(maxValueOverride) && maxValueOverride > 0
        ? maxValueOverride
        : Math.max(...values, 1);
    const stepX = width / 6;

    return values.map((value, index) => {
        const safe = Number(value) || 0;
        const y = height - bottom - ((safe / maxValue) * (height - top - bottom));
        const x = Math.round(stepX * index);
        return `${x},${Math.round(y)}`;
    }).join(" ");
}

function updateWeeklyChart(dailySeries) {
    const bookingsSeries = dailySeries.map((d) => d.bookings);
    const acceptedSeries = dailySeries.map((d) => d.accepted);
    const globalMax = Math.max(...bookingsSeries, ...acceptedSeries, 1);
    const bookingsPoints = toSvgPoints(bookingsSeries, 620, 180, 20, 18, globalMax);
    const acceptedPoints = toSvgPoints(acceptedSeries, 620, 180, 20, 18, globalMax);
    const areaPoints = `0,180 ${bookingsPoints} 620,180`;

    const lineBookings = document.getElementById("weekly-line-bookings");
    const lineAccepted = document.getElementById("weekly-line-accepted");
    const area = document.getElementById("weekly-area");

    if (lineBookings) lineBookings.setAttribute("points", bookingsPoints);
    if (lineAccepted) lineAccepted.setAttribute("points", acceptedPoints);
    if (area) area.setAttribute("points", areaPoints);
}

function updateWeeklyPerformanceStats(mode = "this-week") {
    const { start, end } = getWeekWindow(mode);

    const weeklyBookings = dashboardBookings.filter((b) => isWithinRange(b.event_date, start, end));
    const weeklyAccepted = weeklyBookings.filter((b) => String(b.status || "").toLowerCase() === "accepted");
    const weeklyAcceptanceRate = weeklyBookings.length
        ? Math.round((weeklyAccepted.length / weeklyBookings.length) * 100)
        : 0;
    const lowStock = dashboardInventory.filter(
        (item) => Number(item.quantity) <= Number(item.min_quantity || 0)
    ).length;
    const lowStockRate = dashboardInventory.length
        ? Math.round((lowStock / dashboardInventory.length) * 100)
        : 0;

    setText("weekly-bookings", formatCount(weeklyBookings.length || 0));
    setText("weekly-accepted", formatCount(weeklyAccepted.length || 0));
    setText("weekly-accept-rate", `${weeklyAcceptanceRate}%`);
    setText("weekly-low-stock-rate", `${lowStockRate}%`);
    setText("weekly-range-label", `${formatDateLabel(start)} - ${formatDateLabel(end)}`);

    const dailySeries = getDailyBookingSeries(weeklyBookings, start);
    updateWeeklyChart(dailySeries);
}
let paymentDashboardBound = false;
let managePaymentsCache = [];
let pendingPaymentsCache = [];

function updatePaymentStats() {
    setText("payments-total", formatCount(managePaymentsCache.length || 0));
    const totalAmount = managePaymentsCache.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    setText("payments-amount", `Rs. ${formatCount(totalAmount.toFixed ? totalAmount.toFixed(2) : totalAmount)}`);
    const pendingTotal = pendingPaymentsCache.reduce((sum, item) => sum + Number(item.pending_amount || 0), 0);
    setText("payments-pending", `Rs. ${formatCount(pendingTotal.toFixed ? pendingTotal.toFixed(2) : pendingTotal)}`);
}

function paymentTypeClass(type) {
    const value = String(type || "").toLowerCase();
    if (value === "advance") return "pill pill-advance";
    if (value === "partial") return "pill pill-partial";
    if (value === "final") return "pill pill-final";
    return "pill";
}

function paymentMethodClass(method) {
    const value = String(method || "").toLowerCase();
    if (value.includes("cash")) return "chip chip-cash";
    if (value.includes("upi")) return "chip chip-upi";
    if (value.includes("bank")) return "chip chip-bank";
    return "chip";
}

function renderManagePayments(rows) {
    const body = document.getElementById("manage-payments-body");
    const empty = document.getElementById("manage-payments-empty");
    if (!body) return;

    if (!rows.length) {
        body.innerHTML = "";
        if (empty) empty.style.display = "block";
        return;
    }

    if (empty) empty.style.display = "none";
    body.innerHTML = rows.map((payment) => `
        <tr>
            <td>${escapeHtml(payment.customer_name || "-")}<br><small>${escapeHtml(payment.phone || "-")}</small></td>
            <td>#${escapeHtml(payment.booking_id)}</td>
            <td>${escapeHtml(payment.decoration_title || "-")}</td>
            <td>${escapeHtml(formatDateCell(payment.event_date || "-"))}</td>
            <td>Rs. ${escapeHtml(toMoney(payment.amount || 0))}</td>
            <td><span class="${paymentTypeClass(payment.payment_type)}">${escapeHtml(payment.payment_type || "-")}</span></td>
            <td><span class="${paymentMethodClass(payment.payment_method)}">${escapeHtml(payment.payment_method || "-")}</span></td>
            <td>${escapeHtml(formatDateCell(payment.payment_date || "-"))}</td>
            <td>${escapeHtml(payment.recorded_by || "-")}</td>
        </tr>
    `).join("");
}

function applyManagePaymentFilter() {
    const input = document.getElementById("payments-search");
    const term = String(input?.value || "").trim().toLowerCase();
    if (!term) {
        renderManagePayments(managePaymentsCache);
        return;
    }

    const filtered = managePaymentsCache.filter((payment) => {
        const haystack = [
            payment.customer_name,
            payment.booking_id,
            payment.decoration_title,
            payment.payment_type,
            payment.payment_method,
            payment.recorded_by,
            payment.phone
        ].map((v) => String(v || "").toLowerCase()).join(" ");
        return haystack.includes(term);
    });
    renderManagePayments(filtered);
}

async function loadManagePayments() {
    const body = document.getElementById("manage-payments-body");
    const empty = document.getElementById("manage-payments-empty");
    const res = await fetch(`${PUBLIC_API_BASE}/admin/payments`, { credentials: "include" });
    if (!res.ok) {
        const errorMessage = await getResponseErrorMessage(res, "Unable to load payments");
        if (body) {
            body.innerHTML = `<tr><td colspan="9" class="table-empty">${escapeHtml(errorMessage)}</td></tr>`;
        }
        if (empty) empty.style.display = "none";
        managePaymentsCache = [];
        updatePaymentStats();
        return;
    }
    const data = await res.json();
    managePaymentsCache = Array.isArray(data) ? data : [];
    applyManagePaymentFilter();
    updatePaymentStats();
}

async function loadPendingPayments() {
    const body = document.getElementById("pending-payments-body");
    const empty = document.getElementById("pending-payments-empty");
    if (!body) return;

    const res = await fetch(`${PUBLIC_API_BASE}/admin/pending-payments`, { credentials: "include" });
    const data = res.ok ? await res.json() : [];
    const items = Array.isArray(data) ? data : [];
    pendingPaymentsCache = items;

    if (!items.length) {
        body.innerHTML = "";
        if (empty) empty.style.display = "block";
        updatePaymentStats();
        return;
    }

    if (empty) empty.style.display = "none";
    body.innerHTML = items.map((row) => `
        <tr>
            <td>${escapeHtml(row.customer_name || "-")}</td>
            <td>#${escapeHtml(row.booking_id)}</td>
            <td>Rs. ${escapeHtml(toMoney(row.total_amount || 0))}</td>
            <td>Rs. ${escapeHtml(toMoney(row.total_paid || 0))}</td>
            <td>Rs. ${escapeHtml(toMoney(row.pending_amount || 0))}</td>
            <td>${escapeHtml(formatDateCell(row.due_date || "-"))}</td>
            <td><span class="status-pill pending">${escapeHtml(row.status || "-")}</span></td>
        </tr>
    `).join("");
    updatePaymentStats();
}

function bindPaymentDashboardActions() {
    if (paymentDashboardBound) return;
    paymentDashboardBound = true;

    const refreshManage = document.getElementById("refresh-manage-payments");
    if (refreshManage) {
        refreshManage.addEventListener("click", loadManagePayments);
    }

    const refreshPending = document.getElementById("refresh-pending-payments");
    if (refreshPending) {
        refreshPending.addEventListener("click", loadPendingPayments);
    }

    const searchInput = document.getElementById("payments-search");
    if (searchInput) {
        searchInput.addEventListener("input", applyManagePaymentFilter);
    }

    const form = document.getElementById("admin-add-payment-form");
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const bookingId = Number(document.getElementById("admin-payment-booking")?.value || 0);
            const amount = Number(document.getElementById("admin-payment-amount")?.value || 0);
            const paymentType = document.getElementById("admin-payment-type")?.value || "";
            const paymentMethod = document.getElementById("admin-payment-method")?.value || "";
            const messageEl = document.getElementById("admin-payment-message");

            if (!bookingId || amount <= 0 || !paymentType || !paymentMethod) {
                if (messageEl) {
                    messageEl.textContent = "Fill all required fields to save payment.";
                    messageEl.classList.add("is-error");
                    messageEl.classList.remove("is-success");
                }
                return;
            }

            try {
                if (messageEl) {
                    messageEl.textContent = "Saving payment...";
                    messageEl.classList.remove("is-error");
                    messageEl.classList.remove("is-success");
                }
                const res = await fetch(`${PUBLIC_API_BASE}/admin/add-payment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        booking_id: bookingId,
                        amount,
                        payment_type: paymentType,
                        payment_method: paymentMethod
                    })
                });
                const payload = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(payload.message || "Failed to save payment");
                if (messageEl) {
                    messageEl.textContent = "Payment saved successfully.";
                    messageEl.classList.add("is-success");
                    messageEl.classList.remove("is-error");
                }
                form.reset();
                await loadManagePayments();
                await loadPendingPayments();
            } catch (error) {
                if (messageEl) {
                    messageEl.textContent = error.message || "Unable to save payment.";
                    messageEl.classList.add("is-error");
                    messageEl.classList.remove("is-success");
                }
            }
        });
    }
}

function bindWeeklyRangeSelector() {
    const selector = document.getElementById("weekly-range");
    if (!selector) return;

    selector.addEventListener("change", () => {
        const value = selector.value === "last-week" ? "last-week" : "this-week";
        updateWeeklyPerformanceStats(value);
    });
}

function bindDashboardSearch() {
    const input = document.getElementById("dashboard-search");
    if (!input) return;

    const searchableItems = Array.from(document.querySelectorAll(".dashboard-search-item"));
    const emptyState = document.getElementById("dashboard-search-empty");

    input.addEventListener("input", () => {
        const term = String(input.value || "").trim().toLowerCase();

        if (!term) {
            searchableItems.forEach((item) => {
                item.classList.remove("dashboard-hidden");
                item.classList.remove("dashboard-search-match");
            });
            if (emptyState) emptyState.classList.add("dashboard-hidden");
            return;
        }

        let firstMatch = null;
        let matchCount = 0;

        searchableItems.forEach((item) => {
            const haystack = `${item.dataset.searchable || ""} ${item.textContent || ""}`.toLowerCase();
            const matched = haystack.includes(term);
            item.classList.toggle("dashboard-hidden", !matched);
            item.classList.toggle("dashboard-search-match", matched);
            if (matched) matchCount += 1;
            if (matched && !firstMatch) firstMatch = item;
        });

        if (emptyState) emptyState.classList.toggle("dashboard-hidden", matchCount > 0);

        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });
}

function updateDashboardPopupSummary(summary = {}) {
    setText("popup-notify-bookings", formatCount(summary.bookings || 0));
    setText("popup-notify-pending", formatCount(summary.pending || 0));
    setText("popup-notify-stock", formatCount(summary.lowStock || 0));
}

function toggleDashboardNotificationPopup(open) {
    const popup = document.getElementById("dashboard-notification-popup");
    if (!popup) return;

    popup.classList.toggle("open", open);
    popup.setAttribute("aria-hidden", open ? "false" : "true");
}

function toggleDashboardQuickPopup(open) {
    const popup = document.getElementById("dashboard-quick-popup");
    if (!popup) return;

    popup.classList.toggle("open", open);
    popup.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("dashboard-popup-open", open);
}

function showDashboardToast(message) {
    const toast = document.getElementById("dashboard-toast");
    const text = document.getElementById("dashboard-toast-text");
    if (!toast || !text) return;

    text.textContent = String(message || "Dashboard synced successfully.");
    toast.classList.add("show");
    toast.setAttribute("aria-hidden", "false");

    const activeTimer = Number(toast.dataset.timer || 0);
    if (activeTimer) {
        window.clearTimeout(activeTimer);
    }

    const timer = window.setTimeout(() => {
        toast.classList.remove("show");
        toast.setAttribute("aria-hidden", "true");
    }, 2400);
    toast.dataset.timer = String(timer);
}

function bindDashboardPopups() {
    const notificationButton = document.getElementById("dashboard-notification-btn");
    const quickButton = document.getElementById("dashboard-quick-btn");
    const messageButton = document.getElementById("dashboard-message-btn");
    const notificationPopup = document.getElementById("dashboard-notification-popup");
    const quickPopup = document.getElementById("dashboard-quick-popup");

    if (!notificationButton || !notificationPopup || !quickButton || !quickPopup) return;

    notificationButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const open = !notificationPopup.classList.contains("open");
        toggleDashboardNotificationPopup(open);
    });

    if (messageButton) {
        messageButton.addEventListener("click", () => {
            toggleDashboardNotificationPopup(false);
            toggleDashboardQuickPopup(true);
        });
    }

    quickButton.addEventListener("click", () => {
        toggleDashboardNotificationPopup(false);
        toggleDashboardQuickPopup(true);
    });

    document.querySelectorAll("[data-close-dashboard-popup='notifications']").forEach((button) => {
        button.addEventListener("click", () => {
            toggleDashboardNotificationPopup(false);
        });
    });

    document.querySelectorAll("[data-close-dashboard-popup='quick']").forEach((button) => {
        button.addEventListener("click", () => {
            toggleDashboardQuickPopup(false);
        });
    });

    quickPopup.addEventListener("click", (event) => {
        if (event.target === quickPopup) {
            toggleDashboardQuickPopup(false);
        }
    });

    document.addEventListener("click", (event) => {
        if (!notificationPopup.classList.contains("open")) return;
        if (notificationPopup.contains(event.target) || notificationButton.contains(event.target)) return;
        toggleDashboardNotificationPopup(false);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        toggleDashboardNotificationPopup(false);
        toggleDashboardQuickPopup(false);
    });

    quickPopup.querySelectorAll("[data-popup-action]").forEach((link) => {
        link.addEventListener("click", () => {
            const label = String(link.dataset.popupAction || "section");
            showDashboardToast(`Opening ${label}...`);
        });
    });
}

async function loadDashboard() {
    const owner = await ensureOwnerSession();
    if (!owner) return;
    setOwnerIdentity(owner.ownerEmail || "owner");

    const [bookingsRes, decorationsRes, inventoryRes] = await Promise.all([
        fetch(`${PUBLIC_API_BASE}/bookings`, { credentials: "include" }),
        fetch(`${PUBLIC_API_BASE}/decorations`),
        fetch(`${OWNER_API_BASE}/inventory`, { credentials: "include" })
    ]);

    const bookings = bookingsRes.ok ? await bookingsRes.json() : [];
    const decorations = decorationsRes.ok ? await decorationsRes.json() : [];
    const inventory = inventoryRes.ok ? await inventoryRes.json() : [];
    dashboardBookings = Array.isArray(bookings) ? bookings : [];
    dashboardInventory = Array.isArray(inventory) ? inventory : [];

    const lowStock = inventory.filter((item) => Number(item.quantity) <= Number(item.min_quantity || 0)).length;

    setText("stat-bookings", formatCount(bookings.length || 0));
    setText("stat-pending", formatCount(bookings.filter((b) => b.status === "pending").length || 0));
    setText("stat-accepted", formatCount(bookings.filter((b) => b.status === "accepted").length || 0));
    setText("stat-decorations", formatCount(decorations.length || 0));
    setText("stat-inventory", formatCount(inventory.length || 0));
    setText("stat-low-stock", formatCount(lowStock || 0));
    updateDashboardPopupSummary({
        bookings: bookings.length || 0,
        pending: bookings.filter((b) => b.status === "pending").length || 0,
        lowStock: lowStock || 0
    });
    updateWeeklyPerformanceStats("this-week");
    bindPaymentDashboardActions();
    await loadManagePayments();
    await loadPendingPayments();
}

async function loadBookingsTable() {
    const owner = await ensureOwnerSession();
    if (!owner) return;
    setOwnerIdentity(owner.ownerEmail || "owner");

    const tableBody = document.getElementById("bookings-body");
    if (!tableBody) return;

    const res = await fetch(`${PUBLIC_API_BASE}/bookings`, { credentials: "include" });
    if (!res.ok) {
        const errorMessage = await getResponseErrorMessage(res, "Unable to load bookings");
        tableBody.innerHTML = `<tr><td colspan="9" class="table-empty">${escapeHtml(errorMessage)}</td></tr>`;
        return;
    }
    const bookings = await res.json();
    bookingsCache = Array.isArray(bookings) ? bookings : [];
    updateBookingStats(bookingsCache);
    renderBookingsTable(filterBookingsByDate(bookingsCache));
}

function filterBookingsByDate(items) {
    const today = getTodayDateOnly();
    if (bookingsFilter === "today") {
        return items.filter((booking) => {
            const { start, end } = resolveBookingDateRange(booking);
            if (!start || !end) return false;
            return today.getTime() >= start.getTime() && today.getTime() <= end.getTime();
        });
    }
    if (bookingsFilter === "upcoming") {
        return items.filter((booking) => {
            const { start } = resolveBookingDateRange(booking);
            return start && start.getTime() > today.getTime();
        });
    }
    if (bookingsFilter === "past") {
        return items.filter((booking) => {
            const { end } = resolveBookingDateRange(booking);
            return end && end.getTime() < today.getTime();
        });
    }
    return items;
}

function renderBookingsTable(items) {
    const tableBody = document.getElementById("bookings-body");
    if (!tableBody) return;

    if (!items.length) {
        tableBody.innerHTML = `<tr><td colspan="9" class="table-empty">No bookings found for this filter.</td></tr>`;
        return;
    }

    tableBody.innerHTML = items.map((booking) => {
        const { start, end } = resolveBookingDateRange(booking);
        const today = getTodayDateOnly();
        const isToday = start && end && today.getTime() >= start.getTime() && today.getTime() <= end.getTime();
        return `
        <tr>
            <td>${booking.id}</td>
            <td>${escapeHtml(booking.customer_name || "-")}</td>
            <td>${escapeHtml(booking.phone || "-")}</td>
            <td>${escapeHtml(booking.decoration_title || "-")}</td>
            <td>${escapeHtml(formatDateRangeCell(booking.event_date || "-", booking.event_end_date || booking.event_date || "-"))}</td>
            <td>${escapeHtml(formatTimeCell(booking.event_time || "-"))}</td>
            <td>${escapeHtml(booking.location || "-")}</td>
            <td><span class="${statusPillClass(booking.status)}">${escapeHtml(booking.status || "pending")}</span></td>
            <td>
                <div class="booking-row-actions">
                    <button class="btn-row btn-accept btn-icon-only" data-action="accept" data-id="${booking.id}" title="Accept booking" aria-label="Accept booking">
                        <i class="ph ph-check"></i>
                    </button>
                    <button class="btn-row btn-reject btn-icon-only" data-action="reject" data-id="${booking.id}" title="Reject booking" aria-label="Reject booking">
                        <i class="ph ph-x"></i>
                    </button>
                    <button class="btn-row btn-assign btn-icon-only" data-action="assign-inventory" data-id="${booking.id}" data-decoration-id="${booking.decoration_id || ""}" data-title="${escapeHtml(booking.decoration_title || "Decoration Booking")}" title="Assign inventory" aria-label="Assign inventory">
                        <i class="ph ph-package"></i>
                    </button>
                    <button class="btn-row btn-delete btn-icon-only" data-action="delete" data-id="${booking.id}" title="Delete booking" aria-label="Delete booking">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
    }).join("");

    tableBody.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", async () => {
            const id = button.dataset.id;
            const action = button.dataset.action;

            try {
                if (action === "assign-inventory") {
                    await openBookingInventoryModal({
                        id,
                        decorationId: button.dataset.decorationId,
                        title: button.dataset.title || "Decoration Booking"
                    });
                    return;
                }

                if (action === "delete") {
                    const response = await fetch(`${PUBLIC_API_BASE}/bookings/${id}`, {
                        method: "DELETE",
                        credentials: "include"
                    });
                    if (!response.ok) {
                        throw new Error(await getResponseErrorMessage(response, "Failed to delete booking"));
                    }
                } else {
                    const status = action === "accept" ? "accepted" : "rejected";
                    const response = await fetch(`${PUBLIC_API_BASE}/bookings/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ status })
                    });
                    if (!response.ok) {
                        throw new Error(await getResponseErrorMessage(response, "Failed to update booking status"));
                    }
                }

                await loadBookingsTable();
            } catch (error) {
                alert(error.message || "Unable to complete this action.");
            }
        });
    });
}

function bindBookingDateFilters() {
    const buttons = document.querySelectorAll("[data-booking-filter]");
    if (!buttons.length) return;

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const next = String(button.dataset.bookingFilter || "all");
            bookingsFilter = next;
            buttons.forEach((btn) => btn.classList.toggle("active", btn === button));
            renderBookingsTable(filterBookingsByDate(bookingsCache));
        });
    });
}

function toggleBookingInventoryModal(open) {
    const modal = document.getElementById("inventory-usage-modal");
    if (!modal) return;

    modal.classList.toggle("open", open);
    modal.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
}

function renderBookingInventoryUsageRows() {
    const body = document.getElementById("usage-items-body");
    if (!body) return;

    if (!bookingInventoryState.selectedItems.length) {
        body.innerHTML = `<tr><td colspan="6" class="table-empty">No inventory item assigned for this booking.</td></tr>`;
        return;
    }

    body.innerHTML = bookingInventoryState.selectedItems.map((item, index) => `
        <tr>
            <td>${escapeHtml(item.item_name || "-")}</td>
            <td>${escapeHtml(item.category || "-")}</td>
            <td>${escapeHtml(String(item.quantity_used || 1))}</td>
            <td>Rs ${toMoney(item.unit_cost)}</td>
            <td>${escapeHtml(item.note || "-")}</td>
            <td><button class="btn-row btn-delete" type="button" data-remove-index="${index}">Remove</button></td>
        </tr>
    `).join("");

    body.querySelectorAll("[data-remove-index]").forEach((button) => {
        button.addEventListener("click", () => {
            const index = Number.parseInt(button.dataset.removeIndex, 10);
            if (!Number.isInteger(index)) return;
            bookingInventoryState.selectedItems.splice(index, 1);
            renderBookingInventoryUsageRows();
        });
    });
}

function populateBookingInventorySelect(items) {
    const select = document.getElementById("usage-item-select");
    if (!select) return;

    select.innerHTML = `<option value="">Select inventory item</option>` + items.map((item) => `
        <option value="${item.id}">
            ${escapeHtml(item.item_name || `Item ${item.id}`)}${item.category ? ` (${escapeHtml(item.category)})` : ""}
        </option>
    `).join("");
}

function resetBookingInventoryFormInputs() {
    const qtyInput = document.getElementById("usage-qty-input");
    const unitCostInput = document.getElementById("usage-unit-cost-input");
    const noteInput = document.getElementById("usage-note-input");
    const itemSelect = document.getElementById("usage-item-select");

    if (itemSelect) itemSelect.value = "";
    if (qtyInput) qtyInput.value = "";
    if (unitCostInput) unitCostInput.value = "";
    if (noteInput) noteInput.value = "";
}

function addBookingInventoryUsageItem() {
    const itemSelect = document.getElementById("usage-item-select");
    const qtyInput = document.getElementById("usage-qty-input");
    const unitCostInput = document.getElementById("usage-unit-cost-input");
    const noteInput = document.getElementById("usage-note-input");

    const inventoryId = Number.parseInt(itemSelect?.value || "", 10);
    const quantityUsed = Number.parseInt(qtyInput?.value || "", 10);
    const unitCostValue = unitCostInput?.value ?? "";
    const noteValue = String(noteInput?.value || "").trim();

    if (!Number.isInteger(inventoryId) || inventoryId <= 0) {
        alert("Please select inventory item");
        return;
    }
    if (!Number.isInteger(quantityUsed) || quantityUsed <= 0) {
        alert("Quantity used must be a positive integer");
        return;
    }

    const item = bookingInventoryState.inventoryCatalog.find((entry) => Number(entry.id) === inventoryId);
    if (!item) {
        alert("Selected inventory item not found");
        return;
    }

    const parsedCost = unitCostValue === "" ? Number(item.unit_price || 0) : Number(unitCostValue);
    const unitCost = Number.isFinite(parsedCost) ? parsedCost : Number(item.unit_price || 0);

    const existingIndex = bookingInventoryState.selectedItems.findIndex((entry) => Number(entry.inventory_item_id) === inventoryId);
    const payloadItem = {
        inventory_item_id: inventoryId,
        quantity_used: quantityUsed,
        unit_cost: unitCost,
        note: noteValue || null,
        item_name: item.item_name || `Item ${inventoryId}`,
        category: item.category || "-"
    };

    if (existingIndex >= 0) {
        bookingInventoryState.selectedItems[existingIndex] = payloadItem;
    } else {
        bookingInventoryState.selectedItems.push(payloadItem);
    }

    resetBookingInventoryFormInputs();
    renderBookingInventoryUsageRows();
}

async function applyBookingInventoryTemplate() {
    const bookingId = Number.parseInt(bookingInventoryState.bookingId, 10);
    if (!Number.isInteger(bookingId) || bookingId <= 0) {
        alert("Booking not selected");
        return;
    }

    try {
        const template = await ownerRequest(`/bookings/${bookingId}/inventory-template`);
        const templateItems = Array.isArray(template.items) ? template.items : [];

        if (!templateItems.length) {
            alert("No template found for this decoration yet.");
            return;
        }

        bookingInventoryState.selectedItems = templateItems.map((row) => ({
            inventory_item_id: Number(row.inventory_item_id),
            quantity_used: Number(row.quantity_used || 1),
            unit_cost: Number(row.unit_cost || 0),
            note: row.note || null,
            item_name: row.item_name || `Item ${row.inventory_item_id}`,
            category: row.category || "-"
        })).filter((item) => Number.isInteger(item.inventory_item_id) && item.inventory_item_id > 0);

        renderBookingInventoryUsageRows();
    } catch (error) {
        alert(error.message || "Failed to apply inventory template");
    }
}

async function openBookingInventoryModal(booking) {
    if (!booking?.id) return;

    const subtitle = document.getElementById("inventory-modal-subtitle");
    const bookingId = Number.parseInt(booking.id, 10);
    bookingInventoryState.bookingId = bookingId;
    bookingInventoryState.decorationId = Number.parseInt(booking.decorationId, 10) || null;
    bookingInventoryState.bookingLabel = booking.title || "Decoration Booking";
    bookingInventoryState.selectedItems = [];

    if (subtitle) {
        subtitle.textContent = `Booking #${bookingId} - ${bookingInventoryState.bookingLabel}`;
    }

    toggleBookingInventoryModal(true);

    try {
        const [inventoryCatalog, currentUsage] = await Promise.all([
            ownerRequest("/inventory"),
            ownerRequest(`/bookings/${bookingId}/inventory-usage`)
        ]);

        bookingInventoryState.inventoryCatalog = Array.isArray(inventoryCatalog) ? inventoryCatalog : [];
        populateBookingInventorySelect(bookingInventoryState.inventoryCatalog);

        bookingInventoryState.selectedItems = (Array.isArray(currentUsage) ? currentUsage : []).map((row) => ({
            inventory_item_id: Number(row.inventory_item_id),
            quantity_used: Number(row.quantity_used || 1),
            unit_cost: Number(row.unit_cost ?? row.default_unit_price ?? 0),
            note: row.note || null,
            item_name: row.item_name || `Item ${row.inventory_item_id}`,
            category: row.category || "-"
        }));
        renderBookingInventoryUsageRows();
    } catch (error) {
        alert(error.message || "Failed to load booking inventory usage");
        toggleBookingInventoryModal(false);
    }
}

function closeBookingInventoryModal() {
    bookingInventoryState.bookingId = null;
    bookingInventoryState.decorationId = null;
    bookingInventoryState.selectedItems = [];
    bookingInventoryState.inventoryCatalog = [];
    resetBookingInventoryFormInputs();
    toggleBookingInventoryModal(false);
}

async function saveBookingInventoryUsage(event) {
    event.preventDefault();
    const bookingId = Number.parseInt(bookingInventoryState.bookingId, 10);
    if (!Number.isInteger(bookingId) || bookingId <= 0) return;

    const payloadItems = bookingInventoryState.selectedItems.map((item) => ({
        inventory_item_id: Number(item.inventory_item_id),
        quantity_used: Number(item.quantity_used),
        unit_cost: Number(item.unit_cost || 0),
        note: item.note || null
    }));

    try {
        await ownerRequest(`/bookings/${bookingId}/inventory-usage`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: payloadItems })
        });
        closeBookingInventoryModal();
        await loadBookingsTable();
    } catch (error) {
        alert(error.message || "Failed to save inventory usage");
    }
}

function bindBookingInventoryModal() {
    if (bookingInventoryModalBound) return;
    bookingInventoryModalBound = true;

    const modal = document.getElementById("inventory-usage-modal");
    const closeButton = document.getElementById("inventory-modal-close");
    const addButton = document.getElementById("usage-add-btn");
    const applyTemplateButton = document.getElementById("usage-apply-template-btn");
    const form = document.getElementById("inventory-usage-form");
    if (!modal || !closeButton || !addButton || !applyTemplateButton || !form) return;

    closeButton.addEventListener("click", closeBookingInventoryModal);
    addButton.addEventListener("click", addBookingInventoryUsageItem);
    applyTemplateButton.addEventListener("click", applyBookingInventoryTemplate);
    form.addEventListener("submit", saveBookingInventoryUsage);

    modal.querySelectorAll("[data-close-modal='true']").forEach((element) => {
        element.addEventListener("click", closeBookingInventoryModal);
    });
}

async function loadDecorationsTable() {
    const owner = await ensureOwnerSession();
    if (!owner) return;
    setOwnerIdentity(owner.ownerEmail || "owner");

    const tableBody = document.getElementById("decorations-body");
    if (!tableBody) return;

    const res = await fetch(`${PUBLIC_API_BASE}/decorations`);
    currentDecorations = res.ok ? await res.json() : [];

    const total = currentDecorations.length;
    const avgPrice = total
        ? Math.round(currentDecorations.reduce((sum, item) => sum + Number(item.price || 0), 0) / total)
        : 0;
    const budgetFriendly = currentDecorations.filter((item) => {
        const budget = String(item.budget_category || item.budget || "").toLowerCase();
        const price = Number(item.price || 0);
        return budget === "low" || price <= 15000;
    }).length;

    setText("decor-total", String(total));
    setText("decor-avg-price", `Rs ${avgPrice.toLocaleString("en-IN")}`);
    setText("decor-budget-friendly", String(budgetFriendly));

    buildDecorationFilterOptions(currentDecorations);
    refreshDecorationsView();
}

function buildDecorationFilterOptions(items) {
    const eventSelect = document.getElementById("decor-event-filter");
    const budgetSelect = document.getElementById("decor-budget-filter");
    if (!eventSelect || !budgetSelect) return;

    const eventValues = Array.from(
        new Set(items.map((item) => String(item.event_type || item.event || "").trim()).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
    const budgetValues = Array.from(
        new Set(items.map((item) => String(item.budget_category || item.budget || "").trim()).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));

    const previousEvent = eventSelect.value || "all";
    const previousBudget = budgetSelect.value || "all";

    eventSelect.innerHTML = `<option value="all">All Events</option>` +
        eventValues.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
    budgetSelect.innerHTML = `<option value="all">All Budgets</option>` +
        budgetValues.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");

    eventSelect.value = eventValues.includes(previousEvent) ? previousEvent : "all";
    budgetSelect.value = budgetValues.includes(previousBudget) ? previousBudget : "all";
}

function filterDecorations(items) {
    const searchValue = String(document.getElementById("decor-search")?.value || "").trim().toLowerCase();
    const eventValue = String(document.getElementById("decor-event-filter")?.value || "all").toLowerCase();
    const budgetValue = String(document.getElementById("decor-budget-filter")?.value || "all").toLowerCase();

    return items.filter((item) => {
        const title = String(item.title || item.name || "").toLowerCase();
        const event = String(item.event_type || item.event || "").toLowerCase();
        const budget = String(item.budget_category || item.budget || "").toLowerCase();

        const searchMatch = !searchValue || title.includes(searchValue) || event.includes(searchValue);
        const eventMatch = eventValue === "all" || event === eventValue;
        const budgetMatch = budgetValue === "all" || budget === budgetValue;
        return searchMatch && eventMatch && budgetMatch;
    });
}

function updateDecorationResultCount(count) {
    const el = document.getElementById("decor-results-count");
    if (!el) return;
    el.textContent = `${count} result${count === 1 ? "" : "s"}`;
}

function setDecorationFormMode(mode = "add") {
    const title = document.getElementById("decor-form-title");
    const subtitle = document.getElementById("decor-form-subtitle");
    const saveBtn = document.getElementById("decor-save-btn");
    const cancelBtn = document.getElementById("decor-cancel-btn");
    const imageInput = document.getElementById("decor-image");

    const editMode = mode === "edit";
    if (title) title.textContent = editMode ? "Update Decoration" : "Add New Decoration";
    if (subtitle) subtitle.textContent = editMode
        ? "Edit details and optionally choose a new image file, then update."
        : "Create a catalog entry with image, budget and event type.";
    if (saveBtn) saveBtn.textContent = editMode ? "Update Decoration" : "Add Decoration";
    if (cancelBtn) cancelBtn.hidden = !editMode;
    if (imageInput) imageInput.required = !editMode;
}

function resetDecorationForm() {
    const form = document.getElementById("add-decoration-form");
    if (!form) return;

    form.reset();
    const idInput = document.getElementById("decor-id");
    if (idInput) idInput.value = "";

    setDecorationFormMode("add");
}

function fillDecorationForm(item) {
    const idInput = document.getElementById("decor-id");

    const titleInput = document.getElementById("decor-title");
    const priceInput = document.getElementById("decor-price");
    const eventInput = document.getElementById("decor-event-type");
    const budgetInput = document.getElementById("decor-budget-category");
    const descriptionInput = document.getElementById("decor-description");
    const imageInput = document.getElementById("decor-image");

    if (titleInput) titleInput.value = item.title || item.name || "";
    if (priceInput) priceInput.value = item.price ?? "";
    if (eventInput) eventInput.value = item.event_type || item.event || "";
    if (budgetInput) budgetInput.value = item.budget_category || item.budget || "";
    if (descriptionInput) descriptionInput.value = item.description || "";
    if (imageInput) imageInput.value = "";

    if (idInput) idInput.value = String(item.id || "");
    setDecorationFormMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function getDecorationImageHref(rawUrl) {
    const value = String(rawUrl || "").trim();
    if (!value) return "";
    if (/^https?:\/\//i.test(value)) return value;
    if (value.startsWith("/uploads/")) return `http://${ADMIN_API_HOST}:5000${value}`;
    if (value.startsWith("uploads/")) return `http://${ADMIN_API_HOST}:5000/${value}`;
    if (value.startsWith("/")) return `http://${ADMIN_API_HOST}:5000${value}`;
    return `http://${ADMIN_API_HOST}:5000/${value}`;
}

function renderDecorationsRows(items) {
    const tableBody = document.getElementById("decorations-body");
    if (!tableBody) return;

    tableBody.innerHTML = items.map((item) => {
        const budget = escapeHtml(item.budget_category || item.budget || "-");
        const event = escapeHtml(item.event_type || item.event || "-");
        const price = Number(item.price || 0);

        return `
            <tr>
                <td>${item.id}</td>
                <td>${escapeHtml(item.title || item.name || "-")}</td>
                <td>Rs ${Number.isFinite(price) ? price.toLocaleString("en-IN") : "-"}</td>
                <td>${event}</td>
                <td><span class="budget-pill">${budget}</span></td>
                <td>${item.image_url || item.image ? `<a href="${escapeHtml(getDecorationImageHref(item.image_url || item.image))}" target="_blank" rel="noopener">View</a>` : "-"}</td>
                <td>
                    <button class="table-btn-edit" data-action="edit" data-id="${item.id}">Edit</button>
                    <button class="table-btn-delete" data-action="delete" data-id="${item.id}">Delete</button>
                </td>
            </tr>
        `;
    }).join("");

    tableBody.querySelectorAll("button[data-action]").forEach((button) => {
        button.addEventListener("click", async () => {
            const id = button.dataset.id;
            const action = button.dataset.action;
            const item = currentDecorations.find((d) => String(d.id) === String(id));
            if (!item) return;

            if (action === "edit") {
                fillDecorationForm(item);
                return;
            }

            if (!confirm("Delete this decoration?")) return;
            await fetch(`${PUBLIC_API_BASE}/decorations/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            await loadDecorationsTable();
        });
    });
}

function refreshDecorationsView() {
    const filtered = filterDecorations(currentDecorations);
    renderDecorationsRows(filtered);
    updateDecorationResultCount(filtered.length);
}

function bindDecorationFilters() {
    const search = document.getElementById("decor-search");
    const event = document.getElementById("decor-event-filter");
    const budget = document.getElementById("decor-budget-filter");

    if (search) search.addEventListener("input", refreshDecorationsView);
    if (event) event.addEventListener("change", refreshDecorationsView);
    if (budget) budget.addEventListener("change", refreshDecorationsView);
}

function bindAddDecorationForm() {
    const form = document.getElementById("add-decoration-form");
    if (!form) return;
    const cancelBtn = document.getElementById("decor-cancel-btn");

    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => resetDecorationForm());
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const id = String(document.getElementById("decor-id")?.value || "").trim();
        const fileInput = document.getElementById("decor-image");
        const hasFile = Boolean(fileInput?.files?.length);
        const selectedFile = fileInput?.files?.[0] || null;

        if (selectedFile && selectedFile.size > 20 * 1024 * 1024) {
            alert("Image must be 20MB or smaller");
            return;
        }

        if (id) {
            const title = String(document.getElementById("decor-title")?.value || "").trim();
            const price = Number(document.getElementById("decor-price")?.value || 0);
            if (!title || !Number.isFinite(price) || price <= 0) {
                alert("Title and valid price are required");
                return;
            }

            const formData = new FormData(form);
            if (!hasFile) {
                formData.delete("image");
            }

            try {
                const updateRes = await fetch(`${OWNER_API_BASE}/decorations/${id}`, {
                    method: "PUT",
                    credentials: "include",
                    body: formData
                });
                if (!updateRes.ok) {
                    const message = await getResponseErrorMessage(updateRes, "Failed to update decoration");
                    if (updateRes.status === 401) {
                        window.location.href = "admin-login.html";
                        return;
                    }
                    throw new Error(message);
                }
                resetDecorationForm();
                await loadDecorationsTable();
            } catch (error) {
                alert(error.message || "Failed to update decoration");
            }
            return;
        }

        const formData = new FormData(form);
        if (!hasFile) {
            alert("Please choose an image file");
            return;
        }

        try {
            const res = await fetch(`${OWNER_API_BASE}/decorations`, {
                method: "POST",
                credentials: "include",
                body: formData
            });

            if (!res.ok) {
                const message = await getResponseErrorMessage(res, "Failed to add decoration");
                if (res.status === 401) {
                    window.location.href = "admin-login.html";
                    return;
                }
                alert(message);
                return;
            }

            resetDecorationForm();
            await loadDecorationsTable();
            alert("Decoration added succesfully");
        } catch (error) {
            alert(error.message || "Failed to add decoration");
        }
    });
}

function renderInventoryTable(items) {
    const tableBody = document.getElementById("inventory-body");
    if (!tableBody) return;

    tableBody.innerHTML = items.map((item) => {
        const qty = Number(item.quantity || 0);

        return `
            <tr>
                <td>${item.id}</td>
                <td>${escapeHtml(item.item_name)}</td>
                <td>${escapeHtml(item.category || "-")}</td>
                <td>${qty}</td>
                <td>Rs ${Number(item.unit_price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>
                    <div class="inv-actions">
                        <button class="btn-row btn-edit" data-action="edit" data-id="${item.id}">Edit</button>
                        <button class="btn-row btn-stock" data-action="stock" data-id="${item.id}">Set Stock</button>
                        <button class="btn-row btn-delete" data-action="delete" data-id="${item.id}">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function buildInventoryFilterOptions(items) {
    const categorySelect = document.getElementById("inventory-category-filter");
    if (!categorySelect) return;

    const categories = Array.from(
        new Set(
            items
                .map((item) => String(item.category || "").trim())
                .filter(Boolean)
        )
    ).sort((a, b) => a.localeCompare(b));

    const previous = categorySelect.value || "all";
    categorySelect.innerHTML = `<option value="all">All Categories</option>` +
        categories.map((category) =>
            `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`
        ).join("");

    if (categories.includes(previous)) {
        categorySelect.value = previous;
    } else {
        categorySelect.value = "all";
    }
}

function filterInventoryItems(items) {
    const searchInput = document.getElementById("inventory-search");
    const categorySelect = document.getElementById("inventory-category-filter");

    const search = String(searchInput?.value || "").trim().toLowerCase();
    const category = String(categorySelect?.value || "all").trim().toLowerCase();

    return items.filter((item) => {
        const text = [
            item.item_name,
            item.category
        ].join(" ").toLowerCase();

        const matchesSearch = !search || text.includes(search);
        const matchesCategory = category === "all" || String(item.category || "").toLowerCase() === category;

        return matchesSearch && matchesCategory;
    });
}

function refreshInventoryTableView() {
    const filtered = filterInventoryItems(currentInventoryItems);
    renderInventoryTable(filtered);
    bindInventoryRowActions();
}

function bindInventoryFilterEvents() {
    const searchInput = document.getElementById("inventory-search");
    const categorySelect = document.getElementById("inventory-category-filter");

    if (searchInput) {
        searchInput.addEventListener("input", refreshInventoryTableView);
    }

    if (categorySelect) {
        categorySelect.addEventListener("change", refreshInventoryTableView);
    }
}

function bindInventoryRowActions() {
    const tableBody = document.getElementById("inventory-body");
    if (!tableBody) return;

    tableBody.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", async () => {
            const id = button.dataset.id;
            const action = button.dataset.action;

            if (action === "delete") {
                await fetch(`${OWNER_API_BASE}/inventory/${id}`, {
                    method: "DELETE",
                    credentials: "include"
                });
                await loadInventoryPage();
                return;
            }

            if (action === "stock") {
                const value = prompt("Enter new stock quantity:");
                if (value === null) return;
                const qty = Number(value);
                if (!Number.isInteger(qty) || qty < 0) {
                    alert("Quantity must be a non-negative integer");
                    return;
                }

                await fetch(`${OWNER_API_BASE}/inventory/${id}/stock`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ quantity: qty })
                });
                await loadInventoryPage();
                return;
            }

            const itemRes = await fetch(`${OWNER_API_BASE}/inventory/${id}`, { credentials: "include" });
            if (!itemRes.ok) return;
            const item = await itemRes.json();
            fillInventoryForm(item);
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });
}

function fillInventoryForm(item) {
    document.getElementById("inventory-id").value = item.id;
    document.getElementById("item_name").value = item.item_name || "";
    document.getElementById("category").value = item.category || "";
    document.getElementById("quantity").value = item.quantity ?? 0;
    document.getElementById("unit_price").value = item.unit_price ?? 0;
    document.getElementById("inventory-form-title").textContent = "Edit Inventory Item";
    document.getElementById("inventory-save-btn").textContent = "Update Item";
    document.getElementById("inventory-cancel-btn").hidden = false;
}

function resetInventoryForm() {
    document.getElementById("inventory-form").reset();
    document.getElementById("inventory-id").value = "";
    document.getElementById("inventory-form-title").textContent = "Add Inventory Item";
    document.getElementById("inventory-save-btn").textContent = "Add Item";
    document.getElementById("inventory-cancel-btn").hidden = true;
}

function getInventoryPayloadFromForm() {
    return {
        item_name: document.getElementById("item_name").value.trim(),
        category: document.getElementById("category").value.trim(),
        quantity: Number(document.getElementById("quantity").value || 0),
        unit_price: Number(document.getElementById("unit_price").value || 0)
    };
}

async function fetchInventoryItems() {
    const res = await fetch(`${OWNER_API_BASE}/inventory`, { credentials: "include" });
    return res.ok ? res.json() : [];
}

async function loadInventoryPage() {
    const owner = await ensureOwnerSession();
    if (!owner) return;
    setOwnerIdentity(owner.ownerEmail || "owner");

    currentInventoryItems = await fetchInventoryItems();
    const totalItems = currentInventoryItems.length;
    const categoryCount = new Set(
        currentInventoryItems
            .map((item) => String(item.category || "").trim().toLowerCase())
            .filter(Boolean)
    ).size;
    const stockValue = currentInventoryItems.reduce((sum, item) => {
        const qty = Number(item.quantity || 0);
        const price = Number(item.unit_price || 0);
        return sum + (Number.isFinite(qty) ? qty : 0) * (Number.isFinite(price) ? price : 0);
    }, 0);

    setText("inventory-total", String(totalItems));
    setText("inventory-categories", String(categoryCount));
    setText("inventory-stock-value", `Rs ${stockValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`);
    buildInventoryFilterOptions(currentInventoryItems);
    refreshInventoryTableView();
}

function bindInventoryForm() {
    const form = document.getElementById("inventory-form");
    if (!form) return;

    const cancelBtn = document.getElementById("inventory-cancel-btn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => resetInventoryForm());
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const id = document.getElementById("inventory-id").value;
        const payload = getInventoryPayloadFromForm();

        if (!payload.item_name) {
            alert("Item name is required");
            return;
        }

        const method = id ? "PUT" : "POST";
        const url = id ? `${OWNER_API_BASE}/inventory/${id}` : `${OWNER_API_BASE}/inventory`;

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: "Failed to save inventory item" }));
            alert(err.message || "Failed to save inventory item");
            return;
        }

        resetInventoryForm();
        await loadInventoryPage();
    });
}

function bindLogoutButton() {
    const button = document.getElementById("owner-logout-btn");
    if (!button) return;
    button.addEventListener("click", logoutOwner);
}

function setSidebarToggleIcon(isCollapsed) {
    const button = document.getElementById("sidebar-toggle-btn");
    if (!button) return;
    const icon = button.querySelector("i");
    if (!icon) return;
    icon.className = isCollapsed ? "ph ph-sidebar-simple" : "ph ph-sidebar";
}

function bindSidebarToggle() {
    const button = document.getElementById("sidebar-toggle-btn");
    if (!button) return;

    const storageKey = "owner_sidebar_collapsed";
    const saved = localStorage.getItem(storageKey) === "1";
    if (saved) {
        document.body.classList.add("sidebar-collapsed");
    }
    setSidebarToggleIcon(saved);

    button.addEventListener("click", () => {
        const collapsed = document.body.classList.toggle("sidebar-collapsed");
        localStorage.setItem(storageKey, collapsed ? "1" : "0");
        setSidebarToggleIcon(collapsed);
    });
}

function formatMonthLabel(monthValue) {
    const [yearStr, monthStr] = String(monthValue || "").split("-");
    const year = Number.parseInt(yearStr, 10);
    const month = Number.parseInt(monthStr, 10);
    if (!Number.isInteger(year) || !Number.isInteger(month)) return "Calendar";

    const d = new Date(year, month - 1, 1);
    return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function getCurrentMonthKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function shiftMonth(monthValue, delta) {
    const [yearStr, monthStr] = String(monthValue).split("-");
    const year = Number.parseInt(yearStr, 10);
    const month = Number.parseInt(monthStr, 10);
    if (!Number.isInteger(year) || !Number.isInteger(month)) return getCurrentMonthKey();

    const d = new Date(year, month - 1 + delta, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function statusPillClass(status) {
    const value = String(status || "").toLowerCase();
    if (value === "accepted" || value === "completed") return "status-pill accepted";
    if (value === "pending") return "status-pill pending";
    if (value === "cancelled" || value === "rejected") return "status-pill cancelled";
    return "status-pill";
}

function normalizeDateKey(value) {
    return String(value || "").slice(0, 10);
}

function renderCalendarLegend(data) {
    const legend = document.getElementById("density-legend");
    if (!legend) return;

    const colors = data?.event_color_map || {};
    const eventTypes = Array.isArray(data?.available_event_types) ? data.available_event_types : [];

    legend.innerHTML = eventTypes.map((type) => `
        <span class="legend-chip">
            <span class="legend-dot" style="background:${colors[type] || colors.other || "#64748b"}"></span>
            ${escapeHtml(type)}
        </span>
    `).join("");
}

function renderFilterGroup(containerId, values, selectedValues, onToggle) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = values.map((value) => {
        const active = selectedValues.includes(value);
        return `
            <button type="button" class="filter-pill ${active ? "active" : ""}" data-value="${escapeHtml(value)}">
                ${escapeHtml(value)}
            </button>
        `;
    }).join("");

    container.querySelectorAll(".filter-pill").forEach((button) => {
        button.addEventListener("click", () => onToggle(button.dataset.value));
    });
}

async function fetchCalendarData() {
    const statusParam = calendarState.statuses.join(",");
    const eventTypes = calendarState.eventTypes.filter((v) => v !== "all");
    const eventTypeParam = eventTypes.join(",");

    const path = `/bookings/calendar?month=${encodeURIComponent(calendarState.month)}&statuses=${encodeURIComponent(statusParam)}&event_types=${encodeURIComponent(eventTypeParam)}`;
    const data = await ownerRequest(path);
    return data;
}

function renderCalendarGrid() {
    const grid = document.getElementById("owner-booking-calendar");
    const monthLabel = document.getElementById("calendar-month-label");
    if (!grid || !calendarState.data) return;

    if (monthLabel) monthLabel.textContent = formatMonthLabel(calendarState.month);

    const daysData = Array.isArray(calendarState.data.days) ? calendarState.data.days : [];
    const dayLookup = new Map(daysData.map((day) => [normalizeDateKey(day.date), day]));

    const [yearStr, monthStr] = String(calendarState.month).split("-");
    const year = Number.parseInt(yearStr, 10);
    const month = Number.parseInt(monthStr, 10);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    // Monday-first index
    const startPadding = (firstDay.getDay() + 6) % 7;
    const totalCells = Math.ceil((startPadding + lastDay.getDate()) / 7) * 7;

    const cells = [];
    for (let i = 0; i < totalCells; i += 1) {
        const dayNumber = i - startPadding + 1;
        const inMonth = dayNumber >= 1 && dayNumber <= lastDay.getDate();
        const dateObj = new Date(year, month - 1, inMonth ? dayNumber : 1);
        if (!inMonth) {
            dateObj.setDate(dayNumber);
        }

        const dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
        const dayData = dayLookup.get(dateKey) || null;
        const selected = calendarState.selectedDate === dateKey;

        const acceptedCount = Number(dayData?.status_counts?.accepted || 0);
        const densityColor = acceptedCount > 0
            ? (dayData?.density_color || "#e2e8f0")
            : "#e2e8f0";
        const bookingCount = Number(dayData?.booking_count || 0);
        const inventoryShortage = Array.isArray(dayData?.inventory_shortages) && dayData.inventory_shortages.length > 0;

        cells.push(`
            <article class="calendar-day ${inMonth ? "" : "muted"} ${selected ? "selected" : ""}" data-date="${dateKey}">
                <span class="density-band" style="background:${densityColor}"></span>
                <div class="calendar-day-top">
                    <span class="day-number">${dateObj.getDate()}</span>
                    <span class="booking-count">${bookingCount}</span>
                </div>
                <div class="day-metrics">
                    <span class="${inventoryShortage ? "metric-danger" : ""}">${inventoryShortage ? "Inventory shortage" : "Inventory ok"}</span>
                </div>
            </article>
        `);
    }

    grid.innerHTML = cells.join("");
    grid.querySelectorAll(".calendar-day").forEach((cell) => {
        cell.addEventListener("click", () => {
            calendarState.selectedDate = cell.dataset.date;
            renderCalendarGrid();
            renderDayPanel();
        });
    });
}

function renderDayPanel() {
    const title = document.getElementById("day-panel-title");
    const summary = document.getElementById("day-panel-summary");
    const content = document.getElementById("day-panel-content");
    if (!title || !summary || !content || !calendarState.data) return;

    const dateKey = calendarState.selectedDate;
    if (!dateKey) {
        title.textContent = "Select a day";
        summary.textContent = "Click any calendar day to inspect detailed bookings and operational load.";
        content.innerHTML = `<div class="empty-note">No day selected.</div>`;
        return;
    }

    const day = (calendarState.data.days || []).find((d) => normalizeDateKey(d.date) === dateKey);
    title.textContent = new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    if (!day) {
        summary.textContent = "No bookings on this date.";
        content.innerHTML = `<div class="empty-note">No bookings found.</div>`;
        return;
    }

    const shortages = Array.isArray(day.inventory_shortages) ? day.inventory_shortages : [];
    summary.textContent = `Bookings: ${day.booking_count}`;

    const shortageHtml = shortages.length
        ? `<div class="empty-note" style="text-align:left;">
            <strong>Inventory Warning:</strong><br>
            ${shortages.map((item) => `${escapeHtml(item.item)} required ${item.required}, available ${item.available}`).join("<br>")}
          </div>`
        : "";

    const bookings = Array.isArray(day.bookings) ? day.bookings : [];
    const bookingsHtml = bookings.length
        ? bookings.map((booking) => `
            <article class="booking-item">
                <div class="booking-item-head">
                    <h4>${escapeHtml(booking.decoration_title || "Decoration Booking")}</h4>
                    <span class="${statusPillClass(booking.status)}">${escapeHtml(booking.status || "pending")}</span>
                </div>
                <div class="booking-item-meta">
                    <span><strong>Time:</strong> ${escapeHtml(booking.event_time || "-")}</span>
                    <span><strong>Customer:</strong> ${escapeHtml(booking.customer_name || "-")} (${escapeHtml(booking.phone || "-")})</span>
                    <span><strong>Location:</strong> ${escapeHtml(booking.location || "-")}</span>
                    <span><strong>Event Type:</strong> ${escapeHtml(booking.event_type || "other")}</span>
                </div>
            </article>
        `).join("")
        : `<div class="empty-note">No bookings after current filters.</div>`;

    content.innerHTML = `${shortageHtml}${bookingsHtml}`;
}

async function refreshCalendarPage() {
    const data = await fetchCalendarData();
    calendarState.data = data;

    const statusValues = ["pending", "accepted", "cancelled", "rejected"];
    const eventValues = ["all", ...(data.available_event_types || [])];

    renderFilterGroup("status-filter-group", statusValues, calendarState.statuses, async (value) => {
        if (calendarState.statuses.includes(value)) {
            calendarState.statuses = calendarState.statuses.filter((v) => v !== value);
        } else {
            calendarState.statuses = [...calendarState.statuses, value];
        }
        if (!calendarState.statuses.length) calendarState.statuses = ["pending", "accepted", "cancelled", "rejected"];
        await refreshCalendarPage();
    });

    renderFilterGroup("event-filter-group", eventValues, calendarState.eventTypes, async (value) => {
        if (value === "all") {
            calendarState.eventTypes = ["all"];
        } else {
            const next = calendarState.eventTypes.filter((v) => v !== "all");
            if (next.includes(value)) {
                calendarState.eventTypes = next.filter((v) => v !== value);
            } else {
                calendarState.eventTypes = [...next, value];
            }
            if (!calendarState.eventTypes.length) calendarState.eventTypes = ["all"];
        }
        await refreshCalendarPage();
    });

    renderCalendarLegend(data);
    renderCalendarGrid();
    renderDayPanel();
}

function bindCalendarControls() {
    const prevBtn = document.getElementById("calendar-prev-month");
    const nextBtn = document.getElementById("calendar-next-month");

    if (prevBtn) {
        prevBtn.addEventListener("click", async () => {
            calendarState.month = shiftMonth(calendarState.month, -1);
            calendarState.selectedDate = null;
            await refreshCalendarPage();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener("click", async () => {
            calendarState.month = shiftMonth(calendarState.month, 1);
            calendarState.selectedDate = null;
            await refreshCalendarPage();
        });
    }

}

async function loadBookingsCalendarPage() {
    const owner = await ensureOwnerSession();
    if (!owner) return;
    setOwnerIdentity(owner.ownerEmail || "owner");

    calendarState = {
        month: getCurrentMonthKey(),
        statuses: ["pending", "accepted", "cancelled", "rejected"],
        eventTypes: ["all"],
        selectedDate: null,
        data: null
    };

    bindCalendarControls();
    await refreshCalendarPage();
}

function populateSimpleSelect(selectId, options, valueBuilder, labelBuilder) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const currentValue = select.value;
    const html = [`<option value="">All</option>`];

    options.forEach((item) => {
        const value = valueBuilder(item);
        const label = labelBuilder(item);
        if (!value) return;
        html.push(`<option value="${escapeHtml(String(value))}">${escapeHtml(String(label))}</option>`);
    });

    select.innerHTML = html.join("");
    select.value = Array.from(select.options).some((opt) => opt.value === currentValue) ? currentValue : "";
}

function buildUsageReportMetaFilters() {
    const bookings = Array.isArray(usageReportMeta.bookings) ? usageReportMeta.bookings : [];
    const inventory = Array.isArray(usageReportMeta.inventory) ? usageReportMeta.inventory : [];
    const decorations = Array.isArray(usageReportMeta.decorations) ? usageReportMeta.decorations : [];

    const customers = Array.from(
        new Map(
            bookings
                .filter((item) => {
                    const id = Number(item.customer_id);
                    return Number.isInteger(id) && id > 0;
                })
                .map((item) => {
                    const id = Number(item.customer_id);
                    const name = item.customer_name || "Customer";
                    const phone = item.phone || "-";
                    return [id, { id, label: `${name} (${phone})` }];
                })
        ).values()
    ).sort((a, b) => a.label.localeCompare(b.label));

    const inventoryItems = inventory
        .map((item) => ({
            id: Number(item.id),
            label: `${item.item_name || `Item ${item.id}`}${item.category ? ` (${item.category})` : ""}`
        }))
        .filter((item) => Number.isInteger(item.id) && item.id > 0)
        .sort((a, b) => a.label.localeCompare(b.label));

    const eventTypes = Array.from(
        new Set(
            decorations
                .map((item) => String(item.event_type || item.event || "").trim())
                .filter(Boolean)
        )
    ).sort((a, b) => a.localeCompare(b));

    populateSimpleSelect("report-customer", customers, (item) => item.id, (item) => item.label);
    populateSimpleSelect("report-inventory-item", inventoryItems, (item) => item.id, (item) => item.label);
    populateSimpleSelect("report-event-type", eventTypes, (item) => item, (item) => item);
}

function collectUsageReportFilters() {
    const params = new URLSearchParams();

    const dateFrom = String(document.getElementById("report-date-from")?.value || "").trim();
    const dateTo = String(document.getElementById("report-date-to")?.value || "").trim();
    const status = String(document.getElementById("report-status")?.value || "").trim();
    const eventType = String(document.getElementById("report-event-type")?.value || "").trim();
    const customerId = String(document.getElementById("report-customer")?.value || "").trim();
    const inventoryItemId = String(document.getElementById("report-inventory-item")?.value || "").trim();
    const bookingId = String(document.getElementById("report-booking-id")?.value || "").trim();

    if (dateFrom) params.set("date_from", dateFrom);
    if (dateTo) params.set("date_to", dateTo);
    if (status) params.set("status", status);
    if (eventType) params.set("event_type", eventType);
    if (customerId) params.set("customer_id", customerId);
    if (inventoryItemId) params.set("inventory_item_id", inventoryItemId);
    if (bookingId) params.set("booking_id", bookingId);

    return params;
}

function renderCustomerDetailsTableRows(rows) {
    const body = document.getElementById("customer-details-body");
    if (!body) return;

    if (!rows.length) {
        body.innerHTML = `<tr><td colspan="9" class="table-empty">No customer details found for selected filters.</td></tr>`;
        return;
    }

    body.innerHTML = rows.map((row) => `
        <tr>
            <td>${escapeHtml(row.customer_name || "-")}<br><small>ID: ${escapeHtml(String(row.customer_id || "-"))}</small></td>
            <td>${escapeHtml(row.customer_phone || "-")}</td>
            <td>${escapeHtml(String(row.total_bookings || 0))}</td>
            <td>${escapeHtml(String(row.accepted_bookings || 0))}</td>
            <td>${escapeHtml(String(row.pending_bookings || 0))}</td>
            <td><span class="text-wrap">${escapeHtml(row.inventory_items_used || "-")}</span></td>
            <td>${escapeHtml(String(row.total_quantity_used || 0))}</td>
            <td>Rs ${toMoney(row.total_inventory_cost || 0)}</td>
            <td><span class="text-wrap">${escapeHtml(row.event_types_used || "-")}</span></td>
        </tr>
    `).join("");
}

function updateUsageReportSummary(summary = {}) {
    setText("report-summary-rows", formatCount(summary.customers || 0));
    setText("report-summary-customers", formatCount(summary.customers || 0));
    setText("report-summary-bookings", formatCount(summary.total_bookings || 0));
    setText("report-summary-qty", formatCount(summary.total_quantity_used || 0));
    setText("report-summary-cost", `Rs ${toMoney(summary.total_inventory_cost || 0)}`);
}

async function refreshUsageReportTable() {
    try {
        const params = collectUsageReportFilters();
        const query = params.toString();
        const customerPath = query
            ? `/reports/customer-details-usage?${query}`
            : "/reports/customer-details-usage";

        const customerDetails = await ownerRequest(customerPath);
        updateUsageReportSummary(customerDetails.summary || {});
        renderCustomerDetailsTableRows(Array.isArray(customerDetails.data) ? customerDetails.data : []);
    } catch (error) {
        alert(error.message || "Failed to load usage report");
    }
}

function bindUsageReportControls() {
    const applyBtn = document.getElementById("report-apply-btn");
    const resetBtn = document.getElementById("report-reset-btn");
    const form = document.getElementById("usage-report-filter-form");

    if (applyBtn) {
        applyBtn.addEventListener("click", refreshUsageReportTable);
    }

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            await refreshUsageReportTable();
        });
    }

    if (resetBtn && form) {
        resetBtn.addEventListener("click", async () => {
            form.reset();
            await refreshUsageReportTable();
        });
    }
}

async function loadInventoryUsageReportPage() {
    const owner = await ensureOwnerSession();
    if (!owner) return;
    setOwnerIdentity(owner.ownerEmail || "owner");

    const [bookingsRes, decorationsRes, inventoryRes] = await Promise.all([
        fetch(`${PUBLIC_API_BASE}/bookings`, { credentials: "include" }),
        fetch(`${PUBLIC_API_BASE}/decorations`),
        fetch(`${OWNER_API_BASE}/inventory`, { credentials: "include" })
    ]);

    usageReportMeta = {
        bookings: bookingsRes.ok ? await bookingsRes.json() : [],
        decorations: decorationsRes.ok ? await decorationsRes.json() : [],
        inventory: inventoryRes.ok ? await inventoryRes.json() : []
    };

    buildUsageReportMetaFilters();
    bindUsageReportControls();
    await refreshUsageReportTable();
}

function reviewSourceLabel(source) {
    const value = String(source || "").toLowerCase();
    if (value === "booking") return "Booking Review";
    if (value === "public") return "Community Review";
    return "Customer Review";
}

function reviewStatusPill(isPublished) {
    return isPublished
        ? `<span class="status-pill accepted">Published</span>`
        : `<span class="status-pill cancelled">Hidden</span>`;
}

function renderAdminReviewsTable(rows) {
    const body = document.getElementById("reviews-body");
    const empty = document.getElementById("reviews-empty");
    if (!body) return;

    if (!rows.length) {
        body.innerHTML = "";
        if (empty) empty.style.display = "block";
        return;
    }

    if (empty) empty.style.display = "none";
    body.innerHTML = rows.map((review) => {
        const reviewId = review.id || review.review_id || review.reviewId;
        const title = review.decoration_title || "Customer Review";
        const author = review.customer_name || "Customer";
        const source = String(review.source || "public").toLowerCase();
        const rating = Number(review.rating || 0).toFixed(1);
        const status = reviewStatusPill(Boolean(review.is_published));
        const dateLabel = formatDateCell(review.created_at || "");
        const comment = String(review.comment || "").trim();
        const summary = comment.length > 120 ? `${comment.slice(0, 117)}...` : comment || "-";
        const toggleLabel = review.is_published ? "Hide" : "Publish";

        return `
            <tr>
                <td>#${escapeHtml(String(reviewId || "-"))}</td>
                <td>
                    <strong>${escapeHtml(title)}</strong><br>
                    <small>${escapeHtml(summary)}</small>
                </td>
                <td>${escapeHtml(author)}</td>
                <td>${escapeHtml(reviewSourceLabel(source))}</td>
                <td>${escapeHtml(String(rating))}</td>
                <td>${status}</td>
                <td>${escapeHtml(dateLabel)}</td>
                <td>
                    <button type="button" class="table-btn-edit" data-review-toggle="1" data-review-id="${escapeHtml(String(reviewId))}" data-review-source="${escapeHtml(source)}" data-review-published="${review.is_published ? "1" : "0"}">
                        ${escapeHtml(toggleLabel)}
                    </button>
                    <button type="button" class="table-btn-delete" data-review-delete="1" data-review-id="${escapeHtml(String(reviewId))}" data-review-source="${escapeHtml(source)}">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

function applyAdminReviewFilters() {
    const term = String(adminReviewFilters.term || "").trim().toLowerCase();
    const sourceFilter = String(adminReviewFilters.source || "all").toLowerCase();
    const statusFilter = String(adminReviewFilters.status || "all").toLowerCase();

    const filtered = adminReviewsCache.filter((review) => {
        const source = String(review.source || "public").toLowerCase();
        const isPublished = Boolean(review.is_published);
        if (sourceFilter !== "all" && source !== sourceFilter) return false;
        if (statusFilter === "published" && !isPublished) return false;
        if (statusFilter === "hidden" && isPublished) return false;

        if (!term) return true;
        const haystack = [
            review.decoration_title,
            review.customer_name,
            review.comment,
            review.source
        ].map((value) => String(value || "").toLowerCase()).join(" ");
        return haystack.includes(term);
    });

    renderAdminReviewsTable(filtered);
    setText("reviews-count", `${filtered.length} reviews`);
}

async function loadAdminReviews() {
    const data = await ownerRequest("/reviews");
    adminReviewsCache = Array.isArray(data?.reviews) ? data.reviews : [];
    const publishedCount = adminReviewsCache.filter((review) => review.is_published).length;
    const hiddenCount = adminReviewsCache.length - publishedCount;
    setText("reviews-total", formatCount(adminReviewsCache.length));
    setText("reviews-published", formatCount(publishedCount));
    setText("reviews-hidden", formatCount(hiddenCount));
    applyAdminReviewFilters();
}

async function loadAdminReviewsPage() {
    const owner = await ensureOwnerSession();
    if (!owner) return;
    setOwnerIdentity(owner.ownerEmail || "owner");

    const searchInput = document.getElementById("reviews-search");
    const sourceSelect = document.getElementById("reviews-source");
    const statusSelect = document.getElementById("reviews-status");
    const refreshBtn = document.getElementById("reviews-refresh");
    const tableBody = document.getElementById("reviews-body");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            adminReviewFilters.term = searchInput.value;
            applyAdminReviewFilters();
        });
    }
    if (sourceSelect) {
        sourceSelect.addEventListener("change", () => {
            adminReviewFilters.source = sourceSelect.value;
            applyAdminReviewFilters();
        });
    }
    if (statusSelect) {
        statusSelect.addEventListener("change", () => {
            adminReviewFilters.status = statusSelect.value;
            applyAdminReviewFilters();
        });
    }
    if (refreshBtn) {
        refreshBtn.addEventListener("click", loadAdminReviews);
    }

    if (tableBody) {
        tableBody.addEventListener("click", async (event) => {
            const deleteBtn = event.target.closest("[data-review-delete]");
            const toggleBtn = event.target.closest("[data-review-toggle]");
            if (!deleteBtn && !toggleBtn) return;

            const reviewId = deleteBtn?.dataset.reviewId || toggleBtn?.dataset.reviewId;
            const source = deleteBtn?.dataset.reviewSource || toggleBtn?.dataset.reviewSource;
            if (!reviewId) return;

            if (deleteBtn) {
                const confirmed = window.confirm("Delete this review permanently?");
                if (!confirmed) return;
                deleteBtn.disabled = true;
                try {
                    await ownerRequest(`/reviews/${encodeURIComponent(reviewId)}?source=${encodeURIComponent(source || "public")}`, {
                        method: "DELETE"
                    });
                    await loadAdminReviews();
                } catch (error) {
                    alert(error.message || "Unable to delete review.");
                } finally {
                    deleteBtn.disabled = false;
                }
                return;
            }

            if (toggleBtn) {
                const isPublished = toggleBtn.dataset.reviewPublished === "1";
                toggleBtn.disabled = true;
                try {
                    await ownerRequest(`/reviews/${encodeURIComponent(reviewId)}/visibility?source=${encodeURIComponent(source || "public")}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ is_published: !isPublished })
                    });
                    await loadAdminReviews();
                } catch (error) {
                    alert(error.message || "Unable to update review visibility.");
                } finally {
                    toggleBtn.disabled = false;
                }
            }
        });
    }

    await loadAdminReviews();
}

document.addEventListener("DOMContentLoaded", async () => {
    bindLogoutButton();
    bindSidebarToggle();

    if (document.body.dataset.page === "dashboard") {
        bindDashboardSearch();
        bindWeeklyRangeSelector();
        bindDashboardPopups();
        await loadDashboard();
        window.setTimeout(() => {
            showDashboardToast("Dashboard synced successfully.");
        }, 650);
    }

    if (document.body.dataset.page === "bookings") {
        bindBookingInventoryModal();
        bindBookingDateFilters();
        await loadBookingsTable();
    }

    if (document.body.dataset.page === "decorations") {
        bindAddDecorationForm();
        bindDecorationFilters();
        setDecorationFormMode("add");
        await loadDecorationsTable();
    }

    if (document.body.dataset.page === "inventory") {
        bindInventoryForm();
        bindInventoryFilterEvents();
        await loadInventoryPage();
    }

    if (document.body.dataset.page === "bookings-calendar") {
        await loadBookingsCalendarPage();
    }

    if (document.body.dataset.page === "inventory-usage-report") {
        await loadInventoryUsageReportPage();
    }
    if (document.body.dataset.page === "payments") {
        const owner = await ensureOwnerSession();
        if (!owner) return;
        setOwnerIdentity(owner.ownerEmail || "owner");
        bindPaymentDashboardActions();
        await loadManagePayments();
        await loadPendingPayments();
    }
    if (document.body.dataset.page === "reviews") {
        await loadAdminReviewsPage();
    }
});





