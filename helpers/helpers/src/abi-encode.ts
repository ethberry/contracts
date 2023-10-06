import { AbiCoder, keccak256, toUtf8Bytes } from "ethers";

export const abiEncode = function (value: string, type: string): string {
  const abiCoder = new AbiCoder();
  return abiCoder.encode([type], [value]);
};

export const keccak256It = function (value: string): string {
  return keccak256(toUtf8Bytes(value));
};
