import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { TMintERC721EnumFn } from "../shared/interfaces/IMintERC721Fn";
import { defaultMintERC721Enum } from "../shared/defaultMintERC721";

export function shouldBehaveLikeERC721Capped(
  factory: () => Promise<Contract>,
  mint: TMintERC721EnumFn = defaultMintERC721Enum,
) {
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
