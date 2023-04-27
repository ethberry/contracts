import { Contract, Signer } from "ethers";

export type TMintERC721EnumFn = (contractInstance: Contract, signer: Signer, receiver: string) => Promise<any>;

export interface IMintERC721EnumFns {
  mint: TMintERC721EnumFn;
  safeMint: TMintERC721EnumFn;
}
