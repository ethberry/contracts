import { BigNumberish, Contract, Signer } from "ethers";

export const defaultMintERC1155 = async (
  contractInstance: Contract,
  signer: Signer,
  receiver: string,
  tokenId: BigNumberish,
  amount: BigNumberish,
  data: string,
) => {
  return (await contractInstance.connect(signer).mint(receiver, tokenId, amount, data)) as Promise<any>;
};

export const defaultMintBatchERC1155 = async (
  contractInstance: Contract,
  signer: Signer,
  receiver: string,
  tokenIds: Array<BigNumberish>,
  amounts: Array<BigNumberish>,
  data: string,
) => {
  return contractInstance.connect(signer).mintBatch(receiver, tokenIds, amounts, data) as Promise<any>;
};

export const defaultMintERC1155Fns = {
  mint: defaultMintERC1155,
  mintBatch: defaultMintBatchERC1155,
};
