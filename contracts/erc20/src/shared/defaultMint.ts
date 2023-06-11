import { BigNumberish, Signer } from "ethers";

import { amount as defaultAmount } from "@gemunion/contracts-constants";

export type TMintERC20Fn = (contractInstance: any, signer: Signer, receiver: string, amount?: bigint) => Promise<any>;

export interface IERC20Options {
  mint?: TMintERC20Fn;
  minterRole?: string;
}

export const defaultMintERC20 = (
  contractInstance: any,
  signer: Signer,
  receiver: string,
  amount: BigNumberish = defaultAmount,
): Promise<any> => {
  return contractInstance.connect(signer).mint(receiver, amount) as Promise<any>;
};
