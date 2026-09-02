import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const projectRoot = new URL("../", import.meta.url);
const sourceDirectory = new URL("assets/projects/", projectRoot);
const outputDirectory = new URL("assets/projects/animated/", projectRoot);

const projects = [
  { slug: "mytnr", source: "mytnr.jpg", title: "MyTNR", colors: ["#22C55E", "#2DD4BF"] },
  { slug: "rego", source: "rego.webp", title: "REGO", colors: ["#F4C542", "#22C55E"] },
  { slug: "northfxtrade", source: "northfxtrade.png", title: "NorthFXTrade", colors: ["#14B8A6", "#38BDF8"] },
  { slug: "swissproperty", source: "swissproperty.png", title: "SwissProperty", colors: ["#D4AF37", "#F8FAFC"] },
  { slug: "naseeb-chapati", source: "naseeb-chapati.png", title: "Naseeb Chapati", colors: ["#F59E0B", "#FB7185"] },
  { slug: "skardu-travel-planner", source: "skardu-travel-planner.webp", title: "Skardu Travel Planner", colors: ["#22C55E", "#67E8F9"] },
  { slug: "al-khalifa", source: "al-khalifa.webp", title: "Al Khalifa Signature", colors: ["#F59E0B", "#FDE68A"] },
  { slug: "arifa-overseas", source: "arifa-overseas.webp", title: "Arifa Overseas", colors: ["#0EA5E9", "#67E8F9"] },
  { slug: "northdigital-tech", source: "northdigital-tech.webp", title: "NorthDigital Tech", colors: ["#06B6D4", "#3B82F6"] },
  { slug: "shia-taleem", source: "shia-taleem.png", title: "SHIA TALEEM", colors: ["#7C3AED", "#38BDF8"] },
  { slug: "cythetic", source: "cythetic.webp", title: "Cythetic Asia", colors: ["#D4A72C", "#F8FAFC"] },
  { slug: "northpair", source: "northpair.webp", title: "NorthPair", colors: ["#F8FAFC", "#64748B"] },
  { slug: "green-hills-education", source: "green-hills-education.webp", title: "Green Hills Education System", colors: ["#008A4B", "#FFD400"] },
];

const detectMimeType = (image, fileName) => {
  if (image[0] === 0xff && image[1] === 0xd8 && image[2] === 0xff) {
    return "image/jpeg";
  }

  if (image.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "image/png";
  }

  if (image.subarray(0, 4).toString("ascii") === "RIFF" && image.subarray(8, 12).toString("ascii") === "WEBP") {
    return "image/webp";
  }

  throw new Error(`Unsupported image data: ${fileName}`);
};

const escapeXml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const renderFrame = ({ title, dataUri, colors, delay }) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(title)} project preview</title>
  <desc id="desc">A softly animated preview frame for ${escapeXml(title)} with a moving highlight and a subtle glowing border.</desc>
  <defs>
    <clipPath id="cardClip">
      <rect x="7" y="7" width="1186" height="661" rx="24"/>
    </clipPath>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${colors[0]}"/>
      <stop offset="0.48" stop-color="${colors[1]}"/>
      <stop offset="1" stop-color="${colors[0]}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <filter id="softGlow" x="-10%" y="-15%" width="120%" height="130%">
      <feGaussianBlur stdDeviation="7" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <style>
    #glowFrame { animation: glow 4.8s ease-in-out infinite; }
    #shineSweep { animation: sweep 7.2s cubic-bezier(.4, 0, .2, 1) infinite; animation-delay: ${delay}s; }
    @keyframes glow {
      0%, 100% { opacity: .42; }
      50% { opacity: .9; }
    }
    @keyframes sweep {
      0%, 56% { opacity: 0; transform: translateX(-430px); }
      62% { opacity: .78; }
      86% { opacity: .78; }
      94%, 100% { opacity: 0; transform: translateX(1680px); }
    }
    @media (prefers-reduced-motion: reduce) {
      #glowFrame, #shineSweep { animation: none; }
      #glowFrame { opacity: .64; }
      #shineSweep { display: none; }
    }
  </style>
  <rect width="1200" height="675" rx="28" fill="#070B14"/>
  <image href="${dataUri}" x="7" y="7" width="1186" height="661" preserveAspectRatio="xMidYMid slice" clip-path="url(#cardClip)"/>
  <g id="shineSweep" clip-path="url(#cardClip)" opacity="0" transform="translate(-430 0)">
    <path d="M-260 0H-50L260 675H50Z" fill="url(#shine)"/>
  </g>
  <rect x="8" y="8" width="1184" height="659" rx="23" fill="none" stroke="#020617" stroke-opacity=".55" stroke-width="10"/>
  <rect id="glowFrame" x="9" y="9" width="1182" height="657" rx="22" fill="none" stroke="url(#edge)" stroke-width="5" filter="url(#softGlow)"/>
  <rect x="2" y="2" width="1196" height="671" rx="27" fill="none" stroke="#334155" stroke-opacity=".7" stroke-width="2"/>
</svg>
`;

await mkdir(outputDirectory, { recursive: true });

for (const [index, project] of projects.entries()) {
  const sourcePath = new URL(project.source, sourceDirectory);
  const image = await readFile(sourcePath);
  const mimeType = detectMimeType(image, project.source);
  const dataUri = `data:${mimeType};base64,${image.toString("base64")}`;
  const svg = renderFrame({
    ...project,
    dataUri,
    delay: (index * -0.58).toFixed(2),
  });

  await writeFile(new URL(`${project.slug}.svg`, outputDirectory), svg, "utf8");
}

console.log(`Generated ${projects.length} animated project frames in ${join("assets", "projects", "animated")}.`);
