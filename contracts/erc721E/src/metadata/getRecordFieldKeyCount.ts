import { expect } from "chai";
import { ethers } from "hardhat";

import { TEMPLATE_ID } from "@gemunion/contracts-constants";

import { defaultMintERC721, IERC721EnumOptions } from "../shared/defaultMint";

export function shouldGetRecordFieldKeyCount(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n } = options;

  describe("getRecordFieldKeyCount", function () {
    it("should get count", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const count = await contractInstance.getRecordFieldKeyCount(defaultTokenId);
      expect(count).to.equal(1);
    });

    it("should get count (deleted)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.deleteRecord(defaultTokenId);

      const tx = contractInstance.getRecordFieldKeyCount(defaultTokenId);
      await expect(tx).to.be.revertedWith("GC: record not found");
    });

    it("should get count (deleted by key)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.deleteRecordField(defaultTokenId, TEMPLATE_ID);

      const count = await contractInstance.getRecordFieldKeyCount(defaultTokenId);
      expect(count).to.equal(0);
    });

    it("should get count (never set)", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.getRecordFieldKeyCount(0);
      await expect(tx).to.be.revertedWith("GC: record not found");
    });
  });
}
