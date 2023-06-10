import { Signer } from "ethers";

export type TMintERC721EnumFn = (contractInstance: any, signer: Signer, receiver: string) => Promise<any>;

export interface IERC721EnumOptions {
  mint?: TMintERC721EnumFn;
  safeMint?: TMintERC721EnumFn;
  minterRole?: string;
  batchSize?: bigint;
  tokenId?: bigint;
}

export const defaultMintERC721 = (contractInstance: any, signer: Signer, receiver: string) => {
  return contractInstance.connect(signer).mint(receiver) as Promise<any>;
};

export const defaultSafeMintERC721 = (contractInstance: any, signer: Signer, receiver: string) => {
  return contractInstance.connect(signer).safeMint(receiver) as Promise<any>;
};
