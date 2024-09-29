import { expect } from "chai";
import { ethers } from "hardhat";

import { METADATA_ROLE, RARITY, TEMPLATE_ID } from "@ethberry/contracts-constants";
import { defaultMintERC721, IERC721EnumOptions, TERC721MetadataOptions } from "../shared/defaultMint";

export function shouldSetTokenMetadata(
  factory: () => Promise<any>,
  options: IERC721EnumOptions = {},
  metadata: TERC721MetadataOptions = [],
) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n } = options;

  describe("setTokenMetadata", function () {
    it("should set metadata", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);

      for (const [_i, { key, value }] of metadata.entries()) {
        const recordFieldValue = await contractInstance.getRecordFieldValue(defaultTokenId, key);
        expect(recordFieldValue).to.equal(value);
      }

      const newMetadata = [{ key: TEMPLATE_ID, value: 1337 }];

      const tx = contractInstance.setTokenMetadata(defaultTokenId, newMetadata);

      await expect(tx).to.not.be.reverted;

      for (const [_i, { key, value }] of newMetadata.entries()) {
        const recordFieldValue = await contractInstance.getRecordFieldValue(defaultTokenId, key);
        expect(recordFieldValue).to.equal(value);
      }
    });

    it("should set metadata (combine)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);

      for (const [_i, { key, value }] of metadata.entries()) {
        const recordFieldValue = await contractInstance.getRecordFieldValue(defaultTokenId, key);
        expect(recordFieldValue).to.equal(value);
      }

      const newMetadata = [{ key: RARITY, value: 1337 }];

      const tx = contractInstance.setTokenMetadata(defaultTokenId, newMetadata);
      await expect(tx).to.not.be.reverted;

      for (const [_i, { key, value }] of [...metadata, ...newMetadata].entries()) {
        const recordFieldValue = await contractInstance.getRecordFieldValue(defaultTokenId, key);
        expect(recordFieldValue).to.equal(value);
      }
    });

    it("should fail: AccessControlUnauthorizedAccount", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const newMetadata = [{ key: TEMPLATE_ID, value: 1337 }];

      const tx = contractInstance.connect(receiver).setTokenMetadata(defaultTokenId, newMetadata);

      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "AccessControlUnauthorizedAccount")
        .withArgs(receiver, METADATA_ROLE);
    });
  });
}
