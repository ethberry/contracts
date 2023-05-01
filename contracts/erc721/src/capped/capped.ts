import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import type { IERC721Options } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldBehaveLikeERC721Capped(factory: () => Promise<Contract>, options: IERC721Options = {}) {
  const { mint = defaultMintERC721, batchSize = 0 } = options;

  describe("cap", function () {
    it("should fail: cap exceeded", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address, batchSize + 0);
      await mint(contractInstance, owner, owner.address, batchSize + 1);

      const cap = await contractInstance.cap();
      expect(cap).to.equal(batchSize + 2);

      const totalSupply = await contractInstance.totalSupply();
      expect(totalSupply).to.equal(batchSize + 2);

      const tx = mint(contractInstance, owner, owner.address, batchSize + 2);
      await expect(tx).to.be.revertedWith(`ERC721Capped: cap exceeded`);
    });
  });
}
