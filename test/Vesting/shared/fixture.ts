import { ethers } from "hardhat";
import { time } from "@openzeppelin/test-helpers";
import { AbstractVesting, ERC20ABCS } from "../../../typechain-types";
import { amount, tokenName, tokenSymbol } from "../../constants";

export async function deployVestingFixture(name: string): Promise<{ contractInstance: AbstractVesting }> {
  const [owner, receiver] = await ethers.getSigners();
  const current = await time.latest();
  const vestingFactory = await ethers.getContractFactory(name);
  const vestingInstance = (await vestingFactory.deploy(receiver.address, current.toNumber(), 10000)) as AbstractVesting;

  await owner.sendTransaction({
    to: vestingInstance.address,
    value: amount * 100,
  });

  return { contractInstance: vestingInstance };
}

export async function deployERC20Fixture(contractInstance: AbstractVesting): Promise<{ contractInstance: ERC20ABCS }> {
  const erc20Factory = await ethers.getContractFactory("ERC20ABCS");
  const erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount * 100);

  await erc20Instance.functions.mint(contractInstance.address, amount * 100);

  return { contractInstance: erc20Instance };
}
