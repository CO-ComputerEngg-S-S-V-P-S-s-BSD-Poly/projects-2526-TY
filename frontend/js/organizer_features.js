// Organizer Logic - Create, Start, Stop & Monitor
const user = JSON.parse(localStorage.getItem('user'));

document.getElementById('eventForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        id: "EVT-" + Date.now(),
        name: document.getElementById('eventName').value,
        lat: parseFloat(document.getElementById('lat').value),
        lng: parseFloat(document.getElementById('lng').value),
        radius: parseInt(document.getElementById('radius').value),
        window: parseInt(document.getElementById('window').value),
        description: document.getElementById('desc').value,
        organizerEmail: user.email,
        status: 'upcoming' // Initial status (Phase 2.4)
    };

    const res = await fetch('http://localhost:5000/api/create-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if(res.ok) {
        alert("Event Successfully Created!");
        window.location.href = 'dashboard.html';
    }
});

// Update Event Status (Start/Stop Attendance - Phase 2.7, 2.8)
async function updateStatus(eventId, newStatus) {
    await fetch('http://localhost:5000/api/update-event-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, status: newStatus })
    });
    location.reload();
}