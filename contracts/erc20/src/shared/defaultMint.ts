import { BigNumberish, Contract, Signer } from "ethers";
import { amount } from "@gemunion/contracts-constants";

export const defaultMintERC20 = async (contractInstance: Contract, signer: Signer, receiver: string): Promise<any> => {
  return (await contractInstance.connect(signer).mint(receiver, amount)) as Promise<any>;
};

export const defaultMintAmountERC20 = async (
  contractInstance: Contract,
  signer: Signer,
  receiver: string,
  amount: BigNumberish,
): Promise<any> => {
  return (await contractInstance.connect(signer).mint(receiver, amount)) as Promise<any>;
};
