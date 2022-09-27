import { expect } from "chai";
import { ethers } from "hardhat";
import { deployErc721Base } from "../../fixtures";

export function shouldGetOwnerOf(name: string) {
  describe("ownerOf", function () {
    it("should get owner of token", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      await contractInstance.mint(owner.address);
      const ownerOfToken = await contractInstance.ownerOf(0);
      expect(ownerOfToken).to.equal(owner.address);
    });

    it("should get owner of burned token", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      await contractInstance.mint(owner.address);
      const tx = contractInstance.burn(0);
      await expect(tx).to.not.be.reverted;

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const tx2 = contractInstance.ownerOf(0);
      await expect(tx2).to.be.revertedWith(`ERC721: invalid token ID`);
    });
  });
}
