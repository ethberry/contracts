import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC20ACB, MarketplaceERC20ETH } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE, tokenName, tokenSymbol } from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";
import { shouldPause } from "../shared/pausable";

describe("MarketplaceERC20ETH", function () {
  let marketplace: ContractFactory;
  let marketplaceInstance: MarketplaceERC20ETH;
  let erc20: ContractFactory;
  let erc20Instance: ERC20ACB;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20ACB");
    marketplace = await ethers.getContractFactory("MarketplaceERC20ETH");
    [this.owner, this.receiver] = await ethers.getSigners();

    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol)) as ERC20ACB;
    marketplaceInstance = (await marketplace.deploy()) as MarketplaceERC20ETH;

    await marketplaceInstance.updateFactory(erc20Instance.address, true);
    await erc20Instance.grantRole(MINTER_ROLE, marketplaceInstance.address);

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
        .buy(erc20Instance.address, amount, { value: amount });
      await expect(tx1)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, amount);

      await expect(tx1).to.changeEtherBalance(this.receiver, -amount);

      const ownerOf = await erc20Instance.balanceOf(this.receiver.address);
      expect(ownerOf).to.equal(amount);
    });

    it("should fail: price mismatch", async function () {
      const tx1 = marketplaceInstance.connect(this.receiver).buy(erc20Instance.address, amount, { value: amount / 2 });
      await expect(tx1).to.be.revertedWith("Marketplace: price mismatch");
    });
  });

  describe("updateFactory", function () {
    it("should fail: collection is not enabled", async function () {
      await marketplaceInstance.updateFactory(erc20Instance.address, false);

      const tx1 = marketplaceInstance.connect(this.receiver).buy(erc20Instance.address, amount, { value: amount });
      await expect(tx1).to.be.revertedWith("Marketplace: collection is not enabled");
    });
  });

  describe("pause", function () {
    it("buy should respect pause", async function () {
      const tx1 = marketplaceInstance.pause();
      await expect(tx1).to.emit(marketplaceInstance, "Paused").withArgs(this.owner.address);

      const tx2 = marketplaceInstance.connect(this.receiver).buy(erc20Instance.address, amount, { value: amount });
      await expect(tx2).to.be.revertedWith("Pausable: paused");

      const tx3 = marketplaceInstance.unpause();
      await expect(tx3).to.emit(marketplaceInstance, "Unpaused").withArgs(this.owner.address);

      const tx4 = marketplaceInstance.connect(this.receiver).buy(erc20Instance.address, amount, { value: amount });
      await expect(tx4).to.not.be.reverted;
    });
  });
});
