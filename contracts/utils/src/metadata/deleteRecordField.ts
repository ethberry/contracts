import { expect } from "chai";

import { TEMPLATE_ID, tokenId } from "@ethberry/contracts-constants";

export function shouldDeleteRecordField(factory: () => Promise<any>) {
  describe("deleteRecordField", function () {
    it("should delete field", async function () {
      const contractInstance = await factory();

      await contractInstance.upsertRecordField(tokenId, TEMPLATE_ID, 1);

      const tx = contractInstance.deleteRecordField(tokenId, TEMPLATE_ID);
      await expect(tx).to.not.be.reverted;
    });

    it("should fail: FieldNotFound (empty)", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.deleteRecordField(tokenId, TEMPLATE_ID);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "FieldNotFound").withArgs(tokenId, TEMPLATE_ID);
    });

    it("should fail: FieldNotFound (deleted)", async function () {
      const contractInstance = await factory();

      await contractInstance.upsertRecordField(tokenId, TEMPLATE_ID, 1);

      await contractInstance.deleteRecord(tokenId);

      const tx = contractInstance.deleteRecordField(tokenId, TEMPLATE_ID);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "FieldNotFound").withArgs(tokenId, TEMPLATE_ID);
    });
  });
}
