import { utils } from "ethers";

export const boolArrayToByte32 = (booleans: Array<boolean>) => {
  if (booleans.length > 256) {
    throw new Error("Array length cannot exceed 256");
  }

  let result = 0n;
  booleans.forEach((value, index) => {
    if (value) {
      result |= 1n << BigInt(index);
    }
  });

  return utils.hexZeroPad(utils.hexlify(result), 32);
};

export const byte32ToBoolArray = (byte32: string) => {
  const num = BigInt(byte32);
  const result = [];
  for (let i = 0; i < 256; i++) {
    result.push((num & (1n << BigInt(i))) !== 0n);
  }

  return result;
};

export const bool36ArrayToByte32 = (booleans: Array<boolean>) => {
  if (booleans.length > 256) {
    throw new Error("Array length cannot exceed 256");
  }
  const result: Array<string> = [];
  booleans.forEach((value, index) => {
    if (value) {
      result.push(utils.hexZeroPad(utils.hexValue(index + 1), 1));
    }
  });

  return utils.hexZeroPad(utils.hexConcat(result), 32);
};

export const byte32ToBool36Array = (byte32: string) => {
  const numbers = [];
  for (let i = 0; i < 32; i++) {
    numbers.push(utils.hexDataSlice(byte32, 32 - 1 - i, 32 - i));
  }

  const result = [];
  for (let i = 1; i <= 36; i++) {
    const found = numbers.filter(number => parseInt(number, 16) === i).length === 1;
    result.push(found);
  }

  return result;
};
