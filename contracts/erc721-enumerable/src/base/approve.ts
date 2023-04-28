import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldApprove(factory: () => Promise<Contract>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721 } = options;

  describe("approve", function () {
    it("should fail: not an owner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      // ? suppose to be tokenId instead of 0
      const tx = contractInstance.connect(receiver).approve(owner.address, 0);
      await expect(tx).to.be.revertedWith("ERC721: approval to current owner");
    });

    it("should fail: approve to self", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      const tx = contractInstance.approve(owner.address, 0);
      await expect(tx).to.be.revertedWith("ERC721: approval to current owner");
    });

    it("should approve", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const tx = contractInstance.approve(receiver.address, 0);
      await expect(tx).to.emit(contractInstance, "Approval").withArgs(owner.address, receiver.address, 0);

      const approved = await contractInstance.getApproved(0);
      expect(approved).to.equal(receiver.address);

      const tx1 = contractInstance.connect(receiver).burn(0);
      await expect(tx1).to.emit(contractInstance, "Transfer").withArgs(owner.address, constants.AddressZero, 0);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });
}
