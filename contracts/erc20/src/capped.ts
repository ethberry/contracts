import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount } from "@gemunion/contracts-constants";
import { IERC20Options, defaultMintERC20 } from "./shared/defaultMint";

export function shouldBehaveLikeERC20Capped(factory: () => Promise<Contract>, options: IERC20Options = {}) {
  const { mint = defaultMintERC20 } = options;
  describe("mint", function () {
    it("should fail: cap exceeded", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = mint(contractInstance, owner, owner.address, amount + 1);
      await expect(tx).to.be.revertedWith("ERC20Capped: cap exceeded");
    });
  });
}
