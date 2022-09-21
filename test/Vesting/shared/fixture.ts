import { ethers } from "hardhat";
import { constants } from "ethers";
import { time } from "@openzeppelin/test-helpers";

export async function deployVestingFixture(name: string) {
  const [owner, receiver] = await ethers.getSigners();
  const current = await time.latest();
  const vestingFactory = await ethers.getContractFactory(name);
  const contractInstance = await vestingFactory.deploy(receiver.address, current.toNumber(), 10000);

  await owner.sendTransaction({
    to: contractInstance.address,
    value: constants.WeiPerEther,
  });

  return {
    contractInstance,
  };
}
