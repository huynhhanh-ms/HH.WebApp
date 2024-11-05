export function setToEndOfDay(date) {
  date.setHours(23, 59, 59, 999);
  return date;
}

export function setToStartOfDay(date) {
  date.setHours(0, 0, 0, 0);
  return date;
}

export function removeVietnameseTones(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}
