import { expect } from "chai";

import { TEMPLATE_ID, tokenId } from "@gemunion/contracts-constants";

export function shouldGetRecordFieldValue(factory: () => Promise<any>) {
  describe("getRecordFieldValue", function () {
    it("should get value", async function () {
      const contractInstance = await factory();

      await contractInstance.upsertRecordField(tokenId, TEMPLATE_ID, 1);

      const value = await contractInstance.getRecordFieldValue(tokenId, TEMPLATE_ID);
      expect(value).to.equal(1);
    });

    it("should fail: FieldNotFound (empty)", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.getRecordFieldValue(tokenId, TEMPLATE_ID);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "FieldNotFound").withArgs(tokenId, TEMPLATE_ID);
    });

    it("should fail: FieldNotFound (deleted)", async function () {
      const contractInstance = await factory();

      await contractInstance.upsertRecordField(tokenId, TEMPLATE_ID, 1);
      await contractInstance.deleteRecord(tokenId);
      const tx = contractInstance.getRecordFieldValue(tokenId, TEMPLATE_ID);

      await expect(tx).to.be.revertedWithCustomError(contractInstance, "FieldNotFound").withArgs(tokenId, TEMPLATE_ID);
    });

    it("should fail: FieldNotFound (deleted by key)", async function () {
      const contractInstance = await factory();

      await contractInstance.upsertRecordField(tokenId, TEMPLATE_ID, 1);
      await contractInstance.deleteRecordField(tokenId, TEMPLATE_ID);
      const tx = contractInstance.getRecordFieldValue(tokenId, TEMPLATE_ID);

      await expect(tx).to.be.revertedWithCustomError(contractInstance, "FieldNotFound").withArgs(tokenId, TEMPLATE_ID);
    });
  });
}
