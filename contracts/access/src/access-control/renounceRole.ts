import { expect } from "chai";
import { ethers } from "hardhat";
// import { Contract } from "ethers";
import { id } from "ethers";

import { DEFAULT_TEST_ROLE } from "@ethberry/contracts-constants";

import type { IAccessControlOptions } from "../shared/interfaces";

export function shouldRenounceRole(factory: () => Promise<any>, options: IAccessControlOptions = {}) {
  const { testRole = DEFAULT_TEST_ROLE } = options;

  describe("shouldRenounceRole", function () {
    it("Should revoke role (has no role)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const NON_EXISTING_ROLE = id("NON_EXISTING_ROLE");

      const tx = await contractInstance.renounceRole(NON_EXISTING_ROLE, owner);
      await expect(tx).to.not.emit(contractInstance, "RoleRevoked");
    });

    it("Should renounce role", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx1 = await contractInstance.grantRole(testRole, owner);
      await expect(tx1).to.emit(contractInstance, "RoleGranted").withArgs(testRole, owner, owner);

      const tx2 = await contractInstance.renounceRole(testRole, owner);
      await expect(tx2).to.emit(contractInstance, "RoleRevoked").withArgs(testRole, owner, owner);
    });

    it("should fail: AccessControlBadConfirmation", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.grantRole(testRole, receiver);
      const tx = contractInstance.renounceRole(testRole, receiver);

      await expect(tx).to.be.revertedWithCustomError(contractInstance, "AccessControlBadConfirmation");
    });
  });
}
