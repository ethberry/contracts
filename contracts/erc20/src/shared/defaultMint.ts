import { BaseContract, BigNumberish, Signer } from "ethers";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

import { amount as defaultAmount } from "@ethberry/contracts-constants";

export type TMintERC20Fn = (
  contractInstance: any,
  signer: Signer,
  receiver: SignerWithAddress | BaseContract | string,
  amount?: bigint,
) => Promise<any>;

export interface IERC20Options {
  mint?: TMintERC20Fn;
  minterRole?: string;
  pauserRole?: string;
}

export const defaultMintERC20 = (
  contractInstance: any,
  signer: Signer,
  receiver: SignerWithAddress | BaseContract | string,
  amount: BigNumberish = defaultAmount,
): Promise<any> => {
  return contractInstance.connect(signer).mint(receiver, amount) as Promise<any>;
};
