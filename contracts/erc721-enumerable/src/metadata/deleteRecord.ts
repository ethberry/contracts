import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, utils } from "ethers";

import { METADATA_ROLE } from "@gemunion/contracts-constants";

export function shouldDeleteRecord(factory: () => Promise<Contract>) {
  describe("deleteRecord", function () {
    it("should delete record", async function () {
      const contractInstance = await factory();

      await contractInstance.setTokenMetadata(0, [{ key: utils.keccak256(utils.toUtf8Bytes("GRADE")), value: 1337 }]);

      const tx = contractInstance.deleteRecord(0);
      await expect(tx).to.not.be.reverted;
    });

    it("should delete record (empty)", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.deleteRecord(0);
      await expect(tx).to.be.revertedWith("GC: record not found");
    });

    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).deleteRecord(0);

      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${METADATA_ROLE}`,
      );
    });
  });
}
