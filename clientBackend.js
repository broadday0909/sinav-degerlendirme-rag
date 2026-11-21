/**
 * Tarayıcı İçi (Client-Side) API Katmanı — GitHub Pages Statik Sürüm
 * Tüm /api/* isteklerini arka uç sunucusu olmadan doğrudan tarayıcıda karşılar.
 */
(function () {
  window.__STATIC_MODE__ = true;
  const HISTORY_KEY = 'tubitak1001_static_history_v1';
  const origFetch = window.fetch ? window.fetch.bind(window) : null;

  function jsonResponse(data, status = 200) {
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data))
    });
  }

  function loadHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (_) {
      return [];
    }
  }

  function saveHistory(arr) {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(arr.slice(0, 50)));
    } catch (_) {}
  }

  function getExt(name) {
    const s = String(name || '').toLowerCase();
    const idx = s.lastIndexOf('.');
    return idx !== -1 ? s.slice(idx) : '';
  }

  // --- ZIP / DOCX Çözücü (Tarayıcı içi DecompressionStream) ---
  async function extractZipEntries(arrayBuffer) {
    const bytes = new Uint8Array(arrayBuffer);
    const view = new DataView(arrayBuffer);
    const decoder = new TextDecoder('utf-8');
    const entries = [];
    let offset = 0;
    while (offset + 30 <= bytes.length) {
      if (view.getUint32(offset, true) !== 0x04034b50) { offset++; continue; }
      const compression = view.getUint16(offset + 8, true);
      const compSize = view.getUint32(offset + 18, true);
      const nameLen = view.getUint16(offset + 26, true);
      const extraLen = view.getUint16(offset + 28, true);
      const fileName = decoder.decode(bytes.subarray(offset + 30, offset + 30 + nameLen));
      const dataStart = offset + 30 + nameLen + extraLen;
      const dataEnd = dataStart + compSize;
      if (dataEnd <= bytes.length && compSize > 0) {
        const raw = bytes.subarray(dataStart, dataEnd);
        let data = raw;
        if (compression === 8 && typeof DecompressionStream !== 'undefined') {
          try {
            const ds = new DecompressionStream('deflate-raw');
            const writer = ds.writable.getWriter();
            writer.write(raw);
            writer.close();
            data = new Uint8Array(await new Response(ds.readable).arrayBuffer());
          } catch (_) {}
        }
        entries.push({ fileName, data });
      }
      offset = dataEnd > offset ? dataEnd : offset + 1;
    }
    return entries;
  }

  async function extractDocxText(file) {
    const entries = await extractZipEntries(await file.arrayBuffer());
    const docEntry = entries.find((e) => e.fileName === 'word/document.xml');
    if (!docEntry) return '';
    const xml = new TextDecoder('utf-8').decode(docEntry.data);
    return xml.split(/<\/w:p>/i).map((p) => {
      const tRegex = /<w:t(?:\s+[^>]*)?>([\s\S]*?)<\/w:t>/gi;
      let m; const parts = [];
      while ((m = tRegex.exec(p)) !== null) {
        parts.push(m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'"));
      }
      return parts.join('');
    }).filter((p) => p.trim().length > 0).join('\n\n').trim();
  }

  async function extractPdfText(file) {
    if (typeof window.pdfjsLib === 'undefined') {
      throw new Error('PDF okuyucu kütüphanesi yüklenemedi. İnternet bağlantınızı kontrol ediniz.');
    }
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((it) => it.str).join(' ');
      if (text.trim()) pages.push(text.trim());
    }
    return pages.join('\n\n').trim();
  }

  async function parseCourseFile(file) {
    const ext = getExt(file.name);
    let text = '';
    let fileType = ext.replace('.', '').toUpperCase() || 'TXT';
    if (ext === '.txt') { fileType = 'TXT'; text = (await file.text()).trim(); }
    else if (ext === '.docx') { fileType = 'DOCX'; text = await extractDocxText(file); }
    else if (ext === '.pdf') { fileType = 'PDF'; text = await extractPdfText(file); }
    if (!text) throw new Error(`Ders kaynağı dosyasından (${file.name}) okunabilir metin çıkarılamadı.`);
    return { fileName: file.name, fileType, sizeBytes: file.size, text };
  }

  // --- HTML5 Canvas Görüntü İyileştirme (Önizleme & OCR Hazırlık) ---
  async function enhanceImageOnCanvas(file, options = {}) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error('Görsel yüklenemedi.'));
        i.src = url;
      });

      const appliedOperations = [];
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      if (options.crop && options.crop.unit === 'percent') {
        sx = Math.round((options.crop.left / 100) * sw);
        sy = Math.round((options.crop.top / 100) * sh);
        sw = Math.max(1, Math.round((options.crop.width / 100) * sw));
        sh = Math.max(1, Math.round((options.crop.height / 100) * sh));
        appliedOperations.push('crop');
      }

      const angleDeg = Number(options.rotateAngle) || 0;
      const rad = (angleDeg * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rad));
      const sin = Math.abs(Math.sin(rad));
      const cw = Math.max(1, Math.round(sw * cos + sh * sin));
      const ch = Math.max(1, Math.round(sw * sin + sh * cos));

      const canvas = document.createElement('canvas');
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, cw, ch);

      const filters = [];
      if (options.brightness && options.brightness !== 1) { filters.push(`brightness(${options.brightness})`); appliedOperations.push('brightness'); }
      if (options.contrast && options.contrast !== 1) { filters.push(`contrast(${options.contrast})`); appliedOperations.push('contrast'); }
      if (options.clahe || options.normalize) { filters.push('contrast(1.25)'); appliedOperations.push(options.clahe ? 'clahe' : 'normalize'); }
      if (options.binarize) { filters.push('grayscale(1) contrast(2.2)'); appliedOperations.push('binarize'); }
      if (angleDeg !== 0) appliedOperations.push(`rotate(${angleDeg}°)`);
      if (options.autoDeskew) appliedOperations.push('autoDeskew');

      if (filters.length > 0 && 'filter' in ctx) ctx.filter = filters.join(' ');
      ctx.translate(cw / 2, ch / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, sx, sy, sw, sh, -sw / 2, -sh / 2, sw, sh);

      const previewUrl = canvas.toDataURL('image/png');
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      return { previewUrl, blob, metadata: { appliedOperations } };
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  // --- OCR + Soru/Puan Ayrıştırıcı + Strict/Hybrid RAG ---
  async function runOcr(imageSource) {
    if (typeof window.Tesseract === 'undefined') {
      throw new Error('OCR kütüphanesi yüklenemedi. İnternet bağlantınızı kontrol ediniz.');
    }
    const res = await window.Tesseract.recognize(imageSource, 'tur+eng');
    return (res && res.data && res.data.text ? res.data.text : '').replace(/\r\n/g, '\n').trim();
  }

  function extractPointValue(text = '') {
    const r1 = /(?:\(\s*(\d{1,3})\s*(?:puan|pts?|p)\s*\)|\[\s*(\d{1,3})\s*(?:puan|pts?|p)\s*\]|(?:\b|-|–|:)\s*(\d{1,3})\s*(?:puan|pts)\b|(?:\b|-|–|:)\s*(\d{1,3})p\b)/i;
    const m1 = text.match(r1);
    if (m1) {
      const val = parseInt(m1[1] || m1[2] || m1[3] || m1[4], 10);
      if (val > 0 && val <= 200) {
        return { maxPoints: val, maxPointsLabel: `${val} Puan`, cleanedText: text.replace(m1[0], ' ').replace(/\s+/g, ' ').trim() };
      }
    }
    const r2 = /(?:\(|\[)?\s*\bpuan(?:ı|i)?\s*[:=-]\s*(\d{1,3})\b\s*(?:\)|\])?/i;
    const m2 = text.match(r2);
    if (m2) {
      const val = parseInt(m2[1], 10);
      if (val > 0 && val <= 200) {
        return { maxPoints: val, maxPointsLabel: `${val} Puan`, cleanedText: text.replace(m2[0], ' ').replace(/\s+/g, ' ').trim() };
      }
    }
    return { maxPoints: null, maxPointsLabel: null, cleanedText: text.trim() };
  }

  function parseQuestionsFromOcr(ocrText, pageSide, startNumber) {
    const lines = (ocrText || '').split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return [];
    const qHeader = /^(?:soru\s*\d{1,2}|s\s*[-.]?\s*\d{1,2}|\d{1,2}\s*[.)\-:])/i;
    const ansHeader = /^(?:öğrenci\s*cevabı|ogrenci\s*cevabi|cevap\s*\d*|yanıt\s*\d*|yanit\s*\d*)\s*[:\-]/i;
    const firstIdx = lines.findIndex((l) => qHeader.test(l) || extractPointValue(l).maxPoints !== null);
    const activeLines = firstIdx > 0 ? lines.slice(firstIdx) : lines;

    const blocks = [];
    let cur = [];
    for (const line of activeLines) {
      if (cur.length > 0 && qHeader.test(line)) { blocks.push(cur); cur = [line]; }
      else cur.push(line);
    }
    if (cur.length > 0) blocks.push(cur);

    let qNum = startNumber;
    return blocks.map((blk) => {
      const full = blk.join('\n');
      const numMatch = blk[0].match(/^(?:soru\s*(\d{1,2})|s\s*[-.]?\s*(\d{1,2})|(\d{1,2})\s*[.)\-:])/i);
      const detectedNum = numMatch ? parseInt(numMatch[1] || numMatch[2] || numMatch[3], 10) : qNum;
      qNum = detectedNum + 1;
      const pt = extractPointValue(full);
      const ansIdx = blk.findIndex((l) => ansHeader.test(l));
      let qText = '', aText = '';
      if (ansIdx > 0) {
        qText = blk.slice(0, ansIdx).join(' ');
        aText = blk.slice(ansIdx).join(' ').replace(ansHeader, '').trim();
      } else if (blk.length >= 2) {
        qText = blk[0];
        aText = blk.slice(1).join(' ');
      } else {
        qText = blk[0];
      }
      qText = extractPointValue(qText).cleanedText.replace(/^(?:soru\s*\d{1,2}|s\s*[-.]?\s*\d{1,2}|\d{1,2}\s*[.)\-:])\s*[:.\-)]?\s*/i, '').trim();
      return {
        questionNumber: detectedNum,
        pageSide,
        questionText: qText || `Soru ${detectedNum}`,
        maxPoints: pt.maxPoints || 20,
        maxPointsLabel: pt.maxPointsLabel || '20 Puan',
        hasExplicitPoints: pt.maxPoints !== null,
        studentAnswer: aText.trim()
      };
    });
  }

  const STOPWORDS = new Set(['ve', 'veya', 'ile', 'bir', 'bu', 'su', 'o', 'da', 'de', 'ki', 'mi', 'mu', 'icin', 'gibi', 'kadar', 'gore', 'olan', 'olarak', 'ise', 'ama', 'fakat', 'cok', 'daha', 'en', 'her', 'hic', 'ne', 'nedir', 'nasil', 'neden', 'hangi', 'aciklayiniz', 'yaziniz', 'belirtiniz', 'tanimlayiniz', 'soru', 'cevap', 'puan']);

  function foldTr(text) {
    return String(text || '').replace(/İ/g, 'i').replace(/I/g, 'ı').toLocaleLowerCase('tr-TR')
      .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
  }

  function stemTr(word) {
    let w = foldTr(word).replace(/[^a-z0-9]/g, '');
    if (w.length <= 3) return w;
    const suffixes = ['maktadir', 'mektedir', 'larindan', 'lerinden', 'larinda', 'lerinde', 'lari', 'leri', 'dan', 'den', 'tan', 'ten', 'nin', 'nun', 'dir', 'tir', 'dur', 'tur', 'lar', 'ler', 'mak', 'mek', 'lik', 'luk', 'da', 'de', 'ta', 'te', 'in', 'un'];
    for (const s of suffixes) {
      if (w.length - s.length >= 3 && w.endsWith(s)) { w = w.slice(0, -s.length); break; }
    }
    return w;
  }

  function tokenize(text) {
    return foldTr(text).split(/[^a-z0-9]+/).filter((t) => t.length >= 2 && !STOPWORDS.has(t)).map(stemTr).filter((t) => t.length >= 2);
  }

  function evaluateQuestion(q, docs, mode = 'strict') {
    const qTokens = tokenize(q.questionText);
    const aTokens = tokenize(q.studentAnswer);
    const sentences = [];
    for (const doc of docs) {
      for (const s of doc.text.split(/(?<=[.!?])\s+|\n+/)) {
        if (s.trim().length >= 10) sentences.push({ fileName: doc.fileName, text: s.trim(), tokens: new Set(tokenize(s)) });
      }
    }

    const scored = sentences.map((s) => {
      let qHit = 0;
      for (const qt of qTokens) if (s.tokens.has(qt)) qHit++;
      return { ...s, qHit };
    }).filter((s) => s.qHit > 0).sort((a, b) => b.qHit - a.qHit);

    const isBlank = !q.studentAnswer || /^(boş|bos|yok|-+)$/i.test(q.studentAnswer) || aTokens.length === 0;

    if (scored.length === 0) {
      if (mode === 'hybrid' && !isBlank) {
        const provisional = Math.round(q.maxPoints * 0.5);
        return {
          ...q,
          awardedPoints: provisional,
          needsReview: true,
          missingConcepts: [],
          sourceReference: 'Yüklenen ders kaynaklarında doğrudan eşleşme bulunamadı (Hibrit Mod).',
          evaluationReasoning: `Konu yüklenen ders kaynaklarında geçmemektedir; Hibrit Mod gereği otomatik 0 yerine inceleme işaretli geçici öneri puanı (${provisional}/${q.maxPoints}) üretilmiştir.`
        };
      }
      return {
        ...q,
        studentAnswer: q.studentAnswer || '(Cevap boş bırakılmış)',
        awardedPoints: 0,
        needsReview: false,
        missingConcepts: [],
        sourceReference: 'Yüklenen ders kaynaklarında bu konuya ait bilgi bulunamadı.',
        evaluationReasoning: 'Bu sorunun konusu yüklenen ders kaynaklarında yer almamaktadır. Katı RAG kuralı gereği 0 puan verilmiştir.'
      };
    }

    const best = scored.slice(0, 2);
    const refText = best.map((b) => b.text).join(' ');
    const srcRef = `${best[0].fileName}: "${refText.slice(0, 180)}${refText.length > 180 ? '...' : ''}"`;

    if (isBlank) {
      return {
        ...q,
        studentAnswer: '(Cevap boş bırakılmış)',
        awardedPoints: 0,
        needsReview: false,
        missingConcepts: [],
        sourceReference: srcRef,
        evaluationReasoning: `Öğrenci soruyu boş bırakmıştır. Kaynak (${best[0].fileName}) referansı: "${refText.slice(0, 140)}"`
      };
    }

    const refTokens = new Set(tokenize(refText));
    const qSet = new Set(qTokens);
    const targetConcepts = Array.from(refTokens).filter((t) => !qSet.has(t));
    const matched = targetConcepts.filter((c) => aTokens.includes(c));
    const missing = targetConcepts.filter((c) => !aTokens.includes(c)).slice(0, 4);
    const ratio = targetConcepts.length > 0 ? Math.min(1, matched.length / Math.min(targetConcepts.length, 4)) : 0;
    let awarded = ratio >= 0.75 ? q.maxPoints : Math.round(q.maxPoints * ratio);
    let needsReview = false;
    if (mode === 'hybrid' && awarded === 0 && aTokens.length >= 3) {
      awarded = Math.max(1, Math.round(q.maxPoints * 0.35));
      needsReview = true;
    }

    return {
      ...q,
      awardedPoints: awarded,
      needsReview,
      missingConcepts: awarded === q.maxPoints ? [] : missing,
      sourceReference: srcRef,
      evaluationReasoning: awarded === q.maxPoints
        ? `Öğrenci cevabı ders kaynağındaki (${best[0].fileName}) temel kavramlarla (${matched.slice(0, 4).join(', ')}) tam uyumludur.`
        : needsReview
          ? `Öğrenci cevabı ders kaynağındaki terimlerden farklı kelimelerle ifade edilmiştir; Hibrit Mod geçici önerisi (${awarded}/${q.maxPoints}) inceleme gerektirir.`
          : awarded > 0
            ? `Öğrenci cevabı ders kaynağındaki (${best[0].fileName}) bazı kavramları (${matched.slice(0, 3).join(', ')}) içermekte ancak kapsam kısmi kalmaktadır.`
            : `Öğrencinin cevabı yüklenen ders kaynağındaki (${best[0].fileName}) bilgilerle örtüşmemektedir.`
    };
  }

  // --- Analiz ve SVG Grafik Üretici ---
  function escapeXml(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function buildBarSvg(title, items, color = '#1d4ed8') {
    const w = 520, rowH = 34, padTop = 44, padLeft = 120, barMaxW = 330;
    const h = Math.max(140, padTop + items.length * rowH + 20);
    const rows = items.length === 0
      ? `<text x="${w / 2}" y="${h / 2}" text-anchor="middle" fill="#64748b" font-size="13">Veri bulunmuyor</text>`
      : items.map((it, idx) => {
          const y = padTop + idx * rowH;
          const bw = Math.max(4, Math.round((it.pct / 100) * barMaxW));
          return `
            <text x="${padLeft - 10}" y="${y + 16}" text-anchor="end" fill="#334155" font-size="12" font-weight="600">${escapeXml(it.label)}</text>
            <rect x="${padLeft}" y="${y + 4}" width="${barMaxW}" height="18" rx="4" fill="#e2e8f0" />
            <rect x="${padLeft}" y="${y + 4}" width="${bw}" height="18" rx="4" fill="${color}" />
            <text x="${padLeft + bw + 8}" y="${y + 17}" fill="#0f172a" font-size="12" font-weight="700">${escapeXml(it.valueLabel)}</text>
          `;
        }).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="${h}">
      <rect width="100%" height="100%" fill="#ffffff" rx="8" />
      <text x="16" y="26" fill="#0f172a" font-size="14" font-weight="700">${escapeXml(title)}</text>
      ${rows}
    </svg>`;
  }

  function computeAnalytics(exam) {
    const students = Array.isArray(exam.students) ? exam.students : [];
    const totals = students.map((s) => Number(s.totalAwardedPoints ?? s.awardedPoints ?? 0));
    const maxPossible = students.reduce((m, s) => Math.max(m, Number(s.totalMaxPoints ?? s.maxPoints ?? 100)), 100);
    const avg = totals.length > 0 ? Number((totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(1)) : 0;
    const avgPct = maxPossible > 0 ? Math.round((avg / maxPossible) * 100) : 0;
    const maxS = totals.length > 0 ? Math.max(...totals) : 0;
    const minS = totals.length > 0 ? Math.min(...totals) : 0;

    const qMap = new Map();
    const missingFreq = new Map();
    students.forEach((s) => {
      const qs = Array.isArray(s.questionResults) ? s.questionResults : s.questions || [];
      qs.forEach((q) => {
        const num = Number(q.questionNumber) || 1;
        if (!qMap.has(num)) qMap.set(num, { scores: [], maxPoints: Number(q.maxPoints) || 20 });
        qMap.get(num).scores.push(Number(q.awardedPoints) || 0);
        (q.missingConcepts || []).forEach((c) => missingFreq.set(c, (missingFreq.get(c) || 0) + 1));
      });
    });

    const questionStats = Array.from(qMap.entries()).sort((a, b) => a[0] - b[0]).map(([num, info]) => {
      const qAvg = info.scores.length ? Number((info.scores.reduce((a, b) => a + b, 0) / info.scores.length).toFixed(1)) : 0;
      const rate = info.maxPoints > 0 ? Math.round((qAvg / info.maxPoints) * 100) : 0;
      return {
        questionNumber: num,
        averageScore: qAvg,
        maxPoints: info.maxPoints,
        successRate: rate,
        minScore: info.scores.length ? Math.min(...info.scores) : 0,
        maxScore: info.scores.length ? Math.max(...info.scores) : 0
      };
    });

    const bins = [
      { label: '0-39', min: 0, max: 39, count: 0 },
      { label: '40-59', min: 40, max: 59, count: 0 },
      { label: '60-79', min: 60, max: 79, count: 0 },
      { label: '80-100', min: 80, max: 200, count: 0 }
    ];
    totals.forEach((t) => {
      const pct = maxPossible > 0 ? (t / maxPossible) * 100 : 0;
      const b = bins.find((x) => pct >= x.min && pct <= x.max) || bins[bins.length - 1];
      b.count++;
    });

    const topMissing = Array.from(missingFreq.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxMiss = topMissing.length ? topMissing[0][1] : 1;

    return {
      examTitle: exam.title || exam.examTitle || 'Sınav Analizi',
      summaryText: `${students.length} öğrenci ve ${questionStats.length} soru üzerinden sınıf başarı analizi hesaplandı.`,
      classAverage: avg,
      maxPossibleScore: maxPossible,
      classAveragePercentage: avgPct,
      studentCount: students.length,
      maxStudentScore: maxS,
      minStudentScore: minS,
      questionStats,
      gradeDistribution: bins,
      charts: {
        questionSuccessSvg: buildBarSvg('Soru Bazlı Başarı Oranı (%)', questionStats.map((q) => ({ label: `Soru ${q.questionNumber}`, pct: q.successRate, valueLabel: `%${q.successRate}` })), '#1d4ed8'),
        missingConceptsSvg: buildBarSvg('En Sık Eksik Bırakılan Kavramlar', topMissing.map(([k, v]) => ({ label: k, pct: Math.round((v / maxMiss) * 100), valueLabel: `${v} kez` })), '#b45309')
      }
    };
  }

  // --- Fetch Interceptor ---
  window.fetch = async function (input, init = {}) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    const method = (init.method || 'GET').toUpperCase();

    if (!url.startsWith('/api/')) {
      return origFetch ? origFetch(input, init) : Promise.reject(new Error('Fetch desteklenmiyor.'));
    }

    try {
      // 1. Görüntü İyileştirme Önizleme
      if (url.startsWith('/api/image/enhance') && method === 'POST') {
        const fd = init.body;
        const imgFile = fd.get('image');
        const opts = JSON.parse(fd.get('options') || '{}');
        const res = await enhanceImageOnCanvas(imgFile, opts);
        return jsonResponse({ previewUrl: res.previewUrl, metadata: res.metadata });
      }

      // 2. Tekli Değerlendirme
      if (url === '/api/evaluate' && method === 'POST') {
        const start = Date.now();
        const fd = init.body;
        const courseFiles = fd.getAll('courseMaterials');
        const frontFile = fd.get('frontImage');
        const backFile = fd.get('backImage');
        const evalMode = fd.get('evaluationMode') || 'strict';
        const enhRaw = fd.get('enhancement');
        const enh = enhRaw ? JSON.parse(enhRaw) : null;

        const parsedDocs = [];
        for (const f of courseFiles) parsedDocs.push(await parseCourseFile(f));

        let frontSrc = frontFile, frontMeta = null;
        if (enh && (enh.front || (!enh.back && Object.keys(enh).length > 0))) {
          const r = await enhanceImageOnCanvas(frontFile, enh.front || enh);
          frontSrc = r.blob; frontMeta = r.metadata;
        }
        const frontText = await runOcr(frontSrc);
        const frontQ = parseQuestionsFromOcr(frontText, 'Ön Yüz', 1);
        const scannedPages = [{ pageSide: 'Ön Yüz', fileName: frontFile.name, enhancement: frontMeta }];

        let backQ = [];
        if (backFile) {
          let backSrc = backFile, backMeta = null;
          if (enh && enh.back) {
            const r = await enhanceImageOnCanvas(backFile, enh.back);
            backSrc = r.blob; backMeta = r.metadata;
          }
          const backText = await runOcr(backSrc);
          const nextNum = frontQ.length ? Math.max(...frontQ.map((q) => q.questionNumber)) + 1 : 1;
          backQ = parseQuestionsFromOcr(backText, 'Arka Yüz', nextNum);
          scannedPages.push({ pageSide: 'Arka Yüz', fileName: backFile.name, enhancement: backMeta });
        }

        const allQ = [...frontQ, ...backQ];
        if (allQ.length === 0) {
          allQ.push({
            questionNumber: 1, pageSide: 'Ön Yüz',
            questionText: 'Sınav görselinde okunabilir basılı soru metni tespit edilemedi.',
            maxPoints: 100, maxPointsLabel: '100 Puan', studentAnswer: ''
          });
        }
        const evaluated = allQ.map((q) => evaluateQuestion(q, parsedDocs, evalMode));
        const totalMaxPoints = evaluated.reduce((s, q) => s + q.maxPoints, 0);
        const totalAwardedPoints = evaluated.reduce((s, q) => s + q.awardedPoints, 0);

        return jsonResponse({
          summary: `Sınav kağıdı (${scannedPages.map((p) => p.pageSide).join(' + ')}) taranarak ${evaluated.length} soru tespit edildi ve ${parsedDocs.length} ders kaynağına (${evalMode === 'hybrid' ? 'Hibrit' : 'Katı'} RAG) göre değerlendirildi.`,
          totalAwardedPoints,
          totalMaxPoints,
          evaluationTimeMs: Date.now() - start,
          questions: evaluated,
          courseMaterials: parsedDocs.map((d) => ({ fileName: d.fileName, fileType: d.fileType })),
          scannedPages
        });
      }

      // 3. Toplu Değerlendirme (Batch)
      if (url === '/api/evaluate/batch' && method === 'POST') {
        const fd = init.body;
        const courseFiles = fd.getAll('courseMaterials');
        const papers = fd.getAll('papers');
        const zips = fd.getAll('zip');
        const evalMode = fd.get('evaluationMode') || 'strict';

        const parsedDocs = [];
        for (const f of courseFiles) parsedDocs.push(await parseCourseFile(f));

        const imageList = [...papers];
        for (const z of zips) {
          const entries = await extractZipEntries(await z.arrayBuffer());
          for (const e of entries) {
            if (/\.(png|jpe?g|webp|bmp)$/i.test(e.fileName)) {
              imageList.push(new File([e.data], e.fileName.split('/').pop(), { type: 'image/png' }));
            }
          }
        }

        const students = [];
        for (let i = 0; i < imageList.length; i++) {
          const file = imageList[i];
          const text = await runOcr(file);
          const qs = parseQuestionsFromOcr(text, 'Ön Yüz', 1);
          const evaluated = (qs.length ? qs : [{ questionNumber: 1, pageSide: 'Ön Yüz', questionText: 'Soru 1', maxPoints: 100, maxPointsLabel: '100 Puan', studentAnswer: '' }])
            .map((q) => evaluateQuestion(q, parsedDocs, evalMode));
          const awarded = evaluated.reduce((s, q) => s + q.awardedPoints, 0);
          const max = evaluated.reduce((s, q) => s + q.maxPoints, 0);
          students.push({
            studentNumber: `OGR-${i + 1}`,
            studentName: file.name.replace(/\.[^/.]+$/, ''),
            awardedPoints: awarded,
            totalAwardedPoints: awarded,
            maxPoints: max,
            totalMaxPoints: max,
            questionResults: evaluated.map((q) => ({
              questionNumber: q.questionNumber,
              questionText: q.questionText,
              awardedPoints: q.awardedPoints,
              maxPoints: q.maxPoints,
              reasoning: q.evaluationReasoning,
              needsReview: q.needsReview,
              missingConcepts: q.missingConcepts || []
            }))
          });
        }

        const totals = students.map((s) => s.totalAwardedPoints);
        const avg = totals.length ? Number((totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(1)) : 0;
        const examId = `exam_${Date.now()}`;
        const title = parsedDocs[0] ? parsedDocs[0].fileName.replace(/\.[^/.]+$/, '') : 'Toplu Sınav';
        const gradeList = {
          id: examId,
          examId,
          title,
          examTitle: title,
          createdAt: new Date().toISOString(),
          studentCount: students.length,
          classAverage: avg,
          maxScore: totals.length ? Math.max(...totals) : 0,
          minScore: totals.length ? Math.min(...totals) : 0,
          students
        };

        const hist = loadHistory();
        hist.unshift(gradeList);
        saveHistory(hist);
        return jsonResponse(gradeList);
      }

      // 4. Geçmiş (History)
      if (url === '/api/history' && method === 'GET') {
        return jsonResponse(loadHistory());
      }
      if (url === '/api/history' && method === 'POST') {
        const body = JSON.parse(init.body || '{}');
        const examId = `exam_${Date.now()}`;
        const gl = body.gradeList || {};
        const record = {
          ...gl,
          id: examId,
          examId,
          title: body.title || gl.examTitle || 'Sınav Değerlendirmesi',
          createdAt: new Date().toISOString()
        };
        const hist = loadHistory();
        hist.unshift(record);
        saveHistory(hist);
        return jsonResponse({ examId, record }, 201);
      }
      if (url.startsWith('/api/history/')) {
        const id = decodeURIComponent(url.replace('/api/history/', '').split('/')[0]);
        const hist = loadHistory();
        if (method === 'DELETE') {
          saveHistory(hist.filter((e) => String(e.id) !== String(id)));
          return jsonResponse({ deleted: true });
        }
        const found = hist.find((e) => String(e.id) === String(id));
        if (!found) return jsonResponse({ error: 'Kayıt bulunamadı.' }, 404);
        return jsonResponse(found);
      }

      // 5. Analiz (Analytics)
      if (url === '/api/analysis' && method === 'POST') {
        const body = JSON.parse(init.body || '{}');
        return jsonResponse(computeAnalytics(body.gradeList || {}));
      }
      if (url.startsWith('/api/analysis/')) {
        const id = decodeURIComponent(url.replace('/api/analysis/', ''));
        const found = loadHistory().find((e) => String(e.id) === String(id));
        if (!found) return jsonResponse({ error: 'Sınav kaydı bulunamadı.' }, 404);
        return jsonResponse(computeAnalytics(found));
      }

      return jsonResponse({ error: 'Desteklenmeyen uç nokta.' }, 404);
    } catch (err) {
      return jsonResponse({ error: err.message || 'İşlem sırasında hata oluştu.' }, 400);
    }
  };
})();
