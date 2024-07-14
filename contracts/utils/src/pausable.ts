import { expect } from "chai";
import { ethers } from "hardhat";

import { InterfaceId, PAUSER_ROLE } from "@gemunion/contracts-constants";

export interface IPauseOptions {
  pauserRole?: string;
}

export function shouldBehaveLikePausable(factory: () => Promise<any>, options: IPauseOptions = {}) {
  const { pauserRole = PAUSER_ROLE } = options;

  describe("pause", function () {
    it("should pause/unpause", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx1 = contractInstance.pause();
      await expect(tx1).to.emit(contractInstance, "Paused").withArgs(owner);

      const tx2 = contractInstance.unpause();
      await expect(tx2).to.emit(contractInstance, "Unpaused").withArgs(owner);
    });

    it("should fail: AccessControlUnauthorizedAccount/OwnableUnauthorizedAccount", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = contractInstance.connect(receiver).pause();
      if (supportsAccessControl) {
        await expect(tx)
          .to.be.revertedWithCustomError(contractInstance, "AccessControlUnauthorizedAccount")
          .withArgs(receiver, pauserRole);
      } else {
        // Ownable
        await expect(tx)
          .to.be.revertedWithCustomError(contractInstance, "OwnableUnauthorizedAccount")
          .withArgs(receiver);
      }

      const tx2 = contractInstance.connect(receiver).unpause();
      if (supportsAccessControl) {
        await expect(tx2)
          .to.be.revertedWithCustomError(contractInstance, "AccessControlUnauthorizedAccount")
          .withArgs(receiver, pauserRole);
      } else {
        // Ownable
        await expect(tx2)
          .to.be.revertedWithCustomError(contractInstance, "OwnableUnauthorizedAccount")
          .withArgs(receiver);
      }
    });
  });
}
