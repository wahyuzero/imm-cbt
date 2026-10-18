/**
 * IMM JAPAN CBT PLATFORM ENGINE
 * Paket Tryout Terpadu: Sesi 1 Reading (25 Soal) & Sesi 2 Choukai (8 Soal) — Total 33 Soal
 * Format Terstandarisasi untuk Calon Pemagang IMM Japan & SSW Tokutei Ginou.
 * Zero-dependency, client-side state in localStorage, reactive Vanilla JS.
 */

// --- Escaping helpers (XSS hardening, dipakai lintas aplikasi) ---
function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Alias untuk konteks atribut HTML (kutip ganda/tunggal sudah ter-encode oleh escapeHtml).
function escapeAttr(value) {
  return escapeHtml(value);
}

class ChoukaiApp {
  constructor() {
    this.profile = this.loadProfile();
    this.progress = this.loadProgress();
    this.theme = localStorage.getItem("choukai_theme") || "light";

    // Exam runtime state
    this.currentChapter = (typeof BAB_08_DATA !== "undefined" ? BAB_08_DATA : null);
    this.currentQuestionIdx = 0;
    this.answers = {}; // { questionId: optionId }
    this.mode = "renshuu"; // 'renshuu' (practice) | 'shiken' (official exam)
    this.timerSeconds = 3600; // 60 menit (50m Reading + 10m Choukai)
    this.timerInterval = null;
    this.autoNextInterval = null;
    this.autoNextRemaining = 0;
    this.showFurigana = true;
    this.showRomaji = false;

    // Audio Player state
    this.audio = new Audio();
    this.audio.defaultPlaybackRate = 0.8;
    this.audio.preservesPitch = true;
    if ("webkitPreservesPitch" in this.audio) this.audio.webkitPreservesPitch = true;
    if ("mozPreservesPitch" in this.audio) this.audio.mozPreservesPitch = true;
    this.isPlaying = false;
    this.playbackRate = 1.0; // Dilabeli 1.0x (Normal/Standar), memainkan audio pada tempo 0.8x nyaman
    this.defaultTempo = 0.8;
    this.pendingSeek = null;

    // View state
    this.view = "auth_gate"; // 'auth_gate' | 'dashboard' | 'exam' | 'result' | 'kosakata'
    this.activeModal = null; // 'onboarding' | 'confirm_submit' | 'image_zoom'
    this.modalData = null;

    // Kosakata State
    this.kosakataBab = "01";
    this.kosakataFilter = "all";
    this.kosakataSearch = "";
    this.hideReading = false;
    this.hideMeaning = false;
    this.memorizedWords = this.loadMemorizedWords();

    // Multi-Role & Strict Auth State
    this.currentUser = null;
    this.currentSession = null;
    this.serverSessionId = null;
    this.isAuthenticated = false;
    this.authChecking = true;
    this.authGateTab = "login"; // 'login' | 'register'
    this.targetHash = null;
    this.systemStatus = { allowRegistration: true, globalExamLock: false, announcement: "" };
    this.adminTab = "live";
    this.liveMonitoringData = [];
    this.liveMonitoringInterval = null;
    this.adminUsersData = [];
    this.adminResultsData = [];
    this.chaptersStatus = {};
    this.userRestrictedChapters = {};
    this.userRestrictedPdfs = {};
    this.isUserPdfAccessAllowed = false; // Default: Hanya Sensei yang bisa akses by default
    this.pdfLibrarySearchQuery = "";
    this.pdfLibraryFilterType = "all";
    this.selectedChapterForResources = null;
    this.studentAccessModalTab = "exam";
    this.selectedStudentPdfMasterAllowed = false;
    this.resourceAudio = new Audio();
    this.resourceAudioPlaying = false;
    this.selectedStudentForAccess = null;
    this.studentChapterAccessData = null;

    this.init();
  }

  get adminUsers() {
    return this.adminUsersData;
  }

  set adminUsers(val) {
    this.adminUsersData = val;
  }

  static get VERSION() {
    return "60";
  }

  audioUrl(url) {
    if (!url) return "";
    const clean = url.trim();
    return clean.includes("?") ? clean : `${clean}?v=${ChoukaiApp.VERSION}`;
  }

  pdfUrl(url) {
    if (!url) return "";
    const clean = encodeURI(url);
    return clean.includes("?") ? clean : `${clean}?v=${ChoukaiApp.VERSION}`;
  }

  async init() {
    this.applyTheme(this.theme);
    this.setupAudioListeners();
    this.setupKeyboardShortcuts();

    // Strict Auth Gate: Start strictly locked
    this.view = "auth_gate";
    this.authChecking = true;
    this.updateAppGateUI();
    this.render();

    // Check backend session and system status in parallel
    await Promise.all([
      this.checkAuthSession(),
      this.fetchSystemStatus(),
    ]);

    this.authChecking = false;
    this.handleInitialRouting();

    window.addEventListener("hashchange", () => {
      this.handleHashChange();
    });
  }

  handleInitialRouting() {
    if (!this.isAuthenticated) {
      const h = window.location.hash;
      if (h && h !== "#auth" && h !== "#dashboard" && h !== "") {
        this.targetHash = h;
      }
      this.view = "auth_gate";
      this.updateAppGateUI();
      this.render();
      return;
    }

    // Authenticated user
    this.updateAppGateUI();
    const hash = window.location.hash;
    const promptMatch = hash.match(/^#prompt-(\d{1,2})$/);
    const babMatch = hash.match(/^#bab-(\d{1,2})$/);
    const resultMatch = hash.match(/^#result-(\d{1,2})$/);
    const kosakataMatch = hash.match(/^#kosakata(?:-(\d{1,2}|all))?$/);

    if (hash === "#admin") {
      if (this.currentUser?.role === "admin") {
        this.goToDashboard();
        this.openAdminPanel("live");
      } else {
        this.goToDashboard();
      }
      return;
    }

    if (promptMatch) {
      const bNum = promptMatch[1].padStart(2, "0");
      this.goToDashboard();
      this.promptStartExam(bNum);
    } else if (babMatch) {
      const bNum = babMatch[1].padStart(2, "0");
      if (typeof CHAPTERS_DATA !== "undefined" && CHAPTERS_DATA[bNum]) {
        this.startExam(CHAPTERS_DATA[bNum], "renshuu");
      } else {
        this.goToDashboard();
      }
    } else if (resultMatch) {
      const bNum = resultMatch[1].padStart(2, "0");
      if (this.progress[bNum]) {
        this.viewSavedResult(bNum);
      } else {
        this.goToDashboard();
      }
    } else if (kosakataMatch) {
      const bNum = kosakataMatch[1] ? (kosakataMatch[1] === "all" ? "all" : kosakataMatch[1].padStart(2, "0")) : "01";
      this.goToKosakata(bNum);
    } else if (hash === "#exam" || hash === "#bab-08") {
      this.startExam(BAB_08_DATA, "renshuu");
    } else if (hash === "#result" && this.progress["08"]) {
      this.viewSavedResult("08");
    } else if (hash === "#result-demo") {
      this.startExam(BAB_08_DATA, "shiken");
      const ansDemo = {
        1: "B", 2: "C", 3: "A", 4: "D", 5: "B", 6: "C", 7: "A",
        8: "D", 9: "B", 10: "C", 11: "A", 12: "D", 13: "B",
        14: "C", 15: "A", 16: "D", 17: "B", 18: "A", 19: "C", 20: "D",
        21: "B", 22: "C", 23: "A", 24: "A", 25: "A",
        26: "3", 27: "4", 28: "2", 29: "2", 30: "3", 31: "2", 32: "3", 33: "3"
      };
      this.answers = ansDemo;
      this.submitExam();
    } else {
      this.goToDashboard();
    }
  }

  handleHashChange() {
    if (!this.isAuthenticated) {
      const h = window.location.hash;
      if (h && h !== "#auth" && h !== "") {
        this.targetHash = h;
      }
      if (window.location.hash !== "#auth" && window.location.hash !== "") {
        try {
          history.replaceState(null, "", "#auth");
        } catch (e) {}
      }
      this.view = "auth_gate";
      this.updateAppGateUI();
      this.render();
      return;
    }

    const h = window.location.hash;
    const pm = h.match(/^#prompt-(\d{1,2})$/);
    const km = h.match(/^#kosakata(?:-(\d{1,2}|all))?$/);
    const bm = h.match(/^#bab-(\d{1,2})$/);
    const rm = h.match(/^#result-(\d{1,2})$/);

    if (h === "#admin") {
      if (this.currentUser?.role === "admin") {
        this.goToDashboard();
        this.openAdminPanel("live");
      } else {
        this.goToDashboard();
      }
      return;
    }

    if (pm) {
      const bNum = pm[1].padStart(2, "0");
      this.goToDashboard();
      this.promptStartExam(bNum);
    } else if (bm) {
      const bNum = bm[1].padStart(2, "0");
      if (typeof CHAPTERS_DATA !== "undefined" && CHAPTERS_DATA[bNum]) {
        this.startExam(CHAPTERS_DATA[bNum], "renshuu");
      }
    } else if (rm) {
      const bNum = rm[1].padStart(2, "0");
      if (this.progress[bNum]) {
        this.viewSavedResult(bNum);
      }
    } else if (km) {
      const bNum = km[1] ? (km[1] === "all" ? "all" : km[1].padStart(2, "0")) : (this.kosakataBab || "01");
      if (this.view !== "kosakata" || this.kosakataBab !== bNum) {
        this.goToKosakata(bNum);
      }
    } else if (h === "#dashboard" || h === "") {
      if (this.view !== "dashboard") {
        this.goToDashboard();
      }
    }
  }

  // ==========================================
  // PROFILE & PROGRESS STORAGE
  // ==========================================
  // BUG-18: namespace key localStorage per user agar data tidak bocor antar akun di browser bersama.
  userStorageKey(base) {
    const u = this.currentUser || (this.currentSession && this.currentSession.user);
    const uid = u ? (u.username || u.id || "guest") : "guest";
    const safe = String(uid).replace(/[^a-zA-Z0-9._-]/g, "_");
    return `${base}__${safe}`;
  }

  loadProfile() {
    try {
      const data = localStorage.getItem(this.userStorageKey("choukai_student_profile"));
      return data ? JSON.parse(data) : { name: "", classNo: "", target: "JFT-Basic A2" };
    } catch (e) {
      return { name: "", classNo: "", target: "JFT-Basic A2" };
    }
  }

  saveProfile(name, classNo, target) {
    this.profile = { name: name.trim(), classNo: classNo.trim(), target };
    if (this.currentUser) {
      this.currentUser.name = this.profile.name;
      this.currentUser.className = this.profile.classNo;
    }
    try {
      localStorage.setItem(this.userStorageKey("choukai_student_profile"), JSON.stringify(this.profile));
    } catch (e) {
      console.warn("Gagal menyimpan profil siswa ke localStorage:", e);
    }
    this.closeModal();
    this.render();
  }

  loadProgress() {
    try {
      const data = localStorage.getItem(this.userStorageKey("choukai_progress"));
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  saveExamResult(result) {
    this.progress[result.chapter] = {
      chapter: result.chapter,
      score: result.score,
      readingScore: result.readingScore,
      choukaiScore: result.choukaiScore,
      readingCorrect: result.readingCorrect,
      readingTotal: result.readingTotal,
      choukaiCorrect: result.choukaiCorrect,
      choukaiTotal: result.choukaiTotal,
      passed: result.passed,
      correctCount: result.correctCount,
      totalCount: result.totalCount,
      answers: result.answers,
      date: new Date().toISOString(),
      mode: result.mode,
      // RESIDUAL BUG-05: flag grading-pending WAJIB ikut dipersist — tanpa ini
      // entri {score:null, passed:null} yang dilihat via tombol "Hasil"
      // (viewSavedResult) menampilkan skor palsu "0.0 / 100" + badge REMEDIAL
      // karena isGrading sebelumnya hanya hidup di memori sesi.
      isGrading: Boolean(result.isGrading),
      pendingSessionId: result.pendingSessionId || null,
    };
    try {
      localStorage.setItem(this.userStorageKey("choukai_progress"), JSON.stringify(this.progress));
    } catch (e) {
      console.warn("Gagal menyimpan progress ujian ke localStorage:", e);
    }
  }

  viewSavedResult(chapterNum) {
    if (!this.isAuthenticated) {
      this.targetHash = `#result-${chapterNum}`;
      this.view = "auth_gate";
      this.updateAppGateUI();
      this.render();
      return;
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.cancelAutoNext();
    this.pauseAudio();
    const saved = this.progress[chapterNum];
    if (!saved) return;
    // RESIDUAL BUG-05: pulihkan konteks retry dari entri pending-grading yang
    // dipersist — bila submit server gagal lalu tab ditutup, tombol "Hasil"
    // tetap menampilkan banner "採点中" + tombol kirim ulang (bukan skor 0 palsu).
    // Retry idempoten di server (sesi ter-finalisasi mengembalikan skor resmi).
    if (saved.isGrading && saved.pendingSessionId) {
      if (!this._lastSubmitSessionId) this._lastSubmitSessionId = saved.pendingSessionId;
      this._submitFailed = true;
    }
    if (typeof CHAPTERS_DATA !== "undefined" && CHAPTERS_DATA[chapterNum]) {
      this.currentChapter = CHAPTERS_DATA[chapterNum];
    } else if (chapterNum === "08" && typeof BAB_08_DATA !== "undefined") {
      this.currentChapter = BAB_08_DATA;
    }
    this.currentResult = saved;
    this.view = "result";
    this.render();
  }

  loadMemorizedWords() {
    try {
      const data = localStorage.getItem(this.userStorageKey("choukai_memorized_words"));
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  toggleWordMemorized(wordKey) {
    if (this.memorizedWords[wordKey]) {
      delete this.memorizedWords[wordKey];
    } else {
      this.memorizedWords[wordKey] = true;
    }
    try {
      localStorage.setItem(this.userStorageKey("choukai_memorized_words"), JSON.stringify(this.memorizedWords));
    } catch (e) {
      console.warn("Gagal menyimpan progress kosakata ke localStorage:", e);
    }
    this.updateKosakataStatsUI();
    this.updateKosakataCardUI(wordKey);

    // Sync to PostgreSQL backend if authenticated
    if (this.currentUser && window.location.protocol.startsWith("http")) {
      const parts = String(wordKey).split("_");
      if (parts.length >= 2) {
        const vId = `vocab_${parts[0].padStart(2, "0")}_${parts[1].padStart(2, "0")}`;
        fetch(`/api/v1/vocabulary/${vId}/toggle`, { method: "POST" }).catch((e) => console.warn(e));
      }
    }
  }

  goToDashboard() {
    if (!this.isAuthenticated) {
      this.view = "auth_gate";
      this.updateAppGateUI();
      this.render();
      return;
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.cancelAutoNext();
    this.pauseAudio();
    this.view = "dashboard";
    this.render();
    try {
      history.replaceState(null, "", "#dashboard");
    } catch (e) {}
  }

  goToKosakata(babNum) {
    if (!this.isAuthenticated) {
      this.targetHash = `#kosakata${babNum ? '-' + babNum : ''}`;
      this.view = "auth_gate";
      this.updateAppGateUI();
      this.render();
      return;
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.cancelAutoNext();
    this.pauseAudio();
    if (babNum) {
      this.kosakataBab = babNum.toString().padStart(2, "0");
    } else if (!this.kosakataBab) {
      this.kosakataBab = "01";
    }
    this.view = "kosakata";
    this.render();
    try {
      history.replaceState(null, "", `#kosakata-${this.kosakataBab}`);
    } catch (e) {}
  }

  playWordAudio(text) {
    if (!("speechSynthesis" in window)) {
      alert("Browser Anda belum mendukung Web Speech Audio Synthesis.");
      return;
    }
    window.speechSynthesis.cancel();
    // Hilangkan furigana dalam kurung untuk audio pelafalan Jepang bersih
    const cleanText = text.replace(/（[^）]*）|\([^)]*\)/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText || text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.88;

    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const jaVoice = voices.find((v) => v.lang === "ja-JP" || (v.lang && v.lang.startsWith("ja")));
        if (jaVoice) {
          utterance.voice = jaVoice;
        }
      }
    } catch (e) {}

    window.speechSynthesis.speak(utterance);
  }

  // ==========================================
  // THEME MANAGEMENT
  // ==========================================
  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("choukai_theme", theme);
    } catch (e) {
      console.warn("Gagal menyimpan preferensi tema ke localStorage:", e);
    }
  }

  toggleTheme() {
    this.applyTheme(this.theme === "dark" ? "light" : "dark");
  }

  // ==========================================
  // AUDIO CONTROLS
  // ==========================================
  setupAudioListeners() {
    this.audio.addEventListener("timeupdate", () => this.updateAudioProgress());
    this.audio.addEventListener("loadedmetadata", () => {
      this.applyAudioRateAndPitch();
      if (this.pendingSeek !== null && this.audio.duration && !isNaN(this.audio.duration)) {
        this.seekAudio(this.pendingSeek);
        this.pendingSeek = null;
      }
      this.updateAudioProgress();
    });
    this.audio.addEventListener("ended", () => {
      this.isPlaying = false;
      this.renderAudioButtons();
      this.updateResultAudioBtn(null, false);
      this.handleAudioEnded();
    });
    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      this.applyAudioRateAndPitch();
      this.renderAudioButtons();
    });
    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.renderAudioButtons();
      this.updateResultAudioBtn(null, false);
    });
  }

  getCurrentQuestion() {
    return this.currentChapter && this.currentChapter.questions
      ? this.currentChapter.questions[this.currentQuestionIdx]
      : null;
  }

  getCurrentQuestionAudioSrc() {
    const q = this.getCurrentQuestion();
    const raw = q && q.audioSrc ? q.audioSrc : (this.currentChapter ? this.currentChapter.audioSrc : "");
    return this.audioUrl(raw);
  }

  loadQuestionAudio(idx) {
    if (idx !== undefined) this.currentQuestionIdx = idx;
    this.cancelAutoNext();
    this.pendingSeek = null;
    const q = this.getCurrentQuestion();
    if (!q) return;

    if (q.session === "choukai" && q.audioSrc) {
      const targetSrc = this.audioUrl(q.audioSrc);
      if (!this.audio.src || !this.audio.src.endsWith(targetSrc)) {
        this.audio.src = targetSrc;
        this.audio.currentTime = 0;
        this.applyAudioRateAndPitch();
      }
    } else {
      this.pauseAudio();
    }
    this.updateAudioProgress();
    this.renderAudioButtons();
    this.renderAudioHeaderInfo();
  }

  playAudio() {
    const q = this.getCurrentQuestion();
    if (!q || q.session !== "choukai") return;
    const targetSrc = this.getCurrentQuestionAudioSrc();
    if (targetSrc && (!this.audio.src || !this.audio.src.endsWith(targetSrc))) {
      this.audio.src = targetSrc;
    }
    this.applyAudioRateAndPitch();
    this.isPlaying = true;
    this.renderAudioButtons();
    this.audio.play().catch((e) => {
      this.isPlaying = false;
      this.renderAudioButtons();
      console.log("Audio play prevented:", e);
    });
  }

  pauseAudio() {
    this.isPlaying = false;
    this.audio.pause();
    this.cancelAutoNext();
    this.renderAudioButtons();
    this.updateResultAudioBtn(null, false);
  }

  togglePlayPause() {
    const q = this.getCurrentQuestion();
    if (!q || q.session !== "choukai") return;
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }

  playQuestionAudio(qId) {
    const q = this.currentChapter.questions.find((item) => item.id === qId);
    if (!q || !q.audioSrc) return;
    this.cancelAutoNext();
    const targetSrc = this.audioUrl(q.audioSrc);
    if (!this.audio.src || !this.audio.src.endsWith(targetSrc)) {
      this.audio.src = targetSrc;
      this.audio.currentTime = 0;
      this.applyAudioRateAndPitch();
    }
    this.isPlaying = true;
    this.renderAudioButtons();
    this.audio.play().catch((e) => {
      this.isPlaying = false;
      this.renderAudioButtons();
      console.log("Audio play prevented:", e);
    });
  }

  toggleResultAudio(qId) {
    const q = this.currentChapter.questions.find((item) => item.id === qId);
    if (!q || !q.audioSrc) return;
    const targetSrc = this.audioUrl(q.audioSrc);

    if (this.isPlaying && this.audio.src && this.audio.src.endsWith(targetSrc)) {
      this.pauseAudio();
      this.updateResultAudioBtn(qId, false);
    } else {
      this.cancelAutoNext();
      this.audio.src = targetSrc;
      this.audio.currentTime = 0;
      this.applyAudioRateAndPitch();
      this.isPlaying = true;
      this.updateResultAudioBtn(qId, true);
      this.audio.play().catch((e) => {
        this.isPlaying = false;
        this.updateResultAudioBtn(qId, false);
        console.log("Audio play error:", e);
      });
    }
  }

  updateResultAudioBtn(qId, isPlayingNow) {
    document.querySelectorAll('[id^="result-audio-btn-"]').forEach((btn) => {
      const match = btn.id.match(/result-audio-btn-(\d+)/);
      if (match) {
        const id = parseInt(match[1], 10);
        const itemQ = this.currentChapter.questions.find((x) => x.id === id);
        const dur = itemQ ? (itemQ.audioDuration || "00:50") : "00:50";
        if (id === qId && isPlayingNow) {
          btn.innerHTML = `
            <svg class="w-3 h-3 fill-current text-rose-500 animate-pulse" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            <span class="text-rose-600 dark:text-rose-400 font-bold">Jeda Audio (${dur})</span>
          `;
        } else {
          btn.innerHTML = `
            <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            <span>Dengar Ulang Audio Soal ${id} (${dur})</span>
          `;
        }
      }
    });
  }

  seekAudio(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return;
    if (!this.audio.duration || isNaN(this.audio.duration)) {
      this.pendingSeek = seconds;
      return;
    }
    this.pendingSeek = null;
    this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration));
  }

  seekAndPlayAudio(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return;
    this.seekAudio(seconds);
    this.playAudio();
  }

  getEffectivePlaybackRate(rate = this.playbackRate) {
    // Standar tempo listening IMM Japan:
    // Tempo 0.8x dijadikan standar default (1.0x) karena artikulasi 1x asli dirasa terlalu cepat.
    const map = {
      1.0: 0.8,   // 1.0x (Default / Standar) -> dimainkan pada tempo 0.8x yang nyaman
      0.8: 0.65,  // 0.8x (Santai / Lambat) -> dimainkan pada tempo 0.65x
      1.2: 1.0,   // 1.2x (Cepat / Native Asli) -> dimainkan pada tempo 1.0x
    };
    const numRate = parseFloat(rate);
    if (!isNaN(numRate)) {
      const rounded = Math.round(numRate * 10) / 10;
      if (map[rounded] !== undefined) {
        return map[rounded];
      }
      return rounded * 0.8;
    }
    return 0.8;
  }

  applyAudioRateAndPitch() {
    const effectiveRate = this.getEffectivePlaybackRate();
    this.audio.defaultPlaybackRate = effectiveRate;
    this.audio.playbackRate = effectiveRate;
    this.audio.preservesPitch = true;
    if ("webkitPreservesPitch" in this.audio) this.audio.webkitPreservesPitch = true;
    if ("mozPreservesPitch" in this.audio) this.audio.mozPreservesPitch = true;
  }

  setPlaybackRate(rate) {
    this.playbackRate = typeof rate === "string" ? parseFloat(rate) : rate;
    this.applyAudioRateAndPitch();
    this.renderAudioSpeedBadge();
  }

  cyclePlaybackRate() {
    const cur = Math.round(Number(this.playbackRate) * 10) / 10;
    const nextRate = cur === 1.0 ? 0.8 : (cur === 0.8 ? 1.2 : 1.0);
    this.setPlaybackRate(nextRate);
  }

  getAudioSpeedTitle(rate = this.playbackRate) {
    const cur = Math.round(Number(rate) * 10) / 10;
    const desc = cur === 1.0
      ? "Tempo Standar 0.8x (Nyaman)"
      : (cur === 0.8 ? "Tempo Santai 0.65x (Lebih Lambat)" : "Tempo Cepat 1.0x (Native Asli)");
    return `Kecepatan Audio: ${cur.toFixed(1)}x (${desc})`;
  }

  formatTime(secs) {
    if (isNaN(secs) || secs < 0) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  updateAudioProgress() {
    const curTimeEl = document.getElementById("audio-current-time");
    const totalTimeEl = document.getElementById("audio-total-time");
    const scrubber = document.getElementById("audio-scrubber");
    const q = this.getCurrentQuestion();

    if (curTimeEl) curTimeEl.textContent = this.formatTime(this.audio.currentTime);
    if (totalTimeEl) {
      if (this.audio.duration && !isNaN(this.audio.duration)) {
        totalTimeEl.textContent = this.formatTime(this.audio.duration);
      } else if (q && q.audioDuration) {
        totalTimeEl.textContent = q.audioDuration;
      }
    }
    if (scrubber && this.audio.duration) {
      scrubber.value = (this.audio.currentTime / this.audio.duration) * 100;
    }
  }

  renderAudioButtons() {
    const playBtn = document.getElementById("audio-play-btn");
    if (!playBtn) return;
    playBtn.innerHTML = this.isPlaying
      ? `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
      : `<svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
  }

  renderAudioHeaderInfo() {
    const titleEl = document.getElementById("audio-header-title");
    const q = this.getCurrentQuestion();
    if (titleEl && q) {
      titleEl.textContent = `Audio Soal ${q ? q.id : ""} (Sesi Choukai)`;
    }
  }

  renderAudioSpeedBadge() {
    const badge = document.getElementById("audio-speed-btn");
    if (badge) {
      badge.textContent = `${Number(this.playbackRate).toFixed(1)}x`;
      badge.title = this.getAudioSpeedTitle();
    }
  }

  // Jeda antar-soal 5 detik otomatis untuk Choukai
  handleAudioEnded() {
    if (this.view !== "exam") return;
    const q = this.getCurrentQuestion();
    if (!q || q.session !== "choukai") return;
    const nextIdx = this.currentQuestionIdx + 1;
    if (nextIdx < this.currentChapter.questions.length) {
      const nextQ = this.currentChapter.questions[nextIdx];
      if (nextQ && nextQ.session === "choukai") {
        this.startAutoNextCountdown(5);
      }
    }
  }

  startAutoNextCountdown(seconds) {
    this.cancelAutoNext();
    this.autoNextRemaining = seconds;
    this.renderAutoNextToast();

    this.autoNextInterval = setInterval(() => {
      this.autoNextRemaining--;
      if (this.autoNextRemaining <= 0) {
        this.cancelAutoNext();
        this.nextQuestion();
        if (this.mode === "shiken") {
          this.playAudio();
        }
      } else {
        this.renderAutoNextToast();
      }
    }, 1000);
  }

  cancelAutoNext() {
    if (this.autoNextInterval) {
      clearInterval(this.autoNextInterval);
      this.autoNextInterval = null;
    }
    const toast = document.getElementById("auto-next-toast");
    if (toast) toast.remove();
  }

  renderAutoNextToast() {
    let toast = document.getElementById("auto-next-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "auto-next-toast";
      toast.className = "fixed bottom-5 right-5 z-50 bg-slate-900 text-white border border-sky-500 rounded-lg p-3 shadow-xl flex items-center gap-3 text-xs animate-pulse";
      document.body.appendChild(toast);
    }
    const nextQ = this.currentChapter.questions[this.currentQuestionIdx + 1];
    toast.innerHTML = `
      <span class="w-6 h-6 rounded-full bg-sky-500 text-white font-mono font-bold flex items-center justify-center text-xs">
        ${this.autoNextRemaining}
      </span>
      <div>
        <div class="font-bold text-sky-400">Jeda Audio: Beralih ke Soal ${nextQ ? nextQ.id : ""}</div>
        <div class="text-[10px] text-slate-300">dalam ${this.autoNextRemaining} detik...</div>
      </div>
      <button onclick="window.app.cancelAutoNext()" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-semibold text-slate-300 border border-slate-700">
        Tetap di Sini
      </button>
    `;
  }

  // ==========================================
  // EXAM LOGIC & TIMER
  // ==========================================
  promptStartExam(chapterDataOrNum) {
    let chNum = "08";
    if (chapterDataOrNum && typeof chapterDataOrNum === "object" && chapterDataOrNum.chapter) {
      chNum = String(chapterDataOrNum.chapter).padStart(2, "0");
    } else if (typeof chapterDataOrNum === "string" || typeof chapterDataOrNum === "number") {
      chNum = String(chapterDataOrNum).padStart(2, "0");
    }

    if (!this.isAuthenticated) {
      this.targetHash = `#prompt-${chNum}`;
      this.view = "auth_gate";
      this.updateAppGateUI();
      this.render();
      return;
    }

    // Guard against locked chapters for students
    if (this.currentUser && this.currentUser.role !== "admin") {
      if (this.userRestrictedChapters && this.userRestrictedChapters[chNum]) {
        alert("Akses bab ini dibatasi khusus untuk akun Anda oleh pengawas.");
        this.goToDashboard();
        return;
      }
      if (this.systemStatus?.globalExamLock) {
        alert("Ujian sedang dikunci secara global oleh Sensei. Hubungi pengawas ujian.");
        return;
      }
      if (this.chaptersStatus[chNum] === false) {
        alert(`Bab ${chNum} sedang dikunci oleh Sensei. Hubungi pengawas ujian.`);
        return;
      }
    }

    this.openModal("mode_select", chNum);
  }

  selectExamMode(chapterDataOrNum, mode = "renshuu") {
    if (this._isStartingExam) return;
    this._isStartingExam = true;
    this.closeModal();
    this.startChapterExam(chapterDataOrNum, mode);
    setTimeout(() => {
      this._isStartingExam = false;
    }, 500);
  }

  // Entry point ujian per bab: membungkus startExam agar normalisasi soal server (safeQuestions/_dbId) terpusat (BUG-01)
  startChapterExam(chapterDataOrNum, mode = "renshuu") {
    return this.startExam(chapterDataOrNum, mode);
  }

  // Normalisasi soal bentuk backend (safeQuestions) ke bentuk lokal; simpan ID DB asli sebagai _dbId (BUG-01/BUG-02)
  normalizeServerQuestions(serverQuestions) {
    if (!Array.isArray(serverQuestions)) return [];
    return serverQuestions.map((sq) => ({
      ...sq,
      id: sq.questionNumber !== undefined && sq.questionNumber !== null ? sq.questionNumber : sq.id,
      _dbId: sq.id,
      type: sq.type || sq.questionType,
      question_ja: sq.question_ja || sq.questionJa || "",
      question_ruby: sq.question_ruby || sq.questionRuby || "",
      question_romaji: sq.question_romaji || sq.questionRomaji || "",
      question_id: sq.question_id || sq.questionId || "",
      image: sq.image || sq.imageUrl || "",
      section_ja: sq.section_ja || sq.sectionJa || "",
    }));
  }

  startExam(chapterDataOrNum, mode = "renshuu") {
    let chapterData = null;
    let chNum = "08";

    if (chapterDataOrNum && typeof chapterDataOrNum === "object" && chapterDataOrNum.questions) {
      chapterData = chapterDataOrNum;
      chNum = String(chapterData.chapter || "08").padStart(2, "0");
    } else if (typeof chapterDataOrNum === "string" || typeof chapterDataOrNum === "number") {
      chNum = String(chapterDataOrNum).padStart(2, "0");
      if (typeof CHAPTERS_DATA !== "undefined" && CHAPTERS_DATA[chNum]) {
        chapterData = CHAPTERS_DATA[chNum];
      }
    }

    if (!chapterData && typeof CHAPTERS_DATA !== "undefined" && CHAPTERS_DATA[chNum]) {
      chapterData = CHAPTERS_DATA[chNum];
    }

    if (!chapterData && typeof BAB_08_DATA !== "undefined") {
      chapterData = BAB_08_DATA;
      chNum = "08";
    }

    if (!this.isAuthenticated) {
      this.targetHash = `#bab-${chNum}`;
      this.view = "auth_gate";
      this.updateAppGateUI();
      this.render();
      return;
    }

    // Guard against locked chapters for students
    if (this.currentUser && this.currentUser.role !== "admin") {
      if (this.userRestrictedChapters && this.userRestrictedChapters[chNum]) {
        alert("Akses bab ini dibatasi khusus untuk akun Anda oleh pengawas.");
        this.goToDashboard();
        return;
      }
      if (this.systemStatus?.globalExamLock) {
        alert("Ujian sedang dikunci secara global oleh Sensei. Hubungi pengawas ujian.");
        return;
      }
      if (this.chaptersStatus[chNum] === false) {
        alert(`Bab ${chNum} sedang dikunci oleh Sensei. Hubungi pengawas ujian.`);
        return;
      }
    }

    // Sanitasi integritas kunci jawaban secara sinkron jika mode shiken aktif di lingkungan web/HTTP (anti-cheat)
    if (window.location.protocol.startsWith("http") && chapterData && mode === "shiken" && (!this.currentUser || this.currentUser.role !== "admin")) {
      this.currentChapter = {
        ...chapterData,
        questions: (chapterData.questions || []).map((q) => {
          const { correctAnswer, explanation, ...safeQ } = q;
          return safeQ;
        }),
      };
    } else {
      this.currentChapter = chapterData;
    }

    this.currentQuestionIdx = 0;
    this.answers = {};
    this.mode = mode;
    this.view = "exam";

    this.pauseAudio();
    this.loadQuestionAudio(0);

    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.mode === "shiken") {
      const hasChoukai = this.currentChapter?.questions ? this.currentChapter.questions.some((q) => q.session === "choukai") : false;
      this.timerSeconds = hasChoukai ? 3600 : 3000; // 50 menit (3000s) untuk Bab 1-7, 60 menit (3600s) untuk Bab 8-25
      this.startTimer();
      const q = this.getCurrentQuestion();
      if (q && q.session === "choukai") {
        this.playAudio();
      }
    }

    this.render();

    // Start server session if authenticated on http
    if (this.currentUser && window.location.protocol.startsWith("http")) {
      this.currentExamSession = null;
      this.pendingSavePromises = [];
      this.startExamPromise = fetch("/api/v1/exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterNum: chNum, mode }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data?.session) {
            this.currentExamSession = json.data.session;
            // Gunakan safeQuestions terverifikasi dari backend jika tersedia (dinormalisasi ke bentuk lokal + _dbId)
            if (this.mode === "shiken" && (!this.currentUser || this.currentUser.role !== "admin")) {
              if (json.data.questions && Array.isArray(json.data.questions)) {
                this.currentChapter.questions = this.normalizeServerQuestions(json.data.questions);
              }
            }
            return this.currentExamSession;
          } else if (!json.success && this.currentUser.role !== "admin") {
            alert(json.error || "Gagal memulai sesi ujian di server.");
            this.goToDashboard();
            return null;
          }
        })
        .catch((e) => {
          console.warn("Server exam session init warning:", e);
          return null;
        });
      return this.startExamPromise;
    } else {
      this.currentExamSession = null;
      this.startExamPromise = null;
      this.pendingSavePromises = [];
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timerSeconds--;
      this.renderTimerDisplay();
      if (this.timerSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        if (typeof alert === "function") {
          try {
            alert("Waktu ujian telah berakhir! Lembar jawaban akan dikumpulkan secara otomatis.");
          } catch (e) {
            console.warn("Alert dialog prevented:", e);
          }
        }
        // RESIDUAL BUG-16: tutup modal konfirmasi submit yang sedang menggantung
        // saat auto-submit timer agar tidak menutupi layar hasil.
        this.closeModal();
        this.submitExam();
      }
    }, 1000);
  }

  renderTimerDisplay() {
    const timerEl = document.getElementById("exam-timer-display");
    if (timerEl) {
      const m = Math.floor(this.timerSeconds / 60);
      const s = this.timerSeconds % 60;
      timerEl.textContent = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
      if (this.timerSeconds < 300) {
        timerEl.classList.add("text-rose-600", "font-black");
      }
    }
  }

  selectOption(questionId, optionId) {
    this.answers[questionId] = optionId;
    this.renderQuestionContent();
    this.renderQuestionNav();

    // Real-time server auto-save
    if (window.location.protocol.startsWith("http") && this.currentUser) {
      const chNum = String(this.currentChapter?.chapter || "08").padStart(2, "0");
      // BUG-01: pakai _dbId hasil normalisasi safeQuestions; fallback rekonstruksi hanya untuk soal lokal ber-ID numerik
      const q = (this.currentChapter?.questions || []).find((x) => String(x.id) === String(questionId));
      const dbQId = (q && q._dbId) || `q_${chNum}_${String(questionId).padStart(2, "0")}`;

      const doSave = (session) => {
        if (!session) return;
        return fetch("/api/v1/exam/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: session.id,
            questionId: dbQId,
            selectedOption: optionId,
          }),
        })
          .then(async (res) => {
            if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              if (errData.userRestricted || (errData.error && errData.error.includes("dibatasi"))) {
                alert(errData.error || "Akses bab ini dibatasi khusus untuk akun Anda oleh pengawas.");
                this.goToDashboard();
                return;
              }
              if (errData.error && errData.error.includes("TERMINATED_BY_ADMIN")) {
                alert("Ujian telah dihentikan & dikumpulkan oleh Sensei/Pengawas.");
                this.submitExam();
              }
            }
          })
          .catch((e) => console.warn("Auto-save network error:", e));
      };

      if (!this.pendingSavePromises) this.pendingSavePromises = [];

      if (this.currentExamSession) {
        this.pendingSavePromises.push(doSave(this.currentExamSession));
      } else if (this.startExamPromise) {
        const p = this.startExamPromise.then((sess) => doSave(sess));
        this.pendingSavePromises.push(p);
      }
    }
  }

  toggleFurigana() {
    this.showFurigana = !this.showFurigana;
    const btn = document.getElementById("furigana-toggle-btn");
    if (btn) {
      btn.innerHTML = `かな <span class="text-[10px] text-slate-400">${this.showFurigana ? "ON" : "OFF"}</span>`;
    }
    this.renderQuestionContent();
  }

  goToSession(sessionName) {
    if (sessionName === "reading") {
      this.goToQuestion(0);
    } else if (sessionName === "choukai") {
      const choukaiIdx = this.currentChapter.questions.findIndex((q) => q.session === "choukai" || q.id >= 26);
      this.goToQuestion(choukaiIdx !== -1 ? choukaiIdx : 25);
    }
  }

  goToQuestion(idx) {
    if (idx >= 0 && idx < this.currentChapter.questions.length) {
      const wasPlaying = this.isPlaying;
      this.pauseAudio();
      this.currentQuestionIdx = idx;
      this.loadQuestionAudio(idx);
      const q = this.getCurrentQuestion();
      if (wasPlaying && this.mode === "shiken" && q && q.session === "choukai") {
        this.playAudio();
      }
      this.renderQuestionContent();
      this.renderQuestionNav();
      this.renderAudioVisibility();
    }
  }

  renderAudioVisibility() {
    const audioWrapper = document.getElementById("audio-player-wrapper");
    const q = this.getCurrentQuestion();
    if (audioWrapper) {
      if (q && q.session === "choukai") {
        audioWrapper.classList.remove("hidden");
      } else {
        audioWrapper.classList.add("hidden");
      }
    }
  }

  nextQuestion() {
    if (this.currentQuestionIdx < this.currentChapter.questions.length - 1) {
      this.goToQuestion(this.currentQuestionIdx + 1);
    }
  }

  prevQuestion() {
    if (this.currentQuestionIdx > 0) {
      this.goToQuestion(this.currentQuestionIdx - 1);
    }
  }

  submitExam() {
    // BUG-16: guard double-submit (auto-submit timer + tombol modal "Ya, Kumpulkan")
    if (this._isSubmitting) return this.submitExamPromise;
    this._isSubmitting = true;

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.cancelAutoNext();
    this.pauseAudio();

    const questions = this.currentChapter.questions;
    const readingQuestions = questions.filter((q) => q.session === "reading" || q.id <= 25);
    const choukaiQuestions = questions.filter((q) => q.session === "choukai" || (q.id > 25 && (this.currentChapter.choukaiCount || 0) > 0));

    let readingCorrect = 0;
    readingQuestions.forEach((q) => {
      if (this.answers[q.id] === q.correctAnswer) readingCorrect++;
    });

    let choukaiCorrect = 0;
    choukaiQuestions.forEach((q) => {
      if (this.answers[q.id] === q.correctAnswer) choukaiCorrect++;
    });

    const readingTotal = readingQuestions.length || 25;
    const choukaiTotal = choukaiQuestions.length;

    const readingScore = (readingCorrect / readingTotal) * 100;
    let choukaiScore = 0;
    let totalScore = 0;

    if (choukaiTotal > 0) {
      choukaiScore = (choukaiCorrect / choukaiTotal) * 100;
      totalScore = (readingScore + choukaiScore) / 2;
    } else {
      totalScore = readingScore;
    }
    const passingGrade = this.currentChapter.passingGrade || 80;
    const passed = totalScore >= passingGrade;

    // RESIDUAL BUG-11 (regresi): grading lokal pada mode HTTP memakai data.public.js
    // yang TANPA correctAnswer (hasil selalu 0) — semua mode dengan sesi server
    // (shiken ATAU renshuu) menunggu skor resmi server sebelum skor tampil/disimpan.
    const isServerShiken = window.location.protocol.startsWith("http") && Boolean(this.currentExamSession || this.startExamPromise);

    const result = {
      chapter: this.currentChapter.chapter,
      score: isServerShiken ? null : totalScore,
      readingScore: isServerShiken ? null : readingScore,
      choukaiScore: isServerShiken ? null : choukaiScore,
      readingCorrect,
      readingTotal,
      choukaiCorrect,
      choukaiTotal,
      correctCount: readingCorrect + choukaiCorrect,
      totalCount: questions.length,
      answers: { ...this.answers },
      mode: this.mode,
      passed: isServerShiken ? null : passed,
      isGrading: isServerShiken,
    };

    this.saveExamResult(result);
    this.currentResult = result;
    this.view = "result";
    this.render();

    // Server-authoritative submit if exam session active or pending
    if (window.location.protocol.startsWith("http") && (this.currentExamSession || this.startExamPromise)) {
      this.submitExamPromise = (async () => {
        try {
          let activeSession = this.currentExamSession;
          if (!activeSession && this.startExamPromise) {
            activeSession = await this.startExamPromise;
          }
          this.currentExamSession = null;
          this.startExamPromise = null;

          if (!activeSession) {
            // Sesi server tidak pernah terbentuk (mis. backend down saat start) —
            // jangan biarkan spinner grading menggantung selamanya tanpa fallback.
            this._submitFailed = true;
            this._fallbackToLocalGrading();
            return;
          }

          if (this.pendingSavePromises && this.pendingSavePromises.length > 0) {
            const saves = [...this.pendingSavePromises];
            this.pendingSavePromises = [];
            await Promise.allSettled(saves);
          }

          this._lastSubmitSessionId = activeSession.id;
          // RESIDUAL BUG-05: persist sessionId pada entri pending-grading agar
          // tombol "Coba Kirim Ulang ke Server" bisa dipulihkan di sesi/tab
          // berikutnya (sebelumnya retry hanya hidup di memori — bila tab ditutup,
          // entri null menetap menyesatkan sampai skor server tersinkron).
          if (this.currentResult) {
            this.currentResult.pendingSessionId = activeSession.id;
            this.saveExamResult(this.currentResult);
          }
          await this._postExamSubmitToServer(activeSession.id);
        } finally {
          this._isSubmitting = false;
        }
      })();
      return this.submitExamPromise;
    }

    this._isSubmitting = false;
  }

  // Terapkan hasil submit resmi dari server ke currentResult (dipakai submit & retry)
  _applyServerSubmitResult(json) {
    if (!json || !json.success || !json.data || !this.currentResult) return false;
    this.currentResult.score = json.data.totalScore;
    this.currentResult.readingScore = json.data.readingScore;
    this.currentResult.choukaiScore = json.data.choukaiScore;
    this.currentResult.passed = json.data.isPassed;
    this.currentResult.isGrading = false;
    // RESIDUAL BUG-07: salin angka benar resmi server — grading lokal pada data
    // publik selalu 0, sehingga banner "Total Benar" & laporan WhatsApp salah tanpa ini.
    this.currentResult.readingCorrect = json.data.readingCorrect;
    this.currentResult.readingTotal = json.data.readingTotal;
    this.currentResult.choukaiCorrect = json.data.choukaiCorrect;
    this.currentResult.choukaiTotal = json.data.choukaiTotal;
    this.currentResult.correctCount = json.data.totalCorrect;
    this.currentResult.totalCount = json.data.totalQuestions ?? this.currentResult.totalCount;
    // Sinkronkan review resmi dari backend ke memori untuk review pembahasan hasil ujian
    if (json.data.review && Array.isArray(json.data.review) && this.currentChapter?.questions) {
      const reviewMap = new Map();
      json.data.review.forEach((r) => {
        if (r.id) reviewMap.set(r.id, r);
        if (r.questionNumber !== undefined) reviewMap.set(r.questionNumber, r);
        if (r.questionId) reviewMap.set(r.questionId, r);
      });
      this.currentChapter.questions.forEach((q) => {
        const r = reviewMap.get(q.id) || reviewMap.get(q.questionNumber);
        if (r) {
          q.correctAnswer = r.correctAnswer;
          q.explanation = r.explanation;
        }
      });
    }
    this.saveExamResult(this.currentResult);
    if (this.view === "result") this.render();
    return true;
  }

  // POST /exam/submit + fallback skor lokal bila server gagal (BUG-08: spinner selamanya)
  async _postExamSubmitToServer(sessionId) {
    try {
      const res = await fetch("/api/v1/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId }),
      });
      const json = await res.json().catch(() => null);
      const applied = this._applyServerSubmitResult(json);
      this._submitFailed = !applied;
      if (!applied) this._fallbackToLocalGrading();
      return applied;
    } catch (e) {
      console.warn("Backend submit error:", e);
      this._submitFailed = true;
      this._fallbackToLocalGrading();
      return false;
    }
  }

  // Fallback: matikan isGrading & pakai skor lokal saat submit server gagal (BUG-08)
  _fallbackToLocalGrading() {
    if (!this.currentResult) return;
    const result = this.currentResult;
    const questions = (this.currentChapter && this.currentChapter.questions) || [];
    // RESIDUAL BUG-11: data.public.js (mode HTTP produksi) tidak memuat correctAnswer —
    // grading lokal mustahil. Jangan menulis skor 0 palsu permanen; pertahankan status
    // grading + tombol "Coba Kirim Ulang ke Server" sampai skor server berhasil diterima.
    if (!questions.some((q) => q.correctAnswer !== undefined)) {
      result.isGrading = true;
      if (this.view === "result") this.render();
      return;
    }
    const answers = result.answers || {};
    const readingQuestions = questions.filter((q) => q.session === "reading" || q.id <= 25);
    const choukaiQuestions = questions.filter((q) => q.session === "choukai" || (q.id > 25 && (this.currentChapter.choukaiCount || 0) > 0));
    let readingCorrect = 0;
    readingQuestions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) readingCorrect++;
    });
    let choukaiCorrect = 0;
    choukaiQuestions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) choukaiCorrect++;
    });
    const readingTotal = readingQuestions.length || 25;
    const choukaiTotal = choukaiQuestions.length;
    const readingScore = (readingCorrect / readingTotal) * 100;
    let choukaiScore = 0;
    let totalScore = 0;
    if (choukaiTotal > 0) {
      choukaiScore = (choukaiCorrect / choukaiTotal) * 100;
      totalScore = (readingScore + choukaiScore) / 2;
    } else {
      totalScore = readingScore;
    }
    const passingGrade = (this.currentChapter && this.currentChapter.passingGrade) || 80;
    result.score = totalScore;
    result.readingScore = readingScore;
    result.choukaiScore = choukaiScore;
    result.passed = totalScore >= passingGrade;
    result.isGrading = false;
    this.saveExamResult(result);
    if (this.view === "result") this.render();
  }

  // BUG-08: kirim ulang hasil ujian ke server setelah submit pertama gagal
  retrySubmitExam() {
    if (this._isSubmitting || !this._lastSubmitSessionId || !this.currentResult) return;
    this._isSubmitting = true;
    const p = (async () => {
      try {
        await this._postExamSubmitToServer(this._lastSubmitSessionId);
      } finally {
        this._isSubmitting = false;
      }
    })();
    return p;
  }

  // ==========================================
  // WHATSAPP REPORT FORMATTER
  // ==========================================
  shareResultWhatsApp() {
    if (!this.currentResult) return;
    const r = this.currentResult;
    const qList = this.currentChapter.questions;
    // RESIDUAL BUG-05/BUG-07: skor/angka benar bisa null/undefined (grading server
    // pending atau entri server-lite) — format null-safe agar tombol kirim nilai tidak crash.
    const f1 = (v) => (typeof v === "number" && isFinite(v) ? v.toFixed(1) : "0.0");
    // RESIDUAL BUG-07 varian server-lite: jumlah benar bisa tak tersedia (entri
    // sinkron /chapters pada backend lama) — jangan kirim "(0/33 Benar)" palsu.
    const rcCount = typeof r.readingCorrect === "number" ? ` (${r.readingCorrect}/${r.readingTotal ?? qList.length} Benar)` : "";
    const ckCount = typeof r.choukaiCorrect === "number" ? ` (${r.choukaiCorrect}/${r.choukaiTotal ?? 0} Benar)` : "";
    const rcCountW = typeof r.readingCorrect === "number" ? ` (${r.readingCorrect}/${r.readingTotal ?? qList.length} Benar • Bobot 4.0 Poin/Soal)` : " (Bobot 4.0 Poin/Soal)";
    const rAns = r.answers || {};

    const dateStr = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const hasChoukai = (r.choukaiTotal || 0) > 0;
    const hasAnswers = r.answers && Object.keys(r.answers).length > 0;
    let itemsStr = "";
    if (hasAnswers) {
      qList.forEach((q) => {
        const isCorrect = rAns[q.id] === q.correctAnswer;
        const mark = isCorrect ? "✅ [BENAR]" : "❌ [SALAH]";
        const userAns = rAns[q.id] ? `Opsi ${rAns[q.id]}` : "Tidak dijawab";
        const sessionTag = hasChoukai ? ((q.session === "reading" || q.id <= 25) ? "[Reading] " : "[Choukai] ") : "";
        itemsStr += `• ${sessionTag}Soal ${q.id}: ${mark} (Pilihan: ${userAns} | Kunci: ${q.correctAnswer})\n`;
      });
    } else {
      itemsStr = "• Rincian jawaban per soal tidak tersimpan di perangkat (hasil disinkronkan dari skor server).\n";
    }

    const statusBadge = r.passed ? "LULUS (合格) 🎉" : "REMEDIAL / BELUM LULUS (再試) ⚠️";
    const modeText = r.mode === "shiken" ? "Simulasi CBT" : "Latihan Mandiri";

    let headerTitle = "";
    let scoreSection = "";
    if (hasChoukai) {
      headerTitle = `🎌 *LAPORAN EVALUASI IMM JAPAN (TRYOUT TERPADU)*\n`;
      scoreSection =
        `📖 *Skor Reading (読解):* *${f1(r.readingScore)} / 100*${rcCount}\n` +
        `🎧 *Skor Choukai (聴解):* *${f1(r.choukaiScore)} / 100*${ckCount}\n` +
        `📊 *Skor Akhir Tryout:* *${f1(r.score)} / 100*\n`;
    } else {
      headerTitle = `🎌 *LAPORAN EVALUASI IMM JAPAN (UJIAN TULIS)*\n`;
      scoreSection =
        `📖 *Skor Ujian Tulis (Reading):* *${f1(r.readingScore)} / 100*${rcCountW}\n` +
        `📊 *Skor Akhir:* *${f1(r.score)} / 100*\n`;
    }

    const msg =
      headerTitle +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Peserta:* ${this.profile.name || "Siswa"}\n` +
      `🏷️ *Kelas/No:* ${this.profile.classNo || "-"}\n` +
      `🎯 *Modul:* ${this.currentChapter.title_ja} (${this.currentChapter.title_id})\n` +
      `⏱️ *Mode:* ${modeText}\n` +
      scoreSection +
      `🏆 *Status:* *${statusBadge}*\n` +
      `📌 *Passing Grade:* 80.0 Poin\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Rincian Hasil Pengerjaan (${r.totalCount ?? qList.length} Soal):*\n` +
      itemsStr +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🗓️ *Waktu:* ${dateStr}\n` +
      `🏢 *Platform:* IMM Japan CBT Engine`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  }

  // ==========================================
  // MODAL & UI CONTROLS
  // ==========================================
  openModal(modalName, data = null) {
    if (!this.isAuthenticated) {
      if (modalName !== "auth_login" && modalName !== "auth_register") {
        return;
      }
    }
    if (modalName === "admin_panel" && (!this.isAuthenticated || !this.currentUser || this.currentUser.role !== "admin")) {
      return;
    }
    this.activeModal = modalName;
    this.modalData = data;
    this.renderModal();
  }

  closeModal() {
    if (this.liveMonitoringInterval) {
      clearInterval(this.liveMonitoringInterval);
      this.liveMonitoringInterval = null;
    }
    this.pauseResourceAudio();
    this.activeModal = null;
    this.modalData = null;
    const container = document.getElementById("modal-container");
    if (container) container.innerHTML = "";
  }

  setupKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.activeModal) {
          this.closeModal();
          return;
        }
      }
      if (this.view !== "exam") return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;

      const q = this.currentChapter.questions[this.currentQuestionIdx];
      if (!q) return;

      if (e.key >= "1" && e.key <= "4") {
        const optIdx = parseInt(e.key) - 1;
        if (q.options && q.options[optIdx]) {
          this.selectOption(q.id, q.options[optIdx].id);
        }
      } else if (["a", "b", "c", "d", "A", "B", "C", "D"].includes(e.key)) {
        const letterMap = { A: 0, B: 1, C: 2, D: 3 };
        const optIdx = letterMap[e.key.toUpperCase()];
        if (q.options && q.options[optIdx]) {
          this.selectOption(q.id, q.options[optIdx].id);
        }
      } else if (e.key === "ArrowRight") {
        this.nextQuestion();
      } else if (e.key === "ArrowLeft") {
        this.prevQuestion();
      } else if (e.key === " ") {
        e.preventDefault();
        if (q.session === "choukai") {
          this.togglePlayPause();
        }
      }
    });
  }

  // ==========================================
  // VIEW RENDERING
  // ==========================================
  render() {
    const appEl = document.getElementById("app");
    if (!appEl) return;

    if (this.authChecking) {
      appEl.innerHTML = this.renderAuthCheckingHTML();
      this.updateAppGateUI();
      return;
    }

    if (!this.isAuthenticated) {
      appEl.innerHTML = this.renderAuthGateHTML();
      this.updateAppGateUI();
      return;
    }

    if (this.view === "dashboard") {
      appEl.innerHTML = this.renderDashboardHTML();
    } else if (this.view === "exam") {
      appEl.innerHTML = this.renderExamHTML();
      this.renderQuestionNav();
      this.renderQuestionContent();
      this.renderAudioVisibility();
    } else if (this.view === "result") {
      appEl.innerHTML = this.renderResultHTML();
    } else if (this.view === "kosakata") {
      appEl.innerHTML = this.renderKosakataHTML();
      this.bindKosakataEvents();
    }

    this.renderHeaderProfile();
    this.updateAppGateUI();
  }

  renderHeaderProfile() {
    const btn = document.getElementById("header-profile-btn");
    if (!btn) return;
    const displayName = (this.currentUser && this.currentUser.name) || (this.profile && this.profile.name);
    if (displayName) {
      btn.innerHTML = `
        <span class="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px] font-bold">学</span>
        <span class="hidden sm:inline font-medium text-slate-700 dark:text-slate-300 truncate max-w-[120px]">${displayName}</span>
      `;
    }
  }

  switchAuthGateTab(tab) {
    this.authGateTab = tab;
    this.render();
  }

  toggleGatePinVisibility() {
    const pinInput = document.getElementById("gate-login-pin");
    if (!pinInput) return;
    pinInput.type = pinInput.type === "password" ? "text" : "password";
  }

  fillAndLogin(username, pin) {
    const uEl = document.getElementById("gate-login-username") || document.getElementById("login-username");
    const pEl = document.getElementById("gate-login-pin") || document.getElementById("login-pin");
    if (uEl) uEl.value = username;
    if (pEl) pEl.value = pin;
    const errId = uEl && uEl.id === "gate-login-username" ? "gate-login-error" : "login-error-msg";
    return this.login(username, pin, errId);
  }

  async loginWithGoogle() {
    if (!window.location.protocol.startsWith("http")) {
      alert("Google OAuth memerlukan server HTTP / domain live.");
      return;
    }
    try {
      const res = await fetch("/api/auth/sign-in/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "google",
          callbackURL: window.location.origin,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        const err = document.getElementById("gate-login-error");
        if (err) {
          err.innerText = data.message || "Google OAuth belum dikonfigurasi di server production (Google Client ID & Secret diperlukan). Silakan gunakan login Username & PIN.";
          err.classList.remove("hidden");
        } else {
          alert("Google OAuth belum dikonfigurasi di server production. Silakan gunakan login Username & PIN.");
        }
      }
    } catch (e) {
      const err = document.getElementById("gate-login-error");
      if (err) {
        err.innerText = "Gagal menghubungkan ke layanan Google OAuth.";
        err.classList.remove("hidden");
      }
    }
  }

  renderAuthCheckingHTML() {
    return `
      <div class="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 sm:p-6 relative select-none">
        <div class="relative w-full max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-8 text-center">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-sky-700 text-white flex items-center justify-center font-black font-jp text-xl shadow-md animate-pulse">
            試
          </div>
          <h2 class="mt-4 font-black text-sm tracking-tight text-slate-900 dark:text-slate-100 font-jp">
            IMM JAPAN CBT LAB
          </h2>
          <p class="text-[11px] text-slate-500 font-jp mt-1">
            総合評価試験 ・ Reading & Choukai Engine
          </p>
          <div class="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <svg class="animate-spin h-4 w-4 text-sky-600 dark:text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Memeriksa status sesi login...</span>
          </div>
        </div>
      </div>
    `;
  }

  renderAuthGateHTML() {
    const isRegister = this.authGateTab === "register";
    return `
      <div class="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 sm:p-6 relative select-none">
        <!-- Ambient Japanese Background Ornament -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20 flex items-center justify-center">
          <div class="text-[320px] font-black font-jp text-slate-200 dark:text-slate-800 leading-none select-none tracking-tighter">
            試験
          </div>
        </div>

        <!-- Auth Gate Glass Card -->
        <div class="relative w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 transition-all">
          
          <!-- Top Utility Bar: Badge & Theme Switcher -->
          <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-sky-700 text-white flex items-center justify-center font-black font-jp text-lg shadow-md ring-2 ring-sky-500/20">
                試
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="font-black text-sm tracking-tight text-slate-900 dark:text-slate-100 font-jp">IMM JAPAN</span>
                  <span class="px-1.5 py-0.5 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 rounded text-[9px] font-extrabold font-mono tracking-wide">STRICT AUTH</span>
                </div>
                <div class="text-[10px] text-slate-500 font-jp leading-none mt-0.5">読解・聴解・語彙 総合CBTエンジン</div>
              </div>
            </div>

            <!-- Dark / Light Mode Switcher -->
            <button type="button" onclick="window.app.toggleTheme()" class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Ganti Mode Gelap / Terang">
              <svg class="w-4 h-4 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              <svg class="w-4 h-4 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            </button>
          </div>

          <!-- Announcement Banner (if any) -->
          ${this.systemStatus.announcement ? `
            <div class="mb-4 p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900/60 text-sky-800 dark:text-sky-300 text-[11px] font-medium flex items-center gap-2">
              <svg class="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
              <span class="leading-tight">${this.systemStatus.announcement}</span>
            </div>
          ` : ""}

          <!-- Tab Navigation -->
          <div class="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-5">
            <button type="button" onclick="window.app.switchAuthGateTab('login')" class="flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${!isRegister ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}">
              <span>登</span>
              <span>Masuk Sistem</span>
            </button>
            ${this.systemStatus.allowRegistration ? `
              <button type="button" onclick="window.app.switchAuthGateTab('register')" class="flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${isRegister ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}">
                <span>生</span>
                <span>Daftar Siswa</span>
              </button>
            ` : `
              <div class="flex-1 py-2 text-center text-[10px] text-slate-400 font-medium cursor-not-allowed flex items-center justify-center gap-1.5" title="Pendaftaran mandiri dinonaktifkan oleh Sensei">
                <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                <span>Registrasi Ditutup</span>
              </div>
            `}
          </div>

          ${!isRegister ? `
            <!-- TAB: LOGIN FORM -->
            <div id="gate-login-error" class="hidden mb-4 p-3 bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-medium flex items-center gap-2"></div>

            <form onsubmit="event.preventDefault(); window.app.login(document.getElementById('gate-login-username').value, document.getElementById('gate-login-pin').value, 'gate-login-error');" class="space-y-3.5">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Username Siswa / Sensei:
                </label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-mono text-xs">@</span>
                  <input id="gate-login-username" type="text" required placeholder="Masukkan username Anda" autocomplete="username" class="w-full pl-8 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono shadow-2xs">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password / PIN:
                </label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg></span>
                  <input id="gate-login-pin" type="password" required placeholder="Masukkan password Anda" autocomplete="current-password" class="w-full pl-8 pr-10 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono shadow-2xs">
                  <button type="button" onclick="window.app.toggleGatePinVisibility()" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600" title="Tampilkan / Sembunyikan Password"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button>
                </div>
              </div>

              <button type="submit" id="gate-btn-submit" class="w-full mt-2 py-3 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2">
                <span>Masuk ke Sistem CBT</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </form>

            <!-- Divider -->
            <div class="relative my-4">
              <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
              <div class="relative flex justify-center text-[10px] uppercase"><span class="bg-white dark:bg-slate-900 px-2 text-slate-400 font-bold tracking-wider">opsi otentikasi</span></div>
            </div>

            <!-- Google OAuth Button -->
            <button type="button" id="gate-btn-google" onclick="window.app.loginWithGoogle()" class="w-full py-2.5 px-3 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition flex items-center justify-center gap-2.5 shadow-2xs">
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
              <span>Masuk dengan Akun Google</span>
            </button>
          ` : `
            <!-- TAB: REGISTRATION FORM -->
            <div id="gate-reg-error" class="hidden mb-4 p-3 bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-medium flex items-center gap-2"></div>

            <form onsubmit="event.preventDefault(); window.app.registerStudent({
              name: document.getElementById('gate-reg-name').value,
              username: document.getElementById('gate-reg-username').value,
              pin: document.getElementById('gate-reg-pin').value,
              className: document.getElementById('gate-reg-class').value,
              email: document.getElementById('gate-reg-email').value,
            }, 'gate-reg-error');" class="space-y-2.5">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap Siswa:</label>
                <input id="gate-reg-name" type="text" required placeholder="Contoh: Dadan Ramdani" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Username (Login LPK):</label>
                <input id="gate-reg-username" type="text" required placeholder="Contoh: dadan.ramdani" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">PIN 6-Digit:</label>
                <input id="gate-reg-pin" type="password" required placeholder="6-digit angka" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Kelas / Angkatan:</label>
                <input id="gate-reg-class" type="text" placeholder="Angkatan 35-A" value="Angkatan 35-A" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Email (Opsional):</label>
                <input id="gate-reg-email" type="email" placeholder="dadan@contoh.com" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500">
              </div>
              <button type="submit" id="gate-btn-reg-submit" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm mt-3">
                Daftar & Masuk ke Lab CBT &rarr;
              </button>
            </form>

            <div class="mt-3 text-center">
              <button type="button" onclick="window.app.switchAuthGateTab('login')" class="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline">
                &larr; Sudah punya akun? Kembali ke form login
              </button>
            </div>
          `}

          <!-- Footer Security Notice -->
          <div class="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
            <div class="inline-flex items-center gap-1.5 text-[10px] text-slate-400">
              <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              <span>Sesi Terenkripsi & Anti-Curang CBT ｜ Better Auth & RBAC Guard</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // SCREEN 1: DASHBOARD
  renderDashboardHTML() {
    const chapters = CHAPTERS_INDEX;
    let cardsHTML = "";
    let completedCount = 0;
    let totalScoreSum = 0;

    chapters.forEach((ch) => {
      const prog = this.progress[ch.num];
      const isCompleted = Boolean(prog);
      if (isCompleted) {
        completedCount++;
        // BUG-05: null-guard skor (entri server pending/failed tersimpan sebagai null)
        totalScoreSum += Number(prog.score) || 0;
      }

      const scoreBadge = isCompleted
        ? `<span class="px-2 py-0.5 rounded text-xs font-bold ${prog.passed ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400" : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400"}">${(Number(prog.score) || 0).toFixed(0)} Poin</span>`
        : "";

      const chData = typeof CHAPTERS_DATA !== "undefined" ? CHAPTERS_DATA[ch.num] : null;
      const pdfReadingSoal = this.pdfUrl(chData ? chData.pdfReadingSoalUrl : `assets/pdf/Salinan Soal Bab ${ch.num}.pdf`);
      const pdfReadingKunci = this.pdfUrl(chData ? chData.pdfReadingKunciUrl : `assets/pdf/Kunci dan Pembahasan Bab ${ch.num}.pdf`);

      const isUserRestricted = Boolean(this.currentUser && this.currentUser.role !== "admin" && this.userRestrictedChapters && this.userRestrictedChapters[ch.num]);
      const isLockedBySensei = Boolean(this.currentUser && this.currentUser.role !== "admin" && (this.systemStatus?.globalExamLock || this.chaptersStatus[ch.num] === false));

      let actionButton = "";
      if (!ch.available) {
        actionButton = `<button disabled class="w-full mt-3 py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-md text-xs font-semibold cursor-not-allowed">
            Terkunci (Segera Hadir)
          </button>`;
      } else if (isUserRestricted) {
        if (isCompleted) {
          actionButton = `<div class="grid grid-cols-5 gap-1.5 mt-3">
              <button onclick="window.app.viewSavedResult('${ch.num}')" class="col-span-2 py-2 px-1 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-md text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs" title="Lihat hasil & pembahasan tryout sebelumnya">
                Hasil
              </button>
              <button disabled class="col-span-2 py-2 px-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-900 rounded-md text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1 shadow-xs" title="Akses bab ini dibatasi khusus untuk akun Anda oleh pengawas">
                <svg class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                <span>Mulai (Dibatasi Pengawas)</span>
              </button>
              <button onclick="window.app.goToKosakata('${ch.num}')" class="col-span-1 py-2 px-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-md text-xs font-bold font-jp transition flex items-center justify-center shadow-xs" title="Buka Hafalan Kosakata Bab ${ch.num}">
                語
              </button>
            </div>`;
        } else {
          actionButton = `<div class="grid grid-cols-5 gap-1.5 mt-3">
              <button disabled class="col-span-4 py-2 px-2 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-900 rounded-md text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1.5 shadow-xs" title="Akses bab ini dibatasi khusus untuk akun Anda oleh pengawas">
                <svg class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                <span>Mulai Bab ${ch.num} (Dibatasi Pengawas)</span>
              </button>
              <button onclick="window.app.goToKosakata('${ch.num}')" class="col-span-1 py-2 px-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-md text-xs font-bold font-jp transition flex items-center justify-center shadow-xs" title="Buka Hafalan Kosakata Bab ${ch.num}">
                語
              </button>
            </div>`;
        }
      } else if (isLockedBySensei) {
        actionButton = `<div class="grid grid-cols-5 gap-1.5 mt-3">
            <button disabled class="col-span-4 py-2 px-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-md text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1.5" title="Bab ini sedang dikunci oleh Pengawas">
              <svg class="w-3.5 h-3.5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              <span>Terkunci Sensei</span>
            </button>
            <button onclick="window.app.goToKosakata('${ch.num}')" class="col-span-1 py-2 px-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-md text-xs font-bold font-jp transition flex items-center justify-center shadow-xs" title="Buka Hafalan Kosakata Bab ${ch.num}">
              語
            </button>
          </div>`;
      } else if (isCompleted) {
        actionButton = `<div class="grid grid-cols-5 gap-1.5 mt-3">
            <button onclick="window.app.viewSavedResult('${ch.num}')" class="col-span-2 py-2 px-1 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-md text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs" title="Lihat hasil & pembahasan tryout sebelumnya">
              Hasil
            </button>
            <button onclick="window.app.promptStartExam('${ch.num}')" class="col-span-2 py-2 px-1 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm" title="Ulangi tryout bab ini">
              Ulangi
            </button>
            <button onclick="window.app.goToKosakata('${ch.num}')" class="col-span-1 py-2 px-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-md text-xs font-bold font-jp transition flex items-center justify-center shadow-xs" title="Buka Hafalan Kosakata Bab ${ch.num}">
              語
            </button>
          </div>`;
      } else {
        actionButton = `<div class="grid grid-cols-5 gap-1.5 mt-3">
            <button onclick="window.app.promptStartExam('${ch.num}')" class="col-span-4 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>
              Mulai Bab ${ch.num}
            </button>
            <button onclick="window.app.goToKosakata('${ch.num}')" class="col-span-1 py-2 px-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-md text-xs font-bold font-jp transition flex items-center justify-center shadow-xs" title="Buka Hafalan Kosakata Bab ${ch.num}">
              語
            </button>
          </div>`;
      }

      const pdfCardLinks = ch.available
        ? `<div class="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            <a href="${pdfReadingSoal}" target="_blank" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1" title="${ch.choukaiQuestions > 0 ? 'Unduh Lembar Soal Tryout Terpadu 33 Soal PDF' : 'Unduh Lembar Soal PDF'}">
              <svg class="w-3 h-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              ${ch.choukaiQuestions > 0 ? 'Soal Tryout' : 'Soal PDF'}
            </a>
            <span class="text-slate-300 dark:text-slate-700">&bull;</span>
            <a href="${pdfReadingKunci}" target="_blank" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1" title="${ch.choukaiQuestions > 0 ? 'Unduh Kunci & Pembahasan Tryout Terpadu 33 Soal PDF' : 'Unduh Kunci & Pembahasan PDF'}">
              <svg class="w-3 h-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              ${ch.choukaiQuestions > 0 ? 'Kunci Tryout' : 'Kunci PDF'}
            </a>
            <span class="text-slate-300 dark:text-slate-700">&bull;</span>
            <a href="${this.pdfUrl(`assets/pdf/Daftar Kosakata Bab ${ch.num}.pdf`)}" target="_blank" class="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1" title="Unduh Lembar Hafalan Kosakata Bab ${ch.num} PDF">
              <svg class="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
              Kosakata
            </a>
            ${ch.choukaiQuestions > 0 ? `
              <span class="text-slate-300 dark:text-slate-700">&bull;</span>
              <a href="${this.pdfUrl(`assets/pdf/Soal Choukai Bab ${ch.num}.pdf`)}" target="_blank" class="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1" title="Unduh Khusus Soal Choukai Bab ${ch.num} PDF">
                Choukai
              </a>
              <span class="text-slate-300 dark:text-slate-700">&bull;</span>
              <a href="${this.pdfUrl(`assets/pdf/Kunci dan Pembahasan Choukai Bab ${ch.num}.pdf`)}" target="_blank" class="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1" title="Unduh Khusus Kunci & Pembahasan Choukai Bab ${ch.num} PDF">
                Kunci Choukai
              </a>
            ` : ""}
          </div>`
        : "";

      cardsHTML += `
        <div class="border ${isUserRestricted ? "border-amber-300 dark:border-amber-800 bg-amber-50/20 dark:bg-amber-950/20 shadow-sm" : ch.available ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm" : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-75"} rounded-lg p-4 flex flex-col justify-between transition hover:border-sky-500">
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold font-jp ${ch.available ? "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}">
                BAB ${ch.num}
              </span>
              <div class="flex items-center gap-1.5">
                ${isUserRestricted ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1"><svg class="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg><span>Dibatasi Pengawas</span></span>` : ""}
                ${scoreBadge}
                <span class="text-[10px] text-slate-400 font-mono">${ch.totalQuestions || 33} Soal</span>
              </div>
            </div>
            <h3 class="font-jp font-bold text-sm text-slate-900 dark:text-slate-100 mb-1 leading-snug">${ch.title_ja}</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 mb-2">${ch.title_id}</p>
          </div>
          <div>
            ${actionButton}
            <button type="button" onclick="window.app.openChapterResourcesModal('${ch.num}')" class="w-full mt-2.5 py-1.5 px-2 bg-slate-100 hover:bg-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 rounded-md text-[11px] font-bold transition flex items-center justify-between border border-slate-200/90 dark:border-slate-700 shadow-2xs group" title="Buka Dokumen PDF & Audio Belajar Bab ${ch.num}">
              <span class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-sky-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
                Dokumen & Audio Bab ${ch.num}
              </span>
              <span class="px-1.5 py-0.2 rounded text-[10px] font-mono ${ch.choukaiQuestions > 0 ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}">
                ${ch.choukaiQuestions > 0 ? `<span class="inline-flex items-center gap-1">5 Dokumen + <svg class="w-3 h-3 text-sky-600 dark:text-sky-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h2v5z"/></svg></span>` : '3 Dokumen'}
              </span>
            </button>
            <div class="hidden" aria-hidden="true">
              ${pdfCardLinks}
            </div>
          </div>
        </div>
      `;
    });

    const avgScore = completedCount > 0 ? (totalScoreSum / completedCount).toFixed(1) : 0;

    return `
      <div class="max-w-6xl mx-auto px-4 py-6">
        <!-- Dashboard Hero & Overview -->
        <div class="bg-gradient-to-r from-sky-900 to-slate-900 rounded-xl p-6 text-white mb-6 shadow-md border border-slate-800">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span class="px-2.5 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded text-xs font-semibold tracking-wide uppercase font-jp">
                IMM JAPAN 研修生カリキュラム
              </span>
              <h1 class="text-xl md:text-2xl font-black font-jp mt-2 tracking-tight">
                プラットフォーム CBT 評価試験 ・ Tryout Terpadu
              </h1>
              <p class="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
                Paket evaluasi terstandarisasi untuk calon peserta magang teknis IMM Japan & visa Tokutei Ginou (SSW). Seluruh Bab 01 s.d. 25 Siap Ujian (Reading & Tryout Terpadu).
              </p>
            </div>
            <!-- Quick Stats -->
            <div class="flex items-center gap-4 bg-slate-800/80 border border-slate-700/80 rounded-lg p-3 shrink-0">
              <div class="text-center px-2">
                <span class="block text-lg font-black text-white font-mono">${completedCount}/${chapters.filter(c => c.available).length}</span>
                <span class="text-[10px] text-slate-400 uppercase tracking-wider">Bab Selesai</span>
              </div>
              <div class="w-px h-8 bg-slate-700"></div>
              <div class="text-center px-2">
                <span class="block text-lg font-black ${avgScore >= 80 ? "text-emerald-400" : "text-amber-400"} font-mono">${avgScore}</span>
                <span class="text-[10px] text-slate-400 uppercase tracking-wider">Rata-rata</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Title & PDF Downloads -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 class="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              Katalog Bab Lengkap (Bab 01 s.d. Bab 25)
            </h2>
            <p class="text-xs text-slate-500">Pilih modul bab tryout atau buka hafalan kosakata di bawah ini</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="window.app.openPdfLibraryModal()" class="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm" title="Buka Bank Dokumen PDF Lengkap (112 File)">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
              <span>Bank Dokumen PDF (112 File)</span>
            </button>
            <button onclick="window.app.goToKosakata('01')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm" title="Buka Modul Hafalan Kosakata Interaktif">
              <span class="font-jp">語</span>
              Hafalan Kosakata (1.500 Kata)
            </button>
            <a href="${this.pdfUrl('assets/pdf/Daftar Kosakata Lengkap Bab 01-25.pdf')}" target="_blank" class="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition flex items-center gap-1.5 shadow-xs" title="Unduh Lembar Setoran Lengkap Bab 01-25 (76 Halaman)">
              <svg class="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Bundle Kosakata (76 Hal)
            </a>
          </div>
        </div>

        <!-- Chapters Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          ${cardsHTML}
        </div>
      </div>
    `;
  }

  // SCREEN 2: EXAM RUNTIME
  renderExamHTML() {
    const q = this.currentChapter.questions[this.currentQuestionIdx];
    const isChoukai = q && q.session === "choukai";

    return `
      <div class="max-w-5xl mx-auto px-4 py-4">
        <!-- Top Exam Header -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 mb-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <button onclick="window.app.goToDashboard()" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Kembali
            </button>
            <div class="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
            <div>
              <h2 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 font-jp">${this.currentChapter.title_ja}</h2>
            </div>
          </div>

          <!-- Mode Badge & Controls -->
          <div class="flex items-center gap-2.5">
            <!-- Active Mode Badge -->
            ${
              this.mode === "shiken"
                ? `<div id="exam-mode-badge" class="bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-2.5 py-1 rounded text-xs font-bold font-jp flex items-center gap-1.5 shadow-2xs" title="Mode Simulasi CBT (Resmi IMM Japan)">
                    <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    <span>試験 Ujian CBT</span>
                  </div>`
                : `<div id="exam-mode-badge" class="bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 px-2.5 py-1 rounded text-xs font-bold font-jp flex items-center gap-1.5 shadow-2xs" title="Mode Latihan (Bebas Waktu)">
                    <span class="w-2 h-2 rounded-full bg-sky-500"></span>
                    <span>練習 Latihan</span>
                  </div>`
            }

            <!-- Timer (if Mode Shiken) -->
            ${
              this.mode === "shiken"
                ? `<div class="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 px-2.5 py-1 rounded text-xs font-mono font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1 shadow-2xs">
                    <svg class="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span id="exam-timer-display">${this.currentChapter.questions.some(item => item.session === "choukai") ? "60:00" : "50:00"}</span>
                  </div>`
                : ""
            }

            <!-- Furigana Toggle -->
            <button id="furigana-toggle-btn" onclick="window.app.toggleFurigana()" class="px-2 py-1 border border-slate-300 dark:border-slate-700 rounded text-xs font-jp text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition" title="Toggle Furigana / Kana Display">
              かな <span class="text-[10px] text-slate-400 font-bold">${this.showFurigana ? "ON" : "OFF"}</span>
            </button>
          </div>
        </div>

        <!-- Audio Player Console (Active ONLY for Choukai Session) -->
        <div id="audio-player-wrapper" class="${isChoukai ? "" : "hidden"} bg-slate-900 text-white rounded-lg p-3 sm:p-4 mb-4 shadow-md border border-slate-800 transition-all">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
            <!-- Play/Pause & Times -->
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <button id="audio-play-btn" onclick="window.app.togglePlayPause()" class="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center transition shrink-0 shadow">
                <svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <div>
                <div class="text-[11px] font-bold text-sky-400 font-mono tracking-wide" id="audio-header-title">Audio Soal ${q ? q.id : ""} (Sesi Choukai)</div>
                <div class="text-xs font-mono flex items-center gap-1 text-slate-300">
                  <span id="audio-current-time">00:00</span>
                  <span>/</span>
                  <span id="audio-total-time">${q && q.audioDuration ? q.audioDuration : "00:50"}</span>
                </div>
              </div>
            </div>

            <!-- Scrubber Track -->
            <div class="w-full flex-1 sm:mx-2">
              <input id="audio-scrubber" type="range" min="0" max="100" value="0" class="w-full audio-range" oninput="window.app.seekAudio((this.value / 100) * window.app.audio.duration)">
            </div>

            <!-- Speed & Audio Badge -->
            <div class="flex items-center gap-2 shrink-0">
              <button id="audio-speed-btn" onclick="window.app.cyclePlaybackRate();" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-mono font-bold transition" title="${this.getAudioSpeedTitle()}">
                ${Number(this.playbackRate).toFixed(1)}x
              </button>
              <span class="text-[10px] text-slate-400 font-jp px-2 py-0.5 bg-slate-800/70 rounded flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Jeda 5s Antar-Soal
              </span>
            </div>
          </div>
        </div>

        <!-- Question Navigation Bar -->
        <div id="question-nav-container" class="mb-4"></div>

        <!-- Active Question Panel -->
        <div id="question-content-container" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-6 shadow-sm"></div>
      </div>
    `;
  }

  renderQuestionNav() {
    const navEl = document.getElementById("question-nav-container");
    if (!navEl) return;

    const currentQ = this.getCurrentQuestion();
    const currentSession = currentQ && currentQ.session === "choukai" ? "choukai" : "reading";

    const questions = this.currentChapter.questions;
    const readingQuestions = questions.filter((q) => q.session === "reading" || q.id <= 25);
    const choukaiQuestions = questions.filter((q) => q.session === "choukai" || q.id > 25);

    let readingAnswered = 0;
    readingQuestions.forEach((q) => {
      if (this.answers[q.id] !== undefined) readingAnswered++;
    });

    let choukaiAnswered = 0;
    choukaiQuestions.forEach((q) => {
      if (this.answers[q.id] !== undefined) choukaiAnswered++;
    });

    const renderNavButtons = (list) => {
      let html = "";
      list.forEach((q) => {
        const qIdx = questions.findIndex((item) => item.id === q.id);
        const isCurrent = qIdx === this.currentQuestionIdx;
        const isAnswered = this.answers[q.id] !== undefined;

        let bgClass = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700";
        if (isCurrent) {
          bgClass = "bg-sky-600 text-white border-sky-600 font-bold ring-2 ring-sky-300 dark:ring-sky-900 shadow-xs";
        } else if (isAnswered) {
          bgClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700";
        }

        html += `
          <button data-qidx="${qIdx}" onclick="window.app.goToQuestion(${qIdx})" class="w-8 h-8 rounded-md border text-xs font-mono font-bold flex items-center justify-center shrink-0 transition ${bgClass}" title="Soal ${q.id}">
            ${q.id}
          </button>
        `;
      });
      return html;
    };

    const answeredCount = Object.keys(this.answers).length;
    const totalCount = questions.length;

    navEl.innerHTML = `
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs">
        <!-- Top Session Indicator Bar -->
        <div class="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2">
            ${choukaiQuestions.length > 0 ? `
              <button onclick="window.app.goToSession('reading')" class="px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 ${currentSession === 'reading' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                <span>Sesi 1: Reading</span>
                <span class="text-[10px] font-mono px-1 py-0.2 rounded ${currentSession === 'reading' ? 'bg-sky-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}">${readingAnswered}/${readingQuestions.length}</span>
              </button>
              <button onclick="window.app.goToSession('choukai')" class="px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 ${currentSession === 'choukai' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h2v5z"/></svg>
                <span>Sesi 2: Choukai</span>
                <span class="text-[10px] font-mono px-1 py-0.2 rounded ${currentSession === 'choukai' ? 'bg-sky-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}">${choukaiAnswered}/${choukaiQuestions.length}</span>
              </button>
            ` : `
              <div class="px-2.5 py-1 rounded text-xs font-bold bg-sky-600 text-white shadow-xs flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                <span>Ujian Tulis (Reading)</span>
                <span class="text-[10px] font-mono px-1 py-0.2 rounded bg-sky-700 text-white">${readingAnswered}/${readingQuestions.length}</span>
              </div>
            `}
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500 font-mono hidden sm:inline">${answeredCount}/${totalCount} Terjawab</span>
            <button onclick="window.app.openModal('confirm_submit')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition shadow-sm">
              Kumpulkan Ujian
            </button>
          </div>
        </div>

        <!-- Question Number Buttons Grid -->
        <div class="space-y-2">
          <!-- Sesi 1 (Reading) -->
          <div class="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
            <span class="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider w-16 shrink-0">Reading:</span>
            ${renderNavButtons(readingQuestions)}
          </div>
          ${choukaiQuestions.length > 0 ? `
            <!-- Sesi 2 (Choukai) -->
            <div class="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
              <span class="text-[10px] font-bold text-sky-500 uppercase font-mono tracking-wider w-16 shrink-0">Choukai:</span>
              ${renderNavButtons(choukaiQuestions)}
            </div>
          ` : ""}
        </div>
      </div>
    `;

    setTimeout(() => {
      const activeBtn = navEl.querySelector(`button[data-qidx="${this.currentQuestionIdx}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }, 40);
  }

  renderQuestionContent() {
    const container = document.getElementById("question-content-container");
    if (!container) return;

    const q = this.currentChapter.questions[this.currentQuestionIdx];
    const isAnswered = this.answers[q.id] !== undefined;
    const selectedAns = this.answers[q.id];
    const isChoukai = q.session === "choukai";

    // Image section
    let visualHTML = "";
    if (q.type === "gambar" && q.image) {
      visualHTML = `
        <div class="my-4 text-center">
          <div class="relative inline-block border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-950 p-2 cursor-zoom-in" onclick="window.app.openModal('image_zoom', '${q.image}')">
            <img src="${q.image}" alt="Soal ${q.id}" class="max-h-60 mx-auto rounded object-contain">
            <span class="absolute bottom-3 right-3 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] rounded backdrop-blur font-mono flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Klik untuk perbesar
            </span>
          </div>
        </div>
      `;
    }

    // Option cards (Pure Japanese / Clean text in exam mode)
    let optionsHTML = "";
    q.options.forEach((opt) => {
      const isSelected = selectedAns === opt.id;
      const btnState = isSelected ? "selected" : "";
      const optCleanJa = opt.text_ja.replace(/^[①②③④\d]+[\s.、]*\s*/, "");

      optionsHTML += `
        <button onclick="window.app.selectOption('${q.id}', '${opt.id}')" class="option-btn ${btnState} p-3.5 rounded-lg flex items-start gap-3 w-full">
          <span class="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold shrink-0 font-jp ${isSelected ? "bg-sky-600 text-white border-sky-600" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}">
            ${opt.symbol || opt.id}
          </span>
          <div class="text-left flex-1">
            <div class="font-jp font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">${optCleanJa}</div>
          </div>
        </button>
      `;
    });

    const questionTextDisplay = (this.showFurigana && q.question_ruby) ? q.question_ruby : q.question_ja;

    container.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded ${isChoukai ? "bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300" : "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300"} text-xs font-bold font-mono">
            SOAL ${q.id}
          </span>
          <span class="text-xs text-slate-600 dark:text-slate-400 font-jp font-semibold">${q.section_ja}</span>
        </div>
        <div class="flex items-center gap-2">
          ${isChoukai ? `
            <button onclick="window.app.playQuestionAudio(${q.id})" class="px-2.5 py-1 rounded bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm" title="Putar audio soal ${q.id} (${q.audioDuration || '00:50'})">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <span>Putar Audio (${q && q.audioDuration ? q.audioDuration : "00:50"})</span>
            </button>
            <span class="text-[11px] text-slate-400 font-mono">Bobot: 12.5 Poin</span>
          ` : `
            <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-[11px] font-mono">Bobot: 4.0 Poin</span>
          `}
        </div>
      </div>

      <div class="mb-4">
        <h3 class="text-base sm:text-lg font-bold font-jp text-slate-900 dark:text-slate-100 leading-relaxed">
          ${questionTextDisplay}
        </h3>
      </div>

      ${visualHTML}

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        ${optionsHTML}
      </div>

      <!-- Bottom Nav buttons -->
      <div class="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button onclick="window.app.prevQuestion()" class="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition ${this.currentQuestionIdx === 0 ? "opacity-50 pointer-events-none" : ""}">
          &larr; Soal Sebelumnya
        </button>
        <button onclick="window.app.nextQuestion()" class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-semibold transition ${this.currentQuestionIdx === this.currentChapter.questions.length - 1 ? "opacity-50 pointer-events-none" : ""}">
          ${(this.currentQuestionIdx === 24 && this.currentChapter.questions.some(item => item.session === "choukai")) ? "Lanjut ke Sesi Choukai (Soal 26) &rarr;" : "Soal Selanjutnya &rarr;"}
        </button>
      </div>
    `;
  }

  // SCREEN 3: RESULT VIEW
  renderResultHTML() {
    if (!this.currentResult) return "";
    const r = this.currentResult;

    // RESIDUAL BUG-05: entri hasil ber-skor null (legacy pra-fix tanpa flag isGrading,
    // atau submit server yang tak pernah merespons) TIDAK boleh dirender sebagai
    // "0.0 / REMEDIAL" palsu — perlakukan sebagai pending (採点中) hingga skor
    // server tersinkron lewat fetchChaptersStatus atau tombol kirim ulang.
    if (r.isGrading || typeof r.score !== "number") {
      return `
        <div class="max-w-xl mx-auto py-20 px-4 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-sky-600 dark:text-sky-400 mb-4 shadow-sm">
            <svg class="w-8 h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
          <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 font-jp">
            採点中... Memeriksa Lembar Ujian
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Sistem CBT sedang menghitung skor resmi dan memverifikasi integritas jawaban Anda di server. Mohon tunggu sejenak...
          </p>
          ${this._submitFailed && this._lastSubmitSessionId ? `
            <button onclick="window.app.retrySubmitExam()" class="mt-5 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-sm mx-auto" title="Grading lokal tidak tersedia (data publik tanpa kunci). Coba kirim ulang ke server.">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Coba Kirim Ulang ke Server
            </button>
          ` : ""}
        </div>
      `;
    }

    const qList = this.currentChapter.questions;
    // RESIDUAL BUG-06/BUG-05: entri hasil versi-server tidak memuat jawaban per soal,
    // dan entri pending bisa ber-skor null — guard agar layar hasil tidak crash
    // (TypeError pada r.answers[q.id] / null.toFixed) dan statistik tetap tampil wajar.
    const fmtScore = (v) => (typeof v === "number" && isFinite(v) ? v.toFixed(1) : "0.0");
    // RESIDUAL BUG-07 varian server-lite: entri sinkron /chapters pada backend
    // lama tidak memuat jumlah benar — jangan tampilkan "0 dari 33" yang salah.
    const fmtCorrect = (v, total, suffix) =>
      typeof v === "number" ? `${v} dari ${total} Soal Benar${suffix || ""}` : "Jumlah benar tidak tersedia";
    const rAnswers = r.answers || {};
    const hasDetail = Object.keys(rAnswers).length > 0;
    const rlTotal = r.readingTotal ?? qList.filter((q) => q.session === "reading" || q.id <= 25).length;
    const ckTotal = r.choukaiTotal ?? qList.filter((q) => q.session === "choukai" || (q.id > 25 && (this.currentChapter.choukaiCount || 0) > 0)).length;

    const wrongQuestions = hasDetail ? qList.filter((q) => rAnswers[q.id] !== q.correctAnswer) : [];
    const correctQuestions = hasDetail ? qList.filter((q) => rAnswers[q.id] === q.correctAnswer) : [];

    const renderCard = (q, isCorrect) => {
      const userAns = rAnswers[q.id];
      const isChoukai = q.session === "choukai";

      let dialogueScriptHTML = "";
      if (isChoukai && q.dialogue) {
        q.dialogue.forEach((d) => {
          dialogueScriptHTML += `
            <div class="text-[11px] mb-1">
              <span class="font-bold text-sky-700 dark:text-sky-400">${d.speaker}:</span>
              <span class="font-jp text-slate-800 dark:text-slate-200">${d.text_ja}</span>
              <div class="text-slate-500 italic pl-3 text-[10px]">└ ${d.text_id}</div>
            </div>
          `;
        });
      }

      return `
        <div class="border ${isCorrect ? "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/10 dark:bg-emerald-950/10" : "border-rose-300 dark:border-rose-900/70 bg-rose-50/20 dark:bg-rose-950/20"} rounded-xl p-4 sm:p-5 shadow-sm mb-4 transition">
          <div class="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
            <div class="flex items-center gap-2.5">
              <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"} font-mono shadow-sm">
                ${q.id}
              </span>
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] px-1.5 py-0.2 rounded font-bold font-mono ${isChoukai ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300" : "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"}">
                    ${isChoukai ? "CHOUKAI" : "READING"}
                  </span>
                  <span class="text-[10px] text-slate-400 font-jp uppercase">${q.section_ja}</span>
                </div>
                <span class="font-jp font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 block mt-0.5">${q.question_ja}</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${isCorrect ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"} flex items-center gap-1 shrink-0">
              ${isCorrect ? `<svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> BENAR (+${isChoukai ? "12.5" : "4.0"})` : `<svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg> SALAH (0)`}
            </span>
          </div>

          <div class="text-xs text-slate-600 dark:text-slate-400 mb-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            <div>Jawaban Anda: <strong class="${isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}">${userAns ? "Opsi " + userAns : "Tidak Dijawab"}</strong></div>
            <div>Kunci Jawaban: <strong class="text-sky-600 dark:text-sky-400">Opsi ${q.correctAnswer}</strong></div>
            ${isChoukai ? `
              <button onclick="window.app.toggleResultAudio(${q.id})" id="result-audio-btn-${q.id}" class="text-[11px] text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-mono font-semibold">
                <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span>Dengar Ulang Audio Soal ${q.id} (${q && q.audioDuration ? q.audioDuration : "00:50"})</span>
              </button>
            ` : ""}
          </div>

          ${q.image ? `
            <div class="my-3">
              <div class="relative inline-block border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-950 p-2 cursor-zoom-in" onclick="window.app.openModal('image_zoom', '${q.image}')">
                <img src="${q.image}" alt="Soal ${q.id}" class="max-h-48 mx-auto rounded object-contain">
                <span class="absolute bottom-2 right-2 px-1.5 py-0.5 bg-slate-900/80 text-white text-[9px] rounded backdrop-blur font-mono flex items-center gap-1">
                  <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  Perbesar
                </span>
              </div>
            </div>
          ` : ""}

          <!-- Pilihan Opsi Review -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2.5">
            ${q.options.map((opt) => {
              const isSelected = userAns === opt.id;
              const isTargetCorrect = q.correctAnswer === opt.id;
              let optBorder = "border-slate-200 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300";
              let badgeColor = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
              let tag = "";
              if (isTargetCorrect) {
                optBorder = "border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold";
                badgeColor = "bg-emerald-600 text-white";
                tag = `<span class="ml-auto text-[10px] text-emerald-700 dark:text-emerald-300 font-bold font-mono inline-flex items-center gap-1"><svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg><span>✓ Kunci</span></span>`;
              } else if (isSelected && !isCorrect) {
                optBorder = "border-rose-300 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-semibold";
                badgeColor = "bg-rose-600 text-white";
                tag = `<span class="ml-auto text-[10px] text-rose-700 dark:text-rose-300 font-bold font-mono inline-flex items-center gap-1"><svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg><span>✕ Pilihan Anda</span></span>`;
              }
              const optCleanJa = opt.text_ja.replace(/^[①②③④\d]+[\s.、]*\s*/, "");
              return `
                <div class="p-2 rounded-lg border ${optBorder} flex items-center gap-2 text-xs">
                  <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-jp shrink-0 ${badgeColor}">
                    ${opt.symbol || opt.id}
                  </span>
                  <span class="font-jp text-[11.5px]">${optCleanJa}</span>
                  ${tag}
                </div>
              `;
            }).join("")}
          </div>

          ${isChoukai && dialogueScriptHTML ? `
            <details class="bg-white dark:bg-slate-800/80 rounded-lg p-3 my-2.5 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <summary class="cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg><span>Transkrip Percakapan Lengkap & Terjemahan</span></span>
                <span class="text-[10px] text-slate-400">Klik untuk buka/tutup</span>
              </summary>
              <div class="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5">
                ${dialogueScriptHTML}
              </div>
            </details>
          ` : ""}

          ${q.translation ? `
            <div class="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 mb-2.5">
              <span class="font-bold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"><span class="px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono">ID</span> Terjemahan Konteks:</span> ${q.translation}
            </div>
          ` : ""}

          <!-- Explanation notes -->
          ${q.explanation ? `
          <div class="space-y-2 text-xs">
            ${q.explanation.logic ? `
            <div class="bg-white dark:bg-slate-800/90 p-3 rounded-lg border ${isCorrect ? "border-emerald-100 dark:border-emerald-950" : "border-rose-100 dark:border-rose-950"} text-slate-700 dark:text-slate-200">
              <strong class="${isCorrect ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"} block mb-1">
                ${isCorrect ? `<span class="inline-flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-emerald-600 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg><span>Analisis Mengapa Jawaban Anda Tepat:</span></span>` : `<span class="inline-flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-rose-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg><span>Bedah Kesalahan & Jebakan Logika:</span></span>`}
              </strong>
              <p class="leading-relaxed">${q.explanation.logic}</p>
            </div>
            ` : ""}

            ${!isCorrect && q.explanation.distractor ? `
            <div class="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200">
              <strong class="text-amber-800 dark:text-amber-300 block mb-1 flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg><span>Jebakan Distraktor Pengecoh:</span></strong>
              <div class="whitespace-pre-line leading-relaxed text-[11.5px]">${q.explanation.distractor}</div>
            </div>
            ` : ""}

            ${q.explanation.grammarRule ? `
            <div class="bg-sky-50 dark:bg-sky-950/40 p-3 rounded-lg border border-sky-200 dark:border-sky-900 text-sky-900 dark:text-sky-200">
              <strong class="block mb-1 flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg><span>Poin Kaidah Bab ${this.currentChapter.chapter}:</span></strong>
              <p class="leading-relaxed text-[11.5px]">${q.explanation.grammarRule}</p>
            </div>
            ` : ""}
          </div>
          ` : ""}
        </div>
      `;
    };

    return `
      <div class="max-w-4xl mx-auto px-4 py-6">
        <!-- Hero Score Banner -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-md text-center mb-6">
          <span class="px-3 py-1 rounded-full text-xs font-bold ${r.passed ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400" : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400"} uppercase tracking-wide">
            ${r.passed ? "LULUS EVALUASI (合格)" : "REMEDIAL / BELUM LULUS (再試)"}
          </span>
          <div class="text-4xl sm:text-5xl font-black font-mono mt-3 mb-1 ${r.passed ? "text-emerald-600" : "text-rose-600"}">
            ${fmtScore(r.score)} <span class="text-lg text-slate-400 font-normal">/ 100</span>
          </div>
          <p class="text-xs text-slate-500 mb-4">
            ${typeof r.correctCount === "number" ? `Total Benar: ${r.correctCount} dari ${r.totalCount ?? qList.length} Soal` : "Rincian jumlah benar tidak tersedia (skor tersinkron dari server)"} &bull; Passing Grade: 80.0
          </p>

          <!-- Score Breakdown Badges -->
          ${ckTotal > 0 ? `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left mb-4">
              <div class="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60">
                <div class="text-[11px] text-indigo-700 dark:text-indigo-400 font-bold uppercase font-mono flex items-center gap-1.5"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg><span>Sesi 1: Reading (読解)</span></div>
                <div class="text-xl font-black font-mono text-indigo-900 dark:text-indigo-200 mt-0.5">
                  ${fmtScore(r.readingScore)} <span class="text-xs font-normal text-slate-500">/ 100</span>
                </div>
                <div class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  ${fmtCorrect(r.readingCorrect, rlTotal)}
                </div>
              </div>
              <div class="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60">
                <div class="text-[11px] text-sky-700 dark:text-sky-400 font-bold uppercase font-mono flex items-center gap-1.5"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h2v5z"/></svg><span>Sesi 2: Choukai (聴解)</span></div>
                <div class="text-xl font-black font-mono text-sky-900 dark:text-sky-200 mt-0.5">
                  ${fmtScore(r.choukaiScore)} <span class="text-xs font-normal text-slate-500">/ 100</span>
                </div>
                <div class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  ${fmtCorrect(r.choukaiCorrect, ckTotal)}
                </div>
              </div>
            </div>
          ` : `
            <div class="p-3.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 max-w-sm mx-auto text-center mb-4">
              <div class="text-[11px] text-indigo-700 dark:text-indigo-400 font-bold uppercase font-mono flex items-center justify-center gap-1.5"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg><span>Ujian Tulis: Reading (読解)</span></div>
              <div class="text-2xl font-black font-mono text-indigo-900 dark:text-indigo-200 mt-0.5">
                ${fmtScore(r.readingScore)} <span class="text-xs font-normal text-slate-500">/ 100</span>
              </div>
              <div class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                ${fmtCorrect(r.readingCorrect, rlTotal, " (Bobot 4.0 Poin / Soal)")}
              </div>
            </div>
          `}

          <!-- WhatsApp Share & Actions -->
          <div class="flex flex-wrap items-center justify-center gap-2.5 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
            ${this._submitFailed && this._lastSubmitSessionId ? `
              <button onclick="window.app.retrySubmitExam()" class="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-sm" title="Skor resmi server belum tersinkron. Coba kirim ulang sekarang.">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Coba Kirim Ulang ke Server
              </button>
            ` : ""}
            <button onclick="window.app.shareResultWhatsApp()" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-sm">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.449.74 0.965 1.2.664.592 1.224.776 1.397.863.173.086.274.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/></svg>
              Kirim Nilai ke Sensei via WhatsApp
            </button>
            ${this.currentChapter.pdfReadingSoalUrl ? `
              <a href="${this.pdfUrl(this.currentChapter.pdfReadingSoalUrl)}" target="_blank" class="px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <svg class="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
                ${(this.currentChapter.choukaiCount > 0 || this.currentChapter.choukaiQuestions > 0) ? 'Soal Tryout PDF (33 Soal)' : 'Soal PDF (25 Soal)'}
              </a>
            ` : ""}
            ${this.currentChapter.pdfReadingKunciUrl ? `
              <a href="${this.pdfUrl(this.currentChapter.pdfReadingKunciUrl)}" target="_blank" class="px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
                ${(this.currentChapter.choukaiCount > 0 || this.currentChapter.choukaiQuestions > 0) ? 'Kunci Tryout PDF (33 Soal)' : 'Kunci PDF (25 Soal)'}
              </a>
            ` : ""}
            ${this.currentChapter.pdfSoalUrl ? `
              <a href="${this.pdfUrl(this.currentChapter.pdfSoalUrl)}" target="_blank" class="px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <svg class="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
                Soal Choukai PDF
              </a>
            ` : ""}
            ${this.currentChapter.pdfKunciUrl ? `
              <a href="${this.pdfUrl(this.currentChapter.pdfKunciUrl)}" target="_blank" class="px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
                Kunci Choukai PDF
              </a>
            ` : ""}
            <button onclick="window.app.promptStartExam(window.app.currentChapter?.chapter || '08')" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition">
              Ulangi Tryout
            </button>
            <button onclick="window.app.goToDashboard()" class="px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              Kembali ke Dashboard
            </button>
          </div>
        </div>

        <!-- Bagian 1: Soal Salah (Prioritas Utama untuk Evaluasi) -->
        <div class="mb-8">
          <div class="flex items-center gap-2.5 mb-4 p-3 bg-rose-50/60 dark:bg-rose-950/40 rounded-xl border border-rose-200/80 dark:border-rose-900/60">
            <span class="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </span>
            <div>
              <h3 class="text-sm sm:text-base font-bold text-rose-900 dark:text-rose-200">
                Butir Soal Perlu Evaluasi & Pembahasan (Jawaban Salah)
              </h3>
              <p class="text-[11px] text-rose-700 dark:text-rose-400">
                Fokuskan belajar pada ${wrongQuestions.length} butir soal di bawah ini. Pahami kaidah dan alasan jawaban yang tepat.
              </p>
            </div>
          </div>

          ${!hasDetail
            ? `
            <div class="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 rounded-xl p-6 text-center text-sky-800 dark:text-sky-200 shadow-xs">
              <h4 class="font-bold text-sm">Rincian Jawaban Per Soal Tidak Tersedia</h4>
              <p class="text-xs text-sky-600 dark:text-sky-400 mt-1">Hasil ini disinkronkan dari skor resmi server, sehingga lembar jawaban per soal tidak tersimpan di perangkat ini. Kerjakan ulang tryout untuk melihat pembahasan lengkap per soal.</p>
            </div>
            `
            : wrongQuestions.length > 0
            ? wrongQuestions.map((q) => renderCard(q, false)).join("")
            : `
            <div class="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-6 text-center text-emerald-800 dark:text-emerald-200 shadow-xs">
              <div class="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 mx-auto flex items-center justify-center mb-2"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg></div>
              <h4 class="font-bold text-sm">Luar Biasa! Sempurna (100 / 100)</h4>
              <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">${(r.choukaiTotal || 0) > 0 ? `Seluruh ${r.totalCount} butir soal (Reading & Choukai) berhasil Anda kuasai dengan tepat.` : `Seluruh ${r.totalCount} butir soal (Reading) berhasil Anda kuasai dengan tepat.`}</p>
            </div>
            `
          }
        </div>

        ${hasDetail ? `
        <!-- Bagian 2: Soal Benar (Terpisah di Bawah) -->
        <div>
          <div class="flex items-center gap-2.5 mb-4 p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60">
            <span class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            </span>
            <div>
              <h3 class="text-sm sm:text-base font-bold text-emerald-900 dark:text-emerald-200">
                Butir Soal Berhasil Dikuasai (Jawaban Benar)
              </h3>
              <p class="text-[11px] text-emerald-700 dark:text-emerald-400">
                Daftar ${correctQuestions.length} butir soal yang berhasil Anda jawab dengan benar. Tinjau kembali untuk penguatan materi.
              </p>
            </div>
          </div>

          ${correctQuestions.length > 0
            ? correctQuestions.map((q) => renderCard(q, true)).join("")
            : `
            <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center text-slate-500 text-xs">
              Belum ada jawaban benar pada sesi ini. Pelajari pembahasan soal yang salah di atas dan ulangi kembali ujian.
            </div>
            `
          }
        </div>
        ` : ""}
      </div>
    `;
  }

  // ==========================================
  // SCREEN 4: HAFALAN KOSAKATA (単語帳)
  // ==========================================
  getMemorizedStats() {
    let targetWords = [];
    if (this.kosakataBab === "all") {
      if (typeof KOSAKATA_DATA !== "undefined") {
        const bKeys = Object.keys(KOSAKATA_DATA).map(Number).sort((a, b) => a - b);
        for (const b of bKeys) {
          if (KOSAKATA_DATA[b] && KOSAKATA_DATA[b].words) {
            targetWords = targetWords.concat(KOSAKATA_DATA[b].words);
          }
        }
      }
    } else {
      const bInt = parseInt(this.kosakataBab, 10);
      if (typeof KOSAKATA_DATA !== "undefined" && KOSAKATA_DATA[bInt] && KOSAKATA_DATA[bInt].words) {
        targetWords = KOSAKATA_DATA[bInt].words;
      }
    }
    const total = targetWords.length;
    let memorized = 0;
    targetWords.forEach((w) => {
      const key = `${w.bab}_${w.id}`;
      if (this.memorizedWords[key]) memorized++;
    });
    const percentage = total > 0 ? Math.round((memorized / total) * 100) : 0;
    return { total, memorized, percentage };
  }

  getCategoryBadgeClass(kategori) {
    switch (kategori) {
      case "Kata Kerja":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Kata Sifat":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Istilah Industri / K3":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      case "Ungkapan & Salam":
      case "Ungkapan / Salam":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "Kata Ganti":
      case "Kata Ganti Tunjuk":
      case "Kata Ganti Tempat":
        return "bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border-sky-200 dark:border-sky-800";
      case "Bilangan":
      case "Kata Bantu Bilangan":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Kata Tanya":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
      case "Kata Benda":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700";
      default:
        return "bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200 dark:border-teal-800";
    }
  }

  getFilteredKosakataWords() {
    if (typeof KOSAKATA_DATA === "undefined") return [];
    let list = [];
    if (this.kosakataBab === "all") {
      const bKeys = Object.keys(KOSAKATA_DATA).map(Number).sort((a, b) => a - b);
      for (const b of bKeys) {
        if (KOSAKATA_DATA[b] && KOSAKATA_DATA[b].words) {
          list = list.concat(KOSAKATA_DATA[b].words);
        }
      }
    } else {
      const bInt = parseInt(this.kosakataBab, 10);
      if (KOSAKATA_DATA[bInt] && KOSAKATA_DATA[bInt].words) {
        list = KOSAKATA_DATA[bInt].words.slice();
      }
    }

    if (this.kosakataFilter !== "all") {
      if (this.kosakataFilter === "Ungkapan / Salam" || this.kosakataFilter === "Ungkapan & Salam") {
        list = list.filter((w) => w.kategori === "Ungkapan / Salam" || w.kategori === "Ungkapan & Salam");
      } else {
        list = list.filter((w) => w.kategori === this.kosakataFilter);
      }
    }

    if (this.kosakataSearch && this.kosakataSearch.trim() !== "") {
      const q = this.kosakataSearch.trim().toLowerCase();
      list = list.filter((w) => {
        return (
          (w.raw && w.raw.toLowerCase().includes(q)) ||
          (w.kanji && w.kanji.toLowerCase().includes(q)) ||
          (w.hiragana && w.hiragana.toLowerCase().includes(q)) ||
          (w.romaji && w.romaji.toLowerCase().includes(q)) ||
          (w.arti && w.arti.toLowerCase().includes(q)) ||
          (w.contoh && w.contoh.toLowerCase().includes(q)) ||
          (w.contoh_arti && w.contoh_arti.toLowerCase().includes(q))
        );
      });
    }

    return list;
  }

  updateKosakataCardUI(wordKey) {
    const cardEl = document.getElementById(`word-card-${wordKey}`);
    const btnEl = document.getElementById(`word-check-${wordKey}`);
    const isMem = Boolean(this.memorizedWords[wordKey]);
    if (cardEl) {
      const memClasses = ["border-emerald-400", "dark:border-emerald-600", "bg-emerald-50/30", "dark:bg-emerald-950/20"];
      const unmemClasses = ["border-slate-200", "dark:border-slate-800", "bg-white", "dark:bg-slate-900"];
      if (isMem) {
        unmemClasses.forEach((c) => cardEl.classList.remove(c));
        memClasses.forEach((c) => cardEl.classList.add(c));
      } else {
        memClasses.forEach((c) => cardEl.classList.remove(c));
        unmemClasses.forEach((c) => cardEl.classList.add(c));
      }
    }
    if (btnEl) {
      btnEl.className = `px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 transition ${
        isMem
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
      }`;
      btnEl.innerHTML = isMem
        ? `<svg class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> Dihafal`
        : `<svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-width="2"/></svg> Belum`;
    }
  }

  updateKosakataStatsUI() {
    const stats = this.getMemorizedStats();
    const countEl = document.getElementById("kosakata-stats-count");
    const percentEl = document.getElementById("kosakata-stats-percent");
    const barEl = document.getElementById("kosakata-stats-bar");
    if (countEl) countEl.innerText = `${stats.memorized} / ${stats.total}`;
    if (percentEl) percentEl.innerText = `${stats.percentage}%`;
    if (barEl) barEl.style.width = `${stats.percentage}%`;
  }

  markVisibleWordsMemorized(status) {
    const words = this.getFilteredKosakataWords();
    words.forEach((w) => {
      const key = `${w.bab}_${w.id}`;
      if (status) {
        this.memorizedWords[key] = true;
      } else {
        delete this.memorizedWords[key];
      }
    });
    try {
      localStorage.setItem(this.userStorageKey("choukai_memorized_words"), JSON.stringify(this.memorizedWords));
    } catch (e) {}
    this.refreshKosakataGrid();
  }

  renderKosakataCardsHTML(words) {
    if (!words || words.length === 0) {
      return `
        <div class="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center shadow-xs">
          <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-2"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
          <h4 class="font-bold text-sm text-slate-800 dark:text-slate-200">Tidak ada kosakata yang cocok</h4>
          <p class="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau ubah filter kategori gramatikal.</p>
          <button onclick="window.app.resetKosakataFilters()" class="mt-4 px-3 py-1.5 bg-sky-600 text-white rounded text-xs font-semibold hover:bg-sky-700 transition">
            Reset Filter
          </button>
        </div>
      `;
    }

    return words.map((w) => {
      const key = `${w.bab}_${w.id}`;
      const isMem = Boolean(this.memorizedWords[key]);
      const badgeCls = this.getCategoryBadgeClass(w.kategori);

      return `
        <div id="word-card-${key}" class="border ${isMem ? "border-emerald-400 dark:border-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/20" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"} rounded-xl p-3.5 flex flex-col justify-between transition-all duration-150 hover:shadow-md hover:border-sky-400">
          <div>
            <!-- Header Tag & Checkbox -->
            <div class="flex items-center justify-between gap-2 mb-2">
              <div class="flex items-center gap-1.5">
                <span class="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  Bab ${String(w.bab).padStart(2, '0')} #${w.id}
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${badgeCls}">
                  ${w.kategori}
                </span>
              </div>
              <button id="word-check-${key}" onclick="window.app.toggleWordMemorized('${key}')" class="px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 transition ${
                isMem
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }" title="Tandai sudah dihafal atau belum">
                ${isMem
                  ? `<svg class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> Dihafal`
                  : `<svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-width="2"/></svg> Belum`
                }
              </button>
            </div>

            <!-- Kanji / Japanese Word -->
            <div class="flex items-start justify-between gap-2 mt-1">
              <h3 class="font-jp font-bold text-lg text-slate-900 dark:text-slate-100 tracking-wide leading-tight">
                ${w.kanji || w.raw}
              </h3>
              <button onclick="window.app.playWordAudio('${w.hiragana || w.raw}')" class="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 transition shrink-0 shadow-2xs" title="Putar Pelafalan Suara Asli (TTS)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
              </button>
            </div>

            <!-- Reading Section (Hiragana & Romaji) -->
            <div class="mt-1.5">
              ${this.hideReading
                ? `<div class="reading-box cursor-pointer p-1.5 rounded bg-slate-100 dark:bg-slate-800/80 border border-dashed border-slate-300 dark:border-slate-700 text-xs transition select-none hover:border-sky-400" onclick="this.classList.toggle('reveal-hidden')">
                     <span class="hidden-prompt text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                       <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                       Klik lihat cara baca
                     </span>
                     <div class="hidden-content font-jp text-xs font-semibold text-sky-700 dark:text-sky-300">
                       ${w.hiragana} <span class="text-[11px] text-slate-400 font-mono font-normal">(${w.romaji})</span>
                     </div>
                   </div>`
                : `<div class="font-jp text-xs font-semibold text-sky-700 dark:text-sky-300">
                     ${w.hiragana} <span class="text-[11px] text-slate-400 font-mono font-normal">(${w.romaji})</span>
                   </div>`
              }
            </div>

            <!-- Meaning Section (Indonesian) -->
            <div class="mt-2">
              ${this.hideMeaning
                ? `<div class="meaning-box cursor-pointer p-1.5 rounded bg-slate-100 dark:bg-slate-800/80 border border-dashed border-slate-300 dark:border-slate-700 text-xs transition select-none hover:border-sky-400" onclick="this.classList.toggle('reveal-hidden')">
                     <span class="hidden-prompt text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                       <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
                       Klik lihat arti
                     </span>
                     <div class="hidden-content text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                       ${w.arti}
                     </div>
                   </div>`
                : `<div class="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                     ${w.arti}
                   </div>`
              }
            </div>
          </div>

          <!-- Example Context Sentence -->
          ${w.contoh ? `
            <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 rounded-lg p-2 text-[11px]">
              <div class="flex items-start justify-between gap-1.5 font-jp text-slate-700 dark:text-slate-300 leading-tight">
                <span>${w.contoh}</span>
                <button onclick="window.app.playWordAudio('${w.contoh}')" class="text-slate-400 hover:text-sky-600 transition shrink-0 p-0.5" title="Putar audio contoh">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                </button>
              </div>
              ${w.contoh_arti ? `<div class="text-[10px] text-slate-500 mt-1 italic">${w.contoh_arti}</div>` : ""}
            </div>
          ` : ""}
        </div>
      `;
    }).join("");
  }

  renderKosakataHTML() {
    const isAll = this.kosakataBab === "all";
    const bInt = parseInt(this.kosakataBab, 10);
    const chData = !isAll && typeof KOSAKATA_DATA !== "undefined" ? KOSAKATA_DATA[bInt] : null;
    const stats = this.getMemorizedStats();
    const words = this.getFilteredKosakataWords();

    const isBuku2 = !isAll && bInt >= 26;
    const pdfBabUrl = this.pdfUrl(
      isAll ? "assets/pdf/Daftar Kosakata Lengkap Bab 01-25.pdf" : `assets/pdf/Daftar Kosakata Bab ${this.kosakataBab}.pdf`
    );
    const pdfBundleUrl = this.pdfUrl(
      isBuku2 ? "assets/pdf/Daftar Kosakata Lengkap Bab 26-35.pdf" : "assets/pdf/Daftar Kosakata Lengkap Bab 01-25.pdf"
    );
    const bundleLabel = isBuku2 ? "Bundle Buku 2 (21 Hal)" : "Bundle Buku 1 (76 Hal)";

    // Total words count
    const totalAllWords = typeof KOSAKATA_DATA !== "undefined"
      ? Object.values(KOSAKATA_DATA).reduce((sum, ch) => sum + (ch.words ? ch.words.length : 0), 0)
      : 1804;

    const bKeys = typeof KOSAKATA_DATA !== "undefined"
      ? Object.keys(KOSAKATA_DATA).map(Number).sort((a, b) => a - b)
      : Array.from({ length: 35 }, (_, i) => i + 1);
    const maxBab = bKeys.length > 0 ? String(Math.max(...bKeys)).padStart(2, "0") : "35";

    // Build Chapter options
    let babOptionsHTML = `<option value="all" ${isAll ? "selected" : ""}>Semua Bab (Bab 01 s.d. ${maxBab} — ${totalAllWords} Kosakata)</option>`;
    for (const i of bKeys) {
      const bStr = String(i).padStart(2, "0");
      const d = typeof KOSAKATA_DATA !== "undefined" ? KOSAKATA_DATA[i] : null;
      const count = d ? d.total_words : 0;
      const title = d ? d.title_id : `Bab ${bStr}`;
      babOptionsHTML += `<option value="${bStr}" ${this.kosakataBab === bStr ? "selected" : ""}>Bab ${bStr}: ${title} (${count} kata)</option>`;
    }

    // Categories list — dibangun DINAMIS dari field kategori tiap kata pada scope bab yang
    // sedang dipilih (sama dengan scope getFilteredKosakataWords), sehingga kategori seperti
    // "Kata Sifat-i", "Kata Sifat-na", "Satuan Bilangan", "Tata Bahasa", "Kata Partikel"
    // otomatis tersedia dan nilainya selalu cocok dengan pembanding filter (w.kategori).
    const catSet = new Set();
    if (typeof KOSAKATA_DATA !== "undefined") {
      if (isAll) {
        for (const b of bKeys) {
          const ch = KOSAKATA_DATA[b];
          if (ch && ch.words) for (const w of ch.words) if (w.kategori) catSet.add(w.kategori);
        }
      } else if (KOSAKATA_DATA[bInt] && KOSAKATA_DATA[bInt].words) {
        for (const w of KOSAKATA_DATA[bInt].words) if (w.kategori) catSet.add(w.kategori);
      }
    }
    const categories = ["all", ...Array.from(catSet).sort()];

    let catOptionsHTML = categories.map((cat) => {
      const label = cat === "all" ? "Semua Kategori Gramatikal" : cat;
      return `<option value="${escapeAttr(cat)}" ${this.kosakataFilter === cat ? "selected" : ""}>${escapeHtml(label)}</option>`;
    }).join("");

    return `
      <div class="max-w-6xl mx-auto px-4 py-6">
        <!-- Top Navigation & Breadcrumb -->
        <div class="flex items-center justify-between gap-3 mb-4">
          <div class="flex items-center gap-2">
            <button onclick="window.app.goToDashboard()" class="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold flex items-center gap-1 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Kembali ke Dashboard
            </button>
            <span class="text-slate-300 dark:text-slate-700">/</span>
            <span class="text-xs font-bold text-slate-500 font-jp">単語帳 (Tango-chou)</span>
          </div>

          <!-- PDF Download Action Buttons -->
          <div class="flex items-center gap-2">
            <a id="btn-download-bab-pdf" href="${pdfBabUrl}" target="_blank" class="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs" title="Unduh Lembar Setoran Hafalan Kosakata Bab ${isAll ? 'Lengkap' : this.kosakataBab} PDF Siap Cetak">
              <svg class="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              <span>${isAll ? "PDF Lengkap (76 Hal)" : `PDF Bab ${this.kosakataBab}`}</span>
            </a>
            <a href="${pdfBundleUrl}" target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm" title="Unduh Lembar Hafalan Bundle ${bundleLabel}">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <span>${bundleLabel}</span>
            </a>
          </div>
        </div>

        <!-- Banner Card -->
        <div class="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-xl p-5 text-white mb-6 shadow-md border border-slate-800">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded text-xs font-semibold uppercase tracking-wider font-jp">
                  IMM JAPAN テキスト 語彙集
                </span>
                <span class="text-xs text-slate-300">${totalAllWords} Kosakata Resmi</span>
              </div>
              <h1 class="text-lg md:text-xl font-black font-jp mt-1.5 tracking-tight">
                ${isAll ? `単語帳 ｜ Seluruh Kosakata Bab 01 s.d. Bab ${maxBab}` : (chData ? chData.title_jp : `Bab ${this.kosakataBab}`)}
              </h1>
              <p class="text-xs text-slate-300 mt-1 max-w-2xl">
                ${isAll ? "Modul hafalan kosakata lengkap untuk persiapan setoran berkala siswa magang LPK & evaluasi Tokutei Ginou SSW." : (chData ? chData.title_id : "")}
              </p>
            </div>

            <!-- Stats & Progress -->
            <div class="bg-slate-800/90 border border-slate-700/80 rounded-lg p-3 shrink-0 flex flex-col justify-center min-w-[200px]">
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="text-slate-400 font-medium">Progres Hafalan:</span>
                <span id="kosakata-stats-count" class="font-bold font-mono text-emerald-300">${stats.memorized} / ${stats.total}</span>
              </div>
              <div class="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div id="kosakata-stats-bar" class="bg-emerald-500 h-full transition-all duration-300" style="width: ${stats.percentage}%;"></div>
              </div>
              <div class="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span>Dikuasai</span>
                <span id="kosakata-stats-percent" class="font-bold text-white">${stats.percentage}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter & Control Toolbar -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6 shadow-sm space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
            <!-- Chapter Selector -->
            <div class="md:col-span-4">
              <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Pilih Bab:</label>
              <select id="kosakata-bab-select" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500">
                ${babOptionsHTML}
              </select>
            </div>

            <!-- Category Filter -->
            <div class="md:col-span-4">
              <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Kategori Gramatikal:</label>
              <select id="kosakata-cat-select" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500">
                ${catOptionsHTML}
              </select>
            </div>

            <!-- Instant Search Box -->
            <div class="md:col-span-4">
              <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Pencarian Cepat:</label>
              <div class="relative">
                <input id="kosakata-search-input" type="text" placeholder="Cari Kanji, Hiragana, Romaji, Arti..." value="${escapeAttr(this.kosakataSearch)}" class="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500">
                <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
            </div>
          </div>

          <!-- Bottom Toolbar (Toggles & Batch Actions) -->
          <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-slate-500 text-[11px] font-medium">Mode Uji Hafalan (Flashcard):</span>
              <button id="toggle-hide-reading" class="px-2.5 py-1 rounded-md border text-xs font-semibold transition flex items-center gap-1.5 ${
                this.hideReading
                  ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
              }">
                ${this.hideReading
                  ? `<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg><span>Cara Baca Tersembunyi</span>`
                  : `<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg><span>Cara Baca Terlihat</span>`}
              </button>
              <button id="toggle-hide-meaning" class="px-2.5 py-1 rounded-md border text-xs font-semibold transition flex items-center gap-1.5 ${
                this.hideMeaning
                  ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
              }">
                ${this.hideMeaning
                  ? `<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg><span>Arti Tersembunyi</span>`
                  : `<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg><span>Arti Terlihat</span>`}
              </button>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="window.app.markVisibleWordsMemorized(true)" class="px-2.5 py-1 text-emerald-700 dark:text-emerald-400 hover:underline text-xs font-semibold flex items-center gap-1">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                Tandai Semua Selesai
              </button>
              <span class="text-slate-300 dark:text-slate-700">&bull;</span>
              <button onclick="window.app.markVisibleWordsMemorized(false)" class="px-2.5 py-1 text-slate-500 hover:underline text-xs font-semibold">
                Reset Tanda Bab
              </button>
            </div>
          </div>
        </div>

        <!-- Word List Counter & Status -->
        <div class="flex items-center justify-between mb-3 text-xs text-slate-500">
          <div>
            Menampilkan <strong id="kosakata-counter" class="text-slate-800 dark:text-slate-200">${words.length}</strong> butir kosakata
          </div>
          <div class="text-[11px] italic flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-sky-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
            <span>Tips: Gunakan tombol audio untuk mendengarkan pelafalan penutur asli Jepang.</span>
          </div>
        </div>

        <!-- Cards Grid Container -->
        <div id="kosakata-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3.5">
          ${this.renderKosakataCardsHTML(words)}
        </div>
      </div>
    `;
  }

  bindKosakataEvents() {
    const babSelect = document.getElementById("kosakata-bab-select");
    const catSelect = document.getElementById("kosakata-cat-select");
    const searchInput = document.getElementById("kosakata-search-input");
    const toggleReading = document.getElementById("toggle-hide-reading");
    const toggleMeaning = document.getElementById("toggle-hide-meaning");

    if (babSelect) {
      babSelect.addEventListener("change", (e) => {
        this.kosakataBab = e.target.value;
        try {
          history.replaceState(null, "", `#kosakata-${this.kosakataBab}`);
        } catch (err) {}
        this.render();
      });
    }

    if (catSelect) {
      catSelect.addEventListener("change", (e) => {
        this.kosakataFilter = e.target.value;
        this.refreshKosakataGrid();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.kosakataSearch = e.target.value;
        this.refreshKosakataGrid();
      });
    }

    if (toggleReading) {
      toggleReading.addEventListener("click", () => {
        this.hideReading = !this.hideReading;
        this.render();
      });
    }

    if (toggleMeaning) {
      toggleMeaning.addEventListener("click", () => {
        this.hideMeaning = !this.hideMeaning;
        this.render();
      });
    }
  }

  refreshKosakataGrid() {
    const grid = document.getElementById("kosakata-grid");
    const counter = document.getElementById("kosakata-counter");
    const words = this.getFilteredKosakataWords();
    if (grid) grid.innerHTML = this.renderKosakataCardsHTML(words);
    if (counter) counter.innerText = words.length;
    this.updateKosakataStatsUI();
  }

  resetKosakataFilters() {
    this.kosakataFilter = "all";
    this.kosakataSearch = "";
    this.render();
  }

  // ==========================================
  // BETTER AUTH & SENSEI ADMIN ENGINE
  // ==========================================
  async checkAuthSession() {
    if (window.location.protocol.startsWith("http")) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      try {
        const res = await fetch("/api/v1/auth/me", {
          credentials: "include",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && json.data.user) {
            this.currentUser = json.data.user;
            this.currentSession = json.data.session;
            this.isAuthenticated = true;
            // RESIDUAL BUG-18: muat state per-user (key bernamespace) SEKARANG —
            // sebelumnya jalur HTTP hanya memuat state 'guest' dari konstruktor,
            // sehingga riwayat renshuu lokal & kata terhafal per-user tidak pernah
            // tampil lintas sesi di mode HTTP.
            this.profile = this.loadProfile();
            this.progress = this.loadProgress();
            this.memorizedWords = this.loadMemorizedWords();
            if (this.currentUser && this.currentUser.name) {
              this.profile.name = this.currentUser.name;
              this.profile.classNo = this.currentUser.className || this.profile.classNo || "LPK";
              // RESIDUAL BUG-18: tulis ke key per-user, bukan key global yatim.
              localStorage.setItem(this.userStorageKey("choukai_student_profile"), JSON.stringify(this.profile));
              await this.fetchChaptersStatus();
            }
          } else {
            this.currentUser = null;
            this.currentSession = null;
            this.isAuthenticated = false;
          }
        } else {
          this.currentUser = null;
          this.currentSession = null;
          this.isAuthenticated = false;
        }
      } catch (e) {
        clearTimeout(timeoutId);
        this.currentUser = null;
        this.currentSession = null;
        this.isAuthenticated = false;
      }
    } else {
      if (!this.currentUser) {
        this.isAuthenticated = false;
      }
    }
    this.authChecking = false;
    this.updateAppGateUI();
  }

  updateAppGateUI() {
    const header = document.getElementById("app-header");
    const footer = document.getElementById("app-footer");
    if (this.isAuthenticated) {
      if (header) header.classList.remove("hidden");
      if (footer) footer.classList.remove("hidden");
      this.updateHeaderAuthUI();
    } else {
      if (header) header.classList.add("hidden");
      if (footer) footer.classList.add("hidden");
    }
  }

  async fetchSystemStatus() {
    if (!window.location.protocol.startsWith("http")) return;
    try {
      const res = await fetch("/api/v1/system/status");
      const json = await res.json();
      if (json.success && json.data) {
        this.systemStatus = json.data;
      }
    } catch (e) {
      // offline fallback
    }
  }

  async fetchChaptersStatus() {
    if (window.location.protocol.startsWith("http")) {
      try {
        const res = await fetch("/api/v1/chapters");
        const json = await res.json();
        if (json.success && json.data) {
          if (json.pdfAccessAllowed !== undefined) {
            this.isUserPdfAccessAllowed = Boolean(json.pdfAccessAllowed);
          }
          // RESIDUAL BUG-18: sinkronisasi reset admin via HTTP — bila sensei
          // me-reset data ujian di server (marker resultsResetAt berubah),
          // bersihkan entri progress lokal yang lebih tua dari waktu reset agar
          // dashboard siswa tidak menampilkan status selesai + skor basi.
          // (Guard BUG-19 tetap utuh: tanpa perubahan marker, entri lokal tanpa
          // skor server TIDAK dihapus.)
          if (json.resultsResetAt) {
            const markerKey = this.userStorageKey("choukai_reset_seen");
            let seenMarker = null;
            try {
              seenMarker = localStorage.getItem(markerKey);
            } catch (e) {}
            const resetMs = new Date(json.resultsResetAt).getTime();
            if (seenMarker !== String(resetMs) && isFinite(resetMs)) {
              for (const chKey of Object.keys(this.progress)) {
                const entry = this.progress[chKey];
                // Entri tanpa date (server-lite) dianggap pra-reset.
                const entryMs = entry && entry.date ? new Date(entry.date).getTime() : 0;
                if (!isFinite(entryMs) || entryMs < resetMs) {
                  delete this.progress[chKey];
                }
              }
              try {
                localStorage.setItem(markerKey, String(resetMs));
              } catch (e) {}
            }
          }
          for (const ch of json.data) {
            this.chaptersStatus[ch.chapterNum] = ch.isUnlocked;
            this.userRestrictedChapters[ch.chapterNum] = Boolean(ch.userRestricted);
            this.userRestrictedPdfs[ch.chapterNum] = Boolean(ch.pdfRestricted);
            if (ch.userScore) {
              const existing = this.progress[ch.chapterNum];
              // RESIDUAL BUG-05: entri pending-grading (score null) SELALU ditimpa
              // skor resmi server — sebelumnya "0 > null" false membuat entri
              // skor-0 tak pernah ter-heal.
              const shouldOverwrite =
                !existing ||
                ch.userScore.totalScore > existing.score ||
                (existing.isGrading && typeof ch.userScore.totalScore === "number");
              if (shouldOverwrite) {
                this.progress[ch.chapterNum] = {
                  chapter: ch.chapterNum,
                  score: ch.userScore.totalScore,
                  readingScore: ch.userScore.readingScore,
                  choukaiScore: ch.userScore.choukaiScore,
                  passed: ch.userScore.isPassed,
                  // RESIDUAL BUG-07: jumlah soal benar resmi server ikut
                  // disinkronkan agar headline "Total Benar" & laporan WhatsApp
                  // tidak menampilkan "0/33 Benar" yang salah di perangkat lain.
                  readingCorrect: ch.userScore.readingCorrect,
                  choukaiCorrect: ch.userScore.choukaiCorrect,
                  correctCount: ch.userScore.totalCorrect,
                  readingTotal: ch.userScore.readingTotal,
                  choukaiTotal: ch.userScore.choukaiTotal,
                  totalCount: ch.userScore.totalQuestions,
                  // RESIDUAL BUG-06: field wajib agar tombol "Hasil" (viewSavedResult →
                  // renderResultHTML) tidak crash — entri server-lite tidak menyimpan
                  // jawaban per soal; UI menampilkan banner skor tanpa rincian.
                  answers: {},
                };
              }
            }
            // BUG-19: jangan hapus progress lokal hanya karena belum ada skor server (submit gagal/offline)
          }
          try {
            // RESIDUAL BUG-18: simpan ke key per-user (key global 'choukai_progress'
            // tidak pernah dibaca lagi oleh loadProgress — skor tersinkron hilang).
            localStorage.setItem(this.userStorageKey("choukai_progress"), JSON.stringify(this.progress));
          } catch (e) {}
          if (this.view === "dashboard") {
            this.render();
          }
        }
      } catch (e) {}
    } else {
      // Local / Offline fallback
      if (this.currentUser && this.currentUser.role !== "admin") {
        const mockAccess = JSON.parse(localStorage.getItem("imm_mock_chapter_access") || "{}");
        const userAccess = mockAccess[this.currentUser.id] || mockAccess[this.currentUser.username] || {};
        const mockPdfAccess = JSON.parse(localStorage.getItem("imm_mock_pdf_access") || "{}");
        const userPdfAccess = mockPdfAccess[this.currentUser.id] || mockPdfAccess[this.currentUser.username] || {};
        this.isUserPdfAccessAllowed = Boolean(userPdfAccess.master);

        for (let i = 1; i <= 25; i++) {
          const num = String(i).padStart(2, "0");
          if (userAccess[num] === false) {
            this.chaptersStatus[num] = false;
            this.userRestrictedChapters[num] = true;
          } else {
            this.userRestrictedChapters[num] = false;
          }
          if (this.isUserPdfAccessAllowed) {
            this.userRestrictedPdfs[num] = userPdfAccess[num] === false;
          } else {
            // Default: restricted unless specifically allowed
            this.userRestrictedPdfs[num] = userPdfAccess[num] !== true;
          }
        }
      } else {
        this.userRestrictedChapters = {};
        this.userRestrictedPdfs = {};
        this.isUserPdfAccessAllowed = true;
      }
      if (this.view === "dashboard") {
        this.render();
      }
    }
  }

  updateHeaderAuthUI() {
    const adminBtn = document.getElementById("header-admin-btn");
    const authBtn = document.getElementById("header-auth-btn");
    const authText = document.getElementById("header-auth-text");
    const profileBtn = document.getElementById("header-profile-btn");
    const logoutBtn = document.getElementById("header-logout-btn");

    if (adminBtn) {
      if (this.currentUser && this.currentUser.role === "admin") {
        adminBtn.classList.remove("hidden");
      } else {
        adminBtn.classList.add("hidden");
      }
    }

    if (authBtn) {
      if (this.isAuthenticated) {
        authBtn.classList.add("hidden");
      } else {
        authBtn.classList.remove("hidden");
      }
    }

    if (authText) {
      if (this.currentUser) {
        const shortName = this.currentUser.username || this.currentUser.name.split(" ")[0];
        authText.innerText = shortName;
      } else {
        authText.innerText = "Masuk";
      }
    }

    if (profileBtn && this.currentUser) {
      const span = profileBtn.querySelector("span:not(.bg-sky-600)");
      if (span) span.innerText = this.currentUser.name;
    }

    if (logoutBtn) {
      if (this.isAuthenticated) {
        logoutBtn.classList.remove("hidden");
      } else {
        logoutBtn.classList.add("hidden");
      }
    }
  }

  openAuthModal(mode = "auth_login") {
    if (this.currentUser) {
      if (confirm(`Login sebagai ${this.currentUser.name} (${this.currentUser.role === "admin" ? "Sensei/Pengawas" : "Siswa"}).\nApakah Anda ingin keluar (Logout)?`)) {
        this.logout();
      }
      return;
    }
    this.activeModal = mode;
    this.renderModal();
  }

  async login(username, pin, errElId = "gate-login-error") {
    const errEl = document.getElementById(errElId);
    if (errEl) {
      errEl.classList.add("hidden");
      errEl.innerText = "";
    }
    const u = String(username || "").trim().toLowerCase();
    const p = String(pin || "").trim();

    if (!u || !p) {
      if (errEl) {
        errEl.innerText = "Username dan password wajib diisi.";
        errEl.classList.remove("hidden");
      }
      return false;
    }

    if (window.location.protocol.startsWith("http")) {
      try {
        const res = await fetch("/api/auth/sign-in/username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username: u, password: p }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          const msg = data.message || data.error?.message || "Username atau password salah.";
          if (errEl) {
            errEl.innerText = msg;
            errEl.classList.remove("hidden");
          } else {
            alert(msg);
          }
          return false;
        }
        await this.checkAuthSession();
        if (!this.isAuthenticated || !this.currentUser) {
          if (errEl) {
            errEl.innerText = "Sesi gagal diverifikasi setelah masuk.";
            errEl.classList.remove("hidden");
          }
          return false;
        }
      } catch (e) {
        if (errEl) {
          errEl.innerText = "Gagal menghubungi server API.";
          errEl.classList.remove("hidden");
        }
        return false;
      }
    } else {
      // Local / Offline / file:// protocol mode (19 official accounts metadata - no plaintext passwords)
      const officialAccounts = [
        { id: "usr_sensei_rusdi", name: "Sensei Rusdi", username: "sensei.rusdi", role: "admin", className: "Instruktur LPK" },
        { id: "usr_sensei_test", name: "Sensei Test", username: "sensei.test", role: "admin", className: "Sensei Penguji" },
        { id: "usr_nafisatun", name: "Nafisatun", username: "nafisatun", role: "student", className: "Angkatan 35-A" },
        { id: "usr_santi", name: "Santi", username: "santi", role: "student", className: "Angkatan 35-A" },
        { id: "usr_stefanni_haryanto", name: "Stefanni Haryanto", username: "stefanni.haryanto", role: "student", className: "Angkatan 35-A" },
        { id: "usr_heru_prayoga", name: "Heru Prayoga", username: "heru.prayoga", role: "student", className: "Angkatan 35-A" },
        { id: "usr_fikri_muzakki", name: "Fikri Muzakki", username: "fikri.muzakki", role: "student", className: "Angkatan 35-A" },
        { id: "usr_wahyu_jaka", name: "Wahyu Jaka Permadi", username: "wahyu.jaka", role: "student", className: "Angkatan 35-A" },
        { id: "usr_andre_ananta", name: "Andre Ananta Wianddin", username: "andre.ananta", role: "student", className: "Angkatan 35-A" },
        { id: "usr_andi_saputra", name: "Andi Saputra", username: "andi.saputra", role: "student", className: "Angkatan 35-A" },
        { id: "usr_candra_afiansah", name: "Candra Afiansah", username: "candra.afiansah", role: "student", className: "Angkatan 35-A" },
        { id: "usr_syarifudin_asyrof", name: "Syarifudin Asyrof", username: "syarifudin.asyrof", role: "student", className: "Angkatan 35-A" },
        { id: "usr_andre_purnomo", name: "Andre Purnomo", username: "andre.purnomo", role: "student", className: "Angkatan 35-A" },
        { id: "usr_desi_wiyanti", name: "Desi Wiyanti", username: "desi.wiyanti", role: "student", className: "Angkatan 35-A" },
        { id: "usr_aprilianzah", name: "Aprilianzah", username: "aprilianzah", role: "student", className: "Angkatan 35-A" },
        { id: "usr_farrel_ardiansyah", name: "Muhammad Farrel Ardiansyah", username: "farrel.ardiansyah", role: "student", className: "Angkatan 35-A" },
        { id: "usr_hayyu_pradana", name: "Hayyu Alunafa Pradana", username: "hayyu.pradana", role: "student", className: "Angkatan 35-A" },
        { id: "usr_ahmad_choirul", name: "Ahmad Choirul Muallif", username: "ahmad.choirul", role: "student", className: "Angkatan 35-A" },
        { id: "usr_hamdani_lubis", name: "Hamdani Lubis", username: "hamdani.lubis", role: "student", className: "Angkatan 35-A" },
      ];

      // BUG-12: kredensial offline diverifikasi dari SATU sumber — mock user store lokal.
      // foundOfficial hanya memperkaya data tampilan (id/role/nama/kelas), bukan auth.
      const foundOfficial = officialAccounts.find((acc) => acc.username === u);
      let mockUsers = {};
      try {
        mockUsers = JSON.parse(localStorage.getItem("imm_mock_users") || "{}") || {};
      } catch (e) {
        mockUsers = {};
      }
      const mu = mockUsers[u];
      if (mu && (mu.pin === p || mu.password === p)) {
        this.currentUser = { ...mu.user };
        if (foundOfficial) {
          this.currentUser.id = foundOfficial.id;
          this.currentUser.role = foundOfficial.role;
          this.currentUser.name = this.currentUser.name || foundOfficial.name;
          this.currentUser.className = this.currentUser.className || foundOfficial.className;
        }
        this.currentSession = { id: foundOfficial ? "ses_local_" + foundOfficial.username : "ses_mock_" + u, token: "mock_token" };
        this.isAuthenticated = true;
        // BUG-18: muat state per-user (key bernamespace) setelah currentUser terisi.
        this.profile = this.loadProfile();
        this.profile.name = this.currentUser.name;
        this.profile.classNo = this.currentUser.className;
        localStorage.setItem(this.userStorageKey("choukai_student_profile"), JSON.stringify(this.profile));
        this.progress = this.loadProgress();
        this.memorizedWords = this.loadMemorizedWords();
      } else if (foundOfficial) {
        const msg = "Akun resmi hanya bisa login saat terhubung ke server. Mode offline hanya untuk akun yang terdaftar di perangkat ini.";
        if (errEl) {
          errEl.innerText = msg;
          errEl.classList.remove("hidden");
        } else {
          alert(msg);
        }
        return false;
      } else {
        if (errEl) {
          errEl.innerText = "Username atau password salah.";
          errEl.classList.remove("hidden");
        }
        return false;
      }
    }

    if (!this.isAuthenticated) {
      return false;
    }
    this.closeModal();
    this.updateAppGateUI();
    await this.fetchChaptersStatus();

    if (this.currentUser?.role === "admin") {
      this.goToDashboard();
      this.openAdminPanel("live");
    } else {
      if (this.targetHash && this.targetHash !== "#auth" && this.targetHash !== "#dashboard") {
        const t = this.targetHash;
        this.targetHash = null;
        window.location.hash = t;
      } else {
        this.goToDashboard();
      }
    }
    return true;
  }

  async logout() {
    // BUG-17: hentikan timer ujian, auto-next choukai, dan pemutar audio (idiom goToDashboard).
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.cancelAutoNext();
    this.pauseAudio();
    if (window.location.protocol.startsWith("http")) {
      try {
        await fetch("/api/auth/sign-out", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({}),
        });
      } catch (e) {}
    }
    this.currentUser = null;
    this.currentSession = null;
    this.isAuthenticated = false;
    this.authChecking = false;
    this.userRestrictedChapters = {};
    // BUG-17: reset state ujian yang menggantung.
    this.currentExamSession = null;
    this.startExamPromise = null;
    this.pendingSavePromises = [];
    // BUG-18: data persisten per-user TIDAK dihapus, tapi memori dikosongkan agar
    // user berikutnya tidak melihat sisa data user sebelumnya sebelum render halaman login.
    this.progress = {};
    this.profile = { name: "", classNo: "", target: "JFT-Basic A2" };
    this.memorizedWords = {};
    this.closeModal();
    this.view = "auth_gate";
    try {
      history.replaceState(null, "", window.location.pathname);
    } catch (e) {}
    this.updateAppGateUI();
    this.render();
  }

  async registerStudent(formData, errElId = "gate-reg-error") {
    const errEl = document.getElementById(errElId);
    if (errEl) {
      errEl.classList.add("hidden");
      errEl.innerText = "";
    }
    const { name, username, pin, className, email } = formData;
    if (!name || !username || !pin) {
      if (errEl) {
        errEl.innerText = "Nama, username, dan PIN wajib diisi.";
        errEl.classList.remove("hidden");
      }
      return false;
    }

    if (window.location.protocol.startsWith("http")) {
      try {
        const res = await fetch("/api/v1/auth/register-student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          const msg = data.error || "Gagal melakukan pendaftaran.";
          if (errEl) {
            errEl.innerText = msg;
            errEl.classList.remove("hidden");
          } else {
            alert(msg);
          }
          return false;
        }
        // Auto login after registration
        return await this.login(username, pin, errElId);
      } catch (e) {
        if (errEl) {
          errEl.innerText = "Koneksi server gagal.";
          errEl.classList.remove("hidden");
        }
        return false;
      }
    } else {
      // Mock registration for file://
      const u = String(username).trim().toLowerCase();
      const mockUsers = JSON.parse(localStorage.getItem("imm_mock_users") || "{}");
      mockUsers[u] = {
        user: {
          id: "usr_mock_" + Date.now(),
          name: name.trim(),
          username: u,
          role: "student",
          className: className || "Angkatan 35-A",
          email: email || `${u}@imm.internal`,
        },
        pin: String(pin).trim(),
      };
      localStorage.setItem("imm_mock_users", JSON.stringify(mockUsers));
      return await this.login(u, pin, errElId);
    }
  }

  openAdminPanel(tab = "live") {
    if (!this.isAuthenticated || !this.currentUser || this.currentUser.role !== "admin") {
      this.view = "auth_gate";
      this.updateAppGateUI();
      this.render();
      return;
    }
    this.activeModal = "admin_panel";
    this.adminTab = tab;
    this.renderModal();
    this.switchAdminTab(tab);
  }

  switchAdminTab(tab) {
    this.adminTab = tab;
    if (this.liveMonitoringInterval) {
      clearInterval(this.liveMonitoringInterval);
      this.liveMonitoringInterval = null;
    }
    const pane = document.getElementById("admin-tab-content");
    if (!pane) return;

    document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
      const target = btn.getAttribute("data-tab");
      if (target === tab) {
        btn.className = "admin-tab-btn px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 bg-sky-600 text-white shadow-xs transition";
      } else {
        btn.className = "admin-tab-btn px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition";
      }
    });

    if (tab === "live") {
      this.fetchLiveMonitoring();
      this.liveMonitoringInterval = setInterval(() => this.fetchLiveMonitoring(), 5000);
    } else if (tab === "users") {
      this.fetchAdminUsers();
    } else if (tab === "lock") {
      this.fetchChaptersLockStatus();
    } else if (tab === "results") {
      this.fetchAdminResults();
    } else if (tab === "pdfs") {
      this.renderAdminPdfLibraryPane();
    }
  }

  async fetchLiveMonitoring() {
    const pane = document.getElementById("admin-tab-content");
    if (!pane || this.adminTab !== "live") return;
    try {
      const res = await fetch("/api/v1/admin/monitoring/live");
      const json = await res.json();
      this.liveMonitoringData = json.data || [];
    } catch (e) {
      this.liveMonitoringData = [];
    }
    this.renderLiveMonitoringPane();
  }

  renderLiveMonitoringPane() {
    const pane = document.getElementById("admin-tab-content");
    if (!pane) return;
    const items = this.liveMonitoringData;
    pane.innerHTML = `
      <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs font-bold text-slate-800 dark:text-slate-200">
            Siswa Sedang Ujian: <strong>${items.length} Peserta</strong>
          </span>
        </div>
        <button onclick="window.app.fetchLiveMonitoring()" class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-semibold flex items-center gap-1.5 transition">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Refresh
        </button>
      </div>
      ${items.length === 0 ? `
        <div class="py-12 text-center text-slate-400">
          <p class="text-sm font-semibold">Tidak ada ujian yang sedang berlangsung.</p>
          <p class="text-xs mt-1">Kartu siswa akan muncul otomatis saat tryout dimulai di lab.</p>
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          ${items.map((s) => `
            <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between">
                  <span class="font-extrabold text-sm text-slate-900 dark:text-slate-100">${escapeHtml(s.studentName)}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${s.isExpired ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}">
                    ${s.isExpired ? 'Waktu Habis' : s.remainingMinutes + 'm tersisa'}
                  </span>
                </div>
                <div class="text-[11px] text-slate-500 mt-0.5">
                  ${escapeHtml(s.username)} • ${escapeHtml(s.className)} • <strong>Bab ${s.chapterNum} (${s.mode})</strong>
                </div>
                <div class="mt-3">
                  <div class="flex justify-between text-[11px] font-bold mb-1">
                    <span>Progres Terjawab</span>
                    <span>${s.answeredCount} / ${s.totalQuestions} Soal (${s.progressPercent}%)</span>
                  </div>
                  <div class="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 rounded-full transition-all" style="width: ${s.progressPercent}%"></div>
                  </div>
                </div>
              </div>
              <div class="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex justify-end">
                <button onclick="window.app.terminateStudentExam('${s.sessionId}')" class="px-2.5 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-md text-xs font-bold transition flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg>
                  Paksa Kumpulkan
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      `}
    `;
  }

  async terminateStudentExam(sessionId) {
    if (!confirm("Paksa kumpulkan lembar jawaban siswa ini? Nilai akan dihitung dari soal yang sudah terjawab.")) return;
    try {
      const res = await fetch(`/api/v1/admin/monitoring/sessions/${sessionId}/terminate`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert("Sesi ujian berhasil dihentikan & dikumpulkan!");
        this.fetchLiveMonitoring();
      } else {
        alert(data.error || "Gagal menghentikan sesi.");
      }
    } catch (e) {
      alert("Koneksi gagal.");
    }
  }

  async fetchAdminUsers(q = "") {
    const pane = document.getElementById("admin-tab-content");
    if (!pane || this.adminTab !== "users") return;
    if (window.location.protocol.startsWith("http")) {
      try {
        const url = q ? `/api/v1/admin/users?q=${encodeURIComponent(q)}` : "/api/v1/admin/users";
        const res = await fetch(url);
        const json = await res.json();
        this.adminUsersData = json.data || [];
      } catch (e) {
        this.adminUsersData = [];
      }
    } else {
      // Offline / file:// protocol fallback mock users
      const mockUsers = JSON.parse(localStorage.getItem("imm_mock_users") || "{}");
      const defaultUsers = [
        { id: "usr_sensei_rusdi", name: "Sensei Rusdi", username: "sensei.rusdi", role: "admin", className: "Instruktur LPK", totalExams: 0, avgScore: 0 },
        { id: "usr_sensei_test", name: "Sensei Test", username: "sensei.test", role: "admin", className: "Sensei Penguji", totalExams: 0, avgScore: 0 },
        { id: "usr_nafisatun", name: "Nafisatun", username: "nafisatun", role: "student", className: "Angkatan 35-A", totalExams: 0, avgScore: 0 },
        { id: "usr_santi", name: "Santi", username: "santi", role: "student", className: "Angkatan 35-A", totalExams: 0, avgScore: 0 },
        { id: "usr_stefanni_haryanto", name: "Stefanni Haryanto", username: "stefanni.haryanto", role: "student", className: "Angkatan 35-A", totalExams: 0, avgScore: 0 },
        { id: "usr_heru_prayoga", name: "Heru Prayoga", username: "heru.prayoga", role: "student", className: "Angkatan 35-A", totalExams: 0, avgScore: 0 },
        { id: "usr_fikri_muzakki", name: "Fikri Muzakki", username: "fikri.muzakki", role: "student", className: "Angkatan 35-A", totalExams: 0, avgScore: 0 },
        { id: "usr_wahyu_jaka", name: "Wahyu Jaka Permadi", username: "wahyu.jaka", role: "student", className: "Angkatan 35-A", totalExams: 0, avgScore: 0 },
        { id: "usr_andre_ananta", name: "Andre Ananta Wianddin", username: "andre.ananta", role: "student", className: "Angkatan 35-A", totalExams: 0, avgScore: 0 },
        { id: "usr_andi_saputra", name: "Andi Saputra", username: "andi.saputra", role: "student", className: "Angkatan 35-A", totalExams: 0, avgScore: 0 },
        { id: "usr_candra_afiansah", name: "Candra Afiansah", username: "candra.afiansah", role: "student", className: "Angkatan 35-A", totalExams: 0, avgScore: 0 },
        { id: "usr_syarifudin_asyrof", name: "Syarifudin Asyrof", username: "syarifudin.asyrof", role: "student", className: "Angkatan 35-A", totalExams: 0, avgScore: 0 },
        { id: "usr_andre_purnomo", name: "Andre Purnomo", username: "andre.purnomo", role: "student", className: "Angkatan 35-A", totalExams: 0, avgScore: 0 },
        { id: "usr_desi_wiyanti", name: "Desi Wiyanti", username: "desi.wiyanti", role: "student", className: "Angkatan 35-A", totalExams: 0, avgScore: 0 },
        { id: "usr_aprilianzah", name: "Aprilianzah", username: "aprilianzah", role: "student", className: "Angkatan 35-A", totalExams: 0, avgScore: 0 },
        { id: "usr_farrel_ardiansyah", name: "Muhammad Farrel Ardiansyah", username: "farrel.ardiansyah", role: "student", className: "Angkatan 35-A", totalExams: 0, avgScore: 0 },
        { id: "usr_hayyu_pradana", name: "Hayyu Alunafa Pradana", username: "hayyu.pradana", role: "student", className: "Angkatan 35-A", totalExams: 0, avgScore: 0 },
        { id: "usr_ahmad_choirul", name: "Ahmad Choirul Muallif", username: "ahmad.choirul", role: "student", className: "Angkatan 35-A", totalExams: 0, avgScore: 0 },
        { id: "usr_hamdani_lubis", name: "Hamdani Lubis", username: "hamdani.lubis", role: "student", className: "Angkatan 35-A", totalExams: 0, avgScore: 0 },
      ];
      for (const [k, u] of Object.entries(mockUsers)) {
        if (u.user && !defaultUsers.some((du) => du.username === u.user.username)) {
          defaultUsers.push({
            id: u.user.id,
            name: u.user.name,
            username: u.user.username,
            role: u.user.role || "student",
            className: u.user.className || "Angkatan 35-A",
            totalExams: 0,
            avgScore: 0,
          });
        }
      }
      this.adminUsersData = defaultUsers;
    }
    this.renderAdminUsersPane(q);
  }

  renderAdminUsersPane(searchQ = "") {
    const pane = document.getElementById("admin-tab-content");
    if (!pane) return;
    const users = this.adminUsersData;
    pane.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-2">
          <input id="admin-user-search-input" type="text" placeholder="Cari nama, username, kelas..." value="${escapeAttr(searchQ)}" onkeydown="if(event.key==='Enter') window.app.fetchAdminUsers(this.value)" class="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none w-56">
          <button onclick="window.app.fetchAdminUsers(document.getElementById('admin-user-search-input').value)" class="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-200">Cari</button>
        </div>
        <button onclick="document.getElementById('add-user-form-card').classList.toggle('hidden')" class="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs">
          + Tambah Siswa Baru
        </button>
      </div>

      <!-- Add User Form (hidden by default) -->
      <div id="add-user-form-card" class="hidden mb-4 p-4 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/30">
        <h4 class="text-xs font-bold text-sky-900 dark:text-sky-300 mb-2">Form Tambah Siswa LPK</h4>
        <form onsubmit="event.preventDefault(); window.app.adminCreateStudentFromForm();" class="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input id="new-user-name" type="text" required placeholder="Nama Lengkap" class="px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
          <input id="new-user-uname" type="text" required placeholder="Username (misal: ahmad.syahroni)" class="px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono">
          <input id="new-user-pin" type="text" required placeholder="PIN (default: 123456)" value="123456" class="px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono">
          <input id="new-user-class" type="text" placeholder="Kelas / Angkatan" value="Angkatan 35-A" class="px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div class="sm:col-span-4 flex justify-end gap-2 mt-1">
            <button type="button" onclick="document.getElementById('add-user-form-card').classList.add('hidden')" class="px-3 py-1 text-xs border rounded text-slate-600">Batal</button>
            <button type="submit" class="px-4 py-1 text-xs bg-sky-600 text-white font-bold rounded">Simpan Siswa</button>
          </div>
        </form>
      </div>

      <!-- Users Table -->
      <div class="max-h-[55vh] overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 sticky top-0">
            <tr>
              <th class="p-2.5">Nama & Username</th>
              <th class="p-2.5">Peran</th>
              <th class="p-2.5">Kelas</th>
              <th class="p-2.5 text-center">Ujian Selesai</th>
              <th class="p-2.5 text-center">Rata-rata</th>
              <th class="p-2.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            ${users.map((u) => {
              // Escape nama untuk konteks JS string di dalam atribut onclick: backslash digandakan dulu, baru kutip tunggal di-prefix backslash; escapeAttr menutup konteks atribut HTML.
              const safeNameAttr = escapeAttr(String(u.name).replace(/\\/g, "\\\\").replace(/'/g, "\\'"));
              return `
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td class="p-2.5">
                  <div class="font-bold text-slate-900 dark:text-slate-100">${escapeHtml(u.name)}</div>
                  <div class="text-[11px] text-slate-500 font-mono">${escapeHtml(u.username)}</div>
                </td>
                <td class="p-2.5">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}">
                    ${u.role === 'admin' ? 'Sensei (Admin)' : 'Siswa'}
                  </span>
                </td>
                <td class="p-2.5 text-slate-600 dark:text-slate-400">${escapeHtml(u.className)}</td>
                <td class="p-2.5 text-center font-bold">${u.totalExams || 0}</td>
                <td class="p-2.5 text-center font-bold ${u.avgScore >= 80 ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}">${u.avgScore ? u.avgScore.toFixed(1) : '-'}</td>
                <td class="p-2.5 text-right space-x-1">
                  <button onclick="window.app.openStudentChapterAccessModal('${u.id}', '${safeNameAttr}')" class="px-2 py-1 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 rounded text-[11px] font-semibold inline-flex items-center gap-1" title="Atur Hak Akses Bab Siswa">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    Akses Bab
                  </button>
                  <button onclick="window.app.adminResetPin('${u.id}', '${safeNameAttr}')" class="px-2 py-1 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded text-[11px] font-semibold inline-flex items-center gap-1" title="Reset PIN ke 123456">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                    Reset PIN
                  </button>
                  <button onclick="window.app.adminResetStudentExam('${u.id}', '${safeNameAttr}')" class="px-2 py-1 bg-orange-50 dark:bg-orange-950/60 hover:bg-orange-100 border border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300 rounded text-[11px] font-semibold inline-flex items-center gap-1" title="Reset Nilai & Riwayat Ujian Siswa Ini">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    Reset Nilai
                  </button>
                  ${this.currentUser?.id !== u.id ? `
                    <button onclick="window.app.adminDeleteUser('${u.id}', '${safeNameAttr}')" class="px-2 py-1 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded text-[11px] font-semibold inline-flex items-center" title="Hapus Akun">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  ` : ''}
                </td>
              </tr>
            `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  async adminCreateStudentFromForm() {
    const name = document.getElementById("new-user-name").value;
    const username = document.getElementById("new-user-uname").value;
    const pin = document.getElementById("new-user-pin").value;
    const className = document.getElementById("new-user-class").value;
    try {
      const res = await fetch("/api/v1/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, pin, className, role: "student" }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Siswa baru berhasil ditambahkan!");
        this.fetchAdminUsers();
      } else {
        alert(data.error || "Gagal menambahkan siswa.");
      }
    } catch (e) {
      alert("Koneksi gagal.");
    }
  }

  async adminResetPin(userId, userName) {
    if (!confirm(`Reset PIN untuk siswa "${userName}" ke default (123456)?`)) return;
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/reset-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: "123456" }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "PIN berhasil di-reset menjadi 123456.");
      } else {
        alert(data.error || "Gagal mereset PIN.");
      }
    } catch (e) {
      alert("Koneksi gagal.");
    }
  }

  async adminResetStudentExam(userId, userName) {
    if (!confirm(`Reset seluruh nilai dan riwayat pengerjaan ujian untuk siswa "${userName}"?\n\nSiswa akan dapat mengerjakan ulang seluruh bab ujian dari awal.`)) return;
    try {
      if (window.location.protocol.startsWith("http")) {
        const res = await fetch(`/api/v1/admin/users/${userId}/reset-exams`, {
          method: "POST",
        });
        const data = await res.json();
        if (data.success) {
          alert(data.message || `Data ujian siswa "${userName}" berhasil di-reset.`);
          this.fetchAdminUsers();
        } else {
          alert(data.error || "Gagal mereset data ujian siswa.");
        }
      } else {
        // Offline / mock mode
        if (this.adminUsersData) {
          const userItem = this.adminUsersData.find((x) => x.id === userId);
          if (userItem) {
            userItem.totalExams = 0;
            userItem.avgScore = 0;
          }
        }
        if (this.currentUser && this.currentUser.id === userId) {
          this.progress = {};
          // RESIDUAL BUG-18: hapus key per-user (key global sudah tidak dipakai).
          try { localStorage.removeItem(this.userStorageKey("choukai_progress")); } catch (e) {}
        }
        alert(`Data ujian siswa "${userName}" berhasil di-reset.`);
        this.renderAdminUsersPane();
      }
    } catch (e) {
      alert("Koneksi gagal saat mereset data ujian siswa.");
    }
  }

  async adminDeleteUser(userId, userName) {
    if (!confirm(`Hapus pengguna "${userName}" secara permanen? Data nilai tryout juga akan dihapus.`)) return;
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("Pengguna berhasil dihapus!");
        this.fetchAdminUsers();
      } else {
        alert(data.error || "Gagal menghapus pengguna.");
      }
    } catch (e) {
      alert("Koneksi gagal.");
    }
  }

  // =========================================================================
  // MANAJEMEN HAK AKSES BAB & PDF PER-SISWA (STUDENT ACCESS CONTROL)
  // =========================================================================

  async openStudentChapterAccessModal(userId, userName) {
    this.selectedStudentForAccess = { id: userId, name: userName };
    this.studentChapterAccessData = null;
    this.studentAccessModalTab = "cbt";
    this.selectedStudentPdfMasterAllowed = false; // Default: Hanya Sensei yang bisa akses by default
    this.activeModal = "student_chapter_access";
    this.renderModal();

    if (window.location.protocol.startsWith("http")) {
      try {
        const res = await fetch(`/api/v1/admin/users/${userId}/chapter-access`);
        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data : (json.chapters || []);
        this.studentChapterAccessData = list;
        if (json.user && json.user.pdfAccessAllowed !== undefined) {
          this.selectedStudentPdfMasterAllowed = Boolean(json.user.pdfAccessAllowed);
        } else {
          this.selectedStudentPdfMasterAllowed = false;
        }
      } catch (e) {
        console.error("Failed to fetch chapter access:", e);
        this.studentChapterAccessData = [];
      }
    } else {
      // Offline / file:// fallback
      const mockAccess = JSON.parse(localStorage.getItem("imm_mock_chapter_access") || "{}");
      const userAccess = mockAccess[userId] || {};
      const mockPdfAccess = JSON.parse(localStorage.getItem("imm_mock_pdf_access") || "{}");
      const userPdfAccess = mockPdfAccess[userId] || {};
      this.selectedStudentPdfMasterAllowed = Boolean(userPdfAccess.master);

      const list = CHAPTERS_INDEX.map((ch) => ({
        chapterNum: ch.num,
        titleJa: ch.title_ja,
        titleId: ch.title_id,
        isAllowed: userAccess[ch.num] !== false,
        isPdfAllowed: Boolean(userPdfAccess[ch.num] ?? userPdfAccess.master),
      }));
      this.studentChapterAccessData = list;
    }

    this.renderStudentChapterAccessModalContent();
  }

  closeStudentChapterAccessModal() {
    this.openAdminPanel("users");
  }

  switchStudentAccessTab(tab) {
    this.studentAccessModalTab = tab;
    const cbtBtn = document.querySelector("button[onclick*=\"switchStudentAccessTab('cbt')\"]");
    const pdfBtn = document.querySelector("button[onclick*=\"switchStudentAccessTab('pdf')\"]");
    if (cbtBtn) {
      cbtBtn.className = `flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${tab === 'cbt' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`;
    }
    if (pdfBtn) {
      pdfBtn.className = `flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${tab === 'pdf' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`;
    }
    this.renderStudentChapterAccessModalContent();
  }

  setAllStudentChapterAccess(isAllowed) {
    const list = typeof CHAPTERS_INDEX !== "undefined" ? CHAPTERS_INDEX : [];
    for (const ch of list) {
      const num = ch.num;
      const cb = document.getElementById(`access-toggle-${num}`);
      if (cb) {
        cb.checked = isAllowed;
        this.updateAccessCardVisual(num, isAllowed);
      }
      if (this.studentChapterAccessData) {
        const item = this.studentChapterAccessData.find((x) => x.chapterNum === num);
        if (item) item.isAllowed = isAllowed;
      }
    }
  }

  toggleStudentChapterAccess(chNum) {
    const cb = document.getElementById(`access-toggle-${chNum}`);
    if (cb) {
      this.updateAccessCardVisual(chNum, cb.checked);
      if (this.studentChapterAccessData) {
        const item = this.studentChapterAccessData.find((x) => x.chapterNum === chNum);
        if (item) item.isAllowed = cb.checked;
      }
    }
  }

  updateAccessCardVisual(chNum, isAllowed) {
    const card = document.getElementById(`access-card-${chNum}`);
    const badge = document.getElementById(`access-badge-${chNum}`);
    if (card) {
      if (isAllowed) {
        card.className = "access-ch-card p-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 transition flex flex-col justify-between";
      } else {
        card.className = "access-ch-card p-3 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 transition flex flex-col justify-between opacity-80";
      }
    }
    if (badge) {
      if (isAllowed) {
        badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300";
        badge.innerText = "Diizinkan";
      } else {
        badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300";
        badge.innerText = "Dibatasi";
      }
    }
  }

  toggleStudentPdfMasterAccess(allowed) {
    this.setAllStudentPdfChapterAccess(Boolean(allowed));
  }

  updatePdfStatusDisplay() {
    const list = this.studentChapterAccessData || [];
    const count = list.filter((x) => x.isPdfAllowed).length;
    const badge = document.getElementById("pdf-master-status-badge");
    const desc = document.getElementById("pdf-master-desc");
    const masterSwitch = document.getElementById("pdf-master-toggle-btn");

    if (count === 25) {
      this.selectedStudentPdfMasterAllowed = true;
      if (badge) {
        badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
        badge.innerText = "Semua Dibuka (25/25 Bab)";
      }
      if (desc) {
        desc.innerText = "Seluruh 25 dokumen PDF materi & kunci dibuka untuk siswa ini.";
      }
      if (masterSwitch) {
        masterSwitch.className = "px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-xs bg-emerald-600 text-white hover:bg-emerald-700";
        masterSwitch.innerText = "SEMUA DIBUKA (25 Bab)";
      }
    } else if (count === 0) {
      this.selectedStudentPdfMasterAllowed = false;
      if (badge) {
        badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300";
        badge.innerText = "Terkunci Total (Default Sensei)";
      }
      if (desc) {
        desc.innerText = "Akses PDF terkunci secara default. Hanya Sensei yang bisa mengakses, kecuali dibuka per bab di bawah ini.";
      }
      if (masterSwitch) {
        masterSwitch.className = "px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-xs bg-rose-600 text-white hover:bg-rose-700";
        masterSwitch.innerText = "TERKUNCI (Default Sensei)";
      }
    } else {
      this.selectedStudentPdfMasterAllowed = false;
      if (badge) {
        badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300";
        badge.innerText = `Kustom (${count}/25 Bab Dibuka)`;
      }
      if (desc) {
        desc.innerText = `Siswa ini memiliki akses kustom hanya pada ${count} bab yang dicentang di bawah ini.`;
      }
      if (masterSwitch) {
        masterSwitch.className = "px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-xs bg-sky-600 text-white hover:bg-sky-700";
        masterSwitch.innerText = `KUSTOM (${count}/25 Bab)`;
      }
    }
  }

  toggleStudentPdfChapterAccess(chNum) {
    const cb = document.getElementById(`pdf-toggle-${chNum}`);
    if (cb) {
      this.updatePdfCardVisual(chNum, cb.checked);
      if (this.studentChapterAccessData) {
        const item = this.studentChapterAccessData.find((x) => x.chapterNum === chNum);
        if (item) item.isPdfAllowed = cb.checked;
      }
      this.updatePdfStatusDisplay();
    }
  }

  updatePdfCardVisual(chNum, isAllowed) {
    const card = document.getElementById(`pdf-card-${chNum}`);
    const badge = document.getElementById(`pdf-badge-${chNum}`);
    if (card) {
      if (isAllowed) {
        card.className = "pdf-ch-card p-3 rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20 transition flex flex-col justify-between";
      } else {
        card.className = "pdf-ch-card p-3 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 transition flex flex-col justify-between opacity-80";
      }
    }
    if (badge) {
      if (isAllowed) {
        badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300";
        badge.innerText = "PDF Diizinkan";
      } else {
        badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300";
        badge.innerText = "PDF Dibatasi";
      }
    }
  }

  setAllStudentPdfChapterAccess(isAllowed) {
    this.selectedStudentPdfMasterAllowed = Boolean(isAllowed);
    const list = typeof CHAPTERS_INDEX !== "undefined" ? CHAPTERS_INDEX : [];
    for (const ch of list) {
      const num = ch.num;
      const cb = document.getElementById(`pdf-toggle-${num}`);
      if (cb) {
        cb.checked = isAllowed;
        this.updatePdfCardVisual(num, isAllowed);
      }
      if (this.studentChapterAccessData) {
        const item = this.studentChapterAccessData.find((x) => x.chapterNum === num);
        if (item) item.isPdfAllowed = isAllowed;
      }
    }
    this.updatePdfStatusDisplay();
  }

  async saveStudentChapterAccess() {
    if (!this.selectedStudentForAccess) return;
    const userId = this.selectedStudentForAccess.id;
    const accessMap = {};
    const pdfMap = {};

    const list = typeof CHAPTERS_INDEX !== "undefined" ? CHAPTERS_INDEX : [];
    for (const ch of list) {
      const num = ch.num;
      const cbCbt = document.getElementById(`access-toggle-${num}`);
      const cbPdf = document.getElementById(`pdf-toggle-${num}`);
      const existing = (this.studentChapterAccessData || []).find((x) => x.chapterNum === num);

      accessMap[num] = cbCbt ? Boolean(cbCbt.checked) : (existing ? existing.isAllowed !== false : true);
      pdfMap[num] = cbPdf ? Boolean(cbPdf.checked) : (existing ? Boolean(existing.isPdfAllowed) : false);
    }

    const saveBtn = document.getElementById("btn-save-chapter-access");
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerText = "Menyimpan...";
    }

    const allPdfsAllowed = Object.values(pdfMap).every(Boolean);
    const anyPdfsAllowed = Object.values(pdfMap).some(Boolean);
    const payload = {
      pdfAccessAllowed: this.selectedStudentPdfMasterAllowed || allPdfsAllowed,
      chapters: accessMap,
      pdfChapters: pdfMap,
    };

    if (window.location.protocol.startsWith("http")) {
      try {
        const res = await fetch(`/api/v1/admin/users/${userId}/chapter-access`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          alert(`Hak akses ujian & dokumen PDF untuk siswa "${this.selectedStudentForAccess.name}" berhasil disimpan!`);
          this.closeStudentChapterAccessModal();
        } else {
          alert(json.error || "Gagal menyimpan hak akses.");
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="17 21 17 13 7 13 7 21"/><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="7 3 7 8 15 8"/></svg><span>Simpan</span>';
          }
        }
      } catch (e) {
        alert("Koneksi gagal saat menyimpan hak akses.");
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.innerHTML = '<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="17 21 17 13 7 13 7 21"/><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="7 3 7 8 15 8"/></svg><span>Simpan</span>';
        }
      }
    } else {
      // Offline fallback
      const mockAccess = JSON.parse(localStorage.getItem("imm_mock_chapter_access") || "{}");
      mockAccess[userId] = accessMap;
      if (this.selectedStudentForAccess.username) {
        mockAccess[this.selectedStudentForAccess.username] = accessMap;
      }
      localStorage.setItem("imm_mock_chapter_access", JSON.stringify(mockAccess));

      const mockPdfAccess = JSON.parse(localStorage.getItem("imm_mock_pdf_access") || "{}");
      const pdfObj = { master: this.selectedStudentPdfMasterAllowed || allPdfsAllowed, ...pdfMap };
      mockPdfAccess[userId] = pdfObj;
      if (this.selectedStudentForAccess.username) {
        mockPdfAccess[this.selectedStudentForAccess.username] = pdfObj;
      }
      localStorage.setItem("imm_mock_pdf_access", JSON.stringify(mockPdfAccess));

      // Update local state if the current user is this student
      if (this.currentUser && (this.currentUser.id === userId || this.currentUser.name === this.selectedStudentForAccess.name)) {
        this.isUserPdfAccessAllowed = this.selectedStudentPdfMasterAllowed || allPdfsAllowed;
        for (let i = 1; i <= 25; i++) {
          const num = String(i).padStart(2, "0");
          this.userRestrictedChapters[num] = accessMap[num] === false;
          this.userRestrictedPdfs[num] = !this.isUserPdfAccessAllowed ? !pdfMap[num] : pdfMap[num] === false;
          if (accessMap[num] === false) {
            this.chaptersStatus[num] = false;
          }
        }
      }
      alert(`Hak akses ujian & dokumen PDF untuk siswa "${this.selectedStudentForAccess.name}" berhasil disimpan!`);
      this.closeStudentChapterAccessModal();
    }
  }

  renderStudentChapterAccessModalContent() {
    const pane = document.getElementById("student-access-grid-container");
    if (!pane) return;

    const data = this.studentChapterAccessData;
    if (!data) {
      pane.innerHTML = `
        <div class="py-16 text-center text-slate-400">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mb-2"></div>
          <p class="text-xs font-semibold">Memuat data hak akses siswa...</p>
        </div>
      `;
      return;
    }

    const accessMap = {};
    const pdfMap = {};
    for (const item of data) {
      accessMap[item.chapterNum] = item.isAllowed !== false;
      pdfMap[item.chapterNum] = Boolean(item.isPdfAllowed);
    }

    const currentTab = this.studentAccessModalTab || "cbt";

    if (currentTab === "pdf") {
      const count = Object.values(pdfMap).filter(Boolean).length;
      let statusBadge = "";
      let statusDesc = "";
      let masterBtnText = "";
      let masterBtnClass = "";
      if (count === 25) {
        statusBadge = '<span id="pdf-master-status-badge" class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Semua Dibuka (25/25 Bab)</span>';
        statusDesc = "Seluruh 25 dokumen PDF materi & kunci dibuka untuk siswa ini.";
        masterBtnText = "SEMUA DIBUKA (25 Bab)";
        masterBtnClass = "bg-emerald-600 text-white hover:bg-emerald-700";
      } else if (count === 0) {
        statusBadge = '<span id="pdf-master-status-badge" class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">Terkunci Total (Default Sensei)</span>';
        statusDesc = "Akses PDF terkunci secara default. Hanya Sensei yang bisa mengakses, kecuali dibuka per bab di bawah ini.";
        masterBtnText = "TERKUNCI (Default Sensei)";
        masterBtnClass = "bg-rose-600 text-white hover:bg-rose-700";
      } else {
        statusBadge = `<span id="pdf-master-status-badge" class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">Kustom (${count}/25 Bab Dibuka)</span>`;
        statusDesc = `Siswa ini memiliki akses kustom hanya pada ${count} bab yang dicentang di bawah ini.`;
        masterBtnText = `KUSTOM (${count}/25 Bab)`;
        masterBtnClass = "bg-sky-600 text-white hover:bg-sky-700";
      }

      pane.innerHTML = `
        <div class="space-y-4">
          <!-- Master Switch Hak Akses PDF -->
          <div class="p-4 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-black uppercase tracking-wider text-sky-900 dark:text-sky-200">
                  Status Hak Akses Dokumen PDF Siswa
                </span>
                ${statusBadge}
              </div>
              <p id="pdf-master-desc" class="text-xs text-slate-600 dark:text-slate-400 mt-1">
                ${statusDesc}
              </p>
            </div>
            <button
              id="pdf-master-toggle-btn"
              type="button"
              onclick="window.app.toggleStudentPdfMasterAccess(!window.app.selectedStudentPdfMasterAllowed)"
              class="px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-xs ${masterBtnClass}"
            >
              ${masterBtnText}
            </button>
          </div>

          <!-- Quick Action Bar -->
          <div class="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div class="flex items-center gap-2">
              <button type="button" onclick="window.app.setAllStudentPdfChapterAccess(true)" class="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                Buka Semua PDF (25 Bab)
              </button>
              <button type="button" onclick="window.app.setAllStudentPdfChapterAccess(false)" class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                Kunci Semua PDF (Kembali Default)
              </button>
            </div>
            <span class="text-[11px] text-slate-500 italic">
              Toggle on/off tiap bab di bawah untuk custom akses per siswa
            </span>
          </div>

          <!-- Grid 25 Bab PDF -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-h-[45vh] overflow-y-auto p-1">
            ${CHAPTERS_INDEX.map((ch) => {
              const isAllowed = Boolean(pdfMap[ch.num]);
              const hasChoukai = parseInt(ch.num, 10) >= 8;
              return `
                <div id="pdf-card-${ch.num}" class="pdf-ch-card p-3 rounded-xl border ${isAllowed ? 'border-sky-300 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20' : 'border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 opacity-80'} transition flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-xs font-black font-jp text-slate-900 dark:text-slate-100">
                        Bab ${ch.num}
                      </span>
                      <span id="pdf-badge-${ch.num}" class="px-2 py-0.5 rounded text-[10px] font-bold ${isAllowed ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'}">
                        ${isAllowed ? 'PDF Diizinkan' : 'PDF Dibatasi'}
                      </span>
                    </div>
                    <div class="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate" title="${ch.title_ja}">
                      ${ch.title_ja}
                    </div>
                    <div class="text-[10px] text-slate-500 mt-1">
                      ${hasChoukai ? '<span class="inline-flex items-center gap-1">5 Dokumen + <svg class="w-2.5 h-2.5 text-rose-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h2v5z"/></svg>Audio</span>' : '3 Dokumen PDF'}
                    </div>
                  </div>
                  <div class="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <label for="pdf-toggle-${ch.num}" class="text-[11px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      Akses Dokumen
                    </label>
                    <input
                      id="pdf-toggle-${ch.num}"
                      type="checkbox"
                      ${isAllowed ? 'checked' : ''}
                      onchange="window.app.toggleStudentPdfChapterAccess('${ch.num}')"
                      class="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                    >
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
      return;
    }

    // Default: CBT Tab
    pane.innerHTML = `
      <div class="space-y-4">
        <!-- Quick Action Bar -->
        <div class="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-2">
            <button type="button" onclick="window.app.setAllStudentChapterAccess(true)" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              Izinkan Semua Ujian
            </button>
            <button type="button" onclick="window.app.setAllStudentChapterAccess(false)" class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              Kunci Semua Ujian
            </button>
          </div>
          <span class="text-[11px] text-slate-500 italic">
            Bab yang dibatasi tidak akan bisa dikerjakan oleh siswa ini saat ujian di lab
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-h-[50vh] overflow-y-auto p-1">
          ${CHAPTERS_INDEX.map((ch) => {
            const isAllowed = accessMap[ch.num] !== false;
            return `
              <div id="access-card-${ch.num}" class="access-ch-card p-3 rounded-xl border ${isAllowed ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 opacity-80'} transition flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs font-black font-jp text-slate-900 dark:text-slate-100">
                      Bab ${ch.num}
                    </span>
                    <span id="access-badge-${ch.num}" class="px-2 py-0.5 rounded text-[10px] font-bold ${isAllowed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'}">
                      ${isAllowed ? 'Diizinkan' : 'Dibatasi'}
                    </span>
                  </div>
                  <div class="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate" title="${ch.title_ja}">
                    ${ch.title_ja}
                  </div>
                  <div class="text-[10px] text-slate-500 truncate" title="${ch.title_id}">
                    ${ch.title_id}
                  </div>
                </div>
                <div class="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <label for="access-toggle-${ch.num}" class="text-[11px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Izinkan Ujian
                  </label>
                  <input
                    id="access-toggle-${ch.num}"
                    type="checkbox"
                    ${isAllowed ? 'checked' : ''}
                    onchange="window.app.toggleStudentChapterAccess('${ch.num}')"
                    class="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  >
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  async fetchChaptersLockStatus() {
    const pane = document.getElementById("admin-tab-content");
    if (!pane || this.adminTab !== "lock") return;
    try {
      await this.fetchSystemStatus();
      const res = await fetch("/api/v1/chapters");
      const json = await res.json();
      if (json.success && json.data) {
        for (const ch of json.data) {
          this.chaptersStatus[ch.chapterNum] = ch.isUnlocked;
        }
      }
    } catch (e) {}
    this.renderLockControlsPane();
  }

  renderLockControlsPane() {
    const pane = document.getElementById("admin-tab-content");
    if (!pane) return;
    pane.innerHTML = `
      <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        <!-- Sakelar Master Sistem -->
        <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">
            Sakelar Utama Sistem (Master Control)
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-slate-900 dark:text-slate-100">Registrasi Mandiri Siswa</div>
                <div class="text-[11px] text-slate-500">Izinkan siswa membuat akun sendiri di web CBT</div>
              </div>
              <button onclick="window.app.toggleRegistration(!window.app.systemStatus.allowRegistration)" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${this.systemStatus.allowRegistration ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}">
                ${this.systemStatus.allowRegistration ? 'DIBUKA (ON)' : 'DITUTUP (OFF)'}
              </button>
            </div>

            <div class="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-slate-900 dark:text-slate-100">Kunci Global Seluruh Ujian</div>
                <div class="text-[11px] text-slate-500">Kunci semua tryout di seluruh laboratorium</div>
              </div>
              <button onclick="window.app.toggleGlobalExamLock(!window.app.systemStatus.globalExamLock)" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${this.systemStatus.globalExamLock ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}">
                ${this.systemStatus.globalExamLock ? 'TERKUNCI (LOCKED)' : 'TERBUKA (NORMAL)'}
              </button>
            </div>
          </div>
        </div>

        <!-- Aksi Massal Bab -->
        <div class="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60">
          <div>
            <div class="text-xs font-bold text-slate-900 dark:text-slate-100">Aksi Massal Bab Ujian</div>
            <div class="text-[11px] text-slate-500">Buka atau kunci seluruh Bab 01 s.d. Bab 25 serentak</div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.app.lockAllChapters()" class="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              Kunci Semua Bab
            </button>
            <button onclick="window.app.unlockAllChapters()" class="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
              Buka Semua Bab
            </button>
          </div>
        </div>

        <!-- Grid 25 Bab -->
        <div>
          <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5 uppercase tracking-wider">
            Status Kunci Per Bab (Bab 01 s.d. 25)
          </h4>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
            ${Array.from({ length: 25 }, (_, i) => {
              const num = String(i + 1).padStart(2, "0");
              const isUnlocked = this.chaptersStatus[num] !== false;
              return `
                <div class="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between text-xs">
                  <span class="font-bold">Bab ${num}</span>
                  <button onclick="window.app.toggleChapterLock('${num}', ${!isUnlocked})" class="px-2 py-0.5 rounded text-[10px] font-bold transition ${isUnlocked ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-rose-100 text-rose-800 hover:bg-rose-200'}">
                    ${isUnlocked ? 'Terbuka' : 'Kunci'}
                  </button>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;
  }

  async toggleRegistration(allow) {
    try {
      const res = await fetch("/api/v1/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allowRegistration: allow }),
      });
      const data = await res.json();
      if (data.success) {
        this.systemStatus.allowRegistration = allow;
        this.renderLockControlsPane();
      }
    } catch (e) {}
  }

  async toggleGlobalExamLock(lock) {
    try {
      const res = await fetch("/api/v1/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ globalExamLock: lock }),
      });
      const data = await res.json();
      if (data.success) {
        this.systemStatus.globalExamLock = lock;
        this.renderLockControlsPane();
      }
    } catch (e) {}
  }

  async lockAllChapters() {
    if (!confirm("Kunci seluruh Bab 01 s.d. 25 untuk semua siswa?")) return;
    try {
      await fetch("/api/v1/admin/chapters/lock-all", { method: "POST" });
      for (let i = 1; i <= 25; i++) {
        this.chaptersStatus[String(i).padStart(2, "0")] = false;
      }
      this.renderLockControlsPane();
    } catch (e) {}
  }

  async unlockAllChapters() {
    if (!confirm("Buka seluruh Bab 01 s.d. 25 untuk semua siswa?")) return;
    try {
      await fetch("/api/v1/admin/chapters/unlock-all", { method: "POST" });
      for (let i = 1; i <= 25; i++) {
        this.chaptersStatus[String(i).padStart(2, "0")] = true;
      }
      this.renderLockControlsPane();
    } catch (e) {}
  }

  async toggleChapterLock(chapterNum, isUnlocked) {
    try {
      const res = await fetch(`/api/v1/admin/chapters/${chapterNum}/lock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isUnlocked }),
      });
      const data = await res.json();
      if (data.success) {
        this.chaptersStatus[chapterNum] = isUnlocked;
        this.renderLockControlsPane();
      }
    } catch (e) {}
  }

  async fetchAdminResults(chapter = "", className = "") {
    const pane = document.getElementById("admin-tab-content");
    if (!pane || this.adminTab !== "results") return;
    try {
      let url = "/api/v1/admin/monitoring/results?";
      if (chapter) url += `chapter=${chapter}&`;
      if (className) url += `class=${encodeURIComponent(className)}&`;
      const res = await fetch(url);
      const json = await res.json();
      this.adminResultsData = json.data || [];
    } catch (e) {
      this.adminResultsData = [];
    }
    this.renderAdminResultsPane(chapter, className);
  }

  renderAdminResultsPane(selectedChapter = "", selectedClass = "") {
    const pane = document.getElementById("admin-tab-content");
    if (!pane) return;
    const items = this.adminResultsData;
    pane.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-2">
          <select id="admin-result-ch-filter" onchange="window.app.fetchAdminResults(this.value, document.getElementById('admin-result-cls-filter').value)" class="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
            <option value="">Semua Bab</option>
            ${Array.from({ length: 25 }, (_, i) => {
              const num = String(i + 1).padStart(2, "0");
              return `<option value="${num}" ${selectedChapter === num ? 'selected' : ''}>Bab ${num}</option>`;
            }).join("")}
          </select>
          <input id="admin-result-cls-filter" type="text" placeholder="Filter kelas..." value="${selectedClass}" onkeydown="if(event.key==='Enter') window.app.fetchAdminResults(document.getElementById('admin-result-ch-filter').value, this.value)" class="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 w-32">
        </div>
        <div class="flex items-center gap-2">
          <button onclick="window.app.exportResultsCsv()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Unduh Rekap Nilai (CSV)
          </button>
          <button onclick="window.app.adminResetAllExamResults()" class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs" title="Kosongkan TOTAL seluruh data nilai dan pengerjaan ujian semua siswa">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            Kosongkan Semua Nilai Ujian
          </button>
        </div>
      </div>

      <div class="max-h-[55vh] overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 sticky top-0">
            <tr>
              <th class="p-2.5">Waktu Submit</th>
              <th class="p-2.5">Nama Siswa</th>
              <th class="p-2.5">Kelas</th>
              <th class="p-2.5">Bab</th>
              <th class="p-2.5 text-center">Reading</th>
              <th class="p-2.5 text-center">Choukai</th>
              <th class="p-2.5 text-center">Total</th>
              <th class="p-2.5 text-center">Hasil</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            ${items.length === 0 ? `
              <tr>
                <td colspan="8" class="p-8 text-center text-slate-400">Belum ada data pengerjaan tryout.</td>
              </tr>
            ` : items.map((r) => `
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td class="p-2.5 text-slate-500 text-[11px]">${r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                <td class="p-2.5 font-bold text-slate-900 dark:text-slate-100">${escapeHtml(r.studentName)}</td>
                <td class="p-2.5 text-slate-600 dark:text-slate-400">${escapeHtml(r.className)}</td>
                <td class="p-2.5 font-mono">Bab ${r.chapterNum}</td>
                <td class="p-2.5 text-center">${r.readingScore || '0'}</td>
                <td class="p-2.5 text-center">${r.choukaiScore || '0'}</td>
                <td class="p-2.5 text-center font-bold">${r.totalScore || '0'}</td>
                <td class="p-2.5 text-center">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${r.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                    ${r.isPassed ? 'LULUS' : 'REMEDIAL'}
                  </span>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  exportResultsCsv() {
    const ch = document.getElementById("admin-result-ch-filter")?.value || "";
    const cls = document.getElementById("admin-result-cls-filter")?.value || "";
    let url = "/api/v1/admin/monitoring/results/export?format=csv";
    if (ch) url += `&chapter=${ch}`;
    if (cls) url += `&class=${encodeURIComponent(cls)}`;
    window.open(url, "_blank");
  }

  async adminResetAllExamResults() {
    const confirm1 = confirm(
      "PERINGATAN SENSEI:\n\nApakah Anda yakin ingin MENGOSONGKAN TOTAL seluruh data pengerjaan ujian dari SEMUA siswa?\n\nTindakan ini akan menghapus seluruh rekaman sesi ujian dan jawaban dari basis data, sehingga seluruh siswa mulai dari lembaran kosong."
    );
    if (!confirm1) return;
    try {
      if (window.location.protocol.startsWith("http")) {
        const res = await fetch("/api/v1/admin/monitoring/results/reset-all", {
          method: "POST",
        });
        const data = await res.json();
        if (data.success) {
          alert(data.message || "Seluruh data pengerjaan ujian berhasil dikosongkan total.");
          this.progress = {};
          // RESIDUAL BUG-18: hapus key per-user admin ini (key global sudah tidak dipakai;
          // progress siswa lain di browser masing-masing disegarkan via skor server).
          try { localStorage.removeItem(this.userStorageKey("choukai_progress")); } catch (e) {}
          this.fetchAdminResults();
        } else {
          alert(data.error || "Gagal mengosongkan data ujian.");
        }
      } else {
        this.adminResultsData = [];
        this.progress = {};
        // RESIDUAL BUG-18: hapus key per-user (key global sudah tidak dipakai).
        try { localStorage.removeItem(this.userStorageKey("choukai_progress")); } catch (e) {}
        alert("Seluruh data pengerjaan ujian berhasil dikosongkan.");
        this.renderAdminResultsPane();
      }
    } catch (e) {
      alert("Koneksi gagal saat mengosongkan data ujian.");
    }
  }

  // =========================================================================
  // BANK DOKUMEN PDF & AUDIO LISTENING TERPADU (112 PDF + 18 AUDIO)
  // =========================================================================

  renderAdminPdfLibraryPane() {
    const pane = document.getElementById("admin-tab-content");
    if (!pane) return;
    const all = this.getAllResources();
    const pdfs = all.filter((r) => r.ext === "pdf");
    const audios = all.filter((r) => r.ext === "mp3");

    pane.innerHTML = `
      <div class="space-y-4">
        <!-- Header Info -->
        <div class="p-4 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black uppercase tracking-wider text-sky-900 dark:text-sky-200">
                Pusat Bank Dokumen & Audio CBT IMM Japan
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                ${pdfs.length} PDF • ${audios.length} Audio Track
              </span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Sensei memiliki akses penuh ke seluruh lembar soal, kunci pembahasan, hafalan kotoba, dan audio listening tanpa batasan.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <a href="${this.pdfUrl('assets/pdf/Daftar Kosakata Lengkap Bab 01-25.pdf')}" target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Master Bundle Kosakata (76 Hal)
            </a>
            <button onclick="window.app.openPdfLibraryModal()" class="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Buka Tampilan Library
            </button>
          </div>
        </div>

        <!-- Filter & Search Bar -->
        <div class="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <input
            id="admin-pdf-search-input"
            type="text"
            placeholder="Cari berdasarkan bab atau kata kunci (contoh: Bab 08, Kunci, Choukai)..."
            oninput="window.app.filterAdminPdfTable(this.value)"
            class="flex-1 min-w-[200px] px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
          <span class="text-[11px] text-slate-500">
            Total 25 Bab Terintegrasi
          </span>
        </div>

        <!-- Table Container -->
        <div id="admin-pdf-table-container" class="max-h-[55vh] overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table class="w-full text-left border-collapse text-xs">
            <thead class="bg-slate-100 dark:bg-slate-800 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              <tr>
                <th class="p-2.5 font-bold">Bab</th>
                <th class="p-2.5 font-bold">Judul / Materi</th>
                <th class="p-2.5 font-bold">Dokumen Reading</th>
                <th class="p-2.5 font-bold">Dokumen Choukai</th>
                <th class="p-2.5 font-bold text-center">Audio Listening</th>
              </tr>
            </thead>
            <tbody id="admin-pdf-tbody" class="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
              ${CHAPTERS_INDEX.map((ch) => {
                const res = this.getChapterResources(ch.num);
                const rSoal = res.find((r) => r.type === "reading_soal");
                const rKunci = res.find((r) => r.type === "reading_kunci");
                const rKosa = res.find((r) => r.type === "kosakata");
                const cSoal = res.find((r) => r.type === "choukai_soal");
                const cKunci = res.find((r) => r.type === "choukai_kunci");
                const cAudio = res.find((r) => r.type === "choukai_audio");

                return `
                  <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td class="p-2.5 font-mono font-bold whitespace-nowrap">
                      Bab ${ch.num}
                    </td>
                    <td class="p-2.5">
                      <div class="font-bold truncate max-w-[180px]">${ch.title_ja}</div>
                      <div class="text-[10px] text-slate-500 truncate max-w-[180px]">${ch.title_id}</div>
                    </td>
                    <td class="p-2.5">
                      <div class="flex flex-wrap gap-1.5">
                        <a href="${rSoal.url}" target="_blank" class="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold hover:underline inline-flex items-center gap-1">
                          <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                          Soal
                        </a>
                        <a href="${rKunci.url}" target="_blank" class="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold hover:underline inline-flex items-center gap-1">
                          <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                          Kunci
                        </a>
                        <a href="${rKosa.url}" target="_blank" class="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[10px] font-semibold hover:underline inline-flex items-center gap-1">
                          <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                          Kotoba
                        </a>
                      </div>
                    </td>
                    <td class="p-2.5">
                      ${cSoal ? `
                        <div class="flex flex-wrap gap-1.5">
                          <a href="${cSoal.url}" target="_blank" class="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-[10px] font-semibold hover:underline inline-flex items-center gap-1">
                            <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h2v5z"/></svg>
                            Soal
                          </a>
                          <a href="${cKunci.url}" target="_blank" class="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold hover:underline inline-flex items-center gap-1">
                            <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                            Kunci
                          </a>
                        </div>
                      ` : `
                        <span class="text-slate-400 text-[10px] italic">- (Bab 01-07 Reading Only)</span>
                      `}
                    </td>
                    <td class="p-2.5 text-center">
                      ${cAudio ? `
                        <button
                          type="button"
                          data-src="${cAudio.url}"
                          onclick="window.app.toggleResourceAudio('${cAudio.url}', 'Audio Choukai Bab ${ch.num}')"
                          class="btn-toggle-audio px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 dark:bg-sky-950/80 dark:hover:bg-sky-900 border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-[11px] font-bold transition inline-flex items-center gap-1 shadow-xs"
                        >
                          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg> Putar
                        </button>
                      ` : `
                        <span class="text-slate-400 text-[10px]">-</span>
                      `}
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  filterAdminPdfTable(query) {
    const q = (query || "").trim().toLowerCase();
    const rows = document.querySelectorAll("#admin-pdf-tbody tr");
    rows.forEach((r) => {
      const text = r.innerText.toLowerCase();
      r.style.display = text.includes(q) ? "" : "none";
    });
  }

  getChapterResources(chapterNum) {
    const num = String(chapterNum || "01").padStart(2, "0");
    const numInt = parseInt(num, 10);
    const hasChoukai = numInt >= 8;
    const resources = [
      {
        id: `reading_soal_${num}`,
        type: "reading_soal",
        category: "reading",
        title: `Salinan Soal Bab ${num}`,
        description: `Dokumen lembar soal ujian reading Bab ${num}`,
        url: this.pdfUrl(`assets/pdf/Salinan Soal Bab ${num}.pdf`),
        ext: "pdf",
        icon: "reading",
      },
      {
        id: `reading_kunci_${num}`,
        type: "reading_kunci",
        category: "reading",
        title: `Kunci dan Pembahasan Bab ${num}`,
        description: `Kunci jawaban resmi & lembar pembahasan Bab ${num}`,
        url: this.pdfUrl(`assets/pdf/Kunci dan Pembahasan Bab ${num}.pdf`),
        ext: "pdf",
        icon: "kunci",
      },
      {
        id: `kosakata_${num}`,
        type: "kosakata",
        category: "kosakata",
        title: `Daftar Kosakata Bab ${num}`,
        description: `Daftar kosakata kotoba & terjemahan Bab ${num}`,
        url: this.pdfUrl(`assets/pdf/Daftar Kosakata Bab ${num}.pdf`),
        ext: "pdf",
        icon: "kosakata",
      },
    ];

    if (hasChoukai) {
      resources.push(
        {
          id: `choukai_soal_${num}`,
          type: "choukai_soal",
          category: "choukai",
          title: `Soal Choukai Bab ${num}`,
          description: `Lembar naskah soal mendengarkan Choukai Bab ${num}`,
          url: this.pdfUrl(`assets/pdf/Soal Choukai Bab ${num}.pdf`),
          ext: "pdf",
          icon: "choukai",
        },
        {
          id: `choukai_kunci_${num}`,
          type: "choukai_kunci",
          category: "choukai",
          title: `Kunci dan Pembahasan Choukai Bab ${num}`,
          description: `Kunci jawaban dan skrip listening Choukai Bab ${num}`,
          url: this.pdfUrl(`assets/pdf/Kunci dan Pembahasan Choukai Bab ${num}.pdf`),
          ext: "pdf",
          icon: "kunci",
        },
        {
          id: `choukai_audio_${num}`,
          type: "choukai_audio",
          category: "audio",
          title: `Audio Listening Choukai Bab ${num}`,
          description: `Track rekaman suara penutur asli Jepang Bab ${num}`,
          url: `assets/Choukai_Bab_${num}.mp3`,
          ext: "mp3",
          icon: "audio",
        }
      );
    }
    return resources;
  }

  getAllResources() {
    const list = [
      {
        id: "bundle_kosakata_all",
        type: "bundle",
        category: "kosakata",
        chapterNum: "00",
        title: "Daftar Kosakata Lengkap Bab 01-25",
        description: "Bundel master lembar setoran kosakata 1.500 kata (76 Halaman)",
        url: this.pdfUrl("assets/pdf/Daftar Kosakata Lengkap Bab 01-25.pdf"),
        ext: "pdf",
        icon: "bundle",
        pageCount: "76 Halaman",
      },
    ];
    for (let i = 1; i <= 25; i++) {
      const num = String(i).padStart(2, "0");
      const items = this.getChapterResources(num);
      for (const item of items) {
        list.push({ ...item, chapterNum: num });
      }
    }
    return list;
  }

  openChapterResourcesModal(chapterNum) {
    this.selectedChapterForResources = String(chapterNum || "08").padStart(2, "0");
    this.activeModal = "chapter_resources";
    this.renderModal();
  }

  openPdfLibraryModal(filterType = "all") {
    this.pdfLibraryFilterType = filterType;
    this.pdfLibrarySearchQuery = "";
    this.activeModal = "pdf_library";
    this.renderModal();
  }

  setPdfLibraryFilterType(type) {
    this.pdfLibraryFilterType = type;
    document.querySelectorAll(".pdf-lib-filter-chip").forEach((btn) => {
      const t = btn.getAttribute("data-type");
      if (t === type) {
        btn.className = "pdf-lib-filter-chip px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-600 text-white shadow-xs transition";
      } else {
        btn.className = "pdf-lib-filter-chip px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition";
      }
    });
    this.renderPdfLibraryContent();
  }

  filterPdfLibrary(query) {
    this.pdfLibrarySearchQuery = (query || "").trim().toLowerCase();
    this.renderPdfLibraryContent();
  }

  renderPdfLibraryContent() {
    const container = document.getElementById("pdf-library-grid");
    if (!container) return;

    const query = this.pdfLibrarySearchQuery || "";
    const filter = this.pdfLibraryFilterType || "all";
    const isMasterRestricted = this.currentUser && this.currentUser.role !== "admin" && !this.isUserPdfAccessAllowed;

    const filteredChapters = CHAPTERS_INDEX.filter((ch) => {
      const num = ch.num;
      const resList = this.getChapterResources(num);

      // Check category match
      let matchesCategory = true;
      if (filter !== "all") {
        matchesCategory = resList.some((r) => r.category === filter);
      }
      if (!matchesCategory) return false;

      // Check search query match
      if (query) {
        const inCh = `bab ${num}`.includes(query) || ch.title_ja.toLowerCase().includes(query) || ch.title_id.toLowerCase().includes(query);
        const inRes = resList.some((r) => r.title.toLowerCase().includes(query) || r.description.toLowerCase().includes(query));
        return inCh || inRes;
      }
      return true;
    });

    if (filteredChapters.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center text-slate-400">
          <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-2"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
          <p class="text-sm font-semibold">Tidak ditemukan dokumen yang cocok.</p>
          <p class="text-xs mt-1">Coba gunakan kata kunci pencarian lain atau pilih tab filter "Semua".</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filteredChapters.map((ch) => {
      const num = ch.num;
      const isRestricted = isMasterRestricted || (this.currentUser && this.currentUser.role !== "admin" && this.userRestrictedPdfs[num]);
      const resList = this.getChapterResources(num);
      const displayResources = filter === "all" ? resList : resList.filter((r) => r.category === filter);
      const audioRes = resList.find((r) => r.type === "choukai_audio");

      return `
        <div class="p-4 rounded-xl border ${isRestricted ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80'} shadow-xs flex flex-col justify-between transition hover:shadow-md">
          <div>
            <!-- Bab Header -->
            <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-700/60">
              <div class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                  ${num}
                </span>
                <div>
                  <h4 class="font-bold text-xs text-slate-900 dark:text-slate-100 font-jp leading-tight">
                    Bab ${num} • ${ch.title_ja}
                  </h4>
                  <div class="text-[10px] text-slate-500 truncate max-w-[200px]" title="${ch.title_id}">
                    ${ch.title_id}
                  </div>
                </div>
              </div>
              <div>
                ${isRestricted ? `
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 inline-flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    Dibatasi
                  </span>
                ` : `
                  <button onclick="window.app.openChapterResourcesModal('${num}')" class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition">
                    Dialog Bab &rarr;
                  </button>
                `}
              </div>
            </div>

            <!-- List of Documents in this Chapter -->
            <div class="space-y-1.5 my-2.5">
              ${displayResources.map((item) => {
                if (item.ext === "mp3") {
                  return `
                    <div class="p-2 rounded-lg bg-sky-50/60 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2 min-w-0">
                        <span class="w-5 h-5 rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h2v5z"/></svg></span>
                        <div class="min-w-0">
                          <div class="text-[11px] font-bold text-sky-900 dark:text-sky-200 truncate">${item.title}</div>
                          <div class="text-[10px] text-sky-700 dark:text-sky-400 truncate">Audio Penutur Asli Choukai</div>
                        </div>
                      </div>
                      ${isRestricted ? `
                        <span class="text-[10px] text-rose-600 font-bold">Terkunci</span>
                      ` : `
                        <button
                          type="button"
                          data-src="${item.url}"
                          onclick="window.app.toggleResourceAudio('${item.url}', 'Audio Choukai Bab ${num}')"
                          class="btn-toggle-audio px-2.5 py-1 rounded-md bg-sky-600 hover:bg-sky-700 text-white text-[10px] font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg> Putar
                        </button>
                      `}
                    </div>
                  `;
                }

                // PDF Resource Item
                const badgeColor =
                  item.category === "reading" ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800" :
                  item.category === "choukai" ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800" :
                  "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";

                return `
                  <div class="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition">
                    <div class="flex items-center gap-1.5 min-w-0">
                      <span class="px-1.5 py-0.2 rounded text-[9px] font-bold border uppercase ${badgeColor}">
                        ${item.type.includes("kunci") ? "Kunci" : item.category}
                      </span>
                      <span class="text-[11px] font-medium text-slate-800 dark:text-slate-200 truncate" title="${item.title}">
                        ${item.title}
                      </span>
                    </div>
                    <div>
                      ${isRestricted ? `
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 inline-flex items-center">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        </span>
                      ` : `
                        <a
                          href="${item.url}"
                          target="_blank"
                          class="px-2 py-0.5 rounded bg-slate-100 hover:bg-sky-100 dark:bg-slate-700 dark:hover:bg-sky-900/60 text-slate-700 hover:text-sky-700 dark:text-slate-300 dark:hover:text-sky-300 text-[10px] font-bold transition flex items-center gap-1"
                          title="Buka Dokumen PDF di tab baru"
                        >
                          Buka &rarr;
                        </a>
                      `}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Bottom Action / Summary -->
          <div class="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
            <span class="text-slate-500">
              ${resList.length > 3 ? '<span class="inline-flex items-center gap-1">5 PDF + <svg class="w-2.5 h-2.5 text-rose-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h2v5z"/></svg>Audio</span>' : '3 Dokumen PDF'}
            </span>
            ${!isRestricted ? `
              <button onclick="window.app.openChapterResourcesModal('${num}')" class="text-sky-600 dark:text-sky-400 font-bold hover:underline">
                Buka Dialog &rarr;
              </button>
            ` : `
              <span class="text-rose-500 font-semibold text-[10px]">Akses Dibatasi</span>
            `}
          </div>
        </div>
      `;
    }).join("");
  }

  // Audio Player Controller Methods
  playResourceAudio(src, title) {
    if (!this.resourceAudio) {
      this.resourceAudio = new Audio();
      this.resourceAudio.addEventListener("timeupdate", () => this.updateResourceAudioUI());
      this.resourceAudio.addEventListener("ended", () => this.updateResourceAudioUI());
      this.resourceAudio.addEventListener("play", () => this.updateResourceAudioUI());
      this.resourceAudio.addEventListener("pause", () => this.updateResourceAudioUI());
    }
    if (this.resourceAudioTrack !== src) {
      this.resourceAudio.src = src;
      this.resourceAudio.playbackRate = this.resourceAudioPlaybackRate || 1.0;
      this.resourceAudioTrack = src;
      this.resourceAudioTitle = title || "Audio Choukai";
    }
    this.resourceAudio.play().catch((e) => console.warn("Audio play prevented:", e));
    this.updateResourceAudioUI();
  }

  pauseResourceAudio() {
    if (this.resourceAudio) {
      this.resourceAudio.pause();
      this.updateResourceAudioUI();
    }
  }

  toggleResourceAudio(src, title) {
    if (this.resourceAudio && this.resourceAudioTrack === src && !this.resourceAudio.paused) {
      this.pauseResourceAudio();
    } else {
      this.playResourceAudio(src, title);
    }
  }

  seekResourceAudio(deltaSec) {
    if (this.resourceAudio && !isNaN(this.resourceAudio.duration)) {
      this.resourceAudio.currentTime = Math.max(0, Math.min(this.resourceAudio.duration, this.resourceAudio.currentTime + deltaSec));
      this.updateResourceAudioUI();
    }
  }

  cycleResourceAudioRate() {
    const rates = [1.0, 1.2, 1.5, 0.8];
    const current = this.resourceAudioPlaybackRate || 1.0;
    const nextIdx = (rates.indexOf(current) + 1) % rates.length;
    this.resourceAudioPlaybackRate = rates[nextIdx];
    if (this.resourceAudio) {
      this.resourceAudio.playbackRate = this.resourceAudioPlaybackRate;
    }
    const btn = document.getElementById("res-audio-rate-btn");
    if (btn) btn.innerText = `${this.resourceAudioPlaybackRate}x`;
    const btnModal = document.getElementById("ch-audio-rate-btn");
    if (btnModal) btnModal.innerText = `${this.resourceAudioPlaybackRate}x`;
  }

  updateResourceAudioUI() {
    const playBtns = document.querySelectorAll(".btn-toggle-audio");
    const isPlaying = this.resourceAudio && !this.resourceAudio.paused;
    const currentTrack = this.resourceAudioTrack;

    playBtns.forEach((btn) => {
      const track = btn.getAttribute("data-src");
      if (track === currentTrack) {
        btn.innerHTML = isPlaying
          ? `<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg> Pause`
          : `<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg> Putar`;
      } else {
        btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg> Putar`;
      }
    });

    const playerBar = document.getElementById("active-audio-bar");
    if (playerBar) {
      if (currentTrack) {
        playerBar.classList.remove("hidden");
        const titleEl = document.getElementById("res-audio-bar-title");
        if (titleEl) titleEl.innerText = this.resourceAudioTitle || "Audio Listening Choukai";
        const timeEl = document.getElementById("res-audio-bar-time");
        if (timeEl && this.resourceAudio) {
          const cur = Math.floor(this.resourceAudio.currentTime || 0);
          const dur = Math.floor(this.resourceAudio.duration || 0);
          const format = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
          timeEl.innerText = `${format(cur)} / ${isNaN(dur) || dur === 0 ? '--:--' : format(dur)}`;
        }
        const barPlayBtn = document.getElementById("res-audio-bar-play-btn");
        if (barPlayBtn) {
          barPlayBtn.innerHTML = isPlaying
            ? `<span class="inline-flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>Pause</span>`
            : `<span class="inline-flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg>Putar</span>`;
        }
      } else {
        playerBar.classList.add("hidden");
      }
    }
  }

  // MODAL RENDERER
  renderModal() {
    const container = document.getElementById("modal-container");
    if (!container) return;

    if (!this.activeModal) {
      container.innerHTML = "";
      return;
    }

    if (this.activeModal === "onboarding") {
      const hasProfile = Boolean(this.profile.name && this.profile.classNo);
      container.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" ${hasProfile ? 'onclick="window.app.closeModal()"' : ""}>
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl" onclick="event.stopPropagation()">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center text-lg font-bold font-jp">
                  研
                </span>
                <div>
                  <h3 class="text-base font-extrabold text-slate-900 dark:text-slate-100 font-jp leading-tight">
                    Profil Peserta Tryout IMM Japan
                  </h3>
                  <p class="text-[11px] text-slate-500 mt-0.5">
                    Identitas untuk pelaporan nilai Reading & Choukai ke Sensei.
                  </p>
                </div>
              </div>
              ${hasProfile ? `
              <button onclick="window.app.closeModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold p-1 leading-none" title="Tutup">&times;</button>
              ` : ""}
            </div>

            <form onsubmit="event.preventDefault(); const n = document.getElementById('input-name').value; const c = document.getElementById('input-class').value; const t = document.getElementById('input-target').value; window.app.saveProfile(n, c, t);" class="space-y-3.5">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap (Siswa):</label>
                <input id="input-name" type="text" required placeholder="Contoh: Dadan Ramdani" value="${this.profile.name || ""}" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kelas / No. Absen / LPK:</label>
                <input id="input-class" type="text" required placeholder="Contoh: Kelas 24-B / LPK Sakura" value="${this.profile.classNo || ""}" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Kelulusan Ujian:</label>
                <select id="input-target" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500">
                  <option value="JFT-Basic A2" ${this.profile.target === "JFT-Basic A2" ? "selected" : ""}>JFT-Basic A2 (Tokutei Ginou SSW)</option>
                  <option value="JLPT N5" ${this.profile.target === "JLPT N5" ? "selected" : ""}>JLPT N5 (Dasar Magang IMM Japan)</option>
                  <option value="JLPT N4" ${this.profile.target === "JLPT N4" ? "selected" : ""}>JLPT N4 (Lanjutan Magang)</option>
                </select>
              </div>

              <div class="flex items-center justify-end gap-2 pt-3">
                ${hasProfile ? `
                <button type="button" onclick="window.app.closeModal()" class="px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300">
                  Batal
                </button>
                ` : ""}
                <button type="submit" class="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-bold transition shadow-sm">
                  Simpan & Masuk ke Lab
                </button>
              </div>
            </form>
          </div>
        </div>
      `;
    } else if (this.activeModal === "auth_login") {
      container.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" onclick="window.app.closeModal()">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-6 shadow-2xl" onclick="event.stopPropagation()">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-2.5">
                <span class="w-9 h-9 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300 flex items-center justify-center text-base font-bold font-jp">
                  登
                </span>
                <div>
                  <h3 class="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-jp leading-tight">
                    Masuk Platform CBT
                  </h3>
                  <p class="text-[11px] text-slate-500 mt-0.5">Kredensial Siswa & Pengawas IMM Japan</p>
                </div>
              </div>
              <button onclick="window.app.closeModal()" class="text-slate-400 hover:text-slate-600 text-lg font-bold leading-none">&times;</button>
            </div>

            <div id="login-error-msg" class="hidden mb-3 p-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded text-xs"></div>

            <form onsubmit="event.preventDefault(); window.app.login(document.getElementById('login-username').value, document.getElementById('login-pin').value);" class="space-y-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Username Siswa / Sensei:</label>
                <input id="login-username" type="text" required placeholder="Masukkan username Anda" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-mono">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password / PIN:</label>
                <input id="login-pin" type="password" required placeholder="Masukkan password Anda" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-mono">
              </div>
              <button type="submit" class="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-bold transition shadow-sm mt-2">
                Masuk ke Sistem CBT
              </button>
            </form>

            ${this.systemStatus.allowRegistration ? `
              <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <button type="button" onclick="window.app.openAuthModal('auth_register')" class="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline">
                  Belum punya akun? Daftar mandiri di sini &rarr;
                </button>
              </div>
            ` : `
              <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-400">
                Pendaftaran mandiri siswa sedang ditutup oleh Sensei.
              </div>
            `}
          </div>
        </div>
      `;
    } else if (this.activeModal === "auth_register") {
      container.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" onclick="window.app.closeModal()">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-6 shadow-2xl" onclick="event.stopPropagation()">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-2.5">
                <span class="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-base font-bold font-jp">
                  生
                </span>
                <div>
                  <h3 class="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-jp leading-tight">
                    Pendaftaran Siswa Baru
                  </h3>
                  <p class="text-[11px] text-slate-500 mt-0.5">Buat akun untuk merekam nilai tryout LPK</p>
                </div>
              </div>
              <button onclick="window.app.closeModal()" class="text-slate-400 hover:text-slate-600 text-lg font-bold leading-none">&times;</button>
            </div>

            <div id="reg-error-msg" class="hidden mb-3 p-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded text-xs"></div>

            <form onsubmit="event.preventDefault(); window.app.registerStudent({
              name: document.getElementById('reg-name').value,
              username: document.getElementById('reg-username').value,
              pin: document.getElementById('reg-pin').value,
              className: document.getElementById('reg-class').value,
              email: document.getElementById('reg-email').value,
            });" class="space-y-2.5">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap Siswa:</label>
                <input id="reg-name" type="text" required placeholder="Contoh: Dadan Ramdani" class="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md text-xs bg-white dark:bg-slate-800 focus:outline-none">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Username (Login LPK):</label>
                <input id="reg-username" type="text" required placeholder="Contoh: dadan.ramdani" class="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md text-xs bg-white dark:bg-slate-800 font-mono focus:outline-none">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">PIN 6-Digit:</label>
                <input id="reg-pin" type="password" required placeholder="6-digit angka" class="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md text-xs bg-white dark:bg-slate-800 font-mono focus:outline-none">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Kelas / Angkatan:</label>
                <input id="reg-class" type="text" placeholder="Angkatan 35-A" value="Angkatan 35-A" class="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md text-xs bg-white dark:bg-slate-800 focus:outline-none">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Email (Opsional):</label>
                <input id="reg-email" type="email" placeholder="dadan@contoh.com" class="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md text-xs bg-white dark:bg-slate-800 focus:outline-none">
              </div>
              <button type="submit" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold transition shadow-sm mt-2">
                Daftar & Masuk ke Lab
              </button>
            </form>

            <div class="mt-3 text-center">
              <button type="button" onclick="window.app.openAuthModal('auth_login')" class="text-xs text-slate-500 hover:underline">
                Sudah punya akun? Masuk di sini
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeModal === "admin_panel") {
      container.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-overlay" onclick="window.app.closeModal()">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]" onclick="event.stopPropagation()">
            <!-- Header -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black font-jp text-base shadow-sm">
                  先
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-slate-900 dark:text-slate-100 font-jp leading-tight">
                    Panel Kontrol Sensei CBT IMM Japan
                  </h3>
                  <p class="text-[11px] text-slate-500">Live Monitor • Manajemen Siswa • Kontrol Kunci • Rekap Nilai</p>
                </div>
              </div>
              <button onclick="window.app.closeModal()" class="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 leading-none">&times;</button>
            </div>

            <!-- Navigation Tabs -->
            <div class="flex items-center gap-1.5 my-3 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 overflow-x-auto">
              <button data-tab="live" onclick="window.app.switchAdminTab('live')" class="admin-tab-btn px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 ${this.adminTab === 'live' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>Live Monitor</span>
              </button>
              <button data-tab="users" onclick="window.app.switchAdminTab('users')" class="admin-tab-btn px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 ${this.adminTab === 'users' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                <span>Manajemen Siswa</span>
              </button>
              <button data-tab="lock" onclick="window.app.switchAdminTab('lock')" class="admin-tab-btn px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 ${this.adminTab === 'lock' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                <span>Kontrol Ujian & Sakelar</span>
              </button>
              <button data-tab="results" onclick="window.app.switchAdminTab('results')" class="admin-tab-btn px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 ${this.adminTab === 'results' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                <span>Rekap Nilai & Ekspor CSV</span>
              </button>
              <button data-tab="pdfs" onclick="window.app.switchAdminTab('pdfs')" class="admin-tab-btn px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 ${this.adminTab === 'pdfs' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                <span>Bank Dokumen PDF</span>
              </button>
            </div>

            <!-- Dynamic Tab Content Pane -->
            <div id="admin-tab-content" class="flex-1 overflow-y-auto">
              <!-- Loaded dynamically via switchAdminTab -->
            </div>
          </div>
        </div>
      `;
    } else if (this.activeModal === "student_chapter_access") {
      const studentName = this.selectedStudentForAccess?.name || "Siswa";
      container.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-overlay" onclick="window.app.closeStudentChapterAccessModal()">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-5xl w-full p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh]" onclick="event.stopPropagation()">
            <!-- Header -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black font-jp text-base shadow-sm">
                  制
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-slate-900 dark:text-slate-100 font-jp leading-tight">
                    Pengaturan Hak Akses Bab: <span class="text-sky-600 dark:text-sky-400">${escapeHtml(studentName)}</span>
                  </h3>
                  <p class="text-[11px] text-slate-500">Atur izin ujian CBT tryout dan pembatasan bank dokumen PDF materi/kunci per siswa.</p>
                </div>
              </div>
              <button onclick="window.app.closeStudentChapterAccessModal()" class="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 leading-none">&times;</button>
            </div>

            <!-- Dual Tab Selector -->
            <div class="flex items-center gap-2 my-2.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onclick="window.app.switchStudentAccessTab('cbt')"
                class="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${this.studentAccessModalTab === 'cbt' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}"
              >
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                <span>Hak Akses Ujian CBT</span>
              </button>
              <button
                type="button"
                onclick="window.app.switchStudentAccessTab('pdf')"
                class="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${this.studentAccessModalTab === 'pdf' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}"
              >
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                <span>Hak Akses Dokumen PDF</span>
              </button>
            </div>

            <!-- Dynamic Grid Container -->
            <div id="student-access-grid-container" class="flex-1 overflow-y-auto">
              <!-- Loaded dynamically via renderStudentChapterAccessModalContent -->
            </div>

            <!-- Footer Buttons -->
            <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button type="button" onclick="window.app.closeStudentChapterAccessModal()" class="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                Batal
              </button>
              <button id="btn-save-chapter-access" type="button" onclick="window.app.saveStudentChapterAccess()" class="px-5 py-2 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition shadow-sm flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="17 21 17 13 7 13 7 21"/><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="7 3 7 8 15 8"/></svg>
                <span>Simpan</span>
              </button>
            </div>
          </div>
        </div>
      `;
      this.renderStudentChapterAccessModalContent();
    } else if (this.activeModal === "chapter_resources") {
      const num = this.selectedChapterForResources || "08";
      const chMeta = (typeof CHAPTERS_INDEX !== "undefined" ? CHAPTERS_INDEX : []).find((x) => x.num === num) || {
        num,
        title_ja: `第${parseInt(num, 10)}課`,
        title_id: `Bab ${num}`,
      };
      const resList = this.getChapterResources(num);
      const isRestricted = this.currentUser && this.currentUser.role !== "admin" && (!this.isUserPdfAccessAllowed || this.userRestrictedPdfs[num]);
      const rSoal = resList.find((r) => r.type === "reading_soal");
      const rKunci = resList.find((r) => r.type === "reading_kunci");
      const rKosa = resList.find((r) => r.type === "kosakata");
      const cSoal = resList.find((r) => r.type === "choukai_soal");
      const cKunci = resList.find((r) => r.type === "choukai_kunci");
      const cAudio = resList.find((r) => r.type === "choukai_audio");

      container.innerHTML = `
        <div id="modal-resources-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-overlay" onclick="window.app.closeModal()">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[90vh]" onclick="event.stopPropagation()">
            <!-- Header -->
            <div class="flex items-start justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black font-jp text-base shadow-sm">
                  文
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-base font-extrabold text-slate-900 dark:text-slate-100 font-jp leading-tight">
                      Materi & Dokumen Bab ${num}
                    </h3>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isRestricted ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'}">
                      ${isRestricted ? '<span class="inline-flex items-center gap-1"><svg class="w-3 h-3 text-rose-600 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>Dibatasi Pengawas</span>' : (cAudio ? '<span class="inline-flex items-center gap-1">5 Dokumen + <svg class="w-2.5 h-2.5 text-rose-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h2v5z"/></svg>Audio</span>' : '3 Dokumen PDF')}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    ${chMeta.title_ja} • ${chMeta.title_id}
                  </p>
                </div>
              </div>
              <button onclick="window.app.closeModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl font-bold p-1 leading-none transition" title="Tutup">&times;</button>
            </div>

            <!-- Content Area -->
            <div class="space-y-4 my-4 overflow-y-auto pr-1">
              ${isRestricted ? `
                <div class="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5">
                  <svg class="w-5 h-5 text-rose-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  <div>
                    <div class="font-bold">Akses Dokumen Bab Ini Sedang Dibatasi</div>
                    <div class="text-[11px] mt-0.5 text-rose-700 dark:text-rose-400">Pengawas/Sensei membatasi hak akses file PDF materi & kunci untuk akun Anda. Anda tetap dapat mengerjakan soal ujian tryout.</div>
                  </div>
                </div>
              ` : ""}

              <!-- Section 1: Listening Choukai (If available) -->
              ${cAudio ? `
                <div class="p-4 rounded-xl border border-sky-200 dark:border-sky-800/80 bg-sky-50/40 dark:bg-sky-950/20">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <span class="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h2v5z"/></svg></span>
                      <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        Choukai Listening Engine (Mendengarkan)
                      </h4>
                    </div>
                    <span class="text-[11px] font-mono text-slate-500">Bab ${num} MP3</span>
                  </div>

                  <!-- Mini Audio Player -->
                  <div class="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3 shadow-xs mb-3">
                    <div class="flex items-center gap-2.5">
                      <button
                        type="button"
                        data-src="${cAudio.url}"
                        onclick="window.app.toggleResourceAudio('${cAudio.url}', 'Audio Choukai Bab ${num}')"
                        class="btn-toggle-audio px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg> Putar Audio
                      </button>
                      <button type="button" onclick="window.app.seekResourceAudio(-10)" class="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold" title="Mundur 10 Detik">
                        <span class="inline-flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/></svg>-10s</span>
                      </button>
                      <button type="button" onclick="window.app.seekResourceAudio(10)" class="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold" title="Maju 10 Detik">
                        <span class="inline-flex items-center gap-1">+10s<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4zm8 0a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z"/></svg></span>
                      </button>
                    </div>
                    <div class="flex items-center gap-2">
                      <button id="ch-audio-rate-btn" type="button" onclick="window.app.cycleResourceAudioRate()" class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold font-mono" title="Ubah Kecepatan Suara">
                        ${this.resourceAudioPlaybackRate || 1.0}x
                      </button>
                    </div>
                  </div>

                  <!-- Choukai Documents -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div class="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <div class="text-xs font-bold text-slate-900 dark:text-slate-100">Soal Choukai PDF</div>
                        <div class="text-[10px] text-slate-500">Naskah soal bergambar listening</div>
                      </div>
                      ${isRestricted ? `<span class="text-xs text-rose-500 font-bold inline-flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>Terkunci</span>` : `
                        <a href="${cSoal.url}" target="_blank" class="px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 transition">
                          Buka &rarr;
                        </a>
                      `}
                    </div>
                    <div class="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <div class="text-xs font-bold text-slate-900 dark:text-slate-100">Kunci Choukai PDF</div>
                        <div class="text-[10px] text-slate-500">Kunci & transkrip audio lengkap</div>
                      </div>
                      ${isRestricted ? `<span class="text-xs text-rose-500 font-bold inline-flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>Terkunci</span>` : `
                        <a href="${cKunci.url}" target="_blank" class="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 transition">
                          Buka &rarr;
                        </a>
                      `}
                    </div>
                  </div>
                </div>
              ` : ""}

              <!-- Section 2: Reading & Kosakata Documents -->
              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
                  Dokumen Reading & Kosakata (読解・語彙)
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <!-- Soal Reading -->
                  <div class="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                    <div>
                      <div class="text-xs font-bold text-slate-900 dark:text-slate-100">Soal Reading PDF</div>
                      <div class="text-[10px] text-slate-500 mt-0.5">Lembar naskah soal bab</div>
                    </div>
                    <div class="mt-3">
                      ${isRestricted ? `<span class="text-xs text-rose-500 font-bold inline-flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>Terkunci</span>` : `
                        <a href="${rSoal.url}" target="_blank" class="w-full py-1.5 px-2.5 rounded-md bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 transition text-center block">
                          Buka Soal &rarr;
                        </a>
                      `}
                    </div>
                  </div>

                  <!-- Kunci Reading -->
                  <div class="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                    <div>
                      <div class="text-xs font-bold text-slate-900 dark:text-slate-100">Kunci Reading PDF</div>
                      <div class="text-[10px] text-slate-500 mt-0.5">Kunci jawaban & pembahasan</div>
                    </div>
                    <div class="mt-3">
                      ${isRestricted ? `<span class="text-xs text-rose-500 font-bold inline-flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>Terkunci</span>` : `
                        <a href="${rKunci.url}" target="_blank" class="w-full py-1.5 px-2.5 rounded-md bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 transition text-center block">
                          Buka Kunci &rarr;
                        </a>
                      `}
                    </div>
                  </div>

                  <!-- Kosakata Bab -->
                  <div class="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                    <div>
                      <div class="text-xs font-bold text-slate-900 dark:text-slate-100">Kosakata Bab PDF</div>
                      <div class="text-[10px] text-slate-500 mt-0.5">Lembar daftar kata bab ${num}</div>
                    </div>
                    <div class="mt-3">
                      ${isRestricted ? `<span class="text-xs text-rose-500 font-bold inline-flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>Terkunci</span>` : `
                        <a href="${rKosa.url}" target="_blank" class="w-full py-1.5 px-2.5 rounded-md bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 transition text-center block">
                          Buka Kosakata &rarr;
                        </a>
                      `}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button onclick="window.app.closeModal(); window.app.promptStartExam('${num}');" class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition shadow-xs flex items-center gap-1.5">
                <span>Mulai Ujian Bab ${num}</span>
                <span>&rarr;</span>
              </button>
              <button onclick="window.app.closeModal()" class="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg transition">
                Tutup
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeModal === "pdf_library") {
      const isMasterRestricted = this.currentUser && this.currentUser.role !== "admin" && !this.isUserPdfAccessAllowed;
      container.innerHTML = `
        <div id="modal-pdf-library-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-overlay" onclick="window.app.closeModal()">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-5xl w-full p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[92vh]" onclick="event.stopPropagation()">
            <!-- Header -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black font-jp text-lg shadow-sm">
                  書
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-base font-extrabold text-slate-900 dark:text-slate-100 font-jp leading-tight">
                      Bank Dokumen PDF & Audio Listening IMM Japan
                    </h3>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                      112 PDF • 18 Track Audio
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Pusat repositori seluruh lembar soal, kunci jawaban, setoran kosakata, dan rekaman listening bab 01 s.d. 25.
                  </p>
                </div>
              </div>
              <button onclick="window.app.closeModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl font-bold p-1 leading-none transition" title="Tutup">&times;</button>
            </div>

            <!-- Master Restriction Alert (If applicable) -->
            ${isMasterRestricted ? `
              <div class="my-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                <svg class="w-4 h-4 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <span>Akses seluruh bank dokumen PDF sedang dinonaktifkan khusus untuk akun Anda oleh Sensei/Pengawas.</span>
              </div>
            ` : ""}

            <!-- Search & Filter Controls -->
            <div class="my-3 space-y-2.5">
              <div class="flex flex-wrap items-center justify-between gap-2.5">
                <!-- Search Box -->
                <div class="flex-1 min-w-[240px] relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </span>
                  <input
                    id="pdf-lib-search-input"
                    type="text"
                    value="${this.pdfLibrarySearchQuery || ''}"
                    placeholder="Cari dokumen, bab, atau materi (contoh: Bab 08, Kosakata, Choukai)..."
                    oninput="window.app.filterPdfLibrary(this.value)"
                    class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                </div>

                <!-- Master Bundle Quick Link -->
                <div>
                  <a
                    href="${this.pdfUrl('assets/pdf/Daftar Kosakata Lengkap Bab 01-25.pdf')}"
                    target="_blank"
                    class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    title="Unduh 76 Halaman Setoran Kosakata Bab 01-25"
                  >
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
                    Master Kosakata (76 Hal)
                  </a>
                </div>
              </div>

              <!-- Filter Category Chips -->
              <div class="flex flex-wrap items-center gap-1.5">
                <button data-type="all" onclick="window.app.setPdfLibraryFilterType('all')" class="pdf-lib-filter-chip px-3 py-1.5 rounded-lg text-xs font-bold ${this.pdfLibraryFilterType === 'all' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'} transition">
                  Semua Dokumen (112 File)
                </button>
                <button data-type="reading" onclick="window.app.setPdfLibraryFilterType('reading')" class="pdf-lib-filter-chip px-3 py-1.5 rounded-lg text-xs font-bold ${this.pdfLibraryFilterType === 'reading' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'} transition">
                  <span class="inline-flex items-center gap-1.5"><svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg><span>Soal & Kunci Reading (50 PDF)</span></span>
                </button>
                <button data-type="choukai" onclick="window.app.setPdfLibraryFilterType('choukai')" class="pdf-lib-filter-chip px-3 py-1.5 rounded-lg text-xs font-bold ${this.pdfLibraryFilterType === 'choukai' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'} transition">
                  <span class="inline-flex items-center gap-1.5"><svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h2v5z"/></svg><span>Soal & Kunci Choukai (36 PDF)</span></span>
                </button>
                <button data-type="kosakata" onclick="window.app.setPdfLibraryFilterType('kosakata')" class="pdf-lib-filter-chip px-3 py-1.5 rounded-lg text-xs font-bold ${this.pdfLibraryFilterType === 'kosakata' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'} transition">
                  <span class="inline-flex items-center gap-1.5"><svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg><span>Daftar Kosakata (26 PDF)</span></span>
                </button>
                <button data-type="audio" onclick="window.app.setPdfLibraryFilterType('audio')" class="pdf-lib-filter-chip px-3 py-1.5 rounded-lg text-xs font-bold ${this.pdfLibraryFilterType === 'audio' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'} transition">
                  <span class="inline-flex items-center gap-1.5"><svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg><span>Rekaman Audio Listening (18 MP3)</span></span>
                </button>
              </div>
            </div>

            <!-- Dynamic Grid Container -->
            <div id="pdf-library-grid" class="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pr-1 py-1">
              <!-- Loaded dynamically via renderPdfLibraryContent -->
            </div>

            <!-- Floating Active Audio Player Bar -->
            <div id="active-audio-bar" class="hidden mt-3 p-2.5 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-3 shadow-lg border border-slate-800 text-xs">
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white shrink-0"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h2v5z"/></svg></span>
                <div class="min-w-0">
                  <div id="res-audio-bar-title" class="font-bold truncate text-xs text-white">Audio Listening</div>
                  <div id="res-audio-bar-time" class="text-[10px] text-slate-400 font-mono">00:00 / 00:00</div>
                </div>
              </div>
              <div class="flex items-center gap-1.5">
                <button type="button" onclick="window.app.seekResourceAudio(-10)" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold" title="Mundur 10s"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/></svg></button>
                <button id="res-audio-bar-play-btn" type="button" onclick="window.app.toggleResourceAudio(window.app.resourceAudioTrack)" class="px-3 py-1 rounded bg-sky-600 hover:bg-sky-700 text-xs font-bold"><span class="inline-flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg>Putar</span></button>
                <button type="button" onclick="window.app.seekResourceAudio(10)" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold" title="Maju 10s"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4zm8 0a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z"/></svg></button>
                <button id="res-audio-rate-btn" type="button" onclick="window.app.cycleResourceAudioRate()" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold font-mono">1.0x</button>
              </div>
            </div>

            <!-- Footer -->
            <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Total 112 File PDF + 18 Track Audio Tersedia</span>
              <button onclick="window.app.closeModal()" class="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg transition">
                Tutup
              </button>
            </div>
          </div>
        </div>
      `;
      this.renderPdfLibraryContent();
      this.updateResourceAudioUI();
    } else if (this.activeModal === "confirm_submit") {
      const answeredCount = Object.keys(this.answers).length;
      const totalCount = this.currentChapter.questions.length;
      const unAnswered = totalCount - answeredCount;

      container.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" onclick="window.app.closeModal()">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-5 shadow-2xl text-center" onclick="event.stopPropagation()">
            <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
              Kumpulkan Lembar Jawaban?
            </h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 mb-4">
              Anda telah menjawab <strong>${answeredCount} dari ${totalCount}</strong> butir soal.
              ${unAnswered > 0 ? `<br><span class="text-rose-600 font-semibold">Perhatian: Masih ada ${unAnswered} soal belum dijawab!</span>` : ""}
            </p>
            <div class="flex items-center justify-center gap-2">
              <button onclick="window.app.closeModal()" class="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                Periksa Lagi
              </button>
              <button onclick="window.app.closeModal(); window.app.submitExam();" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition shadow-sm">
                Ya, Kumpulkan
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeModal === "image_zoom") {
      container.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay cursor-zoom-out" onclick="window.app.closeModal()">
          <div class="max-w-4xl w-full bg-white dark:bg-slate-900 p-2 rounded-xl shadow-2xl" onclick="event.stopPropagation()">
            <div class="flex justify-between items-center mb-2 px-2">
              <span class="text-xs font-bold text-slate-600 dark:text-slate-400">Pembesaran Gambar Soal</span>
              <button onclick="window.app.closeModal()" class="text-slate-400 hover:text-slate-600 text-sm font-bold">&times;</button>
            </div>
            <img src="${this.modalData}" alt="Zoom" class="w-full max-h-[80vh] object-contain rounded">
          </div>
        </div>
      `;
    } else if (this.activeModal === "mode_select") {
      const rawCh = typeof this.modalData === "object" && this.modalData?.chapter ? this.modalData.chapter : this.modalData;
      const chNum = String(rawCh || "08").padStart(2, "0");
      const chData = typeof CHAPTERS_DATA !== "undefined" ? CHAPTERS_DATA[chNum] : null;
      const chTitle = chData?.title_ja || `第${parseInt(chNum, 10)}課`;
      const chTitleId = chData?.title_id || `Bab ${chNum}`;
      const totalQ = chData?.questions?.length || (parseInt(chNum, 10) >= 8 ? 33 : 25);
      const hasChoukai = chData?.questions ? chData.questions.some(q => q.session === "choukai") : (parseInt(chNum, 10) >= 8);
      const timerMinutes = hasChoukai ? 60 : 50;

      container.innerHTML = `
        <div id="modal-mode-select-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" onclick="window.app.closeModal()">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative" onclick="event.stopPropagation()">
            <!-- Header -->
            <div class="flex items-start justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black font-jp text-base shadow-sm">
                  試
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-slate-900 dark:text-slate-100 font-jp leading-tight">
                    Pilih Mode Ujian ｜ Bab ${chNum}
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    ${chTitle} • ${chTitleId} (${totalQ} Butir Soal)
                  </p>
                </div>
              </div>
              <button onclick="window.app.closeModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl font-bold p-1 leading-none transition" title="Batal">&times;</button>
            </div>

            <!-- Mode Selection Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4">
              <!-- Mode Latihan (Renshuu) -->
              <div id="modal-opt-renshuu" role="button" tabindex="0" onclick="window.app.selectExamMode('${chNum}', 'renshuu');" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); window.app.selectExamMode('${chNum}', 'renshuu');}" class="group relative p-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-sky-50/50 dark:hover:bg-sky-950/40 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all cursor-pointer shadow-xs hover:shadow-md text-left flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold font-jp bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                      <span class="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                      練習 Latihan
                    </span>
                    <span class="text-[11px] font-medium text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
                      <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      <span>Bebas Waktu</span>
                    </span>
                  </div>
                  <h4 class="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                    Mode Latihan (練習)
                  </h4>
                  <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Tanpa hitung mundur waktu (bebas waktu), fokus pemahaman materi & latihan mandiri.
                  </p>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
                  <span>Mulai Latihan</span>
                  <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>

              <!-- Mode Simulasi CBT (Shiken) -->
              <div id="modal-opt-shiken" role="button" tabindex="0" onclick="window.app.selectExamMode('${chNum}', 'shiken');" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); window.app.selectExamMode('${chNum}', 'shiken');}" class="group relative p-4 rounded-xl border-2 border-rose-200 dark:border-rose-900/60 hover:border-rose-500 dark:hover:border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50/80 dark:hover:bg-rose-950/50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all cursor-pointer shadow-xs hover:shadow-md text-left flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold font-jp bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                      試験 Ujian CBT
                    </span>
                    <span class="text-[11px] font-bold font-mono text-rose-600 dark:text-rose-400 inline-flex items-center gap-1">
                      <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      <span>${timerMinutes} Menit</span>
                    </span>
                  </div>
                  <h4 class="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition">
                    Mode Simulasi CBT (試験)
                  </h4>
                  <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Timer resmi berjalan mundur (${timerMinutes} menit — 50 menit Bab 01–07, 60 menit Bab 08–25), otomatis submit saat waktu habis, simulasi ketat standar IMM Japan.
                  </p>
                </div>
                <div class="mt-4 pt-3 border-t border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
                  <span>Mulai Simulasi CBT</span>
                  <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            </div>

            <!-- Footer / Cancel -->
            <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span class="text-slate-400 text-[11px]">Tekan <kbd class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">Esc</kbd> untuk membatalkan</span>
              <button id="modal-mode-cancel-btn" onclick="window.app.closeModal()" class="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg transition">
                Batal
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new ChoukaiApp();
});
