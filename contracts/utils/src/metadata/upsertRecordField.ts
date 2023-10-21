import { expect } from "chai";

import { TEMPLATE_ID, tokenId } from "@gemunion/contracts-constants";

export function shouldUpsertRecordField(factory: () => Promise<any>) {
  describe("upsertRecordField", function () {
    it("should upsert", async function () {
      const contractInstance = await factory();
      await contractInstance.upsertRecordField(tokenId, TEMPLATE_ID, 1);

      const count = await contractInstance.getRecordFieldValue(tokenId, TEMPLATE_ID);
      expect(count).to.equal(1);
    });
  });
}
