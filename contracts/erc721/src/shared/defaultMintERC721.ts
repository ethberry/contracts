import { BigNumberish, Contract, Signer } from "ethers";

export const defaultMintERC721 = async (
  contractInstance: Contract,
  signer: Signer,
  receiver: string,
  tokenId: BigNumberish,
) => {
  return (await contractInstance.connect(signer).mint(receiver, tokenId)) as Promise<any>;
};

export const defaultSafeMintERC721 = async (
  contractInstance: Contract,
  signer: Signer,
  receiver: string,
  tokenId: BigNumberish,
) => {
  return (await contractInstance.connect(signer).safeMint(receiver, tokenId)) as Promise<any>;
};

export const defaultMintERC721Fns = {
  mint: defaultMintERC721,
  safeMint: defaultSafeMintERC721,
};
