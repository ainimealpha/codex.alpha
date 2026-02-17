// data.js — edit this file only to add categories/items
const PLACEHOLDER = "https://via.placeholder.com/1200x800/ffe9a8/333333?text=No+Image";

const DATA = {
  CHARACTER: {
    title: "Character",
    items: [
      {
        id: 1,
        name: "Ice Queen",
        desc: "Frozen ruler of the north, graceful yet cold.",
        tags: ["ice", "legend"],
        images: {
          main: "https://via.placeholder.com/1200x800/9ad0ff/04345b?text=Ice+Queen+Main",
          extras: [
            "https://via.placeholder.com/400x300/9ad0ff/04345b?text=Ice+Queen+1",
            "https://via.placeholder.com/400x300/cfe9ff/04345b?text=Ice+Queen+2",
            "https://via.placeholder.com/400x300/e6f7ff/04345b?text=Ice+Queen+3"
          ]
        }
      },
      {
        id: 2,
        name: "Shadow Blade",
        desc: "Stealth assassin from the eastern isles.",
        tags: ["stealth","assassin"],
        images: {
          main: "https://via.placeholder.com/1200x800/222831/ffffff?text=Shadow+Blade+Main",
          extras: [
            "https://via.placeholder.com/400x300/2b2f3a/ffffff?text=Shadow+1",
            "https://via.placeholder.com/400x300/343a40/ffffff?text=Shadow+2",
            "https://via.placeholder.com/400x300/495057/ffffff?text=Shadow+3"
          ]
        }
      },
      {
        id: 3,
        name: "Fire Knight",
        desc: "Blazing frontline tank, fearless and proud.",
        tags: ["fire","tank"],
        images: {
          main: "https://via.placeholder.com/1200x800/ff8a65/4e2a1f?text=Fire+Knight+Main",
          extras: [
            "https://via.placeholder.com/400x300/ff8a65/4e2a1f?text=Fire+1",
            "https://via.placeholder.com/400x300/ffccbc/4e2a1f?text=Fire+2",
            "https://via.placeholder.com/400x300/ffe0b2/4e2a1f?text=Fire+3"
          ]
        }
      },
      {
        id: 4,
        name: "Wind Archer",
        desc: "Swift sniper who dances on the breeze.",
        tags: ["wind","ranged"],
        images: {
          main: "https://via.placeholder.com/1200x800/b2f5ea/013220?text=Wind+Archer+Main",
          extras: [
            "https://via.placeholder.com/400x300/b2f5ea/013220?text=Wind+1",
            "https://via.placeholder.com/400x300/ccfff5/013220?text=Wind+2",
            "https://via.placeholder.com/400x300/e6fff8/013220?text=Wind+3"
          ]
        }
      },
      {
        id: 5,
        name: "Holy Priest",
        desc: "Support healer, blessed with sacred light.",
        tags: ["support","holy"],
        images: {
          main: "https://via.placeholder.com/1200x800/fff8e1/6b4200?text=Holy+Priest+Main",
          extras: [
            "https://via.placeholder.com/400x300/fff8e1/6b4200?text=Holy+1",
            "https://via.placeholder.com/400x300/fff3cc/6b4200?text=Holy+2",
            "https://via.placeholder.com/400x300/fff1b5/6b4200?text=Holy+3"
          ]
        }
      }
    ]
  },

  MONSTER: {
    title: "Monster",
    items: [
      {
        id: 6,
        name: "Dark Dragon",
        desc: "Ancient beast of shadow and fury.",
        tags: ["dragon","boss"],
        images: {
          main: "https://via.placeholder.com/1200x800/6a1b9a/ffffff?text=Dark+Dragon+Main",
          extras: [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER]
        }
      },
      { id:7, name:"Goblin King", desc:"Cave ruler.", tags:["goblin"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]}},
      { id:8, name:"Ice Golem", desc:"Frozen tank.", tags:["ice"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]}},
      { id:9, name:"Fire Demon", desc:"Infernal terror.", tags:["fire"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]}},
      { id:10, name:"Void Reaper", desc:"Soul hunter.", tags:["void"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]}}
    ]
  },

  PET: {
    title: "Pet",
    items: [
      { id:11, name:"Mini Dragon", desc:"Tiny fire buddy.", tags:["cute"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]}},
      { id:12, name:"Snow Fox", desc:"Cute frost pet.", tags:["cute","ice"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]}},
      { id:13, name:"Thunder Cat", desc:"Electric kitty.", tags:["electric"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]}},
      { id:14, name:"Spirit Wolf", desc:"Ghost companion.", tags:["spirit"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]}},
      { id:15, name:"Fairy Sprite", desc:"Magic helper.", tags:["magic"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]} }
    ]
  },

  AREA: {
    title: "Area",
    items: [
      { id:16, name:"Frozen Kingdom", desc:"Land of ice.", tags:["ice","zone"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]}},
      { id:17, name:"Dark Forest", desc:"Mystic woods.", tags:["forest"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]}},
      { id:18, name:"Sky City", desc:"Floating realm.", tags:["sky"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]}},
      { id:19, name:"Lava Valley", desc:"Burning land.", tags:["lava"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]}},
      { id:20, name:"Sacred Temple", desc:"Ancient shrine.", tags:["holy"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]} }
    ]
  },

  MAGIC: {
    title: "Magic",
    items: [
      { id:21, name:"Ice Meteor", desc:"Frozen blast.", tags:["ice","aoe"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]}},
      { id:22, name:"Dark Flame", desc:"Cursed fire.", tags:["fire","dot"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]}},
      { id:23, name:"Wind Slash", desc:"Air blade.", tags:["wind"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]}},
      { id:24, name:"Holy Light", desc:"Sacred beam.", tags:["holy","single"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]}},
      { id:25, name:"Thunder Storm", desc:"Lightning rain.", tags:["electric","aoe"], images:{ main:PLACEHOLDER, extras:[PLACEHOLDER,PLACEHOLDER,PLACEHOLDER]} }
    ]
  }
};
