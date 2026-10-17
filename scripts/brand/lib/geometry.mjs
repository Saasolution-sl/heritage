// Small path-building helpers shared by the marks, emblems and bands.
export const r = (n) => Math.round(n * 100) / 100;

export const poly = (pts) => `M${pts.map(([x, y]) => `${r(x)} ${r(y)}`).join('L')}Z`;

export const circle = (cx, cy, rad) =>
  `M${r(cx - rad)} ${r(cy)}a${r(rad)} ${r(rad)} 0 1 0 ${r(rad * 2)} 0a${r(rad)} ${r(rad)} 0 1 0 ${r(-rad * 2)} 0Z`;

/** Annulus as one even-odd path (outer and inner circle). */
export const ring = (cx, cy, outer, inner) => circle(cx, cy, outer) + circle(cx, cy, inner);

export const rect = (x, y, w, h) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);

export const lozenge = (cx, cy, w, h) => poly([[cx, cy - h / 2], [cx + w / 2, cy], [cx, cy + h / 2], [cx - w / 2, cy]]);

export const rot = ([x, y], a, [cx, cy] = [0, 0]) => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
};

/** Almond leaf from base point, pointing at angle a (radians). */
export function leaf([x, y], a, len, width) {
  const tip = [x + Math.cos(a) * len, y + Math.sin(a) * len];
  const mid = [x + Math.cos(a) * len * 0.45, y + Math.sin(a) * len * 0.45];
  const nx = -Math.sin(a) * width;
  const ny = Math.cos(a) * width;
  return `M${r(x)} ${r(y)}Q${r(mid[0] + nx)} ${r(mid[1] + ny)} ${r(tip[0])} ${r(tip[1])}Q${r(mid[0] - nx)} ${r(mid[1] - ny)} ${r(x)} ${r(y)}Z`;
}

/** Filled arc band (for stems and borders): radius rad, thickness t, from a0 to a1. */
export function arcBand(cx, cy, rad, t, a0, a1) {
  const ro = rad + t / 2;
  const ri = rad - t / 2;
  const p = (rr, a) => [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  const [x0, y0] = p(ro, a0);
  const [x1, y1] = p(ro, a1);
  const [x2, y2] = p(ri, a1);
  const [x3, y3] = p(ri, a0);
  return `M${r(x0)} ${r(y0)}A${r(ro)} ${r(ro)} 0 ${large} ${sweep} ${r(x1)} ${r(y1)}L${r(x2)} ${r(y2)}A${r(ri)} ${r(ri)} 0 ${large} ${1 - sweep} ${r(x3)} ${r(y3)}Z`;
}

/** One laurel branch following a circle from a0 to a1 (radians). */
export function laurelBranch({ cx, cy, radius, a0, a1, leaves = 9, len = 22, width = 6, stem = 2.4 }) {
  let d = arcBand(cx, cy, radius, stem, a0, a1);
  const dir = a1 > a0 ? 1 : -1;
  for (let i = 0; i < leaves; i++) {
    const t = (i + 0.6) / leaves;
    const a = a0 + (a1 - a0) * t;
    const base = [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];
    const tangent = a + (dir * Math.PI) / 2;
    const size = len * (0.72 + 0.28 * Math.sin(Math.PI * Math.min(1, t * 1.15)));
    // Leaves alternate outward and inward, swept along the direction of growth.
    d += leaf(base, tangent - 0.62, size, width * (size / len));
    d += leaf(base, tangent + 0.62, size, width * (size / len));
  }
  // Terminal leaf at the tip.
  const tip = [cx + radius * Math.cos(a1), cy + radius * Math.sin(a1)];
  d += leaf(tip, a1 + (dir * Math.PI) / 2, len * 0.8, width * 0.8);
  return d;
}

/** Two mirrored branches meeting at the bottom, open at the top. */
export function laurelWreath({ cx, cy, radius, gap = 0.5, ...rest }) {
  const bottom = Math.PI / 2;
  const left = laurelBranch({ cx, cy, radius, a0: bottom + 0.12, a1: Math.PI * 1.5 - gap, ...rest });
  const right = laurelBranch({ cx, cy, radius, a0: bottom - 0.12, a1: -Math.PI / 2 + gap, ...rest });
  return left + right;
}
