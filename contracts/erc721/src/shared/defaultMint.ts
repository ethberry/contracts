import { BigNumberish, Contract, Signer } from "ethers";

export type TMintERC721Fn = (
  contractInstance: Contract,
  signer: Signer,
  receiver: string,
  tokenId: BigNumberish,
) => Promise<any>;

export interface IERC721Options {
  mint?: TMintERC721Fn;
  safeMint?: TMintERC721Fn;
  minterRole?: string;
  batchSize?: number;
}

export const defaultMintERC721 = (
  contractInstance: Contract,
  signer: Signer,
  receiver: string,
  tokenId: BigNumberish,
) => {
  return contractInstance.connect(signer).mint(receiver, tokenId) as Promise<any>;
};

export const defaultSafeMintERC721 = (
  contractInstance: Contract,
  signer: Signer,
  receiver: string,
  tokenId: BigNumberish,
) => {
  return contractInstance.connect(signer).safeMint(receiver, tokenId) as Promise<any>;
};
