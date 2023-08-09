import { expect } from "chai";
import { ethers } from "hardhat";
// import { Contract } from "ethers";
import { id } from "ethers";

import { DEFAULT_TEST_ROLE } from "@gemunion/contracts-constants";
import { IAccessControlOptions } from "../shared/interfaces";

export function shouldRenounceRole(factory: () => Promise<any>, options: IAccessControlOptions = {}) {
  const { testRole = DEFAULT_TEST_ROLE } = options;

  describe("shouldRenounceRole", function () {
    it("Should revoke role (has no role)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const NON_EXISTING_ROLE = id("NON_EXISTING_ROLE");

      const tx = await contractInstance.renounceRole(NON_EXISTING_ROLE, owner.address);
      await expect(tx).to.not.emit(contractInstance, "RoleRevoked");
    });

    it("Should renounce role", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx1 = await contractInstance.grantRole(testRole, owner.address);
      await expect(tx1).to.emit(contractInstance, "RoleGranted").withArgs(testRole, owner.address, owner.address);

      const tx2 = await contractInstance.renounceRole(testRole, owner.address);
      await expect(tx2).to.emit(contractInstance, "RoleRevoked").withArgs(testRole, owner.address, owner.address);
    });

    it("should fail: wrong account", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.grantRole(testRole, receiver.address);
      const tx = contractInstance.renounceRole(testRole, receiver.address);
      await expect(tx).to.be.revertedWith("AccessControl: can only renounce roles for self");
    });
  });
}
