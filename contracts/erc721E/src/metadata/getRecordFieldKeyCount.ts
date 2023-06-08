import { expect } from "chai";
import { keccak256, toUtf8Bytes } from "ethers";

export function shouldGetRecordFieldKeyCount(factory: () => Promise<any>) {
  describe("getRecordFieldKeyCount", function () {
    it("should get count", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: keccak256(toUtf8Bytes("GRADE")), value: 1337 }]);

      const count = await contractInstance.getRecordFieldKeyCount(0);

      expect(count).to.equal(1);
    });

    it("should get count (deleted)", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: keccak256(toUtf8Bytes("GRADE")), value: 1337 }]);
      await contractInstance.deleteRecord(0);

      const tx = contractInstance.getRecordFieldKeyCount(0);

      await expect(tx).to.be.revertedWith("GC: record not found");
    });

    it("should get count (deleted by key)", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: keccak256(toUtf8Bytes("GRADE")), value: 1337 }]);
      await contractInstance.deleteRecordField(0, keccak256(toUtf8Bytes("GRADE")));

      const count = await contractInstance.getRecordFieldKeyCount(0);

      expect(count).to.equal(0);
    });

    it("should get count (never set)", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.getRecordFieldKeyCount(0);

      await expect(tx).to.be.revertedWith("GC: record not found");
    });
  });
}
