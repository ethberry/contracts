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

export interface IMintERC1155Fns {
  mint: TMintERC1155Fn;
  mintBatch: TMintBatchERC1155Fn;
}
