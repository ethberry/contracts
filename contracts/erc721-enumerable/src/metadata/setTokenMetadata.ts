import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, utils } from "ethers";

import { METADATA_ADMIN_ROLE } from "@gemunion/contracts-constants";

export function shouldSetTokenMetadata(factory: () => Promise<Contract>) {
  describe("setTokenMetadata", function () {
    it("should set metadata", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.setTokenMetadata(0, [
        { key: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("GRADE")), value: 1337 },
      ]);

      await expect(tx).to.not.be.reverted;

      const value = await contractInstance.getRecordFieldValue(0, utils.keccak256(utils.toUtf8Bytes("GRADE")));

      expect(value).to.equal(1337);
    });

    it("should set metadata (override)", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.setTokenMetadata(0, [
        { key: utils.keccak256(utils.toUtf8Bytes("GRADE")), value: 1337 },
      ]);
      await expect(tx).to.not.be.reverted;

      const value1 = await contractInstance.getRecordFieldValue(0, utils.keccak256(utils.toUtf8Bytes("GRADE")));
      expect(value1).to.equal(1337);

      const tx1 = contractInstance.setTokenMetadata(0, [
        { key: utils.keccak256(utils.toUtf8Bytes("GRADE")), value: 1338 },
      ]);
      await expect(tx1).to.not.be.reverted;

      const value2 = await contractInstance.getRecordFieldValue(0, utils.keccak256(utils.toUtf8Bytes("GRADE")));
      expect(value2).to.equal(1338);
    });

    it("should set metadata (combine)", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.setTokenMetadata(0, [
        { key: utils.keccak256(utils.toUtf8Bytes("GRADE")), value: 1337 },
      ]);
      await expect(tx).to.not.be.reverted;

      const tx1 = contractInstance.setTokenMetadata(0, [
        { key: utils.keccak256(utils.toUtf8Bytes("RARITY")), value: 1338 },
      ]);
      await expect(tx1).to.not.be.reverted;

      const value1 = await contractInstance.getRecordFieldValue(0, utils.keccak256(utils.toUtf8Bytes("GRADE")));
      expect(value1).to.equal(1337);

      const value2 = await contractInstance.getRecordFieldValue(0, utils.keccak256(utils.toUtf8Bytes("RARITY")));
      expect(value2).to.equal(1338);
    });

    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance
        .connect(receiver)
        .setTokenMetadata(0, [{ key: utils.keccak256(utils.toUtf8Bytes("GRADE")), value: 1337 }]);

      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${METADATA_ADMIN_ROLE}`,
      );
    });
  });
}
