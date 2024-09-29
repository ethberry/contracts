import "@nomicfoundation/hardhat-toolbox";
import { deployContract } from "@ethberry/contracts-utils";

export async function deployHolder(name = "AllTypesHolderMock") {
  return deployContract(name);
}

export async function deployRejector(name = "NativeRejectorMock") {
  return deployContract(name);
}
