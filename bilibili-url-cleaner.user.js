// ==UserScript==
// @name         Bilibili URL Cleaner
// @namespace    https://github.com/lll889745/Bilibili-URL-Cleaner
// @version      1.0.0
// @description  清除B站链接中的追踪参数
// @author       Daniel
// @match        *://*.bilibili.com/*
// @match        *://b23.tv/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/lll889745/Bilibili-URL-Cleaner
// @supportURL   https://github.com/lll889745/Bilibili-URL-Cleaner/issues
// @downloadURL  https://raw.githubusercontent.com/lll889745/Bilibili-URL-Cleaner/main/bilibili-url-cleaner.user.js
// @updateURL    https://raw.githubusercontent.com/lll889745/Bilibili-URL-Cleaner/main/bilibili-url-cleaner.user.js
// ==/UserScript==

(function () {
  'use strict';

  const DIRTY_PARAMS = [
    'spm_id_from',
    'vd_source',
    'trackid',
    'from_source',
    'from_spmid',
    'share_source',
    'share_medium',
    'share_plat',
    'share_from',
    'share_tag',
    'share_session_id',
    'unique_k',
    'bbid',
    'ts',
    'msource',
    'refer_from',
    'broadcast_type',
    'is_room_feed',
    'session_id',
    'launch_id',
    'live_from',
    'session_from',
    'spmid',
    'plat_id',
    'goto',
    'visit_id',
  ];

  const cleanUrl = (input) => {
    try {
      const u = new URL(input, location.origin);
      let changed = false;
      DIRTY_PARAMS.forEach((p) => {
        if (u.searchParams.has(p)) {
          u.searchParams.delete(p);
          changed = true;
        }
      });
      if (!changed) return input;
      const search = u.searchParams.toString();
      return u.pathname + (search ? '?' + search : '') + u.hash;
    } catch {
      return input;
    }
  };

  const wrap = (orig) => function (state, title, url) {
    if (url) {
      try { url = cleanUrl(url); } catch {}
    }
    return orig.apply(this, [state, title, url]);
  };
  history.pushState = wrap(history.pushState);
  history.replaceState = wrap(history.replaceState);

  const sweep = () => {
    if (!location.search) return;
    if (DIRTY_PARAMS.some((p) => location.search.includes(p + '='))) {
      const cleaned = cleanUrl(location.href);
      if (cleaned !== location.pathname + location.search + location.hash) {
        history.replaceState(history.state, '', cleaned);
      }
    }
  };

  window.addEventListener('DOMContentLoaded', sweep);
  window.addEventListener('popstate', sweep);
  window.addEventListener('hashchange', sweep);
  setInterval(sweep, 800);

  const cleanAnchors = () => {
    document.querySelectorAll('a[href]').forEach((a) => {
      const before = a.getAttribute('href');
      if (!before || !DIRTY_PARAMS.some((p) => before.includes(p + '='))) return;
      try {
        const cleaned = cleanUrl(before.startsWith('http') ? before : new URL(before, location.origin).href);
        a.setAttribute('href', cleaned);
      } catch {}
    });
  };
  window.addEventListener('DOMContentLoaded', () => {
    cleanAnchors();
    new MutationObserver(cleanAnchors).observe(document.body, { subtree: true, childList: true });
  });
})();
