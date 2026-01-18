(function () {
  const defaults = {
    // UI / limpieza
    focusMode: true,
    hideShorts: true,
    hideComments: false,
    hideSidebar: false,
    hideEndCards: true,
    hideLiveChat: true,

    // Player
    theaterOnLoad: true,
    autoHD: true,
    captionsOnLoad: true,

    // Autoplay
    autoplayOff: true,

    // Splash (entrada animada)
    splash: {
      enabled: true,
      showOn: "all",          // "youtube" | "watch" | "all"
      oncePerSession: true,
      durationMs: 2200
    },

    // Pomodoro
    pomodoro: {
      enabled: true,
      studyMinutes: 25,
      breakMinutes: 5,
      autoRepeat: false,
      pauseVideoOnEnd: true,
      pauseWhenTabHidden: true,
      overlayTimer: true
    },

    // Velocidad
    speed: {
      defaultRate: 1.0,
      perChannel: {} // { "/@canal": 1.25 }
    },

    // Tracking
    tracking: {
      enabled: true,
      onlyWhenTabActive: true
    },

    // Modo Examen
    examMode: {
      enabled: true,
      blockHomeDuringStudy: true,
      blockRecommendationsDuringStudy: true
    },

    // Anti-binge
    antiBinge: {
      enabled: true,
      maxVideosInStudy: 3,
      resetOnBreak: true
    },

    // Lista blanca (study)
    whitelist: {
      enabled: false,
      allowedChannels: [] // ["/@freecodecamp", "/@KhanAcademy"]
    }
  };

  const state = {
    settings: JSON.parse(JSON.stringify(defaults)),
    lastUrl: location.href,

    // pomodoro runtime
    pomo: {
      mode: "idle", // idle | study | break | paused
      remainingSec: 0,
      lastTick: 0,
      savedModeBeforePause: "study"
    },

    // tracking runtime
    track: {
      sessionSec: 0,
      videoSec: 0,
      daySec: 0,
      lastStoreAt: 0
    },

    // anti-binge runtime
    binge: {
      countInStudy: 0,
      locked: false
    },

    // last watch url
    lastWatchUrl: null
  };

  function deepMerge(base, patch) {
    if (!patch || typeof patch !== "object") return base;
    for (const k of Object.keys(patch)) {
      const pv = patch[k];
      if (pv && typeof pv === "object" && !Array.isArray(pv)) {
        base[k] = deepMerge(base[k] || {}, pv);
      } else {
        base[k] = pv;
      }
    }
    return base;
  }

  async function load() {
    const obj = await chrome.storage.local.get(["ytb:settings"]);
    const stored = obj["ytb:settings"] || {};
    state.settings = deepMerge(JSON.parse(JSON.stringify(defaults)), stored);
  }

  async function save() {
    await chrome.storage.local.set({ "ytb:settings": state.settings });
  }

  function isWatchPage() {
    return location.pathname === "/watch";
  }
  function isHomeLike() {
    // Home, explore, feed, subscriptions, etc.
    const p = location.pathname;
    return p === "/" || p.startsWith("/feed") || p.startsWith("/results") === false && p.startsWith("/shorts") === false && p !== "/watch" && !p.startsWith("/@") && !p.startsWith("/channel") && !p.startsWith("/c/");
  }

  function clickIfExists(selector) {
    const el = document.querySelector(selector);
    if (el) el.click();
  }

  function getVideo() {
    return document.querySelector("video");
  }

  function applyCSSFlags() {
    const s = state.settings;

    document.documentElement.toggleAttribute("ytb-focus", !!s.focusMode);
    document.documentElement.toggleAttribute("ytb-hide-shorts", !!s.hideShorts);
    document.documentElement.toggleAttribute("ytb-hide-comments", !!s.hideComments);
    document.documentElement.toggleAttribute("ytb-hide-sidebar", !!s.hideSidebar);
    document.documentElement.toggleAttribute("ytb-hide-endcards", !!s.hideEndCards);
    document.documentElement.toggleAttribute("ytb-hide-livechat", !!s.hideLiveChat);

    document.documentElement.toggleAttribute("ytb-study", state.pomo.mode === "study");
    document.documentElement.toggleAttribute("ytb-break", state.pomo.mode === "break");
    document.documentElement.toggleAttribute("ytb-overlay-timer", !!s.pomodoro.overlayTimer);

    document.documentElement.toggleAttribute("ytb-exam", !!s.examMode.enabled);
    document.documentElement.toggleAttribute("ytb-exam-block-home", !!s.examMode.blockHomeDuringStudy);
    document.documentElement.toggleAttribute("ytb-exam-block-reco", !!s.examMode.blockRecommendationsDuringStudy);

    document.documentElement.toggleAttribute("ytb-blocker", false);

    window.dispatchEvent(new CustomEvent("YTB_POMO_UPDATE", { detail: getPomoPublic() }));
  }

  // ---------- Player helpers ----------
  function theaterMode() {
    clickIfExists(".ytp-size-button");
  }

  function setQualityPreferred() {
    const video = getVideo();
    if (!video) return;

    clickIfExists(".ytp-settings-button");
    setTimeout(() => {
      const items = [...document.querySelectorAll(".ytp-menuitem")];
      const qualityItem = items.find(i => {
        const t = (i.innerText || "").toLowerCase();
        return t.includes("quality") || t.includes("calidad");
      });
      if (qualityItem) qualityItem.click();

      setTimeout(() => {
        const qItems = [...document.querySelectorAll(".ytp-menuitem")];
        const preferred = ["2160", "1440", "1080", "720"];
        for (const p of preferred) {
          const found = qItems.find(i => (i.innerText || "").includes(p));
          if (found) { found.click(); break; }
        }
        setTimeout(() => clickIfExists(".ytp-settings-button"), 150);
      }, 220);
    }, 260);
  }

  function ensureCaptionsOn() {
    const btn = document.querySelector(".ytp-subtitles-button");
    if (!btn) return;
    const pressed = btn.getAttribute("aria-pressed");
    if (pressed === "false" || pressed === null) btn.click();
  }

  function setPlaybackRate(rate) {
    const v = getVideo();
    if (!v) return;
    v.playbackRate = Number(rate);
  }

  function toggleLoop() {
    const v = getVideo();
    if (!v) return false;
    v.loop = !v.loop;
    return v.loop;
  }

  function copyTimestampLink() {
    const v = getVideo();
    if (!v) return;
    const sec = Math.floor(v.currentTime || 0);
    const url = new URL(location.href);
    url.searchParams.set("t", `${sec}s`);
    const text = url.toString();

    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();

    window.dispatchEvent(new CustomEvent("YTB_NOTIFY", { detail: { kind: "ok", text: "Timestamp link copied" } }));
  }

  function getChannelKey() {
    const a = document.querySelector("ytd-channel-name a[href^='/@'], ytd-channel-name a[href^='/channel/'], ytd-channel-name a[href^='/c/']");
    const href = a?.getAttribute("href") || "";
    if (href) return href.trim();

    const metaA = document.querySelector("#owner a[href^='/@'], #owner a[href^='/channel/'], #owner a[href^='/c/']");
    const href2 = metaA?.getAttribute("href") || "";
    if (href2) return href2.trim();

    return "unknown-channel";
  }

  function applySpeedForThisChannel() {
    const v = getVideo();
    if (!v) return;
    const channelKey = getChannelKey();
    const map = state.settings.speed?.perChannel || {};
    const rate = map[channelKey] ?? state.settings.speed.defaultRate ?? 1.0;

    if (Math.abs(v.playbackRate - rate) > 0.001) v.playbackRate = rate;

    window.dispatchEvent(new CustomEvent("YTB_SPEED_APPLIED", { detail: { channelKey, rate } }));
  }

  // ---------- Autoplay OFF (best-effort) ----------
  function tryDisableAutoplay() {
    if (!state.settings.autoplayOff) return;
    if (!isWatchPage()) return;

    const candidates = [
      "ytd-compact-autoplay-renderer #toggle",
      "ytd-compact-autoplay-renderer tp-yt-paper-toggle-button",
      "#autoplay #toggle",
      "ytd-watch-next-secondary-results-renderer #toggle"
    ];

    for (const sel of candidates) {
      const t = document.querySelector(sel);
      if (!t) continue;

      const aria = t.getAttribute("aria-checked") ?? t.getAttribute("aria-pressed");
      if (aria === "true") { t.click(); return; }

      const input = t.querySelector("input");
      if (input && input.checked) { t.click(); return; }
    }
  }

  // ---------- Bookmarks (por video) ----------
  function videoIdKey() {
    const url = new URL(location.href);
    return url.searchParams.get("v") || "unknown-video";
  }

  async function addBookmark(noteText = "") {
    const v = getVideo();
    if (!v) return;

    const sec = Math.floor(v.currentTime || 0);
    const key = `ytb:bookmarks:${videoIdKey()}`;
    const obj = await chrome.storage.local.get([key]);
    const arr = obj[key] || [];

    arr.push({ t: sec, note: (noteText || "").slice(0, 200), at: Date.now() });

    await chrome.storage.local.set({ [key]: arr });
    window.dispatchEvent(new CustomEvent("YTB_BOOKMARKS_UPDATED"));
    window.dispatchEvent(new CustomEvent("YTB_NOTIFY", { detail: { kind: "ok", text: `Bookmark saved @ ${sec}s` } }));
  }

  async function getBookmarks() {
    const key = `ytb:bookmarks:${videoIdKey()}`;
    const obj = await chrome.storage.local.get([key]);
    return obj[key] || [];
  }

  async function clearBookmarks() {
    const key = `ytb:bookmarks:${videoIdKey()}`;
    await chrome.storage.local.remove([key]);
    window.dispatchEvent(new CustomEvent("YTB_BOOKMARKS_UPDATED"));
    window.dispatchEvent(new CustomEvent("YTB_NOTIFY", { detail: { kind: "info", text: "Bookmarks cleared" } }));
  }

  async function exportBookmarksJSON() {
    const items = await getBookmarks();
    const payload = {
      videoId: videoIdKey(),
      url: location.href,
      exportedAt: new Date().toISOString(),
      bookmarks: items
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `YouTubeBoost_Bookmarks_${videoIdKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.dispatchEvent(new CustomEvent("YTB_NOTIFY", { detail: { kind: "ok", text: "Bookmarks exported (JSON)" } }));
  }

  function jumpTo(sec) {
    const v = getVideo();
    if (!v) return;
    v.currentTime = Math.max(0, Number(sec) || 0);
    v.play();
  }

  // ---------- TRACKING ----------
  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  async function loadDaySeconds() {
    const key = `ytb:day:${todayKey()}`;
    const obj = await chrome.storage.local.get([key]);
    return obj[key] || 0;
  }

  async function saveDaySeconds(value) {
    const key = `ytb:day:${todayKey()}`;
    await chrome.storage.local.set({ [key]: value });
  }

  function shouldCountNow() {
    if (!state.settings.tracking.enabled) return false;
    if (state.settings.tracking.onlyWhenTabActive && document.hidden) return false;

    const v = getVideo();
    if (!v) return false;
    if (v.paused || v.ended) return false;

    if (state.pomo.mode === "break") return false;
    if (state.binge.locked) return false;

    return true;
  }

  async function trackingTick() {
    if (state.track.daySec === 0 && state.track.lastStoreAt === 0) {
      state.track.daySec = await loadDaySeconds();
    }

    if (shouldCountNow()) {
      state.track.sessionSec += 1;
      state.track.videoSec += 1;
      state.track.daySec += 1;

      window.dispatchEvent(new CustomEvent("YTB_TRACK_UPDATE", {
        detail: {
          sessionSec: state.track.sessionSec,
          videoSec: state.track.videoSec,
          daySec: state.track.daySec
        }
      }));
    }

    const now = Date.now();
    if (!state.track.lastStoreAt) state.track.lastStoreAt = now;
    if (now - state.track.lastStoreAt > 10000) {
      state.track.lastStoreAt = now;
      await saveDaySeconds(state.track.daySec);
    }
  }

  // ---------- BLOCKERS (Exam / Whitelist / Anti-binge) ----------
  function setBlocker(active, title, text, primaryLabel, primaryAction, secondaryLabel, secondaryAction) {
    document.documentElement.toggleAttribute("ytb-blocker", !!active);
    window.dispatchEvent(new CustomEvent("YTB_BLOCKER", {
      detail: {
        active: !!active,
        title: title || "",
        text: text || "",
        primaryLabel: primaryLabel || "",
        secondaryLabel: secondaryLabel || ""
      }
    }));

    state._blockerPrimary = primaryAction || null;
    state._blockerSecondary = secondaryAction || null;

    const v = getVideo();
    if (active && v && !v.paused) v.pause();
  }

  function allowOrBlockByWhitelist() {
    const w = state.settings.whitelist;
    if (!w.enabled) return true;

    const channelKey = getChannelKey();
    const allowed = (w.allowedChannels || []).map(x => (x || "").trim()).filter(Boolean);
    const ok = allowed.includes(channelKey);

    if (!ok && state.pomo.mode === "study") {
      setBlocker(
        true,
        "Whitelist bloqueó este canal",
        `Este canal no está permitido durante Study.\nCanal: ${channelKey}`,
        "Abrir panel",
        () => window.dispatchEvent(new CustomEvent("YTB_TOGGLE_PANEL")),
        "Detener Study",
        () => stopPomo()
      );
      return false;
    }
    return true;
  }

  function examBlockIfNeeded() {
    const ex = state.settings.examMode;
    if (!ex.enabled) return;

    if (state.pomo.mode === "study" && ex.blockHomeDuringStudy && !isWatchPage()) {
      // bloquea home / feeds
      setBlocker(
        true,
        "Modo Examen",
        "Durante Study, el Home y feeds están bloqueados.\nAbre un video o busca un curso.",
        "Ir a último video",
        () => { if (state.lastWatchUrl) location.href = state.lastWatchUrl; else location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; },
        "Abrir búsqueda",
        () => { location.href = "https://www.youtube.com/results?search_query=course"; }
      );
    } else {
      // si no aplica, desactiva si era por examen
      if (!state.binge.locked) setBlocker(false);
    }
  }

  function antiBingeCheckOnNewWatch() {
    const ab = state.settings.antiBinge;
    if (!ab.enabled) return;

    if (state.pomo.mode !== "study") return;

    state.binge.countInStudy += 1;
    const max = Math.max(1, Number(ab.maxVideosInStudy) || 3);

    if (state.binge.countInStudy > max) {
      state.binge.locked = true;
      setBlocker(
        true,
        "Anti-Binge",
        `Llegaste al límite de ${max} videos en Study.\nRespira 10 segundos y decide:`,
        "Continuar (reset)",
        () => {
          state.binge.locked = false;
          state.binge.countInStudy = 1;
          setBlocker(false);
          const v = getVideo();
          if (v) v.play().catch(() => {});
        },
        "Ir a Break",
        () => {
          state.binge.locked = false;
          startBreak();
          setBlocker(false);
        }
      );
    }
  }

  function clearBlockerActions() {
    state._blockerPrimary = null;
    state._blockerSecondary = null;
  }

  // Called by UI when user clicks blocker buttons
  window.addEventListener("YTB_BLOCKER_PRIMARY", () => {
    try { state._blockerPrimary?.(); } finally { clearBlockerActions(); }
  });
  window.addEventListener("YTB_BLOCKER_SECONDARY", () => {
    try { state._blockerSecondary?.(); } finally { clearBlockerActions(); }
  });

  // ---------- POMODORO ----------
  function setPomoMode(mode) {
    state.pomo.mode = mode;
    applyCSSFlags();
    window.dispatchEvent(new CustomEvent("YTB_POMO_UPDATE", { detail: getPomoPublic() }));
  }

  function getPomoPublic() {
    return {
      mode: state.pomo.mode,
      remainingSec: state.pomo.remainingSec,
      studyMinutes: state.settings.pomodoro.studyMinutes,
      breakMinutes: state.settings.pomodoro.breakMinutes,
      autoRepeat: state.settings.pomodoro.autoRepeat,
      pauseVideoOnEnd: state.settings.pomodoro.pauseVideoOnEnd,
      pauseWhenTabHidden: state.settings.pomodoro.pauseWhenTabHidden,
      overlayTimer: state.settings.pomodoro.overlayTimer,
      bingeCount: state.binge.countInStudy
    };
  }

  function startStudy() {
    const mins = Math.max(1, Number(state.settings.pomodoro.studyMinutes) || 25);
    state.pomo.remainingSec = mins * 60;
    state.pomo.lastTick = Date.now();
    setPomoMode("study");
    window.dispatchEvent(new CustomEvent("YTB_NOTIFY", { detail: { kind: "info", text: `Study started: ${mins} min` } }));
    examBlockIfNeeded();
    allowOrBlockByWhitelist();
  }

  function startBreak() {
    const mins = Math.max(1, Number(state.settings.pomodoro.breakMinutes) || 5);
    state.pomo.remainingSec = mins * 60;
    state.pomo.lastTick = Date.now();
    setPomoMode("break");
    window.dispatchEvent(new CustomEvent("YTB_NOTIFY", { detail: { kind: "ok", text: `Break started: ${mins} min` } }));
    if (state.settings.antiBinge.resetOnBreak) {
      state.binge.countInStudy = 0;
      state.binge.locked = false;
    }
    setBlocker(false);
  }

  function pausePomo() {
    if (state.pomo.mode !== "study" && state.pomo.mode !== "break") return;
    state.pomo.savedModeBeforePause = state.pomo.mode;
    setPomoMode("paused");
    window.dispatchEvent(new CustomEvent("YTB_NOTIFY", { detail: { kind: "warn", text: "Pomodoro paused" } }));
  }

  function resumePomo() {
    if (state.pomo.mode !== "paused") return;
    const back = state.pomo.savedModeBeforePause || "study";
    state.pomo.lastTick = Date.now();
    setPomoMode(back);
    window.dispatchEvent(new CustomEvent("YTB_NOTIFY", { detail: { kind: "info", text: "Pomodoro resumed" } }));
    examBlockIfNeeded();
    allowOrBlockByWhitelist();
  }

  function stopPomo() {
    state.pomo.remainingSec = 0;
    state.pomo.lastTick = 0;
    setPomoMode("idle");
    setBlocker(false);
    window.dispatchEvent(new CustomEvent("YTB_NOTIFY", { detail: { kind: "info", text: "Pomodoro stopped" } }));
  }

  function pauseVideoIfEnabled() {
    if (!state.settings.pomodoro.pauseVideoOnEnd) return;
    const v = getVideo();
    if (v && !v.paused) v.pause();
  }

  function pomoTick() {
    if (!state.settings.pomodoro.enabled) return;
    if (state.pomo.mode !== "study" && state.pomo.mode !== "break") return;

    const now = Date.now();
    const elapsed = Math.floor((now - state.pomo.lastTick) / 1000);
    if (elapsed <= 0) return;

    state.pomo.lastTick = now;
    state.pomo.remainingSec -= elapsed;
    if (state.pomo.remainingSec < 0) state.pomo.remainingSec = 0;

    window.dispatchEvent(new CustomEvent("YTB_POMO_UPDATE", { detail: getPomoPublic() }));

    if (state.pomo.remainingSec === 0) {
      if (state.pomo.mode === "study") {
        window.dispatchEvent(new CustomEvent("YTB_NOTIFY", { detail: { kind: "ok", text: "Study finished — break time" } }));
        pauseVideoIfEnabled();
        startBreak();
      } else if (state.pomo.mode === "break") {
        window.dispatchEvent(new CustomEvent("YTB_NOTIFY", { detail: { kind: "ok", text: "Break finished" } }));
        if (state.settings.pomodoro.autoRepeat) startStudy();
        else stopPomo();
      }
    }
  }

  // Pausar video si cambias de pestaña DURANTE study
  document.addEventListener("visibilitychange", () => {
    if (!state.settings.pomodoro.pauseWhenTabHidden) return;
    if (state.pomo.mode !== "study") return;
    if (!document.hidden) return;
    const v = getVideo();
    if (v && !v.paused) v.pause();
  });

  // ---------- INIT / SPA ----------
  async function init() {
    await load();
    applyCSSFlags();

    // Splash
    window.dispatchEvent(new CustomEvent("YTB_SPLASH", { detail: state.settings.splash }));

    if (isWatchPage()) {
      state.lastWatchUrl = location.href;

      if (state.settings.theaterOnLoad) theaterMode();
      if (state.settings.autoHD) setTimeout(setQualityPreferred, 900);
      if (state.settings.captionsOnLoad) setTimeout(ensureCaptionsOn, 1100);
      setTimeout(applySpeedForThisChannel, 1300);
      setTimeout(tryDisableAutoplay, 1500);

      // whitelist check
      setTimeout(allowOrBlockByWhitelist, 1600);
    }

    // Exam mode check (for non-watch pages)
    setTimeout(examBlockIfNeeded, 1200);

    window.dispatchEvent(new CustomEvent("YTB_SETTINGS_UPDATED", { detail: state.settings }));
    window.dispatchEvent(new CustomEvent("YTB_POMO_UPDATE", { detail: getPomoPublic() }));
  }

  function onUrlChange(prevUrl, newUrl) {
    // reset per-video counter
    state.track.videoSec = 0;

    const prevWasWatch = prevUrl && prevUrl.includes("/watch");
    const newIsWatch = newUrl && newUrl.includes("/watch");

    if (newIsWatch) {
      state.lastWatchUrl = newUrl;

      if (state.settings.theaterOnLoad) theaterMode();
      if (state.settings.autoHD) setTimeout(setQualityPreferred, 900);
      if (state.settings.captionsOnLoad) setTimeout(ensureCaptionsOn, 1100);
      setTimeout(applySpeedForThisChannel, 1300);
      setTimeout(tryDisableAutoplay, 1500);

      // anti-binge count only when switching watch->watch (new video)
      if (prevWasWatch) antiBingeCheckOnNewWatch();

      setTimeout(allowOrBlockByWhitelist, 1600);
    }

    setTimeout(examBlockIfNeeded, 1100);
    window.dispatchEvent(new CustomEvent("YTB_BOOKMARKS_UPDATED"));
  }

  setInterval(() => {
    if (location.href !== state.lastUrl) {
      const prev = state.lastUrl;
      state.lastUrl = location.href;
      onUrlChange(prev, state.lastUrl);
      init();
    }
  }, 800);

  setInterval(() => {
    pomoTick();
    trackingTick();
  }, 1000);

  // ---------- Messaging / API ----------
  chrome.runtime.onMessage.addListener(async (msg) => {
    if (msg?.type !== "YTB_COMMAND") return;

    if (msg.command === "toggle_focus") {
      state.settings.focusMode = !state.settings.focusMode;
      applyCSSFlags();
      await save();
      window.dispatchEvent(new CustomEvent("YTB_SETTINGS_UPDATED", { detail: state.settings }));
    }

    if (msg.command === "toggle_panel") {
      window.dispatchEvent(new CustomEvent("YTB_TOGGLE_PANEL"));
    }
  });

  window.YTB = {
    // settings
    getSettings: () => state.settings,
    update: async (patch) => {
      deepMerge(state.settings, patch);
      applyCSSFlags();
      await save();
      window.dispatchEvent(new CustomEvent("YTB_SETTINGS_UPDATED", { detail: state.settings }));
      // re-check blockers after config change
      setTimeout(examBlockIfNeeded, 200);
      setTimeout(allowOrBlockByWhitelist, 250);
    },

    // player
    theaterMode,
    setQualityPreferred,
    ensureCaptionsOn,
    setPlaybackRate,
    toggleLoop,
    copyTimestampLink,

    // speed
    getChannelKey,
    applySpeedForThisChannel,
    setSpeedForChannel: async (rate) => {
      const key = getChannelKey();
      state.settings.speed.perChannel[key] = Number(rate);
      await save();
      applySpeedForThisChannel();
      window.dispatchEvent(new CustomEvent("YTB_SETTINGS_UPDATED", { detail: state.settings }));
    },
    resetSpeedForChannel: async () => {
      const key = getChannelKey();
      delete state.settings.speed.perChannel[key];
      await save();
      applySpeedForThisChannel();
      window.dispatchEvent(new CustomEvent("YTB_SETTINGS_UPDATED", { detail: state.settings }));
    },

    // pomodoro
    pomoStart: () => startStudy(),
    pomoPause: () => { if (state.pomo.mode === "paused") resumePomo(); else pausePomo(); },
    pomoStop: () => stopPomo(),
    pomoGet: () => getPomoPublic(),

    // tracking
    getTracking: () => ({ ...state.track }),

    // bookmarks
    addBookmark,
    getBookmarks,
    clearBookmarks,
    exportBookmarksJSON,
    jumpTo,

    // anti-binge
    getBinge: () => ({ ...state.binge }),
    resetBinge: () => { state.binge.countInStudy = 0; state.binge.locked = false; setBlocker(false); },

    // blockers
    blockerContinue: () => { state.binge.locked = false; setBlocker(false); const v = getVideo(); if (v) v.play().catch(() => {}); }
  };

  init();
})();
