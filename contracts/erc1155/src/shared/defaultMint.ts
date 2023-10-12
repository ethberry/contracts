import { BaseContract, Signer } from "ethers";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

export type TMintERC1155Fn = (
  contractInstance: any,
  signer: Signer,
  receiver: SignerWithAddress | BaseContract | string,
  tokenId: bigint,
  amount: bigint,
  data: string,
) => Promise<any>;

export type TMintBatchERC1155Fn = (
  contractInstance: any,
  signer: Signer,
  receiver: SignerWithAddress | BaseContract | string,
  tokenId: Array<bigint>,
  amount: Array<bigint>,
  data: string,
) => Promise<any>;

export interface IERC1155Options {
  mint?: TMintERC1155Fn;
  mintBatch?: TMintBatchERC1155Fn;
  minterRole?: string;
  adminRole?: string;
  tokenId?: bigint;
}

export const defaultMintERC1155 = (
  contractInstance: any,
  signer: Signer,
  receiver: SignerWithAddress | BaseContract | string,
  tokenId: bigint,
  amount: bigint,
  data: string,
) => {
  return contractInstance.connect(signer).mint(receiver, tokenId, amount, data) as Promise<any>;
};

export const defaultMintBatchERC1155 = (
  contractInstance: any,
  signer: Signer,
  receiver: SignerWithAddress | BaseContract | string,
  tokenIds: Array<bigint>,
  amounts: Array<bigint>,
  data: string,
) => {
  return contractInstance.connect(signer).mintBatch(receiver, tokenIds, amounts, data) as Promise<any>;
};
