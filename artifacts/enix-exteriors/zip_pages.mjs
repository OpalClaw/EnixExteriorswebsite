#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "public", "downloads");
const OUT = path.join(OUT_DIR, "enix-exteriors-ghl-pages.zip");

fs.mkdirSync(OUT_DIR, { recursive: true });

const zip = new JSZip();
const folder = zip.folder("enix-ghl-pages");

const pageMap = [
  { src: path.join(__dirname, "index.html"),                              label: "01-Home.html" },
  { src: path.join(__dirname, "public", "commercial-roofing.html"),       label: "02-Commercial-Roofing.html" },
  { src: path.join(__dirname, "public", "residential-roofing.html"),      label: "03-Residential-Roofing.html" },
  { src: path.join(__dirname, "public", "exterior-services.html"),        label: "04-Exterior-Services.html" },
  { src: path.join(__dirname, "public", "storm-damage-commercial.html"),  label: "05-Storm-Damage-Commercial.html" },
  { src: path.join(__dirname, "public", "storm-damage-residential.html"), label: "06-Storm-Damage-Residential.html" },
  { src: path.join(__dirname, "public", "education-hub.html"),            label: "07-Education-Hub.html" },
  { src: path.join(__dirname, "public", "about.html"),                    label: "08-About.html" },
  { src: path.join(__dirname, "public", "contact.html"),                  label: "09-Contact.html" },
  { src: path.join(__dirname, "public", "tennessee-locations.html"),      label: "10-Tennessee-Locations.html" },
];

for (const { src, label } of pageMap) {
  const content = fs.readFileSync(src);
  folder.file(label, content);
  console.log(`Added ${label}`);
}

const readme = `ENIX EXTERIORS — GHL (GoHighLevel) Custom HTML Pages
======================================================
Each numbered HTML file is a fully self-contained page.
Paste the entire contents of each file into a separate
GoHighLevel "Custom HTML" block for the matching menu item.

PAGE → GHL MENU ITEM MAPPING
-----------------------------
01-Home.html                     → Home                       (slug: /)
02-Commercial-Roofing.html       → Commercial Roofing         (slug: /commercial-roofing)
03-Residential-Roofing.html      → Residential Roofing        (slug: /residential-roofing)
04-Exterior-Services.html        → Exterior Services          (slug: /exterior-services)
05-Storm-Damage-Commercial.html  → Storm Damage – Commercial  (slug: /storm-damage-commercial)
06-Storm-Damage-Residential.html → Storm Damage – Residential (slug: /storm-damage-residential)
07-Education-Hub.html            → Education Hub              (slug: /education-hub)
08-About.html                    → About                      (slug: /about)
09-Contact.html                  → Contact                    (slug: /contact)
10-Tennessee-Locations.html      → Tennessee Locations        (slug: /tennessee-locations)

HOW TO PASTE INTO GHL
---------------------
1. In GoHighLevel, go to Sites → Funnels/Websites → your site.
2. Open (or create) the page matching the label above.
3. Add a "Custom HTML" element (or replace the existing one).
4. Open the numbered HTML file, select ALL text (Ctrl+A / Select All),
   then copy and paste into the Custom HTML box in GHL.
5. Save & Publish the page.
6. Repeat for each numbered file.

IMPORTANT NOTES
---------------
- Each file is 100% self-contained: inline CSS, inline SVG icons,
  inline JavaScript — no external dependencies to break in GHL.
- Navigation links use the slugs listed above. Make sure your GHL
  page slugs exactly match (e.g. /commercial-roofing, not /commercial).
- Phone: (865) 685-ENIX  |  Email: INFO@ENIXEXTERIORS.COM
- Address: 5992 Bearden View Ln, Knoxville TN 37909
`;

folder.file("README.txt", readme);
console.log("Added README.txt");

const buf = await zip.generateAsync({
  type: "nodebuffer",
  compression: "DEFLATE",
  compressionOptions: { level: 9 },
});

fs.writeFileSync(OUT, buf);

const sizeKb = (buf.length / 1024).toFixed(1);
console.log(`\nWrote: ${OUT}`);
console.log(`Size: ${sizeKb} KB | Entries: ${Object.keys(zip.files).length}`);
