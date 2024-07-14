import "@nomicfoundation/hardhat-toolbox";
import { deployContract } from "@gemunion/contracts-utils";

export async function deployHolder(name = "AllTypesHolder") {
  return deployContract(name);
}

export async function deployRejector(name = "NativeRejector") {
  return deployContract(name);
}
