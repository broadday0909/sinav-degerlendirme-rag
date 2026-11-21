(function () {
  const form = document.getElementById('evaluation-form');
  const courseInput = document.getElementById('course-materials-input');
  const frontInput = document.getElementById('front-image-input');
  const backInput = document.getElementById('back-image-input');

  const courseCard = document.getElementById('course-materials-card');
  const frontCard = document.getElementById('front-image-card');
  const backCard = document.getElementById('back-image-card');

  const courseDropzone = document.getElementById('course-dropzone');
  const frontDropzone = document.getElementById('front-dropzone');
  const backDropzone = document.getElementById('back-dropzone');

  const courseStatusBadge = document.getElementById('course-status-badge');
  const frontStatusBadge = document.getElementById('front-status-badge');
  const backStatusBadge = document.getElementById('back-status-badge');
  const readinessIndicator = document.getElementById('readiness-indicator');

  const courseFilesSummary = document.getElementById('course-files-summary');
  const courseFilesCount = document.getElementById('course-files-count');
  const clearCourseBtn = document.getElementById('clear-course-btn');
  const courseFileList = document.getElementById('course-file-list');

  const frontPreviewBox = document.getElementById('front-preview-box');
  const frontPreviewImg = document.getElementById('front-preview-img');
  const frontFileName = document.getElementById('front-file-name');
  const clearFrontBtn = document.getElementById('clear-front-btn');

  const backPreviewBox = document.getElementById('back-preview-box');
  const backPreviewImg = document.getElementById('back-preview-img');
  const backFileName = document.getElementById('back-file-name');
  const clearBackBtn = document.getElementById('clear-back-btn');

  const evaluateBtn = document.getElementById('evaluate-btn');
  const resetBtn = document.getElementById('reset-btn');
  const cancelEvaluateBtn = document.getElementById('cancel-evaluate-btn');
  const errorBanner = document.getElementById('error-banner');
  const loadingSection = document.getElementById('loading-section');
  const loadingElapsed = document.getElementById('loading-elapsed');
  const resultsSection = document.getElementById('results-section');

  const evaluationSummary = document.getElementById('evaluation-summary');
  const sourcesBadges = document.getElementById('sources-badges');
  const totalAwardedEl = document.getElementById('total-awarded-points');
  const totalMaxEl = document.getElementById('total-max-points');
  const scorePercentageEl = document.getElementById('score-percentage');
  const scoreProgressFill = document.getElementById('score-progress-fill');
  const evaluatedQuestionCountEl = document.getElementById('evaluated-question-count');
  const evaluatedPagesLabelEl = document.getElementById('evaluated-pages-label');
  const evaluationDurationEl = document.getElementById('evaluation-duration');

  const scoreTableBody = document.getElementById('score-table-body');
  const tableFootMax = document.getElementById('table-foot-max');
  const tableFootAwarded = document.getElementById('table-foot-awarded');

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeToggleLabel = document.getElementById('theme-toggle-label');
  const copyTableBtn = document.getElementById('copy-table-btn');
  const exportCsvBtn = document.getElementById('export-csv-btn');
  const printResultsBtn = document.getElementById('print-results-btn');

  let selectedCourseFiles = [];
  let selectedFrontFile = null;
  let selectedBackFile = null;
  let lastEvaluationData = null;

  let frontObjectUrl = null;
  let backObjectUrl = null;
  let isCancelled = false;
  let elapsedTimerId = null;

  const ALLOWED_COURSE_EXTS = ['.pdf', '.docx', '.txt'];
  const ALLOWED_IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif', '.svg'];

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatSize(bytes) {
    if (!Number.isFinite(bytes) || bytes < 1024) return `${bytes || 0} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function getFileExtension(name) {
    const str = String(name || '').toLowerCase();
    const dotIdx = str.lastIndexOf('.');
    return dotIdx !== -1 ? str.slice(dotIdx) : '';
  }

  function isValidCourseFile(file) {
    if (!file) return false;
    const ext = getFileExtension(file.name);
    const mime = String(file.type || '').toLowerCase();
    return (
      ALLOWED_COURSE_EXTS.includes(ext) ||
      mime === 'application/pdf' ||
      mime === 'text/plain' ||
      mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
  }

  function isValidImageFile(file) {
    if (!file) return false;
    const ext = getFileExtension(file.name);
    const mime = String(file.type || '').toLowerCase();
    return ALLOWED_IMAGE_EXTS.includes(ext) || mime.startsWith('image/');
  }

  function showError(msg) {
    if (!msg) {
      errorBanner.hidden = true;
      errorBanner.textContent = '';
      return;
    }
    errorBanner.textContent = msg;
    errorBanner.hidden = false;
  }

  function revokePreviewUrl(which) {
    if (typeof URL === 'undefined' || typeof URL.revokeObjectURL !== 'function') return;
    if (which === 'front' && frontObjectUrl) {
      try { URL.revokeObjectURL(frontObjectUrl); } catch (_) {}
      frontObjectUrl = null;
    } else if (which === 'back' && backObjectUrl) {
      try { URL.revokeObjectURL(backObjectUrl); } catch (_) {}
      backObjectUrl = null;
    }
  }

  function updateReadinessStatus() {
    const hasCourse = selectedCourseFiles.length > 0;
    const hasFront = Boolean(selectedFrontFile);
    const hasBack = Boolean(selectedBackFile);

    if (courseCard) courseCard.classList.toggle('has-files', hasCourse);
    if (frontCard) frontCard.classList.toggle('has-files', hasFront);
    if (backCard) backCard.classList.toggle('has-files', hasBack);

    if (courseStatusBadge) {
      courseStatusBadge.textContent = hasCourse ? `Hazır (${selectedCourseFiles.length})` : 'Seçilmedi';
      courseStatusBadge.classList.toggle('ready', hasCourse);
    }
    if (frontStatusBadge) {
      frontStatusBadge.textContent = hasFront ? 'Hazır' : 'Seçilmedi';
      frontStatusBadge.classList.toggle('ready', hasFront);
    }
    if (backStatusBadge) {
      backStatusBadge.textContent = hasBack ? 'Hazır' : 'Boş Bırakılabilir';
      backStatusBadge.classList.toggle('ready', hasBack);
    }
    if (readinessIndicator) {
      if (hasCourse && hasFront) {
        readinessIndicator.textContent = hasBack
          ? 'Hazır: Ders Kaynağı + Ön ve Arka Yüz'
          : 'Hazır: Değerlendirme Başlatılabilir';
        readinessIndicator.classList.add('is-ready');
      } else if (!hasCourse && !hasFront) {
        readinessIndicator.textContent = 'Bekleniyor: Ders Kaynağı + Ön Yüz';
        readinessIndicator.classList.remove('is-ready');
      } else if (!hasCourse) {
        readinessIndicator.textContent = 'Bekleniyor: Ders Kaynağı (Adım 1)';
        readinessIndicator.classList.remove('is-ready');
      } else {
        readinessIndicator.textContent = 'Bekleniyor: Sınav Ön Yüzü (Adım 2)';
        readinessIndicator.classList.remove('is-ready');
      }
    }
  }

  function renderCourseFiles() {
    courseFileList.innerHTML = '';
    const totalBytes = selectedCourseFiles.reduce((sum, f) => sum + (f.size || 0), 0);
    if (courseFilesSummary) {
      courseFilesSummary.hidden = selectedCourseFiles.length === 0;
      if (courseFilesCount) {
        courseFilesCount.textContent = `${selectedCourseFiles.length} dosya (${formatSize(totalBytes)})`;
      }
    }
    const fragment = document.createDocumentFragment();
    selectedCourseFiles.forEach((file, index) => {
      const li = document.createElement('li');
      li.className = 'file-item';
      li.innerHTML = `
        <span class="file-item-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)} (${formatSize(file.size)})</span>
        <button type="button" class="remove-btn" data-index="${index}">Kaldır</button>
      `;
      li.querySelector('button').addEventListener('click', () => {
        selectedCourseFiles.splice(index, 1);
        if (selectedCourseFiles.length === 0) courseInput.value = '';
        renderCourseFiles();
      });
      fragment.appendChild(li);
    });
    courseFileList.appendChild(fragment);
    updateReadinessStatus();
  }

  function updateImagePreview(file, previewBox, previewImg, fileNameEl, sideKey) {
    revokePreviewUrl(sideKey);
    if (!file) {
      previewBox.hidden = true;
      previewImg.removeAttribute('src');
      fileNameEl.textContent = '';
      updateReadinessStatus();
      return;
    }
    fileNameEl.textContent = `${file.name} (${formatSize(file.size)})`;
    previewBox.hidden = false;
    if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      const objUrl = URL.createObjectURL(file);
      if (sideKey === 'front') frontObjectUrl = objUrl;
      if (sideKey === 'back') backObjectUrl = objUrl;
      previewImg.src = objUrl;
    }
    updateReadinessStatus();
  }

  function mergeUniqueCourseFiles(existing, incoming) {
    const map = new Map();
    for (const f of existing) map.set(`${f.name}::${f.size}`, f);
    for (const f of incoming) map.set(`${f.name}::${f.size}`, f);
    return Array.from(map.values());
  }

  courseInput.addEventListener('change', () => {
    showError('');
    const files = Array.from(courseInput.files || []);
    if (files.length > 0) {
      const invalid = files.find((f) => !isValidCourseFile(f));
      if (invalid) {
        courseInput.value = '';
        showError(`Desteklenmeyen dosya formatı (${invalid.name}). Lütfen sadece PDF, DOCX veya TXT yükleyiniz.`);
        return;
      }
      selectedCourseFiles = mergeUniqueCourseFiles(selectedCourseFiles, files);
      renderCourseFiles();
    }
  });

  frontInput.addEventListener('change', () => {
    showError('');
    const file = (frontInput.files && frontInput.files[0]) || null;
    if (file && !isValidImageFile(file)) {
      showError(`Desteklenmeyen görsel formatı (${file.name}). Lütfen PNG, JPG, JPEG veya WEBP yükleyiniz.`);
      frontInput.value = '';
      return;
    }
    selectedFrontFile = file;
    updateImagePreview(selectedFrontFile, frontPreviewBox, frontPreviewImg, frontFileName, 'front');
  });

  backInput.addEventListener('change', () => {
    showError('');
    const file = (backInput.files && backInput.files[0]) || null;
    if (file && !isValidImageFile(file)) {
      showError(`Desteklenmeyen görsel formatı (${file.name}). Lütfen PNG, JPG, JPEG veya WEBP yükleyiniz.`);
      backInput.value = '';
      return;
    }
    selectedBackFile = file;
    updateImagePreview(selectedBackFile, backPreviewBox, backPreviewImg, backFileName, 'back');
  });

  if (clearCourseBtn) {
    clearCourseBtn.addEventListener('click', () => {
      selectedCourseFiles = [];
      courseInput.value = '';
      renderCourseFiles();
    });
  }
  clearFrontBtn.addEventListener('click', () => {
    selectedFrontFile = null;
    frontInput.value = '';
    updateImagePreview(null, frontPreviewBox, frontPreviewImg, frontFileName, 'front');
  });
  clearBackBtn.addEventListener('click', () => {
    selectedBackFile = null;
    backInput.value = '';
    updateImagePreview(null, backPreviewBox, backPreviewImg, backFileName, 'back');
  });

  function setupDropzone(dropzoneEl, inputEl, onDropFiles) {
    ['dragenter', 'dragover'].forEach((evtName) => {
      dropzoneEl.addEventListener(evtName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneEl.classList.add('dragover');
      });
    });
    ['dragleave', 'drop'].forEach((evtName) => {
      dropzoneEl.addEventListener(evtName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneEl.classList.remove('dragover');
      });
    });
    dropzoneEl.addEventListener('drop', (e) => {
      const dropped = Array.from((e.dataTransfer && e.dataTransfer.files) || []);
      if (dropped.length > 0) {
        showError('');
        onDropFiles(dropped);
      }
    });
    dropzoneEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (inputEl && typeof inputEl.click === 'function') inputEl.click();
      }
    });
  }

  setupDropzone(courseDropzone, courseInput, (files) => {
    const invalid = files.find((f) => !isValidCourseFile(f));
    if (invalid) {
      showError(`Desteklenmeyen dosya formatı (${invalid.name}). Lütfen sadece PDF, DOCX veya TXT yükleyiniz.`);
      return;
    }
    selectedCourseFiles = mergeUniqueCourseFiles(selectedCourseFiles, files);
    renderCourseFiles();
  });

  setupDropzone(frontDropzone, frontInput, (files) => {
    const file = files[0];
    if (file && !isValidImageFile(file)) {
      showError(`Desteklenmeyen görsel formatı (${file.name}). Lütfen PNG, JPG, JPEG veya WEBP yükleyiniz.`);
      return;
    }
    selectedFrontFile = file;
    updateImagePreview(selectedFrontFile, frontPreviewBox, frontPreviewImg, frontFileName, 'front');
  });

  setupDropzone(backDropzone, backInput, (files) => {
    const file = files[0];
    if (file && !isValidImageFile(file)) {
      showError(`Desteklenmeyen görsel formatı (${file.name}). Lütfen PNG, JPG, JPEG veya WEBP yükleyiniz.`);
      return;
    }
    selectedBackFile = file;
    updateImagePreview(selectedBackFile, backPreviewBox, backPreviewImg, backFileName, 'back');
  });

  resetBtn.addEventListener('click', () => {
    isCancelled = true;
    selectedCourseFiles = [];
    selectedFrontFile = null;
    selectedBackFile = null;
    lastEvaluationData = null;
    courseInput.value = '';
    frontInput.value = '';
    backInput.value = '';
    renderCourseFiles();
    updateImagePreview(null, frontPreviewBox, frontPreviewImg, frontFileName, 'front');
    updateImagePreview(null, backPreviewBox, backPreviewImg, backFileName, 'back');
    showError('');
    resultsSection.hidden = true;
  });

  if (cancelEvaluateBtn) {
    cancelEvaluateBtn.addEventListener('click', () => {
      isCancelled = true;
      showError('Değerlendirme işlemi kullanıcı tarafından iptal edildi.');
      loadingSection.hidden = true;
      evaluateBtn.disabled = false;
    });
  }

  function applyTheme(theme) {
    const target = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', target);
    if (themeToggleLabel) themeToggleLabel.textContent = target === 'dark' ? 'Açık Tema' : 'Koyu Tema';
    try { localStorage.setItem('tubitak_gui_theme', target); } catch (_) {}
  }
  try {
    const saved = localStorage.getItem('tubitak_gui_theme');
    if (saved === 'dark' || saved === 'light') applyTheme(saved);
  } catch (_) {}
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // --- Tarayıcı İçi Ders Kaynağı Ayrıştırıcı (PDF, DOCX, TXT) ---
  async function extractDocxText(file) {
    const buf = await file.arrayBuffer();
    const bytes = new Uint8Array(buf);
    const view = new DataView(buf);
    let offset = 0;
    const decoder = new TextDecoder('utf-8');
    while (offset + 30 <= bytes.length) {
      if (view.getUint32(offset, true) !== 0x04034b50) { offset++; continue; }
      const compression = view.getUint16(offset + 8, true);
      const compSize = view.getUint32(offset + 18, true);
      const nameLen = view.getUint16(offset + 26, true);
      const extraLen = view.getUint16(offset + 28, true);
      const fileName = decoder.decode(bytes.subarray(offset + 30, offset + 30 + nameLen));
      const dataStart = offset + 30 + nameLen + extraLen;
      const dataEnd = dataStart + compSize;
      if (fileName === 'word/document.xml' && dataEnd <= bytes.length) {
        const raw = bytes.subarray(dataStart, dataEnd);
        let xml = '';
        if (compression === 8 && typeof DecompressionStream !== 'undefined') {
          const ds = new DecompressionStream('deflate-raw');
          const writer = ds.writable.getWriter();
          writer.write(raw);
          writer.close();
          const outBuf = await new Response(ds.readable).arrayBuffer();
          xml = decoder.decode(outBuf);
        } else {
          xml = decoder.decode(raw);
        }
        const paras = xml.split(/<\/w:p>/i).map((p) => {
          const tRegex = /<w:t(?:\s+[^>]*)?>([\s\S]*?)<\/w:t>/gi;
          let m; const parts = [];
          while ((m = tRegex.exec(p)) !== null) {
            parts.push(m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'"));
          }
          return parts.join('');
        }).filter((p) => p.trim().length > 0);
        return paras.join('\n\n').trim();
      }
      offset = dataEnd > offset ? dataEnd : offset + 1;
    }
    return '';
  }

  async function extractPdfText(file) {
    if (typeof window.pdfjsLib === 'undefined') {
      throw new Error('PDF okuyucu kütüphanesi yüklenemedi. İnternet bağlantınızı kontrol ediniz.');
    }
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const buf = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
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
    const ext = getFileExtension(file.name);
    let text = '';
    let fileType = ext.replace('.', '').toUpperCase() || 'TXT';
    if (ext === '.txt') {
      fileType = 'TXT';
      text = (await file.text()).trim();
    } else if (ext === '.docx') {
      fileType = 'DOCX';
      text = await extractDocxText(file);
    } else if (ext === '.pdf') {
      fileType = 'PDF';
      text = await extractPdfText(file);
    }
    if (!text || !text.trim()) {
      throw new Error(`Ders kaynağı dosyasından (${file.name}) okunabilir metin çıkarılamadı.`);
    }
    return { fileName: file.name, fileType, sizeBytes: file.size, text: text.trim() };
  }

  // --- Tarayıcı İçi Vision OCR + Soru/Puan Ayrıştırıcı ---
  async function extractExamText(file) {
    if (typeof window.Tesseract === 'undefined') {
      throw new Error('OCR kütüphanesi yüklenemedi. İnternet bağlantınızı kontrol ediniz.');
    }
    const res = await window.Tesseract.recognize(file, 'tur+eng');
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
      if (cur.length > 0 && qHeader.test(line)) {
        blocks.push(cur);
        cur = [line];
      } else {
        cur.push(line);
      }
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
      let qText = '';
      let aText = '';
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

  // --- Türkçe Kök & Strict RAG Değerlendirme Motoru ---
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

  function evaluateStrictRag(q, docs) {
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

    if (scored.length === 0) {
      return {
        ...q,
        studentAnswer: q.studentAnswer || '(Cevap boş bırakılmış)',
        awardedPoints: 0,
        sourceReference: 'Yüklenen ders kaynaklarında bu konuya ait bilgi bulunamadı.',
        evaluationReasoning: 'Bu sorunun konusu yüklenen ders kaynaklarında yer almamaktadır. Sadece ders kaynaklarına bağlı değerlendirme (RAG) kuralı gereği 0 puan verilmiştir.'
      };
    }

    const best = scored.slice(0, 2);
    const refText = best.map((b) => b.text).join(' ');
    const srcRef = `${best[0].fileName}: "${refText.slice(0, 180)}${refText.length > 180 ? '...' : ''}"`;

    if (!q.studentAnswer || /^(boş|bos|yok|-+)$/i.test(q.studentAnswer) || aTokens.length === 0) {
      return {
        ...q,
        studentAnswer: '(Cevap boş bırakılmış)',
        awardedPoints: 0,
        sourceReference: srcRef,
        evaluationReasoning: `Öğrenci soruyu boş bırakmıştır. Kaynak (${best[0].fileName}) referansı: "${refText.slice(0, 140)}"`
      };
    }

    const refTokens = new Set(tokenize(refText));
    const qSet = new Set(qTokens);
    const targetConcepts = Array.from(refTokens).filter((t) => !qSet.has(t));
    const matched = targetConcepts.filter((c) => aTokens.includes(c));
    const ratio = targetConcepts.length > 0 ? Math.min(1, matched.length / Math.min(targetConcepts.length, 4)) : 0;
    const awarded = ratio >= 0.75 ? q.maxPoints : Math.round(q.maxPoints * ratio);

    return {
      ...q,
      awardedPoints: awarded,
      sourceReference: srcRef,
      evaluationReasoning: awarded === q.maxPoints
        ? `Öğrenci cevabı ders kaynağındaki (${best[0].fileName}) temel kavramlarla (${matched.slice(0, 4).join(', ')}) uyumludur.`
        : awarded > 0
          ? `Öğrenci cevabı ders kaynağındaki (${best[0].fileName}) bazı kavramları (${matched.slice(0, 3).join(', ')}) içermekte ancak kapsam kısmi kalmaktadır.`
          : `Öğrencinin cevabı yüklenen ders kaynağındaki (${best[0].fileName}) bilgilerle örtüşmemektedir.`
    };
  }

  function getScorePillClass(awarded, max) {
    const ratio = max > 0 ? awarded / max : 0;
    if (ratio >= 0.7) return 'high';
    if (ratio >= 0.35) return 'medium';
    return 'low';
  }

  function renderResults(data, clientElapsedMs) {
    lastEvaluationData = data;
    const awarded = Number(data.totalAwardedPoints ?? 0);
    const max = Number(data.totalMaxPoints ?? 100);
    const questions = Array.isArray(data.questions) ? data.questions : [];
    const pct = max > 0 ? Math.round((awarded / max) * 100) : 0;

    evaluationSummary.textContent = data.summary || '';
    totalAwardedEl.textContent = String(awarded);
    totalMaxEl.textContent = String(max);
    if (scorePercentageEl) scorePercentageEl.textContent = `%${pct}`;
    if (scoreProgressFill) scoreProgressFill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    if (evaluatedQuestionCountEl) evaluatedQuestionCountEl.textContent = `${questions.length} Soru`;
    if (evaluatedPagesLabelEl) evaluatedPagesLabelEl.textContent = data.scannedPages.map((p) => p.pageSide).join(' + ');
    if (evaluationDurationEl) evaluationDurationEl.textContent = clientElapsedMs >= 1000 ? `${(clientElapsedMs / 1000).toFixed(2)} sn` : `${Math.max(1, clientElapsedMs)} ms`;

    sourcesBadges.innerHTML = '';
    const badgesFrag = document.createDocumentFragment();
    data.courseMaterials.forEach((doc) => {
      const chip = document.createElement('span');
      chip.className = 'source-chip';
      chip.textContent = `Kaynak: ${doc.fileName} (${doc.fileType})`;
      badgesFrag.appendChild(chip);
    });
    data.scannedPages.forEach((p) => {
      const chip = document.createElement('span');
      chip.className = 'source-chip';
      chip.textContent = `${p.pageSide}: ${p.fileName}`;
      badgesFrag.appendChild(chip);
    });
    sourcesBadges.appendChild(badgesFrag);

    scoreTableBody.innerHTML = '';
    const rowsFrag = document.createDocumentFragment();
    questions.forEach((q) => {
      const tr = document.createElement('tr');
      const pillClass = getScorePillClass(q.awardedPoints, q.maxPoints);
      tr.innerHTML = `
        <td><strong>Soru ${escapeHtml(q.questionNumber)}</strong><br /><span class="page-side-badge">${escapeHtml(q.pageSide)}</span></td>
        <td>${escapeHtml(q.questionText)}</td>
        <td>${escapeHtml(q.studentAnswer)}</td>
        <td><div class="rag-source-ref"><strong>Kaynak:</strong> ${escapeHtml(q.sourceReference)}</div><div>${escapeHtml(q.evaluationReasoning)}</div></td>
        <td class="num-col"><strong>${escapeHtml(q.maxPointsLabel)}</strong></td>
        <td class="num-col"><span class="score-pill ${pillClass}">${escapeHtml(q.awardedPoints)} / ${escapeHtml(q.maxPoints)}</span></td>
      `;
      rowsFrag.appendChild(tr);
    });
    scoreTableBody.appendChild(rowsFrag);
    tableFootMax.textContent = `${max} Puan`;
    tableFootAwarded.textContent = `${awarded} / ${max}`;
    resultsSection.hidden = false;
  }

  if (copyTableBtn) {
    copyTableBtn.addEventListener('click', async () => {
      if (!lastEvaluationData) return;
      const header = ['Soru', 'Sayfa', 'Basılı Soru', 'Öğrenci Cevabı', 'Kaynak Referansı', 'Değerlendirme Gerekçesi', 'Soru Puanı', 'Alınan Puan'];
      const rows = lastEvaluationData.questions.map((q) => [`Soru ${q.questionNumber}`, q.pageSide, q.questionText, q.studentAnswer, q.sourceReference, q.evaluationReasoning, q.maxPoints, q.awardedPoints]);
      rows.push(['GENEL TOPLAM', '', '', '', '', '', lastEvaluationData.totalMaxPoints, lastEvaluationData.totalAwardedPoints]);
      const tsv = [header, ...rows].map((r) => r.join('\t')).join('\n');
      try { await navigator.clipboard.writeText(tsv); copyTableBtn.textContent = 'Kopyalandı!'; setTimeout(() => { copyTableBtn.textContent = 'Tabloyu Kopyala'; }, 1500); } catch (_) {}
    });
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      if (!lastEvaluationData) return;
      const csvEscape = (v) => `"${String(v ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
      const lines = [['Soru No', 'Sayfa', 'Soru', 'Cevap', 'Kaynak', 'Gerekce', 'Max Puan', 'Alinan Puan'].map(csvEscape).join(';')];
      lastEvaluationData.questions.forEach((q) => {
        lines.push([`Soru ${q.questionNumber}`, q.pageSide, q.questionText, q.studentAnswer, q.sourceReference, q.evaluationReasoning, q.maxPoints, q.awardedPoints].map(csvEscape).join(';'));
      });
      const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sinav_degerlendirme_sonucu.csv';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (printResultsBtn) {
    printResultsBtn.addEventListener('click', () => { if (typeof window.print === 'function') window.print(); });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('');
    isCancelled = false;

    const activeCourseFiles = selectedCourseFiles.length > 0 ? selectedCourseFiles : Array.from(courseInput.files || []);
    const activeFrontFile = selectedFrontFile || (frontInput.files && frontInput.files[0]) || null;
    const activeBackFile = selectedBackFile || (backInput.files && backInput.files[0]) || null;

    if (activeCourseFiles.length === 0) {
      showError('Lütfen en az bir ders kaynağı dosyası (PDF, DOCX veya TXT) yükleyiniz.');
      return;
    }
    if (!activeFrontFile) {
      showError('Lütfen Sınav Kağıdı - Ön Yüz fotoğrafını yükleyiniz.');
      return;
    }

    evaluateBtn.disabled = true;
    loadingSection.hidden = false;
    resultsSection.hidden = true;
    const reqStart = Date.now();
    if (loadingElapsed) {
      loadingElapsed.textContent = '';
      elapsedTimerId = setInterval(() => {
        loadingElapsed.textContent = `(${((Date.now() - reqStart) / 1000).toFixed(1)} sn)`;
      }, 200);
    }

    try {
      const parsedDocs = [];
      for (const f of activeCourseFiles) {
        if (isCancelled) return;
        parsedDocs.push(await parseCourseFile(f));
      }

      const frontText = await extractExamText(activeFrontFile);
      if (isCancelled) return;
      const scannedPages = [{ pageSide: 'Ön Yüz', fileName: activeFrontFile.name }];
      const frontQuestions = parseQuestionsFromOcr(frontText, 'Ön Yüz', 1);

      let backQuestions = [];
      if (activeBackFile) {
        const backText = await extractExamText(activeBackFile);
        if (isCancelled) return;
        scannedPages.push({ pageSide: 'Arka Yüz', fileName: activeBackFile.name });
        const nextNum = frontQuestions.length > 0 ? Math.max(...frontQuestions.map((q) => q.questionNumber)) + 1 : 1;
        backQuestions = parseQuestionsFromOcr(backText, 'Arka Yüz', nextNum);
      }

      const allQ = [...frontQuestions, ...backQuestions];
      if (allQ.length === 0) {
        allQ.push({
          questionNumber: 1,
          pageSide: 'Ön Yüz',
          questionText: 'Sınav görselinde okunabilir basılı soru metni tespit edilemedi.',
          maxPoints: 100,
          maxPointsLabel: '100 Puan',
          studentAnswer: '',
          awardedPoints: 0,
          sourceReference: parsedDocs[0].fileName,
          evaluationReasoning: 'Görselde okunabilir soru metni tespit edilemediğinden puan verilememiştir.'
        });
      }

      const evaluated = allQ.map((q) => (q.evaluationReasoning ? q : evaluateStrictRag(q, parsedDocs)));
      const totalMaxPoints = evaluated.reduce((s, q) => s + q.maxPoints, 0);
      const totalAwardedPoints = evaluated.reduce((s, q) => s + q.awardedPoints, 0);

      renderResults({
        summary: `Sınav kağıdı (${scannedPages.map((p) => p.pageSide).join(' + ')}) taranarak ${evaluated.length} soru tespit edilmiş ve sadece yüklenen ${parsedDocs.length} ders kaynağına (RAG) göre değerlendirilmiştir.`,
        totalAwardedPoints,
        totalMaxPoints,
        questions: evaluated,
        courseMaterials: parsedDocs,
        scannedPages
      }, Date.now() - reqStart);
    } catch (err) {
      if (!isCancelled) showError(err.message || 'Değerlendirme sırasında bir hata oluştu.');
    } finally {
      if (elapsedTimerId) { clearInterval(elapsedTimerId); elapsedTimerId = null; }
      evaluateBtn.disabled = false;
      loadingSection.hidden = true;
    }
  });
})();
