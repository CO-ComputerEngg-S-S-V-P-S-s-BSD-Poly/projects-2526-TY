// Geofence Handler (Frontend Logic) - FIXED VERSION
let currentLat = null, currentLng = null;

function startLocationTracking() {
    const statusBox = document.getElementById('statusBox');
    const verifyBtn = document.getElementById('verifyBtn');

    if (!navigator.geolocation) {
        statusBox.className = "alert alert-danger";
        statusBox.innerText = "Geolocation not supported by your browser.";
        return;
    }

    // watchPosition सतत लोकेशन अपडेट ठेवते, जे चांगलं आहे
    navigator.geolocation.watchPosition(
        (position) => {
            currentLat = position.coords.latitude;
            currentLng = position.coords.longitude;
            
            if(document.getElementById('coords')) {
                document.getElementById('coords').innerText = `${currentLat.toFixed(5)}, ${currentLng.toFixed(5)}`;
            }
            
            statusBox.className = "alert alert-success py-3";
            statusBox.innerHTML = "<i class='fas fa-check-circle me-2'></i> Location Secured. You can now verify.";
            verifyBtn.disabled = false;
        },
        (error) => {
            statusBox.className = "alert alert-danger py-3";
            statusBox.innerText = "Error: " + error.message + ". Please enable GPS.";
        },
        { 
            enableHighAccuracy: true, // अचूक लोकेशनसाठी महत्त्वाचे
            maximumAge: 0, 
            timeout: 5000 
        }
    );
}

async function processAttendance() {
    const user = JSON.parse(localStorage.getItem('user'));
    const urlParams = new URLSearchParams(window.location.search);
    
    // --- बदल १: eventId ला Number मध्ये कन्व्हर्ट करणे ---
    const eventId = urlParams.get('id');

    const statusBox = document.getElementById('statusBox');
    
    // सुरक्षा तपासणी
    if (!currentLat || !currentLng) {
        alert("Waiting for accurate GPS signal. Please wait a moment.");
        return;
    }

    statusBox.innerHTML = "<i class='fas fa-sync fa-spin me-2'></i> Finalizing with Server...";

    try {
        const response = await fetch('http://localhost:5000/api/mark-attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentEmail: user.email,
                // --- बदल २: बॅकएंडला नंबर फॉरमॅटमध्ये डेटा पाठवणे ---
                eventId: Number(eventId), 
                studentLat: parseFloat(currentLat),
                studentLng: parseFloat(currentLng)
            })
        });

        const result = await response.json();

        if (response.ok) {
            statusBox.className = "alert alert-success py-3";
            statusBox.innerHTML = `<h4>SUCCESS!</h4><p>${result.message}</p>`;
            // ३ सेकंदानंतर डॅशबोर्डवर पाठवणे (history.html नसेल तर dashboard.html करा)
            setTimeout(() => window.location.href = 'dashboard.html', 3000);
        } else {
            statusBox.className = "alert alert-danger py-3";
            // सर्वरने पाठवलेला रिजेक्शन मेसेज (उदा. "You are 200m away") इथे दिसेल
            statusBox.innerHTML = `<h4>REJECTED!</h4><p>${result.message}</p>`;
        }
    } catch (err) {
        statusBox.className = "alert alert-danger py-3";
        statusBox.innerText = "Server Connection Failed! Is server.js running?";
        console.error(err);
    }
}