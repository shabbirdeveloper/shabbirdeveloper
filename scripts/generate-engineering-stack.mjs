import { writeFile } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);
const outputPath = new URL("assets/graphics/engineering-stack.svg", projectRoot);

const escapeXml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const groups = [
  {
    title: "Frontend & product UI",
    icons: "react,nextjs,ts,js,html,css,tailwind",
    width: 352,
    description: "React · Next.js · TypeScript · JavaScript · HTML5 · CSS3 · Tailwind CSS",
  },
  {
    title: "Backend & APIs",
    icons: "nodejs,fastapi,py",
    width: 144,
    description: "Node.js · REST APIs · FastAPI · Python · server-side architecture",
  },
  {
    title: "Data & platform",
    icons: "postgres,supabase,mysql",
    width: 144,
    description: "PostgreSQL · Supabase · MySQL · authentication · authorization",
  },
  {
    title: "Delivery & workflow",
    icons: "git,github,vercel,docker,vscode,postman,figma",
    width: 352,
    description: "Git · GitHub · Vercel · Docker · VS Code · Postman · Figma",
  },
];

for (const group of groups) {
  const response = await fetch(`https://skillicons.dev/icons?i=${group.icons}&theme=dark`);

  if (!response.ok) {
    throw new Error(`Unable to download ${group.title} icons: ${response.status}`);
  }

  const svg = Buffer.from(await response.arrayBuffer());
  group.dataUri = `data:image/svg+xml;base64,${svg.toString("base64")}`;
}

const panels = groups.map((group, index) => {
  const column = index % 2;
  const row = Math.floor(index / 2);
  const x = column === 0 ? 28 : 614;
  const y = row === 0 ? 28 : 212;
  const imageX = x + (558 - group.width) / 2;

  return `
    <g transform="translate(${x} ${y})">
      <rect width="558" height="158" rx="20" fill="${index % 2 === 0 ? "#0C2035" : "#0A1D31"}" stroke="#264763"/>
      <rect x="1" y="1" width="556" height="5" rx="3" fill="url(#accent)"/>
      <text x="279" y="38" text-anchor="middle" fill="#F8FAFC" font-size="19" font-weight="750">${escapeXml(group.title)}</text>
    </g>
    <image href="${group.dataUri}" x="${imageX}" y="${y + 52}" width="${group.width}" height="54" preserveAspectRatio="xMidYMid meet"/>
    <text x="${x + 279}" y="${y + 136}" text-anchor="middle" fill="#B8C7D9" font-size="13" font-weight="550">${escapeXml(group.description)}</text>`;
}).join("");

const output = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="398" viewBox="0 0 1200 398" role="img" aria-labelledby="title desc">
  <title id="title">Engineering technology stack</title>
  <desc id="desc">A dark navy technology panel showing frontend, backend, data platform, and delivery workflow tools.</desc>
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#071525"/>
      <stop offset="0.56" stop-color="#0A1B2E"/>
      <stop offset="1" stop-color="#082634"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#38BDF8"/>
      <stop offset="1" stop-color="#2DD4BF"/>
    </linearGradient>
    <radialGradient id="ambient" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#38BDF8" stop-opacity=".14"/>
      <stop offset="1" stop-color="#38BDF8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <style>
    #ambientGlow { animation: breathe 7s ease-in-out infinite; transform-origin: center; }
    @keyframes breathe {
      0%, 100% { opacity: .62; transform: scale(.94); }
      50% { opacity: 1; transform: scale(1.08); }
    }
    @media (prefers-reduced-motion: reduce) {
      #ambientGlow { animation: none; }
    }
  </style>
  <rect x="1" y="1" width="1198" height="396" rx="24" fill="url(#background)" stroke="#23415C" stroke-width="2"/>
  <circle id="ambientGlow" cx="1080" cy="24" r="250" fill="url(#ambient)"/>
  <g font-family="Inter, Segoe UI, Arial, sans-serif">${panels}
  </g>
</svg>
`;

await writeFile(outputPath, output, "utf8");
console.log("Generated assets/graphics/engineering-stack.svg");
