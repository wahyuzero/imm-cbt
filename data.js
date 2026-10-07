/**
 * Data Modul & Bank Soal Choukai CBT Platform
 * Kurikulum IMM Japan テキスト (Bab 01 s.d. Bab 25)
 * Paket Bab 01 s.d. 07 (Fase Fondasi Reading: 25 Soal) & Bab 08 (Tryout Terpadu: 33 Soal)
 */
const CHAPTERS_INDEX = [
  {
    "num": "01",
    "title_ja": "第1課：自己紹介・基本語彙と助詞",
    "title_id": "Bab 01: Perkenalan Diri, Kosakata Dasar & Partikel",
    "topic_id": "Fase Fondasi: Murni Reading / Ujian Tulis (25 Soal)",
    "available": true,
    "totalQuestions": 25,
    "audioDuration": "50:00",
    "examDuration": "50:00",
    "passingScore": 80,
    "badge": "Tersedia",
    "readingQuestions": 25,
    "choukaiQuestions": 0
  },
  {
    "num": "02",
    "title_ja": "第2課：物の名前・指示代名詞（これ・それ・あれ）と助詞（の）",
    "title_id": "Bab 02: Nama Benda di Sekitar Kita, Kata Tunjuk & Partikel Kepemilikan",
    "topic_id": "Fase Fondasi: Murni Reading / Ujian Tulis (25 Soal)",
    "available": true,
    "totalQuestions": 25,
    "audioDuration": "50:00",
    "examDuration": "50:00",
    "passingScore": 80,
    "badge": "Tersedia",
    "readingQuestions": 25,
    "choukaiQuestions": 0
  },
  {
    "num": "03",
    "title_ja": "第3課：場所の名前・指示代名詞（ここ・そこ・あそこ）と助詞（の・は）",
    "title_id": "Bab 03: Nama Tempat, Kata Tunjuk Lokasi & Partikel",
    "topic_id": "Fase Fondasi: Murni Reading / Ujian Tulis (25 Soal)",
    "available": true,
    "totalQuestions": 25,
    "audioDuration": "50:00",
    "examDuration": "50:00",
    "passingScore": 80,
    "badge": "Tersedia",
    "readingQuestions": 25,
    "choukaiQuestions": 0
  },
  {
    "num": "04",
    "title_ja": "第4課：時間・曜日・日課の動詞と助詞（に・から・まで・と）",
    "title_id": "Bab 04: Waktu, Hari, Verba Rutinitas & Partikel",
    "topic_id": "Fase Fondasi: Murni Reading / Ujian Tulis (25 Soal)",
    "available": true,
    "totalQuestions": 25,
    "audioDuration": "50:00",
    "examDuration": "50:00",
    "passingScore": 80,
    "badge": "Tersedia",
    "readingQuestions": 25,
    "choukaiQuestions": 0
  },
  {
    "num": "05",
    "title_ja": "第5課：移動の動詞（行きます・来ます・帰ります）と助詞（へ・で・と）",
    "title_id": "Bab 05: Verba Perpindahan, Transportasi & Penanggalan",
    "topic_id": "Fase Fondasi: Murni Reading / Ujian Tulis (25 Soal)",
    "available": true,
    "totalQuestions": 25,
    "audioDuration": "50:00",
    "examDuration": "50:00",
    "passingScore": 80,
    "badge": "Tersedia",
    "readingQuestions": 25,
    "choukaiQuestions": 0
  },
  {
    "num": "06",
    "title_ja": "第6課：動詞（飲食・日常行為）と助詞（を・で）",
    "title_id": "Bab 06: Verba Transitif, Objek Penderita & Ajakan",
    "topic_id": "Fase Fondasi: Murni Reading / Ujian Tulis (25 Soal)",
    "available": true,
    "totalQuestions": 25,
    "audioDuration": "50:00",
    "examDuration": "50:00",
    "passingScore": 80,
    "badge": "Tersedia",
    "readingQuestions": 25,
    "choukaiQuestions": 0
  },
  {
    "num": "07",
    "title_ja": "第7課：道具・手段（で）と授受動詞（あげます・もらいます）",
    "title_id": "Bab 07: Sarana/Alat Kerja, Bahasa & Verba Pemberian",
    "topic_id": "Fase Fondasi: Murni Reading / Ujian Tulis (25 Soal)",
    "available": true,
    "totalQuestions": 25,
    "audioDuration": "50:00",
    "examDuration": "50:00",
    "passingScore": 80,
    "badge": "Tersedia",
    "readingQuestions": 25,
    "choukaiQuestions": 0
  },
  {
    "num": "08",
    "title_ja": "第8課：形容詞と職場の様子（読解・聴解）",
    "title_id": "Bab 08: Tryout Terpadu Reading & Choukai",
    "topic_id": "Tryout Terpadu EPS-TOPIK: Sesi 1 Reading (25 Soal) & Sesi 2 Choukai (8 Soal)",
    "available": true,
    "totalQuestions": 33,
    "audioDuration": "08:35",
    "examDuration": "60:00",
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

const BAB_01_DATA = {
  "chapter": "01",
  "title_ja": "第１課：自己紹介・基本語彙と助詞",
  "title_id": "Bab 01: Perkenalan Diri, Kosakata Dasar & Partikel",
  "theme_ja": "自己紹介 (Jiko Shoukai) & 基礎文型 (Kiso Bunkei)",
  "theme_id": "Evaluasi pemahaman kosakata identitas, profesi, kewarganegaraan, serta penggunaan partikel dasar (は, も, の, か, から) pada Bab 1 buku IMM Japan.",
  "audioSrc": null,
  "pdfReadingSoalUrl": "assets/pdf/Salinan Soal Bab 01.pdf",
  "pdfReadingKunciUrl": "assets/pdf/Kunci dan Pembahasan Bab 01.pdf",
  "pdfSoalUrl": null,
  "pdfKunciUrl": null,
  "passingGrade": 80,
  "totalQuestions": 25,
  "readingCount": 25,
  "choukaiCount": 0,
  "questions": [
    {
      "id": 1,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Status / Pekerjaan",
      "type": "teks",
      "question_ja": "わたしは アイムジャパンの <strong>実習生（じっしゅうせい）</strong>です。",
      "question_ruby": "わたしは アイムジャパンの <strong>実習生（じっしゅうせい）</strong>です。",
      "question_id": "Kata yang dicetak tebal di atas memiliki arti...",
      "translation": "Saya adalah peserta magang IMM Japan.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Siswa SMA"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Peserta magang"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Guru pembimbing"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Pegawai kantor"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (Peserta magang).",
        "logic": "Kata <strong>実習生（じっしゅうせい - jisshuusei）</strong> berarti peserta magang praktek kerja teknis. Dalam konteks pelatihan IMM Japan, seluruh peserta pelatihan yang dikirim ke Jepang berstatus sebagai 実習生.",
        "distractor": "• Opsi A: Siswa SMA dalam bahasa Jepang adalah 高校生 (こうこうせい).\n• Opsi C: Guru pembimbing/instruktur adalah 指導員 (しどういん) atau 先生 (せんせい).\n• Opsi D: Pegawai kantor adalah 会社員 (かいしゃいん).",
        "grammarRule": "Kosakata Kunci Bab 1: 実習生（じっしゅうせい = peserta magang）, 研修生（けんしゅうせい = peserta pelatihan）, 先生（せんせい = guru）, 会社員（かいしゃいん = karyawan perusahaan）."
      }
    },
    {
      "id": 2,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Cara Baca Kanji",
      "type": "teks",
      "question_ja": "田中さんは にほんごの （　<strong>先生</strong>　）です。",
      "question_ruby": "田中さんは にほんごの （　<strong>先生</strong>　）です。",
      "question_id": "Cara baca kanji di dalam tanda kurung yang tepat adalah...",
      "translation": "Tanaka-san adalah guru bahasa Jepang.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "がくせい"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "しゃちょう"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "せんせい"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "かいしゃいん"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (せんせい).",
        "logic": "Kanji <strong>先生</strong> memiliki cara baca <strong>せんせい (sensei)</strong> yang bermakna guru atau instruktur.",
        "distractor": "• Opsi A: がくせい adalah cara baca kanji 学生 (pelajar / mahasiswa).\n• Opsi B: しゃちょう adalah cara baca kanji 社長 (direktur perusahaan).\n• Opsi D: かいしゃいん adalah cara baca kanji 会社員 (karyawan perusahaan).",
        "grammarRule": "Kanji dasar Bab 1: 先生 (せんせい - guru), 学生 (がくせい - siswa), 人 (ひと/じん - orang)."
      }
    },
    {
      "id": 3,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Satuan Umur Khusus",
      "type": "teks",
      "question_ja": "ナロンさんは ２０さいです。日本語で「２０さい」の 特別な 読み方は 何ですか。",
      "question_ruby": "ナロンさんは ２０さいです。日本語で「２０さい」の 特別な 読み方は 何ですか。",
      "question_id": "Penyebutan khusus untuk usia \"20 tahun\" dalam bahasa Jepang adalah...",
      "translation": "Narong-san berusia 20 tahun. Apa sebutan khusus untuk '20 tahun' dalam bahasa Jepang?",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "はたち"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "なんさい"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "にじゅっさい"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "おいくつ"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (はたち).",
        "logic": "Dalam penghitungan usia bahasa Jepang, usia 20 tahun memiliki penyebutan khusus (irregular) yaitu <strong>はたち (hatachi)</strong> yang melambangkan batas usia kedewasaan di Jepang.",
        "distractor": "• Opsi B: なんさい (何さい) adalah kata tanya untuk menanyakan usia (\"usia berapa\").\n• Opsi C: にじゅっさい adalah penghitungan angka biasa yang tidak lazim digunakan sebagai sebutan baku usia 20 tahun pada buku teks dasar.\n• Opsi D: おいくつ adalah bentuk sopan (keigo) untuk menanyakan usia seseorang.",
        "grammarRule": "Pola Umur: Angka + さい (contoh: 21さい = にじゅういっさい, 23さい = にじゅうさんさい). Khusus umur 20 tahun dibaca はたち."
      }
    },
    {
      "id": 4,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Salam Perkenalan (Aisatsu)",
      "type": "teks",
      "question_ja": "A：「（　　　）。わたしは アグスです。どうぞ よろしく おねがいします。」<br>B：「はじめまして。やまだです。こちらこそ よろしく。」",
      "question_ruby": "A：「（　　　）。わたしは アグスです。どうぞ よろしく おねがいします。」<br>B：「はじめまして。やまだです。こちらこそ よろしく。」",
      "question_id": "Ungkapan salam yang paling tepat untuk melengkapi percakapan perkenalan diri di atas adalah...",
      "translation": "A: \"Perkenalkan pertama kali. Saya Agus. Senang berkenalan dengan Anda.\"<br>B: \"Perkenalkan pertama kali. Saya Yamada. Sama-sama, senang berkenalan dengan Anda.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "さようなら"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "はじめまして"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "すみません"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "ありがとうございます"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (はじめまして).",
        "logic": "Ungkapan <strong>はじめまして (hajimemashite)</strong> merupakan salam pembuka baku yang diucapkan pertama kali saat memperkenalkan diri (jiko shoukai).",
        "distractor": "• Opsi A: さようなら adalah salam perpisahan yang bermakna \"selamat tinggal\".\n• Opsi C: すみません adalah ungkapan permohonan maaf atau permisi.\n• Opsi D: ありがとうございます adalah ungkapan terima kasih.",
        "grammarRule": "Struktur Salam Perkenalan Bab 1: はじめまして (Salam kenal) → わたしは [Nama] です → どうぞよろしくおねがいします (Mohon bantuannya)."
      }
    },
    {
      "id": 5,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kata Tanya Santun",
      "type": "teks",
      "question_ja": "A：「あの方は （　　　）ですか。」<br>B：「アメリカの トムさんです。」",
      "question_ruby": "A：「あの方は （　　　）ですか。」<br>B：「アメリカの トムさんです。」",
      "question_id": "Kata tanya yang paling santun dan selaras untuk menanyakan orang pada kalimat di atas adalah...",
      "translation": "A: \"Beliau itu siapakah?\"<br>B: \"Tom-san dari Amerika.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "どちら"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "なに"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "どなた"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "なんさい"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (どなた).",
        "logic": "Kata <strong>あの方（あのかた - ano kata）</strong> adalah bentuk santun/hormat dari あの人 (ano hito = orang itu). Kata tanya yang berpasangan secara setara dan sopan untuk menanyakan orang terhormat adalah <strong>どなた (donata)</strong>, bentuk sopan dari だれ (dare).",
        "distractor": "• Opsi A: どちら digunakan untuk menanyakan arah, lokasi, atau nama instansi/negara asal.\n• Opsi B: なに berarti \"apa\".\n• Opsi D: なんさい digunakan untuk menanyakan usia.",
        "grammarRule": "Keselarasan Kesopanan: あの人 (biasa) berpasangan dengan だれ; あの方 (sopan) berpasangan dengan どなた."
      }
    },
    {
      "id": 6,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Profesi / Pekerjaan",
      "type": "teks",
      "question_ja": "ジョンさんは ＫＦＣの （　　　）です。",
      "question_ruby": "ジョンさんは ＫＦＣの （　　　）です。",
      "question_id": "Kosakata yang tepat untuk melengkapi profesi John sebagai \"karyawan perusahaan\" KFC adalah...",
      "translation": "John-san adalah karyawan perusahaan KFC.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "会社員（かいしゃいん）"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "実習生（じっしゅうせい）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "学生（がくせい）"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "先生（せんせい）"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (会社員（かいしゃいん）).",
        "logic": "Dalam teks IMM Japan Bab 1 (Latihan A.5 & B.11), John dan Tom diperkenalkan bekerja di perusahaan waralaba (KFC & McDonald's) dengan profesi sebagai <strong>会社員（かいしゃいん - kaishain）</strong> yang berarti karyawan kantor/perusahaan.",
        "distractor": "• Opsi B: 実習生 adalah peserta magang (status peserta IM Japan).\n• Opsi C: 学生 adalah pelajar atau mahasiswa universitas.\n• Opsi D: 先生 adalah guru/pengajar.",
        "grammarRule": "Pola Profesi: 会社員 (karyawan perusahaan), 銀行員 (pegawai bank), 医者 (dokter), 研究者 (peneliti)."
      }
    },
    {
      "id": 7,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Menanyakan Negara Asal",
      "type": "teks",
      "question_ja": "田中：「ダダンさん、お（　　　）は どちらですか。」<br>ダダン：「インドネシアです。」",
      "question_ruby": "田中：「ダダンさん、お（　　　）は どちらですか。」<br>ダダン：「インドネシアです。」",
      "question_id": "Kata yang tepat untuk melengkapi pertanyaan santun mengenai asal negara di atas adalah...",
      "translation": "Tanaka: \"Dadan-san, negara asal Anda dari mana?\"<br>Dadan: \"Indonesia.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "なまえ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "くに"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "とし"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "しごと"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (くに).",
        "logic": "Awalan hormat お (o-) yang digabungkan dengan kata <strong>国（くに - kuni = negara）</strong> membentuk frasa santun <strong>お国（おくに）</strong>, digunakan untuk menanyakan negara asal lawan bicara: 「お国はどちらですか」.",
        "distractor": "• Opsi A: なまえ membentuk お名前 (onamae), digunakan untuk menanyakan nama.\n• Opsi C: とし berarti usia/tahun.\n• Opsi D: しごと membentuk お仕事 (oshigoto), digunakan untuk menanyakan pekerjaan.",
        "grammarRule": "Pola Sopan Bab 1: お国はどちらですか (Negara asal Anda dari mana?), お名前は？ (Siapa nama Anda?)."
      }
    },
    {
      "id": 8,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Ungkapan Etos Kerja",
      "type": "teks",
      "question_ja": "山下社長：「実習生、がんばってね。」<br>アグス：「はい、（　　　）。」",
      "question_ruby": "山下社長：「実習生、がんばってね。」<br>アグス：「はい、（　　　）。」",
      "question_id": "Respon yang tepat dan bermakna \"Ya, saya akan berjuang / berusaha sungguh-sungguh\" adalah...",
      "translation": "Presdir Yamashita: \"Para peserta magang, bersemangatlah ya.\"<br>Agus: \"Baik, saya akan berusaha sungguh-sungguh.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "わかりません"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "がんばります"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "ちがいます"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "あります"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (がんばります).",
        "logic": "Dalam percakapan Bab 1 buku IMM Japan (halaman 8), ketika pimpinan memberi instruksi dan penyemangat 「がんばってね」, jawaban baku peserta magang adalah <strong>「はい、がんばります」 (hai, ganbarimasu)</strong> yang mencerminkan komitmen kerja keras.",
        "distractor": "• Opsi A: わかりません bermakna \"saya tidak tahu / tidak mengerti\".\n• Opsi C: ちがいます bermakna \"bukan / salah / berbeda\".\n• Opsi D: あります adalah kata kerja keberadaan benda mati (\"ada\").",
        "grammarRule": "Kultur IMM Japan: Ungkapan がんばります (saya akan berusaha sekuat tenaga) adalah respon mentalitas kerja utama bagi 実習生."
      }
    },
    {
      "id": 9,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Menanyakan Usia",
      "type": "teks",
      "question_ja": "A：「アグスさんは （　　　）ですか。」<br>B：「２１さいです。」",
      "question_ruby": "A：「アグスさんは （　　　）ですか。」<br>B：「２１さいです。」",
      "question_id": "Kata tanya yang tepat untuk menanyakan usia berdasarkan jawaban di atas adalah...",
      "translation": "A: \"Agus-san berusia berapa?\"<br>B: \"21 tahun.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "どなた"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "どちら"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "おいくつ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "だれ"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (おいくつ).",
        "logic": "Jawaban yang diberikan berupa umur 「２１さいです」. Kata tanya yang digunakan untuk menanyakan usia secara sopan adalah <strong>おいくつ (oikutsu)</strong> atau 何さい (なんさい).",
        "distractor": "• Opsi A: どなた digunakan untuk menanyakan orang secara santun (\"siapa\").\n• Opsi B: どちら digunakan untuk menanyakan tempat, arah, atau opsi pilihan.\n• Opsi D: だれ digunakan untuk menanyakan orang secara biasa (\"siapa\").",
        "grammarRule": "Pola Tanya Usia: 何さいですか (Berapa umur Anda? - biasa) atau おいくつですか (Berapa usia Anda? - sopan)."
      }
    },
    {
      "id": 10,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Sufiks Kewarganegaraan",
      "type": "teks",
      "question_ja": "ナロンさんは タイ（　　　）です。アメリカ人では ありません。",
      "question_ruby": "ナロンさんは タイ（　　　）です。アメリカ人では ありません。",
      "question_id": "Akhiran kata yang tepat untuk menyatakan warga negara atau kebangsaan adalah...",
      "translation": "Narong-san adalah orang Thailand. Bukan orang Amerika.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "ご（語）"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "じん（人）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "さい（歳）"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "さん（様）"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (じん（人）).",
        "logic": "Sufiks <strong>人（じん - jin）</strong> yang diletakkan langsung di belakang nama negara berfungsi menyatakan kebangsaan atau warga negara (タイ人 = orang Thailand, インドネシア人 = orang Indonesia).",
        "distractor": "• Opsi A: 語（ご - go）adalah akhiran untuk bahasa (タイ語 = bahasa Thai, 日本語 = bahasa Jepang).\n• Opsi C: 歳/さい (sai) adalah akhiran untuk menyatakan satuan usia/umur.\n• Opsi D: さん (san) adalah gelar kehormatan untuk memanggil nama orang (Sdr./Bpk./Ibu).",
        "grammarRule": "Perbedaan Akhiran Negara: [Nama Negara] + 人 (じん) = Bangsa/Orang; [Nama Negara] + 語 (ご) = Bahasa."
      }
    },
    {
      "id": 11,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Topik (は)",
      "type": "teks",
      "question_ja": "わたし（　　　） インドネシアの ダダンです。",
      "question_ruby": "わたし（　　　） インドネシアの ダダンです。",
      "question_id": "Partikel yang tepat untuk menandai subjek / topik pembicaraan adalah...",
      "translation": "Saya adalah Dadan dari Indonesia.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "を"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "に"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "は"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "で"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (は).",
        "logic": "Partikel <strong>は (wa)</strong> berfungsi sebagai penanda topik kalimat. Dalam pola dasar <code>A は B です</code>, partikel は diletakkan setelah subjek atau topik yang dibicarakan (di sini: わたし). Partikel ini ditulis dengan hiragana は namun dilafalkan \"wa\".",
        "distractor": "• Opsi A: を (o) adalah partikel penanda objek langsung dari kata kerja tindakan.\n• Opsi B: に (ni) adalah partikel penanda waktu, arah sasaran, atau lokasi keberadaan.\n• Opsi D: で (de) adalah partikel penanda sarana, alat, atau tempat terjadinya aksi.",
        "grammarRule": "Kaidah Partikel は: Ditulis [ha], dibaca [wa]. Berfungsi mengangkat nomina sebelumnya menjadi topik utama kalimat."
      }
    },
    {
      "id": 12,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Kesamaan / 'Juga' (も)",
      "type": "teks",
      "question_ja": "ダダンさんは 実習生です。アグスさん（　　　） 実習生です。",
      "question_ruby": "ダダンさんは 実習生です。アグスさん（　　　） 実習生です。",
      "question_id": "Partikel yang tepat untuk menyatakan makna \"juga\" atau \"pun\" adalah...",
      "translation": "Dadan-san adalah peserta magang. Agus-san juga peserta magang.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "も"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "は"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "の"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "が"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (も).",
        "logic": "Partikel <strong>も (mo)</strong> digunakan untuk menggantikan partikel は ketika subjek kedua memiliki predikat atau atribut yang sama persis dengan subjek sebelumnya, bermakna \"juga / pun\".",
        "distractor": "• Opsi B: は hanya penanda topik umum tanpa memberi makna penegasan kesamaan (\"juga\").\n• Opsi C: の digunakan untuk menghubungkan dua kata benda (kepemilikan/afiliasi).\n• Opsi D: が adalah partikel penanda fokus subjek gramatikal spesifik.",
        "grammarRule": "Kaidah Partikel も: Menggantikan partikel は ketika pernyataan mengenai topik kedua bernilai sama dengan topik pertama."
      }
    },
    {
      "id": 13,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Afiliasi / Lembaga (の)",
      "type": "teks",
      "question_ja": "わたしは アイムジャパン（　　　） 実習生です。",
      "question_ruby": "わたしは アイムジャパン（　　　） 実習生です。",
      "question_id": "Partikel yang tepat untuk menghubungkan nama institusi dengan status peserta magang adalah...",
      "translation": "Saya adalah peserta magang IMM Japan.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "と"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "の"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "で"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "から"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (の).",
        "logic": "Partikel <strong>の (no)</strong> berfungsi menghubungkan dua kata benda (N1 の N2). Pada konteks ini, N1 (アイムジャパン) menerangkan organisasi/lembaga yang menaungi N2 (実習生).",
        "distractor": "• Opsi A: と berarti \"dan\" (menghubungkan dua benda sejajar) atau \"bersama\".\n• Opsi C: で menandai tempat dilakukannya suatu tindakan atau kegiatan.\n• Opsi D: から berarti \"dari\" (menunjukkan titik awal pergerakan, bukan hubungan afiliasi langsung dalam frasa nomina).",
        "grammarRule": "Kaidah Partikel の (Afiliasi): [Nama Lembaga/Perusahaan] + の + [Jabatan/Status] (contoh: アイムジャパンの実習生, ながのきかいの実習生)."
      }
    },
    {
      "id": 14,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Penanya Akhir Kalimat (か)",
      "type": "teks",
      "question_ja": "A：「田中さんは 実習生です（　　　）。」<br>B：「いいえ、実習生ではありません。先生です。」",
      "question_ruby": "A：「田中さんは 実習生です（　　　）。」<br>B：「いいえ、実習生ではありません。先生です。」",
      "question_id": "Partikel di akhir kalimat yang berfungsi mengubah pernyataan menjadi pertanyaan adalah...",
      "translation": "A: \"Apakah Tanaka-san peserta magang?\"<br>B: \"Bukan, bukan peserta magang. Guru.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "ね"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "よ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "か"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "わ"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (か).",
        "logic": "Partikel <strong>か (ka)</strong> diletakkan di ujung kalimat (setelah です atau ます) berfungsi sebagai partikel penanya, menggantikan fungsi tanda tanya dalam struktur gramatika bahasa Jepang.",
        "distractor": "• Opsi A: ね (ne) digunakan untuk meminta persetujuan lawan bicara (\"ya / kan?\").\n• Opsi B: よ (yo) digunakan untuk memberi penegasan informasi baru kepada pendengar.\n• Opsi D: わ (wa) adalah partikel penegas akhir kalimat yang bersifat feminin atau dialek.",
        "grammarRule": "Kaidah Kalimat Tanya Bab 1: [Kalimat Positif] + か？ (Intonasi naik di akhir kalimat)."
      }
    },
    {
      "id": 15,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Kualifikasi Bidang (の)",
      "type": "teks",
      "question_ja": "田中先生は 英語（　　　） 先生です。",
      "question_ruby": "田中先生は 英語（　　　） 先生です。",
      "question_id": "Partikel penghubung antara bidang studi/keahlian dengan pengajarnya adalah...",
      "translation": "Guru Tanaka adalah guru bahasa Inggris.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "を"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "に"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "の"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "も"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (の).",
        "logic": "Partikel <strong>の (no)</strong> menghubungkan kata benda bidang mata pelajaran (英語 = bahasa Inggris) dengan profesi guru (先生 = sensei), membentuk makna \"guru bidang studi bahasa Inggris\".",
        "distractor": "• Opsi A: を merupakan partikel penanda objek kalimat transitif.\n• Opsi B: に merupakan partikel penanda sasaran, tempat keberadaan, atau waktu.\n• Opsi D: も berarti \"juga\", merusak struktur gabungan frasa benda.",
        "grammarRule": "Kaidah N1 の N2: [Mata Pelajaran/Keahlian] + の + 先生 (contoh: にほんごの先生, えいごの先生)."
      }
    },
    {
      "id": 16,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Asal / Titik Awal (から)",
      "type": "teks",
      "question_ja": "はじめまして。わたしは ジャカルタ（　　　） 来ました。どうぞ よろしく。",
      "question_ruby": "はじめまして。わたしは ジャカルタ（　　　） 来ました。どうぞ よろしく。",
      "question_id": "Partikel yang tepat untuk menunjukkan titik awal kota asal kedatangan (\"datang dari...\") adalah...",
      "translation": "Senang berkenalan pertama kali. Saya datang dari Jakarta. Mohon bimbingannya.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "まで"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "から"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "へ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "に"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (から).",
        "logic": "Pola kalimat <code>[Tempat] + から来ました (kara kimashita)</code> berarti \"datang dari [tempat]\". Partikel <strong>から (kara)</strong> berfungsi menandai titik tolak asal keberangkatan/daerah asal.",
        "distractor": "• Opsi A: まで (made) berarti \"sampai / hingga\".\n• Opsi C: へ (e) menandai arah tujuan perjalanan (\"menuju ke\").\n• Opsi D: に (ni) menandai titik ketibaan atau tujuan akhir.",
        "grammarRule": "Pola Perkenalan Bab 1: [Kota/Negara] + から来ました (Contoh: インドネシアから来ました, ジャカルタから来ました)."
      }
    },
    {
      "id": 17,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Asal Negara Tokoh (の)",
      "type": "teks",
      "question_ja": "あの人は アメリカ（　　　） トムさんです。",
      "question_ruby": "あの人は アメリカ（　　　） トムさんです。",
      "question_id": "Partikel yang tepat untuk menghubungkan negara asal dengan nama individu yang bersangkutan adalah...",
      "translation": "Orang itu adalah Tom-san dari Amerika.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "の"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "は"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "も"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "と"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (の).",
        "logic": "Dalam buku IMM Japan Bab 1 (Pola Bunkei 5 & Renshuu A.5), hubungan antara negara asal dan nama seseorang dihubungkan dengan partikel <strong>の (no)</strong>: <code>[Negara Asal] の [Nama Orang] さん</code>.",
        "distractor": "• Opsi B: は akan memutus predikat dan menghasilkan struktur rancu dalam klausa tunggal.\n• Opsi C: も berarti \"juga\", tidak menghubungkan dua kata benda dalam satu frasa identitas.\n• Opsi D: と berarti \"dan\" atau \"bersama\".",
        "grammarRule": "Pola Identitas Asal: [Negara/Kota] + の + [Nama Orang] (contoh: インドネシアのアグスさん, アメリカのトムさん)."
      }
    },
    {
      "id": 18,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Pasangan Partikel (は & も)",
      "type": "teks",
      "question_ja": "A：「ブディさん（　①　） インドネシア人ですか。」<br>B：「はい、そうです。アリさん（　②　） インドネシア人です。」",
      "question_ruby": "A：「ブディさん（　①　） インドネシア人ですか。」<br>B：「はい、そうです。アリさん（　②　） インドネシア人です。」",
      "question_id": "Pasangan partikel yang tepat untuk melengkapi bagian ① dan ② secara berturut-turut adalah...",
      "translation": "A: \"Apakah Budi-san orang Indonesia?\"<br>B: \"Ya, benar. Ali-san juga orang Indonesia.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "① も　② は"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "① は　② も"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "① の　② は"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "① は　② の"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (① は　② も).",
        "logic": "Bagian ① memperkenalkan topik pembicaraan baru sehingga wajib menggunakan partikel penanda topik <strong>は (wa)</strong>. Bagian ② menyatakan bahwa subjek kedua (Ali-san) memiliki kondisi kebangsaan yang sama persis (orang Indonesia), sehingga wajib menggunakan partikel <strong>も (mo)</strong>.",
        "distractor": "• Opsi A: Terbalik posisinya; partikel も tidak dapat mengawali topik pertama tanpa ada rujukan pembanding sebelumnya.\n• Opsi C: Partikel の di posisi ① salah secara gramatikal dalam menandai subjek pembicaraan.\n• Opsi D: Partikel の di posisi ② salah karena tidak dapat menggantikan peran predikat kesamaan.",
        "grammarRule": "Kaidah Komparasi: Kalimat pertama menggunakan は untuk topik awal, kalimat berikutnya menggunakan も jika keterangannya identik."
      }
    },
    {
      "id": 19,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Perusahaan Afiliasi (の)",
      "type": "teks",
      "question_ja": "アグスさんは ながのきかい（　　　） 実習生です。",
      "question_ruby": "アグスさんは ながのきかい（　　　） 実習生です。",
      "question_id": "Partikel yang tepat untuk menghubungkan nama pabrik/perusahaan penempatan dengan status peserta adalah...",
      "translation": "Agus-san adalah peserta magang (perusahaan) Nagano Kikai.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "で"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "の"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "に"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "へ"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (の).",
        "logic": "Dalam buku IMM Japan Bab 1 (Latihan B.7), hubungan penempatan antara perusahaan mitra (ながのきかい - Nagano Kikai) dengan peserta praktek dihubungkan oleh partikel <strong>の (no)</strong>: <code>ながのきかいの実習生</code>.",
        "distractor": "• Opsi A: で menandai tempat dilakukannya kegiatan kerja (kata kerja aksi), bukan penjelas nomina.\n• Opsi C: に menandai tujuan atau keberadaan.\n• Opsi D: へ menandai arah pergerakan.",
        "grammarRule": "Kaidah Hubungan Lembaga: [Perusahaan/Pabrik] + の + 実習生 (contoh: ながのきかいの実習生, とうきょうゴムの実習生)."
      }
    },
    {
      "id": 20,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Topik Tanya Identitas (は)",
      "type": "teks",
      "question_ja": "あの人（　　　） だれですか。あの方は どなたですか。",
      "question_ruby": "あの人（　　　） だれですか。あの方は どなたですか。",
      "question_id": "Partikel penanda topik yang tepat pada kalimat tanya identitas di atas adalah...",
      "translation": "Orang itu siapakah? Beliau itu siapakah?",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "が"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "を"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "は"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "に"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (は).",
        "logic": "Pola kalimat dasar menanyakan identitas seseorang pada Bab 1 buku IMM Japan adalah <code>[Orang] は だれ（どなた）ですか</code>. Partikel <strong>は (wa)</strong> berfungsi menandai orang tersebut sebagai topik yang sedang ditanyakan.",
        "distractor": "• Opsi A: が digunakan untuk penanda subjek fokus gramatikal pada pola kalimat tertentu, bukan pola tanya identitas dasar Bab 1.\n• Opsi B: を adalah partikel penanda objek penderita.\n• Opsi D: に adalah partikel penanda waktu atau tempat sasaran.",
        "grammarRule": "Kaidah Tanya Identitas Bab 1: あの人はだれですか (Orang itu siapa?) / あの方はどなたですか (Beliau itu siapa?)."
      }
    },
    {
      "id": 21,
      "session": "reading",
      "section_ja": "第3部：読解・図解評価",
      "section_id": "Sesi 1: Reading — Zukai (Evaluasi Bergambar)",
      "category": "Soal Bergambar — Kosakata Status / Pekerjaan",
      "type": "gambar",
      "question_ja": "絵（え）を 見て ください。この 人は だれですか。<br>「わたしは アイムジャパンの （　　　）です。」",
      "question_ruby": "絵（え）を 見て ください。この 人は だれですか。<br>「わたしは アイムジャパンの （　　　）です。」",
      "question_id": "Perhatikan gambar. Siapakah orang ini? 'Saya adalah (...) IMM Japan.'",
      "translation": "Saya adalah peserta magang IMM Japan.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "ぎんこういん"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "実習生（じっしゅうせい）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "いしゃ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "きょうし"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (実習生（じっしゅうせい）).",
        "logic": "Pada gambar terlihat ilustrasi peserta magang (実習生 / じっしゅうせい - jisshuusei) yang membawa tas pelatihan siap bertugas. Dalam konteks IMM Japan, peserta dikirim ke Jepang berstatus sebagai 実習生.",
        "distractor": "• Opsi A: ぎんこういん berarti pegawai bank.\n• Opsi C: いしゃ berarti dokter.\n• Opsi D: きょうし berarti guru/pendidik.",
        "grammarRule": "Kosakata Status IMM Japan: 実習生（じっしゅうせい = peserta magang teknis）."
      },
      "image": "assets/bab_01/reading_q21.jpeg"
    },
    {
      "id": 22,
      "session": "reading",
      "section_ja": "第3部：読解・図解評価",
      "section_id": "Sesi 1: Reading — Zukai (Evaluasi Bergambar)",
      "category": "Soal Bergambar — Salam Perkenalan (Aisatsu)",
      "type": "gambar",
      "question_ja": "絵（え）を 見て ください。はじめて 会った 時の 正しい あいさつは どれですか。<br>A：「（　　　）。ダダンです。」<br>B：「はじめまして。アグスです。」",
      "question_ruby": "絵（え）を 見て ください。はじめて 会った 時の 正しい あいさつは どれですか。<br>A：「（　　　）。ダダンです。」<br>B：「はじめまして。アグスです。」",
      "question_id": "Perhatikan gambar. Pilihlah salam yang tepat saat pertama kali bertemu seperti pada gambar.",
      "translation": "A: 'Perkenalkan. Saya Dadan.' B: 'Senang bertemu dengan Anda. Saya Agus.'",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "さようなら"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "おやすみなさい"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "はじめまして"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "じゃ、また"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (はじめまして).",
        "logic": "Ilustrasi menunjukkan dua orang yang baru pertama kali bertemu saling memperkenalkan diri. Ungkapan yang wajib diucapkan saat pertama kali bertemu adalah はじめまして (hajimemashite - perkenalkan / senang bertemu dengan Anda).",
        "distractor": "• Opsi A: さようなら berarti selamat tinggal / selamat jalan.\n• Opsi B: おやすみなさい berarti selamat tidur / istirahat.\n• Opsi D: じゃ、また berarti sampai jumpa lagi (kasual).",
        "grammarRule": "Ungkapan Perkenalan: はじめまして ～ どうぞ よろしく おねがいします."
      },
      "image": "assets/bab_01/reading_q22.jpeg"
    },
    {
      "id": 23,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Cara Baca Kanji (学生)",
      "type": "teks",
      "question_ja": "ナロンさんは （ 学生 ）では ありません。実習生です。<br>（　）の 漢字の 正しい 読み方を えらんで ください。",
      "question_ruby": "ナロンさんは （ 学生 ）では ありません。実習生です。<br>（　）の 漢字の 正しい 読み方を えらんで ください。",
      "question_id": "Narong-san bukan siswa/mahasiswa. Dia adalah peserta magang. Pilihlah cara baca kanji yang tepat di dalam kurung.",
      "translation": "Narong-san bukan siswa/mahasiswa. Dia adalah peserta magang teknis.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "がくせい"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "せんせい"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "かいしゃいん"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "けんしゅうせい"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (がくせい).",
        "logic": "Kanji 学生 terdiri dari 学 (gaku = belajar) dan 生 (sei = hidup/orang yang lahir), dibaca がくせい (gakusei) yang berarti murid / siswa / mahasiswa.",
        "distractor": "• Opsi B: せんせい ditulis 先生 (guru).\n• Opsi C: かいしゃいん ditulis 会社員 (karyawan kantor).\n• Opsi D: けんしゅうせい ditulis 研修生 (peserta pelatihan).",
        "grammarRule": "Kanji Dasar Bab 1: 学生（がくせい = siswa/mahasiswa）."
      }
    },
    {
      "id": 24,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Penulisan Kanji (先生)",
      "type": "teks",
      "question_ja": "スズキさんは 日本語の （ せんせい ）です。<br>（　）の 言葉の 正しい 漢字は どれですか。",
      "question_ruby": "スズキさんは 日本語の （ せんせい ）です。<br>（　）の 言葉の 正しい 漢字は どれですか。",
      "question_id": "Suzuki-san adalah guru bahasa Jepang. Pilihlah penulisan kanji yang tepat untuk 'sensei'.",
      "translation": "Suzuki-san adalah guru bahasa Jepang.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "先正"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "先生"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "先世"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "先青"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (先生).",
        "logic": "Kata せんせい (sensei) memiliki penulisan kanji baku 先生 (先 = terdahulu/awal, 生 = lahir/hidup; secara filosofis orang yang lahir lebih dulu dan memberi bimbingan).",
        "distractor": "• Opsi A: 先正 adalah bentuk kanji yang salah.\n• Opsi C: 先世 bukan kanji yang digunakan untuk kata guru.\n• Opsi D: 先青 adalah bentuk kanji yang salah.",
        "grammarRule": "Kanji Dasar Bab 1: 先生（せんせい = guru / instruktur）."
      }
    },
    {
      "id": 25,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Pemakaian Kanji dalam Konteks (日本人)",
      "type": "teks",
      "question_ja": "山田さんは （ にほんじん ）です。<br>正しい 漢字の 組み合わせは どれですか。",
      "question_ruby": "山田さんは （ にほんじん ）です。<br>正しい 漢字の 組み合わせは どれですか。",
      "question_id": "Yamada-san adalah orang Jepang. Manakah kombinasi kanji yang tepat untuk 'nihonjin'?",
      "translation": "Yamada-san adalah orang Jepang.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "日本人"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "日本入"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "日木人"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "目本人"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (日本人).",
        "logic": "Kombinasi kanji untuk にほんじん (orang Jepang) adalah 日本人 (日 = matahari/hari, 本 = asal/buku, 人 = orang/warga).",
        "distractor": "• Opsi B: 日本入 salah karena menggunakan kanji 入 (iri/masuk) bukan 人 (hito/jin).\n• Opsi C: 日木人 salah karena menggunakan kanji 木 (pohon) bukan 本 (hon).\n• Opsi D: 目本人 salah karena menggunakan kanji 目 (mata) bukan 日 (hari/matahari).",
        "grammarRule": "Kanji Dasar Bab 1: 日本人（にほんじん = warga negara Jepang）."
      }
    }
  ]
};

const BAB_02_DATA = {
  "chapter": "02",
  "title_ja": "第２課：物の名前・指示代名詞（これ・それ・あれ）と助詞（の）",
  "title_id": "Bab 02: Nama Benda di Sekitar Kita, Kata Tunjuk & Partikel Kepemilikan",
  "theme_ja": "物の名前 (Mono no Namae) & 指示代名詞 (Shiji Daimeishi)",
  "theme_id": "Evaluasi penguasaan kosakata perlengkapan kerja pabrik, alat tulis, kata tunjuk (これ・それ・あれ・この・その・あの), serta partikel (は, の, も, か) pada Bab 2 buku IMM Japan.",
  "audioSrc": null,
  "pdfReadingSoalUrl": "assets/pdf/Salinan Soal Bab 02.pdf",
  "pdfReadingKunciUrl": "assets/pdf/Kunci dan Pembahasan Bab 02.pdf",
  "pdfSoalUrl": null,
  "pdfKunciUrl": null,
  "passingGrade": 80,
  "totalQuestions": 25,
  "readingCount": 25,
  "choukaiCount": 0,
  "questions": [
    {
      "id": 1,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Peralatan Kerja Pabrik",
      "type": "teks",
      "question_ja": "現場（げんば）で <strong>コンベックス</strong>を つかいます。「コンベックス」の 意味（いみ）は 何ですか。",
      "question_ruby": "現場（げんば）で <strong>コンベックス</strong>を つかいます。「コンベックス」の 意味（いみ）は 何ですか。",
      "question_id": "Istilah peralatan kerja yang dicetak tebal di atas bermakna...",
      "translation": "Di lokasi kerja (lapangan) menggunakan convex (meteran gulung). Apa arti dari 'convex'?",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Obeng kembang"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Tang pemotong"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Meteran pita rol"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Kunci inggris"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (Meteran pita rol).",
        "logic": "Kata <strong>コンベックス (konbekkusu / convex)</strong> adalah istilah khas industri manufaktur/konstruksi Jepang yang selalu diperkenalkan pada Bab 2 buku IMM Japan untuk menyebut <em>meteran gulung pita baja</em> (pengukur panjang fleksibel).",
        "distractor": "• Opsi A: Obeng dalam bahasa Jepang adalah ドライバー (doraibaa).\n• Opsi B: Tang pemotong adalah ペンチ (penchi) atau ニッパー (nippaa).\n• Opsi D: Kunci inggris/kunci pas adalah スパナ (supana) atau モンキーレンチ (monkii renchi).",
        "grammarRule": "Kosakata Khas Peralatan Kerja Bab 2 IMM Japan: コンベックス (meteran rol), ハンマー (palu), はさみ (gunting), かぎ (kunci), でんたく (kalkulator)."
      }
    },
    {
      "id": 2,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Cara Baca Kanji Dasar",
      "type": "teks",
      "question_ja": "あれは 田中先生の （　<strong>本</strong>　）です。",
      "question_ruby": "あれは 田中先生の （　<strong>本</strong>　）です。",
      "question_id": "Cara baca kanji di dalam tanda kurung yang tepat adalah...",
      "translation": "Itu adalah buku milik Tanaka-sensei.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "ほん"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "かみ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "ノート"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "ざっし"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (ほん).",
        "logic": "Kanji <strong>本</strong> memiliki cara baca baku <strong>ほん (hon)</strong> yang berarti buku.",
        "distractor": "• Opsi B: かみ adalah kertas, kanjinya adalah 紙.\n• Opsi C: ノート adalah buku tulis/catatan (kata serapan katakana).\n• Opsi D: ざっし adalah majalah, kanjinya adalah 雑誌.",
        "grammarRule": "Kanji Bab 2: 本 (ほん = buku), 車 (くるま = mobil), 紙 (かみ = kertas), 新聞 (しんぶん = koran)."
      }
    },
    {
      "id": 3,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Alat Pertukangan",
      "type": "teks",
      "question_ja": "つくえの 上に （　<strong>ハンマー</strong>　）が あります。「ハンマー」の インドネシア語は 何ですか。",
      "question_ruby": "つくえの 上に （　<strong>ハンマー</strong>　）が あります。「ハンマー」の インドネシア語は 何ですか。",
      "question_id": "Terjemahan bahasa Indonesia untuk kata di dalam tanda kurung adalah...",
      "translation": "Di atas meja ada palu. Apa bahasa Indonesia dari 'hanmaa'?",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Gergaji kayu"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Palu / Martil"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Gunting plat"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Pahat besi"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (Palu / Martil).",
        "logic": "Kata <strong>ハンマー (hanmaa)</strong> diserap dari bahasa Inggris <em>hammer</em> yang berarti <strong>palu</strong> atau martil, peralatan tangan penting yang sering digunakan peserta magang teknik di pabrik.",
        "distractor": "• Opsi A: Gergaji kayu adalah のこぎり (nokogiri).\n• Opsi C: Gunting plat adalah 金切ばさみ (kanakiri-basami).\n• Opsi D: Pahat adalah のみ (nomi).",
        "grammarRule": "Peralatan Tangan Bab 2: ハンマー (palu), はさみ (gunting), かぎ (kunci pintu/gembok)."
      }
    },
    {
      "id": 4,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Fasilitas Kantor/Kelas",
      "type": "teks",
      "question_ja": "田中先生の （　　　）は あれです。",
      "question_ruby": "田中先生の （　　　）は あれです。",
      "question_id": "Kosakata perabot yang tepat sesuai teks pembuka Bab 2 untuk melengkapi kalimat di atas adalah...",
      "translation": "Meja milik Tanaka-sensei adalah yang di sebelah sana itu.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "めがね"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "つくえ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "ライター"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "たばこ"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (つくえ).",
        "logic": "Dalam teks pengantar Bab 2 halaman 10 buku IMM Japan tertulis kalimat model: <em>「田中先生のつくえはそれではありません。田中先生のつくえはあれです。」</em>. Kata <strong>つくえ (tsukue)</strong> bermakna <strong>meja belajar / meja kerja</strong>.",
        "distractor": "• Opsi A: めがね berarti kacamata.\n• Opsi C: ライター berarti korek gas.\n• Opsi D: たばこ berarti rokok.",
        "grammarRule": "Fasilitas Kelas & Asrama Bab 2: つくえ (meja kerja/tulis), いす (kursi), ベッド (tempat tidur), ゴミばこ (tempat sampah)."
      }
    },
    {
      "id": 5,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kata Tunjuk Jarak (Ko-So-A-Do)",
      "type": "teks",
      "question_ja": "話し手（自分）の <strong>近くに ある 物</strong>を 指す とき、どの 言葉を つかいますか。",
      "question_ruby": "話し手（自分）の <strong>近くに ある 物</strong>を 指す とき、どの 言葉を つかいますか。",
      "question_id": "Kata tunjuk yang digunakan untuk menunjukkan benda yang berada dekat dengan pembicara adalah...",
      "translation": "Saat menunjuk benda yang berada di dekat pembicara (diri sendiri), kata mana yang digunakan?",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "これ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "それ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "あれ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "どれ"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (これ).",
        "logic": "Dalam sistem kata tunjuk bahasa Jepang (Ko-So-A-Do):<br>• <strong>これ (kore)</strong>: benda di dekat pembicara.<br>• <strong>それ (sore)</strong>: benda di dekat lawan bicara.<br>• <strong>あれ (are)</strong>: benda jauh dari pembicara maupun lawan bicara.<br>• <strong>どれ (dore)</strong>: kata tanya ('yang mana').",
        "distractor": "• Opsi B: それ digunakan untuk benda yang dekat dengan lawan bicara.\n• Opsi C: あれ digunakan untuk benda yang jauh dari kedua belah pihak.\n• Opsi D: どれ adalah kata tanya untuk memilih di antara 3 benda atau lebih.",
        "grammarRule": "Trilogi Demonstrativa Benda: これ (dekat saya) ➔ それ (dekat kamu) ➔ あれ (jauh di sana) ➔ どれ (tanya: yang mana)."
      }
    },
    {
      "id": 6,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Peralatan Kantor",
      "type": "teks",
      "question_ja": "紙（かみ）を 切ります（きります）。つかう 道具（どうぐ）は どれですか。",
      "question_ruby": "紙（かみ）を 切ります（きります）。つかう 道具（どうぐ）は どれですか。",
      "question_id": "Alat yang digunakan untuk memotong kertas pada kalimat di atas adalah...",
      "translation": "Memotong kertas. Alat yang digunakan adalah yang mana?",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "はさみ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "ボールペン"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "はいざら"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "ラジオ"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (はさみ).",
        "logic": "Kata <strong>はさみ (hasami)</strong> berarti <strong>gunting</strong>, alat yang digunakan untuk memotong kertas atau kain.",
        "distractor": "• Opsi B: ボールペン adalah pena / pulpen untuk menulis.\n• Opsi C: はいざら adalah asbak rokok.\n• Opsi D: ラジオ adalah radio pemutar siaran suara.",
        "grammarRule": "Peralatan Tulis Bab 2: えんぴつ (pensil), シャープペンシル (pensil mekanik), ボールペン (pulpen), はさみ (gunting), けしゴム (penghapus - bab 7)."
      }
    },
    {
      "id": 7,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Cara Baca Kanji Kendaraan",
      "type": "teks",
      "question_ja": "あれは 社長（しゃちょう）の （　<strong>車</strong>　）です。",
      "question_ruby": "あれは 社長（しゃちょう）の （　<strong>車</strong>　）です。",
      "question_id": "Cara baca kanji di dalam tanda kurung yang tepat adalah...",
      "translation": "Yang di sebelah sana itu adalah mobil milik direktur perusahaan.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "じてんしゃ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "でんしゃ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "くるま"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "ひこうき"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (くるま).",
        "logic": "Kanji <strong>車</strong> memiliki cara baca <strong>くるま (kuruma)</strong> yang bermakna <strong>mobil / kendaraan beroda</strong>.",
        "distractor": "• Opsi A: じてんしゃ adalah sepeda (自転車).\n• Opsi B: でんしゃ adalah kereta listrik (電車).\n• Opsi D: ひこうき adalah pesawat terbang (飛行機).",
        "grammarRule": "Kanji Bab 2: 車 (くるま = mobil). Frasa penting di Bab 2: 社長の車 (mobil direktur), アグスさんの車 (mobil Agus)."
      }
    },
    {
      "id": 8,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kata Tanya Benda",
      "type": "teks",
      "question_ja": "アグス：「それ は （　　　）ですか。」<br>すずき：「これは パソコンです。」",
      "question_ruby": "アグス：「それ は （　　　）ですか。」<br>すずき：「これは パソコンです。」",
      "question_id": "Kata tanya yang tepat untuk menanyakan nama benda pada dialog di atas adalah...",
      "translation": "Agus: \"Itu apa?\"<br>Suzuki: \"Ini adalah komputer (PC).\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "だれ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "何（なん）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "どこ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "どなた"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (何（なん）).",
        "logic": "Untuk menanyakan nama suatu benda yang belum diketahui, kata tanya yang digunakan adalah <strong>何（なん / なに - nan / nani = apa）</strong>. Dalam pola <em>「～は何ですか」</em>, selalu dilafalkan <strong>なん (nan)</strong>.",
        "distractor": "• Opsi A: だれ digunakan untuk menanyakan orang (siapa).\n• Opsi C: どこ digunakan untuk menanyakan tempat / lokasi (di mana - Bab 3).\n• Opsi D: どなた adalah bentuk sopan untuk menanyakan orang (siapakah beliau).",
        "grammarRule": "Rumus Kalimat Tanya Benda: これ / それ / あれ は 何（なん）ですか。(Ini/itu benda apa?)."
      }
    },
    {
      "id": 9,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Peralatan Kantor",
      "type": "teks",
      "question_ja": "アグス：「すみません、これは （　　　）ですか。」<br>すずき：「はい、計算（けいさん）の 機械（きかい）です。」",
      "question_ruby": "アグス：「すみません、これは （　　　）ですか。」<br>すずき：「はい、計算（けいさん）の 機械（きかい）です。」",
      "question_id": "Kata benda alat hitung yang sesuai dengan dialog percakapan Bab 2 di atas adalah...",
      "translation": "Agus: \"Permisi, apakah ini kalkulator?\"<br>Suzuki: \"Ya, benar, mesin hitung.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "テレビ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "ラジオ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "電たく（でんたく）"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "カメラ"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (電たく（でんたく）).",
        "logic": "Kata <strong>電たく（でんたく - dentaku）</strong> berarti <strong>kalkulator elektronik</strong> (mesin hitung saku), sesuai percakapan Bab 2 hal. 16 buku IMM Japan.",
        "distractor": "• Opsi A: テレビ adalah televisi (pesawat penerima siaran gambar).\n• Opsi B: ラジオ adalah radio.\n• Opsi D: カメラ adalah kamera pemotret gambar.",
        "grammarRule": "Alat Elektronik Bab 2: パソコン (komputer), 電たく (kalkulator), けいたい電話 (HP/ponsel), テレビ (TV), ラジカセ (radio kaset)."
      }
    },
    {
      "id": 10,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Alat Catatan Kerja",
      "type": "teks",
      "question_ja": "会社で 毎日の 指示（しじ）を 書きます。これは （　　　）です。",
      "question_ruby": "会社で 毎日の 指示（しじ）を 書きます。これは （　　　）です。",
      "question_id": "Media untuk mencatat instruksi harian di tempat kerja yang dipelajari pada Bab 2 adalah...",
      "translation": "Di perusahaan menuliskan instruksi setiap hari. Ini adalah buku memo.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "ゴミばこ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "メモちょう"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "はいざら"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "ライター"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (メモちょう).",
        "logic": "Kata <strong>メモちょう (memochou)</strong> berarti <strong>buku catatan saku / buku memo</strong>. Peserta magang diwajibkan selalu membawa memoちょう untuk mencatat perintah kerja instruktur pabrik.",
        "distractor": "• Opsi A: ゴミばこ berarti tempat sampah.\n• Opsi C: はいざら berarti asbak rokok.\n• Opsi D: ライター berarti korek api gas.",
        "grammarRule": "Kosakata Kerja Pemagang Bab 2: メモちょう (buku catatan saku), 新聞 (koran), 手紙 (surat), ざっし (majalah)."
      }
    },
    {
      "id": 11,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Penanda Topik Benda (は)",
      "type": "teks",
      "question_ja": "これ （　<strong>★</strong>　） ボールペンです。",
      "question_ruby": "これ （　<strong>★</strong>　） ボールペンです。",
      "question_id": "Partikel yang tepat untuk mengisi posisi bintang (★) penanda topik kalimat di atas adalah...",
      "translation": "Ini adalah pulpen.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "の"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "は"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "を"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "に"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (は).",
        "logic": "Partikel <strong>は (wa)</strong> berfungsi sebagai penanda topik kalimat. Dalam pola dasar <em>「これ／それ／あれ は [Benda] です」</em>, partikel <strong>は</strong> diletakkan setelah kata tunjuk.",
        "distractor": "• Opsi A: の berfungsi sebagai partikel penghubung kepemilikan antar-kata benda.\n• Opsi C: を berfungsi sebagai penanda objek langsung penderita (baru dipelajari di Bab 6).\n• Opsi D: に berfungsi sebagai penanda waktu/tujuan keberadaan (Bab 4 & Bab 10).",
        "grammarRule": "Pola Kalimat Dasar Bab 2: [これ / それ / あれ] ＋ は ＋ [Kata Benda] ＋ です。"
      }
    },
    {
      "id": 12,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Kepemilikan (の)",
      "type": "teks",
      "question_ja": "あれは 先生 （　<strong>★</strong>　） パソコンです。",
      "question_ruby": "あれは 先生 （　<strong>★</strong>　） パソコンです。",
      "question_id": "Partikel yang tepat untuk menghubungkan pemilik (先生) dengan barang miliknya (パソコン) adalah...",
      "translation": "Itu adalah komputer milik guru.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "は"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "も"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "の"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "か"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (の).",
        "logic": "Partikel <strong>の (no)</strong> berfungsi menghubungkan dua kata benda (Nomina 1 + の + Nomina 2), di mana Nomina 1 menerangkan pemilik dari Nomina 2 (kepemilikan: 先生のパソコン = komputer milik guru).",
        "distractor": "• Opsi A: は adalah penanda topik, tidak digunakan di antara orang dan barang miliknya.\n• Opsi B: も berarti 'juga/pun'.\n• Opsi D: か adalah partikel tanya di akhir kalimat.",
        "grammarRule": "Kaidah Partikel の (Kepemilikan): [Orang / Pemilik] ＋ の ＋ [Benda yang Dimiliki]."
      }
    },
    {
      "id": 13,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Tanya Konfirmasi (か)",
      "type": "teks",
      "question_ja": "それ は あなたの えんぴつ です （　<strong>★</strong>　）。",
      "question_ruby": "それ は あなたの えんぴつ です （　<strong>★</strong>　）。",
      "question_id": "Partikel penutup kalimat tanya yang tepat untuk melengkapi kalimat di atas adalah...",
      "translation": "Apakah itu pensil milikmu?",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "ね"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "よ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "か"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "わ"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (か).",
        "logic": "Partikel <strong>か (ka)</strong> diletakkan di akhir kalimat predikat <em>です</em> untuk mengubah kalimat pernyataan menjadi kalimat tanya (interogatif) tanpa memerlukan tanda tanya (?) dalam penulisan formal bahasa Jepang.",
        "distractor": "• Opsi A: ね adalah partikel penegas untuk meminta persetujuan lawan bicara (\"ya kan?\").\n• Opsi B: よ adalah partikel pemberitahuan informasi baru kepada lawan bicara.\n• Opsi D: わ adalah partikel ragam wanita yang tidak diajarkan pada pola baku pemagangan.",
        "grammarRule": "Rumus Kalimat Tanya Konfirmasi: ～ですか。➔ Respon positif: はい、そうです。／ Respon negatif: いいえ、ちがいます。"
      }
    },
    {
      "id": 14,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Inklusi / Kesamaan (も)",
      "type": "teks",
      "question_ja": "田中先生：「あれは 社長の 車です。」<br>ダダン：「あの車 （　<strong>★</strong>　） 社長の 車ですか。」<br>田中先生：「いいえ、ちがいます。すずきさんの 車です。」",
      "question_ruby": "田中先生：「あれは 社長の 車です。」<br>ダダン：「あの車 （　<strong>★</strong>　） 社長の 車ですか。」<br>田中先生：「いいえ、ちがいます。すずきさんの 車です。」",
      "question_id": "Partikel yang tepat untuk menyatakan kesamaan predikat ('juga') pada dialog di atas adalah...",
      "translation": "Tanaka-sensei: \"Yang di sebelah sana itu adalah mobil direktur.\"<br>Dadan: \"Apakah mobil yang di sebelah sana itu juga mobil direktur?\"<br>Tanaka-sensei: \"Bukan, salah. Itu mobil Suzuki-san.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "は"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "の"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "も"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "が"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (も).",
        "logic": "Partikel <strong>も (mo)</strong> bermakna <strong>juga / pun</strong>. Partikel ini menggantikan partikel <strong>は</strong> ketika topik kalimat memiliki predikat atau atribut yang sama dengan topik sebelumnya (apakah mobil yang itu <em>juga</em> milik direktur).",
        "distractor": "• Opsi A: は hanya menyatakan topik netral tanpa nuansa kesamaan.\n• Opsi B: の menunjukkan kepemilikan/hubungan, bukan partikel subjek.\n• Opsi D: が adalah penanda subjek gramatikal yang baru dipelajari pada bab selanjutnya.",
        "grammarRule": "Kaidah Partikel も (Juga): Menggantikan partikel は ketika predikat yang dibicarakan bernilai setara atau sama."
      }
    },
    {
      "id": 15,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Kombinasi Partikel Topik & Kepemilikan (は / の)",
      "type": "teks",
      "question_ja": "この かぎ （　①　） わたし （　②　） です。",
      "question_ruby": "この かぎ （　①　） わたし （　②　） です。",
      "question_id": "Kombinasi partikel yang tepat untuk mengisi posisi ① dan ② adalah...",
      "translation": "Kunci ini adalah milik saya.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "① は　／　② の"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "① の　／　② は"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "① は　／　② も"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "① の　／　② に"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (① は　／　② の).",
        "logic": "Pola kalimat Bab 2 halaman 12: <em>「この〔その・あの〕～は〈人〉の です」</em>.<br>Posisi ① membutuhkan partikel topik <strong>は</strong> setelah frasa benda <em>このかぎ</em>.<br>Posisi ② membutuhkan partikel kepemilikan <strong>の</strong> setelah orang <em>わたし</em> yang bermakna 'milik saya'.",
        "distractor": "• Opsi B: Susunan terbalik (の / は) salah secara tata bahasa.\n• Opsi C: Partikel も di posisi kedua tidak tepat karena tidak ada konteks inklusi kepemilikan sebelumnya.\n• Opsi D: Partikel に di posisi kedua tidak sesuai dengan fungsi kepemilikan benda.",
        "grammarRule": "Pola Modifikasi Demonstrativa: この / その / あの ＋ [Kata Benda] ＋ は ＋ [Orang] の です。"
      }
    },
    {
      "id": 16,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Pola Kalimat Tanya Pilihan (Aですか、Bですか)",
      "type": "teks",
      "question_ja": "A：「これ は 辞書（じしょ）（　①　）、ノート（　②　）。」<br>B：「……辞書です。」",
      "question_ruby": "A：「これ は 辞書（じしょ）（　①　）、ノート（　②　）。」<br>B：「……辞書です。」",
      "question_id": "Bentuk frasa interogatif yang tepat untuk mengisi ① dan ② pada pertanyaan pilihan di atas adalah...",
      "translation": "A: \"Apakah ini kamus, ataukah buku tulis?\"<br>B: \"...Kamus.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "① ですか　／　② ですか"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "① です　／　② です"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "① のですか　／　② のですか"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "① ですから　／　② ですから"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (① ですか　／　② ですか).",
        "logic": "Dalam bahasa Jepang, untuk menanyakan pilihan di antara dua hal alternatif (apakah A atau B), digunakan pola <strong>[A] ですか、[B] ですか</strong> secara sejajar tanpa kata penghubung 'atau'. Lawan bicara akan menjawab langsung dengan menyebutkan salah satu pilihannya.",
        "distractor": "• Opsi B: です / です adalah kalimat pernyataan, bukan pertanyaan pilihan.\n• Opsi C: のですか digunakan untuk meminta penjelasan sebab (ragam penjelasan n desu - Bab lanjutan).\n• Opsi D: ですから berarti 'oleh karena itu' (konjungsi alasan).",
        "grammarRule": "Rumus Tanya Pilihan Alternatif Bab 2: [Pilihan A] ですか、[Pilihan B] ですか。➔ Menjawab langsung: [Pilihan yang benar] です。"
      }
    },
    {
      "id": 17,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Tanya Kepemilikan (だれの)",
      "type": "teks",
      "question_ja": "A：「あれ は （　<strong>だれ</strong>　）（　<strong>★</strong>　） カメラですか。」<br>B：「アグスさんの カメラです。」",
      "question_ruby": "A：「あれ は （　<strong>だれ</strong>　）（　<strong>★</strong>　） カメラですか。」<br>B：「アグスさんの カメラです。」",
      "question_id": "Partikel yang tepat untuk digabungkan dengan kata tanya 'だれ' menanyakan kepemilikan benda adalah...",
      "translation": "A: \"Itu kamera milik siapa?\"<br>B: \"Kamera milik Agus-san.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "は"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "の"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "も"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "か"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (の).",
        "logic": "Untuk menanyakan kepemilikan suatu benda (milik siapa), kata tanya <strong>だれ (dare = siapa)</strong> digabungkan dengan partikel kepemilikan <strong>の</strong> menjadi <strong>だれの (dare no = milik siapa)</strong>.",
        "distractor": "• Opsi A: だれは tidak lazim dalam pola menanyakan kepemilikan di depan kata benda.\n• Opsi C: だれも berarti 'siapa pun tidak' (diikuti predikat negatif pada Bab 10).\n• Opsi D: だれか berarti 'seseorang' (kata ganti tak tentu).",
        "grammarRule": "Pola Tanya Pemilik: これ / それ / あれ は だれの [Kata Benda] ですか。"
      }
    },
    {
      "id": 18,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Kepemilikan Elipsis (～の です)",
      "type": "teks",
      "question_ja": "A：「この かばんは だれのですか。」<br>B：「アリさん （　<strong>★</strong>　） です。」",
      "question_ruby": "A：「この かばんは だれのですか。」<br>B：「アリさん （　<strong>★</strong>　） です。」",
      "question_id": "Partikel yang tepat untuk menyatakan 'milik Ali-san' tanpa mengulang kata 'かばん' adalah...",
      "translation": "A: \"Tas ini milik siapa?\"<br>B: \"Milik Ali-san.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "は"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "も"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "の"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "が"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (の).",
        "logic": "Jika kata benda yang dibicarakan sudah dipahami secara jelas dari konteks percakapan, kata benda tersebut dapat dihilangkan (elipsis) setelah partikel <strong>の</strong>. Sehingga frasa <em>「アリさんのかばんです」</em> cukup diucapkan <strong>「アリさんの です」</strong> (milik Ali-san).",
        "distractor": "• Opsi A: アリさんです berarti 'Orang ini adalah Ali-san' (salah konteks karena yang ditanya adalah pemilik tas).\n• Opsi B: アリさんもです berarti 'Ali-san juga demikian'.\n• Opsi D: が adalah penanda subjek gramatikal.",
        "grammarRule": "Kaidah Penghilangan Benda (Elipsis): [Orang] の [Benda] です ➔ [Orang] の です (milik [Orang])."
      }
    },
    {
      "id": 19,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Kepemilikan dalam Teks Pengantar",
      "type": "teks",
      "question_ja": "わたし （　<strong>★</strong>　） かばんは これでは ありません。あれです。",
      "question_ruby": "わたし （　<strong>★</strong>　） かばんは これでは ありません。あれです。",
      "question_id": "Partikel yang tepat sesuai teks pengantar Bab 2 halaman 10 untuk menyatakan 'tas saya' adalah...",
      "translation": "Tas milik saya bukanlah yang ini. Yang di sebelah sana itu.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "の"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "は"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "も"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "に"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (の).",
        "logic": "Sesuai kalimat pada buku IMM Japan Bab 2 halaman 10: <em>「わたしのかばんはこれではありません。わたしのかばんはあれです。」</em>, partikel penghubung antara 'わたし' (saya) dan 'かばん' (tas) adalah <strong>の</strong>.",
        "distractor": "• Opsi B: わたしはかばん... berarti 'Saya adalah tas' (salah secara semantik).\n• Opsi C: わたしもかばん... berarti 'Saya juga tas'.\n• Opsi D: わたしにかばん... tidak memiliki makna kepemilikan yang sah.",
        "grammarRule": "Kaidah Hubungan Persona-Barang: わたしの [Benda] (barang milik saya), あなたの [Benda] (barang milikmu)."
      }
    },
    {
      "id": 20,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Penanda Topik dalam Percakapan Kerja",
      "type": "teks",
      "question_ja": "A：「これも あなたの けいたい電話ですか。」<br>B：「いいえ、それ （　<strong>★</strong>　） わたしのじゃ ありません。ダダンさんのです。」",
      "question_ruby": "A：「これも あなたの けいたい電話ですか。」<br>B：「いいえ、それ （　<strong>★</strong>　） わたしのじゃ ありません。ダダンさんのです。」",
      "question_id": "Partikel topik yang tepat untuk melengkapi respon negatif pada dialog Bab 2 di atas adalah...",
      "translation": "A: \"Apakah ini juga HP milikmu?\"<br>B: \"Bukan, kalau yang itu bukan milik saya. Itu milik Dadan-san.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "に"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "は"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "の"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "と"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (は).",
        "logic": "Dalam dialog percakapan Renshuu C Bab 2 hal. 15, pembicara B merespons dengan menetapkan benda yang ditanyakan sebagai topik baru yang disangkal: <em>「いいえ、それ <strong>は</strong> わたしのじゃ ありません。」</em>. Partikel yang tepat adalah penanda topik <strong>は (wa)</strong>.",
        "distractor": "• Opsi A: に berfungsi sebagai penanda sasaran / waktu.\n• Opsi C: の adalah partikel kepemilikan.\n• Opsi D: と adalah partikel penyerta 'bersama' atau konjungsi 'dan'.",
        "grammarRule": "Pola Kalimat Sangkalan Bab 2: [これ / それ / あれ] は [Orang] の じゃありません／ではありません。"
      }
    },
    {
      "id": 21,
      "session": "reading",
      "section_ja": "第3部：読解・図解評価",
      "section_id": "Sesi 1: Reading — Zukai (Evaluasi Bergambar)",
      "category": "Soal Bergambar — Benda Pribadi / Kantor (鍵)",
      "type": "gambar",
      "question_ja": "絵（え）を 見て ください。これは 何ですか。<br>「これは （　　　）です。」",
      "question_ruby": "絵（え）を 見て ください。これは 何ですか。<br>「これは （　　　）です。」",
      "question_id": "Perhatikan gambar. Benda apakah ini? 'Ini adalah (...)'.",
      "translation": "Ini adalah kunci.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "かぎ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "とけい"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "かさ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "ほん"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (かぎ).",
        "logic": "Gambar menunjukkan kunci (鍵 / かぎ - kagi) untuk membuka pintu kamar atau loker pabrik.",
        "distractor": "• Opsi B: とけい berarti jam tangan / dinding.\n• Opsi C: かさ berarti payung.\n• Opsi D: ほん berarti buku.",
        "grammarRule": "Benda Sehari-hari Bab 2: 鍵（かぎ = kunci）."
      },
      "image": "assets/bab_02/reading_q21.jpeg"
    },
    {
      "id": 22,
      "session": "reading",
      "section_ja": "第3部：読解・図解評価",
      "section_id": "Sesi 1: Reading — Zukai (Evaluasi Bergambar)",
      "category": "Soal Bergambar — Peralatan Elektronik (カメラ)",
      "type": "gambar",
      "question_ja": "絵（え）を 見て ください。これは 何ですか。<br>「それは 田中さんの （　　　）です。」",
      "question_ruby": "絵（え）を 見て ください。これは 何ですか。<br>「それは 田中さんの （　　　）です。」",
      "question_id": "Perhatikan gambar. Benda apakah ini? 'Itu adalah (...) milik Tanaka-san.'",
      "translation": "Itu adalah kamera milik Tanaka-san.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "ラジオ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "テレビ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "カメラ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "ノート"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (カメラ).",
        "logic": "Gambar menunjukkan kamera foto (カメラ - kamera).",
        "distractor": "• Opsi A: ラジオ berarti radio.\n• Opsi B: テレビ berarti televisi.\n• Opsi D: ノート berarti buku catatan.",
        "grammarRule": "Kata Serapan Bab 2: カメラ（kamera）."
      },
      "image": "assets/bab_02/reading_q22.jpeg"
    },
    {
      "id": 23,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Cara Baca Kanji (本)",
      "type": "teks",
      "question_ja": "これは 日本語の （ 本 ）です。<br>（　）の 漢字の 正しい 読み方は どれですか。",
      "question_ruby": "これは 日本語の （ 本 ）です。<br>（　）の 漢字の 正しい 読み方は どれですか。",
      "question_id": "Ini adalah buku bahasa Jepang. Pilihlah cara baca kanji '本' yang tepat.",
      "translation": "Ini adalah buku bahasa Jepang.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "ほん"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "ざっし"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "しんぶん"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "じしょ"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (ほん).",
        "logic": "Kanji 本 memiliki cara baca ほん (hon) yang bermakna buku.",
        "distractor": "• Opsi B: ざっし adalah majalah (雑誌).\n• Opsi C: しんぶん adalah surat kabar (新聞).\n• Opsi D: じしょ adalah kamus (辞書).",
        "grammarRule": "Kanji Dasar Bab 2: 本（ほん = buku）."
      }
    },
    {
      "id": 24,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Penulisan Kanji (車)",
      "type": "teks",
      "question_ja": "あれは 会社の （ くるま ）です。<br>（　）の 言葉の 正しい 漢字は どれですか。",
      "question_ruby": "あれは 会社の （ くるま ）です。<br>（　）の 言葉の 正しい 漢字は どれですか。",
      "question_id": "Itu adalah mobil milik perusahaan. Pilihlah kanji yang tepat untuk 'kuruma'.",
      "translation": "Itu adalah mobil milik perusahaan.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "車"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "東"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "軍"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "連"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (車).",
        "logic": "Kata くるま (kuruma) ditulis dengan kanji 車 yang menggambarkan gerobak/kendaraan beroda.",
        "distractor": "• Opsi B: 東 adalah kanji 'higashi' (timur).\n• Opsi C: 軍 adalah kanji tentara/militer.\n• Opsi D: 連 adalah kanji menyambung/seri.",
        "grammarRule": "Kanji Dasar Bab 2: 車（くるま = mobil/kendaraan）."
      }
    },
    {
      "id": 25,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Pemakaian Kanji dalam Konteks (辞書)",
      "type": "teks",
      "question_ja": "わからない 言葉は （ じしょ ）で 調べます。<br>正しい 漢字は どれですか。",
      "question_ruby": "わからない 言葉は （ じしょ ）で 調べます。<br>正しい 漢字は どれですか。",
      "question_id": "Kata yang tidak dimengerti dicari di dalam kamus. Pilihlah penulisan kanji yang tepat untuk 'jisho'.",
      "translation": "Kata yang tidak dimengerti diperiksa di kamus.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "辞書"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "辞者"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "治書"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "事書"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (辞書).",
        "logic": "Kata じしょ (kamus) ditulis dengan kanji 辞書 (辞 = kata/istilah, 書 = dokumen/buku).",
        "distractor": "• Opsi B: 辞者 adalah penulisan yang salah.\n• Opsi C: 治書 adalah penulisan yang salah.\n• Opsi D: 事書 adalah penulisan yang salah.",
        "grammarRule": "Kanji Pembelajaran: 辞書（じしょ = kamus）."
      }
    }
  ]
};

const BAB_03_DATA = {
  "chapter": "03",
  "title_ja": "第３課：場所の名前・指示代名詞（ここ・そこ・あそこ）と助詞（の・は）",
  "title_id": "Bab 03: Nama Tempat, Kata Tunjuk Lokasi & Partikel Asal / Kepemilikan",
  "theme_ja": "場所の名前 (Basho no Namae) & 所在表現 (Shozai Hyougen)",
  "theme_id": "Evaluasi penguasaan kosakata fasilitas pabrik, kantor, asrama, kata tunjuk lokasi (ここ・そこ・あそこ・どこ・こちら・そちら・あちら・どちら), harga/angka, serta partikel (は, の, も, か) pada Bab 3 buku IMM Japan.",
  "audioSrc": null,
  "pdfReadingSoalUrl": "assets/pdf/Salinan Soal Bab 03.pdf",
  "pdfReadingKunciUrl": "assets/pdf/Kunci dan Pembahasan Bab 03.pdf",
  "pdfSoalUrl": null,
  "pdfKunciUrl": null,
  "passingGrade": 80,
  "totalQuestions": 25,
  "readingCount": 25,
  "choukaiCount": 0,
  "questions": [
    {
      "id": 1,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Fasilitas Kerja Pabrik",
      "type": "teks",
      "question_ja": "実習生は 毎日 <strong>こうじょう</strong>で 実習を します。「こうじょう」の 意味は どれですか。",
      "question_ruby": "実習生は 毎日 <strong>こうじょう</strong>で 実習を します。「こうじょう」の 意味は どれですか。",
      "question_id": "Istilah fasilitas kerja yang dicetak tebal di atas bermakna...",
      "translation": "Peserta magang setiap hari magang di pabrik (koujou). Apa arti dari 'koujou'?",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Pabrik / Bengkel kerja"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Asrama tempat tinggal"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Kantor administrasi"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Kantin karyawan"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (Pabrik / Bengkel kerja).",
        "logic": "Kata <strong>こうじょう (工場 - koujou)</strong> berarti <strong>pabrik / bengkel kerja industri</strong>, tempat utama peserta magang teknis IMM Japan melaksanakan praktek kerja kerja.",
        "distractor": "• Opsi B: Asrama adalah 寮 (りょう).\n• Opsi C: Kantor adalah 事務所 (じむしょ).\n• Opsi D: Kantin adalah 食堂 (しょくどう).",
        "grammarRule": "Fasilitas Perusahaan Bab 3: 工場 (こうじょう = pabrik), 事務所 (じむしょ = kantor), 倉庫 (そうこ = gudang), 受付 (うけつけ = resepsionis)."
      }
    },
    {
      "id": 2,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Cara Baca Kanji Ruangan",
      "type": "teks",
      "question_ja": "ここは 日本語の （　<strong>教室</strong>　）です。",
      "question_ruby": "ここは 日本語の （　<strong>教室</strong>　）です。",
      "question_id": "Cara baca kanji di dalam tanda kurung yang tepat adalah...",
      "translation": "Di sini adalah ruang kelas bahasa Jepang.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "きょうしつ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "じむしょ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "しょくどう"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "かいぎしつ"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (きょうしつ).",
        "logic": "Kanji <strong>教室</strong> memiliki cara baca <strong>きょうしつ (kyoushitsu)</strong> yang berarti <strong>ruang kelas</strong> tempat belajar.",
        "distractor": "• Opsi B: じむしょ adalah kantor (事務所).\n• Opsi C: しょくどう adalah kantin / ruang makan (食堂).\n• Opsi D: かいぎしつ adalah ruang rapat (会議室).",
        "grammarRule": "Kanji Ruangan Bab 3: 教室 (きょうしつ = ruang kelas), 事務所 (じむしょ = kantor), 食堂 (しょくどう = ruang makan)."
      }
    },
    {
      "id": 3,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Fasilitas Makan",
      "type": "teks",
      "question_ja": "昼休み（ひるやすみ）に ごはんを 食べます。この 場所は （　　　）です。",
      "question_ruby": "昼休み（ひるやすみ）に ごはんを 食べます。この 場所は （　　　）です。",
      "question_id": "Kosakata tempat makan yang tepat untuk melengkapi kalimat di atas adalah...",
      "translation": "Saat istirahat siang makan nasi. Tempat ini adalah ruang makan / kantin.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "お手洗い"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "食堂（しょくどう）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "そうこ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "かいだん"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (食堂（しょくどう）).",
        "logic": "Kata <strong>食堂（しょくどう - shokudou）</strong> berarti <strong>ruang makan / kantin</strong>, fasilitas makan bersama di asrama atau pabrik.",
        "distractor": "• Opsi A: お手洗い (おてあらい) adalah toilet / kamar kecil.\n• Opsi C: そうこ (倉庫) adalah gudang penyimpanan barang.\n• Opsi D: かいだん (階段) adalah tangga.",
        "grammarRule": "Fasilitas Umum Bab 3: 食堂 (kantin), お手洗い／トイレ (toilet), 会議室 (ruang rapat), 部屋 (kamar)."
      }
    },
    {
      "id": 4,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Fasilitas Gudang",
      "type": "teks",
      "question_ja": "材料（ざいりょう）や 道具（どうぐ）を 保管（ほかん）します。ここは （　　　）です。",
      "question_ruby": "材料（ざいりょう）や 道具（どうぐ）を 保管（ほかん）します。ここは （　　　）です。",
      "question_id": "Tempat penyimpanan material dan peralatan kerja yang dipelajari pada Bab 3 adalah...",
      "translation": "Menyimpan material dan peralatan. Di sini adalah gudang (souko).",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "ロビー"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "うけつけ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "倉庫（そうこ）"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "きょうしつ"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (倉庫（そうこ）).",
        "logic": "Kata <strong>倉庫（そうこ - souko）</strong> berarti <strong>gudang</strong> tempat menyimpan barang, material kerja, atau alat-alat pabrik.",
        "distractor": "• Opsi A: ロビー adalah lobi gedung.\n• Opsi B: うけつけ adalah bagian penerima tamu / resepsionis.\n• Opsi D: きょうしつ adalah ruang kelas.",
        "grammarRule": "Kosakata Penting Pabrik Bab 3: 倉庫 (そうこ = gudang), 工場 (こうじょう = pabrik), 事務所 (じむしょ = kantor)."
      }
    },
    {
      "id": 5,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kata Tunjuk Arah / Tempat Santun",
      "type": "teks",
      "question_ja": "客（きゃく）：「すみません、お手洗いは （　　　）ですか。」<br>受付：「あちらで ございます。」",
      "question_ruby": "客（きゃく）：「すみません、お手洗いは （　　　）ですか。」<br>受付：「あちらで ございます。」",
      "question_id": "Kata tanya arah / lokasi ragam santun (polite) yang tepat untuk melengkapi percakapan di atas adalah...",
      "translation": "Tamu: \"Permisi, toilet sebelah mana?\"<br>Resepsionis: \"Di sebelah sana (santun).\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "どちら"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "だれ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "なんさい"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "いくら"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (どちら).",
        "logic": "Kata tanya <strong>どちら (dochira)</strong> adalah bentuk santun dari <strong>どこ (doko = mana)</strong> untuk menanyakan arah atau tempat kepada tamu atau pimpinan.",
        "distractor": "• Opsi B: だれ digunakan untuk menanyakan orang (siapa).\n• Opsi C: なんさい digunakan untuk menanyakan usia (berapa tahun).\n• Opsi D: いくら digunakan untuk menanyakan harga uang (berapa harganya).",
        "grammarRule": "Sistem Arah / Lokasi Sopan Bab 3: こちら (sini) ➔ そちら (situ) ➔ あちら (sana) ➔ どちら (mana / sebelah mana)."
      }
    },
    {
      "id": 6,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Peralatan Otomatis",
      "type": "teks",
      "question_ja": "コインを 入れて（いれて） ジュースを 買います。この 機械（きかい）は 何ですか。",
      "question_ruby": "コインを 入れて（いれて） ジュースを 買います。この 機械（きかい）は 何ですか。",
      "question_id": "Mesin penjual minuman otomatis yang banyak ditemui di pabrik Jepang adalah...",
      "translation": "Memasukkan koin lalu membeli jus. Mesin apakah ini?",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "エレベーター"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "自動販売機（じどうはんばいき）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "エスカレーター"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "パソコン"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (自動販売機（じどうはんばいき）).",
        "logic": "Kata <strong>自動販売機（じどうはんばいき - jidou hanbaiki）</strong> berarti <strong>mesin penjual otomatis (vending machine)</strong>, fasilitas umum yang sangat lazim di lingkungan industri Jepang.",
        "distractor": "• Opsi A: エレベーター adalah lift angkut barang/orang.\n• Opsi C: エスカレーター adalah tangga berjalan otomatis.\n• Opsi D: パソコン adalah komputer kerja.",
        "grammarRule": "Fasilitas Mekis Bab 3: 自動販売機 (vending machine), エレベーター (lift), エスカレーター (eskalator), 電話 (telepon)."
      }
    },
    {
      "id": 7,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kata Tanya Harga Benda",
      "type": "teks",
      "question_ja": "A：「この 時計は （　　　）ですか。」<br>B：「5,000円です。」",
      "question_ruby": "A：「この 時計は （　　　）ですか。」<br>B：「5,000円です。」",
      "question_id": "Kata tanya yang tepat untuk menanyakan harga barang pada dialog di atas adalah...",
      "translation": "A: \"Jam tangan ini harganya berapa?\"<br>B: \"5.000 yen.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "なんさい"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "どこ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "いくら"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "だれ"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (いくら).",
        "logic": "Kata tanya untuk menanyakan harga barang dalam bahasa Jepang adalah <strong>いくら (ikura = berapa harga)</strong>.",
        "distractor": "• Opsi A: なんさい menanyakan umur seseorang.\n• Opsi B: どこ menanyakan letak/lokasi tempat.\n• Opsi D: だれ menanyakan identitas orang.",
        "grammarRule": "Rumus Menanyakan Harga Bab 3: [Benda] は いくらですか。➔ Jawaban: [Angka] 円（えん）です。"
      }
    },
    {
      "id": 8,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Angka & Satuan Uang Jepang",
      "type": "teks",
      "question_ja": "「３，５００円」の 日本語の 正しい 読み方は どれですか。",
      "question_ruby": "「３，５００円」の 日本語の 正しい 読み方は どれですか。",
      "question_id": "Cara baca nominal uang 3.500 yen dalam bahasa Jepang yang benar adalah...",
      "translation": "Cara baca bahasa Jepang yang benar untuk '3.500 yen' adalah sanzen gohyaku-en.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "さんぜんごひゃくえん"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "さんびゃくごじゅうえん"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "さんぜんごじゅうえん"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "さんまんごひゃくえん"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (さんぜんごひゃくえん).",
        "logic": "Angka 3.000 dibaca khusus <strong>さんぜん (sanzen)</strong> dengan bunyi sengau 'zen'. Angka 500 dibaca <strong>ごひゃく (gohyaku)</strong>. Diikuti mata uang <strong>えん (en)</strong>, sehingga 3.500 yen dibaca <strong>さんぜんごひゃくえん</strong>.",
        "distractor": "• Opsi B: さんびゃくごじゅうえん adalah 350 yen.\n• Opsi C: さんぜんごじゅうえん adalah 3.050 yen.\n• Opsi D: さんまんごひゃくえん adalah 30.500 yen.",
        "grammarRule": "Pelafalan Khusus Angka Ribuan Bab 3: 1.000 = せん, 3.000 = さんぜん (bukan sansen), 8.000 = はっせん."
      }
    },
    {
      "id": 9,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Fasilitas Resepsionis",
      "type": "teks",
      "question_ja": "会社の 入り口に あります。来客（らいきゃく）を 案内（あんない）します。ここは （　　　）です。",
      "question_ruby": "会社の 入り口に あります。来客（らいきゃく）を 案内（あんない）します。ここは （　　　）です。",
      "question_id": "Tempat penerima tamu di bagian depan gedung kantor yang dipelajari pada Bab 3 adalah...",
      "translation": "Berada di pintu masuk perusahaan. Memandu tamu datang. Di sini adalah resepsionis (uketsuke).",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "受付（うけつけ）"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "台所（だいどころ）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "そうこ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "かいだん"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (受付（うけつけ）).",
        "logic": "Kata <strong>受付（うけつけ - uketsuke）</strong> berarti <strong>meja penerimaan tamu / resepsionis</strong>, tempat tamu pertama kali melapor saat mengunjungi kantor.",
        "distractor": "• Opsi B: 台所 (だいどころ) adalah dapur tempat memasak.\n• Opsi C: そうこ adalah gudang.\n• Opsi D: かいだん adalah tangga.",
        "grammarRule": "Kosakata Kantor Bab 3: 受付 (resepsionis), 事務所 (kantor), ロビー (ruang tunggu/lobi), 会議室 (ruang rapat)."
      }
    },
    {
      "id": 10,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Kamar Asrama",
      "type": "teks",
      "question_ja": "アグス：「ナロンさんの （　　　）は ここですか。」<br>ナロン：「はい、そうです。」",
      "question_ruby": "アグス：「ナロンさんの （　　　）は ここですか。」<br>ナロン：「はい、そうです。」",
      "question_id": "Kata benda tempat tinggal yang sesuai dengan dialog percakapan Bab 3 di atas adalah...",
      "translation": "Agus: \"Apakah kamar Narong-san di sini?\" Narong: \"Ya, benar.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "へや"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "かばん"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "車"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "じむしょ"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (へや).",
        "logic": "Sesuai percakapan Bab 3 halaman 24: <em>「アグス：ナロンさんのへやはここですか。」</em>. Kata <strong>へや (部屋 - heya)</strong> berarti <strong>kamar / ruangan</strong> tempat tinggal di asrama.",
        "distractor": "• Opsi B: かばん berarti tas.\n• Opsi C: 車 (くるま) berarti mobil.\n• Opsi D: じむしょ berarti kantor.",
        "grammarRule": "Kosakata Hunian Bab 3: 部屋 (へや = kamar), 寮 (りょう = asrama), 台所 (だいどころ = dapur), お手洗い (toilet)."
      }
    },
    {
      "id": 11,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Penanda Topik Lokasi (は)",
      "type": "teks",
      "question_ja": "ここ （　<strong>★</strong>　） 工場（こうじょう）です。",
      "question_ruby": "ここ （　<strong>★</strong>　） 工場（こうじょう）です。",
      "question_id": "Partikel yang tepat untuk mengisi posisi bintang (★) penanda topik tempat pada kalimat di atas adalah...",
      "translation": "Di sini adalah pabrik.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "の"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "は"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "を"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "に"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (は).",
        "logic": "Pola kalimat Bab 3 halaman 19: <em>「ここ〔そこ・あそこ〕は ～ です」</em>. Partikel penanda topik tempat adalah <strong>は (wa)</strong>.",
        "distractor": "• Opsi A: の berfungsi sebagai partikel kepemilikan/asal.\n• Opsi C: を adalah penanda objek verba transitif.\n• Opsi D: に adalah penanda letak keberadaan verba imasu/arimasu (Bab 10).",
        "grammarRule": "Pola Kalimat Tempat 1: [ここ / そこ / あそこ] ＋ は ＋ [Nama Tempat] ＋ です。"
      }
    },
    {
      "id": 12,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Penanda Subjek Benda yang Ditunjuk Lokasinya (は)",
      "type": "teks",
      "question_ja": "電話（でんわ） （　<strong>★</strong>　） あそこです。",
      "question_ruby": "電話（でんわ） （　<strong>★</strong>　） あそこです。",
      "question_id": "Partikel yang tepat untuk menyatakan letak telepon pada kalimat di atas adalah...",
      "translation": "Telepon ada di sebelah sana.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "は"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "も"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "の"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "へ"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (は).",
        "logic": "Pola kalimat Bab 3 halaman 19: <em>「～は ここ〔そこ・あそこ〕です」</em>. Partikel <strong>は (wa)</strong> diletakkan setelah benda/orang/fasilitas yang ingin dijelaskan posisi letaknya.",
        "distractor": "• Opsi B: も bermakna 'juga' jika sebelumnya membicarakan benda di lokasi yang sama.\n• Opsi C: の menyatakan kepemilikan, bukan letak.\n• Opsi D: へ menyatakan arah pergerakan verba ikimasu (Bab 5).",
        "grammarRule": "Pola Kalimat Tempat 2: [Benda / Fasilitas] ＋ は ＋ [ここ / そこ / あそこ] ＋ です。"
      }
    },
    {
      "id": 13,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Tanya Lokasi (か)",
      "type": "teks",
      "question_ja": "事務所（じむしょ）は どこです （　<strong>★</strong>　）。",
      "question_ruby": "事務所（じむしょ）は どこです （　<strong>★</strong>　）。",
      "question_id": "Partikel yang tepat untuk melengkapi kalimat tanya lokasi di atas adalah...",
      "translation": "Kantor ada di mana?",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "ね"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "よ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "か"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "わ"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (か).",
        "logic": "Partikel <strong>か (ka)</strong> diletakkan di akhir predikat <em>です</em> untuk membentuk kalimat tanya interogatif menanyakan letak/lokasi.",
        "distractor": "• Opsi A: ね digunakan untuk meminta konfirmasi/kesepakatan.\n• Opsi B: よ digunakan untuk memberi penegasan informasi baru.\n• Opsi D: わ adalah partikel wanita.",
        "grammarRule": "Rumus Menanyakan Letak Tempat: [Nama Fasilitas] は どこですか。"
      }
    },
    {
      "id": 14,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Negara Asal Buatan Benda (の)",
      "type": "teks",
      "question_ja": "これは 日本 （　<strong>★</strong>　） 車です。",
      "question_ruby": "これは 日本 （　<strong>★</strong>　） 車です。",
      "question_id": "Partikel yang tepat untuk menyatakan bahwa mobil tersebut adalah 'buatan Jepang' adalah...",
      "translation": "Ini adalah mobil buatan Jepang.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "は"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "に"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "の"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "で"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (の).",
        "logic": "Pada Bab 3 buku IMM Japan, partikel <strong>の (no)</strong> juga berfungsi menghubungkan <strong>[Nama Negara / Perusahaan] ＋ の ＋ [Kata Benda]</strong> untuk menyatakan tempat asal pembuatan barang (buatan Jepang = 日本の車) atau perusahaan pembuatnya.",
        "distractor": "• Opsi A: は penanda topik, tidak digunakan di depan kata benda penjelas.\n• Opsi B: に penanda waktu/titik tujuan.\n• Opsi D: で menyatakan sarana atau alat.",
        "grammarRule": "Fungsi Partikel の (Asal Produk / Perusahaan): [Negara / Perusahaan] ＋ の ＋ [Produk Barang] (contoh: 日本のカメラ, トヨタの車)."
      }
    },
    {
      "id": 15,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Inklusi Lokasi yang Sama (も)",
      "type": "teks",
      "question_ja": "食堂（しょくどう）は ２階（かい）です。会議室（かいぎしつ）（　<strong>★</strong>　） ２階です。",
      "question_ruby": "食堂（しょくどう）は ２階（かい）です。会議室（かいぎしつ）（　<strong>★</strong>　） ２階です。",
      "question_id": "Partikel yang tepat untuk menyatakan bahwa ruang rapat 'juga' berada di lantai 2 adalah...",
      "translation": "Kantin ada di lantai 2. Ruang rapat juga ada di lantai 2.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "は"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "の"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "も"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "が"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (も).",
        "logic": "Partikel <strong>も (mo)</strong> menggantikan partikel <strong>は</strong> untuk menyatakan kesamaan predikat lokasi (ruang rapat <em>juga</em> di lantai 2).",
        "distractor": "• Opsi A: は menyatakan topik biasa tanpa ada penekanan kesamaan predikat.\n• Opsi B: の menunjukkan kepemilikan.\n• Opsi D: が adalah penanda subjek partikel khusus.",
        "grammarRule": "Kaidah Partikel も pada Lokasi: [Tempat A] は [Lantai X] です。[Tempat B] も [Lantai X] です。"
      }
    },
    {
      "id": 16,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Kombinasi Partikel Kepemilikan & Topik (の / は)",
      "type": "teks",
      "question_ja": "山田さん （　①　） 部屋（へや） （　②　） どちらですか。",
      "question_ruby": "山田さん （　①　） 部屋（へや） （　②　） どちらですか。",
      "question_id": "Kombinasi partikel yang tepat untuk melengkapi pertanyaan posisi kamar Yamada-san adalah...",
      "translation": "Kamar milik Yamada-san sebelah mana?",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "① の　／　② は"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "① は　／　② の"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "① の　／　② に"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "① は　／　② も"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (① の　／　② は).",
        "logic": "Posisi ① menghubungkan pemilik dengan kamarnya (kepemilikan) menggunakan <strong>の</strong> (山田さんの部屋 = kamar Yamada-san).<br>Posisi ② menetapkan frasa tersebut sebagai topik yang ditanyakan keberadaannya menggunakan <strong>は</strong>.",
        "distractor": "• Opsi B: Kombinasi terbalik (は / の) salah secara sintaksis.\n• Opsi C: Partikel に di posisi kedua tidak membentuk pola topik desu.\n• Opsi D: Partikel も tidak tepat tanpa konteks kesamaan sebelumnya.",
        "grammarRule": "Pola Gabungan: [Orang] の [Ruangan/Benda] ＋ は ＋ どこ／どちら ですか。"
      }
    },
    {
      "id": 17,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Asosiasi Perusahaan (の)",
      "type": "teks",
      "question_ja": "A：「あの方は どちらの 方（かた）ですか。」<br>B：「東京（とうきょう）ゴム （　<strong>★</strong>　） 人です。」",
      "question_ruby": "A：「あの方は どちらの 方（かた）ですか。」<br>B：「東京（とうきょう）ゴム （　<strong>★</strong>　） 人です。」",
      "question_id": "Partikel yang tepat untuk menyatakan bahwa beliau adalah orang dari perusahaan 'Tokyo Gomu' adalah...",
      "translation": "A: \"Beliau itu orang dari mana (perusahaan apa)?\"<br>B: \"Orang dari Tokyo Gomu.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "の"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "は"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "も"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "に"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (の).",
        "logic": "Partikel <strong>の (no)</strong> digunakan untuk menghubungkan instansi/perusahaan tempat seseorang bernaung atau bekerja dengan orangnya (Tokyo Gomu no hito = orang Tokyo Gomu), sesuai materi Bab 3 buku IMM Japan.",
        "distractor": "• Opsi B: は adalah penanda topik kalimat.\n• Opsi C: も berarti 'juga'.\n• Opsi D: に adalah penanda lokasi waktu/tujuan.",
        "grammarRule": "Hubungan Instansi & Karyawan: [Nama Perusahaan / Organisasi] ＋ の ＋ 人／社員 (contoh: IMM Japan の実習生, トヨタの社員)."
      }
    },
    {
      "id": 18,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Tanya Lokasi Percakapan Kerja (は)",
      "type": "teks",
      "question_ja": "A：「すみません、エレベーター （　<strong>★</strong>　） どこですか。」<br>B：「エレベーターは あそこです。」",
      "question_ruby": "A：「すみません、エレベーター （　<strong>★</strong>　） どこですか。」<br>B：「エレベーターは あそこです。」",
      "question_id": "Partikel yang tepat untuk menanyakan letak lift pada dialog kerja di atas adalah...",
      "translation": "A: \"Permisi, lift ada di mana?\"<br>B: \"Lift ada di sebelah sana.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "は"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "の"
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
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (は).",
        "logic": "Partikel <strong>は (wa)</strong> diletakkan setelah kata benda fasilitas <em>エレベーター</em> untuk menjadikannya pokok/topik pertanyaan letak.",
        "distractor": "• Opsi B: の adalah partikel kepemilikan.\n• Opsi C: に tidak digunakan langsung sebelum kata tanya 'どこですか' dalam pola dasar Bab 3.\n• Opsi D: を adalah penanda objek langsung kata kerja transitif.",
        "grammarRule": "Percakapan Praktis Menanyakan Fasilitas: すみません、[Fasilitas] は どこですか。"
      }
    },
    {
      "id": 19,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Tanya Asal Negara (は)",
      "type": "teks",
      "question_ja": "A：「お国（くに） （　<strong>★</strong>　） どちらですか。」<br>B：「インドネシアです。」",
      "question_ruby": "A：「お国（くに） （　<strong>★</strong>　） どちらですか。」<br>B：「インドネシアです。」",
      "question_id": "Partikel yang tepat untuk menanyakan negara asal lawan bicara secara sopan pada dialog Bab 3 di atas adalah...",
      "translation": "A: \"Negara asal Anda dari mana?\"<br>B: \"Indonesia.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "は"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "の"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "も"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "で"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (は).",
        "logic": "Dalam ungkapan sopan menanyakan negara asal: <em>「お国は どちらですか」</em>, partikel penanda topik yang digunakan setelah kata <em>お国</em> adalah <strong>は (wa)</strong>.",
        "distractor": "• Opsi B: の menghubungkan dua kata benda.\n• Opsi C: も bermakna kesamaan.\n• Opsi D: で bermakna dengan sarana / di tempat aksi.",
        "grammarRule": "Ungkapan Baku Sopan Menanyakan Negara Asal: （お）国は どちらですか。➔ [Nama Negara] です。"
      }
    },
    {
      "id": 20,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Topik dalam Transaksi Belanja (は)",
      "type": "teks",
      "question_ja": "アグス：「すみません、この ネクタイ （　<strong>★</strong>　） いくらですか。」<br>店員：「２，８００円です。」",
      "question_ruby": "アグス：「すみません、この ネクタイ （　<strong>★</strong>　） いくらですか。」<br>店員：「２，８００円です。」",
      "question_id": "Partikel yang tepat untuk menanyakan harga barang yang ditunjuk pada dialog di atas adalah...",
      "translation": "Agus: \"Permisi, dasi ini harganya berapa?\"<br>Pelayan toko: \"2.800 yen.\"",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "は"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "の"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "に"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "で"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (は).",
        "logic": "Frasa <em>このネクタイ</em> (dasi ini) dijadikan topik kalimat menggunakan partikel <strong>は (wa)</strong> sebelum menanyakan harganya dengan <em>いくらですか</em>.",
        "distractor": "• Opsi B: の kepemilikan.\n• Opsi C: に sasaran waktu/tempat.\n• Opsi D: で alat/sarana.",
        "grammarRule": "Pola Transaksi Belanja Bab 3: [この／その／あの ＋ Benda] ＋ は ＋ いくらですか。"
      }
    },
    {
      "id": 21,
      "session": "reading",
      "section_ja": "第3部：読解・図解評価",
      "section_id": "Sesi 1: Reading — Zukai (Evaluasi Bergambar)",
      "category": "Soal Bergambar — Fasilitas Kerja (工場)",
      "type": "gambar",
      "question_ja": "絵（え）を 見て ください。ここは どこですか。<br>「ここは ながのきかいの （　　　）です。」",
      "question_ruby": "絵（え）を 見て ください。ここは どこですか。<br>「ここは ながのきかいの （　　　）です。」",
      "question_id": "Perhatikan gambar. Dimanakah tempat ini? 'Ini adalah (...) Nagano Kikai.'",
      "translation": "Ini adalah pabrik Nagano Kikai.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "しょくどう"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "こうじょう"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "うけつけ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "きょうしつ"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (こうじょう).",
        "logic": "Gambar menunjukkan gedung pabrik manufaktur (工場 / こうじょう - koujou).",
        "distractor": "• Opsi A: しょくどう adalah kantin/ruang makan.\n• Opsi C: うけつけ adalah bagian resepsionis.\n• Opsi D: きょうしつ adalah ruang kelas.",
        "grammarRule": "Fasilitas IMM Japan: 工場（こうじょう = pabrik）."
      },
      "image": "assets/bab_03/reading_q21.jpeg"
    },
    {
      "id": 22,
      "session": "reading",
      "section_ja": "第3部：読解・図解評価",
      "section_id": "Sesi 1: Reading — Zukai (Evaluasi Bergambar)",
      "category": "Soal Bergambar — Fasilitas Makan (食堂)",
      "type": "gambar",
      "question_ja": "絵（え）を 見て ください。ここは どこですか。<br>「ひるごはんを 食べる （　　　）です。」",
      "question_ruby": "絵（え）を 見て ください。ここは どこですか。<br>「ひるごはんを 食べる （　　　）です。」",
      "question_id": "Perhatikan gambar. Tempat apakah ini? 'Ini adalah (...) tempat makan siang.'",
      "translation": "Ini adalah kantin/ruang makan tempat makan siang.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "じむしょ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "へや"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "食堂（しょくどう）"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "トイレ"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (食堂（しょくどう）).",
        "logic": "Gambar menunjukkan deretan meja dan kursi makan di kantin pabrik (食堂 / しょくどう - shokudou).",
        "distractor": "• Opsi A: じむしょ adalah kantor tata usaha.\n• Opsi B: へや adalah kamar tidur asrama.\n• Opsi D: トイレ adalah toilet/kamar kecil.",
        "grammarRule": "Fasilitas Asrama/Pabrik: 食堂（しょくどう = kantin）."
      },
      "image": "assets/bab_03/reading_q22.jpeg"
    },
    {
      "id": 23,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Cara Baca Kanji (事務所)",
      "type": "teks",
      "question_ja": "指導員は （ 事務所 ）に います。<br>（　）の 漢字の 正しい 読み方は どれですか。",
      "question_ruby": "指導員は （ 事務所 ）に います。<br>（　）の 漢字の 正しい 読み方は どれですか。",
      "question_id": "Instruktur berada di kantor. Pilihlah cara baca kanji '事務所' yang tepat.",
      "translation": "Instruktur berada di kantor.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "じむしょ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "ゆうびんきょく"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "かいぎしつ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "きょうしつ"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (じむしょ).",
        "logic": "Kanji 事務所 dibaca じむしょ (jimusho) yang berarti kantor kerja / ruang administrasi.",
        "distractor": "• Opsi B: ゆうびんきょく adalah kantor pos (郵便局).\n• Opsi C: かいぎしつ adalah ruang rapat (会議室).\n• Opsi D: きょうしつ adalah ruang kelas (教室).",
        "grammarRule": "Fasilitas Perusahaan: 事務所（じむしょ = kantor）."
      }
    },
    {
      "id": 24,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Penulisan Kanji (教室)",
      "type": "teks",
      "question_ja": "毎朝 ８時に （ きょうしつ ）へ 行きます。<br>（　）の 言葉の 正しい 漢字は どれですか。",
      "question_ruby": "毎朝 ８時に （ きょうしつ ）へ 行きます。<br>（　）の 言葉の 正しい 漢字は どれですか。",
      "question_id": "Setiap pagi jam 8 pergi ke ruang kelas. Pilihlah penulisan kanji yang tepat untuk 'kyoushitsu'.",
      "translation": "Setiap pagi pergi ke ruang kelas jam 8.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "教室"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "教屋"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "学室"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "校室"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (教室).",
        "logic": "Kata きょうしつ ditulis dengan kanji baku 教室 (教 = mengajar, 室 = ruangan).",
        "distractor": "• Opsi B: 教屋 adalah penulisan yang salah.\n• Opsi C: 学室 bukan kanji untuk ruang kelas.\n• Opsi D: 校室 adalah penulisan yang salah.",
        "grammarRule": "Ruang Pembelajaran: 教室（きょうしつ = ruang kelas）."
      }
    },
    {
      "id": 25,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Pemakaian Kanji dalam Konteks (会社)",
      "type": "teks",
      "question_ja": "アグスさんは 日本の （ かいしゃ ）で 実習します。<br>正しい 漢字は どれですか。",
      "question_ruby": "アグスさんは 日本の （ かいしゃ ）で 実習します。<br>正しい 漢字は どれですか。",
      "question_id": "Agus-san magang di perusahaan Jepang. Pilihlah penulisan kanji yang tepat untuk 'kaisha'.",
      "translation": "Agus-san magang di perusahaan Jepang.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "会社"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "社会"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "会所"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "舎会"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (会社).",
        "logic": "Kata かいしゃ (perusahaan) ditulis dengan urutan kanji 会社 (会 = bertemu/kumpulan, 社 = komunitas/lembaga).",
        "distractor": "• Opsi B: 社会 dibaca しゃかい yang berarti masyarakat.\n• Opsi C: 会所 adalah penulisan yang salah.\n• Opsi D: 舎会 adalah penulisan yang salah.",
        "grammarRule": "Kanji Bab 3: 会社（かいしゃ = perusahaan） vs 社会（しゃかい = masyarakat）."
      }
    }
  ]
};

const BAB_04_DATA = {
  "chapter": "04",
  "title_ja": "第４課：時間・曜日・日課の動詞と助詞（に・から・まで・と）",
  "title_id": "Bab 04: Waktu, Hari, Verba Rutinitas Harian & Partikel (Ni, Kara, Made, To)",
  "theme_ja": "時間 (Jikan) & 日常生活の動詞 (Nichijou Seikatsu no Doushi)",
  "theme_id": "Evaluasi penguasaan kosakata waktu (jam, menit, waktu relatif), nama-nama hari (youbi), verba harian statis (okimasu, nemasu, hatarakimasu, yasumimasu), serta partikel waktu (に, から, まで, と) pada Bab 4 buku IMM Japan.",
  "audioSrc": null,
  "pdfReadingSoalUrl": "assets/pdf/Salinan Soal Bab 04.pdf",
  "pdfReadingKunciUrl": "assets/pdf/Kunci dan Pembahasan Bab 04.pdf",
  "pdfSoalUrl": null,
  "pdfKunciUrl": null,
  "passingGrade": 80,
  "totalQuestions": 25,
  "readingCount": 25,
  "choukaiCount": 0,
  "questions": [
    {
      "id": 1,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Pelafalan Jam Khusus (Waktu)",
      "type": "teks",
      "question_ja": "日本語で「午前４時」の 正しい 読み方は どれですか。",
      "question_ruby": "日本語で「午前４時」の 正しい 読み方は どれですか。",
      "question_id": "Penyebutan jam 'pukul 04:00 pagi' dalam bahasa Jepang yang benar adalah...",
      "translation": "Cara baca bahasa Jepang yang benar untuk 'pukul 04:00 pagi' adalah gozen yo-ji.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "ごぜんよんじ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "ごぜんよじ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "ごぜんしじ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "ごぜんろくじ"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (ごぜんよじ).",
        "logic": "Dalam penomoran jam bahasa Jepang, pukul 4 memiliki pelafalan khusus (irregular) yaitu <strong>よじ (yo-ji)</strong>, bukan <em>yon-ji</em> atau <em>shi-ji</em>. Begitu pula jam 7 adalah <em>shichi-ji</em> dan jam 9 adalah <em>ku-ji</em>.",
        "distractor": "• Opsi A: ごぜんよんじ adalah pelafalan salah yang sering keliru diucapkan pembelajar pemula.\n• Opsi C: ごぜんしじ salah karena 'shi' dihindari untuk penyebutan jam.\n• Opsi D: ごぜんろくじ berarti pukul 06:00 pagi.",
        "grammarRule": "Pelafalan Jam Khusus Bab 4: 4時 = よじ (yo-ji), 7時 = しちじ (shichi-ji), 9時 = くじ (ku-ji)."
      }
    },
    {
      "id": 2,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Menit Khusus (Setengah Jam)",
      "type": "teks",
      "question_ja": "「7時30分」は 「7時（　　　）」とも 言います。",
      "question_ruby": "「7時30分」は 「7時（　　　）」とも 言います。",
      "question_id": "Kata pengganti untuk menyatakan '30 menit (setengah)' yang tepat adalah...",
      "translation": "'Pukul 07:30' juga lazim disebut sebagai 'pukul 7 lewat setengah (shichi-ji han)'.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "はん（半）"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "ふん（分）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "じ（時）"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "ごろ"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (はん（半）).",
        "logic": "Dalam bahasa Jepang, menit ke-30 (setengah jam) disingkat menggunakan kata <strong>半（はん - han = setengah）</strong>. Sehingga <em>7時30分</em> dapat diucapkan <strong>7時半（しちじはん）</strong>.",
        "distractor": "• Opsi B: ふん adalah satuan menit biasa (perlu angka di depannya, misal 30分 = さんじゅっぷん).\n• Opsi C: じ adalah satuan jam.\n• Opsi D: ごろ bermakna 'kira-kira / sekitar' untuk waktu.",
        "grammarRule": "Pola Jam Setengah: [Angka Jam] ＋ 時半（じはん） (contoh: 8時半 = pukul 08:30, 12時半 = pukul 12:30)."
      }
    },
    {
      "id": 3,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Nama Hari dalam Sepekan (Youbi)",
      "type": "teks",
      "question_ja": "日曜日（にちようび）の 次の（つぎの） 日は （　　　）です。",
      "question_ruby": "日曜日（にちようび）の 次の（つぎの） 日は （　　　）です。",
      "question_id": "Hari berikutnya setelah hari Minggu (hari Senin) dalam bahasa Jepang adalah...",
      "translation": "Hari berikutnya setelah hari Minggu adalah hari Senin (getsu-youbi).",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "火曜日（かようび）"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "月曜日（げつようび）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "水曜日（すいようび）"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "金曜日（きんようび）"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (月曜日（げつようび）).",
        "logic": "Urutan nama hari dalam sepekan di Jepang: 日曜日 (Minggu) ➔ <strong>月曜日 (げつようび = Senin)</strong> ➔ 火曜日 (Selasa) ➔ 水曜日 (Rabu) ➔ 木曜日 (Kamis) ➔ 金曜日 (Jumat) ➔ 土曜日 (Sabtu).",
        "distractor": "• Opsi A: 火曜日 adalah hari Selasa.\n• Opsi C: 水曜日 adalah hari Rabu.\n• Opsi D: 金曜日 adalah hari Jumat.",
        "grammarRule": "Tujuh Hari dalam Sepekan Bab 4: 月(Senin), 火(Selasa), 水(Rabu), 木(Kamis), 金(Jumat), 土(Sabtu), 日(Minggu)."
      }
    },
    {
      "id": 4,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Cara Baca Kanji Waktu Rutinitas",
      "type": "teks",
      "question_ja": "ダダンさんは （　<strong>毎日</strong>　） 工場で 実習を します。",
      "question_ruby": "ダダンさんは （　<strong>毎日</strong>　） 工場で 実習を します。",
      "question_id": "Cara baca kanji di dalam tanda kurung yang tepat adalah...",
      "translation": "Dadan-san setiap hari (mainichi) magang di pabrik.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "まいあさ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "まいばん"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "まいにち"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "まいつき"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (まいにち).",
        "logic": "Kanji <strong>毎日</strong> dibaca <strong>まいにち (mainichi)</strong> yang berarti <strong>setiap hari</strong>.",
        "distractor": "• Opsi A: まいあさ adalah kanji 毎朝 (setiap pagi).\n• Opsi B: まいばん adalah kanji 毎晩 (setiap malam).\n• Opsi D: まいつき adalah kanji 毎月 (setiap bulan).",
        "grammarRule": "Seri Kanji 毎 (Setiap) Bab 4: 毎日 (まいにち = setiap hari), 毎朝 (まいあさ = setiap pagi), 毎晩 (まいばん = setiap malam)."
      }
    },
    {
      "id": 5,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Lapangan Proyek Pabrik",
      "type": "teks",
      "question_ja": "ダダン：「明日の （　<strong>げんば</strong>　）は どこですか。」<br>すずき：「山手町です。」<br>「げんば」の 意味は 何ですか。",
      "question_ruby": "ダダン：「明日の （　<strong>げんば</strong>　）は どこですか。」<br>すずき：「山手町です。」<br>「げんば」の 意味は 何ですか。",
      "question_id": "Istilah penting di tempat kerja yang dicetak tebal di atas bermakna...",
      "translation": "Dadan: 'Lokasi kerja (genba) besok di mana?' Suzuki: 'Yamate-chou.' Apa arti 'genba'?",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Kamar tidur asrama"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Lokasi proyek / tempat kerja lapangan"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Kantor imigrasi"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Stasiun kereta api"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (Lokasi proyek / tempat kerja lapangan).",
        "logic": "Kata <strong>げんば（現場 - genba）</strong> adalah istilah industri yang sangat penting bagi peserta magang teknik, bermakna <strong>lokasi kerja / lapangan proyek / tempat praktek kerja berlangsung</strong>.",
        "distractor": "• Opsi A: Kamar tidur asrama adalah 部屋 (へや) atau 寮 (りょう).\n• Opsi C: Kantor imigrasi adalah 入国管理局 (にゅうこくかんりきょく).\n• Opsi D: Stasiun kereta adalah 駅 (えき).",
        "grammarRule": "Kosakata Kunci Kerja Industri Bab 4: 現場（げんば = lapangan/lokasi kerja）, 仕事（しごと = pekerjaan）, 休み（やすみ = libur）."
      }
    },
    {
      "id": 6,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Lawan Kata Verba Rutinitas (Hantaigo)",
      "type": "teks",
      "question_ja": "「おきます（起きます）」の <strong>反対（はんたい）</strong>の 言葉は どれですか。",
      "question_ruby": "「おきます（起きます）」の <strong>反対（はんたい）</strong>の 言葉は どれですか。",
      "question_id": "Lawan kata dari verba 'okimasu' (bangun tidur) adalah...",
      "translation": "Lawan kata dari 'okimasu' (bangun) adalah 'nemasu' (tidur).",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "はたらきます"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "ねます"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "やすみます"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "おわります"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (ねます).",
        "logic": "Kata kerja <strong>おきます (okimasu = bangun tidur)</strong> berlawanan makna dengan <strong>ねます (nemasu = tidur / beristirahat malam)</strong>.",
        "distractor": "• Opsi A: はたらきます berarti bekerja.\n• Opsi C: やすみます berarti beristirahat / libur.\n• Opsi D: おわります berarti selesai.",
        "grammarRule": "Pasangan Lawan Kata Verba Bab 4: 起きます (bangun) ⇄ 寝ます (tidur); 働きます (bekerja) ⇄ 休みます (beristirahat/libur)."
      }
    },
    {
      "id": 7,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Keterangan Waktu Relatif Hari",
      "type": "teks",
      "question_ja": "「今日（きょう）」の <strong>前の 日（まえの ひ）</strong>は （　　　）です。",
      "question_ruby": "「今日（きょう）」の <strong>前の 日（まえの ひ）</strong>は （　　　）です。",
      "question_id": "Hari sebelum hari ini (kemarin) dalam bahasa Jepang disebut...",
      "translation": "Hari sebelum hari ini adalah kemarin (kinou).",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "あした"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "あさって"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "きのう"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "おととい"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (きのう).",
        "logic": "Keterangan waktu relatif hari:<br>• おととい (kemarin lusa) ➔ <strong>きのう (kemarin)</strong> ➔ 今日 / きょう (hari ini) ➔ 明日 / あした (besok) ➔ あさって (lusa).",
        "distractor": "• Opsi A: あした adalah besok (hari setelah hari ini).\n• Opsi B: あさって adalah lusa (2 hari ke depan).\n• Opsi D: おととい adalah kemarin lusa (2 hari yang lalu).",
        "grammarRule": "Garis Waktu Relatif Bab 4: おととい ➔ きのう ➔ きょう ➔ あした ➔ あさって."
      }
    },
    {
      "id": 8,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Fasilitas Lembaga Keuangan",
      "type": "teks",
      "question_ja": "お金を 預けたり（あずけたり） 送金（そうきん）したり します。ここは （　　　）です。",
      "question_ruby": "お金を 預けたり（あずけたり） 送金（そうきん）したり します。ここは （　　　）です。",
      "question_id": "Fasilitas tempat menabung atau mengirim uang yang dipelajari pada Bab 4 adalah...",
      "translation": "Menyimpan uang atau mengirim uang. Tempat ini adalah bank (ginkou).",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "銀行（ぎんこう）"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "図書館（としょかん）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "美術館（びじゅつかん）"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "病院（びょういん）"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (銀行（ぎんこう）).",
        "logic": "Kata <strong>銀行（ぎんこう - ginkou）</strong> berarti <strong>bank</strong>, lembaga keuangan yang penting bagi peserta magang untuk menabung gaji dan mengirim uang ke keluarga di Indonesia.",
        "distractor": "• Opsi B: 図書館 (としょかん) adalah perpustakaan.\n• Opsi C: 美術館 (びじゅつかん) adalah museum seni.\n• Opsi D: 病院 (びょういん) adalah rumah sakit.",
        "grammarRule": "Fasilitas Umum Bab 4: 銀行 (bank), 郵便局 (kantor pos), 図書館 (perpustakaan), 美術館 (museum seni)."
      }
    },
    {
      "id": 9,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Bagian Waktu dalam Sehari",
      "type": "teks",
      "question_ja": "「夜（よる）」と 同じ（おなじ） 意味（いみ）の 言葉は どれですか。",
      "question_ruby": "「夜（よる）」と 同じ（おなじ） 意味（いみ）の 言葉は どれですか。",
      "question_id": "Kosakata yang memiliki makna setara dengan 'malam hari' (yoru) pada Bab 4 adalah...",
      "translation": "Kata yang semakna dengan 'malam' (yoru) adalah 'ban'.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "あさ（朝）"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "ひる（昼）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "ばん（晩）"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "ゆうがた"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (ばん（晩）).",
        "logic": "Kata <strong>晩（ばん - ban）</strong> bermakna <strong>malam</strong>, semakna dengan kata 夜（よる - yoru）. Sering digunakan dalam frasa <em>きのうの晩 (kemarin malam)</em> atau <em>今晩 (malam ini)</em>.",
        "distractor": "• Opsi A: あさ (朝) berarti pagi.\n• Opsi B: ひる (昼) berarti siang.\n• Opsi D: ゆうがた berarti petang/senja.",
        "grammarRule": "Pembagian Waktu Sehari Bab 4: 朝 (pagi), 昼 (siang), 晩／夜 (malam)."
      }
    },
    {
      "id": 10,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Fasilitas Peminjaman Buku",
      "type": "teks",
      "question_ja": "かとう：「はい、さくら（　　　）の かとうです。」「本を かりる 場所」は どれですか。",
      "question_ruby": "かとう：「はい、さくら（　　　）の かとうです。」「本を かりる 場所」は どれですか。",
      "question_id": "Tempat meminjam buku sesuai percakapan Bab 4 di atas adalah...",
      "translation": "Katou: 'Ya, dengan Katou dari perpustakaan Sakura.' Tempat meminjam buku adalah perpustakaan.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "郵便局（ゆうびんきょく）"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "図書館（としょかん）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "ぎんこう"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "こうじょう"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (図書館（としょかん）).",
        "logic": "Kata <strong>図書館（としょかん - toshokan）</strong> berarti <strong>perpustakaan</strong>, tempat meminjam dan membaca buku.",
        "distractor": "• Opsi A: 郵便局 adalah kantor pos.\n• Opsi C: ぎんこう adalah bank.\n• Opsi D: こうじょう adalah pabrik.",
        "grammarRule": "Kosakata Bab 4: 図書館 (としょかん = perpustakaan), 郵便局 (ゆうびんきょく = kantor pos)."
      }
    },
    {
      "id": 11,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Penanda Titik Waktu Pasti (に)",
      "type": "teks",
      "question_ja": "アグスさんは 毎朝 4時半 （　<strong>★</strong>　） おきます。",
      "question_ruby": "アグスさんは 毎朝 4時半 （　<strong>★</strong>　） おきます。",
      "question_id": "Partikel yang tepat diletakkan setelah angka waktu jam pasti pada kalimat di atas adalah...",
      "translation": "Agus-san bangun setiap pagi pada pukul 04:30.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "に"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "を"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "で"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "へ"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (に).",
        "logic": "Partikel <strong>に (ni)</strong> berfungsi sebagai penanda <strong>titik waktu terjadinya suatu kegiatan</strong> apabila keterangan waktu tersebut memuat angka pasti (seperti jam, tanggal, atau hari). Pola: <em>[Waktu Berangka] ＋ に ＋ Verba</em>.",
        "distractor": "• Opsi B: を adalah penanda objek verba transitif (Bab 6).\n• Opsi C: で adalah penanda tempat aksi atau alat.\n• Opsi D: へ adalah penanda arah perpindahan (Bab 5).",
        "grammarRule": "Kaidah Partikel に Waktu: Wajib digunakan pada waktu yang memuat angka pasti (contoh: 7時に, 日曜日に, 10月5日に)."
      }
    },
    {
      "id": 12,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Titik Awal Waktu (から)",
      "type": "teks",
      "question_ja": "午前の 仕事は 8時 （　<strong>★</strong>　） 始まります（はじまります）。",
      "question_ruby": "午前の 仕事は 8時 （　<strong>★</strong>　） 始まります（はじまります）。",
      "question_id": "Partikel yang tepat untuk menyatakan 'mulai dari' jam 8 adalah...",
      "translation": "Pekerjaan pagi hari dimulai dari pukul 08:00.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "まで"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "から"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "に"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "と"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (から).",
        "logic": "Partikel <strong>から (kara)</strong> berfungsi menandai <strong>titik awal mula waktu</strong> (dari / mulai dari).",
        "distractor": "• Opsi A: まで menandai batas titik akhir waktu (sampai).\n• Opsi C: に menandai titik waktu tunggal, bukan durasi titik mula.\n• Opsi D: と adalah konjungsi penghubung 'dan/bersama'.",
        "grammarRule": "Kaidah Partikel から (Titik Mula): [Waktu / Jam Mulai] ＋ から。"
      }
    },
    {
      "id": 13,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Titik Akhir Waktu (まで)",
      "type": "teks",
      "question_ja": "昼休みは 12時から 1時 （　<strong>★</strong>　） です。",
      "question_ruby": "昼休みは 12時から 1時 （　<strong>★</strong>　） です。",
      "question_id": "Partikel yang tepat untuk menandai batas akhir waktu 'sampai jam 1' adalah...",
      "translation": "Istirahat siang dari jam 12 sampai jam 1.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "から"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "まで"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "に"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "の"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (まで).",
        "logic": "Partikel <strong>まで (made)</strong> berfungsi menandai <strong>titik akhir batas waktu</strong> (sampai / hingga).",
        "distractor": "• Opsi A: から menandai titik mula.\n• Opsi C: に menandai titik waktu kejadian.\n• Opsi D: の menyatakan kepemilikan.",
        "grammarRule": "Kaidah Partikel まで (Batas Akhir): [Waktu / Jam Selesai] ＋ まで。"
      }
    },
    {
      "id": 14,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Kaidah Waktu Relatif Tanpa Partikel に",
      "type": "teks",
      "question_ja": "わたしは 明日（あした） （　<strong>★</strong>　） はたらきません。休みです。",
      "question_ruby": "わたしは 明日（あした） （　<strong>★</strong>　） はたらきません。休みです。",
      "question_id": "Partikel yang tepat untuk mengisi posisi bintang setelah kata '明日' adalah...",
      "translation": "Saya besok tidak bekerja. Libur.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "に"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "へ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "（何も つけない / Tanpa Partikel）"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "で"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (（何も つけない / Tanpa Partikel）).",
        "logic": "Keterangan waktu relatif yang tidak memuat angka pasti (seperti: <em>きょう, あした, きのう, まいにち, まいあさ</em>) <strong>TIDAK BOLEH memakai partikel に</strong>. Kata tersebut langsung diikuti predikat verba.",
        "distractor": "• Opsi A: Partikel に salah besar jika diletakkan setelah '明日' atau '今日'.\n• Opsi B: へ adalah penanda arah.\n• Opsi D: で adalah penanda tempat aksi.",
        "grammarRule": "PENTING (Tanpa に): kata 今日, 明日, きのう, おととい, 毎日, 毎朝, 毎晩 TIDAK MEMAKAI partikel に."
      }
    },
    {
      "id": 15,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Pasangan Rentang Waktu (から ～ まで)",
      "type": "teks",
      "question_ja": "さくら図書館は 9時 （　①　） 7時 （　②　） です。",
      "question_ruby": "さくら図書館は 9時 （　①　） 7時 （　②　） です。",
      "question_id": "Pasangan partikel rentang waktu operasional yang tepat untuk mengisi ① dan ② adalah...",
      "translation": "Perpustakaan Sakura buka dari jam 9 sampai jam 7.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "① から　／　② まで"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "① まで　／　② から"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "① に　／　② に"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "① は　／　② と"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (① から　／　② まで).",
        "logic": "Pola kalimat Bab 4 halaman 27: <strong>[Waktu A] から [Waktu B] まで</strong> digunakan untuk menyatakan rentang waktu dari titik mula A hingga batas akhir B.",
        "distractor": "• Opsi B: Susunan terbalik (まで / から) salah secara kaidah bahasa.\n• Opsi C: に / に tidak membentuk pola rentang durasi operasional.\n• Opsi D: は / と tidak membentuk pola rentang operasional.",
        "grammarRule": "Pola Baku Rentang Waktu: [Jam A] から [Jam B] まで です／～ます。"
      }
    },
    {
      "id": 16,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Konjungsi Penggabung Kata Benda (と)",
      "type": "teks",
      "question_ja": "会社の 休みは 土曜日 （　<strong>★</strong>　） 日曜日です。",
      "question_ruby": "会社の 休みは 土曜日 （　<strong>★</strong>　） 日曜日です。",
      "question_id": "Partikel penggabung setara yang bermakna 'dan' di antara dua nama hari adalah...",
      "translation": "Libur perusahaan adalah hari Sabtu dan hari Minggu.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "に"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "と"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "から"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "で"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (と).",
        "logic": "Partikel <strong>と (to)</strong> berfungsi sebagai kata penghubung setara yang bermakna <strong>dan</strong> untuk menggabungkan dua kata benda (Nomina 1 + と + Nomina 2).",
        "distractor": "• Opsi A: に berfungsi sebagai penanda waktu kejadian.\n• Opsi C: から bermakna dari.\n• Opsi D: で bermakna dengan sarana.",
        "grammarRule": "Fungsi Partikel と (Dan): [Kata Benda 1] ＋ と ＋ [Kata Benda 2]."
      }
    },
    {
      "id": 17,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Topik pada Pertanyaan Jadwal Kerja (は / から)",
      "type": "teks",
      "question_ja": "A：「授業（じゅぎょう）（　①　） 何時からですか。」<br>B：「9時（　②　）です。」",
      "question_ruby": "A：「授業（じゅぎょう）（　①　） 何時からですか。」<br>B：「9時（　②　）です。」",
      "question_id": "Kombinasi partikel yang tepat untuk melengkapi dialog jadwal belajar di atas adalah...",
      "translation": "A: 'Pelajaran mulai dari jam berapa?' B: 'Mulai dari jam 9.'",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "① は　／　② から"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "① に　／　② まで"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "① から　／　② は"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "① の　／　② に"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (① は　／　② から).",
        "logic": "Posisi ① menetapkan kegiatan (pelajaran) sebagai topik pembicaraan menggunakan partikel <strong>は</strong>.<br>Posisi ② menyatakan jam mulai menggunakan partikel <strong>から</strong>.",
        "distractor": "• Opsi B: Partikel に di posisi pertama tidak membentuk pola topik kalimat.\n• Opsi C: Susunan terbalik tidak masuk akal.\n• Opsi D: Kombinasi の dan に salah pola.",
        "grammarRule": "Pola Kalimat Bab 4: [Nama Kegiatan / Acara] は 何時からですか。➔ [Jam] からです。"
      }
    },
    {
      "id": 18,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Percakapan Kerja Lapangan (から)",
      "type": "teks",
      "question_ja": "ダダン：「山手町ですね。仕事は 何時（　<strong>★</strong>　）ですか。」<br>すずき：「7時からです。」",
      "question_ruby": "ダダン：「山手町ですね。仕事は 何時（　<strong>★</strong>　）ですか。」<br>すずき：「7時からです。」",
      "question_id": "Partikel yang tepat untuk menanyakan jam mulai kerja pada dialog lapangan kerja Bab 4 di atas adalah...",
      "translation": "Dadan: 'Yamate-chou ya. Pekerjaan mulai jam berapa?' Suzuki: 'Dari jam 7.'",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "から"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "まで"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "に"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "で"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (から).",
        "logic": "Sesuai dialog percakapan Bab 4 halaman 32 antara Dadan dan Suzuki-san, untuk menanyakan jam mulai kerja digunakan pola <em>「仕事は何時<strong>から</strong>ですか」</em>.",
        "distractor": "• Opsi B: まで menanyakan batas selesai kerja (何時までですか).\n• Opsi C: に menanyakan waktu kejadian tunggal.\n• Opsi D: で menyatakan sarana.",
        "grammarRule": "Percakapan Praktis Pabrik: 仕事は何時からですか。(Pekerjaan mulai jam berapa?)."
      }
    },
    {
      "id": 19,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Penanda Hari Libur (は)",
      "type": "teks",
      "question_ja": "アグス：「休みは （　何曜日　）ですか。」<br>かとう：「月曜日（　<strong>★</strong>　）。」",
      "question_ruby": "アグス：「休みは （　何曜日　）ですか。」<br>かとう：「月曜日（　<strong>★</strong>　）。」",
      "question_id": "Kopula penutup kalimat pernyataan yang tepat untuk melengkapi jawaban Katou-san di atas adalah...",
      "translation": "Agus: 'Liburnya hari apa?' Katou: 'Hari Senin.'",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "です"
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
          "text_ja": "から"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (です).",
        "logic": "Dalam menjawab pertanyaan nama hari libur <em>「休みは何曜日ですか」</em>, jawabannya berupa predikat nominal yang diakhiri kopula sopan <strong>です (desu)</strong>: <em>「月曜日です」</em>.",
        "distractor": "• Opsi B: に diletakkan jika ada kata kerja di belakangnya (misal: 月曜日に休みます).\n• Opsi C: で bukan penutup kalimat nominal.\n• Opsi D: から berarti 'mulai dari'.",
        "grammarRule": "Tanya-Jawab Hari Libur Bab 4: 休みは何曜日ですか。➔ [Nama Hari] です。"
      }
    },
    {
      "id": 20,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Waktu Kejadian Lampau (に / に)",
      "type": "teks",
      "question_ja": "A：「きのうの晩、何時 （　①　） ねましたか。」<br>B：「10時 （　②　） ねました。」",
      "question_ruby": "A：「きのうの晩、何時 （　①　） ねましたか。」<br>B：「10時 （　②　） ねました。」",
      "question_id": "Partikel yang tepat untuk mengisi posisi ① dan ② pada percakapan waktu tidur di atas adalah...",
      "translation": "A: 'Tadi malam tidur pada jam berapa?' B: 'Tidur pada jam 10.'",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "① に　／　② に"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "① から　／　② まで"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "① は　／　② を"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "① で　／　② で"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (① に　／　② に).",
        "logic": "Pola kalimat Bab 4 halaman 27: <strong>[Waktu Berangka] ＋ に ＋ Verba</strong>. Baik pada kalimat tanya <em>何時にねましたか</em> maupun kalimat jawaban <em>10時にねました</em>, partikel yang tepat untuk menandai titik waktu kejadian adalah <strong>に</strong>.",
        "distractor": "• Opsi B: から / まで menyatakan durasi, bukan titik waktu tidur.\n• Opsi C: は / を salah kaidah gramatika.\n• Opsi D: で / で menyatakan sarana atau tempat kejadian.",
        "grammarRule": "Pola Tanya Waktu Aktivitas: 何時に [Verba] ますか／ましたか。➔ [Jam] に [Verba] ます／ました。"
      }
    },
    {
      "id": 21,
      "session": "reading",
      "section_ja": "第3部：読解・図解評価",
      "section_id": "Sesi 1: Reading — Zukai (Evaluasi Bergambar)",
      "category": "Soal Bergambar — Membaca Jam Analog (七時ちょうど)",
      "type": "gambar",
      "question_ja": "時計の 絵（え）を 見て ください。いま 何時ですか。<br>「いま （　　　）です。」",
      "question_ruby": "時計の 絵（え）を 見て ください。いま 何時ですか。<br>「いま （　　　）です。」",
      "question_id": "Perhatikan gambar jam. Pukul berapakah sekarang? 'Sekarang pukul (...)'.",
      "translation": "Sekarang tepat pukul 7:00.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "６時ちょうど"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "７時ちょうど"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "８時半"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "７時半"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (７時ちょうど).",
        "logic": "Jarum pendek menunjuk tepat di angka 7 dan jarum panjang di angka 12, menunjukkan pukul 7 tepat (七時ちょうど / しちじちょうど).",
        "distractor": "• Opsi A: ６時ちょうど adalah pukul 6 tepat.\n• Opsi C: ８時半 adalah pukul 8:30.\n• Opsi D: ７時半 adalah pukul 7:30.",
        "grammarRule": "Satuan Waktu Bab 4: [Angka]時ちょうど (tepat pukul ...)."
      },
      "image": "assets/bab_04/reading_q21.jpeg"
    },
    {
      "id": 22,
      "session": "reading",
      "section_ja": "第3部：読解・図解評価",
      "section_id": "Sesi 1: Reading — Zukai (Evaluasi Bergambar)",
      "category": "Soal Bergambar — Membaca Waktu Kerja (七時半)",
      "type": "gambar",
      "question_ja": "時計の 絵（え）を 見て ください。朝礼は何時ですか。<br>「毎朝 （　　　）に 始まります。」",
      "question_ruby": "時計の 絵（え）を 見て ください。朝礼は何時ですか。<br>「毎朝 （　　　）に 始まります。」",
      "question_id": "Perhatikan gambar jam. Pukul berapa apel pagi dimulai? 'Dimulai setiap pagi pukul (...)'.",
      "translation": "Dimulai setiap pagi pada pukul 7:30.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "７時１５分"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "８時ちょうど"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "７時半（しちじはん）"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "６時半"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (７時半（しちじはん）).",
        "logic": "Jarum pendek berada di antara angka 7 dan 8, jarum panjang menunjuk tepat angka 6, menandakan pukul 7:30 (七時半 / しちじはん).",
        "distractor": "• Opsi A: ７時１５分 adalah pukul 7:15.\n• Opsi B: ８時ちょうど adalah pukul 8 tepat.\n• Opsi D: ６時半 adalah pukul 6:30.",
        "grammarRule": "Satuan Waktu Bab 4: 半（はん = 30 menit / setengah jam）."
      },
      "image": "assets/bab_04/reading_q22.jpeg"
    },
    {
      "id": 23,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Cara Baca Kanji (午前)",
      "type": "teks",
      "question_ja": "工場の 仕事は （ 午前 ）８時からです。<br>（　）の 漢字の 正しい 読み方は どれですか。",
      "question_ruby": "工場の 仕事は （ 午前 ）８時からです。<br>（　）の 漢字の 正しい 読み方は どれですか。",
      "question_id": "Pekerjaan pabrik mulai pukul 8 pagi. Pilihlah cara baca kanji '午前' yang tepat.",
      "translation": "Pekerjaan pabrik dimulai dari pukul 8 pagi (a.m.).",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "ごぜん"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "ごご"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "まいあさ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "こんばん"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (ごぜん).",
        "logic": "Kanji 午前 dibaca ごぜん (gozen) yang bermakna pagi / sebelum tengah hari (A.M.).",
        "distractor": "• Opsi B: ごご adalah 午後 (p.m. / siang hingga malam).\n• Opsi C: まいあさ adalah 毎朝 (setiap pagi).\n• Opsi D: こんばん adalah 今晩 (malam ini).",
        "grammarRule": "Pembagian Waktu Bab 4: 午前（ごぜん = A.M.） vs 午後（ごご = P.M.）."
      }
    },
    {
      "id": 24,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Penulisan Kanji (毎晩)",
      "type": "teks",
      "question_ja": "実習生は （ まいばん ）日本語を 勉強します。<br>（　）の 言葉の 正しい 漢字は どれですか。",
      "question_ruby": "実習生は （ まいばん ）日本語を 勉強します。<br>（　）の 言葉の 正しい 漢字は どれですか。",
      "question_id": "Peserta magang belajar bahasa Jepang setiap malam. Pilihlah penulisan kanji yang tepat untuk 'maiban'.",
      "translation": "Peserta magang belajar bahasa Jepang setiap malam.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "毎朝"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "毎晩"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "毎夜"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "毎夕"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (毎晩).",
        "logic": "Kata まいばん ditulis dengan kanji 毎晩 (毎 = setiap, 晩 = malam hari).",
        "distractor": "• Opsi A: 毎朝 dibaca まいあさ (setiap pagi).\n• Opsi C: 毎夜 adalah bentuk tidak lazim untuk kosakata bab 4.\n• Opsi D: 毎夕 adalah bentuk tidak lazim.",
        "grammarRule": "Keluarga Kanji 毎: 毎日（まいにち）, 毎朝（まいあさ）, 毎晩（まいばん）."
      }
    },
    {
      "id": 25,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Pemakaian Kanji dalam Konteks (働きます)",
      "type": "teks",
      "question_ja": "月曜日から 金曜日まで 工場で （ はたらきます ）。<br>正しい 漢字は どれですか。",
      "question_ruby": "月曜日から 金曜日まで 工場で （ はたらきます ）。<br>正しい 漢字は どれですか。",
      "question_id": "Dari hari Senin sampai Jumat bekerja di pabrik. Pilihlah kanji yang tepat untuk 'hatarakimasu'.",
      "translation": "Bekerja di pabrik dari hari Senin sampai Jumat.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "働きます"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "動きます"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "行きます"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "勤きます"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (働きます).",
        "logic": "Kata はたらきます (bekerja) ditulis dengan kanji 働きます (radikal orang 亻 ditambah 動 = orang bergerak menghasilkan karya).",
        "distractor": "• Opsi B: 動きます dibaca うごきます (bergerak).\n• Opsi C: 行きます dibaca いきます (pergi).\n• Opsi D: 勤きます adalah bentuk huruf yang salah.",
        "grammarRule": "Verba Inti Pemagangan: 働きます（はたらきます = bekerja di tempat kerja）."
      }
    }
  ]
};

const BAB_05_DATA = {
  "chapter": "05",
  "title_ja": "第５課：移動の動詞（行きます・来ます・帰ります）と助詞（へ・で・と）",
  "title_id": "Bab 05: Verba Perpindahan, Transportasi, Tanggal & Partikel (He, De, To)",
  "theme_ja": "移動表現 (Idou Hyougen) & 交通手段・日付 (Koutsuu Shudan / Hizuke)",
  "theme_id": "Evaluasi penguasaan verba perpindahan (行きます, 来ます, 帰ります), sarana transportasi, penanggalan tanggal khusus (tsuitachi, futsuka, yokka, hatsuka), serta partikel (へ, で, と, も) pada Bab 5 buku IMM Japan.",
  "audioSrc": null,
  "pdfReadingSoalUrl": "assets/pdf/Salinan Soal Bab 05.pdf",
  "pdfReadingKunciUrl": "assets/pdf/Kunci dan Pembahasan Bab 05.pdf",
  "pdfSoalUrl": null,
  "pdfKunciUrl": null,
  "passingGrade": 80,
  "totalQuestions": 25,
  "readingCount": 25,
  "choukaiCount": 0,
  "questions": [
    {
      "id": 1,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Penanggalan Khusus Tanggal 20 (Hatsuka)",
      "type": "teks",
      "question_ja": "日本語で「４月２０日」の 正しい 読み方は どれですか。",
      "question_ruby": "日本語で「４月２０日」の 正しい 読み方は どれですか。",
      "question_id": "Penyebutan tanggal '20 April' dalam bahasa Jepang yang benar adalah...",
      "translation": "Cara baca bahasa Jepang yang benar untuk '20 April' adalah shigatsu hatsuka.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "しがつにじゅうにち"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "しがつはつか"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "よんがつはつか"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "しがつにじゅっか"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (しがつはつか).",
        "logic": "Bulan ke-4 disebut <strong>しがつ (shigatsu)</strong>. Tanggal 20 memiliki pelafalan khusus (irregular) dalam sistem penanggalan Jepang yaitu <strong>はつか (hatsuka)</strong>. Sehingga 4月20日 dibaca <strong>しがつはつか</strong>.",
        "distractor": "• Opsi A: しがつにじゅうにち adalah pelafalan keliru yang sering diucapkan pemula.\n• Opsi C: よんがつ salah karena bulan 4 selalu dibaca shigatsu, bukan yongatsu.\n• Opsi D: にじゅっか adalah pelafalan salah.",
        "grammarRule": "Penanggalan Khusus Tanggal 20 Bab 5: 20日 = はつか (hatsuka). Bulan 4 = 4月（しがつ）."
      }
    },
    {
      "id": 2,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Penanggalan Khusus Tanggal 4 (Yokka)",
      "type": "teks",
      "question_ja": "カレンダーの 「４日」の 正しい 読み方は どれですか。",
      "question_ruby": "カレンダーの 「４日」の 正しい 読み方は どれですか。",
      "question_id": "Penyebutan tanggal 4 dalam bahasa Jepang adalah...",
      "translation": "Cara baca yang benar untuk tanggal 4 adalah yokka.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "よんにち"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "よっか"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "しにち"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "いつか"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (よっか).",
        "logic": "Tanggal 4 dalam bahasa Jepang dibaca khusus <strong>よっか (yokka)</strong> dengan konsonan ganda sokuon (っ).",
        "distractor": "• Opsi A: よんにち adalah pelafalan keliru.\n• Opsi C: しにち salah.\n• Opsi D: いつか adalah tanggal 5 (5日).",
        "grammarRule": "Penanggalan Tanggal 1 s.d. 10 Bab 5: 1日(ついたち), 2日(ふつか), 3日(みっか), 4日(よっか), 5日(いつか), 6日(むいか), 7日(なのか), 8日(ようか), 9日(ここのか), 10日(とおか)."
      }
    },
    {
      "id": 3,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Transportasi Cepat Jepang",
      "type": "teks",
      "question_ja": "すずきさんは 大阪へ （　<strong>新幹線</strong>　）で 行きました。「新幹線」の 意味は 何ですか。",
      "question_ruby": "すずきさんは 大阪へ （　<strong>新幹線</strong>　）で 行きました。「新幹線」の 意味は 何ですか。",
      "question_id": "Istilah transportasi yang dicetak tebal di atas bermakna...",
      "translation": "Suzuki-san pergi ke Osaka dengan Shinkansen. Apa arti Shinkansen?",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Kereta cepat peluru (Shinkansen)"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Kereta listrik bawah tanah (Subway)"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Bus malam antarkota"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Kapal feri cepat"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (Kereta cepat peluru (Shinkansen)).",
        "logic": "Kata <strong>新幹線（しんかんせん - shinkansen）</strong> adalah <strong>kereta cepat peluru</strong> berkecepatan tinggi khas Jepang yang menghubungkan kota-kota besar seperti Tokyo dan Osaka.",
        "distractor": "• Opsi B: Kereta bawah tanah adalah 地下鉄 (ちかてつ).\n• Opsi C: Bus antarkota adalah 高速バス (こうそくバス).\n• Opsi D: Kapal feri adalah フェリー (ferii) atau 船 (ふね).",
        "grammarRule": "Transportasi Kereta Api Bab 5: 電車 (kereta listrik biasa), 地下鉄 (kereta bawah tanah), 新幹線 (kereta peluru)."
      }
    },
    {
      "id": 4,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Kendaraan Sepeda",
      "type": "teks",
      "question_ja": "アグスさんは 毎朝 （　<strong>じてん車</strong>　）で 会社へ 行きます。「じてん車」の 漢字は どれですか。",
      "question_ruby": "アグスさんは 毎朝 （　<strong>じてん車</strong>　）で 会社へ 行きます。「じてん車」の 漢字は どれですか。",
      "question_id": "Penulisan kanji yang benar untuk kata 'jitensha' (sepeda) adalah...",
      "translation": "Agus-san setiap pagi pergi ke perusahaan dengan sepeda. Kanji sepeda adalah 自転車.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "自動車"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "自転車"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "電車"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "飛行機"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (自転車).",
        "logic": "Kata <strong>じてんしゃ (jitensha)</strong> ditulis dengan kanji <strong>自転車</strong> yang bermakna <strong>sepeda gowes</strong>, kendaraan utama peserta magang dari asrama ke pabrik.",
        "distractor": "• Opsi A: 自動車 (じどうしゃ) adalah mobil bermotor.\n• Opsi C: 電車 (でんしゃ) adalah kereta listrik.\n• Opsi D: 飛行機 (ひこうき) adalah pesawat terbang.",
        "grammarRule": "Kanji Kendaraan Beroda Bab 5: 車 (くるま = mobil), 自転車 (じてんしゃ = sepeda), 電車 (でんしゃ = kereta listrik)."
      }
    },
    {
      "id": 5,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Hubungan Kerja Pabrik",
      "type": "teks",
      "question_ja": "会社で 自分より 前に 入った 人です。仕事を 教えて くれます。この 人は （　　　）です。",
      "question_ruby": "会社で 自分より 前に 入った 人です。仕事を 教えて くれます。この 人は （　　　）です。",
      "question_id": "Sebutan untuk senior kerja di perusahaan yang dipelajari pada Bab 5 adalah...",
      "translation": "Orang yang masuk perusahaan lebih dahulu sebelum kita. Mengajari kita pekerjaan. Orang ini adalah senpai.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "こうはい（後輩）"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "せんぱい（先輩）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "こいびと"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "ともだち"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (せんぱい（先輩）).",
        "logic": "Kata <strong>せんぱい（先輩 - senpai）</strong> berarti <strong>senior</strong> di tempat kerja atau sekolah. Dalam budaya industri Jepang, senpai wajib dihormati dan bertugas membimbing juniornya.",
        "distractor": "• Opsi A: こうはい (後輩) adalah junior yang masuk setelah kita.\n• Opsi C: こいびと (恋人) adalah kekasih/pacar.\n• Opsi D: ともだち (友だち) adalah teman sebaya.",
        "grammarRule": "Hierarki Hubungan Sosial Bab 5: 先輩（せんぱい = senior）, 後輩（こうはい = junior）, 同僚（どうりょう = rekan seangkatan）."
      }
    },
    {
      "id": 6,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Lawan Kata Keterangan Waktu Bulan (Hantaigo)",
      "type": "teks",
      "question_ja": "「先月（せんげつ）」の <strong>反対（はんたい）</strong>の 言葉（つぎの つき）は どれですか。",
      "question_ruby": "「先月（せんげつ）」の <strong>反対（はんたい）</strong>の 言葉（つぎの つき）は どれですか。",
      "question_id": "Lawan kata dari 'sengetsu' (bulan lalu), yaitu 'bulan depan' adalah...",
      "translation": "Lawan kata dari 'bulan lalu' (sengetsu) adalah 'bulan depan' (raigetsu).",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "こんげつ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "らいげつ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "きょねん"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "らいしゅう"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (らいげつ).",
        "logic": "Keterangan waktu bulan:<br>• <strong>先月（せんげつ = bulan lalu）</strong> ⇄ 今月（こんげつ = bulan ini） ⇄ <strong>来月（らいげつ = bulan depan）</strong>.",
        "distractor": "• Opsi A: こんげつ adalah bulan ini.\n• Opsi C: きょねん adalah tahun lalu.\n• Opsi D: らいしゅう adalah minggu depan.",
        "grammarRule": "Rangkaian Waktu Relatif Bab 5: 先~ (lalu), 今~ (ini), 来~ (depan) untuk 週(minggu), 月(bulan), dan 年(tahun: 去年/今年/来年)."
      }
    },
    {
      "id": 7,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Mandiri Tanpa Rekan",
      "type": "teks",
      "question_ja": "だれとも 行きません。自分 だけで スーパーへ 行きます。これは （　　　）です。",
      "question_ruby": "だれとも 行きません。自分 だけで スーパーへ 行きます。これは （　　　）です。",
      "question_id": "Ungkapan yang tepat untuk menyatakan pergi 'sendirian' adalah...",
      "translation": "Tidak pergi dengan siapa pun. Pergi ke supermarket sendirian. Ini adalah hitori de.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "友だちと"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "一人で（ひとりで）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "先輩と"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "家族と"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (一人で（ひとりで）).",
        "logic": "Kata <strong>一人で（ひとりで - hitori de）</strong> bermakna <strong>sendirian / seorang diri</strong> tanpa ditemani orang lain.",
        "distractor": "• Opsi A: 友だちと berarti bersama teman.\n• Opsi C: 先輩と berarti bersama senior.\n• Opsi D: 家族と berarti bersama keluarga.",
        "grammarRule": "Kaidah 'Sendirian': 一人で (ひとりで) sudah memuat partikel で secara idiomatis, TIDAK perlu menambahkan partikel と (tidak boleh: ひとりとお行きます)."
      }
    },
    {
      "id": 8,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kata Tanya Waktu Fleksibel (Itsu)",
      "type": "teks",
      "question_ja": "A：「（　　　） 日本へ 来ましたか。」<br>B：「先月 来ました。」",
      "question_ruby": "A：「（　　　） 日本へ 来ましたか。」<br>B：「先月 来ました。」",
      "question_id": "Kata tanya umum yang tepat untuk menanyakan 'kapan' pada dialog di atas adalah...",
      "translation": "A: 'Kapan datang ke Jepang?' B: 'Datang bulan lalu.'",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "なんさい"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "だれ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "いつ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "どこ"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (いつ).",
        "logic": "Kata tanya <strong>いつ (itsu)</strong> bermakna <strong>kapan</strong>, digunakan untuk menanyakan waktu secara umum tanpa terikat jam atau tanggal tertentu. Kata <em>いつ</em> tidak diikuti partikel に.",
        "distractor": "• Opsi A: なんさい menanyakan umur.\n• Opsi B: だれ menanyakan orang.\n• Opsi D: どこ menanyakan tempat.",
        "grammarRule": "Rumus Menanyakan Waktu Kejadian Bab 5: いつ ＋ [Tujuan] へ ＋ 行きますか／来ましたか。"
      }
    },
    {
      "id": 9,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Fasilitas Stasiun Kereta",
      "type": "teks",
      "question_ja": "アグス：「すみません、よこはま（　　　）は どこですか。」<br>女の人：「あそこです。」",
      "question_ruby": "アグス：「すみません、よこはま（　　　）は どこですか。」<br>女の人：「あそこです。」",
      "question_id": "Tempat pemberhentian kereta api (stasiun) yang dicari Agus pada percakapan Bab 5 di atas adalah...",
      "translation": "Agus: 'Permisi, stasiun Yokohama di mana?' Wanita: 'Di sebelah sana.'",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "えき（駅）"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "こうじょう"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "りょう"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "ぎんこう"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (えき（駅）).",
        "logic": "Kata <strong>えき（駅 - eki）</strong> berarti <strong>stasiun kereta api</strong>.",
        "distractor": "• Opsi B: こうじょう adalah pabrik.\n• Opsi C: りょう adalah asrama.\n• Opsi D: ぎんこう adalah bank.",
        "grammarRule": "Kosakata Tempat Bab 5: 駅 (えき = stasiun), 学校 (がっこう = sekolah), スーパー (supermarket), うち (rumah)."
      }
    },
    {
      "id": 10,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Hari Ulang Tahun",
      "type": "teks",
      "question_ja": "自分が 生まれた（うまれた） 日です。日本語で （　　　）と 言います。",
      "question_ruby": "自分が 生まれた（うまれた） 日です。日本語で （　　　）と 言います。",
      "question_id": "Hari peringatan kelahiran seseorang dalam bahasa Jepang disebut...",
      "translation": "Hari saat diri sendiri dilahirkan. Dalam bahasa Jepang disebut tanjoubi (ulang tahun).",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "たんじょうび（誕生日）"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "ひるやすみ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "げつようび"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "まいあさ"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (たんじょうび（誕生日）).",
        "logic": "Kata <strong>たんじょうび（誕生日 - tanjoubi）</strong> berarti <strong>hari ulang tahun</strong>.",
        "distractor": "• Opsi B: ひるやすみ adalah istirahat siang.\n• Opsi C: げつようび adalah hari Senin.\n• Opsi D: まいあさ adalah setiap pagi.",
        "grammarRule": "Frasa Selamat Ulang Tahun Bab 5: たん生日おめでとう（ございます）。"
      }
    },
    {
      "id": 11,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Penanda Arah Tujuan (へ)",
      "type": "teks",
      "question_ja": "わたしは 来月 日本 （　<strong>★</strong>　） 行きます。",
      "question_ruby": "わたしは 来月 日本 （　<strong>★</strong>　） 行きます。",
      "question_id": "Partikel penanda arah tujuan perpindahan yang tepat untuk mengisi posisi bintang (★) adalah...",
      "translation": "Saya bulan depan akan pergi ke Jepang.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "へ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "を"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "で"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "から"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (へ).",
        "logic": "Partikel <strong>へ (e - ditulis dengan huruf hiragana 'he')</strong> berfungsi sebagai penanda <strong>arah tujuan pergerakan</strong> yang diikuti verba perpindahan seperti <em>行きます, 来ます, 帰ります</em>.",
        "distractor": "• Opsi B: を adalah penanda objek langsung kata kerja transitif (Bab 6).\n• Opsi C: で adalah penanda alat/transportasi.\n• Opsi D: から adalah penanda titik tolak asal mula.",
        "grammarRule": "Pola Dasar Arah Bab 5: [Tempat Tujuan] ＋ へ（に） ＋ 行きます／来ます／帰ります。"
      }
    },
    {
      "id": 12,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Sarana / Moda Transportasi (で)",
      "type": "teks",
      "question_ja": "アグスさんは 何 （　<strong>★</strong>　） 会社へ 行きますか。……自転車で 行きます。",
      "question_ruby": "アグスさんは 何 （　<strong>★</strong>　） 会社へ 行きますか。……自転車で 行きます。",
      "question_id": "Partikel yang tepat untuk menanyakan moda transportasi yang digunakan pada kalimat di atas adalah...",
      "translation": "Agus-san pergi ke perusahaan naik (dengan) apa? ...Pergi naik sepeda.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "へ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "で"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "を"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "に"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (で).",
        "logic": "Partikel <strong>で (de)</strong> berfungsi sebagai penanda <strong>sarana atau moda transportasi</strong> yang digunakan untuk berpindah tempat (dengan mobil = 車で, dengan kereta = 電車で).",
        "distractor": "• Opsi A: へ menandai arah tujuan, bukan sarana.\n• Opsi C: を menandai objek penderita.\n• Opsi D: に menandai titik waktu atau letak.",
        "grammarRule": "Pola Transportasi Bab 5: [Moda Kendaraan] ＋ で ＋ 行きます／来ます／帰ります。"
      }
    },
    {
      "id": 13,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Rekan Penyerta (と)",
      "type": "teks",
      "question_ja": "だれ （　<strong>★</strong>　） ジャカルタへ 行きますか。……友だちと 行きます。",
      "question_ruby": "だれ （　<strong>★</strong>　） ジャカルタへ 行きますか。……友だちと 行きます。",
      "question_id": "Partikel yang tepat untuk menanyakan rekan bersama pada kalimat di atas adalah...",
      "translation": "Pergi ke Jakarta bersama siapa? ...Pergi bersama teman.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "に"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "と"
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
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (と).",
        "logic": "Partikel <strong>と (to)</strong> berfungsi sebagai penanda <strong>rekan penyerta (bersama / dengan seseorang)</strong> saat melakukan suatu perbuatan (bersama teman = 友だちと).",
        "distractor": "• Opsi A: に menandai titik tujuan.\n• Opsi C: で menandai sarana alat/kendaraan.\n• Opsi D: を menandai objek.",
        "grammarRule": "Pola Rekan Penyerta Bab 5: [Orang / Teman] ＋ と ＋ 行きます／来ます／帰ります。"
      }
    },
    {
      "id": 14,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Penyangkalan Total (どこへも 行きません)",
      "type": "teks",
      "question_ja": "A：「明日 どこへ 行きますか。」<br>B：「どこへ （　<strong>★</strong>　） 行きません。寮で 休みます。」",
      "question_ruby": "A：「明日 どこへ 行きますか。」<br>B：「どこへ （　<strong>★</strong>　） 行きません。寮で 休みます。」",
      "question_id": "Partikel yang tepat untuk menyatakan penyangkalan mutlak 'ke mana pun tidak pergi' adalah...",
      "translation": "A: 'Besok pergi ke mana?' B: 'Tidak pergi ke mana pun. Istirahat di asrama.'",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "は"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "も"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "か"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "で"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (も).",
        "logic": "Pola <strong>Kata Tanya ＋ Partikel へ ＋ も ＋ Predikat Negatif</strong> digunakan untuk menyatakan <strong>penyangkalan mutlak (ke mana pun tidak...)</strong>: <em>どこへも行きません</em>.",
        "distractor": "• Opsi A: は tidak membentuk pola penolakan mutlak.\n• Opsi C: どこへか berarti 'ke suatu tempat' (kalimat positif).\n• Opsi D: で salah secara kaidah.",
        "grammarRule": "Rumus Penyangkalan Total Bab 5: どこへも 行きません／行きませんでした (Tidak pergi ke mana pun)."
      }
    },
    {
      "id": 15,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Pengecualian Berjalan Kaki (Tanpa Partikel で)",
      "type": "teks",
      "question_ja": "駅から 会社まで 歩いて（あるいて） （　<strong>★</strong>　） 行きます。",
      "question_ruby": "駅から 会社まで 歩いて（あるいて） （　<strong>★</strong>　） 行きます。",
      "question_id": "Partikel yang tepat diletakkan setelah kata '歩いて' (berjalan kaki) adalah...",
      "translation": "Dari stasiun sampai perusahaan pergi dengan berjalan kaki.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "で"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "に"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "（何も つけない / Tanpa Partikel）"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "を"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (（何も つけない / Tanpa Partikel）).",
        "logic": "Kata <strong>歩いて（あるいて - aruite = berjalan kaki）</strong> adalah bentuk perubahan verba yang berfungsi sebagai adverbia sarana. Kata ini <strong>TIDAK MEMERLUKAN partikel で</strong> (tidak boleh: <em>あるいてで行きます</em>).",
        "distractor": "• Opsi A: Partikel で sering keliru ditambahkan oleh pembelajar pemula, namun secara tata bahasa salah.\n• Opsi B: に salah.\n• Opsi D: を salah.",
        "grammarRule": "PENTING (Pengecualian Bab 5): Kendaraan memakai で (車で, 電車で), tetapi berjalan kaki murni: 歩いて 行きます (tanpa で)."
      }
    },
    {
      "id": 16,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Kombinasi Partikel Rekan dan Sarana (と / で)",
      "type": "teks",
      "question_ja": "田中先生 （　①　） 車 （　②　） 工場へ 来ました。",
      "question_ruby": "田中先生 （　①　） 車 （　②　） 工場へ 来ました。",
      "question_id": "Kombinasi partikel yang tepat untuk mengisi posisi ① (rekan) dan ② (kendaraan) adalah...",
      "translation": "Datang ke pabrik bersama Tanaka-sensei dengan naik mobil.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "① と　／　② で"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "① で　／　② と"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "① に　／　② へ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "① の　／　② に"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (① と　／　② で).",
        "logic": "Posisi ① menandai rekan yang menyertai menggunakan <strong>と</strong> (田中先生と).<br>Posisi ② menandai sarana transportasi yang dinaiki menggunakan <strong>で</strong> (車で).",
        "distractor": "• Opsi B: Susunan terbalik (で / と) menghasilkan makna rancu.\n• Opsi C: に / へ tidak mewakili fungsi rekan dan kendaraan.\n• Opsi D: の / に salah secara gramatika.",
        "grammarRule": "Pola Terintegrasi Bab 5: [Rekan] と ＋ [Transportasi] で ＋ [Tempat] へ 行きます。"
      }
    },
    {
      "id": 17,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Percakapan Menanyakan Jurusan Kereta (へ)",
      "type": "teks",
      "question_ja": "アグス：「すみません、この電車は 東京 （　<strong>★</strong>　） 行きますか。」<br>駅員：「いいえ、行きません。」",
      "question_ruby": "アグス：「すみません、この電車は 東京 （　<strong>★</strong>　） 行きますか。」<br>駅員：「いいえ、行きません。」",
      "question_id": "Partikel arah tujuan jurusan kereta pada dialog Bab 5 di atas adalah...",
      "translation": "Agus: 'Permisi, apakah kereta ini pergi ke (jurusan) Tokyo?' Petugas stasiun: 'Bukan, tidak pergi.'",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "へ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "で"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "を"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "に"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (へ).",
        "logic": "Untuk menanyakan apakah kereta tersebut menuju ke arah tujuan tertentu (Tokyo), partikel arah yang digunakan setelah kata benda tempat adalah <strong>へ (e)</strong>.",
        "distractor": "• Opsi B: で menandai kendaraan, sedangkan Tokyo adalah nama kota tujuan.\n• Opsi C: を menandai objek penderita.\n• Opsi D: Walaupun partikel に bisa menandai tujuan, dalam buku teks percakapan resmi Bab 5 IMM Japan hal 40 teksnya baku menggunakan partikel へ.",
        "grammarRule": "Ungkapan Baku Stasiun Kereta: この電車は [Kota Tujuan] へ 行きますか。"
      }
    },
    {
      "id": 18,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Subjek Asosiasi Tanggal Lahir (の)",
      "type": "teks",
      "question_ja": "アグス：「すずきさん （　<strong>★</strong>　） たん生日は いつですか。」<br>すずき：「5月9日です。」",
      "question_ruby": "アグス：「すずきさん （　<strong>★</strong>　） たん生日は いつですか。」<br>すずき：「5月9日です。」",
      "question_id": "Partikel kepemilikan yang menghubungkan Suzuki-san dengan hari ulang tahunnya adalah...",
      "translation": "Agus: 'Hari ulang tahun Suzuki-san kapan?' Suzuki: 'Tanggal 9 Mei.'",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "は"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "の"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "も"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "に"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (の).",
        "logic": "Partikel <strong>の (no)</strong> menghubungkan orang dengan hari ulang tahunnya (すずきさんのたん生日 = hari ulang tahun milik Suzuki-san).",
        "distractor": "• Opsi A: は penanda topik kalimat.\n• Opsi C: も berarti juga.\n• Opsi D: に penanda titik waktu kejadian.",
        "grammarRule": "Menanyakan Ulang Tahun Seseorang: [Orang] の たん生日は いつですか。➔ [Bulan] 月 [Tanggal] 日です。"
      }
    },
    {
      "id": 19,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Kombinasi Partikel Waktu dan Tujuan (に / へ)",
      "type": "teks",
      "question_ja": "毎朝 8時 （　①　） 教室 （　②　） 来ます。",
      "question_ruby": "毎朝 8時 （　①　） 教室 （　②　） 来ます。",
      "question_id": "Kombinasi partikel yang tepat untuk mengisi posisi ① (waktu jam) dan ② (arah tujuan) adalah...",
      "translation": "Setiap pagi datang ke ruang kelas pada pukul 08:00.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "① に　／　② へ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "① へ　／　② に"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "① で　／　② を"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "① と　／　② で"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (① に　／　② へ).",
        "logic": "Posisi ① menunjukkan titik waktu berangka menggunakan partikel <strong>に</strong>.<br>Posisi ② menunjukkan arah tujuan kedatangan menggunakan partikel <strong>へ</strong>.",
        "distractor": "• Opsi B: Susunan terbalik salah fungsi.\n• Opsi C: で / を salah fungsi.\n• Opsi D: と / で salah fungsi.",
        "grammarRule": "Pola Baku Waktu dan Tujuan: [Waktu Berangka] に ＋ [Tempat Tujuan] へ ＋ 来ます／行きます。"
      }
    },
    {
      "id": 20,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Percakapan Kepulangan ke Asrama (と / へ)",
      "type": "teks",
      "question_ja": "A：「アグスさんは だれ （　①　） 寮（りょう） （　②　） 帰りますか。」<br>B：「会社の人と 帰ります。」",
      "question_ruby": "A：「アグスさんは だれ （　①　） 寮（りょう） （　②　） 帰りますか。」<br>B：「会社の人と 帰ります。」",
      "question_id": "Partikel yang tepat untuk mengisi pertanyaan rekan pulang dan tempat tujuan pada dialog di atas adalah...",
      "translation": "A: 'Agus-san pulang ke asrama bersama siapa?' B: 'Pulang bersama orang kantor.'",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "① と　／　② へ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "① で　／　② に"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "① に　／　② と"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "① を　／　② へ"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (① と　／　② へ).",
        "logic": "Sesuai Bunkei 4 Bab 5 halaman 35: <em>「だれと りょうへ かえりますか」</em>. Posisi ① menanyakan rekan menggunakan <strong>と</strong>, posisi ② menunjukkan tujuan asrama menggunakan <strong>へ</strong>.",
        "distractor": "• Opsi B: で / に tidak tepat untuk menanyakan rekan persona.\n• Opsi C: に / と terbalik fungsinya.\n• Opsi D: を / へ salah secara sintaksis.",
        "grammarRule": "Percakapan Rutinitas Kepulangan Asrama: だれと 寮へ 帰りますか。➔ [Rekan] と 帰ります。"
      }
    },
    {
      "id": 21,
      "session": "reading",
      "section_ja": "第3部：読解・図解評価",
      "section_id": "Sesi 1: Reading — Zukai (Evaluasi Bergambar)",
      "category": "Soal Bergambar — Alat Transportasi (電車)",
      "type": "gambar",
      "question_ja": "絵（え）を 見て ください。何で 工場へ 行きますか。<br>「（　　　）で 行きます。」",
      "question_ruby": "絵（え）を 見て ください。何で 工場へ 行きますか。<br>「（　　　）で 行きます。」",
      "question_id": "Perhatikan gambar. Naik apakah pergi ke pabrik? 'Pergi naik (...)'.",
      "translation": "Pergi ke pabrik naik kereta listrik (densha).",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "バイク"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "電車（でんしゃ）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "じてんしゃ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "ふね"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (電車（でんしゃ）).",
        "logic": "Gambar menunjukkan kereta listrik perkotaan Jepang (電車 / でんしゃ - densha).",
        "distractor": "• Opsi A: バイク adalah sepeda motor.\n• Opsi C: じてんしゃ adalah sepeda gowes.\n• Opsi D: ふね adalah kapal laut.",
        "grammarRule": "Kendaraan Bab 5: 電車（でんしゃ = kereta listrik）."
      },
      "image": "assets/bab_05/reading_q21.jpeg"
    },
    {
      "id": 22,
      "session": "reading",
      "section_ja": "第3部：読解・図解評価",
      "section_id": "Sesi 1: Reading — Zukai (Evaluasi Bergambar)",
      "category": "Soal Bergambar — Angkutan Umum (バス)",
      "type": "gambar",
      "question_ja": "絵（え）を 見て ください。何で 駅へ 行きますか。<br>「（　　　）で 行きます。」",
      "question_ruby": "絵（え）を 見て ください。何で 駅へ 行きますか。<br>「（　　　）で 行きます。」",
      "question_id": "Perhatikan gambar. Naik apakah pergi ke stasiun? 'Pergi naik (...)'.",
      "translation": "Pergi ke stasiun naik bus.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "タクシー"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "ひこうき"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "バス"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "あるいて"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (バス).",
        "logic": "Gambar menunjukkan bus angkutan umum (バス - basu).",
        "distractor": "• Opsi A: タクシー adalah taksi.\n• Opsi B: ひこうき adalah pesawat terbang.\n• Opsi D: あるいて adalah berjalan kaki.",
        "grammarRule": "Kendaraan Bab 5: バス（bus umum / bus jemputan pabrik）."
      },
      "image": "assets/bab_05/reading_q22.jpeg"
    },
    {
      "id": 23,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Cara Baca Kanji (行きます)",
      "type": "teks",
      "question_ja": "日曜日、友だちと 東京へ （ 行きます ）。<br>（　）の 漢字の 正しい 読み方は どれですか。",
      "question_ruby": "日曜日、友だちと 東京へ （ 行きます ）。<br>（　）の 漢字の 正しい 読み方は どれですか。",
      "question_id": "Hari Minggu pergi ke Tokyo bersama teman. Pilihlah cara baca kanji '行きます' yang tepat.",
      "translation": "Hari Minggu pergi ke Tokyo bersama kawan.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "いきます"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "きます"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "かえります"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "あるきます"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (いきます).",
        "logic": "Kanji 行きます dibaca いきます (ikimasu) yang bermakna pergi.",
        "distractor": "• Opsi B: きます ditulis 来ます (datang).\n• Opsi C: かえります ditulis 帰ります (pulang).\n• Opsi D: あるきます ditulis 歩きます (berjalan).",
        "grammarRule": "Verba Gerak Bab 5: 行きます（いきます = pergi）."
      }
    },
    {
      "id": 24,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Penulisan Kanji (来週)",
      "type": "teks",
      "question_ja": "（ らいしゅう ）の 土曜日に 研修センターへ 行きます。<br>（　）の 言葉の 正しい 漢字は どれですか。",
      "question_ruby": "（ らいしゅう ）の 土曜日に 研修センターへ 行きます。<br>（　）の 言葉の 正しい 漢字は どれですか。",
      "question_id": "Hari Sabtu minggu depan akan pergi ke Pusat Pelatihan. Pilihlah penulisan kanji yang tepat untuk 'raishuu'.",
      "translation": "Hari Sabtu minggu depan akan pergi ke Pusat Pelatihan.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "今週"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "来週"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "先週"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "毎週"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (来週).",
        "logic": "Kata らいしゅう (minggu depan) ditulis dengan kanji 来週 (来 = datang/mendatang, 週 = minggu).",
        "distractor": "• Opsi A: 今週 dibaca こんしゅう (minggu ini).\n• Opsi C: 先週 dibaca せんしゅう (minggu lalu).\n• Opsi D: 毎週 dibaca まいしゅう (setiap minggu).",
        "grammarRule": "Keterangan Waktu Bab 5: 来週（らいしゅう = pekan depan）."
      }
    },
    {
      "id": 25,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Pemakaian Kanji dalam Konteks (駅)",
      "type": "teks",
      "question_ja": "会社の 人と （ えき ）で 会います。<br>正しい 漢字は どれですか。",
      "question_ruby": "会社の 人と （ えき ）で 会います。<br>正しい 漢字は どれですか。",
      "question_id": "Bertemu dengan orang perusahaan di stasiun. Pilihlah kanji yang tepat untuk 'eki'.",
      "translation": "Bertemu dengan orang perusahaan di stasiun kereta.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "駅"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "尺"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "駐"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "訳"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (駅).",
        "logic": "Kata えき (stasiun kereta) ditulis dengan kanji 駅 (radikal kuda 馬 di sisi kiri dan 尺 di sisi kanan).",
        "distractor": "• Opsi B: 尺 adalah huruf shaku (ukuran tradisional).\n• Opsi C: 駐 adalah kanji pada 駐車 (parkir).\n• Opsi D: 訳 adalah kanji pada 翻訳 (terjemah).",
        "grammarRule": "Fasilitas Perjalanan: 駅（えき = stasiun kereta api）."
      }
    }
  ]
};

const BAB_06_DATA = {
  "chapter": "06",
  "title_ja": "第６課：動詞（食べます・飲みます・読みます・買います）と助詞（を・で）",
  "title_id": "Bab 06: Verba Transitif, Objek Penderita, Tempat Aktivitas & Ajakan",
  "theme_ja": "飲食・購買・日常行為 (Inshoku / Koubai / Nichijou Koui)",
  "theme_id": "Evaluasi penguasaan kosakata makanan, minuman, barang belanjaan, media, aktivitas harian, serta partikel objek penderita (を), tempat aktivitas (で), penyerta (と), penolakan total (も), dan bentuk ajakan (ませんか / ましょう) pada Bab 6 buku IMM Japan.",
  "audioSrc": null,
  "pdfReadingSoalUrl": "assets/pdf/Salinan Soal Bab 06.pdf",
  "pdfReadingKunciUrl": "assets/pdf/Kunci dan Pembahasan Bab 06.pdf",
  "pdfSoalUrl": null,
  "pdfKunciUrl": null,
  "passingGrade": 80,
  "totalQuestions": 25,
  "readingCount": 25,
  "choukaiCount": 0,
  "questions": [
    {
      "id": 1,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Makanan & Waktu Makan",
      "type": "teks",
      "question_ja": "アグスさんは けさ 7時におきました。それから（　<strong>朝ごはん</strong>　）を 食べました。「朝ごはん」の 意味は どれですか。",
      "question_ruby": "アグスさんは けさ 7時におきました。それから（　<strong>朝ごはん</strong>　）を 食べました。「朝ごはん」の 意味は どれですか。",
      "question_id": "Kosakata yang dicetak tebal pada kalimat di atas bermakna...",
      "translation": "Agus-san tadi pagi bangun jam 7. Setelah itu makan sarapan. Arti 'asagohan' adalah sarapan / makan pagi.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Makan siang"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Makan malam"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Sarapan / makan pagi"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Camilan sore"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (Sarapan / makan pagi).",
        "logic": "Kata <strong>朝ごはん（あさごはん - asagohan）</strong> dibentuk dari kanji <strong>朝（あさ = pagi）</strong> dan <strong>ごはん（makanan/nasi）</strong>, sehingga bermakna <strong>sarapan atau makan pagi</strong>. Ini adalah kosakata pokok aktivitas harian peserta magang di asrama.",
        "distractor": "• Opsi A: Makan siang adalah 昼ごはん (ひるごはん - hirugohan).\n• Opsi B: Makan malam adalah 晩ごはん (ばんごはん - bangohan).\n• Opsi D: Camilan atau kudapan ringan dalam bahasa Jepang adalah おやつ (oyatsu).",
        "grammarRule": "Kosakata Waktu Makan Bab 6: 朝ごはん (sarapan), 昼ごはん (makan siang), 晩ごはん (makan malam)."
      }
    },
    {
      "id": 2,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Cara Baca Kanji",
      "type": "teks",
      "question_ja": "朝ごはんは パンと （　<strong>卵</strong>　）と 牛乳でした。「卵」の 正しい 読み方は どれですか。",
      "question_ruby": "朝ごはんは パンと （　<strong>卵</strong>　）と 牛乳でした。「卵」の 正しい 読み方は どれですか。",
      "question_id": "Cara baca kanji dalam tanda kurung yang tepat adalah...",
      "translation": "Sarapannya adalah roti, telur, dan susu. Cara baca kanji 卵 adalah tamago.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "さかな"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "たまご"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "にく"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "やさい"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (たまご).",
        "logic": "Kanji <strong>卵</strong> memiliki cara baca baku <strong>たまご (tamago)</strong> yang berarti <strong>telur</strong>. Makanan ini tercantum jelas dalam bacaan utama Bab 6 teks IMM Japan.",
        "distractor": "• Opsi A: さかな adalah cara baca untuk kanji 魚 (ikan).\n• Opsi C: にく adalah cara baca untuk kanji 肉 (daging).\n• Opsi D: やさい adalah cara baca untuk kosakata 野菜 (sayur-sayuran).",
        "grammarRule": "Kanji Bahan Makanan Bab 6: 卵 (たまご - telur), 魚 (さかな - ikan), 肉 (にく - daging)."
      }
    },
    {
      "id": 3,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Minuman",
      "type": "teks",
      "question_ja": "ダダンさんは 毎朝 食堂で （　<strong>ぎゅうにゅう</strong>　）を 飲みます。「ぎゅうにゅう」の 漢字は どれですか。",
      "question_ruby": "ダダンさんは 毎朝 食堂で （　<strong>ぎゅうにゅう</strong>　）を 飲みます。「ぎゅうにゅう」の 漢字は どれですか。",
      "question_id": "Penulisan kanji yang benar untuk kata 'gyuunyuu' (susu sapi) adalah...",
      "translation": "Dadan-san setiap pagi minum susu sapi di kantin asrama. Kanji gyuunyuu adalah 牛乳.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "牛乳"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "牛肉"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "お茶"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "水"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (牛乳).",
        "logic": "Kata <strong>ぎゅうにゅう (gyuunyuu)</strong> ditulis dengan kanji <strong>牛乳</strong> yang terdiri dari radikal lembu/sapi (牛) dan susu (乳), bermakna <strong>susu sapi</strong>.",
        "distractor": "• Opsi B: 牛肉 dibaca ぎゅうにく (gyuuniku) yang berarti daging sapi.\n• Opsi C: お茶 dibaca おちゃ (ocha) yang berarti teh hijau Jepang.\n• Opsi D: 水 dibaca みず (mizu) yang berarti air putih biasa.",
        "grammarRule": "Kosakata Minuman Bab 6: 牛乳（ぎゅうにゅう - susu）, お茶（おちゃ - teh hijau）, コーヒー (kopi), お酒（おさけ - sake/minuman beralkohol）, ビール (bir)."
      }
    },
    {
      "id": 4,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Barang Belanjaan",
      "type": "teks",
      "question_ja": "日曜日、友だちは デパートで シャツと （　<strong>かばん</strong>　）を 買いました。「かばん」の 意味は どれですか。",
      "question_ruby": "日曜日、友だちは デパートで シャツと （　<strong>かばん</strong>　）を 買いました。「かばん」の 意味は どれですか。",
      "question_id": "Arti kosakata 'kaban' pada kalimat di atas adalah...",
      "translation": "Hari Minggu, teman membeli kemeja dan tas di toserba. 'Kaban' bermakna tas.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Sepatu"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Topi"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Kemeja"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Tas"
        }
      ],
      "correctAnswer": "D",
      "explanation": {
        "summary": "Jawaban yang benar adalah D (Tas).",
        "logic": "Kosakata <strong>かばん (kaban)</strong> bermakna <strong>tas</strong>. Dalam bacaan Bab 6, teman Agus membeli シャツ (kemeja) dan かばん (tas) saat berkunjung ke toserba (デパート).",
        "distractor": "• Opsi A: Sepatu adalah 靴（くつ - kutsu）.\n• Opsi B: Topi adalah 帽子（ぼうし - boushi）.\n• Opsi C: Kemeja adalah シャツ (shatsu).",
        "grammarRule": "Barang Belanjaan Bab 6: シャツ (kemeja), かばん (tas), 靴 (sepatu), 傘 (payung), 本 (buku)."
      }
    },
    {
      "id": 5,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Waktu Relatif Lampau",
      "type": "teks",
      "question_ja": "アグスさん：『（　<strong>けさ</strong>　）、何時に 起きましたか。』「けさ」の 意味は どれですか。",
      "question_ruby": "アグスさん：『（　<strong>けさ</strong>　）、何時に 起きましたか。』「けさ」の 意味は どれですか。",
      "question_id": "Makna dari penunjuk waktu 'kesa' adalah...",
      "translation": "Agus-san: 'Tadi pagi bangun jam berapa?' Makna 'kesa' adalah tadi pagi.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Tadi pagi"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Tadi malam"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Besok pagi"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Kemarin sore"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (Tadi pagi).",
        "logic": "Kata penunjuk waktu <strong>今朝（けさ - kesa）</strong> berarti <strong>tadi pagi / pagi ini</strong>. Karena merujuk pada waktu yang sudah lewat di hari yang sama, predikat yang mengikutinya sering berbentuk lampau.",
        "distractor": "• Opsi B: Tadi malam adalah ゆうべ (yuube) atau 昨夜 (さくや - sakuya).\n• Opsi C: Besok pagi adalah 明日の朝 (あしたのあさ) atau 明朝 (みょうちょう).\n• Opsi D: Kemarin sore adalah きのうの夕方 (きのうのゆうがた).",
        "grammarRule": "Penunjuk Waktu Terkait Pagi/Malam: けさ (tadi pagi), 今晩 (こんばん - malam ini), ゆうべ (tadi malam), 毎朝 (まいあさ - setiap pagi), 毎晩 (まいばん - setiap malam)."
      }
    },
    {
      "id": 6,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Cara Baca Kanji",
      "type": "teks",
      "question_ja": "スズキさんは 毎朝 事務所で （　<strong>新聞</strong>　）を 読みます。「新聞」の 正しい 読み方は どれですか。",
      "question_ruby": "スズキさんは 毎朝 事務所で （　<strong>新聞</strong>　）を 読みます。「新聞」の 正しい 読み方は どれですか。",
      "question_id": "Cara baca kanji yang benar untuk 'shinbun' (koran) adalah...",
      "translation": "Suzuki-san setiap pagi membaca koran di kantor. Cara baca kanji 新聞 adalah shinbun.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "ざっし"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "きょうかしょ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "しんぶん"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "じしょ"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (しんぶん).",
        "logic": "Kanji <strong>新聞</strong> dibaca <strong>しんぶん (shinbun)</strong> yang berarti <strong>surat kabar / koran</strong>. Terdiri dari kanji 新 (baru) dan 聞 (mendengar/kabar).",
        "distractor": "• Opsi A: ざっし adalah cara baca untuk 雑誌 (majalah).\n• Opsi B: きょうかしょ adalah cara baca untuk 教科書 (buku teks).\n• Opsi D: じしょ adalah cara baca untuk 辞書 (kamus).",
        "grammarRule": "Media Bacaan Bab 6: 新聞（しんぶん - koran）, 雑誌（ざっし - majalah）, 本（ほん - buku）, 手紙（てがみ - surat）."
      }
    },
    {
      "id": 7,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Fasilitas Asrama & Pabrik",
      "type": "teks",
      "question_ja": "実習生は りょうの （　<strong>食堂</strong>　）で 朝ごはんを 食べます。「食堂」の 意味は どれですか。",
      "question_ruby": "実習生は りょうの （　<strong>食堂</strong>　）で 朝ごはんを 食べます。「食堂」の 意味は どれですか。",
      "question_id": "Kosakata fasilitas yang dicetak tebal memiliki arti...",
      "translation": "Peserta magang makan sarapan di kantin asrama. 'Shokudou' bermakna kantin / ruang makan.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Ruang kamar tidur"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Kantin / ruang makan"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Ruang merokok"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Lobi resepsionis"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (Kantin / ruang makan).",
        "logic": "Kata <strong>食堂（しょくどう - shokudou）</strong> tersusun atas kanji 食 (makan) dan 堂 (aula/ruang besar), yang berarti <strong>kantin atau ruang makan bersama</strong> di pabrik maupun asrama (寮).",
        "distractor": "• Opsi A: Kamar tidur / ruangan pribadi adalah 部屋（へや - heya）.\n• Opsi C: Ruang merokok adalah 喫煙室（きつえんしつ - kitsuenshitsu）.\n• Opsi D: Lobi asrama adalah ロビー (robii).",
        "grammarRule": "Fasilitas Asrama & Pabrik Bab 6: 食堂 (kantin), 喫煙室 (ruang merokok), ロビー (lobi), 部屋 (kamar), 事務所 (kantor)."
      }
    },
    {
      "id": 8,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Hiburan & Media",
      "type": "teks",
      "question_ja": "先週の 日曜日、えいがかんで （　<strong>えいが</strong>　）を 見ました。「えいが」の 漢字は どれですか。",
      "question_ruby": "先週の 日曜日、えいがかんで （　<strong>えいが</strong>　）を 見ました。「えいが」の 漢字は どれですか。",
      "question_id": "Penulisan kanji yang benar untuk kata 'eiga' (film) adalah...",
      "translation": "Hari Minggu minggu lalu, saya menonton film di bioskop. Kanji eiga adalah 映画.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "写真"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "音楽"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "映画"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "電話"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (映画).",
        "logic": "Kosakata <strong>えいが (eiga)</strong> ditulis dengan kanji <strong>映画</strong> yang berarti <strong>film atau sinema</strong>. Tempat untuk menontonnya disebut 映画館（えいがかん - bioskop）.",
        "distractor": "• Opsi A: 写真 dibaca しゃしん (shashin) yang berarti foto.\n• Opsi B: 音楽 dibaca おんがく (ongaku) yang berarti musik.\n• Opsi D: 電話 dibaca でんわ (denwa) yang berarti telepon.",
        "grammarRule": "Kosakata Hiburan Bab 6: 映画（えいが - film）, 映画館（えいがかん - bioskop）, 写真（しゃしん - foto）, テレビ (televisi), ラジオ (radio)."
      }
    },
    {
      "id": 9,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Makanan Sehat",
      "type": "teks",
      "question_ja": "アグスさんは スーパーで りんごと みかんを 買いました。これらは 日本語で 何ですか。",
      "question_ruby": "アグスさんは スーパーで りんごと みかんを 買いました。これらは 日本語で 何ですか。",
      "question_id": "Apel (ringo) dan jeruk mandarin (mikan) termasuk dalam kelompok...",
      "translation": "Agus-san membeli apel dan jeruk di supermarket. Keduanya tergolong 'kudamono' (buah-buahan).",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "くだもの（果物）"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "やさい（野菜）"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "にく（肉）"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "おかし（お菓子）"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (くだもの（果物）).",
        "logic": "Apel (りんご) dan jeruk mandarin (みかん) adalah jenis <strong>果物（くだもの - kudamono = buah-buahan）</strong> yang sering dibeli peserta magang di toserba/supermarket.",
        "distractor": "• Opsi B: やさい (sayur-sayuran) mencakup wortel, bayam, kol, dll.\n• Opsi C: にく (daging) mencakup daging sapi (牛肉), ayam (とり肉), dll.\n• Opsi D: おかし (kue/makanan ringan manis).",
        "grammarRule": "Kelompok Makanan Bab 6: 果物 (くだもの - buah-buahan), 野菜 (やさい - sayuran), 肉 (にく - daging), 魚 (さかな - ikan)."
      }
    },
    {
      "id": 10,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kata Kerja Aktivitas Rutin",
      "type": "teks",
      "question_ja": "ダダンさんは 毎晩 ロビーで テレビを （　<strong>みます</strong>　）。「みます」の 漢字は どれですか。",
      "question_ruby": "ダダンさんは 毎晩 ロビーで テレビを （　<strong>みます</strong>　）。「みます」の 漢字は どれですか。",
      "question_id": "Penulisan kanji yang tepat untuk verba transitif 'mimasu' (melihat/menonton) adalah...",
      "translation": "Dadan-san setiap malam menonton televisi di lobi. Kanji mimasu adalah 見ます.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "聞きます"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "読みます"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "買います"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "見ます"
        }
      ],
      "correctAnswer": "D",
      "explanation": {
        "summary": "Jawaban yang benar adalah D (見ます).",
        "logic": "Verba transitif <strong>みます (mimasu - melihat/menonton)</strong> ditulis dengan kanji <strong>見ます</strong>. Pasangan objeknya adalah テレビを見ます (menonton TV) atau 映画を見ます (menonton film).",
        "distractor": "• Opsi A: 聞きます dibaca ききます (kikimasu) yang berarti mendengar (misal: ラジオを聞きます).\n• Opsi B: 読みます dibaca よみます (yomimasu) yang berarti membaca (misal: 本を読みます).\n• Opsi C: 買います dibaca かいます (kaimasu) yang berarti membeli.",
        "grammarRule": "Verba Transitif Utama Bab 6: 見ます (menonton), 聞きます (mendengarkan), 読みます (membaca), 書きます (menulis), 買います (membeli), 食べます (makan), 飲みます (minum)."
      }
    },
    {
      "id": 11,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Objek Penderita (Wo)",
      "type": "teks",
      "question_ja": "わたしは 毎朝 パン（　<strong>？</strong>　） 食べます。",
      "question_ruby": "わたしは 毎朝 パン（　<strong>？</strong>　） 食べます。",
      "question_id": "Partikel yang tepat untuk menandai objek makanan 'pan' pada kalimat di atas adalah...",
      "translation": "Saya setiap pagi makan roti. Partikel penanda objek penderita adalah を.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "に"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "で"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "を"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "へ"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (を).",
        "logic": "Partikel <strong>を (wo/o)</strong> berfungsi menandai <strong>objek langsung (penderita)</strong> dari suatu kata kerja transitif (他動詞). Pola: <code>[Nomina Objek] を [Verba Transitif]</code>. Contoh: パンを食べます (makan roti).",
        "distractor": "• Opsi A: に digunakan untuk penunjuk titik waktu, target sasaran, atau tempat keberadaan.\n• Opsi B: で digunakan untuk tempat berlangsungnya kegiatan atau alat/sarana.\n• Opsi D: へ digunakan untuk arah pergerakan tempat tujuan.",
        "grammarRule": "Kaidah Partikel を Bab 6: [Objek Langsung] + を + [Verba Transitif] (食べます, 飲みます, 買います, 見ます, 読みます)."
      }
    },
    {
      "id": 12,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Tempat Aktivitas (De)",
      "type": "teks",
      "question_ja": "ダダンさんは 毎日 工場（　<strong>？</strong>　） 実習します。",
      "question_ruby": "ダダンさんは 毎日 工場（　<strong>？</strong>　） 実習します。",
      "question_id": "Partikel yang tepat untuk menandai lokasi pabrik sebagai tempat pelaksanaan magang adalah...",
      "translation": "Dadan-san setiap hari magang / praktik kerja di pabrik. Partikel tempat beraktivitas adalah で.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "で"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "に"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "へ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "を"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (で).",
        "logic": "Partikel <strong>で (de)</strong> digunakan untuk menandai <strong>tempat berlangsungnya suatu aktivitas aktif atau kegiatan dinamis</strong> (動作の場所). Pola: <code>[Tempat Aktivitas] で [Aktivitas / Verba]</code>. Contoh: こうじょうで実習します (praktik kerja di pabrik).",
        "distractor": "• Opsi B: に menandai tempat keberadaan statis (います/あります) atau titik tujuan.\n• Opsi C: へ menandai arah perpindahan (行きます, 来ます, 帰ります).\n• Opsi D: を menandai objek penderita langsung, bukan tempat berlangsungnya kegiatan.",
        "grammarRule": "Kaidah Partikel Tempat Bab 6: [Tempat Kegiatan Aktif] + で + [Verba Aksi] (実習します, 勉強します, 食べます, 買います)."
      }
    },
    {
      "id": 13,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Kalimat Tanya Objek (Nani wo)",
      "type": "teks",
      "question_ja": "田中さん：『アグスさんは 今朝 何（　<strong>？</strong>　） 食べましたか。』<br>アグスさん：『パンと たまごを 食べました。』",
      "question_ruby": "田中さん：『アグスさんは 今朝 何（　<strong>？</strong>　） 食べましたか。』<br>アグスさん：『パンと たまごを 食べました。』",
      "question_id": "Partikel yang tepat untuk melengkapi kalimat tanya di atas adalah...",
      "translation": "Tanaka-san: 'Agus-san, tadi pagi makan apa?' Agus-san: 'Makan roti dan telur.'",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "が"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "を"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "で"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "も"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (を).",
        "logic": "Kata tanya <strong>何（なに - nani）</strong> yang menanyakan objek kegiatan langsung dari kata kerja transitif (食べました) wajib dipasangkan dengan partikel <strong>を</strong> menjadi <strong>何を（なにを - nani wo）</strong>.",
        "distractor": "• Opsi A: が digunakan untuk subjek atau penanda sifat/keberadaan pada bab-bab berikutnya.\n• Opsi C: で jika dipasangkan dengan 何 menjadi 何で (nande / nani de) yang menanyakan alat atau alasan.\n• Opsi D: も jika dipasangkan dengan 何 menjadi 何も (nanimo) yang membutuhkan predikat bentuk negatif (penolakan total).",
        "grammarRule": "Pola Pertanyaan Objek Bab 6: 何（なに）を + Verba-ますか (何をしますか, 何を食べますか, 何を買いましたか)."
      }
    },
    {
      "id": 14,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Tempat Belajar (De)",
      "type": "teks",
      "question_ja": "アグスさんは 毎晩 部屋（　<strong>？</strong>　） 日本語を 勉強します。",
      "question_ruby": "アグスさんは 毎晩 部屋（　<strong>？</strong>　） 日本語を 勉強します。",
      "question_id": "Partikel yang tepat untuk mengisi tanda kurung di atas adalah...",
      "translation": "Agus-san setiap malam belajar bahasa Jepang di kamar. Partikel tempat aktivitas adalah で.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "へ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "に"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "から"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "で"
        }
      ],
      "correctAnswer": "D",
      "explanation": {
        "summary": "Jawaban yang benar adalah D (で).",
        "logic": "Kamar (部屋 - へや) merupakan tempat berlangsungnya kegiatan aktif belajar (勉強します - benkyou shimasu), sehingga partikel yang digunakan adalah <strong>で (de)</strong>.",
        "distractor": "• Opsi A: へ menyatakan arah tujuan perpindahan gerak.\n• Opsi B: に menyatakan titik waktu atau tempat diam/tinggal.\n• Opsi C: から menyatakan titik awal/asal mula.",
        "grammarRule": "Perbedaan Tempat: 部屋へ行きます (Pergi ke kamar = へ tujuan), 部屋で勉強します (Belajar di kamar = で tempat aktivitas)."
      }
    },
    {
      "id": 15,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Mitra / Bersama Teman (To)",
      "type": "teks",
      "question_ja": "毎週 水曜日に、友だち（　<strong>？</strong>　） バドミントンを します。",
      "question_ruby": "毎週 水曜日に、友だち（　<strong>？</strong>　） バドミントンを します。",
      "question_id": "Partikel yang menyatakan makna 'bersama / dengan kawan' adalah...",
      "translation": "Setiap hari Rabu, saya bermain badminton bersama teman. Partikel penyerta mitra adalah と.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "と"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "を"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "に"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "で"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (と).",
        "logic": "Partikel <strong>と (to)</strong> bila diletakkan setelah nomina orang berfungsi menunjukkan <strong>mitra / kawan saat melakukan suatu tindakan bersama-sama</strong> (bersama/dengan). Pola: <code>[Orang] と (いっしょに) [Aktivitas]</code>.",
        "distractor": "• Opsi B: を menandai objek permainan (misal: バドミントンを).\n• Opsi C: に menandai titik waktu (水曜日に) atau target sasaran.\n• Opsi D: で dapat berarti sarana alat, tetapi bukan penanda orang pendamping.",
        "grammarRule": "Partikel と Bab 6: 1) Penggabungan nomina (パンとたまご = roti dan telur), 2) Pendamping aktivitas (友だちとします = melakukan bersama teman)."
      }
    },
    {
      "id": 16,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Kombinasi Partikel Objek dan Tempat",
      "type": "teks",
      "question_ja": "スズキさんは 図書館（　①　） 本（　②　） 読みました。",
      "question_ruby": "スズキさんは 図書館（　①　） 本（　②　） 読みました。",
      "question_id": "Pasangan partikel ① dan ② yang tepat secara berturut-turut adalah...",
      "translation": "Suzuki-san membaca buku di perpustakaan. Pasangan partikel yang tepat adalah で dan を.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "に ／ を"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "で ／ を"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "へ ／ で"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "を ／ に"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (で ／ を).",
        "logic": "Posisi ① adalah tempat kegiatan membaca berlangsung (図書館), sehingga memakai partikel <strong>で</strong>. Posisi ② adalah objek penderita yang dibaca (本), sehingga memakai partikel <strong>を</strong>. Jadi paduannya adalah <strong>で ／ を</strong>.",
        "distractor": "• Opsi A: 図書館に salah karena membaca (読みました) adalah aktivitas dinamis, bukan sekadar keberadaan statis.\n• Opsi C: へ dan で salah posisi dan salah konteks verba.\n• Opsi D: を di depan dan に di belakang salah penempatan kaidah partikel.",
        "grammarRule": "Struktur Standar Kalimat Transitif Bab 6: [Subjek は] [Tempat で] [Objek を] [Verba Transitif]."
      }
    },
    {
      "id": 17,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Penolakan Total Objek (Nanimo ... Masen)",
      "type": "teks",
      "question_ja": "アグスさんは デパートへ 行きました。でも、（　<strong>何＿＿＿</strong>　） 買いませんでした。",
      "question_ruby": "アグスさんは デパートへ 行きました。でも、（　<strong>何＿＿＿</strong>　） 買いませんでした。",
      "question_id": "Partikel yang tepat untuk menyatakan makna penyangkalan menyeluruh 'sama sekali tidak membeli apa pun' adalah...",
      "translation": "Agus-san pergi ke toserba. Namun, tidak membeli apa pun. Partikel penyangkalan total adalah も.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "を"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "が"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "で"
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
        "logic": "Pola penyangkalan mutlak terhadap objek dibentuk dari kata tanya <strong>何 (なに/なん) + Partikel も + Bentuk Negatif (～ません / ～ませんでした)</strong>, yang bermakna <strong>'tidak ... apa pun sama sekali'</strong>. Partikel を dihilangkan dan digantikan sepenuhnya oleh <strong>も</strong>.",
        "distractor": "• Opsi A: 何を買いませんでした adalah kesalahan umum pembelajar asing; dalam tata bahasa Jepang standar, pola penolakan total memakai 何も.\n• Opsi B: 何が salah secara tata bahasa pada kalimat negatif transitif ini.\n• Opsi C: 何で berarti 'mengapa' atau 'menggunakan apa'.",
        "grammarRule": "Penolakan Total Bab 6: 何も + Negatif (何も食べません = tidak makan apa pun; 何も買いませんでした = tidak membeli apa pun)."
      }
    },
    {
      "id": 18,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Bentuk Ajakan Sopan (Masenka)",
      "type": "teks",
      "question_ja": "『いっしょに コーヒーを （　<strong>飲みませんか</strong>　）。』この 表現の 意味は どれですか。",
      "question_ruby": "『いっしょに コーヒーを （　<strong>飲みませんか</strong>　）。』この 表現の 意味は どれですか。",
      "question_id": "Ungkapan '～ませんか' pada kalimat di atas berfungsi untuk...",
      "translation": "'Maukah minum kopi bersama-sama?' Ungkapan ～ませんか berfungsi mengajak secara sopan.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Melarang lawan bicara meminum kopi"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Menanyakan apakah lawan bicara sudah selesai minum"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Memastikan bahwa lawan bicara tidak suka minum kopi"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Mengajak lawan bicara melakukan sesuatu secara sopan"
        }
      ],
      "correctAnswer": "D",
      "explanation": {
        "summary": "Jawaban yang benar adalah D (Mengajak lawan bicara melakukan sesuatu secara sopan).",
        "logic": "Bentuk verba negatif tanya <strong>～ませんか (-masen ka)</strong> digunakan untuk <strong>mengajak atau menawarkan suatu aktivitas kepada lawan bicara dengan sangat sopan</strong>, memberikan kebebasan kepada lawan bicara untuk menerima atau menolak tanpa merasa tertekan.",
        "distractor": "• Opsi A: Larangan menggunakan bentuk ～てはいけません.\n• Opsi B: Menanyakan penyelesaian memakai pola もう～ましたか.\n• Opsi C: Memastikan kesukaan memakai predikat すきですか.",
        "grammarRule": "Bentuk Ajakan Bab 6: [Verba bentuk -masen] + か = Maukah Anda ... bersama saya? (いっしょに行きませんか = Maukah pergi bersama?)."
      }
    },
    {
      "id": 19,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Bentuk Persetujuan Ajakan (Mashou)",
      "type": "teks",
      "question_ja": "A：『明日 いっしょに サッカーを しませんか。』<br>B：『ええ、（　<strong>＿＿＿＿＿</strong>　）。』",
      "question_ruby": "A：『明日 いっしょに サッカーを しませんか。』<br>B：『ええ、（　<strong>＿＿＿＿＿</strong>　）。』",
      "question_id": "Ungkapan yang paling tepat diucapkan pembicara B untuk menerima dan menyetujui ajakan tersebut adalah...",
      "translation": "A: 'Maukah besok bermain sepak bola bersama?' B: 'Ya, mari kita lakukan (ayo bermain).' Jawaban persetujuan: しましょう.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "しません"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "しましょう"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "しませんでした"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "しました"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (しましょう).",
        "logic": "Untuk merespons positif ajakan <strong>～ませんか</strong>, digunakan bentuk kesepakatan aktif <strong>～ましょう (-mashou)</strong> yang berarti <strong>'mari / ayo kita lakukan bersama'</strong>. Pola: 『はい / ええ、～ましょう』.",
        "distractor": "• Opsi A: しません berarti 'tidak akan melakukan' (penolakan tegas yang kurang sopan).\n• Opsi C: しませんでした adalah bentuk lampau negatif ('tidak melakukannya kemarin').\n• Opsi D: しました adalah bentuk lampau positif ('sudah melakukannya').",
        "grammarRule": "Pasangan Dialog Ajakan Bab 6: Tanya: ～ませんか (Maukah...?) -> Jawab Setuju: ええ／はい、～ましょう (Ayo/Mari kita...!)."
      }
    },
    {
      "id": 20,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Distingsi Partikel Tempat Arah (He) vs Tempat Aktivitas (De)",
      "type": "teks",
      "question_ja": "日曜日に デパート（　①　） 行きました。そして、デパート（　②　） シャツを 買いました。",
      "question_ruby": "日曜日に デパート（　①　） 行きました。そして、デパート（　②　） シャツを 買いました。",
      "question_id": "Partikel yang tepat untuk mengisi posisi ① dan ② berturut-turut adalah...",
      "translation": "Pada hari Minggu saya pergi ke toserba. Lalu membeli kemeja di toserba. Partikel: へ lalu で.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "で ／ へ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "に ／ を"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "へ ／ で"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "を ／ で"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (へ ／ で).",
        "logic": "Pada klausa pertama, toserba (デパート) adalah arah/tujuan pergerakan dengan verba perpindahan (行きました), sehingga menggunakan partikel <strong>へ</strong>. Pada klausa kedua, toserba adalah tempat pelaksanaan aksi pembelian (シャツを買いました), sehingga menggunakan partikel <strong>で</strong>. Jadi urutan yang benar adalah <strong>へ ／ で</strong>.",
        "distractor": "• Opsi A: で ／ へ adalah urutan terbalik yang keliru.\n• Opsi B: に ／ を tidak sesuai kaidah fungsi kedua klausa tersebut.\n• Opsi D: を di posisi ① salah karena toserba bukan objek transitif melainkan tempat tujuan pergerakan.",
        "grammarRule": "Perbedaan Pokok Partikel Lokasi: [Tujuan Gerak] + へ + 行きます/来ます/帰ります vs [Tempat Aksi Aktif] + で + Verba Transitif."
      }
    },
    {
      "id": 21,
      "session": "reading",
      "section_ja": "第3部：読解・図解評価",
      "section_id": "Sesi 1: Reading — Zukai (Evaluasi Bergambar)",
      "category": "Soal Bergambar — Makanan Pokok (パン)",
      "type": "gambar",
      "question_ja": "絵（え）を 見て ください。朝 何を 食べますか。<br>「毎朝 （　　　）を 食べます。」",
      "question_ruby": "絵（え）を 見て ください。朝 何を 食べますか。<br>「毎朝 （　　　）を 食べます。」",
      "question_id": "Perhatikan gambar. Makan apakah di pagi hari? 'Makan (...) setiap pagi'.",
      "translation": "Setiap pagi makan roti (pan).",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "ごはん"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "パン"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "にく"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "たまご"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (パン).",
        "logic": "Gambar menunjukkan roti tawar (パン - pan) sebagai menu sarapan pagi praktis di asrama.",
        "distractor": "• Opsi A: ごはん adalah nasi putih.\n• Opsi C: にく adalah daging.\n• Opsi D: たまご adalah telur ayam.",
        "grammarRule": "Kosakata Makanan Bab 6: パン（roti tawar）."
      },
      "image": "assets/bab_06/reading_q21.jpeg"
    },
    {
      "id": 22,
      "session": "reading",
      "section_ja": "第3部：読解・図解評価",
      "section_id": "Sesi 1: Reading — Zukai (Evaluasi Bergambar)",
      "category": "Soal Bergambar — Minuman Sehari-hari (水)",
      "type": "gambar",
      "question_ja": "絵（え）を 見て ください。何を 飲みますか。<br>「つめたい （　　　）を 飲みます。」",
      "question_ruby": "絵（え）を 見て ください。何を 飲みますか。<br>「つめたい （　　　）を 飲みます。」",
      "question_id": "Perhatikan gambar. Minum apakah? 'Minum (...) dingin'.",
      "translation": "Minum air putih dingin.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "おちゃ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "ジュース"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "水（みず）"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "コーヒー"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (水（みず）).",
        "logic": "Gambar menunjukkan gelas air mineral putih segar (水 / みず - mizu).",
        "distractor": "• Opsi A: おちゃ adalah teh hijau Jepang.\n• Opsi B: ジュース adalah sari buah / jus.\n• Opsi D: コーヒー adalah kopi.",
        "grammarRule": "Kosakata Minuman Bab 6: 水（みず = air minum putih）."
      },
      "image": "assets/bab_06/reading_q22.jpeg"
    },
    {
      "id": 23,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Cara Baca Kanji (食べます)",
      "type": "teks",
      "question_ja": "食堂で 昼ごはんを （ 食べます ）。<br>（　）の 漢字の 正しい 読み方は どれですか。",
      "question_ruby": "食堂で 昼ごはんを （ 食べます ）。<br>（　）の 漢字の 正しい 読み方は どれですか。",
      "question_id": "Makan siang di kantin. Pilihlah cara baca kanji '食べます' yang tepat.",
      "translation": "Makan siang di ruang makan/kantin.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "たべます"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "のみます"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "かいます"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "みます"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (たべます).",
        "logic": "Kanji 食べます dibaca たべます (tabemasu) yang bermakna makan.",
        "distractor": "• Opsi B: のみます ditulis 飲みます (minum).\n• Opsi C: かいます ditulis 買います (membeli).\n• Opsi D: みます ditulis 見ます (melihat).",
        "grammarRule": "Verba Aksi Bab 6: 食べます（たべます = makan）."
      }
    },
    {
      "id": 24,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Penulisan Kanji (飲みます)",
      "type": "teks",
      "question_ja": "休憩時間に お茶を （ のみます ）。<br>（　）の 言葉の 正しい 漢字は どれですか。",
      "question_ruby": "休憩時間に お茶を （ のみます ）。<br>（　）の 言葉の 正しい 漢字は どれですか。",
      "question_id": "Minum teh pada waktu istirahat. Pilihlah penulisan kanji yang tepat untuk 'nomimasu'.",
      "translation": "Minum teh hijau pada jam istirahat.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "飯みます"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "飲みます"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "飼みます"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "飽みます"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (飲みます).",
        "logic": "Kata のみます ditulis dengan kanji baku 飲みます (radikal makanan 飠 di sisi kiri dan 欠 di sisi kanan).",
        "distractor": "• Opsi A: 飯みます adalah penulisan salah.\n• Opsi C: 飼みます dibaca かみます (memelihara).\n• Opsi D: 飽みます dibaca あきます (bosan).",
        "grammarRule": "Verba Aksi Bab 6: 飲みます（のみます = minum）."
      }
    },
    {
      "id": 25,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Pemakaian Kanji dalam Konteks (魚)",
      "type": "teks",
      "question_ja": "スーパーで （ さかな ）と 野菜を 買いました。<br>正しい 漢字は どれですか。",
      "question_ruby": "スーパーで （ さかな ）と 野菜を 買いました。<br>正しい 漢字は どれですか。",
      "question_id": "Membeli ikan dan sayur di supermarket. Pilihlah kanji yang tepat untuk 'sakana'.",
      "translation": "Membeli ikan dan sayuran di supermarket.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "魚"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "漁"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "鮮"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "角"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (魚).",
        "logic": "Kata さかな (ikan) ditulis dengan kanji 魚.",
        "distractor": "• Opsi B: 漁 digunakan pada kata 漁業 (perikanan/penangkapan ikan).\n• Opsi C: 鮮 digunakan pada kata 新鮮 (segar).\n• Opsi D: 角 dibaca かど (sudut) atau つの (tanduk).",
        "grammarRule": "Bahan Makanan Bab 6: 魚（さかな = ikan）."
      }
    }
  ]
};

const BAB_07_DATA = {
  "chapter": "07",
  "title_ja": "第７課：道具・手段（で）と授受動詞（あげます・もらいます・くれます）",
  "title_id": "Bab 07: Sarana/Alat Kerja, Bahasa, Verba Memberi & Menerima (De, Ni, Kara, Mou, Mada)",
  "theme_ja": "工具・言語・授受表現 (Kougu / Gengo / Juju Hyougen)",
  "theme_id": "Evaluasi penguasaan kosakata perkakas bengkel/pabrik, alat makan, komunikasi, surat-menyurat, serta partikel alat/bahasa (で), sasaran/sumber (に/から), verba pemberian (あげます, もらいます, くれます), dan penanda penyelesaian (もう / まだ) pada Bab 7 buku IMM Japan.",
  "audioSrc": null,
  "pdfReadingSoalUrl": "assets/pdf/Salinan Soal Bab 07.pdf",
  "pdfReadingKunciUrl": "assets/pdf/Kunci dan Pembahasan Bab 07.pdf",
  "pdfSoalUrl": null,
  "pdfKunciUrl": null,
  "passingGrade": 80,
  "totalQuestions": 25,
  "readingCount": 25,
  "choukaiCount": 0,
  "questions": [
    {
      "id": 1,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Peralatan Makan Tradisional",
      "type": "teks",
      "question_ja": "日本人は （　<strong>はし</strong>　）で ごはんを 食べます。「はし」の 意味は どれですか。",
      "question_ruby": "日本人は （　<strong>はし</strong>　）で ごはんを 食べます。「はし」の 意味は どれですか。",
      "question_id": "Kosakata alat makan yang dicetak tebal bermakna...",
      "translation": "Orang Jepang makan nasi dengan sumpit. 'Hashi' bermakna sumpit.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Sendok"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Sumpit"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Garpu"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Pisau makan"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (Sumpit).",
        "logic": "Kosakata <strong>はし (hashi / 箸)</strong> adalah <strong>sumpit</strong>, alat makan utama masyarakat Jepang. Penguasaan etika penggunaan sumpit adalah bagian penting orientasi budaya magang IMM Japan.",
        "distractor": "• Opsi A: Sendok adalah スプーン (supuun).\n• Opsi C: Garpu adalah フォーク (fooku).\n• Opsi D: Pisau makan adalah ナイフ (naifu).",
        "grammarRule": "Peralatan Makan Bab 7: はし (sumpit), スプーン (sendok), フォーク (garpu), ナイフ (pisau), 手（て - tangan）."
      }
    },
    {
      "id": 2,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Perkakas Kerja Pabrik",
      "type": "teks",
      "question_ja": "ダダンさんは （　<strong>スパナ</strong>　）と ペンチで きかいを しゅうりします。「スパナ」の 意味は どれですか。",
      "question_ruby": "ダダンさんは （　<strong>スパナ</strong>　）と ペンチで きかいを しゅうりします。「スパナ」の 意味は どれですか。",
      "question_id": "Istilah perkakas pabrik yang dicetak tebal bermakna...",
      "translation": "Dadan-san memperbaiki mesin dengan kunci pas dan tang. 'Supana' adalah kunci pas.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Kunci pas (spanner)"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Obeng kembang/minus"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Gunting plat seng"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Tang pemotong"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (Kunci pas (spanner)).",
        "logic": "Kata <strong>スパナ (supana - spanner)</strong> adalah <strong>kunci pas</strong>, perkakas penting dalam praktik kerja manufaktur dan permesinan di pabrik tempat peserta magang bertugas.",
        "distractor": "• Opsi B: Obeng adalah ドライバー (doraibaa / screwdriver).\n• Opsi C: Gunting adalah はさみ (hasami).\n• Opsi D: Tang adalah ペンチ (penchi / pliers).",
        "grammarRule": "Perkakas Bengkel Kerja Bab 7: スパナ (kunci pas), ペンチ (tang), ドライバー (obeng), はさみ (gunting), ハンマー (palu)."
      }
    },
    {
      "id": 3,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Cara Baca Kanji",
      "type": "teks",
      "question_ja": "アグスさんは 日本語で 大山先生に （　<strong>手紙</strong>　）を 書きました。「手紙」の 読み方は どれですか。",
      "question_ruby": "アグスさんは 日本語で 大山先生に （　<strong>手紙</strong>　）を 書きました。「手紙」の 読み方は どれですか。",
      "question_id": "Cara baca kanji yang benar untuk 'tegami' (surat) adalah...",
      "translation": "Agus-san menulis surat dalam bahasa Jepang kepada Oyama-sensei. Kanji 手紙 dibaca tegami.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "きっぷ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "きって"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "てがみ"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "でんわ"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (てがみ).",
        "logic": "Kanji <strong>手紙</strong> memiliki cara baca <strong>てがみ (tegami)</strong> yang berarti <strong>surat</strong>. Tersusun dari kanji 手 (tangan) dan 紙 (kertas).",
        "distractor": "• Opsi A: きっぷ adalah cara baca 切符 (tiket karcis).\n• Opsi B: きって adalah cara baca 切手 (perangko pos).\n• Opsi D: でんわ adalah cara baca 電話 (telepon).",
        "grammarRule": "Pos & Komunikasi Bab 7: 手紙（てがみ - surat）, 切手（きって - perangko）, 荷物（にもつ - paket barang）, 電話（でんわ - telepon）."
      }
    },
    {
      "id": 4,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Finansial Magang",
      "type": "teks",
      "question_ja": "アグスさん：『きのう 会社から （　<strong>きゅうりょう</strong>　）を もらいました。』「きゅうりょう」の 意味は どれですか。",
      "question_ruby": "アグスさん：『きのう 会社から （　<strong>きゅうりょう</strong>　）を もらいました。』「きゅうりょう」の 意味は どれですか。",
      "question_id": "Kosakata finansial yang dicetak tebal memiliki makna...",
      "translation": "Agus-san: 'Kemarin menerima gaji dari perusahaan.' 'Kyuuryou' bermakna upah / gaji bulanan.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Kamar asrama"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Pinjaman modal"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Tiket pesawat"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Upah / gaji bulanan"
        }
      ],
      "correctAnswer": "D",
      "explanation": {
        "summary": "Jawaban yang benar adalah D (Upah / gaji bulanan).",
        "logic": "Kosakata <strong>給料（きゅうりょう - kyuuryou）</strong> berarti <strong>gaji atau upah bulanan</strong> yang diterima peserta magang atas kinerja praktik kerjanya di perusahaan penerima (受け入れ企業).",
        "distractor": "• Opsi A: Kamar asrama adalah 寮の部屋 (りょうのへや).\n• Opsi B: Pinjaman uang adalah 借金 (しゃっきん) atau 借りたお金.\n• Opsi C: Tiket pesawat adalah 飛行機の切符 (ひこうきのきっぷ).",
        "grammarRule": "Istilah Kerja Bab 7: 給料（きゅうりょう - gaji/upah）, プレゼント (hadiah/kado), お金（おかね - uang）."
      }
    },
    {
      "id": 5,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Hari Ulang Tahun",
      "type": "teks",
      "question_ja": "今日は 大山先生の （　<strong>たん生日</strong>　）です。「たん生日」の 意味は どれですか。",
      "question_ruby": "今日は 大山先生の （　<strong>たん生日</strong>　）です。「たん生日」の 意味は どれですか。",
      "question_id": "Kosakata perayaan yang dicetak tebal bermakna...",
      "translation": "Hari ini adalah hari ulang tahun Oyama-sensei. 'Tanjoubi' bermakna hari ulang tahun.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Hari pernikahan"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Hari ulang tahun"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Hari kepulangan"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Hari kelulusan"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (Hari ulang tahun).",
        "logic": "Kata <strong>誕生日（たんじょうび - tanjoubi）</strong> berarti <strong>hari ulang tahun</strong>. Ungkapan ucapan selamatnya adalah お誕生日おめでとうございます (otanjoubi omedetou gozaimasu).",
        "distractor": "• Opsi A: Hari pernikahan adalah 結婚記念日 (けっこんきねんび).\n• Opsi C: Hari kepulangan adalah 帰国の日 (きこくのひ).\n• Opsi D: Hari kelulusan adalah 卒業式の日 (そつぎょうしきのひ).",
        "grammarRule": "Ungkapan Selamat Bab 7: お誕生日おめでとうございます (Selamat ulang tahun)."
      }
    },
    {
      "id": 6,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Cara Baca Kanji",
      "type": "teks",
      "question_ja": "アグスさんは 毎晩 インドネシアの （　<strong>家族</strong>　）に 電話を かけます。「家族」の 読み方は どれですか。",
      "question_ruby": "アグスさんは 毎晩 インドネシアの （　<strong>家族</strong>　）に 電話を かけます。「家族」の 読み方は どれですか。",
      "question_id": "Cara baca kanji yang benar untuk 'kazoku' (keluarga) adalah...",
      "translation": "Agus-san setiap malam menelepon keluarganya di Indonesia. Kanji 家族 dibaca kazoku.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "かぞく"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "ともだち"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "りょうしん"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "きょうだい"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (かぞく).",
        "logic": "Kanji <strong>家族</strong> dibaca <strong>かぞく (kazoku)</strong> yang bermakna <strong>keluarga</strong>. Terdiri dari kanji 家 (rumah/keluarga) dan 族 (suku/klan).",
        "distractor": "• Opsi B: ともだち adalah kanji 友達 (teman).\n• Opsi C: りょうしん adalah kanji 両親 (kedua orang tua).\n• Opsi D: きょうだい adalah kanji 兄弟 (saudara kandung).",
        "grammarRule": "Kanji Keluarga Bab 7: 家族（かぞく - keluarga）, 父（ちち - ayah）, 母（はは - ibu）, 兄（あに - kakak lk）, 弟（おとうと - adik lk）."
      }
    },
    {
      "id": 7,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kata Kerja Pemotongan",
      "type": "teks",
      "question_ja": "はさみで 紙を （　<strong>きります</strong>　）。「きります」の 漢字は どれですか。",
      "question_ruby": "はさみで 紙を （　<strong>きります</strong>　）。「きります」の 漢字は どれですか。",
      "question_id": "Penulisan kanji yang benar untuk kata kerja 'kirimasu' (memotong) adalah...",
      "translation": "Memotong kertas dengan gunting. Kanji kirimasu adalah 切ります.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "借ります"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "書きます"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "切ります"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "貸します"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (切ります).",
        "logic": "Kata kerja <strong>きります (kirimasu - memotong/menggunting)</strong> ditulis dengan kanji <strong>切ります</strong>.",
        "distractor": "• Opsi A: 借ります dibaca かります (karimasu) yang berarti meminjam.\n• Opsi B: 書きます dibaca かきます (kakimasu) yang berarti menulis.\n• Opsi D: 貸します dibaca かします (kashimasu) yang berarti meminjamkan.",
        "grammarRule": "Kata Kerja Aktivitas Bab 7: 切ります（きります - memotong）, 修理します（しゅうりします - memperbaiki）, かけます（電話をかけます - menelepon）."
      }
    },
    {
      "id": 8,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kosakata Tugas & Tulisan Resmi",
      "type": "teks",
      "question_ja": "スズキさんは 日本語で （　<strong>レポート</strong>　）を 書きます。「レポート」の 意味は どれですか。",
      "question_ruby": "スズキさんは 日本語で （　<strong>レポート</strong>　）を 書きます。「レポート」の 意味は どれですか。",
      "question_id": "Kosakata serapan 'repooto' memiliki makna...",
      "translation": "Suzuki-san menulis laporan dalam bahasa Jepang. 'Repooto' bermakna laporan kerja.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Buku catatan harian"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Daftar hadir kerja"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Kamus istilah mesin"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Laporan kerja / tulisan laporan"
        }
      ],
      "correctAnswer": "D",
      "explanation": {
        "summary": "Jawaban yang benar adalah D (Laporan kerja / tulisan laporan).",
        "logic": "Kata serapan katakana <strong>レポート (repooto - report)</strong> berarti <strong>laporan tertulis</strong> atau makalah kerja yang biasa dibuat karyawan maupun peserta magang. Kalimat teks Bab 7: <code>すずきさんは日本語でレポートを書きます</code> (Suzuki-san menulis laporan dalam bahasa Jepang).",
        "distractor": "• Opsi A: Buku catatan harian adalah 日記 (にっき) atau ノート.\n• Opsi B: Daftar hadir adalah 出勤簿 (しゅっきんぼ).\n• Opsi C: Kamus istilah adalah 用語集 (ようごしゅう) atau 専門辞書.",
        "grammarRule": "Kosakata Dokumen Bab 7: レポート (laporan), 手紙 (surat), 作文 (karangan), ファクス (faksimile)."
      }
    },
    {
      "id": 9,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kata Kerja Transaksi Barang (Kashimasu)",
      "type": "teks",
      "question_ja": "ダダンさんは 友だちに お金を （　<strong>かしました</strong>　）。「かしました」の 意味は どれですか。",
      "question_ruby": "ダダンさんは 友だちに お金を （　<strong>かしました</strong>　）。「かしました」の 意味は どれですか。",
      "question_id": "Kata kerja yang dicetak tebal memiliki arti...",
      "translation": "Dadan-san meminjamkan uang kepada kawan. 'Kashimashita' berarti meminjamkan.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "Meminjamkan (ke orang lain)"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "Meminjam (dari orang lain)"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "Mengembalikan uang"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "Menghabiskan uang"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (Meminjamkan (ke orang lain)).",
        "logic": "Verba <strong>貸します（かします - kashimasu）</strong> bermakna <strong>meminjamkan (memberi pinjaman barang/uang ke pihak luar)</strong>. Kebalikannya adalah <strong>借ります（かります - karimasu = meminjam/menerima pinjaman dari pihak lain）</strong>.",
        "distractor": "• Opsi B: Meminjam dari orang lain adalah 借ります (かります - karimasu).\n• Opsi C: Mengembalikan adalah 返します (かえします - kaeshimasu).\n• Opsi D: Menghabiskan/menggunakan uang adalah 使います (つかいます - tsukaimasu).",
        "grammarRule": "Pasangan Verba Pinjam-Meminjam: 貸します (meminjamkan ke orang lain) vs 借ります (meminjam dari orang lain)."
      }
    },
    {
      "id": 10,
      "session": "reading",
      "section_ja": "第1部：読解・ことば（語彙）",
      "section_id": "Sesi 1: Reading — Kotoba (Kosakata)",
      "category": "Kata Kerja Belajar dari Guru (Naraimasu)",
      "type": "teks",
      "question_ja": "わたしは 大山先生に 日本語を （　<strong>ならいます</strong>　）。「ならいます」の 漢字は どれですか。",
      "question_ruby": "わたしは 大山先生に 日本語を （　<strong>ならいます</strong>　）。「ならいます」の 漢字は どれですか。",
      "question_id": "Penulisan kanji yang benar untuk 'naraimasu' (belajar/menerima ajaran) adalah...",
      "translation": "Saya belajar bahasa Jepang dari Oyama-sensei. Kanji naraimasu adalah 習います.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "教えます"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "習います"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "話します"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "働きます"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (習います).",
        "logic": "Verba <strong>ならいます (naraimasu)</strong> ditulis dengan kanji <strong>習います</strong> yang berarti <strong>belajar atau menerima ajaran keterampilan/bahasa dari seorang pengajar</strong>. Kebalikannya adalah <strong>教えます（おしえます - oshiemasu = mengajar）</strong>.",
        "distractor": "• Opsi A: 教えます dibaca おしえます (oshiemasu) yang berarti mengajar.\n• Opsi C: 話します dibaca はなします (hanashimasu) yang berarti berbicara.\n• Opsi D: 働きます dibaca はたらきます (hatarakimasu) yang berarti bekerja.",
        "grammarRule": "Pasangan Verba Mengajar-Belajar: 教えます (mengajarkan) vs 習います (mempelajari/diajari oleh orang lain)."
      }
    },
    {
      "id": 11,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Sarana Alat Makan (De)",
      "type": "teks",
      "question_ja": "アグスさんは スプーンと フォーク（　<strong>？</strong>　） ごはんを 食べます。",
      "question_ruby": "アグスさんは スプーンと フォーク（　<strong>？</strong>　） ごはんを 食べます。",
      "question_id": "Partikel yang tepat untuk menunjukkan alat makan 'sendok dan garpu' adalah...",
      "translation": "Agus-san makan nasi dengan sendok dan garpu. Partikel sarana alat adalah で.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "を"
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
          "text_ja": "へ"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (で).",
        "logic": "Partikel <strong>で (de)</strong> berfungsi menunjukkan <strong>sarana, alat, atau instrumen</strong> yang digunakan untuk melakukan suatu pekerjaan (手段・道具). Pola: <code>[Alat/Sarana] で [Verba Tindakan]</code>. Contoh: スプーンとフォークで食べます.",
        "distractor": "• Opsi A: を menandai makanan yang dimakan (ごはんを).\n• Opsi B: に menandai waktu, tujuan, atau penerima sasaran.\n• Opsi D: へ menandai arah pergerakan.",
        "grammarRule": "Partikel Alat で Bab 7: はしで (dengan sumpit), ナイフで (dengan pisau), ペンで (dengan pulpen), スパナで (dengan kunci pas)."
      }
    },
    {
      "id": 12,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Bahasa Pengantar (De)",
      "type": "teks",
      "question_ja": "アグスさんは 日本語（　<strong>？</strong>　） 先生に 手紙を 書きました。",
      "question_ruby": "アグスさんは 日本語（　<strong>？</strong>　） 先生に 手紙を 書きました。",
      "question_id": "Partikel yang tepat untuk menandai bahasa pengantar yang digunakan dalam surat adalah...",
      "translation": "Agus-san menulis surat kepada guru dalam bahasa Jepang. Partikel media bahasa adalah で.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "を"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "に"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "と"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "で"
        }
      ],
      "correctAnswer": "D",
      "explanation": {
        "summary": "Jawaban yang benar adalah D (で).",
        "logic": "Bahasa yang digunakan sebagai media komunikasi atau penulisan diperlakukan sebagai <strong>sarana/alat perantara (手段)</strong>, sehingga wajib menggunakan partikel <strong>で (de)</strong>. Contoh: 日本語で書きます (menulis dalam bhs Jepang), 英語で話します (berbicara dalam bhs Inggris).",
        "distractor": "• Opsi A: を menandai objek isi surat (手紙を).\n• Opsi B: に menandai penerima surat (先生に).\n• Opsi C: と berarti 'bersama' atau 'dan'.",
        "grammarRule": "Media Bahasa dengan で: 日本語で (dalam bahasa Jepang), 英語で (dalam bahasa Inggris), インドネシア語で (dalam bahasa Indonesia)."
      }
    },
    {
      "id": 13,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Perkakas Kerja Mekanik (De)",
      "type": "teks",
      "question_ja": "工場長：『何（　<strong>？</strong>　） きかいを しゅうりしますか。』<br>ダダン：『ドライバーで しゅうりします。』",
      "question_ruby": "工場長：『何（　<strong>？</strong>　） きかいを しゅうりしますか。』<br>ダダン：『ドライバーで しゅうりします。』",
      "question_id": "Partikel yang tepat untuk melengkapi pertanyaan mengenai alat kerja tersebut adalah...",
      "translation": "Kepala pabrik: 'Memperbaiki mesin dengan apa?' Dadan: 'Memperbaiki dengan obeng.'",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "で"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "を"
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
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (で).",
        "logic": "Frasa tanya <strong>何で（なんで / なにで - nani de）</strong> bermakna <strong>'menggunakan alat apa / dengan sarana apa'</strong>, yang langsung dijawab dengan perkakas bersangkutan ditambah partikel <strong>で</strong>: ドライバーで修理します.",
        "distractor": "• Opsi B: 何を menanyakan objek apa yang diperbaiki, padahal objeknya (きかい) sudah disebutkan.\n• Opsi C: 何に tidak tepat secara tata bahasa untuk alat.\n• Opsi D: 何が salah konteks.",
        "grammarRule": "Pertanyaan Alat Kerja: 何（なに）で + Verba-ますか = Melakukan dengan alat apa?"
      }
    },
    {
      "id": 14,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Penerima Hadiah (Ni - Agemasu)",
      "type": "teks",
      "question_ja": "アグスさんは 大山先生（　<strong>？</strong>　） プレゼントを あげました。",
      "question_ruby": "アグスさんは 大山先生（　<strong>？</strong>　） プレゼントを あげました。",
      "question_id": "Partikel yang tepat untuk menandai pihak penerima hadiah adalah...",
      "translation": "Agus-san memberikan kado/hadiah kepada Oyama-sensei. Partikel penanda penerima adalah に.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "で"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "に"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "を"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "から"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (に).",
        "logic": "Pada pola kalimat pemberian <strong>あげます (agemasu)</strong>, pihak orang yang menjadi <strong>sasaran penerima barang</strong> wajib ditandai dengan partikel <strong>に (ni)</strong>. Pola: <code>[Pemberi は] [Penerima に] [Benda を] あげます</code>.",
        "distractor": "• Opsi A: で menandai tempat atau alat, bukan orang sasaran penerima.\n• Opsi C: を menandai benda yang dihadiahkan (プレゼントを).\n• Opsi D: から menandai asal/sumber, tidak digunakan bersama verba あげます untuk penerima.",
        "grammarRule": "Kaidah Verba Pemberian あげます: [Penerima] + に + [Benda] + をあげます."
      }
    },
    {
      "id": 15,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Sumber Pemberi (Ni / Kara - Moraimasu)",
      "type": "teks",
      "question_ja": "アグスさんは 会社（　<strong>？</strong>　） 給料を もらいました。",
      "question_ruby": "アグスさんは 会社（　<strong>？</strong>　） 給料を もらいました。",
      "question_id": "Partikel yang tepat untuk menandai perusahaan sebagai sumber pemberi gaji adalah...",
      "translation": "Agus-san menerima gaji dari perusahaan. Partikel penanda asal sumber institusi adalah から.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "へ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "で"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "から"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "を"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (から).",
        "logic": "Pada pola penerimaan <strong>もらいます (moraimasu)</strong>, sumber asal pemberian dapat ditandai dengan partikel <strong>に</strong> atau <strong>から</strong>. Namun, jika sumber pemberinya berupa <strong>organisasi, institusi, sekolah, atau perusahaan (会社)</strong>, partikel <strong>から (kara)</strong> jauh lebih lazim dan alami digunakan.",
        "distractor": "• Opsi A: へ menyatakan arah tempat tujuan perjalanan.\n• Opsi B: で menandai tempat kegiatan, bukan sumber penerimaan.\n• Opsi D: を menandai benda yang diterima (給料を).",
        "grammarRule": "Kaidah Verba Penerimaan もらいます: Bila sumbernya organisasi/perusahaan (会社, 銀行, 学校), gunakan から: [Organisasi] + から + もらいます."
      }
    },
    {
      "id": 16,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Verba Memberi kepada Saya (Kuremasu)",
      "type": "teks",
      "question_ja": "スズキさんは わたし（　①　） くつ（　②　） くれました。",
      "question_ruby": "スズキさんは わたし（　①　） くつ（　②　） くれました。",
      "question_id": "Pasangan partikel ① dan ② yang tepat secara berturut-turut adalah...",
      "translation": "Suzuki-san memberi saya sepatu. Pasangan partikel yang tepat: に dan を.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "で ／ を"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "を ／ に"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "から ／ で"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "に ／ を"
        }
      ],
      "correctAnswer": "D",
      "explanation": {
        "summary": "Jawaban yang benar adalah D (に ／ を).",
        "logic": "Verba <strong>くれます (kuremasu)</strong> bermakna orang lain memberi barang kepada <strong>saya (わたし) atau keluarga saya</strong>. Pihak penerima (わたし) ditandai dengan partikel <strong>に</strong>, dan objek bendanya (くつ) ditandai dengan <strong>を</strong>. Jadi urutannya adalah <strong>に ／ を</strong>.",
        "distractor": "• Opsi A: で menandai alat atau lokasi.\n• Opsi B: を di depan dan に di belakang terbalik penempatannya.\n• Opsi C: から ／ で tidak tepat untuk pola verba kuremasu.",
        "grammarRule": "Pola Verba Kuremasu Bab 7: [Pemberi orang luar は] + わたしに + [Benda を] + くれます."
      }
    },
    {
      "id": 17,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Partikel Target Sasaran Komunikasi (Ni)",
      "type": "teks",
      "question_ja": "ウテンさんは 毎晩 友だち（　<strong>？</strong>　） 電話を かけます。",
      "question_ruby": "ウテンさんは 毎晩 友だち（　<strong>？</strong>　） 電話を かけます。",
      "question_id": "Partikel yang tepat untuk menandai mitra sasaran panggilan telepon adalah...",
      "translation": "Uten-san setiap malam menelepon kawan. Partikel sasaran hubungan telepon adalah に.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "に"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "で"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "を"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "へ"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (に).",
        "logic": "Pada ungkapan panggilan telepon <strong>電話をかけます (denwa wo kakemasu)</strong>, pihak yang dihubungi/ditelepon berfungsi sebagai <strong>target sasaran akhir</strong>, sehingga ditandai dengan partikel <strong>に (ni)</strong>: [Orang/Pihak] に 電話をかけます.",
        "distractor": "• Opsi B: で jika digunakan setelah kata 電話 berarti 'menggunakan sarana telepon' (電話で話します).\n• Opsi C: を menandai objek pembicaraan/panggilan (電話を).\n• Opsi D: へ hanya untuk perpindahan tempat.",
        "grammarRule": "Pola Panggilan Telepon: [Sasaran Orang] + に + 電話をかけます vs 電話 + で + [Aktivitas Bicara]."
      }
    },
    {
      "id": 18,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Penanda Keselesaian Aktivitas (Mou)",
      "type": "teks",
      "question_ja": "先生：『（　<strong>＿＿＿</strong>　） 宿題を しましたか。』<br>学生：『はい、もう しました。』",
      "question_ruby": "先生：『（　<strong>＿＿＿</strong>　） 宿題を しましたか。』<br>学生：『はい、もう しました。』",
      "question_id": "Kata penanda yang tepat untuk menanyakan apakah suatu tindakan 'sudah' dilakukan adalah...",
      "translation": "Guru: 'Apakah sudah mengerjakan PR?' Siswa: 'Ya, sudah mengerjakan.' Penanda sudah adalah もう.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "まだ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "もう"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "いつも"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "よく"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (もう).",
        "logic": "Adverbia <strong>もう (mou)</strong> diletakkan sebelum bentuk lampau verba tanya (～ましたか) untuk menanyakan <strong>'apakah sudah selesai melakukan sesuatu'</strong>. Pola: <code>もう + Verba-ましたか</code>.",
        "distractor": "• Opsi A: まだ berarti 'belum / masih'.\n• Opsi C: いつも berarti 'selalu' (kebiasaan berulang).\n• Opsi D: よく berarti 'sering' atau 'dengan baik'.",
        "grammarRule": "Pola Pertanyaan Penyelesaian Bab 7: もう + Verba-ましたか (Apakah sudah...?)."
      }
    },
    {
      "id": 19,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Jawaban Penyangkalan Belum Selesai (Mada)",
      "type": "teks",
      "question_ja": "A：『もう 昼ごはんを 食べましたか。』<br>B：『いいえ、（　<strong>＿＿＿＿＿</strong>　）。これから 食べます。』",
      "question_ruby": "A：『もう 昼ごはんを 食べましたか。』<br>B：『いいえ、（　<strong>＿＿＿＿＿</strong>　）。これから 食べます。』",
      "question_id": "Jawaban standar yang tepat dan sopan untuk menyatakan 'belum' adalah...",
      "translation": "A: 'Apakah sudah makan siang?' B: 'Belum, setelah ini baru mau makan.' Jawaban belum: まだです.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "食べました"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "もう食べません"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "まだです"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "食べたいです"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (まだです).",
        "logic": "Jika ditanya menggunakan <code>もう～ましたか</code> dan tindakan tersebut <strong>belum dilakukan</strong>, jawaban baku dalam bahasa Jepang adalah <strong>『いいえ、まだです』 (Iie, mada desu = Tidak/Belum)</strong>. Penggunaan 『食べませんでした』 salah karena berarti tidak makan sama sekali (bukan belum).",
        "distractor": "• Opsi A: 食べました berarti sudah makan (bertolak belakang dengan 'iie').\n• Opsi B: もう食べません berarti 'tidak akan makan lagi'.\n• Opsi D: 食べたいです berarti 'ingin makan'.",
        "grammarRule": "Kaidah Respons 'Mou': Jawab Ya: はい、もう～ました / Jawab Belum: いいえ、まだです."
      }
    },
    {
      "id": 20,
      "session": "reading",
      "section_ja": "第2部：読解・助詞",
      "section_id": "Sesi 1: Reading — Joshi (Partikel)",
      "category": "Distingsi Partikel Sarana Alat (De) vs Sasaran Penerima (Ni)",
      "type": "teks",
      "question_ja": "アグスさんは ペン（　①　） 友だち（　②　） 手紙を 書きました。",
      "question_ruby": "アグスさんは ペン（　①　） 友だち（　②　） 手紙を 書きました。",
      "question_id": "Pasangan partikel ① dan ② yang tepat secara berturut-turut adalah...",
      "translation": "Agus-san menulis surat kepada temannya dengan pulpen. Urutan partikel: で lalu に.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "に ／ で"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "を ／ に"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "で ／ を"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "で ／ に"
        }
      ],
      "correctAnswer": "D",
      "explanation": {
        "summary": "Jawaban yang benar adalah D (で ／ に).",
        "logic": "Pada posisi ①, pulpen (ペン) adalah sarana/alat tulis yang digunakan, sehingga membutuhkan partikel <strong>で</strong>. Pada posisi ②, teman (友だち) adalah pihak sasaran penerima surat, sehingga membutuhkan partikel <strong>に</strong>. Oleh sebab itu, urutan yang benar adalah <strong>で ／ に</strong>.",
        "distractor": "• Opsi A: に ／ で adalah urutan terbalik yang keliru.\n• Opsi B: を ／ に salah karena pulpen bukan objek langsung.\n• Opsi C: で ／ を salah karena kawan bukan objek yang ditulis.",
        "grammarRule": "Kaidah Sintaksis Bab 7: [Alat] で + [Sasaran] に + [Benda Objek] を + Verba Aksi."
      }
    },
    {
      "id": 21,
      "session": "reading",
      "section_ja": "第3部：読解・図解評価",
      "section_id": "Sesi 1: Reading — Zukai (Evaluasi Bergambar)",
      "category": "Soal Bergambar — Peralatan Kerja (はさみ)",
      "type": "gambar",
      "question_ja": "絵（え）を 見て ください。何で 紙を 切りますか。<br>「（　　　）で 切ります。」",
      "question_ruby": "絵（え）を 見て ください。何で 紙を 切りますか。<br>「（　　　）で 切ります。」",
      "question_id": "Perhatikan gambar. Memotong kertas menggunakan apa? 'Memotong menggunakan (...)'.",
      "translation": "Memotong kertas menggunakan gunting (hasami).",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "ナイフ"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "はさみ"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "カッター"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "ものさし"
        }
      ],
      "correctAnswer": "B",
      "explanation": {
        "summary": "Jawaban yang benar adalah B (はさみ).",
        "logic": "Gambar menunjukkan gunting pemotong kertas (はさみ - hasami).",
        "distractor": "• Opsi A: ナイフ adalah pisau lipat / meja.\n• Opsi C: カッター adalah pisau cutter.\n• Opsi D: ものさし adalah mistar pengukur.",
        "grammarRule": "Alat Perlengkapan Bab 7: はさみ（gunting）."
      },
      "image": "assets/bab_07/reading_q21.jpeg"
    },
    {
      "id": 22,
      "session": "reading",
      "section_ja": "第3部：読解・図解評価",
      "section_id": "Sesi 1: Reading — Zukai (Evaluasi Bergambar)",
      "category": "Soal Bergambar — Alat Makan Tradisional (はし)",
      "type": "gambar",
      "question_ja": "絵（え）を 見て ください。日本人は 何で ごはんを 食べますか。<br>「（　　　）で 食べます。」",
      "question_ruby": "絵（え）を 見て ください。日本人は 何で ごはんを 食べますか。<br>「（　　　）で 食べます。」",
      "question_id": "Perhatikan gambar. Orang Jepang makan nasi menggunakan apa? 'Makan menggunakan (...)'.",
      "translation": "Makan menggunakan sepasang sumpit (hashi).",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "スプーン"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "フォーク"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "はし"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "手（て）"
        }
      ],
      "correctAnswer": "C",
      "explanation": {
        "summary": "Jawaban yang benar adalah C (はし).",
        "logic": "Gambar menunjukkan sepasang sumpit makan khas Jepang (はし - hashi).",
        "distractor": "• Opsi A: スプーン adalah sendok makan.\n• Opsi B: フォーク adalah garpu.\n• Opsi D: 手（て） adalah tangan telanjang.",
        "grammarRule": "Alat Makan Budaya Jepang Bab 7: 箸（はし = sumpit makan）."
      },
      "image": "assets/bab_07/reading_q22.jpeg"
    },
    {
      "id": 23,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Cara Baca Kanji (切ります)",
      "type": "teks",
      "question_ja": "作業で 厚い ダンボールを （ 切ります ）。<br>（　）の 漢字の 正しい 読み方は どれですか。",
      "question_ruby": "作業で 厚い ダンボールを （ 切ります ）。<br>（　）の 漢字の 正しい 読み方は どれですか。",
      "question_id": "Memotong kardus tebal pada saat kerja. Pilihlah cara baca kanji '切ります' yang tepat.",
      "translation": "Memotong kardus tebal saat bekerja.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "きります"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "はります"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "おします"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "とります"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (きります).",
        "logic": "Kanji 切ります dibaca きります (kirimasu) yang bermakna memotong.",
        "distractor": "• Opsi B: はります ditulis 貼ります (menempelkan).\n• Opsi C: おします ditulis 押します (menekan/mendorong).\n• Opsi D: とります ditulis 取ります (mengambil).",
        "grammarRule": "Verba Kerja Bab 7: 切ります（きります = memotong）."
      }
    },
    {
      "id": 24,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Penulisan Kanji (手)",
      "type": "teks",
      "question_ja": "食事の 前に （ て ）を よく 洗います。<br>（　）の 言葉の 正しい 漢字は どれですか。",
      "question_ruby": "食事の 前に （ て ）を よく 洗います。<br>（　）の 言葉の 正しい 漢字は どれですか。",
      "question_id": "Sebelum makan mencuci tangan dengan bersih. Pilihlah kanji yang tepat untuk 'te'.",
      "translation": "Sebelum makan mencuci kedua belah tangan dengan bersih.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "手"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "毛"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "才"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "龵"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (手).",
        "logic": "Kata て (tangan) ditulis dengan kanji dasar 手.",
        "distractor": "• Opsi B: 毛 dibaca け (rambut/bulu).\n• Opsi C: 才 dibaca さい (bakat / umur).\n• Opsi D: 龵 adalah radikal yang bukan huruf tunggal umum.",
        "grammarRule": "Anggota Tubuh / K3 Bab 7: 手（て = tangan）."
      }
    },
    {
      "id": 25,
      "session": "reading",
      "section_ja": "第4部：読解・漢字評価",
      "section_id": "Sesi 1: Reading — Kanji (Evaluasi Kanji)",
      "category": "Soal Kanji — Pemakaian Kanji dalam Konteks (荷物)",
      "type": "teks",
      "question_ja": "トラックから 工場の （ にもつ ）を 下ろします。<br>正しい 漢字は どれですか。",
      "question_ruby": "トラックから 工場の （ にもつ ）を 下ろします。<br>正しい 漢字は どれですか。",
      "question_id": "Menurunkan barang/muatan pabrik dari truk. Pilihlah penulisan kanji yang tepat untuk 'nimotsu'.",
      "translation": "Menurunkan muatan barang barang pabrik dari atas truk.",
      "options": [
        {
          "id": "A",
          "symbol": "A",
          "text_ja": "荷物"
        },
        {
          "id": "B",
          "symbol": "B",
          "text_ja": "荷者"
        },
        {
          "id": "C",
          "symbol": "C",
          "text_ja": "何物"
        },
        {
          "id": "D",
          "symbol": "D",
          "text_ja": "荷料"
        }
      ],
      "correctAnswer": "A",
      "explanation": {
        "summary": "Jawaban yang benar adalah A (荷物).",
        "logic": "Kata にもつ (barang bawaan / kargo / muatan paket) ditulis dengan kanji 荷物 (荷 = beban/muatan, 物 = barang).",
        "distractor": "• Opsi B: 荷者 adalah bentuk yang keliru.\n• Opsi C: 何物 dibaca なにもの (siapakah gerangan/makhluk apa).\n• Opsi D: 荷料 adalah penulisan yang salah.",
        "grammarRule": "Kosakata Pengiriman Pabrik: 荷物（にもつ = muatan / paket barang）."
      }
    }
  ]
};

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

const CHAPTERS_DATA = {
  "01": BAB_01_DATA,
  "02": BAB_02_DATA,
  "03": BAB_03_DATA,
  "04": BAB_04_DATA,
  "05": BAB_05_DATA,
  "06": BAB_06_DATA,
  "07": BAB_07_DATA,
  "08": BAB_08_DATA
};

if (typeof window !== "undefined") {
  window.CHAPTERS_INDEX = CHAPTERS_INDEX;
  window.CHAPTERS_DATA = CHAPTERS_DATA;
  window.BAB_01_DATA = BAB_01_DATA;
  window.BAB_02_DATA = BAB_02_DATA;
  window.BAB_03_DATA = BAB_03_DATA;
  window.BAB_04_DATA = BAB_04_DATA;
  window.BAB_05_DATA = BAB_05_DATA;
  window.BAB_06_DATA = BAB_06_DATA;
  window.BAB_07_DATA = BAB_07_DATA;
  window.BAB_08_DATA = BAB_08_DATA;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CHAPTERS_INDEX,
    CHAPTERS_DATA,
    BAB_01_DATA,
    BAB_02_DATA,
    BAB_03_DATA,
    BAB_04_DATA,
    BAB_05_DATA,
    BAB_06_DATA,
    BAB_07_DATA,
    BAB_08_DATA
  };
}
