import { ethers, network } from "hardhat";

function delayMs(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const blockAwait = async function (blockDelay = 2, delay?: number): Promise<void> {
  if (network.name !== "hardhat") {
    await delayMs(delay || 0);
    const initialBlock = await ethers.provider.getBlock("latest");
    let currentBlock;
    let delayB;
    do {
      await delayMs(delay || 0);
      currentBlock = await ethers.provider.getBlock("latest");
      delayB = currentBlock.number - initialBlock.number;
    } while (delayB < blockDelay);
  }
};

export const blockAwaitMs = async function (delay = 5000): Promise<void> {
  if (network.name === "hardhat") {
    await Promise.resolve();
  } else {
    await delayMs(delay);
  }
};
