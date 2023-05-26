import { expect } from "chai";
import { Contract, utils } from "ethers";

export function shouldIsRecordFieldKey(factory: () => Promise<Contract>) {
  describe("isRecordFieldKey", function () {
    it("should check record field", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: utils.keccak256(utils.toUtf8Bytes("GRADE")), value: 1337 }]);

      const isIndeed = await contractInstance.isRecordFieldKey(0, utils.keccak256(utils.toUtf8Bytes("GRADE")));

      expect(isIndeed).to.equal(true);
    });

    it("should check record (empty)", async function () {
      const contractInstance = await factory();

      const isIndeed = await contractInstance.isRecordFieldKey(0, utils.keccak256(utils.toUtf8Bytes("GRADE")));

      expect(isIndeed).to.equal(false);
    });

    it("should check record (deleted)", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: utils.keccak256(utils.toUtf8Bytes("GRADE")), value: 1337 }]);
      await contractInstance.deleteRecord(0);

      const isIndeed = await contractInstance.isRecordFieldKey(0, utils.keccak256(utils.toUtf8Bytes("GRADE")));

      expect(isIndeed).to.equal(false);
    });

    it("should check record (deleted by key)", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: utils.keccak256(utils.toUtf8Bytes("GRADE")), value: 1337 }]);
      await contractInstance.deleteRecordField(0, utils.keccak256(utils.toUtf8Bytes("GRADE")));

      const isIndeed = await contractInstance.isRecordFieldKey(0, utils.keccak256(utils.toUtf8Bytes("GRADE")));

      expect(isIndeed).to.equal(false);
    });
  });
}
