import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC20", function () {
  it("all tokens should belong to owner", async function () {
    const [owner] = await ethers.getSigners();

    const ERC20Factory = await ethers.getContractFactory("ERC20");
    const erc20 = await ERC20Factory.deploy("memoryOS main token", "MIND");
    await erc20.deployed();

    const ownerBalance = await erc20.balanceOf(owner.address);
    expect(await erc20.totalSupply()).to.equal(ownerBalance);
  });
});
