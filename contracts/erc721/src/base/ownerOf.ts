import { expect } from "chai";
import { ethers } from "hardhat";

import { tokenId } from "@gemunion/contracts-constants";

import type { IERC721Options } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldGetOwnerOf(factory: () => Promise<any>, options: IERC721Options = {}) {
  const { mint = defaultMintERC721, batchSize = 0n } = options;

  describe("ownerOf", function () {
    it("should get owner of token", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      const ownerOfToken = await contractInstance.ownerOf(batchSize + tokenId);
      expect(ownerOfToken).to.equal(owner);
    });

    it("should get owner of burned token", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      const tx = contractInstance.burn(batchSize + tokenId);
      await expect(tx).to.not.be.reverted;

      const balanceOfOwner = await contractInstance.balanceOf(owner);
      expect(balanceOfOwner).to.equal(batchSize);

      const tx2 = contractInstance.ownerOf(batchSize + tokenId);
      await expect(tx2)
        .to.be.revertedWithCustomError(contractInstance, "ERC721NonexistentToken")
        .withArgs(batchSize + tokenId);
    });
  });
}
