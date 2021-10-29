import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Marketplace, MarketplaceErc20, MarketplaceErc721 } from "../../typechain-types";
import { initialTokenAmountInWei } from "../constants";

describe("Marketplace", function () {
  let market: ContractFactory;
  let coin: ContractFactory;
  let nft: ContractFactory;
  let marketInstance: Marketplace;
  let coinInstance: MarketplaceErc20;
  let nftInstance: MarketplaceErc721;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    coin = await ethers.getContractFactory("MarketplaceErc20");
    nft = await ethers.getContractFactory("MarketplaceErc721");
    market = await ethers.getContractFactory("Marketplace");
    [owner] = await ethers.getSigners();

    coinInstance = (await coin.deploy()) as MarketplaceErc20;
    nftInstance = (await nft.deploy()) as MarketplaceErc721;
    marketInstance = (await market.deploy(coinInstance.address, 100)) as Marketplace;

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
