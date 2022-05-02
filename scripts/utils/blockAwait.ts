import { ethers } from "hardhat";

export const blockAwait = async function (blockDelay = 2): Promise<number> {
  return new Promise(resolve => {
    let initialBlockNumber = 0;
    ethers.provider.on("block", (blockNumber: number) => {
      if (!initialBlockNumber) {
        initialBlockNumber = blockNumber;
      }
      if (blockNumber === initialBlockNumber + blockDelay) {
        resolve(blockNumber);
      }
    });
  });
};
