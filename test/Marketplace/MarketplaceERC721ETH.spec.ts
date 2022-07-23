import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC721ACB, MarketplaceERC721ETH } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE, tokenId, tokenName, tokenSymbol } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";
import { shouldPause } from "../shared/pausable";

use(solidity);

describe("MarketplaceERC721ETH", function () {
  let marketplace: ContractFactory;
  let marketplaceInstance: MarketplaceERC721ETH;
  let erc721: ContractFactory;
  let erc721Instance: ERC721ACB;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721ACB");
    marketplace = await ethers.getContractFactory("MarketplaceERC721ETH");
    [this.owner, this.receiver] = await ethers.getSigners();

    erc721Instance = (await erc721.deploy(tokenName, tokenSymbol)) as ERC721ACB;
    marketplaceInstance = (await marketplace.deploy()) as MarketplaceERC721ETH;

    await marketplaceInstance.updateFactory(erc721Instance.address, true);
    await erc721Instance.grantRole(MINTER_ROLE, marketplaceInstance.address);

    this.contractInstance = marketplaceInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();
  shouldPause(true);

  describe("buy", function () {
    it("should buy", async function () {
      const tx1 = await marketplaceInstance
        .connect(this.receiver)
        .buy(erc721Instance.address, tokenId, { value: amount });
      await expect(tx1)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      await expect(tx1).to.changeEtherBalance(this.receiver, -amount);

      const ownerOf = await erc721Instance.ownerOf(tokenId);
      expect(ownerOf).to.equal(this.receiver.address);
    });

    it("should fail: price mismatch", async function () {
      const tx1 = marketplaceInstance
        .connect(this.receiver)
        .buy(erc721Instance.address, tokenId, { value: amount / 2 });
      await expect(tx1).to.be.revertedWith("Marketplace: price mismatch");
    });
  });

  describe("updateFactory", function () {
    it("should fail: collection is not enabled", async function () {
      await marketplaceInstance.updateFactory(erc721Instance.address, false);

      const tx1 = marketplaceInstance.connect(this.receiver).buy(erc721Instance.address, tokenId, { value: amount });
      await expect(tx1).to.be.revertedWith("Marketplace: collection is not enabled");
    });
  });

  describe("pause", function () {
    it("buy should respect pause", async function () {
      const tx1 = marketplaceInstance.pause();
      await expect(tx1).to.emit(marketplaceInstance, "Paused").withArgs(this.owner.address);

      const tx2 = marketplaceInstance.connect(this.receiver).buy(erc721Instance.address, tokenId, { value: amount });
      await expect(tx2).to.be.revertedWith("Pausable: paused");

      const tx3 = marketplaceInstance.unpause();
      await expect(tx3).to.emit(marketplaceInstance, "Unpaused").withArgs(this.owner.address);

      const tx4 = marketplaceInstance.connect(this.receiver).buy(erc721Instance.address, tokenId, { value: amount });
      await expect(tx4).to.not.be.reverted;
    });
  });
});
