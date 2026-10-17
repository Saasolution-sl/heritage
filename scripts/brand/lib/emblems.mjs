// Twelve original collection emblems. Each draws inside a 200 x 200 box centred
// on (100, 100), in a single fill colour inherited from the parent group, with
// strokes no thinner than ~3 units so they hold up as foil at band size.
import { poly, circle, ring, lozenge, rot, leaf, laurelWreath, rect, r } from './geometry.mjs';
import { textPath } from './font.mjs';
import { crownMarkup, monogram } from './marks.mjs';

const P = (d, evenodd = false) => `<path${evenodd ? ' fill-rule="evenodd"' : ''} d="${d}"/>`;

function caesar() {
  const wreath = laurelWreath({ cx: 100, cy: 100, radius: 70, gap: 0.5, leaves: 8, len: 22, width: 6.5, stem: 3 });
  const spqr = textPath('SPQR', { face: 'displayBold', size: 40, x: 100, y: 114, tracking: 0.06 });
  return P(wreath) + P(spqr) + P(rect(66, 122, 68, 3)) + P(rect(66, 76, 68, 3));
}

function pharaoh() {
  // Stepped pyramid with courses cut out, beneath a ringed disc.
  const apex = 80;
  const base = 156;
  const disc = ring(100, 50, 22, 16) + circle(100, 50, 10);
  const pyramid = poly([[34, base], [100, apex], [166, base]]);
  let courses = '';
  for (let i = 1; i <= 3; i++) {
    const y = apex + ((base - apex) * i) / 4;
    const half = ((y - apex) * 66) / (base - apex);
    courses += rect(100 - half + 2, y - 1.8, (half - 2) * 2, 3.6);
  }
  return P(disc, true) + P(pyramid + courses, true) + P(rect(26, 162, 148, 4));
}

function tsar() {
  // Domed crown: two half-domes with a central arch, rim and jewelled band.
  const domes =
    'M46 128C40 92 58 62 98 56L98 128Z' +
    'M154 128C160 92 142 62 102 56L102 128Z';
  const arch = poly([[94, 128], [94, 56], [100, 48], [106, 56], [106, 128]]);
  const finial = circle(100, 36, 9) + rect(97, 42, 6, 8);
  const band = poly([[40, 132], [160, 132], [156, 152], [44, 152]]);
  const jewels = lozenge(100, 142, 14, 12) + circle(70, 142, 4) + circle(130, 142, 4) + circle(52, 142, 2.6) + circle(148, 142, 2.6);
  const pearls = [70, 80, 90].map((y) => circle(76, y, 3) + circle(124, y, 3)).join('');
  // Pearls read as cut-outs in the solid domes.
  return P(domes + pearls, true) + P(arch) + P(finial) + P(band + jewels, true);
}

function suleiman() {
  // Tulip: three petals, a long stem and two sweeping leaves.
  const centre = 'M100 40C114 58 116 84 100 106C84 84 86 58 100 40Z';
  const left = 'M98 108C72 104 60 82 62 52C76 62 90 76 98 108Z';
  const right = 'M102 108C128 104 140 82 138 52C124 62 110 76 102 108Z';
  const stem = rect(97.5, 104, 5, 64);
  const leafL = 'M98 164C78 156 64 138 60 116C80 124 94 140 98 164Z';
  const leafR = 'M102 150C118 144 130 130 134 112C118 118 106 130 102 150Z';
  return P(centre + left + right + stem + leafL + leafR) + P(rect(70, 168, 60, 3.5));
}

function akbar() {
  // Cusped (multifoil) arch with an inner arch and a lattice of lozenges.
  const outer =
    'M44 168L44 92C44 84 50 80 54 76C52 66 58 58 66 56C68 46 78 40 86 42C90 34 96 30 100 26' +
    'C104 30 110 34 114 42C122 40 132 46 134 56C142 58 148 66 146 76C150 80 156 84 156 92L156 168Z';
  const inner =
    'M58 168L58 96C58 90 63 86 66 84C66 76 71 70 78 69C80 61 87 56 93 57C96 51 98 48 100 44' +
    'C102 48 104 51 107 57C113 56 120 61 122 69C129 70 134 76 134 84C137 86 142 90 142 96L142 168Z';
  let lattice = '';
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const x = 73 + col * 18 + (row % 2 ? 9 : 0);
      const y = 102 + row * 16;
      if (x < 136) lattice += lozenge(x, y, 12, 12);
    }
  }
  return P(outer + inner, true) + P(lattice) + P(rect(36, 168, 128, 5));
}

function napoleon() {
  // The imperial bee, seen from above.
  const head = circle(100, 50, 9);
  const thorax = 'M100 60C112 60 118 70 118 80C118 90 112 96 100 96C88 96 82 90 82 80C82 70 88 60 100 60Z';
  const abdomen = 'M100 98C116 98 122 116 120 132C118 150 108 164 100 172C92 164 82 150 80 132C78 116 84 98 100 98Z';
  const stripes = [114, 128, 142].map((y) => rect(78, y, 44, 4)).join('');
  const wingL = 'M84 74C64 52 34 52 30 70C26 88 52 98 82 88Z' + 'M82 92C60 96 40 112 46 126C52 138 72 126 84 102Z';
  const wingR = 'M116 74C136 52 166 52 170 70C174 88 148 98 118 88Z' + 'M118 92C140 96 160 112 154 126C148 138 128 126 116 102Z';
  const antennae = 'M96 42C92 32 86 28 80 28L80 31C85 31 90 35 93 43Z' + 'M104 42C108 32 114 28 120 28L120 31C115 31 110 35 107 43Z';
  return P(head + thorax + antennae) + P(abdomen + stripes, true) + P(wingL + wingR);
}

function cyrus() {
  // Twelve-petal rosette, one petal per collection.
  let petals = '';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    petals += leaf(rot([100 + 22, 100], a, [100, 100]), a, 52, 13);
  }
  return P(petals) + P(ring(100, 100, 18, 13) + circle(100, 100, 7), true) + P(ring(100, 100, 84, 80), true);
}

function genghis() {
  // A drawn composite (recurve) bow with arrow, set vertically.
  const limb =
    'M70 30C66 26 60 26 58 32C64 34 68 40 70 50C78 76 78 124 70 150C68 160 64 166 58 168C60 174 66 174 70 170C86 150 92 50 70 30Z';
  const string = 'M59 30L133 100L59 170L63 173L140 100L63 27Z';
  const shaft = rect(52, 98, 116, 4);
  const head = poly([[168, 92], [184, 100], [168, 108]]);
  const fletch = poly([[52, 98], [40, 88], [48, 98]]) + poly([[52, 102], [40, 112], [48, 102]]);
  return P(limb) + P(string) + P(shaft + head + fletch);
}

function charlemagne() {
  // Original lozenge monogram in the spirit of Carolingian signatures.
  const frame = lozenge(100, 100, 150, 150) + lozenge(100, 100, 136, 136);
  const centre = lozenge(100, 100, 34, 34) + lozenge(100, 100, 22, 22);
  const k = textPath('K', { face: 'displayBold', size: 36, x: 62, y: 112 });
  const r1 = textPath('R', { face: 'displayBold', size: 36, x: 100, y: 74 });
  const l = textPath('L', { face: 'displayBold', size: 36, x: 100, y: 152 });
  const s = textPath('S', { face: 'displayBold', size: 36, x: 138, y: 112 });
  return P(frame, true) + P(centre, true) + P(k + r1 + l + s);
}

function saadian({ ground }) {
  // Eight-point zellige star: two interlaced squares, an inner rosette and a ring.
  const sq = (s, a) => poly([[-s, -s], [s, -s], [s, s], [-s, s]].map((p) => rot(p, a)).map(([x, y]) => [x + 100, y + 100]));
  const outer = sq(56, 0);
  const outer2 = sq(56, Math.PI / 4);
  const innerStar = sq(40, 0) + sq(40, Math.PI / 4);
  let rosette = '';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    rosette += leaf(rot([112, 100], a, [100, 100]), a, 22, 7);
  }
  return (
    `<path fill-rule="nonzero" d="${outer + outer2}"/>` +
    `<path fill="${ground}" d="${innerStar}"/>` +
    P(rosette) +
    P(circle(100, 100, 9)) +
    P(ring(100, 100, 90, 86), true)
  );
}

function inca() {
  // Stepped terrace profile with a step-fret inside, on a base line.
  const steps = poly([
    [30, 160], [30, 140], [46, 140], [46, 120], [62, 120], [62, 100], [78, 100], [78, 80], [94, 80], [94, 60],
    [106, 60], [106, 80], [122, 80], [122, 100], [138, 100], [138, 120], [154, 120], [154, 140], [170, 140], [170, 160],
  ]);
  const fret = poly([[84, 150], [84, 112], [116, 112], [116, 138], [96, 138], [96, 126], [104, 126], [104, 130], [108, 130], [108, 120], [92, 120], [92, 150]]);
  const disc = circle(100, 38, 12);
  return P(steps + fret, true) + P(disc) + P(rect(22, 166, 156, 5));
}

function imperator() {
  const wreath = laurelWreath({ cx: 100, cy: 110, radius: 72, gap: 0.6, leaves: 8, len: 20, width: 6, stem: 3 });
  const m = monogram();
  return P(wreath) + `<path transform="translate(64 72) scale(.36)" d="${m.d}"/>` + crownMarkup('translate(66 14) scale(.34)');
}

export const EMBLEMS = { caesar, pharaoh, tsar, suleiman, akbar, napoleon, cyrus, genghis, charlemagne, saadian, inca, imperator };

/** Emblem markup for a collection, filled with `color`; `ground` is the field colour behind it. */
export function emblem(slug, { color = '#D6AD55', ground = '#0B0907' } = {}) {
  const draw = EMBLEMS[slug];
  if (!draw) throw new Error(`No emblem for ${slug}`);
  return `<g fill="${color}">${draw({ ground })}</g>`;
}

export { r };
