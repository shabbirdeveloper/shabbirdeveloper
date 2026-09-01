import { readFile, writeFile } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);
const heroPath = new URL("assets/hero/shabbir-hero.svg", projectRoot);
const scenePath = new URL("assets/hero/dark-developer-scene.webp", projectRoot);

const hero = await readFile(heroPath, "utf8");
const scene = await readFile(scenePath);
const dataUri = `data:image/webp;base64,${scene.toString("base64")}`;

const startMarker = "<!-- HERO_VISUAL_START -->";
const endMarker = "<!-- HERO_VISUAL_END -->";
const start = hero.indexOf(startMarker);
const end = hero.indexOf(endMarker);

if (start === -1 || end === -1 || end <= start) {
  throw new Error("Hero visual markers are missing or invalid.");
}

const visual = `${startMarker}
    <g aria-label="Shabbir Hussain working behind a laptop in a dark engineering workspace">
      <defs>
        <clipPath id="developerSceneClip">
          <rect x="690" y="46" width="468" height="351" rx="24"/>
        </clipPath>
      </defs>
      <ellipse cx="924" cy="389" rx="202" ry="20" fill="#2DD4BF" opacity=".12"/>
      <image href="${dataUri}" x="690" y="46" width="468" height="351" preserveAspectRatio="xMidYMid slice" clip-path="url(#developerSceneClip)" filter="url(#shadow)"/>
      <rect x="690" y="46" width="468" height="351" rx="24" fill="none" stroke="#38BDF8" stroke-opacity=".28"/>
      <path d="M718 375H1130" stroke="url(#accent)" stroke-width="2" stroke-linecap="round" opacity=".55"/>
    </g>
    ${endMarker}`;

const output = `${hero.slice(0, start)}${visual}${hero.slice(end + endMarker.length)}`;
await writeFile(heroPath, output, "utf8");
console.log("Embedded the dark developer scene into assets/hero/shabbir-hero.svg");
