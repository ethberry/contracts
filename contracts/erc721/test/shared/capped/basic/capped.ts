import { expect } from "chai";
import { ethers } from "hardhat";

import { deployErc721Base } from "../../fixtures";

export function shouldERC721Capped(name: string) {
  describe("cap", function () {
    it("should fail: cap exceeded", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      await contractInstance.mint(owner.address, 0);
      await contractInstance.mint(owner.address, 1);

      const cap = await contractInstance.cap();
      expect(cap).to.equal(2);

      const totalSupply = await contractInstance.totalSupply();
      expect(totalSupply).to.equal(2);

      const tx = contractInstance.mint(owner.address, 2);
      await expect(tx).to.be.revertedWith(`ERC721Capped: cap exceeded`);
    });
  });
}
