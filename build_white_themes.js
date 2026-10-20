/**
 * MindNext Vibrant SaaS Color Combination & UI/UX Redesign
 * Transforms all portals into stunning, colorful, modern SaaS applications:
 * - Rich mesh gradient canvas (#F3F5FA with multi-color radial ambient glows)
 * - Distinct, vibrant color-coded cards & KPIs (Indigo, Emerald, Cyan, Amber, Rose, Violet)
 * - Colorful navigation pills and status badges
 * - Gradient action buttons and icon containers
 * - Full MongoDB live database status integration
 * - Mobile/Tablet/Desktop responsive layouts
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
console.log('🎨 Upgrading MindNext portals with rich, vibrant color combinations...');

// ====================================================================
// SHARED HEAD FONT TAG
// ====================================================================
const SHARED_FONTS = `
  <!-- Google Fonts: Outfit (Display) + Plus Jakarta Sans (UI) + JetBrains Mono (Code) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
`;

// ====================================================================
// 1. MARKETING.HTML VIBRANT THEME
// ====================================================================
function upgradeMarketing() {
  const filePath = path.join(ROOT_DIR, 'marketing.html');
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf-8');

  // Update Fonts
  html = html.replace(/<link[^>]*fonts\.googleapis\.com\/css2\?family=[^>]*>/i, SHARED_FONTS.trim());

  // Logo update
  html = html.replace(/images\/mindnext-logo-white\.png/g, 'images/mindnext-logo.png');

  // Vibrant Multi-color CSS for Marketing Portal
  const marketingVibrantCss = `  <style>
    :root {
      --bg-app: #f4f6fb;
      --bg-card: #ffffff;
      --bg-card-subtle: #f8fafc;
      --bg-input: #ffffff;
      --border-color: #e2e8f0;
      --border-focus: #10b981;

      --wa-green: #10b981;
      --wa-green-dark: #059669;
      --wa-green-light: #34d399;
      --wa-glow: rgba(16, 185, 129, 0.25);

      --color-indigo: #4f46e5;
      --color-indigo-light: #eef2ff;
      --color-violet: #7c3aed;
      --color-violet-light: #f5f3ff;
      --color-cyan: #0284c7;
      --color-cyan-light: #f0f9ff;
      --color-emerald: #059669;
      --color-emerald-light: #ecfdf5;
      --color-amber: #d97706;
      --color-amber-light: #fffbeb;
      --color-rose: #e11d48;
      --color-rose-light: #fff1f2;

      --text-primary: #0f172a;
      --text-secondary: #334155;
      --text-muted: #64748b;

      --font-display: 'Outfit', sans-serif;
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;

      --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04);
      --shadow-lg: 0 12px 28px -5px rgba(15, 23, 42, 0.09), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
      --shadow-xl: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
    }

    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background-color: var(--bg-app);
      color: var(--text-primary);
      font-family: var(--font-sans);
      line-height: 1.6;
      min-height: 100vh;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
    }

    /* Multi-color Ambient Mesh Glow */
    .bg-glow {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      background:
        radial-gradient(circle at 10% 12%, rgba(16, 185, 129, 0.08) 0%, transparent 450px),
        radial-gradient(circle at 90% 18%, rgba(99, 102, 241, 0.09) 0%, transparent 450px),
        radial-gradient(circle at 50% 85%, rgba(2, 132, 199, 0.07) 0%, transparent 500px),
        radial-gradient(circle at 80% 55%, rgba(244, 63, 94, 0.05) 0%, transparent 400px);
    }

    .container {
      max-width: 1360px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1;
      width: 100%;
    }

    /* Lock Screen Overlay */
    .lock-screen-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .lock-screen-overlay.unlocked {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .lock-container {
      width: 100%;
      max-width: 440px;
      background: #ffffff;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-xl);
      border-radius: 20px;
      padding: 40px 32px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .lock-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #10b981, #6366f1, #0284c7, #f59e0b);
    }

    .lock-brand-img {
      height: 44px;
      max-width: 190px;
      width: auto;
      margin: 0 auto 18px;
      display: block;
      object-fit: contain;
    }

    .lock-title {
      font-family: var(--font-display);
      font-size: 1.45rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
    }

    .lock-subtitle {
      font-size: 0.85rem;
      color: #059669;
      font-weight: 600;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .passcode-input-wrap {
      position: relative;
      margin-bottom: 16px;
    }

    .passcode-input {
      width: 100%;
      padding: 13px 44px 13px 16px;
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      color: #0f172a;
      font-size: 1rem;
      outline: none;
      transition: all 0.2s ease;
      letter-spacing: 2px;
    }

    .passcode-input:focus {
      border-color: #10b981;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
    }

    .toggle-pass-eye {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 6px;
      display: flex;
    }

    .btn-unlock-portal {
      width: 100%;
      padding: 13px;
      border-radius: 12px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border: none;
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
      transition: all 0.2s;
    }

    .btn-unlock-portal:hover {
      filter: brightness(1.05);
      transform: translateY(-1px);
    }

    .lock-error-msg {
      display: none;
      color: var(--color-rose);
      font-size: 0.82rem;
      font-weight: 600;
      margin-bottom: 14px;
    }

    /* Top Header with Gradient Accent Line */
    .site-header {
      padding: 14px 0;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      position: sticky;
      top: 0;
      z-index: 50;
      border-bottom: 1px solid var(--border-color);
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.04);
    }

    .site-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #10b981 0%, #4f46e5 35%, #0284c7 70%, #f59e0b 100%);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .brand-wrap {
      display: flex;
      align-items: center;
      gap: 14px;
      text-decoration: none;
    }

    .brand-logo-img {
      height: 38px;
      max-width: 170px;
      width: auto;
      object-fit: contain;
      display: block;
    }

    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      color: #065f46;
      border: 1px solid #a7f3d0;
      box-shadow: 0 1px 2px rgba(16, 185, 129, 0.1);
    }

    .brand-badge .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
      animation: pulseDot 2s infinite ease-in-out;
    }

    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    /* Distinctly Colored Navigation Pills */
    .nav-link-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 13px;
      border-radius: 10px;
      font-size: 0.82rem;
      font-weight: 600;
      text-decoration: none;
      background: #ffffff;
      border: 1px solid var(--border-color);
      transition: all 0.2s ease;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
    }

    .nav-link-btn.btn-home { color: #334155; }
    .nav-link-btn.btn-home:hover { background: #f8fafc; color: #0f172a; border-color: #cbd5e1; }

    .nav-link-btn.btn-emails {
      background: #f5f3ff;
      border-color: #ddd6fe;
      color: #6d28d9;
    }
    .nav-link-btn.btn-emails:hover {
      background: #ede9fe;
      border-color: #c4b5fd;
    }

    .nav-link-btn.btn-fastshare {
      background: #f0f9ff;
      border-color: #bae6fd;
      color: #0369a1;
    }
    .nav-link-btn.btn-fastshare:hover {
      background: #e0f2fe;
      border-color: #7dd3fc;
    }

    .nav-link-btn.btn-admin {
      background: #fff1f2;
      border-color: #fecdd3;
      color: #be123c;
    }
    .nav-link-btn.btn-admin:hover {
      background: #ffe4e6;
      border-color: #fda4af;
    }

    .nav-link-btn.btn-lock {
      background: #ffffff;
      border-color: #fecdd3;
      color: #e11d48;
    }
    .nav-link-btn.btn-lock:hover {
      background: #fff1f2;
    }

    /* MongoDB Live Pill */
    .db-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 13px;
      border-radius: 999px;
      font-size: 0.76rem;
      font-weight: 700;
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      color: #065f46;
      border: 1px solid #6ee7b7;
      box-shadow: 0 1px 3px rgba(16, 185, 129, 0.15);
    }

    .db-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
      animation: pulseDot 2s infinite;
    }

    /* Top Banner with Vibrant Gradient Border & Soft Tint */
    .top-banner {
      padding: 24px 0 18px;
    }

    .banner-card {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border: 1.5px solid #e2e8f0;
      border-radius: 20px;
      padding: 26px 30px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 22px;
      box-shadow: var(--shadow-md);
      position: relative;
      overflow: hidden;
    }

    .banner-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #10b981, #0284c7, #6366f1, #f59e0b);
    }

    .banner-info h1 {
      font-family: var(--font-display);
      font-size: 1.65rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 6px;
      color: #0f172a;
    }

    .banner-info p {
      color: var(--text-secondary);
      font-size: 0.92rem;
      max-width: 680px;
      line-height: 1.55;
    }

    /* 4 Distinct Vibrant Metric Cards */
    .banner-metrics {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
    }

    .metric-pill {
      border-radius: 16px;
      padding: 14px 20px;
      display: flex;
      flex-direction: column;
      min-width: 125px;
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .metric-pill:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .metric-pill.card-cyan {
      background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
      border: 1.5px solid #bae6fd;
    }
    .metric-pill.card-green {
      background: linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%);
      border: 1.5px solid #a7f3d0;
    }
    .metric-pill.card-violet {
      background: linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%);
      border: 1.5px solid #ddd6fe;
    }
    .metric-pill.card-amber {
      background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%);
      border: 1.5px solid #fde68a;
    }

    .metric-pill .label {
      font-size: 0.72rem;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.05em;
    }

    .metric-pill .val {
      font-family: var(--font-display);
      font-size: 1.45rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 2px;
    }

    .val.green { color: #059669; }
    .val.amber { color: #d97706; }
    .val.cyan { color: #0284c7; }
    .val.violet { color: #4f46e5; }

    /* Sender Box with Vibrant Emerald Gradient */
    .sender-box {
      background: linear-gradient(135deg, #ecfdf5 0%, #e0f2fe 100%);
      border: 1.5px solid #6ee7b7;
      border-radius: 18px;
      padding: 20px 24px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.08);
    }

    .sender-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .sender-icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
      flex-shrink: 0;
    }

    .sender-details strong {
      font-size: 1rem;
      color: #065f46;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sender-details p {
      font-size: 0.86rem;
      color: #047857;
      margin-top: 2px;
    }

    .sender-input-group {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    /* Dashboard Grid */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 390px;
      gap: 24px;
      margin-bottom: 40px;
      align-items: start;
    }

    .right-col {
      display: flex;
      flex-direction: column;
      gap: 24px;
      position: sticky;
      top: 86px;
    }

    @media (max-width: 1080px) {
      .dashboard-grid { grid-template-columns: 1fr; }
      .right-col { position: static; }
    }

    /* Cards with Color-Coded Personality */
    .dash-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 18px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
      position: relative;
    }

    .dash-card:hover {
      box-shadow: var(--shadow-md);
      border-color: #cbd5e1;
    }

    .dash-card.card-accent-violet { border-top: 3.5px solid #6366f1; }
    .dash-card.card-accent-cyan { border-top: 3.5px solid #0284c7; }
    .dash-card.card-accent-amber { border-top: 3.5px solid #f59e0b; }
    .dash-card.card-accent-rose { border-top: 3.5px solid #f43f5e; }
    .dash-card.card-accent-emerald { border-top: 3.5px solid #10b981; }

    .card-header {
      padding: 18px 24px;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: linear-gradient(180deg, #fafbfd 0%, #ffffff 100%);
      flex-wrap: wrap;
    }

    .card-title {
      font-family: var(--font-display);
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .card-icon-pill {
      width: 32px;
      height: 32px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .pill-violet { background: #f5f3ff; color: #6d28d9; }
    .pill-cyan { background: #f0f9ff; color: #0284c7; }
    .pill-amber { background: #fffbeb; color: #d97706; }
    .pill-rose { background: #fff1f2; color: #e11d48; }
    .pill-emerald { background: #ecfdf5; color: #059669; }

    .card-subtitle {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .card-body {
      padding: 24px;
    }

    /* Form Controls */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .form-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #334155;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .form-hint {
      font-size: 0.74rem;
      color: var(--text-muted);
    }

    .form-control {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      color: #0f172a;
      padding: 10px 14px;
      border-radius: 12px;
      font-family: var(--font-sans);
      font-size: 0.92rem;
      transition: all 0.2s ease;
      width: 100%;
    }

    .form-control:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
    }

    textarea.form-control {
      min-height: 120px;
      resize: vertical;
      line-height: 1.6;
    }

    /* Clocks & Time Pickers */
    .watch-picker-box {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .watch-display-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .clock-dial-group {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      padding: 6px 10px;
      box-shadow: var(--shadow-sm);
    }

    .clock-select {
      background: transparent;
      border: none;
      color: #0f172a;
      font-family: var(--font-mono);
      font-size: 1.15rem;
      font-weight: 700;
      outline: none;
      cursor: pointer;
      text-align: center;
    }

    .clock-colon {
      font-family: var(--font-mono);
      font-size: 1.15rem;
      font-weight: 800;
      color: #10b981;
      animation: blinkColon 1.5s infinite;
    }

    @keyframes blinkColon {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .ampm-toggle-btn {
      padding: 7px 14px;
      border-radius: 10px;
      font-family: var(--font-mono);
      font-size: 0.86rem;
      font-weight: 800;
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s;
    }

    .ampm-toggle-btn.is-am {
      color: #0284c7;
      border-color: #7dd3fc;
      background: #f0f9ff;
    }

    .ampm-toggle-btn.is-pm {
      color: #d97706;
      border-color: #fde68a;
      background: #fffbeb;
    }

    /* Live Controller Card with Indigo Accent */
    .live-controller-card {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-top: 4px solid #10b981;
      border-radius: 20px;
      padding: 26px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 16px;
      position: relative;
      box-shadow: var(--shadow-md);
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 18px;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
      transition: all 0.3s ease;
    }

    .status-badge.running {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      color: #065f46;
      border-color: #10b981;
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.25);
    }

    .status-badge.break {
      background: #fffbeb;
      color: #92400e;
      border-color: #facc15;
    }

    /* Timer Circle */
    .timer-circle-wrap {
      position: relative;
      width: 160px;
      height: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .timer-svg {
      transform: rotate(-90deg);
      width: 160px;
      height: 160px;
    }

    .timer-circle-bg {
      fill: none;
      stroke: #f1f5f9;
      stroke-width: 8;
    }

    .timer-circle-progress {
      fill: none;
      stroke: #10b981;
      stroke-width: 8;
      stroke-linecap: round;
      stroke-dasharray: 440;
      stroke-dashoffset: 0;
      transition: stroke-dashoffset 1s linear, stroke 0.3s ease;
    }

    .timer-content {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .timer-seconds {
      font-family: var(--font-mono);
      font-size: 2.2rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
    }

    .timer-unit {
      font-size: 0.72rem;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 700;
      margin-top: 4px;
    }

    .timer-jitter-info {
      font-size: 0.84rem;
      color: #334155;
      background: #f8fafc;
      border: 1px solid var(--border-color);
      padding: 8px 14px;
      border-radius: 12px;
      font-family: var(--font-mono);
      width: 100%;
    }

    .timer-jitter-info strong {
      color: #059669;
    }

    /* Action Buttons with Gradients */
    .action-btn-group {
      display: flex;
      gap: 10px;
      width: 100%;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 18px;
      border-radius: 12px;
      font-size: 0.92rem;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid transparent;
      text-decoration: none;
      width: 100%;
      user-select: none;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .btn-primary {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
    }

    .btn-danger {
      background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
      color: #e11d48;
      border-color: #fecdd3;
    }
    .btn-danger:hover {
      background: #ffe4e6;
      border-color: #fda4af;
    }

    .btn-secondary {
      background: #ffffff;
      color: #0f172a;
      border-color: #cbd5e1;
      box-shadow: var(--shadow-sm);
    }
    .btn-secondary:hover {
      background: #f8fafc;
      border-color: #94a3b8;
    }

    /* Range Box */
    .range-box {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 16px;
    }

    .range-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .range-val {
      font-family: var(--font-mono);
      font-size: 0.92rem;
      font-weight: 700;
      color: #059669;
    }

    .range-slider {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #cbd5e1;
      outline: none;
      -webkit-appearance: none;
    }

    .range-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #10b981;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4);
      border: 2px solid #ffffff;
    }

    /* Schedule & Warm-up Table */
    .schedule-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.88rem;
      min-width: 520px;
    }

    .schedule-table th,
    .schedule-table td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }

    .schedule-table th {
      color: var(--text-muted);
      font-weight: 700;
      font-size: 0.74rem;
      text-transform: uppercase;
      background: #f8fafc;
    }

    .schedule-table tr.active-today {
      background: linear-gradient(90deg, #ecfdf5 0%, #ffffff 100%);
    }

    .schedule-table tr.active-today td:first-child {
      border-left: 3px solid #10b981;
      font-weight: 700;
      color: #065f46;
    }

    /* Queue Table */
    .queue-table-wrap {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid var(--border-color);
      border-radius: 14px;
      background: #ffffff;
      -webkit-overflow-scrolling: touch;
    }

    .queue-pill {
      font-size: 0.72rem;
      padding: 4px 10px;
      border-radius: 999px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .queue-pill.pending {
      background: #f1f5f9;
      color: #475569;
    }

    .queue-pill.sent {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }

    .queue-pill.sending {
      background: #f0f9ff;
      color: #0369a1;
      border: 1px solid #bae6fd;
      animation: pulseDot 1.5s infinite;
    }

    .queue-pill.failed {
      background: #fff1f2;
      color: #be123c;
      border: 1px solid #fecdd3;
    }

    /* Live Terminal Console Log */
    .console-log {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 14px;
      padding: 16px;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      height: 220px;
      overflow-y: auto;
      color: #cbd5e1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: inset 0 2px 5px rgba(0,0,0,0.3);
    }

    .log-line {
      display: flex;
      gap: 8px;
      line-height: 1.4;
    }

    .log-time {
      color: #64748b;
      flex-shrink: 0;
    }

    .log-msg.success { color: #34d399; }
    .log-msg.info { color: #38bdf8; }
    .log-msg.warn { color: #fbbf24; }
    .log-msg.alert { color: #f87171; }

    /* Custom Switch Toggle */
    .toggle-switch {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }

    .toggle-track {
      width: 44px;
      height: 24px;
      background: #cbd5e1;
      border-radius: 999px;
      position: relative;
      transition: background 0.2s ease;
      flex-shrink: 0;
    }

    .toggle-thumb {
      width: 18px;
      height: 18px;
      background: #ffffff;
      border-radius: 50%;
      position: absolute;
      top: 3px;
      left: 3px;
      transition: transform 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }

    .toggle-input { display: none; }
    .toggle-input:checked + .toggle-track { background: #10b981; }
    .toggle-input:checked + .toggle-track .toggle-thumb { transform: translateX(20px); }

    /* Tabs */
    .tab-nav {
      display: flex;
      border-bottom: 1px solid var(--border-color);
      gap: 8px;
      padding: 0 16px;
      background: #f8fafc;
      overflow-x: auto;
    }

    .tab-btn {
      padding: 12px 18px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--text-muted);
      font-weight: 700;
      font-size: 0.86rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .tab-btn.active {
      color: #059669;
      border-bottom-color: #10b981;
    }

    .tab-content { display: none; }
    .tab-content.active { display: block; }

    /* Modal Backdrop */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.25s ease;
    }

    .modal-backdrop.is-open { opacity: 1; visibility: visible; }

    .modal-box {
      width: 100%;
      max-width: 460px;
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 28px;
      box-shadow: var(--shadow-xl);
      position: relative;
    }

    .modal-title {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 8px;
    }

    .modal-desc {
      font-size: 0.88rem;
      color: var(--text-secondary);
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    /* Footer */
    .site-footer {
      margin-top: auto;
      border-top: 1px solid var(--border-color);
      padding: 24px 0;
      background: #ffffff;
      font-size: 0.82rem;
      text-align: center;
      color: var(--text-muted);
    }

    .site-footer a {
      color: #4f46e5;
      text-decoration: none;
      font-weight: 600;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-inner {
        flex-direction: column;
        align-items: flex-start;
        gap: 14px;
      }
      .nav-actions {
        width: 100%;
        justify-content: space-between;
      }
      .banner-info h1 { font-size: 1.3rem; }
      .metric-pill { flex: 1 1 45%; }
      .sender-box { flex-direction: column; align-items: flex-start; }
      .watch-display-row { flex-direction: column; align-items: flex-start; }
    }
  </style>`;

  html = html.replace(/<style>[\s\S]*?<\/style>/i, marketingVibrantCss);

  // Update Top Banner Metric Pills with colorful class attributes
  html = html.replace(/<div class="metric-pill">\s*<span class="label">કુલ કતાર/i, '<div class="metric-pill card-cyan">\n            <span class="label">કુલ કતાર');
  html = html.replace(/<div class="metric-pill">\s*<span class="label">આજે મોકલાયેલ/i, '<div class="metric-pill card-green">\n            <span class="label">આજે મોકલાયેલ');
  html = html.replace(/<div class="metric-pill">\s*<span class="label">સરેરાશ ડિલે/i, '<div class="metric-pill card-violet">\n            <span class="label">સરેરાશ ડિલે');
  html = html.replace(/<div class="metric-pill">\s*<span class="label">અનુમાનિત સમાપ્તિ/i, '<div class="metric-pill card-amber">\n            <span class="label">અનુમાનિત સમાપ્તિ');

  // Update card border accents
  html = html.replace(/<div class="dash-card">\s*<div class="card-header">\s*<div class="card-title">[\s\S]*?રેન્ડમ ડિલે/i, '<div class="dash-card card-accent-violet">\n          <div class="card-header">\n            <div class="card-title">\n              <div class="card-icon-pill pill-violet">\n                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n                  <circle cx="12" cy="12" r="10"></circle>\n                  <polyline points="12 6 12 12 16 14"></polyline>\n                </svg>\n              </div>\n              રેન્ડમ ડિલે');

  // Update header nav with distinct colorful pills
  const newNavHtml = `<div class="nav-actions">
        <a href="/" class="nav-link-btn btn-home" title="Main Website">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Home
        </a>
        <a href="/emails" class="nav-link-btn btn-emails" title="Email Management Suite">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Emails
        </a>
        <a href="/fastshare" class="nav-link-btn btn-fastshare" title="FastShare File Transfer">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          FastShare
        </a>
        <a href="/admin" class="nav-link-btn btn-admin" title="Executive Admin CRM">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Admin
        </a>
        <div class="db-pill" id="dbStatusPill" title="MongoDB Connection Status">
          <span class="db-dot"></span>
          <span id="dbStatusText">MongoDB: Connected (mindnext)</span>
        </div>
        <button class="nav-link-btn btn-lock" onclick="lockMarketingPortal()" title="Lock Portal">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Lock
        </button>
      </div>
    </div>
  </header>`;

  html = html.replace(/<div class="nav-actions">[\s\S]*?<\/div>\s*<\/div>\s*<\/header>/i, newNavHtml);

  fs.writeFileSync(filePath, html, 'utf-8');
  fs.writeFileSync(path.join(ROOT_DIR, 'marketing', 'index.html'), html, 'utf-8');
  console.log('✅ marketing.html updated with vibrant color palette!');
}

// ====================================================================
// 2. ADMIN.HTML VIBRANT THEME
// ====================================================================
function upgradeAdmin() {
  const filePath = path.join(ROOT_DIR, 'admin.html');
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf-8');

  // Update Fonts
  html = html.replace(/<link[^>]*fonts\.googleapis\.com\/css2\?family=[^>]*>/i, SHARED_FONTS.trim());
  html = html.replace(/images\/mindnext-logo-white\.png/g, 'images/mindnext-logo.png');

  const adminVibrantCss = `  <style>
    :root {
      --bg-base: #f4f6fb;
      --bg-surface: #ffffff;
      --bg-card: #ffffff;
      --bg-card-hover: #f8fafc;
      --bg-input: #ffffff;
      --border-subtle: #e2e8f0;

      --accent-indigo: #4f46e5;
      --accent-violet: #7c3aed;
      --accent-cyan: #0284c7;
      --accent-emerald: #059669;
      --accent-rose: #e11d48;
      --accent-amber: #d97706;

      --text-main: #0f172a;
      --text-muted: #334155;
      --text-dim: #64748b;

      --font-display: 'Outfit', sans-serif;
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --shadow-card: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
      --shadow-hover: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
      --shadow-modal: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
    }

    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background-color: var(--bg-base);
      color: var(--text-main);
      font-family: var(--font-sans);
      line-height: 1.6;
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
      -webkit-font-smoothing: antialiased;
    }

    .ambient-glow {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      background:
        radial-gradient(circle at 10% 12%, rgba(79, 70, 229, 0.08) 0%, transparent 450px),
        radial-gradient(circle at 90% 15%, rgba(2, 132, 199, 0.08) 0%, transparent 450px),
        radial-gradient(circle at 50% 90%, rgba(16, 185, 129, 0.06) 0%, transparent 500px);
    }

    .app-container {
      position: relative;
      z-index: 1;
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 24px 60px;
    }

    /* Header */
    .top-header {
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-subtle);
      position: sticky;
      top: 0;
      z-index: 40;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    }

    .top-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #4f46e5, #0284c7, #10b981, #f59e0b, #e11d48);
    }

    .header-inner {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 24px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 14px;
      text-decoration: none;
    }

    .brand-logo-img {
      height: 38px;
      width: auto;
      display: block;
    }

    .brand-title {
      font-family: var(--font-display);
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.3px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .domain-badge {
      font-family: var(--font-sans);
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 999px;
      background: #eef2ff;
      color: #4338ca;
      border: 1px solid #c7d2fe;
    }

    .brand-subtitle {
      font-size: 11.5px;
      color: var(--text-dim);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .status-dot-pulse {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #10b981;
      box-shadow: 0 0 8px #10b981;
      animation: pulseGlow 2s infinite;
    }

    @keyframes pulseGlow {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    /* Buttons with Rich Styling */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 8px 14px;
      border-radius: 10px;
      font-family: var(--font-sans);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid transparent;
      user-select: none;
    }

    .btn-sm { padding: 7px 12px; font-size: 12.5px; }

    .btn-primary {
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #4338ca 0%, #4f46e5 100%);
      transform: translateY(-1px);
    }

    .btn-emerald {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
    }
    .btn-emerald:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: translateY(-1px);
    }

    .btn-outline {
      background: #ffffff;
      color: #334155;
      border: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-card);
    }
    .btn-outline:hover {
      background: #f8fafc;
      color: #0f172a;
      border-color: #cbd5e1;
    }

    .lock-trigger-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      border-radius: 10px;
      font-size: 12.5px;
      font-weight: 600;
      background: #fff1f2;
      border: 1px solid #fecdd3;
      color: #e11d48;
      cursor: pointer;
    }

    .db-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 700;
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      color: #065f46;
      border: 1px solid #6ee7b7;
    }

    .db-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    /* Lock Screen Overlay */
    .lock-screen-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(16px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    .lock-screen-overlay.unlocked { opacity: 0; visibility: hidden; pointer-events: none; }

    .lock-container {
      width: 100%;
      max-width: 440px;
      background: #ffffff;
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: var(--shadow-modal);
      position: relative;
      overflow: hidden;
    }
    .lock-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #4f46e5, #0284c7, #10b981);
    }

    .lock-brand-img {
      height: 42px;
      max-width: 180px;
      width: auto;
      margin: 0 auto 16px;
      display: block;
    }

    .lock-title {
      font-family: var(--font-display);
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .lock-subtitle {
      font-size: 13px;
      color: #4f46e5;
      font-weight: 600;
      margin-bottom: 22px;
    }

    .passcode-input-wrap {
      position: relative;
      margin-bottom: 16px;
    }

    .passcode-input {
      width: 100%;
      padding: 13px 44px 13px 16px;
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      color: #0f172a;
      font-size: 15px;
      outline: none;
    }

    .passcode-input:focus {
      border-color: #4f46e5;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
    }

    .btn-unlock-portal {
      width: 100%;
      padding: 13px;
      border-radius: 12px;
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      border: none;
      color: #ffffff;
      font-size: 14.5px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
    }

    .lock-error-msg {
      display: none;
      color: var(--accent-rose);
      font-size: 12.5px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    /* Tabs Bar */
    .nav-tabs-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin: 24px 0;
      flex-wrap: wrap;
    }

    .tabs-group {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #ffffff;
      border: 1px solid var(--border-subtle);
      padding: 5px;
      border-radius: 14px;
      box-shadow: var(--shadow-card);
    }

    .nav-tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 16px;
      border-radius: 10px;
      border: none;
      background: transparent;
      color: var(--text-dim);
      font-family: var(--font-sans);
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .nav-tab-btn.active {
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: #ffffff;
      box-shadow: 0 3px 8px rgba(79, 70, 229, 0.35);
    }

    .tab-badge {
      padding: 2px 7px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      background: #eef2ff;
      color: #4338ca;
    }
    .nav-tab-btn.active .tab-badge {
      background: rgba(255, 255, 255, 0.25);
      color: #ffffff;
    }

    .nav-tab-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* 4 Distinct Vibrant KPI Cards */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
      margin-bottom: 28px;
    }

    .kpi-card {
      border-radius: 18px;
      padding: 22px;
      box-shadow: var(--shadow-card);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-hover);
    }

    .kpi-card.kpi-indigo {
      background: linear-gradient(145deg, #ffffff 0%, #f5f3ff 100%);
      border: 1.5px solid #ddd6fe;
    }
    .kpi-card.kpi-rose {
      background: linear-gradient(145deg, #ffffff 0%, #fff1f2 100%);
      border: 1.5px solid #fecdd3;
    }
    .kpi-card.kpi-amber {
      background: linear-gradient(145deg, #ffffff 0%, #fffbeb 100%);
      border: 1.5px solid #fde68a;
    }
    .kpi-card.kpi-emerald {
      background: linear-gradient(145deg, #ffffff 0%, #ecfdf5 100%);
      border: 1.5px solid #a7f3d0;
    }

    .kpi-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .kpi-label {
      font-size: 11.5px;
      font-weight: 700;
      color: var(--text-dim);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .kpi-icon-wrap {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-indigo { background: #eef2ff; color: #4f46e5; }
    .icon-rose { background: #ffe4e6; color: #e11d48; }
    .icon-amber { background: #fef3c7; color: #d97706; }
    .icon-emerald { background: #d1fae5; color: #059669; }

    .kpi-value {
      font-family: var(--font-display);
      font-size: 34px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
      margin-bottom: 8px;
    }

    .kpi-footer {
      font-size: 12px;
      color: var(--text-dim);
    }
    .trend-up { color: #059669; font-weight: 700; }

    /* Filter Toolbar */
    .filter-toolbar {
      background: #ffffff;
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 20px;
      box-shadow: var(--shadow-card);
      flex-wrap: wrap;
    }

    .search-wrap {
      position: relative;
      flex: 1;
      min-width: 260px;
    }

    .search-input {
      width: 100%;
      padding: 10px 14px 10px 38px;
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      color: #0f172a;
      font-size: 13.5px;
      outline: none;
    }
    .search-input:focus {
      background: #ffffff;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-dim);
      pointer-events: none;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .filter-select {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      color: #0f172a;
      font-family: var(--font-sans);
      font-size: 13px;
      padding: 9px 14px;
      outline: none;
      cursor: pointer;
    }

    /* Table */
    .table-card {
      background: #ffffff;
      border: 1px solid var(--border-subtle);
      border-radius: 18px;
      overflow: hidden;
      box-shadow: var(--shadow-card);
      margin-bottom: 24px;
    }

    .data-table-wrap {
      width: 100%;
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13.5px;
      text-align: left;
    }

    .data-table th {
      background: #f8fafc;
      padding: 14px 18px;
      font-size: 11.5px;
      font-weight: 700;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border-subtle);
    }

    .data-table td {
      padding: 15px 18px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }
    .data-table tr:hover td { background: #f8fafc; }

    .client-title {
      font-weight: 700;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .client-sub { font-size: 12px; color: var(--text-dim); }

    /* Colorful Status Pills */
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .status-new { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
    .status-discussion { background: #f0f9ff; color: #0369a1; border: 1px solid #bae6fd; }
    .status-contacted { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .status-proposal { background: #faf5ff; color: #6b21a8; border: 1px solid #e9d5ff; }
    .status-won { background: #ecfdf5; color: #047857; border: 1px solid #6ee7b7; }
    .status-archived, .status-lost { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }

    /* Modals & Drawer */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.25s ease;
    }
    .modal-overlay.active { opacity: 1; visibility: visible; }

    .modal-card {
      background: #ffffff;
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      width: 100%;
      max-width: 580px;
      padding: 28px;
      box-shadow: var(--shadow-modal);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .modal-title {
      font-family: var(--font-display);
      font-size: 19px;
      font-weight: 700;
      color: #0f172a;
    }

    .form-group { margin-bottom: 16px; }
    .form-label {
      display: block;
      font-size: 12.5px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 6px;
    }

    .form-control {
      width: 100%;
      padding: 10px 14px;
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      font-family: var(--font-sans);
      font-size: 13.5px;
      color: #0f172a;
      outline: none;
    }
    .form-control:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
    }

    /* Drawer */
    .drawer-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(4px);
      z-index: 9998;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    .drawer-backdrop.active { opacity: 1; visibility: visible; }

    .drawer-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 100%;
      max-width: 540px;
      height: 100vh;
      background: #ffffff;
      border-left: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-modal);
      z-index: 9999;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }
    .drawer-panel.active { transform: translateX(0); }

    .drawer-header {
      padding: 22px 24px;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f8fafc;
    }

    .drawer-body {
      padding: 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    /* Toast */
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 100000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .toast {
      background: #0f172a;
      color: #ffffff;
      padding: 12px 18px;
      border-radius: 12px;
      font-size: 13.5px;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }

    @media (max-width: 1024px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
      .header-inner {
        flex-direction: column;
        height: auto;
        padding: 14px 16px;
        align-items: flex-start;
        gap: 12px;
      }
      .header-actions { width: 100%; justify-content: space-between; }
      .kpi-grid { grid-template-columns: 1fr; }
      .filter-toolbar { flex-direction: column; align-items: stretch; }
      .drawer-panel { max-width: 100vw; }
    }
  </style>`;

  html = html.replace(/<style>[\s\S]*?<\/style>/i, adminVibrantCss);

  // Update KPI card markup to add distinct color classes
  html = html.replace(/<div class="kpi-card" style="--card-accent: var\(--accent-violet\);"/i, '<div class="kpi-card kpi-indigo"');
  html = html.replace(/<div class="kpi-card" style="--card-accent: var\(--accent-rose\);"/i, '<div class="kpi-card kpi-rose"');
  html = html.replace(/<div class="kpi-card" style="--card-accent: var\(--accent-amber\);"/i, '<div class="kpi-card kpi-amber"');
  html = html.replace(/<div class="kpi-card" style="--card-accent: var\(--accent-emerald\);"/i, '<div class="kpi-card kpi-emerald"');

  // Update KPI icon wrappers with vibrant classes
  html = html.replace(/<div class="kpi-icon-wrap">\s*<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\s*<path d="M14 2H6/i, '<div class="kpi-icon-wrap icon-indigo">\n            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n              <path d="M14 2H6');
  html = html.replace(/<div class="kpi-icon-wrap" style="color:var\(--accent-rose\); background:rgba\(244,63,94,0\.1\);"/i, '<div class="kpi-icon-wrap icon-rose"');
  html = html.replace(/<div class="kpi-icon-wrap" style="color:var\(--accent-amber\); background:rgba\(245,158,11,0\.1\);"/i, '<div class="kpi-icon-wrap icon-amber"');
  html = html.replace(/<div class="kpi-icon-wrap" style="color:var\(--accent-emerald\); background:rgba\(16,185,129,0\.1\);"/i, '<div class="kpi-icon-wrap icon-emerald"');

  // Header actions with colorful navigation buttons
  const newHeaderActionsHtml = `<div class="header-actions">
        <a href="/" class="btn btn-outline btn-sm">Home</a>
        <a href="/marketing" class="btn btn-sm" style="background:#ecfdf5; border-color:#a7f3d0; color:#047857;">Marketing</a>
        <a href="/emails" class="btn btn-sm" style="background:#f5f3ff; border-color:#ddd6fe; color:#6d28d9;">Emails</a>
        <a href="/fastshare" class="btn btn-sm" style="background:#f0f9ff; border-color:#bae6fd; color:#0369a1;">FastShare</a>
        <div class="db-pill" id="dbStatusPill" title="MongoDB Connection Status">
          <span class="db-dot"></span>
          <span id="dbStatusText">MongoDB: Active</span>
        </div>
        <button class="btn btn-emerald btn-sm" onclick="openManualLeadModal()">+ Add Lead</button>
        <button class="lock-trigger-btn" onclick="lockAdminPortal()" title="Lock session">Lock</button>
      </div>
    </div>
  </header>`;

  html = html.replace(/<div class="header-actions">[\s\S]*?<\/div>\s*<\/div>\s*<\/header>/i, newHeaderActionsHtml);

  fs.writeFileSync(filePath, html, 'utf-8');
  fs.writeFileSync(path.join(ROOT_DIR, 'admin', 'index.html'), html, 'utf-8');
  console.log('✅ admin.html updated with vibrant color palette!');
}

// ====================================================================
// 3. EMAILS.HTML VIBRANT THEME
// ====================================================================
function upgradeEmails() {
  const filePath = path.join(ROOT_DIR, 'emails.html');
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf-8');

  // Update Fonts & Logos
  html = html.replace(/<link[^>]*fonts\.googleapis\.com\/css2\?family=[^>]*>/i, SHARED_FONTS.trim());
  html = html.replace(/images\/mindnext-logo-white\.png/g, 'images/mindnext-logo.png');

  const emailsVibrantCss = `  <style>
    :root {
      --bg-dark: #f4f6fb;
      --bg-card: #ffffff;
      --bg-card-subtle: #f8fafc;
      --bg-input: #ffffff;
      --border-color: #e2e8f0;
      --border-focus: #6366f1;
      --accent-violet: #6366f1;
      --accent-violet-dark: #4f46e5;
      --accent-cyan: #0284c7;
      --accent-emerald: #059669;
      --accent-rose: #e11d48;
      --accent-amber: #d97706;
      --text-primary: #0f172a;
      --text-secondary: #334155;
      --text-muted: #64748b;
      --font-display: 'Outfit', sans-serif;
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 12px -2px rgba(15, 23, 42, 0.06);
      --shadow-lg: 0 12px 28px -5px rgba(15, 23, 42, 0.09);
    }

    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-primary);
      font-family: var(--font-sans);
      line-height: 1.6;
      min-height: 100vh;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    .bg-glow {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      background:
        radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.08) 0%, transparent 450px),
        radial-gradient(circle at 85% 80%, rgba(2, 132, 199, 0.07) 0%, transparent 450px),
        radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 450px);
    }

    .container {
      max-width: 1360px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1;
    }

    /* Header */
    .site-header {
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    }

    .site-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #6366f1, #0284c7, #10b981, #f59e0b);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 74px;
      gap: 16px;
    }

    .brand-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }

    .brand-logo-img { height: 38px; width: auto; display: block; }

    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
      color: #6d28d9;
      border: 1px solid #c4b5fd;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .nav-link-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 13px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      background: #ffffff;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      transition: all 0.2s ease;
    }

    .nav-link-btn:hover { background: #f8fafc; border-color: #cbd5e1; }

    .db-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 700;
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      color: #065f46;
      border: 1px solid #6ee7b7;
    }
    .db-dot { width: 7px; height: 7px; border-radius: 50%; background: #10b981; }

    /* Lock Screen Overlay */
    .lock-screen-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(16px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    .lock-screen-overlay.unlocked { opacity: 0; visibility: hidden; pointer-events: none; }

    .lock-container {
      width: 100%;
      max-width: 440px;
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
      position: relative;
      overflow: hidden;
    }
    .lock-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #6366f1, #0284c7, #10b981);
    }

    .lock-brand-img { height: 42px; max-width: 180px; width: auto; margin: 0 auto 16px; display: block; }
    .lock-title { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
    .lock-subtitle { font-size: 13px; color: #6366f1; font-weight: 600; margin-bottom: 22px; }

    .passcode-input-wrap { position: relative; margin-bottom: 16px; }
    .passcode-input {
      width: 100%;
      padding: 13px 44px 13px 16px;
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      color: #0f172a;
      font-size: 15px;
      outline: none;
    }
    .passcode-input:focus {
      border-color: #6366f1;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }

    .btn-unlock-portal {
      width: 100%;
      padding: 13px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      border: none;
      color: #ffffff;
      font-size: 14.5px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
    }

    /* Cards with Top Gradient Line */
    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 18px;
      padding: 24px;
      box-shadow: var(--shadow-sm);
      margin-bottom: 24px;
      transition: box-shadow 0.2s ease, border-color 0.2s ease;
      position: relative;
    }
    .card:hover {
      box-shadow: var(--shadow-md);
      border-color: #cbd5e1;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px solid #f1f5f9;
    }
    .card-title {
      font-family: var(--font-display);
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
    }

    .form-control, .input-field, input, select, textarea {
      background: var(--bg-input);
      border: 1.5px solid #cbd5e1;
      color: var(--text-primary);
      border-radius: 12px;
      padding: 10px 14px;
      font-family: var(--font-sans);
      font-size: 14px;
      width: 100%;
      outline: none;
      transition: all 0.2s ease;
    }
    .form-control:focus, .input-field:focus, input:focus, select:focus, textarea:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    }

    /* Table */
    table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    th {
      background: #f8fafc;
      padding: 12px 16px;
      font-size: 11.5px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      border-bottom: 1px solid var(--border-color);
      text-align: left;
    }
    td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: var(--text-secondary); }
    tr:hover td { background: #f8fafc; }

    /* Tabs */
    .tab-btn {
      padding: 10px 18px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      background: #ffffff;
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 13.5px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tab-btn.active {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      border-color: #6366f1;
      box-shadow: 0 3px 8px rgba(99, 102, 241, 0.35);
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 10px 18px;
      border-radius: 12px;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
    }
    .btn-secondary {
      background: #ffffff;
      border-color: #cbd5e1;
      color: #334155;
    }
    .btn-secondary:hover { background: #f8fafc; }

    /* Dropzone */
    .drop-zone {
      border: 2px dashed #cbd5e1;
      border-radius: 16px;
      padding: 36px 20px;
      text-align: center;
      background: linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%);
      transition: all 0.25s ease;
      cursor: pointer;
    }
    .drop-zone:hover {
      border-color: #6366f1;
      background: #f5f3ff;
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .header-inner {
        flex-direction: column;
        height: auto;
        padding: 14px 16px;
        align-items: flex-start;
      }
      .nav-actions { width: 100%; justify-content: space-between; }
    }
  </style>`;

  html = html.replace(/<style>[\s\S]*?<\/style>/i, emailsVibrantCss);

  // Update header navigation with colorful pills
  const newHeaderActions = `<div class="nav-actions">
        <a href="/" class="nav-link-btn">Home</a>
        <a href="/marketing" class="nav-link-btn" style="background:#ecfdf5; border-color:#a7f3d0; color:#047857;">Marketing</a>
        <a href="/fastshare" class="nav-link-btn" style="background:#f0f9ff; border-color:#bae6fd; color:#0369a1;">FastShare</a>
        <a href="/admin" class="nav-link-btn" style="background:#fff1f2; border-color:#fecdd3; color:#be123c;">Admin</a>
        <div class="db-pill" id="dbStatusPill"><span class="db-dot"></span><span id="dbStatusText">MongoDB: Active</span></div>
        <button class="nav-link-btn" onclick="lockEmailPortal()" style="color:var(--accent-rose); border-color:#fecdd3;">Lock</button>
      </div>
    </div>
  </header>`;

  html = html.replace(/<div class="nav-actions">[\s\S]*?<\/div>\s*<\/div>\s*<\/header>/i, newHeaderActions);

  fs.writeFileSync(filePath, html, 'utf-8');
  fs.writeFileSync(path.join(ROOT_DIR, 'emails', 'index.html'), html, 'utf-8');
  fs.writeFileSync(path.join(ROOT_DIR, 'email', 'index.html'), html, 'utf-8');
  fs.writeFileSync(path.join(ROOT_DIR, 'email-verifier.html'), html, 'utf-8');
  console.log('✅ emails.html and all email subfolders updated with vibrant color palette!');
}

// ====================================================================
// 4. FASTSHARE.HTML VIBRANT THEME
// ====================================================================
function upgradeFastshare() {
  const filePath = path.join(ROOT_DIR, 'fastshare.html');
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf-8');

  // Update Fonts & Logos
  html = html.replace(/<link[^>]*fonts\.googleapis\.com\/css2\?family=[^>]*>/i, SHARED_FONTS.trim());
  html = html.replace(/images\/mindnext-logo-white\.png/g, 'images/mindnext-logo.png');

  const fastshareVibrantCss = `  <style>
    :root {
      --bg-dark: #f4f6fb;
      --bg-card: #ffffff;
      --bg-card-subtle: #f8fafc;
      --bg-input: #ffffff;
      --border-color: #e2e8f0;
      --border-focus: #0284c7;
      --accent-violet: #6366f1;
      --accent-cyan: #0284c7;
      --accent-emerald: #10b981;
      --accent-rose: #e11d48;
      --accent-amber: #d97706;
      --text-primary: #0f172a;
      --text-secondary: #334155;
      --text-muted: #64748b;
      --font-display: 'Outfit', sans-serif;
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 12px -2px rgba(15, 23, 42, 0.06);
      --shadow-lg: 0 12px 28px -5px rgba(15, 23, 42, 0.09);
    }

    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-primary);
      font-family: var(--font-sans);
      line-height: 1.6;
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
    }

    .ambient-glow {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      background:
        radial-gradient(circle at 20% 20%, rgba(2, 132, 199, 0.08) 0%, transparent 450px),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 450px),
        radial-gradient(circle at 50% 10%, rgba(16, 185, 129, 0.05) 0%, transparent 450px);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1;
    }

    /* Header */
    .site-header {
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    }

    .site-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #0284c7, #6366f1, #10b981);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
    }

    .brand-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }

    .brand-logo-img { height: 38px; width: auto; display: block; }

    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      color: #0369a1;
      border: 1px solid #7dd3fc;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .nav-link-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 13px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      background: #ffffff;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      transition: all 0.2s ease;
    }
    .nav-link-btn:hover { background: #f8fafc; border-color: #cbd5e1; }

    .db-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 700;
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      color: #065f46;
      border: 1px solid #6ee7b7;
    }
    .db-dot { width: 7px; height: 7px; border-radius: 50%; background: #10b981; }

    /* Hero */
    .portal-hero {
      text-align: center;
      padding: 48px 0 32px;
    }

    .portal-hero h1 {
      font-family: var(--font-display);
      font-size: 2.5rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      margin-bottom: 10px;
    }

    .portal-hero p {
      font-size: 1.05rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }

    /* Transfer Card with Multi-Color Depth */
    .transfer-card {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-top: 4px solid #0284c7;
      border-radius: 22px;
      padding: 38px;
      box-shadow: var(--shadow-lg);
      max-width: 680px;
      margin: 0 auto 40px;
      position: relative;
    }

    .dropzone-box {
      border: 2px dashed #cbd5e1;
      border-radius: 18px;
      padding: 46px 24px;
      text-align: center;
      background: linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%);
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .dropzone-box:hover {
      border-color: #0284c7;
      background: #e0f2fe;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(2, 132, 199, 0.12);
    }

    .dropzone-icon {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 18px;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
    }

    .dropzone-title {
      font-family: var(--font-display);
      font-size: 1.2rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
    }

    .dropzone-sub {
      font-size: 0.88rem;
      color: var(--text-muted);
    }

    .code-display {
      font-family: var(--font-mono);
      font-size: 2.1rem;
      font-weight: 800;
      letter-spacing: 4px;
      color: #0284c7;
      background: #f0f9ff;
      border: 2px solid #bae6fd;
      padding: 14px 24px;
      border-radius: 16px;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      margin: 18px 0;
      box-shadow: 0 2px 8px rgba(2, 132, 199, 0.1);
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 14.5px;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
      transform: translateY(-1px);
    }

    /* Footer */
    .site-footer {
      margin-top: auto;
      border-top: 1px solid var(--border-color);
      padding: 24px 0;
      background: #ffffff;
      font-size: 0.85rem;
      text-align: center;
      color: var(--text-muted);
    }

    @media (max-width: 768px) {
      .header-inner {
        flex-direction: column;
        height: auto;
        padding: 14px 16px;
        align-items: flex-start;
      }
      .nav-actions { width: 100%; justify-content: space-between; }
      .portal-hero h1 { font-size: 1.8rem; }
      .transfer-card { padding: 22px 16px; }
    }
  </style>`;

  html = html.replace(/<style>[\s\S]*?<\/style>/i, fastshareVibrantCss);

  // Update header navigation with colorful pills
  const newHeaderActions = `<div class="nav-actions">
        <a href="/" class="nav-link-btn">Home</a>
        <a href="/marketing" class="nav-link-btn" style="background:#ecfdf5; border-color:#a7f3d0; color:#047857;">Marketing</a>
        <a href="/emails" class="nav-link-btn" style="background:#f5f3ff; border-color:#ddd6fe; color:#6d28d9;">Emails</a>
        <a href="/admin" class="nav-link-btn" style="background:#fff1f2; border-color:#fecdd3; color:#be123c;">Admin</a>
        <div class="db-pill" id="dbStatusPill"><span class="db-dot"></span><span id="dbStatusText">MongoDB: Active</span></div>
      </div>
    </div>
  </header>`;

  html = html.replace(/<div class="nav-actions">[\s\S]*?<\/div>\s*<\/div>\s*<\/header>/i, newHeaderActions);

  fs.writeFileSync(filePath, html, 'utf-8');
  fs.writeFileSync(path.join(ROOT_DIR, 'fastshare', 'index.html'), html, 'utf-8');
  console.log('✅ fastshare.html updated with vibrant color palette!');
}

upgradeMarketing();
upgradeAdmin();
upgradeEmails();
upgradeFastshare();

console.log('✨ All 4 portals successfully upgraded with rich, vibrant color combinations!');
