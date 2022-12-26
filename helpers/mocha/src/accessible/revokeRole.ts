import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { DEFAULT_ADMIN_ROLE } from "@gemunion/contracts-constants";

export function shouldRevokeRole(factory: () => Promise<Contract>) {
  describe("shouldRevokeRole", function () {
    it("Should revoke role (has no role)", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx1 = await contractInstance.revokeRole(DEFAULT_ADMIN_ROLE, receiver.address);
      await expect(tx1).to.not.emit(contractInstance, "RoleRevoked");
    });

    it("Should revoke role", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx1 = await contractInstance.grantRole(DEFAULT_ADMIN_ROLE, receiver.address);
      await expect(tx1)
        .to.emit(contractInstance, "RoleGranted")
        .withArgs(DEFAULT_ADMIN_ROLE, receiver.address, owner.address);

      const tx2 = await contractInstance.revokeRole(DEFAULT_ADMIN_ROLE, receiver.address);
      await expect(tx2)
        .to.emit(contractInstance, "RoleRevoked")
        .withArgs(DEFAULT_ADMIN_ROLE, receiver.address, owner.address);
    });

    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx1 = contractInstance.connect(receiver).revokeRole(DEFAULT_ADMIN_ROLE, receiver.address);
      await expect(tx1).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });
  });
}
