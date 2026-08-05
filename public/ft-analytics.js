/**
 * Fiction Tribe analytics loader — consent-gated Google Analytics, Snitcher,
 * and LinkedIn Insight. Shared verbatim across FT tool sites (shotvault,
 * imagology-style stack, stitchbox, shotcaller); drop into /public and include
 * with <script src="/ft-analytics.js" defer></script>.
 *
 * Nothing loads until the visitor accepts. Choice is stored per-site in
 * localStorage under "ft.consent.v1".
 */
(function () {
  'use strict'

  var KEY = 'ft.consent.v1'

  function loadConsent() {
    try {
      var raw = window.localStorage.getItem(KEY)
      return raw === 'granted' || raw === 'denied' ? raw : null
    } catch (e) {
      return null
    }
  }

  function saveConsent(value) {
    try {
      window.localStorage.setItem(KEY, value)
    } catch (e) {
      /* no-op */
    }
  }

  function injectSrc(src) {
    var s = document.createElement('script')
    s.async = true
    s.src = src
    document.head.appendChild(s)
  }

  function injectInline(code) {
    var s = document.createElement('script')
    s.text = code
    document.head.appendChild(s)
  }

  var enabled = false

  function enableTracking() {
    if (enabled) return
    enabled = true

    // Google Analytics
    injectSrc('https://www.googletagmanager.com/gtag/js?id=G-MSR44ZTKNM')
    injectInline(
      "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-MSR44ZTKNM');"
    )

    // Snitcher
    injectInline(
      '!function (e) { "use strict"; var t = e && e.namespace; if (t && e.profileId && e.cdn) { var i = window[t]; if (i && Array.isArray(i) || (i = window[t] = []), !i.initialized && !i._loaded) if (i._loaded) console && console.warn("[Radar] Duplicate initialization attempted"); else { i._loaded = !0;["track", "page", "identify", "group", "alias", "ready", "debug", "on", "off", "once", "trackClick", "trackSubmit", "trackLink", "trackForm", "pageview", "screen", "reset", "register", "setAnonymousId", "addSourceMiddleware", "addIntegrationMiddleware", "addDestinationMiddleware", "giveCookieConsent"].forEach((function (e) { var a; i[e] = (a = e, function () { var e = window[t]; if (e.initialized) return e[a].apply(e, arguments); var i = [].slice.call(arguments); return i.unshift(a), e.push(i), e }) })), -1 === e.apiEndpoint.indexOf("http") && (e.apiEndpoint = "https://" + e.apiEndpoint), i.bootstrap = function () { var t, i = document.createElement("script"); i.async = !0, i.type = "text/javascript", i.id = "__radar__", i.setAttribute("data-settings", JSON.stringify(e)), i.src = [-1 !== (t = e.cdn).indexOf("http") ? "" : "https://", t, "/releases/latest/radar.min.js"].join(""); var a = document.scripts[0]; a.parentNode.insertBefore(i, a) }, i.bootstrap() } } else "undefined" != typeof console && console.error("[Radar] Configuration incomplete") }({ "apiEndpoint": "radar.snitcher.com", "cdn": "cdn.snitcher.com", "namespace": "Snitcher", "profileId": "8425340" });'
    )

    // LinkedIn Insight Tag
    injectInline(
      '_linkedin_partner_id = "498884"; window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []; window._linkedin_data_partner_ids.push(_linkedin_partner_id); (function (l) { if (!l) { window.lintrk = function (a, b) { window.lintrk.q.push([a, b]) }; window.lintrk.q = [] } var s = document.getElementsByTagName("script")[0]; var b = document.createElement("script"); b.type = "text/javascript"; b.async = true; b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js"; s.parentNode.insertBefore(b, s); })(window.lintrk);'
    )
  }

  var BANNER_CSS =
    '.ft-consent{position:fixed;bottom:16px;left:16px;right:16px;z-index:2147483000;max-width:384px;font-family:Gilroy,-apple-system,sans-serif}' +
    '.ft-consent__card{border-radius:10px;border:1px solid rgba(19,19,19,0.15);background:#FEF7ED;color:#131313;padding:20px;box-shadow:0 16px 40px rgba(19,19,19,0.28)}' +
    '.ft-consent__kicker{margin:0;font-family:"Space Mono",monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#4C00FF}' +
    '.ft-consent__copy{margin:8px 0 0;font-size:14px;line-height:1.55;color:rgba(19,19,19,0.8)}' +
    '.ft-consent__row{margin-top:16px;display:flex;gap:10px}' +
    '.ft-consent button{cursor:pointer;border-radius:6px;padding:10px 20px;font-family:"Space Mono",monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;transition:all 0.25s ease}' +
    '.ft-consent__accept{border:1px solid #4C00FF;background:#4C00FF;color:#fff}' +
    '.ft-consent__accept:hover{opacity:0.85}' +
    '.ft-consent__decline{border:1px solid rgba(19,19,19,0.2);background:transparent;color:rgba(19,19,19,0.75)}' +
    '.ft-consent__decline:hover{border-color:#131313;color:#131313}'

  function showBanner() {
    var style = document.createElement('style')
    style.textContent = BANNER_CSS
    document.head.appendChild(style)

    var wrap = document.createElement('div')
    wrap.className = 'ft-consent'
    wrap.innerHTML =
      '<div class="ft-consent__card" role="dialog" aria-live="polite" aria-label="Cookie consent">' +
      '<p class="ft-consent__kicker">Cookies</p>' +
      '<p class="ft-consent__copy">We use analytics cookies to understand traffic. Nothing loads until you choose.</p>' +
      '<div class="ft-consent__row">' +
      '<button type="button" class="ft-consent__accept">Accept</button>' +
      '<button type="button" class="ft-consent__decline">Decline</button>' +
      '</div></div>'
    document.body.appendChild(wrap)

    wrap.querySelector('.ft-consent__accept').addEventListener('click', function () {
      saveConsent('granted')
      wrap.remove()
      enableTracking()
    })
    wrap.querySelector('.ft-consent__decline').addEventListener('click', function () {
      saveConsent('denied')
      wrap.remove()
    })
  }

  function init() {
    var consent = loadConsent()
    if (consent === 'granted') {
      enableTracking()
    } else if (consent === null) {
      showBanner()
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
