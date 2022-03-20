import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ERC20ACB, MarketplaceERC20ETH } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE, tokenName, tokenSymbol } from "../constants";

describe("MarketplaceERC20ETH", function () {
  let marketplace: ContractFactory;
  let marketplaceInstance: MarketplaceERC20ETH;
  let erc20: ContractFactory;
  let erc20Instance: ERC20ACB;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20ACB");
    marketplace = await ethers.getContractFactory("MarketplaceERC20ETH");
    [owner, receiver] = await ethers.getSigners();

    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol)) as ERC20ACB;
    marketplaceInstance = (await marketplace.deploy()) as MarketplaceERC20ETH;

    await marketplaceInstance.updateFactory(erc20Instance.address, true);
    await erc20Instance.grantRole(MINTER_ROLE, marketplaceInstance.address);
  });

  describe("Deployment", function () {
    it("should set the right roles to deployer", async function () {
      const isAdmin = await marketplaceInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isPauser = await marketplaceInstance.hasRole(PAUSER_ROLE, owner.address);
      expect(isPauser).to.equal(true);
    });
  });

  describe("buy", function () {
    it("should buy", async function () {
      const tx1 = await marketplaceInstance.connect(receiver).buy(erc20Instance.address, amount, { value: amount });
      await expect(tx1)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, receiver.address, amount);

      await expect(tx1).to.changeEtherBalance(receiver, -amount);

      const ownerOf = await erc20Instance.balanceOf(receiver.address);
      expect(ownerOf).to.equal(amount);
    });

    it("should fail: price mismatch", async function () {
      const tx1 = marketplaceInstance.connect(receiver).buy(erc20Instance.address, amount, { value: amount / 2 });
      await expect(tx1).to.be.revertedWith("Marketplace: price mismatch");
    });
  });

  describe("updateFactory", function () {
    it("should fail: collection is not enabled", async function () {
      await marketplaceInstance.updateFactory(erc20Instance.address, false);

      const tx1 = marketplaceInstance.connect(receiver).buy(erc20Instance.address, amount, { value: amount });
      await expect(tx1).to.be.revertedWith("Marketplace: collection is not enabled");
    });
  });

  describe("pause", function () {
    it("should fail: paase not admin", async function () {
      const tx = marketplaceInstance.connect(receiver).pause();
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );
    });

    it("should fail: unpause not admin", async function () {
      const tx = marketplaceInstance.connect(receiver).unpause();
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );
    });

    it("should pause/unpause", async function () {
      const tx1 = marketplaceInstance.pause();
      await expect(tx1).to.emit(marketplaceInstance, "Paused").withArgs(owner.address);

      const tx2 = marketplaceInstance.connect(receiver).buy(erc20Instance.address, amount, { value: amount });
      await expect(tx2).to.be.revertedWith("Pausable: paused");

      const tx3 = marketplaceInstance.unpause();
      await expect(tx3).to.emit(marketplaceInstance, "Unpaused").withArgs(owner.address);

      const tx4 = marketplaceInstance.connect(receiver).buy(erc20Instance.address, amount, { value: amount });
      await expect(tx4).to.not.be.reverted;
    });
  });
});
