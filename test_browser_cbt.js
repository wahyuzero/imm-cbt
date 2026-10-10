/**
 * End-to-End Headless Browser Automation Test Suite for CBT Platform
 * Paket Tryout Terpadu Bab 08: Reading (25 Soal) & Choukai (8 Soal) — Total 33 Soal
 * Tests all user flows, UI ergonomics, dual session navigation, audio handling,
 * score calculation, PDF links, and WhatsApp report generation.
 */

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9334;
const WEB_DIR = path.resolve(__dirname);
const INDEX_URL = process.env.TEST_URL || `file://${path.join(WEB_DIR, 'index.html')}?v=56`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function assert(condition, message) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`[PASS] ${message}: true`);
}

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(msg.error);
          else cb.resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  async captureScreenshot(outputPath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(outputPath, Buffer.from(res.data, 'base64'));
  }
}

async function runTests() {
  console.log('================================================================');
  console.log(' STARTING IMM CBT LAB 33-QUESTION E2E BROWSER AUTOMATION TESTS');
  console.log('================================================================');

  const TEST_PROFILE_DIR = '/tmp/chromium-cbt-test-data';
  if (fs.existsSync(TEST_PROFILE_DIR)) {
    fs.rmSync(TEST_PROFILE_DIR, { recursive: true, force: true });
  }

  const chromeProc = spawn('/usr/bin/chromium', [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--autoplay-policy=no-user-gesture-required',
    `--user-data-dir=${TEST_PROFILE_DIR}`,
    `--remote-debugging-port=${PORT}`,
    '--window-size=1280,900',
    INDEX_URL,
  ]);

  let cdp = null;

  try {
    await wait(1500);

    const versionInfo = await httpGetJson(`http://127.0.0.1:${PORT}/json/version`);
    console.log('[✓] Connected to Chromium CDP:', versionInfo.Browser);

    const tabs = await httpGetJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTab = tabs.find((t) => t.type === 'page') || tabs[0];
    console.log('[✓] Attached to target tab:', pageTab.id, pageTab.title);

    cdp = new CDPClient(pageTab.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    for (let i = 0; i < 40; i++) {
      const isReady = await cdp.eval('typeof window.app !== "undefined" && window.app.view === "auth_gate" && !window.app.authChecking && Boolean(document.getElementById("gate-login-username"))');
      if (isReady) break;
      await wait(250);
    }

    async function performLogin(username, pin) {
      await cdp.eval(`window.app.fillAndLogin(${JSON.stringify(username)}, ${JSON.stringify(pin)})`);
      let isAuth = false;
      for (let i = 0; i < 40; i++) {
        isAuth = await cdp.eval('Boolean(window.app && window.app.isAuthenticated)');
        if (isAuth) break;
        await wait(150);
      }
      assert(isAuth, `Login succeeded for user: ${username}`);
    }

  if (!process.env.TEST_ONLY || process.env.TEST_ONLY !== '27') {
    // TEST 1: Strict Auth Gate on Initial Launch
    console.log('\n--- TEST 1: Strict Auth Gate on Initial Launch & Route Interception ---');
    const isGateView = await cdp.eval('window.app ? window.app.view === "auth_gate" : false');
    assert(isGateView, 'Full-screen Strict Auth Gate displayed on launch');

    const isUnauthenticated = await cdp.eval('window.app ? !window.app.isAuthenticated : false');
    assert(isUnauthenticated, 'Initial unauthenticated state verified');

    const isHeaderHidden = await cdp.eval('document.getElementById("app-header").classList.contains("hidden")');
    assert(isHeaderHidden, 'Application navigation header is strictly hidden');

    const isFooterHidden = await cdp.eval('document.getElementById("app-footer").classList.contains("hidden")');
    assert(isFooterHidden, 'Application footer is strictly hidden');

    const gateInputsExist = await cdp.eval('Boolean(document.getElementById("gate-login-username") && document.getElementById("gate-login-pin") && document.getElementById("gate-btn-google"))');
    assert(gateInputsExist, 'Auth gate has Username, PIN, and Google OAuth buttons');

    const demoButtonsHidden = await cdp.eval('!document.getElementById("gate-btn-demo-student") && !document.getElementById("gate-btn-demo-sensei") && !document.body.innerText.includes("Akses Cepat Akun Demo") && !document.body.innerText.includes("PIN: 123456")');
    assert(demoButtonsHidden, 'Public demo credentials and demo buttons are NOT rendered in DOM');

    // Route Interception Verification (attempt hash access while unauthenticated)
    await cdp.eval('window.location.hash = "#bab-08"');
    await wait(200);
    const viewAfterHashAttempt = await cdp.eval('window.app.view');
    assert(viewAfterHashAttempt === 'auth_gate', 'URL hash #bab-08 intercepted and locked to auth_gate');
    await cdp.eval('window.location.hash = ""; window.app.targetHash = null;');
    await wait(100);

    // Route Interception for #admin while unauthenticated
    await cdp.eval('window.location.hash = "#admin"');
    await wait(200);
    const viewAfterAdminHash = await cdp.eval('window.app.view');
    assert(viewAfterAdminHash === 'auth_gate', 'URL hash #admin intercepted and locked to auth_gate');
    await cdp.eval('window.location.hash = ""; window.app.targetHash = null;');
    await wait(100);

    // Direct openAdminPanel call while unauthenticated must be blocked
    await cdp.eval('window.app.openAdminPanel("live")');
    const modalAfterUnauthAdmin = await cdp.eval('window.app.activeModal');
    assert(modalAfterUnauthAdmin === null, 'Direct openAdminPanel call blocked when unauthenticated');

    // Invalid Login Guard
    const failedLoginResult = await cdp.eval('window.app.login("siswa.salah", "000000", "gate-login-error")');
    assert(!failedLoginResult, 'Invalid credentials rejected by login guard');
    const isErrorVisible = await cdp.eval('!document.getElementById("gate-login-error").classList.contains("hidden")');
    assert(isErrorVisible, 'Invalid login error alert message displayed to user');

    // TEST 2: Student Login via Auth Gate & Dashboard Unlock
    console.log('\n--- TEST 2: Student Login via Auth Gate & Profile Persistence ---');
    await performLogin("ahmad.syahroni", "123456");
    await wait(200);

    const isAuthNow = await cdp.eval('window.app.isAuthenticated');
    assert(isAuthNow, 'User successfully authenticated via Strict Auth Gate');

    const isDashboardNow = await cdp.eval('window.app.view === "dashboard"');
    assert(isDashboardNow, 'Application full view unlocked to dashboard');
    await cdp.captureScreenshot('/tmp/dashboard_live_verified.png');

    const isHeaderVisibleNow = await cdp.eval('!document.getElementById("app-header").classList.contains("hidden")');
    assert(isHeaderVisibleNow, 'App navigation header revealed upon successful authentication');

    const studentHeaderName = await cdp.eval('document.getElementById("header-profile-btn").innerText.trim()');
    assert(studentHeaderName.includes('Ahmad Syahroni'), 'Header profile displays authenticated student name');

    // Student Profile customization & saveProfile test
    await cdp.eval(`
      window.app.saveProfile('Narong Sakda', 'Kelas 24-B (IMM Japan)', 'JFT-Basic A2');
    `);
    const savedProfile = await cdp.eval('JSON.parse(localStorage.getItem("choukai_student_profile"))');
    assert(savedProfile && savedProfile.name === 'Narong Sakda', 'Profile customized & saved in localStorage');

    const headerTextUpdated = await cdp.eval('document.getElementById("header-profile-btn").innerText.trim()');
    assert(headerTextUpdated.includes('Narong Sakda'), 'Header Profile reflects updated student name');

    // TEST 3: Modal Keyboard Accessibility (Escape Key Dismissal)
    console.log('\n--- TEST 3: Modal Keyboard Accessibility (Escape Key Dismissal) ---');
    await cdp.eval('window.app.openModal("onboarding")');
    let modalAfterOpen = await cdp.eval('window.app.activeModal');
    assert(modalAfterOpen === 'onboarding', 'Modal open confirmed');

    await cdp.eval(`
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape' }));
    `);
    let modalAfterEsc = await cdp.eval('window.app.activeModal');
    assert(modalAfterEsc === null, 'Modal closed on Escape key press');

    // TEST 4: Dashboard Catalog & PDF Access
    console.log('\n--- TEST 4: Dashboard Catalog & Dual PDF Access (Reading + Choukai) ---');
    const soalChoukaiPdf = await cdp.eval('(() => { const el = document.querySelector("a[href*=\'Soal%20Choukai%20Bab%2008.pdf\'], a[href*=\'Soal Choukai Bab 08.pdf\']"); return el ? el.getAttribute("href") : null; })()');
    const kunciChoukaiPdf = await cdp.eval('(() => { const el = document.querySelector("a[href*=\'Kunci%20dan%20Pembahasan%20Choukai%20Bab%2008.pdf\'], a[href*=\'Kunci dan Pembahasan Choukai Bab 08.pdf\']"); return el ? el.getAttribute("href") : null; })()');
    const soalReadingPdf = await cdp.eval('(() => { const el = document.querySelector("a[href*=\'Salinan%20Soal%20Bab%2008.pdf\'], a[href*=\'Salinan Soal Bab 08.pdf\']"); return el ? el.getAttribute("href") : null; })()');
    const kunciReadingPdf = await cdp.eval('(() => { const el = document.querySelector("a[href*=\'Kunci%20dan%20Pembahasan%20Bab%2008.pdf\'], a[href*=\'Kunci dan Pembahasan Bab 08.pdf\']"); return el ? el.getAttribute("href") : null; })()');
    assert(Boolean(soalChoukaiPdf && kunciChoukaiPdf && soalReadingPdf && kunciReadingPdf), 'Dashboard has all 4 PDF links (Reading Soal, Reading Kunci, Choukai Soal, Choukai Kunci)');

    // Verify local PDF files exist
    assert(
      fs.existsSync(path.join(WEB_DIR, decodeURI(soalChoukaiPdf.split('?')[0]))) &&
      fs.existsSync(path.join(WEB_DIR, decodeURI(kunciChoukaiPdf.split('?')[0]))) &&
      fs.existsSync(path.join(WEB_DIR, decodeURI(soalReadingPdf.split('?')[0]))) &&
      fs.existsSync(path.join(WEB_DIR, decodeURI(kunciReadingPdf.split('?')[0]))),
      'Local PDF files exist on disk'
    );

    // TEST 4B: Mode Selection Dialog (promptStartExam)
    console.log('\n--- TEST 4B: Mode Selection Dialog promptStartExam from Dashboard ---');
    await cdp.eval('window.app.goToDashboard()');
    await wait(200);

    // Call promptStartExam for Bab 08
    await cdp.eval('window.app.promptStartExam("08")');
    await wait(200);
    const activeModalMode = await cdp.eval('window.app.activeModal');
    assert(activeModalMode === 'mode_select', 'promptStartExam("08") opens mode_select modal dialog');

    const hasModalOverlay = await cdp.eval('Boolean(document.getElementById("modal-mode-select-overlay"))');
    assert(hasModalOverlay, 'Mode selection dialog overlay rendered in DOM');

    const modalTitleText = await cdp.eval('document.querySelector("#modal-mode-select-overlay h3")?.innerText.trim()');
    assert(modalTitleText.includes('Pilih Mode Ujian ｜ Bab 08'), `Modal header title is correct: ${modalTitleText}`);

    const hasOptRenshuu = await cdp.eval('Boolean(document.getElementById("modal-opt-renshuu"))');
    const hasOptShiken = await cdp.eval('Boolean(document.getElementById("modal-opt-shiken"))');
    assert(hasOptRenshuu && hasOptShiken, 'Dialog contains both interactive options (Mode Latihan & Mode Simulasi CBT)');

    // Check Bab 08 Shiken shows 60 Menit
    const shikenCardText08 = await cdp.eval('document.getElementById("modal-opt-shiken").innerText');
    assert(shikenCardText08.includes('60 Menit'), 'Bab 08 Shiken card displays 60 Menit timer duration');

    // Test dismiss/cancel via Batal button
    await cdp.eval('document.getElementById("modal-mode-cancel-btn").click()');
    await wait(150);
    const modalAfterCancel = await cdp.eval('window.app.activeModal');
    assert(modalAfterCancel === null, 'Mode selection dialog closed via Batal button');

    // Test promptStartExam for pure reading Bab 01 shows 50 Menit (test with number 1 to verify numeric handling)
    await cdp.eval('window.app.promptStartExam(1)');
    await wait(150);
    const modalTitleText01 = await cdp.eval('document.querySelector("#modal-mode-select-overlay h3")?.innerText.trim()');
    assert(modalTitleText01.includes('Pilih Mode Ujian ｜ Bab 01'), `Numeric input 1 opens Bab 01 dialog: ${modalTitleText01}`);
    const shikenCardText01 = await cdp.eval('document.getElementById("modal-opt-shiken").innerText');
    assert(shikenCardText01.includes('50 Menit'), 'Bab 01 Shiken card displays 50 Menit timer duration');

    // Test dismiss via Escape key
    await cdp.eval(`
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape' }));
    `);
    await wait(150);
    const modalAfterEscMode = await cdp.eval('window.app.activeModal');
    assert(modalAfterEscMode === null, 'Mode selection dialog closed via Escape key');

    // Test keyboard selection (Enter key on #modal-opt-shiken)
    await cdp.eval('window.app.promptStartExam(8)');
    await wait(150);
    await cdp.eval(`
      document.getElementById("modal-opt-shiken").dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
    `);
    await wait(300);
    const viewFromKeyLaunch = await cdp.eval('window.app.view');
    const modeFromKeyLaunch = await cdp.eval('window.app.mode');
    assert(viewFromKeyLaunch === 'exam', 'Exam started via keyboard Enter key on modal card');
    assert(modeFromKeyLaunch === 'shiken', 'Mode set to shiken via keyboard Enter key on modal card');

    // Return to dashboard and test click on #modal-opt-renshuu
    await cdp.eval('window.app.goToDashboard()');
    await wait(200);
    await cdp.eval('window.app.promptStartExam("08")');
    await wait(150);
    await cdp.eval('document.getElementById("modal-opt-renshuu").click()');
    await wait(300);

    const viewFromDialog = await cdp.eval('window.app.view');
    const modeFromDialog = await cdp.eval('window.app.mode');
    const modalClosedAfterLaunch = await cdp.eval('window.app.activeModal === null');
    assert(viewFromDialog === 'exam', 'Exam view started from mode selection dialog');
    assert(modeFromDialog === 'renshuu', 'Mode set to renshuu from mode selection dialog');
    assert(modalClosedAfterLaunch, 'Mode selection dialog closed upon exam launch');

    // Test programmatic startExam robustness with number and unpadded string
    await cdp.eval('window.app.startExam(1, "renshuu")');
    const b01NumTotal = await cdp.eval('window.app.currentChapter?.questions?.length');
    assert(b01NumTotal === 25, 'Programmatic startExam(1, "renshuu") resolves Bab 01 with 25 questions');
    await cdp.eval('window.app.startExam("1", "shiken")');
    const b01StrTotal = await cdp.eval('window.app.currentChapter?.questions?.length');
    assert(b01StrTotal === 25, 'Programmatic startExam("1", "shiken") resolves Bab 01 with 25 questions');

    // TEST 5: Start Exam in Mode Renshuu (33 Soal)
    console.log('\n--- TEST 5: Exam Mode Renshuu (33 Soal Tryout Terpadu) ---');
    await cdp.eval('window.app.startExam(BAB_08_DATA, "renshuu")');
    await wait(300);

    const currentView = await cdp.eval('window.app.view');
    const totalQuestions = await cdp.eval('window.app.currentChapter.questions.length');
    assert(currentView === 'exam', 'View changed to exam');
    assert(totalQuestions === 33, `Total tryout questions count is 33 (actual: ${totalQuestions})`);

    // Verify active mode badge & removal of mid-exam switcher buttons
    const modeBadgeText = await cdp.eval('document.getElementById("exam-mode-badge")?.innerText.trim()');
    assert(modeBadgeText.includes('Latihan'), 'Exam header displays active mode badge [練習 Latihan]');

    const hasResetSwitcher = await cdp.eval(`
      Array.from(document.querySelectorAll('#app button')).some(b => {
        const onclick = b.getAttribute('onclick') || '';
        return onclick.includes('startExam') && (b.innerText.includes('Simulasi CBT') || b.innerText.includes('Latihan'));
      })
    `);
    assert(!hasResetSwitcher, 'Mode switcher buttons cleanly removed from exam header to prevent accidental test reset');

    // Verify question subtitle (Romaji & translation) is removed during exam
    const questionTextContainer = await cdp.eval('document.getElementById("question-content-container").innerText');
    const hasQuestionRomajiOrId = questionTextContainer.includes("Kata sifat yang dicetak tebal") || questionTextContainer.includes("shinsetsu");
    assert(!hasQuestionRomajiOrId, 'Question in-exam subtitle (Romaji & ID) removed');

    // Verify option labels free of duplicate circle symbols
    const optLabels = await cdp.eval(`
      Array.from(document.querySelectorAll('.option-btn .text-left .font-jp')).map(el => el.innerText.trim())
    `);
    const hasDuplicateSymbols = optLabels.some(l => /^[①②③④]/.test(l));
    assert(!hasDuplicateSymbols, 'Free of duplicate circle symbols');

    // Verify Audio Player is hidden on Reading Question (Q1)
    const isAudioHiddenOnReading = await cdp.eval('document.getElementById("audio-player-wrapper").classList.contains("hidden")');
    assert(isAudioHiddenOnReading, 'Audio player console hidden on Reading questions');

    // TEST 6: Session Navigation to Choukai (Q26)
    console.log('\n--- TEST 6: Session Navigation to Choukai (Soal 26) ---');
    await cdp.eval('window.app.goToSession("choukai")');
    await wait(300);

    const currentQIdx = await cdp.eval('window.app.currentQuestionIdx');
    const currentQId = await cdp.eval('window.app.getCurrentQuestion().id');
    const currentQSession = await cdp.eval('window.app.getCurrentQuestion().session');
    assert(currentQIdx === 25 && currentQId === 26 && currentQSession === 'choukai', 'Navigated to Choukai session: Idx = 25, Soal ID = 26, Session = choukai');

    // Verify Audio Player is visible on Choukai Question (Q26)
    const isAudioVisibleOnChoukai = await cdp.eval('!document.getElementById("audio-player-wrapper").classList.contains("hidden")');
    const hasPlayAudioBtn = await cdp.eval('document.querySelector("#question-content-container button[title*=\'Putar audio\']") !== null');
    assert(isAudioVisibleOnChoukai, 'Audio player console visible on Choukai questions');
    assert(hasPlayAudioBtn, 'Question 26 has "Putar Audio" button');

    // TEST 7: Audio Seek on Choukai Question (with metadata wait)
    console.log('\n--- TEST 7: Audio Seek on Choukai Question (Q26) ---');
    await cdp.eval(`
      new Promise((resolve) => {
        if (window.app.audio.readyState >= 1 && !isNaN(window.app.audio.duration)) return resolve(true);
        window.app.audio.addEventListener('loadedmetadata', () => resolve(true), { once: true });
        setTimeout(() => resolve(false), 3000);
      })
    `);
    await cdp.eval('window.app.seekAudio(10.0)');
    await wait(250);
    const audioTime = await cdp.eval('window.app.audio.currentTime');
    assert(audioTime >= 9.0, `Audio jumped to timestamp (10.0s, actual: ${audioTime.toFixed(1)}s)`);

    // TEST 7B: Audio Playback Speed Standard (0.8x Tempo Baseline as 1.0x Default & Speed Cycle)
    console.log('\n--- TEST 7B: Audio Playback Speed Standard (0.8x Baseline & Pitch Preservation) ---');
    const initUiRate = await cdp.eval('window.app.playbackRate');
    const initAudioRate = await cdp.eval('window.app.audio.playbackRate');
    const initDefaultRate = await cdp.eval('window.app.audio.defaultPlaybackRate');
    const pitchPreserved = await cdp.eval('window.app.audio.preservesPitch');
    const speedBtnText = await cdp.eval('document.getElementById("audio-speed-btn") ? document.getElementById("audio-speed-btn").innerText.trim() : ""');
    const speedBtnTitle = await cdp.eval('document.getElementById("audio-speed-btn") ? document.getElementById("audio-speed-btn").getAttribute("title") : ""');

    assert(initUiRate === 1.0, `UI playback rate is default 1.0x (actual: ${initUiRate})`);
    assert(initAudioRate === 0.8, `Effective audio rate is 0.8x comfortable tempo (actual: ${initAudioRate})`);
    assert(initDefaultRate === 0.8, `Audio defaultPlaybackRate is 0.8 (actual: ${initDefaultRate})`);
    assert(pitchPreserved === true, `Audio preservesPitch is set to true for natural human tone`);
    assert(speedBtnText === '1.0x', `Speed button badge displays "1.0x" (actual: "${speedBtnText}")`);
    assert(speedBtnTitle.includes('Tempo Standar 0.8x'), `Speed button title has descriptive label: "${speedBtnTitle}"`);

    // Cycle 1: 1.0x -> 0.8x (Effective 0.65x slow)
    await cdp.eval('window.app.cyclePlaybackRate()');
    const cycle1Ui = await cdp.eval('window.app.playbackRate');
    const cycle1Audio = await cdp.eval('window.app.audio.playbackRate');
    const cycle1Title = await cdp.eval('document.getElementById("audio-speed-btn").getAttribute("title")');
    assert(cycle1Ui === 0.8 && cycle1Audio === 0.65, `Cycled to 0.8x (UI: ${cycle1Ui}, Audio: ${cycle1Audio})`);
    assert(cycle1Title.includes('0.65x'), 'Cycle 1 tooltip updated to show 0.65x');

    // Cycle 2: 0.8x -> 1.2x (Effective 1.0x native fast)
    await cdp.eval('window.app.cyclePlaybackRate()');
    const cycle2Ui = await cdp.eval('window.app.playbackRate');
    const cycle2Audio = await cdp.eval('window.app.audio.playbackRate');
    const cycle2Title = await cdp.eval('document.getElementById("audio-speed-btn").getAttribute("title")');
    assert(cycle2Ui === 1.2 && cycle2Audio === 1.0, `Cycled to 1.2x (UI: ${cycle2Ui}, Audio: ${cycle2Audio})`);
    assert(cycle2Title.includes('1.0x'), 'Cycle 2 tooltip updated to show 1.0x');

    // Cycle 3: 1.2x -> 1.0x (Effective 0.8x default comfortable tempo)
    await cdp.eval('window.app.cyclePlaybackRate()');
    const cycle3Ui = await cdp.eval('window.app.playbackRate');
    const cycle3Audio = await cdp.eval('window.app.audio.playbackRate');
    assert(cycle3Ui === 1.0 && cycle3Audio === 0.8, `Cycled back to 1.0x default (UI: ${cycle3Ui}, Audio: ${cycle3Audio})`);

    // Robust parsing check (string input)
    await cdp.eval('window.app.setPlaybackRate("0.8")');
    const strAudioRate = await cdp.eval('window.app.audio.playbackRate');
    assert(strAudioRate === 0.65, 'String rate input "0.8" parses correctly to effective 0.65x');
    await cdp.eval('window.app.setPlaybackRate(1.0)');

    // TEST 8: Full Exam Completion (Q1 to Q33)
    console.log('\n--- TEST 8: Full Exam Completion across all 33 Questions ---');
    // 25 Reading questions + 8 Choukai questions
    const correctAnswers = {
      1: "B", 2: "C", 3: "A", 4: "D", 5: "B", 6: "C", 7: "A",
      8: "D", 9: "B", 10: "C", 11: "A", 12: "D", 13: "B",
      14: "C", 15: "A", 16: "D", 17: "B", 18: "A", 19: "C", 20: "D",
      21: "B", 22: "C", 23: "A", 24: "A", 25: "A",
      26: "3", 27: "4", 28: "2", 29: "2", 30: "3", 31: "2", 32: "3", 33: "3"
    };

    for (let i = 1; i <= 33; i++) {
      await cdp.eval(`window.app.selectOption(${i}, "${correctAnswers[i]}")`);
    }

    const answeredCount = await cdp.eval('Object.keys(window.app.answers).length');
    assert(answeredCount === 33, 'All 33 questions answered');
    await wait(800);

    // TEST 9: Submission & Result Scoring Engine
    console.log('\n--- TEST 9: Submission & Dual Result Scoring Engine ---');
    await cdp.eval('window.app.submitExam()');
    await wait(400);

    const resultView = await cdp.eval('window.app.view');
    const finalScore = await cdp.eval('window.app.currentResult.score');
    const readingScore = await cdp.eval('window.app.currentResult.readingScore');
    const choukaiScore = await cdp.eval('window.app.currentResult.choukaiScore');
    const passedVal = await cdp.eval('window.app.currentResult.passed');

    assert(resultView === 'result', 'View switched to result');
    assert(readingScore === 100, 'Reading Score (Sesi 1): 100 / 100');
    assert(choukaiScore === 100, 'Choukai Score (Sesi 2): 100 / 100');
    assert(finalScore === 100, 'Final Score (Rata-rata): 100 / 100');
    assert(passedVal === true, 'Exam status passed');

    const hasWrongSection = await cdp.eval('document.body.innerText.includes("Butir Soal Perlu Evaluasi")');
    const hasCorrectSection = await cdp.eval('document.body.innerText.includes("Butir Soal Berhasil Dikuasai")');
    assert(hasWrongSection, 'Result view has prioritized evaluation section (Top)');
    assert(hasCorrectSection, 'Result view has separated mastered section (Bottom)');

    // TEST 9B: Edge Case - Partial Scoring & Remedial Status Calculation
    console.log('\n--- TEST 9B: Partial Scoring & Remedial Evaluation Engine ---');
    // Simulate: 20 Reading correct (80.0), 6 Choukai correct (75.0) -> Total 77.5 (REMEDIAL)
    await cdp.eval(`
      window.app.startExam(BAB_08_DATA, "renshuu");
      for (let i = 1; i <= 20; i++) window.app.selectOption(i, "${correctAnswers[1]}"); // some correct
      // Leave Q21-25 unanswered
      for (let i = 26; i <= 31; i++) window.app.selectOption(i, "${correctAnswers[26]}");
      // Q32-33 wrong
      window.app.selectOption(32, "1");
      window.app.selectOption(33, "1");
      window.app.submitExam();
    `);
    const partialScore = await cdp.eval('window.app.currentResult.score');
    const isRemedial = await cdp.eval('!window.app.currentResult.passed');
    const hasRemedialBadge = await cdp.eval('document.body.innerText.includes("REMEDIAL / BELUM LULUS")');
    assert(partialScore < 80.0, `Partial Score calculated: ${partialScore.toFixed(1)}`);
    assert(isRemedial, 'Remedial status verified (below passing 80.0)');
    assert(hasRemedialBadge, 'Remedial badge displayed in UI');

    // Restore 100% full exam result for WhatsApp and Review tests
    for (let i = 1; i <= 33; i++) {
      await cdp.eval(`window.app.selectOption(${i}, "${correctAnswers[i]}")`);
    }
    await cdp.eval('window.app.submitExam()');

    // TEST 10: WhatsApp Report Dispatcher Verification
    console.log('\n--- TEST 10: WhatsApp Report Dispatcher Verification ---');
    await cdp.eval(`
      window.__lastOpenedUrl = null;
      window.open = function(url) { window.__lastOpenedUrl = url; };
      window.app.shareResultWhatsApp();
    `);

    const waUrl = await cdp.eval('window.__lastOpenedUrl');
    assert(Boolean(waUrl), 'WhatsApp API URL called');
    const decodedWaText = decodeURIComponent(waUrl.split('text=')[1] || '');
    assert(decodedWaText.includes('Narong Sakda'), 'WhatsApp text contains student name');
    assert(decodedWaText.includes('Skor Reading'), 'WhatsApp text contains Skor Reading');
    assert(decodedWaText.includes('Skor Choukai'), 'WhatsApp text contains Skor Choukai');
    assert(decodedWaText.includes('100.0 / 100'), 'WhatsApp text contains score 100.0');
    assert(decodedWaText.includes('LULUS (合格)'), 'WhatsApp text contains LULUS (合格)');
    assert(decodedWaText.includes('Latihan Mandiri'), 'WhatsApp text in Renshuu mode has Latihan Mandiri');
    assert(!decodedWaText.includes('Resmi'), 'WhatsApp text in Renshuu mode is free of "Resmi"');

    // Test WhatsApp Report in Shiken mode (Simulasi CBT)
    await cdp.eval(`
      window.app.currentResult.mode = 'shiken';
      window.__lastOpenedUrl = null;
      window.app.shareResultWhatsApp();
    `);
    const waShikenUrl = await cdp.eval('window.__lastOpenedUrl');
    const decodedShikenWaText = decodeURIComponent(waShikenUrl.split('text=')[1] || '');
    assert(decodedShikenWaText.includes('Mode:* Simulasi CBT'), 'WhatsApp text in Shiken mode displays Simulasi CBT');
    assert(!decodedShikenWaText.includes('Resmi'), 'WhatsApp text in Shiken mode is free of "Resmi"');

    // TEST 11: PDF Access on Result Page
    console.log('\n--- TEST 11: PDF Access on Result Page ---');
    const resultPdfSoalChoukai = await cdp.eval('(() => { const el = document.querySelector("a[href*=\'Soal%20Choukai%20Bab%2008.pdf\'], a[href*=\'Soal Choukai Bab 08.pdf\']"); return el ? el.getAttribute("href") : null; })()');
    const resultPdfKunciChoukai = await cdp.eval('(() => { const el = document.querySelector("a[href*=\'Kunci%20dan%20Pembahasan%20Choukai%20Bab%2008.pdf\'], a[href*=\'Kunci dan Pembahasan Choukai Bab 08.pdf\']"); return el ? el.getAttribute("href") : null; })()');
    const resultPdfSoalReading = await cdp.eval('(() => { const el = document.querySelector("a[href*=\'Salinan%20Soal%20Bab%2008.pdf\'], a[href*=\'Salinan Soal Bab 08.pdf\']"); return el ? el.getAttribute("href") : null; })()');
    const resultPdfKunciReading = await cdp.eval('(() => { const el = document.querySelector("a[href*=\'Kunci%20dan%20Pembahasan%20Bab%2008.pdf\'], a[href*=\'Kunci dan Pembahasan Bab 08.pdf\']"); return el ? el.getAttribute("href") : null; })()');
    assert(Boolean(resultPdfSoalChoukai), 'Result page Choukai Soal PDF button present');
    assert(Boolean(resultPdfKunciChoukai), 'Result page Choukai Kunci PDF button present');
    assert(Boolean(resultPdfSoalReading), 'Result page Reading Soal PDF button present');
    assert(Boolean(resultPdfKunciReading), 'Result page Reading Kunci PDF button present');

    // TEST 11B: Dashboard Saved Result Restoration & "Lihat Hasil" Feature
    console.log('\n--- TEST 11B: Dashboard Saved Result Restoration ("Lihat Hasil") ---');
    await cdp.eval('window.app.view = "dashboard"; window.app.render();');
    await wait(200);
    const hasLihatHasilBtn = await cdp.eval('document.querySelector("button[onclick*=\'viewSavedResult\']") !== null');
    assert(hasLihatHasilBtn, 'Dashboard shows "Lihat Hasil" button for completed exam');
    await cdp.eval('window.app.viewSavedResult("08")');
    await wait(200);
    const restoredView = await cdp.eval('window.app.view');
    const restoredReadingCorrect = await cdp.eval('window.app.currentResult.readingCorrect');
    assert(restoredView === 'result', 'viewSavedResult navigated back to result page');
    assert(restoredReadingCorrect === 25, 'Saved result preserves readingCorrect count (25)');

    // TEST 11C: Audio Review Toggle on Result Page
    console.log('\n--- TEST 11C: Audio Review Toggle on Result Page ---');
    await cdp.eval('window.app.toggleResultAudio(26)');
    await wait(250);
    const isAudioPlaying = await cdp.eval('window.app.isPlaying');
    assert(isAudioPlaying, 'toggleResultAudio starts playback in review mode');

    // Verify handleAudioEnded while in Result view does not trigger countdown or switch view
    await cdp.eval('window.app.handleAudioEnded()');
    const viewAfterEnded = await cdp.eval('window.app.view');
    const autoNextActive = await cdp.eval('Boolean(window.app.autoNextInterval)');
    assert(viewAfterEnded === 'result', 'View stays on result view when audio ends during review');
    assert(!autoNextActive, 'Auto-next countdown is prevented on result review screen');

    await cdp.eval('window.app.toggleResultAudio(26)');
    await wait(150);
    const isAudioPaused = await cdp.eval('!window.app.isPlaying');
    assert(isAudioPaused, 'toggleResultAudio pauses playback in review mode');

    // TEST 12: Mode Shiken (Countdown Timer 60:00)
    console.log('\n--- TEST 12: Mode Shiken (Countdown Timer 60:00) ---');
    await cdp.eval('window.app.startExam(BAB_08_DATA, "shiken")');
    await wait(300);

    const shikenBadgeText = await cdp.eval('document.getElementById("exam-mode-badge")?.innerText.trim()');
    assert(shikenBadgeText.includes('試験 Ujian CBT'), 'Exam header displays active mode badge [試験 Ujian CBT] in Shiken mode');

    const timerText = await cdp.eval('document.getElementById("exam-timer-display").innerText.trim()');
    assert(timerText === '60:00', `Countdown timer active in Shiken mode: ${timerText}`);

    // TEST 13: Dark / Light Theme Toggle
    console.log('\n--- TEST 13: Dark / Light Mode Toggle Verification ---');
    await cdp.eval('window.app.toggleTheme()');
    const darkTheme = await cdp.eval('document.documentElement.getAttribute("data-theme")');
    assert(darkTheme === 'dark', 'Dark mode activated');

    await cdp.eval('window.app.toggleTheme()');
    const lightTheme = await cdp.eval('document.documentElement.getAttribute("data-theme")');
    assert(lightTheme === 'light', 'Light mode restored');

    // TEST 14: Capture Verification Screenshot
    const screenshotPath = '/tmp/cbt_verification_result.png';
    await cdp.eval('window.app.view = "result"; window.app.render();');
    await wait(300);
    await cdp.captureScreenshot(screenshotPath);
    assert(fs.existsSync(screenshotPath), `High-resolution verification screenshot captured at: ${screenshotPath}`);

    // TEST 15: Mobile Viewport Ergonomics & Touch Target Inspection (375x812)
    console.log('\n--- TEST 15: Mobile Viewport Ergonomics & Touch Target Verification (375px) ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await cdp.eval('window.app.view = "exam"; window.app.render();');
    await wait(300);

    const mobileScrollWidth = await cdp.eval('document.documentElement.scrollWidth');
    const mobileClientWidth = await cdp.eval('document.documentElement.clientWidth');
    assert(mobileScrollWidth <= mobileClientWidth, 'No horizontal page overflow on 375px mobile viewport');

    const minTouchHeight = await cdp.eval(`
      Math.min(...Array.from(document.querySelectorAll('.option-btn')).map(el => el.getBoundingClientRect().height))
    `);
    assert(minTouchHeight >= 44, `Option touch targets meet ergonomics requirement (>= 44px): ${minTouchHeight}px`);

    const mobileScreenshotPath = '/tmp/cbt_verification_mobile_375.png';
    await cdp.captureScreenshot(mobileScreenshotPath);
    assert(fs.existsSync(mobileScreenshotPath), `Mobile viewport screenshot captured at: ${mobileScreenshotPath}`);

    // Reset viewport for desktop testing
    await cdp.send('Emulation.clearDeviceMetricsOverride');
    await cdp.eval('window.app.view = "dashboard"; window.app.render();');
    await wait(200);

    // TEST 16: Catalog and Index for All 25 Chapters (Bab 01 s.d. Bab 25)
    console.log('\n--- TEST 16: Catalog and Index for All 25 Chapters (Bab 01 s.d. Bab 25) ---');
    const indexLength = await cdp.eval('window.CHAPTERS_INDEX.length');
    assert(indexLength === 25, `CHAPTERS_INDEX contains 25 chapters (actual: ${indexLength})`);

    for (let b = 1; b <= 25; b++) {
      const bStr = String(b).padStart(2, '0');
      const chInfo = await cdp.eval(`window.CHAPTERS_INDEX.find(c => c.num === "${bStr}")`);
      assert(chInfo && chInfo.available === true, `Bab ${bStr} is marked available: true`);
      const isChoukaiChapter = (b >= 8 && b <= 25);
      const expTotal = isChoukaiChapter ? 33 : 25;
      const expChoukai = isChoukaiChapter ? 8 : 0;
      assert(chInfo.totalQuestions === expTotal, `Bab ${bStr} totalQuestions === ${expTotal}`);
      assert(chInfo.choukaiQuestions === expChoukai, `Bab ${bStr} choukaiQuestions === ${expChoukai}`);

      // Verify PDF files exist on disk
      const soalPdfPath = path.join(WEB_DIR, `assets/pdf/Salinan Soal Bab ${bStr}.pdf`);
      const kunciPdfPath = path.join(WEB_DIR, `assets/pdf/Kunci dan Pembahasan Bab ${bStr}.pdf`);
      assert(fs.existsSync(soalPdfPath) && fs.existsSync(kunciPdfPath), `Bab ${bStr} Reading PDF files exist on disk`);
      if (isChoukaiChapter) {
        const soalChoukaiPath = path.join(WEB_DIR, `assets/pdf/Soal Choukai Bab ${bStr}.pdf`);
        const kunciChoukaiPath = path.join(WEB_DIR, `assets/pdf/Kunci dan Pembahasan Choukai Bab ${bStr}.pdf`);
        assert(fs.existsSync(soalChoukaiPath) && fs.existsSync(kunciChoukaiPath), `Bab ${bStr} Choukai PDF files exist on disk`);
      }
    }

    // TEST 17: Bab 01 Exam Simulation (50:00, Audio Hidden, Clean Format)
    console.log('\n--- TEST 17: Bab 01 Exam Simulation (50:00, Audio Hidden, Clean Format) ---');
    await cdp.eval('window.app.startExam("01", "shiken")');
    await wait(300);

    const b1View = await cdp.eval('window.app.view');
    const b1Total = await cdp.eval('window.app.currentChapter.questions.length');
    assert(b1View === 'exam', 'Bab 01 view is exam');
    assert(b1Total === 25, `Bab 01 has exactly 25 questions (actual: ${b1Total})`);

    const b1Timer = await cdp.eval('document.getElementById("exam-timer-display").innerText.trim()');
    assert(b1Timer === '50:00', `Bab 01 countdown timer starts at 50:00 (actual: ${b1Timer})`);

    const b1AudioHidden = await cdp.eval('document.getElementById("audio-player-wrapper").classList.contains("hidden")');
    assert(b1AudioHidden, 'Audio player console automatically hidden on pure reading Bab 01');

    const hasChoukaiNavBtn = await cdp.eval('Array.from(document.querySelectorAll("#question-nav-container button")).some(b => b.innerText.includes("Choukai"))');
    assert(!hasChoukaiNavBtn, 'Choukai session button hidden for pure reading Bab 01');

    // Test Question 21 has image
    await cdp.eval('window.app.goToQuestion(20)');
    await wait(200);
    const q21Type = await cdp.eval('window.app.getCurrentQuestion().type');
    const q21ImgSrc = await cdp.eval('window.app.getCurrentQuestion().image');
    assert(q21Type === 'gambar' && Boolean(q21ImgSrc), 'Bab 01 Question 21 is visual illustration question');
    assert(fs.existsSync(path.join(WEB_DIR, q21ImgSrc)), `Question 21 image file exists on disk: ${q21ImgSrc}`);

    // TEST 18: Bab 01 Exam Completion & Scoring (25 Soal x 4.0 = 100.0 Poin)
    console.log('\n--- TEST 18: Bab 01 Exam Completion & Scoring (25 Soal x 4.0 = 100.0 Poin) ---');
    await cdp.eval(`
      const qList = window.CHAPTERS_DATA["01"].questions;
      qList.forEach(q => {
        window.app.selectOption(q.id, q.correctAnswer);
      });
      window.app.submitExam();
    `);
    await wait(300);

    const b1ResultView = await cdp.eval('window.app.view');
    const b1Score = await cdp.eval('window.app.currentResult.score');
    const b1ReadingScore = await cdp.eval('window.app.currentResult.readingScore');
    const b1Passed = await cdp.eval('window.app.currentResult.passed');
    const b1ChoukaiTotal = await cdp.eval('window.app.currentResult.choukaiTotal');

    assert(b1ResultView === 'result', 'Bab 01 switched to result view');
    assert(b1ReadingScore === 100.0, 'Bab 01 Reading Score is 100.0');
    assert(b1Score === 100.0, 'Bab 01 Final Score is 100.0');
    assert(b1Passed === true, 'Bab 01 Passed status is true');
    assert(b1ChoukaiTotal === 0, 'Bab 01 Choukai Total is 0');

    // Result view displays Reading card with 4.0 poin per soal
    const resultCardText = await cdp.eval('document.body.innerText');
    assert(resultCardText.includes('Bobot 4.0 Poin / Soal'), 'Result view displays Bobot 4.0 Poin / Soal');

    // Result view displays Question 21 thumbnail image in review card
    const hasQ21ResultImg = await cdp.eval('Boolean(document.querySelector("img[src*=\'reading_q21.jpeg\']"))');
    assert(hasQ21ResultImg, 'Result view displays Question 21 visual illustration thumbnail');

    // Result view displays option pills
    const hasOptionPills = await cdp.eval('document.body.innerText.includes("✓ Kunci")');
    assert(hasOptionPills, 'Result view displays option pills with highlighted key');

    // Perfect score banner reflects 25 questions, NOT 33
    const perfectScoreText = await cdp.eval('document.body.innerText');
    assert(perfectScoreText.includes('25 butir soal (Reading)') && !perfectScoreText.includes('33 butir soal'), 'Perfect score banner shows exactly 25 butir soal (not 33)');

    // Result view has PDF links for Bab 01
    const resPdfSoal01 = await cdp.eval('(() => { const el = document.querySelector("a[href*=\'Salinan%20Soal%20Bab%2001.pdf\'], a[href*=\'Salinan Soal Bab 01.pdf\']"); return el ? el.getAttribute("href") : null; })()');
    const resPdfKunci01 = await cdp.eval('(() => { const el = document.querySelector("a[href*=\'Kunci%20dan%20Pembahasan%20Bab%2001.pdf\'], a[href*=\'Kunci dan Pembahasan Bab 01.pdf\']"); return el ? el.getAttribute("href") : null; })()');
    assert(Boolean(resPdfSoal01 && resPdfKunci01), 'Result view displays Bab 01 PDF download buttons');

    // Bab 01 WhatsApp message format (pure reading)
    await cdp.eval(`
      window.__lastOpenedUrl = null;
      window.app.shareResultWhatsApp();
    `);
    const b1WaUrl = await cdp.eval('window.__lastOpenedUrl');
    assert(Boolean(b1WaUrl), 'Bab 01 WhatsApp API URL called');
    const b1WaText = decodeURIComponent(b1WaUrl.split('text=')[1] || '');
    assert(b1WaText.includes('UJIAN TULIS'), 'Bab 01 WhatsApp title is UJIAN TULIS');
    assert(b1WaText.includes('Skor Ujian Tulis (Reading)'), 'Bab 01 WhatsApp message includes Skor Ujian Tulis');
    assert(!b1WaText.includes('Skor Choukai'), 'Bab 01 WhatsApp message is free of Skor Choukai');
    assert(b1WaText.includes('Bobot 4.0 Poin/Soal'), 'Bab 01 WhatsApp message includes Bobot 4.0 Poin/Soal');

    // TEST 19: Full Sweep of All Pure Reading Chapters
    console.log('\n--- TEST 19: Full Sweep of All Pure Reading Chapters ---');
    const readingSweepChapters = [2, 3, 4, 5, 6, 7];
    for (const b of readingSweepChapters) {
      const bStr = String(b).padStart(2, '0');
      await cdp.eval(`(async () => {
        await window.app.startExam("${bStr}", "renshuu");
        const ch = window.CHAPTERS_DATA["${bStr}"];
        ch.questions.forEach(q => {
          window.app.selectOption(q.id, q.correctAnswer);
        });
        await window.app.submitExam();
      })()`);
      await wait(300);

      const chScore = await cdp.eval('window.app.currentResult.score');
      const chPassed = await cdp.eval('window.app.currentResult.passed');
      assert(chScore === 100.0 && chPassed === true, `Bab ${bStr} scored 100.0 and passed`);

      // Verify images exist on disk for Q21 and Q22
      const img21Path = path.join(WEB_DIR, `assets/bab_${bStr}/reading_q21.jpeg`);
      const img22Path = path.join(WEB_DIR, `assets/bab_${bStr}/reading_q22.jpeg`);
      assert(fs.existsSync(img21Path) && fs.existsSync(img22Path), `Bab ${bStr} Q21 & Q22 image files exist on disk`);
    }

    // TEST 19B: Bab 09 s.d. Bab 25 Tryout Terpadu (33 Soal, Timer 60:00, Audio Player & Dual Scoring)
    console.log('\n--- TEST 19B: Bab 09 s.d. Bab 25 Tryout Terpadu (33 Soal, Timer 60:00 & Audio Player) ---');
    const all33Chapters = [];
    for (let i = 9; i <= 25; i++) all33Chapters.push(String(i).padStart(2, '0'));
    for (const bStr of all33Chapters) {
      // 1. Shiken mode starts with 60:00 timer
      await cdp.eval(`window.app.startExam("${bStr}", "shiken")`);
      await wait(200);
      const timerDisplay = await cdp.eval('document.getElementById("exam-timer-display").innerText.trim()');
      const totalQ = await cdp.eval('window.app.currentChapter.questions.length');
      assert(timerDisplay === '60:00', `Bab ${bStr} Shiken timer initialized to 60:00 (actual: ${timerDisplay})`);
      assert(totalQ === 33, `Bab ${bStr} has exactly 33 questions (actual: ${totalQ})`);

      // 2. Choukai session navigates to Q26 with visible audio player
      await cdp.eval('window.app.goToSession("choukai")');
      await wait(200);
      const curQId = await cdp.eval('window.app.getCurrentQuestion().id');
      const audioVisible = await cdp.eval('!document.getElementById("audio-player-wrapper").classList.contains("hidden")');
      const qUiRate = await cdp.eval('window.app.playbackRate');
      const qAudioRate = await cdp.eval('window.app.audio.playbackRate');
      const qPitch = await cdp.eval('window.app.audio.preservesPitch');
      assert(curQId === 26, `Bab ${bStr} navigated to Choukai Question 26`);
      assert(audioVisible, `Bab ${bStr} audio player console is active and visible on Choukai question`);
      assert(qUiRate === 1.0, `Bab ${bStr} UI playback rate is default 1.0x`);
      assert(qAudioRate === 0.8, `Bab ${bStr} audio plays at comfortable 0.8x tempo baseline`);
      assert(qPitch === true, `Bab ${bStr} audio pitch preservation is enabled`);
      const audioSrcInApp = await cdp.eval('window.app.audio.src');
      assert(audioSrcInApp.includes('?v=56'), `Bab ${bStr} Q26 audio src includes cache buster ?v=56 (actual: ${audioSrcInApp})`);

      // 3. Complete all 33 questions and submit
      await cdp.eval(`(async () => {
        const ch = window.CHAPTERS_DATA["${bStr}"];
        ch.questions.forEach(q => {
          window.app.selectOption(q.id, q.correctAnswer);
        });
        await window.app.submitExam();
      })()`);
      await wait(300);

      // 3. Verify Result View PDF download links for Choukai and Reading
      const resPdfSoalChoukai = await cdp.eval(`document.querySelector("a[href*='Soal%20Choukai%20Bab%20${bStr}.pdf'], a[href*='Soal Choukai Bab ${bStr}.pdf']") ? true : false`);
      const resPdfKunciChoukai = await cdp.eval(`document.querySelector("a[href*='Kunci%20dan%20Pembahasan%20Choukai%20Bab%20${bStr}.pdf'], a[href*='Kunci dan Pembahasan Choukai Bab ${bStr}.pdf']") ? true : false`);
      const resPdfSoalReading = await cdp.eval(`document.querySelector("a[href*='Salinan%20Soal%20Bab%20${bStr}.pdf'], a[href*='Salinan Soal Bab ${bStr}.pdf']") ? true : false`);
      const resPdfKunciReading = await cdp.eval(`document.querySelector("a[href*='Kunci%20dan%20Pembahasan%20Bab%20${bStr}.pdf'], a[href*='Kunci dan Pembahasan Bab ${bStr}.pdf']") ? true : false`);
      assert(resPdfSoalChoukai, `Bab ${bStr} Result view displays Soal Choukai PDF download link`);
      assert(resPdfKunciChoukai, `Bab ${bStr} Result view displays Kunci Choukai PDF download link`);
      assert(resPdfSoalReading, `Bab ${bStr} Result view displays Salinan Soal Reading PDF download link`);
      assert(resPdfKunciReading, `Bab ${bStr} Result view displays Kunci Reading PDF download link`);

      // 4. Verify Chapter Metadata in CHAPTERS_DATA
      const chTotal = await cdp.eval(`window.CHAPTERS_DATA["${bStr}"].totalQuestions`);
      const chChoukaiCount = await cdp.eval(`window.CHAPTERS_DATA["${bStr}"].choukaiCount`);
      const chAudioSrc = await cdp.eval(`window.CHAPTERS_DATA["${bStr}"].audioSrc`);
      assert(chTotal === 33, `Bab ${bStr} CHAPTERS_DATA.totalQuestions is 33`);
      assert(chChoukaiCount === 8, `Bab ${bStr} CHAPTERS_DATA.choukaiCount is 8`);
      assert(chAudioSrc && chAudioSrc.includes(`Choukai_Bab_${bStr}.mp3`), `Bab ${bStr} CHAPTERS_DATA.audioSrc is valid`);
    }

    // TEST 19C: Rapid Switching Between Choukai and Reading While Audio Playing
    console.log('\n--- TEST 19C: Rapid Audio-Reading Session Switching Ergonomics ---');
    await cdp.eval('window.app.startExam("10", "shiken")');
    await wait(200);
    await cdp.eval('window.app.goToSession("choukai")');
    await wait(150);
    await cdp.eval('window.app.playAudio()');
    await wait(100);
    // Rapidly switch to Reading Q1
    await cdp.eval('window.app.goToQuestion(0)');
    await wait(100);
    const isPlayingAfterSwitch = await cdp.eval('window.app.isPlaying');
    const audioWrapperHidden = await cdp.eval('document.getElementById("audio-player-wrapper").classList.contains("hidden")');
    assert(!isPlayingAfterSwitch, 'Audio consistently paused upon rapid switch to Reading question');
    assert(audioWrapperHidden, 'Audio player console cleanly hidden on Reading question');

    // Switch back to Choukai Q27
    await cdp.eval('window.app.goToQuestion(26)');
    await wait(100);
    const audioWrapperVisible = await cdp.eval('!document.getElementById("audio-player-wrapper").classList.contains("hidden")');
    assert(audioWrapperVisible, 'Audio player console cleanly restored upon returning to Choukai question');

    // TEST 20: Switch Back to Bab 08 & Verify Audio Reactivates
    console.log('\n--- TEST 20: Switch Back to Bab 08 & Verify Audio Reactivates ---');
    await cdp.eval('window.app.startExam(BAB_08_DATA, "renshuu")');
    await wait(200);
    await cdp.eval('window.app.goToSession("choukai")');
    await wait(200);

    const b8AudioVisible = await cdp.eval('!document.getElementById("audio-player-wrapper").classList.contains("hidden")');
    assert(b8AudioVisible, 'Audio player console reactivates on Bab 08 Choukai session');

    // TEST 21: Auto-submit on Countdown Expiration in Shiken Mode
    console.log('\n--- TEST 21: Auto-submit on Countdown Expiration in Shiken Mode ---');
    await cdp.eval(`
      window.__alertMessage = null;
      window.alert = function(msg) { window.__alertMessage = msg; };
      window.app.startExam("01", "shiken");
    `);
    await wait(150);
    const initialTimer = await cdp.eval('window.app.timerSeconds');
    assert(initialTimer === 3000, `Bab 01 Shiken timer initialized to 50:00 (actual: ${initialTimer}s)`);
    // Simulate expiring timer
    await cdp.eval('window.app.timerSeconds = 1');
    await wait(1200);
    const alertMsg = await cdp.eval('window.__alertMessage');
    assert(Boolean(alertMsg && alertMsg.includes('Waktu ujian telah berakhir')), 'Alert dialog triggered informing student of time expiration');
    const autoSubmitView = await cdp.eval('window.app.view');
    const timerIntervalStatus = await cdp.eval('window.app.timerInterval === null');
    assert(autoSubmitView === 'result', 'Exam auto-submitted to result view when timer expired');
    assert(timerIntervalStatus, 'Timer interval cleanly cleared on expiration');

    // TEST 22: Clean Timer Termination on Dashboard Return
    console.log('\n--- TEST 22: Clean Timer Termination on Dashboard Return ---');
    await cdp.eval('window.app.startExam("01", "shiken")');
    await wait(100);
    const timerRunning = await cdp.eval('Boolean(window.app.timerInterval)');
    assert(timerRunning, 'Timer is active in Shiken mode');
    await cdp.eval('window.app.goToDashboard()');
    await wait(100);
    const dashboardView = await cdp.eval('window.app.view');
    const timerStopped = await cdp.eval('window.app.timerInterval === null');
    assert(dashboardView === 'dashboard', 'Navigated back to dashboard');
    assert(timerStopped, 'Timer interval stopped when returning to dashboard');

    // TEST 23: Furigana / Kana Toggle UI Synchronization (toggleFurigana)
    console.log('\n--- TEST 23: Furigana / Kana Toggle UI Synchronization (toggleFurigana) ---');
    await cdp.eval('window.app.startExam("01", "renshuu")');
    await wait(100);
    const initialFuriState = await cdp.eval('window.app.showFurigana');
    const initialBtnText = await cdp.eval('document.getElementById("furigana-toggle-btn").innerText.trim()');
    assert(initialFuriState === true, 'showFurigana initially true');
    assert(initialBtnText.includes('ON'), `Furigana button initially shows ON: ${initialBtnText}`);

    // Click toggle to turn OFF
    await cdp.eval('window.app.toggleFurigana()');
    const toggledFuriState = await cdp.eval('window.app.showFurigana');
    const toggledBtnText = await cdp.eval('document.getElementById("furigana-toggle-btn").innerText.trim()');
    assert(toggledFuriState === false, 'showFurigana toggled to false');
    assert(toggledBtnText.includes('OFF'), `Furigana button updated to OFF: ${toggledBtnText}`);

    // Click toggle to turn back ON
    await cdp.eval('window.app.toggleFurigana()');
    const restoredFuriState = await cdp.eval('window.app.showFurigana');
    const restoredBtnText = await cdp.eval('document.getElementById("furigana-toggle-btn").innerText.trim()');
    assert(restoredFuriState === true && restoredBtnText.includes('ON'), 'Furigana button restored back to ON');

    // TEST 24: Pure Reading Saved Result Restoration (viewSavedResult on Bab 07 & Bab 01)
    console.log('\n--- TEST 24: Pure Reading Saved Result Restoration (viewSavedResult on Bab 07 & Bab 01) ---');
    await cdp.eval('window.app.goToDashboard()');
    await wait(150);
    const hasB07LihatHasil = await cdp.eval("Boolean(Array.from(document.querySelectorAll('button')).some(b => (b.getAttribute('onclick') || '').includes('viewSavedResult(\\'07\\')')))");
    assert(hasB07LihatHasil, 'Dashboard shows "Lihat Hasil" button for completed Bab 07');
    await cdp.eval('window.app.viewSavedResult("07")');
    await wait(150);
    const b07RestoredView = await cdp.eval('window.app.view');
    const b07RestoredScore = await cdp.eval('window.app.currentResult.score');
    const b07RestoredTotal = await cdp.eval('window.app.currentChapter.questions.length');
    assert(b07RestoredView === 'result', 'Bab 07 restored to result view');
    assert(b07RestoredScore === 100.0, 'Bab 07 restored score is 100.0');
    assert(b07RestoredTotal === 25, 'Bab 07 restored question count is 25');

    // Also verify Bab 01 preserved its timeout auto-submit state (score: 0.0)
    await cdp.eval('window.app.viewSavedResult("01")');
    await wait(100);
    const b1RestoredScore = await cdp.eval('window.app.currentResult.score');
    assert(b1RestoredScore === 0.0, 'Bab 01 preserved its timeout auto-submit score of 0.0');

    // TEST 25: Resilient Exam Submission Under LocalStorage Failure / Quota Exceeded
    console.log('\n--- TEST 25: Resilient Exam Submission Under LocalStorage Failure / Quota Exceeded ---');
    await cdp.eval(`
      const origSetItem = localStorage.setItem;
      localStorage.setItem = function() {
        throw new Error("QuotaExceededError: DOM Exception 22");
      };
      window.app.startExam("02", "renshuu");
      window.app.selectOption(1, "A");
      window.app.submitExam();
      localStorage.setItem = origSetItem;
    `);
    await wait(200);
    const quotaResultView = await cdp.eval('window.app.view');
    const quotaResultObj = await cdp.eval('Boolean(window.app.currentResult)');
    assert(quotaResultView === 'result', 'Exam submitted to result view even when localStorage.setItem throws');
    assert(quotaResultObj, 'currentResult populated despite localStorage quota exception');

    // TEST 26: Logout Flow & Strict Auth Relocking
    console.log('\n--- TEST 26: Logout Flow & Strict Auth Relocking ---');
    await cdp.eval('window.app.logout()');
    await wait(250);
    const authAfterLogout = await cdp.eval('window.app.isAuthenticated');
    const viewAfterLogout = await cdp.eval('window.app.view');
    const headerHiddenAfterLogout = await cdp.eval('document.getElementById("app-header").classList.contains("hidden")');
    assert(!authAfterLogout, 'User authentication state revoked');
    assert(viewAfterLogout === 'auth_gate', 'View instantaneously locked back to auth_gate');
    assert(headerHiddenAfterLogout, 'Navigation header re-hidden upon logout');

    // Re-login to verify round-trip
    await performLogin("ahmad.syahroni", "123456");
    const reloginOk = await cdp.eval('window.app.isAuthenticated && window.app.view === "dashboard"');
    assert(reloginOk, 'Re-login round-trip successfully restores full dashboard access');
  }

    // TEST 27: Per-Student Granular Chapter Access Control (Sensei UI & Student Lockout)
    console.log('\n--- TEST 27: Per-Student Granular Chapter Access Control (Sensei UI & Student Lockout) ---');
    // 1. Switch to Sensei Admin
    await cdp.eval('window.app.logout()');
    await wait(200);
    await performLogin("sensei.wahyu", "123456");
    const isAdminNow = await cdp.eval('window.app.currentUser?.role === "admin"');
    assert(isAdminNow, 'Sensei Admin logged in successfully');

    // 2. Open Admin Panel -> Tab Manajemen Siswa
    await cdp.eval('window.app.openAdminPanel("users")');
    for (let i = 0; i < 30; i++) {
      const len = await cdp.eval('((window.app.adminUsersData || window.app.adminUsers || []).length)');
      if (len > 0) break;
      await wait(150);
    }
    const usersTabActive = await cdp.eval('window.app.activeModal === "admin_panel" && window.app.adminTab === "users"');
    assert(usersTabActive, 'Admin Panel opened to Manajemen Siswa tab');

    // 3. Verify [Akses Bab] button exists on student row
    const hasAksesBabBtn = await cdp.eval('Boolean(document.querySelector("button[onclick*=\'openStudentChapterAccessModal\']"))');
    assert(hasAksesBabBtn, 'Tombol [Akses Bab] is rendered on student rows');

    // 4. Open modal dialog "Pengaturan Hak Akses Bab" for Ahmad Syahroni (dynamically resolving ID)
    const ahmadInfo = await cdp.eval(`(() => {
      const list = window.app.adminUsersData || window.app.adminUsers || [];
      const u = list.find(x => x.username === 'ahmad.syahroni' || (x.name && x.name.includes('Ahmad')));
      return u ? { id: u.id, name: u.name } : { id: 'usr_ahmad', name: 'Ahmad Syahroni' };
    })()`);
    await cdp.eval(`window.app.openStudentChapterAccessModal(${JSON.stringify(ahmadInfo.id)}, ${JSON.stringify(ahmadInfo.name)})`);
    for (let i = 0; i < 30; i++) {
      const ready = await cdp.eval('Boolean(window.app.studentChapterAccessData && document.getElementById("access-toggle-05"))');
      if (ready) break;
      await wait(150);
    }
    const accessModalOpen = await cdp.eval('window.app.activeModal === "student_chapter_access"');
    assert(accessModalOpen, 'Modal dialog Pengaturan Hak Akses Bab successfully opened');

    const modalTitle = await cdp.eval('document.querySelector("#modal-container h3")?.innerText || ""');
    assert(modalTitle.includes('Pengaturan Hak Akses Bab') && modalTitle.includes('Ahmad Syahroni'), 'Modal displays "Pengaturan Hak Akses Bab: Ahmad Syahroni"');

    const toggleCh05Exists = await cdp.eval('Boolean(document.getElementById("access-toggle-05"))');
    assert(toggleCh05Exists, 'Bab 05 toggle exists in modal grid');

    // 5. Restrict Bab 05 for Ahmad: uncheck Bab 05 toggle and click Simpan
    await cdp.eval(`(async () => {
      const cb05 = document.getElementById("access-toggle-05");
      if (cb05) {
        cb05.checked = false;
        window.app.toggleStudentChapterAccess("05");
      }
      window.__savedAlert = null;
      window.alert = function(msg) { window.__savedAlert = msg; };
      await window.app.saveStudentChapterAccess();
    })()`);
    let saveAlertMsg = null;
    for (let i = 0; i < 25; i++) {
      saveAlertMsg = await cdp.eval('window.__savedAlert');
      if (saveAlertMsg) break;
      await wait(150);
    }
    assert(Boolean(saveAlertMsg && saveAlertMsg.includes('berhasil disimpan')), 'Hak akses bab saved with success confirmation');

    // 6. Log out Sensei and log in as Ahmad Syahroni
    await cdp.eval('window.app.closeModal(); window.app.logout();');
    await wait(200);
    await performLogin("ahmad.syahroni", "123456");
    await cdp.eval('window.app.goToDashboard()');
    await wait(300);

    // 7. Verify Bab 05 displays badge '🔒 Dibatasi Pengawas' and tombol 'Mulai' is disabled
    const b5DibatasiBadge = await cdp.eval(`(() => {
      const btn = Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Dibatasi Pengawas"));
      return Boolean(btn && btn.disabled);
    })()`);
    assert(b5DibatasiBadge, 'Bab 05 card on student dashboard displays badge "🔒 Dibatasi Pengawas" and disabled button');

    // 8. Attempting to start Bab 05 directly triggers restriction alert
    await cdp.eval(`
      window.__restrictAlert = null;
      window.alert = function(msg) { window.__restrictAlert = msg; };
      window.app.promptStartExam("05");
    `);
    const restrictAlert = await cdp.eval('window.__restrictAlert');
    assert(Boolean(restrictAlert && restrictAlert.includes('Akses bab ini dibatasi khusus untuk akun Anda oleh pengawas')), 'Direct promptStartExam on Bab 05 rejected with restriction alert');

    // 9. Other student (narong.sakda) can still access Bab 05
    await cdp.eval('window.app.logout();');
    await wait(200);
    await performLogin("narong.sakda", "123456");
    await cdp.eval('window.app.goToDashboard()');
    await wait(300);
    const narongB5Restricted = await cdp.eval('Boolean(window.app.userRestrictedChapters["05"])');
    assert(!narongB5Restricted, 'Other student (Narong Sakda) is NOT restricted from Bab 05');

    // 10. Sensei restores Bab 05 access for Ahmad
    await cdp.eval('window.app.logout();');
    await wait(200);
    await performLogin("sensei.wahyu", "123456");
    await cdp.eval('window.app.openAdminPanel("users")');
    for (let i = 0; i < 30; i++) {
      const len = await cdp.eval('((window.app.adminUsersData || window.app.adminUsers || []).length)');
      if (len > 0) break;
      await wait(150);
    }
    await cdp.eval(`window.app.openStudentChapterAccessModal(${JSON.stringify(ahmadInfo.id)}, ${JSON.stringify(ahmadInfo.name)})`);
    for (let i = 0; i < 30; i++) {
      const ready = await cdp.eval('Boolean(window.app.studentChapterAccessData && document.getElementById("access-toggle-05"))');
      if (ready) break;
      await wait(150);
    }
    const saveResult = await cdp.eval(`(async () => {
      try {
        window.app.setAllStudentChapterAccess(true);
        window.__savedAlert = null;
        window.alert = function(msg) { window.__savedAlert = msg; };
        await window.app.saveStudentChapterAccess();
        return { alert: window.__savedAlert, student: window.app.selectedStudentForAccess, error: null };
      } catch (err) {
        return { alert: window.__savedAlert, student: window.app.selectedStudentForAccess, error: err.message };
      }
    })()`);
    let restoreAlert = saveResult.alert;
    for (let i = 0; i < 30; i++) {
      if (restoreAlert) break;
      restoreAlert = await cdp.eval('window.__savedAlert');
      await wait(150);
    }
    assert(Boolean(restoreAlert && restoreAlert.includes('berhasil disimpan')), 'Hak akses bab restored with success confirmation');

    // 11. Ahmad logs back in, verifies Bab 05 is unlocked again
    await cdp.eval('window.app.closeModal(); window.app.logout();');
    await wait(200);
    await performLogin("ahmad.syahroni", "123456");
    await cdp.eval('window.app.goToDashboard()');
    let b5UnlockedNow = false;
    for (let i = 0; i < 30; i++) {
      b5UnlockedNow = await cdp.eval('Boolean(window.app && !window.app.userRestrictedChapters["05"] && !document.getElementById("app")?.innerText.includes("Dibatasi Pengawas"))');
      if (b5UnlockedNow) break;
      await wait(150);
    }
    assert(b5UnlockedNow, 'Bab 05 access successfully restored and unlocked on Ahmad dashboard');

    console.log('\n================================================================');
    console.log(' ALL 27 CBT BROWSER AUTOMATION TESTS PASSED WITH 100% SUCCESS!');
    console.log('================================================================');
  } catch (err) {
    console.error('\n[FATAL ERROR] Test suite failed:', err.message);
    process.exitCode = 1;
  } finally {
    if (chromeProc) {
      chromeProc.kill('SIGTERM');
    }
  }
}

runTests();
