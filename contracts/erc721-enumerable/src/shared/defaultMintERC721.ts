import { Contract, Signer } from "ethers";

export const defaultMintERC721Enum = async (contractInstance: Contract, signer: Signer, receiver: string) => {
  return (await contractInstance.connect(signer).mint(receiver)) as Promise<any>;
};

export const defaultSafeMintERC721Enum = async (contractInstance: Contract, signer: Signer, receiver: string) => {
  return (await contractInstance.connect(signer).safeMint(receiver)) as Promise<any>;
};

export const defaultMintERC721Fns = {
  mint: defaultMintERC721Enum,
  safeMint: defaultSafeMintERC721Enum,
};
