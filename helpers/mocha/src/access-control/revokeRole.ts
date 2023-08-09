import { expect } from "chai";
import { ethers } from "hardhat";
// import { Contract } from "ethers";

import { DEFAULT_ADMIN_ROLE, DEFAULT_TEST_ROLE } from "@gemunion/contracts-constants";
import { IAccessControlOptions } from "../shared/interfaces";

export function shouldRevokeRole(factory: () => Promise<any>, options: IAccessControlOptions = {}) {
  const { testRole = DEFAULT_TEST_ROLE, adminRole = DEFAULT_ADMIN_ROLE } = options;

  describe("shouldRevokeRole", function () {
    it("Should revoke role (has no role)", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = await contractInstance.revokeRole(testRole, receiver.address);
      await expect(tx).to.not.emit(contractInstance, "RoleRevoked");
    });

    it("Should revoke role", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx1 = await contractInstance.grantRole(testRole, receiver.address);
      await expect(tx1).to.emit(contractInstance, "RoleGranted").withArgs(testRole, receiver.address, owner.address);

      const tx2 = await contractInstance.revokeRole(testRole, receiver.address);
      await expect(tx2).to.emit(contractInstance, "RoleRevoked").withArgs(testRole, receiver.address, owner.address);
    });

    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).revokeRole(testRole, receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${adminRole}`,
      );
    });
  });
}
