import sharp from 'sharp'

export type Palette = { primary: string; accent: string }
export type TemplateLayout = 'sidebar' | 'banner' | 'minimal'

const GREY = '#d6dae1'
const INK = '#1f2937'

function lines(x: number, y: number, widths: number[], color = GREY, gap = 26, height = 10): string {
  return widths
    .map((w, i) => `<rect x="${x}" y="${y + i * gap}" width="${w}" height="${height}" rx="${height / 2}" fill="${color}"/>`)
    .join('')
}

function section(x: number, y: number, width: number, palette: Palette, rows = 4): string {
  return [
    `<rect x="${x}" y="${y}" width="${width * 0.35}" height="16" rx="8" fill="${palette.primary}"/>`,
    lines(x, y + 40, Array.from({ length: rows }, (_, i) => width * (i % 3 === 2 ? 0.62 : 0.94))),
  ].join('')
}

function templateSvg(layout: TemplateLayout, palette: Palette): string {
  const W = 900
  const H = 1272
  const body = {
    sidebar: [
      `<rect width="300" height="${H}" fill="${palette.primary}"/>`,
      `<circle cx="150" cy="170" r="84" fill="#ffffff" opacity="0.9"/>`,
      `<circle cx="150" cy="170" r="70" fill="${palette.accent}"/>`,
      lines(56, 320, [188, 150, 170], '#ffffff', 30, 12),
      lines(56, 470, [120, 160, 140, 170, 110], 'rgba(255,255,255,0.55)'),
      lines(56, 680, [150, 120, 170, 130], 'rgba(255,255,255,0.55)'),
      `<rect x="360" y="110" width="380" height="34" rx="10" fill="${INK}"/>`,
      `<rect x="360" y="164" width="240" height="16" rx="8" fill="${palette.accent}"/>`,
      section(360, 260, 480, palette),
      section(360, 470, 480, palette, 5),
      section(360, 710, 480, palette),
      section(360, 920, 480, palette, 3),
    ],
    banner: [
      `<rect width="${W}" height="290" fill="${palette.primary}"/>`,
      `<circle cx="150" cy="145" r="78" fill="${palette.accent}"/>`,
      `<rect x="270" y="105" width="400" height="36" rx="10" fill="#ffffff"/>`,
      `<rect x="270" y="162" width="260" height="16" rx="8" fill="rgba(255,255,255,0.7)"/>`,
      section(80, 360, 740, palette),
      section(80, 570, 740, palette, 5),
      `<rect x="80" y="810" width="740" height="2" fill="${GREY}"/>`,
      section(80, 860, 340, palette, 4),
      section(480, 860, 340, palette, 4),
    ],
    minimal: [
      `<rect x="70" y="90" width="8" height="${H - 180}" rx="4" fill="${palette.accent}"/>`,
      `<rect x="120" y="100" width="440" height="40" rx="10" fill="${INK}"/>`,
      `<rect x="120" y="162" width="300" height="16" rx="8" fill="${palette.primary}"/>`,
      lines(120, 220, [520, 470], GREY),
      section(120, 330, 680, palette),
      section(120, 540, 680, palette, 5),
      section(120, 780, 680, palette),
      section(120, 990, 680, palette, 3),
    ],
  }[layout]
  const scale = 4 / 3
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W * scale}" height="${H * scale}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="#ffffff"/>${body.join('')}</svg>`
}

function heroSvg(palette: Palette): string {
  const W = 1600
  const H = 1200
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${palette.primary}"/>
        <stop offset="1" stop-color="${palette.primary}" stop-opacity="0.78"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="30" stdDeviation="40" flood-color="#0b1020" flood-opacity="0.28"/>
      </filter>
    </defs>
    <rect width="${W}" height="${H}" rx="48" fill="url(#bg)"/>
    <circle cx="1380" cy="180" r="260" fill="${palette.accent}" opacity="0.35"/>
    <circle cx="180" cy="1050" r="320" fill="#ffffff" opacity="0.08"/>
    <g filter="url(#shadow)" transform="translate(470 150) rotate(-4)">
      <rect width="660" height="900" rx="28" fill="#ffffff"/>
      <rect width="660" height="210" rx="28" fill="${palette.primary}" opacity="0.12"/>
      <circle cx="120" cy="110" r="62" fill="${palette.accent}"/>
      <rect x="210" y="74" width="320" height="30" rx="10" fill="${INK}"/>
      <rect x="210" y="124" width="210" height="16" rx="8" fill="${palette.primary}"/>
      ${section(60, 260, 540, palette)}
      ${section(60, 460, 540, palette, 5)}
      ${section(60, 690, 540, palette, 3)}
    </g>
    <g filter="url(#shadow)" transform="translate(1040 760)">
      <rect width="360" height="150" rx="28" fill="#ffffff"/>
      <circle cx="80" cy="75" r="40" fill="${palette.accent}"/>
      <path d="M62 76 l13 13 l25 -27" stroke="#ffffff" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="140" y="52" width="170" height="18" rx="9" fill="${INK}"/>
      <rect x="140" y="86" width="120" height="14" rx="7" fill="${GREY}"/>
    </g>
  </svg>`
}

const png = (svg: string) => sharp(Buffer.from(svg)).png().toBuffer()

export const renderHero = (palette: Palette) => png(heroSvg(palette))
export const renderTemplate = (layout: TemplateLayout, palette: Palette) => png(templateSvg(layout, palette))
