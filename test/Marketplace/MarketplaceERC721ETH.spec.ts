import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ERC721ACB, MarketplaceERC721ETH } from "../../typechain-types";
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

describe("MarketplaceERC721ETH", function () {
  let marketplace: ContractFactory;
  let marketplaceInstance: MarketplaceERC721ETH;
  let erc721: ContractFactory;
  let erc721Instance: ERC721ACB;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721ACB");
    marketplace = await ethers.getContractFactory("MarketplaceERC721ETH");
    [owner, receiver] = await ethers.getSigners();

    erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI)) as ERC721ACB;
    marketplaceInstance = (await marketplace.deploy()) as MarketplaceERC721ETH;

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
      const tx1 = await marketplaceInstance.connect(receiver).buy(erc721Instance.address, tokenId, { value: amount });
      await expect(tx1)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, receiver.address, tokenId);

      await expect(tx1).to.changeEtherBalance(receiver, -amount);

      const ownerOf = await erc721Instance.ownerOf(tokenId);
      expect(ownerOf).to.equal(receiver.address);
    });

    it("should fail: price mismatch", async function () {
      const tx1 = marketplaceInstance.connect(receiver).buy(erc721Instance.address, tokenId, { value: amount / 2 });
      await expect(tx1).to.be.revertedWith("Marketplace: price mismatch");
    });
  });

  describe("updateFactory", function () {
    it("should fail: collection is not enabled", async function () {
      await marketplaceInstance.updateFactory(erc721Instance.address, false);

      const tx1 = marketplaceInstance.connect(receiver).buy(erc721Instance.address, tokenId, { value: amount });
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

      const tx2 = marketplaceInstance.connect(receiver).buy(erc721Instance.address, tokenId, { value: amount });
      await expect(tx2).to.be.revertedWith("Pausable: paused");

      const tx3 = marketplaceInstance.unpause();
      await expect(tx3).to.emit(marketplaceInstance, "Unpaused").withArgs(owner.address);

      const tx4 = marketplaceInstance.connect(receiver).buy(erc721Instance.address, tokenId, { value: amount });
      await expect(tx4).to.not.be.reverted;
    });
  });
});
