import { expect } from "chai";
import { ethers } from "hardhat";
// import { Contract } from "ethers";

import { DEFAULT_ADMIN_ROLE } from "@gemunion/contracts-constants";

export function shouldGrantRole(factory: () => Promise<any>) {
  describe("grantRole", function () {
    it("Should grant role", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = await contractInstance.grantRole(DEFAULT_ADMIN_ROLE, receiver.address);
      await expect(tx)
        .to.emit(contractInstance, "RoleGranted")
        .withArgs(DEFAULT_ADMIN_ROLE, receiver.address, owner.address);
    });

    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).grantRole(DEFAULT_ADMIN_ROLE, receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });
  });
}
