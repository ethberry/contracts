import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { DEFAULT_ADMIN_ROLE, InterfaceId } from "@gemunion/contracts-constants";

import type { IERC721Options } from "../shared/defaultMint";

export function shouldSetTokenRoyalty(factory: () => Promise<any>, options: IERC721Options = {}) {
  const { adminRole = DEFAULT_ADMIN_ROLE, tokenId: defaultTokenId = 0n } = options;

  describe("setTokenRoyalty", function () {
    it("should set token royalty", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const royalty = 5000;

      const tx = contractInstance.setTokenRoyalty(defaultTokenId, receiver, royalty);
      await expect(tx).to.emit(contractInstance, "TokenRoyaltyInfo").withArgs(defaultTokenId, receiver, royalty);
    });

    it("should fail: royalty fee will exceed salePrice", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const royalty = 11000;

      const tx = contractInstance.setTokenRoyalty(defaultTokenId, receiver, royalty);
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC2981InvalidTokenRoyalty")
        .withArgs(defaultTokenId, 11000, 10000);
    });

    it("should fail: ERC2981InvalidTokenRoyaltyReceiver", async function () {
      const contractInstance = await factory();

      const royalty = 5000;

      const tx = contractInstance.setTokenRoyalty(defaultTokenId, ZeroAddress, royalty);
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC2981InvalidTokenRoyaltyReceiver")
        .withArgs(defaultTokenId, ZeroAddress);
    });

    it("should fail: AccessControlUnauthorizedAccount/OwnableUnauthorizedAccount", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const royalty = 5000;

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = contractInstance.connect(receiver).setTokenRoyalty(defaultTokenId, receiver, royalty);
      if (supportsAccessControl) {
        await expect(tx)
          .to.be.revertedWithCustomError(contractInstance, "AccessControlUnauthorizedAccount")
          .withArgs(receiver, adminRole);
      } else {
        // Ownable
        await expect(tx)
          .to.be.revertedWithCustomError(contractInstance, "OwnableUnauthorizedAccount")
          .withArgs(receiver);
      }
    });
  });
}
