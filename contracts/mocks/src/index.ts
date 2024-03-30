import "@nomicfoundation/hardhat-toolbox";
import { deployContract } from "@gemunion/contracts-utils";

export async function deployWallet() {
  return deployContract("Wallet");
}

export async function deployJerk() {
  return deployContract("Jerk");
}
