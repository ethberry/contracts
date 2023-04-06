import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { DEFAULT_ADMIN_ROLE, InterfaceId } from "@gemunion/contracts-constants";

export function shouldSetTokenRoyalty(factory: () => Promise<Contract>) {
  describe("setTokenRoyalty", function () {
    it("should set token royalty", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const royalty = 5000;

      const tx = contractInstance.setTokenRoyalty(0, receiver.address, royalty);
      await expect(tx).to.emit(contractInstance, "TokenRoyaltyInfo").withArgs(0, receiver.address, royalty);
    });

    it("should fail: royalty fee will exceed salePrice", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const royalty = 11000;

      const tx = contractInstance.setTokenRoyalty(0, receiver.address, royalty);
      await expect(tx).to.be.revertedWith("ERC2981: royalty fee will exceed salePrice");
    });

    it("should fail: invalid parameters", async function () {
      const contractInstance = await factory();

      const royalty = 5000;

      const tx = contractInstance.setTokenRoyalty(0, constants.AddressZero, royalty);
      await expect(tx).to.be.revertedWith("ERC2981: Invalid parameters");
    });

    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const royalty = 5000;

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = contractInstance.connect(receiver).setTokenRoyalty(0, receiver.address, royalty);
      await expect(tx).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`
          : "Ownable: caller is not the owner",
      );
    });
  });
}
