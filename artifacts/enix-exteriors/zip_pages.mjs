#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = "/tmp/enix-ghl-pages";
const OUT_DIR = path.join(__dirname, "public", "downloads");
const OUT = path.join(OUT_DIR, "enix-exteriors-ghl-pages.zip");

fs.mkdirSync(OUT_DIR, { recursive: true });

const zip = new JSZip();

function addDir(rel) {
  const full = path.join(SRC, rel);
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const childRel = path.join(rel, entry.name);
    if (entry.isDirectory()) addDir(childRel);
    else zip.file(childRel, fs.readFileSync(path.join(full, entry.name)));
  }
}
addDir("");

const buf = await zip.generateAsync({
  type: "nodebuffer",
  compression: "DEFLATE",
  compressionOptions: { level: 9 },
});
fs.writeFileSync(OUT, buf);

const sizeKb = (buf.length / 1024).toFixed(1);
console.log(`Wrote ${OUT} (${sizeKb} KB, ${Object.keys(zip.files).length} entries)`);
