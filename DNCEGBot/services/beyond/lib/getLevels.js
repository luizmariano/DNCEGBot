module.exports = (data_sheet) => {
  const data = { level: 0 };
  for (const classe of data_sheet.classes) {
    data.level += classe.level;
    data[classe.definition.name] = classe.level;
  }
  return data;
}