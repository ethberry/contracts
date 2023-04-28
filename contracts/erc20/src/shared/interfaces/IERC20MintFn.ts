import { BigNumberish, Contract, Signer } from "ethers";

export type TMintERC20Fn = (contractInstance: Contract, signer: Signer, receiver: string) => Promise<any>;

export type TMintAmountERC20Fn = (
  contractInstance: Contract,
  signer: Signer,
  receiver: string,
  customAmount: BigNumberish,
) => Promise<any>;
