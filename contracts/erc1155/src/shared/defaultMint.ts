import { BigNumberish, Contract, Signer } from "ethers";

export type TMintERC1155Fn = (
  contractInstance: Contract,
  signer: Signer,
  receiver: string,
  tokenId: BigNumberish,
  amount: BigNumberish,
  data: string,
) => Promise<any>;

export type TMintBatchERC1155Fn = (
  contractInstance: Contract,
  signer: Signer,
  receiver: string,
  tokenId: Array<BigNumberish>,
  amount: Array<BigNumberish>,
  data: string,
) => Promise<any>;

export interface IERC1155Options {
  mint?: TMintERC1155Fn;
  mintBatch?: TMintBatchERC1155Fn;
  minterRole?: string;
}

export const defaultMintERC1155 = (
  contractInstance: Contract,
  signer: Signer,
  receiver: string,
  tokenId: BigNumberish,
  amount: BigNumberish,
  data: string,
) => {
  return contractInstance.connect(signer).mint(receiver, tokenId, amount, data) as Promise<any>;
};

export const defaultMintBatchERC1155 = (
  contractInstance: Contract,
  signer: Signer,
  receiver: string,
  tokenIds: Array<BigNumberish>,
  amounts: Array<BigNumberish>,
  data: string,
) => {
  return contractInstance.connect(signer).mintBatch(receiver, tokenIds, amounts, data) as Promise<any>;
};
