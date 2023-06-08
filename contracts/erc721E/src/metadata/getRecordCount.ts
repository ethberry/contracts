import { expect } from "chai";
import { keccak256, toUtf8Bytes } from "ethers";

export function shouldGetRecordCount(factory: () => Promise<any>) {
  describe("getRecordCount", function () {
    it("should get count", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: keccak256(toUtf8Bytes("GRADE")), value: 1337 }]);

      const count = await contractInstance.getRecordCount();

      expect(count).to.equal(1);
    });

    it("should get count (deleted)", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: keccak256(toUtf8Bytes("GRADE")), value: 1337 }]);
      await contractInstance.deleteRecord(0);

      const count = await contractInstance.getRecordCount();

      expect(count).to.equal(0);
    });

    it("should get count (deleted by key)", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: keccak256(toUtf8Bytes("GRADE")), value: 1337 }]);
      await contractInstance.deleteRecordField(0, keccak256(toUtf8Bytes("GRADE")));

      const count = await contractInstance.getRecordCount();

      expect(count).to.equal(1);
    });

    it("should get count (never set)", async function () {
      const contractInstance = await factory();

      const count = await contractInstance.getRecordCount();

      expect(count).to.equal(0);
    });
  });
}
