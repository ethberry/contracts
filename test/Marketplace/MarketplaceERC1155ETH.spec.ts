import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC1155ACB, MarketplaceERC1155ETH } from "../../typechain-types";
import { amount, baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE, tokenId } from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";
import { shouldPause } from "../shared/pausable";

use(solidity);

describe("MarketplaceERC1155ETH", function () {
  let marketplace: ContractFactory;
  let marketplaceInstance: MarketplaceERC1155ETH;
  let erc1155: ContractFactory;
  let erc1155Instance: ERC1155ACB;

  beforeEach(async function () {
    erc1155 = await ethers.getContractFactory("ERC1155ACB");
    marketplace = await ethers.getContractFactory("MarketplaceERC1155ETH");
    [this.owner, this.receiver] = await ethers.getSigners();

    erc1155Instance = (await erc1155.deploy(baseTokenURI)) as ERC1155ACB;
    marketplaceInstance = (await marketplace.deploy()) as MarketplaceERC1155ETH;

    await marketplaceInstance.updateFactory(erc1155Instance.address, true);
    await erc1155Instance.grantRole(MINTER_ROLE, marketplaceInstance.address);

    this.contractInstance = marketplaceInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();
  shouldPause();

  describe("buy", function () {
    it("should buy", async function () {
      const tx1 = await marketplaceInstance
        .connect(this.receiver)
        .buy(erc1155Instance.address, [tokenId], [amount], { value: amount });
      await expect(tx1)
        .to.emit(erc1155Instance, "TransferBatch")
        .withArgs(
          marketplaceInstance.address,
          ethers.constants.AddressZero,
          this.receiver.address,
          [tokenId],
          [amount],
        );

      await expect(tx1).to.changeEtherBalance(this.receiver, -amount);

      const ownerOf = await erc1155Instance.balanceOf(this.receiver.address, tokenId);
      expect(ownerOf).to.equal(amount);
    });

    it("should fail: price mismatch", async function () {
      const tx1 = marketplaceInstance
        .connect(this.receiver)
        .buy(erc1155Instance.address, [tokenId], [amount], { value: amount / 2 });
      await expect(tx1).to.be.revertedWith("Marketplace: price mismatch");
    });
  });

  describe("updateFactory", function () {
    it("should fail: collection is not enabled", async function () {
      await marketplaceInstance.updateFactory(erc1155Instance.address, false);

      const tx1 = marketplaceInstance
        .connect(this.receiver)
        .buy(erc1155Instance.address, [tokenId], [amount], { value: amount });
      await expect(tx1).to.be.revertedWith("Marketplace: collection is not enabled");
    });
  });

  describe("pause", function () {
    it("buy should respect", async function () {
      const tx1 = marketplaceInstance.pause();
      await expect(tx1).to.emit(marketplaceInstance, "Paused").withArgs(this.owner.address);

      const tx2 = marketplaceInstance
        .connect(this.receiver)
        .buy(erc1155Instance.address, [tokenId], [amount], { value: amount });
      await expect(tx2).to.be.revertedWith("Pausable: paused");

      const tx3 = marketplaceInstance.unpause();
      await expect(tx3).to.emit(marketplaceInstance, "Unpaused").withArgs(this.owner.address);

      const tx4 = marketplaceInstance
        .connect(this.receiver)
        .buy(erc1155Instance.address, [tokenId], [amount], { value: amount });
      await expect(tx4).to.not.be.reverted;
    });
  });
});
