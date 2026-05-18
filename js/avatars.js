/* ═══════════════════════════════════════════════════════════
   AVATARS — 12 SVG faces (6 femininos + 6 masculinos)
   Tons de pele variados · skill-forge-visual v5.1 · 2026-05-18
═══════════════════════════════════════════════════════════ */

const AVATAR_DATA = {
  'fem-1': { skin: '#FDDBB4', hair: '#F5C842', gender: 'fem' },
  'fem-2': { skin: '#F5C89A', hair: '#C47A3A', gender: 'fem' },
  'fem-3': { skin: '#E8A87C', hair: '#7B4D2E', gender: 'fem' },
  'fem-4': { skin: '#C47A4A', hair: '#2A1A0E', gender: 'fem' },
  'fem-5': { skin: '#8B4513', hair: '#1A0A05', gender: 'fem' },
  'fem-6': { skin: '#F0D5A8', hair: '#1A1010', gender: 'fem' },
  'masc-1': { skin: '#FDDBB4', hair: '#E8B84B', gender: 'masc' },
  'masc-2': { skin: '#F5C89A', hair: '#8B5E3C', gender: 'masc' },
  'masc-3': { skin: '#E8A87C', hair: '#5C3A1E', gender: 'masc' },
  'masc-4': { skin: '#C47A4A', hair: '#1A0E06', gender: 'masc' },
  'masc-5': { skin: '#8B4513', hair: '#0D0604', gender: 'masc' },
  'masc-6': { skin: '#F0D5A8', hair: '#151010', gender: 'masc' }
};

function _buildSVG(key) {
  const d = AVATAR_DATA[key];
  if (!d) return '';
  const { skin, hair, gender } = d;
  const darker = _darken(skin, 0.15);
  const mouth = _darken(skin, 0.45);

  // Cabelo: feminino desce pelos lados, masculino só no topo
  const hairPath = gender === 'fem'
    ? `<path d="M50 12 C28 12 16 28 16 50 C16 60 18 70 22 78 L24 70 C22 62 22 54 24 48 C28 36 36 28 50 28 C64 28 72 36 76 48 C78 54 78 62 76 70 L78 78 C82 70 84 60 84 50 C84 28 72 12 50 12 Z" fill="${hair}"/>
       <path d="M22 78 C22 84 24 90 28 94 L34 84 C30 82 26 80 22 78 Z" fill="${hair}"/>
       <path d="M78 78 C78 84 76 90 72 94 L66 84 C70 82 74 80 78 78 Z" fill="${hair}"/>`
    : `<path d="M22 42 C22 28 32 18 50 18 C68 18 78 28 78 42 L78 46 C76 38 70 32 62 32 L38 32 C30 32 24 38 22 46 Z" fill="${hair}"/>`;

  // Cílios (só feminino)
  const eyelashes = gender === 'fem'
    ? `<line x1="33" y1="44" x2="32" y2="42" stroke="#1a1a1a" stroke-width="1" stroke-linecap="round"/>
       <line x1="36" y1="43" x2="35.5" y2="41" stroke="#1a1a1a" stroke-width="1" stroke-linecap="round"/>
       <line x1="64" y1="44" x2="65" y2="42" stroke="#1a1a1a" stroke-width="1" stroke-linecap="round"/>
       <line x1="67" y1="43" x2="67.5" y2="41" stroke="#1a1a1a" stroke-width="1" stroke-linecap="round"/>`
    : '';

  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="50" cy="50" r="50" fill="${skin}"/>
    <circle cx="50" cy="52" r="36" fill="${skin}"/>
    ${hairPath}
    <path d="M30 42 Q36 39 42 42" stroke="${hair}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M58 42 Q64 39 70 42" stroke="${hair}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="38" cy="48" rx="2.5" ry="3" fill="#1a1a1a"/>
    <ellipse cx="62" cy="48" rx="2.5" ry="3" fill="#1a1a1a"/>
    <circle cx="38.5" cy="47" r="0.8" fill="#fff"/>
    <circle cx="62.5" cy="47" r="0.8" fill="#fff"/>
    ${eyelashes}
    <path d="M50 52 Q48 58 50 60 Q52 58 50 52" fill="${darker}" opacity="0.5"/>
    <path d="M42 67 Q50 72 58 67" stroke="${mouth}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="34" cy="58" rx="3" ry="2" fill="${darker}" opacity="0.25"/>
    <ellipse cx="66" cy="58" rx="3" ry="2" fill="${darker}" opacity="0.25"/>
  </svg>`;
}

function _darken(hex, factor) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return hex;
  const r = Math.max(0, Math.round(parseInt(m[1], 16) * (1 - factor)));
  const g = Math.max(0, Math.round(parseInt(m[2], 16) * (1 - factor)));
  const b = Math.max(0, Math.round(parseInt(m[3], 16) * (1 - factor)));
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// Pré-computa os 12 SVGs uma vez (evita rebuild a cada render)
const AVATARS = Object.keys(AVATAR_DATA).reduce((acc, key) => {
  acc[key] = _buildSVG(key);
  return acc;
}, {});

function getAvatarSVG(key) {
  return AVATARS[key] || AVATARS['masc-1'];
}

function getDefaultAvatar() {
  return 'masc-1';
}

function getAvatarKeys(gender) {
  return Object.keys(AVATAR_DATA).filter(k => AVATAR_DATA[k].gender === gender);
}

// Exposto globalmente — pattern padrão do projeto (HTML puro, sem modules)
window.Avatars = { get: getAvatarSVG, getDefault: getDefaultAvatar, getKeys: getAvatarKeys, data: AVATAR_DATA };
