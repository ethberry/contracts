import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ERC20ACBCS, ERC721ACB, MarketplaceERC721ERC20 } from "../../typechain-types";
import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  PAUSER_ROLE,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../constants";

describe("MarketplaceERC721ERC20", function () {
  let marketplace: ContractFactory;
  let marketplaceInstance: MarketplaceERC721ERC20;
  let erc20: ContractFactory;
  let erc20Instance: ERC20ACBCS;
  let erc721: ContractFactory;
  let erc721Instance: ERC721ACB;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20ACBCS");
    erc721 = await ethers.getContractFactory("ERC721ACB");
    marketplace = await ethers.getContractFactory("MarketplaceERC721ERC20");
    [owner, receiver] = await ethers.getSigners();

    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol, amount * 10)) as ERC20ACBCS;
    erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI)) as ERC721ACB;
    marketplaceInstance = (await marketplace.deploy(erc20Instance.address)) as MarketplaceERC721ERC20;

    await marketplaceInstance.updateFactory(erc721Instance.address, true);
    await erc721Instance.grantRole(MINTER_ROLE, marketplaceInstance.address);
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
      const tx1 = erc20Instance.mint(receiver.address, amount);
      await expect(tx1)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, receiver.address, amount);

      const tx2 = erc20Instance.connect(receiver).approve(marketplaceInstance.address, amount);
      await expect(tx2)
        .to.emit(erc20Instance, "Approval")
        .withArgs(receiver.address, marketplaceInstance.address, amount);

      const tx3 = await marketplaceInstance.connect(receiver).buy(erc721Instance.address, tokenId);
      await expect(tx3)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, receiver.address, tokenId)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(receiver.address, marketplaceInstance.address, amount);

      const ownerOf = await erc721Instance.ownerOf(tokenId);
      expect(ownerOf).to.equal(receiver.address);

      const balance = await erc20Instance.balanceOf(marketplaceInstance.address);
      expect(balance).to.equal(amount);

      const balance1 = await erc20Instance.balanceOf(owner.address);
      expect(balance1).to.equal(0);
    });

    it("should fail: insufficient allowance", async function () {
      const tx1 = marketplaceInstance.connect(receiver).buy(erc721Instance.address, tokenId);
      await expect(tx1).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("should fail: transfer amount exceeds balance", async function () {
      const tx1 = erc20Instance.connect(receiver).approve(marketplaceInstance.address, amount);
      await expect(tx1)
        .to.emit(erc20Instance, "Approval")
        .withArgs(receiver.address, marketplaceInstance.address, amount);

      const tx2 = marketplaceInstance.connect(receiver).buy(erc721Instance.address, tokenId);
      await expect(tx2).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
  });

  describe("updateFactory", function () {
    it("should fail: collection is not enabled", async function () {
      await marketplaceInstance.updateFactory(erc721Instance.address, false);

      const tx1 = marketplaceInstance.connect(receiver).buy(erc721Instance.address, tokenId);
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
      const tx1 = erc20Instance.mint(receiver.address, amount);
      await expect(tx1)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, receiver.address, amount);

      const tx2 = erc20Instance.connect(receiver).approve(marketplaceInstance.address, amount);
      await expect(tx2)
        .to.emit(erc20Instance, "Approval")
        .withArgs(receiver.address, marketplaceInstance.address, amount);

      const tx3 = marketplaceInstance.pause();
      await expect(tx3).to.emit(marketplaceInstance, "Paused").withArgs(owner.address);

      const tx4 = marketplaceInstance.connect(receiver).buy(erc721Instance.address, tokenId);
      await expect(tx4).to.be.revertedWith("Pausable: paused");

      const tx5 = marketplaceInstance.unpause();
      await expect(tx5).to.emit(marketplaceInstance, "Unpaused").withArgs(owner.address);

      const tx6 = marketplaceInstance.connect(receiver).buy(erc721Instance.address, tokenId);
      await expect(tx6).to.not.be.reverted;
    });
  });
});
