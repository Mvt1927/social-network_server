// utils.ts
export function lookup(
  obj: Record<string, any> | null | undefined,
  field: string,
): any | null {
  if (!obj) {
    return null;
  }

  const chain = field.split(']').join('').split('[');
  for (let i = 0, len = chain.length; i < len; i++) {
    const prop = obj[chain[i]];

    // Sử dụng optional chaining (?.): Nếu obj không tồn tại hoặc không có thuộc tính chain[i], thì prop sẽ là undefined
    if (prop === undefined) {
      return null;
    }

    // Nếu prop không phải là một object (nghĩa là đã tìm thấy giá trị cuối cùng), trả về prop
    if (typeof prop !== 'object') {
      return prop;
    }

    // Tiếp tục duyệt sâu hơn vào object con
    obj = prop;
  }

  return null; // Không tìm thấy giá trị, trả về null
}
