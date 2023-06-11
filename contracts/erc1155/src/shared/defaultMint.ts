import { Signer } from "ethers";

export type TMintERC1155Fn = (
  contractInstance: any,
  signer: Signer,
  receiver: string,
  tokenId: bigint,
  amount: bigint,
  data: string,
) => Promise<any>;

export type TMintBatchERC1155Fn = (
  contractInstance: any,
  signer: Signer,
  receiver: string,
  tokenId: Array<bigint>,
  amount: Array<bigint>,
  data: string,
) => Promise<any>;

export interface IERC1155Options {
  mint?: TMintERC1155Fn;
  mintBatch?: TMintBatchERC1155Fn;
  minterRole?: string;
}

export const defaultMintERC1155 = (
  contractInstance: any,
  signer: Signer,
  receiver: string,
  tokenId: bigint,
  amount: bigint,
  data: string,
) => {
  return contractInstance.connect(signer).mint(receiver, tokenId, amount, data) as Promise<any>;
};

export const defaultMintBatchERC1155 = (
  contractInstance: any,
  signer: Signer,
  receiver: string,
  tokenIds: Array<bigint>,
  amounts: Array<bigint>,
  data: string,
) => {
  return contractInstance.connect(signer).mintBatch(receiver, tokenIds, amounts, data) as Promise<any>;
};
