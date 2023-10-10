import { expect } from "chai";
import { ethers } from "hardhat";

import { METADATA_ROLE, TEMPLATE_ID } from "@gemunion/contracts-constants";

import { defaultMintERC721, IERC721EnumOptions } from "../shared/defaultMint";

export function shouldDeleteRecordField(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n } = options;

  describe("deleteRecordField", function () {
    it("should delete field", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const tx = contractInstance.deleteRecordField(defaultTokenId, TEMPLATE_ID);
      await expect(tx).to.not.be.reverted;
    });

    it("should delete field (empty)", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.deleteRecordField(defaultTokenId, TEMPLATE_ID);
      await expect(tx).to.be.revertedWith("GC: field not found");
    });

    it("should delete field (deleted)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      await contractInstance.deleteRecord(defaultTokenId);

      const tx = contractInstance.deleteRecordField(defaultTokenId, TEMPLATE_ID);
      await expect(tx).to.be.revertedWith("GC: field not found");
    });

    it("should fail: AccessControlUnauthorizedAccount", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).deleteRecordField(defaultTokenId, TEMPLATE_ID);
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "AccessControlUnauthorizedAccount")
        .withArgs(receiver.address, METADATA_ROLE);
    });
  });
}
