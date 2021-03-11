import commonStyle from './common.js';

export default {
  moldName: "default-en",
  fonts: {
    en_name: {
      name: "en_name.ttf",
      type: "relative",
    },
    en: {
      name: "en.ttf",
      type: "relative",
    },
    number: {
      name: "number.ttf",
      type: "relative",
    },
    link: {
      name: "link.ttf",
      type: "relative",
    },
    race: {
      name: "race.ttf",
      type: "relative",
    },
    password: {
      name: "password.ttf",
      type: "relative",
    },
  },
  style: Object.assign(JSON.parse(commonStyle), {
    fontMap: {
      name: "en_name",
      desc: "en",
      race: "race",
      attack: "number",
      link: "link",
      password: "password",
      type: "race",
      lbNum: "number",
      copyright: "password",
    },
    name: {
      font: "name",
      fontSize: 65,
      maxWidth: 610,
      position: [65, 100],
    },
    race: {
      font: "race",
      fontSize: 26,
      position: [64, 915],
      maxWidth: 610,
    },
    type: {
      font: "type",
      fontSize: 42,
      position: [728, 183],
      icon: [669, 147],
      iconSize: [46, 46],
    },
  }),
  translate: {
    attribute: {
      light: "light",
      dark: "dark",
      wind: "wind",
      water: "water",
      fire: "fire",
      earth: "earth",
      divine: "divine",
    },
    type: {
      tc: "normal",
      xg: "effect",
      ys: "ritual",
      rh: "fusion",
      tk: "token",
      tt: "synchro",
      cl: "xyz",
      lb: "pendulum",
      lj: "link",
      ec: "gemini",
      tz: "tuner",
      tm: "union",
      kt: "toon",
      lh: "spirit",
      fz: "flip effect",
      ts: "special summon",
      zb: "equip",
      sg: "quick-play",
      cd: "field",
      fj: "counter",
      yx: "continuous",
    },
    raceList: [
      "Dragon",
      "Warrior",
      "Fiend",
      "Spellcaster",
      "Fairy",
      "Zombie",
      "Rock",
      "Plant",
      "Insect",
      "Aqua",
      "Pyro",
      "Thunder",
      "Fish",
      "Sea Serpent",
      "Wyrm",
      "Dinosaur",
      "Reptile",
      "Machine",
      "Beast",
      "Winged Beast",
      "Beast-Warrior",
      "Psychic",
      "Cyberse",
      "Divine-Beast",
      "Divine",
    ],
    spell: "Spell Card",
    tragic: "Trap Card",
    brackets: ["[", "]"],
  },
};