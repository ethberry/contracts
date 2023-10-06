import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, tokenId } from "@gemunion/contracts-constants";
import { shouldBehaveLikePausable } from "@gemunion/contracts-utils";

export function shouldBehaveLikeERC1155Pausable(factory: () => Promise<any>) {
  shouldBehaveLikePausable(factory);

  describe("pause", function () {
    it("should pause/unpause", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx1 = contractInstance.mint(owner.address, tokenId, amount, "0x");
      await expect(tx1).to.not.be.reverted;

      const balanceOfOwner1 = await contractInstance.balanceOf(owner.address, tokenId);
      expect(balanceOfOwner1).to.equal(amount);

      const tx2 = contractInstance.pause();
      await expect(tx2).to.emit(contractInstance, "Paused").withArgs(owner.address);

      const tx3 = contractInstance.mint(owner.address, tokenId, amount, "0x");
      await expect(tx3).to.be.revertedWithCustomError(contractInstance, "EnforcedPause");

      const tx4 = contractInstance.unpause();
      await expect(tx4).to.emit(contractInstance, "Unpaused").withArgs(owner.address);

      const tx5 = contractInstance.mint(owner.address, tokenId, amount, "0x");
      await expect(tx5).to.not.be.reverted;

      const tx6 = contractInstance.unpause();
      await expect(tx6).to.be.revertedWithCustomError(contractInstance, "ExpectedPause");

      const balanceOfOwner = await contractInstance.balanceOf(owner.address, tokenId);
      expect(balanceOfOwner).to.equal(amount * 2n);
    });
  });
}
