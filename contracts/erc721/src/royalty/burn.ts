import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { royalty, tokenId } from "@gemunion/contracts-constants";

import type { IERC721Options } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldBurn(factory: () => Promise<any>, options: IERC721Options = {}) {
  const { mint = defaultMintERC721, batchSize = 0 } = options;

  describe("burn", function () {
    it("should reset token royalty info", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address, batchSize + tokenId);

      await contractInstance.setTokenRoyalty(batchSize + tokenId, owner.address, royalty * 2);
      const [receiver, amount] = await contractInstance.royaltyInfo(batchSize + tokenId, 1e6);
      expect(receiver).to.equal(owner.address);
      expect(amount).to.equal(20000);

      const tx = await contractInstance.burn(batchSize + tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, ZeroAddress, batchSize + tokenId);

      const [receiver2, amount2] = await contractInstance.royaltyInfo(batchSize + tokenId, 1e6);
      expect(receiver2).to.equal(owner.address);
      expect(amount2).to.equal(10000);
    });
  });
}
