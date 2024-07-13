import "@nomicfoundation/hardhat-toolbox";
import { deployContract } from "@gemunion/contracts-utils";

export async function deployWallet(name = "AllTypesWallet") {
  return deployContract(name);
}

export async function deployJerk(name = "Jerk") {
  return deployContract(name);
}
