import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, DEFAULT_TEST_ROLE } from "@ethberry/contracts-constants";

import type { IAccessControlOptions } from "../shared/interfaces";

export function shouldGrantRole(factory: () => Promise<any>, options: IAccessControlOptions = {}) {
  const { testRole = DEFAULT_TEST_ROLE, adminRole = DEFAULT_ADMIN_ROLE } = options;

  describe("grantRole", function () {
    it("Should grant role", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = await contractInstance.grantRole(testRole, receiver);
      await expect(tx).to.emit(contractInstance, "RoleGranted").withArgs(testRole, receiver, owner);
    });

    it("should fail: AccessControlUnauthorizedAccount", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).grantRole(testRole, receiver);

      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "AccessControlUnauthorizedAccount")
        .withArgs(receiver, adminRole);
    });
  });
}
