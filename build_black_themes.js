/**
 * MindNext Black Background & Clean Theme Builder
 * 
 * Rebuilds all 4 portals (marketing, admin, emails, fastshare) with:
 * - Proper Sleek Black Canvas (#06080e / #07090e)
 * - Deep dark cards (#0e121c / #111625) with subtle borders (#1e2436)
 * - High-contrast crisp typography (Outfit + Plus Jakarta Sans + JetBrains Mono)
 * - White brand logo (images/mindnext-logo-white.png)
 * - REMOVAL of extra symbols, oversized icons, and cluttering emojis from card titles & labels
 * - Live MongoDB Database status pill (DB: Connected) across all portals
 * - Full synchronization across root and subfolder mirrors
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = __dirname;
console.log('🚀 Rebuilding MindNext portals with clean Black Theme & no unwanted symbols...');

// 1. Shared Modern Typography
const SHARED_FONTS = `
  <!-- Google Fonts: Outfit (Display) + Plus Jakarta Sans (UI) + JetBrains Mono (Code) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
`;

// Shared DB Status Pill HTML
const DB_PILL_HTML = `
        <div class="db-pill" id="dbStatusPill" title="MongoDB Connection Status">
          <span class="db-dot"></span>
          <span id="dbStatusText">MongoDB: Connected</span>
        </div>`;

// Shared DB Status CSS
const DB_PILL_CSS = `
    /* MongoDB Live Connection Pill */
    .db-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 5px 12px;
      border-radius: 9999px;
      font-size: 0.76rem;
      font-weight: 600;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      font-family: var(--font-mono, 'JetBrains Mono', monospace);
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .db-pill.standby {
      background: rgba(245, 158, 11, 0.12);
      border-color: rgba(245, 158, 11, 0.3);
      color: #fbbf24;
    }
    .db-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
      animation: dbPulse 2s infinite ease-in-out;
    }
    .db-pill.standby .db-dot {
      background: #f59e0b;
      box-shadow: 0 0 8px #f59e0b;
      animation: none;
    }
    @keyframes dbPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
`;

// Shared DB Polling Script
const DB_POLL_SCRIPT = `
    // --- MONGODB CONNECTION TRACKER ---
    async function checkMongoConnection() {
      var dbPill = document.getElementById('dbStatusPill');
      var dbText = document.getElementById('dbStatusText');
      if (!dbText) return;
      try {
        var res = await fetch('http://localhost:3001/api/db/status');
        if (res.ok) {
          var data = await res.json();
          if (data.connected) {
            dbText.textContent = 'MongoDB: Connected (' + (data.dbName || 'mindnext') + ')';
            if (dbPill) {
              dbPill.className = 'db-pill';
              dbPill.title = 'MongoDB Server: ' + data.host + ':' + data.port + ' | Database: ' + data.dbName;
            }
          } else {
            dbText.textContent = 'DB: Hybrid Local Mode';
            if (dbPill) {
              dbPill.className = 'db-pill standby';
              dbPill.title = 'Local JSON database active (MongoDB standby)';
            }
          }
        }
      } catch (e) {
        dbText.textContent = 'DB: Hybrid Ready';
      }
    }
    setInterval(checkMongoConnection, 8000);
    setTimeout(checkMongoConnection, 1000);
`;

// ====================================================================
// 1. MARKETING PORTAL
// ====================================================================
function processMarketing() {
  console.log('Processing marketing.html...');
  let html = execSync('git show 8f29c6f:marketing.html', { encoding: 'utf8' });

  // Update Fonts
  html = html.replace(/<link[^>]*fonts\.googleapis\.com\/css2[^>]*>/, SHARED_FONTS.trim());

  // Logo: ensure white logo
  html = html.replace(/images\/mindnext-logo\.png/g, 'images/mindnext-logo-white.png');

  // Strip SVGs from card titles (no oversized icons!)
  html = html.replace(/<div class="card-title">([\s\S]*?)<\/div>/g, (m, inner) => {
    let clean = inner.replace(/<svg[\s\S]*?<\/svg>/g, '').trim();
    return '<div class="card-title">' + clean + '</div>';
  });

  // Clean clutter emojis from labels, buttons & badges
  html = html.replace(/🌅\s*શરૂઆત સમય/g, 'શરૂઆત સમય');
  html = html.replace(/🌙\s*સમાપ્તિ સમય/g, 'સમાપ્તિ સમય');
  html = html.replace(/🟢\s*Active SIM/g, 'Active SIM');
  html = html.replace(/📱\s*મોકલનાર/g, 'મોકલનાર');
  html = html.replace(/📅\s*અભિયાન શરૂ તારીખ/g, 'અભિયાન શરૂ તારીખ');
  html = html.replace(/🏁\s*કઈ તારીખ સુધી/g, 'કઈ તારીખ સુધી');
  html = html.replace(/🏁\s*ક્રોન નિર્ધારિત તારીખ/g, 'ક્રોન નિર્ધારિત તારીખ');
  html = html.replace(/🎯\s*દૈનિક મેસેજ ટાર્ગેટ/g, 'દૈનિક મેસેજ ટાર્ગેટ');
  html = html.replace(/⏭️\s*સ્કીપ/g, 'સ્કીપ');
  html = html.replace(/🧪\s*ટેસ્ટ ૧ મેસેજ/g, 'ટેસ્ટ ૧ મેસેજ');
  html = html.replace(/🟢\s*Zero-Tab Active/g, 'Zero-Tab Active');
  html = html.replace(/⚡\s*બેકગ્રાઉન્ડ સર્વર/g, 'બેકગ્રાઉન્ડ સર્વર');
  html = html.replace(/🌐\s*Meta WhatsApp/g, 'Meta WhatsApp');
  html = html.replace(/🧪\s*ડેમો સિમ્યુલેશન/g, 'ડેમો સિમ્યુલેશન');
  html = html.replace(/📲\s*WhatsApp Web/g, 'WhatsApp Web');
  html = html.replace(/📲\s*QR સ્કેન/g, 'QR સ્કેન');
  html = html.replace(/📡\s*Ping Test/g, 'Ping Test');
  html = html.replace(/💡\s*<em>/g, '<em>');

  // Enhance CSS root variables for pure black background & inject safety rules
  const cssInjection = `
    :root {
      --bg-dark: #06080e;
      --bg-app: #06080e;
      --bg-card: #0e121c;
      --bg-card-subtle: #141926;
      --bg-input: #080c14;
      --border-color: #1e2436;
      --border-light: rgba(255, 255, 255, 0.08);
      --border-focus: #10b981;

      --wa-green: #10b981;
      --wa-green-dark: #059669;
      --wa-green-light: #34d399;
      --wa-glow: rgba(16, 185, 129, 0.25);

      --accent-violet: #8b5cf6;
      --accent-cyan: #06b6d4;
      --accent-emerald: #10b981;
      --accent-amber: #f59e0b;
      --accent-rose: #f43f5e;

      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;

      --font-display: 'Outfit', sans-serif;
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    /* Prevent any oversized symbols in card headers */
    .card-title svg {
      display: none !important;
    }

    /* Clean Card Title Typography */
    .card-title {
      font-family: var(--font-display, 'Outfit', sans-serif);
      font-size: 1.05rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #f8fafc;
    }

    ${DB_PILL_CSS}
  `;

  // Replace :root block with updated black theme
  html = html.replace(/:root\s*\{[\s\S]*?--font-mono:\s*'JetBrains Mono',\s*monospace;\s*\}/, cssInjection.trim());

  // Update navigation actions to include Home, Emails, FastShare, Admin, DB Pill, Lock
  const navActions = `<div class="nav-actions">
        <a href="/" class="nav-link-btn" title="MindNext Home">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Home
        </a>
        <a href="/emails" class="nav-link-btn" title="Email Management Suite">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Emails
        </a>
        <a href="/fastshare" class="nav-link-btn" title="Secure FastShare Portal">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          FastShare
        </a>
        <a href="/admin" class="nav-link-btn" title="Executive Admin Portal">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Admin
        </a>
        ${DB_PILL_HTML}
        <button class="nav-link-btn" onclick="lockMarketingPortal()" title="Lock Portal" style="color: var(--accent-rose); border-color: rgba(244, 63, 94, 0.3);">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Lock
        </button>
      </div>`;

  html = html.replace(/<div class="nav-actions">[\s\S]*?<\/div>/, navActions);

  // Add DB Polling script before </script>
  if (!html.includes('checkMongoConnection')) {
    html = html.replace(/<\/script>\s*<\/body>/i, DB_POLL_SCRIPT + '\n  </script>\n</body>');
  }

  // Save to marketing.html and marketing/index.html
  fs.writeFileSync(path.join(ROOT_DIR, 'marketing.html'), html, 'utf8');
  const dir = path.join(ROOT_DIR, 'marketing');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log('✅ marketing.html and marketing/index.html updated successfully.');
}

// ====================================================================
// 2. ADMIN PORTAL
// ====================================================================
function processAdmin() {
  console.log('Processing admin.html...');
  let html = execSync('git show 8f29c6f:admin.html', { encoding: 'utf8' });

  // Update Fonts
  html = html.replace(/<link[^>]*fonts\.googleapis\.com\/css2[^>]*>/, SHARED_FONTS.trim());

  // Logo: ensure white logo
  html = html.replace(/images\/mindnext-logo\.png/g, 'images/mindnext-logo-white.png');

  // Enhance CSS root & DB pill styles
  const adminCssInjection = `
    :root {
      --bg-base: #06080e;
      --bg-surface: #0b0f19;
      --bg-card: #0e121c;
      --bg-card-hover: #151b2a;
      --bg-input: #080c14;
      --border-subtle: #1e293b;
      --border-light: rgba(255, 255, 255, 0.08);
      --border-focus: #10b981;

      --accent-violet: #8b5cf6;
      --accent-violet-dark: #6d28d9;
      --accent-cyan: #06b6d4;
      --accent-emerald: #10b981;
      --accent-amber: #f59e0b;
      --accent-rose: #f43f5e;

      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;

      --font-display: 'Outfit', sans-serif;
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    ${DB_PILL_CSS}
  `;

  html = html.replace(/:root\s*\{[\s\S]*?--font-sans:\s*'Plus Jakarta Sans'[^;]*;\s*\}/, adminCssInjection.trim());

  // Add DB pill and navigation links to admin header actions
  const adminHeaderNav = `
        <a href="/marketing" class="btn btn-outline btn-sm" title="WhatsApp Marketing Engine">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          Marketing
        </a>

        <a href="/emails" class="btn btn-outline btn-sm" title="Open Enterprise Email Campaign Manager">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Email Portal
        </a>

        <a href="/fastshare" class="btn btn-outline btn-sm" title="FastShare Portal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          FastShare
        </a>

        ${DB_PILL_HTML}
`;

  // Inject navigation inside .header-actions before lock button
  html = html.replace(/(<button class="lock-trigger-btn")/i, adminHeaderNav + '\n        $1');

  // Add DB Polling script before </script>
  if (!html.includes('checkMongoConnection')) {
    html = html.replace(/<\/script>\s*<\/body>/i, DB_POLL_SCRIPT + '\n  </script>\n</body>');
  }

  // Save to admin.html and admin/index.html
  fs.writeFileSync(path.join(ROOT_DIR, 'admin.html'), html, 'utf8');
  const dir = path.join(ROOT_DIR, 'admin');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log('✅ admin.html and admin/index.html updated successfully.');
}

// ====================================================================
// 3. EMAILS PORTAL
// ====================================================================
function processEmails() {
  console.log('Processing emails.html...');
  let html = execSync('git show 8f29c6f:emails.html', { encoding: 'utf8' });

  // Update Fonts
  html = html.replace(/<link[^>]*fonts\.googleapis\.com\/css2[^>]*>/, SHARED_FONTS.trim());

  // Logo: ensure white logo
  html = html.replace(/images\/mindnext-logo\.png/g, 'images/mindnext-logo-white.png');

  // Enhance CSS root & DB pill styles
  const emailsCssInjection = `
  :root {
    --bg-dark: #06080e;
    --bg-card: #0e121c;
    --bg-card-subtle: #141926;
    --bg-input: #080c14;
    --border-color: #1e2436;
    --border-focus: #8b5cf6;
    --border-light: rgba(255, 255, 255, 0.08);

    --accent-emerald: #10b981;
    --accent-indigo: #6366f1;
    --accent-violet: #8b5cf6;
    --accent-cyan: #06b6d4;
    --accent-amber: #f59e0b;
    --accent-rose: #f43f5e;

    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;

    --font-display: 'Outfit', sans-serif;
    --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  ${DB_PILL_CSS}
  `;

  html = html.replace(/:root\s*\{[\s\S]*?--font-sans:[^;]*;\s*\}/, emailsCssInjection.trim());

  // Add DB pill and navigation links into .header-actions
  const emailsNavLinks = `
      <a href="/marketing" class="btn btn-outline btn-sm" title="WhatsApp Marketing Engine">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        Marketing
      </a>

      <a href="/fastshare" class="btn btn-outline btn-sm" title="FastShare Portal">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
        FastShare
      </a>

      <a href="/admin" class="btn btn-outline btn-sm" title="Admin Portal">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        Admin
      </a>

      ${DB_PILL_HTML}
`;

  html = html.replace(/(<div class="header-actions">)/i, '$1' + emailsNavLinks);

  // Add DB Polling script before </script>
  if (!html.includes('checkMongoConnection')) {
    html = html.replace(/<\/script>\s*<\/body>/i, DB_POLL_SCRIPT + '\n  </script>\n</body>');
  }

  // Save to emails.html, emails/index.html, email/index.html, and email-verifier.html
  fs.writeFileSync(path.join(ROOT_DIR, 'emails.html'), html, 'utf8');
  fs.writeFileSync(path.join(ROOT_DIR, 'email-verifier.html'), html, 'utf8');

  const emailsDir = path.join(ROOT_DIR, 'emails');
  if (!fs.existsSync(emailsDir)) fs.mkdirSync(emailsDir, { recursive: true });
  fs.writeFileSync(path.join(emailsDir, 'index.html'), html, 'utf8');

  const emailDir = path.join(ROOT_DIR, 'email');
  if (!fs.existsSync(emailDir)) fs.mkdirSync(emailDir, { recursive: true });
  fs.writeFileSync(path.join(emailDir, 'index.html'), html, 'utf8');

  console.log('✅ emails.html, email-verifier.html, emails/index.html, and email/index.html updated successfully.');
}

// ====================================================================
// 4. FASTSHARE PORTAL
// ====================================================================
function processFastshare() {
  console.log('Processing fastshare.html...');
  let html = execSync('git show 8f29c6f:fastshare.html', { encoding: 'utf8' });

  // Update Fonts
  html = html.replace(/<link[^>]*fonts\.googleapis\.com\/css2[^>]*>/, SHARED_FONTS.trim());

  // Logo: ensure white logo
  html = html.replace(/images\/mindnext-logo\.png/g, 'images/mindnext-logo-white.png');

  // Enhance CSS root & DB pill styles
  const fastshareCssInjection = `
  :root {
    --bg-dark: #06080e;
    --bg-card: #0e121c;
    --bg-card-subtle: #141926;
    --bg-card-hover: #151b2a;
    --bg-input: #080c14;
    --border-color: #1e2436;
    --border-light: rgba(255, 255, 255, 0.08);
    --border-focus: #06b6d4;

    --brand-cyan: #06b6d4;
    --brand-indigo: #6366f1;
    --brand-violet: #8b5cf6;
    --brand-emerald: #10b981;

    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;

    --font-display: 'Outfit', sans-serif;
    --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  ${DB_PILL_CSS}
  `;

  html = html.replace(/:root\s*\{[\s\S]*?\}/, fastshareCssInjection.trim());

  // Add DB pill and navigation links into fastshare header actions
  const fastshareNavLinks = `
        <a href="/" class="btn-header-action" style="text-decoration: none;" title="MindNext Home">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Home</span>
        </a>

        <a href="/marketing" class="btn-header-action" style="text-decoration: none;" title="Marketing Portal">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span>Marketing</span>
        </a>

        <a href="/emails" class="btn-header-action" style="text-decoration: none;" title="Emails Portal">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span>Emails</span>
        </a>

        <a href="/admin" class="btn-header-action" style="text-decoration: none;" title="Admin CRM">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Admin</span>
        </a>

        ${DB_PILL_HTML}
`;

  html = html.replace(/(<div class="header-actions">)/i, '$1' + fastshareNavLinks);

  // Add DB Polling script before </script>
  if (!html.includes('checkMongoConnection')) {
    html = html.replace(/<\/script>\s*<\/body>/i, DB_POLL_SCRIPT + '\n  </script>\n</body>');
  }

  // Save to fastshare.html and fastshare/index.html
  fs.writeFileSync(path.join(ROOT_DIR, 'fastshare.html'), html, 'utf8');
  const dir = path.join(ROOT_DIR, 'fastshare');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log('✅ fastshare.html and fastshare/index.html updated successfully.');
}

// RUN ALL UPDATES
try {
  processMarketing();
  processAdmin();
  processEmails();
  processFastshare();
  console.log('\n🎉 ALL PORTALS SUCCESSFULLY REBUILT IN CLEAN SLEEK BLACK THEME!');
} catch (err) {
  console.error('Error rebuilding portals:', err);
  process.exit(1);
}
