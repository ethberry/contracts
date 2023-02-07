import { utils } from "ethers";

export const abiEncode = function (value: string, type: string): string {
  const AbiCoder = utils.AbiCoder;
  const abiCoder = new AbiCoder();
  return abiCoder.encode([type], [value]);
};

export const keccak256It = function (value: string): string {
  return utils.keccak256(utils.toUtf8Bytes(value));
};
