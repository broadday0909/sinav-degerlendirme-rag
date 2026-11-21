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

  const frontCardTitle = document.getElementById('front-card-title');
  const frontCardDesc = document.getElementById('front-card-desc');
  const frontDropzoneTitle = document.getElementById('front-dropzone-title');
  const frontDropzoneHint = document.getElementById('front-dropzone-hint');

  const frontPreviewBox = document.getElementById('front-preview-box');
  const frontPreviewImg = document.getElementById('front-preview-img');
  const frontFileName = document.getElementById('front-file-name');
  const clearFrontBtn = document.getElementById('clear-front-btn');

  const backCardTitle = document.getElementById('back-card-title');
  const examSidesGrid = document.getElementById('exam-sides-grid');
  const frontSubHeader = document.getElementById('front-sub-header');
  const singleBackContainer = document.getElementById('single-back-container');
  const batchOptionsContainer = document.getElementById('batch-options-container');
  const batchFilesPanel = document.getElementById('batch-files-panel');
  const batchFilesCount = document.getElementById('batch-files-count');
  const batchFileList = document.getElementById('batch-file-list');
  const clearBatchFilesBtn = document.getElementById('clear-batch-files-btn');
  const batchAutoEnhanceBtn = document.getElementById('batch-auto-enhance-btn');

  const backPreviewBox = document.getElementById('back-preview-box');
  const backPreviewImg = document.getElementById('back-preview-img');
  const backFileName = document.getElementById('back-file-name');
  const clearBackBtn = document.getElementById('clear-back-btn');

  const evaluateBtn = document.getElementById('evaluate-btn');
  const evaluateBtnLabel = document.getElementById('evaluate-btn-label');
  const evalModeStrictBtn = document.getElementById('eval-mode-strict-btn');
  const evalModeHybridBtn = document.getElementById('eval-mode-hybrid-btn');
  const resetBtn = document.getElementById('reset-btn');
  const cancelEvaluateBtn = document.getElementById('cancel-evaluate-btn');
  const errorBanner = document.getElementById('error-banner');
  const loadingSection = document.getElementById('loading-section');
  const loadingTitle = document.getElementById('loading-title');
  const loadingSubtitle = document.getElementById('loading-subtitle');
  const loadingElapsed = document.getElementById('loading-elapsed');

  const resultsSection = document.getElementById('results-section');
  const batchResultsSection = document.getElementById('batch-results-section');
  const historySection = document.getElementById('history-section');
  const analyticsSection = document.getElementById('analytics-section');

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
  const saveSingleHistoryBtn = document.getElementById('save-single-history-btn');
  const copyTableBtn = document.getElementById('copy-table-btn');
  const exportCsvBtn = document.getElementById('export-csv-btn');
  const printResultsBtn = document.getElementById('print-results-btn');

  // Batch sonuç elemanları
  const batchResultsTitle = document.getElementById('batch-results-title');
  const batchResultsSummary = document.getElementById('batch-results-summary');
  const batchClassAvg = document.getElementById('batch-class-avg');
  const batchStudentCount = document.getElementById('batch-student-count');
  const batchMaxScore = document.getElementById('batch-max-score');
  const batchMinScore = document.getElementById('batch-min-score');
  const batchGradeThead = document.getElementById('batch-grade-thead');
  const batchGradeTbody = document.getElementById('batch-grade-tbody');
  const batchExportCsvBtn = document.getElementById('batch-export-csv-btn');
  const batchViewAnalyticsBtn = document.getElementById('batch-view-analytics-btn');
  const batchStudentDetail = document.getElementById('batch-student-detail');
  const batchStudentDetailTitle = document.getElementById('batch-student-detail-title');
  const batchStudentDetailBody = document.getElementById('batch-student-detail-body');
  const closeStudentDetailBtn = document.getElementById('close-student-detail-btn');

  // Geçmiş elemanları
  const refreshHistoryBtn = document.getElementById('refresh-history-btn');
  const historyEmptyState = document.getElementById('history-empty-state');
  const historyTableWrapper = document.getElementById('history-table-wrapper');
  const historyTableBody = document.getElementById('history-table-body');

  // Analiz elemanları
  const analyticsTitle = document.getElementById('analytics-title');
  const analyticsSummaryText = document.getElementById('analytics-summary-text');
  const analyticsExamPills = document.getElementById('analytics-exam-pills');
  const analyticsContent = document.getElementById('analytics-content');
  const analyticsAvgPct = document.getElementById('analytics-avg-pct');
  const analyticsAvgScore = document.getElementById('analytics-avg-score');
  const analyticsStudentCount = document.getElementById('analytics-student-count');
  const analyticsMinMax = document.getElementById('analytics-min-max');
  const analyticsQuestionCount = document.getElementById('analytics-question-count');
  const questionSuccessSvgContainer = document.getElementById('question-success-svg-container');
  const missingConceptsSvgContainer = document.getElementById('missing-concepts-svg-container');
  const gradeDistributionBars = document.getElementById('grade-distribution-bars');
  const analyticsQuestionTbody = document.getElementById('analytics-question-tbody');
  const downloadSuccessSvgBtn = document.getElementById('download-success-svg-btn');
  const downloadConceptsSvgBtn = document.getElementById('download-concepts-svg-btn');

  // Mod sekmeleri
  const modeTabBtns = Array.from(document.querySelectorAll('.mode-tab-btn'));

  let activeMode = 'single'; // 'single' | 'batch' | 'history' | 'analytics'
  let evaluationMode = 'strict'; // 'strict' | 'hybrid'
  let frontInputMode = 'single';
  let selectedCourseFiles = [];
  let selectedFrontFile = null;
  let selectedBackFile = null;
  let selectedBatchFiles = [];
  let batchAutoEnhance = true;
  let lastEvaluationData = null;
  let lastBatchData = null;
  let lastAnalyticsData = null;
  let activeAnalyticsExamId = null;

  let frontObjectUrl = null;
  let backObjectUrl = null;
  let activeAbortController = null;
  let abortReason = null;
  let elapsedTimerId = null;
  let analyticsRequestSeq = 0;

  const enhanceState = {
    front: createDefaultEnhanceState(),
    back: createDefaultEnhanceState()
  };

  function createDefaultEnhanceState() {
    return {
      rotateAngle: 0,
      brightness: 1.0,
      contrast: 1.0,
      autoDeskew: false,
      clahe: false,
      normalize: false,
      binarize: false,
      cropPreset: 'none'
    };
  }

  const ALLOWED_COURSE_EXTS = ['.pdf', '.docx', '.txt'];
  const ALLOWED_IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif', '.svg'];
  const ALLOWED_BATCH_EXTS = [...ALLOWED_IMAGE_EXTS, '.zip'];

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

  function isValidBatchFile(file) {
    if (!file) return false;
    const ext = getFileExtension(file.name);
    const mime = String(file.type || '').toLowerCase();
    return (
      ALLOWED_BATCH_EXTS.includes(ext) ||
      mime.startsWith('image/') ||
      mime === 'application/zip' ||
      mime === 'application/x-zip-compressed'
    );
  }

  function showError(msg) {
    if (!errorBanner) return;
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
      try {
        URL.revokeObjectURL(frontObjectUrl);
      } catch (_) {}
      frontObjectUrl = null;
    } else if (which === 'back' && backObjectUrl) {
      try {
        URL.revokeObjectURL(backObjectUrl);
      } catch (_) {}
      backObjectUrl = null;
    }
  }

  function updateReadinessStatus() {
    const hasCourse = selectedCourseFiles.length > 0;
    const hasFront = activeMode === 'batch' ? selectedBatchFiles.length > 0 : Boolean(selectedFrontFile);
    const hasBack = Boolean(selectedBackFile);

    if (courseCard) courseCard.classList.toggle('has-files', hasCourse);
    if (frontCard) frontCard.classList.toggle('has-files', hasFront || (activeMode === 'single' && hasBack));
    if (backCard) backCard.classList.toggle('has-files', activeMode === 'single' && hasBack);

    if (courseStatusBadge) {
      courseStatusBadge.textContent = hasCourse
        ? `Hazır (${selectedCourseFiles.length})`
        : 'Seçilmedi';
      courseStatusBadge.classList.toggle('ready', hasCourse);
    }

    if (frontStatusBadge) {
      if (activeMode === 'batch') {
        frontStatusBadge.textContent = hasFront ? `Hazır (${selectedBatchFiles.length})` : 'Seçilmedi';
      } else {
        frontStatusBadge.textContent = hasFront ? 'Hazır' : 'Seçilmedi';
      }
      frontStatusBadge.classList.toggle('ready', hasFront);
    }

    if (backStatusBadge) {
      if (activeMode === 'batch') {
        backStatusBadge.textContent = 'Toplu Ayarlar';
        backStatusBadge.classList.toggle('ready', true);
      } else {
        backStatusBadge.textContent = hasBack ? 'Hazır' : 'Boş Bırakılabilir';
        backStatusBadge.classList.toggle('ready', hasBack);
      }
    }

    if (readinessIndicator) {
      if (activeMode === 'history') {
        readinessIndicator.textContent = 'Görünüm: Değerlendirme Geçmişi';
        readinessIndicator.classList.add('is-ready');
      } else if (activeMode === 'analytics') {
        readinessIndicator.textContent = 'Görünüm: Soru Bazlı Analiz';
        readinessIndicator.classList.add('is-ready');
      } else if (activeMode === 'batch') {
        if (hasCourse && hasFront) {
          readinessIndicator.textContent = `Hazır: ${selectedBatchFiles.length} Kağıt / Arşiv Toplu Değerlendirilebilir`;
          readinessIndicator.classList.add('is-ready');
        } else {
          readinessIndicator.textContent = 'Toplu Mod: Ders Kaynağı + Sınav Kağıtları Bekleniyor';
          readinessIndicator.classList.remove('is-ready');
        }
      } else if (hasCourse && hasFront) {
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

  function switchMode(newMode, opts = {}) {
    const prevMode = activeMode;
    activeMode = newMode;
    showError('');

    if ((newMode === 'batch' || newMode === 'single') && prevMode !== newMode && frontInputMode !== newMode) {
      try {
        if (frontInput) frontInput.value = '';
      } catch (_) {}
    }

    modeTabBtns.forEach((btn) => {
      const isMatch = btn.getAttribute('data-mode') === newMode;
      btn.classList.toggle('is-active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    const isEvalMode = newMode === 'single' || newMode === 'batch';
    if (form) form.hidden = !isEvalMode;
    if (loadingSection) loadingSection.hidden = true;

    if (resultsSection) {
      resultsSection.hidden = !(newMode === 'single' && lastEvaluationData);
    }
    if (batchResultsSection) {
      batchResultsSection.hidden = !(newMode === 'batch' && lastBatchData);
    }
    if (historySection) {
      historySection.hidden = newMode !== 'history';
    }
    if (analyticsSection) {
      analyticsSection.hidden = newMode !== 'analytics';
    }

    if (newMode === 'batch') {
      if (frontInput) {
        frontInput.setAttribute('multiple', '');
        frontInput.setAttribute('accept', 'image/*,.png,.jpg,.jpeg,.webp,.zip,application/zip');
      }
      if (frontCardTitle) frontCardTitle.textContent = 'Sınav Kağıtları (Çoklu Görsel veya ZIP)';
      if (frontCardDesc) {
        frontCardDesc.innerHTML = 'Tüm öğrencilerin sınav kağıtlarını (<strong>çoklu PNG/JPG</strong> veya <strong>ZIP arşivi</strong>) seçin veya sürükleyin.';
      }
      if (frontDropzoneTitle) frontDropzoneTitle.textContent = 'Çoklu sınav kağıtlarını veya ZIP dosyasını seçin';
      if (frontDropzoneHint) frontDropzoneHint.textContent = 'Birden fazla görsel veya ön/arka yüz eşleştirilmiş .zip arşivi';
      if (frontPreviewBox) frontPreviewBox.hidden = true;
      if (examSidesGrid) examSidesGrid.classList.add('is-batch');
      if (frontSubHeader) frontSubHeader.hidden = true;
      if (batchFilesPanel) batchFilesPanel.hidden = selectedBatchFiles.length === 0;
      if (singleBackContainer) singleBackContainer.hidden = true;
      if (batchOptionsContainer) batchOptionsContainer.hidden = false;
      if (backCardTitle) backCardTitle.textContent = 'Toplu Değerlendirme Ayarları';
      if (evaluateBtnLabel) evaluateBtnLabel.textContent = 'Toplu Değerlendirmeyi Başlat (Batch + RAG)';
    } else if (newMode === 'single') {
      if (frontInput) {
        frontInput.removeAttribute('multiple');
        frontInput.setAttribute('accept', 'image/*,.png,.jpg,.jpeg,.webp');
      }
      if (frontCardTitle) frontCardTitle.textContent = 'Sınav Kağıdı Yükleme ve Ayarlar';
      if (frontCardDesc) {
        frontCardDesc.innerHTML = 'Öğrencinin sınav kağıdının <strong>ön yüzünü</strong> (zorunlu) ve varsa <strong>arka yüzünü</strong> (opsiyonel) yükleyiniz.';
      }
      if (frontDropzoneTitle) frontDropzoneTitle.textContent = 'Ön yüz fotoğrafını seçin veya sürükleyin';
      if (frontDropzoneHint) frontDropzoneHint.textContent = 'PNG, JPG, JPEG, WEBP';
      if (examSidesGrid) examSidesGrid.classList.remove('is-batch');
      if (frontSubHeader) frontSubHeader.hidden = false;
      if (batchFilesPanel) batchFilesPanel.hidden = true;
      if (frontPreviewBox) frontPreviewBox.hidden = !selectedFrontFile;
      if (singleBackContainer) singleBackContainer.hidden = false;
      if (batchOptionsContainer) batchOptionsContainer.hidden = true;
      if (backCardTitle) backCardTitle.textContent = 'Arka Yüz';
      if (evaluateBtnLabel) evaluateBtnLabel.textContent = 'Sınav Kağıdını Değerlendir (Vision + RAG)';
    } else if (newMode === 'history') {
      loadHistoryList();
    } else if (newMode === 'analytics') {
      loadAnalyticsView(opts.targetExamId || null, opts.gradeListFallback || null);
    }

    updateReadinessStatus();
  }

  function setEvaluationMode(mode) {
    evaluationMode = mode === 'hybrid' ? 'hybrid' : 'strict';
    if (evalModeStrictBtn) {
      const isStrict = evaluationMode === 'strict';
      evalModeStrictBtn.classList.toggle('is-selected', isStrict);
      evalModeStrictBtn.setAttribute('aria-pressed', isStrict ? 'true' : 'false');
    }
    if (evalModeHybridBtn) {
      const isHybrid = evaluationMode === 'hybrid';
      evalModeHybridBtn.classList.toggle('is-selected', isHybrid);
      evalModeHybridBtn.setAttribute('aria-pressed', isHybrid ? 'true' : 'false');
    }
  }

  if (evalModeStrictBtn) {
    evalModeStrictBtn.addEventListener('click', () => setEvaluationMode('strict'));
  }
  if (evalModeHybridBtn) {
    evalModeHybridBtn.addEventListener('click', () => setEvaluationMode('hybrid'));
  }

  modeTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetMode = btn.getAttribute('data-mode');
      if (targetMode) switchMode(targetMode);
    });
  });

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
        if (selectedCourseFiles.length === 0) {
          courseInput.value = '';
        }
        renderCourseFiles();
      });
      fragment.appendChild(li);
    });
    courseFileList.appendChild(fragment);
    updateReadinessStatus();
  }

  function renderBatchFiles() {
    if (!batchFileList) return;
    batchFileList.innerHTML = '';
    const totalBytes = selectedBatchFiles.reduce((sum, f) => sum + (f.size || 0), 0);

    if (batchFilesPanel) {
      batchFilesPanel.hidden = activeMode !== 'batch' || selectedBatchFiles.length === 0;
    }
    if (batchFilesCount) {
      batchFilesCount.textContent = `${selectedBatchFiles.length} dosya (${formatSize(totalBytes)})`;
    }

    const fragment = document.createDocumentFragment();
    selectedBatchFiles.forEach((file, index) => {
      const li = document.createElement('li');
      li.className = 'file-item';
      li.innerHTML = `
        <span class="file-item-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)} (${formatSize(file.size)})</span>
        <button type="button" class="remove-btn" data-index="${index}">Kaldır</button>
      `;
      li.querySelector('button').addEventListener('click', () => {
        selectedBatchFiles.splice(index, 1);
        if (selectedBatchFiles.length === 0) {
          frontInput.value = '';
        }
        renderBatchFiles();
      });
      fragment.appendChild(li);
    });
    batchFileList.appendChild(fragment);
    updateReadinessStatus();
  }

  function updateImagePreview(file, previewBox, previewImg, fileNameEl, sideKey) {
    revokePreviewUrl(sideKey);

    if (!file) {
      previewBox.hidden = true;
      const panel = document.getElementById(`${sideKey}-enhance-panel`);
      if (panel) panel.hidden = true;
      previewImg.removeAttribute('src');
      fileNameEl.textContent = '';
      resetEnhanceState(sideKey);
      updateReadinessStatus();
      return;
    }

    fileNameEl.textContent = `${file.name} (${formatSize(file.size)})`;
    previewBox.hidden = activeMode !== 'single';

    if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      const objUrl = URL.createObjectURL(file);
      if (sideKey === 'front') frontObjectUrl = objUrl;
      if (sideKey === 'back') backObjectUrl = objUrl;
      previewImg.src = objUrl;
    }
    resetEnhanceState(sideKey);
    updateReadinessStatus();
  }

  function mergeUniqueFiles(existing, incoming) {
    const map = new Map();
    for (const f of existing) {
      map.set(`${f.name}::${f.size}`, f);
    }
    for (const f of incoming) {
      map.set(`${f.name}::${f.size}`, f);
    }
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
      selectedCourseFiles = mergeUniqueFiles(selectedCourseFiles, files);
      renderCourseFiles();
    }
  });

  frontInput.addEventListener('change', () => {
    showError('');
    frontInputMode = activeMode;
    const files = Array.from(frontInput.files || []);
    if (activeMode === 'batch') {
      if (files.length > 0) {
        const invalid = files.find((f) => !isValidBatchFile(f));
        if (invalid) {
          frontInput.value = '';
          showError(`Desteklenmeyen toplu dosya formatı (${invalid.name}). Lütfen görsel (PNG/JPG/WEBP) veya ZIP yükleyiniz.`);
          return;
        }
        selectedBatchFiles = mergeUniqueFiles(selectedBatchFiles, files);
        renderBatchFiles();
      }
      return;
    }

    const file = files[0] || null;
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

  if (clearBatchFilesBtn) {
    clearBatchFilesBtn.addEventListener('click', () => {
      selectedBatchFiles = [];
      frontInput.value = '';
      renderBatchFiles();
    });
  }

  if (clearFrontBtn) {
    clearFrontBtn.addEventListener('click', () => {
      selectedFrontFile = null;
      frontInput.value = '';
      updateImagePreview(null, frontPreviewBox, frontPreviewImg, frontFileName, 'front');
    });
  }

  if (clearBackBtn) {
    clearBackBtn.addEventListener('click', () => {
      selectedBackFile = null;
      backInput.value = '';
      updateImagePreview(null, backPreviewBox, backPreviewImg, backFileName, 'back');
    });
  }

  function setupDropzone(dropzoneEl, inputEl, onDropFiles) {
    if (!dropzoneEl) return;
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
        if (inputEl && typeof inputEl.click === 'function') {
          inputEl.click();
        }
      }
    });
  }

  setupDropzone(courseDropzone, courseInput, (files) => {
    const invalid = files.find((f) => !isValidCourseFile(f));
    if (invalid) {
      showError(`Desteklenmeyen dosya formatı (${invalid.name}). Lütfen sadece PDF, DOCX veya TXT yükleyiniz.`);
      return;
    }
    selectedCourseFiles = mergeUniqueFiles(selectedCourseFiles, files);
    renderCourseFiles();
  });

  setupDropzone(frontDropzone, frontInput, (files) => {
    if (activeMode === 'batch') {
      const invalid = files.find((f) => !isValidBatchFile(f));
      if (invalid) {
        showError(`Desteklenmeyen toplu dosya formatı (${invalid.name}). Lütfen görsel (PNG/JPG/WEBP) veya ZIP yükleyiniz.`);
        return;
      }
      selectedBatchFiles = mergeUniqueFiles(selectedBatchFiles, files);
      renderBatchFiles();
      return;
    }

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

  // =========================================================================
  // Görüntü İyileştirme Stüdyosu (R2)
  // =========================================================================

  function resetEnhanceState(side) {
    enhanceState[side] = createDefaultEnhanceState();
    syncEnhanceUi(side);
    const statusEl = document.getElementById(`${side}-enhance-status`);
    if (statusEl) statusEl.textContent = '';
  }

  function hasActiveEnhancement(side) {
    const st = enhanceState[side];
    if (!st) return false;
    return (
      st.rotateAngle !== 0 ||
      st.brightness !== 1.0 ||
      st.contrast !== 1.0 ||
      st.autoDeskew ||
      st.clahe ||
      st.normalize ||
      st.binarize ||
      st.cropPreset !== 'none'
    );
  }

  function syncEnhanceUi(side) {
    const st = enhanceState[side];
    const angleEl = document.getElementById(`${side}-angle-val`);
    const brightEl = document.getElementById(`${side}-brightness-val`);
    const contrastEl = document.getElementById(`${side}-contrast-val`);
    const cropEl = document.getElementById(`${side}-crop-val`);

    if (angleEl) angleEl.textContent = `${st.rotateAngle}°`;
    if (brightEl) brightEl.textContent = st.brightness.toFixed(1);
    if (contrastEl) contrastEl.textContent = st.contrast.toFixed(1);

    const cropNames = {
      none: 'Tam',
      margin5: '%5 Kenar',
      margin10: '%10 Kenar',
      top50: 'Üst Yarı',
      bottom50: 'Alt Yarı'
    };
    if (cropEl) cropEl.textContent = cropNames[st.cropPreset] || 'Tam';

    const deskewBtn = document.getElementById(`${side}-deskew-btn`);
    const claheBtn = document.getElementById(`${side}-clahe-btn`);
    const normBtn = document.getElementById(`${side}-normalize-btn`);
    const binBtn = document.getElementById(`${side}-binarize-btn`);

    if (deskewBtn) deskewBtn.setAttribute('aria-pressed', String(st.autoDeskew));
    if (claheBtn) claheBtn.setAttribute('aria-pressed', String(st.clahe));
    if (normBtn) normBtn.setAttribute('aria-pressed', String(st.normalize));
    if (binBtn) binBtn.setAttribute('aria-pressed', String(st.binarize));

    document.querySelectorAll(`[data-side="${side}"][data-crop]`).forEach((btn) => {
      btn.classList.toggle('is-selected', btn.getAttribute('data-crop') === st.cropPreset);
    });
  }

  const CROP_PRESETS = {
    margin5: { unit: 'percent', left: 5, top: 5, width: 90, height: 90 },
    margin10: { unit: 'percent', left: 10, top: 10, width: 80, height: 80 },
    top50: { unit: 'percent', left: 0, top: 0, width: 100, height: 50 },
    bottom50: { unit: 'percent', left: 0, top: 50, width: 100, height: 50 }
  };

  function buildEnhancePayload(side) {
    const st = enhanceState[side];
    const opts = {};
    if (st.rotateAngle !== 0) opts.rotateAngle = st.rotateAngle;
    if (st.brightness !== 1.0) opts.brightness = Number(st.brightness.toFixed(2));
    if (st.contrast !== 1.0) opts.contrast = Number(st.contrast.toFixed(2));
    if (st.autoDeskew) opts.autoDeskew = true;
    if (st.clahe) opts.clahe = true;
    if (st.normalize) opts.normalize = true;
    if (st.binarize) opts.binarize = true;

    if (CROP_PRESETS[st.cropPreset]) {
      opts.crop = { ...CROP_PRESETS[st.cropPreset] };
    }

    return opts;
  }

  async function requestEnhancePreview(side) {
    const file = side === 'front' ? selectedFrontFile : selectedBackFile;
    if (!file) return;
    const statusEl = document.getElementById(`${side}-enhance-status`);
    const previewImg = side === 'front' ? frontPreviewImg : backPreviewImg;
    if (statusEl) statusEl.textContent = 'Önizleme hazırlanıyor...';

    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('options', JSON.stringify(buildEnhancePayload(side)));
      const resp = await fetch('/api/image/enhance?preview=true', {
        method: 'POST',
        body: fd
      });
      const json = await resp.json();
      if (!resp.ok) {
        throw new Error((json && json.error) || 'Önizleme başarısız.');
      }
      if (json.previewUrl && previewImg) {
        previewImg.src = json.previewUrl;
      }
      const ops = (json.metadata && json.metadata.appliedOperations) || [];
      if (statusEl) {
        statusEl.textContent = ops.length > 0 ? `Uygulandı: ${ops.join(', ')}` : 'Orijinal görünüm';
      }
    } catch (err) {
      if (statusEl) statusEl.textContent = err.message || 'Hata';
    }
  }

  ['front', 'back'].forEach((side) => {
    const toggleBtn = document.getElementById(`${side}-enhance-toggle-btn`);
    const panel = document.getElementById(`${side}-enhance-panel`);
    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', () => {
        panel.hidden = !panel.hidden;
      });
    }

    const previewBtn = document.getElementById(`${side}-preview-enhance-btn`);
    if (previewBtn) {
      previewBtn.addEventListener('click', () => requestEnhancePreview(side));
    }

    const resetEnhBtn = document.getElementById(`${side}-reset-enhance-btn`);
    if (resetEnhBtn) {
      resetEnhBtn.addEventListener('click', () => {
        resetEnhanceState(side);
        const file = side === 'front' ? selectedFrontFile : selectedBackFile;
        const imgEl = side === 'front' ? frontPreviewImg : backPreviewImg;
        const objUrl = side === 'front' ? frontObjectUrl : backObjectUrl;
        if (file && imgEl && objUrl) {
          imgEl.src = objUrl;
        }
      });
    }

    const toggleMap = [
      ['deskew', 'autoDeskew'],
      ['clahe', 'clahe'],
      ['normalize', 'normalize'],
      ['binarize', 'binarize']
    ];
    toggleMap.forEach(([idKey, stateKey]) => {
      const btn = document.getElementById(`${side}-${idKey}-btn`);
      if (btn) {
        btn.addEventListener('click', () => {
          enhanceState[side][stateKey] = !enhanceState[side][stateKey];
          syncEnhanceUi(side);
        });
      }
    });
  });

  const ENHANCE_ACTIONS = {
    'rot-left': (st) => { st.rotateAngle = (st.rotateAngle - 90 + 360) % 360; },
    'rot-right': (st) => { st.rotateAngle = (st.rotateAngle + 90) % 360; },
    'rot-180': (st) => { st.rotateAngle = (st.rotateAngle + 180) % 360; },
    'rot-m5': (st) => { st.rotateAngle = (st.rotateAngle - 5 + 360) % 360; },
    'rot-p5': (st) => { st.rotateAngle = (st.rotateAngle + 5) % 360; },
    'bright-down': (st) => { st.brightness = Math.max(0.4, Number((st.brightness - 0.1).toFixed(1))); },
    'bright-up': (st) => { st.brightness = Math.min(2.0, Number((st.brightness + 0.1).toFixed(1))); },
    'contrast-down': (st) => { st.contrast = Math.max(0.4, Number((st.contrast - 0.1).toFixed(1))); },
    'contrast-up': (st) => { st.contrast = Math.min(2.0, Number((st.contrast + 0.1).toFixed(1))); }
  };

  document.addEventListener('click', (e) => {
    if (!e.target || typeof e.target.closest !== 'function') return;
    const actionBtn = e.target.closest('[data-action][data-side]');
    if (actionBtn) {
      const side = actionBtn.getAttribute('data-side');
      const action = actionBtn.getAttribute('data-action');
      const st = enhanceState[side];
      const handler = ENHANCE_ACTIONS[action];
      if (!st || !handler) return;

      handler(st);
      syncEnhanceUi(side);
      return;
    }

    const cropBtn = e.target.closest('[data-crop][data-side]');
    if (cropBtn) {
      const side = cropBtn.getAttribute('data-side');
      const crop = cropBtn.getAttribute('data-crop');
      if (enhanceState[side]) {
        enhanceState[side].cropPreset = crop;
        syncEnhanceUi(side);
      }
    }
  });

  if (batchAutoEnhanceBtn) {
    batchAutoEnhanceBtn.addEventListener('click', () => {
      batchAutoEnhance = !batchAutoEnhance;
      batchAutoEnhanceBtn.setAttribute('aria-checked', batchAutoEnhance ? 'true' : 'false');
      batchAutoEnhanceBtn.classList.toggle('is-selected', batchAutoEnhance);
      batchAutoEnhanceBtn.textContent = batchAutoEnhance
        ? 'Aktif (Eğim + Normalize)'
        : 'Kapalı (Ham Görseller)';
    });
  }

  resetBtn.addEventListener('click', () => {
    if (activeAbortController) {
      abortReason = 'reset';
      activeAbortController.abort();
      activeAbortController = null;
    }
    selectedCourseFiles = [];
    selectedFrontFile = null;
    selectedBackFile = null;
    selectedBatchFiles = [];
    lastEvaluationData = null;
    lastBatchData = null;
    courseInput.value = '';
    frontInput.value = '';
    backInput.value = '';
    renderCourseFiles();
    renderBatchFiles();
    updateImagePreview(null, frontPreviewBox, frontPreviewImg, frontFileName, 'front');
    updateImagePreview(null, backPreviewBox, backPreviewImg, backFileName, 'back');
    showError('');
    if (resultsSection) resultsSection.hidden = true;
    if (batchResultsSection) batchResultsSection.hidden = true;
  });

  if (cancelEvaluateBtn) {
    cancelEvaluateBtn.addEventListener('click', () => {
      if (activeAbortController) {
        abortReason = 'cancel';
        activeAbortController.abort();
        activeAbortController = null;
      }
    });
  }

  // Tema Yönetimi (Açık / Koyu)
  function applyTheme(theme) {
    const target = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', target);
    if (themeToggleLabel) {
      themeToggleLabel.textContent = target === 'dark' ? 'Açık Tema' : 'Koyu Tema';
    }
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('tubitak_gui_theme', target);
      }
    } catch (_) {}
  }

  try {
    const savedTheme =
      typeof localStorage !== 'undefined' ? localStorage.getItem('tubitak_gui_theme') : null;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      applyTheme(savedTheme);
    }
  } catch (_) {}

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  function getScorePillClass(awarded, max) {
    const ratio = max > 0 ? awarded / max : 0;
    if (ratio >= 0.7) return 'high';
    if (ratio >= 0.35) return 'medium';
    return 'low';
  }

  function renderResults(data, clientElapsedMs) {
    lastEvaluationData = data;
    if (saveSingleHistoryBtn) {
      saveSingleHistoryBtn.disabled = false;
      saveSingleHistoryBtn.textContent = 'Geçmişe Kaydet';
    }

    const awarded = Number(data.totalAwardedPoints ?? 0);
    const max = Number(data.totalMaxPoints ?? 100);
    const questions = Array.isArray(data.questions) ? data.questions : [];
    const pct = max > 0 ? Math.round((awarded / max) * 100) : 0;

    evaluationSummary.textContent = data.summary || '';
    totalAwardedEl.textContent = String(awarded);
    totalMaxEl.textContent = String(max);

    if (scorePercentageEl) {
      scorePercentageEl.textContent = `%${pct}`;
    }
    if (scoreProgressFill) {
      scoreProgressFill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    }
    if (evaluatedQuestionCountEl) {
      evaluatedQuestionCountEl.textContent = `${questions.length} Soru`;
    }
    if (evaluatedPagesLabelEl) {
      const pages = Array.isArray(data.scannedPages)
        ? data.scannedPages.map((p) => p.pageSide).join(' + ')
        : 'Ön Yüz';
      evaluatedPagesLabelEl.textContent = pages || 'Ön Yüz';
    }
    if (evaluationDurationEl) {
      const ms = Number(data.evaluationTimeMs || clientElapsedMs || 0);
      evaluationDurationEl.textContent = ms >= 1000 ? `${(ms / 1000).toFixed(2)} sn` : `${Math.max(1, ms)} ms`;
    }

    sourcesBadges.innerHTML = '';
    const badgesFrag = document.createDocumentFragment();
    if (Array.isArray(data.courseMaterials)) {
      data.courseMaterials.forEach((doc) => {
        const chip = document.createElement('span');
        chip.className = 'source-chip';
        chip.textContent = `Kaynak: ${doc.fileName} (${doc.fileType})`;
        badgesFrag.appendChild(chip);
      });
    }
    if (Array.isArray(data.scannedPages)) {
      data.scannedPages.forEach((p) => {
        const chip = document.createElement('span');
        chip.className = 'source-chip';
        const enhOps = p.enhancement && Array.isArray(p.enhancement.appliedOperations) && p.enhancement.appliedOperations.length > 0
          ? ` [${p.enhancement.appliedOperations.join(', ')}]`
          : '';
        chip.textContent = `${p.pageSide}: ${p.fileName}${enhOps}`;
        badgesFrag.appendChild(chip);
      });
    }
    sourcesBadges.appendChild(badgesFrag);

    scoreTableBody.innerHTML = '';
    const rowsFrag = document.createDocumentFragment();

    questions.forEach((q) => {
      const tr = document.createElement('tr');
      const pillClass = getScorePillClass(q.awardedPoints, q.maxPoints);
      const reviewBadgeHtml = q.needsReview
        ? '<div class="review-needed-badge">Hibrit Öneri • İnceleme Gerekli</div>'
        : '';
      const missingHtml = Array.isArray(q.missingConcepts) && q.missingConcepts.length > 0
        ? `<div class="missing-concepts-row">${q.missingConcepts
            .map((c) => `<span class="missing-concept-badge">Eksik: ${escapeHtml(c)}</span>`)
            .join('')}</div>`
        : '';

      tr.innerHTML = `
        <td>
          <strong>Soru ${escapeHtml(q.questionNumber)}</strong><br />
          <span class="page-side-badge">${escapeHtml(q.pageSide || 'Ön Yüz')}</span>
        </td>
        <td>${escapeHtml(q.questionText)}</td>
        <td>${escapeHtml(q.studentAnswer)}</td>
        <td>
          ${reviewBadgeHtml}
          <div class="rag-source-ref"><strong>Kaynak:</strong> ${escapeHtml(q.sourceReference)}</div>
          <div>${escapeHtml(q.evaluationReasoning)}</div>
          ${missingHtml}
        </td>
        <td class="num-col"><strong>${escapeHtml(q.maxPointsLabel || `${q.maxPoints} Puan`)}</strong></td>
        <td class="num-col">
          <span class="score-pill ${pillClass}">${escapeHtml(q.awardedPoints)} / ${escapeHtml(q.maxPoints)}</span>
        </td>
      `;
      rowsFrag.appendChild(tr);
    });
    scoreTableBody.appendChild(rowsFrag);

    tableFootMax.textContent = `${max} Puan`;
    tableFootAwarded.textContent = `${awarded} / ${max}`;
    resultsSection.hidden = false;
  }

  // Tekli Değerlendirmeyi Geçmişe Kaydetme
  if (saveSingleHistoryBtn) {
    saveSingleHistoryBtn.addEventListener('click', async () => {
      if (!lastEvaluationData) return;
      saveSingleHistoryBtn.disabled = true;
      saveSingleHistoryBtn.textContent = 'Kaydediliyor...';
      try {
        const title =
          (lastEvaluationData.courseMaterials &&
            lastEvaluationData.courseMaterials[0] &&
            lastEvaluationData.courseMaterials[0].fileName.replace(/\.[^/.]+$/, '')) ||
          'Tekli Sınav Değerlendirmesi';
        const resp = await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            courseMaterials: lastEvaluationData.courseMaterials || [],
            gradeList: {
              examTitle: title,
              studentCount: 1,
              classAverage: lastEvaluationData.totalAwardedPoints,
              maxScore: lastEvaluationData.totalAwardedPoints,
              minScore: lastEvaluationData.totalAwardedPoints,
              students: [
                {
                  studentNumber: 'TEKLİ-1',
                  studentName:
                    (lastEvaluationData.scannedPages &&
                      lastEvaluationData.scannedPages[0] &&
                      lastEvaluationData.scannedPages[0].fileName) ||
                    'Öğrenci Kağıdı',
                  awardedPoints: lastEvaluationData.totalAwardedPoints,
                  totalAwardedPoints: lastEvaluationData.totalAwardedPoints,
                  maxPoints: lastEvaluationData.totalMaxPoints,
                  totalMaxPoints: lastEvaluationData.totalMaxPoints,
                  questionResults: (lastEvaluationData.questions || []).map((q) => ({
                    questionNumber: q.questionNumber,
                    questionText: q.questionText,
                    awardedPoints: q.awardedPoints,
                    maxPoints: q.maxPoints,
                    reasoning: q.evaluationReasoning,
                    missingConcepts: q.missingConcepts || []
                  }))
                }
              ]
            }
          })
        });
        const json = await resp.json();
        if (!resp.ok) throw new Error((json && json.error) || 'Kaydedilemedi.');
        lastEvaluationData.savedExamId = json.examId;
        saveSingleHistoryBtn.textContent = 'Kaydedildi ✓';
      } catch (err) {
        saveSingleHistoryBtn.disabled = false;
        saveSingleHistoryBtn.textContent = 'Geçmişe Kaydet';
        showError(err.message || 'Geçmişe kaydedilirken hata oluştu.');
      }
    });
  }

  // =========================================================================
  // Toplu Değerlendirme Sonuçları (Sınıf Not Listesi)
  // =========================================================================

  function renderBatchResults(gradeList) {
    lastBatchData = gradeList;
    if (!batchResultsSection) return;

    const students = Array.isArray(gradeList.students) ? gradeList.students : [];
    const title = gradeList.examTitle || gradeList.title || 'Sınıf Not Listesi';

    if (batchResultsTitle) batchResultsTitle.textContent = title;
    if (batchResultsSummary) {
      batchResultsSummary.textContent = `${students.length} öğrenci kağıdı değerlendirildi${
        gradeList.id || gradeList.examId ? ' ve Değerlendirme Geçmişine kaydedildi' : ''
      }.`;
    }

    if (batchClassAvg) batchClassAvg.textContent = String(gradeList.classAverage ?? 0);
    if (batchStudentCount) batchStudentCount.textContent = String(students.length);
    if (batchMaxScore) batchMaxScore.textContent = String(gradeList.maxScore ?? 0);
    if (batchMinScore) batchMinScore.textContent = String(gradeList.minScore ?? 0);

    // Dinamik soru sütunları
    const qNumSet = new Set();
    students.forEach((s) => {
      const qs = Array.isArray(s.questionResults) ? s.questionResults : s.questions || [];
      qs.forEach((q) => {
        if (q && q.questionNumber != null && Number.isFinite(Number(q.questionNumber))) {
          qNumSet.add(Number(q.questionNumber));
        }
      });
    });
    const sortedQNums = Array.from(qNumSet).sort((a, b) => a - b);

    if (batchGradeThead) {
      batchGradeThead.innerHTML = `
        <tr>
          <th>Öğrenci No</th>
          <th>Ad Soyad</th>
          ${sortedQNums.map((n) => `<th class="num-col">Soru ${n}</th>`).join('')}
          <th class="num-col">Toplam Puan</th>
          <th class="num-col">Detay</th>
        </tr>
      `;
    }

    if (batchGradeTbody) {
      batchGradeTbody.innerHTML = '';
      const frag = document.createDocumentFragment();
      students.forEach((s, idx) => {
        const qs = Array.isArray(s.questionResults) ? s.questionResults : s.questions || [];
        const qMap = new Map(qs.map((q) => [Number(q.questionNumber), q]));
        const awarded = s.totalAwardedPoints ?? s.awardedPoints ?? 0;
        const max = s.totalMaxPoints ?? s.maxPoints ?? 100;
        const pillClass = getScorePillClass(awarded, max);

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${escapeHtml(s.studentNumber || '-')}</strong></td>
          <td>${escapeHtml(s.studentName || '-')}</td>
          ${sortedQNums
            .map((n) => {
              const q = qMap.get(n);
              return `<td class="num-col">${q ? `${escapeHtml(q.awardedPoints)} / ${escapeHtml(q.maxPoints)}` : '-'}</td>`;
            })
            .join('')}
          <td class="num-col"><span class="score-pill ${pillClass}">${escapeHtml(awarded)} / ${escapeHtml(max)}</span></td>
          <td class="num-col"><button type="button" class="mini-btn" data-student-idx="${idx}">İncele</button></td>
        `;
        tr.querySelector('button').addEventListener('click', () => showStudentDetailDrawer(s));
        frag.appendChild(tr);
      });
      batchGradeTbody.appendChild(frag);
    }

    if (batchStudentDetail) batchStudentDetail.hidden = true;
    batchResultsSection.hidden = false;
  }

  function showStudentDetailDrawer(student) {
    if (!batchStudentDetail || !batchStudentDetailTitle || !batchStudentDetailBody) return;
    const qs = Array.isArray(student.questionResults) ? student.questionResults : student.questions || [];
    batchStudentDetailTitle.textContent = `${student.studentNumber || ''} — ${student.studentName || 'Öğrenci'} (${student.totalAwardedPoints ?? student.awardedPoints ?? 0} / ${student.totalMaxPoints ?? student.maxPoints ?? 100})`;
    batchStudentDetailBody.innerHTML = `
      <div class="table-wrapper">
        <table class="score-table">
          <thead>
            <tr>
              <th>Soru</th>
              <th>Gerekçe &amp; Eksik Kavramlar</th>
              <th class="num-col">Puan</th>
            </tr>
          </thead>
          <tbody>
            ${qs
              .map(
                (q) => `
              <tr>
                <td><strong>Soru ${escapeHtml(q.questionNumber)}</strong></td>
                <td>
                  ${q.needsReview ? '<div class="review-needed-badge">Hibrit Öneri • İnceleme Gerekli</div>' : ''}
                  <div>${escapeHtml(q.reasoning || q.feedback || '-')}</div>
                  ${
                    Array.isArray(q.missingConcepts) && q.missingConcepts.length > 0
                      ? q.missingConcepts
                          .map((c) => `<span class="missing-concept-badge">Eksik: ${escapeHtml(c)}</span>`)
                          .join('')
                      : ''
                  }
                </td>
                <td class="num-col"><strong>${escapeHtml(q.awardedPoints ?? 0)} / ${escapeHtml(q.maxPoints ?? 0)}</strong></td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;
    batchStudentDetail.hidden = false;
  }

  if (closeStudentDetailBtn) {
    closeStudentDetailBtn.addEventListener('click', () => {
      if (batchStudentDetail) batchStudentDetail.hidden = true;
    });
  }

  function downloadGradeListCsv(gradeList) {
    if (!gradeList || !Array.isArray(gradeList.students)) return;
    const qNumSet = new Set();
    gradeList.students.forEach((s) => {
      const qs = Array.isArray(s.questionResults) ? s.questionResults : s.questions || [];
      qs.forEach((q) => {
        if (q && q.questionNumber != null && Number.isFinite(Number(q.questionNumber))) {
          qNumSet.add(Number(q.questionNumber));
        }
      });
    });
    const sortedQNums = Array.from(qNumSet).sort((a, b) => a - b);
    const esc = (v) => {
      const str = String(v ?? '');
      return str.includes(';') || str.includes('"') || str.includes('\n') || str.includes('\r')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    };

    const headers = ['Öğrenci No', 'Ad Soyad', ...sortedQNums.map((n) => `Soru ${n}`), 'Toplam Puan'];
    const rows = [headers.map(esc).join(';')];
    gradeList.students.forEach((s) => {
      const qs = Array.isArray(s.questionResults) ? s.questionResults : s.questions || [];
      const qMap = new Map(qs.map((q) => [Number(q.questionNumber), q.awardedPoints ?? 0]));
      const total = s.totalAwardedPoints ?? s.awardedPoints ?? 0;
      rows.push(
        [
          esc(s.studentNumber || ''),
          esc(s.studentName || ''),
          ...sortedQNums.map((n) => esc(qMap.has(n) ? qMap.get(n) : 0)),
          esc(total)
        ].join(';')
      );
    });

    const csv = '\uFEFF' + rows.join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sinif_not_listesi.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  if (batchExportCsvBtn) {
    batchExportCsvBtn.addEventListener('click', () => {
      if (lastBatchData) downloadGradeListCsv(lastBatchData);
    });
  }

  if (batchViewAnalyticsBtn) {
    batchViewAnalyticsBtn.addEventListener('click', () => {
      if (!lastBatchData) return;
      const examId = lastBatchData.id || lastBatchData.examId;
      switchMode('analytics', {
        targetExamId: examId || null,
        gradeListFallback: examId ? null : lastBatchData
      });
    });
  }

  // =========================================================================
  // Değerlendirme Geçmişi (R3)
  // =========================================================================

  async function loadHistoryList() {
    if (!historyTableBody) return;
    try {
      const resp = await fetch('/api/history');
      const exams = await resp.json();
      if (!resp.ok || !Array.isArray(exams)) {
        throw new Error((exams && exams.error) || 'Geçmiş listesi alınamadı.');
      }

      if (exams.length === 0) {
        if (historyEmptyState) historyEmptyState.hidden = false;
        if (historyTableWrapper) historyTableWrapper.hidden = true;
        historyTableBody.innerHTML = '';
        return;
      }

      if (historyEmptyState) historyEmptyState.hidden = true;
      if (historyTableWrapper) historyTableWrapper.hidden = false;
      historyTableBody.innerHTML = '';

      const frag = document.createDocumentFragment();
      exams.forEach((exam) => {
        const tr = document.createElement('tr');
        const dateStr = exam.createdAt
          ? new Date(exam.createdAt).toLocaleString('tr-TR')
          : '-';
        tr.innerHTML = `
          <td><strong>${escapeHtml(exam.title || exam.examTitle || 'İsimsiz Sınav')}</strong></td>
          <td>${escapeHtml(dateStr)}</td>
          <td class="num-col">${escapeHtml(exam.studentCount ?? 0)}</td>
          <td class="num-col"><strong>${escapeHtml(Number(exam.classAverage ?? 0).toFixed(1))}</strong></td>
          <td class="num-col">${escapeHtml(exam.maxScore ?? 0)} / ${escapeHtml(exam.minScore ?? 0)}</td>
          <td>
            <div class="history-actions-cell">
              <button type="button" class="mini-btn" data-hist-view="${escapeHtml(exam.id)}">Not Listesi</button>
              <button type="button" class="mini-btn" data-hist-analysis="${escapeHtml(exam.id)}">Analiz</button>
              <button type="button" class="mini-btn" data-hist-csv="${escapeHtml(exam.id)}">CSV</button>
              <button type="button" class="remove-btn" data-hist-del="${escapeHtml(exam.id)}">Sil</button>
            </div>
          </td>
        `;

        tr.querySelector('[data-hist-view]').addEventListener('click', async () => {
          try {
            const dResp = await fetch(`/api/history/${encodeURIComponent(exam.id)}`);
            const detail = await dResp.json();
            if (!dResp.ok) throw new Error((detail && detail.error) || 'Sınav detayı yüklenemedi.');
            lastBatchData = detail;
            switchMode('batch');
            renderBatchResults(detail);
          } catch (err) {
            showError(err.message);
          }
        });

        tr.querySelector('[data-hist-analysis]').addEventListener('click', () => {
          switchMode('analytics', { targetExamId: exam.id });
        });

        tr.querySelector('[data-hist-csv]').addEventListener('click', () => {
          if (window.__STATIC_MODE__) { downloadGradeListCsv(exam); } else { window.location.href = `/api/history/${encodeURIComponent(exam.id)}/csv`; }
        });

        const delBtn = tr.querySelector('[data-hist-del]');
        delBtn.addEventListener('click', async () => {
          if (delBtn.getAttribute('data-confirm') !== '1') {
            delBtn.setAttribute('data-confirm', '1');
            delBtn.textContent = 'Onayla?';
            setTimeout(() => {
              if (delBtn.isConnected && delBtn.getAttribute('data-confirm') === '1') {
                delBtn.removeAttribute('data-confirm');
                delBtn.textContent = 'Sil';
              }
            }, 3000);
            return;
          }
          try {
            const delResp = await fetch(`/api/history/${encodeURIComponent(exam.id)}`, {
              method: 'DELETE'
            });
            if (!delResp.ok) throw new Error('Kayıt silinemedi.');
            if (activeAnalyticsExamId && String(activeAnalyticsExamId) === String(exam.id)) {
              lastAnalyticsData = null;
              activeAnalyticsExamId = null;
            }
            if (lastBatchData && String(lastBatchData.id || lastBatchData.examId || '') === String(exam.id)) {
              lastBatchData = null;
            }
            if (lastEvaluationData && String(lastEvaluationData.savedExamId || '') === String(exam.id)) {
              lastEvaluationData.savedExamId = null;
              if (saveSingleHistoryBtn) {
                saveSingleHistoryBtn.disabled = false;
                saveSingleHistoryBtn.textContent = 'Geçmişe Kaydet';
              }
            }
            loadHistoryList();
          } catch (err) {
            showError(err.message);
          }
        });

        frag.appendChild(tr);
      });
      historyTableBody.appendChild(frag);
    } catch (err) {
      showError(err.message || 'Değerlendirme geçmişi yüklenirken hata oluştu.');
    }
  }

  if (refreshHistoryBtn) {
    refreshHistoryBtn.addEventListener('click', loadHistoryList);
  }

  // =========================================================================
  // Soru Bazlı Analiz ve SVG Grafikler (R4)
  // =========================================================================

  function mountSafeSvg(container, svgXml) {
    if (!container) return;
    container.innerHTML = '';
    if (!svgXml || typeof svgXml !== 'string') return;
    try {
      if (typeof DOMParser !== 'undefined') {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgXml, 'image/svg+xml');
        const hasParseError = Boolean(doc.querySelector('parsererror'));
        const svgEl = doc.documentElement;
        if (!hasParseError && svgEl && svgEl.nodeName.toLowerCase() === 'svg') {
          container.appendChild(document.importNode(svgEl, true));
          return;
        }
        return;
      }
    } catch (_) {
      return;
    }
    if (svgXml.trim().startsWith('<svg')) {
      container.innerHTML = svgXml;
    }
  }

  function renderAnalyticsPayload(data) {
    lastAnalyticsData = data;
    if (!analyticsContent) return;

    if (analyticsTitle) {
      analyticsTitle.textContent = `${data.examTitle || 'Sınav'} — Soru Bazlı Analiz ve Grafikler`;
    }
    if (analyticsSummaryText) {
      analyticsSummaryText.textContent = data.summaryText || '';
    }
    if (analyticsAvgPct) analyticsAvgPct.textContent = `%${data.classAveragePercentage ?? 0}`;
    if (analyticsAvgScore) {
      analyticsAvgScore.textContent = `${data.classAverage ?? 0} / ${data.maxPossibleScore ?? 100}`;
    }
    if (analyticsStudentCount) analyticsStudentCount.textContent = `${data.studentCount ?? 0} Öğrenci`;
    if (analyticsMinMax) {
      analyticsMinMax.textContent = `${data.maxStudentScore ?? 0} / ${data.minStudentScore ?? 0}`;
    }
    const qStats = Array.isArray(data.questionStats) ? data.questionStats : [];
    if (analyticsQuestionCount) analyticsQuestionCount.textContent = String(qStats.length);

    if (data.charts) {
      mountSafeSvg(questionSuccessSvgContainer, data.charts.questionSuccessSvg);
      mountSafeSvg(missingConceptsSvgContainer, data.charts.missingConceptsSvg);
      if (downloadSuccessSvgBtn) downloadSuccessSvgBtn.hidden = !data.charts.questionSuccessSvg;
      if (downloadConceptsSvgBtn) downloadConceptsSvgBtn.hidden = !data.charts.missingConceptsSvg;
    }

    if (gradeDistributionBars) {
      gradeDistributionBars.innerHTML = '';
      const dist = Array.isArray(data.gradeDistribution) ? data.gradeDistribution : [];
      const totalStudents = Math.max(1, Number(data.studentCount || 0));
      dist.forEach((bin) => {
        const pct = Math.round(((bin.count || 0) / totalStudents) * 100);
        const row = document.createElement('div');
        row.className = 'dist-row';
        row.innerHTML = `
          <div class="dist-row-meta">
            <span>${escapeHtml(bin.label)} Puan Aralığı</span>
            <span>${escapeHtml(bin.count)} öğrenci (%${pct})</span>
          </div>
          <div class="dist-track">
            <div class="dist-fill" style="width: ${pct}%"></div>
          </div>
        `;
        gradeDistributionBars.appendChild(row);
      });
    }

    if (analyticsQuestionTbody) {
      analyticsQuestionTbody.innerHTML = '';
      qStats.forEach((q) => {
        const tr = document.createElement('tr');
        const pillClass = getScorePillClass(q.successRate, 100);
        tr.innerHTML = `
          <td><strong>Soru ${escapeHtml(q.questionNumber)}</strong></td>
          <td class="num-col">${escapeHtml(q.averageScore)}</td>
          <td class="num-col">${escapeHtml(q.maxPoints)}</td>
          <td class="num-col"><span class="score-pill ${pillClass}">%${escapeHtml(q.successRate)}</span></td>
          <td class="num-col">${escapeHtml(q.minScore)} / ${escapeHtml(q.maxScore)}</td>
        `;
        analyticsQuestionTbody.appendChild(tr);
      });
    }

    analyticsContent.hidden = false;
  }

  function syncActiveAnalyticsPill(examId) {
    document.querySelectorAll('.exam-pill-btn').forEach((btn) => {
      btn.classList.toggle(
        'is-active',
        Boolean(examId) && btn.getAttribute('data-exam-id') === String(examId)
      );
    });
  }

  async function fetchAndRenderAnalyticsById(examId) {
    const seq = ++analyticsRequestSeq;
    try {
      const resp = await fetch(`/api/analysis/${encodeURIComponent(examId)}`);
      const payload = await resp.json();
      if (seq !== analyticsRequestSeq) return;
      if (!resp.ok) throw new Error((payload && payload.error) || 'Analiz yüklenemedi.');
      showError('');
      activeAnalyticsExamId = String(examId);
      renderAnalyticsPayload(payload);
      syncActiveAnalyticsPill(activeAnalyticsExamId);
    } catch (err) {
      if (seq !== analyticsRequestSeq) return;
      showError(err.message || 'Analiz hesaplanırken hata oluştu.');
    }
  }

  async function fetchAndRenderAnalyticsFromGradeList(gradeList) {
    const seq = ++analyticsRequestSeq;
    try {
      const resp = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gradeList })
      });
      const payload = await resp.json();
      if (seq !== analyticsRequestSeq) return;
      if (!resp.ok) throw new Error((payload && payload.error) || 'Analiz üretilemedi.');
      showError('');
      activeAnalyticsExamId = null;
      renderAnalyticsPayload(payload);
      syncActiveAnalyticsPill(null);
    } catch (err) {
      if (seq !== analyticsRequestSeq) return;
      showError(err.message || 'Analiz üretilirken hata oluştu.');
    }
  }

  async function loadAnalyticsView(preferredExamId = null, gradeListFallback = null) {
    if (!analyticsExamPills) return;
    analyticsExamPills.innerHTML = '';
    try {
      const resp = await fetch('/api/history');
      const exams = await resp.json();
      if (!resp.ok || !Array.isArray(exams)) {
        throw new Error((exams && exams.error) || 'Analiz için sınav listesi alınamadı.');
      }

      if (exams.length === 0 && !lastBatchData && !gradeListFallback) {
        lastAnalyticsData = null;
        activeAnalyticsExamId = null;
        if (analyticsTitle) {
          analyticsTitle.textContent = 'Soru Bazlı Analiz ve Başarı Grafikleri';
        }
        if (analyticsSummaryText) {
          analyticsSummaryText.textContent = 'Henüz analiz edilecek sınav kaydı bulunmuyor. Önce Toplu veya Tekli değerlendirme yapınız.';
        }
        if (downloadSuccessSvgBtn) downloadSuccessSvgBtn.hidden = true;
        if (downloadConceptsSvgBtn) downloadConceptsSvgBtn.hidden = true;
        if (analyticsContent) analyticsContent.hidden = true;
        return;
      }

      exams.forEach((exam) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'exam-pill-btn';
        btn.setAttribute('data-exam-id', exam.id);
        btn.textContent = `${exam.title || 'Sınav'} (${exam.studentCount || 0} Öğrenci)`;
        btn.addEventListener('click', () => fetchAndRenderAnalyticsById(exam.id));
        analyticsExamPills.appendChild(btn);
      });

      const batchExamId = lastBatchData ? (lastBatchData.id || lastBatchData.examId || null) : null;
      const targetId = preferredExamId || batchExamId || (activeAnalyticsExamId && exams.some((e) => String(e.id) === String(activeAnalyticsExamId)) ? activeAnalyticsExamId : null);

      if (targetId) {
        await fetchAndRenderAnalyticsById(targetId);
      } else if (gradeListFallback) {
        await fetchAndRenderAnalyticsFromGradeList(gradeListFallback);
      } else if (lastBatchData) {
        await fetchAndRenderAnalyticsFromGradeList(lastBatchData);
      } else if (exams.length > 0) {
        await fetchAndRenderAnalyticsById(exams[0].id);
      }
    } catch (err) {
      if (gradeListFallback) {
        await fetchAndRenderAnalyticsFromGradeList(gradeListFallback);
      } else {
        showError(err.message || 'Analiz görünümü yüklenirken hata oluştu.');
      }
    }
  }

  function downloadSvgFile(svgContent, fileName) {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8;' });
    if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  if (downloadSuccessSvgBtn) {
    downloadSuccessSvgBtn.addEventListener('click', () => {
      if (lastAnalyticsData && lastAnalyticsData.charts) {
        downloadSvgFile(lastAnalyticsData.charts.questionSuccessSvg, 'soru_basari_grafigi.svg');
      }
    });
  }

  if (downloadConceptsSvgBtn) {
    downloadConceptsSvgBtn.addEventListener('click', () => {
      if (lastAnalyticsData && lastAnalyticsData.charts) {
        downloadSvgFile(lastAnalyticsData.charts.missingConceptsSvg, 'eksik_kavramlar_grafigi.svg');
      }
    });
  }

  // Sonuç Araçları (Tablo Kopyalama, CSV İndirme, Yazdırma)
  if (copyTableBtn) {
    copyTableBtn.addEventListener('click', async () => {
      if (!lastEvaluationData || !Array.isArray(lastEvaluationData.questions)) return;
      const header = ['Soru', 'Sayfa', 'Basılı Soru', 'Öğrenci Cevabı', 'Kaynak Referansı', 'Değerlendirme Gerekçesi', 'Soru Puanı', 'Alınan Puan'];
      const rows = lastEvaluationData.questions.map((q) => [
        `Soru ${q.questionNumber}`,
        q.pageSide || 'Ön Yüz',
        String(q.questionText || '').replace(/\s+/g, ' '),
        String(q.studentAnswer || '').replace(/\s+/g, ' '),
        String(q.sourceReference || '').replace(/\s+/g, ' '),
        String(q.evaluationReasoning || '').replace(/\s+/g, ' '),
        q.maxPoints,
        q.awardedPoints
      ]);
      rows.push(['GENEL TOPLAM', '', '', '', '', '', lastEvaluationData.totalMaxPoints, lastEvaluationData.totalAwardedPoints]);
      const tsv = [header, ...rows].map((r) => r.join('\t')).join('\n');

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(tsv);
          const prev = copyTableBtn.textContent;
          copyTableBtn.textContent = 'Kopyalandı!';
          setTimeout(() => {
            copyTableBtn.textContent = prev;
          }, 1500);
        }
      } catch (_) {}
    });
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      if (!lastEvaluationData || !Array.isArray(lastEvaluationData.questions)) return;
      const csvEscape = (val) => `"${String(val ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
      const header = ['Soru No', 'Sayfa Yuzu', 'Tespit Edilen Soru', 'Ogrenci Cevabi', 'Ders Kaynagi Referansi', 'Degerlendirme Gerekcesi', 'Maksimum Puan', 'Alinan Puan'];
      const lines = [header.map(csvEscape).join(';')];

      lastEvaluationData.questions.forEach((q) => {
        lines.push(
          [
            `Soru ${q.questionNumber}`,
            q.pageSide || 'Ön Yüz',
            q.questionText,
            q.studentAnswer,
            q.sourceReference,
            q.evaluationReasoning,
            q.maxPoints,
            q.awardedPoints
          ]
            .map(csvEscape)
            .join(';')
        );
      });

      lines.push(
        ['GENEL TOPLAM', '', '', '', '', '', lastEvaluationData.totalMaxPoints, lastEvaluationData.totalAwardedPoints]
          .map(csvEscape)
          .join(';')
      );

      const csvContent = '\uFEFF' + lines.join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sinav_degerlendirme_sonucu.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    });
  }

  if (printResultsBtn) {
    printResultsBtn.addEventListener('click', () => {
      if (typeof window.print === 'function') {
        window.print();
      }
    });
  }

  // =========================================================================
  // Form Gönderimi (Tekli ve Toplu Mod)
  // =========================================================================

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('');

    const activeCourseFiles =
      selectedCourseFiles.length > 0
        ? selectedCourseFiles
        : Array.from(courseInput.files || []);

    if (activeCourseFiles.length === 0) {
      showError('Lütfen en az bir ders kaynağı dosyası (PDF, DOCX veya TXT) yükleyiniz.');
      return;
    }

    const invalidCourse = activeCourseFiles.find((f) => !isValidCourseFile(f));
    if (invalidCourse) {
      showError(`Desteklenmeyen dosya formatı (${invalidCourse.name}). Lütfen sadece PDF, DOCX veya TXT yükleyiniz.`);
      return;
    }

    let endpoint = '/api/evaluate';
    const formData = new FormData();
    activeCourseFiles.forEach((file) => {
      formData.append('courseMaterials', file);
    });

    if (activeMode === 'batch') {
      const batchFiles =
        selectedBatchFiles.length > 0
          ? selectedBatchFiles
          : (frontInputMode === 'batch' ? Array.from(frontInput.files || []) : []);
      if (batchFiles.length === 0) {
        showError('Lütfen toplu değerlendirme için en az bir sınav kağıdı veya ZIP arşivi yükleyiniz.');
        return;
      }
      const invalidBatch = batchFiles.find((f) => !isValidBatchFile(f));
      if (invalidBatch) {
        showError(`Desteklenmeyen dosya formatı (${invalidBatch.name}). Lütfen görsel veya ZIP yükleyiniz.`);
        return;
      }

      endpoint = '/api/evaluate/batch';
      batchFiles.forEach((f) => {
        if (getFileExtension(f.name) === '.zip') {
          formData.append('zip', f);
        } else {
          formData.append('papers', f);
        }
      });

      formData.append('autoEnhance', batchAutoEnhance ? 'true' : 'false');
      formData.append('evaluationMode', evaluationMode);
    } else {
      const activeFrontFile =
        selectedFrontFile || (frontInputMode === 'single' && frontInput.files && frontInput.files[0]) || null;
      const activeBackFile =
        selectedBackFile || (backInput.files && backInput.files[0]) || null;

      if (!activeFrontFile) {
        showError('Lütfen Sınav Kağıdı - Ön Yüz fotoğrafını yükleyiniz.');
        return;
      }
      if (!isValidImageFile(activeFrontFile)) {
        showError(`Desteklenmeyen görsel formatı (${activeFrontFile.name}). Lütfen PNG, JPG, JPEG veya WEBP yükleyiniz.`);
        return;
      }
      if (activeBackFile && !isValidImageFile(activeBackFile)) {
        showError(`Desteklenmeyen görsel formatı (${activeBackFile.name}). Lütfen PNG, JPG, JPEG veya WEBP yükleyiniz.`);
        return;
      }

      formData.append('frontImage', activeFrontFile);
      if (activeBackFile) {
        formData.append('backImage', activeBackFile);
      }
      formData.append('evaluationMode', evaluationMode);

      const hasFrontEnh = hasActiveEnhancement('front');
      const hasBackEnh = Boolean(activeBackFile && hasActiveEnhancement('back'));
      if (hasFrontEnh && hasBackEnh) {
        formData.append(
          'enhancement',
          JSON.stringify({
            front: buildEnhancePayload('front'),
            back: buildEnhancePayload('back')
          })
        );
      } else if (hasFrontEnh) {
        formData.append(
          'enhancement',
          JSON.stringify(activeBackFile ? { front: buildEnhancePayload('front') } : buildEnhancePayload('front'))
        );
      } else if (hasBackEnh) {
        formData.append('enhancement', JSON.stringify({ back: buildEnhancePayload('back') }));
      }
    }

    if (activeAbortController) {
      abortReason = 'superseded';
      activeAbortController.abort();
    }
    abortReason = null;
    activeAbortController = typeof AbortController !== 'undefined' ? new AbortController() : null;

    evaluateBtn.disabled = true;
    loadingSection.hidden = false;
    if (resultsSection) resultsSection.hidden = true;
    if (batchResultsSection) batchResultsSection.hidden = true;

    if (loadingTitle) {
      loadingTitle.textContent =
        activeMode === 'batch'
          ? 'Tüm öğrenci kağıtları sırayla taranıyor ve Sınıf Not Listesi oluşturuluyor...'
          : 'Sınav kağıdı taranıyor ve ders kaynaklarına (RAG) göre değerlendiriliyor...';
    }
    if (loadingSubtitle && loadingElapsed) {
      loadingSubtitle.firstChild.textContent =
        activeMode === 'batch'
          ? 'Öğrenci bilgileri çıkarılıyor, görüntüler iyileştiriliyor ve RAG puanlaması yapılıyor. '
          : 'Basılı sorular, puan değerleri ve el yazısı cevaplar tespit ediliyor. ';
    }

    const reqStart = Date.now();
    if (loadingElapsed) {
      loadingElapsed.textContent = '';
      elapsedTimerId = setInterval(() => {
        const sec = ((Date.now() - reqStart) / 1000).toFixed(1);
        loadingElapsed.textContent = `(${sec} sn)`;
      }, 200);
    }

    try {
      const fetchOptions = {
        method: 'POST',
        body: formData
      };
      if (activeAbortController) {
        fetchOptions.signal = activeAbortController.signal;
      }

      const response = await fetch(endpoint, fetchOptions);
      let payload = null;
      try {
        payload = await response.json();
      } catch (_) {
        throw new Error('Sunucudan geçersiz yanıt alındı. Lütfen tekrar deneyiniz.');
      }

      if (!response.ok) {
        throw new Error((payload && payload.error) || 'Değerlendirme sırasında bir hata oluştu.');
      }

      if (activeMode === 'batch') {
        renderBatchResults(payload);
      } else {
        renderResults(payload, Date.now() - reqStart);
      }
    } catch (err) {
      if (err && err.name === 'AbortError') {
        if (abortReason !== 'reset' && abortReason !== 'superseded') {
          showError('Değerlendirme işlemi kullanıcı tarafından iptal edildi.');
        }
      } else {
        showError(err.message || 'Sunucu ile bağlantı kurulamadı.');
      }
    } finally {
      if (elapsedTimerId) {
        clearInterval(elapsedTimerId);
        elapsedTimerId = null;
      }
      activeAbortController = null;
      abortReason = null;
      evaluateBtn.disabled = false;
      loadingSection.hidden = true;
    }
  });
})();
