import { expect } from "chai";

import { TEMPLATE_ID, tokenId } from "@ethberry/contracts-constants";

export function shouldGetRecordCount(factory: () => Promise<any>) {
  describe("getRecordCount", function () {
    it("should get count", async function () {
      const contractInstance = await factory();
      await contractInstance.upsertRecordField(tokenId, TEMPLATE_ID, 1);

      const count = await contractInstance.getRecordCount();
      expect(count).to.equal(1);
    });

    it("should get count (empty)", async function () {
      const contractInstance = await factory();

      const count = await contractInstance.getRecordCount();
      expect(count).to.equal(0);
    });

    it("should get count (deleted)", async function () {
      const contractInstance = await factory();

      await contractInstance.upsertRecordField(tokenId, TEMPLATE_ID, 1);
      await contractInstance.deleteRecord(tokenId);

      const count = await contractInstance.getRecordCount();
      expect(count).to.equal(0);
    });

    it("should get count (deleted by key)", async function () {
      const contractInstance = await factory();

      await contractInstance.upsertRecordField(tokenId, TEMPLATE_ID, 1);
      await contractInstance.deleteRecordField(tokenId, TEMPLATE_ID);

      const count = await contractInstance.getRecordCount();
      expect(count).to.equal(1);
    });
  });
}
