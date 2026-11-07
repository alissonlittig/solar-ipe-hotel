// All content is fictional. Prices in Brazilian reais (BRL) per night, breakfast included.
export const rooms = [
  {
    slug: 'jabuticaba',
    name: 'Jabuticaba',
    kind: 'Garden room',
    rate: 690,
    size: 28,
    guests: 2,
    bed: 'Queen bed',
    view: 'Orchard terrace',
    blurb: 'A calm, light-filled room opening onto the fruit orchard. Linen drapes, a deep tub and a reading nook.',
    long: 'Jabuticaba is where most first-time guests start. The terrace steps straight into the orchard, and in October the trunks are covered in fruit. Inside: lime-washed walls, a hand-built oak bed, a freestanding tub by the window and a small desk if you must.',
    features: ['Private terrace', 'Freestanding tub', 'Rain shower', 'Espresso machine', 'Underfloor heating', 'Blackout linen drapes'],
    palette: ['#e9dcc3', '#c9b48a', '#6f8a5a', '#2f4a36', '#b8683a']
  },
  {
    slug: 'ipe-amarelo',
    name: 'Ipê Amarelo',
    kind: 'Suite',
    rate: 980,
    size: 42,
    guests: 3,
    bed: 'King bed + daybed',
    view: 'Ipê grove',
    blurb: 'Our namesake suite, framed by the golden ipê trees that bloom every August. Separate lounge and a wood-burning stove.',
    long: 'The suite sits at the top of the main house. Two walls of glass face the ipê grove; in late winter the whole room turns yellow. There is a wood-burning stove, a lounge with a daybed for a third guest, and a bathroom clad in local soapstone.',
    features: ['Wood-burning stove', 'Separate lounge', 'Soapstone bathroom', 'Panoramic glazing', 'Minibar with local produce', 'Turn-down service'],
    palette: ['#f3e3b3', '#e0b43c', '#8d6a2a', '#3b2f1f', '#c4562f']
  },
  {
    slug: 'mirante',
    name: 'Mirante',
    kind: 'Loft',
    rate: 1150,
    size: 48,
    guests: 2,
    bed: 'King bed',
    view: 'Valley and sunrise',
    blurb: 'A double-height loft on the ridge. Wake up above the morning fog with the whole valley at your feet.',
    long: 'Built into the old coffee drying deck, Mirante has a mezzanine bed, a floor-to-ceiling window and a private hot tub on the deck. It is the room we book out first for sunrise, and the one we recommend for anniversaries.',
    features: ['Private hot tub', 'Mezzanine bed', 'Sunrise deck', 'Record player and library', 'Double-height windows', 'In-room breakfast on request'],
    palette: ['#f2d3c0', '#d98c6b', '#7d5a73', '#2c2c44', '#f1b24a']
  },
  {
    slug: 'araucaria',
    name: 'Araucária',
    kind: 'Cottage',
    rate: 1380,
    size: 64,
    guests: 4,
    bed: 'King bed + twin beds',
    view: 'Private garden and stream',
    blurb: 'A stand-alone stone cottage by the stream with its own garden, kitchenette and fireplace. Ideal for families.',
    long: 'Araucária is a restored stone cottage fifty metres from the main house. It has a bedroom, a loft with two twin beds, a kitchenette stocked with pantry basics, a fireplace and a fenced garden that runs down to the stream.',
    features: ['Stand-alone cottage', 'Fireplace', 'Kitchenette', 'Fenced garden', 'Stream access', 'Pets welcome on request'],
    palette: ['#dfe3d2', '#a8b58a', '#5a7a63', '#243b36', '#a9673f']
  },
  {
    slug: 'casarao',
    name: 'Casarão Master',
    kind: 'Master suite',
    rate: 1690,
    size: 78,
    guests: 3,
    bed: 'King bed',
    view: 'Main courtyard and fountain',
    blurb: 'The former owner’s quarters: high ceilings, original hydraulic tiles and a bathroom you will not want to leave.',
    long: 'The Casarão Master occupies the whole first floor of the original 1912 farmhouse. Hydraulic-tile floors were restored piece by piece, the ceilings are four metres high and the dressing room has a view of the courtyard fountain.',
    features: ['Original 1912 tiles', 'Dressing room', 'Double vanity and bathtub', 'Courtyard views', 'Private butler call', 'Late checkout, always'],
    palette: ['#ecd9c6', '#b57a52', '#6a3b2e', '#2a1c19', '#d9b36a']
  }
];

export const getRoom = (slug) => rooms.find((r) => r.slug === slug);

export const experiences = [
  { title: 'Coffee at origin', text: 'Walk the terraces at 7 a.m. with Seu Renato, pick, roast and cup your own lot.', tag: 'Daily · 2 h' },
  { title: 'Wood-fired supper', text: 'Four courses from the garden and neighbouring farms, served at one long table.', tag: 'Wed – Sun' },
  { title: 'Waterfall trail', text: 'A guided 5 km walk through Atlantic forest to a natural pool. Picnic basket included.', tag: 'Daily · 4 h' },
  { title: 'Ceramics studio', text: 'Throw a bowl with our resident potter and take it home after the firing.', tag: 'Sat · 3 h' }
];

export const reviews = [
  { quote: 'Breakfast alone was worth the drive. Everything else was a bonus.', who: 'Helena M.', trip: 'Weekend for two' },
  { quote: 'The quietest night’s sleep I have had in years. We extended twice.', who: 'Daniel R.', trip: 'Anniversary' },
  { quote: 'Kids fed the chickens, we read by the fire. Perfect.', who: 'Camila & Tiago', trip: 'Family stay' }
];
