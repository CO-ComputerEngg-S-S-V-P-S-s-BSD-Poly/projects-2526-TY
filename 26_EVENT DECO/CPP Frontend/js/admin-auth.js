const API_HOST = window.location.hostname || "localhost";
const OWNER_API_BASE = `http://${API_HOST}:5000/api/private/owner`;

async function ownerRequest(path, options = {}) {
    const response = await fetch(`${OWNER_API_BASE}${path}`, {
        credentials: "include",
        ...options
    });

    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const message = typeof body === "string"
            ? body
            : body.message || "Request failed";
        throw new Error(message);
    }

    return body;
}

async function ensureOwnerSession() {
    try {
        return await ownerRequest("/auth/me");
    } catch (error) {
        window.location.href = "admin-login.html";
        return null;
    }
}

async function loginOwner(payload) {
    return ownerRequest("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
}

async function logoutOwner() {
    await ownerRequest("/auth/logout", { method: "POST" });
    window.location.href = "admin-login.html";
}
