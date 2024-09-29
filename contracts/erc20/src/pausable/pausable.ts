import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, PAUSER_ROLE } from "@ethberry/contracts-constants";
import { defaultMintERC20, IERC20Options } from "../shared/defaultMint";
import { shouldBehaveLikePausable } from "@ethberry/contracts-utils";

export function shouldBehaveLikeERC20Pausable(factory: () => Promise<any>, options: IERC20Options = {}) {
  const { mint = defaultMintERC20, pauserRole = PAUSER_ROLE } = options;
  describe("pause", function () {
    shouldBehaveLikePausable(factory, { pauserRole });

    it("should pause/unpause", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx1 = await mint(contractInstance, owner, owner);
      await expect(tx1).to.not.be.reverted;

      const tx2 = contractInstance.pause();
      await expect(tx2).to.emit(contractInstance, "Paused").withArgs(owner);

      const tx3 = contractInstance.transfer(receiver, amount);
      await expect(tx3).to.be.revertedWithCustomError(contractInstance, "EnforcedPause");

      const tx4 = contractInstance.unpause();
      await expect(tx4).to.emit(contractInstance, "Unpaused").withArgs(owner);

      const tx5 = contractInstance.transfer(receiver, amount);
      await expect(tx5).to.not.be.reverted;

      const tx6 = contractInstance.unpause();
      await expect(tx6).to.be.revertedWithCustomError(contractInstance, "ExpectedPause");

      const balanceOfOwner = await contractInstance.balanceOf(owner);
      expect(balanceOfOwner).to.equal(0);
    });
  });
}
