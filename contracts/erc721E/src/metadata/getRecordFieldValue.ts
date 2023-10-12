import { expect } from "chai";
import { ethers } from "hardhat";

import { TEMPLATE_ID } from "@gemunion/contracts-constants";

import { defaultMintERC721, IERC721EnumOptions } from "../shared/defaultMint";

export function shouldGetRecordFieldValue(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n } = options;

  describe("getRecordFieldValue", function () {
    it("should get value", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);

      const value = await contractInstance.getRecordFieldValue(defaultTokenId, TEMPLATE_ID);
      expect(value).to.equal(42);
    });

    it("should get value (empty)", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.getRecordFieldValue(defaultTokenId, TEMPLATE_ID);
      await expect(tx).to.be.revertedWith("GC: field not found");
    });

    it("should get value (deleted)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);
      await contractInstance.deleteRecord(defaultTokenId);
      const tx = contractInstance.getRecordFieldValue(defaultTokenId, TEMPLATE_ID);

      await expect(tx).to.be.revertedWith("GC: field not found");
    });

    it("should get value (deleted by key)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);
      await contractInstance.deleteRecordField(defaultTokenId, TEMPLATE_ID);
      const tx = contractInstance.getRecordFieldValue(defaultTokenId, TEMPLATE_ID);

      await expect(tx).to.be.revertedWith("GC: field not found");
    });
  });
}
