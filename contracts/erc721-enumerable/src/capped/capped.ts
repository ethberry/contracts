import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldBehaveLikeERC721Capped(factory: () => Promise<Contract>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721 } = options;

  describe("cap", function () {
    it("should fail: cap exceeded", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      await mint(contractInstance, owner, owner.address);

      const cap = await contractInstance.cap();
      expect(cap).to.equal(2);

      const totalSupply = await contractInstance.totalSupply();
      expect(totalSupply).to.equal(2);

      const tx = contractInstance.mint(owner.address);
      await expect(tx).to.be.revertedWith(`ERC721CappedEnumerable: cap exceeded`);
    });
  });
}
