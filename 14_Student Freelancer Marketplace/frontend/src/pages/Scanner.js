import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";

const Scanner = () => {
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    // १. स्कॅनर कॉन्फिगरेशन
    const scanner = new Html5QrcodeScanner("reader", { 
      fps: 15, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    });

    scanner.render(
      (result) => {
        setScanResult(result);
        scanner.clear();
      },
      (error) => {
        // चुकांकडे दुर्लक्ष करा
      }
    );

    return () => scanner.clear().catch(err => console.error("Scanner Error", err));
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>QR Scanner</h1>
        <p style={styles.subTitle}>Scan QR for Payments or Profile Verification</p>

        {/* २. स्कॅनर बॉक्स - ग्लास लुक सह */}
        <div style={styles.scannerWrapper}>
          {!scanResult ? (
            <div id="reader" style={styles.reader}></div>
          ) : (
            <div style={styles.resultCard}>
              <h2 style={{color: '#00ff00'}}>✅ Scan Successful!</h2>
              <p style={styles.resultText}>{scanResult}</p>
              <button onClick={() => window.location.reload()} style={styles.rescanBtn}>Scan Again</button>
            </div>
          )}
        </div>

        <div style={styles.infoText}>
          <p>Please allow camera access to start scanning</p>
        </div>
      </div>
    </div>
  );
};

// ३. प्रीमियम स्टाइल्स
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  overlay: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '40px',
    borderRadius: '30px',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
  },
  title: { fontSize: '32px', color: '#00d2ff', marginBottom: '10px' },
  subTitle: { color: '#888', marginBottom: '30px' },
  scannerWrapper: {
    background: '#fff', 
    borderRadius: '20px', 
    overflow: 'hidden',
    border: '4px solid #00d2ff', // सायन बॉर्डर
    boxShadow: '0 0 20px rgba(0, 210, 255, 0.4)'
  },
  reader: { width: '100%' },
  resultCard: { padding: '40px', background: '#111', color: '#fff' },
  resultText: { fontSize: '18px', margin: '20px 0', wordBreak: 'break-all' },
  rescanBtn: { background: '#00d2ff', border: 'none', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  infoText: { marginTop: '20px', color: '#555', fontSize: '14px' }
};

export default Scanner;
