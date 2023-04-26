import { BigNumberish, Contract, Signer } from "ethers";

export type TDefaultMintERC20Fn = (contractInstance: Contract, signer: Signer, receiver: string) => Promise<any>;

export type TDefaultMintAmountERC20Fn = (
  contractInstance: Contract,
  signer: Signer,
  receiver: string,
  customAmount: BigNumberish,
) => Promise<any>;
