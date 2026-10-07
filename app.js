/**
 * IMM JAPAN CBT PLATFORM ENGINE
 * Paket Tryout Terpadu: Sesi 1 Reading (25 Soal) & Sesi 2 Choukai (8 Soal) — Total 33 Soal
 * Format EPS-TOPIK Terstandarisasi untuk Calon Pemagang IMM Japan & SSW Tokutei Ginou.
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
    this.timerSeconds = 3600; // 60 menit (50m Reading + 10m Choukai)
    this.timerInterval = null;
    this.autoNextInterval = null;
    this.autoNextRemaining = 0;
    this.showFurigana = true;
    this.showRomaji = false;

    // Audio Player state
    this.audio = new Audio();
    this.isPlaying = false;
    this.playbackRate = 1.0;

    // View state
    this.view = "dashboard"; // 'dashboard' | 'exam' | 'result'
    this.activeModal = null; // 'onboarding' | 'confirm_submit' | 'image_zoom'
    this.modalData = null;

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
      // Populate mock full-score demo
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
      this.render();
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
      readingScore: result.readingScore,
      choukaiScore: result.choukaiScore,
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
      this.handleAudioEnded();
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

  getCurrentQuestion() {
    return this.currentChapter && this.currentChapter.questions
      ? this.currentChapter.questions[this.currentQuestionIdx]
      : null;
  }

  getCurrentQuestionAudioSrc() {
    const q = this.getCurrentQuestion();
    return q && q.audioSrc ? q.audioSrc : (this.currentChapter ? this.currentChapter.audioSrc : "");
  }

  loadQuestionAudio(idx) {
    if (idx !== undefined) this.currentQuestionIdx = idx;
    this.cancelAutoNext();
    const q = this.getCurrentQuestion();
    if (!q) return;

    if (q.session === "choukai" && q.audioSrc) {
      const targetSrc = q.audioSrc;
      if (!this.audio.src || !this.audio.src.endsWith(targetSrc)) {
        this.audio.src = targetSrc;
        this.audio.currentTime = 0;
        this.audio.playbackRate = this.playbackRate;
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
      this.audio.playbackRate = this.playbackRate;
    }
    this.audio.play().catch((e) => console.log("Audio play prevented:", e));
  }

  pauseAudio() {
    this.audio.pause();
    this.cancelAutoNext();
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
    this.audio.src = q.audioSrc;
    this.audio.currentTime = 0;
    this.audio.playbackRate = this.playbackRate;
    this.audio.play().catch((e) => console.log("Audio play prevented:", e));
  }

  seekAudio(seconds) {
    if (isNaN(seconds) || !isFinite(seconds) || !this.audio.duration) return;
    this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration));
  }

  seekAndPlayAudio(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return;
    this.seekAudio(seconds);
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
      titleEl.textContent = `Audio Soal ${q.id} (Sesi Choukai)`;
    }
  }

  renderAudioSpeedBadge() {
    const badge = document.getElementById("audio-speed-btn");
    if (badge) badge.textContent = `${this.playbackRate}x`;
  }

  // Jeda antar-soal 5 detik otomatis untuk Choukai
  handleAudioEnded() {
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
  startExam(chapterData, mode = "renshuu") {
    this.currentChapter = chapterData;
    this.currentQuestionIdx = 0;
    this.answers = {};
    this.mode = mode;
    this.view = "exam";

    this.pauseAudio();
    this.loadQuestionAudio(0);

    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.mode === "shiken") {
      this.timerSeconds = 3600; // 60 menit (50m Reading + 10m Choukai)
      this.startTimer();
      const q = this.getCurrentQuestion();
      if (q && q.session === "choukai") {
        this.playAudio();
      }
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
      if (this.timerSeconds < 300) {
        timerEl.classList.add("text-rose-600", "font-black");
      }
    }
  }

  selectOption(questionId, optionId) {
    this.answers[questionId] = optionId;
    this.renderQuestionContent();
    this.renderQuestionNav();
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
    const choukaiQuestions = questions.filter((q) => q.session === "choukai" || q.id > 25);

    let readingCorrect = 0;
    readingQuestions.forEach((q) => {
      if (this.answers[q.id] === q.correctAnswer) readingCorrect++;
    });

    let choukaiCorrect = 0;
    choukaiQuestions.forEach((q) => {
      if (this.answers[q.id] === q.correctAnswer) choukaiCorrect++;
    });

    const readingTotal = readingQuestions.length || 25;
    const choukaiTotal = choukaiQuestions.length || 8;

    const readingScore = (readingCorrect / readingTotal) * 100;
    const choukaiScore = (choukaiCorrect / choukaiTotal) * 100;
    const totalScore = (readingScore + choukaiScore) / 2;
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
      const sessionTag = (q.session === "reading" || q.id <= 25) ? "Reading" : "Choukai";
      itemsStr += `• [${sessionTag}] Soal ${q.id}: ${mark} (Pilihan: ${userAns} | Kunci: ${q.correctAnswer})\n`;
    });

    const statusBadge = r.passed ? "LULUS (合格) 🎉" : "REMEDIAL / BELUM LULUS (再試) ⚠️";
    const modeText = r.mode === "shiken" ? "Simulasi CBT" : "Latihan Mandiri";

    const msg =
      `🎌 *LAPORAN EVALUASI IMM JAPAN (TRYOUT TERPADU)*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Peserta:* ${this.profile.name || "Siswa"}\n` +
      `🏷️ *Kelas/No:* ${this.profile.classNo || "-"}\n` +
      `🎯 *Modul:* ${this.currentChapter.title_ja} (${this.currentChapter.title_id})\n` +
      `⏱️ *Mode:* ${modeText}\n` +
      `📖 *Skor Reading (読解):* *${r.readingScore.toFixed(1)} / 100* (${r.readingCorrect}/${r.readingTotal} Benar)\n` +
      `🎧 *Skor Choukai (聴解):* *${r.choukaiScore.toFixed(1)} / 100* (${r.choukaiCorrect}/${r.choukaiTotal} Benar)\n` +
      `📊 *Skor Akhir Tryout:* *${r.score.toFixed(1)} / 100*\n` +
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

    if (this.view === "dashboard") {
      appEl.innerHTML = this.renderDashboardHTML();
    } else if (this.view === "exam") {
      appEl.innerHTML = this.renderExamHTML();
      this.renderQuestionNav();
      this.renderQuestionContent();
      this.renderAudioVisibility();
    } else if (this.view === "result") {
      appEl.innerHTML = this.renderResultHTML();
    }

    this.renderHeaderProfile();
  }

  renderHeaderProfile() {
    const btn = document.getElementById("header-profile-btn");
    if (!btn) return;
    if (this.profile && this.profile.name) {
      btn.innerHTML = `
        <span class="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px] font-bold">学</span>
        <span class="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[120px]">${this.profile.name}</span>
      `;
    }
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

      const actionButton = ch.available
        ? `<button onclick="window.app.startExam(BAB_08_DATA, 'renshuu')" class="w-full mt-3 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>
            ${isCompleted ? "Ulangi Tryout" : "Mulai Tryout Bab 08"}
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
                <span class="text-[10px] text-slate-400 font-mono">${ch.totalQuestions || 33} Soal</span>
              </div>
            </div>
            <h3 class="font-jp font-bold text-sm text-slate-900 dark:text-slate-100 mb-1 leading-snug">${ch.title_ja}</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 mb-2">${ch.title_id}</p>
          </div>
          <div>
            ${actionButton}
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
                IMM JAPAN 研修生カリキュラム ｜ EPS-TOPIK TRYOUT
              </span>
              <h1 class="text-xl md:text-2xl font-black font-jp mt-2 tracking-tight">
                プラットフォーム CBT 評価試験 ・ Tryout Terpadu
              </h1>
              <p class="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
                Paket evaluasi terstandarisasi untuk calon peserta magang teknis IMM Japan & visa Tokutei Ginou (SSW). 33 butir soal per bab (Sesi 1 Reading: 25 Soal & Sesi 2 Choukai: 8 Soal).
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

        <!-- Section Title & PDF Downloads -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 class="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              Katalog Bab Suplemen (Bab 08 s.d. Bab 25)
            </h2>
            <p class="text-xs text-slate-500">Pilih modul bab tryout yang ingin Anda kerjakan di bawah ini</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <a href="${BAB_08_DATA.pdfReadingSoalUrl || 'assets/pdf/Salinan Soal Bab 08.pdf'}" target="_blank" class="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium hover:bg-slate-50 transition flex items-center gap-1 shadow-sm">
              <svg class="w-3.5 h-3.5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Soal Reading PDF
            </a>
            <a href="${BAB_08_DATA.pdfReadingKunciUrl || 'assets/pdf/Kunci dan Pembahasan Bab 08.pdf'}" target="_blank" class="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium hover:bg-slate-50 transition flex items-center gap-1 shadow-sm">
              <svg class="w-3.5 h-3.5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Kunci Reading PDF
            </a>
            <a href="${BAB_08_DATA.pdfSoalUrl || 'assets/pdf/Soal Choukai Bab 08.pdf'}" target="_blank" class="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium hover:bg-slate-50 transition flex items-center gap-1 shadow-sm">
              <svg class="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Soal Choukai PDF
            </a>
            <a href="${BAB_08_DATA.pdfKunciUrl || 'assets/pdf/Kunci dan Pembahasan Choukai Bab 08.pdf'}" target="_blank" class="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium hover:bg-slate-50 transition flex items-center gap-1 shadow-sm">
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
            <button onclick="window.app.view = 'dashboard'; window.app.pauseAudio(); window.app.render();" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium flex items-center gap-1">
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
                    <span id="exam-timer-display">60:00</span>
                  </div>`
                : ""
            }

            <!-- Furigana Toggle -->
            <button onclick="window.app.showFurigana = !window.app.showFurigana; window.app.renderQuestionContent();" class="px-2 py-1 border border-slate-300 dark:border-slate-700 rounded text-xs font-jp text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              かな <span class="text-[10px] text-slate-400">${this.showFurigana ? "ON" : "OFF"}</span>
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
                <div class="text-[11px] font-bold text-sky-400 font-mono tracking-wide" id="audio-header-title">Audio Soal ${q.id} (Sesi Choukai)</div>
                <div class="text-xs font-mono flex items-center gap-1 text-slate-300">
                  <span id="audio-current-time">00:00</span>
                  <span>/</span>
                  <span id="audio-total-time">${q.audioDuration || "00:50"}</span>
                </div>
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
          <button onclick="window.app.goToQuestion(${qIdx})" class="w-8 h-8 rounded-md border text-xs font-mono font-bold flex items-center justify-center shrink-0 transition ${bgClass}" title="Soal ${q.id} (${q.category || ''})">
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
            <button onclick="window.app.goToSession('reading')" class="px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 ${currentSession === 'reading' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}">
              <span>📖 Sesi 1: Reading</span>
              <span class="text-[10px] font-mono px-1 py-0.2 rounded ${currentSession === 'reading' ? 'bg-sky-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}">${readingAnswered}/25</span>
            </button>
            <button onclick="window.app.goToSession('choukai')" class="px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 ${currentSession === 'choukai' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}">
              <span>🎧 Sesi 2: Choukai</span>
              <span class="text-[10px] font-mono px-1 py-0.2 rounded ${currentSession === 'choukai' ? 'bg-sky-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}">${choukaiAnswered}/8</span>
            </button>
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
          <!-- Sesi 1 (Reading 1-25) -->
          <div class="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
            <span class="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider w-16 shrink-0">Reading:</span>
            ${renderNavButtons(readingQuestions)}
          </div>
          <!-- Sesi 2 (Choukai 26-33) -->
          <div class="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
            <span class="text-[10px] font-bold text-sky-500 uppercase font-mono tracking-wider w-16 shrink-0">Choukai:</span>
            ${renderNavButtons(choukaiQuestions)}
          </div>
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
          ${q.category ? `<span class="hidden sm:inline text-[11px] text-slate-400 font-jp">&bull; ${q.category}</span>` : ""}
        </div>
        <div class="flex items-center gap-2">
          ${isChoukai ? `
            <button onclick="window.app.playQuestionAudio(${q.id})" class="px-2.5 py-1 rounded bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm" title="Putar audio soal ${q.id} (${q.audioDuration || '00:50'})">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <span>Putar Audio (${q.audioDuration || "00:50"})</span>
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
          ${this.currentQuestionIdx === 24 ? "Lanjut ke Sesi Choukai (Soal 26) &rarr;" : "Soal Selanjutnya &rarr;"}
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
              <button onclick="window.app.playQuestionAudio(${q.id})" class="text-[11px] text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-mono font-semibold">
                <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Dengar Ulang Audio Soal ${q.id} (${q.audioDuration || "00:50"})
              </button>
            ` : ""}
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
              <strong class="block mb-1">📘 Poin Kaidah Bab 8:</strong>
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

          <!-- Dual Section Score Badges -->
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

          <!-- WhatsApp Share & Actions -->
          <div class="flex flex-wrap items-center justify-center gap-2.5 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
            <button onclick="window.app.shareResultWhatsApp()" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-sm">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.449.74 0.965 1.2.664.592 1.224.776 1.397.863.173.086.274.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/></svg>
              Kirim Nilai ke Sensei via WhatsApp
            </button>
            <a href="${this.currentChapter.pdfReadingSoalUrl || 'assets/pdf/Salinan Soal Bab 08.pdf'}" target="_blank" class="px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <svg class="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Soal Reading PDF
            </a>
            <a href="${this.currentChapter.pdfReadingKunciUrl || 'assets/pdf/Kunci dan Pembahasan Bab 08.pdf'}" target="_blank" class="px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <svg class="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Kunci Reading PDF
            </a>
            <a href="${this.currentChapter.pdfSoalUrl || 'assets/pdf/Soal Choukai Bab 08.pdf'}" target="_blank" class="px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <svg class="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Soal Choukai PDF
            </a>
            <a href="${this.currentChapter.pdfKunciUrl || 'assets/pdf/Kunci dan Pembahasan Choukai Bab 08.pdf'}" target="_blank" class="px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              Kunci Choukai PDF
            </a>
            <button onclick="window.app.startExam(window.app.currentChapter, 'renshuu')" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition">
              Ulangi Tryout
            </button>
            <button onclick="window.app.view = 'dashboard'; window.app.render();" class="px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition">
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
              <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Seluruh 33 butir soal (Reading & Choukai) berhasil Anda kuasai dengan tepat.</p>
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
