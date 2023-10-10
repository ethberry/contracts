import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { DEFAULT_ADMIN_ROLE, InterfaceId } from "@gemunion/contracts-constants";

import type { IERC1155Options } from "../shared/defaultMint";

export function shouldSetDefaultRoyalty(factory: () => Promise<any>, options: IERC1155Options = {}) {
  const { adminRole = DEFAULT_ADMIN_ROLE } = options;

  describe("setDefaultRoyalty", function () {
    it("should set token royalty", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const royalty = 5000;

      const tx = contractInstance.setDefaultRoyalty(receiver.address, royalty);
      await expect(tx).to.emit(contractInstance, "DefaultRoyaltyInfo").withArgs(receiver.address, royalty);
    });

    it("should fail: ERC2981InvalidDefaultRoyalty", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const royalty = 11000;

      const tx = contractInstance.setDefaultRoyalty(receiver.address, royalty * royalty);
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC2981InvalidDefaultRoyalty")
        .withArgs(121000000, 10000);
    });

    it("should fail: ERC2981InvalidDefaultRoyaltyReceiver (ZeroAddress)", async function () {
      const contractInstance = await factory();

      const royalty = 5000;

      const tx = contractInstance.setDefaultRoyalty(ZeroAddress, royalty);
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC2981InvalidDefaultRoyaltyReceiver")
        .withArgs(ZeroAddress);
    });

    it("should fail: AccessControlUnauthorizedAccount/OwnableUnauthorizedAccount", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const royalty = 5000;

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = contractInstance.connect(receiver).setDefaultRoyalty(receiver.address, royalty);
      if (supportsAccessControl) {
        await expect(tx)
          .to.be.revertedWithCustomError(contractInstance, "AccessControlUnauthorizedAccount")
          .withArgs(receiver.address, adminRole);
      } else {
        // Ownable
        await expect(tx)
          .to.be.revertedWithCustomError(contractInstance, "OwnableUnauthorizedAccount")
          .withArgs(receiver.address);
      }
    });
  });
}
