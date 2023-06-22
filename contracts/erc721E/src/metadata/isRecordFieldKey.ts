import { expect } from "chai";
import { ethers } from "hardhat";

import { TEMPLATE_ID } from "@gemunion/contracts-constants";

import { defaultMintERC721, IERC721EnumOptions } from "../shared/defaultMint";

export function shouldIsRecordFieldKey(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n } = options;

  describe("isRecordFieldKey", function () {
    it("should check record field", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const isIndeed = await contractInstance.isRecordFieldKey(defaultTokenId, TEMPLATE_ID);
      expect(isIndeed).to.equal(true);
    });

    it("should check record (empty)", async function () {
      const contractInstance = await factory();

      const isIndeed = await contractInstance.isRecordFieldKey(defaultTokenId, TEMPLATE_ID);
      expect(isIndeed).to.equal(false);
    });

    it("should check record (deleted)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.deleteRecord(0);

      const isIndeed = await contractInstance.isRecordFieldKey(defaultTokenId, TEMPLATE_ID);
      expect(isIndeed).to.equal(false);
    });

    it("should check record (deleted by key)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.deleteRecordField(0, TEMPLATE_ID);

      const isIndeed = await contractInstance.isRecordFieldKey(defaultTokenId, TEMPLATE_ID);
      expect(isIndeed).to.equal(false);
    });
  });
}
