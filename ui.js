(function () {
  const rootId = "ytb-root";
  if (document.getElementById(rootId)) return;

  const root = document.createElement("div");
  root.id = rootId;

  root.innerHTML = `
    <div id="ytb-panel" class="ytb-panel ytb-hidden">
      <div class="ytb-header">
        <div class="ytb-title">YouTube Boost</div>
        <button id="ytb-close" class="ytb-btn">✕</button>
      </div>

      <div class="ytb-section">
        <div class="ytb-subtitle">Cleaner</div>
        <div class="ytb-grid">
          <label class="ytb-toggle"><input id="t-focus" type="checkbox"> Focus Mode</label>
          <label class="ytb-toggle"><input id="t-shorts" type="checkbox"> Hide Shorts</label>
          <label class="ytb-toggle"><input id="t-comments" type="checkbox"> Hide Comments</label>
          <label class="ytb-toggle"><input id="t-sidebar" type="checkbox"> Hide Sidebar</label>
          <label class="ytb-toggle"><input id="t-endcards" type="checkbox"> Hide End Cards</label>
          <label class="ytb-toggle"><input id="t-livechat" type="checkbox"> Hide Live Chat</label>
          <label class="ytb-toggle"><input id="t-autoplayoff" type="checkbox"> Autoplay OFF (best-effort)</label>
        </div>
      </div>

      <div class="ytb-section">
        <div class="ytb-subtitle">Player</div>
        <div class="ytb-grid">
          <label class="ytb-toggle"><input id="t-theater" type="checkbox"> Theater on load</label>
          <label class="ytb-toggle"><input id="t-hd" type="checkbox"> Prefer HD</label>
          <label class="ytb-toggle"><input id="t-captions" type="checkbox"> Subtitles on load</label>
        </div>

        <div class="ytb-row">
          <button id="b-theater" class="ytb-btn ytb-wide">Toggle Theater</button>
          <button id="b-hd" class="ytb-btn ytb-wide">Set Best Quality</button>
        </div>

        <div class="ytb-row">
          <button id="b-captions-now" class="ytb-btn ytb-wide">Turn Subtitles ON</button>
          <button id="b-tslink" class="ytb-btn ytb-wide">Copy Timestamp Link</button>
        </div>

        <div class="ytb-row">
          <button id="b-loop" class="ytb-btn ytb-wide">Loop: OFF</button>
          <button id="b-speed-apply" class="ytb-btn ytb-wide">Apply Channel Speed</button>
        </div>

        <div class="ytb-row">
          <button id="b-s1" class="ytb-btn ytb-wide">1.0x</button>
          <button id="b-s125" class="ytb-btn ytb-wide">1.25x</button>
          <button id="b-s15" class="ytb-btn ytb-wide">1.5x</button>
          <button id="b-s2" class="ytb-btn ytb-wide">2.0x</button>
        </div>
      </div>

      <div class="ytb-section">
        <div class="ytb-subtitle">Channel Speed</div>
        <div class="ytb-hint" id="ytb-channelLabel">Channel: ...</div>

        <div class="ytb-row">
          <select id="speedSelect" class="ytb-select ytb-wide">
            <option value="0.75">0.75x</option>
            <option value="1.0" selected>1.0x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="1.75">1.75x</option>
            <option value="2.0">2.0x</option>
          </select>
          <button id="b-speed-save" class="ytb-btn ytb-wide">Save for channel</button>
        </div>

        <div class="ytb-row">
          <button id="b-speed-reset" class="ytb-btn ytb-wide">Reset channel speed</button>
          <button id="b-speed-default" class="ytb-btn ytb-wide">Set default 1.0x</button>
        </div>
      </div>

      <div class="ytb-section">
        <div class="ytb-subtitle">Study Mode (Pomodoro)</div>

        <div class="ytb-row">
          <div class="ytb-mini">
            <div class="ytb-mini-label">Study</div>
            <input id="studyMin" class="ytb-input" type="number" min="1" max="600" step="1" value="25">
            <div class="ytb-mini-unit">min</div>
          </div>

          <div class="ytb-mini">
            <div class="ytb-mini-label">Break</div>
            <input id="breakMin" class="ytb-input" type="number" min="1" max="180" step="1" value="5">
            <div class="ytb-mini-unit">min</div>
          </div>
        </div>

        <div class="ytb-grid">
          <label class="ytb-toggle"><input id="t-autoRepeat" type="checkbox"> Auto-repeat</label>
          <label class="ytb-toggle"><input id="t-pauseOnEnd" type="checkbox"> Pause video on end</label>
          <label class="ytb-toggle"><input id="t-pauseHidden" type="checkbox"> Pause video if tab hidden (Study)</label>
          <label class="ytb-toggle"><input id="t-overlayTimer" type="checkbox"> Overlay timer on video</label>
        </div>

        <div class="ytb-row">
          <button id="p-start" class="ytb-btn ytb-wide">▶ Start Study</button>
          <button id="p-pause" class="ytb-btn ytb-wide">⏸ Pause/Resume</button>
          <button id="p-stop" class="ytb-btn ytb-wide">⏹ Stop</button>
        </div>

        <div class="ytb-status">
          <div>
            <span class="ytb-badge" id="p-mode">idle</span>
            <span class="ytb-badge ytb-badge-mini" id="p-binge">videos: 0</span>
          </div>
          <div class="ytb-timer" id="p-timer">00:00</div>
        </div>
      </div>

      <div class="ytb-section">
        <div class="ytb-subtitle">Modo Examen / Anti-Binge / Whitelist</div>

        <div class="ytb-grid">
          <label class="ytb-toggle"><input id="t-exam" type="checkbox"> Exam Mode (during Study)</label>
          <label class="ytb-toggle"><input id="t-exam-home" type="checkbox"> Block Home/feeds during Study</label>
          <label class="ytb-toggle"><input id="t-exam-reco" type="checkbox"> Hide recommendations during Study</label>
        </div>

        <div class="ytb-row">
          <div class="ytb-mini">
            <div class="ytb-mini-label">Anti-Binge</div>
            <input id="abMax" class="ytb-input" type="number" min="1" max="50" step="1" value="3">
            <div class="ytb-mini-unit">max</div>
          </div>
          <button id="abReset" class="ytb-btn ytb-wide">Reset counter</button>
        </div>

        <div class="ytb-grid">
          <label class="ytb-toggle"><input id="t-ab" type="checkbox"> Anti-Binge enabled</label>
          <label class="ytb-toggle"><input id="t-ab-resetbreak" type="checkbox"> Reset on Break</label>
        </div>

        <div class="ytb-grid">
          <label class="ytb-toggle"><input id="t-wl" type="checkbox"> Whitelist only (during Study)</label>
        </div>

        <div class="ytb-hint">Allowed channels (one per line, example: <b>/@KhanAcademy</b>)</div>
        <textarea id="wlList" class="ytb-textarea" rows="5" placeholder="/@KhanAcademy&#10;/@freecodecamp"></textarea>
        <div class="ytb-row">
          <button id="wlSave" class="ytb-btn ytb-wide">Save whitelist</button>
          <button id="wlClear" class="ytb-btn ytb-wide">Clear</button>
        </div>
      </div>

      <div class="ytb-section">
        <div class="ytb-subtitle">Bookmarks (this video)</div>
        <div class="ytb-row">
          <input id="bmNote" class="ytb-input ytb-wide" type="text" maxlength="200" placeholder="Nota rápida (opcional)"/>
          <button id="bmAdd" class="ytb-btn">➕</button>
        </div>
        <div id="bmList" class="ytb-bmlist"></div>
        <div class="ytb-row">
          <button id="bmClear" class="ytb-btn ytb-wide">Clear</button>
          <button id="bmExport" class="ytb-btn ytb-wide">Export JSON</button>
        </div>
      </div>

      <div class="ytb-section">
        <div class="ytb-subtitle">Time Tracking</div>
        <div class="ytb-grid">
          <div class="ytb-metric">Session: <b id="m-session">00:00:00</b></div>
          <div class="ytb-metric">This video: <b id="m-video">00:00:00</b></div>
          <div class="ytb-metric">Today: <b id="m-day">00:00:00</b></div>
        </div>
      </div>

      <div class="ytb-section">
        <div class="ytb-subtitle">Entrada animada</div>
        <div class="ytb-grid">
          <label class="ytb-toggle"><input id="t-splash" type="checkbox"> Splash enabled</label>
          <label class="ytb-toggle"><input id="t-splash-once" type="checkbox"> Once per session</label>
        </div>
        <div class="ytb-row">
          <div class="ytb-mini">
            <div class="ytb-mini-label">Duration</div>
            <input id="splashMs" class="ytb-input" type="number" min="800" max="10000" step="100" value="2200">
            <div class="ytb-mini-unit">ms</div>
          </div>
          <button id="splashTest" class="ytb-btn ytb-wide">Test splash</button>
        </div>
      </div>

      <div id="ytb-toast" class="ytb-toast ytb-hidden"></div>

      <div class="ytb-footer">
        <span>Alt+Y panel • Alt+F focus</span>
      </div>
    </div>

    <button id="ytb-fab" class="ytb-fab" title="YouTube Boost (Alt+Y)">YB</button>

    <div id="ytb-overlay" class="ytb-overlay ytb-hidden">
      <div class="ytb-overlay-badge" id="ov-mode">study</div>
      <div class="ytb-overlay-time" id="ov-time">25:00</div>
    </div>

    <div id="ytb-splash" class="ytb-splash ytb-hidden">
      <div class="ytb-splash-card">
        <div class="ytb-splash-logo">
          <div class="ytb-splash-play"></div>
          <div class="ytb-splash-bolt"></div>
        </div>
        <div class="ytb-splash-title">YouTube Boost</div>
        <div class="ytb-splash-sub">Focus • Study • Speed • Bookmarks</div>
        <div class="ytb-splash-bar"></div>
      </div>
    </div>

    <div id="ytb-blockerUI" class="ytb-blocker ytb-hidden">
      <div class="ytb-blocker-card">
        <div class="ytb-blocker-title" id="blkTitle">Blocked</div>
        <div class="ytb-blocker-text" id="blkText">...</div>
        <div class="ytb-row" style="margin-top:12px;">
          <button id="blkPrimary" class="ytb-btn ytb-wide">Continue</button>
          <button id="blkSecondary" class="ytb-btn ytb-wide">Option</button>
        </div>
      </div>
    </div>
  `;

  document.documentElement.appendChild(root);

  const panel = root.querySelector("#ytb-panel");
  const fab = root.querySelector("#ytb-fab");
  const closeBtn = root.querySelector("#ytb-close");
  const toast = root.querySelector("#ytb-toast");

  // Overlay timer
  const overlay = root.querySelector("#ytb-overlay");
  const ovMode = root.querySelector("#ov-mode");
  const ovTime = root.querySelector("#ov-time");

  // Splash
  const splash = root.querySelector("#ytb-splash");

  // Blocker UI
  const blockerUI = root.querySelector("#ytb-blockerUI");
  const blkTitle = root.querySelector("#blkTitle");
  const blkText = root.querySelector("#blkText");
  const blkPrimary = root.querySelector("#blkPrimary");
  const blkSecondary = root.querySelector("#blkSecondary");

  // Cleaner toggles
  const tFocus = root.querySelector("#t-focus");
  const tShorts = root.querySelector("#t-shorts");
  const tComments = root.querySelector("#t-comments");
  const tSidebar = root.querySelector("#t-sidebar");
  const tEndCards = root.querySelector("#t-endcards");
  const tLiveChat = root.querySelector("#t-livechat");
  const tAutoplayOff = root.querySelector("#t-autoplayoff");

  // Player toggles
  const tTheater = root.querySelector("#t-theater");
  const tHD = root.querySelector("#t-hd");
  const tCaptions = root.querySelector("#t-captions");

  // Player buttons
  const bTheater = root.querySelector("#b-theater");
  const bHD = root.querySelector("#b-hd");
  const bCaptionsNow = root.querySelector("#b-captions-now");
  const bTSLink = root.querySelector("#b-tslink");
  const bLoop = root.querySelector("#b-loop");
  const bSpeedApply = root.querySelector("#b-speed-apply");

  // Quick speed
  const bS1 = root.querySelector("#b-s1");
  const bS125 = root.querySelector("#b-s125");
  const bS15 = root.querySelector("#b-s15");
  const bS2 = root.querySelector("#b-s2");

  // Speed per channel
  const channelLabel = root.querySelector("#ytb-channelLabel");
  const speedSelect = root.querySelector("#speedSelect");
  const bSpeedSave = root.querySelector("#b-speed-save");
  const bSpeedReset = root.querySelector("#b-speed-reset");
  const bSpeedDefault = root.querySelector("#b-speed-default");

  // Pomodoro
  const studyMin = root.querySelector("#studyMin");
  const breakMin = root.querySelector("#breakMin");
  const tAutoRepeat = root.querySelector("#t-autoRepeat");
  const tPauseOnEnd = root.querySelector("#t-pauseOnEnd");
  const tPauseHidden = root.querySelector("#t-pauseHidden");
  const tOverlayTimer = root.querySelector("#t-overlayTimer");
  const pStart = root.querySelector("#p-start");
  const pPause = root.querySelector("#p-pause");
  const pStop = root.querySelector("#p-stop");
  const pMode = root.querySelector("#p-mode");
  const pTimer = root.querySelector("#p-timer");
  const pBinge = root.querySelector("#p-binge");

  // Exam / anti-binge / whitelist
  const tExam = root.querySelector("#t-exam");
  const tExamHome = root.querySelector("#t-exam-home");
  const tExamReco = root.querySelector("#t-exam-reco");
  const abMax = root.querySelector("#abMax");
  const abReset = root.querySelector("#abReset");
  const tAB = root.querySelector("#t-ab");
  const tABResetBreak = root.querySelector("#t-ab-resetbreak");

  const tWL = root.querySelector("#t-wl");
  const wlList = root.querySelector("#wlList");
  const wlSave = root.querySelector("#wlSave");
  const wlClear = root.querySelector("#wlClear");

  // Bookmarks
  const bmNote = root.querySelector("#bmNote");
  const bmAdd = root.querySelector("#bmAdd");
  const bmList = root.querySelector("#bmList");
  const bmClear = root.querySelector("#bmClear");
  const bmExport = root.querySelector("#bmExport");

  // Tracking
  const mSession = root.querySelector("#m-session");
  const mVideo = root.querySelector("#m-video");
  const mDay = root.querySelector("#m-day");

  // Splash controls
  const tSplash = root.querySelector("#t-splash");
  const tSplashOnce = root.querySelector("#t-splash-once");
  const splashMs = root.querySelector("#splashMs");
  const splashTest = root.querySelector("#splashTest");

  function setOpen(open) { panel.classList.toggle("ytb-hidden", !open); }

  function showToast(msg, kind = "info") {
    toast.textContent = msg;
    toast.setAttribute("data-kind", kind);
    toast.classList.remove("ytb-hidden");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.add("ytb-hidden"), 1700);
  }

  function fmt2(n) { return String(n).padStart(2, "0"); }
  function fmtHMS(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${fmt2(h)}:${fmt2(m)}:${fmt2(s)}`;
  }
  function fmtMS(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${fmt2(m)}:${fmt2(s)}`;
  }

  function clamp(n, min, max) {
    n = Number(n);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function isWatch() { return location.pathname === "/watch"; }
  function isHome() { return location.pathname === "/"; }

  function showSplash(cfg) {
    try {
      if (!cfg?.enabled) return;

      const where = cfg.showOn || "all";
      const ok =
        (where === "all") ||
        (where === "watch" && isWatch()) ||
        (where === "youtube" && (isHome() || isWatch() || location.pathname.startsWith("/@") || location.pathname.startsWith("/channel/")));

      if (!ok) return;

      if (cfg.oncePerSession) {
        if (sessionStorage.getItem("ytb:splashShown") === "1") return;
        sessionStorage.setItem("ytb:splashShown", "1");
      }

      const ms = Math.max(800, Number(cfg.durationMs) || 2200);

      splash.classList.remove("ytb-hidden");
      splash.classList.add("ytb-splash-show");

      setTimeout(() => {
        splash.classList.remove("ytb-splash-show");
        splash.classList.add("ytb-splash-hide");
      }, ms - 450);

      setTimeout(() => {
        splash.classList.add("ytb-hidden");
        splash.classList.remove("ytb-splash-hide");
      }, ms);
    } catch { }
  }

  function syncSettingsUI(settings) {
    // Cleaner
    tFocus.checked = !!settings.focusMode;
    tShorts.checked = !!settings.hideShorts;
    tComments.checked = !!settings.hideComments;
    tSidebar.checked = !!settings.hideSidebar;
    tEndCards.checked = !!settings.hideEndCards;
    tLiveChat.checked = !!settings.hideLiveChat;
    tAutoplayOff.checked = !!settings.autoplayOff;

    // Player
    tTheater.checked = !!settings.theaterOnLoad;
    tHD.checked = !!settings.autoHD;
    tCaptions.checked = !!settings.captionsOnLoad;

    // Pomodoro
    studyMin.value = String(settings.pomodoro.studyMinutes);
    breakMin.value = String(settings.pomodoro.breakMinutes);
    tAutoRepeat.checked = !!settings.pomodoro.autoRepeat;
    tPauseOnEnd.checked = !!settings.pomodoro.pauseVideoOnEnd;
    tPauseHidden.checked = !!settings.pomodoro.pauseWhenTabHidden;
    tOverlayTimer.checked = !!settings.pomodoro.overlayTimer;

    // Speed
    const channelKey = window.YTB.getChannelKey();
    channelLabel.textContent = `Channel: ${channelKey}`;
    const per = settings.speed?.perChannel || {};
    const current = per[channelKey] ?? settings.speed?.defaultRate ?? 1.0;
    speedSelect.value = String(current);

    // Exam / anti-binge / whitelist
    tExam.checked = !!settings.examMode.enabled;
    tExamHome.checked = !!settings.examMode.blockHomeDuringStudy;
    tExamReco.checked = !!settings.examMode.blockRecommendationsDuringStudy;

    tAB.checked = !!settings.antiBinge.enabled;
    abMax.value = String(settings.antiBinge.maxVideosInStudy || 3);
    tABResetBreak.checked = !!settings.antiBinge.resetOnBreak;

    tWL.checked = !!settings.whitelist.enabled;
    wlList.value = (settings.whitelist.allowedChannels || []).join("\n");

    // Splash
    tSplash.checked = !!settings.splash.enabled;
    tSplashOnce.checked = !!settings.splash.oncePerSession;
    splashMs.value = String(settings.splash.durationMs || 2200);
  }

  function syncPomoUI(pomo) {
    pMode.textContent = pomo.mode;
    pTimer.textContent = fmtMS(pomo.remainingSec);
    pBinge.textContent = `videos: ${pomo.bingeCount ?? 0}`;

    const showOverlay = !!window.YTB.getSettings().pomodoro.overlayTimer;
    const showNow = showOverlay && (pomo.mode === "study" || pomo.mode === "break" || pomo.mode === "paused");
    overlay.classList.toggle("ytb-hidden", !showNow);

    ovMode.textContent = pomo.mode;
    ovTime.textContent = fmtMS(pomo.remainingSec);

    pMode.classList.toggle("ytb-badge-study", pomo.mode === "study");
    pMode.classList.toggle("ytb-badge-break", pomo.mode === "break");
    pMode.classList.toggle("ytb-badge-paused", pomo.mode === "paused");
  }

  async function renderBookmarks() {
    const items = await window.YTB.getBookmarks();
    if (!items.length) {
      bmList.innerHTML = `<div class="ytb-bmempty">No bookmarks yet.</div>`;
      return;
    }

    bmList.innerHTML = items
      .slice()
      .reverse()
      .map((b) => {
        const t = b.t || 0;
        const note = (b.note || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `
          <div class="ytb-bmrow">
            <button class="ytb-btn ytb-bmjump" data-t="${t}">⏱ ${fmtMS(t)}</button>
            <div class="ytb-bmnote">${note || "<span class='ytb-muted'>(no note)</span>"}</div>
          </div>
        `;
      })
      .join("");

    bmList.querySelectorAll(".ytb-bmjump").forEach(btn => {
      btn.addEventListener("click", () => window.YTB.jumpTo(btn.getAttribute("data-t")));
    });
  }

  // Blocker UI
  function showBlocker(detail) {
    const active = !!detail?.active;
    blockerUI.classList.toggle("ytb-hidden", !active);
    if (!active) return;

    blkTitle.textContent = detail.title || "Blocked";
    blkText.textContent = detail.text || "";
    blkPrimary.textContent = detail.primaryLabel || "OK";
    blkSecondary.textContent = detail.secondaryLabel || "Close";
  }

  blkPrimary.addEventListener("click", () => window.dispatchEvent(new CustomEvent("YTB_BLOCKER_PRIMARY")));
  blkSecondary.addEventListener("click", () => window.dispatchEvent(new CustomEvent("YTB_BLOCKER_SECONDARY")));

  // Init
  syncSettingsUI(window.YTB.getSettings());
  syncPomoUI(window.YTB.pomoGet());
  renderBookmarks();

  // Panel open/close
  fab.addEventListener("click", () => setOpen(panel.classList.contains("ytb-hidden")));
  closeBtn.addEventListener("click", () => setOpen(false));
  window.addEventListener("YTB_TOGGLE_PANEL", () => setOpen(panel.classList.contains("ytb-hidden")));

  // Events
  window.addEventListener("YTB_NOTIFY", (e) => {
    const d = e.detail || {};
    showToast(d.text || "Done", d.kind || "info");
  });

  window.addEventListener("YTB_SETTINGS_UPDATED", (e) => {
    syncSettingsUI(e.detail || window.YTB.getSettings());
  });

  window.addEventListener("YTB_POMO_UPDATE", (e) => {
    syncPomoUI(e.detail || window.YTB.pomoGet());
  });

  window.addEventListener("YTB_TRACK_UPDATE", (e) => {
    const d = e.detail || {};
    mSession.textContent = fmtHMS(d.sessionSec);
    mVideo.textContent = fmtHMS(d.videoSec);
    mDay.textContent = fmtHMS(d.daySec);
  });

  window.addEventListener("YTB_BOOKMARKS_UPDATED", () => renderBookmarks());

  window.addEventListener("YTB_SPLASH", (e) => {
    showSplash(e.detail || window.YTB.getSettings().splash);
  });

  window.addEventListener("YTB_BLOCKER", (e) => {
    showBlocker(e.detail || {});
  });

  // Toggles -> settings updates
  tFocus.addEventListener("change", () => window.YTB.update({ focusMode: tFocus.checked }));
  tShorts.addEventListener("change", () => window.YTB.update({ hideShorts: tShorts.checked }));
  tComments.addEventListener("change", () => window.YTB.update({ hideComments: tComments.checked }));
  tSidebar.addEventListener("change", () => window.YTB.update({ hideSidebar: tSidebar.checked }));
  tEndCards.addEventListener("change", () => window.YTB.update({ hideEndCards: tEndCards.checked }));
  tLiveChat.addEventListener("change", () => window.YTB.update({ hideLiveChat: tLiveChat.checked }));
  tAutoplayOff.addEventListener("change", () => window.YTB.update({ autoplayOff: tAutoplayOff.checked }));

  tTheater.addEventListener("change", () => window.YTB.update({ theaterOnLoad: tTheater.checked }));
  tHD.addEventListener("change", () => window.YTB.update({ autoHD: tHD.checked }));
  tCaptions.addEventListener("change", () => window.YTB.update({ captionsOnLoad: tCaptions.checked }));

  // Player buttons
  bTheater.addEventListener("click", () => window.YTB.theaterMode());
  bHD.addEventListener("click", () => window.YTB.setQualityPreferred());
  bCaptionsNow.addEventListener("click", () => window.YTB.ensureCaptionsOn());
  bTSLink.addEventListener("click", () => window.YTB.copyTimestampLink());
  bSpeedApply.addEventListener("click", () => window.YTB.applySpeedForThisChannel());

  bLoop.addEventListener("click", () => {
    const on = window.YTB.toggleLoop();
    bLoop.textContent = `Loop: ${on ? "ON" : "OFF"}`;
  });

  // Quick speed
  bS1.addEventListener("click", () => window.YTB.setPlaybackRate(1.0));
  bS125.addEventListener("click", () => window.YTB.setPlaybackRate(1.25));
  bS15.addEventListener("click", () => window.YTB.setPlaybackRate(1.5));
  bS2.addEventListener("click", () => window.YTB.setPlaybackRate(2.0));

  // Speed actions
  bSpeedSave.addEventListener("click", async () => {
    await window.YTB.setSpeedForChannel(speedSelect.value);
    showToast("Saved speed for this channel", "ok");
  });

  bSpeedReset.addEventListener("click", async () => {
    await window.YTB.resetSpeedForChannel();
    showToast("Channel speed reset", "info");
  });

  bSpeedDefault.addEventListener("click", async () => {
    await window.YTB.update({ speed: { defaultRate: 1.0 } });
    showToast("Default speed set to 1.0x", "info");
  });

  // Pomodoro config
  function savePomodoroConfig() {
    const sm = clamp(studyMin.value, 1, 600);
    const bm = clamp(breakMin.value, 1, 180);
    studyMin.value = String(sm);
    breakMin.value = String(bm);

    window.YTB.update({
      pomodoro: {
        studyMinutes: sm,
        breakMinutes: bm,
        autoRepeat: !!tAutoRepeat.checked,
        pauseVideoOnEnd: !!tPauseOnEnd.checked,
        pauseWhenTabHidden: !!tPauseHidden.checked,
        overlayTimer: !!tOverlayTimer.checked
      }
    });
  }

  ["change", "blur"].forEach(ev => {
    studyMin.addEventListener(ev, savePomodoroConfig);
    breakMin.addEventListener(ev, savePomodoroConfig);
  });
  tAutoRepeat.addEventListener("change", savePomodoroConfig);
  tPauseOnEnd.addEventListener("change", savePomodoroConfig);
  tPauseHidden.addEventListener("change", savePomodoroConfig);
  tOverlayTimer.addEventListener("change", savePomodoroConfig);

  // Pomodoro buttons
  pStart.addEventListener("click", () => window.YTB.pomoStart());
  pPause.addEventListener("click", () => window.YTB.pomoPause());
  pStop.addEventListener("click", () => window.YTB.pomoStop());

  // Exam / anti-binge / whitelist config
  function saveExam() {
    window.YTB.update({
      examMode: {
        enabled: !!tExam.checked,
        blockHomeDuringStudy: !!tExamHome.checked,
        blockRecommendationsDuringStudy: !!tExamReco.checked
      }
    });
  }
  tExam.addEventListener("change", saveExam);
  tExamHome.addEventListener("change", saveExam);
  tExamReco.addEventListener("change", saveExam);

  function saveAntiBinge() {
    const mx = clamp(abMax.value, 1, 50);
    abMax.value = String(mx);
    window.YTB.update({
      antiBinge: {
        enabled: !!tAB.checked,
        maxVideosInStudy: mx,
        resetOnBreak: !!tABResetBreak.checked
      }
    });
  }
  ["change", "blur"].forEach(ev => abMax.addEventListener(ev, saveAntiBinge));
  tAB.addEventListener("change", saveAntiBinge);
  tABResetBreak.addEventListener("change", saveAntiBinge);

  abReset.addEventListener("click", () => {
    window.YTB.resetBinge();
    showToast("Anti-binge counter reset", "info");
  });

  function saveWhitelist() {
    const arr = (wlList.value || "")
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean);
    window.YTB.update({
      whitelist: {
        enabled: !!tWL.checked,
        allowedChannels: arr
      }
    });
    showToast("Whitelist saved", "ok");
  }
  wlSave.addEventListener("click", saveWhitelist);
  wlClear.addEventListener("click", () => { wlList.value = ""; saveWhitelist(); });
  tWL.addEventListener("change", saveWhitelist);

  // Bookmarks
  bmAdd.addEventListener("click", async () => {
    await window.YTB.addBookmark(bmNote.value || "");
    bmNote.value = "";
    renderBookmarks();
  });

  bmClear.addEventListener("click", async () => {
    await window.YTB.clearBookmarks();
    renderBookmarks();
  });

  bmExport.addEventListener("click", async () => {
    await window.YTB.exportBookmarksJSON();
  });

  // Splash controls
  function saveSplash() {
    const ms = clamp(splashMs.value, 800, 10000);
    splashMs.value = String(ms);
    window.YTB.update({
      splash: {
        enabled: !!tSplash.checked,
        showOn: "all",
        oncePerSession: !!tSplashOnce.checked,
        durationMs: ms
      }
    });
  }
  tSplash.addEventListener("change", saveSplash);
  tSplashOnce.addEventListener("change", saveSplash);
  ["change", "blur"].forEach(ev => splashMs.addEventListener(ev, saveSplash));

  splashTest.addEventListener("click", () => {
    // test ignores "once per session"
    showSplash({ enabled: true, showOn: "all", oncePerSession: false, durationMs: Number(splashMs.value) || 2200 });
  });
})();
