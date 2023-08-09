import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_TEST_ROLE, DEFAULT_ADMIN_ROLE } from "@gemunion/contracts-constants";
import { IAccessControlOptions } from "../shared/interfaces";

export function shouldGrantRole(factory: () => Promise<any>, options: IAccessControlOptions = {}) {
  const { testRole = DEFAULT_TEST_ROLE, adminRole = DEFAULT_ADMIN_ROLE } = options;

  describe("grantRole", function () {
    it("Should grant role", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = await contractInstance.grantRole(testRole, receiver.address);
      await expect(tx).to.emit(contractInstance, "RoleGranted").withArgs(testRole, receiver.address, owner.address);
    });

    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).grantRole(testRole, receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${adminRole}`,
      );
    });
  });
}
