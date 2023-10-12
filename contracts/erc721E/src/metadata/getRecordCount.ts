import { expect } from "chai";
import { ethers } from "hardhat";

import { TEMPLATE_ID } from "@gemunion/contracts-constants";

import { defaultMintERC721, IERC721EnumOptions } from "../shared/defaultMint";

export function shouldGetRecordCount(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n } = options;

  describe("getRecordCount", function () {
    it("should get count", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);

      const count = await contractInstance.getRecordCount();
      expect(count).to.equal(1);
    });

    it("should get count (deleted)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);
      await contractInstance.deleteRecord(defaultTokenId);

      const count = await contractInstance.getRecordCount();
      expect(count).to.equal(0);
    });

    it("should get count (deleted by key)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);
      await contractInstance.deleteRecordField(defaultTokenId, TEMPLATE_ID);

      const count = await contractInstance.getRecordCount();
      expect(count).to.equal(1);
    });

    it("should get count (never set)", async function () {
      const contractInstance = await factory();

      const count = await contractInstance.getRecordCount();
      expect(count).to.equal(0);
    });
  });
}
