import { expect } from "chai";
import { Contract, utils } from "ethers";

export function shouldGetTokenMetadata(factory: () => Promise<Contract>) {
  describe("getTokenMetadata", function () {
    it("should get metadata", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: utils.keccak256(utils.toUtf8Bytes("GRADE")), value: 1337 }]);
      await contractInstance.setTokenMetadata(0, [{ key: utils.keccak256(utils.toUtf8Bytes("RARITY")), value: 1338 }]);

      const metadata = await contractInstance.getTokenMetadata(0);

      expect(metadata.length).to.equal(2);
      expect(metadata[0].key).to.equal(utils.keccak256(utils.toUtf8Bytes("GRADE")));
      expect(metadata[0].value).to.equal(1337);
      expect(metadata[1].key).to.equal(utils.keccak256(utils.toUtf8Bytes("RARITY")));
      expect(metadata[1].value).to.equal(1338);
    });

    it("should get metadata (empty)", async function () {
      const contractInstance = await factory();

      const metadata = await contractInstance.getTokenMetadata(0);

      expect(metadata.length).to.equal(0);
    });

    it("should get metadata (deleted)", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: utils.keccak256(utils.toUtf8Bytes("GRADE")), value: 1337 }]);

      await contractInstance.deleteRecord(0);

      const metadata = await contractInstance.getTokenMetadata(0);

      expect(metadata.length).to.equal(0);
    });

    it("should get metadata (deleted by key)", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: utils.keccak256(utils.toUtf8Bytes("GRADE")), value: 1337 }]);

      await contractInstance.deleteRecordField(0, utils.keccak256(utils.toUtf8Bytes("GRADE")));

      const metadata = await contractInstance.getTokenMetadata(0);

      expect(metadata.length).to.equal(0);
    });
  });
}
