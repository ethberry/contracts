import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Loci, Marketplace, MindCoin } from "../../typechain";
import { baseTokenURI, initialTokenAmountInWei, tokenName, tokenSymbol } from "../constants";

describe("Marketplace", function () {
  let market: ContractFactory;
  let coin: ContractFactory;
  let nft: ContractFactory;
  let marketInstance: Marketplace;
  let coinInstance: MindCoin;
  let nftInstance: Loci;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    coin = await ethers.getContractFactory("MindCoin");
    nft = await ethers.getContractFactory("Loci");
    market = await ethers.getContractFactory("Marketplace");
    [owner] = await ethers.getSigners();

    coinInstance = (await coin.deploy(tokenName, tokenSymbol)) as MindCoin;
    marketInstance = (await market.deploy(coinInstance.address, 100)) as Marketplace;
    nftInstance = (await nft.deploy(tokenName, tokenSymbol, baseTokenURI)) as Loci;

    await coinInstance.mint(owner.address, initialTokenAmountInWei);
  });

  describe("Deployment", function () {
    it("should set the right roles to deployer", async function () {
      const balanceOfMarket = await coinInstance.balanceOf(marketInstance.address);
      expect(balanceOfMarket).to.equal(0);
      const balanceOfOwner = await coinInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(initialTokenAmountInWei);
      const balanceOfOwner1 = await nftInstance.balanceOf(owner.address);
      expect(balanceOfOwner1).to.equal(0);
    });
  });
});
