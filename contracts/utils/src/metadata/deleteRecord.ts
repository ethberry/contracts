import { expect } from "chai";

import { TEMPLATE_ID, tokenId } from "@gemunion/contracts-constants";

export function shouldDeleteRecord(factory: () => Promise<any>) {
  describe("deleteRecord", function () {
    it("should delete record", async function () {
      const contractInstance = await factory();

      await contractInstance.upsertRecordField(tokenId, TEMPLATE_ID, 1);

      const tx = contractInstance.deleteRecord(tokenId);
      await expect(tx).to.not.be.reverted;
    });

    it("should fail: RecordNotFound (empty)", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.deleteRecord(0);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "RecordNotFound").withArgs(0);
    });
  });
}
