/**
 * Student Advanced Features Logic
 * Covers: Attendance History, Percentage Calculation, and Certificate Eligibility
 */

const user = JSON.parse(localStorage.getItem('user'));

// 1. Load Attendance History (Phase 3.2)
async function loadStudentHistory() {
    try {
        const response = await fetch(`http://localhost:5000/api/full-report`);
        const allData = await response.json();

        // फक्त या विद्यार्थ्याचा डेटा फिल्टर करा
        const studentData = allData.filter(record => record.studentEmail === user.email);
        
        const tbody = document.getElementById('historyTableBody');
        if (studentData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No attendance records found.</td></tr>`;
        } else {
            tbody.innerHTML = studentData.map(record => `
                <tr>
                    <td>${record.eventName}</td>
                    <td>${new Date(record.time).toLocaleString()}</td>
                    <td>${record.distance} meters</td>
                    <td><span class="badge-custom ${record.status.includes('Present') ? 'badge-present' : 'badge-violation'}">${record.status}</span></td>
                </tr>
            `).join('');
        }

        // Percentage अपडेट करा (Phase 3.3)
        updatePercentage(studentData.length);
    } catch (err) {
        console.error("Error loading history:", err);
    }
}

// 2. Attendance Percentage Auto Calculation (Phase 3.3)
async function updatePercentage(attendedCount) {
    try {
        const res = await fetch(`http://localhost:5000/api/events`);
        const events = await res.json();
        
        // फक्त Active किंवा Completed इव्हेंट्स मोजा
        const totalEvents = events.filter(e => e.status !== 'upcoming').length;
        
        const percentage = totalEvents > 0 ? (attendedCount / totalEvents) * 100 : 0;
        
        const percentDisplay = document.getElementById('attendancePercentage');
        if (percentDisplay) {
            percentDisplay.innerText = `${percentage.toFixed(1)}%`;
        }
        
        return percentage;
    } catch (err) {
        console.error("Error calculating percentage:", err);
    }
}

// 3. Certificate Eligibility Check (Phase 3.4)
async function checkCertificateEligibility() {
    if (!user) return;
    document.getElementById('studentName').innerText = user.name;

    try {
        const res = await fetch(`http://localhost:5000/api/student-stats?email=${user.email}`);
        const stats = await res.json();
        
        const percentage = stats.totalEvents > 0 ? (stats.attended / stats.totalEvents) * 100 : 0;
        
        const lockOverlay = document.getElementById('lockOverlay');
        const downloadBtn = document.getElementById('downloadPdf');

        if (percentage >= 75) {
            // Eligible (Phase 3.4)
            lockOverlay.style.display = 'none';
            downloadBtn.disabled = false;
        } else {
            // Not Eligible
            lockOverlay.style.display = 'flex';
            downloadBtn.disabled = true;
        }
    } catch (err) {
        console.error("Error checking eligibility:", err);
    }
}

// PDF Download Logic (Simple Print as PDF)
document.getElementById('downloadPdf')?.addEventListener('click', () => {
    window.print();
});