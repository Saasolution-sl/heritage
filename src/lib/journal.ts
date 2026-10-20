// Journal articles. Every article is marked as a draft until editorial and
// legal review; factual claims carry their sources. Add an article by adding
// an object here — the index, article page, sitemap and search pick it up.

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'note'; text: string };

export type Article = {
  slug: string;
  title: string;
  category: 'Craftsmanship' | 'Vitola education' | 'Tobacco origins' | 'Collection inspiration' | 'Storage and care' | 'Announcements';
  excerpt: string;
  status: 'draft' | 'published';
  /** ISO date of the last editorial change. */
  updated: string;
  body: Block[];
  sources: { label: string; href: string }[];
};

export const articles: Article[] = [
  {
    slug: 'introducing-heritage-cigars',
    title: 'Introducing Heritage Cigars',
    category: 'Announcements',
    excerpt: 'Twelve collections, one house, supplying the trade: what Heritage Cigars is and how the range will develop.',
    status: 'draft',
    updated: '2026-10-17',
    body: [
      { type: 'p', text: 'Heritage Cigars is a new cigar house supplying the tobacco trade from Ceuta and Paraguay. Its range is organised as twelve collections, each taking its character from one of history’s great empires, dynasties or civilisations — from imperial Rome to the Saadian court of Marrakesh.' },
      { type: 'p', text: 'Every collection has its name, band, emblem, box and vitola. The blends are built from tobaccos grown in several Latin American countries, and each is made with the partner manufacturer best suited to it. We will name the countries and manufacturer behind each blend once it is final.' },
      { type: 'h2', text: 'What comes next' },
      { type: 'list', items: ['Finalising each blend with its manufacturer.', 'Confirming every vitola, strength and flavour profile against finished samples.', 'Opening trade accounts for importers, distributors, retailers and lounges.'] },
      { type: 'note', text: 'This announcement is a draft for editorial review.' },
    ],
    sources: [],
  },
  {
    slug: 'understanding-vitolas',
    title: 'Understanding vitolas: length, ring gauge and shape',
    category: 'Vitola education',
    excerpt: 'Why a robusto smokes differently from a lancero, and how to read a cigar’s dimensions.',
    status: 'draft',
    updated: '2026-10-17',
    body: [
      { type: 'p', text: '“Vitola” is the Spanish trade word for a cigar’s format: its length, its thickness and its shape. Two cigars rolled from the same blend can taste noticeably different in different vitolas, because the format changes how much wrapper is burned relative to filler, how hot the smoke runs and how long the cigar lasts.' },
      { type: 'h2', text: 'Ring gauge' },
      { type: 'p', text: 'Thickness is measured as a ring gauge, in sixty-fourths of an inch. A 64 ring gauge cigar is one inch across; a 52 ring gauge cigar is 52/64 of an inch, about 20.6 mm. Slim formats such as the lancero (around 38–40) give the wrapper a larger share of the smoke; wide formats such as the gordo (60 and above) smoke cooler and are often described as milder in character.' },
      { type: 'h2', text: 'Parejos, figurados and box-pressed cigars' },
      { type: 'p', text: 'Most cigars are parejos: straight-sided, with a rounded head and an open foot. Figurados are shaped. A torpedo or pyramide tapers to a point at the head; a belicoso has a shorter taper; a perfecto tapers at both ends; a salomón is a long figurado with a tapered head and a bulb above a closed, pointed foot. Shaped cigars are harder to roll consistently, which is one reason they are less common.' },
      { type: 'p', text: 'A box-pressed cigar is pressed while it rests, giving it a softly squared cross-section instead of a round one. It sits flat, packs tightly in the box and is often said to burn a little more evenly because the filler is compacted.' },
      { type: 'h2', text: 'The Heritage Cigars formats' },
      { type: 'p', text: 'Each Empire collection has its own vitola, from the 127 mm Caesar Robusto and box-pressed Saadian Robusto to the 191 mm Napoleon Double Corona, Cyrus Lancero and Imperator Salomón. These formats are proposals until each blend is confirmed with its manufacturer.' },
    ],
    sources: [
      { label: 'Encyclopaedia Britannica — Cigar', href: 'https://www.britannica.com/topic/cigar' },
    ],
  },
  {
    slug: 'wrapper-binder-filler',
    title: 'Wrapper, binder and filler: the anatomy of a cigar',
    category: 'Tobacco origins',
    excerpt: 'The three layers of a premium cigar, and what each one contributes.',
    status: 'draft',
    updated: '2026-10-17',
    body: [
      { type: 'p', text: 'A cigar is built from three components. At its core is the filler, the bulk of the tobacco. Around it, a binder leaf holds the filler together. Outside, a wrapper leaf is wound in a spiral to give the cigar its finish.' },
      { type: 'h2', text: 'Wrapper' },
      { type: 'p', text: 'The wrapper is the most visible and most expensive leaf in the cigar. It is selected for appearance, elasticity, texture and burn, and it contributes noticeably to aroma and flavour.' },
      { type: 'h2', text: 'Binder' },
      { type: 'p', text: 'The binder is chosen for strength: it must hold the filler together and keep the cigar’s shape while it burns.' },
      { type: 'h2', text: 'Filler' },
      { type: 'p', text: 'Premium cigars generally use long filler — whole leaves running the length of the cigar — blended from different tobaccos and different positions on the plant to balance strength, flavour and burn.' },
      { type: 'note', text: 'Heritage Cigars blends tobaccos from several Latin American countries. The wrapper, binder and filler of each blend will be published once the blend is final.' },
    ],
    sources: [
      { label: 'Encyclopaedia Britannica — Cigar', href: 'https://www.britannica.com/topic/cigar' },
      { label: 'National Academies of Sciences, Engineering, and Medicine (2022), Premium Cigars: Patterns of Use, Marketing, and Health Effects', href: 'https://nap.nationalacademies.org/read/26421/chapter/4' },
    ],
  },
  {
    slug: 'how-a-premium-cigar-is-made',
    title: 'How a premium cigar is made',
    category: 'Craftsmanship',
    excerpt: 'From cured leaf to finished cigar: an overview of the stages most premium cigars pass through.',
    status: 'draft',
    updated: '2026-10-17',
    body: [
      { type: 'p', text: 'Premium cigar production is usually described in a sequence of stages. The details differ from one factory to another, and the description below is a general overview, not a description of Heritage Cigars’ own production, which has not yet begun.' },
      { type: 'list', items: ['Growing and harvesting: leaves are picked from the plant in stages, as different positions mature.', 'Curing: harvested leaves are dried, typically in curing barns, as they change colour.', 'Fermentation: cured leaves are stacked and allowed to ferment, which develops flavour and reduces harshness.', 'Ageing and sorting: leaves are rested and graded by size, colour and quality.', 'Blending and rolling: filler leaves are combined, bunched with a binder and finished with a wrapper.', 'Resting and quality control: finished cigars are rested before banding, boxing and inspection.'] },
      { type: 'note', text: 'We will describe Heritage Cigars’ own process only after it is established and verified with our manufacturer.' },
    ],
    sources: [
      { label: 'Encyclopaedia Britannica — Cigar', href: 'https://www.britannica.com/topic/cigar' },
    ],
  },
  {
    slug: 'storing-cigars',
    title: 'Storing cigars: humidity and temperature',
    category: 'Storage and care',
    excerpt: 'The conditions most often recommended for keeping cigars in good condition.',
    status: 'draft',
    updated: '2026-10-17',
    body: [
      { type: 'p', text: 'Cigars are made from leaf that keeps exchanging moisture with the air around it, so they are normally kept in a humidor or another humidity-controlled container.' },
      { type: 'h2', text: 'Commonly recommended conditions' },
      { type: 'list', items: ['Relative humidity of roughly 65–70%.', 'Temperature of roughly 18–21 °C (65–70 °F).', 'A hygrometer to check the humidity rather than relying on estimates.', 'Stable conditions: steady humidity and temperature matter as much as the exact figures.'] },
      { type: 'p', text: 'Too dry, and wrappers can crack and burn quickly. Too damp, and cigars can become soft, burn poorly or develop mould. Warmer conditions are also associated with tobacco beetles, which is one reason storage guides advise against temperatures much above 21 °C.' },
      { type: 'note', text: 'These are general industry recommendations. Always follow the instructions supplied with your humidor and humidification device.' },
    ],
    sources: [
      { label: 'Art Brown — Cigar humidity and temperature', href: 'https://www.artbrown.com/blogs/common-questions/cigar-humidity-temperature' },
      { label: 'Mike’s Cigars — How to store cigars properly at home', href: 'https://mikescigars.com/blog/how-to-store-cigars-properly-at-home-the-complete-guide/' },
    ],
  },
  {
    slug: 'why-twelve-empires',
    title: 'Why twelve empires',
    category: 'Collection inspiration',
    excerpt: 'How the twelve collections were chosen, and how we approach history, symbols and respect.',
    status: 'draft',
    updated: '2026-10-17',
    body: [
      { type: 'p', text: 'The twelve collections span more than four thousand years and five continents: Egypt and Rome, Persia and the steppe, the Andes, the Ottoman and Mughal courts, Carolingian Europe, Russia, Napoleonic France and the Saadian dynasty of Morocco. The twelfth, Imperator, is the house’s own signature.' },
      { type: 'h2', text: 'Inspiration, not provenance' },
      { type: 'p', text: 'The collections are named in tribute. They do not claim any connection to the places, peoples or rulers they evoke; the tobacco in every collection comes from Latin America, and we will name the countries behind each blend once it is final.' },
      { type: 'h2', text: 'A note on symbols' },
      { type: 'p', text: 'Each emblem was drawn for Heritage Cigars from architectural and decorative motifs: a laurel, a tulip, a zellige star, a stepped terrace.' },
    ],
    sources: [],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
