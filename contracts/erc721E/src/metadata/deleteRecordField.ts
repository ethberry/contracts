import { expect } from "chai";
import { ethers } from "hardhat";
import { keccak256, toUtf8Bytes } from "ethers";

import { METADATA_ROLE } from "@gemunion/contracts-constants";

export function shouldDeleteRecordField(factory: () => Promise<any>) {
  describe("deleteRecordField", function () {
    it("should delete field", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: keccak256(toUtf8Bytes("GRADE")), value: 1337 }]);

      const tx = contractInstance.deleteRecordField(0, keccak256(toUtf8Bytes("GRADE")));
      await expect(tx).to.not.be.reverted;
    });

    it("should delete field (empty)", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.deleteRecordField(0, keccak256(toUtf8Bytes("GRADE")));
      await expect(tx).to.be.revertedWith("GC: field not found");
    });

    it("should delete field (deleted)", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: keccak256(toUtf8Bytes("GRADE")), value: 1337 }]);
      await contractInstance.deleteRecord(0);

      const tx = contractInstance.deleteRecordField(0, keccak256(toUtf8Bytes("GRADE")));
      await expect(tx).to.be.revertedWith("GC: field not found");
    });

    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).deleteRecordField(0, keccak256(toUtf8Bytes("GRADE")));

      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${METADATA_ROLE}`,
      );
    });
  });
}
