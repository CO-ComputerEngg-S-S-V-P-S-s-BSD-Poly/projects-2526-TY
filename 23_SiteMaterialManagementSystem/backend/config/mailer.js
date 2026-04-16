const nodemailer = require('nodemailer');

let transporter = null;
let emailEnabled = false;

// Only create transporter if real credentials are provided
if (
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS &&
  process.env.EMAIL_USER !== 'your_company_email@gmail.com' &&
  process.env.EMAIL_PASS !== 'your_gmail_app_password'
) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  emailEnabled = true;
}

// ─── Send Credentials Email ───────────────────────────────────────────────────
const sendCredentialsEmail = async ({ toEmail, supervisorName, loginUsername, loginPassword }) => {
  if (!emailEnabled || !transporter) {
    console.log('⚠️ Email sending is disabled (no valid EMAIL_USER/EMAIL_PASS configured).');
    console.log(`📋 Credentials for ${supervisorName}: Username=${loginUsername}, Password=${loginPassword}`);
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: '🏗️ Padmashree Builders — Your Login Credentials',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
          .wrapper { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #f97316, #ea580c); padding: 36px 32px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 26px; letter-spacing: -0.5px; }
          .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
          .body { padding: 36px 32px; }
          .greeting { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 12px; }
          .message { font-size: 14px; color: #64748b; line-height: 1.7; margin-bottom: 28px; }
          .creds-box { background: #f8fafc; border: 2px solid #f97316; border-radius: 10px; padding: 24px; margin-bottom: 28px; }
          .creds-box h3 { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin: 0 0 16px; }
          .cred-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
          .cred-row:last-child { margin-bottom: 0; }
          .cred-label { font-size: 12px; color: #94a3b8; font-weight: 600; width: 80px; flex-shrink: 0; }
          .cred-value { font-size: 18px; font-weight: 800; color: #1e293b; background: #e2e8f0; padding: 8px 16px; border-radius: 8px; letter-spacing: 1px; flex: 1; }
          .warning { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 14px 18px; font-size: 13px; color: #c2410c; margin-bottom: 24px; }
          .warning strong { display: block; margin-bottom: 4px; }
          .btn { display: block; background: linear-gradient(135deg, #f97316, #ea580c); color: white; text-align: center; padding: 14px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; margin-bottom: 28px; }
          .footer { border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>🏗️ Padmashree Builders</h1>
            <p>Site Material Management System</p>
          </div>
          <div class="body">
            <div class="greeting">Hello, ${supervisorName}! 👋</div>
            <div class="message">
              Thank you for registering on the <strong>Padmashree Builders Site Material Management System</strong>.<br/>
              Your account has been created. Below are your unique login credentials — please keep them safe.
            </div>

            <div class="creds-box">
              <h3>Your Login Credentials</h3>
              <div class="cred-row">
                <span class="cred-label">Username</span>
                <span class="cred-value">${loginUsername}</span>
              </div>
              <div class="cred-row">
                <span class="cred-label">Password</span>
                <span class="cred-value">${loginPassword}</span>
              </div>
            </div>

            <div class="warning">
              <strong>⚠️ Important — Keep this confidential</strong>
              Do not share these credentials with anyone. This login is exclusively for your use.
            </div>

            <a href="http://localhost:3000/login" class="btn">→ Login to Dashboard</a>

            <div class="message">
              After logging in, you will be asked to select your assigned site before accessing the dashboard.
            </div>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Padmashree Builders — ISO 9001:2015 Certified<br/>
            This is an automated email. Please do not reply.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Credentials email sent to ${toEmail}`);
  } catch (error) {
    console.error('⚠️ Failed to send email:', error.message);
    console.log(`📋 Credentials for ${supervisorName}: Username=${loginUsername}, Password=${loginPassword}`);
  }
};

module.exports = { sendCredentialsEmail };
