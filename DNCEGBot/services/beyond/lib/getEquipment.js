/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
// const data_info = require('./info.json');

module.exports = (character, data_sheet) => {
  const min_base_armor = character._getStat('minimum-base-armor');
  let add_dex = !min_base_armor;
  let base = min_base_armor || 10;
  let armortype;
  let shield = 0;

  for (const item of data_sheet.inventory) {
    if (item.equipped && item.definition.filterType === 'Armor') {
      const type = item.definition.type;
      if (type === 'Shield') {
        shield = 2;
      } else {
        base = item.definition.armorClass;
        armortype = type;
      }
    }
  }

  base = character._getStat('armor-class', base);
  const dexBonus = character.stats.dexterityMod || 0;
  const unarmoredBonus = character._getStat('unarmored-armor-class');
  const armoredBonus = character._getStat('armored-armor-class');
  let miscBonus = 0;

  if (armortype && armortype !== 'Light Armor') add_dex = false;
  if (add_dex) base += character._getStat('unarmored-dex-ac-bonus', dexBonus);

  for (const val of data_sheet.characterValues) {
    if (val.typeId === 1) return val.value; // AC override
    else if (val.typeId === 2) miscBonus += val.value; // AC magic bonus
    else if (val.typeId === 3) miscBonus += val.value; // AC misc bonus
    else if (val.typeId === 4) base += val.value; // AC+DEX override
  }

  if (!armortype) {
    character.armor = base + unarmoredBonus + shield + miscBonus;
  } else if (armortype === 'Light Armor') {
    character.armor = base + shield + armoredBonus + miscBonus;
  }  else if (armortype === 'Medium Armor') {
    character.armor = base + Math.min(dexBonus, 2) + shield + armoredBonus + miscBonus;
  } else {
    character.armor = base + shield + armoredBonus + miscBonus;
  }

  return character;
};
