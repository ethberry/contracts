import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ERC721GemunionPausableTest } from "../../typechain-types";
import { baseTokenURI, PAUSER_ROLE, tokenName, tokenSymbol } from "../constants";

describe("ERC721Gemunion", function () {
  let erc721: ContractFactory;
  let erc721Instance: ERC721GemunionPausableTest;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721GemunionPausableTest");
    [owner, receiver] = await ethers.getSigners();

    erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI)) as ERC721GemunionPausableTest;
  });

  describe("constructor", function () {
    it("Should set the right roles to deployer", async function () {
      const isPauser = await erc721Instance.hasRole(PAUSER_ROLE, owner.address);
      expect(isPauser).to.equal(true);
    });
  });

  describe("pause", function () {
    it("should fail: not an owner", async function () {
      const tx = erc721Instance.connect(receiver).pause();
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );

      const tx2 = erc721Instance.connect(receiver).unpause();
      await expect(tx2).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );
    });

    it("should pause/unpause", async function () {
      const tx1 = erc721Instance.mint(owner.address);
      await expect(tx1).to.not.be.reverted;

      const balanceOfOwner1 = await erc721Instance.balanceOf(owner.address);
      expect(balanceOfOwner1).to.equal(1);

      const tx2 = erc721Instance.pause();
      await expect(tx2).to.emit(erc721Instance, "Paused").withArgs(owner.address);

      const tx3 = erc721Instance.mint(owner.address);
      await expect(tx3).to.be.revertedWith(`ERC721Pausable: token transfer while paused`);

      const tx4 = erc721Instance.unpause();
      await expect(tx4).to.emit(erc721Instance, "Unpaused").withArgs(owner.address);

      const tx5 = erc721Instance.mint(owner.address);
      await expect(tx5).to.not.be.reverted;

      const balanceOfOwner = await erc721Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(2);
    });
  });
});
