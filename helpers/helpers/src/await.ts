import "@nomicfoundation/hardhat-toolbox";

import { ethers, network } from "hardhat";

import { delay } from "@gemunion/utils";

export const blockAwait = async function (blockDelay = 2, ms = 1000): Promise<void> {
  if (network.name !== "hardhat") {
    await delay(ms);
    const initialBlock = await ethers.provider.getBlock("latest");
    let delayB;
    do {
      await delay(ms);
      const currentBlock = await ethers.provider.getBlock("latest");
      delayB = currentBlock!.number - initialBlock!.number;
    } while (delayB < blockDelay);
  }
};

export const blockAwaitMs = async function (ms = 5000): Promise<void> {
  if (network.name === "hardhat") {
    await Promise.resolve();
  } else {
    await delay(ms);
  }
};
