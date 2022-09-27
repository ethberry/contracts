import { expect } from "chai";
import { ethers } from "hardhat";
import { utils } from "ethers";

import { deployErc721Base } from "../fixtures";
import { DEFAULT_ADMIN_ROLE } from "../../../constants";

export function shouldRenounceRole(name: string) {
  describe("shouldRenounceRole", function () {
    it("Should revoke role (has no role)", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      const NON_EXISTING_ROLE = utils.id("NON_EXISTING_ROLE");

      const tx1 = await contractInstance.renounceRole(NON_EXISTING_ROLE, owner.address);
      await expect(tx1).to.not.emit(contractInstance, "RoleRevoked");
    });

    it("Should renounce role", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      const tx1 = await contractInstance.renounceRole(DEFAULT_ADMIN_ROLE, owner.address);
      await expect(tx1)
        .to.emit(contractInstance, "RoleRevoked")
        .withArgs(DEFAULT_ADMIN_ROLE, owner.address, owner.address);
    });

    it("should fail: wrong account", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      const tx1 = contractInstance.renounceRole(DEFAULT_ADMIN_ROLE, receiver.address);
      await expect(tx1).to.be.revertedWith("AccessControl: can only renounce roles for self");
    });
  });
}
