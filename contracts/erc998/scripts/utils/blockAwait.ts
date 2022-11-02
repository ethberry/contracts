import { ethers } from "hardhat";

export const blockAwait = async function (blockDelay = 2): Promise<number> {
  return new Promise(resolve => {
    if (ethers.provider.network.chainId === 1337) {
      let initialBlockNumber = 0;
      ethers.provider.on("block", (blockNumber: number) => {
        if (!initialBlockNumber) {
          initialBlockNumber = blockNumber;
        }
        if (blockNumber === initialBlockNumber + blockDelay) {
          resolve(blockNumber);
        }
      });
    } else {
      resolve(0);
    }
  });
};
