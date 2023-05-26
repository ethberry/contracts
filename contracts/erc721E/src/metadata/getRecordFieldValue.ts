import { expect } from "chai";
import { Contract, utils } from "ethers";

export function shouldGetRecordFieldValue(factory: () => Promise<Contract>) {
  describe("getRecordFieldValue", function () {
    it("should get value", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: utils.keccak256(utils.toUtf8Bytes("GRADE")), value: 1337 }]);
      const value = await contractInstance.getRecordFieldValue(0, utils.keccak256(utils.toUtf8Bytes("GRADE")));

      expect(value).to.equal(1337);
    });

    it("should get value (empty)", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.getRecordFieldValue(0, utils.keccak256(utils.toUtf8Bytes("GRADE")));

      await expect(tx).to.be.revertedWith("GC: field not found");
    });

    it("should get value (deleted)", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: utils.keccak256(utils.toUtf8Bytes("GRADE")), value: 1337 }]);
      await contractInstance.deleteRecord(0);
      const tx = contractInstance.getRecordFieldValue(0, utils.keccak256(utils.toUtf8Bytes("GRADE")));

      await expect(tx).to.be.revertedWith("GC: field not found");
    });

    it("should get value (deleted by key)", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: utils.keccak256(utils.toUtf8Bytes("GRADE")), value: 1337 }]);
      await contractInstance.deleteRecordField(0, utils.keccak256(utils.toUtf8Bytes("GRADE")));
      const tx = contractInstance.getRecordFieldValue(0, utils.keccak256(utils.toUtf8Bytes("GRADE")));

      await expect(tx).to.be.revertedWith("GC: field not found");
    });
  });
}
