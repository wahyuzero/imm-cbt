/**
 * IMM JAPAN CHOUKAI LAB — Interactive CBT Application Engine
 * Zero-dependency, client-side state in localStorage, reactive Vanilla JS.
 */

class ChoukaiApp {
  constructor() {
    this.profile = this.loadProfile();
    this.progress = this.loadProgress();
    this.theme = localStorage.getItem("choukai_theme") || "light";

    // Exam runtime state
    this.currentChapter = BAB_08_DATA;
    this.currentQuestionIdx = 0;
    this.answers = {}; // { questionId: optionId }
    this.mode = "renshuu"; // 'renshuu' (practice) | 'shiken' (official exam)
    this.timerSeconds = 600; // 10 minutes
    this.timerInterval = null;
    this.showFurigana = true;
    this.showRomaji = false;

    // Audio Player state
    this.audio = new Audio();
    this.isPlaying = false;
    this.playbackRate = 1.0;

    // View state
    this.view = "dashboard"; // 'dashboard' | 'exam' | 'result'
    this.activeModal = null; // 'onboarding' | 'confirm_submit' | 'image_zoom'

    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.setupAudioListeners();
    this.setupKeyboardShortcuts();

    // Deep linking via URL hash
    if (window.location.hash === "#exam" || window.location.hash === "#bab-08") {
      this.startExam(BAB_08_DATA, "renshuu");
    } else if (window.location.hash === "#result-demo") {
      this.startExam(BAB_08_DATA, "shiken");
      this.answers = { 1: "3", 2: "4", 3: "2", 4: "2", 5: "3", 6: "2", 7: "3", 8: "3" };
      this.submitExam();
    } else {
      this.render();
      // Show onboarding if no profile exists
      if (!this.profile.name || !this.profile.classNo) {
        this.openModal("onboarding");
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
    localStorage.setItem("choukai_student_profile", JSON.stringify(this.profile));
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
      score: result.score,
      passed: result.passed,
      correctCount: result.correctCount,
      totalCount: result.totalCount,
      answers: result.answers,
      date: new Date().toISOString(),
      mode: result.mode,
    };
    localStorage.setItem("choukai_progress", JSON.stringify(this.progress));
  }

  // ==========================================
  // THEME MANAGEMENT
  // ==========================================
  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("choukai_theme", theme);
  }

  toggleTheme() {
    this.applyTheme(this.theme === "dark" ? "light" : "dark");
  }

  // ==========================================
  // AUDIO CONTROLS
  // ==========================================
  setupAudioListeners() {
    this.audio.addEventListener("timeupdate", () => this.updateAudioProgress());
    this.audio.addEventListener("ended", () => {
      this.isPlaying = false;
      this.renderAudioButtons();
    });
    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      this.renderAudioButtons();
    });
    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.renderAudioButtons();
    });
  }

  playAudio() {
    if (!this.audio.src || !this.audio.src.includes(this.currentChapter.audioSrc)) {
      this.audio.src = this.currentChapter.audioSrc;
      this.audio.playbackRate = this.playbackRate;
    }
    this.audio.play().catch((e) => console.log("Audio play prevented:", e));
  }

  pauseAudio() {
    this.audio.pause();
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }

  seekAudio(seconds) {
    if (isNaN(seconds) || !isFinite(seconds) || !this.audio.duration) return;
    this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration));
  }

  seekAndPlayAudio(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return;
    if (!this.audio.src || !this.audio.src.includes(this.currentChapter.audioSrc)) {
      this.audio.src = this.currentChapter.audioSrc;
      this.audio.playbackRate = this.playbackRate;
    }
    if (this.audio.duration) {
      this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration));
    } else {
      this.audio.addEventListener(
        "loadedmetadata",
        () => {
          this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration));
        },
        { once: true }
      );
    }
    this.playAudio();
  }

  setPlaybackRate(rate) {
    this.playbackRate = rate;
    this.audio.playbackRate = rate;
    this.renderAudioSpeedBadge();
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

    if (curTimeEl) curTimeEl.textContent = this.formatTime(this.audio.currentTime);
    if (totalTimeEl && this.audio.duration) totalTimeEl.textContent = this.formatTime(this.audio.duration);
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

  renderAudioSpeedBadge() {
    const badge = document.getElementById("audio-speed-btn");
    if (badge) badge.textContent = `${this.playbackRate}x`;
  }

  // ==========================================
  // EXAM LOGIC & TIMER
  // ==========================================
  startExam(chapterData, mode = "renshuu") {
    this.currentChapter = chapterData;
    this.currentQuestionIdx = 0;
    this.answers = {};
    this.mode = mode;
    this.view = "exam";

    // Reset audio
    this.pauseAudio();
    this.audio.src = this.currentChapter.audioSrc;
    this.audio.currentTime = 0;

    // Reset timer
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.mode === "shiken") {
      this.timerSeconds = 600; // 10 menit
      this.startTimer();
      // Auto-start audio in official exam mode
      this.playAudio();
    }

    this.render();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timerSeconds--;
      this.renderTimerDisplay();
      if (this.timerSeconds <= 0) {
        clearInterval(this.timerInterval);
        alert("Waktu ujian telah berakhir! Lembar jawaban akan dikumpulkan secara otomatis.");
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
      if (this.timerSeconds < 120) {
        timerEl.classList.add("text-rose-600", "font-black");
      }
    }
  }

  selectOption(questionId, optionId) {
    this.answers[questionId] = optionId;
    this.renderQuestionContent();
    this.renderQuestionNav();
  }

  goToQuestion(idx) {
    if (idx >= 0 && idx < this.currentChapter.questions.length) {
      this.currentQuestionIdx = idx;
      this.renderQuestionContent();
      this.renderQuestionNav();
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
    this.pauseAudio();

    // Hitung skor
    let correctCount = 0;
    const questions = this.currentChapter.questions;
    questions.forEach((q) => {
      if (this.answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = (correctCount / questions.length) * 100;
    const passed = score >= (this.currentChapter.passingGrade || 80);

    const result = {
      chapter: this.currentChapter.chapter,
      score,
      passed,
      correctCount,
      totalCount: questions.length,
      answers: { ...this.answers },
      mode: this.mode,
    };

    this.saveExamResult(result);
    this.currentResult = result;
    this.view = "result";
    this.render();
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

    let itemsStr = "";
    qList.forEach((q) => {
      const isCorrect = r.answers[q.id] === q.correctAnswer;
      const mark = isCorrect ? "✅ [BENAR]" : "❌ [SALAH]";
      const userAns = r.answers[q.id] ? `Opsi ${r.answers[q.id]}` : "Tidak dijawab";
      itemsStr += `• Soal ${q.id}: ${mark} (Pilihan: ${userAns} | Kunci: ${q.correctAnswer})\n`;
    });

    const statusBadge = r.passed ? "LULUS (合格) 🎉" : "REMEDIAL / BELUM LULUS (再試) ⚠️";

    const msg =
      `🎌 *LAPORAN EVALUASI LISTENING IMM JAPAN (CHOUKAI LAB)*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Peserta:* ${this.profile.name || "Siswa"}\n` +
      `🏷️ *Kelas/No:* ${this.profile.classNo || "-"}\n` +
      `🎯 *Modul:* ${this.currentChapter.title_ja} (${this.currentChapter.title_id})\n` +
      `⏱️ *Mode:* ${r.mode === "shiken" ? "Ujian Resmi CBT" : "Latihan Mandiri"}\n` +
      `📊 *Skor Akhir:* *${r.score.toFixed(1)} / 100*\n` +
      `🏆 *Status:* *${statusBadge}*\n` +
      `📌 *Passing Grade:* 80.0 Poin (Minimal 7 dari 8 Benar)\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Rincian Hasil Pengerjaan:*\n` +
      itemsStr +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🗓️ *Waktu:* ${dateStr}\n` +
      `🏢 *Platform:* IMM Japan Choukai CBT Engine`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  }

  // ==========================================
  // MODAL & UI CONTROLS
  // ==========================================
  openModal(modalName, data = null) {
    this.activeModal = modalName;
    this.modalData = data;
    this.renderModal();
  }

  closeModal() {
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
      if (e.key >= "1" && e.key <= "4") {
        const q = this.currentChapter.questions[this.currentQuestionIdx];
        if (q) this.selectOption(q.id, e.key);
      } else if (e.key === "ArrowRight") {
        this.nextQuestion();
      } else if (e.key === "ArrowLeft") {
        this.prevQuestion();
      } else if (e.key === " ") {
        // Space bar for play/pause if not typing in input
        if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
          e.preventDefault();
          this.togglePlayPause();
        }
      }
    });
  }

  // ==========================================
  // RENDERING ENGINE
  // ==========================================
  render() {
    const appEl = document.getElementById("app");
    if (!appEl) return;

    if (this.view === "dashboard") {
      appEl.innerHTML = this.renderDashboardHTML();
    } else if (this.view === "exam") {
      appEl.innerHTML = this.renderExamHTML();
      this.renderQuestionNav();
      this.renderQuestionContent();
      this.renderAudioButtons();
      this.renderAudioSpeedBadge();
    } else if (this.view === "result") {
      appEl.innerHTML = this.renderResultHTML();
    }

    this.renderHeaderProfile();
    this.renderModal();
  }

  renderHeaderProfile() {
    const profileBtn = document.getElementById("header-profile-btn");
    if (profileBtn) {
      const name = this.profile.name || "Atur Profil";
      const cls = this.profile.classNo ? `(${this.profile.classNo})` : "";
      profileBtn.innerHTML = `
        <span class="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold font-jp">
          ${this.profile.name ? this.profile.name[0].toUpperCase() : "学"}
        </span>
        <span class="hidden sm:inline font-medium text-xs text-slate-700 dark:text-slate-200">${name} ${cls}</span>
      `;
    }
  }

  // SCREEN 1: DASHBOARD
  renderDashboardHTML() {
    const completedCount = Object.keys(this.progress).length;
    const scores = Object.values(this.progress).map((p) => p.score);
    const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;

    let cardsHTML = "";
    CHAPTERS_INDEX.forEach((ch) => {
      const prog = this.progress[ch.num];
      const isCompleted = prog !== undefined;
      const scoreBadge = isCompleted
        ? `<span class="px-2 py-0.5 rounded text-xs font-bold ${prog.passed ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400" : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400"}">${prog.score.toFixed(0)} Poin</span>`
        : "";

      const actionButton = ch.available
        ? `<button onclick="window.app.startExam(BAB_08_DATA, 'renshuu')" class="w-full mt-3 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>
            ${isCompleted ? "Ulangi Latihan" : "Mulai Bab 08"}
          </button>`
        : `<button disabled class="w-full mt-3 py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-md text-xs font-semibold cursor-not-allowed">
            Terkunci (Segera Hadir)
          </button>`;

      cardsHTML += `
        <div class="border ${ch.available ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm" : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-75"} rounded-lg p-4 flex flex-col justify-between transition hover:border-sky-500">
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold font-jp ${ch.available ? "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}">
                BAB ${ch.num}
              </span>
              <div class="flex items-center gap-1.5">
                ${scoreBadge}
                <span class="text-[10px] text-slate-400 font-mono">${ch.audioDuration}</span>
              </div>
            </div>
            <h3 class="font-jp font-bold text-sm text-slate-900 dark:text-slate-100 mb-1 leading-snug">${ch.title_ja}</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 mb-2">${ch.title_id}</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-500 line-clamp-2">${ch.topic_id}</p>
          </div>
          <div>
            ${actionButton}
          </div>
        </div>
      `;
    });

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
                プラットフォーム聴解 CBT ・ Laboratorium Listening
              </h1>
              <p class="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
                Suplemen latihan mendengarkan terstandarisasi untuk calon peserta magang teknis IMM Japan & visa Tokutei Ginou (SSW). 8 soal per bab dengan logika penalaran otentik.
              </p>
            </div>
            <!-- Quick Stats -->
            <div class="flex items-center gap-4 bg-slate-800/80 border border-slate-700/80 rounded-lg p-3 shrink-0">
              <div class="text-center px-2">
                <span class="block text-lg font-black text-white font-mono">${completedCount}/18</span>
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

        <!-- Section Title -->
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              Katalog Bab Suplemen (Bab 08 s.d. Bab 25)
            </h2>
            <p class="text-xs text-slate-500">Pilih modul bab yang ingin Anda kerjakan di bawah ini</p>
          </div>
          <div class="flex items-center gap-2">
            <a href="${BAB_08_DATA.pdfSoalUrl}" target="_blank" class="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium hover:bg-slate-50 transition flex items-center gap-1 shadow-sm">
              <svg class="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Soal PDF
            </a>
            <a href="${BAB_08_DATA.pdfKunciUrl}" target="_blank" class="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium hover:bg-slate-50 transition flex items-center gap-1 shadow-sm">
              <svg class="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Kunci & Pembahasan PDF
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

    return `
      <div class="max-w-5xl mx-auto px-4 py-4">
        <!-- Top Exam Header -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 mb-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <button onclick="window.app.view = 'dashboard'; window.app.pauseAudio(); window.app.render();" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Kembali
            </button>
            <div class="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
            <div>
              <span class="text-[11px] font-bold text-sky-600 dark:text-sky-400 font-jp uppercase">${this.currentChapter.title_ja}</span>
              <h2 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">${this.currentChapter.title_id}</h2>
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
                CBT Resmi (試験)
              </button>
            </div>

            <!-- Timer (if Mode Shiken) -->
            ${
              this.mode === "shiken"
                ? `<div class="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 px-2.5 py-1 rounded text-xs font-mono font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span id="exam-timer-display">10:00</span>
                  </div>`
                : ""
            }

            <!-- Furigana Toggle -->
            <button onclick="window.app.showFurigana = !window.app.showFurigana; window.app.renderQuestionContent();" class="px-2 py-1 border border-slate-300 dark:border-slate-700 rounded text-xs font-jp text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              かな <span class="text-[10px] text-slate-400">${this.showFurigana ? "ON" : "OFF"}</span>
            </button>
          </div>
        </div>

        <!-- Audio Player Console -->
        <div class="bg-slate-900 text-white rounded-lg p-3 sm:p-4 mb-4 shadow-md border border-slate-800">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
            <!-- Play/Pause & Times -->
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <button id="audio-play-btn" onclick="window.app.togglePlayPause()" class="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center transition shrink-0 shadow">
                <svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <div class="text-xs font-mono flex items-center gap-1 text-slate-300">
                <span id="audio-current-time">00:00</span>
                <span>/</span>
                <span id="audio-total-time">${this.currentChapter.audioDuration || "08:35"}</span>
              </div>
            </div>

            <!-- Scrubber Track -->
            <div class="w-full flex-1 mx-2">
              <input id="audio-scrubber" type="range" min="0" max="100" value="0" class="w-full audio-range" oninput="window.app.seekAudio((this.value / 100) * window.app.audio.duration)">
            </div>

            <!-- Speed & Audio Badge -->
            <div class="flex items-center gap-2 shrink-0">
              <button id="audio-speed-btn" onclick="const r = window.app.playbackRate === 1.0 ? 0.8 : (window.app.playbackRate === 0.8 ? 1.2 : 1.0); window.app.setPlaybackRate(r);" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-mono font-bold transition">
                1.0x
              </button>
              <span class="text-[10px] text-slate-400 font-jp px-2 py-0.5 bg-slate-800/70 rounded">
                Azure Neural (EBU R128)
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

    let itemsHTML = "";
    this.currentChapter.questions.forEach((q, idx) => {
      const isCurrent = idx === this.currentQuestionIdx;
      const isAnswered = this.answers[q.id] !== undefined;

      let bgClass = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700";
      if (isCurrent) {
        bgClass = "bg-sky-600 text-white border-sky-600 font-bold ring-2 ring-sky-300 dark:ring-sky-900";
      } else if (isAnswered) {
        bgClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700";
      }

      itemsHTML += `
        <button onclick="window.app.goToQuestion(${idx})" class="w-9 h-9 rounded-md border text-xs font-mono font-bold flex items-center justify-center transition ${bgClass}">
          ${q.id}
        </button>
      `;
    });

    const answeredCount = Object.keys(this.answers).length;
    const totalCount = this.currentChapter.questions.length;

    navEl.innerHTML = `
      <div class="flex items-center justify-between gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
        <div class="flex items-center gap-1.5 overflow-x-auto py-0.5">
          ${itemsHTML}
        </div>
        <div class="shrink-0 flex items-center gap-2">
          <span class="text-xs text-slate-500 font-mono hidden sm:inline">${answeredCount}/${totalCount} Terjawab</span>
          <button onclick="window.app.openModal('confirm_submit')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition shadow-sm">
            Kumpulkan Ujian
          </button>
        </div>
      </div>
    `;
  }

  renderQuestionContent() {
    const container = document.getElementById("question-content-container");
    if (!container) return;

    const q = this.currentChapter.questions[this.currentQuestionIdx];
    const isAnswered = this.answers[q.id] !== undefined;
    const selectedAns = this.answers[q.id];

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

    // Option cards
    let optionsHTML = "";
    q.options.forEach((opt) => {
      const isSelected = selectedAns === opt.id;
      let btnState = isSelected ? "selected" : "";

      // In Mode Renshuu, if answered, highlight correct & wrong immediately
      if (this.mode === "renshuu" && isAnswered) {
        if (opt.id === q.correctAnswer) {
          btnState += " correct";
        } else if (isSelected && opt.id !== q.correctAnswer) {
          btnState += " incorrect";
        }
      }

      const optCleanJa = opt.text_ja.replace(/^[①②③④\d]+[\s.、]*\s*/, "");

      optionsHTML += `
        <button onclick="window.app.selectOption(${q.id}, '${opt.id}')" class="option-btn ${btnState} p-3.5 rounded-lg flex items-start gap-3 w-full">
          <span class="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold shrink-0 font-jp ${isSelected ? "bg-sky-600 text-white border-sky-600" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}">
            ${opt.symbol || opt.id}
          </span>
          <div class="text-left flex-1">
            <div class="font-jp font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">${optCleanJa}</div>
            <div class="text-[11px] text-slate-500 mt-0.5">${opt.text_id}</div>
          </div>
        </button>
      `;
    });

    // Explanation in Mode Renshuu
    let explanationHTML = "";
    if (this.mode === "renshuu" && isAnswered) {
      explanationHTML = `
        <div class="mt-6 border-t border-slate-200 dark:border-slate-800 pt-4 bg-slate-50 dark:bg-slate-900/60 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-4 sm:p-6 rounded-b-lg">
          <div class="flex items-center gap-2 mb-3">
            <span class="px-2 py-0.5 rounded text-xs font-bold ${selectedAns === q.correctAnswer ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}">
              ${selectedAns === q.correctAnswer ? "Jawaban Anda Benar (正解)!" : "Jawaban Anda Kurang Tepat"}
            </span>
            <span class="text-xs text-slate-500 font-mono">Kunci: Opsi ${q.correctAnswer}</span>
          </div>

          <div class="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <div class="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
              <strong class="text-sky-600 dark:text-sky-400 block mb-1">💡 Analisis Logika:</strong>
              ${q.explanation.logic}
            </div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
              <strong class="text-amber-600 dark:text-amber-400 block mb-1">⚠️ Jebakan Distraktor:</strong>
              <div class="whitespace-pre-line">${q.explanation.distractor}</div>
            </div>
            <div class="bg-sky-50 dark:bg-sky-950/40 p-3 rounded border border-sky-200 dark:border-sky-900 text-sky-900 dark:text-sky-200">
              <strong class="block mb-1">📘 Catatan Kaidah Bab 8:</strong>
              ${q.explanation.grammarRule}
            </div>
          </div>
        </div>
      `;
    }

    const questionTextDisplay = this.showFurigana ? q.question_ruby : q.question_ja;

    container.innerHTML = `
      <div class="flex items-center justify-between gap-2 mb-3">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-xs font-bold font-mono">
            SOAL ${q.id}
          </span>
          <span class="text-xs text-slate-500 font-jp">${q.section_ja}</span>
        </div>
        <div class="flex items-center gap-2">
          ${q.audioTimestamp ? `
          <button onclick="window.app.seekAndPlayAudio(${q.audioStartSeconds})" class="px-2.5 py-1 rounded bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm" title="Putar audio soal ${q.id} (${q.audioTimestamp})">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            <span>Audio Soal (${q.audioTimestamp})</span>
          </button>
          ` : ""}
          <span class="text-[11px] text-slate-400 font-mono">Poin: 12.5</span>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="text-base sm:text-lg font-bold font-jp text-slate-900 dark:text-slate-100 leading-relaxed">
          ${questionTextDisplay}
        </h3>
        <p class="text-xs text-slate-500 mt-1 italic">${q.question_romaji} &bull; ${q.question_id}</p>
      </div>

      ${visualHTML}

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        ${optionsHTML}
      </div>

      ${explanationHTML}

      <!-- Bottom Nav buttons -->
      <div class="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button onclick="window.app.prevQuestion()" class="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition ${this.currentQuestionIdx === 0 ? "opacity-50 pointer-events-none" : ""}">
          &larr; Soal Sebelumnya
        </button>
        <button onclick="window.app.nextQuestion()" class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-semibold transition ${this.currentQuestionIdx === this.currentChapter.questions.length - 1 ? "opacity-50 pointer-events-none" : ""}">
          Soal Selanjutnya &rarr;
        </button>
      </div>
    `;
  }

  // SCREEN 3: RESULT VIEW
  renderResultHTML() {
    if (!this.currentResult) return "";
    const r = this.currentResult;
    const qList = this.currentChapter.questions;

    let reviewCardsHTML = "";
    qList.forEach((q) => {
      const userAns = r.answers[q.id];
      const isCorrect = userAns === q.correctAnswer;

      let dialogueScriptHTML = "";
      q.dialogue.forEach((d) => {
        dialogueScriptHTML += `
          <div class="text-[11px] mb-1">
            <span class="font-bold text-sky-700 dark:text-sky-400">${d.speaker}:</span>
            <span class="font-jp text-slate-800 dark:text-slate-200">${d.text_ja}</span>
            <div class="text-slate-500 italic pl-3 text-[10px]">└ ${d.text_id}</div>
          </div>
        `;
      });

      reviewCardsHTML += `
        <div class="border ${isCorrect ? "border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-900" : "border-rose-200 dark:border-rose-900 bg-rose-50/20 dark:bg-rose-950/20"} rounded-lg p-4 shadow-sm mb-4">
          <div class="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"} font-mono">
                ${q.id}
              </span>
              <span class="font-jp font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">${q.question_ja}</span>
            </div>
            <span class="px-2 py-0.5 rounded text-[11px] font-bold ${isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}">
              ${isCorrect ? "BENAR (+12.5)" : "SALAH (0)"}
            </span>
          </div>

          <div class="text-xs text-slate-600 dark:text-slate-400 mb-2">
            Jawaban Anda: <strong class="${isCorrect ? "text-emerald-600" : "text-rose-600"}">${userAns ? "Opsi " + userAns : "Kosong"}</strong> &bull; Kunci Jawaban: <strong class="text-sky-600">Opsi ${q.correctAnswer}</strong>
          </div>

          <!-- Dialogue script disclosure -->
          <details class="bg-slate-50 dark:bg-slate-800/60 rounded p-2.5 my-2 border border-slate-200 dark:border-slate-700">
            <summary class="cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
              📄 Transkrip Dialog Lengkap & Terjemahan
            </summary>
            <div class="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
              ${dialogueScriptHTML}
            </div>
          </details>

          <!-- Explanation notes -->
          <div class="bg-sky-50/50 dark:bg-sky-950/20 border-l-2 border-sky-500 p-2.5 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <p><strong>Analisis:</strong> ${q.explanation.logic}</p>
            <p class="text-[11px] text-slate-500"><strong>Kaidah:</strong> ${q.explanation.grammarRule}</p>
          </div>
        </div>
      `;
    });

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
          <p class="text-xs text-slate-500">
            Benar: ${r.correctCount} dari ${r.totalCount} Soal &bull; Passing Grade: 80.0
          </p>

          <!-- WhatsApp Share & Actions -->
          <div class="flex flex-wrap items-center justify-center gap-2.5 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
            <button onclick="window.app.shareResultWhatsApp()" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-sm">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.449.74 0.965 1.2.664.592 1.224.776 1.397.863.173.086.274.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/></svg>
              Kirim Nilai ke Sensei via WhatsApp
            </button>
            <a href="${this.currentChapter.pdfSoalUrl || 'assets/pdf/Soal Choukai Bab 08.pdf'}" target="_blank" class="px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <svg class="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Unduh Soal PDF
            </a>
            <a href="${this.currentChapter.pdfKunciUrl || 'assets/pdf/Kunci dan Pembahasan Choukai Bab 08.pdf'}" target="_blank" class="px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Unduh Kunci & Pembahasan PDF
            </a>
            <button onclick="window.app.startExam(window.app.currentChapter, 'renshuu')" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition">
              Ulangi Ujian
            </button>
            <button onclick="window.app.view = 'dashboard'; window.app.render();" class="px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              Kembali ke Dashboard
            </button>
          </div>
        </div>

        <!-- Detailed Breakdown Header -->
        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
          <span>📝</span> Pembahasan Detail Tiap Butir Soal
        </h3>

        <!-- Review Cards -->
        ${reviewCardsHTML}
      </div>
    `;
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
                    Profil Peserta Ujian Choukai
                  </h3>
                  <p class="text-[11px] text-slate-500 mt-0.5">
                    Identitas untuk laporan nilai ke Sensei & Instruktur.
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

              <!-- Google Sign-In Config Slot -->
              <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div class="p-2.5 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-500" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                    <span class="text-[11px] text-slate-600 dark:text-slate-400">Akun Google (Opsional / GIS Ready)</span>
                  </div>
                  <span class="text-[10px] text-sky-600 dark:text-sky-400 font-medium">Lokal Browser OK</span>
                </div>
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
