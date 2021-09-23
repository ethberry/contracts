import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Marketplace, MindCoin, MindNFT } from "../../typechain";
import { initialTokenAmountInWei } from "../constants";

describe("Marketplace", function () {
  let market: ContractFactory;
  let coin: ContractFactory;
  let nft: ContractFactory;
  let marketInstance: Marketplace;
  let coinInstance: MindCoin;
  let nftInstance: MindNFT;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    coin = await ethers.getContractFactory("MindCoin");
    nft = await ethers.getContractFactory("MindNFT");
    market = await ethers.getContractFactory("Marketplace");
    [owner] = await ethers.getSigners();

    coinInstance = (await upgrades.deployProxy(
      coin,
      ["memoryOS COIN token", "MIND", initialTokenAmountInWei, initialTokenAmountInWei.mul(5)],
      { initializer: "initialize(string name, string symbol, uint256 initialSupply, uint256 cap)" },
    )) as MindCoin;
    marketInstance = (await upgrades.deployProxy(market, [coinInstance.address, 100])) as Marketplace;
    nftInstance = (await upgrades.deployProxy(nft, ["memoryOS NFT token", "MIND", "http://localhost/"])) as MindNFT;
  });

  describe("Deployment", function () {
    it("Should set the right roles to deployer", async function () {
      const balanceOfMarket = await coinInstance.balanceOf(marketInstance.address);
      expect(balanceOfMarket).to.equal(0);
      const balanceOfOwner = await coinInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(initialTokenAmountInWei);
      const balanceOfOwner1 = await nftInstance.balanceOf(owner.address);
      expect(balanceOfOwner1).to.equal(0);
    });
  });
});
