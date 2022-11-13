import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE } from "@gemunion/contracts-test-constants";

import { deployAccessList } from "../fixtures";

export function shouldRenounceRole(name: string) {
  describe("shouldRenounceRole", function () {
    it("Should revoke role (has no role)", async function () {
      const NON_EXISTING_ROLE = ethers.utils.id("NON_EXISTING_ROLE");

      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployAccessList(name);

      const tx1 = await contractInstance.renounceRole(NON_EXISTING_ROLE, owner.address);
      await expect(tx1).to.not.emit(contractInstance, "RoleRevoked");
    });

    it("Should renounce role", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployAccessList(name);

      const tx1 = await contractInstance.renounceRole(DEFAULT_ADMIN_ROLE, owner.address);
      await expect(tx1)
        .to.emit(contractInstance, "RoleRevoked")
        .withArgs(DEFAULT_ADMIN_ROLE, owner.address, owner.address);
    });

    it("should fail: wrong account", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployAccessList(name);

      const tx1 = contractInstance.renounceRole(DEFAULT_ADMIN_ROLE, receiver.address);
      await expect(tx1).to.be.revertedWith("AccessControl: can only renounce roles for self");
    });
  });
}
