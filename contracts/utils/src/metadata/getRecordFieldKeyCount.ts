import { expect } from "chai";

import { TEMPLATE_ID, tokenId } from "@gemunion/contracts-constants";

export function shouldGetRecordFieldKeyCount(factory: () => Promise<any>) {
  describe("getRecordFieldKeyCount", function () {
    it("should get count", async function () {
      const contractInstance = await factory();

      await contractInstance.upsertRecordField(tokenId, TEMPLATE_ID, 1);

      const count = await contractInstance.getRecordFieldKeyCount(tokenId);
      expect(count).to.equal(1);
    });

    it("should fail: RecordNotFound (empty)", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.getRecordFieldKeyCount(tokenId);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "RecordNotFound").withArgs(tokenId);
    });

    it("should fail: RecordNotFound (deleted)", async function () {
      const contractInstance = await factory();

      await contractInstance.upsertRecordField(tokenId, TEMPLATE_ID, 1);
      await contractInstance.deleteRecord(tokenId);

      const tx = contractInstance.getRecordFieldKeyCount(tokenId);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "RecordNotFound").withArgs(tokenId);
    });

    it("should fail: RecordNotFound (deleted by key)", async function () {
      const contractInstance = await factory();

      await contractInstance.upsertRecordField(tokenId, TEMPLATE_ID, 1);
      await contractInstance.deleteRecordField(tokenId, TEMPLATE_ID);

      const count = await contractInstance.getRecordFieldKeyCount(tokenId);
      expect(count).to.equal(0);
    });
  });
}
