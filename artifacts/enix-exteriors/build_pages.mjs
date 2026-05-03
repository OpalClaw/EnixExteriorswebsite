#!/usr/bin/env node
/**
 * Build all GHL-compatible standalone HTML pages for Enix Exteriors.
 * Each page is self-contained: inline CSS, inline SVG icons, inline JS.
 * Run: node build_pages.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ARTICLE_DATA } from "./articles.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const PUB = path.join(ROOT, "public");
fs.mkdirSync(PUB, { recursive: true });

// --- Constants ----------------------------------------------------------------
const PHONE_DISPLAY = "(865) 685-ENIX";
const PHONE_TEL = "8656853649";
const EMAIL = "info@enixexteriors.com";
const ADDRESS = "5992 Bearden View Ln, Knoxville TN 37909";
const FORMSUBMIT = `https://formsubmit.co/${EMAIL}`;

// All pages: [slug, filename, label, outputDir]
// home is written to ROOT, all others to PUB
const PAGES = [
  ["home",                    "index.html",                    "Home",                   ROOT],
  ["commercial-roofing",      "commercial-roofing.html",       "Commercial Roofing",      PUB],
  ["residential-roofing",     "residential-roofing.html",      "Residential Roofing",     PUB],
  ["exterior-services",       "exterior-services.html",        "Exterior Services",        PUB],
  ["storm-damage-commercial", "storm-damage-commercial.html",  "Storm Damage Commercial",  PUB],
  ["storm-damage-residential","storm-damage-residential.html", "Storm Damage Residential", PUB],
  ["education-hub",           "education-hub.html",            "Education Hub",            PUB],
  ["gallery",                 "gallery.html",                  "Gallery",                  PUB],
  ["about",                   "about.html",                    "About",                    PUB],
  ["contact",                 "contact.html",                  "Contact",                  PUB],
  ["tennessee-locations",     "tennessee-locations.html",      "Tennessee Locations",       PUB],
];

// URL map: slug → filename (relative, works from any page since all are served at root)
const URL = Object.fromEntries(PAGES.map(([s, f]) => [s, f]));

// --- SVG icons ----------------------------------------------------------------
const _svg = (body, w = 24, h = w, stroke = "currentColor") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const ICON = {
  home:        '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  building:    '<path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M9 21v-6h6v6"/><path d="M10 9h4"/><path d="M10 13h4"/>',
  shield:      '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  phone:       '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail:        '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  mapPin:      '<path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  clock:       '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  alert:       '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  file:        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  star:        '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  award:       '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  users:       '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  book:        '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  arrowRight:  '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  arrowDown:   '<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>',
  send:        '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  tool:        '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  droplet:     '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
  windPanel:   '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
  image:       '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  play:        '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
  chevDown:    '<polyline points="6 9 12 15 18 9"/>',
  chevRight:   '<polyline points="9 18 15 12 9 6"/>',
  close:       '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  menu:        '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
};
const icon = (name, w = 24, h = null, color = "#FF6A00") =>
  _svg(ICON[name] || "", w, h || w, color);

// --- CSS ----------------------------------------------------------------------
const CSS = `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;overflow-x:hidden}
body{font-family:'Inter',sans-serif;background:#0B0C0E;color:#F4F6F8;overflow-x:hidden;line-height:1.6}
img{max-width:100%;display:block}
a{color:inherit}
.font-display{font-family:'Sora',sans-serif}
.font-mono{font-family:'IBM Plex Mono',monospace}

/* ===== NAV ===== */
.nav{position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(11,12,14,.0);backdrop-filter:blur(0px);transition:all .35s;border-bottom:1px solid transparent}
.nav.scrolled{background:rgba(11,12,14,.97);backdrop-filter:blur(16px);border-bottom-color:rgba(255,106,0,.18)}
.nav-inner{max-width:1280px;margin:0 auto;padding:0 30px;height:72px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.nav-logo{display:flex;align-items:center;gap:14px;text-decoration:none;flex-shrink:0}
.nav-logo img.logo-img{height:54px;width:auto;object-fit:contain;display:block}
.nav-logo-fallback{display:none;align-items:center;gap:10px}
.nav-brand{display:flex;flex-direction:column;line-height:1.1}
.nav-brand-name{font-family:'Sora';font-weight:800;color:#fff;font-size:22px;letter-spacing:-.5px;white-space:nowrap}
.nav-brand-name span{color:#FF6A00}
.nav-brand-tagline{color:#FF6A00;font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;white-space:nowrap}
.nav-links{display:flex;align-items:center;gap:6px}
.nav-links a,.nav-links .dropdown-toggle{color:#C5CDD6;text-decoration:none;font-size:13.5px;font-weight:500;transition:color .2s;cursor:pointer;background:none;border:none;font-family:inherit;display:inline-flex;align-items:center;gap:4px;padding:6px 10px;border-radius:8px;white-space:nowrap}
.nav-links a:hover,.nav-links .dropdown-toggle:hover{color:#fff;background:rgba(255,255,255,.06)}
.nav-links a.active{color:#FF6A00}
.nav-cta{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;background:#FF6A00;color:#fff!important;text-decoration:none;font-weight:700;font-size:14px;border-radius:10px;transition:all .3s;white-space:nowrap;margin-left:8px}
.nav-cta:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(255,106,0,.45);background:#ff7a1a}
.dropdown{position:relative}
.dropdown-menu{position:absolute;top:calc(100% + 8px);left:0;background:rgba(14,17,21,.98);backdrop-filter:blur(20px);border:1px solid rgba(255,106,0,.2);border-radius:16px;padding:10px;min-width:260px;opacity:0;visibility:hidden;transform:translateY(-8px);transition:all .22s;box-shadow:0 32px 80px rgba(0,0,0,.6)}
.dropdown:hover .dropdown-menu,.dropdown:focus-within .dropdown-menu{opacity:1;visibility:visible;transform:translateY(0)}
.dropdown-menu a{display:flex;align-items:center;gap:10px;padding:11px 14px;color:#C5CDD6;text-decoration:none;font-size:13.5px;border-radius:10px;transition:all .18s;background:none}
.dropdown-menu a:hover{color:#fff;background:rgba(255,106,0,.12)}
.mobile-toggle{display:none;background:none;border:none;color:#fff;cursor:pointer;padding:8px;border-radius:8px;transition:background .2s}
.mobile-toggle:hover{background:rgba(255,255,255,.08)}
.mobile-menu{display:none;position:fixed;inset:0;background:#0B0C0E;z-index:1100;overflow-y:auto;flex-direction:column}
.mobile-menu.open{display:flex}
.mobile-menu-header{display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid rgba(255,255,255,.1)}
.mobile-menu-header .logo-img{height:46px;width:auto}
.mobile-menu-close{background:none;border:none;color:#fff;cursor:pointer;padding:8px;border-radius:8px}
.mobile-menu-body{padding:20px 24px;flex:1}
.mobile-menu-body a{display:block;color:#fff;text-decoration:none;font-family:'Sora';font-size:20px;font-weight:700;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.07);transition:color .2s}
.mobile-menu-body a:hover{color:#FF6A00}
.mobile-menu-body .section-label{font-family:'IBM Plex Mono';font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#FF6A00;margin:20px 0 8px;display:block}
.mobile-menu-footer{padding:20px 24px;border-top:1px solid rgba(255,255,255,.1)}
.mobile-menu-footer a{display:flex;align-items:center;gap:10px;padding:14px 20px;background:#FF6A00;color:#fff;text-decoration:none;font-weight:700;font-size:16px;border-radius:12px;justify-content:center;margin-bottom:12px}

/* ===== HERO ===== */
.hero-bg{position:absolute;inset:0;z-index:0;background:linear-gradient(135deg,#0f1115 0%,#0B0C0E 50%,#131619 100%)}
.hero-bg::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 20% 30%,rgba(255,106,0,.12) 0%,transparent 55%),radial-gradient(ellipse at 80% 70%,rgba(255,106,0,.07) 0%,transparent 55%)}
.section-bg-dark{background:#0B0C0E}
.section-bg-charcoal{background:#111418}
.bg-image{position:absolute;inset:0;z-index:0}
.bg-image img{width:100%;height:100%;object-fit:cover}
.bg-image::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(11,12,14,.96) 0%,rgba(11,12,14,.8) 55%,rgba(11,12,14,.5) 100%)}
.bg-image.center::after{background:rgba(11,12,14,.82)}
.bg-image.heavy::after{background:rgba(11,12,14,.9)}

/* ===== TYPE ===== */
.headline-xl{font-family:'Sora';font-weight:800;line-height:.93;letter-spacing:-.025em;text-transform:uppercase;color:#fff}
.label-mono{font-family:'IBM Plex Mono';font-weight:500;font-size:11.5px;letter-spacing:.2em;text-transform:uppercase;color:#FF6A00;display:inline-block}
.lead{font-size:17.5px;color:#A9B1BC;max-width:580px;line-height:1.7}
.muted{color:#A9B1BC}

/* ===== CARDS ===== */
.glass-card{background:rgba(18,21,26,.85);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.09);box-shadow:0 20px 60px rgba(0,0,0,.4);border-radius:18px;padding:26px}
.glass-card.tight{padding:16px}
.card-icon{width:46px;height:46px;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(255,106,0,.13);color:#FF6A00;margin-bottom:14px;flex-shrink:0}

/* ===== BUTTONS ===== */
.btn-primary,.btn-secondary{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;text-decoration:none;font-weight:700;font-size:15px;border-radius:12px;transition:all .28s;border:none;cursor:pointer;font-family:inherit;white-space:nowrap}
.btn-primary{background:#FF6A00;color:#fff}
.btn-primary:hover{transform:translateY(-3px);box-shadow:0 14px 36px rgba(255,106,0,.45);background:#ff7a1a}
.btn-secondary{background:transparent;color:#fff;border:2px solid rgba(255,255,255,.28)}
.btn-secondary:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.55);transform:translateY(-3px)}

/* ===== FORM ===== */
.form-input,.form-select,.form-textarea{width:100%;padding:14px 16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:12px;color:#fff;font-size:15px;font-family:inherit;transition:all .2s;-webkit-appearance:none}
.form-input::placeholder,.form-textarea::placeholder{color:rgba(255,255,255,.35)}
.form-input:focus,.form-select:focus,.form-textarea:focus{outline:none;border-color:rgba(255,106,0,.55);box-shadow:0 0 0 3px rgba(255,106,0,.14)}
.form-select option{background:#14171B;color:#fff}
.form-textarea{resize:vertical;min-height:130px}
.service-radio{cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding:14px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);transition:all .2s}
.service-radio input{display:none}
.service-radio:hover{background:rgba(255,255,255,.07);border-color:rgba(255,106,0,.3)}
.service-radio.selected{background:rgba(255,106,0,.15);border-color:#FF6A00}
.service-radio .lbl{color:#fff;font-size:13px;font-weight:600}

/* ===== LAYOUT ===== */
.section{position:relative;width:100%;overflow:hidden}
.section-content{position:relative;z-index:10;padding:140px 30px 90px;max-width:1200px;margin:0 auto}
.section-content.tight{padding:90px 30px 70px}
.section-content.slim{padding:70px 30px 60px}
.grid{display:grid;gap:18px}
.grid-2{grid-template-columns:repeat(2,1fr)}
.grid-3{grid-template-columns:repeat(3,1fr)}
.grid-4{grid-template-columns:repeat(4,1fr)}
.grid-5{grid-template-columns:repeat(5,1fr)}
.flex{display:flex}
.flex-wrap{flex-wrap:wrap}
.items-center{align-items:center}
.items-start{align-items:flex-start}
.justify-between{justify-content:space-between}
.justify-center{justify-content:center}
.text-center{text-align:center}
.gap-2{gap:8px}.gap-3{gap:12px}.gap-4{gap:16px}.gap-6{gap:24px}.gap-8{gap:32px}
.mb-2{margin-bottom:8px}.mb-3{margin-bottom:12px}.mb-4{margin-bottom:16px}.mb-6{margin-bottom:24px}.mb-8{margin-bottom:32px}.mb-10{margin-bottom:40px}.mb-12{margin-bottom:48px}
.mt-4{margin-top:16px}.mt-6{margin-top:24px}.mt-8{margin-top:32px}
.w-full{width:100%}
.max-w-md{max-width:520px}.max-w-lg{max-width:640px}.max-w-xl{max-width:760px}.max-w-2xl{max-width:880px}

/* ===== UTILITY ===== */
.check-list{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.check-list .item{display:flex;align-items:flex-start;gap:10px;color:#fff;font-size:14px;padding:10px 12px;background:rgba(255,255,255,.04);border-radius:10px;border:1px solid rgba(255,255,255,.07)}
.check-list .item svg{flex-shrink:0;margin-top:2px}
.step{display:flex;align-items:flex-start;gap:14px;margin-bottom:18px}
.step-num{width:40px;height:40px;border-radius:50%;background:#FF6A00;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;flex-shrink:0;font-family:'Sora'}
.step h4{font-family:'Sora';font-size:17px;color:#fff;margin-bottom:5px}
.step p{color:#A9B1BC;font-size:14px}
.tag{display:inline-flex;align-items:center;padding:4px 12px;background:rgba(255,255,255,.08);border-radius:999px;font-size:12px;color:#A9B1BC}
.tag.orange{background:rgba(255,106,0,.15);color:#FF6A00}
.divider{height:1px;background:rgba(255,255,255,.1);margin:32px 0}
.ic-line{display:flex;align-items:center;gap:10px;color:#A9B1BC;font-size:14px;padding:6px 0}
.ic-line strong{color:#fff}

/* ===== ARTICLE ACCORDION ===== */
.article-card{background:rgba(18,21,26,.85);border:1px solid rgba(255,255,255,.09);border-radius:18px;overflow:hidden;transition:border-color .25s}
.article-card.open{border-color:rgba(255,106,0,.4)}
.article-header{display:flex;align-items:center;justify-content:space-between;padding:22px 26px;cursor:pointer;gap:14px;transition:background .2s}
.article-header:hover{background:rgba(255,106,0,.06)}
.article-header-left{display:flex;align-items:flex-start;gap:14px;flex:1;min-width:0}
.article-meta{flex:1;min-width:0}
.article-category{font-family:'IBM Plex Mono';font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#FF6A00;margin-bottom:5px;display:block}
.article-title{font-family:'Sora';font-weight:700;color:#fff;font-size:17px;line-height:1.3}
.article-read{color:#A9B1BC;font-size:12px;margin-top:4px}
.article-chevron{transition:transform .25s;color:#FF6A00;flex-shrink:0}
.article-card.open .article-chevron{transform:rotate(180deg)}
.article-body{display:none;padding:0 26px 26px;color:#A9B1BC;font-size:15px;line-height:1.8;border-top:1px solid rgba(255,255,255,.07)}
.article-card.open .article-body{display:block}
.article-body h3{font-family:'Sora';font-weight:700;color:#fff;font-size:18px;margin:22px 0 10px}
.article-body h4{font-family:'Sora';font-weight:600;color:#fff;font-size:16px;margin:18px 0 8px}
.article-body p{margin-bottom:14px}
.article-body ul,.article-body ol{margin:12px 0 16px 22px;display:flex;flex-direction:column;gap:6px}
.article-body li{color:#A9B1BC}
.article-body strong{color:#fff}
.article-body .article-cta{display:inline-flex;align-items:center;gap:8px;margin-top:18px;padding:12px 22px;background:#FF6A00;color:#fff;text-decoration:none;font-weight:700;font-size:14px;border-radius:10px;transition:all .28s}
.article-body .article-cta:hover{background:#ff7a1a;transform:translateY(-2px)}

/* ===== GALLERY ===== */
.gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.gallery-item{border-radius:14px;overflow:hidden;position:relative;cursor:pointer;aspect-ratio:4/3;background:#111418}
.gallery-item img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
.gallery-item:hover img{transform:scale(1.06)}
.gallery-item-overlay{position:absolute;inset:0;background:rgba(11,12,14,0);transition:background .3s;display:flex;align-items:center;justify-content:center}
.gallery-item:hover .gallery-item-overlay{background:rgba(11,12,14,.45)}
.gallery-item-overlay svg{opacity:0;transform:scale(.8);transition:all .3s}
.gallery-item:hover .gallery-item-overlay svg{opacity:1;transform:scale(1)}
.lightbox{display:none;position:fixed;inset:0;background:rgba(5,6,8,.97);z-index:2000;align-items:center;justify-content:center;padding:20px}
.lightbox.open{display:flex}
.lightbox-img{max-width:90vw;max-height:88vh;border-radius:14px;object-fit:contain}
.lightbox-close{position:absolute;top:20px;right:24px;background:rgba(255,255,255,.12);border:none;color:#fff;font-size:28px;cursor:pointer;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background .2s}
.lightbox-close:hover{background:rgba(255,106,0,.5)}
.lightbox-nav{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.1);border:none;color:#fff;cursor:pointer;width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background .2s}
.lightbox-nav:hover{background:rgba(255,106,0,.5)}
.lightbox-prev{left:18px}.lightbox-next{right:18px}

/* ===== VIDEOS ===== */
.video-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.video-wrapper{border-radius:16px;overflow:hidden;background:#0d1014;border:1px solid rgba(255,255,255,.08);aspect-ratio:16/9}
.video-wrapper iframe{width:100%;height:100%;border:none;display:block}
.video-card{position:relative;border-radius:16px;overflow:hidden;aspect-ratio:16/9;cursor:pointer;display:block;text-decoration:none}
.video-card-bg{position:absolute;inset:0;z-index:0}
.video-card-bg img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
.video-card:hover .video-card-bg img{transform:scale(1.06)}
.video-card-overlay{position:absolute;inset:0;background:linear-gradient(0deg,rgba(11,12,14,.88) 0%,rgba(11,12,14,.45) 50%,rgba(11,12,14,.2) 100%);z-index:1}
.video-card-play{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center}
.video-card-play-btn{width:68px;height:68px;border-radius:50%;background:#FF6A00;display:flex;align-items:center;justify-content:center;transition:all .3s;box-shadow:0 0 0 0 rgba(255,106,0,.4)}
.video-card:hover .video-card-play-btn{transform:scale(1.1);box-shadow:0 0 0 14px rgba(255,106,0,.18)}
.video-card-info{position:absolute;bottom:0;left:0;right:0;z-index:2;padding:20px 22px}
.video-card-tag{font-family:'IBM Plex Mono';font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#FF6A00;display:block;margin-bottom:6px}
.video-card-title{font-family:'Sora';font-weight:700;color:#fff;font-size:16px;line-height:1.35}
.video-label{font-family:'Sora';font-weight:600;color:#fff;font-size:15px;margin-top:12px;text-align:center}
.video-label small{display:block;color:#A9B1BC;font-size:12px;font-weight:400;margin-top:3px;font-family:'Inter'}

/* ===== ANIMATED EDU VIDEO PLAYER ===== */
.edu-player{position:relative;border-radius:16px;overflow:hidden;background:#000;aspect-ratio:16/9;box-shadow:0 8px 40px rgba(0,0,0,.6)}
.edu-player-screen{position:absolute;inset:0}
.video-expand-card{width:100%;border:1px solid rgba(255,255,255,.12);background:rgba(18,21,26,.9);border-radius:16px;padding:14px 16px;cursor:pointer;color:#fff;text-align:left;transition:all .25s;margin-bottom:12px}
.video-expand-card:hover{border-color:rgba(255,106,0,.38);transform:translateY(-1px)}
.video-expand-card.open{border-color:#FF6A00}
.video-expand-card-top{display:flex;align-items:center;justify-content:space-between;gap:14px}
.video-expand-card-label{font-family:'Sora';font-weight:700;font-size:15px;line-height:1.35}
.video-expand-card-toggle{font-family:'IBM Plex Mono';font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#A9B1BC;white-space:nowrap}
.video-expand-card.open .video-expand-card-toggle{color:#FF6A00}
.video-expand-panel{max-height:0;overflow:hidden;transition:max-height .45s ease,opacity .3s ease;opacity:0}
.video-expand-panel.open{max-height:1200px;opacity:1}
.edu-slide{position:absolute;inset:0;opacity:0;transition:opacity .7s ease}
.edu-slide.active{opacity:1}
.edu-slide-bg{position:absolute;inset:0}
.edu-slide-bg img{width:100%;height:100%;object-fit:cover}
.edu-slide-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(11,12,14,.93) 0%,rgba(11,12,14,.78) 60%,rgba(11,12,14,.55) 100%)}
.edu-slide-content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:clamp(20px,5%,52px) clamp(20px,6%,60px)}
.edu-slide-tag{font-family:'IBM Plex Mono';font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#FF6A00;margin-bottom:14px}
.edu-slide-headline{font-family:'Sora';font-weight:800;color:#fff;font-size:clamp(18px,3.5vw,38px);line-height:1.2;margin-bottom:18px}
.edu-slide-points{display:flex;flex-direction:column;gap:10px}
.edu-slide-point{display:flex;align-items:flex-start;gap:10px;font-family:'Inter';font-size:clamp(13px,1.8vw,16px);color:rgba(255,255,255,.9);line-height:1.5}
.edu-slide-point::before{content:'›';color:#FF6A00;font-size:20px;line-height:1.25;flex-shrink:0}
.edu-slide-cta-btn{display:inline-block;margin-top:22px;background:#FF6A00;color:#fff;font-family:'Sora';font-weight:700;font-size:14px;padding:13px 26px;border-radius:8px;text-decoration:none;letter-spacing:.03em;transition:opacity .2s}
.edu-slide-cta-btn:hover{opacity:.88}
.edu-player-controls{display:flex;align-items:center;gap:10px;padding:14px 0 0;background:transparent;z-index:10}
.edu-play-btn{width:38px;height:38px;border-radius:50%;background:#FF6A00;border:none;cursor:pointer;color:#fff;font-size:15px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .2s;line-height:1}
.edu-play-btn:hover{transform:scale(1.1)}
.edu-nav-btn{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.15);border:none;cursor:pointer;color:#fff;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s;line-height:1}
.edu-nav-btn:hover{background:rgba(255,106,0,.55)}
.edu-progress-track{flex:1;height:4px;background:rgba(255,255,255,.2);border-radius:4px;overflow:hidden}
.edu-progress-fill{height:100%;background:#FF6A00;width:0%;transition:width .1s linear;border-radius:4px}
.edu-counter{font-family:'IBM Plex Mono';font-size:11px;color:rgba(255,255,255,.65);flex-shrink:0;min-width:32px;text-align:right}
.video-modal{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.88);padding:18px}
.video-modal.open{display:flex}
.video-modal-inner{width:min(1200px,96vw);max-height:96vh;display:flex;flex-direction:column;gap:12px}
.video-modal-close{align-self:flex-end;border:none;background:#FF6A00;color:#fff;width:42px;height:42px;border-radius:50%;font-size:28px;line-height:1;cursor:pointer}
.video-modal-player{border-radius:18px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.video-modal-player .edu-player{aspect-ratio:16/9;width:100%}
.video-modal-player .edu-player-controls{position:static;padding:12px 4px 0}
.video-modal-player .edu-player-screen{position:relative;height:calc(100% - 56px)}
/* ===== ARTICLE CATEGORY FILTER ===== */
.edu-filter{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:0 0 40px}
.edu-filter-btn{font-family:'IBM Plex Mono';font-size:11px;letter-spacing:.12em;text-transform:uppercase;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:#A9B1BC;padding:9px 16px;border-radius:100px;cursor:pointer;transition:all .25s}
.edu-filter-btn:hover{background:rgba(255,106,0,.15);border-color:rgba(255,106,0,.35);color:#fff}
.edu-filter-btn.active{background:#FF6A00;border-color:#FF6A00;color:#fff}
/* ===== STATS BAR ===== */
.stats-bar{display:grid;grid-template-columns:repeat(4,1fr);gap:0;background:rgba(18,21,26,.85);border:1px solid rgba(255,255,255,.09);border-radius:20px;overflow:hidden;backdrop-filter:blur(14px)}
.stat-cell{padding:32px 20px;text-align:center;position:relative}
.stat-cell:not(:last-child)::after{content:'';position:absolute;right:0;top:20%;bottom:20%;width:1px;background:rgba(255,255,255,.1)}
.stat-big{font-family:'Sora';font-size:clamp(32px,4.5vw,46px);font-weight:800;color:#FF6A00;line-height:1}
.stat-label{color:#A9B1BC;font-size:13px;text-transform:uppercase;letter-spacing:.06em;margin-top:6px}

/* ===== FOOTER ===== */
.back-to-top{position:fixed;right:18px;bottom:18px;z-index:80;opacity:0;pointer-events:none;transform:translateY(10px);transition:all .25s;background:#FF6A00;color:#fff;border:none;border-radius:999px;padding:12px 16px;font-family:'Sora';font-weight:700;box-shadow:0 10px 30px rgba(255,106,0,.25);cursor:pointer}
.back-to-top.show{opacity:1;pointer-events:auto;transform:translateY(0)}
.footer{background:#080A0C;border-top:1px solid rgba(255,106,0,.15);padding:60px 30px 30px}
.footer-inner{max-width:1200px;margin:0 auto}
.footer-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px}
.footer-logo{height:54px;width:auto;object-fit:contain;margin-bottom:14px}
.footer-brand-name{font-family:'Sora';font-weight:800;color:#fff;font-size:20px;letter-spacing:-.4px;margin-bottom:6px}
.footer-brand-name span{color:#FF6A00}
.footer a{color:#A9B1BC;text-decoration:none;font-size:14px;display:block;margin:9px 0;transition:color .2s;line-height:1.4}
.footer a:hover{color:#FF6A00}
.footer h4{font-family:'Sora';font-weight:700;color:#fff;margin-bottom:18px;font-size:15px;letter-spacing:-.2px}
.footer p{color:#A9B1BC;font-size:14px;line-height:1.8}
.footer-bottom{padding-top:28px;border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
.footer-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;background:rgba(255,106,0,.12);border:1px solid rgba(255,106,0,.25);border-radius:999px;color:#FF6A00;font-size:12px;font-weight:600}

/* ===== RESPONSIVE ===== */
@media(max-width:1100px){
  .nav-links{gap:2px}
  .nav-links a,.nav-links .dropdown-toggle{padding:6px 7px;font-size:12.5px}
}
@media(max-width:960px){
  .nav-links{display:none}
  .mobile-toggle{display:flex}
  .video-grid{grid-template-columns:1fr}
  .gallery-grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:768px){
  .grid-2,.grid-3,.grid-4,.grid-5{grid-template-columns:1fr}
  .check-list{grid-template-columns:1fr}
  .section-content{padding:110px 20px 60px}
  .footer-grid{grid-template-columns:1fr 1fr;gap:28px}
  .footer-bottom{flex-direction:column;gap:8px;text-align:center}
  .headline-xl{font-size:clamp(28px,9vw,50px)!important}
  .nav-inner{padding:0 18px;height:64px}
  .stats-bar{grid-template-columns:repeat(2,1fr)}
  .stats-bar .stat-cell:nth-child(2)::after{display:none}
  .stats-bar .stat-cell:nth-child(3){border-top:1px solid rgba(255,255,255,.1)}
  .stats-bar .stat-cell:nth-child(4){border-top:1px solid rgba(255,255,255,.1)}
}
@media(max-width:480px){
  .gallery-grid{grid-template-columns:1fr}
  .footer-grid{grid-template-columns:1fr}
  .nav-brand-name{font-size:18px}
  .lightbox-nav{display:none}
}

/* ===== SCROLLBAR ===== */
::-webkit-scrollbar{width:7px}
::-webkit-scrollbar-track{background:#0B0C0E}
::-webkit-scrollbar-thumb{background:#252930;border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:#363b44}
`.trim();

// --- Nav / Footer / Script ----------------------------------------------------
const LOGO_IMG = `<img src="images/enix-logo-main.jpg" alt="Enix Exteriors Logo" class="logo-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <span class="nav-logo-fallback" style="display:none">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M9 21v-6h6v6"/><path d="M10 9h4"/><path d="M10 13h4"/></svg>
    </span>`;

function navHtml(active) {
  const cls = (slug) => active === slug ? ' class="active"' : '';
  const servicesActive = ["commercial-roofing","residential-roofing","exterior-services","storm-damage-commercial","storm-damage-residential"].includes(active);
  return `<nav class="nav" id="navbar">
  <div class="nav-inner">
    <a href="${URL.home}" class="nav-logo">
      ${LOGO_IMG}
      <div class="nav-brand">
        <span class="nav-brand-name">ENIX <span>EXTERIORS</span></span>
        <span class="nav-brand-tagline">Your Local Roofing Expert</span>
      </div>
    </a>
    <div class="nav-links">
      <a href="${URL.home}"${cls("home")}>Home</a>
      <div class="dropdown">
        <button class="dropdown-toggle"${servicesActive ? ' style="color:#FF6A00"' : ''}>Services ${icon("chevDown",14,14,"currentColor")}</button>
        <div class="dropdown-menu">
          <a href="${URL["commercial-roofing"]}">${icon("building",16,16,"#FF6A00")} Commercial Roofing</a>
          <a href="${URL["residential-roofing"]}">${icon("home",16,16,"#FF6A00")} Residential Roofing</a>
          <a href="${URL["exterior-services"]}">${icon("tool",16,16,"#FF6A00")} Exterior Services</a>
          <a href="${URL["storm-damage-commercial"]}">${icon("alert",16,16,"#FF6A00")} Storm Damage – Commercial</a>
          <a href="${URL["storm-damage-residential"]}">${icon("alert",16,16,"#FF6A00")} Storm Damage – Residential</a>
        </div>
      </div>
      <a href="${URL["education-hub"]}"${cls("education-hub")}>Education Hub</a>
      <a href="${URL["gallery"]}"${cls("gallery")}>Gallery</a>
      <a href="${URL["tennessee-locations"]}"${cls("tennessee-locations")}>Locations</a>
      <a href="${URL.about}"${cls("about")}>About</a>
      <a href="${URL.contact}"${cls("contact")}>Contact</a>
      <a href="tel:${PHONE_TEL}" class="nav-cta">${icon("phone",15,15,"#fff")} Get a Quote</a>
    </div>
    <button class="mobile-toggle" id="mobileToggle" aria-label="Open menu" aria-expanded="false">
      ${icon("menu",26,26,"#fff")}
    </button>
  </div>
</nav>

<div class="mobile-menu" id="mobileMenu" role="dialog" aria-modal="true" aria-label="Navigation">
  <div class="mobile-menu-header">
    <a href="${URL.home}">
      <img src="images/enix-logo-main.jpg" alt="Enix Exteriors" class="logo-img" style="height:46px;object-fit:contain" onerror="this.style.display='none'">
    </a>
    <button class="mobile-menu-close" id="mobileClose" aria-label="Close menu">
      ${icon("close",28,28,"#fff")}
    </button>
  </div>
  <div class="mobile-menu-body">
    <a href="${URL.home}">Home</a>
    <span class="section-label">Services</span>
    <a href="${URL["commercial-roofing"]}" style="font-size:17px;padding:10px 0">Commercial Roofing</a>
    <a href="${URL["residential-roofing"]}" style="font-size:17px;padding:10px 0">Residential Roofing</a>
    <a href="${URL["exterior-services"]}" style="font-size:17px;padding:10px 0">Exterior Services</a>
    <a href="${URL["storm-damage-commercial"]}" style="font-size:17px;padding:10px 0">Storm Damage – Commercial</a>
    <a href="${URL["storm-damage-residential"]}" style="font-size:17px;padding:10px 0">Storm Damage – Residential</a>
    <span class="section-label">Company</span>
    <a href="${URL["education-hub"]}">Education Hub</a>
    <a href="${URL["gallery"]}">Project Gallery</a>
    <a href="${URL["tennessee-locations"]}">Locations</a>
    <a href="${URL.about}">About</a>
    <a href="${URL.contact}">Contact</a>
  </div>
  <div class="mobile-menu-footer">
    <a href="tel:${PHONE_TEL}">${icon("phone",20,20,"#fff")} ${PHONE_DISPLAY}</a>
    <a href="mailto:${EMAIL}" style="background:rgba(255,255,255,.08);color:#fff">${icon("mail",20,20,"#fff")} ${EMAIL}</a>
  </div>
</div>`;
}

const FOOTER_LOGO = `<img src="images/enix-logo-main.jpg" alt="Enix Exteriors" class="footer-logo" onerror="this.style.display='none'">`;

const FOOTER = `<footer class="footer">
  <div class="footer-inner">
    <div class="footer-grid">
      <div>
        ${FOOTER_LOGO}
        <div class="footer-brand-name">ENIX <span>EXTERIORS</span></div>
        <p style="color:#A9B1BC;font-size:13.5px;margin:10px 0 6px;line-height:1.7">Your Local Roofing Expert. Tennessee's top commercial roofing contractor serving Knoxville and statewide.</p>
        <div class="footer-badge" style="margin-top:14px">${icon("shield",14,14,"#FF6A00")} Licensed &amp; Insured</div>
      </div>
      <div>
        <h4>Services</h4>
        <a href="${URL["commercial-roofing"]}">Commercial Roofing</a>
        <a href="${URL["residential-roofing"]}">Residential Roofing</a>
        <a href="${URL["exterior-services"]}">Exterior Services</a>
        <a href="${URL["storm-damage-commercial"]}">Storm Damage – Commercial</a>
        <a href="${URL["storm-damage-residential"]}">Storm Damage – Residential</a>
      </div>
      <div>
        <h4>Company</h4>
        <a href="${URL.about}">About Enix Exteriors</a>
        <a href="${URL["education-hub"]}">Education Hub</a>
        <a href="${URL["gallery"]}">Project Gallery</a>
        <a href="${URL["tennessee-locations"]}">Tennessee Locations</a>
        <a href="${URL.contact}">Contact Us</a>
      </div>
      <div>
        <h4>Contact</h4>
        <a href="tel:${PHONE_TEL}">${icon("phone",14,14,"#FF6A00")} ${PHONE_DISPLAY}</a>
        <a href="mailto:${EMAIL}">${icon("mail",14,14,"#FF6A00")} ${EMAIL}</a>
        <p style="color:#A9B1BC;font-size:13px;margin-top:12px;line-height:1.7">
          ${ADDRESS}<br>
          <strong style="color:#fff">Hours:</strong> Mon–Fri 7am–6pm<br>
          <span style="color:#FF6A00;font-weight:600">Emergency: 24/7</span>
        </p>
      </div>
    </div>
    <div class="footer-bottom">
      <p style="color:#5a6270;font-size:13px">&copy; 2025 Enix Exteriors LLC. All rights reserved.</p>
      <p style="color:#5a6270;font-size:13px">Licensed &amp; Insured | Knoxville, Tennessee</p>
    </div>
  </div>
</footer>`;

const SCRIPT = `<script>
(function(){
  /* NAV SCROLL */
  var nb=document.getElementById('navbar');
  if(nb){window.addEventListener('scroll',function(){nb.classList.toggle('scrolled',window.scrollY>40);},{ passive:true });}

  /* MOBILE MENU */
  var tog=document.getElementById('mobileToggle');
  var menu=document.getElementById('mobileMenu');
  var cls=document.getElementById('mobileClose');
  function openMenu(){if(menu){menu.classList.add('open');document.body.style.overflow='hidden';if(tog)tog.setAttribute('aria-expanded','true');}}
  function closeMenu(){if(menu){menu.classList.remove('open');document.body.style.overflow='';if(tog)tog.setAttribute('aria-expanded','false');}}
  if(tog)tog.addEventListener('click',openMenu);
  if(cls)cls.addEventListener('click',closeMenu);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu();});
  if(menu){menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu);});}

  /* MULTI-STEP FORM */
  var currentStep=1;
  window.nextStep=function(){
    if(currentStep<3){
      var cur=document.getElementById('step'+currentStep);
      var nxt=document.getElementById('step'+(currentStep+1));
      if(cur)cur.style.display='none';
      if(nxt)nxt.style.display='block';
      var pn=document.getElementById('p'+(currentStep+1));
      if(pn)pn.classList.add('active');
      currentStep++;
    }
  };
  window.prevStep=function(){
    if(currentStep>1){
      var cur=document.getElementById('step'+currentStep);
      var prv=document.getElementById('step'+(currentStep-1));
      if(cur)cur.style.display='none';
      if(prv)prv.style.display='block';
      var pn=document.getElementById('p'+currentStep);
      if(pn)pn.classList.remove('active');
      currentStep--;
    }
  };
  window.handleFormSubmit=function(e){
    e.preventDefault();
    var f=e.target;
    var fd=new FormData(f);
    fetch(f.action,{method:'POST',body:fd,headers:{'Accept':'application/json'}})
      .then(function(){showSuccess(f);})
      .catch(function(){showSuccess(f);});
    return false;
  };
  function showSuccess(f){
    var s3=document.getElementById('step3');
    var sx=document.getElementById('success');
    if(s3)s3.style.display='none';
    if(sx)sx.style.display='block';
    setTimeout(function(){
      if(sx)sx.style.display='none';
      var s1=document.getElementById('step1');
      if(s1)s1.style.display='block';
      ['p2','p3'].forEach(function(id){var el=document.getElementById(id);if(el)el.classList.remove('active');});
      currentStep=1;
      if(f)f.reset();
      document.querySelectorAll('.service-radio').forEach(function(r){r.classList.remove('selected');});
    },3800);
  }
  document.querySelectorAll('.service-radio input[type=radio]').forEach(function(inp){
    inp.addEventListener('change',function(){
      document.querySelectorAll('.service-radio').forEach(function(r){r.classList.remove('selected');});
      if(inp.checked)inp.closest('.service-radio').classList.add('selected');
    });
  });

  var topBtn=document.getElementById('backToTop');
  function syncTopBtn(){if(!topBtn)return;if(window.scrollY>600)topBtn.classList.add('show');else topBtn.classList.remove('show');}
  window.addEventListener('scroll',syncTopBtn,{passive:true});
  syncTopBtn();
  window.scrollToTop=function(){window.scrollTo({top:0,behavior:'smooth'});};

  /* ARTICLE ACCORDION */
  document.querySelectorAll('.article-header').forEach(function(hdr){
    hdr.addEventListener('click',function(){
      var card=hdr.closest('.article-card');
      var isOpen=card.classList.contains('open');
      document.querySelectorAll('.article-card.open').forEach(function(c){c.classList.remove('open');});
      if(!isOpen)card.classList.add('open');
    });
  });

  /* ARTICLE CATEGORY FILTER */
  document.querySelectorAll('.edu-filter-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.edu-filter-btn').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');
      var cat=btn.dataset.cat;
      document.querySelectorAll('.article-card').forEach(function(card){
        if(cat==='ALL'||card.dataset.category===cat){card.style.display='';}
        else{card.style.display='none';}
      });
    });
  });

  var quickContact=document.getElementById('quickContact');
  if(quickContact){
    quickContact.addEventListener('click',function(){
      window.location.href='tel:8656853649';
    });
  }

  /* ANIMATED EDU VIDEO PLAYER */
  (function(){
    var vids={};
    function initVid(id){
      var el=document.getElementById(id);
      if(!el)return;
      var slides=el.querySelectorAll('.edu-slide');
      var fill=el.querySelector('.edu-progress-fill');
      var counter=el.querySelector('.edu-counter');
      var playBtn=el.querySelector('.edu-play-btn');
      vids[id]={el:el,slides:slides,fill:fill,counter:counter,playBtn:playBtn,
        total:slides.length,current:0,playing:false,elapsed:0,
        slideDur:11000,mainTimer:null,progTimer:null};
    }
    function showSlide(id,idx){
      var v=vids[id];if(!v)return;
      v.slides.forEach(function(s){s.classList.remove('active');});
      v.slides[idx].classList.add('active');
      v.current=idx;v.elapsed=0;
      if(v.counter)v.counter.textContent=(idx+1)+'/'+v.total;
      if(v.fill)v.fill.style.width=((idx/v.total)*100)+'%';
    }
    function updateProg(id){
      var v=vids[id];if(!v)return;
      v.elapsed+=100;
      var pct=((v.current+v.elapsed/v.slideDur)/v.total)*100;
      if(v.fill)v.fill.style.width=Math.min(pct,100)+'%';
    }
    function play(id){
      var v=vids[id];if(!v||v.playing)return;
      v.playing=true;
      if(v.playBtn)v.playBtn.textContent='⏸';
      v.mainTimer=setInterval(function(){showSlide(id,(v.current+1)%v.total);},v.slideDur);
      v.progTimer=setInterval(function(){updateProg(id);},100);
    }
    function pause(id){
      var v=vids[id];if(!v||!v.playing)return;
      v.playing=false;
      if(v.playBtn)v.playBtn.textContent='▶';
      clearInterval(v.mainTimer);clearInterval(v.progTimer);
    }
  window.vidPlayPause=function(id){var v=vids[id];if(!v)return;if(v.playing)pause(id);else play(id);};
  window.vidNext=function(id){var v=vids[id];if(!v)return;var wp=v.playing;if(wp)pause(id);showSlide(id,(v.current+1)%v.total);if(wp)play(id);};
  window.vidPrev=function(id){var v=vids[id];if(!v)return;var wp=v.playing;if(wp)pause(id);showSlide(id,(v.current-1+v.total)%v.total);if(wp)play(id);};
  window.openVideoModal=function(html){
    var modal=document.getElementById('videoModal');
    var host=document.getElementById('videoModalPlayer');
    if(!modal||!host)return;
    host.innerHTML=html;
    modal.classList.add('open');
    document.body.style.overflow='hidden';
  };
  window.closeVideoModal=function(){
    var modal=document.getElementById('videoModal');
    var host=document.getElementById('videoModalPlayer');
    if(modal)modal.classList.remove('open');
    if(host)host.innerHTML='';
    document.body.style.overflow='';
  };
    document.querySelectorAll('.edu-player').forEach(function(el){
      initVid(el.id);
      var obs=new IntersectionObserver(function(entries){
        entries.forEach(function(e){if(e.isIntersecting&&vids[el.id]&&!vids[el.id].playing)play(el.id);});
      },{threshold:0.5});
      obs.observe(el);
    });
  })();

  /* GALLERY LIGHTBOX */
  var galleryImgs=[];
  var lightboxIdx=0;
  var lb=document.getElementById('lightbox');
  var lbImg=document.getElementById('lbImg');
  document.querySelectorAll('.gallery-item').forEach(function(item,i){
    var src=item.dataset.src;
    if(src)galleryImgs.push(src);
    item.addEventListener('click',function(){
      lightboxIdx=i;
      openLightbox();
    });
  });
  function openLightbox(){
    if(!lb||!lbImg)return;
    lbImg.src=galleryImgs[lightboxIdx];
    lb.classList.add('open');
    document.body.style.overflow='hidden';
  }
  window.closeLightbox=function(){
    if(lb)lb.classList.remove('open');
    document.body.style.overflow='';
  };
  window.lightboxPrev=function(){lightboxIdx=(lightboxIdx-1+galleryImgs.length)%galleryImgs.length;if(lbImg)lbImg.src=galleryImgs[lightboxIdx];};
  window.lightboxNext=function(){lightboxIdx=(lightboxIdx+1)%galleryImgs.length;if(lbImg)lbImg.src=galleryImgs[lightboxIdx];};
  if(lb){
    lb.addEventListener('click',function(e){if(e.target===lb)window.closeLightbox();});
    document.addEventListener('keydown',function(e){
      if(!lb.classList.contains('open'))return;
      if(e.key==='ArrowLeft')window.lightboxPrev();
      if(e.key==='ArrowRight')window.lightboxNext();
      if(e.key==='Escape')window.closeLightbox();
    });
  }
})();
</script>`;

// --- Page wrapper -------------------------------------------------------------
const pageHtml = (slug, title, desc, body) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="images/enix-logo-main.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
${navHtml(slug)}
${body}
${FOOTER}
${SCRIPT}
</body>
</html>`;

// --- Shared helpers -----------------------------------------------------------
const primaryBtn  = (label, href) => `<a href="${href}" class="btn-primary">${label} ${icon("arrowRight",18,18,"#fff")}</a>`;
const secondaryBtn = (label, href) => `<a href="${href}" class="btn-secondary">${label} ${icon("arrowRight",18,18,"#fff")}</a>`;
const callBtn     = (primary=true, label=null) => {
  const lbl = label||`Call ${PHONE_DISPLAY}`;
  return `<a href="tel:${PHONE_TEL}" class="${primary?'btn-primary':'btn-secondary'}">${icon("phone",18,18,"#fff")} ${lbl}</a>`;
};
const emailBtn    = (primary=false) =>
  `<a href="mailto:${EMAIL}" class="${primary?'btn-primary':'btn-secondary'}">${icon("mail",18,18,"#fff")} Email Us</a>`;

const hero = (slugLabel, headlineHtml, lead, primaryBtnHtml, secondaryBtnHtml="", bgImg=null) => {
  const bg = bgImg
    ? `<div class="bg-image"><img src="images/${bgImg}" alt="" loading="lazy"></div>`
    : `<div class="hero-bg"></div>`;
  return `<section class="section" style="min-height:100vh;display:flex;align-items:center;position:relative">
  ${bg}
  <div class="section-content" style="width:100%;padding-top:140px">
    <span class="label-mono mb-4">${slugLabel}</span>
    <h1 class="headline-xl mb-6" style="font-size:clamp(38px,6.5vw,76px)">${headlineHtml}</h1>
    <p class="lead mb-8">${lead}</p>
    <div class="flex flex-wrap gap-4">${primaryBtnHtml}${secondaryBtnHtml}</div>
  </div>
</section>`;
};

const ctaSection = (headlineHtml, lead, bgImg, primary, secondary="") =>
  `<section class="section" style="min-height:60vh;display:flex;align-items:center;position:relative">
  <div class="bg-image heavy"><img src="images/${bgImg}" alt="" loading="lazy"></div>
  <div class="section-content text-center" style="width:100%">
    <h2 class="headline-xl mb-4" style="font-size:clamp(30px,5vw,56px)">${headlineHtml}</h2>
    <p class="lead mb-8" style="margin:0 auto 32px">${lead}</p>
    <div class="flex flex-wrap gap-4 justify-center">${primary}${secondary}</div>
  </div>
</section>`;

const checkItem = (text) => `<div class="item">${icon("checkCircle",18)} <span>${text}</span></div>`;
const icLine    = (icName, text) => `<div class="ic-line">${icon(icName,18,18,"#FF6A00")} <span>${text}</span></div>`;

const videoCard = (img, tag, title, href=URL.contact) =>
  `<a href="${href}" class="video-card">
    <div class="video-card-bg"><img src="images/${img}" alt="${title}" loading="lazy"></div>
    <div class="video-card-overlay"></div>
    <div class="video-card-play"><div class="video-card-play-btn"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#fff"><polygon points="5 3 19 12 5 21 5 3"/></svg></div></div>
    <div class="video-card-info"><span class="video-card-tag">${tag}</span><div class="video-card-title">${title}</div></div>
  </a>`;

const videoExpandCard = (player, label) => `<div class="video-expand-shell">
<button type="button" class="video-expand-card" onclick="openVideoModal(this.nextElementSibling.innerHTML);return false;">
  <div class="video-expand-card-top">
    <div class="video-expand-card-label">${label}</div>
    <div class="video-expand-card-toggle">Full screen</div>
  </div>
</button>
<div class="video-expand-panel">
  ${player}
</div>`;

const videoModalShell = `<div class="video-modal" id="videoModal" onclick="if(event.target===this)closeVideoModal()">
  <div class="video-modal-inner">
    <button type="button" class="video-modal-close" onclick="closeVideoModal()">×</button>
    <div class="video-modal-player" id="videoModalPlayer"></div>
  </div>
</div>`;

// Animated educational video slide-show player
const makeEduVideo = (id, slides) => {
  const slideHtml = slides.map((s, i) => `
  <div class="edu-slide${i===0?' active':''}" data-slide="${i}">
    <div class="edu-slide-bg"><img src="images/${s.bg}" alt="${s.headline.replace(/<br>/g,' ')}" loading="lazy"></div>
    <div class="edu-slide-overlay"></div>
    <div class="edu-slide-content">
      <div class="edu-slide-tag">${s.tag}</div>
      <div class="edu-slide-headline">${s.headline}</div>
      ${s.points?`<div class="edu-slide-points">${s.points.map(p=>`<div class="edu-slide-point">${p}</div>`).join('')}</div>`:''}
      ${s.cta?`<a href="${URL.contact}" class="edu-slide-cta-btn">${s.cta} →</a>`:''}
    </div>
  </div>`).join('');
  return `<div class="edu-player" id="${id}">
  <div class="edu-player-screen">${slideHtml}</div>
  <div class="edu-player-controls">
    <button class="edu-play-btn" onclick="vidPlayPause('${id}')">▶</button>
    <button class="edu-nav-btn" onclick="vidPrev('${id}')">‹</button>
    <div class="edu-progress-track"><div class="edu-progress-fill"></div></div>
    <button class="edu-nav-btn" onclick="vidNext('${id}')">›</button>
    <span class="edu-counter">1/${slides.length}</span>
  </div>
</div>`;
};

// ── Video 1: When It's Time for a New Roof ───────────────────────────────────
const VIDEO_RESIDENTIAL = makeEduVideo('vid-residential',[
  {bg:'gallery-roof-sky.jpg',tag:'ENIX EXTERIORS — RESIDENTIAL ROOFING',headline:'When It\'s Time<br>for a New Roof',
   points:['A complete guide for Tennessee homeowners','Know the warning signs before small damage becomes catastrophic']},
  {bg:'gallery-pexels-1.jpg',tag:'ROOF AGE — THE FIRST INDICATOR',headline:'Your Roof\'s Age Tells the Story',
   points:['20–25 years: inspect carefully every season','25–30 years: start budgeting for replacement now','30+ years: replacement is overdue — act before the next storm']},
  {bg:'gallery-craftsman.jpg',tag:'VISIBLE WARNING SIGNS',headline:'What to See from the Ground',
   points:['Curling, cupping, or cracking shingle tabs','Granule buildup in gutters after any rain event','Missing shingles, dark patches, or bare roof deck visible']},
  {bg:'gallery-project-1.jpg',tag:'HIDDEN DAMAGE — CHECK YOUR ATTIC',headline:'The Damage You Can\'t See from Outside',
   points:['Water stains or mold on rafters and sheathing','Daylight visible through cracks in the roof deck','Musty smell or frost on underside of deck in winter']},
  {bg:'gallery-pexels-2.jpg',tag:'THE COST OF WAITING',headline:'Small Problems Become Expensive Fast',
   points:['A $300 flashing repair → $5,000 rot and framing repair','Water damage spreads with every single rain event','Mold develops within 24–48 hours of sustained saturation']},
  {bg:'gallery-metal-1.jpg',tag:'REPAIR OR REPLACE? — THE 50% RULE',headline:'Making the Smart Financial Decision',
   points:['Less than 25% damaged and roof under 15 years old → Repair','More than 25% damaged or roof is 20+ years → Replace','If repair cost exceeds 50% of replacement → Always replace']},
  {bg:'gallery-roofing-desktop.jpg',tag:'YOUR NEXT STEP',headline:'Enix Exteriors Free Roof Inspection',
   points:['Licensed & insured Tennessee roofing contractor','Free professional on-roof inspection — no obligation','Same-day response across Knox County and East Tennessee'],
   cta:'Schedule Your Free Inspection'}
]);

// ── Video 2: Commercial Roofing Systems Explained ────────────────────────────
const VIDEO_COMMERCIAL = makeEduVideo('vid-commercial',[
  {bg:'gallery-commercial-1.jpg',tag:'ENIX EXTERIORS — COMMERCIAL ROOFING',headline:'Commercial Roofing<br>Systems Explained',
   points:['A guide for Tennessee business and property owners','Understand your options before committing to any system']},
  {bg:'gallery-panel-roofline.jpg',tag:'WHAT MAKES COMMERCIAL ROOFING DIFFERENT',headline:'Flat & Low-Slope Roofs Require a Different Approach',
   points:['Pitch below 2:12 — water cannot shed by gravity alone','Requires sealed, fully waterproof membranes throughout','Materials, installation, and warranty are entirely different from shingles']},
  {bg:'gallery-commercial-1.jpg',tag:'TPO MEMBRANE ROOFING',headline:'TPO: America\'s Most Installed Commercial Membrane',
   points:['White surface reflects up to 90% of UV — cuts HVAC costs 15–25%','Heat-welded seams stronger than the membrane itself','15–25 year lifespan with quality 60-mil installation','Best for energy-conscious buildings and simple flat roofs']},
  {bg:'gallery-project-9.jpg',tag:'MODIFIED BITUMEN ROOFING',headline:'Modified Bitumen: 40+ Years of Proven Performance',
   points:['Multi-layer asphalt system with redundant waterproofing','Outstanding resistance to hail, foot traffic, and puncture','Applied by torch, cold adhesive, or self-adhering membrane','Ideal for buildings with frequent HVAC crew roof access']},
  {bg:'gallery-craftsman.jpg',tag:'EPDM RUBBER ROOFING',headline:'EPDM: The Longest Commercial Track Record',
   points:['Rubber membrane with documented 40–60 year field performance','Outstanding UV and ozone resistance — no chalking or yellowing','Fewer seams than other systems = fewer potential leak points','Lowest material cost among all major commercial systems']},
  {bg:'gallery-project-6.jpg',tag:'WHICH SYSTEM IS RIGHT FOR YOUR BUILDING?',headline:'Match Your System to Your Building\'s Needs',
   points:['Energy efficiency priority → TPO is the clear choice','High foot traffic + maximum durability → Modified Bitumen','Best proven longevity + lowest material cost → EPDM','Existing sound roof? → Silicone coating can add 10–20 years']},
  {bg:'gallery-commercial-1.jpg',tag:'FREE COMMERCIAL INSPECTION',headline:'Enix Exteriors Commercial Division',
   points:['Factory-trained TPO, modified bitumen, and EPDM installation crews','Free commercial roof assessment with written report and photos','No-obligation — serving East Tennessee commercial properties'],
   cta:'Schedule Commercial Inspection'}
]);

// ── Video 3: Storm Damage Action Plan ────────────────────────────────────────
const VIDEO_STORM = makeEduVideo('vid-storm',[
  {bg:'gallery-project-9.jpg',tag:'ENIX EXTERIORS — STORM DAMAGE GUIDE',headline:'After Storm Damage:<br>Your Action Plan',
   points:['What to do in the critical hours after a severe storm','The right steps protect both your home and your insurance claim']},
  {bg:'gallery-pexels-2.jpg',tag:'STEP 1 — SAFETY FIRST',headline:'Stay Safe: Don\'t Go on the Roof',
   points:['Check for downed power lines before stepping outside','Assess structural damage from the ground — stay off the roof','If walls or ceilings are sagging or buckling — evacuate immediately']},
  {bg:'gallery-craftsman.jpg',tag:'STEP 2 — DOCUMENT EVERYTHING FIRST',headline:'Photos Before Any Cleanup or Tarping',
   points:['Photograph and video all damage from every angle — ground level','Document interior water stains, wet ceilings, and damaged belongings','Screenshot NWS storm alerts and reports confirming the event']},
  {bg:'gallery-roofing-desktop.jpg',tag:'STEP 3 — CALL A ROOFER BEFORE YOUR INSURER',headline:'Professional Documentation Strengthens Your Claim',
   points:['A contractor provides professional written damage assessment','On-roof inspection finds damage invisible from the ground','Your contractor meets the adjuster at inspection — ensuring nothing is missed']},
  {bg:'gallery-project-1.jpg',tag:'STEP 4 — EMERGENCY TARPING IF NEEDED',headline:'Stop Further Damage Within 24–48 Hours',
   points:['Active leaks need tarping immediately — water damage compounds fast','Professional tarping is covered by your insurance claim','Never sign an Assignment of Benefits (AOB) for tarping or repairs']},
  {bg:'gallery-pexels-1.jpg',tag:'STEP 5 — FILE YOUR CLAIM WITH FULL DOCUMENTATION',headline:'File Promptly — Don\'t Wait',
   points:['Most Tennessee policies allow 1 year from the storm date — act now','Include your contractor assessment, all photos, and storm records','Request your contractor be present at the adjuster\'s on-site inspection']},
  {bg:'gallery-roof-sky.jpg',tag:'24/7 STORM RESPONSE — ENIX EXTERIORS',headline:'We\'re Standing By for Tennessee Storm Emergencies',
   points:['Free emergency roof inspections across Knox County and East Tennessee','Licensed, insured, and locally owned — not a storm chaser','Claims assistance at no extra charge — call anytime after a storm'],
   cta:'Call for Emergency Inspection'}
]);

const svcBlock = (ic, title, desc) => `<div class="glass-card">
  <div class="card-icon">${icon(ic,24)}</div>
  <h3 class="font-display" style="font-weight:700;color:#fff;font-size:19px;margin-bottom:8px">${title}</h3>
  <p class="muted" style="font-size:14px;line-height:1.7">${desc}</p>
</div>`;

const processStep = (n, t, d) => `<div class="step">
  <div class="step-num">${n}</div>
  <div><h4>${t}</h4><p>${d}</p></div>
</div>`;

const serviceRadio = (value, ic, label) => `<label class="service-radio">
  <input type="radio" name="service" value="${value}">
  ${icon(ic,22)}
  <span class="lbl">${label}</span>
</label>`;

const statBar = (s1, l1, s2, l2, s3, l3, s4, l4) =>
  `<div class="stats-bar">
    <div class="stat-cell"><div class="stat-big">${s1}</div><div class="stat-label">${l1}</div></div>
    <div class="stat-cell"><div class="stat-big">${s2}</div><div class="stat-label">${l2}</div></div>
    <div class="stat-cell"><div class="stat-big">${s3}</div><div class="stat-label">${l3}</div></div>
    <div class="stat-cell"><div class="stat-big">${s4}</div><div class="stat-label">${l4}</div></div>
  </div>`;

// --- Quote form --------------------------------------------------------------
const quoteForm = () => `<div class="glass-card" style="max-width:660px">
  <form id="quoteForm" action="${FORMSUBMIT}" method="POST" onsubmit="return handleFormSubmit(event)">
    <input type="hidden" name="_subject" value="New Quote Request – Enix Exteriors">
    <input type="hidden" name="_captcha" value="false">
    <input type="text" name="_honey" style="display:none">
    <div style="display:flex;gap:8px;margin-bottom:20px">
      <div id="p1" style="height:5px;flex:1;border-radius:3px;background:#FF6A00"></div>
      <div id="p2" style="height:5px;flex:1;border-radius:3px;background:rgba(255,255,255,.15);transition:background .3s"></div>
      <div id="p3" style="height:5px;flex:1;border-radius:3px;background:rgba(255,255,255,.15);transition:background .3s"></div>
    </div>
    <div id="step1">
      <p class="label-mono mb-4">Step 1 of 3 — Your Information</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <input type="text" name="name" placeholder="Full Name" required class="form-input">
        <input type="email" name="email" placeholder="Email Address" required class="form-input">
        <input type="tel" name="phone" placeholder="Phone Number" required class="form-input">
      </div>
      <button type="button" onclick="nextStep()" class="btn-primary w-full mt-4" style="justify-content:center">Next Step ${icon("arrowRight",18,18,"#fff")}</button>
    </div>
    <div id="step2" style="display:none">
      <p class="label-mono mb-4">Step 2 of 3 — Service Type</p>
      <div class="grid grid-2" style="gap:10px">
        ${serviceRadio("commercial","building","Commercial Roofing")}
        ${serviceRadio("residential","home","Residential Roofing")}
        ${serviceRadio("exterior","tool","Exterior Services")}
        ${serviceRadio("storm","alert","Storm Damage")}
      </div>
      <div class="flex gap-3 mt-4">
        <button type="button" onclick="prevStep()" class="btn-secondary" style="flex:1;justify-content:center">Back</button>
        <button type="button" onclick="nextStep()" class="btn-primary" style="flex:1;justify-content:center">Next ${icon("arrowRight",18,18,"#fff")}</button>
      </div>
    </div>
    <div id="step3" style="display:none">
      <p class="label-mono mb-4">Step 3 of 3 — Project Details</p>
      <textarea name="message" placeholder="Describe your project — size, current condition, timeline, any specific concerns…" rows="5" class="form-textarea"></textarea>
      <div class="flex gap-3 mt-4">
        <button type="button" onclick="prevStep()" class="btn-secondary" style="flex:1;justify-content:center">Back</button>
        <button type="submit" class="btn-primary" style="flex:1;justify-content:center">${icon("send",18,18,"#fff")} Submit Request</button>
      </div>
    </div>
    <div id="success" style="display:none;text-align:center;padding:30px 0">
      ${icon("checkCircle",56,56,"#FF6A00")}
      <h4 class="font-display" style="font-weight:700;color:#fff;font-size:22px;margin:14px 0 8px">Thank You!</h4>
      <p class="muted">We received your request and will contact you within 24 hours.</p>
    </div>
  </form>
</div>`;

// =============================================================================
// HOME
// =============================================================================
const homeBody = () => `${hero(
  "TENNESSEE'S TRUSTED ROOFING EXPERTS",
  "ENIX EXTERIORS<br>YOUR LOCAL ROOFING EXPERT",
  "Top commercial and residential roofing contractor in Tennessee. Quality roofing, siding, gutters, and windows — done right the first time. Based in Knoxville, serving all of Tennessee.",
  callBtn(true,"Get Free Quote"),
  primaryBtn("View Our Work",URL.gallery),"gallery-roof-sky.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content tight">
    ${statBar("500+","Projects Completed","24/7","Emergency Response","15+","Years Experience","100%","Licensed & Insured")}
  </div>
</section>

<section class="section section-bg-dark">
  <div class="section-content tight">
    <div style="text-align:center;margin-bottom:48px">
      <span class="label-mono mb-3">WHAT ENIX EXTERIORS DOES</span>
      <h2 class="headline-xl" style="font-size:clamp(30px,5vw,54px)">FULL EXTERIOR<br>SERVICES FROM<br>ONE TRUSTED TEAM</h2>
    </div>
    <div class="grid grid-3">
      <a href="${URL["commercial-roofing"]}" class="glass-card" style="text-decoration:none;display:block;transition:transform .3s,border-color .3s" onmouseover="this.style.transform='translateY(-6px)';this.style.borderColor='rgba(255,106,0,.4)'" onmouseout="this.style.transform='';this.style.borderColor=''">
        <div class="card-icon">${icon("building",24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:19px;margin-bottom:8px">Commercial Roofing</h3>
        <p class="muted" style="font-size:14px;margin-bottom:14px;line-height:1.7">TPO, modified bitumen, coatings, and complete roof systems for businesses statewide.</p>
        <span style="color:#FF6A00;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:6px">Learn more ${icon("arrowRight",14,14,"#FF6A00")}</span>
      </a>
      <a href="${URL["residential-roofing"]}" class="glass-card" style="text-decoration:none;display:block;transition:transform .3s,border-color .3s" onmouseover="this.style.transform='translateY(-6px)';this.style.borderColor='rgba(255,106,0,.4)'" onmouseout="this.style.transform='';this.style.borderColor=''">
        <div class="card-icon">${icon("home",24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:19px;margin-bottom:8px">Residential Roofing</h3>
        <p class="muted" style="font-size:14px;margin-bottom:14px;line-height:1.7">Asphalt shingles, metal roofs, and tile systems for homes across Tennessee.</p>
        <span style="color:#FF6A00;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:6px">Learn more ${icon("arrowRight",14,14,"#FF6A00")}</span>
      </a>
      <a href="${URL["exterior-services"]}" class="glass-card" style="text-decoration:none;display:block;transition:transform .3s,border-color .3s" onmouseover="this.style.transform='translateY(-6px)';this.style.borderColor='rgba(255,106,0,.4)'" onmouseout="this.style.transform='';this.style.borderColor=''">
        <div class="card-icon">${icon("tool",24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:19px;margin-bottom:8px">Exterior Services</h3>
        <p class="muted" style="font-size:14px;margin-bottom:14px;line-height:1.7">Siding, gutters, windows, and complete exterior renovations.</p>
        <span style="color:#FF6A00;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:6px">Learn more ${icon("arrowRight",14,14,"#FF6A00")}</span>
      </a>
      <a href="${URL["storm-damage-commercial"]}" class="glass-card" style="text-decoration:none;display:block;transition:transform .3s,border-color .3s" onmouseover="this.style.transform='translateY(-6px)';this.style.borderColor='rgba(255,106,0,.4)'" onmouseout="this.style.transform='';this.style.borderColor=''">
        <div class="card-icon">${icon("alert",24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:19px;margin-bottom:8px">Storm Damage – Commercial</h3>
        <p class="muted" style="font-size:14px;margin-bottom:14px;line-height:1.7">24/7 emergency commercial roofing repair and insurance claim assistance.</p>
        <span style="color:#FF6A00;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:6px">Learn more ${icon("arrowRight",14,14,"#FF6A00")}</span>
      </a>
      <a href="${URL["storm-damage-residential"]}" class="glass-card" style="text-decoration:none;display:block;transition:transform .3s,border-color .3s" onmouseover="this.style.transform='translateY(-6px)';this.style.borderColor='rgba(255,106,0,.4)'" onmouseout="this.style.transform='';this.style.borderColor=''">
        <div class="card-icon">${icon("home",24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:19px;margin-bottom:8px">Storm Damage – Residential</h3>
        <p class="muted" style="font-size:14px;margin-bottom:14px;line-height:1.7">Emergency tarping, repairs, and full insurance claim navigation for homes.</p>
        <span style="color:#FF6A00;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:6px">Learn more ${icon("arrowRight",14,14,"#FF6A00")}</span>
      </a>
      <a href="${URL["education-hub"]}" class="glass-card" style="text-decoration:none;display:block;transition:transform .3s,border-color .3s" onmouseover="this.style.transform='translateY(-6px)';this.style.borderColor='rgba(255,106,0,.4)'" onmouseout="this.style.transform='';this.style.borderColor=''">
        <div class="card-icon">${icon("book",24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:19px;margin-bottom:8px">Education Hub</h3>
        <p class="muted" style="font-size:14px;margin-bottom:14px;line-height:1.7">Expert guides on roofing, siding, gutters, and exterior care from our team.</p>
        <span style="color:#FF6A00;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:6px">Read articles ${icon("arrowRight",14,14,"#FF6A00")}</span>
      </a>
    </div>
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/gallery-roofing-desktop.jpg" alt="Enix Exteriors roofing work" loading="lazy"></div>
  <div class="section-content tight">
    <span class="label-mono mb-4">WHY CHOOSE ENIX EXTERIORS</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(30px,5vw,52px)">BUILT TO LAST.<br>BACKED BY US.</h2>
    <div class="check-list" style="max-width:900px">
      ${checkItem("Licensed and insured in Tennessee")}
      ${checkItem("Large crew capacity for fast project completion")}
      ${checkItem("Comprehensive warranties on all work")}
      ${checkItem("24/7 emergency storm damage response")}
      ${checkItem("Insurance claim assistance and documentation")}
      ${checkItem("Premium materials from top-rated brands")}
      ${checkItem("Local Tennessee crews — no out-of-state subcontractors")}
      ${checkItem("Transparent, honest pricing with no hidden fees")}
    </div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content tight">
    <div style="text-align:center;margin-bottom:48px">
      <span class="label-mono mb-3">RECENT PROJECTS</span>
      <h2 class="headline-xl" style="font-size:clamp(30px,5vw,54px)">OUR WORK<br>SPEAKS FOR ITSELF</h2>
    </div>
    <div class="grid grid-3" style="gap:14px">
      <div style="border-radius:14px;overflow:hidden;aspect-ratio:4/3"><img src="images/gallery-commercial-1.jpg" alt="Commercial roofing project" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>
      <div style="border-radius:14px;overflow:hidden;aspect-ratio:4/3"><img src="images/gallery-craftsman.jpg" alt="Craftsman roofing work" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>
      <div style="border-radius:14px;overflow:hidden;aspect-ratio:4/3"><img src="images/gallery-metal-1.jpg" alt="Metal roofing project" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>
    </div>
    <div style="text-align:center;margin-top:28px">
      ${primaryBtn("View Full Gallery",URL.gallery)}
    </div>
  </div>
</section>

<section class="section section-bg-dark">
  <div class="section-content tight">
    <div style="text-align:center;margin-bottom:48px">
      <span class="label-mono mb-3">EDUCATIONAL TOPICS</span>
      <h2 class="headline-xl" style="font-size:clamp(30px,5vw,52px)">LEARN FROM<br>THE EXPERTS</h2>
      <p class="muted" style="max-width:520px;margin:16px auto 0;font-size:15px">Tap any topic to speak with a roofing expert, or visit our Education Hub for in-depth written guides.</p>
    </div>
    <div class="video-grid">
      ${videoExpandCard(VIDEO_RESIDENTIAL,"When It's Time for a New Roof")}
      ${videoExpandCard(VIDEO_COMMERCIAL,"Commercial Roofing Systems")}
      ${videoExpandCard(VIDEO_STORM,"After Storm Damage: Action Plan")}
    </div>
    <div style="text-align:center;margin-top:36px">
      ${primaryBtn("Read Our 50 Expert Guides",URL["education-hub"])}
    </div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content tight">
    <div class="grid grid-2" style="gap:40px;align-items:center">
      <div>
        <span class="label-mono mb-4">GET YOUR FREE QUOTE</span>
        <h2 class="headline-xl mb-6" style="font-size:clamp(28px,4.5vw,48px)">ENIX EXTERIORS<br>IS READY TO HELP</h2>
        <p class="muted mb-8" style="font-size:16px;line-height:1.8">Whether you need a full commercial roof replacement or a residential repair, our team is standing by. We offer free inspections and detailed quotes with no obligation.</p>
        <div class="flex flex-wrap gap-3">
          ${callBtn(true)}
          ${emailBtn(false)}
        </div>
      </div>
      ${quoteForm()}
    </div>
  </div>
</section>

${ctaSection("TENNESSEE'S ROOFING<br>EXPERT — ENIX EXTERIORS","Licensed, insured, and ready to protect your property. Commercial and residential roofing done right the first time.","gallery-roof-sky.jpg",callBtn(true),primaryBtn("View Locations",URL["tennessee-locations"]))}`;

// =============================================================================
// COMMERCIAL ROOFING
// =============================================================================
const commercialBody = () => `${hero(
  "COMMERCIAL ROOFING – ENIX EXTERIORS",
  "TENNESSEE'S TOP<br>COMMERCIAL ROOFING<br>CONTRACTOR",
  "From single-ply TPO systems to modified bitumen and roof coatings, Enix Exteriors delivers durable commercial roofing solutions for businesses of all sizes across Tennessee.",
  callBtn(true,"Get Free Commercial Quote"),
  secondaryBtn("View Gallery",URL.gallery),"gallery-commercial-1.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content tight">
    ${statBar("500+","Commercial Projects","24/7","Emergency Service","15+","Years Experience","100%","Client Satisfaction")}
  </div>
</section>

<section class="section section-bg-dark">
  <div class="section-content tight">
    <div style="text-align:center;margin-bottom:48px">
      <span class="label-mono mb-3">OUR COMMERCIAL SERVICES</span>
      <h2 class="headline-xl" style="font-size:clamp(28px,5vw,52px)">EVERY COMMERCIAL<br>ROOFING NEED</h2>
    </div>
    <div class="grid grid-3">
      ${svcBlock("building","TPO Roofing","Thermoplastic polyolefin (TPO) single-ply membranes are energy-efficient, highly durable, and perfect for commercial flat and low-slope roofs.")}
      ${svcBlock("shield","Modified Bitumen","Multi-ply asphalt systems offering exceptional durability and weather resistance. Ideal for industrial and commercial buildings throughout Tennessee.")}
      ${svcBlock("tool","Roof Coatings","Extend the life of your existing roof with elastomeric or silicone coatings. Cost-effective waterproofing without a full tear-off.")}
      ${svcBlock("alert","Emergency Repairs","Storm damage? We respond 24/7. Our crews perform emergency tarping, leak repairs, and complete storm restoration.")}
      ${svcBlock("file","Roof Inspections","Comprehensive inspections with detailed reports and photos. Essential for insurance claims, maintenance planning, and property sales.")}
      ${svcBlock("droplet","Gutters & Drainage","Properly designed commercial drainage systems prevent ponding water that shortens roof life. We install and repair gutters and drains of all sizes.")}
    </div>
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/gallery-roofing-desktop.jpg" alt="Commercial roofing crew" loading="lazy"></div>
  <div class="section-content tight">
    <span class="label-mono mb-4">OUR PROCESS</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,48px)">HOW WE WORK</h2>
    <div style="max-width:560px">
      ${processStep(1,"Free Inspection & Consultation","Our certified inspectors evaluate your roof condition, measure the area, and assess all problem areas — at no charge to you.")}
      ${processStep(2,"Detailed Written Proposal","You receive a clear, itemized proposal with material specs, warranty details, crew timeline, and a fixed price — no surprises.")}
      ${processStep(3,"Scheduled Installation","We coordinate with your operations team to minimize disruption. Our large crew capacity means faster completion than smaller contractors.")}
      ${processStep(4,"Final Walkthrough & Warranty","After installation we perform a thorough quality inspection with you and provide all warranty documentation in writing.")}
    </div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content tight">
    <span class="label-mono mb-4">WHY ENIX EXTERIORS</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,48px)">THE ENIX<br>DIFFERENCE</h2>
    <div class="check-list">
      ${checkItem("Licensed and fully insured in Tennessee")}
      ${checkItem("Large crews for fast project turnaround")}
      ${checkItem("Manufacturer-certified installation")}
      ${checkItem("Competitive pricing with no hidden fees")}
      ${checkItem("24/7 emergency repair response")}
      ${checkItem("Detailed inspection and documentation")}
      ${checkItem("Insurance claim assistance included")}
      ${checkItem("Comprehensive labor and material warranties")}
    </div>
  </div>
</section>

${ctaSection("READY FOR A BETTER<br>COMMERCIAL ROOF?","Get your free commercial roofing inspection and quote from Enix Exteriors. Tennessee's most trusted commercial roofer.","gallery-panel-roofline.jpg",callBtn(true),primaryBtn("Request a Quote",URL.contact))}`;

// =============================================================================
// RESIDENTIAL ROOFING
// =============================================================================
const residentialBody = () => `${hero(
  "RESIDENTIAL ROOFING – ENIX EXTERIORS",
  "PROTECTING YOUR HOME<br>AND YOUR FAMILY",
  "From asphalt shingles to metal and tile, Enix Exteriors installs beautiful, durable roofs for Tennessee homeowners. Quality materials, skilled crews, and industry-leading warranties.",
  callBtn(true,"Get Free Home Quote"),
  secondaryBtn("View Our Work",URL.gallery),"gallery-craftsman.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content tight">
    <div style="text-align:center;margin-bottom:48px">
      <span class="label-mono mb-3">RESIDENTIAL ROOFING SYSTEMS</span>
      <h2 class="headline-xl" style="font-size:clamp(28px,5vw,52px)">THE RIGHT ROOF<br>FOR YOUR HOME</h2>
    </div>
    <div class="grid grid-3">
      ${svcBlock("home","Asphalt Shingles","The most popular roofing choice for Tennessee homes. Architectural shingles offer excellent weather resistance, a wide range of styles, and warranties up to 50 years.")}
      ${svcBlock("shield","Metal Roofing","Standing seam and metal panel roofs that last 40–70 years. Excellent for Tennessee's climate — heat-reflective, wind-resistant, and virtually maintenance-free.")}
      ${svcBlock("star","Tile Roofing","Clay and concrete tile systems that add elegance and extreme durability. Perfect for upscale Tennessee homes seeking a lifetime roofing solution.")}
      ${svcBlock("tool","Roof Repairs","From minor leaks to major storm damage, our certified technicians repair all roof types quickly and correctly to prevent further interior damage.")}
      ${svcBlock("droplet","Gutters & Downspouts","Full gutter installation, replacement, and cleaning. Leaf guards and custom aluminum or copper gutters to match your home's style.")}
      ${svcBlock("alert","Storm Damage","We handle the full storm damage process — emergency tarping, insurance documentation, claim submission, and complete roof replacement.")}
    </div>
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/gallery-pexels-1.jpg" alt="Beautiful residential roof" loading="lazy"></div>
  <div class="section-content tight">
    <span class="label-mono mb-4">HOMEOWNER BENEFITS</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,48px)">YOUR HOME DESERVES<br>THE BEST</h2>
    <div class="check-list" style="max-width:880px">
      ${checkItem("Free roof inspections and no-obligation estimates")}
      ${checkItem("Licensed and insured Tennessee roofing contractor")}
      ${checkItem("Premium materials from GAF, Owens Corning, and CertainTeed")}
      ${checkItem("Comprehensive warranties covering labor and materials")}
      ${checkItem("Accurate color matching for additions and repairs")}
      ${checkItem("Minimal disruption to your daily life")}
      ${checkItem("Clean job sites — complete debris removal every day")}
      ${checkItem("Insurance claim assistance for storm damage")}
    </div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content tight">
    <div class="grid grid-2" style="gap:40px;align-items:center">
      <div>
        <span class="label-mono mb-4">GET YOUR FREE QUOTE</span>
        <h2 class="headline-xl mb-6" style="font-size:clamp(26px,4vw,44px)">READY TO GET<br>STARTED?</h2>
        <p class="muted mb-6" style="font-size:15px;line-height:1.8">Fill out our quick quote form and an Enix Exteriors specialist will contact you within 24 hours to schedule your free inspection.</p>
        ${callBtn(true)}
      </div>
      ${quoteForm()}
    </div>
  </div>
</section>

${ctaSection("TRUST YOUR TENNESSEE HOME<br>TO ENIX EXTERIORS","Licensed, insured, and backed by manufacturer warranties. Your local roofing expert is ready to help.","gallery-roof-detail.jpg",callBtn(true),primaryBtn("View Gallery",URL.gallery))}`;

// =============================================================================
// EXTERIOR SERVICES
// =============================================================================
const exteriorBody = () => `${hero(
  "EXTERIOR SERVICES – ENIX EXTERIORS",
  "COMPLETE EXTERIOR<br>RENOVATIONS FOR<br>TENNESSEE PROPERTIES",
  "Beyond roofing, Enix Exteriors handles siding, gutters, windows, and full exterior renovations. One contractor, one team, one warranty for your entire exterior.",
  callBtn(true,"Get Exterior Quote"),
  secondaryBtn("View Gallery",URL.gallery),"gallery-siding.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content tight">
    <div style="text-align:center;margin-bottom:48px">
      <span class="label-mono mb-3">ALL EXTERIOR SERVICES</span>
      <h2 class="headline-xl" style="font-size:clamp(28px,5vw,52px)">EVERYTHING OUTSIDE<br>YOUR FOUR WALLS</h2>
    </div>
    <div class="grid grid-3">
      ${svcBlock("windPanel","Siding Installation","Vinyl, fiber cement, and wood composite siding installed to protect your home and boost curb appeal. Energy-efficient options that stand up to Tennessee weather.")}
      ${svcBlock("droplet","Gutter Systems","Custom seamless gutters, leaf guard installation, and complete gutter replacement. Protect your foundation, landscaping, and siding from water damage.")}
      ${svcBlock("image","Window Replacement","Energy-efficient double and triple-pane windows that lower your utility bills, reduce outside noise, and increase your home's value.")}
      ${svcBlock("shield","Fascia & Soffit","Properly installed and ventilated fascia and soffit systems protect your roof edge, allow proper attic airflow, and complete your home's look.")}
      ${svcBlock("home","Exterior Painting","Professional exterior painting and coating to refresh your home's appearance and add another layer of weather protection.")}
      ${svcBlock("tool","Full Exterior Packages","Combine roofing, siding, gutters, and windows for the best value. One crew, one timeline, and one comprehensive warranty.")}
    </div>
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/gallery-gutters.jpg" alt="Gutter installation" loading="lazy"></div>
  <div class="section-content tight">
    <span class="label-mono mb-4">SIDING OPTIONS</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,48px)">FIND THE RIGHT<br>SIDING FOR YOU</h2>
    <div class="grid grid-3">
      <div class="glass-card">
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:18px;margin-bottom:8px">Vinyl Siding</h3>
        <p class="muted" style="font-size:14px;margin-bottom:12px;line-height:1.7">The most affordable and low-maintenance siding option. Available in dozens of colors and profiles.</p>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${icLine("checkCircle","30+ color options")}
          ${icLine("checkCircle","Never needs painting")}
          ${icLine("checkCircle","Impact resistant grades")}
        </div>
      </div>
      <div class="glass-card">
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:18px;margin-bottom:8px">Fiber Cement</h3>
        <p class="muted" style="font-size:14px;margin-bottom:12px;line-height:1.7">HardiePlank® and similar products offer the look of wood with extreme durability and fire resistance.</p>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${icLine("checkCircle","Fire and pest resistant")}
          ${icLine("checkCircle","50-year warranty options")}
          ${icLine("checkCircle","Wood-look aesthetics")}
        </div>
      </div>
      <div class="glass-card">
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:18px;margin-bottom:8px">Wood Composite</h3>
        <p class="muted" style="font-size:14px;margin-bottom:12px;line-height:1.7">Natural wood beauty with improved moisture and rot resistance. Perfect for traditional Tennessee home styles.</p>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${icLine("checkCircle","Natural appearance")}
          ${icLine("checkCircle","Improved rot resistance")}
          ${icLine("checkCircle","Paintable and stainable")}
        </div>
      </div>
    </div>
  </div>
</section>

${ctaSection("ONE TEAM FOR YOUR<br>ENTIRE EXTERIOR","Stop managing multiple contractors. Enix Exteriors handles roofing, siding, gutters, and windows under one warranty.","gallery-panel-roofline.jpg",callBtn(true),primaryBtn("Get a Quote",URL.contact))}`;

// =============================================================================
// STORM DAMAGE – COMMERCIAL
// =============================================================================
const stormCommercialBody = () => `${hero(
  "EMERGENCY COMMERCIAL STORM DAMAGE",
  "COMMERCIAL STORM<br>DAMAGE RESPONSE<br>— 24/7",
  "Severe weather can strike without warning. Enix Exteriors provides immediate emergency response for commercial buildings across Tennessee — 24 hours a day, 7 days a week.",
  callBtn(true,"Call Now — Emergency"),
  primaryBtn("Request Inspection",URL.contact),"gallery-roof-sky.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content tight">
    <div style="text-align:center;margin-bottom:48px">
      <span class="label-mono mb-3">OUR EMERGENCY PROCESS</span>
      <h2 class="headline-xl" style="font-size:clamp(28px,5vw,52px)">WE RESPOND FAST<br>SO YOU CAN RECOVER</h2>
    </div>
    ${processStep(1,"Immediate Emergency Contact","Call our 24/7 emergency line and speak directly with a roofing professional — not a call center. We dispatch the nearest crew immediately.")}
    ${processStep(2,"Emergency Tarping & Stabilization","We stop further damage with emergency tarps and temporary repairs to protect your building's interior, inventory, and equipment.")}
    ${processStep(3,"Damage Assessment & Documentation","Our team documents all damage with photos and written reports suitable for insurance submission. We know what adjusters need to see.")}
    ${processStep(4,"Insurance Claim Assistance","We work alongside your insurance adjuster to ensure every area of damage is properly documented and included in your claim.")}
    ${processStep(5,"Complete Restoration","Once your claim is approved, our crews restore your commercial roof and exterior to better-than-before condition with full warranty coverage.")}
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/gallery-roofing-desktop.jpg" alt="Commercial storm damage repair" loading="lazy"></div>
  <div class="section-content tight">
    <span class="label-mono mb-4">WHAT WE HANDLE</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,48px)">COMMERCIAL<br>STORM SERVICES</h2>
    <div class="grid grid-3">
      ${svcBlock("alert","Hail Damage","Hail can puncture membranes, crack flashing, and destroy HVAC equipment on rooftops. We assess and restore all storm-related damage.")}
      ${svcBlock("shield","Wind Damage","High winds can lift roofing membranes, blow off cap sheets, and damage parapets. We perform permanent fixes — not just temporary patches.")}
      ${svcBlock("droplet","Water Infiltration","Storm damage often leads to interior leaks. We locate every entry point, make permanent repairs, and document the cause for insurance.")}
    </div>
  </div>
</section>

${ctaSection("STORM DAMAGE DOESN'T WAIT.<br>NEITHER DO WE.","Our emergency crews are on standby 24/7. Call Enix Exteriors immediately after storm damage for fast commercial response.","gallery-commercial-1.jpg",callBtn(true),emailBtn(false))}`;

// =============================================================================
// STORM DAMAGE – RESIDENTIAL
// =============================================================================
const stormResidentialBody = () => `${hero(
  "EMERGENCY RESIDENTIAL STORM DAMAGE",
  "RESIDENTIAL STORM<br>DAMAGE — FAST<br>RESPONSE 24/7",
  "When storms damage your home, Enix Exteriors responds immediately. We stop the damage, document it thoroughly, and guide you through the insurance process from start to finish.",
  callBtn(true,"Call Now — Emergency"),
  primaryBtn("Request Inspection",URL.contact),"gallery-pexels-1.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content tight">
    <div style="text-align:center;margin-bottom:48px">
      <span class="label-mono mb-3">HOW WE HELP HOMEOWNERS</span>
      <h2 class="headline-xl" style="font-size:clamp(28px,5vw,52px)">FROM STORM<br>TO RESTORED</h2>
    </div>
    ${processStep(1,"Emergency Call & Rapid Dispatch","Call our 24/7 line and we'll have a crew en route to your home within hours. We take your emergency seriously.")}
    ${processStep(2,"Emergency Tarping","We protect your home from further water damage with emergency tarps installed quickly and securely over damaged areas.")}
    ${processStep(3,"Free Full Inspection","Our certified inspectors check every inch of your roof for hail dents, missing shingles, damaged flashing, and interior moisture.")}
    ${processStep(4,"Insurance Claim Navigation","We meet with your adjuster, advocate for your full claim, and handle all the documentation so you don't have to.")}
    ${processStep(5,"Complete Roof Replacement","Once your claim is approved, we schedule your full roof replacement with premium materials and a comprehensive warranty.")}
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/gallery-roof-detail.jpg" alt="Roof damage inspection" loading="lazy"></div>
  <div class="section-content tight">
    <span class="label-mono mb-4">TYPES OF STORM DAMAGE</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,48px)">WE HANDLE IT ALL</h2>
    <div class="grid grid-2">
      <div class="glass-card">
        <div class="card-icon">${icon("alert",24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:18px;margin-bottom:10px">Hail Damage</h3>
        <p class="muted" style="font-size:14px;margin-bottom:14px;line-height:1.7">Hail creates bruising and impact marks that reduce shingle life even when not immediately visible. Our inspectors know exactly where to look and how to document it for insurance.</p>
        ${callBtn(true,"Schedule Inspection")}
      </div>
      <div class="glass-card">
        <div class="card-icon">${icon("droplet",24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:18px;margin-bottom:10px">Wind & Tornado Damage</h3>
        <p class="muted" style="font-size:14px;margin-bottom:14px;line-height:1.7">Wind lifts shingles at their edges, breaks seals, and can remove entire sections of roofing. We perform complete wind damage assessments and full replacements.</p>
        ${callBtn(true,"Schedule Inspection")}
      </div>
    </div>
  </div>
</section>

${ctaSection("STORM DAMAGE?<br>CALL ENIX EXTERIORS NOW.","We're standing by 24/7 for residential roofing emergencies across Tennessee. Don't wait — protect your home today.","gallery-pexels-2.jpg",callBtn(true),primaryBtn("Request Inspection",URL.contact))}`;

// =============================================================================
// EDUCATION HUB – Full articles
// =============================================================================
const article = (id, category, title, readTime, content) => `
<div class="article-card" id="article-${id}" data-category="${category}">
  <div class="article-header" role="button" tabindex="0" aria-expanded="false" aria-controls="body-${id}">
    <div class="article-header-left">
      <div class="card-icon" style="margin-bottom:0">${icon("book",20)}</div>
      <div class="article-meta">
        <span class="article-category">${category}</span>
        <div class="article-title">${title}</div>
        <div class="article-read">${readTime} min read</div>
      </div>
    </div>
    <div class="article-chevron">${icon("chevDown",20,20,"#FF6A00")}</div>
  </div>
  <div class="article-body" id="body-${id}" style="padding-top:22px">
    ${content}
    <a href="${URL.contact}" class="article-cta">Get a Free Quote ${icon("arrowRight",16,16,"#fff")}</a>
  </div>
</div>`;

const ARTICLES = ARTICLE_DATA.map(a => article(a.id, a.category, a.title, a.readTime, a.content));

// — legacy stub kept for reference only (no longer used) ——————————————————————
const _ARTICLES_LEGACY_STUB = [
  article("1","CONTRACTOR GUIDE","How to Choose a Roofing Contractor in Tennessee",8,`
<p>Choosing the right roofing contractor is one of the most important decisions you'll make as a Tennessee property owner. The wrong choice can cost you thousands in subpar work, voided warranties, and repeated repairs. Here's what you need to know before signing any contract.</p>
<h3>1. Verify Licensing and Insurance</h3>
<p>In Tennessee, roofing contractors should carry general liability insurance and workers' compensation coverage. Always request certificates of insurance <strong>directly from the insurer</strong> — not just a copy from the contractor. If a worker is injured on your property without proper coverage, you could be held liable.</p>
<ul>
  <li>General liability: Covers property damage caused during work</li>
  <li>Workers' comp: Covers injuries to workers on your property</li>
  <li>Contractor's license: Verify through the Tennessee Department of Commerce & Insurance</li>
</ul>
<h3>2. Check Their Local Reputation</h3>
<p>After major storms, out-of-state contractors flood Tennessee communities. While some are reputable, many are "storm chasers" who collect deposits and disappear. Always choose a contractor with a verifiable local presence.</p>
<ul>
  <li>Look for a physical address — not a P.O. box</li>
  <li>Check Google reviews, BBB ratings, and Angi listings</li>
  <li>Ask for references from completed jobs in your area</li>
  <li>Verify how long they've operated in Tennessee</li>
</ul>
<h3>3. Get Multiple Written Estimates</h3>
<p>Never accept a verbal quote. A proper written estimate should include:</p>
<ul>
  <li>Specific materials (manufacturer, product line, color)</li>
  <li>Scope of work (tear-off, decking repairs, flashing replacement)</li>
  <li>Timeline for completion</li>
  <li>Warranty details for both labor and materials</li>
  <li>Total price with no hidden fees</li>
</ul>
<h3>4. Understand Warranty Coverage</h3>
<p>There are two types of roofing warranties: <strong>manufacturer warranties</strong> covering defective materials, and <strong>contractor warranties</strong> covering workmanship. The best contractors offer manufacturer-certified installation, which provides enhanced warranty coverage that a non-certified installer cannot provide.</p>
<h3>5. Never Pay Full Price Upfront</h3>
<p>A reputable contractor will request a deposit (typically 10–30%) to order materials, with the balance due upon completion. Paying in full before work begins is a major red flag. Also avoid contractors who pressure you to sign immediately or claim the offer expires today.</p>
<h3>Red Flags to Avoid</h3>
<ul>
  <li>Requires full payment before starting</li>
  <li>No physical address or local presence</li>
  <li>Won't provide proof of insurance</li>
  <li>Unusually low bid (often means inferior materials)</li>
  <li>High-pressure sales tactics</li>
  <li>Asks you to sign insurance documents on their behalf</li>
</ul>
<p><strong>Bottom line:</strong> A reputable Tennessee roofing contractor will be transparent, licensed, insured, and happy to provide references. Take your time, do your research, and never let urgency cloud your judgment.</p>
`),
  article("2","COMMERCIAL ROOFING","TPO vs. Modified Bitumen: Which Commercial Roof is Right for You?",7,`
<p>If you own or manage a commercial building in Tennessee, chances are you're dealing with a flat or low-slope roof. The two most popular systems for these roofs are <strong>TPO (Thermoplastic Polyolefin)</strong> and <strong>Modified Bitumen</strong>. Understanding the differences helps you make the right investment for your building.</p>
<h3>What is TPO Roofing?</h3>
<p>TPO is a single-ply roofing membrane made from synthetic rubber. It comes in rolls that are heat-welded together on-site, creating a seamless waterproof surface. TPO is currently the most popular commercial roofing material in the United States.</p>
<h4>TPO Advantages</h4>
<ul>
  <li><strong>Energy efficiency:</strong> White TPO reflects up to 90% of UV rays, reducing cooling costs — significant in Tennessee summers</li>
  <li><strong>Cost-effective:</strong> Generally less expensive than modified bitumen</li>
  <li><strong>Lightweight:</strong> Puts less stress on your building structure</li>
  <li><strong>Strong seams:</strong> Heat-welded seams are stronger than the membrane itself</li>
  <li><strong>Low maintenance:</strong> Easy to inspect and repair</li>
</ul>
<h4>TPO Disadvantages</h4>
<ul>
  <li>Relatively newer technology — long-term performance data is still being established</li>
  <li>Quality varies significantly between manufacturers</li>
  <li>Requires experienced installers for proper heat-welding</li>
</ul>
<h3>What is Modified Bitumen?</h3>
<p>Modified bitumen is an asphalt-based roofing system reinforced with polyester or fiberglass. It's applied in multiple layers (typically 2–4) using heat torching, cold adhesive, or self-adhesion. Modified bitumen has been widely used since the 1970s and has an excellent long-term track record.</p>
<h4>Modified Bitumen Advantages</h4>
<ul>
  <li><strong>Proven track record:</strong> Decades of performance data in diverse climates</li>
  <li><strong>Multi-layer protection:</strong> Redundancy means better leak resistance</li>
  <li><strong>Excellent impact resistance:</strong> Handles hail and foot traffic better than TPO</li>
  <li><strong>Easy repair:</strong> Patches are straightforward and durable</li>
</ul>
<h4>Modified Bitumen Disadvantages</h4>
<ul>
  <li>Heavier than TPO, requiring adequate structural support</li>
  <li>Dark-colored standard options absorb more heat (though white-coated versions exist)</li>
  <li>Generally higher material and installation cost than TPO</li>
</ul>
<h3>Which Should You Choose?</h3>
<p>For most commercial buildings in Tennessee, <strong>TPO is the preferred choice</strong> due to its energy efficiency, cost-effectiveness, and strong performance in our hot summers. However, for buildings with heavy foot traffic, extreme weather exposure, or structural concerns about weight, modified bitumen may be the better option.</p>
<p>The best way to decide is with a free consultation from Enix Exteriors. Our commercial roofing specialists will evaluate your building, your budget, and your long-term goals to recommend the right system.</p>
`),
  article("3","RESIDENTIAL ROOFING","Asphalt Shingles vs. Metal Roofing: A Complete Homeowner's Guide",9,`
<p>If you're replacing your Tennessee home's roof, the two most popular material choices are <strong>asphalt shingles</strong> and <strong>metal roofing</strong>. Both have strong advantages, and the right choice depends on your budget, home style, and long-term plans.</p>
<h3>Asphalt Shingles: The Tennessee Standard</h3>
<p>Asphalt shingles account for roughly 80% of residential roofing in the United States. Modern architectural (laminated) shingles are dramatically improved over older 3-tab styles, offering better aesthetics, wind resistance, and longevity.</p>
<h4>Pros of Asphalt Shingles</h4>
<ul>
  <li><strong>Affordability:</strong> Typically 40–60% less expensive upfront than metal</li>
  <li><strong>Wide selection:</strong> Hundreds of colors and styles to match any home</li>
  <li><strong>Easy repair:</strong> Individual shingles can be replaced without disturbing the rest</li>
  <li><strong>Widely available:</strong> Any qualified roofing contractor can install them</li>
  <li><strong>Lifespan:</strong> Quality architectural shingles last 25–40 years with proper maintenance</li>
</ul>
<h4>Cons of Asphalt Shingles</h4>
<ul>
  <li>Shorter lifespan than metal (25–40 years vs. 40–70+ years)</li>
  <li>More susceptible to algae growth in Tennessee's humid climate</li>
  <li>Absorbs more heat than metal, increasing cooling costs</li>
  <li>Granule loss over time reduces protection</li>
</ul>
<h3>Metal Roofing: The Long-Term Investment</h3>
<p>Standing seam metal roofing has surged in popularity in Tennessee over the past decade. While the upfront cost is higher, metal roofs often pay for themselves over time through longevity and energy savings.</p>
<h4>Pros of Metal Roofing</h4>
<ul>
  <li><strong>Longevity:</strong> A properly installed metal roof can last 40–70+ years</li>
  <li><strong>Energy efficiency:</strong> Reflective coatings can reduce cooling costs by 10–25%</li>
  <li><strong>Extreme weather resistance:</strong> Handles high winds (120+ mph rated panels), hail, and heavy snow</li>
  <li><strong>Low maintenance:</strong> No shingle granule loss, no algae, minimal upkeep</li>
  <li><strong>Environmentally friendly:</strong> Often made from recycled content and fully recyclable at end of life</li>
</ul>
<h4>Cons of Metal Roofing</h4>
<ul>
  <li>Higher upfront cost (typically 2–3x the cost of asphalt)</li>
  <li>Requires specialized installation — not all roofers are qualified</li>
  <li>Can be noisier during heavy rain (though proper underlayment minimizes this)</li>
  <li>Dents from large hail are possible, though panels can be replaced individually</li>
</ul>
<h3>Cost Comparison for Tennessee Homeowners</h3>
<p>For a typical 2,000 sq ft Tennessee home:</p>
<ul>
  <li><strong>Asphalt shingles:</strong> $8,000 – $14,000 installed</li>
  <li><strong>Standing seam metal:</strong> $18,000 – $32,000 installed</li>
</ul>
<p>While the price difference seems significant, consider the lifespan. A homeowner who replaces asphalt shingles twice over 50 years may spend more total than a homeowner who installs a metal roof once.</p>
<h3>Our Recommendation</h3>
<p>If you plan to stay in your home long-term and want the lowest maintenance option, <strong>metal roofing is an excellent investment</strong> in Tennessee. If budget is the primary concern or you may sell within 10–15 years, <strong>high-quality architectural shingles</strong> are the smart, cost-effective choice. Contact Enix Exteriors for a free consultation — we'll help you make the right decision for your home and budget.</p>
`),
  article("4","STORM DAMAGE","What to Do Immediately After Storm Damage to Your Roof",6,`
<p>A severe storm just rolled through your area. You notice ceiling stains, missing shingles, or damage to your gutters. The next few hours are critical. Here's exactly what to do — and what to avoid — after storm damage to your Tennessee property.</p>
<h3>Step 1: Stay Safe First</h3>
<p>Before inspecting anything, ensure your family is safe. Do not go onto your roof — especially when it's wet or damaged. Walking on a compromised roof can make damage worse and is extremely dangerous. Observe from the ground only.</p>
<h3>Step 2: Document Everything Immediately</h3>
<p>Before any cleanup or temporary repairs, photograph and video everything you can see:</p>
<ul>
  <li>Damaged shingles, gutters, siding, and any debris</li>
  <li>Interior ceiling stains or wet spots</li>
  <li>Date and time stamps on all photos</li>
  <li>Wide shots showing the extent and location of damage</li>
</ul>
<p>This documentation is critical for your insurance claim. Never skip this step.</p>
<h3>Step 3: Call a Professional Roofer (Not Your Insurance Company First)</h3>
<p>This surprises many homeowners, but calling a reputable roofing contractor <strong>before</strong> your insurance company is often beneficial. An experienced roofer can:</p>
<ul>
  <li>Perform a free professional damage assessment</li>
  <li>Document damage that's not visible from the ground</li>
  <li>Perform emergency tarping to prevent further water damage</li>
  <li>Provide a repair estimate that strengthens your insurance claim</li>
</ul>
<h3>Step 4: File Your Insurance Claim</h3>
<p>Once you have professional documentation, contact your homeowner's insurance company. Provide them with:</p>
<ul>
  <li>All photos and videos you captured</li>
  <li>The contractor's written damage assessment</li>
  <li>Date of the storm (you can reference local weather records)</li>
</ul>
<h3>Step 5: Emergency Tarping if Needed</h3>
<p>If your roof has active leaks or significant openings, emergency tarping protects your home's interior while you wait for the adjuster's visit. A reputable roofer will handle this professionally and document it for your claim.</p>
<h3>Step 6: Meet the Insurance Adjuster</h3>
<p>When your adjuster arrives, have your roofing contractor present if possible. Your contractor can point out all damage areas and ensure nothing is missed. Adjusters sometimes overlook secondary damage areas that significantly add to your claim value.</p>
<h3>Common Mistakes to Avoid</h3>
<ul>
  <li><strong>Never sign over your insurance rights</strong> to a contractor (Assignment of Benefits)</li>
  <li>Don't wait weeks to file — most policies have deadlines</li>
  <li>Don't hire the first contractor who knocks on your door after a storm</li>
  <li>Don't make permanent repairs before the adjuster inspects</li>
</ul>
<p>Enix Exteriors helps Tennessee homeowners navigate every step of the storm damage process. Call us immediately after a storm for a free inspection and emergency response.</p>
`),
  article("5","MAINTENANCE","Signs Your Roof Needs Replacement vs. Repair",6,`
<p>One of the most common questions Tennessee homeowners ask is: "Do I need a full roof replacement or just a repair?" The answer depends on the age of your roof, the extent of damage, and several other factors. Here's how to tell the difference.</p>
<h3>Signs You Probably Need a Repair (Not a Replacement)</h3>
<ul>
  <li><strong>Isolated damage in a small area:</strong> A few missing or damaged shingles that represent less than 25% of your roof</li>
  <li><strong>Young roof:</strong> If your roof is less than 10 years old and otherwise in good shape</li>
  <li><strong>Isolated leak:</strong> A single leak traced to a specific flashing failure or small area</li>
  <li><strong>Recent storm damage to a previously healthy roof:</strong> Insurance may cover targeted repairs</li>
</ul>
<h3>Signs You Probably Need a Full Replacement</h3>
<ul>
  <li><strong>Age:</strong> Asphalt shingle roofs over 20–25 years old should be inspected carefully. Most should be replaced before 30 years.</li>
  <li><strong>Widespread granule loss:</strong> Significant granules in your gutters mean shingles are at end of life</li>
  <li><strong>Multiple areas of damage:</strong> When more than 25–30% of the roof is damaged or deteriorated</li>
  <li><strong>Sagging or soft spots:</strong> Indicates decking damage that requires significant structural work</li>
  <li><strong>Multiple past repairs:</strong> If you've repaired repeatedly and leaks keep returning, replacement is more cost-effective</li>
  <li><strong>Curling, cupping, or cracking shingles:</strong> Throughout the entire roof, not just in one spot</li>
  <li><strong>Interior daylight visible:</strong> You can see light through the attic — serious structural concern</li>
  <li><strong>Moss or algae throughout:</strong> Widespread organic growth accelerates shingle deterioration</li>
</ul>
<h3>The 50% Rule</h3>
<p>Many roofing professionals use this guideline: if repairs would cost more than 50% of replacement cost, replacement is the smarter long-term investment. You get a fresh start, new warranty coverage, and peace of mind for 25+ years.</p>
<h3>Get a Professional Opinion</h3>
<p>Never rely solely on what you can see from the ground. Enix Exteriors offers free comprehensive roof inspections throughout Tennessee. Our inspectors go up on every roof, check the attic if accessible, and provide an honest recommendation — whether that's a simple repair or a full replacement.</p>
`),
  article("6","MAINTENANCE","Gutter Maintenance 101: Protecting Your Tennessee Home",5,`
<p>Most Tennessee homeowners don't think much about their gutters until something goes seriously wrong. But clogged, damaged, or improperly installed gutters can cause foundation damage, basement flooding, siding rot, and even roof damage — all expensive problems that start with a simple oversight.</p>
<h3>Why Gutters Matter</h3>
<p>Gutters have one job: channel rainwater away from your home's foundation. Tennessee receives an average of 50+ inches of rain per year — significantly above the national average. Without properly functioning gutters, all that water runs directly down your walls and pools around your foundation.</p>
<h3>How Often Should You Clean Your Gutters?</h3>
<p>The general recommendation for Tennessee homeowners:</p>
<ul>
  <li><strong>Fall:</strong> After leaves have fully dropped (October/November)</li>
  <li><strong>Spring:</strong> After spring storms and pollen season (March/April)</li>
  <li><strong>Additional cleaning</strong> if you have overhanging trees</li>
</ul>
<h3>Signs Your Gutters Need Attention</h3>
<ul>
  <li>Water overflowing during rain (clog)</li>
  <li>Gutters pulling away from the fascia (improper slope or damaged hangers)</li>
  <li>Visible sagging in gutter runs</li>
  <li>Standing water in gutters after rain (improper slope)</li>
  <li>Rust stains or holes</li>
  <li>Water stains on siding below gutters</li>
  <li>Erosion in mulch beds directly below gutters</li>
</ul>
<h3>Seamless Gutters vs. Sectional Gutters</h3>
<p><strong>Sectional gutters</strong> are factory-made in standard lengths and joined with connectors on-site. The connectors are the weak points — they require sealant that can fail over time, creating leaks.</p>
<p><strong>Seamless gutters</strong> are custom-formed on-site from a single continuous piece of aluminum, with seams only at corners and downspout connections. They're more expensive upfront but require less maintenance and last longer. Enix Exteriors installs seamless aluminum gutters in custom sizes and colors.</p>
<h3>Leaf Guards: Worth the Investment?</h3>
<p>For homes with significant tree coverage, leaf guard systems can dramatically reduce cleaning frequency. Quality micro-mesh guards allow water through while blocking debris. The payback comes quickly when you factor in cleaning costs and the risk of ladder accidents from DIY cleaning.</p>
<p>Contact Enix Exteriors to schedule a gutter inspection and get a free estimate for cleaning, repair, or replacement.</p>
`),
  article("7","INSURANCE","Navigating Insurance Claims for Roof Storm Damage in Tennessee",7,`
<p>Tennessee is no stranger to severe weather. From tornado outbreaks to hail storms and powerful thunderstorms, your roof takes a beating year after year. When significant damage occurs, knowing how to navigate the insurance claim process can mean the difference between a full replacement and a denied claim.</p>
<h3>Is Storm Damage Covered?</h3>
<p>Standard homeowner's insurance policies in Tennessee cover <strong>sudden and accidental damage</strong> from storms — including hail, wind, tornadoes, and lightning. What is generally <strong>not covered</strong> includes:</p>
<ul>
  <li>Normal wear and tear or deterioration</li>
  <li>Damage from lack of maintenance</li>
  <li>Pre-existing damage</li>
  <li>Flooding (requires separate flood insurance)</li>
</ul>
<h3>Actual Cash Value vs. Replacement Cost Value</h3>
<p>This distinction in your policy dramatically affects your payout:</p>
<ul>
  <li><strong>Actual Cash Value (ACV):</strong> Pays you what your roof is worth today, accounting for depreciation. A 15-year-old roof may receive significantly less than replacement cost.</li>
  <li><strong>Replacement Cost Value (RCV):</strong> Pays to replace your roof with like-kind materials at current prices, regardless of age. This is the superior coverage and worth the additional premium.</li>
</ul>
<h3>The Claims Process Step by Step</h3>
<ul>
  <li>Get a professional inspection from a licensed contractor before filing</li>
  <li>File your claim promptly — most policies have a deadline (often 1 year from the storm event)</li>
  <li>Document the storm date using weather history records</li>
  <li>Be present when the adjuster inspects your property</li>
  <li>Have your contractor present to point out all damage</li>
  <li>Review the adjuster's estimate carefully for missed items</li>
  <li>Request a supplement if items were overlooked</li>
</ul>
<h3>Working with a Roofing Contractor During Claims</h3>
<p>A reputable roofing contractor will assist you through the claims process without requiring you to sign over your insurance rights. Be wary of Assignment of Benefits (AOB) agreements that transfer control of your claim to the contractor — this is a red flag.</p>
<p>Enix Exteriors works with all major insurance companies and helps Tennessee homeowners maximize their legitimate claim amounts. We document all damage thoroughly and meet with adjusters at no additional charge.</p>
`),
  article("8","ROOF CARE","Understanding Roof Warranties: What Every Tennessee Property Owner Should Know",6,`
<p>A roofing warranty is only as valuable as the coverage it provides and the contractor who stands behind it. Many property owners are surprised after a roofing problem to discover their warranty doesn't cover what they thought it did. Here's what you need to know.</p>
<h3>The Two Types of Roofing Warranties</h3>
<h4>1. Manufacturer Warranties</h4>
<p>Material warranties are provided by the shingle or membrane manufacturer (GAF, Owens Corning, CertainTeed, Firestone, etc.). They cover defects in the manufacturing of materials — not installation errors or storm damage. Standard manufacturer warranties range from 25 to 50 years on residential shingles.</p>
<h4>2. Contractor (Workmanship) Warranties</h4>
<p>Provided by your roofing contractor, workmanship warranties cover errors in installation — improper nailing, insufficient overlap, missing flashing, etc. These vary widely: from 1 year with discount contractors to 10+ years with established, reputable companies.</p>
<h3>Enhanced (System) Warranties</h3>
<p>The best warranty coverage is available when your contractor is certified to install a manufacturer's complete roofing system. GAF's Golden Pledge warranty, for example, covers materials AND workmanship for up to 25 years — but only a GAF Master Elite contractor can offer it.</p>
<p>This is why choosing a manufacturer-certified contractor matters: you get warranty protection that a non-certified competitor literally cannot provide.</p>
<h3>What Voids a Warranty</h3>
<ul>
  <li>Installation by a non-certified contractor</li>
  <li>Improper attic ventilation</li>
  <li>Walking on the roof improperly</li>
  <li>Adding solar panels or HVAC equipment without proper flashing</li>
  <li>Failure to report damage promptly</li>
  <li>Mixing different manufacturer's products in the same system</li>
</ul>
<h3>Questions to Ask Your Contractor</h3>
<ul>
  <li>Are you certified by the shingle manufacturer?</li>
  <li>What does your workmanship warranty cover, and for how long?</li>
  <li>Is the warranty transferable if I sell my home?</li>
  <li>What voids the warranty?</li>
  <li>Will you provide warranty documentation in writing?</li>
</ul>
<p>Enix Exteriors provides comprehensive written warranties on all roofing work. We work with leading manufacturers to offer the best warranty coverage available to Tennessee property owners. Contact us to learn more about our warranty programs.</p>
`)
];

const educationBody = () => `${hero(
  "ENIX EXTERIORS EDUCATION HUB",
  "ROOFING KNOWLEDGE<br>FROM TENNESSEE'S<br>TRUSTED EXPERTS",
  "Free expert guides from Enix Exteriors — helping Tennessee homeowners and business owners make informed decisions about their roofs, siding, gutters, and exterior.",
  primaryBtn("Ask Our Experts",URL.contact),
  callBtn(false),"gallery-roofing-desktop.jpg")}

<button class="back-to-top" id="backToTop" type="button" onclick="scrollToTop()">Back to Top</button>
<a class="quick-contact" id="quickContact" href="tel:8656853649">
  <span>Quick Call</span>
  <strong>(865) 685-ENIX</strong>
</a>
${videoModalShell}

<section class="section section-bg-dark">
  <div class="section-content tight">
    <div style="text-align:center;margin-bottom:48px">
      <span class="label-mono mb-3">3 EDUCATIONAL PRESENTATIONS</span>
      <h2 class="headline-xl" style="font-size:clamp(28px,5vw,50px)">WATCH &amp; LEARN<br>FROM OUR EXPERTS</h2>
      <p class="muted" style="max-width:540px;margin:16px auto 0;font-size:15px">Auto-playing slide presentations — click ▶ to start or use arrows to navigate slides.</p>
    </div>
    <div class="video-grid">
      ${videoExpandCard(VIDEO_RESIDENTIAL,"When It's Time for a New Roof")}
      ${videoExpandCard(VIDEO_COMMERCIAL,"Commercial Roofing Systems Explained")}
      ${videoExpandCard(VIDEO_STORM,"After Storm Damage: Your Action Plan")}
    </div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content tight">
    <div style="text-align:center;margin-bottom:40px">
      <span class="label-mono mb-3">50 IN-DEPTH ARTICLES</span>
      <h2 class="headline-xl" style="font-size:clamp(28px,5vw,52px)">CLICK ANY ARTICLE<br>TO READ IN FULL</h2>
      <p class="muted" style="max-width:580px;margin:16px auto 0;font-size:15px">Written by the Enix Exteriors team of licensed Tennessee roofing professionals. Filter by topic below.</p>
    </div>
    <div class="edu-filter">
      <button class="edu-filter-btn active" data-cat="ALL">All 50 Articles</button>
      <button class="edu-filter-btn" data-cat="CONTRACTOR GUIDE">Contractor Guide</button>
      <button class="edu-filter-btn" data-cat="RESIDENTIAL ROOFING">Residential</button>
      <button class="edu-filter-btn" data-cat="COMMERCIAL ROOFING">Commercial</button>
      <button class="edu-filter-btn" data-cat="STORM DAMAGE">Storm Damage</button>
      <button class="edu-filter-btn" data-cat="INSURANCE">Insurance</button>
      <button class="edu-filter-btn" data-cat="MAINTENANCE">Maintenance</button>
      <button class="edu-filter-btn" data-cat="ROOF COMPONENTS">Roof Components</button>
      <button class="edu-filter-btn" data-cat="EXTERIOR SERVICES">Exterior Services</button>
      <button class="edu-filter-btn" data-cat="LOCAL TENNESSEE">Local TN</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;max-width:860px;margin:0 auto">
      ${ARTICLES.join("\n")}
    </div>
  </div>
</section>

${ctaSection("STILL HAVE QUESTIONS?<br>ASK ENIX EXTERIORS","Our experts are happy to answer your roofing questions for free — no obligation, no pressure.","gallery-craftsman.jpg",callBtn(true),primaryBtn("Send Us a Message",URL.contact))}`;

// =============================================================================
// GALLERY
// =============================================================================
const GALLERY_IMAGES = [
  { src: "gallery-commercial-1.jpg",  alt: "Commercial Roofing Project – Enix Exteriors" },
  { src: "gallery-craftsman.jpg",     alt: "Expert Craftsman Roofing Work" },
  { src: "gallery-metal-1.jpg",       alt: "Metal Roofing Installation" },
  { src: "gallery-panel-roofline.jpg",alt: "Panel Roofline Installation" },
  { src: "gallery-gutters.jpg",       alt: "Seamless Gutter System" },
  { src: "gallery-siding.jpg",        alt: "Siding and Exterior Work" },
  { src: "gallery-roof-sky.jpg",      alt: "Residential Roof – Enix Exteriors" },
  { src: "gallery-pexels-1.jpg",      alt: "Asphalt Shingle Roof Installation" },
  { src: "gallery-pexels-2.jpg",      alt: "Residential Roofing Project" },
  { src: "gallery-project-1.jpg",     alt: "Completed Roofing Project" },
  { src: "gallery-project-6.jpg",     alt: "Exterior Renovation Project" },
  { src: "gallery-project-9.jpg",     alt: "Storm Damage Repair Project" },
  { src: "gallery-project-10.jpg",    alt: "Commercial Roof Restoration" },
  { src: "gallery-project-16.jpg",    alt: "Residential Roof Replacement" },
  { src: "gallery-project-17.jpg",    alt: "Roofing Crew at Work" },
  { src: "gallery-project-19.jpg",    alt: "Completed Exterior Project" },
  { src: "gallery-roofing-desktop.jpg",alt:"Enix Exteriors Roofing Team" },
  { src: "gallery-roof-detail.jpg",   alt: "Roof Detail and Craftsmanship" },
  { src: "gallery-testimonial.jpg",   alt: "Happy Enix Exteriors Client" },
];

const galleryBody = () => {
  const items = GALLERY_IMAGES.map((img) =>
    `<div class="gallery-item" data-src="images/${img.src}" title="${img.alt}">
  <img src="images/${img.src}" alt="${img.alt}" loading="lazy">
  <div class="gallery-item-overlay">${icon("image",32,32,"#fff")}</div>
</div>`
  ).join("\n");

  return `${hero(
  "ENIX EXTERIORS PROJECT GALLERY",
  "OUR WORK<br>ACROSS TENNESSEE",
  "Browse completed projects from Enix Exteriors — commercial roofing, residential roofing, siding, gutters, and storm damage restoration across Tennessee.",
  callBtn(true,"Start Your Project"),
  primaryBtn("Get Free Quote",URL.contact),"gallery-roof-sky.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content tight">
    <div style="text-align:center;margin-bottom:48px">
      <span class="label-mono mb-3">19 COMPLETED PROJECTS</span>
      <h2 class="headline-xl" style="font-size:clamp(28px,5vw,52px)">QUALITY YOU CAN SEE</h2>
      <p class="muted" style="max-width:520px;margin:16px auto 0;font-size:15px">Click any photo to view full size. Every project completed by licensed Enix Exteriors crews.</p>
    </div>
    <div class="gallery-grid">
      ${items}
    </div>
  </div>
</section>

<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
  <button class="lightbox-close" onclick="closeLightbox()" aria-label="Close">&times;</button>
  <button class="lightbox-nav lightbox-prev" onclick="lightboxPrev()" aria-label="Previous">&#8249;</button>
  <img id="lbImg" class="lightbox-img" src="" alt="Gallery image">
  <button class="lightbox-nav lightbox-next" onclick="lightboxNext()" aria-label="Next">&#8250;</button>
</div>

${ctaSection("READY TO ADD YOUR<br>PROJECT TO THIS GALLERY?","Join hundreds of satisfied Enix Exteriors customers across Tennessee. Get your free quote today.","gallery-commercial-1.jpg",callBtn(true),primaryBtn("Request a Quote",URL.contact))}`;
};

// =============================================================================
// ABOUT
// =============================================================================
const aboutBody = () => `${hero(
  "ABOUT ENIX EXTERIORS",
  "TENNESSEE'S<br>ROOFING EXPERTS<br>YOU CAN TRUST",
  "Enix Exteriors is a licensed, insured Tennessee roofing contractor based in Knoxville. We serve commercial and residential clients throughout the state with quality work and honest service.",
  callBtn(true),
  primaryBtn("See Our Work",URL.gallery),"gallery-testimonial.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content tight">
    ${statBar("500+","Completed Projects","15+","Years Experience","24/7","Emergency Service","100%","Licensed & Insured")}
  </div>
</section>

<section class="section section-bg-dark">
  <div class="section-content tight">
    <div class="grid grid-2" style="gap:48px;align-items:center">
      <div>
        <span class="label-mono mb-4">OUR STORY</span>
        <h2 class="headline-xl mb-6" style="font-size:clamp(28px,4.5vw,50px)">BUILT ON<br>QUALITY AND<br>INTEGRITY</h2>
        <p class="muted mb-4" style="font-size:15px;line-height:1.9">Enix Exteriors was founded with one mission: deliver the highest quality roofing and exterior work in Tennessee, at a fair price, backed by a guarantee you can trust.</p>
        <p class="muted mb-4" style="font-size:15px;line-height:1.9">Based in Knoxville at 5992 Bearden View Ln, our team has grown to serve communities from Memphis to Johnson City, Nashville to Chattanooga. No subcontractors, no shortcuts — just our own licensed crews doing the work right.</p>
        <p class="muted mb-8" style="font-size:15px;line-height:1.9">We specialize in commercial roofing, residential roofing, siding, gutters, and storm damage restoration. When you hire Enix Exteriors, you get one team responsible for everything — and one warranty that covers it all.</p>
        ${callBtn(true,"Talk to Our Team")}
      </div>
      <div style="border-radius:20px;overflow:hidden;aspect-ratio:4/5"><img src="images/gallery-craftsman.jpg" alt="Enix Exteriors team" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>
    </div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content tight">
    <div style="text-align:center;margin-bottom:48px">
      <span class="label-mono mb-3">OUR VALUES</span>
      <h2 class="headline-xl" style="font-size:clamp(28px,5vw,52px)">WHAT DRIVES<br>ENIX EXTERIORS</h2>
    </div>
    <div class="grid grid-3">
      ${svcBlock("shield","Integrity First","We tell you the truth — even when it's not what you want to hear. Our inspections are honest, our quotes are accurate, and our recommendations are in your best interest.")}
      ${svcBlock("award","Quality Craftsmanship","Every crew member is trained and supervised. We don't cut corners on materials, flashing, ventilation, or any other detail that affects your roof's performance.")}
      ${svcBlock("users","Community Focused","We live and work in Tennessee. Our success depends entirely on our reputation in the communities we serve, which is why we go above and beyond on every project.")}
    </div>
  </div>
</section>

<section class="section section-bg-dark">
  <div class="section-content tight">
    <div style="text-align:center;margin-bottom:48px">
      <span class="label-mono mb-3">CONTACT ENIX EXTERIORS</span>
      <h2 class="headline-xl" style="font-size:clamp(28px,5vw,52px)">FIND US IN<br>KNOXVILLE, TN</h2>
    </div>
    <div class="grid grid-4">
      <div class="glass-card text-center">
        <div class="card-icon" style="margin:0 auto 14px">${icon("mapPin",24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:16px;margin-bottom:6px">Headquarters</h3>
        <p class="muted" style="font-size:14px">5992 Bearden View Ln<br>Knoxville, TN 37909</p>
      </div>
      <div class="glass-card text-center">
        <div class="card-icon" style="margin:0 auto 14px">${icon("phone",24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:16px;margin-bottom:6px">Phone</h3>
        <a href="tel:${PHONE_TEL}" style="color:#FF6A00;font-size:15px;font-weight:600;text-decoration:none">${PHONE_DISPLAY}</a>
      </div>
      <div class="glass-card text-center">
        <div class="card-icon" style="margin:0 auto 14px">${icon("mail",24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:16px;margin-bottom:6px">Email</h3>
        <a href="mailto:${EMAIL}" style="color:#FF6A00;font-size:13px;font-weight:600;text-decoration:none;word-break:break-all">${EMAIL}</a>
      </div>
      <div class="glass-card text-center">
        <div class="card-icon" style="margin:0 auto 14px">${icon("clock",24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:16px;margin-bottom:6px">Hours</h3>
        <p class="muted" style="font-size:14px">Mon–Fri: 7am–6pm<br><span style="color:#FF6A00;font-weight:600">Emergency: 24/7</span></p>
      </div>
    </div>
  </div>
</section>

${ctaSection("JOIN 500+ SATISFIED<br>TENNESSEE CUSTOMERS","Experience the Enix Exteriors difference. Quality work, honest service, and warranties that last.","gallery-roof-sky.jpg",callBtn(true),primaryBtn("View Our Gallery",URL.gallery))}`;

// =============================================================================
// CONTACT
// =============================================================================
const contactBody = () => `${hero(
  "CONTACT ENIX EXTERIORS",
  "LET'S TALK ABOUT<br>YOUR PROJECT",
  "Ready to start? Have questions? Our team is here to help with free inspections, detailed quotes, and expert advice. Reach out today — no pressure, no obligation.",
  callBtn(true),
  emailBtn(false),"gallery-panel-roofline.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content tight">
    <div class="grid grid-4">
      <div class="glass-card text-center">
        <div class="card-icon" style="margin:0 auto 14px">${icon("phone",24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:16px;margin-bottom:6px">Call Us</h3>
        <a href="tel:${PHONE_TEL}" style="color:#FF6A00;font-size:16px;font-weight:700;text-decoration:none">${PHONE_DISPLAY}</a>
        <p class="muted" style="font-size:12px;margin-top:4px">Mon–Fri 7am–6pm</p>
      </div>
      <div class="glass-card text-center">
        <div class="card-icon" style="margin:0 auto 14px">${icon("mail",24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:16px;margin-bottom:6px">Email Us</h3>
        <a href="mailto:${EMAIL}" style="color:#FF6A00;font-size:13px;font-weight:600;text-decoration:none;word-break:break-all">${EMAIL}</a>
        <p class="muted" style="font-size:12px;margin-top:4px">Reply within 24 hours</p>
      </div>
      <div class="glass-card text-center">
        <div class="card-icon" style="margin:0 auto 14px">${icon("mapPin",24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:16px;margin-bottom:6px">Visit Us</h3>
        <p style="color:#fff;font-size:13px;font-weight:500">5992 Bearden View Ln<br>Knoxville, TN 37909</p>
      </div>
      <div class="glass-card text-center">
        <div class="card-icon" style="margin:0 auto 14px">${icon("alert",24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:16px;margin-bottom:6px">Emergency</h3>
        <p style="color:#FF6A00;font-size:15px;font-weight:700">24/7 Available</p>
        <p class="muted" style="font-size:12px;margin-top:4px">Storm damage response</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-bg-dark">
  <div class="section-content tight">
    <div class="grid grid-2" style="gap:48px;align-items:flex-start">
      <div>
        <span class="label-mono mb-4">FREE QUOTE</span>
        <h2 class="headline-xl mb-6" style="font-size:clamp(28px,4.5vw,50px)">GET YOUR<br>FREE ESTIMATE</h2>
        <p class="muted mb-8" style="font-size:15px;line-height:1.8">Fill out the form and an Enix Exteriors specialist will contact you within 24 hours. We offer free inspections with no obligation.</p>
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px">
          ${icLine("checkCircle","Free roof inspection — no obligation")}
          ${icLine("checkCircle","Detailed written quote with material specs")}
          ${icLine("checkCircle","Licensed and insured Tennessee crews")}
          ${icLine("checkCircle","Manufacturer warranties included")}
        </div>
        ${callBtn(true)}
      </div>
      ${quoteForm()}
    </div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content tight">
    <div class="grid grid-2" style="gap:40px;align-items:center">
      <div>
        <span class="label-mono mb-4">EMERGENCY</span>
        <h2 class="headline-xl mb-6" style="font-size:clamp(26px,4vw,44px)">STORM DAMAGE?<br>CALL NOW — 24/7</h2>
        <p class="muted mb-8" style="font-size:15px;line-height:1.8">If you have active storm damage or a roofing emergency, do not wait. Our crews respond immediately to protect your property from further damage.</p>
        ${callBtn(true,"Emergency Response")}
      </div>
      <div class="glass-card">
        <div class="card-icon">${icon("alert",24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:18px;margin-bottom:14px">Emergency Services Include</h3>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${icLine("checkCircle","Emergency tarping and board-up")}
          ${icLine("checkCircle","Storm damage assessment and documentation")}
          ${icLine("checkCircle","Leak detection and immediate repair")}
          ${icLine("checkCircle","Insurance adjuster coordination")}
          ${icLine("checkCircle","24/7 crew dispatch")}
        </div>
      </div>
    </div>
  </div>
</section>

${ctaSection("ENIX EXTERIORS IS<br>READY WHEN YOU ARE","Tennessee's most trusted roofing contractor. Licensed, insured, and available 24/7 for emergencies.","gallery-roof-sky.jpg",callBtn(true),primaryBtn("View Our Gallery",URL.gallery))}`;

// =============================================================================
// TENNESSEE LOCATIONS
// =============================================================================
const LOCATIONS = [
  ["Nashville",     "Middle TN", ["Commercial","Residential","Storm","Exterior"]],
  ["Memphis",       "West TN",   ["Commercial","Residential","Storm","Exterior"]],
  ["Knoxville",     "East TN",   ["Commercial","Residential","Storm","Exterior"]],
  ["Chattanooga",   "SE TN",     ["Commercial","Residential","Storm","Exterior"]],
  ["Clarksville",   "Middle TN", ["Residential","Storm","Exterior"]],
  ["Murfreesboro",  "Middle TN", ["Residential","Storm"]],
  ["Franklin",      "Middle TN", ["Residential","Storm"]],
  ["Jackson",       "West TN",   ["Commercial","Residential"]],
  ["Johnson City",  "East TN",   ["Residential","Storm"]],
  ["Kingsport",     "East TN",   ["Residential","Storm"]],
  ["Bristol",       "East TN",   ["Residential","Storm"]],
  ["Oak Ridge",     "East TN",   ["Commercial","Residential"]],
  ["Maryville",     "East TN",   ["Residential","Storm"]],
  ["Cookeville",    "Middle TN", ["Residential","Storm"]],
  ["Columbia",      "Middle TN", ["Residential","Storm"]],
];

const locationCard = ([name, region, services]) => {
  const tags = services.map(s => `<span class="tag orange">${s}</span>`).join("");
  return `<div class="glass-card tight">
  <div class="flex items-center gap-2 mb-2">${icon("mapPin",14,14,"#FF6A00")} <span class="muted" style="font-size:11px">${region}</span></div>
  <h3 class="font-display" style="font-weight:700;color:#fff;font-size:16px;margin-bottom:8px">${name}</h3>
  <div class="flex flex-wrap gap-2">${tags}</div>
</div>`;
};

const locationsBody = () => {
  const locs = LOCATIONS.map(locationCard).join("");
  return `${hero(
  "STATEWIDE SERVICE – ENIX EXTERIORS",
  "SERVING TENNESSEE<br>FROM KNOXVILLE<br>TO MEMPHIS",
  "Enix Exteriors provides commercial and residential roofing, siding, gutters, and storm damage restoration to communities across all of Tennessee.",
  callBtn(true),
  primaryBtn("Request Service",URL.contact),"gallery-project-16.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content tight">
    <div style="text-align:center;margin-bottom:48px">
      <span class="label-mono mb-3">MAJOR MARKETS</span>
      <h2 class="headline-xl" style="font-size:clamp(28px,5vw,52px)">SERVING<br>TENNESSEE'S<br>BIGGEST CITIES</h2>
    </div>
    <div class="grid grid-4">
      <div class="glass-card" style="padding:0;overflow:hidden">
        <div style="height:150px;overflow:hidden"><img src="images/gallery-project-1.jpg" alt="Nashville" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>
        <div style="padding:16px">
          <h3 class="font-display" style="font-weight:700;color:#fff;font-size:17px;margin-bottom:4px">Nashville</h3>
          <p class="muted" style="font-size:13px">Music City's trusted roofer</p>
        </div>
      </div>
      <div class="glass-card" style="padding:0;overflow:hidden">
        <div style="height:150px;overflow:hidden"><img src="images/gallery-project-6.jpg" alt="Memphis" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>
        <div style="padding:16px">
          <h3 class="font-display" style="font-weight:700;color:#fff;font-size:17px;margin-bottom:4px">Memphis</h3>
          <p class="muted" style="font-size:13px">West Tennessee's local expert</p>
        </div>
      </div>
      <div class="glass-card" style="padding:0;overflow:hidden">
        <div style="height:150px;overflow:hidden"><img src="images/gallery-roof-sky.jpg" alt="Knoxville" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>
        <div style="padding:16px">
          <h3 class="font-display" style="font-weight:700;color:#fff;font-size:17px;margin-bottom:4px">Knoxville</h3>
          <p class="muted" style="font-size:13px">Our home base — East TN HQ</p>
        </div>
      </div>
      <div class="glass-card" style="padding:0;overflow:hidden">
        <div style="height:150px;overflow:hidden"><img src="images/gallery-siding.jpg" alt="Chattanooga" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>
        <div style="padding:16px">
          <h3 class="font-display" style="font-weight:700;color:#fff;font-size:17px;margin-bottom:4px">Chattanooga</h3>
          <p class="muted" style="font-size:13px">Scenic City exterior experts</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section-bg-dark">
  <div class="section-content tight">
    <div style="text-align:center;margin-bottom:36px">
      <span class="label-mono mb-3">ALL SERVICE AREAS</span>
      <h2 class="headline-xl" style="font-size:clamp(26px,4vw,44px)">WE COME TO YOU<br>ACROSS TENNESSEE</h2>
    </div>
    <div class="grid grid-5">${locs}</div>
    <p class="muted text-center" style="margin-top:24px;font-size:14px">Don't see your city? Call us — we serve communities throughout Tennessee.</p>
  </div>
</section>

${ctaSection("YOUR LOCAL ROOFING EXPERT<br>— WHEREVER YOU ARE IN TN","One call connects you with Tennessee's most trusted roofing and exterior contractor. Free inspections statewide.","gallery-roofing-desktop.jpg",callBtn(true),primaryBtn("Get a Quote",URL.contact))}`;
};

// =============================================================================
// BUILD
// =============================================================================
const PAGE_DEFS = {
  "home":                   ["Enix Exteriors | Top Commercial Roofing Contractor in Tennessee", "Enix Exteriors — Tennessee's top commercial and residential roofing contractor based in Knoxville. Licensed, insured, and serving all of Tennessee.", homeBody,         path.join(ROOT, "index.html")],
  "commercial-roofing":     ["Commercial Roofing | Enix Exteriors | Tennessee",                 "Tennessee's #1 commercial roofing contractor. TPO, modified bitumen, coatings, and complete roof systems for businesses statewide.",                commercialBody,    path.join(PUB, "commercial-roofing.html")],
  "residential-roofing":    ["Residential Roofing | Enix Exteriors | Tennessee",                "Quality residential roofing for Tennessee homes. Asphalt shingles, metal, and tile systems installed by licensed local Enix Exteriors crews.",      residentialBody,   path.join(PUB, "residential-roofing.html")],
  "exterior-services":      ["Exterior Services | Enix Exteriors | Tennessee",                  "Siding, gutters, windows, and complete exterior renovations from Enix Exteriors — Tennessee's trusted contractor.",                                   exteriorBody,      path.join(PUB, "exterior-services.html")],
  "storm-damage-commercial":["Commercial Storm Damage | Enix Exteriors | Tennessee",            "Emergency commercial storm damage restoration in Tennessee. 24/7 emergency roofing, insurance assistance, and fast restoration for businesses.",      stormCommercialBody,path.join(PUB, "storm-damage-commercial.html")],
  "storm-damage-residential":["Residential Storm Damage | Enix Exteriors | Tennessee",         "Emergency residential storm damage repair in Tennessee. 24/7 emergency roofing, tarping, insurance claims, and complete home restoration.",           stormResidentialBody,path.join(PUB, "storm-damage-residential.html")],
  "education-hub":          ["Education Hub | Enix Exteriors | Tennessee Roofing Resources",    "Free expert roofing guides from Enix Exteriors — Tennessee's trusted roofing contractor. Articles on shingles, TPO, storm damage, gutters, and more.", educationBody,     path.join(PUB, "education-hub.html")],
  "gallery":                ["Project Gallery | Enix Exteriors | Tennessee Roofing Projects",   "Browse completed roofing, siding, and exterior projects from Enix Exteriors — Tennessee's trusted commercial and residential roofing contractor.",   galleryBody,       path.join(PUB, "gallery.html")],
  "about":                  ["About Us | Enix Exteriors | Tennessee Roofing Contractor",        "Learn about Enix Exteriors — Tennessee's top commercial roofing contractor based in Knoxville. Our story, values, and commitment to quality.",          aboutBody,         path.join(PUB, "about.html")],
  "contact":                ["Contact Us | Enix Exteriors | Tennessee Roofing Contractor",      "Contact Enix Exteriors for free roofing quotes in Tennessee. Commercial and residential roofing services. Emergency repairs available 24/7.",          contactBody,       path.join(PUB, "contact.html")],
  "tennessee-locations":    ["Tennessee Locations | Enix Exteriors | Roofing Services Near You","Enix Exteriors serves communities across Tennessee. Commercial and residential roofing in Nashville, Memphis, Knoxville, Chattanooga, and more.",      locationsBody,     path.join(PUB, "tennessee-locations.html")],
};

const written = [];
for (const [slug, [title, desc, bodyFn, out]] of Object.entries(PAGE_DEFS)) {
  const html = pageHtml(slug, title, desc, bodyFn());
  fs.writeFileSync(out, html, "utf8");
  written.push([slug, path.relative(ROOT, out), html.length]);
}
console.log(`\nBuilt ${written.length} pages:`);
for (const [s, p, sz] of written) {
  console.log(`  ${s.padEnd(32)}  ${p.padEnd(44)}  ${String(sz).padStart(7)} bytes`);
}
console.log("\nDone!");
