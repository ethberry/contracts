import { expect } from "chai";
import { ethers } from "hardhat";

import type { IERC721Options } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";
import { tokenMaxAmount } from "@gemunion/contracts-constants";

export function shouldBehaveLikeERC721Capped(factory: () => Promise<any>, options: IERC721Options = {}) {
  const { mint = defaultMintERC721, batchSize = 0n } = options;

  describe("cap", function () {
    it("should fail: cap exceeded", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, batchSize + 0n);
      await mint(contractInstance, owner, owner, batchSize + 1n);

      const cap = await contractInstance.cap();
      expect(cap).to.equal(batchSize + 2n);

      const totalSupply = await contractInstance.totalSupply();
      expect(totalSupply).to.equal(batchSize + 2n);

      const tx = mint(contractInstance, owner, owner, batchSize + 2n);
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC721ExceededCap")
        .withArgs(batchSize + tokenMaxAmount);
    });
  });
}
