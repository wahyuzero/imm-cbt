/**
 * Data Modul & Bank Soal Choukai CBT Platform
 * Kurikulum IMM Japan テキスト (Bab 08 s.d. Bab 25)
 * Paket Tryout Terpadu Reading (25 Soal) + Choukai (8 Soal) - Total 33 Soal
 */

const CHAPTERS_INDEX = [
  {
    "num": "08",
    "title_ja": "第8課：形容詞と職場の様子（読解・聴解）",
    "title_id": "Bab 08: Tryout Terpadu Reading & Choukai",
    "topic_id": "Tryout Terpadu EPS-TOPIK: Sesi 1 Reading (25 Soal) & Sesi 2 Choukai (8 Soal)",
    "available": true,
    "totalQuestions": 33,
    "audioDuration": "08:35",
    "passingScore": 80,
    "badge": "Tersedia",
    "readingQuestions": 25,
    "choukaiQuestions": 8
  },
  {
    "num": "09",
    "title_ja": "第9課：好き・嫌い・上手・下手",
    "title_id": "Bab 09: Kesukaan & Kemahiran",
    "topic_id": "Kesenangan, Olahraga, Kemampuan Bahasa, Alasan (~から)",
    "available": false,
    "totalQuestions": 8,
    "audioDuration": "08:15",
    "passingScore": 80,
    "badge": "Segera Hadir"
  },
  {
    "num": "10",
    "title_ja": "第10課：存在と位置表現",
    "title_id": "Bab 10: Keberadaan & Letak Benda",
    "topic_id": "います / あります, Posisi Atas, Bawah, Dalam, Luar, Samping",
    "available": false,
    "totalQuestions": 8,
    "audioDuration": "08:20",
    "passingScore": 80,
    "badge": "Segera Hadir"
  },
  {
    "num": "11",
    "title_ja": "第11課：数量詞と期間",
    "title_id": "Bab 11: Satuan Bilangan & Jangka Waktu",
    "topic_id": "Hitungan Jumlah Barang, Orang, Jam, Hari, Frekuensi",
    "available": false,
    "totalQuestions": 8,
    "audioDuration": "08:30",
    "passingScore": 80,
    "badge": "Segera Hadir"
  },
  {
    "num": "12",
    "title_ja": "第12課：比較表現",
    "title_id": "Bab 12: Kalimat Perbandingan",
    "topic_id": "より～のほうが, どちらが, 一番～ (Perbandingan Tempat & Benda)",
    "available": false,
    "totalQuestions": 8,
    "audioDuration": "08:10",
    "passingScore": 80,
    "badge": "Segera Hadir"
  },
  {
    "num": "13",
    "title_ja": "第13課：希望と目的",
    "title_id": "Bab 13: Keinginan & Tujuan Perjalanan",
    "topic_id": "～がほしい, ～たい, ～へ～に行きます",
    "available": false,
    "totalQuestions": 8,
    "audioDuration": "08:25",
    "passingScore": 80,
    "badge": "Segera Hadir"
  },
  {
    "num": "14",
    "title_ja": "第14課：て形と指示・依頼",
    "title_id": "Bab 14: Bentuk Te & Permohonan Kerja",
    "topic_id": "Bentuk -te, ～てください (Instruksi Pabrik & K3)",
    "available": false,
    "totalQuestions": 8,
    "audioDuration": "08:40",
    "passingScore": 80,
    "badge": "Segera Hadir"
  },
  {
    "num": "15",
    "title_ja": "第15課：許可と禁止",
    "title_id": "Bab 15: Izin & Larangan",
    "topic_id": "～てもいいです, ～てはいけません (Aturan K3 & Keamanan)",
    "available": false,
    "totalQuestions": 8,
    "audioDuration": "08:15",
    "passingScore": 80,
    "badge": "Segera Hadir"
  },
  {
    "num": "16",
    "title_ja": "第16課：動作の順序と方法",
    "title_id": "Bab 16: Urutan Aksi & Metode",
    "topic_id": "～てから, ～て、～て, Bagaimana Cara Mengoperasikan Mesin",
    "available": false,
    "totalQuestions": 8,
    "audioDuration": "08:30",
    "passingScore": 80,
    "badge": "Segera Hadir"
  },
  {
    "num": "17",
    "title_ja": "第17課：ない形と義務",
    "title_id": "Bab 17: Bentuk Nai & Kewajiban",
    "topic_id": "～ないでください, ～なければなりません (Disiplin Kerja)",
    "available": false,
    "totalQuestions": 8,
    "audioDuration": "08:35",
    "passingScore": 80,
    "badge": "Segera Hadir"
  },
  {
    "num": "18",
    "title_ja": "第18課：辞書形と能力・趣味",
    "title_id": "Bab 18: Bentuk Kamus & Kemampuan",
    "topic_id": "～ことができます, 趣味は～ことです, ～の前に",
    "available": false,
    "totalQuestions": 8,
    "audioDuration": "08:20",
    "passingScore": 80,
    "badge": "Segera Hadir"
  },
  {
    "num": "19",
    "title_ja": "第19課：た形と経験",
    "title_id": "Bab 19: Bentuk Ta & Pengalaman",
    "topic_id": "～たことがあります, ～たり～たりします, ～くなります",
    "available": false,
    "totalQuestions": 8,
    "audioDuration": "08:25",
    "passingScore": 80,
    "badge": "Segera Hadir"
  },
  {
    "num": "20",
    "title_ja": "第20課：普通形と会話",
    "title_id": "Bab 20: Bentuk Biasa (Futsuukei)",
    "topic_id": "Percakapan Kasual antar Rekan Asrama & Pabrik",
    "available": false,
    "totalQuestions": 8,
    "audioDuration": "08:15",
    "passingScore": 80,
    "badge": "Segera Hadir"
  },
  {
    "num": "21",
    "title_ja": "第21課：意見と推量",
    "title_id": "Bab 21: Pendapat & Dugaan",
    "topic_id": "～と思います, ～と言いました, ～でしょう",
    "available": false,
    "totalQuestions": 8,
    "audioDuration": "08:30",
    "passingScore": 80,
    "badge": "Segera Hadir"
  },
  {
    "num": "22",
    "title_ja": "第22課：連体修飾",
    "title_id": "Bab 22: Modifikasi Frasa Benda",
    "topic_id": "Kalimat Penjelas Kata Benda (Benda/Orang yang Dilakukan)",
    "available": false,
    "totalQuestions": 8,
    "audioDuration": "08:40",
    "passingScore": 80,
    "badge": "Segera Hadir"
  },
  {
    "num": "23",
    "title_ja": "第23課：時と条件",
    "title_id": "Bab 23: Waktu & Hubungan Sebab Akibat",
    "topic_id": "～とき, ～と (Bila Menekan Tombol Mesin)",
    "available": false,
    "totalQuestions": 8,
    "audioDuration": "08:35",
    "passingScore": 80,
    "badge": "Segera Hadir"
  },
  {
    "num": "24",
    "title_ja": "第24課：授受表現",
    "title_id": "Bab 24: Memberi & Menerima Bantuan",
    "topic_id": "くれます, あげます, もらいます (Bantuan Rekan Senior)",
    "available": false,
    "totalQuestions": 8,
    "audioDuration": "08:25",
    "passingScore": 80,
    "badge": "Segera Hadir"
  },
  {
    "num": "25",
    "title_ja": "第25課：仮定条件",
    "title_id": "Bab 25: Pengandaian & Syarat Lanjutan",
    "topic_id": "～たら, ～ても (Syarat & Tindakan Darurat)",
    "available": false,
    "totalQuestions": 8,
    "audioDuration": "08:45",
    "passingScore": 80,
    "badge": "Segera Hadir"
  }
];

const BAB_08_DATA = {
  "chapter": "08",
  "title_ja": "第8課 総合評価試験（読解・聴解）",
  "title_id": "Tryout Terpadu Bab 08 (Reading & Choukai)",
  "theme_ja": "形容詞の活用・名詞修飾と職場の様子",
  "theme_id": "Kata Sifat (I & Na), Modifikasi Nomina & Suasana Tempat Kerja",
  "audioSrc": "assets/Choukai_Bab_08.mp3",
  "pdfSoalUrl": "assets/pdf/Soal Choukai Bab 08.pdf",
  "pdfKunciUrl": "assets/pdf/Kunci dan Pembahasan Choukai Bab 08.pdf",
  "pdfReadingSoalUrl": "assets/pdf/Salinan Soal Bab 08.pdf",
  "pdfReadingKunciUrl": "assets/pdf/Kunci dan Pembahasan Bab 08.pdf",
  "passingGrade": 80,
  "totalQuestions": 33,
  "readingCount": 25,
  "choukaiCount": 8,
  "questions": [
    {
      "id": 1,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kata Sifat Karakter Na-Keiyoushi",
      "type": "teks",
      "question_ja": "ウテンさんは とても （　<strong>親切</strong>　）です。「親切」の 意味は どれですか。",
      "question_ruby": "ウテンさんは とても （　<strong>親切</strong>　）です。「親切」の 意味は どれですか。",
      "question_id": "Kata sifat yang dicetak tebal memiliki arti...",
      "translation": "Uten-san sangat ramah/baik hati. 'Shinsetsu' bermakna ramah / baik hati.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Tampan / gagah"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Ramah / baik hati"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Ceria / aktif"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Tenang / pendiam"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (Ramah / baik hati).",
        "logic": "Kata sifat golongan Na (な形容詞) <strong>親切（しんせつ - shinsetsu）</strong> berarti <strong>ramah, baik hati, suka menolong</strong>. Sifat ini sering digunakan untuk mendeskripsikan senior atau instruktur pabrik di Jepang.",
        "distractor": "• Opsi A: Tampan / rupawan adalah ハンサム (hansamu).\n• Opsi C: Ceria / bersemangat adalah 明るい (あかるい) atau 元気 (げんき).\n• Opsi D: Tenang / hening adalah 静か (しずか).",
        "grammarRule": "Kata Sifat Na Bab 8: 親切 (しんせつ - ramah), 元気 (げんき - sehat/ceria), 有名 (ゆうめい - terkenal), 静か (しずか - tenang), にぎやか (ramai)."
      }
    },
    {
      "id": 2,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Cara Baca Kanji",
      "type": "teks",
      "question_ja": "アグスさんは いつも （　<strong>元気</strong>　）です。「元気」の 読み方は どれですか。",
      "question_ruby": "アグスさんは いつも （　<strong>元気</strong>　）です。「元気」の 読み方は どれですか。",
      "question_id": "Cara baca kanji yang benar untuk 'genki' (sehat/bersemangat) adalah...",
      "translation": "Agus-san selalu bersemangat dan sehat. Kanji 元気 dibaca genki.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "てんき"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "くうき"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "げんき"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "でんき"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (げんき).",
        "logic": "Kanji <strong>元気</strong> dibaca <strong>げんき (genki)</strong> yang berarti <strong>sehat fisik dan bersemangat mental</strong>. Terdiri dari kanji 元 (asal/dasar) dan 気 (energi/hawa).",
        "distractor": "• Opsi A: てんき adalah cara baca 天気 (cuaca).\n• Opsi B: くうき adalah cara baca 空気 (udara / atmosfer).\n• Opsi D: でんき adalah cara baca 電気 (listrik).",
        "grammarRule": "Derivasi Kanji 気 Bab 8: 元気（げんき - sehat）, 天気（てんき - cuaca）, 空気（くうき - udara）, 電気（でんき - listrik）."
      }
    },
    {
      "id": 3,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kata Sifat Suhu I-Keiyoushi",
      "type": "teks",
      "question_ja": "バンドゥンは （　<strong>すずしい</strong>　）町です。「すずしい」の 意味は どれですか。",
      "question_ruby": "バンドゥンは （　<strong>すずしい</strong>　）町です。「すずしい」の 意味は どれですか。",
      "question_id": "Kata sifat suhu yang dicetak tebal bermakna...",
      "translation": "Bandung adalah kota yang sejuk. 'Suzushii' bermakna sejuk.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Sejuk / nyaman suhunya"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Panas terik"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Dingin membeku"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Hangat menyenangkan"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (Sejuk / nyaman suhunya).",
        "logic": "Kata sifat I <strong>涼しい（すずしい - suzushii）</strong> berarti <strong>sejuk / nyaman (suhu udara lingkungan)</strong>. Dalam teks Bab 8, kota Bandung digambarkan sebagai kota yang sejuk dan asri.",
        "distractor": "• Opsi B: Panas udara adalah 暑い (あつい - atsui).\n• Opsi C: Dingin udara adalah 寒い (さむい - samui).\n• Opsi D: Hangat udara adalah 暖かい (あたたかい - atatakai).",
        "grammarRule": "Kata Sifat Suhu Bab 8: 暑い（あつい - panas）, 寒い（さむい - dingin）, 涼しい（すずしい - sejuk）, 暖かい（あたたかい - hangat）."
      }
    },
    {
      "id": 4,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Cara Baca Kanji",
      "type": "teks",
      "question_ja": "ウテンさんは 背が （　<strong>高い</strong>　）です。「高い」の 読み方は どれですか。",
      "question_ruby": "ウテンさんは 背が （　<strong>高い</strong>　）です。「高い」の 読み方は どれですか。",
      "question_id": "Cara baca kanji yang benar untuk 'takai' adalah...",
      "translation": "Uten-san postur tubuhnya tinggi. Kanji 高い dibaca takai.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "ひくい"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "やすい"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "おもい"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "たかい"
        }
      ],
      "correctAnswer": "D",
      "explanation": {
        "summary": "Jawaban yang benar adalah D (たかい).",
        "logic": "Kanji <strong>高い</strong> dibaca <strong>たかい (takai)</strong> yang bermakna <strong>tinggi (secara fisik)</strong> ataupun <strong>mahal (secara harga)</strong>. Ungkapan 背が高い (se ga takai) berarti berbadan tinggi.",
        "distractor": "• Opsi A: ひくい adalah 低い (pendek/rendah).\n• Opsi B: やすい adalah 安い (murah).\n• Opsi C: おもい adalah 重い (berat).",
        "grammarRule": "Makna Ganda Takai: 1) 背が高い (postur tinggi), 2) 値段が高い (harga mahal). Lawan katanya: 低い (rendah) / 安い (murah)."
      }
    },
    {
      "id": 5,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kata Sifat Kesibukan Kerja",
      "type": "teks",
      "question_ja": "工場の 仕事は （　<strong>いそがしい</strong>　）ですが、おもしろいです。「いそがしい」の 漢字は どれですか。",
      "question_ruby": "工場の 仕事は （　<strong>いそがしい</strong>　）ですが、おもしろいです。「いそがしい」の 漢字は どれですか。",
      "question_id": "Penulisan kanji yang benar untuk 'isogashii' (sibuk) adalah...",
      "translation": "Pekerjaan di pabrik sibuk, tetapi menarik. Kanji isogashii adalah 忙しい.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "新しい"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "忙しい"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "古い"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "面白い"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (忙しい).",
        "logic": "Kata sifat I <strong>いそがしい (isogashii)</strong> ditulis dengan kanji <strong>忙しい</strong> yang bermakna <strong>sibuk / banyak pekerjaan</strong>.",
        "distractor": "• Opsi A: 新しい dibaca あたらしい (atarashii - baru).\n• Opsi C: 古い dibaca ふるい (furui - lama/kuno).\n• Opsi D: 面白い dibaca おもしろい (omoshiroi - menarik/menyenangkan).",
        "grammarRule": "Kata Sifat Kondisi Kerja Bab 8: 忙しい (sibuk), 大変 [な] (berat/sukar), 面白い (menarik), 暇 [な] (luang/senggang)."
      }
    },
    {
      "id": 6,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kata Sifat Suasana Lingkungan",
      "type": "teks",
      "question_ja": "バンコクは とても （　<strong>にぎやか</strong>　）な ところです。「にぎやか」の 意味は どれですか。",
      "question_ruby": "バンコクは とても （　<strong>にぎやか</strong>　）な ところです。「にぎやか」の 意味は どれですか。",
      "question_id": "Kata sifat Na yang dicetak tebal memiliki arti...",
      "translation": "Bangkok adalah tempat yang sangat ramai/meriah. 'Nigiyaka' bermakna ramai.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Sepi dan gelap"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Kotor dan berdebu"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Ramai / meriah"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Jauh dan terpencil"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (Ramai / meriah).",
        "logic": "Kata sifat Na <strong>にぎやか（な） (nigiyaka)</strong> bermakna <strong>ramai, bising oleh aktivitas manusia, hidup, dan meriah</strong>. Lawan katanya adalah <strong>静か（しずか - shizuka = sunyi/tenang）</strong>.",
        "distractor": "• Opsi A: Sepi/tenang adalah 静か (しずか - shizuka).\n• Opsi B: Kotor adalah 汚い (きたない - kitanai).\n• Opsi D: Jauh adalah 遠い (とおい - tooi).",
        "grammarRule": "Antonim Suasana Bab 8: にぎやか [な] (ramai/meriah) >< 静か [な] (tenang/sunyi)."
      }
    },
    {
      "id": 7,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Antonim Kata Sifat",
      "type": "teks",
      "question_ja": "『この 寮は <strong>新しい</strong>です。』「新しい」の 反対（はんたい）の 言葉は どれですか。",
      "question_ruby": "『この 寮は <strong>新しい</strong>です。』「新しい」の 反対（はんたい）の 言葉は どれですか。",
      "question_id": "Lawan kata (antonim) dari kata sifat 'atarashii' (baru) adalah...",
      "translation": "'Asrama ini baru.' Lawan kata dari 'atarashii' (baru) adalah 'furui' (lama/kuno).",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "古い（ふるい）"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "大きい（おおきい）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "小さい（ちいさい）"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "高い（たかい）"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (古い（ふるい）).",
        "logic": "Kata sifat <strong>新しい（あたらしい - atarashii = baru）</strong> berantonim dengan <strong>古い（ふるい - furui = lama / usang / kuno）</strong>. Catatan: 古い hanya digunakan untuk benda, tidak dipakai untuk umur manusia.",
        "distractor": "• Opsi B: 大きい berantonim dengan 小さい (ちいさい).\n• Opsi C: 小さい berantonim dengan 大きい (おおきい).\n• Opsi D: 高い berantonim dengan 安い (やすい) atau 低い (ひくい).",
        "grammarRule": "Pasangan Antonim I-Keiyoushi Bab 8: 新しい (baru) >< 古い (lama); 大きい (besar) >< 小さい (kecil); 高い (tinggi/mahal) >< 低い (rendah) / 安い (murah)."
      }
    },
    {
      "id": 8,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Subjek Karakteristik Fisik (Ga)",
      "type": "teks",
      "question_ja": "ウテンさんは 背（　<strong>？</strong>　） 高いです。",
      "question_ruby": "ウテンさんは 背（　<strong>？</strong>　） 高いです。",
      "question_id": "Partikel yang tepat untuk menghubungkan bagian tubuh dengan kata sifat predikatnya adalah...",
      "translation": "Uten-san berpostur badan tinggi. Partikel penanda subjek sifat tubuh adalah が.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "を"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "で"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "に"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "が"
        }
      ],
      "correctAnswer": "D",
      "explanation": {
        "summary": "Jawaban yang benar adalah D (が).",
        "logic": "Dalam pola kalimat pendeskripsian ciri fisik atau atribut spesifik dari suatu topik subjek: <code>[Topik は] [Bagian Tubuh/Atribut が] [Kata Sifat] です</code>. Contoh: ウテンさんは背<strong>が</strong>高いです (Uten punggung/badannya tinggi).",
        "distractor": "• Opsi A: を hanya untuk objek penderita verba transitif, tidak pernah dipasangkan dengan kata sifat.\n• Opsi B: で menandai alat atau tempat aktivitas.\n• Opsi C: に menandai titik waktu, arah sasaran, atau tempat keberadaan.",
        "grammarRule": "Pola Ciri Fisik Bab 8: [Topik は] + [Atribut Fisik が] + [Kata Sifat です] (背が高い, 目が大きい, 髪が長い)."
      }
    },
    {
      "id": 9,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Konjungsi Pertentangan (Ga)",
      "type": "teks",
      "question_ja": "げんばの 仕事は たいへんです（　<strong>？</strong>　）、おもしろいです。",
      "question_ruby": "げんばの 仕事は たいへんです（　<strong>？</strong>　）、おもしろいです。",
      "question_id": "Partikel konjungsi yang menyatakan makna pertentangan 'tetapi / namun' adalah...",
      "translation": "Pekerjaan lapangan berat, tetapi menarik. Partikel pertentangan adalah が.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "から"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "が"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "と"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "も"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (が).",
        "logic": "Partikel penyambung <strong>が (ga)</strong> yang diletakkan di akhir klausa pertama berfungsi sebagai <strong>konjungsi pertentangan (tetapi / namun)</strong> yang menghubungkan dua pernyataan berkebalikan (たいへんです [negatif/berat] + が + おもしろいです [positif/menarik]).",
        "distractor": "• Opsi A: から menyatakan alasan / sebab-akibat ('karena').\n• Opsi C: と untuk menyambungkan dua nomina setara ('dan').\n• Opsi D: も berarti 'juga / pun'.",
        "grammarRule": "Konjungsi Kalimat Bab 8: [Klausa A] が、[Klausa B] = [Klausa A], tetapi [Klausa B]."
      }
    },
    {
      "id": 10,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Sebab / Alasan (Kara)",
      "type": "teks",
      "question_ja": "バンドゥンは みどりが 多いです（　<strong>？</strong>　）、空気も きれいです。",
      "question_ruby": "バンドゥンは みどりが 多いです（　<strong>？</strong>　）、空気も きれいです。",
      "question_id": "Partikel penyambung klausa yang menyatakan alasan 'karena' adalah...",
      "translation": "Karena di Bandung banyak pepohonan hijau, udaranya pun bersih. Partikel alasan adalah から.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "で"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "へ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "から"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "まで"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (から).",
        "logic": "Partikel penghubung <strong>から (kara)</strong> yang diletakkan setelah predikat (多いですから) bermakna <strong>'karena / sebab'</strong>, menyatakan bahwa klausa pertama adalah penyebab timbulnya keadaan pada klausa kedua (空気もきれいです).",
        "distractor": "• Opsi A: で tidak dapat digunakan langsung setelah bentuk です untuk alasan pada pola dasar ini.\n• Opsi B: へ menandai arah pergerakan.\n• Opsi D: まで menandai batas akhir waktu atau tempat.",
        "grammarRule": "Partikel Alasan Bab 8: [Sebab/Alasan] から、[Akibat/Keadaan]."
      }
    },
    {
      "id": 11,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Kepemilikan & Penjelas Nomina (No)",
      "type": "teks",
      "question_ja": "ウテンさんは ふじきかい（　<strong>？</strong>　） 実習生です。",
      "question_ruby": "ウテンさんは ふじきかい（　<strong>？</strong>　） 実習生です。",
      "question_id": "Partikel yang tepat untuk menghubungkan nama perusahaan dengan status peserta magang adalah...",
      "translation": "Uten-san adalah peserta magang perusahaan Fuji Kikai. Partikel penghubung afiliasi adalah の.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "の"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "に"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "で"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "を"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (の).",
        "logic": "Partikel <strong>の (no)</strong> menghubungkan dua kata benda di mana kata benda pertama (ふじきかい) menjelaskan afiliasi atau instansi asal dari kata benda kedua (実習生). Pola: <code>[Organisasi] の [Status Orang]</code>.",
        "distractor": "• Opsi B: に salah konteks predikat nomina.\n• Opsi C: で menandai tempat aktivitas gerak.\n• Opsi D: を menandai objek penderita kalimat transitif.",
        "grammarRule": "Fungsi Partikel の Bab 8: Modifikasi antar-nomina (会社の名前, ふじきかいの実習生, バンコクのじゅうたい)."
      }
    },
    {
      "id": 12,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Aditif 'Juga' (Mo)",
      "type": "teks",
      "question_ja": "バンドゥンは すずしいです。そして、空気（　<strong>？</strong>　） きれいです。",
      "question_ruby": "バンドゥンは すずしいです。そして、空気（　<strong>？</strong>　） きれいです。",
      "question_id": "Partikel yang tepat untuk menyatakan makna aditif 'juga / pun' adalah...",
      "translation": "Bandung sejuk. Dan lagi, udaranya pun (juga) bersih. Partikel penambah kesamaan adalah も.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "は"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "が"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "を"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "も"
        }
      ],
      "correctAnswer": "D",
      "explanation": {
        "summary": "Jawaban yang benar adalah D (も).",
        "logic": "Partikel <strong>も (mo)</strong> menggantikan partikel topik/subjek (は / が) untuk menyatakan bahwa predikat sifat yang sama atau sejalan <strong>juga berlaku</strong> untuk hal yang sedang dibicarakan. Contoh: 空気のきれいさ (kebersihan udara) juga merupakan kelebihan tambahan Bandung.",
        "distractor": "• Opsi A: は penanda topik biasa yang bersifat netral atau kontras.\n• Opsi B: が penanda subjek dasar tanpa nuansa aditif 'juga'.\n• Opsi C: を salah karena きれいです adalah kata sifat, bukan verba transitif.",
        "grammarRule": "Partikel も Kalimat Sifat: Menggantikan は/が untuk menyiratkan 'juga/pun' dalam rangkaian kalimat positif."
      }
    },
    {
      "id": 13,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Penanda Topik Kalimat Evaluatif (Wa)",
      "type": "teks",
      "question_ja": "指導員：『アグスさん、日本の 冬（　<strong>？</strong>　） どうですか。』<br>アグス：『とても さむいです。』",
      "question_ruby": "指導員：『アグスさん、日本の 冬（　<strong>？</strong>　） どうですか。』<br>アグス：『とても さむいです。』",
      "question_id": "Partikel yang tepat untuk mengangkat 'musim dingin Jepang' sebagai topik evaluasi adalah...",
      "translation": "Instruktur: 'Agus-san, bagaimana dengan musim dingin Jepang?' Agus: 'Sangat dingin.'",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "で"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "は"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "に"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "を"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (は).",
        "logic": "Dalam menanyakan kesan atau keadaan suatu hal dengan pola tanya <code>～はどうですか</code>, hal yang dimintai evaluasi diangkat sebagai topik pembicaraan menggunakan partikel <strong>は (wa)</strong>. Pola: <code>[Topik] は どうですか</code>.",
        "distractor": "• Opsi A: で menandai tempat aksi atau sarana.\n• Opsi C: に menandai titik waktu atau arah.\n• Opsi D: を tidak digunakan dengan kata sifat/tanya evaluatif.",
        "grammarRule": "Pola Tanya Kesan Bab 8: [Topik] + は + どうですか = Bagaimana [Topik] menurut Anda?"
      }
    },
    {
      "id": 14,
      "session": "reading",
      "section_ja": "第3部：読解・文法（形容詞）",
      "section_id": "Sesi 1: Reading — Bunpo (Tata Bahasa)",
      "category": "Konjugasi Negatif I-Keiyoushi",
      "type": "teks",
      "question_ja": "この 辞書は （　<strong>＿＿＿＿＿</strong>　）。（新しい：Bentuk Negatif Kini）",
      "question_ruby": "この 辞書は （　<strong>＿＿＿＿＿</strong>　）。（新しい：Bentuk Negatif Kini）",
      "question_id": "Bentuk penyangkalan negatif kini yang tepat untuk kata sifat 'atarashii' (baru) adalah...",
      "translation": "Kamus ini tidak baru. Bentuk negatif kini dari atarashii adalah atarashikunai desu.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "新しくありませんでした"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "新しじゃないです"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "新しくないです"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "新しいではありません"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (新しくないです).",
        "logic": "Aturan konjugasi negatif untuk kata sifat golongan I (イ形容詞): huruf vokal akhir <strong>～い</strong> dihilangkan dan diganti dengan <strong>～くないです</strong> (atau ～くありません). Jadi <code>新しい → 新しくないです</code>.",
        "distractor": "• Opsi A: 新しくありませんでした adalah bentuk lampau negatif ('dulu tidak baru').\n• Opsi B: 新しじゃないです adalah konjugasi keliru (pencampuran aturan Na pada kata sifat I).\n• Opsi D: 新しいではありません salah fatal karena bentuk ではありません khusus untuk kata sifat Na dan nomina.",
        "grammarRule": "Rumus Negatif I-Keiyoushi Bab 8: [Kata Sifat I tanpa い] + くないです (高い -> 高くないです; 寒い -> 寒くないです)."
      }
    },
    {
      "id": 15,
      "session": "reading",
      "section_ja": "第3部：読解・文法（形容詞）",
      "section_id": "Sesi 1: Reading — Bunpo (Tata Bahasa)",
      "category": "Konjugasi Khusus Kata Sifat 'Ii' (Bagus)",
      "type": "teks",
      "question_ja": "この カメラは あまり （　<strong>＿＿＿＿＿</strong>　）。（いい：Bentuk Negatif）",
      "question_ruby": "この カメラは あまり （　<strong>＿＿＿＿＿</strong>　）。（いい：Bentuk Negatif）",
      "question_id": "Bentuk negatif baku yang tepat untuk kata sifat 'ii' (bagus/baik) adalah...",
      "translation": "Kamera ini tidak begitu bagus. Bentuk negatif dari 'ii' adalah yokunai desu.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "よくないです"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "いくないです"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "いいじゃないです"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "いいではありません"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (よくないです).",
        "logic": "Kata sifat <strong>いい (ii = bagus/baik)</strong> memiliki bentuk dasar historis <strong>よい (yoi)</strong>. Setiap kali kata sifat ini mengalami konjugasi/perubahan bentuk (negatif, lampau, sambung), wajib berpijak pada akar <strong>よ~</strong>: bentuk negatifnya adalah <strong>よくないです (yokunai desu)</strong>, BUKAN ikunai desu.",
        "distractor": "• Opsi B: いくないです adalah kesalahan bentuk yang paling sering dibuat oleh pemula (bentuk ini tidak ada dalam bahasa Jepang baku).\n• Opsi C: いいじゃないです salah aturan konjugasi.\n• Opsi D: いいではありません salah penerapan pola.",
        "grammarRule": "Pengecualian Mutlak Bab 8: いい (bagus) -> Negatif: よくないです / Lampau: よかったです."
      }
    },
    {
      "id": 16,
      "session": "reading",
      "section_ja": "第3部：読解・文法（形容詞）",
      "section_id": "Sesi 1: Reading — Bunpo (Tata Bahasa)",
      "category": "Konjugasi Negatif Na-Keiyoushi",
      "type": "teks",
      "question_ja": "ジャカルタは （　<strong>＿＿＿＿＿</strong>　）。（静か：Bentuk Negatif Sopan）",
      "question_ruby": "ジャカルタは （　<strong>＿＿＿＿＿</strong>　）。（静か：Bentuk Negatif Sopan）",
      "question_id": "Bentuk penyangkalan negatif kini yang tepat untuk kata sifat 'shizuka' (tenang) adalah...",
      "translation": "Jakarta tidak tenang / tidak sepi. Bentuk negatif baku dari shizuka adalah shizuka dewa arimasen.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "静かいくないです"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "静かじゃないでした"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "静かでした"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "静かではありません"
        }
      ],
      "correctAnswer": "D",
      "explanation": {
        "summary": "Jawaban yang benar adalah D (静かではありません).",
        "logic": "Kata sifat golongan Na (ナ形容詞) mengikuti pola konjugasi yang persis sama dengan kata benda (nomina). Bentuk penyangkalan sopan resminya adalah <code>[Akar Kata Sifat Na] + ではありません (atau じゃありません)</code>. Maka <code>静か → 静かではありません</code>.",
        "distractor": "• Opsi A: 静かいくないです salah fatal karena menerapkan aturan konjugasi I-keiyoushi pada Na-keiyoushi.\n• Opsi B: 静かじゃないでした tata bahasanya rusak (seharusnya じゃありませんでした untuk lampau).\n• Opsi C: 静かでした adalah bentuk positif lampau ('dulu tenang').",
        "grammarRule": "Rumus Negatif Na-Keiyoushi Bab 8: [Kata Sifat Na] + ではありません / じゃありません (元気ではありません, 有名じゃありません)."
      }
    },
    {
      "id": 17,
      "session": "reading",
      "section_ja": "第3部：読解・文法（形容詞）",
      "section_id": "Sesi 1: Reading — Bunpo (Tata Bahasa)",
      "category": "Modifikasi Nomina oleh Na-Keiyoushi",
      "type": "teks",
      "question_ja": "ワティさんは （　<strong>＿＿＿＿＿</strong>　）人です。（親切：Modifikasi Nomina）",
      "question_ruby": "ワティさんは （　<strong>＿＿＿＿＿</strong>　）人です。（親切：Modifikasi Nomina）",
      "question_id": "Bentuk penggabungan kata sifat 'shinsetsu' (ramah) untuk menerangkan kata benda 'hito' (orang) adalah...",
      "translation": "Wati-san adalah orang yang ramah. Modifikasi nomina memakai partikel な: shinsetsu na hito.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "親切の"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "親切な"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "親切い"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "親切で"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (親切な).",
        "logic": "Ketika kata sifat golongan Na digunakan untuk menerangkan kata benda (modifikasi nomina atributif), di antara kata sifat dan kata benda wajib disisipkan partikel <strong>な (na)</strong>. Inilah alasan mengapa kelompok ini disebut <em>Na-keiyoushi</em>. Pola: <code>[Na-keiyoushi] + な + [Kata Benda]</code>. Contoh: 親切<strong>な</strong>人 (orang yang ramah).",
        "distractor": "• Opsi A: 親切の salah karena kata sifat Na tidak menggunakan partikel の saat menerangkan nomina.\n• Opsi C: 親切い salah karena shinsetsu bukan kata sifat I.\n• Opsi D: 親切で adalah bentuk te-sambung (te-kei) antar-predikat, bukan modifikasi frasa nomina langsung.",
        "grammarRule": "Kaidah Modifikasi Kata Sifat Na Bab 8: [Kata Sifat Na] + な + [Nomina] (親切な人, 有名な山, 静かな町, きれいな部屋)."
      }
    },
    {
      "id": 18,
      "session": "reading",
      "section_ja": "第3部：読解・文法（形容詞）",
      "section_id": "Sesi 1: Reading — Bunpo (Tata Bahasa)",
      "category": "Modifikasi Nomina oleh I-Keiyoushi",
      "type": "teks",
      "question_ja": "アユタヤは （　<strong>＿＿＿＿＿</strong>　）町です。（古い：Modifikasi Nomina）",
      "question_ruby": "アユタヤは （　<strong>＿＿＿＿＿</strong>　）町です。（古い：Modifikasi Nomina）",
      "question_id": "Bentuk penggabungan kata sifat 'furui' (kuno/tua) untuk menerangkan kata benda 'machi' (kota) adalah...",
      "translation": "Ayutthaya adalah kota tua bersejarah. Modifikasi nomina kata sifat I: furui machi.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "古い"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "古いの"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "古いな"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "古く"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (古い).",
        "logic": "Ketika kata sifat golongan I menerangkan kata benda secara langsung, kata sifat tersebut <strong>langsung menempel tanpa perubahan bentuk dan tanpa tambahan partikel apa pun</strong> (akhiran ～い tetap dipertahankan). Pola: <code>[I-keiyoushi] + [Nomina]</code>. Contoh: <strong>古い町</strong> (kota tua), <strong>新しい寮</strong> (asrama baru).",
        "distractor": "• Opsi B: 古いの salah karena kata sifat I tidak boleh ditambahkan partikel の di depannya.\n• Opsi C: 古いな salah karena akhiran な hanya khusus untuk kata sifat Na.\n• Opsi D: 古く adalah bentuk adverbia/sambung, bukan penerang nomina.",
        "grammarRule": "Kaidah Modifikasi Kata Sifat I Bab 8: [Kata Sifat I (akhiran い tetap)] + [Nomina] (高いかばん, 小さい靴, 新しい寮, 古い町)."
      }
    },
    {
      "id": 19,
      "session": "reading",
      "section_ja": "第3部：読解・文法（形容詞）",
      "section_id": "Sesi 1: Reading — Bunpo (Tata Bahasa)",
      "category": "Korelatif Adverbia Derajat (Amari + Negatif)",
      "type": "teks",
      "question_ja": "アグスさん：『今日、仕事は 忙しいですか。』<br>ダダンさん：『いいえ、あまり（　<strong>＿＿＿＿＿</strong>　）。』",
      "question_ruby": "アグスさん：『今日、仕事は 忙しいですか。』<br>ダダンさん：『いいえ、あまり（　<strong>＿＿＿＿＿</strong>　）。』",
      "question_id": "Bentuk predikat yang tepat berpasangan dengan kata keterangan 'amari' (tidak begitu...) adalah...",
      "translation": "Agus-san: 'Hari ini apakah pekerjaannya sibuk?' Dadan-san: 'Tidak, tidak begitu sibuk.' Pasangan: 忙しくないです.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "忙しいです"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "忙しかったです"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "忙しくないです"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "忙しいでした"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (忙しくないです).",
        "logic": "Adverbia derajat <strong>あまり (amari)</strong> memiliki ketentuan gramatikal mutlak: <strong>selalu berkorelasi dengan predikat bentuk negatif</strong> untuk mengekspresikan arti <strong>'tidak begitu / tidak terlalu...'</strong>. Pola: <code>あまり + [Bentuk Negatif Kini]</code>. Contoh: あまり忙しくないです (tidak begitu sibuk).",
        "distractor": "• Opsi A: 忙しいです adalah bentuk positif kini (bertentangan dengan kaidah korelasi negatif amari).\n• Opsi B: 忙しかったです adalah bentuk lampau positif.\n• Opsi D: 忙しいでした adalah kesalahan bentuk yang sering dibuat pemula (pada I-keiyoushi, bentuk lampau adalah ～かったです, bukan ～いでした).",
        "grammarRule": "Pasangan Adverbia Derajat Bab 8: とても + Positif (とても高い = sangat mahal); あまり + Negatif (あまり高くない = tidak begitu mahal)."
      }
    },
    {
      "id": 20,
      "session": "reading",
      "section_ja": "第3部：読解・文法（形容詞）",
      "section_id": "Sesi 1: Reading — Bunpo (Tata Bahasa)",
      "category": "Pola Kalimat Tanya Karakteristik (Donna + Nomina)",
      "type": "teks",
      "question_ja": "スズキさん：『バンドゥンは （　<strong>＿＿＿＿＿</strong>　）町ですか。』<br>アグスさん：『すずしい町です。』",
      "question_ruby": "スズキさん：『バンドゥンは （　<strong>＿＿＿＿＿</strong>　）町ですか。』<br>アグスさん：『すずしい町です。』",
      "question_id": "Kata tanya yang tepat untuk menanyakan karakteristik/sifat dari suatu kata benda adalah...",
      "translation": "Suzuki-san: 'Bandung adalah kota yang seperti apa?' Agus-san: 'Kota yang sejuk.' Kata tanya: どんな.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "どれ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "どう"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "どこ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "どんな"
        }
      ],
      "correctAnswer": "D",
      "explanation": {
        "summary": "Jawaban yang benar adalah D (どんな).",
        "logic": "Kata tanya <strong>どんな (donna)</strong> berarti <strong>'yang seperti apa / bagaimana wujud/karakternya'</strong>. Ciri khasnya adalah <strong>wajib langsung diikuti oleh kata benda</strong>: <code>どんな + [Nomina] ですか</code>. Jawabannya selalu berupa kata benda yang sudah dimodifikasi kata sifat (contoh: すずしい町です).",
        "distractor": "• Opsi A: どれ berarti 'yang mana' (memilih dari pilihan yang ada) dan berdiri sendiri tanpa langsung diikuti nomina.\n• Opsi B: どう berarti 'bagaimana' dan digunakan dalam pola 'バンドゥンはどうですか' (tanpa kata machi di belakangnya).\n• Opsi C: どこ menanyakan tempat/lokasi.",
        "grammarRule": "Perbedaan Pertanyaan Karakteristik Bab 8: [Topik] は どうですか (tanpa nomina belakang) vs [Topik] は どんな + [Nomina] ですか (wajib ada nomina)."
      }
    },
    {
      "id": 21,
      "session": "reading",
      "section_ja": "第4部：読解・図解評価",
      "section_id": "Sesi 1: Reading — Zukai (Evaluasi Bergambar)",
      "category": "Soal Bergambar — Sifat Keadaan Geografis (高い)",
      "type": "gambar",
      "question_ja": "絵（え）を 見て ください。富士山は どんな 山ですか。<br>「富士山は とても （　　　）山です。」",
      "question_ruby": "絵（え）を 見て ください。富士山は どんな 山ですか。<br>「富士山は とても （　　　）山です。」",
      "question_id": "Perhatikan gambar. Gunung Fuji itu gunung yang seperti apa? 'Gunung Fuji adalah gunung yang sangat (...)'.",
      "translation": "Gunung Fuji adalah gunung yang sangat tinggi (takai).",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "ひくい"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "高い（たかい）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "しずかな"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "あたらしい"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (高い（たかい）).",
        "logic": "Gambar menunjukkan kemegahan Gunung Fuji yang menjulang tinggi (高い / たかい - takai).",
        "distractor": "• Opsi A: ひくい adalah rendah.\n• Opsi C: しずかな adalah sepi / tenang.\n• Opsi D: あたらしい adalah baru.",
        "grammarRule": "I-Keiyoushi Bab 8: 高い（たかい = tinggi / mahal）."
      },
      "image": "assets/bab_08/reading_q21.jpeg"
    },
    {
      "id": 22,
      "session": "reading",
      "section_ja": "第4部：読解・図解評価",
      "section_id": "Sesi 1: Reading — Zukai (Evaluasi Bergambar)",
      "category": "Soal Bergambar — Sifat Benda (高いネクタイ)",
      "type": "gambar",
      "question_ja": "絵（え）を 見て ください。この ネクタイは どうですか。<br>「この ネクタイは （　　　）です。」",
      "question_ruby": "絵（え）を 見て ください。この ネクタイは どうですか。<br>「この ネクタイは （　　　）です。」",
      "question_id": "Perhatikan gambar dasi dengan banderol harga tinggi. Bagaimanakah dasi ini? 'Dasi ini (...)'.",
      "translation": "Dasi ini berharga mahal (takai).",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "安い"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "古い"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "高い（たかい）"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "わるい"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (高い（たかい）).",
        "logic": "Gambar menunjukkan dasi sutra mewah dengan label harga tinggi (高い / たかい - takai = mahal).",
        "distractor": "• Opsi A: 安い dibaca やすい (murah).\n• Opsi B: 古い dibaca ふるい (kuno / bekas).\n• Opsi D: わるい adalah buruk / rusak.",
        "grammarRule": "Lawan Kata Bab 8: 高い（たかい = mahal） vs 安い（やすい = murah）."
      },
      "image": "assets/bab_08/reading_q22.jpeg"
    },
    {
      "id": 23,
      "session": "reading",
      "section_ja": "第5部：読解・漢字",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Cara Baca Kanji (大きい)",
      "type": "teks",
      "question_ja": "この 部品は とても （ 大きい ）です。<br>（　）の 漢字の 正しい 読み方は どれですか。",
      "question_ruby": "この 部品は とても （ 大きい ）です。<br>（　）の 漢字の 正しい 読み方は どれですか。",
      "question_id": "Komponen suku cadang ini sangat besar. Pilihlah cara baca kanji '大きい' yang tepat.",
      "translation": "Komponen suku cadang ini sangat besar.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "おおきい"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "ちいさい"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "おもい"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "ながい"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (おおきい).",
        "logic": "Kanji 大きい dibaca おおきい (ookii) yang berarti besar secara dimensi fisik.",
        "distractor": "• Opsi B: ちいさい ditulis 小さい (kecil).\n• Opsi C: おもい ditulis 重い (berat).\n• Opsi D: ながい ditulis 長い (panjang).",
        "grammarRule": "Kanji Sifat Bab 8: 大きい（おおきい = besar）."
      }
    },
    {
      "id": 24,
      "session": "reading",
      "section_ja": "第5部：読解・漢字",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Penulisan Kanji (新しい)",
      "type": "teks",
      "question_ja": "工場に （ あたらしい ）機械が 入りました。<br>（　）の 言葉の 正しい 漢字は どれですか。",
      "question_ruby": "工場に （ あたらしい ）機械が 入りました。<br>（　）の 言葉の 正しい 漢字は どれですか。",
      "question_id": "Mesin baru telah masuk ke pabrik. Pilihlah penulisan kanji yang tepat untuk 'atarashii'.",
      "translation": "Mesin yang baru telah tiba di pabrik.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "新しい"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "親しい"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "近しい"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "薪しい"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (新しい).",
        "logic": "Kata あたらしい (baru) ditulis dengan kanji 新しい.",
        "distractor": "• Opsi B: 親しい dibaca したしい (akrab / dekat).\n• Opsi C: 近しい dibaca ちかしい.\n• Opsi D: 薪しい adalah huruf tidak baku (makigi/kayu bakar).",
        "grammarRule": "Kanji Sifat Bab 8: 新しい（あたらしい = baru）."
      }
    },
    {
      "id": 25,
      "session": "reading",
      "section_ja": "第5部：読解・漢字",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Pemakaian Kanji dalam Konteks (白い)",
      "type": "teks",
      "question_ja": "実習生は （ しろい ）作業帽を かぶります。<br>正しい 漢字は どれですか。",
      "question_ruby": "実習生は （ しろい ）作業帽を かぶります。<br>正しい 漢字は どれですか。",
      "question_id": "Peserta magang mengenakan topi kerja berwarna putih. Pilihlah kanji yang tepat untuk 'shiroi'.",
      "translation": "Peserta magang mengenakan topi kerja berwarna putih.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "白い"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "百い"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "自い"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "臼い"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (白い).",
        "logic": "Kata しろい (putih) ditulis dengan kanji 白い.",
        "distractor": "• Opsi B: 百い salah karena memakai kanji 百 (hyaku = ratusan).\n• Opsi C: 自い salah karena memakai kanji 自 (ji = diri sendiri).\n• Opsi D: 臼い salah karena memakai kanji 臼 (usu = lesung).",
        "grammarRule": "Warna Bab 8: 白い（しろい = warna putih）."
      }
    },
    {
      "id": 26,
      "type": "gambar",
      "section_ja": "第2部：聴解・イラスト理解",
      "section_id": "Sesi 2: Choukai — Pemahaman Ilustrasi",
      "audioTimestamp": "00:17",
      "audioStartSeconds": 17.4,
      "audioSrc": "assets/audio/bab_08/Choukai_Bab_08_Q1.mp3",
      "audioDuration": "00:47",
      "question_ja": "男の人はどの帽子をかぶりますか。",
      "question_ruby": "<ruby>男<rt>おとこ</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>はどの<ruby>帽子<rt>ぼうし</rt></ruby>をかぶりますか。",
      "question_romaji": "Otoko no hito wa dono boushi o kaburimasu ka.",
      "question_id": "Laki-laki tersebut akan mengenakan topi yang mana?",
      "image": "assets/bab_08/q1.webp?v=4",
      "options": [
        {
          "id": "1",
          "symbol": "①",
          "text_ja": "① 古い白い帽子（めがねなし）",
          "text_id": "Topi putih usang (tanpa kacamata)"
        },
        {
          "id": "2",
          "symbol": "②",
          "text_ja": "② 古い白い帽子（めがねあり）",
          "text_id": "Topi putih usang (dengan kacamata)"
        },
        {
          "id": "3",
          "symbol": "③",
          "text_ja": "③ 新しい青い帽子（めがねなし）",
          "text_id": "Topi biru baru (tanpa kacamata)"
        },
        {
          "id": "4",
          "symbol": "④",
          "text_ja": "④ 新しい青い帽子（めがねあり）",
          "text_id": "Topi biru baru (dengan kacamata)"
        }
      ],
      "correctAnswer": "3",
      "dialogue": [
        {
          "speaker": "Agus (アグス)",
          "text_ja": "鈴木さん、今日の現場では、どの帽子をかぶりますか。この白い帽子はどうですか。",
          "romaji": "Suzuki-san, kyou no genba dewa, dono boushi o kaburimasu ka. Kono shiroi boushi wa dou desu ka.",
          "text_id": "Suzuki-san, di tempat kerja hari ini, topi mana yang harus dipakai? Bagaimana dengan topi putih ini?"
        },
        {
          "speaker": "Suzuki (鈴木)",
          "text_ja": "白い帽子はちょっと古いですから、あそこの新しい青い帽子をかぶってください。",
          "romaji": "Shiroi boushi wa chotto furui desu kara, asoko no atarashii aoi boushi o kabutte kudasai.",
          "text_id": "Topi putih itu sudah agak usang, jadi tolong kenakan topi biru yang baru di sebelah sana."
        },
        {
          "speaker": "Agus (アグス)",
          "text_ja": "はい。めがねも必要ですか。",
          "romaji": "Hai. Megane mo hitsuyou desu ka.",
          "text_id": "Baik. Apakah kacamata pelindung juga diperlukan?"
        },
        {
          "speaker": "Suzuki (鈴木)",
          "text_ja": "今日の現場は明るいですから、めがねはいりませんよ。",
          "romaji": "Kyou no genba wa akarui desu kara, megane wa irimasen yo.",
          "text_id": "Karena area kerja hari ini terang, kacamata tidak diperlukan kok."
        },
        {
          "speaker": "Agus (アグス)",
          "text_ja": "わかりました。じゃあ、青い帽子にします。",
          "romaji": "Wakarimashita. Jaa, aoi boushi ni shimasu.",
          "text_id": "Saya mengerti. Kalau begitu, saya pakai topi yang biru."
        }
      ],
      "explanation": {
        "summary": "Jawaban yang benar adalah ③ (Topi biru baru tanpa kacamata).",
        "logic": "Suzuki-san meminta Agus tidak memakai topi putih karena sudah usang (古いですから) dan menyuruh memakai topi biru yang baru (新しい青い帽子). Ketika ditanya soal kacamata pelindung, Suzuki menjelaskan bahwa tempat kerja hari ini terang (明るいですから), sehingga kacamata tidak diperlukan (めがねはいりません).",
        "distractor": "• Opsi ① & ②: Topi putih ditolak karena usang (古い).\n• Opsi ④: Topi biru benar, tetapi kacamata tidak diperlukan.",
        "grammarRule": "Pola Bab 8: Kata sifat modifikasi nomina (新しい青い帽子) dan partikel alasan ~から (古いですから / 明るいですから)."
      },
      "session": "choukai"
    },
    {
      "id": 27,
      "type": "gambar",
      "section_ja": "第2部：聴解・イラスト理解",
      "section_id": "Sesi 2: Choukai — Pemahaman Ilustrasi",
      "audioTimestamp": "01:12",
      "audioStartSeconds": 72.7,
      "audioSrc": "assets/audio/bab_08/Choukai_Bab_08_Q2.mp3",
      "audioDuration": "00:50",
      "question_ja": "男の人のカバンはどれですか。",
      "question_ruby": "<ruby>男<rt>おとこ</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>のカバンはどれですか。",
      "question_romaji": "Otoko no hito no kaban wa dore desu ka.",
      "question_id": "Tas milik laki-laki tersebut yang mana?",
      "image": "assets/bab_08/q2.webp?v=4",
      "options": [
        {
          "id": "1",
          "symbol": "①",
          "text_ja": "① 上の棚の大きい黒いカバン",
          "text_id": "Rak atas: tas hitam besar"
        },
        {
          "id": "2",
          "symbol": "②",
          "text_ja": "② 上の棚の小さい白いカバン",
          "text_id": "Rak atas: tas putih kecil"
        },
        {
          "id": "3",
          "symbol": "③",
          "text_ja": "③ 下の棚の大きい黒いカバン",
          "text_id": "Rak bawah: tas hitam besar"
        },
        {
          "id": "4",
          "symbol": "④",
          "text_ja": "④ 下の棚の小さい白いカバン",
          "text_id": "Rak bawah: tas putih kecil"
        }
      ],
      "correctAnswer": "4",
      "dialogue": [
        {
          "speaker": "Dadan (ダダン)",
          "text_ja": "田中さん、私のカバンはどこにありますか。",
          "romaji": "Tanaka-san, watashi no kaban wa doko ni arimasu ka.",
          "text_id": "Tanaka-san, di mana tas saya berada?"
        },
        {
          "speaker": "Tanaka (田中)",
          "text_ja": "あそこの棚にありますよ。上ですか、下ですか。",
          "romaji": "Asoko no tana ni arimasu yo. Ue desu ka, shita desu ka.",
          "text_id": "Ada di rak sebelah sana. Di bagian atas atau bawah?"
        },
        {
          "speaker": "Dadan (ダダン)",
          "text_ja": "上の棚ではありません。下の棚です。",
          "romaji": "Ue no tana dewa arimasen. Shita no tana desu.",
          "text_id": "Bukan di rak atas. Di rak bawah."
        },
        {
          "speaker": "Tanaka (田中)",
          "text_ja": "下の棚ですね。あの大きい黒いカバンですか。",
          "romaji": "Shita no tana desu ne. Ano ookii kuroi kaban desu ka.",
          "text_id": "Rak bawah ya. Apakah tas hitam yang besar itu?"
        },
        {
          "speaker": "Dadan (ダダン)",
          "text_ja": "いいえ、あの黒いカバンはアグスさんのです。私のは、小さくて白いカバンです。",
          "romaji": "Iie, ano kuroi kaban wa Agus-san no desu. Watashi no wa, chiisakute shiroi kaban desu.",
          "text_id": "Bukan, tas hitam itu milik Agus-san. Milik saya yang kecil dan berwarna putih."
        },
        {
          "speaker": "Tanaka (田中)",
          "text_ja": "ああ、これですね。どうぞ。",
          "romaji": "Aa, kore desu ne. Douzo.",
          "text_id": "Ah, yang ini ya. Silakan."
        },
        {
          "speaker": "Dadan (ダダン)",
          "text_ja": "ありがとうございます。",
          "romaji": "Arigatou gozaimasu.",
          "text_id": "Terima kasih banyak."
        }
      ],
      "explanation": {
        "summary": "Jawaban yang benar adalah ④ (Rak bawah, tas putih kecil).",
        "logic": "Dadan mengeliminasi rak atas ('上の棚ではありません。下の棚です'). Di rak bawah ada tas hitam besar, namun Dadan menyatakan tas hitam tersebut kepunyaan Agus, sedangkan miliknya adalah yang kecil dan putih ('小さくて白いカバン').",
        "distractor": "• Opsi ① & ②: Salah rak (berada di rak atas).\n• Opsi ③: Berada di rak bawah, tetapi tas hitam besar adalah milik Agus.",
        "grammarRule": "Pola Bab 8: Bentuk penyambung kata sifat-i (~くて) dan penunjuk kepemilikan (~のです)."
      },
      "session": "choukai"
    },
    {
      "id": 28,
      "type": "gambar",
      "section_ja": "第2部：聴解・イラスト理解",
      "section_id": "Sesi 2: Choukai — Pemahaman Ilustrasi",
      "audioTimestamp": "02:11",
      "audioStartSeconds": 131.4,
      "audioSrc": "assets/audio/bab_08/Choukai_Bab_08_Q3.mp3",
      "audioDuration": "00:57",
      "question_ja": "男の人はどの弁当を買いますか。",
      "question_ruby": "<ruby>男<rt>おとこ</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>はどの<ruby>弁当<rt>べんとう</rt></ruby>を<ruby>買<rt>か</rt></ruby>いますか。",
      "question_romaji": "Otoko no hito wa dono bentou o kaimasu ka.",
      "question_id": "Laki-laki tersebut akan membeli bento yang mana?",
      "image": "assets/bab_08/q3.webp?v=4",
      "options": [
        {
          "id": "1",
          "symbol": "①",
          "text_ja": "① 肉の弁当（800円）",
          "text_id": "Bento Daging (800 yen)"
        },
        {
          "id": "2",
          "symbol": "②",
          "text_ja": "② 魚の弁当（500円）",
          "text_id": "Bento Ikan (500 yen)"
        },
        {
          "id": "3",
          "symbol": "③",
          "text_ja": "③ 熱いラーメン（500円）",
          "text_id": "Ramen Panas (500 yen)"
        },
        {
          "id": "4",
          "symbol": "④",
          "text_ja": "④ 冷たいサンドイッチ（500円）",
          "text_id": "Sandwich Dingin (500 yen)"
        }
      ],
      "correctAnswer": "2",
      "dialogue": [
        {
          "speaker": "Sigit (シギット)",
          "text_ja": "鈴木さん、お昼の弁当はどれがいいですか。",
          "romaji": "Suzuki-san, ohiru no bentou wa dore ga ii desu ka.",
          "text_id": "Suzuki-san, bento makan siang mana yang bagus ya?"
        },
        {
          "speaker": "Suzuki (鈴木)",
          "text_ja": "この800円の肉の弁当はどうですか。とてもおいしいですよ。",
          "romaji": "Kono happyaku-en no niku no bentou wa dou desu ka. Totemo oishii desu yo.",
          "text_id": "Bagaimana dengan bento daging seharga 800 yen ini? Sangat enak lho."
        },
        {
          "speaker": "Sigit (シギット)",
          "text_ja": "おいしそうですね。でも、800円はちょっと高いですね。500円ぐらいの安いのがいいです。",
          "romaji": "Oishisou desu ne. Demo, happyaku-en wa chotto takai desu ne. Gohyakuen gurai no yasui no ga ii desu.",
          "text_id": "Kelihatannya enak ya. Tapi 800 yen agak mahal ya. Lebih baik yang murah sekitar 500 yen."
        },
        {
          "speaker": "Suzuki (鈴木)",
          "text_ja": "じゃあ、500円の魚の弁当か、熱いラーメンはどうですか。",
          "romaji": "Jaa, gohyaku-en no sakana no bentou ka, atsui raamen wa dou desu ka.",
          "text_id": "Kalau begitu, bagaimana dengan bento ikan 500 yen, atau ramen panas?"
        },
        {
          "speaker": "Sigit (シギット)",
          "text_ja": "今日はとても暑いですから、熱いラーメンはあまりよくないです。冷たいお茶と一緒に、魚の弁当にします。",
          "romaji": "Kyou wa totemo atsui desu kara, atsui raamen wa amari yokunai desu. Tsumetai ocha to issho ni, sakana no bentou ni shimasu.",
          "text_id": "Hari ini sangat panas, jadi ramen panas kurang pas. Bersama teh dingin, saya pilih bento ikan saja."
        },
        {
          "speaker": "Suzuki (鈴木)",
          "text_ja": "はい、いいですね。",
          "romaji": "Hai, ii desu ne.",
          "text_id": "Ya, pilihan bagus."
        }
      ],
      "explanation": {
        "summary": "Jawaban yang benar adalah ② (Bento Ikan seharga 500 yen).",
        "logic": "Sigit menolak bento daging 800 yen karena mahal (高い) dan mencari yang sekitar 500 yen (安い). Di antara pilihan 500 yen, Sigit menolak ramen panas karena suhu hari ini sangat panas (今日はとても暑いですから、熱いラーメンはあまりよくない), dan memutuskan mengambil bento ikan (魚の弁当にします).",
        "distractor": "• Opsi ①: Ditolak karena terlalu mahal (800 yen).\n• Opsi ③: Ditolak karena kuah panas tidak cocok di hari yang gerah.\n• Opsi ④: Sandwich tidak pernah dipilih.",
        "grammarRule": "Pola Bab 8: Perbandingan harga (高い vs 安い), suhu udara (暑い), suhu makanan (熱い vs 冷たい), dan partikel keputusan ~にします."
      },
      "session": "choukai"
    },
    {
      "id": 29,
      "type": "gambar",
      "section_ja": "第2部：聴解・イラスト理解",
      "section_id": "Sesi 2: Choukai — Pemahaman Ilustrasi",
      "audioTimestamp": "03:16",
      "audioStartSeconds": 196.5,
      "audioSrc": "assets/audio/bab_08/Choukai_Bab_08_Q4.mp3",
      "audioDuration": "00:51",
      "question_ja": "明日のミーティングは何時に始まりますか。",
      "question_ruby": "<ruby>明日<rt>あした</rt></ruby>のミーティングは<ruby>何時<rt>なんじ</rt></ruby>に<ruby>始<rt>はじ</rt></ruby>まりますか。",
      "question_romaji": "Ashita no miitingu wa nanji ni hajimarimasu ka.",
      "question_id": "Rapat besok akan dimulai pada pukul berapa?",
      "image": "assets/bab_08/q4.webp?v=4",
      "options": [
        {
          "id": "1",
          "symbol": "①",
          "text_ja": "① 7時30分（07:30）",
          "text_id": "Pukul 07:30 (Mulai pembersihan)"
        },
        {
          "id": "2",
          "symbol": "②",
          "text_ja": "② 8時00分（08:00）",
          "text_id": "Pukul 08:00 (Rapat dimulai)"
        },
        {
          "id": "3",
          "symbol": "③",
          "text_ja": "③ 8時15分（08:15）",
          "text_id": "Pukul 08:15 (Pengecoh)"
        },
        {
          "id": "4",
          "symbol": "④",
          "text_ja": "④ 8時30分（08:30）",
          "text_id": "Pukul 08:30 (Waktu normal rutin)"
        }
      ],
      "correctAnswer": "2",
      "dialogue": [
        {
          "speaker": "Narong (ナロン)",
          "text_ja": "山田さん、明日の朝のミーティングは何時ですか。いつもは8時半ですね。",
          "romaji": "Yamada-san, ashita no asa no miitingu wa nanji desu ka. Itsumo wa hachi-ji han desu ne.",
          "text_id": "Yamada-san, rapat besok pagi jam berapa ya? Biasanya jam 8:30 kan."
        },
        {
          "speaker": "Yamada (山田)",
          "text_ja": "ええ、いつもは8時半ですが、明日は工場長が早く来ますから、8時に始まります。",
          "romaji": "Ee, itsumo wa hachi-ji han desu ga, ashita wa kouchouchou ga hayaku kimasu kara, hachi-ji ni hajimarimasu.",
          "text_id": "Ya, biasanya jam 8:30, tapi besok kepala pabrik datang lebih awal, jadi akan dimulai jam 8:00."
        },
        {
          "speaker": "Narong (ナロン)",
          "text_ja": "8時ですね。掃除はミーティングの後ですか。",
          "romaji": "Hachi-ji desu ne. Souji wa miitingu no ato desu ka.",
          "text_id": "Jam 8:00 ya. Apakah bersih-bersih dilakukan setelah rapat?"
        },
        {
          "speaker": "Yamada (山田)",
          "text_ja": "いいえ、掃除はミーティングの前です。7時半から8時まで掃除をします。",
          "romaji": "Iie, souji wa miitingu no mae desu. Shichi-ji han kara hachi-ji made souji o shimasu.",
          "text_id": "Bukan, bersih-bersih sebelum rapat. Kita bersih-bersih dari jam 7:30 sampai jam 8:00."
        },
        {
          "speaker": "Narong (ナロン)",
          "text_ja": "わかりました。じゃあ、明日は8時までに準備します。",
          "romaji": "Wakarimashita. Jaa, ashita wa hachi-ji made ni junbi shimasu.",
          "text_id": "Baik, saya mengerti. Kalau begitu besok saya akan bersiap sebelum jam 8:00."
        }
      ],
      "explanation": {
        "summary": "Jawaban yang benar adalah ② (Pukul 08:00 / 8時00分).",
        "logic": "Narong memastikan apakah besok rapat tetap jam 8:30 seperti biasanya (いつもは8時半). Yamada mengoreksi bahwa karena kepala pabrik datang lebih awal (早く来ますから), rapat dimajukan menjadi pukul 8:00 (8時に始まります). Pukul 7:30 adalah dimulainya kegiatan bersih-bersih sebelum rapat.",
        "distractor": "• Opsi ①: 07:30 adalah awal jam bersih-bersih.\n• Opsi ④: 08:30 adalah jadwal hari biasa sebelum diubah.",
        "grammarRule": "Pola Bab 8 & Bab 4: Kata sifat cepat/awal (早い / 早く), pergeseran jadwal (～ですが), dan penanda jam (~時に)."
      },
      "session": "choukai"
    },
    {
      "id": 30,
      "type": "cerita",
      "section_ja": "第2部：聴解・会話・課題理解",
      "section_id": "Sesi 2: Choukai — Pemahaman Percakapan",
      "audioTimestamp": "04:30",
      "audioStartSeconds": 270.7,
      "audioSrc": "assets/audio/bab_08/Choukai_Bab_08_Q5.mp3",
      "audioDuration": "00:57",
      "question_ja": "新しい実習生のサントスさんはどんな人ですか。",
      "question_ruby": "<ruby>新<rt>あたら</rt></ruby>しい<ruby>実習生<rt>じっしゅうせい</rt></ruby>のサントスさんはどんな<ruby>人<rt>ひと</rt></ruby>ですか。",
      "question_romaji": "Atarashii jisshuusei no Santos-san wa donna hito desu ka.",
      "question_id": "Seperti apakah sosok Santos-san, anak magang yang baru?",
      "options": [
        {
          "id": "1",
          "symbol": "①",
          "text_ja": "① 静かで、背が高い人",
          "text_id": "Orang yang pendiam dan bertubuh tinggi"
        },
        {
          "id": "2",
          "symbol": "②",
          "text_ja": "② 静かですが、仕事がまじめな人",
          "text_id": "Orang yang pendiam tetapi rajin bekerja"
        },
        {
          "id": "3",
          "symbol": "③",
          "text_ja": "③ 元気で、明るい人",
          "text_id": "Orang yang bersemangat dan ceria"
        },
        {
          "id": "4",
          "symbol": "④",
          "text_ja": "④ 背が高くて、力がある人",
          "text_id": "Orang yang bertubuh tinggi dan bertenaga"
        }
      ],
      "correctAnswer": "3",
      "dialogue": [
        {
          "speaker": "Tanaka (田中)",
          "text_ja": "アグスさん、新しい実習生のサントスさんはもう現場に来ましたか。",
          "romaji": "Agus-san, atarashii jisshuusei no Santos-san wa mou genba ni kimashita ka.",
          "text_id": "Agus-san, apakah anak magang baru Santos-san sudah datang ke lokasi kerja?"
        },
        {
          "speaker": "Agus (アグス)",
          "text_ja": "はい、来ましたよ。",
          "romaji": "Hai, kimashita yo.",
          "text_id": "Ya, sudah datang kok."
        },
        {
          "speaker": "Tanaka (田中)",
          "text_ja": "サントスさんはどんな人ですか。静かな人ですか。",
          "romaji": "Santos-san wa donna hito desu ka. Shizuka na hito desu ka.",
          "text_id": "Santos-san itu orang yang bagaimana? Apakah orang yang pendiam?"
        },
        {
          "speaker": "Agus (アグス)",
          "text_ja": "いいえ、静かじゃありません。いつも元気で、とても明るい人です。仕事もまじめですよ。",
          "romaji": "Iie, shizuka ja arimasen. Itsumo genki de, totemo akarui hito desu. Shigoto mo majime desu yo.",
          "text_id": "Bukan, tidak pendiam. Orangnya selalu bersemangat dan sangat ceria. Kerjanya juga sungguh-sungguh."
        },
        {
          "speaker": "Tanaka (田中)",
          "text_ja": "そうですか。背が高いですか。",
          "romaji": "Sou desu ka. Se ga takai desu ka.",
          "text_id": "Begitu ya. Apakah badannya tinggi?"
        },
        {
          "speaker": "Agus (アグス)",
          "text_ja": "いいえ、背はあまり高くないですが、力持ちですよ。",
          "romaji": "Iie, se wa amari takakunai desu ga, chikaramochi desu yo.",
          "text_id": "Tidak, badannya tidak begitu tinggi, tetapi tenaganya kuat lho."
        },
        {
          "speaker": "Tanaka (田中)",
          "text_ja": "それは頼もしいですね。",
          "romaji": "Sore wa tanomoshii desu ne.",
          "text_id": "Wah, itu sangat bisa diandalkan ya."
        }
      ],
      "explanation": {
        "summary": "Jawaban yang benar adalah ③ (元気で、明るい人 / Orang yang bersemangat dan ceria).",
        "logic": "Agus membantah dugaan bahwa Santos orang pendiam (いいえ、静かじゃありません). Santos dideskripsikan sebagai orang yang bersemangat dan ceria (いつも元気で、とても明るい人です). Terkait tinggi badan, Agus juga membantah bahwa Santos tinggi (背はあまり高くない).",
        "distractor": "• Opsi ① & ②: Sifat pendiam (静か) sudah dibantah dengan tegas.\n• Opsi ④: Santos tidak bertubuh tinggi.",
        "grammarRule": "Pola Bab 8: Pertanyaan karakter (どんな人), negasi sifat-na (静かじゃありません), dan penyambung sifat-na (~で)."
      },
      "session": "choukai"
    },
    {
      "id": 31,
      "type": "cerita",
      "section_ja": "第2部：聴解・会話・課題理解",
      "section_id": "Sesi 2: Choukai — Pemahaman Percakapan",
      "audioTimestamp": "05:35",
      "audioStartSeconds": 335.8,
      "audioSrc": "assets/audio/bab_08/Choukai_Bab_08_Q6.mp3",
      "audioDuration": "00:50",
      "question_ja": "今日の午前中の天気はどうですか。",
      "question_ruby": "<ruby>今日<rt>きょう</rt></ruby>の<ruby>午前中<rt>ごぜんちゅう</rt></ruby>の<ruby>天気<rt>てんき</rt></ruby>はどうですか。",
      "question_romaji": "Kyou no gozenchuu no tenki wa dou desu ka.",
      "question_id": "Bagaimanakah cuaca pada pagi/siang hari ini?",
      "options": [
        {
          "id": "1",
          "symbol": "①",
          "text_ja": "① 暖かくて、天気がいい",
          "text_id": "Hangat dan cuacanya cerah"
        },
        {
          "id": "2",
          "symbol": "②",
          "text_ja": "② 晴れですが、寒くて風が強い",
          "text_id": "Cerah, tetapi dingin dan berangin kencang"
        },
        {
          "id": "3",
          "symbol": "③",
          "text_ja": "③ 雪が降って、とても寒い",
          "text_id": "Turun salju dan sangat dingin"
        },
        {
          "id": "4",
          "symbol": "④",
          "text_ja": "④ 雨が降って、空が暗い",
          "text_id": "Turun hujan dan langit gelap"
        }
      ],
      "correctAnswer": "2",
      "dialogue": [
        {
          "speaker": "Dadan (ダダン)",
          "text_ja": "鈴木さん、おはようございます。今日はとても寒いですね。",
          "romaji": "Suzuki-san, ohayou gozaimasu. Kyou wa totemo samui desu ne.",
          "text_id": "Suzuki-san, selamat pagi. Hari ini sangat dingin ya."
        },
        {
          "speaker": "Suzuki (鈴木)",
          "text_ja": "おはよう、ダダンさん。そうですね。昨日は暖かかったですが、今日は風が強くて寒いです。",
          "romaji": "Ohayou, Dadan-san. Sou desu ne. Kinou wa atatakakatta desu ga, kyou wa kaze ga tsuyokute samui desu.",
          "text_id": "Selamat pagi, Dadan-san. Benar sekali. Kemarin memang hangat, tetapi hari ini anginnya kencang dan dingin."
        },
        {
          "speaker": "Dadan (ダダン)",
          "text_ja": "雪が降りますか。",
          "romaji": "Yuki ga furimasu ka.",
          "text_id": "Apakah akan turun salju?"
        },
        {
          "speaker": "Suzuki (鈴木)",
          "text_ja": "いいえ、雪は降りませんよ。晴れですが、空気が冷たいです。午後はあまり寒くないでしょう。",
          "romaji": "Iie, yuki wa furimasen yo. Hare desu ga, kuuki ga tsumetai desu. Gogo wa amari samukunai deshou.",
          "text_id": "Tidak, salju tidak akan turun. Cuacanya cerah, tetapi udaranya dingin. Siang nanti mungkin tidak begitu dingin."
        },
        {
          "speaker": "Dadan (ダダン)",
          "text_ja": "そうですか。良かったです。",
          "romaji": "Sou desu ka. Yokatta desu.",
          "text_id": "Begitu ya. Syukurlah."
        }
      ],
      "explanation": {
        "summary": "Jawaban yang benar adalah ② (晴れですが、寒くて風が強い / Cerah, tetapi dingin dan berangin).",
        "logic": "Suzuki mengontraskan cuaca kemarin dan hari ini: kemarin memang hangat (昨日は暖かかったですが), tetapi hari ini angin kencang dan dingin (今日は風が強くて寒いです). Cuacanya cerah dan tidak ada salju, namun udaranya dingin (晴れですが、空気が冷たいです).",
        "distractor": "• Opsi ①: Menjebak cuaca kemarin (暖かかった).\n• Opsi ③: Salju tidak turun (雪は降りません).\n• Opsi ④: Tidak ada hujan maupun mendung.",
        "grammarRule": "Pola Bab 8: Bentuk lampau kata sifat-i (暖かかった), penyambung sifat-i (~くて), dan partikel pertentangan ~が."
      },
      "session": "choukai"
    },
    {
      "id": 32,
      "type": "cerita",
      "section_ja": "第2部：聴解・会話・課題理解",
      "section_id": "Sesi 2: Choukai — Pemahaman Percakapan",
      "audioTimestamp": "06:33",
      "audioStartSeconds": 393.8,
      "audioSrc": "assets/audio/bab_08/Choukai_Bab_08_Q7.mp3",
      "audioDuration": "00:47",
      "question_ja": "男の人はまず何をしますか。",
      "question_ruby": "<ruby>男<rt>おとこ</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>はまず<ruby>何<rt>なに</rt></ruby>をしますか。",
      "question_romaji": "Otoko no hito wa mazu nani o shimasu ka.",
      "question_id": "Apa yang akan dilakukan laki-laki tersebut paling pertama?",
      "options": [
        {
          "id": "1",
          "symbol": "①",
          "text_ja": "① お風呂を掃除します",
          "text_id": "Membersihkan kamar mandi"
        },
        {
          "id": "2",
          "symbol": "②",
          "text_ja": "② テーブルを拭きます",
          "text_id": "Mengelap meja makan"
        },
        {
          "id": "3",
          "symbol": "③",
          "text_ja": "③ 台所のごみを捨てます",
          "text_id": "Membuang sampah dapur"
        },
        {
          "id": "4",
          "symbol": "④",
          "text_ja": "④ 寮の部屋で休みます",
          "text_id": "Beristirahat di kamar asrama"
        }
      ],
      "correctAnswer": "3",
      "dialogue": [
        {
          "speaker": "Narong (ナロン)",
          "text_ja": "指導員、寮の部屋の掃除が終わりました。",
          "romaji": "Shidouin, ryou no heya no souji ga owarimashita.",
          "text_id": "Pembimbing, pembersihan kamar asrama sudah selesai."
        },
        {
          "speaker": "Shidouin (指導員)",
          "text_ja": "ご苦労さま。でも、台所はどうですか。きれいですか。",
          "romaji": "Gokurousama. Demo, daidokoro wa dou desu ka. Kirei desu ka.",
          "text_id": "Terima kasih atas kerja kerasnya. Tapi, bagaimana dengan dapur? Apakah sudah bersih?"
        },
        {
          "speaker": "Narong (ナロン)",
          "text_ja": "あ、台所はまだ汚いです。",
          "romaji": "A, daidokoro wa mada kitanai desu.",
          "text_id": "Ah, dapur masih kotor."
        },
        {
          "speaker": "Shidouin (指導員)",
          "text_ja": "じゃあ、まず台所のごみを捨ててください。それから、テーブルを拭いてください。最後にお風呂を掃除しましょう。",
          "romaji": "Jaa, mazu daidokoro no gomi o sutete kudasai. Sorekara, teeburu o fuite kudasai. Saigo ni ofuro o souji shimashou.",
          "text_id": "Kalau begitu, pertama-tama buanglah sampah dapur. Setelah itu, tolong lap mejanya. Terakhir, mari bersihkan kamar mandi."
        },
        {
          "speaker": "Narong (ナロン)",
          "text_ja": "はい、わかりました。すぐごみを捨てます。",
          "romaji": "Hai, wakarimashita. Sugu gomi o sutemasu.",
          "text_id": "Baik, saya paham. Saya akan segera membuang sampahnya."
        }
      ],
      "explanation": {
        "summary": "Jawaban yang benar adalah ③ (台所のごみを捨てます / Membuang sampah dapur).",
        "logic": "Instruktur memberikan urutan 3 kegiatan: (1) Pertama-tama buang sampah dapur (まず台所のごみを捨ててください), (2) Setelah itu lap meja (それからテーブルを拭いてください), dan (3) Terakhir bersihkan kamar mandi (最後にお風呂を掃除しましょう). Pertanyaan secara spesifik menanyakan apa yang dilakukan PALING PERTAMA (まず).",
        "distractor": "• Opsi ①: Membersihkan kamar mandi adalah giliran terakhir (最後に).\n• Opsi ②: Mengelap meja adalah giliran kedua (それから).\n• Opsi ④: Narong belum selesai bertugas.",
        "grammarRule": "Pola Bab 8 & Bab 6: Bersih vs kotor (きれい vs 汚い) dan penanda urutan kronologis (まず、それから、最後に)."
      },
      "session": "choukai"
    },
    {
      "id": 33,
      "type": "cerita",
      "section_ja": "第2部：聴解・会話・課題理解",
      "section_id": "Sesi 2: Choukai — Pemahaman Percakapan",
      "audioTimestamp": "07:29",
      "audioStartSeconds": 449.5,
      "audioSrc": "assets/audio/bab_08/Choukai_Bab_08_Q8.mp3",
      "audioDuration": "01:00",
      "question_ja": "女の人はどの扇風機を買いますか。",
      "question_ruby": "<ruby>女<rt>おんな</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>はどの<ruby>扇風機<rt>せんぷうき</rt></ruby>を<ruby>買<rt>か</rt></ruby>いますか。",
      "question_romaji": "Onna no hito wa dono senpuuki o kaimasu ka.",
      "question_id": "Perempuan tersebut akan membeli kipas angin yang mana?",
      "options": [
        {
          "id": "1",
          "symbol": "①",
          "text_ja": "① 2,000円の小さい扇風機",
          "text_id": "Kipas angin kecil seharga 2.000 yen"
        },
        {
          "id": "2",
          "symbol": "②",
          "text_ja": "② 安くて、音が大きい扇風機",
          "text_id": "Kipas angin murah yang suaranya bising"
        },
        {
          "id": "3",
          "symbol": "③",
          "text_ja": "③ 4,000円の静かで涼しい扇風機",
          "text_id": "Kipas angin 4.000 yen yang hening dan sejuk"
        },
        {
          "id": "4",
          "symbol": "④",
          "text_ja": "④ 扇風機は買いません",
          "text_id": "Tidak jadi membeli kipas angin"
        }
      ],
      "correctAnswer": "3",
      "dialogue": [
        {
          "speaker": "Tenchou (店員)",
          "text_ja": "いらっしゃいませ。扇風機をお探しですか。",
          "romaji": "Irasshaimase. Senpuuki o osagashi desu ka.",
          "text_id": "Selamat datang. Apakah Anda sedang mencari kipas angin?"
        },
        {
          "speaker": "Wati (ワティ)",
          "text_ja": "はい。寮の部屋が暑いですから、扇風機が欲しいです。この2,000円の小さいのはどうですか。",
          "romaji": "Hai. Ryou no heya ga atsui desu kara, senpuuki ga hoshii desu. Kono nisen-en no chiisai no wa dou desu ka.",
          "text_id": "Ya. Karena kamar asrama panas, saya ingin kipas angin. Bagaimana dengan yang kecil seharga 2.000 yen ini?"
        },
        {
          "speaker": "Tenchou (店員)",
          "text_ja": "それはとても安いです。でも、風があまり強くなくて、涼しくないですよ。こちらの白い扇風機は4,000円ですが、とても涼しくて音も静かです。",
          "romaji": "Sore wa totemo yasui desu. Demo, kaze ga amari tsuyokunakute, suzushikunai desu yo. Kochira no shiroi senpuuki wa yonsen-en desu ga, totemo suzushikute oto mo shizuka desu.",
          "text_id": "Itu sangat murah. Tetapi hembusan anginnya tidak begitu kuat dan tidak sejuk lho. Kipas putih seharga 4.000 yen di sebelah sini sangat sejuk dan suaranya hening."
        },
        {
          "speaker": "Wati (ワティ)",
          "text_ja": "そうですか。2,000円のは安いですが、涼しくないのは困りますね。じゃあ、こちらの静かで涼しいほうにします。",
          "romaji": "Sou desu ka. Nisen-en no wa yasui desu ga, suzushikunai no wa komarimasu ne. Jaa, kochira no shizuka de suzushii hou ni shimasu.",
          "text_id": "Begitu ya. Yang 2.000 yen memang murah, tapi kalau tidak sejuk repot juga ya. Kalau begitu, saya ambil yang hening dan sejuk ini saja."
        },
        {
          "speaker": "Tenchou (店員)",
          "text_ja": "ありがとうございます。",
          "romaji": "Arigatou gozaimasu.",
          "text_id": "Terima kasih banyak."
        }
      ],
      "explanation": {
        "summary": "Jawaban yang benar adalah ③ (4,000円の静かで涼しい扇風機 / Kipas angin 4.000 yen yang hening dan sejuk).",
        "logic": "Wati membatalkan niat membeli kipas kecil 2.000 yen karena diinformasikan hembusannya tidak kuat dan tidak sejuk (涼しくない). Penjual merekomendasikan kipas 4.000 yen yang sejuk dan hening (涼しくて音も静かです). Wati pun memutuskan membeli kipas 4.000 yen tersebut (こちらの静かで涼しいほうにします).",
        "distractor": "• Opsi ①: Dibatalkan karena tidak sejuk.\n• Opsi ②: Distraktor bising dan murah.\n• Opsi ④: Wati tetap membeli barang.",
        "grammarRule": "Pola Bab 8: Perubahan keputusan (Decision flip), kata sifat sejuk vs gerah (涼しい vs 暑い), hening (静か), dan bentuk pilihan ~のほうにします."
      },
      "session": "choukai"
    }
  ]
};
