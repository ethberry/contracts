import { expect } from "chai";
import { ethers } from "hardhat";
// import { Contract } from "ethers";

import { DEFAULT_ADMIN_ROLE } from "@gemunion/contracts-constants";

export function shouldGetRoleMember(factory: () => Promise<any>) {
  describe("getRoleMember", function () {
    it("Should grant role", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const count = await contractInstance.getRoleMemberCount(DEFAULT_ADMIN_ROLE);
      expect(count).to.equal(1);

      const member = await contractInstance.getRoleMember(DEFAULT_ADMIN_ROLE, 0);
      expect(member).to.equal(owner.address);
    });

    it("should fail: account is missing role", async function () {
      const contractInstance = await factory();

      const count = await contractInstance.getRoleMemberCount(DEFAULT_ADMIN_ROLE);
      expect(count).to.equal(1);

      const tx = contractInstance.getRoleMember(DEFAULT_ADMIN_ROLE, 1);
      await expect(tx).to.be.revertedWithPanic(0x32);
    });
  });
}
