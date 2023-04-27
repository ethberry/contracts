import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { royalty, tokenId } from "@gemunion/contracts-constants";
import { TMintERC721Fn } from "../shared/interfaces/IMintERC721Fn";
import { defaultMintERC721 } from "../shared/defaultMintERC721";

export function shouldBurn(
  factory: () => Promise<Contract>,
  mint: TMintERC721Fn = defaultMintERC721,
  options: Record<string, any> = {},
) {
  describe("burn", function () {
    it("should reset token royalty info", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address, options.batchSize + tokenId);

      await contractInstance.setTokenRoyalty(options.batchSize + tokenId, owner.address, royalty * 2);
      const [receiver, amount] = await contractInstance.royaltyInfo(options.batchSize + tokenId, 1e6);
      expect(receiver).to.equal(owner.address);
      expect(amount).to.equal(20000);

      const tx = await contractInstance.burn(options.batchSize + tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, constants.AddressZero, options.batchSize + tokenId);

      const [receiver2, amount2] = await contractInstance.royaltyInfo(options.batchSize + tokenId, 1e6);
      expect(receiver2).to.equal(owner.address);
      expect(amount2).to.equal(10000);
    });
  });
}
