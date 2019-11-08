const cards = [
  {
    name: 'Plus Damage',
    type: 'plusDamage',
    plusDamage: 1,
    description: 'beri boost attack sebanyak 1'
  },
  {
    name: 'Heal',
    type: 'plusHealth',
    plusHealth: 2,
    description: 'tambahan darah 2'
  },
  {
    name: 'Multi Damage',
    type: 'spellDamage',
    damage: 1,
    description: 'beri attack ke semua musuh 1'
  },
  {
    name: 'Stun',
    type: 'spellStun',
    duration: 1,
    description: 'membuat salah satu musuh tidak bisa memilih attack'
  }
];

module.exports = cards;