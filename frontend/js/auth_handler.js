// --- AUTHENTICATION HANDLER ---

// 1. SIGNUP LOGIC
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // UI Feedback: बटण डिसेबल करा
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Processing...`;

    const role = document.getElementById('role').value;
    const payload = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        role: role,
        collegeId: role === 'student' ? document.getElementById('collegeId').value : "ADMIN",
        department: role === 'student' ? document.getElementById('department').value : "ADMIN"
    };

    try {
        const response = await fetch('http://localhost:5000/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Registration Successful! Redirecting to Login...");
            window.location.href = 'index.html'; 
        } else {
            alert("Error: " + result.message);
            // एरर आल्यास बटण पुन्हा नॉर्मल करा
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    } catch (err) {
        alert("Server not responding. Make sure server.js is running!");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});

// 2. LOGIN LOGIC
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Advanced UI: 'is-loading' क्लास ॲड करणे (जे आपण index.html मध्ये डिफाइन केले आहे)
    const loginBtn = document.getElementById('loginBtn');
    if(loginBtn) loginBtn.classList.add('is-loading');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        if (response.ok) {
            // Save User Session
            localStorage.setItem('user', JSON.stringify(result.user));
            
            // --- महत्त्वाचा बदल: Redirect Path ---
            if (result.user.role === 'student') {
                window.location.href = 'student/dashboard.html';
            } else {
                window.location.href = 'organizer/dashboard.html';
            }
        } else {
            // लॉगिन फेल झाल्यास लोडर थांबवा
            if(loginBtn) loginBtn.classList.remove('is-loading');
            alert("Login Failed: " + result.message);
        }
    } catch (err) {
        if(loginBtn) loginBtn.classList.remove('is-loading');
        alert("Connection Error. Is your Backend Server ON?");
    }
});

// 3. LOGOUT LOGIC (Global Function)
window.logout = function() {
    console.log("Logging out..."); 
    
    // युजरला विचारून लॉगआउट करणे (Professional Touch)
    if(confirm("Are you sure you want to logout?")) {
        localStorage.removeItem('user');
        localStorage.clear();
        
        // डॅशबोर्ड फोल्डरमधून बाहेर पडण्यासाठी '../' वापरलं आहे
        window.location.replace('../index.html'); 
    }
};