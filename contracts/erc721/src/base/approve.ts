import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { tokenId } from "@gemunion/contracts-constants";

export function shouldApprove(factory: () => Promise<Contract>, options: Record<string, any> = {}) {
  describe("approve", function () {
    it("should fail: not an owner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, options.initialBalance + tokenId);
      const tx = contractInstance.connect(receiver).approve(owner.address, options.initialBalance + tokenId);
      await expect(tx).to.be.revertedWith("ERC721: approval to current owner");
    });

    it("should fail: approve to self", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, options.initialBalance + tokenId);
      const tx = contractInstance.approve(owner.address, options.initialBalance + tokenId);
      await expect(tx).to.be.revertedWith("ERC721: approval to current owner");
    });

    it("should approve", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, options.initialBalance + tokenId);

      const tx = contractInstance.approve(receiver.address, options.initialBalance + tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Approval")
        .withArgs(owner.address, receiver.address, options.initialBalance + tokenId);

      const approved = await contractInstance.getApproved(options.initialBalance + tokenId);
      expect(approved).to.equal(receiver.address);

      const tx1 = contractInstance.connect(receiver).burn(options.initialBalance + tokenId);
      await expect(tx1)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, ethers.constants.AddressZero, options.initialBalance + tokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(options.initialBalance);
    });
  });
}
