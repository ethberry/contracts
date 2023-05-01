import { BigNumberish, Contract, Signer } from "ethers";

import { amount } from "@gemunion/contracts-constants";

export type TMintERC20Fn = (
  contractInstance: Contract,
  signer: Signer,
  receiver: string,
  customAmount?: BigNumberish,
) => Promise<any>;

export interface IERC20Options {
  mint?: TMintERC20Fn;
  minterRole?: string;
}

export const defaultMintERC20 = (
  contractInstance: Contract,
  signer: Signer,
  receiver: string,
  value: BigNumberish = amount,
): Promise<any> => {
  return contractInstance.connect(signer).mint(receiver, value) as Promise<any>;
};
