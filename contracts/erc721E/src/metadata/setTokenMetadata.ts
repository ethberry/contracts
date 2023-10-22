import { expect } from "chai";
import { ethers } from "hardhat";

import { METADATA_ROLE, RARITY, TEMPLATE_ID } from "@gemunion/contracts-constants";
import { defaultMintERC721, IERC721EnumOptions, IERC721MetadataOptions } from "../shared/defaultMint";
import { templateId } from "../contants";

export function shouldSetTokenMetadata(
  factory: () => Promise<any>,
  options: IERC721EnumOptions = {},
  metadata: IERC721MetadataOptions = {},
) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n } = options;
  const { templateId: defaultTemplateId = templateId } = metadata;

  describe("setTokenMetadata", function () {
    it("should set metadata", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);
      const value1 = await contractInstance.getRecordFieldValue(defaultTokenId, TEMPLATE_ID);
      expect(value1).to.equal(defaultTemplateId);

      const tx = contractInstance.setTokenMetadata(defaultTokenId, [{ key: TEMPLATE_ID, value: 1337 }]);

      await expect(tx).to.not.be.reverted;

      const value2 = await contractInstance.getRecordFieldValue(defaultTokenId, TEMPLATE_ID);
      expect(value2).to.equal(1337);
    });

    it("should set metadata (combine)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);
      const value1 = await contractInstance.getRecordFieldValue(defaultTokenId, TEMPLATE_ID);
      expect(value1).to.equal(defaultTemplateId);

      const tx = contractInstance.setTokenMetadata(defaultTokenId, [{ key: RARITY, value: 1337 }]);
      await expect(tx).to.not.be.reverted;

      const value2 = await contractInstance.getRecordFieldValue(defaultTokenId, RARITY);
      expect(value2).to.equal(1337);
    });

    it("should fail: AccessControlUnauthorizedAccount", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance
        .connect(receiver)
        .setTokenMetadata(defaultTokenId, [{ key: TEMPLATE_ID, value: 1337 }]);

      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "AccessControlUnauthorizedAccount")
        .withArgs(receiver.address, METADATA_ROLE);
    });
  });
}
