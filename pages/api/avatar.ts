// proxy for DiceBear — had to build URL as raw string bc [] gets encoded to %5B%5D
import type { NextApiRequest, NextApiResponse } from 'next';

const SAFE_EYE = 'default'; // no x/weird eyes

const PROFESSIONAL_HAIR = [
  'longHairBun',
  'longHairBob',
  'longHairNotTooLong',
  'shortHairShortFlat',
  'shortHairTheCaesar',
  'shortHairShortRound',
  'shortHairShortCurly',
];

const ROLE_COLOR: Record<string, string> = {
  Doctor: 'gray02',
  Nurse:  'blue03',
  IT:     'black',
};

const DICEBEAR = 'https://api.dicebear.com/7.x/avataaars/svg';

async function fetchSvg(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, { headers: { Accept: 'image/svg+xml' } });
    if (!r.ok) return null;
    const text = await r.text();
    // Only return if it looks like an SVG, not a JSON error
    return text.trimStart().startsWith('<') ? text : null;
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { seed = 'default', hair = '', role = '' } = req.query as Record<string, string>;
  const clothingColor = ROLE_COLOR[role] || 'blue03';
  const hairList = hair ? [hair] : PROFESSIONAL_HAIR;

  // raw string so [] stays literal
  const parts: string[] = [
    `seed=${encodeURIComponent(seed)}`,
    'mouth[]=smile',
    `eyes[]=${SAFE_EYE}`,
    ...hairList.map(h   => `top[]=${h}`),
    `clothingColor[]=${clothingColor}`,
    'facialHairProbability=0',
  ];
  const primaryUrl = `${DICEBEAR}?${parts.join('&')}`;

  // fallback in case primary fails
  const fallbackUrl = `${DICEBEAR}?seed=${encodeURIComponent(seed)}&mouth[]=smile&eyes[]=${SAFE_EYE}`;

  const svg = (await fetchSvg(primaryUrl)) ?? (await fetchSvg(fallbackUrl));

  if (svg) {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    return res.status(200).send(svg);
  }

  // last resort placeholder so broken-image never shows
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).send(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<circle cx="50" cy="50" r="50" fill="#2e1065"/>` +
    `<circle cx="50" cy="38" r="18" fill="#7c3aed"/>` +
    `<ellipse cx="50" cy="80" rx="28" ry="20" fill="#7c3aed"/>` +
    `</svg>`
  );
}
