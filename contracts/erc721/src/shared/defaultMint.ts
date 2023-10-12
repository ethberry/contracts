import { BaseContract, Signer } from "ethers";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

export type TMintERC721Fn = (
  contractInstance: any,
  signer: Signer,
  receiver: SignerWithAddress | BaseContract | string,
  tokenId: bigint,
) => Promise<any>;

export interface IERC721Options {
  mint?: TMintERC721Fn;
  safeMint?: TMintERC721Fn;
  minterRole?: string;
  pauserRole?: string;
  adminRole?: string;
  batchSize?: bigint;
  tokenId?: bigint;
}

export const defaultMintERC721 = (
  contractInstance: any,
  signer: Signer,
  receiver: SignerWithAddress | BaseContract | string,
  tokenId: bigint,
) => {
  return contractInstance.connect(signer).mint(receiver, tokenId) as Promise<any>;
};

export const defaultSafeMintERC721 = (
  contractInstance: any,
  signer: Signer,
  receiver: SignerWithAddress | BaseContract | string,
  tokenId: bigint,
) => {
  return contractInstance.connect(signer).safeMint(receiver, tokenId) as Promise<any>;
};
