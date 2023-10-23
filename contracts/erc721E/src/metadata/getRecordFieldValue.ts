import { expect } from "chai";
import { ethers } from "hardhat";

import { defaultMintERC721, IERC721EnumOptions, TERC721MetadataOptions } from "../shared/defaultMint";

export function shouldGetRecordFieldValue(
  factory: () => Promise<any>,
  options: IERC721EnumOptions = {},
  metadata: TERC721MetadataOptions = [],
) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n } = options;

  describe("getRecordFieldValue", function () {
    it("should get value", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);

      for (const [_i, { key, value }] of metadata.entries()) {
        const recordFieldValue = await contractInstance.getRecordFieldValue(defaultTokenId, key);
        expect(recordFieldValue).to.equal(value);
      }
    });

    it("should fail: FieldNotFound (empty)", async function () {
      const contractInstance = await factory();

      for (const [_i, { key }] of metadata.entries()) {
        const tx = contractInstance.getRecordFieldValue(defaultTokenId, key);
        await expect(tx).to.be.revertedWithCustomError(contractInstance, "FieldNotFound").withArgs(defaultTokenId, key);
      }
    });
  });
}
