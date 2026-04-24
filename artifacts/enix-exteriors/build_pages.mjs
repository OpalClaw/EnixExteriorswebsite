#!/usr/bin/env node
/**
 * Build all GHL-compatible standalone HTML pages for Enix Exteriors.
 * Each page is self-contained: inline CSS, inline SVG icons, inline JS.
 * Cross-page navigation uses relative .html links.
 * Run: node build_pages.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const PUB = path.join(ROOT, "public");
fs.mkdirSync(PUB, { recursive: true });

// --- Constants ----------------------------------------------------------------
const PHONE_DISPLAY = "(865) 685-ENIX";
const PHONE_TEL = "8656853649";
const EMAIL = "INFO@ENIXEXTERIORS.COM";
const ADDRESS = "5992 Bearden View Ln<br>Knoxville TN 37909";

const PAGES = [
  ["home", "index.html", "Home"],
  ["commercial-roofing", "commercial-roofing.html", "Commercial Roofing"],
  ["residential-roofing", "residential-roofing.html", "Residential Roofing"],
  ["exterior-services", "exterior-services.html", "Exterior Services"],
  ["storm-damage-commercial", "storm-damage-commercial.html", "Storm Damage Commercial"],
  ["storm-damage-residential", "storm-damage-residential.html", "Storm Damage Residential"],
  ["education-hub", "education-hub.html", "Education Hub"],
  ["about", "about.html", "About"],
  ["contact", "contact.html", "Contact"],
  ["tennessee-locations", "tennessee-locations.html", "Tennessee Locations"],
];

const URL = Object.fromEntries(PAGES.map(([s, f]) => [s, f]));

// --- SVG icons (lucide-style) -------------------------------------------------
const _svg = (body, w = 24, h = w, stroke = "currentColor") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const ICON = {
  home: '<path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M9 21v-6h6v6"/>',
  building: '<path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M9 21v-6h6v6"/><path d="M10 9h4"/><path d="M10 13h4"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  mapPin: '<path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  arrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  windPanel: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
  droplet: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
  tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
};

const icon = (name, w = 24, h = null, color = "#FF6A00") =>
  _svg(ICON[name], w, h || w, color);

// --- CSS ----------------------------------------------------------------------
const CSS = `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;overflow-x:hidden}
body{font-family:'Inter',sans-serif;background:#0B0C0E;color:#F4F6F8;overflow-x:hidden;line-height:1.6}
img{max-width:100%;display:block}
a{color:inherit}
.font-display{font-family:'Sora',sans-serif}
.font-mono{font-family:'IBM Plex Mono',monospace}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:15px 30px;display:flex;align-items:center;justify-content:space-between;transition:all .3s;background:transparent}
.nav.scrolled{background:rgba(11,12,14,.95);backdrop-filter:blur(12px);padding:10px 30px}
.nav-logo{display:flex;align-items:center;gap:12px;text-decoration:none}
.nav-logo svg{flex-shrink:0}
.nav-logo .lg-text{display:flex;flex-direction:column;line-height:1.1}
.nav-logo span{font-family:'Sora';font-weight:700;color:#fff;font-size:20px;letter-spacing:-.5px}
.nav-logo small{color:#FF6A00;font-size:10px;letter-spacing:.14em;text-transform:uppercase;font-weight:500}
.nav-links{display:flex;align-items:center;gap:28px}
.nav-links a,.nav-links .dropdown-toggle{color:#A9B1BC;text-decoration:none;font-size:14px;font-weight:500;transition:color .2s;cursor:pointer;background:none;border:none;font-family:inherit;display:inline-flex;align-items:center;gap:4px}
.nav-links a:hover,.nav-links .dropdown-toggle:hover,.nav-links a.active{color:#fff}
.nav-links a.active{color:#FF6A00}
.nav-cta{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;background:#FF6A00;color:#fff!important;text-decoration:none;font-weight:600;font-size:14px;border-radius:10px;transition:all .3s}
.nav-cta:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(255,106,0,.35)}
.dropdown{position:relative}
.dropdown-menu{position:absolute;top:100%;left:0;margin-top:10px;background:rgba(20,23,27,.96);backdrop-filter:blur(12px);border:1px solid rgba(244,246,248,.1);border-radius:14px;padding:8px;min-width:240px;opacity:0;visibility:hidden;transform:translateY(-10px);transition:all .25s;box-shadow:0 24px 70px rgba(0,0,0,.5)}
.dropdown:hover .dropdown-menu,.dropdown:focus-within .dropdown-menu{opacity:1;visibility:visible;transform:translateY(0)}
.dropdown-menu a{display:block;padding:10px 14px;color:#A9B1BC;text-decoration:none;font-size:14px;border-radius:8px;transition:all .2s}
.dropdown-menu a:hover{color:#fff;background:rgba(255,255,255,.06)}
.mobile-toggle{display:none;background:none;border:none;color:#fff;cursor:pointer;font-size:26px;line-height:1;padding:6px}
.mobile-menu{display:none;position:fixed;inset:0;background:rgba(11,12,14,.98);z-index:1100;padding:90px 30px 40px;text-align:center;overflow-y:auto}
.mobile-menu.active{display:block}
.mobile-menu a{display:block;color:#fff;text-decoration:none;font-family:'Sora';font-size:22px;font-weight:600;margin:18px 0}
.mobile-menu a:hover,.mobile-menu a.active{color:#FF6A00}
.close-menu{position:absolute;top:18px;right:18px;background:none;border:none;color:#fff;font-size:36px;cursor:pointer;line-height:1}

/* HERO + BG */
.hero-bg{position:absolute;inset:0;z-index:0;background:linear-gradient(135deg,#1a1c20 0%,#0B0C0E 50%,#1a1c20 100%)}
.hero-bg::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(255,106,0,.10) 0%,transparent 50%),radial-gradient(ellipse at 70% 80%,rgba(255,106,0,.06) 0%,transparent 50%)}
.section-bg-dark{background:#0B0C0E}
.section-bg-charcoal{background:#14171B}
.bg-image{position:absolute;inset:0;z-index:0}
.bg-image img{width:100%;height:100%;object-fit:cover}
.bg-image::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(11,12,14,.95) 0%,rgba(11,12,14,.75) 50%,rgba(11,12,14,.4) 100%)}
.bg-image.center::after{background:rgba(11,12,14,.78)}
.bg-image.heavy::after{background:rgba(11,12,14,.88)}

/* TYPE */
.headline-xl{font-family:'Sora';font-weight:800;line-height:.95;letter-spacing:-.02em;text-transform:uppercase;color:#fff}
.label-mono{font-family:'IBM Plex Mono';font-weight:500;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#FF6A00;display:inline-block}
.lead{font-size:18px;color:#A9B1BC;max-width:600px}
.muted{color:#A9B1BC}

/* CARDS */
.glass-card{background:rgba(20,23,27,.82);backdrop-filter:blur(12px);border:1px solid rgba(244,246,248,.1);box-shadow:0 24px 70px rgba(0,0,0,.4);border-radius:18px;padding:24px}
.glass-card.tight{padding:16px}
.card-icon{width:44px;height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(255,106,0,.12);color:#FF6A00;margin-bottom:14px}

/* BUTTONS */
.btn-primary,.btn-secondary{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;text-decoration:none;font-weight:600;font-size:15px;border-radius:12px;transition:all .3s;border:none;cursor:pointer;font-family:inherit;white-space:nowrap}
.btn-primary{background:#FF6A00;color:#fff}
.btn-primary:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(255,106,0,.4)}
.btn-secondary{background:transparent;color:#fff;border:2px solid rgba(255,255,255,.25)}
.btn-secondary:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.5);transform:translateY(-3px)}

/* FORM */
.form-input,.form-select,.form-textarea{width:100%;padding:14px 16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;color:#fff;font-size:15px;font-family:inherit;transition:all .2s}
.form-input::placeholder,.form-textarea::placeholder{color:rgba(255,255,255,.4)}
.form-input:focus,.form-select:focus,.form-textarea:focus{outline:none;border-color:rgba(255,106,0,.5);box-shadow:0 0 0 3px rgba(255,106,0,.15)}
.form-select option{background:#14171B;color:#fff}
.form-textarea{resize:vertical;min-height:120px}
.form-progress{display:flex;gap:8px;margin-bottom:20px}
.form-progress div{height:6px;flex:1;border-radius:3px;background:rgba(255,255,255,.15);transition:background .3s}
.form-progress div.active{background:#FF6A00}
.service-radio{cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding:14px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);transition:all .2s}
.service-radio input{display:none}
.service-radio:hover{background:rgba(255,255,255,.07)}
.service-radio.selected{background:rgba(255,106,0,.15);border-color:#FF6A00}
.service-radio .lbl{color:#fff;font-size:13px;font-weight:500}

/* LAYOUT */
.section{position:relative;width:100%;overflow:hidden}
.section-content{position:relative;z-index:10;padding:140px 30px 90px;max-width:1200px;margin:0 auto}
.section-content.tight{padding:90px 30px 70px}
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
.max-w-md{max-width:520px}
.max-w-lg{max-width:640px}
.max-w-xl{max-width:760px}
.max-w-2xl{max-width:880px}

/* UTILITY */
.check-list{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.check-list .item{display:flex;align-items:flex-start;gap:10px;color:#fff;font-size:14px;padding:10px 12px;background:rgba(255,255,255,.04);border-radius:10px;border:1px solid rgba(255,255,255,.08)}
.check-list .item svg{flex-shrink:0;margin-top:2px}
.step{display:flex;align-items:flex-start;gap:14px;margin-bottom:18px}
.step-num{width:38px;height:38px;border-radius:50%;background:#FF6A00;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;font-family:'Sora'}
.step h4{font-family:'Sora';font-size:17px;color:#fff;margin-bottom:4px}
.step p{color:#A9B1BC;font-size:14px}
.tag{display:inline-flex;align-items:center;padding:4px 10px;background:rgba(255,255,255,.08);border-radius:999px;font-size:12px;color:#A9B1BC}
.tag.orange{background:rgba(255,106,0,.15);color:#FF6A00}
.divider{height:1px;background:rgba(255,255,255,.1);margin:32px 0}

/* FOOTER */
.footer{background:#0B0C0E;border-top:1px solid rgba(255,255,255,.1);padding:60px 30px 30px}
.footer-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:40px;max-width:1200px;margin:0 auto 40px}
.footer a{color:#A9B1BC;text-decoration:none;font-size:14px;display:block;margin:8px 0;transition:color .2s}
.footer a:hover{color:#fff}
.footer h4{font-family:'Sora';font-weight:600;color:#fff;margin-bottom:16px;font-size:16px}
.footer p{color:#A9B1BC;font-size:14px;line-height:1.8}
.footer-bottom{max-width:1200px;margin:0 auto;padding-top:30px;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}

/* RESPONSIVE */
@media(max-width:1024px){
  .nav-links{display:none}
  .mobile-toggle{display:block}
}
@media(max-width:768px){
  .grid-2,.grid-3,.grid-4,.grid-5{grid-template-columns:1fr}
  .check-list{grid-template-columns:1fr}
  .section-content{padding:120px 20px 60px}
  .footer-grid{grid-template-columns:1fr 1fr;gap:24px}
  .footer-bottom{flex-direction:column;gap:8px;text-align:center}
  .headline-xl{font-size:clamp(28px,8vw,46px)}
  .nav{padding:12px 18px}
  .nav-logo span{font-size:17px}
}
@media(max-width:480px){
  .nav-logo .lg-text{display:none}
  .footer-grid{grid-template-columns:1fr}
}

/* SCROLLBAR */
::-webkit-scrollbar{width:8px}
::-webkit-scrollbar-track{background:#0B0C0E}
::-webkit-scrollbar-thumb{background:#2a2d33;border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:#3a3d43}
`.trim();

// --- Nav / Footer / Script ----------------------------------------------------
const LOGO_SVG = _svg(ICON.building, 42, 42, "#FF6A00");

function navHtml(active) {
  const cls = (slug) => (slug === active ? ' class="active"' : "");
  const servicesActive = ["commercial-roofing", "residential-roofing", "exterior-services", "storm-damage-commercial", "storm-damage-residential"].includes(active);
  const svcCls = servicesActive ? ' class="active"' : "";
  return `<nav class="nav" id="navbar">
  <a href="${URL.home}" class="nav-logo">
    ${LOGO_SVG}
    <div class="lg-text">
      <span>ENIX EXTERIORS</span>
      <small>YOUR LOCAL ROOFING EXPERT</small>
    </div>
  </a>
  <div class="nav-links">
    <a href="${URL.home}"${cls("home")}>Home</a>
    <div class="dropdown">
      <button class="dropdown-toggle"${svcCls}>Services &#9662;</button>
      <div class="dropdown-menu">
        <a href="${URL["commercial-roofing"]}">Commercial Roofing</a>
        <a href="${URL["residential-roofing"]}">Residential Roofing</a>
        <a href="${URL["exterior-services"]}">Exterior Services</a>
        <a href="${URL["storm-damage-commercial"]}">Storm Damage Commercial</a>
        <a href="${URL["storm-damage-residential"]}">Storm Damage Residential</a>
      </div>
    </div>
    <a href="${URL["education-hub"]}"${cls("education-hub")}>Education Hub</a>
    <a href="${URL["tennessee-locations"]}"${cls("tennessee-locations")}>Locations</a>
    <a href="${URL.about}"${cls("about")}>About</a>
    <a href="${URL.contact}"${cls("contact")}>Contact</a>
    <a href="tel:${PHONE_TEL}" class="nav-cta">${icon("phone", 16, null, "#fff")} Get a Quote</a>
  </div>
  <button class="mobile-toggle" onclick="toggleMenu()" aria-label="Open menu">&#9776;</button>
</nav>

<div class="mobile-menu" id="mobileMenu">
  <button class="close-menu" onclick="toggleMenu()" aria-label="Close menu">&times;</button>
  <a href="${URL.home}"${cls("home")}>Home</a>
  <a href="${URL["commercial-roofing"]}"${cls("commercial-roofing")}>Commercial Roofing</a>
  <a href="${URL["residential-roofing"]}"${cls("residential-roofing")}>Residential Roofing</a>
  <a href="${URL["exterior-services"]}"${cls("exterior-services")}>Exterior Services</a>
  <a href="${URL["storm-damage-commercial"]}"${cls("storm-damage-commercial")}>Storm Damage Commercial</a>
  <a href="${URL["storm-damage-residential"]}"${cls("storm-damage-residential")}>Storm Damage Residential</a>
  <a href="${URL["education-hub"]}"${cls("education-hub")}>Education Hub</a>
  <a href="${URL["tennessee-locations"]}"${cls("tennessee-locations")}>Locations</a>
  <a href="${URL.about}"${cls("about")}>About</a>
  <a href="${URL.contact}"${cls("contact")}>Contact</a>
  <a href="tel:${PHONE_TEL}" style="color:#FF6A00">${PHONE_DISPLAY}</a>
</div>`;
}

const FOOTER = `<footer class="footer">
  <div class="footer-grid">
    <div>
      ${_svg(ICON.building, 44, 44, "#FF6A00")}
      <p style="color:#A9B1BC;font-size:14px;margin:14px 0 8px">Your Local Roofing Expert</p>
      <p style="color:#FF6A00;font-size:13px;font-weight:600">TOP COMMERCIAL ROOFING<br>CONTRACTOR IN TENNESSEE</p>
      <p style="color:#A9B1BC;font-size:13px;margin-top:12px">${ADDRESS}</p>
    </div>
    <div>
      <h4>Services</h4>
      <a href="${URL["commercial-roofing"]}">Commercial Roofing</a>
      <a href="${URL["residential-roofing"]}">Residential Roofing</a>
      <a href="${URL["exterior-services"]}">Exterior Services</a>
      <a href="${URL["storm-damage-commercial"]}">Storm Damage Commercial</a>
      <a href="${URL["storm-damage-residential"]}">Storm Damage Residential</a>
    </div>
    <div>
      <h4>Company</h4>
      <a href="${URL.about}">About Us</a>
      <a href="${URL["education-hub"]}">Education Hub</a>
      <a href="${URL["tennessee-locations"]}">Tennessee Locations</a>
      <a href="${URL.contact}">Contact</a>
    </div>
    <div>
      <h4>Contact</h4>
      <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a>
      <a href="mailto:${EMAIL}">${EMAIL}</a>
      <p style="color:#A9B1BC;font-size:14px;margin-top:8px">Mon-Fri: 7am-6pm<br><span style="color:#FF6A00">Emergency: 24/7</span></p>
    </div>
  </div>
  <div class="footer-bottom">
    <p style="color:#A9B1BC;font-size:13px">&copy; 2025 Enix Exteriors. All rights reserved.</p>
    <p style="color:#A9B1BC;font-size:13px">Licensed &amp; Insured Roofing Contractor | Knoxville, TN</p>
  </div>
</footer>`;

const SCRIPT = `<script>
(function(){
  var navbar = document.getElementById('navbar');
  if(navbar){
    window.addEventListener('scroll', function(){
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }
  window.toggleMenu = function(){
    var m = document.getElementById('mobileMenu');
    if(m) m.classList.toggle('active');
  };
  var currentStep = 1;
  window.nextStep = function(){
    if(currentStep < 3){
      var cur = document.getElementById('step'+currentStep);
      var nxt = document.getElementById('step'+(currentStep+1));
      if(cur) cur.style.display = 'none';
      if(nxt) nxt.style.display = 'block';
      var pn = document.getElementById('p'+(currentStep+1));
      if(pn) pn.classList.add('active');
      currentStep++;
    }
  };
  window.prevStep = function(){
    if(currentStep > 1){
      var cur = document.getElementById('step'+currentStep);
      var prv = document.getElementById('step'+(currentStep-1));
      if(cur) cur.style.display = 'none';
      if(prv) prv.style.display = 'block';
      var pn = document.getElementById('p'+currentStep);
      if(pn) pn.classList.remove('active');
      currentStep--;
    }
  };
  window.handleFormSubmit = function(e){
    e.preventDefault();
    var s3 = document.getElementById('step3');
    var sx = document.getElementById('success');
    if(s3) s3.style.display='none';
    if(sx) sx.style.display='block';
    setTimeout(function(){
      if(sx) sx.style.display='none';
      var s1 = document.getElementById('step1');
      if(s1) s1.style.display='block';
      var p2 = document.getElementById('p2'); if(p2) p2.classList.remove('active');
      var p3 = document.getElementById('p3'); if(p3) p3.classList.remove('active');
      currentStep=1;
      e.target.reset();
      document.querySelectorAll('.service-radio').forEach(function(r){r.classList.remove('selected');});
    },3500);
    return false;
  };
  document.querySelectorAll('.service-radio input[type=radio]').forEach(function(inp){
    inp.addEventListener('change', function(){
      document.querySelectorAll('.service-radio').forEach(function(r){r.classList.remove('selected');});
      if(inp.checked) inp.closest('.service-radio').classList.add('selected');
    });
  });
})();
</script>`;

// --- Page wrapper -------------------------------------------------------------
const pageHtml = (slug, title, description, body) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
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

// --- Helpers ------------------------------------------------------------------
const hero = (slugLabel, headlineHtml, lead, primaryBtn, secondaryBtn = "", bgImg = null) => {
  const bg = bgImg
    ? `<div class="bg-image"><img src="images/${bgImg}" alt=""></div>`
    : `<div class="hero-bg"></div>`;
  return `<section class="section" style="min-height:100vh;display:flex;align-items:center;position:relative">
  ${bg}
  <div class="section-content" style="width:100%">
    <span class="label-mono mb-4">${slugLabel}</span>
    <h1 class="headline-xl mb-6" style="font-size:clamp(40px,6vw,72px)">${headlineHtml}</h1>
    <p class="lead mb-8">${lead}</p>
    <div class="flex flex-wrap gap-4">${primaryBtn}${secondaryBtn}</div>
  </div>
</section>`;
};

const ctaSection = (headlineHtml, lead, bgImg, primary, secondary) => `<section class="section" style="min-height:70vh;display:flex;align-items:center;position:relative">
  <div class="bg-image heavy"><img src="images/${bgImg}" alt=""></div>
  <div class="section-content text-center" style="width:100%">
    <h2 class="headline-xl mb-4" style="font-size:clamp(32px,5vw,56px)">${headlineHtml}</h2>
    <p class="lead mb-8" style="margin-left:auto;margin-right:auto">${lead}</p>
    <div class="flex flex-wrap gap-4 justify-center">${primary}${secondary}</div>
  </div>
</section>`;

const primaryBtn = (label, href, ic = "arrowRight") =>
  `<a href="${href}" class="btn-primary">${label} ${icon(ic, 18, null, "#fff")}</a>`;
const secondaryBtn = (label, href, ic = "arrowRight") =>
  `<a href="${href}" class="btn-secondary">${label} ${icon(ic, 18, null, "#fff")}</a>`;
const callBtn = (primary = true, label = null) => {
  const lbl = label || `Call ${PHONE_DISPLAY}`;
  const cls = primary ? "btn-primary" : "btn-secondary";
  return `<a href="tel:${PHONE_TEL}" class="${cls}">${icon("phone", 18, null, "#fff")} ${lbl}</a>`;
};

const checkItem = (text, ic = "checkCircle") =>
  `<div class="item">${icon(ic, 18)} <span>${text}</span></div>`;

const stat = (big, small) => `<div>
  <div class="font-display" style="font-size:clamp(36px,5vw,52px);font-weight:800;color:#FF6A00;line-height:1">${big}</div>
  <div class="muted" style="margin-top:8px;font-size:14px;letter-spacing:.05em;text-transform:uppercase">${small}</div>
</div>`;

const svcBlock = (ic, title, desc) => `<div class="glass-card">
  <div class="card-icon">${icon(ic, 24)}</div>
  <h3 class="font-display" style="font-weight:700;color:#fff;font-size:20px;margin-bottom:8px">${title}</h3>
  <p class="muted" style="font-size:14px">${desc}</p>
</div>`;

const processStep = (n, t, d) =>
  `<div class="step"><div class="step-num">${n}</div><div><h4>${t}</h4><p>${d}</p></div></div>`;

const icLine = (ic, text) =>
  `<div style="display:flex;align-items:flex-start;gap:10px;color:#A9B1BC;font-size:14px">${icon(ic, 16)} <span>${text}</span></div>`;

const valueCard = (ic, title, desc) => `<div class="glass-card text-center">
  <div class="card-icon" style="margin-left:auto;margin-right:auto">${icon(ic, 24)}</div>
  <h3 class="font-display" style="font-weight:700;color:#fff;font-size:18px;margin-bottom:6px">${title}</h3>
  <p class="muted" style="font-size:13px">${desc}</p>
</div>`;

const serviceCard = (ic, title, desc, href) => `<a href="${href}" class="glass-card" style="text-decoration:none;display:block;transition:transform .3s,box-shadow .3s">
  <div class="card-icon">${icon(ic, 24)}</div>
  <h3 class="font-display" style="font-weight:700;color:#fff;font-size:20px;margin-bottom:8px">${title}</h3>
  <p class="muted" style="font-size:14px;margin-bottom:14px">${desc}</p>
  <span style="color:#FF6A00;font-size:13px;font-weight:600;display:inline-flex;align-items:center;gap:6px">Learn more ${icon("arrowRight", 14)}</span>
</a>`;

// --- HOME ---
const homeBody = () => `<section class="section" style="min-height:100vh;display:flex;align-items:center;position:relative">
  <div class="hero-bg"></div>
  <div class="section-content" style="width:100%">
    <div class="flex items-center gap-4 mb-6">
      ${icon("building", 56)}
      <div style="width:1px;height:48px;background:rgba(255,255,255,.2)"></div>
      <span class="label-mono">TENNESSEE'S TRUSTED ROOFING EXPERTS</span>
    </div>
    <h1 class="headline-xl mb-6" style="font-size:clamp(38px,6vw,72px)">
      TOP COMMERCIAL<br>ROOFING CONTRACTOR<br>IN TENNESSEE
    </h1>
    <p class="lead mb-8">
      Your Local Roofing Expert. Commercial and residential roofing, siding, gutters, and windows
      done right the first time. Based in Knoxville, serving all of Tennessee.
    </p>
    <div class="flex flex-wrap gap-4">
      ${primaryBtn("Get Free Quote", URL.contact)}
      ${secondaryBtn("View Commercial Services", URL["commercial-roofing"])}
    </div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">WHAT WE DO</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(32px,5vw,52px)">FULL EXTERIOR<br>SERVICES</h2>
    <div class="grid grid-3">
      ${serviceCard("building", "Commercial Roofing", "TPO, modified bitumen, coatings, and complete roof systems for businesses statewide.", URL["commercial-roofing"])}
      ${serviceCard("home", "Residential Roofing", "Asphalt shingles, metal roofs, and tile systems for homes across Tennessee.", URL["residential-roofing"])}
      ${serviceCard("tool", "Exterior Services", "Siding, gutters, windows, and complete exterior renovations.", URL["exterior-services"])}
      ${serviceCard("alert", "Storm Damage", "24/7 emergency response, insurance claim assistance, and complete restoration.", URL["storm-damage-commercial"])}
      ${serviceCard("book", "Education Hub", "25+ guides on roofing, siding, gutters, and exterior services.", URL["education-hub"])}
      ${serviceCard("mapPin", "Tennessee Locations", "Serving Knoxville, Nashville, Memphis, Chattanooga, and beyond.", URL["tennessee-locations"])}
    </div>
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/commercial-roofing.jpg" alt=""></div>
  <div class="section-content">
    <span class="label-mono mb-4">WHY ENIX</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(32px,5vw,52px)">BUILT TO LAST.<br>BACKED BY US.</h2>
    <div class="check-list" style="max-width:900px">
      ${checkItem("Licensed and insured for your protection")}
      ${checkItem("Large crew capacity for fast completion")}
      ${checkItem("Comprehensive warranties on all work")}
      ${checkItem("24/7 emergency services available")}
      ${checkItem("Insurance claim assistance")}
      ${checkItem("Premium materials from trusted brands")}
      ${checkItem("Local Tennessee crews")}
      ${checkItem("Transparent, honest pricing")}
    </div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content">
    <div class="grid grid-4 text-center">
      ${stat("Statewide", "Service Coverage")}
      ${stat("24/7", "Emergency Response")}
      ${stat("Licensed", "& Fully Insured")}
      ${stat("Knoxville", "Headquartered")}
    </div>
  </div>
</section>

${ctaSection("READY TO START?", "Get a free quote from Tennessee's trusted commercial roofing contractor. No pressure, just honest answers.", "enix-truck.jpg", primaryBtn("Get Free Quote", URL.contact), callBtn(false))}`;

// --- COMMERCIAL ---
const commercialBody = () => `${hero("COMMERCIAL EXPERTISE",
  "COMMERCIAL<br>ROOFING",
  "Tennessee's top commercial roofing contractor. TPO, modified bitumen, coatings, and complete roof systems for businesses statewide. Licensed and insured for your protection.",
  primaryBtn("Get Commercial Quote", URL.contact),
  callBtn(false),
  "commercial-roofing.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">SYSTEMS WE INSTALL</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,46px)">PROVEN ROOF SYSTEMS</h2>
    <div class="grid grid-2">
      ${svcBlock("building", "TPO Roofing", "Thermoplastic polyolefin systems offer excellent durability and energy efficiency for flat commercial roofs. Ideal for large warehouses and retail centers.")}
      ${svcBlock("shield", "Modified Bitumen", "Multi-layer asphalt based systems providing superior waterproofing and weather resistance. Perfect for Tennessee's variable climate.")}
      ${svcBlock("clock", "Roof Coatings", "Extend the life of your existing roof with protective coatings that seal and reflect UV rays. Cost-effective maintenance solution.")}
      ${svcBlock("award", "Complete Replacement", "Tear-off and full replacement of aging roof systems. Modern materials and engineered designs for decades of performance.")}
    </div>
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/flat-roof-crew.jpg" alt=""></div>
  <div class="section-content">
    <span class="label-mono mb-4">WHO WE SERVE</span>
    <h2 class="headline-xl mb-8" style="font-size:clamp(28px,4.5vw,46px)">BUILDINGS WE PROTECT</h2>
    <div class="check-list" style="max-width:900px">
      ${checkItem("Warehouses & distribution centers", "building")}
      ${checkItem("Retail centers & shopping plazas", "building")}
      ${checkItem("Office buildings & corporate parks", "building")}
      ${checkItem("Manufacturing facilities", "building")}
      ${checkItem("Schools & municipal buildings", "building")}
      ${checkItem("Restaurants & hospitality", "building")}
      ${checkItem("Multi-family & apartment complexes", "building")}
      ${checkItem("Healthcare & medical campuses", "building")}
    </div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">OUR PROCESS</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,46px)">HOW WE DELIVER</h2>
    <div class="grid grid-2" style="gap:32px">
      <div>
        ${processStep("1", "Free Inspection", "On-site assessment of your existing roof, drainage, and substrate conditions.")}
        ${processStep("2", "Custom Proposal", "Detailed scope, materials, and pricing with no surprises.")}
        ${processStep("3", "Scheduled Install", "Phased installation that minimizes disruption to your business operations.")}
      </div>
      <div>
        ${processStep("4", "Quality Inspection", "Multi-point quality check before sign-off.")}
        ${processStep("5", "Warranty Activation", "Manufacturer and workmanship warranties documented for your records.")}
        ${processStep("6", "Ongoing Support", "Maintenance plans and 24/7 emergency response keep your roof in shape.")}
      </div>
    </div>
  </div>
</section>

${ctaSection("PROTECT YOUR<br>BUILDING TODAY", "Talk to Tennessee's commercial roofing experts. We'll inspect your roof and give you a straight answer.", "commercial-roofing.jpg", primaryBtn("Schedule Inspection", URL.contact), callBtn(false))}`;

// --- RESIDENTIAL ---
const residentialBody = () => `${hero("HOME PROTECTION",
  "RESIDENTIAL<br>ROOFING",
  "Quality roofing for Tennessee homes. Asphalt shingles, metal roofs, and tile systems installed by a crew you can trust.",
  primaryBtn("Get Free Estimate", URL.contact),
  callBtn(false),
  "white-farmhouse.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">ROOFING OPTIONS</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,46px)">FIND YOUR FIT</h2>
    <div class="grid grid-3">
      ${svcBlock("home", "Asphalt Shingles", "Architectural and 3-tab options. Affordable, attractive, and built for Tennessee weather.")}
      ${svcBlock("shield", "Metal Roofing", "50+ year lifespan with energy savings. Standing seam and metal shingle styles available.")}
      ${svcBlock("award", "Tile & Slate", "Premium tile and slate roofing for a high-end look that lasts generations.")}
      ${svcBlock("tool", "Roof Repairs", "Leak repairs, shingle replacement, flashing fixes — restored fast and right.")}
      ${svcBlock("droplet", "Re-Roofing", "Tear-off and replacement of aging roofs with modern, code-compliant materials.")}
      ${svcBlock("clock", "Maintenance", "Annual inspections and tune-ups extend the life of your investment.")}
    </div>
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/historic-metal-roof.jpg" alt=""></div>
  <div class="section-content">
    <span class="label-mono mb-4">WHY HOMEOWNERS CHOOSE ENIX</span>
    <h2 class="headline-xl mb-8" style="font-size:clamp(28px,4.5vw,46px)">QUALITY YOU CAN<br>SEE FROM THE STREET</h2>
    <div class="check-list" style="max-width:900px">
      ${checkItem("Free, no-pressure inspections")}
      ${checkItem("Premium materials from trusted brands")}
      ${checkItem("Manufacturer-certified installers")}
      ${checkItem("Comprehensive workmanship warranty")}
      ${checkItem("Insurance claim assistance")}
      ${checkItem("Daily job site clean-up")}
      ${checkItem("Honest, transparent pricing")}
      ${checkItem("Local Tennessee crews")}
    </div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">HOW IT WORKS</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,46px)">SIMPLE FROM<br>START TO FINISH</h2>
    <div class="grid grid-2" style="gap:32px">
      <div>
        ${processStep("1", "Call or Request Online", "Tell us about your project and book a free inspection.")}
        ${processStep("2", "On-Site Inspection", "We assess your roof and walk you through what we find.")}
        ${processStep("3", "Custom Proposal", "Honest pricing, material options, and a clear timeline.")}
      </div>
      <div>
        ${processStep("4", "Material Selection", "Pick colors and styles that match your home.")}
        ${processStep("5", "Professional Install", "Our crew installs efficiently with daily site clean-up.")}
        ${processStep("6", "Final Walkthrough", "Multi-point quality check and warranty activation.")}
      </div>
    </div>
  </div>
</section>

${ctaSection("READY FOR A<br>NEW ROOF?", "Schedule a free home inspection. No pressure, no surprises — just an honest assessment from your local roofing experts.", "white-farmhouse.jpg", primaryBtn("Book Free Inspection", URL.contact), callBtn(false))}`;

// --- EXTERIOR ---
const exteriorBody = () => `${hero("BEYOND THE ROOF",
  "EXTERIOR<br>SERVICES",
  "Siding, gutters, windows, and complete exterior renovations. One contractor, one warranty, one beautiful result.",
  primaryBtn("Get Free Quote", URL.contact),
  callBtn(false),
  "siding-house.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">SERVICES</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,46px)">A COMPLETE<br>EXTERIOR PARTNER</h2>
    <div class="grid grid-3">
      ${svcBlock("home", "Siding", "Vinyl, fiber cement, and engineered wood siding. Beautiful, durable, low-maintenance.")}
      ${svcBlock("droplet", "Seamless Gutters", "Custom-fit aluminum and copper gutters. Leaf guards available for hassle-free maintenance.")}
      ${svcBlock("windPanel", "Windows", "Energy-efficient replacement windows. Lower bills, more comfort, better curb appeal.")}
      ${svcBlock("shield", "Soffit & Fascia", "Protect your roof line with new soffit, fascia, and trim. Clean look, lasting protection.")}
      ${svcBlock("tool", "Doors", "Entry, storm, and patio doors that improve security, efficiency, and style.")}
      ${svcBlock("award", "Painting", "Exterior painting that protects and elevates your home or business.")}
    </div>
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/before-after.jpg" alt=""></div>
  <div class="section-content">
    <span class="label-mono mb-4">ALL UNDER ONE ROOF</span>
    <h2 class="headline-xl mb-8" style="font-size:clamp(28px,4.5vw,46px)">ONE CONTRACTOR.<br>ONE WARRANTY.</h2>
    <p class="lead mb-6">Coordinate your full exterior project with a single trusted team. We handle the schedule, materials, and warranty so you don't have to chase multiple subs.</p>
    <div class="check-list" style="max-width:900px">
      ${checkItem("Single point of contact for the whole project")}
      ${checkItem("Coordinated schedule, no idle days")}
      ${checkItem("Color and material matching across systems")}
      ${checkItem("Bundled pricing on multi-service projects")}
      ${checkItem("One warranty across roof, siding, and gutters")}
      ${checkItem("Insurance assistance for storm-related claims")}
    </div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">PROJECT FLOW</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,46px)">FROM CONSULT TO COMPLETE</h2>
    <div class="grid grid-2" style="gap:32px">
      <div>
        ${processStep("1", "Free Consultation", "We listen, inspect, and recommend.")}
        ${processStep("2", "Design & Selection", "Materials, colors, and finishes chosen with you.")}
        ${processStep("3", "Detailed Estimate", "Transparent pricing with no surprises.")}
      </div>
      <div>
        ${processStep("4", "Coordinated Schedule", "One crew, one timeline, minimal disruption.")}
        ${processStep("5", "Quality Installation", "Manufacturer-certified workmanship.")}
        ${processStep("6", "Final Walkthrough", "Sign-off, warranty, and clean site.")}
      </div>
    </div>
  </div>
</section>

${ctaSection("UPGRADE YOUR<br>EXTERIOR", "Get a free consultation on your full exterior project. Roof, siding, gutters, windows — handled.", "siding-house.jpg", primaryBtn("Start Your Project", URL.contact), callBtn(false))}`;

// --- STORM COMMERCIAL ---
const stormCommercialBody = () => `${hero("EMERGENCY SERVICES",
  "COMMERCIAL<br>STORM DAMAGE",
  "Storm damage to your business? We respond fast with emergency tarping, insurance documentation, and complete restoration services.",
  `<a href="tel:${PHONE_TEL}" class="btn-primary">${icon("phone", 18, null, "#fff")} Emergency Line 24/7</a>`,
  secondaryBtn("Request Assessment", URL.contact),
  "storm-damage.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">WHAT WE DO</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,46px)">EMERGENCY RESPONSE</h2>
    <div class="grid grid-2">
      ${svcBlock("clock", "Rapid Response", "Our emergency crews are on call 24/7. We arrive quickly to assess damage and prevent further problems.")}
      ${svcBlock("shield", "Emergency Tarping", "Temporary protection to stop leaks and prevent interior damage until permanent repairs can be made.")}
      ${svcBlock("file", "Insurance Documentation", "We document all damage with photos and detailed reports to support your insurance claim.")}
      ${svcBlock("phone", "Claim Assistance", "We work directly with your insurance company to ensure you get fair coverage for repairs.")}
    </div>
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/commercial-roofing.jpg" alt=""></div>
  <div class="section-content">
    <span class="label-mono mb-4">RESTORATION PROCESS</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,46px)">FROM DAMAGE<br>TO RESTORED</h2>
    <div style="max-width:680px">
      ${processStep("1", "Emergency Call", "Call our 24/7 emergency line. We dispatch a crew immediately.")}
      ${processStep("2", "Damage Assessment", "We inspect and document all damage for insurance and repair planning.")}
      ${processStep("3", "Temporary Protection", "Emergency tarping and sealing to prevent further damage.")}
      ${processStep("4", "Insurance Coordination", "We work with your adjuster to ensure proper claim handling.")}
      ${processStep("5", "Complete Restoration", "Full repairs or replacement to restore your roof to pre-storm condition.")}
    </div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">INSURANCE SUPPORT</span>
    <h2 class="headline-xl mb-8" style="font-size:clamp(28px,4.5vw,46px)">WE HANDLE<br>THE PAPERWORK</h2>
    <div class="glass-card max-w-2xl">
      <p class="muted mb-6">Dealing with insurance after storm damage can be overwhelming. Enix Exteriors has extensive experience working with all major insurance companies. We help you navigate the claims process to ensure you receive fair compensation for your repairs.</p>
      <div class="check-list">
        ${checkItem("Detailed damage documentation", "file")}
        ${checkItem("Photo evidence and reports", "file")}
        ${checkItem("Direct adjuster communication", "file")}
        ${checkItem("Supplement negotiations", "file")}
        ${checkItem("Code upgrade advocacy", "file")}
        ${checkItem("Claim status updates", "file")}
      </div>
    </div>
  </div>
</section>

${ctaSection("STORM DAMAGE?<br>CALL NOW", "Every minute counts after storm damage. Our emergency crews are standing by 24 hours a day, 7 days a week.", "enix-truck.jpg", callBtn(true), secondaryBtn("Request Callback", URL.contact))}`;

// --- STORM RESIDENTIAL ---
const stormResidentialBody = () => `${hero("HOME EMERGENCY",
  "HOME STORM<br>DAMAGE REPAIR",
  "When storms damage your home, Enix Exteriors responds fast. Emergency tarping, insurance help, and complete restoration to protect your family.",
  `<a href="tel:${PHONE_TEL}" class="btn-primary">${icon("phone", 18, null, "#fff")} Emergency 24/7</a>`,
  secondaryBtn("Request Help", URL.contact),
  "storm-damage.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">EMERGENCY SERVICES</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,46px)">PROTECTING<br>YOUR HOME</h2>
    <div class="grid grid-2">
      ${svcBlock("phone", "24/7 Emergency Line", "Call anytime, day or night. Our emergency crews are always on standby to respond to your call.")}
      ${svcBlock("home", "Emergency Tarping", "Fast temporary protection to stop leaks and prevent water damage to your home interior.")}
      ${svcBlock("shield", "Damage Assessment", "Thorough inspection of your roof, siding, gutters, and exterior for storm damage.")}
      ${svcBlock("file", "Insurance Help", "We document everything and work with your insurance to get your claim approved.")}
    </div>
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/dark-shingle-detail.jpg" alt=""></div>
  <div class="section-content">
    <span class="label-mono mb-4">WHAT TO LOOK FOR</span>
    <h2 class="headline-xl mb-8" style="font-size:clamp(28px,4.5vw,46px)">COMMON STORM<br>DAMAGE</h2>
    <div class="check-list" style="max-width:900px">
      ${checkItem("Missing or lifted shingles", "alert")}
      ${checkItem("Dented or damaged shingles", "alert")}
      ${checkItem("Granules in gutters", "alert")}
      ${checkItem("Leaks or water stains", "alert")}
      ${checkItem("Damaged flashing", "alert")}
      ${checkItem("Gutter damage or detachment", "alert")}
      ${checkItem("Siding dents or holes", "alert")}
      ${checkItem("Window or door damage", "alert")}
    </div>
    <p class="muted mt-6 max-w-lg">Even if you do not see obvious damage, hidden problems can lead to leaks and costly repairs later. Schedule a free post-storm inspection.</p>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">INSURANCE CLAIMS</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,46px)">WE MAKE IT<br>EASIER</h2>
    <div class="grid grid-2">
      <div class="glass-card">
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:18px;margin-bottom:14px">What We Do</h3>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${icLine("file", "Document all damage with photos")}
          ${icLine("file", "Provide detailed repair estimates")}
          ${icLine("file", "Meet with your insurance adjuster")}
          ${icLine("file", "Explain damage and needed repairs")}
          ${icLine("file", "Negotiate supplements if needed")}
          ${icLine("file", "Keep you informed throughout")}
        </div>
      </div>
      <div class="glass-card">
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:18px;margin-bottom:14px">What You Do</h3>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${icLine("shield", "Call us for emergency response")}
          ${icLine("shield", "Contact your insurance company")}
          ${icLine("shield", "Provide your policy information")}
          ${icLine("shield", "Approve the scope of work")}
          ${icLine("shield", "Pay your deductible")}
          ${icLine("shield", "Enjoy your restored home")}
        </div>
      </div>
    </div>
  </div>
</section>

${ctaSection("WE ARE HERE<br>TO HELP", "Do not wait to address storm damage. The sooner you call, the sooner we can protect your home and family.", "white-farmhouse.jpg", callBtn(true), secondaryBtn("Schedule Inspection", URL.contact))}`;

// --- EDUCATION ---
const ARTICLES = [
  ['How to Choose the Right Commercial Roof System', 'Commercial', '5 min'],
  ['Understanding TPO Roofing: Benefits and Installation', 'Commercial', '4 min'],
  ['Modified Bitumen vs TPO: Which is Right for You', 'Commercial', '6 min'],
  ['The Complete Guide to Roof Coatings', 'Commercial', '5 min'],
  ['Commercial Roof Maintenance: Annual Checklist', 'Commercial', '7 min'],
  ['Signs Your Commercial Roof Needs Replacement', 'Commercial', '4 min'],
  ['Architectural vs 3-Tab Shingles: What Homeowners Should Know', 'Residential', '5 min'],
  ['Metal Roofing: Is It Worth the Investment', 'Residential', '6 min'],
  ['How Long Does a Roof Last in Tennessee', 'Residential', '4 min'],
  ['The Homeowner Guide to Roof Ventilation', 'Residential', '5 min'],
  ['Preparing Your Roof for Tennessee Storm Season', 'Maintenance', '6 min'],
  ['DIY Roof Inspection: What to Look For', 'Maintenance', '5 min'],
  ['Gutter Maintenance: Preventing Costly Damage', 'Maintenance', '4 min'],
  ['When to Repair vs Replace Your Roof', 'Maintenance', '7 min'],
  ['Understanding Your Roof Warranty', 'Education', '5 min'],
  ['What to Do After Hail Damage', 'Storm', '4 min'],
  ['Navigating Insurance Claims for Roof Damage', 'Storm', '8 min'],
  ['Emergency Roof Tarping: Temporary Protection', 'Storm', '3 min'],
  ['Common Storm Damage Signs Homeowners Miss', 'Storm', '5 min'],
  ['Vinyl vs Fiber Cement Siding: Comparison Guide', 'Exterior', '6 min'],
  ['Energy Efficient Windows: Saving Money Year Round', 'Exterior', '5 min'],
  ['Seamless Gutters: Why They Matter', 'Exterior', '4 min'],
  ['The Importance of Proper Attic Insulation', 'Exterior', '5 min'],
  ['2025 Roofing Trends for Tennessee Homes', 'Trends', '4 min'],
  ['Questions to Ask Before Hiring a Roofing Contractor', 'Education', '6 min'],
];

const articleCard = ([title, cat, rt], compact = false) => {
  const pad = compact ? "14px" : "20px";
  const fz = compact ? "14px" : "16px";
  return `<div class="glass-card" style="padding:${pad};cursor:pointer;transition:transform .25s,background .25s">
  <span class="tag orange" style="margin-bottom:8px">${cat}</span>
  <h3 class="font-display" style="font-weight:600;color:#fff;font-size:${fz};margin:6px 0 10px;line-height:1.35">${title}</h3>
  <div class="muted" style="font-size:12px;display:flex;align-items:center;gap:6px">${icon("clock", 14, null, "#A9B1BC")} ${rt}</div>
</div>`;
};

const articleRow = ([title, cat, rt]) => `<div class="glass-card tight" style="display:flex;align-items:center;justify-content:space-between;gap:12px;cursor:pointer">
  <div>
    <span class="tag orange" style="margin-bottom:4px">${cat}</span>
    <h3 class="font-display" style="font-weight:600;color:#fff;font-size:14px;margin:4px 0">${title}</h3>
    <div class="muted" style="font-size:12px;display:flex;align-items:center;gap:6px">${icon("clock", 12, null, "#A9B1BC")} ${rt}</div>
  </div>
  ${icon("arrowRight", 16, null, "#A9B1BC")}
</div>`;

const educationBody = () => {
  const cats = ['All', 'Commercial', 'Residential', 'Storm', 'Maintenance'];
  const catPills = cats.map(c => `<span class="tag" style="padding:6px 12px;font-size:13px">${c}</span>`).join("");
  const featured = ARTICLES.slice(0, 3).map(a => articleCard(a)).join("");
  const commercial = ARTICLES.filter(a => a[1] === 'Commercial').map(articleRow).join("");
  const residential = ARTICLES.filter(a => a[1] === 'Residential').map(articleRow).join("");
  const stormMaint = ARTICLES.filter(a => a[1] === 'Storm' || a[1] === 'Maintenance').map(articleRow).join("");
  const all = ARTICLES.map(a => articleCard(a, true)).join("");
  return `<section class="section" style="min-height:100vh;display:flex;align-items:center;position:relative">
  <div class="bg-image"><img src="images/brand-banner.jpg" alt=""></div>
  <div class="section-content" style="width:100%">
    <div class="flex items-center gap-3 mb-4">
      ${icon("book", 36)}
      <span class="label-mono">LEARNING CENTER</span>
    </div>
    <h1 class="headline-xl mb-6" style="font-size:clamp(40px,6vw,72px)">EDUCATION<br>HUB</h1>
    <p class="lead mb-6">Expert knowledge on roofing, siding, gutters, and exterior services. Learn from Tennessee's top commercial roofing contractor.</p>
    <div class="flex flex-wrap gap-2">${catPills}</div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">FEATURED</span>
    <h2 class="headline-xl mb-8" style="font-size:clamp(28px,4.5vw,46px)">MUST-READ ARTICLES</h2>
    <div class="grid grid-3">${featured}</div>
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/commercial-roofing.jpg" alt=""></div>
  <div class="section-content">
    <span class="label-mono mb-4">COMMERCIAL</span>
    <h2 class="headline-xl mb-8" style="font-size:clamp(28px,4.5vw,46px)">COMMERCIAL<br>ROOFING GUIDES</h2>
    <div class="grid grid-2">${commercial}</div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">RESIDENTIAL</span>
    <h2 class="headline-xl mb-8" style="font-size:clamp(28px,4.5vw,46px)">HOMEOWNER<br>RESOURCES</h2>
    <div class="grid grid-2">${residential}</div>
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/storm-damage.jpg" alt=""></div>
  <div class="section-content">
    <span class="label-mono mb-4">STORM &amp; MAINTENANCE</span>
    <h2 class="headline-xl mb-8" style="font-size:clamp(28px,4.5vw,46px)">PROTECT YOUR<br>INVESTMENT</h2>
    <div class="grid grid-2">${stormMaint}</div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">ALL ARTICLES</span>
    <h2 class="headline-xl mb-6" style="font-size:clamp(28px,4.5vw,46px)">BROWSE ALL<br>25+ ARTICLES</h2>
    <div class="grid grid-4">${all}</div>
  </div>
</section>

${ctaSection("HAVE QUESTIONS?", "Our experts are here to help. Contact us for personalized advice on your roofing or exterior project.", "enix-truck.jpg", primaryBtn("Ask an Expert", URL.contact), callBtn(false))}`;
};

// --- ABOUT ---
const aboutBody = () => `${hero("ABOUT US",
  "ABOUT<br>ENIX EXTERIORS",
  "Your Local Roofing Expert. Tennessee's trusted commercial and residential roofing contractor.",
  primaryBtn("Get Free Quote", URL.contact),
  callBtn(false),
  "enix-truck.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">OUR STORY</span>
    <h2 class="headline-xl mb-8" style="font-size:clamp(28px,4.5vw,46px)">BUILT ON QUALITY</h2>
    <div class="grid grid-2" style="gap:32px">
      <div style="display:flex;flex-direction:column;gap:14px">
        <p class="muted">Enix Exteriors was founded with a simple mission: provide Tennessee homeowners and businesses with roofing and exterior services they can trust. What started as a small local operation has grown into one of the state's most respected roofing contractors.</p>
        <p class="muted">Our success comes from never compromising on quality. We use premium materials, employ skilled craftsmen, and stand behind every project with comprehensive warranties.</p>
        <p class="muted">Today, Enix Exteriors serves communities across Tennessee, from residential neighborhoods to major commercial developments. We are proud to be the local roofing expert that Tennessee trusts.</p>
      </div>
      <div class="glass-card">
        <img src="images/brand-banner.jpg" alt="Enix Exteriors brand" style="width:100%;height:180px;object-fit:cover;border-radius:12px;margin-bottom:14px">
        <div class="flex items-center gap-2 mb-2">${icon("star", 18)} <span style="color:#fff;font-weight:600;font-size:14px">Unique. Innovative. Forward.</span></div>
        <p class="muted" style="font-size:14px">Our tagline reflects our commitment to bringing fresh thinking and progressive solutions to every project.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/commercial-roofing.jpg" alt=""></div>
  <div class="section-content">
    <span class="label-mono mb-4">OUR VALUES</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,46px)">WHAT WE STAND FOR</h2>
    <div class="grid grid-4">
      ${valueCard("shield", "Integrity", "We do what we say. Honest assessments, fair pricing, and transparent communication.")}
      ${valueCard("award", "Quality", "Premium materials and skilled craftsmanship on every project, every time.")}
      ${valueCard("users", "Service", "Customer satisfaction is our priority. We are not done until you are happy.")}
      ${valueCard("mapPin", "Community", "Proudly serving Tennessee. Local crews who understand local needs.")}
    </div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">THE ENIX DIFFERENCE</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,46px)">WHY CHOOSE ENIX</h2>
    <div class="check-list" style="max-width:900px">
      ${checkItem("Licensed and insured for your protection")}
      ${checkItem("Large crew capacity for fast completion")}
      ${checkItem("Comprehensive warranties on all work")}
      ${checkItem("24/7 emergency services available")}
      ${checkItem("Insurance claim assistance")}
      ${checkItem("Premium materials from trusted brands")}
      ${checkItem("Local Tennessee crews")}
      ${checkItem("Transparent, honest pricing")}
    </div>
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/flat-roof-crew.jpg" alt=""></div>
  <div class="section-content">
    <span class="label-mono mb-4">SERVICE AREA</span>
    <h2 class="headline-xl mb-8" style="font-size:clamp(28px,4.5vw,46px)">SERVING TENNESSEE</h2>
    <div class="grid grid-2">
      <div class="glass-card">
        <div class="card-icon">${icon("mapPin", 24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:18px;margin-bottom:8px">Areas We Serve</h3>
        <p class="muted" style="font-size:14px;margin-bottom:14px">Enix Exteriors provides roofing and exterior services throughout Tennessee. From Memphis to Knoxville, Nashville to Chattanooga, we have got you covered.</p>
        <a href="${URL["tennessee-locations"]}" style="color:#FF6A00;font-size:14px;display:inline-flex;align-items:center;gap:8px;text-decoration:none">View All Locations ${icon("arrowRight", 14)}</a>
      </div>
      <div class="glass-card">
        <div class="card-icon">${icon("phone", 24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:18px;margin-bottom:8px">Get in Touch</h3>
        <div class="muted" style="font-size:14px;display:flex;flex-direction:column;gap:6px">
          <div><strong style="color:#fff">Phone:</strong> ${PHONE_DISPLAY}</div>
          <div><strong style="color:#fff">Email:</strong> ${EMAIL}</div>
          <div><strong style="color:#fff">Hours:</strong> Mon-Fri 7am-6pm</div>
          <div><strong style="color:#fff">Emergency:</strong> 24/7 Available</div>
        </div>
      </div>
    </div>
  </div>
</section>

${ctaSection("WORK WITH<br>THE BEST", "Experience the Enix difference. Quality roofing and exterior services from Tennessee's trusted contractor.", "white-farmhouse.jpg", primaryBtn("Get Free Quote", URL.contact), callBtn(false))}`;

// --- CONTACT ---
const contactCard = (ic, title, info, sub) => `<div class="glass-card text-center">
  <div class="card-icon" style="margin-left:auto;margin-right:auto">${icon(ic, 24)}</div>
  <h3 class="font-display" style="font-weight:700;color:#fff;font-size:16px;margin-bottom:4px">${title}</h3>
  <p style="color:#fff;font-size:14px;font-weight:500;word-break:break-word">${info}</p>
  <p class="muted" style="font-size:12px;margin-top:4px">${sub}</p>
</div>`;

const serviceRadio = (value, ic, label) => `<label class="service-radio">
  <input type="radio" name="service" value="${value}">
  ${icon(ic, 22)}
  <span class="lbl">${label}</span>
</label>`;

const contactBody = () => `${hero("GET IN TOUCH",
  "CONTACT<br>ENIX EXTERIORS",
  "Ready to start your project? Have questions? We are here to help. Reach out for a free quote or consultation.",
  callBtn(true),
  `<a href="mailto:${EMAIL}" class="btn-secondary">${icon("mail", 18, null, "#fff")} Email Us</a>`,
  "enix-truck.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">WAYS TO REACH US</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,46px)">HERE TO HELP</h2>
    <div class="grid grid-4">
      ${contactCard("phone", "Phone", PHONE_DISPLAY, "Mon-Fri 7am-6pm")}
      ${contactCard("mail", "Email", EMAIL, "We reply within 24 hours")}
      ${contactCard("mapPin", "Location", "Knoxville, TN", "Serving statewide")}
      ${contactCard("clock", "Hours", "Mon-Fri 7am-6pm", "Emergency 24/7")}
    </div>
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/commercial-roofing.jpg" alt=""></div>
  <div class="section-content">
    <span class="label-mono mb-4">REQUEST A QUOTE</span>
    <h2 class="headline-xl mb-8" style="font-size:clamp(28px,4.5vw,46px)">GET YOUR<br>FREE QUOTE</h2>
    <div class="glass-card" style="max-width:640px">
      <form id="quoteForm" onsubmit="return handleFormSubmit(event)">
        <div class="form-progress">
          <div id="p1" class="active"></div>
          <div id="p2"></div>
          <div id="p3"></div>
        </div>

        <div id="step1">
          <h3 class="font-display" style="font-weight:700;color:#fff;font-size:16px;margin-bottom:14px">Step 1: Your Information</h3>
          <div style="display:flex;flex-direction:column;gap:10px">
            <input type="text" name="name" placeholder="Your Name" required class="form-input">
            <input type="email" name="email" placeholder="Email Address" required class="form-input">
            <input type="tel" name="phone" placeholder="Phone Number" required class="form-input">
          </div>
          <button type="button" onclick="nextStep()" class="btn-primary w-full mt-4" style="justify-content:center">Next Step ${icon("arrowRight", 18, null, "#fff")}</button>
        </div>

        <div id="step2" style="display:none">
          <h3 class="font-display" style="font-weight:700;color:#fff;font-size:16px;margin-bottom:14px">Step 2: Service Type</h3>
          <div class="grid grid-2" style="gap:10px">
            ${serviceRadio("commercial", "building", "Commercial Roofing")}
            ${serviceRadio("residential", "home", "Residential Roofing")}
            ${serviceRadio("exterior", "tool", "Exterior Services")}
            ${serviceRadio("storm", "alert", "Storm Damage")}
          </div>
          <div class="flex gap-2 mt-4">
            <button type="button" onclick="prevStep()" class="btn-secondary" style="flex:1;justify-content:center">Back</button>
            <button type="button" onclick="nextStep()" class="btn-primary" style="flex:1;justify-content:center">Next ${icon("arrowRight", 18, null, "#fff")}</button>
          </div>
        </div>

        <div id="step3" style="display:none">
          <h3 class="font-display" style="font-weight:700;color:#fff;font-size:16px;margin-bottom:14px">Step 3: Project Details</h3>
          <textarea name="message" placeholder="Tell us about your project..." rows="4" class="form-textarea"></textarea>
          <div class="flex gap-2 mt-4">
            <button type="button" onclick="prevStep()" class="btn-secondary" style="flex:1;justify-content:center">Back</button>
            <button type="submit" class="btn-primary" style="flex:1;justify-content:center">${icon("send", 18, null, "#fff")} Submit Request</button>
          </div>
        </div>

        <div id="success" style="display:none;text-align:center;padding:18px 0">
          ${icon("checkCircle", 56)}
          <h4 class="font-display" style="font-weight:700;color:#fff;font-size:20px;margin:12px 0 6px">Thank You!</h4>
          <p class="muted">We will contact you within 24 hours.</p>
        </div>
      </form>
    </div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content">
    <div class="grid grid-2" style="gap:32px;align-items:center">
      <div>
        <span class="label-mono mb-4">EMERGENCY</span>
        <h2 class="headline-xl mb-6" style="font-size:clamp(28px,4.5vw,46px)">STORM DAMAGE?<br>CALL NOW</h2>
        <p class="muted mb-8">If you have storm damage or a roofing emergency, do not wait. Our emergency crews are available 24 hours a day, 7 days a week.</p>
        ${callBtn(true)}
      </div>
      <div class="glass-card">
        <div class="card-icon">${icon("alert", 24)}</div>
        <h3 class="font-display" style="font-weight:700;color:#fff;font-size:18px;margin-bottom:14px">Emergency Services</h3>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${icLine("checkCircle", "Emergency tarping and temporary repairs")}
          ${icLine("checkCircle", "Storm damage assessment")}
          ${icLine("checkCircle", "Leak detection and repair")}
          ${icLine("checkCircle", "Insurance documentation")}
          ${icLine("checkCircle", "Rapid response crews")}
        </div>
      </div>
    </div>
  </div>
</section>

${ctaSection("READY WHEN<br>YOU ARE", "Contact Enix Exteriors today. Your Local Roofing Expert is here to help with all your roofing and exterior needs.", "brand-banner.jpg", callBtn(true, "Call Now"), secondaryBtn("Back to Home", URL.home))}`;

// --- LOCATIONS ---
const LOCATIONS = [
  ['Nashville', 'Middle TN', ['Commercial', 'Residential', 'Storm']],
  ['Memphis', 'West TN', ['Commercial', 'Residential', 'Storm']],
  ['Knoxville', 'East TN', ['Commercial', 'Residential', 'Storm']],
  ['Chattanooga', 'Southeast TN', ['Commercial', 'Residential', 'Storm']],
  ['Clarksville', 'Middle TN', ['Residential', 'Storm']],
  ['Murfreesboro', 'Middle TN', ['Residential', 'Storm']],
  ['Franklin', 'Middle TN', ['Residential', 'Storm']],
  ['Jackson', 'West TN', ['Commercial', 'Residential']],
  ['Johnson City', 'East TN', ['Residential', 'Storm']],
  ['Kingsport', 'East TN', ['Residential', 'Storm']],
];

const locationCard = ([name, region, services]) => {
  const tags = services.map(s => `<span class="tag">${s}</span>`).join("");
  return `<div class="glass-card tight">
  <div class="flex items-center gap-2 mb-2">${icon("mapPin", 16)} <span class="muted" style="font-size:12px">${region}</span></div>
  <h3 class="font-display" style="font-weight:700;color:#fff;font-size:16px;margin-bottom:8px">${name}</h3>
  <div class="flex flex-wrap gap-2">${tags}</div>
</div>`;
};

const majorCityCard = (name, image, desc) => `<div class="glass-card" style="padding:0;overflow:hidden">
  <div style="height:140px;overflow:hidden"><img src="images/${image}" alt="${name}" style="width:100%;height:100%;object-fit:cover"></div>
  <div style="padding:14px">
    <h3 class="font-display" style="font-weight:700;color:#fff;font-size:16px;margin-bottom:4px">${name}</h3>
    <p class="muted" style="font-size:12px">${desc}</p>
  </div>
</div>`;

const locationsBody = () => {
  const locs = LOCATIONS.map(locationCard).join("");
  return `${hero("STATEWIDE SERVICE",
    "TENNESSEE<br>LOCATIONS",
    "Enix Exteriors serves communities across Tennessee. From Memphis to Knoxville, Nashville to Chattanooga, we are your local roofing expert.",
    callBtn(true),
    secondaryBtn("Request Service", URL.contact),
    "new-construction.jpg")}

<section class="section section-bg-charcoal">
  <div class="section-content">
    <span class="label-mono mb-4">MAJOR MARKETS</span>
    <h2 class="headline-xl mb-10" style="font-size:clamp(28px,4.5vw,46px)">SERVING<br>MAJOR CITIES</h2>
    <div class="grid grid-4">
      ${majorCityCard("Nashville", "white-farmhouse.jpg", "Music City roofing experts")}
      ${majorCityCard("Memphis", "red-farmhouse.jpg", "Blues City protection")}
      ${majorCityCard("Knoxville", "historic-metal-roof.jpg", "East Tennessee trusted")}
      ${majorCityCard("Chattanooga", "siding-house.jpg", "Scenic City services")}
    </div>
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/flat-roof-crew.jpg" alt=""></div>
  <div class="section-content">
    <span class="label-mono mb-4">SERVICE AREAS</span>
    <h2 class="headline-xl mb-8" style="font-size:clamp(28px,4.5vw,46px)">ALL LOCATIONS</h2>
    <div class="grid grid-5">${locs}</div>
  </div>
</section>

<section class="section section-bg-charcoal">
  <div class="section-content">
    <div class="grid grid-2" style="gap:32px;align-items:center">
      <div>
        <div class="flex items-center gap-3 mb-4">${icon("building", 30)} <span class="label-mono">COMMERCIAL</span></div>
        <h2 class="headline-xl mb-6" style="font-size:clamp(28px,4.5vw,42px)">COMMERCIAL<br>ROOFING<br>STATEWIDE</h2>
        <p class="muted mb-6">Enix Exteriors is Tennessee's top commercial roofing contractor. We serve businesses of all sizes across the state with quality roofing solutions.</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:24px">
          ${icLine("checkCircle", "Large crew capacity for fast completion")}
          ${icLine("checkCircle", "TPO, modified bitumen, and coating systems")}
          ${icLine("checkCircle", "Minimal business disruption")}
          ${icLine("checkCircle", "24/7 emergency repair services")}
        </div>
        ${primaryBtn("Commercial Services", URL["commercial-roofing"])}
      </div>
      <div class="glass-card" style="padding:14px"><img src="images/commercial-roofing.jpg" alt="Commercial roofing" style="width:100%;height:280px;object-fit:cover;border-radius:12px"></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="bg-image"><img src="images/before-after.jpg" alt=""></div>
  <div class="section-content">
    <div class="grid grid-2" style="gap:32px;align-items:center">
      <div class="glass-card" style="padding:14px"><img src="images/white-farmhouse.jpg" alt="Residential roofing" style="width:100%;height:280px;object-fit:cover;border-radius:12px"></div>
      <div>
        <div class="flex items-center gap-3 mb-4">${icon("home", 30)} <span class="label-mono">RESIDENTIAL</span></div>
        <h2 class="headline-xl mb-6" style="font-size:clamp(28px,4.5vw,42px)">HOME ROOFING<br>EXPERTS</h2>
        <p class="muted mb-6">Protect your family and your biggest investment with quality residential roofing from Enix Exteriors. Shingle, metal, and tile systems for every home.</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:24px">
          ${icLine("checkCircle", "Shingle, metal, and tile roofing")}
          ${icLine("checkCircle", "Free inspections and estimates")}
          ${icLine("checkCircle", "Quality materials and workmanship")}
          ${icLine("checkCircle", "Comprehensive warranties")}
        </div>
        ${primaryBtn("Residential Services", URL["residential-roofing"])}
      </div>
    </div>
  </div>
</section>

${ctaSection("FIND YOUR<br>LOCAL EXPERT", "Wherever you are in Tennessee, Enix Exteriors is ready to help. Contact us for roofing and exterior services near you.", "enix-truck.jpg", callBtn(true), secondaryBtn("Request Quote", URL.contact))}`;
};

// --- Page registry ------------------------------------------------------------
const PAGE_DEFS = {
  "home": ["Enix Exteriors | Top Commercial Roofing Contractor in Tennessee | Your Local Roofing Expert",
    "Enix Exteriors is the top commercial roofing contractor in Tennessee. Your Local Roofing Expert. Commercial and residential roofing, siding, gutters, and windows. Knoxville roofing company serving all of Tennessee.",
    homeBody, path.join(ROOT, "index.html")],
  "commercial-roofing": ["Commercial Roofing | Enix Exteriors | Tennessee",
    "Tennessee's top commercial roofing contractor. TPO, modified bitumen, coatings, and complete roof systems for businesses statewide.",
    commercialBody, path.join(PUB, "commercial-roofing.html")],
  "residential-roofing": ["Residential Roofing | Enix Exteriors | Tennessee",
    "Quality residential roofing for Tennessee homes. Asphalt shingles, metal, and tile systems installed by licensed local crews.",
    residentialBody, path.join(PUB, "residential-roofing.html")],
  "exterior-services": ["Exterior Services | Enix Exteriors | Tennessee",
    "Siding, gutters, windows, and complete exterior renovations from Tennessee's trusted contractor. One team, one warranty.",
    exteriorBody, path.join(PUB, "exterior-services.html")],
  "storm-damage-commercial": ["Commercial Storm Damage | Enix Exteriors | Tennessee",
    "Emergency commercial storm damage restoration in Tennessee. 24/7 emergency roofing, insurance assistance, and fast repairs for businesses.",
    stormCommercialBody, path.join(PUB, "storm-damage-commercial.html")],
  "storm-damage-residential": ["Residential Storm Damage | Enix Exteriors | Tennessee",
    "Emergency residential storm damage repair in Tennessee. 24/7 emergency roofing, tarping, insurance claims, and complete home restoration.",
    stormResidentialBody, path.join(PUB, "storm-damage-residential.html")],
  "education-hub": ["Education Hub | Enix Exteriors | Tennessee Roofing Resources",
    "Learn about roofing, siding, gutters, and exterior services. 25+ articles from Tennessee's top roofing contractor.",
    educationBody, path.join(PUB, "education-hub.html")],
  "about": ["About Us | Enix Exteriors | Tennessee Roofing Contractor",
    "Learn about Enix Exteriors, Tennessee's top commercial roofing contractor. Our story, values, and commitment to quality.",
    aboutBody, path.join(PUB, "about.html")],
  "contact": ["Contact Us | Enix Exteriors | Tennessee Roofing Contractor",
    "Contact Enix Exteriors for free roofing quotes in Tennessee. Commercial and residential roofing services. Emergency repairs available 24/7.",
    contactBody, path.join(PUB, "contact.html")],
  "tennessee-locations": ["Tennessee Locations | Enix Exteriors | Roofing Services Near You",
    "Enix Exteriors serves communities across Tennessee. Commercial and residential roofing in Nashville, Memphis, Knoxville, Chattanooga, and more.",
    locationsBody, path.join(PUB, "tennessee-locations.html")],
};

// --- BUILD --------------------------------------------------------------------
const written = [];
for (const [slug, [title, desc, bodyFn, out]] of Object.entries(PAGE_DEFS)) {
  const html = pageHtml(slug, title, desc, bodyFn());
  fs.writeFileSync(out, html, "utf-8");
  written.push([slug, path.relative(ROOT, out), html.length]);
}
console.log(`Built ${written.length} pages:`);
for (const [s, p, sz] of written) {
  console.log(`  ${s.padEnd(30)}  ${p.padEnd(42)}  ${String(sz).padStart(6)} bytes`);
}
