import { BigNumberish, Contract, Signer } from "ethers";

export type TMintERC721Fn = (
  contractInstance: Contract,
  signer: Signer,
  receiver: string,
  tokenId: BigNumberish,
) => Promise<any>;

export interface IMintERC721Fns {
  mint: TMintERC721Fn;
  safeMint: TMintERC721Fn;
}
