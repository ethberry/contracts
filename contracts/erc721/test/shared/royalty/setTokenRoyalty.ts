import { expect } from "chai";
import { ethers } from "hardhat";

import { accessControlInterfaceId, DEFAULT_ADMIN_ROLE } from "@gemunion/contracts-test-constants";

import { deployErc721Base } from "../fixtures";

export function shouldSetTokenRoyalty(name: string) {
  describe("setTokenRoyalty", function () {
    it("should set token royalty", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      const royalty = 5000;

      const tx = contractInstance.setTokenRoyalty(0, receiver.address, royalty);
      await expect(tx).to.emit(contractInstance, "TokenRoyaltyInfo").withArgs(0, receiver.address, royalty);
    });

    it("should fail: royalty fee will exceed salePrice", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      const royalty = 11000;

      const tx = contractInstance.setTokenRoyalty(0, receiver.address, royalty);
      await expect(tx).to.be.revertedWith("ERC2981: royalty fee will exceed salePrice");
    });

    it("should fail: invalid parameters", async function () {
      const { contractInstance } = await deployErc721Base(name);

      const royalty = 5000;

      const tx = contractInstance.setTokenRoyalty(0, ethers.constants.AddressZero, royalty);
      await expect(tx).to.be.revertedWith("ERC2981: Invalid parameters");
    });

    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      const royalty = 5000;

      const supportsAccessControl = await contractInstance.supportsInterface(accessControlInterfaceId);

      const tx = contractInstance.connect(receiver).setTokenRoyalty(0, receiver.address, royalty);
      await expect(tx).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`
          : "Ownable: caller is not the owner",
      );
    });
  });
}
