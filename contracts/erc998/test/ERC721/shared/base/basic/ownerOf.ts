import { expect } from "chai";
import { ethers } from "hardhat";

import { tokenId } from "../../../../constants";
import { deployErc998Base } from "../../fixtures";

export function shouldGetOwnerOf(name: string) {
  describe("ownerOf", function () {
    it("should get owner of token", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc998Base(name);

      await contractInstance.mint(owner.address, tokenId);
      const ownerOfToken = await contractInstance.ownerOf(tokenId);
      expect(ownerOfToken).to.equal(owner.address);
    });

    it("should get owner of burned token", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc998Base(name);

      await contractInstance.mint(owner.address, tokenId);
      const tx = contractInstance.burn(tokenId);
      await expect(tx).to.not.be.reverted;

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const tx2 = contractInstance.ownerOf(tokenId);
      await expect(tx2).to.be.revertedWith(`ERC721: invalid token ID`);
    });
  });
}
