import { expect } from "chai";

import { TEMPLATE_ID, tokenId } from "@gemunion/contracts-constants";

export function shouldIsRecord(factory: () => Promise<any>) {
  describe("isRecord", function () {
    it("should check record", async function () {
      const contractInstance = await factory();

      await contractInstance.upsertRecordField(tokenId, TEMPLATE_ID, 1);

      const isIndeed = await contractInstance.isRecord(tokenId);
      expect(isIndeed).to.equal(true);
    });

    it("should check record (empty)", async function () {
      const contractInstance = await factory();

      const isIndeed = await contractInstance.isRecord(tokenId);
      expect(isIndeed).to.equal(false);
    });

    it("should check record (deleted)", async function () {
      const contractInstance = await factory();

      await contractInstance.upsertRecordField(tokenId, TEMPLATE_ID, 1);
      await contractInstance.deleteRecord(tokenId);

      const isIndeed = await contractInstance.isRecord(tokenId);
      expect(isIndeed).to.equal(false);
    });

    it("should check record (deleted by key)", async function () {
      const contractInstance = await factory();

      await contractInstance.upsertRecordField(tokenId, TEMPLATE_ID, 1);
      await contractInstance.deleteRecordField(tokenId, TEMPLATE_ID);

      const isIndeed = await contractInstance.isRecord(tokenId);
      expect(isIndeed).to.equal(true);
    });
  });
}
