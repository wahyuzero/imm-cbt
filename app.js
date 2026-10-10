/**
 * IMM JAPAN CBT PLATFORM ENGINE
 * Paket Tryout Terpadu: Sesi 1 Reading (25 Soal) & Sesi 2 Choukai (8 Soal) — Total 33 Soal
 * Format Terstandarisasi untuk Calon Pemagang IMM Japan & SSW Tokutei Ginou.
 * Zero-dependency, client-side state in localStorage, reactive Vanilla JS.
 */

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

    this.init();
  }

  static get VERSION() {
    return "48";
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
    this.updateAppGateUI();
    this.render();

    // Check backend session and system status
    await this.checkAuthSession();
    await this.fetchSystemStatus();

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
    const babMatch = hash.match(/^#bab-(\d{1,2})$/);
    const resultMatch = hash.match(/^#result-(\d{1,2})$/);
    const kosakataMatch = hash.match(/^#kosakata(?:-(\d{1,2}|all))?$/);

    if (babMatch) {
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
    const km = h.match(/^#kosakata(?:-(\d{1,2}|all))?$/);
    const bm = h.match(/^#bab-(\d{1,2})$/);
    const rm = h.match(/^#result-(\d{1,2})$/);

    if (bm) {
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
  loadProfile() {
    try {
      const data = localStorage.getItem("choukai_student_profile");
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
      localStorage.setItem("choukai_student_profile", JSON.stringify(this.profile));
    } catch (e) {
      console.warn("Gagal menyimpan profil siswa ke localStorage:", e);
    }
    this.closeModal();
    this.render();
  }

  loadProgress() {
    try {
      const data = localStorage.getItem("choukai_progress");
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
    };
    try {
      localStorage.setItem("choukai_progress", JSON.stringify(this.progress));
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
      const data = localStorage.getItem("choukai_memorized_words");
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
      localStorage.setItem("choukai_memorized_words", JSON.stringify(this.memorizedWords));
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
  startExam(chapterDataOrNum, mode = "renshuu") {
    let chapterData = chapterDataOrNum;
    let chNum = typeof chapterDataOrNum === "string" ? chapterDataOrNum : (chapterDataOrNum?.chapter || "08");
    if (typeof chapterDataOrNum === "string" && typeof CHAPTERS_DATA !== "undefined") {
      chapterData = CHAPTERS_DATA[chapterDataOrNum] || chapterData;
    }
    if (!chapterData && typeof BAB_08_DATA !== "undefined") {
      chapterData = BAB_08_DATA;
      chNum = "08";
    }

    chNum = String(chNum).padStart(2, "0");

    if (!this.isAuthenticated) {
      this.targetHash = `#bab-${chNum}`;
      this.view = "auth_gate";
      this.updateAppGateUI();
      this.render();
      return;
    }

    // Guard against locked chapters for students
    if (this.currentUser && this.currentUser.role !== "admin") {
      if (this.systemStatus?.globalExamLock) {
        alert("Ujian sedang dikunci secara global oleh Sensei. Hubungi pengawas ujian.");
        return;
      }
      if (this.chaptersStatus[chNum] === false) {
        alert(`Bab ${chNum} sedang dikunci oleh Sensei. Hubungi pengawas ujian.`);
        return;
      }
    }

    this.currentChapter = chapterData;
    this.currentQuestionIdx = 0;
    this.answers = {};
    this.mode = mode;
    this.view = "exam";

    this.pauseAudio();
    this.loadQuestionAudio(0);

    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.mode === "shiken") {
      const hasChoukai = this.currentChapter.questions.some((q) => q.session === "choukai");
      this.timerSeconds = hasChoukai ? 3600 : 3000; // 50 menit (3000s) untuk Bab 1-7, 60 menit (3600s) untuk Bab 8
      this.startTimer();
      const q = this.getCurrentQuestion();
      if (q && q.session === "choukai") {
        this.playAudio();
      }
    }

    this.render();

    // Start server session if authenticated on http
    if (this.currentUser && window.location.protocol.startsWith("http")) {
      fetch("/api/v1/exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterNum: chNum, mode }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data?.session) {
            this.currentExamSession = json.data.session;
          } else if (!json.success && this.currentUser.role !== "admin") {
            alert(json.error || "Gagal memulai sesi ujian di server.");
            this.goToDashboard();
          }
        })
        .catch((e) => console.warn("Server exam session init warning:", e));
    } else {
      this.currentExamSession = null;
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
    if (this.currentExamSession && window.location.protocol.startsWith("http")) {
      const chNum = String(this.currentChapter?.chapter || "08").padStart(2, "0");
      const dbQId = `q_${chNum}_${String(questionId).padStart(2, "0")}`;
      fetch("/api/v1/exam/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: this.currentExamSession.id,
          questionId: dbQId,
          selectedOption: optionId,
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            if (errData.error && errData.error.includes("TERMINATED_BY_ADMIN")) {
              alert("Ujian telah dihentikan & dikumpulkan oleh Sensei/Pengawas.");
              this.submitExam();
            }
          }
        })
        .catch((e) => console.warn("Auto-save network error:", e));
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

    const result = {
      chapter: this.currentChapter.chapter,
      score: totalScore,
      readingScore,
      choukaiScore,
      readingCorrect,
      readingTotal,
      choukaiCorrect,
      choukaiTotal,
      correctCount: readingCorrect + choukaiCorrect,
      totalCount: questions.length,
      answers: { ...this.answers },
      mode: this.mode,
      passed,
    };

    this.saveExamResult(result);
    this.currentResult = result;
    this.view = "result";
    this.render();

    // Server-authoritative submit if exam session active
    if (this.currentExamSession && window.location.protocol.startsWith("http")) {
      const activeSessionId = this.currentExamSession.id;
      this.currentExamSession = null;
      fetch("/api/v1/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeSessionId }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            this.currentResult.score = json.data.totalScore;
            this.currentResult.readingScore = json.data.readingScore;
            this.currentResult.choukaiScore = json.data.choukaiScore;
            this.currentResult.passed = json.data.isPassed;
            this.saveExamResult(this.currentResult);
            if (this.view === "result") this.render();
          }
        })
        .catch((e) => console.warn("Backend submit error:", e));
    }
  }

  // ==========================================
  // WHATSAPP REPORT FORMATTER
  // ==========================================
  shareResultWhatsApp() {
    if (!this.currentResult) return;
    const r = this.currentResult;
    const qList = this.currentChapter.questions;

    const dateStr = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const hasChoukai = (r.choukaiTotal || 0) > 0;
    let itemsStr = "";
    qList.forEach((q) => {
      const isCorrect = r.answers[q.id] === q.correctAnswer;
      const mark = isCorrect ? "✅ [BENAR]" : "❌ [SALAH]";
      const userAns = r.answers[q.id] ? `Opsi ${r.answers[q.id]}` : "Tidak dijawab";
      const sessionTag = hasChoukai ? ((q.session === "reading" || q.id <= 25) ? "[Reading] " : "[Choukai] ") : "";
      itemsStr += `• ${sessionTag}Soal ${q.id}: ${mark} (Pilihan: ${userAns} | Kunci: ${q.correctAnswer})\n`;
    });

    const statusBadge = r.passed ? "LULUS (合格) 🎉" : "REMEDIAL / BELUM LULUS (再試) ⚠️";
    const modeText = r.mode === "shiken" ? "Simulasi CBT" : "Latihan Mandiri";

    let headerTitle = "";
    let scoreSection = "";
    if (hasChoukai) {
      headerTitle = `🎌 *LAPORAN EVALUASI IMM JAPAN (TRYOUT TERPADU)*\n`;
      scoreSection =
        `📖 *Skor Reading (読解):* *${r.readingScore.toFixed(1)} / 100* (${r.readingCorrect}/${r.readingTotal} Benar)\n` +
        `🎧 *Skor Choukai (聴解):* *${r.choukaiScore.toFixed(1)} / 100* (${r.choukaiCorrect}/${r.choukaiTotal} Benar)\n` +
        `📊 *Skor Akhir Tryout:* *${r.score.toFixed(1)} / 100*\n`;
    } else {
      headerTitle = `🎌 *LAPORAN EVALUASI IMM JAPAN (UJIAN TULIS)*\n`;
      scoreSection =
        `📖 *Skor Ujian Tulis (Reading):* *${r.readingScore.toFixed(1)} / 100* (${r.readingCorrect}/${r.readingTotal} Benar • Bobot 4.0 Poin/Soal)\n` +
        `📊 *Skor Akhir:* *${r.score.toFixed(1)} / 100*\n`;
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
      `*Rincian Hasil Pengerjaan (${r.totalCount} Soal):*\n` +
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
    if (!this.isAuthenticated && modalName === "onboarding") {
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
    const uEl = document.getElementById("gate-login-username");
    const pEl = document.getElementById("gate-login-pin");
    if (uEl) uEl.value = username;
    if (pEl) pEl.value = pin;
    return this.login(username, pin, "gate-login-error");
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
              <span class="text-xs">📢</span>
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
              <div class="flex-1 py-2 text-center text-[10px] text-slate-400 font-medium cursor-not-allowed" title="Pendaftaran mandiri dinonaktifkan oleh Sensei">
                🔒 Registrasi Ditutup
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
                  <input id="gate-login-username" type="text" required placeholder="misal: ahmad.syahroni" autocomplete="username" class="w-full pl-8 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono shadow-2xs">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  PIN / Password (6-Digit):
                </label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">🔑</span>
                  <input id="gate-login-pin" type="password" required placeholder="PIN atau Password" autocomplete="current-password" class="w-full pl-8 pr-10 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono shadow-2xs">
                  <button type="button" onclick="window.app.toggleGatePinVisibility()" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs" title="Tampilkan / Sembunyikan PIN">👁️</button>
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

            <!-- Quick Demo Accounts (Akses Cepat Pengujian) -->
            <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Akses Cepat Akun Demo:</span>
                <span class="text-[10px] text-slate-400 font-mono">PIN: 123456</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <button type="button" id="gate-btn-demo-student" onclick="window.app.fillAndLogin('ahmad.syahroni', '123456')" class="p-2.5 rounded-xl border border-sky-200 dark:border-sky-900 bg-sky-50/70 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-900 dark:text-sky-200 text-left transition group">
                  <div class="flex items-center gap-1.5">
                    <span class="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">学</span>
                    <span class="text-xs font-bold">Siswa Demo</span>
                  </div>
                  <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">ahmad.syahroni</div>
                </button>
                <button type="button" id="gate-btn-demo-sensei" onclick="window.app.fillAndLogin('sensei.wahyu', '123456')" class="p-2.5 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/70 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-left transition group">
                  <div class="flex items-center gap-1.5">
                    <span class="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold font-jp">先</span>
                    <span class="text-xs font-bold">Sensei Admin</span>
                  </div>
                  <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">sensei.wahyu</div>
                </button>
              </div>
            </div>
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
                <input id="gate-reg-pin" type="password" required placeholder="Contoh: 123456" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500">
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
              <span>🔒</span>
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
        totalScoreSum += prog.score;
      }

      const scoreBadge = isCompleted
        ? `<span class="px-2 py-0.5 rounded text-xs font-bold ${prog.passed ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400" : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400"}">${prog.score.toFixed(0)} Poin</span>`
        : "";

      const chData = typeof CHAPTERS_DATA !== "undefined" ? CHAPTERS_DATA[ch.num] : null;
      const pdfReadingSoal = this.pdfUrl(chData ? chData.pdfReadingSoalUrl : `assets/pdf/Salinan Soal Bab ${ch.num}.pdf`);
      const pdfReadingKunci = this.pdfUrl(chData ? chData.pdfReadingKunciUrl : `assets/pdf/Kunci dan Pembahasan Bab ${ch.num}.pdf`);

      const isLockedBySensei = Boolean(this.currentUser && this.currentUser.role !== "admin" && (this.systemStatus?.globalExamLock || this.chaptersStatus[ch.num] === false));

      const actionButton = !ch.available
        ? `<button disabled class="w-full mt-3 py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-md text-xs font-semibold cursor-not-allowed">
            Terkunci (Segera Hadir)
          </button>`
        : (isLockedBySensei
            ? `<div class="grid grid-cols-5 gap-1.5 mt-3">
                <button disabled class="col-span-4 py-2 px-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-md text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1" title="Bab ini sedang dikunci oleh Pengawas">
                  🔒 Terkunci Sensei
                </button>
                <button onclick="window.app.goToKosakata('${ch.num}')" class="col-span-1 py-2 px-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-md text-xs font-bold font-jp transition flex items-center justify-center shadow-xs" title="Buka Hafalan Kosakata Bab ${ch.num}">
                  語
                </button>
              </div>`
            : (isCompleted
                ? `<div class="grid grid-cols-5 gap-1.5 mt-3">
                    <button onclick="window.app.viewSavedResult('${ch.num}')" class="col-span-2 py-2 px-1 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-md text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs" title="Lihat hasil & pembahasan tryout sebelumnya">
                      Hasil
                    </button>
                    <button onclick="window.app.startExam('${ch.num}', 'renshuu')" class="col-span-2 py-2 px-1 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm" title="Ulangi tryout bab ini">
                      Ulangi
                    </button>
                    <button onclick="window.app.goToKosakata('${ch.num}')" class="col-span-1 py-2 px-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-md text-xs font-bold font-jp transition flex items-center justify-center shadow-xs" title="Buka Hafalan Kosakata Bab ${ch.num}">
                      語
                    </button>
                  </div>`
                : `<div class="grid grid-cols-5 gap-1.5 mt-3">
                    <button onclick="window.app.startExam('${ch.num}', 'renshuu')" class="col-span-4 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>
                      Mulai Bab ${ch.num}
                    </button>
                    <button onclick="window.app.goToKosakata('${ch.num}')" class="col-span-1 py-2 px-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-md text-xs font-bold font-jp transition flex items-center justify-center shadow-xs" title="Buka Hafalan Kosakata Bab ${ch.num}">
                      語
                    </button>
                  </div>`));

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
        <div class="border ${ch.available ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm" : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-75"} rounded-lg p-4 flex flex-col justify-between transition hover:border-sky-500">
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold font-jp ${ch.available ? "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}">
                BAB ${ch.num}
              </span>
              <div class="flex items-center gap-1.5">
                ${scoreBadge}
                <span class="text-[10px] text-slate-400 font-mono">${ch.totalQuestions || 33} Soal</span>
              </div>
            </div>
            <h3 class="font-jp font-bold text-sm text-slate-900 dark:text-slate-100 mb-1 leading-snug">${ch.title_ja}</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 mb-2">${ch.title_id}</p>
          </div>
          <div>
            ${actionButton}
            ${pdfCardLinks}
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
            <button onclick="window.app.goToKosakata('01')" class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition flex items-center gap-1 shadow-sm" title="Buka Modul Hafalan Kosakata Interaktif">
              <span class="font-jp">語</span>
              Hafalan Kosakata (1.500 Kata)
            </button>
            <a href="${this.pdfUrl('assets/pdf/Daftar Kosakata Lengkap Bab 01-25.pdf')}" target="_blank" class="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 rounded text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1 shadow-sm" title="Unduh Lembar Setoran Lengkap Bab 01-25 (76 Halaman)">
              <svg class="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Bundle Kosakata (76 Hal)
            </a>
            <a href="${this.pdfUrl(BAB_08_DATA.pdfReadingSoalUrl || 'assets/pdf/Salinan Soal Bab 08.pdf')}" target="_blank" class="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium hover:bg-slate-50 transition flex items-center gap-1 shadow-sm">
              <svg class="w-3.5 h-3.5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Soal Reading PDF
            </a>
            <a href="${this.pdfUrl(BAB_08_DATA.pdfReadingKunciUrl || 'assets/pdf/Kunci dan Pembahasan Bab 08.pdf')}" target="_blank" class="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium hover:bg-slate-50 transition flex items-center gap-1 shadow-sm">
              <svg class="w-3.5 h-3.5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Kunci Reading PDF
            </a>
            <a href="${this.pdfUrl(BAB_08_DATA.pdfSoalUrl || 'assets/pdf/Soal Choukai Bab 08.pdf')}" target="_blank" class="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium hover:bg-slate-50 transition flex items-center gap-1 shadow-sm">
              <svg class="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Soal Choukai PDF
            </a>
            <a href="${this.pdfUrl(BAB_08_DATA.pdfKunciUrl || 'assets/pdf/Kunci dan Pembahasan Choukai Bab 08.pdf')}" target="_blank" class="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium hover:bg-slate-50 transition flex items-center gap-1 shadow-sm">
              <svg class="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Kunci Choukai PDF
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
          <div class="flex items-center gap-3">
            <!-- Mode Switcher -->
            <div class="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md flex items-center text-xs font-semibold">
              <button onclick="window.app.startExam(window.app.currentChapter, 'renshuu')" class="px-2.5 py-1 rounded transition ${this.mode === "renshuu" ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm font-bold" : "text-slate-500"}">
                Latihan (練習)
              </button>
              <button onclick="window.app.startExam(window.app.currentChapter, 'shiken')" class="px-2.5 py-1 rounded transition ${this.mode === "shiken" ? "bg-rose-600 text-white shadow-sm font-bold" : "text-slate-500"}">
                Simulasi CBT (試験)
              </button>
            </div>

            <!-- Timer (if Mode Shiken) -->
            ${
              this.mode === "shiken"
                ? `<div class="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 px-2.5 py-1 rounded text-xs font-mono font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span id="exam-timer-display">${this.currentChapter.questions.some(item => item.session === "choukai") ? "60:00" : "50:00"}</span>
                  </div>`
                : ""
            }

            <!-- Furigana Toggle -->
            <button id="furigana-toggle-btn" onclick="window.app.toggleFurigana()" class="px-2 py-1 border border-slate-300 dark:border-slate-700 rounded text-xs font-jp text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800" title="Toggle Furigana / Kana Display">
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
                <span>📖 Sesi 1: Reading</span>
                <span class="text-[10px] font-mono px-1 py-0.2 rounded ${currentSession === 'reading' ? 'bg-sky-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}">${readingAnswered}/${readingQuestions.length}</span>
              </button>
              <button onclick="window.app.goToSession('choukai')" class="px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 ${currentSession === 'choukai' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                <span>🎧 Sesi 2: Choukai</span>
                <span class="text-[10px] font-mono px-1 py-0.2 rounded ${currentSession === 'choukai' ? 'bg-sky-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}">${choukaiAnswered}/${choukaiQuestions.length}</span>
              </button>
            ` : `
              <div class="px-2.5 py-1 rounded text-xs font-bold bg-sky-600 text-white shadow-xs flex items-center gap-1.5">
                <span>📖 Ujian Tulis (Reading)</span>
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
        <button onclick="window.app.selectOption(${q.id}, '${opt.id}')" class="option-btn ${btnState} p-3.5 rounded-lg flex items-start gap-3 w-full">
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
    const qList = this.currentChapter.questions;

    const wrongQuestions = qList.filter((q) => r.answers[q.id] !== q.correctAnswer);
    const correctQuestions = qList.filter((q) => r.answers[q.id] === q.correctAnswer);

    const renderCard = (q, isCorrect) => {
      const userAns = r.answers[q.id];
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
                tag = `<span class="ml-auto text-[10px] text-emerald-700 dark:text-emerald-300 font-bold font-mono">✓ Kunci</span>`;
              } else if (isSelected && !isCorrect) {
                optBorder = "border-rose-300 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-semibold";
                badgeColor = "bg-rose-600 text-white";
                tag = `<span class="ml-auto text-[10px] text-rose-700 dark:text-rose-300 font-bold font-mono">✕ Pilihan Anda</span>`;
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
                <span>📄 Transkrip Percakapan Lengkap & Terjemahan</span>
                <span class="text-[10px] text-slate-400">Klik untuk buka/tutup</span>
              </summary>
              <div class="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5">
                ${dialogueScriptHTML}
              </div>
            </details>
          ` : ""}

          ${q.translation ? `
            <div class="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 mb-2.5">
              <span class="font-bold text-slate-700 dark:text-slate-300">🇮🇩 Terjemahan Konteks:</span> ${q.translation}
            </div>
          ` : ""}

          <!-- Explanation notes -->
          <div class="space-y-2 text-xs">
            <div class="bg-white dark:bg-slate-800/90 p-3 rounded-lg border ${isCorrect ? "border-emerald-100 dark:border-emerald-950" : "border-rose-100 dark:border-rose-950"} text-slate-700 dark:text-slate-200">
              <strong class="${isCorrect ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"} block mb-1">
                ${isCorrect ? "💡 Analisis Mengapa Jawaban Anda Tepat:" : "⚠️ Bedah Kesalahan & Jebakan Logika:"}
              </strong>
              <p class="leading-relaxed">${q.explanation.logic}</p>
            </div>

            ${!isCorrect && q.explanation.distractor ? `
            <div class="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200">
              <strong class="text-amber-800 dark:text-amber-300 block mb-1">⚠️ Jebakan Distraktor Pengecoh:</strong>
              <div class="whitespace-pre-line leading-relaxed text-[11.5px]">${q.explanation.distractor}</div>
            </div>
            ` : ""}

            ${q.explanation.grammarRule ? `
            <div class="bg-sky-50 dark:bg-sky-950/40 p-3 rounded-lg border border-sky-200 dark:border-sky-900 text-sky-900 dark:text-sky-200">
              <strong class="block mb-1">📘 Poin Kaidah Bab ${this.currentChapter.chapter}:</strong>
              <p class="leading-relaxed text-[11.5px]">${q.explanation.grammarRule}</p>
            </div>
            ` : ""}
          </div>
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
            ${r.score.toFixed(1)} <span class="text-lg text-slate-400 font-normal">/ 100</span>
          </div>
          <p class="text-xs text-slate-500 mb-4">
            Total Benar: ${r.correctCount} dari ${r.totalCount} Soal &bull; Passing Grade: 80.0
          </p>

          <!-- Score Breakdown Badges -->
          ${r.choukaiTotal > 0 ? `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left mb-4">
              <div class="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60">
                <div class="text-[11px] text-indigo-700 dark:text-indigo-400 font-bold uppercase font-mono">📖 Sesi 1: Reading (読解)</div>
                <div class="text-xl font-black font-mono text-indigo-900 dark:text-indigo-200 mt-0.5">
                  ${r.readingScore.toFixed(1)} <span class="text-xs font-normal text-slate-500">/ 100</span>
                </div>
                <div class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  ${r.readingCorrect} dari ${r.readingTotal} Soal Benar
                </div>
              </div>
              <div class="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60">
                <div class="text-[11px] text-sky-700 dark:text-sky-400 font-bold uppercase font-mono">🎧 Sesi 2: Choukai (聴解)</div>
                <div class="text-xl font-black font-mono text-sky-900 dark:text-sky-200 mt-0.5">
                  ${r.choukaiScore.toFixed(1)} <span class="text-xs font-normal text-slate-500">/ 100</span>
                </div>
                <div class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  ${r.choukaiCorrect} dari ${r.choukaiTotal} Soal Benar
                </div>
              </div>
            </div>
          ` : `
            <div class="p-3.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 max-w-sm mx-auto text-center mb-4">
              <div class="text-[11px] text-indigo-700 dark:text-indigo-400 font-bold uppercase font-mono">📖 Ujian Tulis: Reading (読解)</div>
              <div class="text-2xl font-black font-mono text-indigo-900 dark:text-indigo-200 mt-0.5">
                ${r.readingScore.toFixed(1)} <span class="text-xs font-normal text-slate-500">/ 100</span>
              </div>
              <div class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                ${r.readingCorrect} dari ${r.readingTotal} Soal Benar (Bobot 4.0 Poin / Soal)
              </div>
            </div>
          `}

          <!-- WhatsApp Share & Actions -->
          <div class="flex flex-wrap items-center justify-center gap-2.5 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
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
            <button onclick="window.app.startExam(window.app.currentChapter, 'renshuu')" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition">
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
            <span class="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-sm">
              ⚠️
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

          ${wrongQuestions.length > 0
            ? wrongQuestions.map((q) => renderCard(q, false)).join("")
            : `
            <div class="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-6 text-center text-emerald-800 dark:text-emerald-200 shadow-xs">
              <div class="text-3xl mb-1.5">🎉</div>
              <h4 class="font-bold text-sm">Luar Biasa! Sempurna (100 / 100)</h4>
              <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">${(r.choukaiTotal || 0) > 0 ? `Seluruh ${r.totalCount} butir soal (Reading & Choukai) berhasil Anda kuasai dengan tepat.` : `Seluruh ${r.totalCount} butir soal (Reading) berhasil Anda kuasai dengan tepat.`}</p>
            </div>
            `
          }
        </div>

        <!-- Bagian 2: Soal Benar (Terpisah di Bawah) -->
        <div>
          <div class="flex items-center gap-2.5 mb-4 p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60">
            <span class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-sm">
              ✓
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
        for (let b = 1; b <= 25; b++) {
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
      for (let b = 1; b <= 25; b++) {
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
      localStorage.setItem("choukai_memorized_words", JSON.stringify(this.memorizedWords));
    } catch (e) {}
    this.refreshKosakataGrid();
  }

  renderKosakataCardsHTML(words) {
    if (!words || words.length === 0) {
      return `
        <div class="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center shadow-xs">
          <div class="text-3xl mb-2">🔍</div>
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

    const pdfBabUrl = this.pdfUrl(
      isAll ? "assets/pdf/Daftar Kosakata Lengkap Bab 01-25.pdf" : `assets/pdf/Daftar Kosakata Bab ${this.kosakataBab}.pdf`
    );
    const pdfBundleUrl = this.pdfUrl("assets/pdf/Daftar Kosakata Lengkap Bab 01-25.pdf");

    // Total words count
    const totalAllWords = typeof KOSAKATA_DATA !== "undefined"
      ? Object.values(KOSAKATA_DATA).reduce((sum, ch) => sum + (ch.words ? ch.words.length : 0), 0)
      : 1500;

    // Build Chapter options
    let babOptionsHTML = `<option value="all" ${isAll ? "selected" : ""}>Semua Bab (Bab 01 s.d. 25 — ${totalAllWords} Kosakata)</option>`;
    for (let i = 1; i <= 25; i++) {
      const bStr = String(i).padStart(2, "0");
      const d = typeof KOSAKATA_DATA !== "undefined" ? KOSAKATA_DATA[i] : null;
      const count = d ? d.total_words : 0;
      const title = d ? d.title_id : `Bab ${bStr}`;
      babOptionsHTML += `<option value="${bStr}" ${this.kosakataBab === bStr ? "selected" : ""}>Bab ${bStr}: ${title} (${count} kata)</option>`;
    }

    // Categories list
    const categories = [
      "all",
      "Kata Benda",
      "Kata Kerja",
      "Kata Sifat",
      "Istilah Industri / K3",
      "Ungkapan / Salam",
      "Kata Ganti",
      "Kata Ganti Tunjuk",
      "Kata Ganti Tempat",
      "Kata Tanya",
      "Kata Keterangan",
      "Kata Sambung",
      "Kata Bantu Bilangan",
      "Bilangan",
      "Kata Penjelas",
      "Keterangan / Partikel"
    ];

    let catOptionsHTML = categories.map((cat) => {
      const label = cat === "all" ? "Semua Kategori Gramatikal" : cat;
      return `<option value="${cat}" ${this.kosakataFilter === cat ? "selected" : ""}>${label}</option>`;
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
            <a href="${pdfBundleUrl}" target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm" title="Unduh Lembar Hafalan Bundle Lengkap Bab 01 s.d. 25 (76 Halaman)">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <span>Bundle Lengkap (76 Hal)</span>
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
                ${isAll ? "単語帳 ｜ Seluruh Kosakata Bab 01 s.d. Bab 25" : (chData ? chData.title_jp : `Bab ${this.kosakataBab}`)}
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
                <input id="kosakata-search-input" type="text" placeholder="Cari Kanji, Hiragana, Romaji, Arti..." value="${this.kosakataSearch}" class="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500">
                <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
            </div>
          </div>

          <!-- Bottom Toolbar (Toggles & Batch Actions) -->
          <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-slate-500 text-[11px] font-medium">Mode Uji Hafalan (Flashcard):</span>
              <button id="toggle-hide-reading" class="px-2.5 py-1 rounded-md border text-xs font-semibold transition flex items-center gap-1 ${
                this.hideReading
                  ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
              }">
                <span>${this.hideReading ? "🙈 Cara Baca Tersembunyi" : "👁️ Cara Baca Terlihat"}</span>
              </button>
              <button id="toggle-hide-meaning" class="px-2.5 py-1 rounded-md border text-xs font-semibold transition flex items-center gap-1 ${
                this.hideMeaning
                  ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
              }">
                <span>${this.hideMeaning ? "🙈 Arti Tersembunyi" : "👁️ Arti Terlihat"}</span>
              </button>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="window.app.markVisibleWordsMemorized(true)" class="px-2.5 py-1 text-emerald-700 dark:text-emerald-400 hover:underline text-xs font-semibold">
                ✓ Tandai Semua Selesai
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
          <div class="text-[11px] italic">
            Tips: Gunakan tombol 🔊 untuk mendengarkan pelafalan penutur asli Jepang.
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
      try {
        const res = await fetch("/api/v1/auth/me", { credentials: "include" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && json.data.user) {
            this.currentUser = json.data.user;
            this.currentSession = json.data.session;
            this.isAuthenticated = true;
            if (this.currentUser && this.currentUser.name) {
              this.profile.name = this.currentUser.name;
              this.profile.classNo = this.currentUser.className || this.profile.classNo || "LPK";
              localStorage.setItem("choukai_student_profile", JSON.stringify(this.profile));
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
    if (!window.location.protocol.startsWith("http")) return;
    try {
      const res = await fetch("/api/v1/chapters");
      const json = await res.json();
      if (json.success && json.data) {
        for (const ch of json.data) {
          this.chaptersStatus[ch.chapterNum] = ch.isUnlocked;
          if (ch.userScore && (!this.progress[ch.chapterNum] || ch.userScore.totalScore > this.progress[ch.chapterNum].score)) {
            this.progress[ch.chapterNum] = {
              chapter: ch.chapterNum,
              score: ch.userScore.totalScore,
              readingScore: ch.userScore.readingScore,
              choukaiScore: ch.userScore.choukaiScore,
              passed: ch.userScore.isPassed,
            };
          }
        }
        if (this.view === "dashboard") {
          this.render();
        }
      }
    } catch (e) {}
  }

  updateHeaderAuthUI() {
    const adminBtn = document.getElementById("header-admin-btn");
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
        errEl.innerText = "Username dan PIN 6-digit wajib diisi.";
        errEl.classList.remove("hidden");
      }
      return false;
    }

    if (window.location.protocol.startsWith("http")) {
      try {
        const res = await fetch("/api/auth/sign-in/username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: u, password: p }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          const msg = data.message || data.error?.message || "Username atau PIN salah.";
          if (errEl) {
            errEl.innerText = msg;
            errEl.classList.remove("hidden");
          } else {
            alert(msg);
          }
          return false;
        }
        await this.checkAuthSession();
      } catch (e) {
        if (errEl) {
          errEl.innerText = "Gagal menghubungi server API.";
          errEl.classList.remove("hidden");
        }
        return false;
      }
    } else {
      // Local / Offline / file:// protocol mode
      if ((u === "ahmad.syahroni" || u === "narong.sakda" || u === "siswa.demo") && p === "123456") {
        this.currentUser = {
          id: "usr_ahmad",
          name: u === "narong.sakda" ? "Narong Sakda" : "Ahmad Syahroni",
          username: u,
          role: "student",
          className: "Kelas 24-B (IMM Japan)",
        };
        this.currentSession = { id: "ses_local_mock", token: "mock_token" };
        this.isAuthenticated = true;
        this.profile.name = this.currentUser.name;
        this.profile.classNo = this.currentUser.className;
        localStorage.setItem("choukai_student_profile", JSON.stringify(this.profile));
      } else if (u === "sensei.wahyu" && p === "123456") {
        this.currentUser = {
          id: "usr_admin",
          name: "Sensei Wahyu",
          username: "sensei.wahyu",
          role: "admin",
          className: "Sensei Pengawas",
        };
        this.currentSession = { id: "ses_local_admin", token: "mock_token" };
        this.isAuthenticated = true;
      } else {
        const mockUsers = JSON.parse(localStorage.getItem("imm_mock_users") || "{}");
        if (mockUsers[u] && mockUsers[u].pin === p) {
          this.currentUser = mockUsers[u].user;
          this.currentSession = { id: "ses_mock_" + u, token: "mock_token" };
          this.isAuthenticated = true;
          this.profile.name = this.currentUser.name;
          this.profile.classNo = this.currentUser.className;
          localStorage.setItem("choukai_student_profile", JSON.stringify(this.profile));
        } else {
          if (errEl) {
            errEl.innerText = "Username atau PIN salah.";
            errEl.classList.remove("hidden");
          }
          return false;
        }
      }
    }

    this.isAuthenticated = true;
    this.closeModal();
    this.updateAppGateUI();

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
    if (window.location.protocol.startsWith("http")) {
      try {
        await fetch("/api/auth/sign-out", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
      } catch (e) {}
    }
    this.currentUser = null;
    this.currentSession = null;
    this.isAuthenticated = false;
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
        btn.className = "admin-tab-btn px-3 py-2 text-xs font-bold rounded-lg bg-sky-600 text-white shadow-xs transition";
      } else {
        btn.className = "admin-tab-btn px-3 py-2 text-xs font-bold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition";
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
        <button onclick="window.app.fetchLiveMonitoring()" class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-semibold flex items-center gap-1 transition">
          🔄 Refresh
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
                  <span class="font-extrabold text-sm text-slate-900 dark:text-slate-100">${s.studentName}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${s.isExpired ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}">
                    ${s.isExpired ? 'Waktu Habis' : s.remainingMinutes + 'm tersisa'}
                  </span>
                </div>
                <div class="text-[11px] text-slate-500 mt-0.5">
                  ${s.username} • ${s.className} • <strong>Bab ${s.chapterNum} (${s.mode})</strong>
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
                <button onclick="window.app.terminateStudentExam('${s.sessionId}')" class="px-2.5 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-md text-xs font-bold transition">
                  🛑 Paksa Kumpulkan
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
    try {
      const url = q ? `/api/v1/admin/users?q=${encodeURIComponent(q)}` : "/api/v1/admin/users";
      const res = await fetch(url);
      const json = await res.json();
      this.adminUsersData = json.data || [];
    } catch (e) {
      this.adminUsersData = [];
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
          <input id="admin-user-search-input" type="text" placeholder="Cari nama, username, kelas..." value="${searchQ}" onkeydown="if(event.key==='Enter') window.app.fetchAdminUsers(this.value)" class="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none w-56">
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
            ${users.map((u) => `
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td class="p-2.5">
                  <div class="font-bold text-slate-900 dark:text-slate-100">${u.name}</div>
                  <div class="text-[11px] text-slate-500 font-mono">${u.username}</div>
                </td>
                <td class="p-2.5">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}">
                    ${u.role === 'admin' ? 'Sensei (Admin)' : 'Siswa'}
                  </span>
                </td>
                <td class="p-2.5 text-slate-600 dark:text-slate-400">${u.className}</td>
                <td class="p-2.5 text-center font-bold">${u.totalExams || 0}</td>
                <td class="p-2.5 text-center font-bold ${u.avgScore >= 80 ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}">${u.avgScore ? u.avgScore.toFixed(1) : '-'}</td>
                <td class="p-2.5 text-right space-x-1">
                  <button onclick="window.app.adminResetPin('${u.id}', '${u.name}')" class="px-2 py-1 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded text-[11px] font-semibold" title="Reset PIN ke 123456">
                    🔑 Reset PIN
                  </button>
                  ${this.currentUser?.id !== u.id ? `
                    <button onclick="window.app.adminDeleteUser('${u.id}', '${u.name}')" class="px-2 py-1 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded text-[11px] font-semibold" title="Hapus Akun">
                      🗑️
                    </button>
                  ` : ''}
                </td>
              </tr>
            `).join("")}
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
            <button onclick="window.app.lockAllChapters()" class="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-bold transition">
              🔒 Kunci Semua Bab
            </button>
            <button onclick="window.app.unlockAllChapters()" class="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold transition">
              🔓 Buka Semua Bab
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
        <button onclick="window.app.exportResultsCsv()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs">
          📥 Unduh Rekap Nilai (CSV)
        </button>
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
                <td class="p-2.5 font-bold text-slate-900 dark:text-slate-100">${r.studentName}</td>
                <td class="p-2.5 text-slate-600 dark:text-slate-400">${r.className}</td>
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
                <input id="login-username" type="text" required placeholder="misal: ahmad.syahroni" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-mono">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">PIN / Password (6-Digit):</label>
                <input id="login-pin" type="password" required placeholder="PIN atau Password" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-mono">
              </div>
              <button type="submit" class="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-bold transition shadow-sm mt-2">
                Masuk ke Sistem CBT
              </button>
            </form>

            <!-- Quick Demo Accounts -->
            <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Akses Cepat Pengujian:</div>
              <div class="grid grid-cols-2 gap-2">
                <button type="button" onclick="document.getElementById('login-username').value='ahmad.syahroni'; document.getElementById('login-pin').value='123456'; window.app.login('ahmad.syahroni', '123456');" class="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded text-[11px] font-semibold text-center transition">
                  👤 Siswa Demo
                </button>
                <button type="button" onclick="document.getElementById('login-username').value='sensei.wahyu'; document.getElementById('login-pin').value='123456'; window.app.login('sensei.wahyu', '123456');" class="py-1.5 px-2 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded text-[11px] font-semibold text-center transition">
                  👨‍🏫 Sensei Admin
                </button>
              </div>
              ${this.systemStatus.allowRegistration ? `
                <div class="text-center pt-2">
                  <button type="button" onclick="window.app.openAuthModal('auth_register')" class="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline">
                    Belum punya akun? Daftar mandiri di sini &rarr;
                  </button>
                </div>
              ` : `
                <div class="text-center text-[11px] text-slate-400 pt-1">
                  Pendaftaran mandiri siswa sedang ditutup oleh Sensei.
                </div>
              `}
            </div>
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
                <input id="reg-pin" type="password" required placeholder="Contoh: 123456" class="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md text-xs bg-white dark:bg-slate-800 font-mono focus:outline-none">
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
              <button data-tab="live" onclick="window.app.switchAdminTab('live')" class="admin-tab-btn px-3 py-2 text-xs font-bold rounded-lg ${this.adminTab === 'live' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                📡 Live Monitor
              </button>
              <button data-tab="users" onclick="window.app.switchAdminTab('users')" class="admin-tab-btn px-3 py-2 text-xs font-bold rounded-lg ${this.adminTab === 'users' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                👥 Manajemen Siswa
              </button>
              <button data-tab="lock" onclick="window.app.switchAdminTab('lock')" class="admin-tab-btn px-3 py-2 text-xs font-bold rounded-lg ${this.adminTab === 'lock' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                🔒 Kontrol Ujian & Sakelar
              </button>
              <button data-tab="results" onclick="window.app.switchAdminTab('results')" class="admin-tab-btn px-3 py-2 text-xs font-bold rounded-lg ${this.adminTab === 'results' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                📊 Rekap Nilai & Ekspor CSV
              </button>
            </div>

            <!-- Dynamic Tab Content Pane -->
            <div id="admin-tab-content" class="flex-1 overflow-y-auto">
              <!-- Loaded dynamically via switchAdminTab -->
            </div>
          </div>
        </div>
      `;
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
    }
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new ChoukaiApp();
});
