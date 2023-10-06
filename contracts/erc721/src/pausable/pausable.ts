import { expect } from "chai";
import { ethers } from "hardhat";

import { tokenId } from "@gemunion/contracts-constants";
import { shouldBehaveLikePausable } from "@gemunion/contracts-utils";

import type { IERC721Options } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldBehaveLikeERC721Pausable(factory: () => Promise<any>, options: IERC721Options = {}) {
  const { mint = defaultMintERC721, pauserRole } = options;

  describe("pause", function () {
    shouldBehaveLikePausable(factory, { pauserRole });

    it("should pause/unpause", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx1 = mint(contractInstance, owner, owner.address, 0n);
      await expect(tx1).to.not.be.reverted;

      const balanceOfOwner1 = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner1).to.equal(1);

      const tx2 = contractInstance.pause();
      await expect(tx2).to.emit(contractInstance, "Paused").withArgs(owner.address);

      const tx3 = contractInstance.mint(owner.address, tokenId);
      await expect(tx3).to.be.revertedWithCustomError(contractInstance, "EnforcedPause");

      const tx4 = contractInstance.unpause();
      await expect(tx4).to.emit(contractInstance, "Unpaused").withArgs(owner.address);

      const tx5 = mint(contractInstance, owner, owner.address, 2n);
      await expect(tx5).to.not.be.reverted;

      const tx6 = contractInstance.unpause();
      await expect(tx6).to.be.revertedWithCustomError(contractInstance, "ExpectedPause");

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(2);
    });
  });
}
