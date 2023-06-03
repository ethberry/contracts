import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { InterfaceId, PAUSER_ROLE } from "@gemunion/contracts-constants";

export function shouldBehaveLikePausable(factory: () => Promise<any>) {
  describe("pause", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = contractInstance.connect(receiver).pause();
      await expect(tx).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`
          : "Ownable: caller is not the owner",
      );

      const tx2 = contractInstance.connect(receiver).unpause();
      await expect(tx2).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`
          : "Ownable: caller is not the owner",
      );
    });

    it("should pause/unpause", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx1 = contractInstance.pause();
      await expect(tx1).to.emit(contractInstance, "Paused").withArgs(owner.address);

      const tx2 = contractInstance.unpause();
      await expect(tx2).to.emit(contractInstance, "Unpaused").withArgs(owner.address);
    });
  });
}
