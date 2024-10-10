export function invertBooleanValues(
  obj: Record<string, any>,
): Record<string, any> {
  // Tạo một bản sao mới của object để tránh thay đổi object gốc
  const newObj = { ...obj };

  // Duyệt qua từng thuộc tính của object
  for (const key in newObj) {
    // Kiểm tra xem giá trị của thuộc tính có phải là boolean hay không
    if (typeof newObj[key] === 'boolean') {
      // Đảo ngược giá trị boolean
      newObj[key] = !newObj[key];
    }
  }

  return newObj;
}
