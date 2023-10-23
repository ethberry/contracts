import { BaseContract, Signer } from "ethers";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

export type TMintERC721EnumFn = (
  contractInstance: any,
  signer: Signer,
  receiver: SignerWithAddress | BaseContract | string,
) => Promise<any>;

export interface IERC721EnumOptions {
  mint?: TMintERC721EnumFn;
  safeMint?: TMintERC721EnumFn;
  minterRole?: string;
  pauserRole?: string;
  adminRole?: string;
  tokenId?: bigint;
}

export type TERC721MetadataOptions = Array<{
  key: string;
  value: bigint;
}>;

export const defaultMintERC721 = (
  contractInstance: any,
  signer: Signer,
  receiver: SignerWithAddress | BaseContract | string,
) => {
  return contractInstance.connect(signer).mint(receiver) as Promise<any>;
};

export const defaultSafeMintERC721 = (
  contractInstance: any,
  signer: Signer,
  receiver: SignerWithAddress | BaseContract | string,
) => {
  return contractInstance.connect(signer).safeMint(receiver) as Promise<any>;
};
