import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE } from "../../../constants";
import { deployErc1155Base } from "../fixtures";

export function shouldGrantRole(name: string) {
  describe("grantRole", function () {
    it("Should grant role", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      const tx = await contractInstance.grantRole(DEFAULT_ADMIN_ROLE, receiver.address);
      await expect(tx)
        .to.emit(contractInstance, "RoleGranted")
        .withArgs(DEFAULT_ADMIN_ROLE, receiver.address, owner.address);
    });

    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      const tx = contractInstance.connect(receiver).grantRole(DEFAULT_ADMIN_ROLE, receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });
  });
}
