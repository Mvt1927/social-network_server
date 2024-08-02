import { ValidationError } from '@nestjs/common';
import { ValidatorOptions } from 'class-validator';

export const VALIDATOR_OPTIONS: ValidatorOptions = {
  validationError: { target: false, value: false },
};

export function countTotalErrors(errors: ValidationError[]): number {
  return errors.reduce((count, error) => {
    // Đếm lỗi hiện tại
    let currentErrorCount = 1;

    // Đếm số lỗi của các lỗi con (nếu có)
    currentErrorCount += error.children?.length || 0;

    // Đếm số lượng message trong constraints (nếu có)
    if (error.constraints) {
      currentErrorCount += Object.keys(error.constraints).length;
    }

    return count + currentErrorCount;
  }, 0);
}

export function getValidationErrorWithLeastErrors(
  errorList: ValidationError[][],
  options = {
    pushErrorsIfEqual: false,
  },
): ValidationError[] {
  if (errorList.length === 0) {
    return []; // Hoặc xử lý trường hợp danh sách rỗng theo ý bạn
  }

  let minErrorCount = Infinity;
  let result: ValidationError[] = [];

  for (const errors of errorList) {
    const errorCount = countTotalErrors(errors); // Hàm đếm tổng số lỗi (xem câu trả lời trước)

    if (errorCount < minErrorCount) {
      minErrorCount = errorCount;
      result = errors; // Cập nhật kết quả nếu tìm thấy mảng có số lỗi ít hơn
    } else if (options.pushErrorsIfEqual && errorCount === minErrorCount) {
      result.push(...errors); // Nếu bằng số lỗi nhỏ nhất, thêm vào kết quả
    }
  }

  return result;
}

export function removeHiddenAttributes<
  T extends Record<string, any>,
  K extends keyof T,
>(obj: T, keysToRemove: K[]): Omit<T, K> {
  const { ...rest } = obj;
  keysToRemove.forEach((key) => delete rest[key]);
  return rest as Omit<T, K>;
}

export function splitObject<
  T extends Record<string, any>,
  U extends Record<string, any>,
>(
  obj: T,
  keysToExtractType: U,
): {
  extracted: Pick<T, Extract<keyof T, keyof U>>;
  remaining: Omit<T, Extract<keyof T, keyof U>>;
} {
  const keysToExtract = Object.keys(keysToExtractType) as (keyof U)[];

  const extracted: Pick<T, Extract<keyof T, keyof U>> = {} as Pick<
    T,
    Extract<keyof T, keyof U>
  >;
  const remaining: Omit<T, Extract<keyof T, keyof U>> = {} as Omit<
    T,
    Extract<keyof T, keyof U>
  >;

  for (const key in obj) {
    if (keysToExtract.includes(key as unknown as keyof U)) {
      extracted[key as Extract<keyof T, keyof U>] =
        obj[key as Extract<keyof T, keyof U>];
    } else {
      const remainingKey = key as unknown as keyof Omit<
        T,
        Extract<keyof T, keyof U>
      >; // Ép kiểu key về keyof Omit<T, Extract<keyof T, keyof U>>
      remaining[remainingKey] = obj[remainingKey];
    }
  }

  return { extracted: extracted, remaining: remaining };
}

export function splitObject2<
  T extends Record<string, any>,
  U extends keyof T, // Thay đổi kiểu U thành keyof T
>(obj: T, keysToExtractType: U[]): [Pick<T, U>, Omit<T, U>] {
  const extracted: Pick<T, U> = {} as Pick<T, U>;
  const remaining: Omit<T, U> = {} as Omit<T, U>;

  for (const key in obj) {
    if (keysToExtractType.includes(key as unknown as U)) {
      // Kiểm tra xem key có nằm trong keysToExtractType không
      extracted[key as unknown as U] = obj[key as unknown as U];
    } else {
      const remainingKey = key as unknown as Exclude<keyof T, U>;
      remaining[remainingKey] = obj[remainingKey];
    }
  }

  return [extracted, remaining];
}
