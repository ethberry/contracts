import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { tokenId } from "@gemunion/contracts-constants";

export function shouldGetOwnerOf(factory: () => Promise<Contract>, options: Record<string, any> = {}) {
  describe("ownerOf", function () {
    it("should get owner of token", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, options.initialBalance + tokenId);
      const ownerOfToken = await contractInstance.ownerOf(options.initialBalance + tokenId);
      expect(ownerOfToken).to.equal(owner.address);
    });

    it("should get owner of burned token", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, options.initialBalance + tokenId);
      const tx = contractInstance.burn(options.initialBalance + tokenId);
      await expect(tx).to.not.be.reverted;

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(options.initialBalance);

      const tx2 = contractInstance.ownerOf(options.initialBalance + tokenId);
      await expect(tx2).to.be.revertedWith(`ERC721: invalid token ID`);
    });
  });
}
