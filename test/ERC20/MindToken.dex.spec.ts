import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";

import { DEX, MindCoin } from "../../typechain";

describe("ERC20 DEX", function () {
  let token: ContractFactory;
  let market: ContractFactory;
  let tokenInstance: MindCoin;
  let marketInstance: DEX;

  beforeEach(async function () {
    token = await ethers.getContractFactory("MindCoin");
    market = await ethers.getContractFactory("DEX");

    tokenInstance = (await upgrades.deployProxy(token, ["memoryOS COIN token", "MIND"])) as MindCoin;
    marketInstance = (await upgrades.deployProxy(market, [tokenInstance.address])) as DEX;
  });

  describe("Deployment", function () {
    it("DEX should has zero balance", async function () {
      expect(await tokenInstance.balanceOf(marketInstance.address)).to.equal(0);
    });
  });
});
