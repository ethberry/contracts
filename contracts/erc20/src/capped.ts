import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "@ethberry/contracts-constants";
import { defaultMintERC20, IERC20Options } from "./shared/defaultMint";

export function shouldBehaveLikeERC20Capped(factory: () => Promise<any>, options: IERC20Options = {}) {
  const { mint = defaultMintERC20 } = options;
  describe("mint", function () {
    it("should fail: cap exceeded", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = mint(contractInstance, owner, owner, amount + 1n);
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC20ExceededCap")
        .withArgs(amount + 1n, amount);
    });
  });
}
