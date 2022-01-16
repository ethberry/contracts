import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ERC1155GemunionPausableTest } from "../../typechain-types";
import { amount, baseTokenURI, PAUSER_ROLE, tokenId } from "../constants";

describe("ERC1155GemunionPausable", function () {
  let erc1155: ContractFactory;
  let erc1155Instance: ERC1155GemunionPausableTest;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    erc1155 = await ethers.getContractFactory("ERC1155GemunionPausableTest");
    [owner, receiver] = await ethers.getSigners();

    erc1155Instance = (await erc1155.deploy(baseTokenURI)) as ERC1155GemunionPausableTest;
  });

  describe("constructor", function () {
    it("Should set the right roles to deployer", async function () {
      const isPauser = await erc1155Instance.hasRole(PAUSER_ROLE, owner.address);
      expect(isPauser).to.equal(true);
    });
  });

  describe("pause", function () {
    it("should fail: not an owner", async function () {
      const tx = erc1155Instance.connect(receiver).pause();
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );

      const tx2 = erc1155Instance.connect(receiver).unpause();
      await expect(tx2).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );
    });

    it("should pause/unpause", async function () {
      const tx1 = erc1155Instance.mint(owner.address, tokenId, amount, "0x");
      await expect(tx1).to.not.be.reverted;

      const balanceOfOwner1 = await erc1155Instance.balanceOf(owner.address, tokenId);
      expect(balanceOfOwner1).to.equal(amount);

      const tx2 = erc1155Instance.pause();
      await expect(tx2).to.emit(erc1155Instance, "Paused").withArgs(owner.address);

      const tx3 = erc1155Instance.mint(owner.address, tokenId, amount, "0x");
      await expect(tx3).to.be.revertedWith(`ERC1155Pausable: token transfer while paused`);

      const tx4 = erc1155Instance.unpause();
      await expect(tx4).to.emit(erc1155Instance, "Unpaused").withArgs(owner.address);

      const tx5 = erc1155Instance.mint(owner.address, tokenId, amount, "0x");
      await expect(tx5).to.not.be.reverted;

      const balanceOfOwner = await erc1155Instance.balanceOf(owner.address, tokenId);
      expect(balanceOfOwner).to.equal(2 * amount);
    });
  });
});
