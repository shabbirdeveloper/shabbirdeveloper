import { readFile, writeFile } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);
const heroPath = new URL("assets/hero/shabbir-hero.svg", projectRoot);
const laptopPath = new URL("assets/hero/laptop-portrait.webp", projectRoot);

const hero = await readFile(heroPath, "utf8");
const laptop = await readFile(laptopPath);
const dataUri = `data:image/webp;base64,${laptop.toString("base64")}`;

const startMarker = "<!-- HERO_VISUAL_START -->";
const endMarker = "<!-- HERO_VISUAL_END -->";
const start = hero.indexOf(startMarker);
const end = hero.indexOf(endMarker);

if (start === -1 || end === -1 || end <= start) {
  throw new Error("Hero visual markers are missing or invalid.");
}

const visual = `${startMarker}
    <g aria-label="Open laptop displaying a sketch portrait of Shabbir Hussain">
      <ellipse cx="926" cy="381" rx="220" ry="25" fill="#2DD4BF" opacity=".06"/>
      <g transform="translate(690 46) scale(.39)" filter="url(#shadow)">
        <defs>
          <clipPath id="laptopSilhouette" clipPathUnits="userSpaceOnUse">
            <rect x="170" y="34" width="860" height="620" rx="36"/>
            <path d="M155 610H1045L1156 816Q1160 842 1128 850H72Q40 842 48 816Z"/>
          </clipPath>
        </defs>
        <image href="${dataUri}" width="1200" height="900" clip-path="url(#laptopSilhouette)" preserveAspectRatio="xMidYMid meet"/>
      </g>
    </g>
    ${endMarker}`;

const output = `${hero.slice(0, start)}${visual}${hero.slice(end + endMarker.length)}`;
await writeFile(heroPath, output, "utf8");
console.log("Embedded the laptop portrait into assets/hero/shabbir-hero.svg");
