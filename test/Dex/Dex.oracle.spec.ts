import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { DexWithOracle, MindCoin, PriceOracle } from "../../typechain";
import { initialTokenAmount, initialTokenAmountInWei } from "../constants";

describe("ERC20 DEX with Oracle", function () {
  let token: ContractFactory;
  let oracle: ContractFactory;
  let market: ContractFactory;
  let tokenInstance: MindCoin;
  let marketInstance: DexWithOracle;
  let oracleInstance: PriceOracle;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    token = await ethers.getContractFactory("MindCoin");
    oracle = await ethers.getContractFactory("PriceOracle");
    market = await ethers.getContractFactory("DexWithOracle");
    [owner] = await ethers.getSigners();

    tokenInstance = (await upgrades.deployProxy(token, [
      "memoryOS COIN token",
      "MIND",
      initialTokenAmount,
    ])) as MindCoin;
    oracleInstance = (await upgrades.deployProxy(oracle)) as PriceOracle;
    marketInstance = (await upgrades.deployProxy(market, [
      tokenInstance.address,
      oracleInstance.address,
    ])) as DexWithOracle;
  });

  describe("Deployment", function () {
    it("DEX should has zero balance", async function () {
      const balanceOfDex = await tokenInstance.balanceOf(marketInstance.address);
      expect(balanceOfDex).to.equal(0);
      const balanceOfOwner = await tokenInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(initialTokenAmountInWei);
    });
  });
});
